import {useEffect,useRef,useState} from 'react';
import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {equatorialVector,OBLIQUITY,type AstronomyMode} from './astronomyMath';
import {BODY_RADII_KM,KM_PER_UNIT,horizontalDirection,sampledOrbit,type BodyName,type Site,type Vec3,type physicalSnapshot,type skySnapshot} from './ephemeris';
import sky from './star-knowledge.json';
export type SceneAction='overview'|'north'|'side'|'Sun'|'Earth'|'Moon'|'selected'|'east'|'south'|'west'|'zoomIn'|'zoomOut';
export type SceneCommand={serial:number;action:SceneAction};
type Props={mode:AstronomyMode;physical:ReturnType<typeof physicalSnapshot>;sky:ReturnType<typeof skySnapshot>|null;site:Site;surface:boolean;selected:string;group:number;command:SceneCommand;fov:number;onFov:(fov:number)=>void;showDayStars:boolean};
const vertex=`#include <common>
#include <logdepthbuf_pars_vertex>
varying vec3 wp;varying vec3 wn;void main(){vec4 w=modelMatrix*vec4(position,1.0);wp=w.xyz;wn=normalize(mat3(modelMatrix)*normal);gl_Position=projectionMatrix*viewMatrix*w;
#include <logdepthbuf_vertex>
}`;
// Finite Sun illumination: analytic angular disc overlap with the other body.
const fragment=`#include <logdepthbuf_pars_fragment>
precision highp float;varying vec3 wp;varying vec3 wn;uniform vec3 tint;uniform vec3 sun;uniform float sunRadius;uniform vec3 blocker;uniform float blockerRadius;
float overlap(float a,float b,float d){if(d>=a+b)return 0.;if(d<=abs(a-b))return min(a*a,b*b)/(a*a);float aa=acos(clamp((d*d+a*a-b*b)/(2.*d*a),-1.,1.));float bb=acos(clamp((d*d+b*b-a*a)/(2.*d*b),-1.,1.));return clamp((a*a*aa+b*b*bb-.5*sqrt(max(0.,(-d+a+b)*(d+a-b)*(d-a+b)*(d+a+b))))/(3.14159265*a*a),0.,1.);}
void main(){
#include <logdepthbuf_fragment>
vec3 s=sun-wp;vec3 o=blocker-wp;float ds=length(s),db=length(o);float visible=1.;if(blockerRadius>0.&&db<ds&&db>blockerRadius){float a=asin(clamp(sunRadius/ds,0.,1.));float b=asin(clamp(blockerRadius/db,0.,1.));float d=acos(clamp(dot(normalize(s),normalize(o)),-1.,1.));visible=1.-overlap(a,b,d);}float diffuse=max(0.,dot(normalize(wn),normalize(s)));gl_FragColor=vec4(tint*(.025+.975*diffuse*visible),1.);}`;
export default function AstronomyScene(props:Props){
 const host=useRef<HTMLDivElement>(null),update=useRef<(p:Props)=>void>(()=>{}),latest=useRef(props),[failed,setFailed]=useState(false);latest.current=props;
 useEffect(()=>{
  const el=host.current!;let renderer:THREE.WebGLRenderer;
  try{renderer=new THREE.WebGLRenderer({antialias:true,logarithmicDepthBuffer:true});}catch{setFailed(true);return;}
  setFailed(false);renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.setClearColor('#071521');el.appendChild(renderer.domElement);
  const canvas=renderer.domElement;canvas.tabIndex=0;canvas.setAttribute('role','img');canvas.setAttribute('aria-label','三维观测窗口：拖动转向，滚轮缩放；地面视角可用方向键转动、加减键缩放');
  const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(props.fov,1,.00001,2000000),controls=new OrbitControls(camera,canvas);controls.enableDamping=true;controls.enablePan=true;controls.maxDistance=1000000;
  const ground=props.mode==='stars'&&props.surface;controls.enabled=!ground;const textures:THREE.Texture[]=[];
  const labels:THREE.Sprite[]=[];let frame=0,disposed=false,lastCommand=-1,lastSelected='',lastOrbit=-Infinity,focus:BodyName|'overview'='overview',lastFocus=new THREE.Vector3(),yaw=0,pitch=25;
  const vec=(v:Vec3)=>new THREE.Vector3(...v);
  function sphere(radius:number,material:THREE.Material){const m=new THREE.Mesh(new THREE.SphereGeometry(radius,48,32),material);scene.add(m);return m;}
  function line(points:Vec3[],color:number,opacity=.6,segments=false){const g=new THREE.BufferGeometry().setFromPoints(points.map(vec)),m=new THREE.LineBasicMaterial({color,transparent:true,opacity});const l=segments?new THREE.LineSegments(g,m):new THREE.Line(g,m);scene.add(l);return l;}
  function label(text:string,color='#c9dce5'){const cv=document.createElement('canvas');cv.width=Math.max(192,text.length*48+24);cv.height=80;const c=cv.getContext('2d')!;c.font='43px sans-serif';c.textAlign='center';c.textBaseline='middle';c.fillStyle=color;c.fillText(text,cv.width/2,40);const tx=new THREE.CanvasTexture(cv);textures.push(tx);const s=new THREE.Sprite(new THREE.SpriteMaterial({map:tx,depthTest:false,transparent:true}));s.userData.aspect=cv.width/cv.height;s.userData.size=.04;scene.add(s);labels.push(s);return s;}
  function replace(l:THREE.Line,points:Vec3[]){l.geometry.dispose();l.geometry=new THREE.BufferGeometry().setFromPoints(points.map(vec));}
  function aim(az:number,alt:number){yaw=az;pitch=Math.max(-85,Math.min(85,alt));camera.up.set(0,1,0);camera.lookAt(vec(horizontalDirection(yaw,pitch)));}
  function setFov(n:number){latest.current.onFov(Math.min(100,Math.max(2,n)));}
  let down=false,px=0,py=0,pinchDistance=0;
  const pointers=new Map<number,{x:number;y:number}>();
  function pointerDown(e:PointerEvent){if(!ground)return;canvas.setPointerCapture(e.pointerId);pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});if(pointers.size===1){down=true;px=e.clientX;py=e.clientY;}else if(pointers.size===2){const [a,b]=[...pointers.values()];pinchDistance=Math.hypot(a.x-b.x,a.y-b.y);down=false;}}
  function pointerMove(e:PointerEvent){if(!ground||!pointers.has(e.pointerId))return;pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});if(pointers.size===2){const [a,b]=[...pointers.values()],distance=Math.hypot(a.x-b.x,a.y-b.y);if(pinchDistance>0)setFov(camera.fov*pinchDistance/distance);pinchDistance=distance;}else if(down){aim(yaw-(e.clientX-px)*camera.fov/el.clientHeight,pitch+(e.clientY-py)*camera.fov/el.clientHeight);px=e.clientX;py=e.clientY;}}
  function pointerUp(e:PointerEvent){pointers.delete(e.pointerId);down=false;pinchDistance=0;}
  function wheel(e:WheelEvent){if(!ground)return;e.preventDefault();setFov(camera.fov*Math.exp(e.deltaY*.001));}
  function key(e:KeyboardEvent){if(!ground)return;const actions:Record<string,()=>void>={ArrowLeft:()=>aim(yaw-5,pitch),ArrowRight:()=>aim(yaw+5,pitch),ArrowUp:()=>aim(yaw,pitch+5),ArrowDown:()=>aim(yaw,pitch-5),'+':()=>setFov(camera.fov*.8),'=':()=>setFov(camera.fov*.8),'-':()=>setFov(camera.fov/.8)};if(actions[e.key]){e.preventDefault();actions[e.key]();}}
  canvas.addEventListener('pointerdown',pointerDown);canvas.addEventListener('pointermove',pointerMove);canvas.addEventListener('pointerup',pointerUp);canvas.addEventListener('pointercancel',pointerUp);canvas.addEventListener('wheel',wheel,{passive:false});canvas.addEventListener('keydown',key);
  let change:(p:Props)=>void=()=>{},command:(p:Props)=>void=()=>{};
  if(props.mode==='stars'){
   const shell=sphere(100,new THREE.MeshBasicMaterial({color:0x3c6c7a,wireframe:true,transparent:true,opacity:.035}));shell.visible=!ground;
   const equator=line([],0x57d8c3,.35),ecliptic=line([],0xf2be74,.5);
   if(!ground){replace(equator,Array.from({length:181},(_,i)=>equatorialVector(i/180*24,0,100)));replace(ecliptic,Array.from({length:181},(_,i)=>{const a=i*Math.PI/90;return [100*Math.cos(a),100*Math.sin(a)*Math.sin(OBLIQUITY*Math.PI/180),-100*Math.sin(a)*Math.cos(OBLIQUITY*Math.PI/180)] as Vec3}));}
   if(ground){const floor=new THREE.Mesh(new THREE.CircleGeometry(200,96),new THREE.MeshBasicMaterial({color:0x1b2922,side:THREE.DoubleSide}));floor.rotation.x=-Math.PI/2;floor.position.y=-.1;scene.add(floor);line(Array.from({length:181},(_,i)=>horizontalDirection(i*2,0)),0x648a76);[[0,'北 N'],[90,'东 E'],[180,'南 S'],[270,'西 W']].forEach(([a,t])=>{const s=label(String(t),'#a9cdb8');s.position.set(...horizontalDirection(Number(a),3));});}
   const mansionGroups=sky.mansions.map(m=>{const group=new THREE.Group();scene.add(group);const color=new THREE.Color(sky.groups[m.group].color),paths=m.lines.map(()=>{const l=line([],color.getHex(),.55,true);group.add(l);return l;}),dots=[...new Set(m.lines.flat())].map(hip=>{const s=sky.stars.find(s=>s.hip===hip)!,dot=sphere(.17,new THREE.MeshBasicMaterial({color}));dot.userData.hip=hip;dot.scale.setScalar(Math.max(.65,1.6-s.mag*.15));group.add(dot);return dot;}),tag=label(m.name+'宿',sky.groups[m.group].color);group.add(tag);return {m,group,paths,dots,tag};});
   const sun=sphere(1,new THREE.MeshBasicMaterial({color:0xffe8a7})),moon=sphere(1,new THREE.ShaderMaterial({vertexShader:vertex,fragmentShader:fragment,uniforms:{tint:{value:new THREE.Color('#ccc9bb')},sun:{value:new THREE.Vector3()},sunRadius:{value:5000},blocker:{value:new THREE.Vector3()},blockerRadius:{value:0}}}));sun.visible=moon.visible=ground;
   change=p=>{
    const map=new Map(p.sky?.stars.map(s=>[s.hip,s])),sunInfo=p.sky?.bodies.find(b=>b.name==='Sun'),day=Boolean(sunInfo&&sunInfo.altitude>0),starsVisible=!ground||!day||p.showDayStars;
    renderer.setClearColor(ground&&day?'#416b88':'#071521');
    for(const {m,group,paths,dots,tag} of mansionGroups){group.visible=(p.group===-1||p.group===m.group)&&starsVisible;const position=(hip:number):Vec3=>ground?map.get(hip)!.direction:equatorialVector(sky.stars.find(s=>s.hip===hip)!.ra,sky.stars.find(s=>s.hip===hip)!.dec,100);
     for(const dot of dots){const hip=dot.userData.hip;dot.position.set(...position(hip));dot.visible=!ground||map.get(hip)!.altitude>=0;}
     m.lines.forEach((path,i)=>{const pairs:Vec3[]=[];for(let j=1;j<path.length;j++){const a=vec(position(path[j-1])),b=vec(position(path[j]));if(ground&&a.y<0&&b.y<0)continue;if(ground&&a.y*b.y<0){const cross=a.clone().lerp(b,-a.y/(b.y-a.y));if(a.y<0)a.copy(cross);else b.copy(cross);}pairs.push(a.toArray(),b.toArray());}replace(paths[i],pairs);(paths[i].material as THREE.LineBasicMaterial).opacity=p.selected===m.name?.95:.5;});
     const first=m.lines[0][0];tag.position.set(...position(first));tag.position.multiplyScalar(1.015);tag.visible=!ground||map.get(first)!.altitude>1;
    }
    if(ground&&p.sky){for(const b of p.sky.bodies){const mesh=b.name==='Sun'?sun:moon,r=b.name==='Sun'?102:100;mesh.position.set(...horizontalDirection(b.azimuth,b.altitude,r));mesh.scale.setScalar(r*Math.sin(b.angularRadius*Math.PI/180));mesh.visible=b.altitude+b.angularRadius>0;}if(sunInfo){const u=(moon.material as THREE.ShaderMaterial).uniforms;u.sun.value.copy(vec(sunInfo.direction).multiplyScalar(10000));u.sunRadius.value=1e6*Math.sin(sunInfo.angularRadius*Math.PI/180);}}
    if(ground&&lastSelected!==p.selected){const m=sky.mansions.find(m=>m.name===p.selected)!,s=map.get(m.lines[0][0])!;aim(s.azimuth,Math.max(5,s.altitude));}lastSelected=p.selected;
   };
   command=p=>{if(ground){const s=p.sky!.stars.find(s=>s.hip===sky.mansions.find(m=>m.name===p.selected)!.lines[0][0])!;if(p.command.action==='selected')aim(s.azimuth,Math.max(5,s.altitude));else if(p.command.action==='zoomIn')setFov(p.fov*.7);else if(p.command.action==='zoomOut')setFov(p.fov/.7);else aim(({east:90,south:180,west:270} as Record<string,number>)[p.command.action]??0,p.command.action==='north'?70:25);return;}
    const a=p.command.action;if(a==='zoomIn'||a==='zoomOut'){camera.position.multiplyScalar(a==='zoomIn'?.7:1/.7);return;}controls.target.set(0,0,0);if(a==='selected'){const s=sky.stars.find(s=>s.hip===sky.mansions.find(m=>m.name===p.selected)!.lines[0][0])!;camera.position.set(...equatorialVector(s.ra,s.dec,285));}else camera.position.set(...(a==='north'?[0,300,.001]:a==='side'?[0,5,300]:[190,160,230]) as Vec3);controls.minDistance=105;controls.maxDistance=1000;controls.update();};
   camera.position.set(0,0,0);if(ground)aim(0,25);
  }else{
   const meshes={} as Record<BodyName,THREE.Mesh>,tags={} as Record<BodyName,THREE.Sprite>;
   for(const body of ['Sun','Earth','Moon'] as const){const material=body==='Sun'?new THREE.MeshBasicMaterial({color:0xffd47b}):new THREE.ShaderMaterial({vertexShader:vertex,fragmentShader:fragment,uniforms:{tint:{value:new THREE.Color(body==='Earth'?'#3990b5':'#c2c0b7')},sun:{value:new THREE.Vector3()},sunRadius:{value:BODY_RADII_KM.Sun/KM_PER_UNIT},blocker:{value:new THREE.Vector3()},blockerRadius:{value:BODY_RADII_KM[body==='Earth'?'Moon':'Earth']/KM_PER_UNIT}}});const m=sphere(1,material);m.scale.setScalar(BODY_RADII_KM[body]/KM_PER_UNIT);meshes[body]=m;tags[body]=label(({Sun:'太阳',Earth:'地球',Moon:'月球'})[body]);}
   for(let lat=-60;lat<=60;lat+=30){const a=lat*Math.PI/180,l=line(Array.from({length:97},(_,i)=>[1.002*Math.cos(a)*Math.cos(i*Math.PI/48),1.002*Math.sin(a),1.002*Math.cos(a)*Math.sin(i*Math.PI/48)]),0x98e0dc,.22);meshes.Earth.add(l);}for(let j=0;j<6;j++){const a=j*Math.PI/6,l=line(Array.from({length:97},(_,i)=>[1.002*Math.cos(i*Math.PI/48)*Math.cos(a),1.002*Math.sin(i*Math.PI/48),1.002*Math.cos(i*Math.PI/48)*Math.sin(a)]),0x98e0dc,.22);meshes.Earth.add(l);}
   const earthOrbit=line([],0x62899e,.3),moonOrbit=line([],0xd2b470,.5),umbra=new THREE.Mesh(new THREE.ConeGeometry(1,1,64,1,true),new THREE.MeshBasicMaterial({color:0x8ba3bf,transparent:true,opacity:.06,side:THREE.DoubleSide,depthWrite:false}));scene.add(umbra);umbra.visible=props.mode==='eclipses';
   change=p=>{
    for(const b of ['Sun','Earth','Moon'] as const){meshes[b].position.set(...p.physical.positions[b]);tags[b].position.copy(meshes[b].position).add(new THREE.Vector3(0,BODY_RADII_KM[b]/KM_PER_UNIT*1.4,0));}
    const x=vec(p.physical.earthMeridian),y=vec(p.physical.earthNorth),z=x.clone().cross(y);meshes.Earth.quaternion.setFromRotationMatrix(new THREE.Matrix4().makeBasis(x,y,z));
    const my=vec(p.physical.moonNorth),ra=(p.physical.moonRa+6)*Math.PI/12,mx=new THREE.Vector3(Math.cos(ra),0,-Math.sin(ra)).applyAxisAngle(my,p.physical.moonSpin*Math.PI/180);meshes.Moon.quaternion.setFromRotationMatrix(new THREE.Matrix4().makeBasis(mx,my,mx.clone().cross(my)));
    for(const b of ['Earth','Moon'] as const){const material=meshes[b].material as THREE.ShaderMaterial;material.uniforms.sun.value.copy(meshes.Sun.position);material.uniforms.blocker.value.copy(meshes[b==='Earth'?'Moon':'Earth'].position);}
    if(Math.abs(p.physical.ms-lastOrbit)>86400000){replace(earthOrbit,sampledOrbit(p.physical.ms,'Earth'));replace(moonOrbit,sampledOrbit(p.physical.ms,'Moon'));lastOrbit=p.physical.ms;}moonOrbit.position.copy(meshes.Earth.position);
    const length=BODY_RADII_KM.Earth*p.physical.earthDistanceKm/(BODY_RADII_KM.Sun-BODY_RADII_KM.Earth)/KM_PER_UNIT,away=meshes.Earth.position.clone().normalize();umbra.scale.set(BODY_RADII_KM.Earth/KM_PER_UNIT,length,BODY_RADII_KM.Earth/KM_PER_UNIT);umbra.position.copy(meshes.Earth.position).addScaledVector(away,length/2);umbra.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),away);
    if(focus!=='overview'){const point=meshes[focus].position,delta=point.clone().sub(lastFocus);camera.position.add(delta);controls.target.add(delta);lastFocus.copy(point);}
   };
   command=p=>{const a=p.command.action;if(a==='zoomIn'||a==='zoomOut'){camera.position.sub(controls.target).multiplyScalar(a==='zoomIn'?.6:1/.6).add(controls.target);return;}
    if(a==='Sun'||a==='Earth'||a==='Moon'){focus=a;const r=BODY_RADII_KM[a]/KM_PER_UNIT;controls.target.copy(meshes[a].position);lastFocus.copy(controls.target);camera.position.copy(controls.target).add(new THREE.Vector3(r*4,r*2,r*4));controls.minDistance=r*1.04;}
    else{focus=p.mode==='seasons'?'overview':'Earth';const distance=p.mode==='seasons'?p.physical.earthDistanceKm/KM_PER_UNIT*2.5:p.physical.moonDistanceKm/KM_PER_UNIT*2.5;controls.target.copy(focus==='overview'?new THREE.Vector3():meshes.Earth.position);lastFocus.copy(controls.target);const direction=a==='north'?new THREE.Vector3(0,1,.001):a==='side'?new THREE.Vector3(1,.02,1).normalize():new THREE.Vector3(.7,.6,1).normalize();camera.position.copy(controls.target).addScaledVector(direction,distance);controls.minDistance=BODY_RADII_KM.Earth/KM_PER_UNIT*1.04;}controls.update();};
  }
  update.current=p=>{camera.fov=p.fov;camera.updateProjectionMatrix();change(p);if(lastCommand!==p.command.serial){lastCommand=p.command.serial;command(p);}if(ground)camera.lookAt(vec(horizontalDirection(yaw,pitch)));};update.current(latest.current);
  const resize=new ResizeObserver(()=>{const w=el.clientWidth,h=el.clientHeight;if(!w||!h)return;renderer.setSize(w,h);camera.aspect=w/h;camera.updateProjectionMatrix();});resize.observe(el);
  function draw(){if(disposed)return;if(!ground)controls.update();for(const label of labels){const d=camera.position.distanceTo(label.position),h=d*2*Math.tan(camera.fov*Math.PI/360)*label.userData.size;label.scale.set(h*label.userData.aspect,h,1);}renderer.render(scene,camera);frame=requestAnimationFrame(draw);}draw();
  return()=>{disposed=true;cancelAnimationFrame(frame);resize.disconnect();controls.dispose();canvas.removeEventListener('pointerdown',pointerDown);canvas.removeEventListener('pointermove',pointerMove);canvas.removeEventListener('pointerup',pointerUp);canvas.removeEventListener('pointercancel',pointerUp);canvas.removeEventListener('wheel',wheel);canvas.removeEventListener('keydown',key);scene.traverse(o=>{if(o instanceof THREE.Mesh||o instanceof THREE.Line){o.geometry.dispose();(Array.isArray(o.material)?o.material:[o.material]).forEach(m=>m.dispose());}else if(o instanceof THREE.Sprite)o.material.dispose();});textures.forEach(t=>t.dispose());renderer.dispose();renderer.forceContextLoss();canvas.remove();update.current=()=>{};};
 },[props.mode,props.surface]);
 useEffect(()=>{update.current(props)},[props.physical,props.sky,props.command,props.selected,props.group,props.fov,props.showDayStars]);
 return <div className="astro-canvas" ref={host}>{failed&&<div className="astro-fallback" role="status"><b>当前设备未能启用WebGL 2</b><p>下方实际位置、距离和方位数值仍可阅读；支持WebGL 2的浏览器可查看3D。</p></div>}</div>;
}

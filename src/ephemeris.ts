import {Body,Ecliptic,GeoMoon,GeoVector,HelioVector,Illumination,MoonPhase,Observer,ObserverVector,RotateVector,Rotation_EQJ_HOR,Rotation_EQD_EQJ,RotationAxis,Seasons,SearchMoonPhase,SunPosition,SiderealTime,Vector,MakeTime,KM_PER_AU} from 'astronomy-engine';
import sky from './star-knowledge.json';
export const BODY_RADII_KM={Sun:695700,Earth:6371,Moon:1737.4} as const;
export const KM_PER_UNIT=10000;
export type BodyName=keyof typeof BODY_RADII_KM;
export type Vec3=[number,number,number];
export type Site={latitude:number;longitude:number;elevation:number};
export const DEFAULT_SITE:Site={latitude:31.23,longitude:121.47,elevation:0};
export const MIN_TIME=Date.parse('1901-01-01T00:00:00+08:00'),MAX_TIME=Date.parse('2100-12-31T23:59:59+08:00');
/** Astronomy Engine EQJ (X,Y,Z) to Three.js (X,Z,-Y): rotation, no reflection. */
export function renderVector(v:{x:number;y:number;z:number},scale=1):Vec3{return [v.x*scale,v.z*scale,-v.y*scale]}
export function beijingInput(ms:number){return new Date(ms+8*3600000).toISOString().slice(0,19)}
export function parseBeijingInput(value:string){if(!/^\d{4}-\d\d-\d\dT\d\d:\d\d(?::\d\d)?$/.test(value))throw new RangeError('请填写完整的北京时间');const ms=Date.parse(value+'+08:00');if(!Number.isFinite(ms)||ms<MIN_TIME||ms>MAX_TIME)throw new RangeError('日期支持1901—2100年');if(beijingInput(ms).slice(0,value.length)!==value)throw new RangeError('日期或时刻无效');return ms}
export function validateSite(site:Site){if(!Number.isFinite(site.latitude)||Math.abs(site.latitude)>90||!Number.isFinite(site.longitude)||Math.abs(site.longitude)>180||!Number.isFinite(site.elevation)||site.elevation<0||site.elevation>9000)throw new RangeError('纬度−90至90，经度−180至180，海拔0至9000米');return site}
export function horizontalDirection(azimuth:number,altitude:number,r=100):Vec3{const a=azimuth*Math.PI/180,h=altitude*Math.PI/180;return [r*Math.cos(h)*Math.sin(a),r*Math.sin(h),-r*Math.cos(h)*Math.cos(a)]}
export function angularRadius(radiusKm:number,distanceKm:number){return Math.asin(radiusKm/distanceKm)*180/Math.PI}
function horizon(v:Vector,rotation:ReturnType<typeof Rotation_EQJ_HOR>){const h=RotateVector(rotation,v),r=h.Length(),altitude=Math.asin(h.z/r)*180/Math.PI,azimuth=(Math.atan2(-h.y,h.x)*180/Math.PI+360)%360;return {altitude,azimuth,direction:horizontalDirection(azimuth,altitude)}}
export function skySnapshot(ms:number,site:Site){
 validateSite(site);const date=new Date(ms),observer=new Observer(site.latitude,site.longitude,site.elevation),rotation=Rotation_EQJ_HOR(date,observer),time=MakeTime(date);
 const observerVector=ObserverVector(date,observer,false);
 const stars=sky.stars.map(s=>{const a=s.ra*Math.PI/12,d=s.dec*Math.PI/180;return {hip:s.hip,...horizon(new Vector(Math.cos(d)*Math.cos(a),Math.cos(d)*Math.sin(a),Math.sin(d),time),rotation)}});
 const bodies=([Body.Sun,Body.Moon] as const).map(body=>{const g=GeoVector(body,date,true),topo=new Vector(g.x-observerVector.x,g.y-observerVector.y,g.z-observerVector.z,time),distanceKm=topo.Length()*KM_PER_AU;return {name:body as 'Sun'|'Moon',...horizon(topo,rotation),distanceKm,angularRadius:angularRadius(BODY_RADII_KM[body],distanceKm)}});
 return {stars,bodies};
}
export function physicalSnapshot(ms:number){
 if(!Number.isFinite(ms)||ms<MIN_TIME||ms>MAX_TIME)throw new RangeError('日期支持1901—2100年');
 const date=new Date(ms),earth=HelioVector(Body.Earth,date),moon=GeoMoon(date),s=SunPosition(date),ill=Illumination(Body.Moon,date),eqd=Rotation_EQD_EQJ(date),time=MakeTime(date),gst=SiderealTime(date)*Math.PI/12;
 const north=renderVector(RotateVector(eqd,new Vector(0,0,1,time))),meridian=renderVector(RotateVector(eqd,new Vector(Math.cos(gst),Math.sin(gst),0,time)));
 const moonAxis=RotationAxis(Body.Moon,date);
 const positions:Record<BodyName,Vec3>={Sun:[0,0,0],Earth:renderVector(earth,KM_PER_AU/KM_PER_UNIT),Moon:renderVector({x:earth.x+moon.x,y:earth.y+moon.y,z:earth.z+moon.z},KM_PER_AU/KM_PER_UNIT)};
 return {ms,positions,earthNorth:north,earthMeridian:meridian,moonNorth:renderVector(moonAxis.north),moonSpin:moonAxis.spin,moonRa:moonAxis.ra,earthDistanceKm:earth.Length()*KM_PER_AU,moonDistanceKm:moon.Length()*KM_PER_AU,solarLongitude:s.elon,solarDeclination:Math.asin(north.reduce((a,n,i)=>a-n*positions.Earth[i],0)/Math.hypot(...positions.Earth))*180/Math.PI,moonLatitude:safeMoonLatitude(moon),phaseFraction:ill.phase_fraction,phaseLongitude:MoonPhase(date)};
}
function safeMoonLatitude(moon:Vector){return Ecliptic(moon).elat}
export function sampledOrbit(ms:number,body:'Earth'|'Moon'){
 const days=body==='Earth'?365.256:27.322,points:Vec3[]=[];
 for(let i=0;i<=120;i++){const date=new Date(ms+(i/120-.5)*days*86400000);points.push(renderVector(body==='Earth'?HelioVector(Body.Earth,date):GeoMoon(date),KM_PER_AU/KM_PER_UNIT))}return points;
}
export function eventTime(ms:number,event:'spring'|'summer'|'autumn'|'winter'|'new'|'full'){
 if(event==='new'||event==='full'){const result=SearchMoonPhase(event==='new'?0:180,new Date(ms),40);if(!result)throw new Error('未找到朔望时刻');return result.date.getTime()}
 const s=Seasons(Number(beijingInput(ms).slice(0,4)));return ({spring:s.mar_equinox,summer:s.jun_solstice,autumn:s.sep_equinox,winter:s.dec_solstice})[event].date.getTime();
}

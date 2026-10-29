export const OBLIQUITY=23.44;
export const MOON_INCLINATION=5.145;
const rad=Math.PI/180;
export function solarDeclination(longitude:number){return Math.asin(Math.sin(OBLIQUITY*rad)*Math.sin(longitude*rad))/rad}
export function illuminatedFraction(elongation:number){return (1-Math.cos(elongation*rad))/2}
/** Ecliptic longitude is measured from the solar direction; the orbit is a plane. */
export function lunarLatitude(elongation:number,node:number,inclination=MOON_INCLINATION){return Math.atan(Math.tan(inclination*rad)*Math.sin((elongation-node)*rad))/rad}
/** Directions only, right handed: +Y north celestial pole, RA increases toward -Z. */
export function equatorialVector(raHours:number,decDegrees:number,radius=1):[number,number,number]{
 const a=raHours*15*rad,d=decDegrees*rad;
 return [radius*Math.cos(d)*Math.cos(a),radius*Math.sin(d),-radius*Math.cos(d)*Math.sin(a)];
}
export type AstronomyMode='seasons'|'moon'|'eclipses'|'stars';

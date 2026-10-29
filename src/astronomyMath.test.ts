import {describe,it,expect} from 'vitest';
import {solarDeclination,illuminatedFraction,lunarLatitude,equatorialVector,OBLIQUITY,MOON_INCLINATION} from './astronomyMath';
import sky from './star-knowledge.json';
import data from './calendar-knowledge.json';
describe('天文教学模型的几何约束',()=>{
 it('分至的直射纬度及黄经周期',()=>{expect(solarDeclination(0)).toBeCloseTo(0);expect(solarDeclination(90)).toBeCloseTo(OBLIQUITY);expect(solarDeclination(180)).toBeCloseTo(0);expect(solarDeclination(270)).toBeCloseTo(-OBLIQUITY);expect(solarDeclination(450)).toBeCloseTo(solarDeclination(90))});
 it('朔望和弦月的可见照亮比例',()=>{expect(illuminatedFraction(0)).toBeCloseTo(0);expect(illuminatedFraction(180)).toBeCloseTo(1);expect(illuminatedFraction(90)).toBeCloseTo(.5);expect(illuminatedFraction(270)).toBeCloseTo(.5)});
 it('朔望不保证在交点，纬度上限为月轨倾角',()=>{expect(lunarLatitude(0,0)).toBeCloseTo(0);expect(lunarLatitude(180,0)).toBeCloseTo(0);expect(lunarLatitude(0,90)).toBeCloseTo(-MOON_INCLINATION);expect(lunarLatitude(180,90)).toBeCloseTo(MOON_INCLINATION)});
 it('赤经小时转换、北天极和单位球半径',()=>{expect(equatorialVector(0,0)).toEqual([1,0,-0]);expect(equatorialVector(6,0)[2]).toBeCloseTo(-1);expect(equatorialVector(0,90)[1]).toBeCloseTo(1);for(const s of sky.stars)expect(Math.hypot(...equatorialVector(s.ra,s.dec))).toBeCloseTo(1)});
});
describe('知识完整性与星表关联',()=>{
 it('24节气都有南北地域农事及可解析的出处',()=>{expect(data.terms).toHaveLength(24);for(const t of data.terms){expect(t.farming.north.length).toBeGreaterThan(20);expect(t.farming.south.length).toBeGreaterThan(20);expect(t.farming.risk.length).toBeGreaterThan(3);for(const id of t.farming.sources)expect(data.sources.some(s=>s.id===id)).toBe(true)}});
 it('四象各七宿、28宿无重名、连线引用160颗有效恒星',()=>{expect(sky.mansions).toHaveLength(28);expect(new Set(sky.mansions.map(m=>m.name)).size).toBe(28);for(let i=0;i<4;i++)expect(sky.mansions.filter(m=>m.group===i)).toHaveLength(7);expect(sky.stars).toHaveLength(160);expect(new Set(sky.stars.map(s=>s.hip)).size).toBe(160);const used=new Set(sky.mansions.flatMap(m=>m.lines.flat()));expect(used.size).toBe(160);for(const id of used)expect(sky.stars.some(s=>s.hip===id)).toBe(true);for(const s of sky.stars){expect(s.ra).toBeGreaterThanOrEqual(0);expect(s.ra).toBeLessThan(24);expect(Math.abs(s.dec)).toBeLessThanOrEqual(90);expect(Number.isFinite(s.mag)).toBe(true)}});
 it('以角宿一和参宿四核验星表坐标方向，保持上游历元与署名',()=>{const spica=sky.stars.find(s=>s.hip===65474)!;expect(spica.ra).toBeCloseTo(13.4199,3);expect(spica.dec).toBeCloseTo(-11.1613,3);const betelgeuse=sky.stars.find(s=>s.hip===27989)!;expect(betelgeuse.ra).toBeCloseTo(5.9195,3);expect(betelgeuse.dec).toBeCloseTo(7.4071,3);expect(sky.epoch).toBe('J2000.0');expect(sky.license).toBe('CC BY-SA 4.0');expect(sky.provenance).toHaveLength(2)});
});

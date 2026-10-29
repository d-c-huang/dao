// All arrays use bottom-to-top line order: 初爻、二爻、三爻.
export type Bits = [number, number, number];
export const trigrams: {name:string;pinyin:string;image:string;quality:string;bits:Bits;description:string;prompt:string}[] = [
 {name:'乾',pinyin:'QIÁN',image:'天',quality:'健',bits:[1,1,1],description:'三爻皆阳，以天为象。《说卦传》以“健”概括其性质，呈现持续运行、主动创造的意涵。',prompt:'这件事的方向是什么？你可以主动迈出的第一步是什么？'},
 {name:'兑',pinyin:'DUÌ',image:'泽',quality:'说',bits:[1,1,0],description:'下二爻为阳，上爻为阴，以泽为象。“说”在这里通“悦”，关联交流、和悦与相互感应。',prompt:'参与者之间需要怎样的交流与反馈？'},
 {name:'离',pinyin:'LÍ',image:'火',quality:'丽',bits:[1,0,1],description:'上下为阳，中爻为阴，以火为象。“丽”有附着之意，提示光明、依附与相互依存的关系。',prompt:'什么信息需要被看见？这个想法依赖哪些条件？'},
 {name:'震',pinyin:'ZHÈN',image:'雷',quality:'动',bits:[1,0,0],description:'初爻为阳，上二爻为阴，以雷为象。用“动”表达启动、振发与变化的出现。',prompt:'什么能触发行动？最小的启动实验是什么？'},
 {name:'巽',pinyin:'XÙN',image:'风',quality:'入',bits:[0,1,1],description:'初爻为阴，上二爻为阳，以风、木为象。“入”提示渐进、进入与潜移默化的影响。',prompt:'哪些改变适合循序渐进地推进？'},
 {name:'坎',pinyin:'KǍN',image:'水',quality:'陷',bits:[0,1,0],description:'中爻为阳，上下为阴，以水为象。《说卦传》以“陷”概括其性质，涉及险阻与处险的思考。',prompt:'最大的阻碍是什么？可以如何提前验证风险？'},
 {name:'艮',pinyin:'GÈN',image:'山',quality:'止',bits:[0,0,1],description:'上爻为阳，下二爻为阴，以山为象。“止”关联边界、停驻与适时停止。',prompt:'项目的边界是什么？哪些事情应当停止？'},
 {name:'坤',pinyin:'KŪN',image:'地',quality:'顺',bits:[0,0,0],description:'三爻皆阴，以地为象。以“顺”表达承载、顺应与配合，提供理解支持性条件的角度。',prompt:'需要什么资源与支持？如何承接已有条件？'},
];
export const early = ['乾','巽','坎','艮','坤','震','离','兑'];
export const later = ['离','坤','兑','乾','坎','艮','震','巽'];
export function byBits(bits: Bits) { return trigrams.find(t => t.bits.every((v,i)=>v===bits[i]))!; }
export function flipLine(bits: Bits, index:number): Bits { if(index<0||index>2) throw new Error('Invalid line'); return bits.map((v,i)=>i===index?1-v:v) as Bits; }
export function combine(lower: Bits, upper: Bits) { return [...lower,...upper]; }

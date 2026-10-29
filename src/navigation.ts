export const pages = [
 {name:'探索首页',slug:'home',description:'发现学习路线，从阴阳到数学与 AI'},
 {name:'原理入门',slug:'basics',description:'阴阳、爻位与上下卦的交互入门'},
 {name:'八卦图鉴',slug:'trigrams',description:'乾兑离震巽坎艮坤的结构与含义'},
 {name:'六十四卦',slug:'hexagrams',description:'查卦名、卦序、上下卦与经传原文'},
 {name:'先后天对照',slug:'arrangements',description:'比较两种方位图式及其文本背景'},
 {name:'八卦与数学',slug:'mathematics',description:'二进制、组合计数、对称与汉明距离'},
 {name:'六十四卦与AI推理',slug:'ai-reasoning',description:'用64卦情境、上下卦内外条件，整理问题、证据和验证行动'},
 {name:'天文与历法',slug:'calendar',description:'时辰、节气与农事、3D四季与月相、二十八宿天球和阴阳合历'},
 {name:'五行与干支',slug:'elements',description:'五行生克、十天干、十二地支与六十甲子'},
 {name:'术数工坊',slug:'divination',description:'小六壬、梅花易数、六爻纳甲与六亲世应、大六壬三传、太乙主客算'},
 {name:'应用实验室',slug:'laboratory',description:'卦象练习、设计工坊与思考记录'},
 {name:'资料与出处',slug:'sources',description:'阅读保存在本地的经典与研究资料'},
] as const;

export type Page = (typeof pages)[number]['name'];
export function isPage(value:string):value is Page {return pages.some(page=>page.name===value)}
export function pageFromHash(hash:string):Page {
 const slug=hash.replace(/^#\/?/,'').split('?')[0];
 return pages.find(page=>page.slug===slug)?.name??'探索首页';
}
export function pageHash(page:Page) {return `#${pages.find(entry=>entry.name===page)!.slug}`}

import { hexagrams } from './hexagrams';
import { aiSources } from './aiSources';

/** Offline reading excerpts. Full bibliographic notes are kept in docs/sources/. */
export interface SourceRecord {
  id: string;
  category: string;
  title: string;
  author: string;
  locator: string;
  url: string;
  accessed: string;
  excerpt: string;
  summary: string;
  usage: string;
  localPath: string;
  rights: string;
}

export const sources: SourceRecord[] = [
  ...aiSources,
  {
    id: 'zhou-yi-64', category: 'classic', title: '《周易》六十四卦：卦辞与大象',
    author: '《周易》经文与《象传》传世文本',
    locator: '上经第 1–30 卦，下经第 31–64 卦；按通行卦序排列',
    url: 'https://zh.wikisource.org/wiki/周易', accessed: '2026-10-29',
    excerpt: hexagrams.map(h => `【第 ${h.number} 卦 · ${h.name} · ${h.title}】\n卦辞：${h.judgment}\n大象：${h.imageText}\n原文：${h.sourceUrl}`).join('\n\n'),
    summary: '六十四卦各由有序的下卦与上卦组成。卦辞属于经文，大象属于《象传》，正文分别标注。图鉴按通行卦序编号，每卦另附本项目撰写的入门解释与关键词。',
    usage: '六十四卦图鉴、八乘八组合表、原理入门与数学页的卦名查找。通行卦序与 0–63 二进制编码分别展示。',
    localPath: 'docs/sources/zhou-yi-64.md',
    rights: '公共领域古典原文，据维基文库逐卦页面整理并保留来源。资料摘录收录卦辞及大象；完整经传及各爻正文另存于本地全文归档。入门解释与关键词由项目编写。',
  },
  {
    id: 'shuo-gua', category: 'classic', title: '《周易·说卦传》',
    author: '《易传》传世文本（本项目不以传统署名断定成书作者）',
    locator: '第三章、第五章、第七章；第十一章取象摘句',
    url: 'https://zh.wikisource.org/wiki/易傳/說卦', accessed: '2026-10-29',
    excerpt: '【第三章】天地定位，山澤通氣，雷風相薄，水火不相射。八卦相錯，數往者順，知來者逆。是故易逆數也。\n\n【第五章节选】帝出乎震，齊乎巽，相見乎離，致役乎坤，說言乎兌，戰乎乾，勞乎坎，成言乎艮。\n\n【第七章】乾，健也。坤，順也。震，動也。巽，入也。坎，陷也。離，麗也。艮，止也。兌，說也。\n\n【第十一章分项摘句】乾為天……坤為地……震為雷……巽為木、為風……坎為水……離為火……艮為山……兌為澤。',
    summary: '卦德、自然取象与方位文字的依据。“说”在卦德说明中读作悦。第三章可供理解成对关系，第五章提供后天方位的文本背景；经文没有直接给出现代 0/1 编码或本项目绘制的完整圆图。',
    usage: '八卦图鉴、先后天对照；数学栏目中的互补配对另由三爻结构逐位计算。',
    localPath: 'docs/sources/shuo-gua.md',
    rights: '古典原文属公共领域；据维基文库转录核对，保留繁体字，标明节选与删节；未复制现代译注。',
  },
  {
    id: 'xi-ci-shang', category: 'classic', title: '《周易·系辞上》',
    author: '《易传》传世文本', locator: '第五章、第十一章',
    url: 'https://zh.wikisource.org/wiki/易傳/繫辭上', accessed: '2026-10-29',
    excerpt: '【第五章节选】一陰一陽之謂道：繼之者善也，成之者性也。\n\n【第十一章节选】是故易有太極，是生兩儀，兩儀生四象，四象生八卦，八卦定吉凶，吉凶生大業。',
    summary: '两仪、四象、八卦是传统思想中的表述。将每次增添一个二值位置解释为 2、4、8 种结构，是本项目明确采用的现代组合模型；这段文字没有写出二进制位权或加减算法。',
    usage: '首页“一阴一阳之谓道”；原理入门与数学栏目的二分结构阅读。',
    localPath: 'docs/sources/xi-ci-shang.md',
    rights: '公共领域古典原文；据维基文库核对摘录，现代解释为项目整理。',
  },
  {
    id: 'xi-ci-xia', category: 'classic', title: '《周易·系辞下》',
    author: '《易传》传世文本', locator: '第一章、第二章',
    url: 'https://zh.wikisource.org/wiki/易傳/繫辭下', accessed: '2026-10-29',
    excerpt: '【第一章节选】八卦成列，象在其中矣；因而重之，爻在其中矣；剛柔相推，變在其中矣；繫辭焉而命之，動在其中矣。\n\n【第二章节选】古者包犧氏之王天下也，仰則觀象於天，俯則觀法於地，觀鳥獸之文，與地之宜，近取諸身，遠取諸物；於是始作八卦，以通神明之德，以類萬物之情。',
    summary: '“因而重之”为重卦学习提供文本入口；用有序的下卦、上卦建立 8 × 8 的组合，是本项目的结构说明。第二章记载的是经典中的文化叙事，不能单凭这段话确定八卦的考古起源与年代。',
    usage: '首页“仰则观象于天，俯则观法于地”的准确出处；上下卦组合。',
    localPath: 'docs/sources/xi-ci-xia.md',
    rights: '公共领域古典原文；据维基文库核对摘录，保留章名与删节标记。',
  },
  {
    id: 'leibniz-1703', category: 'history', title: '莱布尼茨《二进制算术的解释》',
    author: 'Gottfried Wilhelm Leibniz',
    locator: '法国科学院《Mémoires》1703 年卷，pp. 85–89；Gerhardt 编 GM VII，pp. 223–227',
    url: 'https://fr.wikisource.org/wiki/Leibniz-en.francais-Gerhardt.Math.1a7.djvu/Numération.binaire', accessed: '2026-10-29',
    excerpt: 'Ainsi m’écrivant le 14 Novembre 1701, il m’a envoyé la grande figure de ce Prince Philosophe qui va à 64.',
    summary: '这篇法文论文说明以 0、1 记数，并比较卦画与二进制表。作者自述先将自己的计数方法寄给在北京的白晋（Joachim Bouvet），后收到含六十四个符号的图。它记录了双方对结构对应的解释；作者关于伏羲的古史判断不等于今日已证实的历史事实。',
    usage: '数学栏目“莱布尼茨与白晋”的史料入口；1703 指所载卷年，不把卷年当作印刷日期的独立证据。',
    localPath: 'docs/sources/leibniz-1703.md',
    rights: '莱布尼茨法文原作属公共领域，本页摘录仅引一句；法文转录全文另存于本地归档，链接图版缺失情况见保存状态。现代英译仅保留阅读链接。',
  },
  {
    id: 'counting', category: 'math', title: 'MIT《Mathematics for Computer Science》：乘法原理',
    author: 'Eric Lehman、F. Thomson Leighton、Albert R. Meyer',
    locator: 'MIT 6.042J，2015，§14.2.1–14.2.2，教材 pp. 553–554',
    url: 'https://ocw.mit.edu/courses/6-042j-mathematics-for-computer-science-spring-2015/mit6_042js15_session25.pdf', accessed: '2026-10-29',
    excerpt: 'The Product Rule gives the size of a product of sets.',
    summary: '乘法原理把各位置可选项的数量相乘。每个位置有 0、1 两种选择，所以三位二值串共有 2³＝8 个，六位共有 2⁶＝64 个。将有序上下卦配对同样得到 8 × 8＝64；这里计算的是可能结构，未给它们赋予等概率。',
    usage: '组合计数、三爻与六爻模型；应用到卦象的映射与示例由项目编写。',
    localPath: 'docs/sources/counting.md',
    rights: '本页保留短引文、作者和原址，中文摘要及卦象推导为项目整理。MIT 原始 PDF 与开放教材按各自许可另存全文归档，具体版本与许可见本地全文。',
  },
  {
    id: 'hypercube', category: 'math', title: 'UC Berkeley CS70：Hypercubes',
    author: 'UC Berkeley CS70，2003 年秋课程讲义（David Wagner 课程目录）',
    locator: 'Lecture 6，“Hypercubes”小节',
    url: 'https://people.eecs.berkeley.edu/~daw/teaching/cs70-f03/Notes/hypercube.pdf', accessed: '2026-10-29',
    excerpt: 'The total number of edges in an n-dimensional hypercube is n2ⁿ⁻¹.',
    summary: 'n 维超立方体以 n 位二值串为顶点，只在恰有一位不同时连边。三位情形有 8 个顶点，每点有 3 个邻点，边数为 8 × 3 ÷ 2＝12。把三爻卦映到顶点后，一条边表示一次变一爻；这是现代图论模型。',
    usage: '数学栏目的一爻变化网络；与圆形方位图使用不同的连边规则。',
    localPath: 'docs/sources/hypercube.md',
    rights: '短引文的上标公式已转写；保留课程出处。中文摘要与卦象图为项目整理，未复制讲义图像。',
  },
  {
    id: 'hamming', category: 'math', title: 'NIST：Hamming distance（汉明距离）',
    author: 'Paul E. Black，Dictionary of Algorithms and Data Structures',
    locator: '词条修改日期 2006-05-31，Definition 与解释段',
    url: 'https://xlinux.nist.gov/dads/HTML/HammingDistance.html', accessed: '2026-10-29',
    excerpt: 'The number of bits which differ between two binary strings.',
    summary: '等长二值串的汉明距离，是相应位置不相同的个数。在三爻模型里，两个卦的距离就是不同爻的数量；当每步只许变一爻时，它也等于最少变爻步数。距离比较的是符号结构。',
    usage: '变化距离、立方体最短路径；例如乾与坤的三个位置均不同，距离为 3。',
    localPath: 'docs/sources/hamming.md',
    rights: '资料摘录保留定义短引文及作者出处，中文说明与例子为项目整理；NIST 词条全文另存于本地归档。',
  },
];

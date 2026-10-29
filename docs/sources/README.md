# 本地资料与出处

核对日期：2026-10-29。此目录保存网站使用的**摘录、中文整理、书目信息与全文归档说明**。下载的原文文件另存于 [`public/resources/`](../../public/resources/)，可随项目离线阅读。

## 完整原文入口

- [经典全文目录](../../public/resources/classics/index.html)：68 个来源页面的 HTML／TXT，包括六十四卦各爻及页面所载完整经传。
- [全文资源包](../../public/resources/source-archive.zip)：146 个内容文件及来源、许可、校验清单。
- [完整归档清单](../../public/resources/manifest.json)：每个文件的原址、格式、保存范围、字节数与 SHA-256。
- 归档说明：[经典](archive-classics.md)、[数学](archive-math.md)、[历史与 AI](archive-history-ai.md)。

七条来源完整归档。莱布尼茨法文全文已保存，两幅链接图版未能获取；RAG 与 Berkeley 原件未核实全文再分发许可。MIT 完整教材明确作为开放许可补充阅读保存，不冒充 Berkeley 原件。网站会显示各条的实际保存状态。

## 摘录与阅读说明

| 资料 | 对应内容 | 本地文件 |
| --- | --- | --- |
| 《周易》六十四卦 | 64 卦的卦序、上下卦、卦辞、大象与逐卦出处 | [zhou-yi-64.md](zhou-yi-64.md) |
| 《周易·说卦传》 | 卦德、自然取象、成对关系和方位文字 | [shuo-gua.md](shuo-gua.md) |
| 《周易·系辞上》 | 一阴一阳、两仪四象八卦 | [xi-ci-shang.md](xi-ci-shang.md) |
| 《周易·系辞下》 | 重卦、观察自然、首页引文 | [xi-ci-xia.md](xi-ci-xia.md) |
| 莱布尼茨二进制论文 | 0/1 与卦画对应的历史记录 | [leibniz-1703.md](leibniz-1703.md) |
| MIT 乘法原理教材 | 2³、2⁶、8 × 8 | [counting.md](counting.md) |
| Berkeley 超立方体讲义 | 8 顶点、12 条一爻变化边 | [hypercube.md](hypercube.md) |
| NIST 汉明距离词条 | 不同位置的个数与最少变爻步数 | [hamming.md](hamming.md) |
| RAG 与 ReAct 原始研究 | 检索增强、行动与复核；八视角为项目类比 | [ai-reasoning.md](ai-reasoning.md) |

网站使用 [`src/sources.ts`](../../src/sources.ts) 中的十条记录展示本地摘录，包括两条 AI 原始研究记录。六十四卦内容另见 [`src/hexagrams.ts`](../../src/hexagrams.ts)，与图鉴共用同一套数据；网站下载资料时会包含全部六十四卦的卦辞、大象与逐卦出处。数学模型、位序与推导见 [八卦与数学](../bagua-mathematics.md)，八视角与 AI 的关系见 [结合说明](../ai-reasoning.md)。

## 文本与权利说明

- 经典中文与莱布尼茨法文原作属于公共领域。经典按实际核对的维基文库文本摘录，保留繁体；标题和解释使用简体。不同版本的断句、异体字可能有差异；以篇名、章名和引文开头定位，不把现代标点视为古代原有。
- 维基文库原文保存完整正文，移除站点导航界面及执行脚本；保留原址、修订和贡献者历史入口。古典正文为公共领域，站点转录及编辑信息依 [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/deed.zh) 等原有条款保存。
- 本目录的数学资料文件是短引和项目摘要，完整 MIT 文件及 NIST 正文保存在全文归档目录，并分别注明具体许可。未获准保存的 Berkeley 原件仍提供原址。
- 莱布尼茨法文转录全文已保存；Gallica 入口及未能保存的链接图版另有记录，没有声称已下载整卷影印本。
- 原项目的中国哲学书电子化计划阅读入口仍可作为补充：[说卦](https://ctext.org/book-of-changes/shuo-gua/zhs)、[系辞上](https://ctext.org/book-of-changes/xi-ci-shang/zhs)、[系辞下](https://ctext.org/book-of-changes/xi-ci-xia/zhs)。本次该站直接读取返回安全验证页，因此没有把安全验证页或未经核对的自动结果当作原文复制。

## 证据层次

经典原文说明的是传统符号及思想；历史论文说明的是作者当时的解释；位权、集合、立方体与汉明距离是本项目明确标注的现代数学模型。三种资料各自支持不同的结论，不能用结构相似代替历史传播证据。

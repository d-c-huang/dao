# NIST：汉明距离

- 作者：Paul E. Black。
- 文献：*Dictionary of Algorithms and Data Structures*，词条 “Hamming distance”。
- 词条修改日期：2006-05-31。
- 位置：Definition 与解释段。
- 原址：[NIST 词条](https://xlinux.nist.gov/dads/HTML/HammingDistance.html)。
- 访问日期：2026-10-29。
- 保存范围：一句定义短引文与项目自撰摘要。

## 短引文

> The number of bits which differ between two binary strings.

## 项目整理与应用

对等长的二值串，逐位置比较，统计不同的位置数，就是汉明距离。映到三爻卦后，它统计两个卦有几处阴阳不同。

如果每步只允许变一爻，每个不同的位置至少需要改变一次；依次改变所有不同的位置即可到达目标，所以最少步骤恰等于汉明距离。例如乾与坤三爻皆不同，距离为 3。这个证明是本站基于定义写出的结构推导；距离没有表达吉凶或事物之间的现实因果。

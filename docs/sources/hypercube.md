# UC Berkeley CS70：超立方体图

- 文献：UC Berkeley CS70，2003 年秋课程讲义，*Lecture 6*。
- 课程归档：David Wagner 的课程目录；此处按课程材料署名，不推断 PDF 未列明的个人执笔者。
- 位置：“Hypercubes”小节。
- 原址：[Berkeley 讲义 PDF](https://people.eecs.berkeley.edu/~daw/teaching/cs70-f03/Notes/hypercube.pdf)。
- 访问日期：2026-10-29。
- 保存范围：一句边数结论短引文与项目自撰摘要；未复制讲义图像。

## 短引文

> The total number of edges in an n-dimensional hypercube is n2ⁿ⁻¹.

引文中的公式已将原 PDF 排版转写为上标纯文本。

## 项目整理与应用

把所有 n 位二值串当作顶点，仅在恰有一位不同时连边，就得到 n 维超立方体图。取 n＝3，恰好有 8 个顶点。每点可改变三个位置之一，因此有三个邻点；每条边被两个端点分别数到，边数为 8 × 3 ÷ 2＝12。

三爻卦与三位二值串之间建立映射后，一条边表示一次变一爻。这个模型关注“差一个位置”的关系；传统圆形方位图关注排列方位。两幅图的连接依据不同，圆周相邻不必然表示只差一爻。

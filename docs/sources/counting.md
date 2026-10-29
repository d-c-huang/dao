# MIT：乘法原理与二值串计数

- 作者：Eric Lehman、F. Thomson Leighton、Albert R. Meyer。
- 文献：*Mathematics for Computer Science*，MIT 6.042J，2015。
- 位置：§14.2.1 “The Product Rule”、§14.2.2，教材 pp. 553–554。
- 原址：[MIT OpenCourseWare 教材节选 PDF](https://ocw.mit.edu/courses/6-042j-mathematics-for-computer-science-spring-2015/mit6_042js15_session25.pdf)。
- 访问日期：2026-10-29。
- 保存范围：一句定义短引文与项目自撰摘要，未镜像整本教材。

## 短引文

> The Product Rule gives the size of a product of sets.

## 项目整理与应用

若每个位置可选有限集合，其有序选择总数是各集合大小的乘积。每爻有阴、阳两个可选状态：

```text
三爻：2 × 2 × 2 = 2³ = 8
六爻：2 × 2 × 2 × 2 × 2 × 2 = 2⁶ = 64
上下卦有序配对：8 × 8 = 64
```

这解释的是可能结构的数量。没有设定随机抽取机制与概率分布时，不能据 8 或 64 直接断言各卦出现概率相同。三爻与八个二值串的映射，以及本项目把初爻设为最低位的编码约定，是本站自己的教学建模。

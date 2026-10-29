# 数学资料全文的本地保存

保存与许可核对日期：2026-10-29。本次针对资料页引用的具体文档保存文件，不递归抓取课程网站或相关词条。原有摘录与项目解释仍保留。

| 原资料 | 本地全文文件 | 状态与范围 |
| --- | --- | --- |
| MIT 6.042J Session 25：Cardinality Rules | [`mit6_042js15_session25.pdf`](../../public/resources/mathematics/mit6_042js15_session25.pdf) | 原链接 PDF 完整 6 页，250,203 字节；教材页 551–555 与 OCW 署名页，文件未修改 |
| NIST：Hamming distance | [`nist-hamming-distance.html`](../../public/resources/mathematics/nist-hamming-distance.html)、[纯文本](../../public/resources/mathematics/nist-hamming-distance.txt) | 完整词条正文、注记、作者与原页引用信息；去除远程脚本、图片与样式，保留指向原站的相关链接 |
| UC Berkeley CS70 Lecture 6 | 原件未镜像 | 原始课程和作者教学目录未提供可确认的全文重分发许可；保留原有短引与自撰说明 |
| MIT 完整开放教材：超立方体替代阅读 | [`mit6_042js15_textbook.pdf`](../../public/resources/mathematics/mit6_042js15_textbook.pdf) | 原始完整教材 920 页，5,761,048 字节；Problem 11.45 的超立方体定义与练习见教材第 459 页，即 PDF 第 468 页。明确作为替代阅读，不是 Berkeley 原件 |

以上 4 个内容文件合计 6,016,222 字节。每个文件的来源、许可、范围、下载时间、字节数与 SHA-256 记录在 [`math.json`](../../public/resources/manifests/math.json)。Berkeley 原件的未保存原因记录在 [`math-unavailable.json`](../../public/resources/manifests/math-unavailable.json)。

## 许可依据与署名

### MIT

作者：Eric Lehman、F. Thomson Leighton、Albert R. Meyer。文献：*Mathematics for Computer Science*，MIT 6.042J / 18.062J，2015。

- [Session 25 的精确资源页面](https://ocw.mit.edu/courses/6-042j-mathematics-for-computer-science-spring-2015/resources/mit6_042js15_session25/)在元数据与页脚指向 [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/)。完整下载文件也保留 OCW 的署名和条款入口。
- [完整教材的资源页面](https://ocw.mit.edu/courses/6-042j-mathematics-for-computer-science-spring-2015/resources/mit6_042js15_textbook/)同样指向 OCW 条款；**PDF 自身第 2 页更具体的作者声明使用 [CC BY-NC-SA 3.0](https://creativecommons.org/licenses/by-nc-sa/3.0/)**，本项目为该教材保留并注明这个版本。
- [MIT OCW 官方使用条款](https://ocw.mit.edu/pages/privacy-and-terms-of-use/)允许按署名、非商业与相同方式共享要求复制和再利用，另有标注的第三方保留权利材料除外。本次精确 PDF 未发现另列的“all rights reserved”说明；两个 PDF 均保持原始字节，未改写或裁切。
- 这两个文件及其衍生使用须保留相应署名、许可与非商业条件；下载教材不会改变项目其他原创文件各自的权利状态。

### NIST

署名：Paul E. Black / National Institute of Standards and Technology，词条修改日期 2006-05-31。

- 原文：[Hamming distance](https://xlinux.nist.gov/dads/HTML/HammingDistance.html)。
- [NIST 官方 Copyrights & Disclaimers](https://www.nist.gov/copyrights-disclaimers)允许分发或复制未另行标明版权的信息，并要求适当保留署名。本词条未发现另外的版权限制。
- 本地 HTML 保留全部正文与注记，移除可执行脚本、远程样式和远程 logo；图片的文字替代内容 NIST 保留。相关词条、联系页面与原文链接仍指向原站，未声称这些链接也已离线归档。原页通过脚本显示的联系邮箱在去除脚本后保留其页面中的保护文本。

### Berkeley 原始讲义

已检查 [原始 PDF 的课程入口](https://people.eecs.berkeley.edu/~daw/teaching/cs70-f03/)、[作者教学目录](https://people.eecs.berkeley.edu/~daw/teaching)及公开 PDF。网络公开可访问不等同于已确认可全文重分发；这些页面未显示明确许可。本地状态因此是“原件未镜像／许可未确认”，而不是下载失败或已经保存。

## 重新获取

在项目根目录运行：

```powershell
python scripts/archive-math.py
```

脚本只访问写死的官方资源链接，确认 MIT 精确资源页面仍标明许可，再下载并检查 PDF 文件头与结束标记。NIST 采用安全标签白名单生成离线 HTML，并验证定义及引用段存在。脚本不绕过验证码、登录或网站安全验证。它会刷新这部分文件和数学清单，不修改网站源数据或其他归档。

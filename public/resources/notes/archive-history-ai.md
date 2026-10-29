# 历史与 AI 来源的本地全文归档

保存日期：2026-10-29。文件位于 `public/resources/history/` 与 `public/resources/ai/`，由网站静态资源服务提供；校验信息见 `public/resources/manifests/history-ai.json`。

## 已保存的文件

| 来源 | 本地文件 | 保存范围 |
| --- | --- | --- |
| 莱布尼茨《二进制算术的解释》法文转录 | `history/leibniz-binary-full.html` | 完整法文转录文字、转录数表、来源与许可信息；可离线打开，不运行远程脚本 |
| 同上 | `history/leibniz-binary-full.txt` | 完整法文文字，含原始图像链接与缺失扫描状态 |
| 同上 | `history/leibniz-source-body.md` | 所引固定版本的原始正文 Markdown，作为归档脚本的本地输入 |
| ReAct 论文 | `ai/react-2210.03629v3.pdf` | 官方 v3 完整 PDF，保留正文、图表、参考文献及附录，不改动字节 |
| ReAct 署名记录 | `ai/react-attribution.md` | 作者、题名、版本、原址、CC BY 4.0 授权与未修改说明 |

### 莱布尼茨版本与获取过程

- 原始页面：[法文维基文库](https://fr.wikisource.org/wiki/Leibniz-en.francais-Gerhardt.Math.1a7.djvu/Numération.binaire)。
- 固定版本：[11721796](https://fr.wikisource.org/w/index.php?title=Leibniz-en.francais-Gerhardt.Math.1a7.djvu/Numération.binaire&oldid=11721796)。该转录页面最后编辑于 2021 年。
- 书目：Gottfried Wilhelm Leibniz；C. I. Gerhardt 编，*Leibnizens mathematische Schriften* VII，pp. 223–227。法文原作属公共领域；维基文库转录保留贡献者署名与 [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) 信息。
- 2026-10-29 直接读取 MediaWiki API 成功核对到该修订号，随后服务返回 HTTP 429。归档正文使用研究连接器已获取的同一固定版本全文（连接器标注取得时间为 2026-10-06），没有绕过限流或伪称重新取得了更新版本。
- 原转录中的数学表格与措辞原样保留，包括转录表中可能的数字误写；归档本不把转录值作为项目计算结果。
- 本地 HTML 只包含正文与项目加入的出处说明、阅读样式；没有保存或运行网页脚本。其格式经过整理，全文文字没有被替换为摘要。

### 尚未离线保存的两幅扫描图

原转录页以链接指向书页 529、530 的扫描，页面本身没有嵌入图像。这些扫描承载数表与算术例式：

- [书页 529](https://upload.wikimedia.org/wikisource/fr/thumb/6/6c/Leibniz-en.francais-Gerhardt.Math.1a7.djvu/page529-1280px-Leibniz-en.francais-Gerhardt.Math.1a7.djvu.jpg)
- [书页 530](https://upload.wikimedia.org/wikisource/fr/thumb/6/6c/Leibniz-en.francais-Gerhardt.Math.1a7.djvu/page530-1280px-Leibniz-en.francais-Gerhardt.Math.1a7.djvu.jpg)

原链接的 1024px 尺寸被服务器拒绝；根据 [Wikimedia 官方标准尺寸说明](https://www.mediawiki.org/wiki/Common_thumbnail_sizes) 改用允许的 1280px 后，服务返回 HTTP 429。没有绕过服务限制，图片没有伪造成本地文件。两个失败条目保存在 `history-ai-unavailable.json`，本地阅读页也明确显示扫描未保存。因此，**法文转录文字已完整保存，但不能称为包含全部链接扫描图的完整影印归档**。

## ReAct 的全文保存依据

- 原始论文页面：[arXiv:2210.03629](https://arxiv.org/abs/2210.03629)。该页明确显示 [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) 许可链接。
- 保存版本：[2210.03629v3 完整 PDF](https://arxiv.org/pdf/2210.03629v3)，2023-03-10。
- 作者：Shunyu Yao、Jeffrey Zhao、Dian Yu、Nan Du、Izhak Shafran、Karthik Narasimhan、Yuan Cao。
- CC BY 4.0 允许在保留适当署名、许可链接和修改说明的前提下复制与再分发。本次 PDF 未修改，并随附独立署名记录。许可不表示作者认可本项目。

## RAG 全文未镜像

[arXiv:2005.11401](https://arxiv.org/abs/2005.11401) 显示的许可是 [arXiv.org perpetual non-exclusive license](https://arxiv.org/licenses/nonexclusive-distrib/1.0/)。其文本描述作者向 arXiv 授予传播权，并不等于向所有第三方授予可再分发全文的 CC 许可。[NeurIPS 官方版权说明](https://neurips.cc/FAQ/Copyright) 同样说明作者保留版权并向会议授予发布许可。

本次未核实到该篇论文允许公众全文再分发的版本，因此没有把它完整复制到可分发的项目资源目录。原有短引文、项目摘要与原始阅读链接继续保留；未保存状态及原因记录在 `public/resources/manifests/history-ai-unavailable.json`。不能把“网页能在线阅读”标成“已授权本项目全文镜像”。

## 重建与校验

在项目根目录运行 `python scripts/archive-history-ai.py`。脚本使用标准库与已安装的 `requests`，保留 TLS 验证，采用明确的归档工具 User-Agent，遇 HTTP 429 停止该资源下载而不绕过限流。已有的法文正文作为固定版本输入；请求成功并校验格式后才写文件。

每个实际保存文件记录原始 URL、保存时刻、许可、保存范围、字节数与 SHA-256。PDF 检查 `%PDF-` 文件头及末尾 `%%EOF`，文本检查文章开头与最后一句；源页摘要不会被当作全文 PDF。

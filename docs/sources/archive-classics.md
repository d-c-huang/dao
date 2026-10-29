# 经典全文的本地归档

本次按项目资料页实际引用的范围保存原网站正文，而不是继续增加摘录。归档来源为维基文库《周易》及《易传》，查阅日期为 2026-10-29。

## 收录范围

- 《周易》总目录及六十四卦的每个独立页面。
- 《易传·说卦》《易传·系辞上》《易传·系辞下》的全文页面。
- 每页保存可以独立打开的 HTML 与 UTF-8 纯文本。六十四卦页包含所引页面的卦辞、六爻爻辞、彖传、大小象；乾、坤页还保留该页所载文言等正文。
- 原网页中的编辑按钮、执行脚本、外部样式及网站导航外壳未复制。正文中的站内编者信息保留；页面图示使用原有替代文字显示，没有下载网站图标。它是正文全文归档，不是网站界面或图片镜像。

本地入口：[经典全文目录](../../public/resources/classics/index.html)。网站运行时可访问 `/resources/classics/index.html`。HTML 之间使用相对链接，离开网络或从文件夹打开时也可查阅已保存的经典页面；“返回项目资料页”需要本地项目服务运行。

本次实际保存 **68 个来源页面**，各含 HTML 与 TXT，共 136 个原文文件；另有 1 个本地目录，共 **137 个文件、491552 字节**。已检查全部文件的字节数与 SHA-256、64 卦的六个爻位原文，以及 490 个本地相对链接，均通过。

## 来源与归属

- 原始目录：[维基文库《周易》](https://zh.wikisource.org/wiki/周易)。各卦原址均保存在每页页头及清单中。
- 《易传》原址：[说卦](https://zh.wikisource.org/wiki/易傳/說卦)、[系辞上](https://zh.wikisource.org/wiki/易傳/繫辭上)、[系辞下](https://zh.wikisource.org/wiki/易傳/繫辭下)。
- 古典作品正文属于公共领域。维基文库的转录、编者信息与贡献记录按其站点 [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/deed.zh) 条款保留署名和相同方式共享。
- 每个离线页注明来源网址、抓取时间、修订 ID、所存修订链接及贡献者历史入口。由项目生成的外观与本地目录另有说明，不冒充原网站页面。
- 原文依所存修订保留，不沿用项目入门摘编中的标点整理，故全文与摘编可能存在断句或异文差异。

## 文件与复核

实际下载清单为 [`public/resources/manifests/classics.json`](../../public/resources/manifests/classics.json)。每条记录保存 `id`、`sourceId`、原址、下载时间、许可、保存范围、格式、本地路径、字节数、SHA-256 与修订信息。项目生成的目录标有 `generated: true`。

可复跑脚本为 [`scripts/archive-classics.py`](../../scripts/archive-classics.py)：

```powershell
python scripts/archive-classics.py
```

若下载完成后因 Windows 文件监视器短暂占用而中断了清单写入，可使用 `python scripts/archive-classics.py --repair-manifest` 从已保存的完整 HTML/TXT 重建清单。修复模式先核对来源、修订信息和六爻完整性，再重新计算哈希，不发起网络请求；缺少文件或元数据不一致仍会报错。

运行需要 Python 3.10+ 与 `requests`。脚本使用维基媒体公开解析 API，保留 HTTPS 证书检查；最多两个并发，对暂时网络错误作有限重试，并遵守限流返回的等待时间，不绕过验证码或访问控制。已有文件只有在路径与 SHA-256 一致时才复用。缺失或失败的页面会明确报错，不会以摘要或错误页冒充全文。

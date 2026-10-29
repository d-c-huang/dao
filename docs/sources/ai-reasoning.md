# AI 推理方法参考：RAG 与 ReAct

查阅日期：2026-10-29。以下只保存很短的原文引句、书目信息和项目撰写的说明；不是现代论文的全文副本。

## RAG：检索增强生成

- 题名：*Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks*。
- 作者：Patrick Lewis、Ethan Perez、Aleksandra Piktus 等。
- 年份：2020；NeurIPS 2020；arXiv 首次提交日期 2020-05-22。
- 原始来源：[arXiv:2005.11401](https://arxiv.org/abs/2005.11401)。
- 定位：摘要与第 2 节。

> combine pre-trained parametric and non-parametric memory

项目概括：论文将预训练生成模型与可检索的外部资料结合，在特定知识密集型任务上评估。这为“先定位材料，再据材料组织回答”提供研究背景。它不说明检索结果天然可靠，也没有研究八卦视角；本项目没有把离线文本提纲称为运行中的 RAG 系统。

用于项目：原文定位、出处记录及事实核验流程。八卦类比中的“离：证据与解释”由项目设计，不属于论文结论。

## ReAct：推理与行动交替

- 题名：*ReAct: Synergizing Reasoning and Acting in Language Models*。
- 作者：Shunyu Yao、Jeffrey Zhao、Dian Yu、Nan Du、Izhak Shafran、Karthik Narasimhan、Yuan Cao。
- 年份：2022 年预印本，ICLR 2023；arXiv 首次提交日期 2022-10-06。
- 原始来源：[arXiv:2210.03629](https://arxiv.org/abs/2210.03629)。
- 定位：摘要与第 2 节。

> both reasoning traces and task-specific actions

项目概括：论文研究语言模型如何交替组织推理与任务行动，利用行动获得知识库或环境信息，进而调整计划。讨论中的重要区别是：描述一步行动与实际执行该行动是不同状态；只有真实的环境或工具结果才能作为行动结果报告。

用于项目：“计划—行动—观察—修订”的学习流程。页面工具仅输出待执行的提纲，没有执行论文中的方法，也没有测定64卦情境框架的性能收益。

## 与经典文本的关系

八种标签借用了《说卦传》卦德的文化意象，详见 [说卦资料](shuo-gua.md)；现代问题框架见 [六十四卦与 AI 推理说明](../ai-reasoning.md)。论文为实际 AI 方法提供背景，经典原文为文化词语提供出处，二者不互相替代。

## 权利与版本说明

本地各保留一段摘要短引，不复制现代论文全文、图像或现代译文。中文说明、64卦情境与基础维度框架为项目编写。论文的版本、完整实验范围及限制以各自原始页面及全文为准。

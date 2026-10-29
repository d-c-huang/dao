import type { SourceRecord } from './sources';

export const aiSources: SourceRecord[] = [
  {
    id: 'ai-reasoning', category: 'ai',
    title: 'RAG：检索增强生成的原始研究',
    author: 'Patrick Lewis 等',
    locator: 'Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks，2020，摘要与第 2 节',
    url: 'https://arxiv.org/abs/2005.11401', accessed: '2026-10-29',
    excerpt: 'combine pre-trained parametric and non-parametric memory',
    summary: '论文将生成模型与可检索的外部资料结合，并在特定知识密集型任务中评估效果。对本项目的启发是：涉及《周易》事实时，先定位原文和出处，再据材料组织解释。检索到内容不等于内容已经核验；本项目的离线提纲工具没有运行检索模型。',
    usage: '“六十四卦与 AI 推理”中的资料检索、原文定位与依据记录；64卦情境及基础维度由项目设计，论文未研究这种分类。',
    localPath: 'docs/sources/ai-reasoning.md',
    rights: '仅保留摘要中的短引文与项目撰写的中文概括；未复制论文全文或图表。',
  },
  {
    id: 'ai-react', category: 'ai',
    title: 'ReAct：推理与行动交替的原始研究',
    author: 'Shunyu Yao、Jeffrey Zhao、Dian Yu 等',
    locator: 'ReAct: Synergizing Reasoning and Acting in Language Models，2022 年预印本，ICLR 2023；摘要与第 2 节',
    url: 'https://arxiv.org/abs/2210.03629', accessed: '2026-10-29',
    excerpt: 'both reasoning traces and task-specific actions',
    summary: '论文研究语言模型交替组织推理与任务行动，使行动能从知识库或环境获得额外信息，并据此调整任务计划。它支持讨论“计划—行动—观察—修订”的实际系统设计；不意味着仅写出行动步骤便已经执行，也不为八卦标签提供效果保证。',
    usage: '“六十四卦与 AI 推理”中的行动、观察与复核流程；本地工具只整理待执行的提纲。',
    localPath: 'docs/sources/ai-reasoning.md',
    rights: '保留摘要短引文、作者和原始链接；中文解释为项目整理，未复制现代论文全文或图表。',
  },
];

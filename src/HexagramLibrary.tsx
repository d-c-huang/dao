import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { ArrowLeft, ArrowRight, ArrowUpRight, BookOpen, Grid2X2, LayoutGrid, RotateCcw, Search } from 'lucide-react';
import { trigrams } from './data';
import { Gua } from './Gua';
import { binaryLabel, encodeBits } from './math';
import { hexagrams } from './hexagrams';
import { hexagramBits } from './hexagramStructure';
import './hexagrams.css';

function searchable(value: string) {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[\s·・'’\-]/g, '').toLowerCase();
}

type ReadingPanel = 'catalog' | 'reading';

export function HexagramLibrary({ initialNumber, initialQuery = '', onSources }: {
  initialNumber?: number;
  initialQuery?: string;
  onSources: (id?: string) => void;
}) {
  const [selectedNumber, setSelectedNumber] = useState(() =>
    hexagrams.some(hexagram => hexagram.number === initialNumber) ? initialNumber! : 1,
  );
  const [query, setQuery] = useState(initialQuery);
  const [upperFilter, setUpperFilter] = useState('');
  const [lowerFilter, setLowerFilter] = useState('');
  const [view, setView] = useState<'cards' | 'matrix'>('cards');
  const [panel, setPanel] = useState<ReadingPanel>(initialNumber && initialNumber > 1 && !initialQuery ? 'reading' : 'catalog');
  const libraryRef = useRef<HTMLDivElement>(null);
  const detailRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const catalogRef = useRef<HTMLElement>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const pendingFocus = useRef(false);
  const pendingCatalogScroll = useRef(false);

  useEffect(() => {
    if (!hexagrams.some(hexagram => hexagram.number === initialNumber)) return;
    setSelectedNumber(initialNumber!);
    if (initialNumber! > 1 && !initialQuery) setPanel('reading');
  }, [initialNumber, initialQuery]);

  useEffect(() => {
    setQuery(initialQuery);
    if (initialQuery) setPanel('catalog');
  }, [initialQuery]);

  useEffect(() => {
    if (pendingCatalogScroll.current) {
      pendingCatalogScroll.current = false;
      catalogRef.current?.scrollIntoView({ block: 'start' });
    }
    if (!pendingFocus.current) return;
    pendingFocus.current = false;
    detailRef.current?.scrollTo({ top: 0 });
    headingRef.current?.focus({ preventScroll: true });
    if ((libraryRef.current?.getBoundingClientRect().width ?? 0) < 900) {
      detailRef.current?.scrollIntoView({ block: 'start' });
    }
  }, [selectedNumber, panel]);

  const selected = hexagrams.find(hexagram => hexagram.number === selectedNumber)!;
  const bits = hexagramBits(selected);
  const normalizedQuery = searchable(query.trim());
  const numberQuery = query.trim().match(/^(?:第\s*|#\s*)?(\d+)\s*卦?$/);
  const filtered = hexagrams.filter(hexagram => {
    const matchesQuery = !normalizedQuery || (numberQuery
      ? hexagram.number === Number(numberQuery[1])
      : searchable([hexagram.name, hexagram.traditionalName, hexagram.title, hexagram.pinyin, ...hexagram.keywords].join(' ')).includes(normalizedQuery));
    return matchesQuery && (!upperFilter || hexagram.upper === upperFilter) && (!lowerFilter || hexagram.lower === lowerFilter);
  });
  const matchingNumbers = new Set(filtered.map(hexagram => hexagram.number));
  const previous = hexagrams.find(hexagram => hexagram.number === selectedNumber - 1);
  const next = hexagrams.find(hexagram => hexagram.number === selectedNumber + 1);
  const filtersActive = Boolean(query || upperFilter || lowerFilter);

  function resetFilters() {
    setQuery('');
    setUpperFilter('');
    setLowerFilter('');
    setPanel('catalog');
  }

  function selectHexagram(number: number) {
    if (number === selectedNumber && panel === 'reading') {
      detailRef.current?.scrollTo({ top: 0 });
      headingRef.current?.focus({ preventScroll: true });
      if ((libraryRef.current?.getBoundingClientRect().width ?? 0) < 900) detailRef.current?.scrollIntoView({ block: 'start' });
      return;
    }
    pendingFocus.current = true;
    setSelectedNumber(number);
    setPanel('reading');
  }

  function changePanel(nextPanel: ReadingPanel) {
    if (nextPanel === 'catalog') {
      if (panel === 'catalog') catalogRef.current?.scrollIntoView({ block: 'start' });
      else pendingCatalogScroll.current = true;
    }
    setPanel(nextPanel);
  }

  function handleTabKey(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let nextIndex: number;
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') nextIndex = 1 - index;
    else if (event.key === 'Home') nextIndex = 0;
    else if (event.key === 'End') nextIndex = 1;
    else return;
    event.preventDefault();
    setPanel(nextIndex === 0 ? 'catalog' : 'reading');
    tabRefs.current[nextIndex]?.focus();
  }

  return <div className="hexagram-library" data-panel={panel} ref={libraryRef}>
    <div className="panel hx-filters" aria-label="六十四卦查找">
      <div className="hx-search-field"><label htmlFor="hexagram-search">查找一卦</label><div className="hx-search"><Search size={18} aria-hidden="true"/><input id="hexagram-search" type="search" aria-label="搜索卦名、拼音、卦序或关键词" value={query} onChange={event => {setQuery(event.target.value);setPanel('catalog');}} placeholder="卦名、拼音、卦序或关键词" autoComplete="off"/></div></div>
      <label className="hx-filter-label" htmlFor="hexagram-upper-filter">上卦<select id="hexagram-upper-filter" aria-label="按上卦筛选" value={upperFilter} onChange={event => {setUpperFilter(event.target.value);setPanel('catalog');}}><option value="">全部上卦</option>{trigrams.map(trigram => <option key={trigram.name} value={trigram.name}>{trigram.name} · {trigram.image}</option>)}</select></label>
      <label className="hx-filter-label" htmlFor="hexagram-lower-filter">下卦<select id="hexagram-lower-filter" aria-label="按下卦筛选" value={lowerFilter} onChange={event => {setLowerFilter(event.target.value);setPanel('catalog');}}><option value="">全部下卦</option>{trigrams.map(trigram => <option key={trigram.name} value={trigram.name}>{trigram.name} · {trigram.image}</option>)}</select></label>
      <button className="hx-reset" onClick={resetFilters} disabled={!filtersActive}><RotateCcw size={16}/>重置筛选</button>
    </div>

    <div className="hx-panel-tabs" role="tablist" aria-label="目录与解析">
      <button id="hx-catalog-tab" ref={element => {tabRefs.current[0] = element;}} role="tab" aria-selected={panel === 'catalog'} aria-controls="hx-catalog" tabIndex={panel === 'catalog' ? 0 : -1} onKeyDown={event => handleTabKey(event, 0)} onClick={() => changePanel('catalog')}><LayoutGrid size={16}/>卦象目录 <span>{filtered.length}</span></button>
      <button id="hx-reading-tab" ref={element => {tabRefs.current[1] = element;}} role="tab" aria-selected={panel === 'reading'} aria-controls="hx-reading" tabIndex={panel === 'reading' ? 0 : -1} onKeyDown={event => handleTabKey(event, 1)} onClick={() => changePanel('reading')}><BookOpen size={16}/>当前解析 <span>{selected.name}</span></button>
    </div>

    <div className="hx-workspace">
      <section className="hx-directory" id="hx-catalog" ref={catalogRef} role="tabpanel" aria-labelledby="hx-catalog-tab">
        <div className="hx-directory-title"><div><h2 id="hexagram-directory-title">六十四卦目录</h2><span role="status">找到 <b>{filtered.length}</b> 卦 · 共 {hexagrams.length} 卦</span></div><div className="hx-view-toggle" role="group" aria-label="目录显示方式"><button aria-label="卦序图鉴" aria-pressed={view === 'cards'} className={view === 'cards' ? 'active' : ''} onClick={() => setView('cards')}><LayoutGrid size={16}/><span>卦序</span></button><button aria-label="上下卦矩阵" aria-pressed={view === 'matrix'} className={view === 'matrix' ? 'active' : ''} onClick={() => setView('matrix')}><Grid2X2 size={16}/><span>矩阵</span></button></div></div>
        <p className="hx-directory-hint">{view === 'cards' ? '按通行卦序排列，点选一卦开始阅读。' : '行是上卦，列是下卦；交点即为对应重卦。'}</p>
        {filtered.length === 0 ? <div className="hx-empty"><Search size={30} strokeWidth={1.2}/><h3>暂时没有匹配的卦</h3><p>换一个卦名、拼音或卦序，或清除筛选。</p><button className="primary" onClick={resetFilters}>显示全部六十四卦 <RotateCcw size={15}/></button></div> : view === 'cards' ?
          <div className="hx-catalog-scroll" tabIndex={0} role="region" aria-label="六十四卦卡片，可上下滚动"><div className="hx-card-grid">{filtered.map(hexagram => <button key={hexagram.number} className={`hx-card ${hexagram.number === selectedNumber ? 'is-selected' : ''}`} aria-pressed={hexagram.number === selectedNumber} aria-label={`阅读第${hexagram.number}卦${hexagram.title}`} onClick={() => selectHexagram(hexagram.number)}><div><span className="hx-card-number">{String(hexagram.number).padStart(2, '0')}</span><strong>{hexagram.name}</strong><small>{hexagram.title}</small></div><Gua bits={hexagramBits(hexagram)} size={32}/></button>)}</div></div> :
          <div className="hx-matrix-scroll" tabIndex={0} role="region" aria-label="六十四卦组合矩阵，可左右滚动"><table className="hx-matrix"><caption className="hx-sr-only">上卦 × 下卦 ＝ 六十四卦；筛选之外的组合以浅色显示。</caption><thead><tr><th scope="col" className="hx-matrix-corner">上卦 ↓<br/>下卦 →</th>{trigrams.map(lower => <th key={lower.name} scope="col"><Gua bits={lower.bits} size={22}/><span>{lower.name}</span></th>)}</tr></thead><tbody>{trigrams.map(upper => <tr key={upper.name}><th scope="row"><Gua bits={upper.bits} size={22}/><span>{upper.name}</span></th>{trigrams.map(lower => {
            const hexagram = hexagrams.find(item => item.upper === upper.name && item.lower === lower.name)!;
            return <td key={lower.name}><button disabled={!matchingNumbers.has(hexagram.number)} className={selectedNumber === hexagram.number ? 'is-selected' : ''} aria-pressed={selectedNumber === hexagram.number} aria-label={`第${hexagram.number}卦${hexagram.title}，上${upper.name}下${lower.name}`} onClick={() => selectHexagram(hexagram.number)}><b>{hexagram.name}</b><small>{String(hexagram.number).padStart(2, '0')}</small></button></td>;
          })}</tr>)}</tbody></table></div>}
        <details className="hx-reading-guide"><summary>如何阅读上下卦与经传？</summary><p>六爻从下往上数：下三爻组成下卦，上三爻组成上卦。卦辞属于《周易》经文，大象属于《象传》。入门解释与关键词由项目整理。</p></details>
      </section>

      <section className="panel hx-detail" id="hx-reading" ref={detailRef} role="tabpanel" aria-labelledby="hx-reading-tab">
        <div className="hx-reader-label"><span>当前阅读</span><span>{String(selected.number).padStart(2, '0')} / {hexagrams.length}</span></div>
        <div className="hx-reader-head"><div className="hx-reader-glyph"><Gua bits={bits} size={76}/></div><div><span className="hx-reader-order">文王卦序 · 第 {selected.number} 卦</span><h2 id="hexagram-detail-title" ref={headingRef} tabIndex={-1}>{selected.title}</h2><div className="hx-pinyin">{selected.pinyin}</div><div className="hx-trigram-pair"><span>上卦 <b>{selected.upper}</b></span><span>下卦 <b>{selected.lower}</b></span></div></div></div>
        <div className="hx-keywords">{selected.keywords.map(keyword => <span key={keyword}>{keyword}</span>)}</div>
        {!matchingNumbers.has(selected.number) && <p className="hx-outside-filter">当前阅读的卦不在筛选结果中，点选目录可切换。</p>}
        <div className="hx-reader-content"><h3>入门理解 <span>项目整理</span></h3><p className="hx-summary">{selected.summary}</p><h3>卦辞 <span>经文原文</span></h3><blockquote className="hx-original">{selected.judgment}</blockquote><h3>大象传 <span>传文原文</span></h3><blockquote className="hx-original hx-image-text">{selected.imageText}</blockquote>
          <div className="hx-source-actions"><a href={selected.sourceUrl} target="_blank" rel="noreferrer">核对本卦原文 <ArrowUpRight size={15}/></a><button onClick={() => onSources('zhou-yi-64')}>阅读本地出处 <ArrowRight size={15}/></button></div>
          <details className="hx-encoding"><summary>查看六爻结构编码</summary><code>{binaryLabel(bits)}<sub>2</sub> ＝ {encodeBits(bits)}<sub>10</sub></code><p>沿用本项目初爻为最低位、阳为 1 的编码约定；文王卦序用于排列经文，两者分别使用。</p></details>
        </div>
        <div className="hx-sequence-nav"><button disabled={!previous} onClick={() => previous && selectHexagram(previous.number)} aria-label={previous ? `上一卦：第${previous.number}卦${previous.name}` : '已是第一卦'}><ArrowLeft size={16}/><span>上一卦{previous && <small>{previous.number} · {previous.name}</small>}</span></button><button disabled={!next} onClick={() => next && selectHexagram(next.number)} aria-label={next ? `下一卦：第${next.number}卦${next.name}` : '已是最后一卦'}><span>下一卦{next && <small>{next.number} · {next.name}</small>}</span><ArrowRight size={16}/></button></div>
      </section>
    </div>
  </div>;
}

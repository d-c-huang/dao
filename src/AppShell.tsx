import { useEffect, useRef, useState, type ReactNode } from 'react';
import { ArrowRight, ArrowUpRight, BookOpen, Braces, CalendarDays, ChevronRight, Compass, FlaskConical, Grid2X2, Layers, Library, Menu, Network, RotateCcw, Search, X } from 'lucide-react';
import './experience.css';

const navigationGroups = [
  { title: '开始探索', items: [{ name: '探索首页', icon: Compass }] },
  { title: '基础与图鉴', items: [
    { name: '原理入门', icon: BookOpen },
    { name: '八卦图鉴', icon: Layers },
    { name: '六十四卦', icon: Grid2X2 },
    { name: '五行与干支', icon: Layers },
    { name: '天文与历法', icon: CalendarDays },
    { name: '先后天对照', icon: RotateCcw },
  ] },
  { title: '连接与实践', items: [
    { name: '八卦与数学', icon: Braces },
    { name: '六十四卦与AI推理', icon: Network },
    { name: '术数工坊', icon: Grid2X2 },
    { name: '应用实验室', icon: FlaskConical },
  ] },
  { title: '阅读资料', items: [{ name: '资料与出处', icon: Library }] },
];

export function AppShell({ page, onNavigate, onSearch, children }: {
  page: string;
  onNavigate: (page: string) => void;
  onSearch: () => void;
  children: ReactNode;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [compact, setCompact] = useState(() => typeof window !== 'undefined' && window.matchMedia('(max-width: 1050px)').matches);
  const sidebarRef = useRef<HTMLElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const media = window.matchMedia('(max-width: 1050px)');
    const update = () => {
      setCompact(media.matches);
      if (!media.matches) setMenuOpen(false);
    };
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [page]);

  useEffect(() => {
    if (!compact || !menuOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    sidebarRef.current?.querySelector<HTMLElement>('[aria-current="page"]')?.focus();
    function onKeyDown(event: KeyboardEvent) {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        setMenuOpen(false);
        return;
      }
      if (event.key === 'Escape') {
        event.preventDefault();
        setMenuOpen(false);
      }
      if (event.key !== 'Tab') return;
      const items = [...(sidebarRef.current?.querySelectorAll<HTMLElement>('button:not([disabled]), a[href], [tabindex="0"]') ?? [])];
      const first = items[0];
      const last = items[items.length - 1];
      if (!first || !last) return;
      if (event.shiftKey && (document.activeElement === first || !sidebarRef.current?.contains(document.activeElement))) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && (document.activeElement === last || !sidebarRef.current?.contains(document.activeElement))) {
        event.preventDefault();
        first.focus();
      }
    }
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', onKeyDown);
      if (sidebarRef.current?.contains(document.activeElement) || document.activeElement === document.body) {
        menuButtonRef.current?.focus({ preventScroll: true });
      }
    };
  }, [compact, menuOpen]);

  function navigate(name: string) {
    setMenuOpen(false);
    onNavigate(name);
  }

  return <div className="app-shell">
    <a className="app-skip-link" href="#site-main" onClick={event => {
      event.preventDefault();
      const content = document.getElementById('site-main');
      content?.focus({ preventScroll: true });
      content?.scrollIntoView({ block: 'start' });
    }}>跳到页面内容</a>
    {compact && menuOpen && <div className="app-nav-overlay" aria-hidden="true" onClick={() => setMenuOpen(false)}/>}
    <aside ref={sidebarRef} id="app-navigation" className={`app-sidebar ${menuOpen ? 'is-open' : ''}`} role={compact && menuOpen ? 'dialog' : undefined} aria-modal={compact && menuOpen ? true : undefined} aria-label="学习导航" aria-hidden={compact && !menuOpen ? true : undefined} inert={compact && !menuOpen}>
      <div className="app-sidebar-brand-row">
        <button className="app-brand" onClick={() => navigate('探索首页')} aria-label="八象有解，返回探索首页">
          <svg viewBox="0 0 34 34" width="34" height="34" aria-hidden="true"><g fill="currentColor"><rect x="3" y="5" width="28" height="5"/><rect x="3" y="15" width="11" height="5"/><rect x="20" y="15" width="11" height="5"/><rect x="3" y="25" width="28" height="5"/></g></svg>
          <span>八象有解<small>EIGHT TRIGRAMS, EXPLAINED</small></span>
        </button>
        <button className="app-sidebar-close" aria-label="关闭导航" onClick={() => setMenuOpen(false)}><X size={20}/></button>
      </div>

      <nav className="app-nav" aria-label="主导航">
        {navigationGroups.map(group => <div className="app-nav-group" key={group.title}>
          <div className="app-nav-label">{group.title}</div>
          {group.items.map(item => <button key={item.name} className={`app-nav-item ${page === item.name ? 'is-current' : ''}`} aria-current={page === item.name ? 'page' : undefined} onClick={() => navigate(item.name)}>
            <item.icon size={18} strokeWidth={1.65}/><span>{item.name}</span>{page === item.name && <span className="app-nav-dot" aria-hidden="true"/>}
          </button>)}
        </div>)}
      </nav>

      <button className="app-sidebar-note" onClick={() => navigate('资料与出处')}>
        <span>阅读有据，应用有界。</span><small>原文、释义与现代探索<ArrowRight size={14}/></small>
      </button>
    </aside>

    <div className="app-workspace">
      <div className="workspace-toolbar" role="banner">
        <div className="workspace-location">
          <button ref={menuButtonRef} className="app-menu-toggle" aria-label="打开学习导航" aria-controls="app-navigation" aria-expanded={menuOpen} onClick={() => setMenuOpen(true)}><Menu size={21}/></button>
          <span className="workspace-breadcrumb-label">学习与探索</span><ChevronRight className="workspace-breadcrumb-divider" size={14}/><span className="workspace-current-page">{page}</span>
        </div>
        <button className="workspace-search" aria-label="搜索知识" onClick={onSearch}><Search size={17}/><span>搜索知识</span><kbd className="workspace-search-hint">Ctrl K</kbd></button>
      </div>
      <div className="workspace-body" id="site-main" tabIndex={-1}>{children}<footer className="workspace-footer"><div className="footer-brand">八象有解<span>传统文化 · 数学与推理</span></div><button onClick={() => navigate('资料与出处')}>阅读资料与出处<ArrowUpRight size={14}/></button></footer></div>
    </div>
  </div>;
}

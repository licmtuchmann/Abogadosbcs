import { useEffect, useMemo, useState } from 'react';
import { Scale, BookOpenCheck, NotebookPen, CalendarClock, FileType2, Maximize2, Minimize2, ShieldCheck, WifiOff, Wifi } from 'lucide-react';
import { loadDataset } from './lib/data';
import { makeIndex, searchIndex } from './lib/search';
import SearchBar from './components/SearchBar';
import Filters from './components/Filters';
import Results from './components/Results';
import ArticleDetail from './components/ArticleDetail';
import PrecedenteDetail from './components/PrecedenteDetail';
import CompendioDetail from './components/CompendioDetail';
import Notebook from './components/Notebook';
import DeadlineCalc from './components/DeadlineCalc';
import Templates from './components/Templates';

const TABS = [
  { id: 'buscar', label: 'Buscar', icon: BookOpenCheck },
  { id: 'cuaderno', label: 'Cuaderno', icon: NotebookPen },
  { id: 'plazos', label: 'Plazos', icon: CalendarClock },
  { id: 'plantillas', label: 'Plantillas', icon: FileType2 },
];

export default function App() {
  const [tab, setTab] = useState('buscar');
  const [data, setData] = useState(null);
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState({ kind: 'todos', organo: 'todos', libro: 'todos' });
  const [selected, setSelected] = useState(null);
  const [hearing, setHearing] = useState(false);
  const [online, setOnline] = useState(navigator.onLine);

  useEffect(() => {
    loadDataset().then(setData);
    const u = () => setOnline(navigator.onLine);
    window.addEventListener('online', u);
    window.addEventListener('offline', u);
    return () => { window.removeEventListener('online', u); window.removeEventListener('offline', u); };
  }, []);

  const index = useMemo(() => data ? makeIndex(data) : null, [data]);
  const results = useMemo(() => index ? searchIndex(index, query, filters) : [], [index, query, filters]);

  const articleIndex = useMemo(() => {
    if (!data) return {};
    return Object.fromEntries(data.cnpp.articles.map(a => [a.id, a]));
  }, [data]);

  function openItem(item) {
    if (item.kind === 'articulo') setSelected({ kind: 'articulo', article: item.raw });
    else if (item.kind === 'compendio') setSelected({ kind: 'compendio', compendio: item });
    else setSelected({ kind: 'precedente', precedente: item });
  }
  function openNote(note) {
    if (!data) return;
    if (note.kind === 'articulo') {
      const a = articleIndex[String(note.ref_id)];
      if (a) setSelected({ kind: 'articulo', article: a });
    } else {
      // Find the precedente by id from index
      const p = (data.precedentes.items || []).find(x => String(x.id || x.registro || x.numero) === String(note.ref_id));
      if (p) setSelected({ kind: 'precedente', precedente: { raw: p } });
    }
    setTab('buscar');
  }

  function precedentesForArticle(artId) {
    if (!data) return [];
    return data.precedentes.items
      .filter(p => (p.articulos_relacionados || []).map(String).includes(String(artId)))
      .map(p => ({ id: 'pre:' + (p.id || p.registro), heading: p.rubro || p.titulo, organo: p.organo, raw: p }));
  }

  if (!data) {
    return (
      <div className="min-h-full flex items-center justify-center text-slate-500">
        Cargando dataset verificado...
      </div>
    );
  }

  const { metadata, articles } = data.cnpp;
  const articleCount = articles.length;
  const precedenteCount = data.precedentes.items.length;
  const compendioCount = data.compendios?.items?.length || 0;

  return (
    <div className={`min-h-full ${hearing ? 'hearing-mode' : ''}`}>
      <header className="sticky top-0 z-40 bg-slate-900 text-white border-b border-slate-800 no-print">
        <div className="max-w-6xl mx-auto px-3 sm:px-5 py-2.5 flex items-center gap-3">
          <div className="flex items-center gap-2 min-w-0">
            <Scale size={20} className="shrink-0" />
            <div className="min-w-0">
              <div className="font-semibold tracking-tight truncate">Buscador Penal MX</div>
              <div className="text-[10px] text-slate-400 truncate">CNPP DOF {metadata.vigente_dof} · {articleCount} artículos</div>
            </div>
          </div>
          <div className="flex-1" />
          <div className="hidden sm:flex items-center gap-1.5 text-[11px]">
            <ShieldCheck size={14} className="text-emerald-400" />
            <span className="text-slate-300">Citas con fuente obligatoria</span>
          </div>
          <button
            onClick={() => setHearing(h => !h)}
            title={hearing ? 'Salir del modo audiencia' : 'Modo audiencia (texto grande)'}
            className="text-xs px-2.5 py-1.5 rounded border border-slate-700 hover:bg-slate-800 inline-flex items-center gap-1.5"
          >
            {hearing ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
            <span className="hidden sm:inline">{hearing ? 'Normal' : 'Audiencia'}</span>
          </button>
          <span title={online ? 'Conectado' : 'Sin conexión — usando caché'} className={`p-1.5 rounded ${online ? 'text-emerald-400' : 'text-amber-400'}`}>
            {online ? <Wifi size={14} /> : <WifiOff size={14} />}
          </span>
        </div>

        <nav className="max-w-6xl mx-auto px-2 sm:px-5 flex gap-1 overflow-x-auto no-scrollbar">
          {TABS.map(t => {
            const Icon = t.icon;
            const active = tab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => { setTab(t.id); setSelected(null); }}
                className={`shrink-0 inline-flex items-center gap-1.5 text-sm px-3 py-2 border-b-2 transition ${active ? 'border-amber-400 text-white' : 'border-transparent text-slate-300 hover:text-white'}`}
              >
                <Icon size={14} /> {t.label}
              </button>
            );
          })}
        </nav>
      </header>

      <main className="max-w-6xl mx-auto px-3 sm:px-5 py-4 sm:py-6 pb-32">
        {tab === 'buscar' && (
          selected ? (
            selected.kind === 'articulo' ? (
              <ArticleDetail
                article={selected.article}
                vigenteDOF={metadata.vigente_dof}
                onBack={() => setSelected(null)}
                relatedPrecedentes={precedentesForArticle(selected.article.id)}
                onOpenPrecedente={p => setSelected({ kind: 'precedente', precedente: p })}
              />
            ) : selected.kind === 'compendio' ? (
              <CompendioDetail
                compendio={selected.compendio}
                onBack={() => setSelected(null)}
              />
            ) : (
              <PrecedenteDetail
                precedente={selected.precedente}
                onBack={() => setSelected(null)}
                onOpenArticle={a => setSelected({ kind: 'articulo', article: a })}
                articleIndex={articleIndex}
              />
            )
          ) : (
            <div className="space-y-3">
              <SearchBar value={query} onChange={setQuery} onClear={() => setQuery('')} />
              <div className="grid lg:grid-cols-[280px_1fr] gap-4">
                <aside className="space-y-3 lg:sticky lg:top-[112px] lg:self-start">
                  <Filters value={filters} onChange={setFilters} articleCount={articleCount} precedenteCount={precedenteCount} compendioCount={compendioCount} />
                  <div className="text-[11px] text-slate-500 leading-relaxed border-t border-slate-200 pt-3">
                    <div className="font-semibold text-slate-700 mb-1">Garantías de integridad</div>
                    Todas las entradas requieren URL fuente. Si no hay coincidencias verificables, el resultado es <em>No encontrado</em>: la app no inventa textos ni precedentes.
                  </div>
                </aside>
                <div className="space-y-2">
                  <div className="text-xs text-slate-500">
                    {query ? `${results.length} resultado${results.length === 1 ? '' : 's'} para "${query}"` : 'Empieza a escribir un derecho, tema o número de artículo (Ctrl+K)'}
                  </div>
                  <Results results={results} query={query} onOpen={openItem} />
                  {precedenteCount === 0 && compendioCount === 0 ? (
                    <div className="mt-3 text-[12px] text-slate-600 bg-slate-100 border border-slate-200 rounded-lg p-3">
                      <strong>Precedentes pendientes de ingesta.</strong> El pipeline <code className="mono">scripts/ingest</code> los descargará desde SJF/SCJN y CorteIDH; cada viernes la GitHub Action publica las novedades. Mientras tanto, la búsqueda opera sobre los {articleCount} artículos vigentes del CNPP.
                    </div>
                  ) : (
                    <div className="mt-3 text-[12px] text-slate-600 bg-emerald-50 border border-emerald-200 rounded-lg p-3">
                      <strong>{precedenteCount}</strong> precedente{precedenteCount === 1 ? '' : 's'} y <strong>{compendioCount}</strong> compendio{compendioCount === 1 ? '' : 's'} (SCJN / UNAM) con URL oficial verificada. El contenido marcado <em>texto pendiente</em> abre la fuente original; la ingesta semanal lo importa al índice.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        )}

        {tab === 'cuaderno' && <Notebook onOpen={openNote} />}
        {tab === 'plazos' && <DeadlineCalc />}
        {tab === 'plantillas' && <Templates />}
      </main>

      <footer className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur border-t border-slate-200 no-print">
        <div className="max-w-6xl mx-auto px-3 py-1.5 text-[10px] text-slate-500 flex items-center justify-between gap-2">
          <span>CNPP: Cámara de Diputados · Reformas {metadata.versions_processed?.join(' → ') || '—'}</span>
          <span className="hidden sm:inline">Generado {new Date(metadata.generated_at).toLocaleDateString('es-MX')}</span>
        </div>
      </footer>
    </div>
  );
}

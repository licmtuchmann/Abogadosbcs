import { BookOpen, Gavel, History } from 'lucide-react';
import { highlight } from '../lib/search';

export default function Results({ results, query, onOpen, emptyHint }) {
  if (!results.length) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 bg-white p-6 text-center text-slate-500">
        <div className="font-medium text-slate-700 mb-1">No encontrado</div>
        <div className="text-sm">{emptyHint || 'No hay coincidencias en el dataset verificado. Prueba con sinónimos o términos más generales.'}</div>
      </div>
    );
  }

  return (
    <ul className="space-y-2">
      {results.map(r => (
        <li key={r.item.id}>
          <button
            onClick={() => onOpen(r.item)}
            className="w-full text-left bg-white border border-slate-200 hover:border-slate-400 hover:shadow-sm rounded-xl p-3 sm:p-4 transition group"
          >
            <div className="flex items-start gap-3">
              <div className={`shrink-0 mt-0.5 rounded-lg p-2 ${r.item.kind === 'articulo' ? 'bg-slate-900 text-white' : 'bg-amber-500 text-white'}`}>
                {r.item.kind === 'articulo' ? <BookOpen size={16} /> : <Gavel size={16} />}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                  <span className={`text-xs font-medium uppercase tracking-wide ${r.item.kind === 'articulo' ? 'text-slate-500' : 'text-amber-700'}`}>
                    {r.item.kind === 'articulo' ? 'CNPP' : (r.item.organo || 'Precedente')}
                  </span>
                  <span className="text-sm font-semibold text-slate-900">
                    {r.item.label}
                  </span>
                  {r.item.kind === 'articulo' && r.item.raw.history?.length > 0 && (
                    <span className="inline-flex items-center gap-1 text-[10px] text-amber-700 bg-amber-50 border border-amber-200 rounded px-1.5 py-0.5">
                      <History size={10} /> {r.item.raw.history.length} reforma{r.item.raw.history.length > 1 ? 's' : ''}
                    </span>
                  )}
                </div>
                <div
                  className="text-[15px] text-slate-900 font-medium mt-0.5 line-clamp-2"
                  dangerouslySetInnerHTML={{ __html: highlight(r.item.heading || r.item.title, query) }}
                />
                <div
                  className="text-sm text-slate-600 mt-1 line-clamp-3"
                  dangerouslySetInnerHTML={{ __html: highlight((r.item.body || '').slice(0, 280), query) }}
                />
                {r.item.kind === 'articulo' && (
                  <div className="text-[11px] text-slate-400 mt-1.5 truncate">
                    {[r.item.book, r.item.title_section, r.item.chapter].filter(Boolean).join(' › ')}
                  </div>
                )}
              </div>
            </div>
          </button>
        </li>
      ))}
    </ul>
  );
}

import { useState } from 'react';
import { Trash2, FileText, Download } from 'lucide-react';
import { loadNotebooks, saveNotebooks, removeNote } from '../lib/storage';
import { copyToClipboard } from '../lib/citation';

export default function Notebook({ onOpen }) {
  const [notebooks, setNotebooks] = useState(loadNotebooks());
  const nb = notebooks[0];

  function refresh() { setNotebooks(loadNotebooks()); }
  function del(id) { removeNote(nb.id, id); refresh(); }
  function clearAll() {
    if (!confirm('¿Vaciar el cuaderno?')) return;
    nb.notes = [];
    saveNotebooks(notebooks);
    refresh();
  }
  function exportMD() {
    const lines = [`# ${nb.name}`, `_Exportado: ${new Date().toLocaleString('es-MX')}_`, ''];
    for (const n of nb.notes) {
      if (n.kind === 'articulo') {
        lines.push(`## ${n.label}. ${n.heading}`);
        lines.push(n.text || '');
        lines.push(`> Fuente: ${n.source_url} — DOF ${n.vigenteDOF}`);
      } else {
        lines.push(`## ${n.heading || n.label}`);
        lines.push(`_${n.organo || ''}_`);
        lines.push(n.text || '');
        lines.push(`> Fuente: ${n.source_url}`);
      }
      lines.push('');
    }
    const md = lines.join('\n');
    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cuaderno-${new Date().toISOString().slice(0,10)}.md`;
    a.click();
    URL.revokeObjectURL(url);
  }

  if (!nb.notes.length) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 bg-white p-6 text-center text-slate-500">
        <div className="font-medium text-slate-700 mb-1">Cuaderno vacío</div>
        <div className="text-sm">Guarda artículos y precedentes desde la vista de detalle para tenerlos aquí, listos para tu audiencia o escrito.</div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">{nb.name}</h2>
          <div className="text-xs text-slate-500">{nb.notes.length} elemento{nb.notes.length === 1 ? '' : 's'}</div>
        </div>
        <div className="flex gap-2">
          <button onClick={exportMD} className="text-xs px-2.5 py-1.5 rounded border bg-white border-slate-300 hover:border-slate-500 inline-flex items-center gap-1.5">
            <Download size={14} /> Exportar Markdown
          </button>
          <button onClick={clearAll} className="text-xs px-2.5 py-1.5 rounded border bg-white border-red-200 text-red-700 hover:bg-red-50 inline-flex items-center gap-1.5">
            <Trash2 size={14} /> Vaciar
          </button>
        </div>
      </div>

      <ul className="space-y-2">
        {nb.notes.map(n => (
          <li key={n.id} className="bg-white border border-slate-200 rounded-xl p-3 sm:p-4">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                <div className="text-[11px] uppercase tracking-wide text-slate-400">
                  {n.kind === 'articulo' ? `CNPP · ${n.label}` : `Precedente · ${n.organo || ''}`}
                </div>
                <div className="text-base font-semibold text-slate-900 truncate">{n.heading || n.label}</div>
                <div className="text-sm text-slate-600 line-clamp-3 mt-1 whitespace-pre-wrap">{(n.text || '').slice(0, 400)}</div>
                <div className="text-[10px] text-slate-400 mt-2">
                  Guardado el {new Date(n.created_at).toLocaleString('es-MX')}
                </div>
              </div>
              <div className="flex flex-col gap-1.5 shrink-0">
                <button onClick={() => onOpen(n)} title="Abrir" className="text-xs px-2 py-1 rounded border bg-white border-slate-300 hover:border-slate-500 inline-flex items-center gap-1">
                  <FileText size={12} />
                </button>
                <button onClick={() => copyToClipboard(`${n.heading || n.label}\n${n.text}\n${n.source_url || ''}`)} title="Copiar todo" className="text-xs px-2 py-1 rounded border bg-white border-slate-300 hover:border-slate-500">
                  Copiar
                </button>
                <button onClick={() => del(n.id)} title="Borrar" className="text-xs px-2 py-1 rounded border bg-white border-red-200 text-red-700 hover:bg-red-50">
                  <Trash2 size={12} />
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

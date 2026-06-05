import { Filter } from 'lucide-react';

const KINDS = [
  { id: 'todos', label: 'Todos' },
  { id: 'articulo', label: 'CNPP' },
  { id: 'precedente', label: 'Precedentes' },
  { id: 'compendio', label: 'Compendios SCJN/UNAM' },
];

const ORGANOS = [
  { id: 'todos', label: 'Todos' },
  { id: 'Pleno', label: 'Pleno SCJN' },
  { id: 'Primera Sala', label: 'Primera Sala' },
  { id: 'Segunda Sala', label: 'Segunda Sala' },
  { id: 'Pleno de Circuito', label: 'Plenos de Circuito' },
  { id: 'Tribunal Colegiado', label: 'TCC' },
  { id: 'CIDH', label: 'Corte IDH' },
];

const LIBROS = [
  { id: 'todos', label: 'Todos los libros' },
  { id: 'PRIMERO', label: 'Libro Primero — Disposiciones Generales' },
  { id: 'SEGUNDO', label: 'Libro Segundo — Procedimiento' },
];

export default function Filters({ value, onChange, articleCount, precedenteCount, compendioCount = 0 }) {
  function set(key, v) { onChange({ ...value, [key]: v }); }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-sm text-slate-500">
        <Filter size={14} /> Filtros
      </div>

      <Group title={`Tipo de fuente (${articleCount} arts. · ${precedenteCount} precedentes · ${compendioCount} compendios)`}>
        {KINDS.map(k => (
          <Chip key={k.id} active={(value.kind || 'todos') === k.id} onClick={() => set('kind', k.id)}>
            {k.label}
          </Chip>
        ))}
      </Group>

      <Group title="Órgano emisor (precedentes)">
        {ORGANOS.map(o => (
          <Chip key={o.id} active={(value.organo || 'todos') === o.id} onClick={() => set('organo', o.id)}>
            {o.label}
          </Chip>
        ))}
      </Group>

      <Group title="Libro del CNPP">
        {LIBROS.map(l => (
          <Chip key={l.id} active={(value.libro || 'todos') === l.id} onClick={() => set('libro', l.id)}>
            {l.label}
          </Chip>
        ))}
      </Group>

      <Group title="Sistema de precedentes (post-2021)">
        <Chip active={!!value.con_ejecutoria} onClick={() => set('con_ejecutoria', !value.con_ejecutoria)}>
          Solo precedentes con ejecutoria disponible
        </Chip>
      </Group>
    </div>
  );
}

function Group({ title, children }) {
  return (
    <div>
      <div className="text-xs uppercase tracking-wide text-slate-400 mb-1.5">{title}</div>
      <div className="flex flex-wrap gap-1.5">{children}</div>
    </div>
  );
}

function Chip({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`text-xs px-2.5 py-1 rounded-full border transition ${active
        ? 'bg-slate-900 text-white border-slate-900'
        : 'bg-white text-slate-700 border-slate-300 hover:border-slate-500'}`}
    >
      {children}
    </button>
  );
}

import { useMemo, useState } from 'react';
import { Calendar, Clock } from 'lucide-react';
import { addHours, addWorkingDays, COMMON_DEADLINES } from '../lib/deadlines';

export default function DeadlineCalc() {
  const today = new Date().toISOString().slice(0, 10);
  const [start, setStart] = useState(today);
  const [days, setDays] = useState(10);
  const [hours, setHours] = useState(72);
  const [startInclusive, setStartInclusive] = useState(false);

  const dayResult = useMemo(() => addWorkingDays(start, Number(days) || 0, { startInclusive }), [start, days, startInclusive]);
  const hourResult = useMemo(() => addHours(start, Number(hours) || 0), [start, hours]);

  return (
    <div className="space-y-4">
      <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 space-y-4">
        <div>
          <label className="text-xs font-medium text-slate-600 uppercase tracking-wide">Fecha de inicio</label>
          <input type="date" value={start} onChange={e => setStart(e.target.value)} className="mt-1 block w-full sm:w-auto px-3 py-2 rounded-lg border border-slate-300" />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="rounded-xl border border-slate-200 p-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2"><Calendar size={14} /> Días hábiles</div>
            <input type="number" min={0} value={days} onChange={e => setDays(e.target.value)} className="block w-full px-3 py-2 rounded-lg border border-slate-300" />
            <label className="flex items-center gap-2 text-xs text-slate-600 mt-2">
              <input type="checkbox" checked={startInclusive} onChange={e => setStartInclusive(e.target.checked)} /> Contar el día de inicio
            </label>
            <div className="mt-3 text-xs uppercase tracking-wide text-slate-500">Vence el</div>
            <div className="text-2xl font-bold text-slate-900">{new Date(dayResult + 'T12:00:00').toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</div>
          </div>
          <div className="rounded-xl border border-slate-200 p-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2"><Clock size={14} /> Horas (corridas)</div>
            <input type="number" min={0} value={hours} onChange={e => setHours(e.target.value)} className="block w-full px-3 py-2 rounded-lg border border-slate-300" />
            <div className="mt-3 text-xs uppercase tracking-wide text-slate-500">Vence</div>
            <div className="text-2xl font-bold text-slate-900">{hourResult}</div>
          </div>
        </div>

        <div className="text-[11px] text-slate-500 leading-relaxed">
          Cálculo basado en días hábiles del PJF (excluye sábado, domingo, festivos LFT y receso típico 16-31 jul / 16-31 dic). Para cómputo en caso concreto verifica acuerdos del Consejo de la Judicatura Federal y calendario específico del tribunal.
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-6">
        <h3 className="text-sm font-semibold text-slate-900 mb-3">Plazos típicos del CNPP</h3>
        <ul className="space-y-2">
          {COMMON_DEADLINES.map((d, i) => (
            <li key={i} className="border-l-2 border-slate-200 pl-3">
              <div className="text-sm font-medium text-slate-900">{d.label}</div>
              <div className="text-xs text-slate-600">
                {d.kind === 'hours' && <>{d.value} horas — vence el {addHours(start, d.value)}</>}
                {d.kind === 'days' && <>{d.value} días hábiles — vence el {new Date(addWorkingDays(start, d.value) + 'T12:00:00').toLocaleDateString('es-MX')}</>}
                {d.kind === 'days_natural_max' && <>Hasta {d.value} días naturales</>}
              </div>
              {d.note && <div className="text-[11px] text-slate-500 mt-0.5">{d.note}</div>}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

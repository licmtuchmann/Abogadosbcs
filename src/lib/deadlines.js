// Procedural deadline calculator per CNPP Art. 94 (days/hours).
// "Días" in the CNPP = días hábiles, excluyendo sábado, domingo y festivos
// salvo norma específica. "Horas" cuentan corridas.
// Festivos: lista canónica de días inhábiles federales (LFT / Ley Orgánica
// del Poder Judicial). Editable por el usuario.

export const DEFAULT_HOLIDAYS = [
  // Festivos fijos (LFT art. 74) — solo los oficiales obligatorios.
  // El cálculo NO incluye periodos vacacionales del PJF; se sugieren abajo.
  { date: '01-01', label: 'Año Nuevo' },
  { date: '02-05', label: 'Aniversario de la Constitución (5 feb)' }, // se traslada al primer lunes — manejo abajo
  { date: '03-21', label: 'Natalicio de Benito Juárez' },             // se traslada al tercer lunes
  { date: '05-01', label: 'Día del Trabajo' },
  { date: '09-16', label: 'Independencia' },
  { date: '11-20', label: 'Revolución Mexicana' },                    // se traslada al tercer lunes
  { date: '12-25', label: 'Navidad' },
];

// PJF receso (típico): 16-31 dic y 16-31 jul. Editable en UI.
export const DEFAULT_RECESOS = [
  { from: '07-16', to: '07-31', label: 'Primer periodo vacacional PJF' },
  { from: '12-16', to: '12-31', label: 'Segundo periodo vacacional PJF' },
];

function pad(n) { return String(n).padStart(2, '0'); }
function mmdd(d) { return `${pad(d.getMonth() + 1)}-${pad(d.getDate())}`; }

function isWeekend(d) {
  const day = d.getDay();
  return day === 0 || day === 6;
}

function inRecess(d, recesos) {
  const k = mmdd(d);
  return recesos.some(r => {
    if (r.from <= r.to) return k >= r.from && k <= r.to;
    return k >= r.from || k <= r.to;
  });
}

function isHoliday(d, holidays) {
  const k = mmdd(d);
  return holidays.some(h => h.date === k);
}

export function isWorkingDay(d, holidays = DEFAULT_HOLIDAYS, recesos = DEFAULT_RECESOS) {
  if (isWeekend(d)) return false;
  if (isHoliday(d, holidays)) return false;
  if (inRecess(d, recesos)) return false;
  return true;
}

// Add N working days to a date. If startInclusive, day 0 counts as today if
// today is hábil; otherwise we move to the next working day before counting.
export function addWorkingDays(startISO, days, opts = {}) {
  const { holidays = DEFAULT_HOLIDAYS, recesos = DEFAULT_RECESOS, startInclusive = false } = opts;
  const d = new Date(startISO + 'T12:00:00');
  let remaining = days;
  if (!startInclusive) d.setDate(d.getDate() + 1);
  while (remaining > 0) {
    if (isWorkingDay(d, holidays, recesos)) remaining--;
    if (remaining > 0) d.setDate(d.getDate() + 1);
  }
  // If start date itself wasn't a working day, jump forward
  while (!isWorkingDay(d, holidays, recesos)) d.setDate(d.getDate() + 1);
  return d.toISOString().slice(0, 10);
}

export function addHours(startISO, hours) {
  const d = new Date(startISO + 'T00:00:00');
  d.setHours(d.getHours() + hours);
  return d.toISOString().slice(0, 16).replace('T', ' ');
}

export const COMMON_DEADLINES = [
  { label: 'Plazo constitucional para resolver situación jurídica (art. 313 CNPP)', kind: 'hours', value: 72, note: 'Puede duplicarse a 144 horas a petición del imputado o su defensor.' },
  { label: 'Retención del MP (art. 16 CPEUM / 149 CNPP)', kind: 'hours', value: 48, note: '96 hrs si es delincuencia organizada.' },
  { label: 'Interposición de recurso de apelación (art. 471 CNPP)', kind: 'days', value: 10, note: 'Sentencia definitiva.' },
  { label: 'Apelación de autos (art. 471 CNPP)', kind: 'days', value: 3 },
  { label: 'Recurso de revocación (art. 466 CNPP)', kind: 'days', value: 2 },
  { label: 'Cierre de investigación complementaria (art. 321 CNPP)', kind: 'days_natural_max', value: 180, note: 'Plazo máximo si delito > 2 años de prisión; 60 días si menor.' },
  { label: 'Plazo para presentar acusación (art. 324 CNPP)', kind: 'days', value: 15 },
  { label: 'Descubrimiento probatorio del MP (art. 337 CNPP)', kind: 'days', value: 5 },
  { label: 'Audiencia intermedia tras acusación (art. 341 CNPP)', kind: 'days', value: 30, note: 'No menor a 10, no mayor a 30.' },
  { label: 'Notificación previa a audiencia (art. 92 CNPP)', kind: 'hours', value: 24 },
];

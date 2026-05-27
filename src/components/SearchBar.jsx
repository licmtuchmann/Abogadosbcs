import { useEffect, useRef, useState } from 'react';
import { Search, X, Mic } from 'lucide-react';

const EXAMPLES = [
  'derecho de defensa del imputado',
  'prisión preventiva oficiosa',
  'derechos de la víctima',
  'plazo para resolver situación jurídica',
  'cadena de custodia',
  'control judicial de la detención',
  'flagrancia',
  'criterio de oportunidad',
];

export default function SearchBar({ value, onChange, onClear }) {
  const inputRef = useRef(null);
  const [listening, setListening] = useState(false);
  const [example, setExample] = useState(EXAMPLES[0]);

  useEffect(() => {
    const i = setInterval(() => {
      setExample(EXAMPLES[Math.floor(Math.random() * EXAMPLES.length)]);
    }, 4000);
    return () => clearInterval(i);
  }, []);

  // Ctrl+K / Cmd+K to focus
  useEffect(() => {
    function onKey(e) {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
        inputRef.current?.select();
      }
      if (e.key === 'Escape' && document.activeElement === inputRef.current) {
        onClear();
        inputRef.current?.blur();
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClear]);

  function startVoice() {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) {
      alert('Tu navegador no soporta búsqueda por voz.');
      return;
    }
    const r = new SR();
    r.lang = 'es-MX';
    r.interimResults = false;
    r.maxAlternatives = 1;
    setListening(true);
    r.onresult = (e) => {
      const txt = e.results[0][0].transcript;
      onChange(txt);
      setListening(false);
    };
    r.onerror = () => setListening(false);
    r.onend = () => setListening(false);
    r.start();
  }

  return (
    <div className="relative">
      <div className="flex items-center gap-2 bg-white border border-slate-300 rounded-xl px-3 py-2 shadow-sm focus-within:ring-2 focus-within:ring-slate-900/20">
        <Search size={18} className="text-slate-500 shrink-0" />
        <input
          ref={inputRef}
          type="search"
          inputMode="search"
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={`Buscar (ej. "${example}")`}
          className="flex-1 bg-transparent outline-none text-base placeholder:text-slate-400"
          autoFocus
        />
        {value && (
          <button onClick={onClear} className="text-slate-400 hover:text-slate-700 p-1" aria-label="Limpiar">
            <X size={16} />
          </button>
        )}
        <button
          onClick={startVoice}
          title="Buscar por voz"
          className={`p-1 rounded ${listening ? 'text-red-500 animate-pulse' : 'text-slate-400 hover:text-slate-700'}`}
          aria-label="Búsqueda por voz"
        >
          <Mic size={18} />
        </button>
        <kbd className="hidden sm:inline-block text-[10px] text-slate-400 border border-slate-200 rounded px-1">⌘K</kbd>
      </div>
    </div>
  );
}

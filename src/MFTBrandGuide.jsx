import React, { useState, useMemo } from 'react';
import {
  Shield, Scale, FileText, Users, Building2, Briefcase,
  MapPin, Phone, MessageCircle, Mail, Globe, Clock,
  Check, X, ChevronRight, Palette, Type, Image as ImageIcon,
  Sparkles, Box, Ruler, MessageSquare, Layers, Menu, Award,
  Instagram, CreditCard, ArrowUpRight, Minus, Plus
} from 'lucide-react';

const C = {
  navy: '#0B3D6E',
  blue: '#004F88',
  gold: '#C9A84C',
  goldDark: '#9E7A2A',
  bg: '#F5F7FA',
  surface: '#FFFFFF',
  text: '#1A1A2E',
  textSec: '#4A4A6A',
  textMuted: '#8A8AA0',
  navyLight: '#1A5A9A',
  navyDark: '#062B50',
};

const FONT_SERIF = 'Georgia, "Times New Roman", serif';
const FONT_SANS = 'Arial, Helvetica, sans-serif';
const FONT_NARROW = '"Arial Narrow", Arial, sans-serif';

const SECTIONS = [
  { id: 'cover', num: '00', title: 'Portada', icon: Sparkles },
  { id: 'colors', num: '01', title: 'Sistema de Color', icon: Palette },
  { id: 'typography', num: '02', title: 'Tipografía', icon: Type },
  { id: 'logo', num: '03', title: 'Logotipo', icon: ImageIcon },
  { id: 'icons', num: '04', title: 'Iconografía', icon: Shield },
  { id: 'components', num: '05', title: 'Componentes', icon: Box },
  { id: 'spacing', num: '06', title: 'Espaciado', icon: Ruler },
  { id: 'voice', num: '07', title: 'Voz y Tono', icon: MessageSquare },
  { id: 'applications', num: '08', title: 'Aplicaciones', icon: Layers },
];

const PRACTICE_AREAS = [
  { name: 'Amparo', icon: Shield, desc: 'Protección constitucional ante actos de autoridad.' },
  { name: 'Derecho Penal Acusatorio', icon: Scale, desc: 'Defensa técnica en el sistema penal de juicios orales.' },
  { name: 'Derecho Civil', icon: FileText, desc: 'Contratos, obligaciones, sucesiones y responsabilidad civil.' },
  { name: 'Derecho Familiar', icon: Users, desc: 'Divorcios, pensiones alimenticias, custodia y patria potestad.' },
  { name: 'Derecho Administrativo', icon: Building2, desc: 'Litigios frente a dependencias y procedimientos administrativos.' },
  { name: 'Derecho Mercantil', icon: Briefcase, desc: 'Sociedades, contratos mercantiles y juicios ejecutivos.' },
];

const hexToRgb = (hex) => {
  const h = hex.replace('#', '');
  const r = parseInt(h.substring(0, 2), 16);
  const g = parseInt(h.substring(2, 4), 16);
  const b = parseInt(h.substring(4, 6), 16);
  return `rgb(${r}, ${g}, ${b})`;
};

/* ============================================================
   SHARED PRIMITIVES
   ============================================================ */

const SectionHeader = ({ num, title, subtitle }) => (
  <div className="mb-12">
    <div className="flex items-baseline gap-4 mb-3">
      <span
        style={{ color: C.gold, fontFamily: FONT_NARROW, letterSpacing: '0.2em' }}
        className="text-xs font-bold"
      >
        SECCIÓN {num}
      </span>
      <div className="h-px flex-1" style={{ backgroundColor: C.gold, opacity: 0.4 }} />
    </div>
    <h1
      className="text-4xl md:text-5xl mb-3"
      style={{ fontFamily: FONT_SERIF, color: C.navy, fontWeight: 700, lineHeight: 1.15 }}
    >
      {title}
    </h1>
    {subtitle && (
      <p
        className="max-w-2xl"
        style={{ fontFamily: FONT_SANS, color: C.textSec, fontSize: 16, lineHeight: 1.65 }}
      >
        {subtitle}
      </p>
    )}
    <div className="mt-6 h-1 w-16" style={{ backgroundColor: C.gold }} />
  </div>
);

const SubLabel = ({ children }) => (
  <p
    style={{ fontFamily: FONT_NARROW, color: C.gold, letterSpacing: '0.2em' }}
    className="text-[10px] font-bold uppercase mb-3"
  >
    {children}
  </p>
);

const Card = ({ children, className = '', style = {} }) => (
  <div
    className={`rounded-xl ${className}`}
    style={{
      backgroundColor: C.surface,
      boxShadow: '0 1px 2px rgba(11,61,110,0.04), 0 8px 24px rgba(11,61,110,0.06)',
      ...style,
    }}
  >
    {children}
  </div>
);

const GoldDivider = ({ width = 60 }) => (
  <div className="h-px" style={{ width, backgroundColor: C.gold }} />
);

/* ============================================================
   SECTION 0 — COVER
   ============================================================ */

const CoverSection = () => (
  <div
    className="relative rounded-2xl overflow-hidden flex flex-col items-center justify-center text-center px-8 py-24 md:py-40"
    style={{
      backgroundColor: C.navy,
      backgroundImage: `radial-gradient(circle at 20% 20%, ${C.navyLight}33 0%, transparent 50%), radial-gradient(circle at 80% 80%, ${C.navyDark} 0%, transparent 60%)`,
      minHeight: 'calc(100vh - 8rem)',
    }}
  >
    <div className="absolute top-10 left-10 right-10 flex justify-between items-center">
      <span style={{ fontFamily: FONT_NARROW, color: C.gold, letterSpacing: '0.3em' }} className="text-[10px] font-bold uppercase">
        MFT · Identidad Visual
      </span>
      <span style={{ fontFamily: FONT_NARROW, color: '#ffffff80', letterSpacing: '0.3em' }} className="text-[10px] font-bold uppercase">
        Volumen I · 2025
      </span>
    </div>

    <div className="h-px w-16 mb-10" style={{ backgroundColor: C.gold }} />

    <p
      style={{ fontFamily: FONT_NARROW, color: C.gold, letterSpacing: '0.3em' }}
      className="text-sm font-bold uppercase mb-8"
    >
      BRAND IDENTITY GUIDE
    </p>

    <h1
      className="text-3xl md:text-5xl mb-8 max-w-4xl"
      style={{
        fontFamily: FONT_SERIF,
        color: '#FFFFFF',
        fontWeight: 700,
        letterSpacing: '0.06em',
        lineHeight: 1.2,
      }}
    >
      MEZA&nbsp;FIGUEROA,<br />TUCHMANN&nbsp;&amp;&nbsp;ASOCIADOS
    </h1>

    <div className="flex items-center gap-4 mb-12">
      <div className="h-px w-12" style={{ backgroundColor: C.gold }} />
      <p
        style={{ fontFamily: FONT_SERIF, color: '#ffffffcc', fontStyle: 'italic' }}
        className="text-base md:text-lg"
      >
        Defensa jurídica de precisión.
      </p>
      <div className="h-px w-12" style={{ backgroundColor: C.gold }} />
    </div>

    <p style={{ fontFamily: FONT_NARROW, color: '#ffffff80' }} className="text-xs mb-2">
      2025
    </p>
    <p style={{ fontFamily: FONT_SANS, color: '#ffffffb3' }} className="text-sm">
      La Paz · Baja California Sur · México
    </p>

    <div className="h-px w-16 mt-12" style={{ backgroundColor: C.gold }} />

    <div className="absolute bottom-10 left-10 right-10 flex justify-between items-end">
      <div className="text-left">
        <p style={{ fontFamily: FONT_NARROW, color: '#ffffff60' }} className="text-[10px] uppercase tracking-widest">
          Documento
        </p>
        <p style={{ fontFamily: FONT_SANS, color: '#fff' }} className="text-sm">MFT-BG-2025-01</p>
      </div>
      <div className="text-right">
        <p style={{ fontFamily: FONT_NARROW, color: '#ffffff60' }} className="text-[10px] uppercase tracking-widest">
          Confidencial
        </p>
        <p style={{ fontFamily: FONT_SANS, color: '#fff' }} className="text-sm">Uso interno y aliados</p>
      </div>
    </div>
  </div>
);

/* ============================================================
   SECTION 1 — COLORS
   ============================================================ */

const ColorCard = ({ name, hex, usage, isLight }) => (
  <Card className="overflow-hidden">
    <div
      style={{ backgroundColor: hex, height: 120, borderBottom: isLight ? `1px solid ${C.navy}1A` : 'none' }}
      className="w-full"
    />
    <div className="p-5">
      <h4 style={{ fontFamily: FONT_SANS, color: C.text }} className="text-base font-bold mb-2">
        {name}
      </h4>
      <div className="flex flex-col gap-1 mb-3">
        <div className="flex items-center gap-2">
          <span style={{ fontFamily: FONT_NARROW, color: C.textMuted }} className="text-[10px] uppercase tracking-widest w-10">HEX</span>
          <span style={{ fontFamily: 'monospace', color: C.text }} className="text-sm font-bold">{hex.toUpperCase()}</span>
        </div>
        <div className="flex items-center gap-2">
          <span style={{ fontFamily: FONT_NARROW, color: C.textMuted }} className="text-[10px] uppercase tracking-widest w-10">RGB</span>
          <span style={{ fontFamily: 'monospace', color: C.textSec }} className="text-xs">{hexToRgb(hex)}</span>
        </div>
      </div>
      <p style={{ fontFamily: FONT_SANS, color: C.textMuted }} className="text-xs leading-relaxed">
        {usage}
      </p>
    </div>
  </Card>
);

const ColorsSection = () => {
  const groups = [
    {
      label: 'Primarios MFT',
      items: [
        { name: 'Primary Navy', hex: C.navy, usage: 'Color institucional principal. Encabezados, fondos firmes y elementos de marca.' },
        { name: 'Secondary Blue', hex: C.blue, usage: 'Acentos, numeración de secciones y detalles secundarios.' },
        { name: 'Gold Accent', hex: C.gold, usage: 'Separadores, highlights, iconografía premium y elementos VIP.' },
      ],
    },
    {
      label: 'Variantes',
      items: [
        { name: 'Gold Dark', hex: C.goldDark, usage: 'Hover states sobre el dorado. Acabados metálicos.' },
        { name: 'Navy Light', hex: C.navyLight, usage: 'Variante hover de Primary Navy. Links activos.' },
        { name: 'Navy Dark', hex: C.navyDark, usage: 'Variante oscura de Primary Navy. Fondos de máxima jerarquía.' },
      ],
    },
    {
      label: 'Neutros',
      items: [
        { name: 'Background Light', hex: C.bg, usage: 'Fondo general de página y secciones cálidas.', isLight: true },
        { name: 'Surface', hex: C.surface, usage: 'Tarjetas, contenedores y superficies elevadas.', isLight: true },
        { name: 'Text Primary', hex: C.text, usage: 'Cuerpo de texto principal y títulos en superficies claras.' },
        { name: 'Text Secondary', hex: C.textSec, usage: 'Subtítulos, descripciones y texto de apoyo.' },
        { name: 'Text Muted', hex: C.textMuted, usage: 'Metadatos, etiquetas y texto de baja jerarquía.' },
      ],
    },
  ];

  return (
    <div>
      <SectionHeader
        num="01"
        title="Sistema de Color"
        subtitle="La paleta cromática de MFT combina la solemnidad del azul marino con la calidez del dorado premium para transmitir autoridad, confianza y excelencia. Cada color tiene un rol jerárquico definido y no debe usarse fuera de su contexto."
      />

      {groups.map((g) => (
        <div key={g.label} className="mb-12">
          <SubLabel>{g.label}</SubLabel>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {g.items.map((it) => <ColorCard key={it.name} {...it} />)}
          </div>
        </div>
      ))}

      <div className="mt-16">
        <SubLabel>Uso combinado · Combinaciones aprobadas</SubLabel>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Navy + Gold */}
          <div
            className="rounded-xl p-8 flex flex-col justify-between"
            style={{ backgroundColor: C.navy, minHeight: 200 }}
          >
            <GoldDivider width={40} />
            <div>
              <p style={{ fontFamily: FONT_NARROW, color: C.gold, letterSpacing: '0.2em' }} className="text-[10px] font-bold uppercase mb-2">DESPACHO MFT</p>
              <p style={{ fontFamily: FONT_SERIF, color: '#fff' }} className="text-xl font-bold">Navy + Gold</p>
              <p style={{ fontFamily: FONT_SANS, color: '#ffffffb3' }} className="text-xs mt-2">Combinación institucional principal.</p>
            </div>
          </div>
          {/* Navy + White */}
          <div
            className="rounded-xl p-8 flex flex-col justify-between"
            style={{ backgroundColor: C.navy, minHeight: 200 }}
          >
            <div className="h-px w-10 bg-white" />
            <div>
              <p style={{ fontFamily: FONT_NARROW, color: '#ffffffcc', letterSpacing: '0.2em' }} className="text-[10px] font-bold uppercase mb-2">DESPACHO MFT</p>
              <p style={{ fontFamily: FONT_SERIF, color: '#fff' }} className="text-xl font-bold">Navy + White</p>
              <p style={{ fontFamily: FONT_SANS, color: '#ffffffb3' }} className="text-xs mt-2">Comunicaciones formales y sobrias.</p>
            </div>
          </div>
          {/* Light bg + Navy text */}
          <div
            className="rounded-xl p-8 flex flex-col justify-between border"
            style={{ backgroundColor: C.bg, minHeight: 200, borderColor: `${C.navy}1A` }}
          >
            <GoldDivider width={40} />
            <div>
              <p style={{ fontFamily: FONT_NARROW, color: C.gold, letterSpacing: '0.2em' }} className="text-[10px] font-bold uppercase mb-2">DESPACHO MFT</p>
              <p style={{ fontFamily: FONT_SERIF, color: C.navy }} className="text-xl font-bold">Light + Navy</p>
              <p style={{ fontFamily: FONT_SANS, color: C.textSec }} className="text-xs mt-2">Documentos editoriales y reportes.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ============================================================
   SECTION 2 — TYPOGRAPHY
   ============================================================ */

const TypeRow = ({ label, spec, sample, style }) => (
  <Card className="p-6 md:p-8">
    <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-6 items-start">
      <div>
        <p style={{ fontFamily: FONT_NARROW, color: C.gold, letterSpacing: '0.2em' }} className="text-[10px] font-bold uppercase mb-2">
          {label}
        </p>
        <p style={{ fontFamily: 'monospace', color: C.textMuted }} className="text-xs leading-relaxed">
          {spec}
        </p>
      </div>
      <div style={{ color: C.text, ...style }}>{sample}</div>
    </div>
  </Card>
);

const TypographySection = () => {
  const rows = [
    {
      label: 'DISPLAY XL',
      spec: '56px · bold\nGeorgia · serif\nline-height 1.1',
      sample: 'La justicia exige precisión.',
      style: { fontFamily: FONT_SERIF, fontSize: 56, fontWeight: 700, lineHeight: 1.1, color: C.navy },
    },
    {
      label: 'DISPLAY L',
      spec: '42px · bold\nGeorgia · serif\nline-height 1.15',
      sample: 'La justicia exige precisión.',
      style: { fontFamily: FONT_SERIF, fontSize: 42, fontWeight: 700, lineHeight: 1.15, color: C.navy },
    },
    {
      label: 'HEADING 1',
      spec: '32px · bold\nGeorgia · serif\nline-height 1.2',
      sample: 'Amparo Indirecto ante Juzgado de Distrito',
      style: { fontFamily: FONT_SERIF, fontSize: 32, fontWeight: 700, lineHeight: 1.2, color: C.navy },
    },
    {
      label: 'HEADING 2',
      spec: '24px · semibold\nArial · sans-serif\nline-height 1.3',
      sample: 'Conceptos de Violación',
      style: { fontFamily: FONT_SANS, fontSize: 24, fontWeight: 600, lineHeight: 1.3, color: C.navy },
    },
    {
      label: 'HEADING 3',
      spec: '20px · semibold\nArial · sans-serif\nline-height 1.35',
      sample: 'Estrategia Procesal y Argumentación',
      style: { fontFamily: FONT_SANS, fontSize: 20, fontWeight: 600, lineHeight: 1.35, color: C.text },
    },
    {
      label: 'HEADING 4',
      spec: '16px · bold\nArial · sans-serif\nline-height 1.4',
      sample: 'Análisis de Precedentes Judiciales',
      style: { fontFamily: FONT_SANS, fontSize: 16, fontWeight: 700, lineHeight: 1.4, color: C.text },
    },
    {
      label: 'BODY LARGE',
      spec: '16px · regular\nArial · sans-serif\nline-height 1.65',
      sample: 'Representamos sus derechos con rigor técnico y experiencia comprobada ante los tribunales de Baja California Sur.',
      style: { fontFamily: FONT_SANS, fontSize: 16, fontWeight: 400, lineHeight: 1.65, color: C.textSec },
    },
    {
      label: 'BODY',
      spec: '14px · regular\nArial · sans-serif\nline-height 1.65',
      sample: 'Cada caso es analizado por un equipo multidisciplinario que evalúa hechos, derecho aplicable y estrategia óptima.',
      style: { fontFamily: FONT_SANS, fontSize: 14, fontWeight: 400, lineHeight: 1.65, color: C.textSec },
    },
    {
      label: 'SMALL / LABEL',
      spec: '12px · medium\nArial Narrow\nline-height 1.5',
      sample: 'DERECHO PENAL ACUSATORIO',
      style: { fontFamily: FONT_NARROW, fontSize: 12, fontWeight: 500, lineHeight: 1.5, color: C.textSec, letterSpacing: '0.05em' },
    },
    {
      label: 'MICRO / CAP',
      spec: '10px · bold\nArial Narrow\nletter-spacing 0.1em\nUPPERCASE',
      sample: 'CÉDULA PROFESIONAL 14860874',
      style: { fontFamily: FONT_NARROW, fontSize: 10, fontWeight: 700, lineHeight: 1.5, color: C.gold, letterSpacing: '0.1em', textTransform: 'uppercase' },
    },
  ];

  const dos = [
    { text: 'Combine Georgia para títulos con Arial para cuerpo.', good: true },
    { text: 'Mantenga jerarquía clara: un solo Display por página.', good: true },
    { text: 'Use Arial Narrow para labels en MAYÚSCULAS.', good: true },
  ];
  const donts = [
    { text: 'No mezcle Georgia con tipografías display ornamentales.', good: false },
    { text: 'Evite cuerpos de texto en serif. Reserve Georgia a titulares.', good: false },
    { text: 'No aplique cursivas a labels o microtexto.', good: false },
  ];

  return (
    <div>
      <SectionHeader
        num="02"
        title="Sistema Tipográfico"
        subtitle="La pareja Georgia + Arial articula tradición y modernidad. Georgia aporta autoridad serif en titulares; Arial garantiza legibilidad impecable en cuerpo y UI. Arial Narrow sostiene labels técnicos y microtexto institucional."
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-12">
        {[
          { fam: 'Georgia', role: 'Display · Titulares', sample: 'Aa', ff: FONT_SERIF },
          { fam: 'Arial', role: 'Body · Interfaz', sample: 'Aa', ff: FONT_SANS },
          { fam: 'Arial Narrow', role: 'Labels · Microtexto', sample: 'Aa', ff: FONT_NARROW },
        ].map((f) => (
          <Card key={f.fam} className="p-8 text-center">
            <p style={{ fontFamily: f.ff, color: C.navy, fontSize: 96, fontWeight: 700, lineHeight: 1 }}>{f.sample}</p>
            <div className="my-4"><GoldDivider width={32} /></div>
            <h3 style={{ fontFamily: FONT_SERIF, color: C.text }} className="text-xl font-bold mb-1">{f.fam}</h3>
            <p style={{ fontFamily: FONT_NARROW, color: C.textMuted, letterSpacing: '0.15em' }} className="text-[10px] uppercase">
              {f.role}
            </p>
          </Card>
        ))}
      </div>

      <SubLabel>Escala tipográfica completa</SubLabel>
      <div className="flex flex-col gap-4 mb-16">
        {rows.map((r) => <TypeRow key={r.label} {...r} />)}
      </div>

      <SubLabel>Buenas prácticas tipográficas</SubLabel>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: '#10B98115' }}>
              <Check size={18} style={{ color: '#10B981' }} />
            </div>
            <h4 style={{ fontFamily: FONT_SANS, color: C.text }} className="font-bold">Sí hacer</h4>
          </div>
          <ul className="space-y-3">
            {dos.map((d, i) => (
              <li key={i} style={{ fontFamily: FONT_SANS, color: C.textSec }} className="text-sm flex gap-2">
                <span style={{ color: '#10B981' }}>•</span>{d.text}
              </li>
            ))}
          </ul>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: '#EF444415' }}>
              <X size={18} style={{ color: '#EF4444' }} />
            </div>
            <h4 style={{ fontFamily: FONT_SANS, color: C.text }} className="font-bold">No hacer</h4>
          </div>
          <ul className="space-y-3">
            {donts.map((d, i) => (
              <li key={i} style={{ fontFamily: FONT_SANS, color: C.textSec }} className="text-sm flex gap-2">
                <span style={{ color: '#EF4444' }}>•</span>{d.text}
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
};

/* ============================================================
   SECTION 3 — LOGO
   ============================================================ */

const LogoFull = ({ navy = C.navy, gold = C.gold, scale = 1 }) => (
  <div className="flex items-center gap-4" style={{ transform: `scale(${scale})`, transformOrigin: 'left center' }}>
    <div className="w-1 h-16" style={{ backgroundColor: gold }} />
    <div>
      <div
        style={{
          fontFamily: FONT_SERIF,
          color: navy,
          fontWeight: 700,
          fontSize: 48,
          lineHeight: 1,
          letterSpacing: '0.04em',
        }}
      >
        MFT
      </div>
      <div
        style={{
          fontFamily: FONT_NARROW,
          color: navy,
          fontSize: 9,
          letterSpacing: '0.2em',
          marginTop: 4,
          textTransform: 'uppercase',
        }}
      >
        Meza Figueroa, Tuchmann &amp; Asociados
      </div>
    </div>
  </div>
);

const LogoMark = ({ navy = C.navy, gold = C.gold, bg = C.surface, size = 96 }) => (
  <div
    className="rounded-full flex items-center justify-center relative"
    style={{
      width: size,
      height: size,
      backgroundColor: bg,
      border: `2px solid ${navy}`,
      boxShadow: `inset 0 0 0 4px ${bg}, inset 0 0 0 5px ${gold}`,
    }}
  >
    <span
      style={{
        fontFamily: FONT_SERIF,
        color: navy,
        fontWeight: 700,
        fontSize: size * 0.32,
        letterSpacing: '0.04em',
      }}
    >
      MFT
    </span>
  </div>
);

const LogoSection = () => (
  <div>
    <SectionHeader
      num="03"
      title="Logotipo"
      subtitle="El sistema de logotipo MFT se construye sobre las iniciales en Georgia bold, acompañadas de una línea vertical dorada que evoca la columna jurídica y la rectitud institucional. Toda aplicación debe respetar zona de exclusión, proporciones y paleta oficial."
    />

    <SubLabel>Versión principal</SubLabel>
    <Card className="p-12 mb-8 flex items-center justify-center" style={{ minHeight: 220 }}>
      <LogoFull />
    </Card>

    <SubLabel>Versión compacta · Isotipo</SubLabel>
    <Card className="p-12 mb-12 flex items-center justify-center gap-12 flex-wrap" style={{ minHeight: 220 }}>
      <LogoMark size={120} />
      <LogoMark size={72} />
      <LogoMark size={48} />
    </Card>

    <SubLabel>Aplicaciones sobre fondo</SubLabel>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-12">
      <Card className="p-10 flex items-center justify-center" style={{ backgroundColor: C.surface, minHeight: 200 }}>
        <LogoFull />
      </Card>
      <Card className="p-10 flex items-center justify-center" style={{ backgroundColor: C.navy, minHeight: 200 }}>
        <LogoFull navy="#FFFFFF" gold={C.gold} />
      </Card>
      <Card className="p-10 flex items-center justify-center" style={{ backgroundColor: C.bg, minHeight: 200 }}>
        <LogoFull />
      </Card>
    </div>

    <SubLabel>Escala mínima</SubLabel>
    <Card className="p-10 mb-12 flex items-center justify-between flex-wrap gap-8">
      <div className="flex flex-col items-center gap-3">
        <LogoFull scale={1.4} />
        <p style={{ fontFamily: FONT_NARROW, color: C.textMuted, letterSpacing: '0.15em' }} className="text-[10px] uppercase">Tamaño Grande · 240px+</p>
      </div>
      <div className="flex flex-col items-center gap-3">
        <LogoFull scale={0.7} />
        <p style={{ fontFamily: FONT_NARROW, color: C.textMuted, letterSpacing: '0.15em' }} className="text-[10px] uppercase">Tamaño mínimo · 120px</p>
      </div>
    </Card>

    <SubLabel>Zona de exclusión</SubLabel>
    <Card className="p-12 mb-12">
      <div
        className="relative inline-block"
        style={{
          padding: 48,
          border: `1px dashed ${C.gold}80`,
          borderRadius: 8,
        }}
      >
        <LogoFull />
        <span
          style={{
            position: 'absolute',
            top: -10,
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: C.bg,
            padding: '0 8px',
            fontFamily: FONT_NARROW,
            color: C.gold,
            letterSpacing: '0.2em',
          }}
          className="text-[10px] font-bold uppercase"
        >
          X = altura de la M
        </span>
      </div>
      <p style={{ fontFamily: FONT_SANS, color: C.textSec }} className="text-sm mt-6 max-w-2xl">
        Reserve un margen mínimo equivalente a la altura de la letra <strong>M</strong> en todos los lados. Ningún
        elemento gráfico, tipográfico o fotográfico debe invadir esta zona.
      </p>
    </Card>

    <SubLabel>Usos incorrectos</SubLabel>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      {[
        { label: 'No estirar ni deformar', render: (
          <div style={{ transform: 'scaleX(1.5)', transformOrigin: 'left center' }}><LogoFull /></div>
        )},
        { label: 'No recolorear arbitrariamente', render: (
          <LogoFull navy="#E11D48" gold="#22C55E" />
        )},
        { label: 'No añadir sombras ni efectos', render: (
          <div style={{ filter: 'drop-shadow(4px 4px 0 rgba(0,0,0,0.4))' }}><LogoFull /></div>
        )},
      ].map((u, i) => (
        <Card key={i} className="p-8 flex flex-col items-center justify-between gap-4" style={{ minHeight: 220 }}>
          <div className="flex-1 flex items-center justify-center overflow-hidden w-full">
            {u.render}
          </div>
          <div className="flex items-center gap-2 mt-4">
            <X size={16} style={{ color: '#EF4444' }} />
            <p style={{ fontFamily: FONT_SANS, color: C.textSec }} className="text-sm">{u.label}</p>
          </div>
        </Card>
      ))}
    </div>
  </div>
);

/* ============================================================
   SECTION 4 — ICONS
   ============================================================ */

const IconsSection = () => (
  <div>
    <SectionHeader
      num="04"
      title="Sistema de Íconos"
      subtitle="La iconografía MFT se construye sobre lucide-react: trazo limpio, geometría consistente y peso uniforme. Cada área de práctica posee un ícono oficial que mantiene coherencia visual en web, papelería y redes sociales."
    />

    <SubLabel>Íconos por área de práctica</SubLabel>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
      {PRACTICE_AREAS.map((a) => {
        const Icon = a.icon;
        return (
          <Card key={a.name} className="p-6">
            <div className="grid grid-cols-3 gap-2 mb-5">
              <div className="aspect-square flex items-center justify-center rounded-lg" style={{ backgroundColor: C.bg }}>
                <Icon size={32} color={C.navy} strokeWidth={1.5} />
              </div>
              <div className="aspect-square flex items-center justify-center rounded-lg" style={{ backgroundColor: C.navy }}>
                <Icon size={32} color="#FFFFFF" strokeWidth={1.5} />
              </div>
              <div className="aspect-square flex items-center justify-center rounded-lg" style={{ backgroundColor: C.bg }}>
                <Icon size={32} color={C.gold} strokeWidth={1.5} />
              </div>
            </div>
            <h4 style={{ fontFamily: FONT_SANS, color: C.text }} className="font-bold mb-1">{a.name}</h4>
            <p style={{ fontFamily: FONT_SANS, color: C.textMuted }} className="text-xs leading-relaxed">{a.desc}</p>
          </Card>
        );
      })}
    </div>

    <SubLabel>Íconos de contacto</SubLabel>
    <Card className="p-8">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
        {[
          { icon: MapPin, label: 'Dirección', usage: 'Ubicación física' },
          { icon: Phone, label: 'Teléfono', usage: 'Línea fija' },
          { icon: MessageCircle, label: 'WhatsApp', usage: 'Mensajería' },
          { icon: Mail, label: 'Correo', usage: 'Email institucional' },
          { icon: Globe, label: 'Sitio Web', usage: 'URL pública' },
          { icon: Clock, label: 'Horario', usage: 'Atención' },
        ].map((c, i) => {
          const I = c.icon;
          return (
            <div key={i} className="flex flex-col items-center text-center">
              <div className="w-14 h-14 rounded-full flex items-center justify-center mb-3" style={{ backgroundColor: `${C.navy}0D` }}>
                <I size={24} color={C.navy} strokeWidth={1.5} />
              </div>
              <p style={{ fontFamily: FONT_SANS, color: C.text }} className="text-sm font-bold">{c.label}</p>
              <p style={{ fontFamily: FONT_NARROW, color: C.textMuted, letterSpacing: '0.1em' }} className="text-[10px] uppercase mt-1">{c.usage}</p>
            </div>
          );
        })}
      </div>
    </Card>

    <div className="mt-8">
      <SubLabel>Especificación técnica</SubLabel>
      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { k: 'Familia', v: 'lucide-react' },
            { k: 'Stroke width', v: '1.5px' },
            { k: 'Tamaño UI', v: '20–24px' },
            { k: 'Tamaño feature', v: '32–48px' },
          ].map((s) => (
            <div key={s.k}>
              <p style={{ fontFamily: FONT_NARROW, color: C.gold, letterSpacing: '0.2em' }} className="text-[10px] font-bold uppercase mb-2">{s.k}</p>
              <p style={{ fontFamily: FONT_SANS, color: C.text }} className="text-base font-bold">{s.v}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  </div>
);

/* ============================================================
   SECTION 5 — COMPONENTS
   ============================================================ */

const ComponentsSection = () => {
  return (
    <div>
      <SectionHeader
        num="05"
        title="Componentes"
        subtitle="Sistema de componentes de interfaz coherente con la jerarquía visual MFT. Todos los componentes priorizan accesibilidad, legibilidad y solemnidad institucional."
      />

      {/* BUTTONS */}
      <SubLabel>Botones</SubLabel>
      <Card className="p-8 mb-10">
        <div className="flex flex-wrap gap-4 mb-6">
          <button
            className="px-6 py-2.5 rounded-full font-bold transition-all duration-300 hover:shadow-lg"
            style={{ backgroundColor: C.navy, color: '#fff', fontFamily: FONT_SANS, fontSize: 14 }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = C.navyDark)}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = C.navy)}
          >
            Agendar consulta
          </button>
          <button
            className="px-6 py-2.5 rounded-full font-bold transition-all duration-300"
            style={{ backgroundColor: 'transparent', border: `1.5px solid ${C.navy}`, color: C.navy, fontFamily: FONT_SANS, fontSize: 14 }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = `${C.navy}1A`)}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
          >
            Conocer al despacho
          </button>
          <button
            className="px-6 py-2.5 rounded-full font-bold transition-all duration-300 flex items-center gap-2"
            style={{ backgroundColor: C.gold, color: C.navy, fontFamily: FONT_SANS, fontSize: 14 }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = C.goldDark)}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = C.gold)}
          >
            Contratar ahora <ArrowUpRight size={16} />
          </button>
          <button
            className="px-6 py-2.5 rounded-full transition-all duration-300"
            style={{ backgroundColor: 'transparent', color: C.navy, fontFamily: FONT_SANS, fontSize: 14, fontWeight: 600 }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = `${C.navy}0D`)}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
          >
            Ver más →
          </button>
          <button
            className="px-6 py-2.5 rounded-full font-bold transition-all duration-300"
            style={{ backgroundColor: '#B91C1C', color: '#fff', fontFamily: FONT_SANS, fontSize: 14 }}
          >
            Eliminar registro
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2 pt-6 border-t" style={{ borderColor: `${C.navy}14` }}>
          {['Primario', 'Secundario', 'Gold CTA', 'Ghost', 'Destructivo (interno)'].map((l, i) => (
            <p key={i} style={{ fontFamily: FONT_NARROW, color: C.textMuted, letterSpacing: '0.1em' }} className="text-[10px] uppercase">{l}</p>
          ))}
        </div>
      </Card>

      {/* BADGES */}
      <SubLabel>Badges · Áreas de práctica</SubLabel>
      <Card className="p-8 mb-10">
        <div className="flex flex-wrap gap-3">
          {PRACTICE_AREAS.map((a) => {
            const I = a.icon;
            return (
              <span
                key={a.name}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full"
                style={{ backgroundColor: `${C.navy}1A`, color: C.navy, fontFamily: FONT_SANS, fontSize: 13, fontWeight: 600 }}
              >
                <I size={14} strokeWidth={2} />
                {a.name}
              </span>
            );
          })}
        </div>
      </Card>

      {/* CARDS */}
      <SubLabel>Cards</SubLabel>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
        {/* Practice area card */}
        <Card className="p-6 transition-all duration-300 hover:-translate-y-1" style={{ borderTop: `3px solid ${C.gold}` }}>
          <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4" style={{ backgroundColor: `${C.navy}0D` }}>
            <Shield size={24} color={C.navy} strokeWidth={1.5} />
          </div>
          <h4 style={{ fontFamily: FONT_SERIF, color: C.navy }} className="text-xl font-bold mb-2">Amparo</h4>
          <p style={{ fontFamily: FONT_SANS, color: C.textSec }} className="text-sm mb-4 leading-relaxed">
            Protección constitucional ante actos de autoridad que vulneren derechos fundamentales.
          </p>
          <a style={{ fontFamily: FONT_SANS, color: C.gold }} className="text-sm font-bold inline-flex items-center gap-1">
            Ver más <ChevronRight size={14} />
          </a>
        </Card>

        {/* Lawyer card */}
        <Card className="p-6 text-center">
          <div
            className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center"
            style={{ backgroundColor: C.navy, border: `2px solid ${C.gold}` }}
          >
            <span style={{ fontFamily: FONT_SERIF, color: '#fff', fontSize: 28, fontWeight: 700 }}>MF</span>
          </div>
          <h4 style={{ fontFamily: FONT_SERIF, color: C.navy }} className="text-lg font-bold">Lic. Meza Figueroa</h4>
          <p style={{ fontFamily: FONT_NARROW, color: C.gold, letterSpacing: '0.15em' }} className="text-[10px] uppercase mt-1">CÉDULA 2532041</p>
          <p style={{ fontFamily: FONT_SANS, color: C.textSec }} className="text-sm mt-3">Socio fundador · Amparo y Penal</p>
        </Card>

        {/* Stat card */}
        <Card className="p-6" style={{ backgroundColor: C.navy }}>
          <p style={{ fontFamily: FONT_NARROW, color: C.gold, letterSpacing: '0.2em' }} className="text-[10px] font-bold uppercase mb-3">TRAYECTORIA</p>
          <p style={{ fontFamily: FONT_SERIF, color: C.gold, fontSize: 64, fontWeight: 700, lineHeight: 1 }}>+20</p>
          <p style={{ fontFamily: FONT_SANS, color: '#fff' }} className="text-base font-bold mt-2">Años de experiencia</p>
          <p style={{ fontFamily: FONT_SANS, color: '#ffffffb3' }} className="text-xs mt-1">Litigando en B.C.S. y a nivel federal.</p>
        </Card>
      </div>

      {/* SEPARATORS */}
      <SubLabel>Separadores</SubLabel>
      <Card className="p-8 mb-10 space-y-8">
        <div>
          <div className="h-px" style={{ backgroundColor: C.gold }} />
          <p style={{ fontFamily: FONT_NARROW, color: C.textMuted, letterSpacing: '0.15em' }} className="text-[10px] uppercase mt-2">Línea dorada 1px</p>
        </div>
        <div>
          <div className="flex items-center gap-4">
            <div className="h-px flex-1" style={{ backgroundColor: C.gold }} />
            <span style={{ fontFamily: FONT_SERIF, color: C.gold, fontWeight: 700, letterSpacing: '0.2em' }} className="text-sm">MFT</span>
            <div className="h-px flex-1" style={{ backgroundColor: C.gold }} />
          </div>
          <p style={{ fontFamily: FONT_NARROW, color: C.textMuted, letterSpacing: '0.15em' }} className="text-[10px] uppercase mt-2">Separador centrado MFT</p>
        </div>
        <div>
          <div className="h-px" style={{ background: `linear-gradient(90deg, ${C.navy}, transparent)` }} />
          <p style={{ fontFamily: FONT_NARROW, color: C.textMuted, letterSpacing: '0.15em' }} className="text-[10px] uppercase mt-2">Divisor de sección · navy → transparente</p>
        </div>
      </Card>

      {/* INPUTS */}
      <SubLabel>Formularios</SubLabel>
      <Card className="p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label style={{ fontFamily: FONT_NARROW, color: C.gold, letterSpacing: '0.15em' }} className="text-[10px] font-bold uppercase block mb-2">Nombre completo</label>
            <input
              type="text"
              placeholder="Lic. María González"
              className="w-full px-4 py-3 rounded-lg outline-none transition-colors duration-300"
              style={{ backgroundColor: '#fff', border: `1.5px solid ${C.navy}33`, fontFamily: FONT_SANS, fontSize: 14, color: C.text }}
              onFocus={(e) => (e.currentTarget.style.borderColor = C.navy)}
              onBlur={(e) => (e.currentTarget.style.borderColor = `${C.navy}33`)}
            />
          </div>
          <div>
            <label style={{ fontFamily: FONT_NARROW, color: C.gold, letterSpacing: '0.15em' }} className="text-[10px] font-bold uppercase block mb-2">Área de interés</label>
            <select
              className="w-full px-4 py-3 rounded-lg outline-none transition-colors duration-300"
              style={{ backgroundColor: '#fff', border: `1.5px solid ${C.navy}33`, fontFamily: FONT_SANS, fontSize: 14, color: C.text }}
            >
              {PRACTICE_AREAS.map((a) => <option key={a.name}>{a.name}</option>)}
            </select>
          </div>
          <div className="md:col-span-2">
            <label style={{ fontFamily: FONT_NARROW, color: C.gold, letterSpacing: '0.15em' }} className="text-[10px] font-bold uppercase block mb-2">Descripción del caso</label>
            <textarea
              rows={4}
              placeholder="Describa los hechos relevantes y la materia de su consulta..."
              className="w-full px-4 py-3 rounded-lg outline-none transition-colors duration-300 resize-none"
              style={{ backgroundColor: '#fff', border: `1.5px solid ${C.navy}33`, fontFamily: FONT_SANS, fontSize: 14, color: C.text }}
              onFocus={(e) => (e.currentTarget.style.borderColor = C.navy)}
              onBlur={(e) => (e.currentTarget.style.borderColor = `${C.navy}33`)}
            />
          </div>
        </div>
      </Card>
    </div>
  );
};

/* ============================================================
   SECTION 6 — SPACING
   ============================================================ */

const SpacingSection = () => {
  const tokens = [
    { token: 'xs', px: 4, use: 'Padding interno mínimo · íconos compactos' },
    { token: 'sm', px: 8, use: 'Gap entre elementos íntimos · chips' },
    { token: 'md', px: 16, use: 'Padding base de cards · gap estándar' },
    { token: 'lg', px: 24, use: 'Padding cómodo · separación entre bloques' },
    { token: 'xl', px: 32, use: 'Padding amplio de secciones internas' },
    { token: '2xl', px: 48, use: 'Espaciado entre secciones medianas' },
    { token: '3xl', px: 64, use: 'Separación entre macro-secciones' },
    { token: '4xl', px: 96, use: 'Padding vertical de hero y portadas' },
  ];

  return (
    <div>
      <SectionHeader
        num="06"
        title="Espaciado"
        subtitle="Sistema de espaciado fundado en múltiplos de 8px. Garantiza ritmo visual coherente entre componentes, cards, secciones y maquetación editorial."
      />

      <SubLabel>Tokens base · múltiplos de 8</SubLabel>
      <Card className="p-8 mb-10">
        <div className="space-y-5">
          {tokens.map((t) => (
            <div key={t.token} className="grid grid-cols-[80px_1fr_2fr] items-center gap-4">
              <div className="flex flex-col">
                <span style={{ fontFamily: FONT_NARROW, color: C.gold, letterSpacing: '0.15em' }} className="text-[10px] uppercase font-bold">{t.token}</span>
                <span style={{ fontFamily: FONT_SANS, color: C.text }} className="text-sm font-bold">{t.px}px</span>
              </div>
              <div className="flex items-center">
                <div className="h-3 rounded-sm" style={{ width: t.px * 2, backgroundColor: C.navy }} />
              </div>
              <p style={{ fontFamily: FONT_SANS, color: C.textSec }} className="text-sm">{t.use}</p>
            </div>
          ))}
        </div>
      </Card>

      <SubLabel>Aplicación en cards</SubLabel>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-10">
        <Card className="p-6">
          <p style={{ fontFamily: FONT_NARROW, color: C.gold, letterSpacing: '0.2em' }} className="text-[10px] font-bold uppercase mb-4">PADDING 24px (lg)</p>
          <div className="rounded-lg border-2 border-dashed p-4" style={{ borderColor: `${C.gold}80` }}>
            <h4 style={{ fontFamily: FONT_SERIF, color: C.navy }} className="text-lg font-bold mb-2">Título de Card</h4>
            <p style={{ fontFamily: FONT_SANS, color: C.textSec }} className="text-sm">Cuerpo del componente con gap interno de 16px entre elementos.</p>
          </div>
        </Card>
        <Card className="p-6">
          <p style={{ fontFamily: FONT_NARROW, color: C.gold, letterSpacing: '0.2em' }} className="text-[10px] font-bold uppercase mb-4">GAP 32px (xl)</p>
          <div className="grid grid-cols-2 gap-8">
            <div className="aspect-square rounded-lg" style={{ backgroundColor: `${C.navy}1A` }} />
            <div className="aspect-square rounded-lg" style={{ backgroundColor: `${C.gold}33` }} />
          </div>
        </Card>
      </div>

      <SubLabel>Grid editorial</SubLabel>
      <Card className="p-8">
        <div className="grid grid-cols-12 gap-2 mb-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="h-16 rounded" style={{ backgroundColor: `${C.navy}14` }}>
              <p style={{ fontFamily: FONT_NARROW, color: C.navy }} className="text-[10px] text-center mt-1">{i + 1}</p>
            </div>
          ))}
        </div>
        <p style={{ fontFamily: FONT_SANS, color: C.textSec }} className="text-sm">
          Sistema de <strong>12 columnas</strong> con gap de 16px. Anchos recomendados: 4-4-4, 6-6, 8-4, 12.
        </p>
      </Card>
    </div>
  );
};

/* ============================================================
   SECTION 7 — VOICE & TONE
   ============================================================ */

const VoiceSection = () => {
  const pairs = [
    {
      good: 'Analizamos su caso con rigor jurídico y estrategia de alto nivel.',
      bad: '¡Le garantizamos resultados rápidos y económicos!',
    },
    {
      good: 'Nuestros socios cuentan con cédulas profesionales 2532041, 01911 y 14860874.',
      bad: 'Somos los mejores abogados de La Paz.',
    },
    {
      good: 'Agende una consulta inicial para evaluar su situación jurídica.',
      bad: '¡Llámanos hoy mismo! ¡Primera consulta gratis!',
    },
    {
      good: 'Más de dos décadas de trayectoria ante tribunales federales y locales.',
      bad: 'Tenemos muchísima experiencia y casos ganados, somos número uno.',
    },
  ];

  const values = ['Precisión', 'Confianza', 'Excelencia', 'Integridad', 'Discreción'];

  return (
    <div>
      <SectionHeader
        num="07"
        title="Voz de Marca"
        subtitle="MFT comunica con autoridad sin arrogancia. La voz es sobria, técnica y precisa; nunca coloquial, exagerada ni mercantilista. Cada frase debe sostener la solemnidad del oficio jurídico."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-12">
        <Card className="p-8" style={{ backgroundColor: C.navy }}>
          <SubLabel>Tagline oficial</SubLabel>
          <p style={{ fontFamily: FONT_SERIF, color: '#fff', fontStyle: 'italic' }} className="text-3xl font-bold mb-2">
            "Defensa jurídica de precisión."
          </p>
          <p style={{ fontFamily: FONT_NARROW, color: C.gold, letterSpacing: '0.2em' }} className="text-[10px] uppercase mt-4">EN · "Legal defense with precision."</p>
        </Card>
        <Card className="p-8">
          <SubLabel>Valores de marca</SubLabel>
          <div className="flex flex-wrap gap-2">
            {values.map((v) => (
              <span
                key={v}
                className="px-4 py-2 rounded-full"
                style={{ backgroundColor: `${C.gold}26`, color: C.navy, fontFamily: FONT_SERIF, fontWeight: 700, fontSize: 14 }}
              >
                {v}
              </span>
            ))}
          </div>
          <p style={{ fontFamily: FONT_SANS, color: C.textSec }} className="text-sm mt-5 leading-relaxed">
            Toda comunicación debe alinearse con estos cinco pilares. Si un mensaje no proyecta al menos tres, debe reescribirse.
          </p>
        </Card>
      </div>

      <SubLabel>Vocabulario</SubLabel>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-12">
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Check size={18} style={{ color: '#10B981' }} />
            <h4 style={{ fontFamily: FONT_SANS, color: C.text }} className="font-bold">Palabras clave</h4>
          </div>
          <div className="flex flex-wrap gap-2">
            {['estrategia', 'precedente', 'argumentación', 'resultados', 'trayectoria', 'rigor', 'precisión'].map((w) => (
              <span key={w} style={{ fontFamily: FONT_SANS, color: C.navy, backgroundColor: `${C.navy}0D` }} className="px-3 py-1 rounded-md text-sm">{w}</span>
            ))}
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <X size={18} style={{ color: '#EF4444' }} />
            <h4 style={{ fontFamily: FONT_SANS, color: C.text }} className="font-bold">Palabras prohibidas</h4>
          </div>
          <div className="flex flex-wrap gap-2">
            {['barato', 'rápido', 'garantizado', 'fácil'].map((w) => (
              <span key={w} style={{ fontFamily: FONT_SANS, color: '#B91C1C', backgroundColor: '#FEE2E2' }} className="px-3 py-1 rounded-md text-sm line-through">{w}</span>
            ))}
          </div>
        </Card>
      </div>

      <SubLabel>Do vs Don't · Ejemplos de redacción</SubLabel>
      <Card className="overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="p-6 border-b md:border-b-0 md:border-r" style={{ borderColor: `${C.navy}14` }}>
            <div className="flex items-center gap-2 mb-4">
              <Check size={18} style={{ color: '#10B981' }} />
              <h4 style={{ fontFamily: FONT_SANS, color: C.text }} className="font-bold">SÍ DECIR</h4>
            </div>
          </div>
          <div className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <X size={18} style={{ color: '#EF4444' }} />
              <h4 style={{ fontFamily: FONT_SANS, color: C.text }} className="font-bold">NO DECIR</h4>
            </div>
          </div>
        </div>
        {pairs.map((p, i) => (
          <div key={i} className="grid grid-cols-1 md:grid-cols-2 border-t" style={{ borderColor: `${C.navy}14` }}>
            <div className="p-6 flex gap-3 items-start" style={{ backgroundColor: '#10B98108' }}>
              <Check size={16} style={{ color: '#10B981', flexShrink: 0, marginTop: 4 }} />
              <p style={{ fontFamily: FONT_SERIF, color: C.text, fontStyle: 'italic' }} className="text-base leading-relaxed">"{p.good}"</p>
            </div>
            <div className="p-6 flex gap-3 items-start border-t md:border-t-0 md:border-l" style={{ backgroundColor: '#EF444408', borderColor: `${C.navy}14` }}>
              <X size={16} style={{ color: '#EF4444', flexShrink: 0, marginTop: 4 }} />
              <p style={{ fontFamily: FONT_SANS, color: C.textSec }} className="text-base leading-relaxed">"{p.bad}"</p>
            </div>
          </div>
        ))}
      </Card>
    </div>
  );
};

/* ============================================================
   SECTION 8 — APPLICATIONS
   ============================================================ */

const Letterhead = () => (
  <div
    className="rounded-lg overflow-hidden"
    style={{ backgroundColor: '#fff', boxShadow: '0 12px 32px rgba(11,61,110,0.15)', aspectRatio: '0.77 / 1' }}
  >
    <div className="px-6 py-5" style={{ backgroundColor: C.navy }}>
      <LogoFull navy="#fff" />
    </div>
    <div className="h-1" style={{ backgroundColor: C.gold }} />
    <div className="p-6">
      <p style={{ fontFamily: FONT_NARROW, color: C.gold, letterSpacing: '0.2em' }} className="text-[9px] font-bold uppercase mb-3">La Paz, B.C.S. · 15 de mayo de 2025</p>
      <p style={{ fontFamily: FONT_SERIF, color: C.navy }} className="text-sm font-bold mb-2">ASUNTO: Promoción de Amparo Indirecto</p>
      <p style={{ fontFamily: FONT_SANS, color: C.text }} className="text-[10px] leading-relaxed mb-2">JUEZ DE DISTRITO EN MATERIA</p>
      <p style={{ fontFamily: FONT_SANS, color: C.text }} className="text-[10px] leading-relaxed mb-3">ADMINISTRATIVA EN BAJA CALIFORNIA SUR</p>
      <p style={{ fontFamily: FONT_SANS, color: C.textSec }} className="text-[9px] leading-relaxed">
        Por medio del presente y con fundamento en los artículos 103 y 107 constitucionales, así como en lo dispuesto por la Ley de Amparo vigente, se promueve juicio de amparo indirecto en los términos siguientes...
      </p>
    </div>
    <div className="absolute bottom-0 left-0 right-0 p-3 text-center" style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }} />
    <div className="px-6 py-3 border-t" style={{ borderColor: `${C.navy}14` }}>
      <p style={{ fontFamily: FONT_NARROW, color: C.textMuted, letterSpacing: '0.15em' }} className="text-[8px] uppercase">
        Nayarit 1025 · Pueblo Nuevo · La Paz · 612 146 3512 · abogadobcs.com.mx
      </p>
    </div>
  </div>
);

const BusinessCard = ({ side }) => (
  side === 'front' ? (
    <div
      className="rounded-lg p-6 flex flex-col justify-between"
      style={{ backgroundColor: '#fff', aspectRatio: '1.75 / 1', boxShadow: '0 8px 24px rgba(11,61,110,0.18)', border: `1px solid ${C.navy}14` }}
    >
      <LogoFull />
      <div>
        <p style={{ fontFamily: FONT_SERIF, color: C.navy, fontWeight: 700 }} className="text-base">Lic. Sergio Tuchmann</p>
        <p style={{ fontFamily: FONT_NARROW, color: C.gold, letterSpacing: '0.2em' }} className="text-[9px] uppercase mt-1">Socio · Cédula 14860874</p>
        <div className="h-px w-8 my-2" style={{ backgroundColor: C.gold }} />
        <p style={{ fontFamily: FONT_SANS, color: C.textSec }} className="text-[10px]">
          612 146 3512 · meficlientes@gmail.com
        </p>
      </div>
    </div>
  ) : (
    <div
      className="rounded-lg p-6 flex flex-col justify-center items-center text-center"
      style={{ backgroundColor: C.navy, aspectRatio: '1.75 / 1', boxShadow: '0 8px 24px rgba(11,61,110,0.18)' }}
    >
      <div className="h-px w-8 mb-3" style={{ backgroundColor: C.gold }} />
      <p style={{ fontFamily: FONT_SERIF, color: '#fff', fontWeight: 700, letterSpacing: '0.05em' }} className="text-lg">MFT</p>
      <p style={{ fontFamily: FONT_NARROW, color: C.gold, letterSpacing: '0.25em' }} className="text-[8px] uppercase mt-2">Defensa jurídica de precisión</p>
      <div className="h-px w-8 mt-3" style={{ backgroundColor: C.gold }} />
      <p style={{ fontFamily: FONT_SANS, color: '#ffffffb3' }} className="text-[9px] mt-4">abogadobcs.com.mx</p>
    </div>
  )
);

const WebHeader = () => (
  <div className="rounded-lg overflow-hidden" style={{ boxShadow: '0 12px 32px rgba(11,61,110,0.12)' }}>
    <div className="flex items-center gap-1 px-3 py-2" style={{ backgroundColor: '#E5E7EB' }}>
      <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
      <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
      <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
      <div className="ml-3 px-3 py-0.5 rounded text-[10px]" style={{ backgroundColor: '#fff', fontFamily: 'monospace', color: C.textMuted }}>abogadobcs.com.mx</div>
    </div>
    <div className="bg-white">
      <div className="px-6 py-4 flex items-center justify-between border-b" style={{ borderColor: `${C.navy}14` }}>
        <LogoFull scale={0.8} />
        <div className="hidden md:flex items-center gap-6">
          {['Inicio', 'Áreas', 'Despacho', 'Contacto'].map((l) => (
            <span key={l} style={{ fontFamily: FONT_SANS, color: C.navy }} className="text-sm font-semibold">{l}</span>
          ))}
          <button className="px-4 py-2 rounded-full" style={{ backgroundColor: C.gold, color: C.navy, fontFamily: FONT_SANS, fontSize: 12, fontWeight: 700 }}>
            Agendar
          </button>
        </div>
      </div>
      <div className="px-6 py-12 text-center" style={{ backgroundColor: C.bg }}>
        <p style={{ fontFamily: FONT_NARROW, color: C.gold, letterSpacing: '0.3em' }} className="text-[10px] font-bold uppercase mb-3">DESPACHO JURÍDICO · LA PAZ B.C.S.</p>
        <h2 style={{ fontFamily: FONT_SERIF, color: C.navy }} className="text-3xl font-bold mb-3">Defensa jurídica de precisión.</h2>
        <p style={{ fontFamily: FONT_SANS, color: C.textSec }} className="text-sm">Estrategia, trayectoria y argumentación de alto nivel.</p>
      </div>
    </div>
  </div>
);

const InstagramPost = () => (
  <div
    className="rounded-lg overflow-hidden relative p-8 flex flex-col justify-between"
    style={{ backgroundColor: C.navy, aspectRatio: '1 / 1', boxShadow: '0 12px 32px rgba(11,61,110,0.18)' }}
  >
    <div className="flex items-center justify-between">
      <div className="h-px w-10" style={{ backgroundColor: C.gold }} />
      <Instagram size={18} color={C.gold} />
    </div>
    <div>
      <p style={{ fontFamily: FONT_NARROW, color: C.gold, letterSpacing: '0.3em' }} className="text-[10px] font-bold uppercase mb-3">REFLEXIÓN JURÍDICA</p>
      <p style={{ fontFamily: FONT_SERIF, color: '#fff', fontStyle: 'italic', fontWeight: 700 }} className="text-2xl leading-tight">
        "La precisión técnica<br />es la mejor defensa."
      </p>
      <div className="h-px w-10 mt-4" style={{ backgroundColor: C.gold }} />
    </div>
    <div className="flex items-center justify-between">
      <span style={{ fontFamily: FONT_SERIF, color: C.gold, fontWeight: 700, letterSpacing: '0.1em' }} className="text-sm">MFT</span>
      <p style={{ fontFamily: FONT_NARROW, color: '#ffffff80', letterSpacing: '0.2em' }} className="text-[9px] uppercase">@mft.abogados</p>
    </div>
  </div>
);

const WhatsAppBanner = () => (
  <div
    className="rounded-lg overflow-hidden flex flex-col justify-center px-8 py-6"
    style={{ background: `linear-gradient(135deg, ${C.navy} 0%, ${C.navyDark} 100%)`, aspectRatio: '2.5 / 1' }}
  >
    <div className="flex items-center justify-between">
      <div>
        <div className="flex items-center gap-3 mb-3">
          <MessageCircle size={20} color={C.gold} />
          <p style={{ fontFamily: FONT_NARROW, color: C.gold, letterSpacing: '0.3em' }} className="text-[10px] font-bold uppercase">WHATSAPP BUSINESS</p>
        </div>
        <p style={{ fontFamily: FONT_SERIF, color: '#fff', fontWeight: 700 }} className="text-2xl mb-1">Consulta jurídica directa</p>
        <p style={{ fontFamily: FONT_SANS, color: '#ffffffb3' }} className="text-sm">612 111 0641 · 612 140 2313</p>
      </div>
      <div className="hidden sm:block">
        <LogoFull navy="#fff" />
      </div>
    </div>
  </div>
);

const ApplicationsSection = () => (
  <div>
    <SectionHeader
      num="08"
      title="Aplicaciones de Marca"
      subtitle="Materializaciones de la identidad MFT en piezas reales: papelería institucional, tarjetería, identidad digital y redes sociales. Cada aplicación respeta sistema cromático, tipográfico y de espaciado oficial."
    />

    <SubLabel>Papelería institucional · Letterhead</SubLabel>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-12">
      <div className="md:col-span-1">
        <Letterhead />
        <p style={{ fontFamily: FONT_NARROW, color: C.textMuted, letterSpacing: '0.15em' }} className="text-[10px] uppercase mt-4 text-center">Hoja membretada · Carta MX</p>
      </div>
      <div className="md:col-span-2 flex items-start">
        <Card className="p-8 w-full">
          <h4 style={{ fontFamily: FONT_SERIF, color: C.navy }} className="text-xl font-bold mb-3">Especificaciones de impresión</h4>
          <ul className="space-y-2">
            {[
              ['Formato', 'Carta · 21.59 × 27.94 cm'],
              ['Papel', 'Bond 90g · acabado mate'],
              ['Tinta', 'CMYK · Navy Pantone 7700 C · Gold Pantone 871 C'],
              ['Margen', '20mm superior, 15mm laterales e inferior'],
              ['Encabezado', 'Logo MFT versión negativa sobre navy'],
            ].map(([k, v]) => (
              <li key={k} className="flex gap-4">
                <span style={{ fontFamily: FONT_NARROW, color: C.gold, letterSpacing: '0.15em' }} className="text-[10px] uppercase font-bold w-24 flex-shrink-0 pt-0.5">{k}</span>
                <span style={{ fontFamily: FONT_SANS, color: C.textSec }} className="text-sm">{v}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>

    <SubLabel>Tarjeta de presentación</SubLabel>
    <Card className="p-10 mb-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
        <div>
          <BusinessCard side="front" />
          <p style={{ fontFamily: FONT_NARROW, color: C.textMuted, letterSpacing: '0.15em' }} className="text-[10px] uppercase mt-3 text-center">Frente · 8.5 × 5.5 cm</p>
        </div>
        <div>
          <BusinessCard side="back" />
          <p style={{ fontFamily: FONT_NARROW, color: C.textMuted, letterSpacing: '0.15em' }} className="text-[10px] uppercase mt-3 text-center">Reverso · Versión institucional</p>
        </div>
      </div>
    </Card>

    <SubLabel>Identidad digital · Sitio web</SubLabel>
    <div className="mb-12"><WebHeader /></div>

    <SubLabel>Redes sociales · Instagram</SubLabel>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-12">
      <InstagramPost />
      <div className="md:col-span-2"><WhatsAppBanner /></div>
    </div>

    <Card className="p-8 mt-8" style={{ backgroundColor: C.navy }}>
      <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-8 items-center">
        <LogoFull navy="#fff" />
        <div>
          <SubLabel>Información de contacto</SubLabel>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-white">
            {[
              [MapPin, 'Nayarit 1025, Col. Pueblo Nuevo, La Paz B.C.S., C.P. 23060'],
              [Phone, '612 146 3512'],
              [MessageCircle, '612 111 0641 · 612 140 2313'],
              [Mail, 'meficlientes@gmail.com'],
              [Globe, 'abogadobcs.com.mx'],
              [Clock, 'Lun a Vie · 9:00 — 18:00'],
            ].map(([I, t], i) => (
              <div key={i} className="flex items-start gap-2">
                <I size={14} color={C.gold} style={{ flexShrink: 0, marginTop: 3 }} />
                <span style={{ fontFamily: FONT_SANS, color: '#fff' }} className="text-xs">{t}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  </div>
);

/* ============================================================
   MAIN COMPONENT
   ============================================================ */

export default function MFTBrandGuide() {
  const [active, setActive] = useState('cover');
  const [mobileOpen, setMobileOpen] = useState(false);

  const renderSection = () => {
    switch (active) {
      case 'cover': return <CoverSection />;
      case 'colors': return <ColorsSection />;
      case 'typography': return <TypographySection />;
      case 'logo': return <LogoSection />;
      case 'icons': return <IconsSection />;
      case 'components': return <ComponentsSection />;
      case 'spacing': return <SpacingSection />;
      case 'voice': return <VoiceSection />;
      case 'applications': return <ApplicationsSection />;
      default: return <CoverSection />;
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: C.bg, color: C.text }}>
      {/* Mobile top bar */}
      <div className="lg:hidden sticky top-0 z-30 flex items-center justify-between px-4 py-3 border-b" style={{ backgroundColor: C.navy, borderColor: C.navyDark }}>
        <div className="flex items-center gap-3">
          <div className="w-1 h-8" style={{ backgroundColor: C.gold }} />
          <div>
            <p style={{ fontFamily: FONT_SERIF, color: '#fff', fontWeight: 700 }} className="text-sm">MFT</p>
            <p style={{ fontFamily: FONT_NARROW, color: C.gold, letterSpacing: '0.2em' }} className="text-[8px] uppercase">Brand Guide</p>
          </div>
        </div>
        <button onClick={() => setMobileOpen((v) => !v)} className="p-2 rounded-lg" style={{ color: '#fff' }}>
          {mobileOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {/* Mobile tabs (scrollable) */}
      <div className="lg:hidden overflow-x-auto border-b" style={{ backgroundColor: '#fff', borderColor: `${C.navy}14` }}>
        <div className="flex gap-1 px-3 py-2 min-w-max">
          {SECTIONS.map((s) => (
            <button
              key={s.id}
              onClick={() => setActive(s.id)}
              className="px-3 py-2 rounded-full whitespace-nowrap transition-all duration-300"
              style={{
                backgroundColor: active === s.id ? C.navy : 'transparent',
                color: active === s.id ? '#fff' : C.navy,
                fontFamily: FONT_SANS,
                fontSize: 12,
                fontWeight: 600,
              }}
            >
              <span style={{ color: active === s.id ? C.gold : C.textMuted }} className="mr-1.5 text-[10px]">{s.num}</span>
              {s.title}
            </button>
          ))}
        </div>
      </div>

      <div className="flex">
        {/* Sidebar desktop */}
        <aside
          className="hidden lg:flex flex-col sticky top-0 h-screen w-72 flex-shrink-0 border-r"
          style={{ backgroundColor: C.navy, borderColor: C.navyDark }}
        >
          <div className="px-7 pt-10 pb-8 border-b" style={{ borderColor: '#ffffff14' }}>
            <div className="flex items-start gap-3">
              <div className="w-1 h-14" style={{ backgroundColor: C.gold }} />
              <div>
                <h2 style={{ fontFamily: FONT_SERIF, color: '#fff', fontWeight: 700, letterSpacing: '0.06em' }} className="text-xl leading-tight">
                  MFT
                </h2>
                <p style={{ fontFamily: FONT_NARROW, color: '#ffffffb3', letterSpacing: '0.15em' }} className="text-[9px] uppercase mt-1 leading-snug">
                  Meza Figueroa, Tuchmann &amp; Asociados
                </p>
              </div>
            </div>
            <div className="mt-6 h-px w-12" style={{ backgroundColor: C.gold }} />
            <p style={{ fontFamily: FONT_NARROW, color: C.gold, letterSpacing: '0.3em' }} className="text-[10px] font-bold uppercase mt-4">
              Brand Identity Guide
            </p>
            <p style={{ fontFamily: FONT_NARROW, color: '#ffffff80', letterSpacing: '0.2em' }} className="text-[10px] uppercase mt-1">
              Volumen I · 2025
            </p>
          </div>

          <nav className="flex-1 overflow-y-auto py-4">
            {SECTIONS.map((s) => {
              const Icon = s.icon;
              const isActive = active === s.id;
              return (
                <button
                  key={s.id}
                  onClick={() => setActive(s.id)}
                  className="w-full text-left px-7 py-3 transition-all duration-300 flex items-center gap-3 group relative"
                  style={{
                    backgroundColor: isActive ? '#ffffff0D' : 'transparent',
                  }}
                  onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.backgroundColor = '#ffffff08'; }}
                  onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.backgroundColor = 'transparent'; }}
                >
                  {isActive && <div className="absolute left-0 top-0 bottom-0 w-1" style={{ backgroundColor: C.gold }} />}
                  <span
                    style={{
                      fontFamily: FONT_NARROW,
                      color: isActive ? C.gold : '#ffffff66',
                      letterSpacing: '0.15em',
                    }}
                    className="text-[10px] font-bold w-6"
                  >
                    {s.num}
                  </span>
                  <Icon size={14} color={isActive ? C.gold : '#ffffff80'} strokeWidth={1.5} />
                  <span
                    style={{
                      fontFamily: FONT_SANS,
                      color: isActive ? '#fff' : '#ffffffb3',
                      fontWeight: isActive ? 700 : 500,
                    }}
                    className="text-sm"
                  >
                    {s.title}
                  </span>
                </button>
              );
            })}
          </nav>

          <div className="px-7 py-6 border-t" style={{ borderColor: '#ffffff14' }}>
            <p style={{ fontFamily: FONT_NARROW, color: '#ffffff66', letterSpacing: '0.2em' }} className="text-[9px] uppercase mb-2">
              Defensa jurídica
            </p>
            <p style={{ fontFamily: FONT_SERIF, color: C.gold, fontStyle: 'italic' }} className="text-sm">
              "de precisión."
            </p>
            <div className="mt-4 flex items-center gap-2">
              <div className="h-px w-6" style={{ backgroundColor: C.gold }} />
              <span style={{ fontFamily: FONT_NARROW, color: '#ffffff80' }} className="text-[10px]">La Paz · B.C.S.</span>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 min-w-0">
          <div className="max-w-6xl mx-auto px-4 sm:px-8 lg:px-12 py-10 lg:py-16">
            {renderSection()}

            <div className="mt-20 pt-10 border-t flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4" style={{ borderColor: `${C.navy}14` }}>
              <div>
                <p style={{ fontFamily: FONT_NARROW, color: C.gold, letterSpacing: '0.2em' }} className="text-[10px] font-bold uppercase">
                  MFT Brand Guide · 2025
                </p>
                <p style={{ fontFamily: FONT_SANS, color: C.textMuted }} className="text-xs mt-1">
                  © Meza Figueroa, Tuchmann &amp; Asociados · Documento confidencial
                </p>
              </div>
              <div className="flex items-center gap-2">
                {SECTIONS.findIndex((s) => s.id === active) > 0 && (
                  <button
                    onClick={() => {
                      const i = SECTIONS.findIndex((s) => s.id === active);
                      setActive(SECTIONS[i - 1].id);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="px-4 py-2 rounded-full flex items-center gap-2 transition-all duration-300"
                    style={{ border: `1px solid ${C.navy}33`, color: C.navy, fontFamily: FONT_SANS, fontSize: 12, fontWeight: 600 }}
                  >
                    ← Anterior
                  </button>
                )}
                {SECTIONS.findIndex((s) => s.id === active) < SECTIONS.length - 1 && (
                  <button
                    onClick={() => {
                      const i = SECTIONS.findIndex((s) => s.id === active);
                      setActive(SECTIONS[i + 1].id);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="px-4 py-2 rounded-full flex items-center gap-2 transition-all duration-300"
                    style={{ backgroundColor: C.navy, color: '#fff', fontFamily: FONT_SANS, fontSize: 12, fontWeight: 600 }}
                  >
                    Siguiente →
                  </button>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

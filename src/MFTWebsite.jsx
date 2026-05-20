import React, { useState, useEffect } from 'react';
import {
  MapPin, Phone, MessageCircle, Mail, Globe, Clock,
  Shield, Scale, FileText, Users, Building2, Briefcase,
  Award, BookOpen, UserCheck, Menu, X, ChevronDown, ChevronRight,
  Languages, ArrowRight, CheckCircle2
} from 'lucide-react';

/* =====================================================
   DESIGN TOKENS
   ===================================================== */
const C = {
  navy: '#0B3D6E',
  navyDark: '#062B50',
  blue: '#004F88',
  gold: '#C9A84C',
  goldDark: '#9E7A2A',
  bg: '#F5F7FA',
  white: '#FFFFFF',
  text: '#1A1A2E',
  textMid: '#4A4A6A',
  textLight: '#8A8AA0',
};
const FONT_SERIF = 'Georgia, "Times New Roman", serif';
const FONT_SANS = 'Arial, Helvetica, sans-serif';
const FONT_NARROW = '"Arial Narrow", Arial, sans-serif';

/* =====================================================
   TRANSLATIONS
   ===================================================== */
const T = {
  es: {
    nav: {
      home: 'Inicio',
      areas: 'Áreas de Práctica',
      firm: 'El Despacho',
      team: 'El Equipo',
      contact: 'Contacto',
      cta: 'Consultar caso',
    },
    common: {
      readMore: 'Leer más',
      consultCase: 'Consultar este caso',
      backToAreas: 'Volver a áreas',
      cedula: 'Cédula Profesional',
      tagline: 'Defensa jurídica de precisión.',
    },
    hero: {
      pretitle: 'DESPACHO JURÍDICO · LA PAZ, B.C.S.',
      title1: 'Defensa jurídica',
      title2: 'de ',
      titleAccent: 'precisión.',
      desc: 'Representamos sus intereses con rigor técnico, argumentación sólida y profundo conocimiento del derecho mexicano. Más de 15 años litigando ante los tribunales de Baja California Sur y el Poder Judicial Federal.',
      ctaPrimary: 'Consultar mi caso',
      ctaSecondary: 'Conocer el despacho',
      contactCardTitle: 'Contacto directo',
      contactCardSub: 'Atención personalizada con el socio responsable.',
    },
    areas: {
      pretitle: 'ÁREAS DE PRÁCTICA',
      title: 'Nuestra Especialización',
      subtitle: 'Cobertura jurídica integral en las principales ramas del derecho mexicano.',
      ctaAll: 'Ver todas las áreas',
    },
    why: {
      pretitle: 'POR QUÉ ELEGIRNOS',
      title: 'Razones para confiar en MFT',
      subtitle: 'Cuatro pilares que sostienen cada caso que aceptamos.',
      items: [
        { title: 'Especialización Técnica', desc: 'Argumentación jurídica estructurada con jurisprudencia de la SCJN y precedentes de la Corte IDH.' },
        { title: 'Trayectoria Comprobada', desc: 'Años de litigio ante tribunales locales y federales en Baja California Sur.' },
        { title: 'Atención Personalizada', desc: 'Seguimiento directo con el socio responsable de su caso.' },
        { title: 'Ética Profesional', desc: 'Transparencia total en honorarios y estrategia jurídica.' },
      ],
    },
    stats: {
      pretitle: 'MFT EN NÚMEROS',
      items: [
        { num: '15+', label: 'Años de experiencia' },
        { num: '6', label: 'Áreas de práctica' },
        { num: '3', label: 'Socios especializados' },
        { num: '2', label: 'Jurisdicciones (local y federal)' },
      ],
    },
    process: {
      pretitle: 'METODOLOGÍA',
      title: 'Cómo trabajamos',
      subtitle: 'Un proceso estructurado que garantiza claridad y resultados.',
      steps: [
        { title: 'Consulta Inicial', desc: 'Evaluamos su situación y definimos viabilidad jurídica.' },
        { title: 'Análisis del Caso', desc: 'Estudio de hechos, derecho aplicable y precedentes relevantes.' },
        { title: 'Estrategia Jurídica', desc: 'Diseño de la línea argumentativa y plan procesal a la medida.' },
        { title: 'Representación Activa', desc: 'Conducción del litigio con seguimiento puntual y reportes.' },
      ],
    },
    cta: {
      pretitle: '¿NECESITA ASESORÍA?',
      title: '¿Necesita representación jurídica?',
      subtitle: 'Agende una consulta para evaluar su caso con uno de nuestros socios.',
      primary: 'Solicitar consulta',
      phone: 'Llamar al 612 146 3512',
      whatsapp: 'WhatsApp',
    },
    firmPage: {
      pretitle: 'EL DESPACHO',
      title: 'Un despacho de litigio con identidad propia',
      history: 'Fundado en La Paz, Baja California Sur, Meza Figueroa, Tuchmann & Asociados es un despacho de litigio especializado que combina el rigor técnico de la argumentación jurídica contemporánea con el profundo conocimiento del sistema judicial en BCS.',
      values: ['Precisión', 'Integridad', 'Excelencia', 'Discreción'],
      missionTitle: 'Misión',
      mission: 'Defender los derechos de nuestros clientes mediante estrategia jurídica de alto nivel, argumentación técnica impecable y compromiso ético inquebrantable.',
      visionTitle: 'Visión',
      vision: 'Ser el despacho de referencia en Baja California Sur por la calidad de su litigio, la solidez de sus argumentos y la integridad de su práctica profesional.',
      jurisdictionsTitle: 'Jurisdicciones',
      jurisdictionsDesc: 'Atendemos asuntos ante autoridades locales en La Paz y todos los municipios de BCS, así como ante el Poder Judicial Federal en todo el territorio nacional.',
      local: 'Local — Baja California Sur',
      federal: 'Federal — Toda la República',
    },
    teamPage: {
      pretitle: 'EL EQUIPO',
      title: 'Socios fundadores',
      subtitle: 'Tres trayectorias complementarias, una sola visión jurídica.',
    },
    contactPage: {
      pretitle: 'CONTACTO',
      title: 'Agende su consulta inicial',
      subtitle: 'Complete el formulario y nos pondremos en contacto en menos de 24 horas hábiles.',
      form: {
        name: 'Nombre completo',
        email: 'Correo electrónico',
        phone: 'Teléfono',
        area: 'Área jurídica',
        message: 'Descripción breve de su caso',
        submit: 'Enviar consulta',
        selectArea: 'Seleccione un área',
      },
      info: {
        address: 'Dirección',
        addressValue: 'Nayarit 1025, entre Lic. Primo Verdad y Marcelo Rubio, Col. Pueblo Nuevo, La Paz, B.C.S., C.P. 23060',
        phone: 'Teléfono',
        whatsapp: 'WhatsApp',
        email: 'Correo',
        hours: 'Horario',
        hoursValue: 'Lun–Vie 9:00–18:00 · Sáb 9:00–13:00 (con previo aviso)',
        mapCTA: 'Ver ubicación en Google Maps',
        whatsappCTA: 'Escribir por WhatsApp',
      },
    },
    areaDetails: {
      services: 'Servicios',
      legalBasis: 'Fundamento legal',
    },
    footer: {
      tagline: 'Defensa jurídica de precisión.',
      quickNav: 'Navegación',
      areas: 'Áreas',
      contact: 'Contacto',
      rights: '© 2025 Meza Figueroa, Tuchmann & Asociados · abogadobcs.com.mx',
      cedulas: 'Cédulas Profesionales 2532041 · 01911 · 14860874',
    },
    whatsappTip: 'Consultar por WhatsApp',
  },
  en: {
    nav: {
      home: 'Home',
      areas: 'Practice Areas',
      firm: 'The Firm',
      team: 'Our Team',
      contact: 'Contact',
      cta: 'Discuss your case',
    },
    common: {
      readMore: 'Read more',
      consultCase: 'Discuss this matter',
      backToAreas: 'Back to areas',
      cedula: 'Bar License',
      tagline: 'Legal defense with precision.',
    },
    hero: {
      pretitle: 'LAW FIRM · LA PAZ, B.C.S.',
      title1: 'Legal defense',
      title2: 'with ',
      titleAccent: 'precision.',
      desc: 'We represent your interests with technical rigor, well-grounded argumentation and deep knowledge of Mexican law. Over 15 years litigating before the courts of Baja California Sur and the Federal Judiciary.',
      ctaPrimary: 'Discuss my case',
      ctaSecondary: 'About the firm',
      contactCardTitle: 'Direct contact',
      contactCardSub: 'Personalized attention from the partner in charge.',
    },
    areas: {
      pretitle: 'PRACTICE AREAS',
      title: 'Our Expertise',
      subtitle: 'Comprehensive legal coverage across the main branches of Mexican law.',
      ctaAll: 'View all practice areas',
    },
    why: {
      pretitle: 'WHY CHOOSE US',
      title: 'Reasons to trust MFT',
      subtitle: 'Four pillars supporting every case we accept.',
      items: [
        { title: 'Technical Specialization', desc: 'Structured legal reasoning grounded in SCJN case law and Inter-American Court precedent.' },
        { title: 'Proven Track Record', desc: 'Years of litigation before local and federal courts in Baja California Sur.' },
        { title: 'Personalized Attention', desc: 'Direct follow-up with the partner responsible for your case.' },
        { title: 'Professional Ethics', desc: 'Full transparency in fees and legal strategy.' },
      ],
    },
    stats: {
      pretitle: 'MFT IN NUMBERS',
      items: [
        { num: '15+', label: 'Years of experience' },
        { num: '6', label: 'Practice areas' },
        { num: '3', label: 'Founding partners' },
        { num: '2', label: 'Jurisdictions (local & federal)' },
      ],
    },
    process: {
      pretitle: 'METHODOLOGY',
      title: 'How we work',
      subtitle: 'A structured process that delivers clarity and results.',
      steps: [
        { title: 'Initial Consultation', desc: 'We evaluate your situation and confirm legal viability.' },
        { title: 'Case Analysis', desc: 'Study of facts, applicable law and relevant precedents.' },
        { title: 'Legal Strategy', desc: 'Tailored argumentative line and procedural roadmap.' },
        { title: 'Active Representation', desc: 'Litigation handled with timely follow-up and reporting.' },
      ],
    },
    cta: {
      pretitle: 'NEED COUNSEL?',
      title: 'Need legal representation?',
      subtitle: 'Schedule a consultation to discuss your case with one of our partners.',
      primary: 'Request a consultation',
      phone: 'Call 612 146 3512',
      whatsapp: 'WhatsApp',
    },
    firmPage: {
      pretitle: 'THE FIRM',
      title: 'A litigation boutique with its own identity',
      history: 'Founded in La Paz, Baja California Sur, Meza Figueroa, Tuchmann & Asociados is a specialized litigation firm that combines the technical rigor of contemporary legal reasoning with deep knowledge of the BCS judicial system.',
      values: ['Precision', 'Integrity', 'Excellence', 'Discretion'],
      missionTitle: 'Mission',
      mission: 'To defend our clients\' rights through high-level legal strategy, impeccable technical argumentation and uncompromising ethical commitment.',
      visionTitle: 'Vision',
      vision: 'To be the reference law firm in Baja California Sur for the quality of its litigation, the soundness of its arguments and the integrity of its professional practice.',
      jurisdictionsTitle: 'Jurisdictions',
      jurisdictionsDesc: 'We handle matters before local authorities in La Paz and all municipalities of BCS, as well as before the Federal Judiciary nationwide.',
      local: 'Local — Baja California Sur',
      federal: 'Federal — Nationwide',
    },
    teamPage: {
      pretitle: 'OUR TEAM',
      title: 'Founding partners',
      subtitle: 'Three complementary trajectories, one legal vision.',
    },
    contactPage: {
      pretitle: 'CONTACT',
      title: 'Book your initial consultation',
      subtitle: 'Fill out the form and we will respond within 24 business hours.',
      form: {
        name: 'Full name',
        email: 'Email',
        phone: 'Phone',
        area: 'Legal area',
        message: 'Brief description of your case',
        submit: 'Send inquiry',
        selectArea: 'Select an area',
      },
      info: {
        address: 'Address',
        addressValue: 'Nayarit 1025, between Lic. Primo Verdad and Marcelo Rubio, Pueblo Nuevo, La Paz, B.C.S., 23060 Mexico',
        phone: 'Phone',
        whatsapp: 'WhatsApp',
        email: 'Email',
        hours: 'Hours',
        hoursValue: 'Mon–Fri 9:00–18:00 · Sat 9:00–13:00 (by appointment)',
        mapCTA: 'Open in Google Maps',
        whatsappCTA: 'Message on WhatsApp',
      },
    },
    areaDetails: {
      services: 'Services',
      legalBasis: 'Legal basis',
    },
    footer: {
      tagline: 'Legal defense with precision.',
      quickNav: 'Navigation',
      areas: 'Areas',
      contact: 'Contact',
      rights: '© 2025 Meza Figueroa, Tuchmann & Asociados · abogadobcs.com.mx',
      cedulas: 'Bar Licenses 2532041 · 01911 · 14860874',
    },
    whatsappTip: 'Chat on WhatsApp',
  },
};

/* =====================================================
   PRACTICE AREAS DATA
   ===================================================== */
const AREAS_DATA = {
  es: [
    {
      id: 'amparo',
      name: 'Amparo',
      short: 'Federal e Indirecto',
      icon: Shield,
      desc: 'Defensa constitucional ante el Poder Judicial Federal. Amparos directos e indirectos, quejas, revisiones y recursos ante Juzgados de Distrito y Tribunales Colegiados de Circuito.',
      long: 'Atendemos juicios de amparo en su modalidad directa e indirecta, así como los recursos y medios de impugnación previstos en la Ley de Amparo. Diseñamos conceptos de violación sólidos y agravios bien estructurados, fundados en jurisprudencia obligatoria y precedentes de la Suprema Corte de Justicia de la Nación.',
      services: [
        'Amparo indirecto ante Juzgados de Distrito',
        'Amparo directo ante Tribunales Colegiados de Circuito',
        'Recursos de revisión, queja y reclamación',
        'Suspensión provisional y definitiva del acto reclamado',
        'Cumplimiento e inejecución de sentencias de amparo',
        'Amparo en materia fiscal, penal, administrativa y laboral',
      ],
      basis: 'Artículos 103 y 107 constitucionales · Ley de Amparo',
    },
    {
      id: 'penal',
      name: 'Derecho Penal Acusatorio',
      short: 'CNPP',
      icon: Scale,
      desc: 'Representación en todas las etapas del proceso bajo el Código Nacional de Procedimientos Penales: investigación, audiencias, juicio oral y recursos de impugnación.',
      long: 'Defensa técnica especializada en el sistema penal acusatorio adversarial. Acompañamos al imputado o víctima desde la noticia criminal hasta la ejecución de sentencia, con estrategias diseñadas para cada etapa del proceso oral.',
      services: [
        'Defensa en audiencia inicial y de control de detención',
        'Vinculación a proceso y medidas cautelares',
        'Investigación complementaria y cierre',
        'Audiencia intermedia y depuración probatoria',
        'Juicio oral y desahogo de medios de prueba',
        'Recursos de apelación y casación',
      ],
      basis: 'Código Nacional de Procedimientos Penales · Código Penal Federal',
    },
    {
      id: 'civil',
      name: 'Derecho Civil',
      short: 'Contratos y obligaciones',
      icon: FileText,
      desc: 'Litigio en contratos, responsabilidad civil, prescripción adquisitiva, sucesiones y acciones reales ante los tribunales civiles de Baja California Sur.',
      long: 'Atendemos controversias civiles complejas en materia de obligaciones, contratos, derechos reales y sucesiones, con especial énfasis en la prueba documental y pericial requerida para acreditar la pretensión.',
      services: [
        'Cumplimiento e incumplimiento de contratos',
        'Responsabilidad civil contractual y extracontractual',
        'Prescripción adquisitiva (usucapión)',
        'Sucesiones testamentarias e intestamentarias',
        'Acciones reivindicatoria y plenaria de posesión',
        'Nulidad de contratos y actos jurídicos',
      ],
      basis: 'Código Civil para el Estado de BCS · Código Federal de Procedimientos Civiles',
    },
    {
      id: 'familiar',
      name: 'Derecho Familiar',
      short: 'Familia y menores',
      icon: Users,
      desc: 'Divorcio, guarda y custodia, alimentos, adopción y liquidación de sociedad conyugal con perspectiva de género y enfoque en el interés superior del menor.',
      long: 'Asistimos a las familias en momentos de transición jurídica con sensibilidad humana y rigor técnico. Cada estrategia se construye atendiendo el interés superior del menor y las pautas de la Suprema Corte sobre perspectiva de género.',
      services: [
        'Divorcio incausado y voluntario',
        'Guarda, custodia y régimen de convivencia',
        'Pensión alimenticia provisional y definitiva',
        'Adopción y reconocimiento de paternidad',
        'Liquidación de sociedad conyugal',
        'Violencia familiar y órdenes de protección',
      ],
      basis: 'Código Civil de BCS · Ley General de los Derechos de Niñas, Niños y Adolescentes',
    },
    {
      id: 'administrativo',
      name: 'Derecho Administrativo',
      short: 'Frente a la autoridad',
      icon: Building2,
      desc: 'Impugnación de actos de autoridad, nulidad de resoluciones y defensa ante el Tribunal Federal de Justicia Administrativa y órganos estatales.',
      long: 'Representación frente a actos de autoridad administrativa, fiscal y municipal. Promovemos nulidades, recursos administrativos y juicios contencioso-administrativos con apego al principio de legalidad.',
      services: [
        'Juicio contencioso-administrativo federal',
        'Procedimientos administrativos sancionadores',
        'Recursos de revisión y reconsideración',
        'Responsabilidad patrimonial del Estado',
        'Defensa fiscal y aduanera',
        'Permisos, licencias y concesiones',
      ],
      basis: 'Ley Federal de Procedimiento Contencioso Administrativo · Ley Federal de Procedimiento Administrativo',
    },
    {
      id: 'mercantil',
      name: 'Derecho Mercantil',
      short: 'Comerciantes y negocios',
      icon: Briefcase,
      desc: 'Controversias entre comerciantes, incumplimiento de contratos mercantiles, títulos de crédito y procedimientos concursales.',
      long: 'Defensa de los intereses de comerciantes, sociedades y empresarios ante controversias derivadas de la actividad mercantil. Diseñamos estrategias para juicios ejecutivos mercantiles, orales y especiales.',
      services: [
        'Juicio ejecutivo mercantil',
        'Juicio oral mercantil',
        'Cobranza de títulos de crédito (pagarés, cheques, letras)',
        'Rescisión de contratos mercantiles',
        'Constitución y disolución de sociedades',
        'Concursos mercantiles',
      ],
      basis: 'Código de Comercio · Ley General de Sociedades Mercantiles · Ley de Concursos Mercantiles',
    },
  ],
  en: [
    {
      id: 'amparo',
      name: 'Amparo (Constitutional Relief)',
      short: 'Federal & Indirect',
      icon: Shield,
      desc: 'Constitutional defense before the Federal Judiciary. Direct and indirect amparo proceedings, complaints, reviews and appeals before District Courts and Circuit Courts.',
      long: 'We handle amparo proceedings in their direct and indirect modalities, as well as appeals and remedies under the Amparo Act. We craft solid concepts of violation grounded in binding case law and Supreme Court precedent.',
      services: [
        'Indirect amparo before District Courts',
        'Direct amparo before Circuit Courts',
        'Appeals, complaints and reclamations',
        'Provisional and definitive injunctions',
        'Enforcement of amparo judgments',
        'Amparo in tax, criminal, administrative and labor matters',
      ],
      basis: 'Articles 103 & 107 of the Mexican Constitution · Amparo Act',
    },
    {
      id: 'penal',
      name: 'Adversarial Criminal Law',
      short: 'National Criminal Code',
      icon: Scale,
      desc: 'Representation at every stage of proceedings under the National Code of Criminal Procedure: investigation, hearings, oral trial and appeals.',
      long: 'Specialized technical defense in the adversarial criminal system. We assist defendants and victims from initial complaint through sentence execution, with strategies tailored to each stage of the oral process.',
      services: [
        'Initial hearings and detention review',
        'Indictment and precautionary measures',
        'Complementary investigation',
        'Intermediate hearings and evidence review',
        'Oral trial and evidence presentation',
        'Appeals and cassation',
      ],
      basis: 'National Code of Criminal Procedure · Federal Criminal Code',
    },
    {
      id: 'civil',
      name: 'Civil Law',
      short: 'Contracts & obligations',
      icon: FileText,
      desc: 'Litigation in contracts, civil liability, adverse possession, succession and real property actions before the civil courts of Baja California Sur.',
      long: 'We handle complex civil disputes involving obligations, contracts, property rights and succession, with particular emphasis on the documentary and expert evidence required to support each claim.',
      services: [
        'Contract enforcement and breach',
        'Contractual and tort liability',
        'Adverse possession (usucapión)',
        'Testate and intestate succession',
        'Reivindication and possessory actions',
        'Nullity of contracts and legal acts',
      ],
      basis: 'BCS Civil Code · Federal Code of Civil Procedure',
    },
    {
      id: 'familiar',
      name: 'Family Law',
      short: 'Family & minors',
      icon: Users,
      desc: 'Divorce, custody, alimony, adoption and dissolution of marital property with a gender perspective and a focus on the best interests of the child.',
      long: 'We assist families through legal transitions with human sensitivity and technical rigor. Every strategy is built around the best interests of the child and Supreme Court guidance on gender perspective.',
      services: [
        'Uncontested and no-fault divorce',
        'Custody and visitation arrangements',
        'Provisional and definitive child support',
        'Adoption and paternity recognition',
        'Marital property dissolution',
        'Domestic violence and protective orders',
      ],
      basis: 'BCS Civil Code · General Act on the Rights of Children and Adolescents',
    },
    {
      id: 'administrativo',
      name: 'Administrative Law',
      short: 'Facing the authority',
      icon: Building2,
      desc: 'Challenge of administrative acts, nullity of resolutions and defense before the Federal Tax & Administrative Court and state agencies.',
      long: 'Representation against federal, tax and municipal administrative acts. We pursue nullity actions, administrative appeals and contentious-administrative proceedings grounded in the principle of legality.',
      services: [
        'Federal contentious-administrative proceedings',
        'Administrative sanction procedures',
        'Review and reconsideration appeals',
        'State patrimonial liability',
        'Tax and customs defense',
        'Permits, licenses and concessions',
      ],
      basis: 'Federal Contentious-Administrative Procedure Act · Federal Administrative Procedure Act',
    },
    {
      id: 'mercantil',
      name: 'Commercial Law',
      short: 'Merchants & business',
      icon: Briefcase,
      desc: 'Disputes between merchants, breach of commercial contracts, credit instruments and bankruptcy proceedings.',
      long: 'Defense of merchants, companies and entrepreneurs in disputes arising from commercial activity. We design strategies for executive, oral and special commercial proceedings.',
      services: [
        'Executive commercial proceedings',
        'Oral commercial proceedings',
        'Collection of credit instruments (notes, checks, drafts)',
        'Rescission of commercial contracts',
        'Company formation and dissolution',
        'Commercial bankruptcy proceedings',
      ],
      basis: 'Commercial Code · General Companies Act · Commercial Bankruptcy Act',
    },
  ],
};

/* =====================================================
   TEAM DATA
   ===================================================== */
const TEAM = {
  es: [
    {
      name: 'Lic. Carlos Meza Figueroa',
      initials: 'CM',
      cedula: '2532041',
      role: 'Socio Fundador',
      specialty: ['Derecho Civil', 'Derecho Mercantil', 'Derecho Administrativo'],
      bio: 'Socio fundador con amplia trayectoria en litigio civil y mercantil ante los tribunales de Baja California Sur. Su práctica combina la solidez doctrinal con la experiencia procesal acumulada en más de dos décadas de ejercicio.',
    },
    {
      name: 'Lic. Roberto Figueroa Asociado',
      initials: 'RF',
      cedula: '01911',
      role: 'Socio',
      specialty: ['Derecho Familiar', 'Derecho Civil', 'Sucesiones'],
      bio: 'Socio especializado en derecho familiar y patrimonial. Asesora a familias y particulares en procesos de divorcio, custodia, alimentos y sucesiones con un enfoque humano y resolutivo.',
    },
    {
      name: 'Lic. Michelle Tuchmann Montaño',
      initials: 'MT',
      cedula: '14860874',
      role: 'Socia Fundadora',
      specialty: ['Amparo', 'Derecho Penal Acusatorio', 'Derecho Civil', 'Derecho Familiar'],
      bio: 'Abogada con práctica integral en el sistema acusatorio adversarial y litigio constitucional. Socia fundadora del despacho y especialista en defensa ante el Poder Judicial Federal.',
    },
  ],
  en: [
    {
      name: 'Lic. Carlos Meza Figueroa',
      initials: 'CM',
      cedula: '2532041',
      role: 'Founding Partner',
      specialty: ['Civil Law', 'Commercial Law', 'Administrative Law'],
      bio: 'Founding partner with extensive experience in civil and commercial litigation before the courts of Baja California Sur. His practice combines doctrinal strength with procedural expertise accumulated over more than two decades.',
    },
    {
      name: 'Lic. Roberto Figueroa Asociado',
      initials: 'RF',
      cedula: '01911',
      role: 'Partner',
      specialty: ['Family Law', 'Civil Law', 'Succession'],
      bio: 'Partner specialized in family and asset law. Advises families and individuals on divorce, custody, alimony and succession matters with a human, solution-driven approach.',
    },
    {
      name: 'Lic. Michelle Tuchmann Montaño',
      initials: 'MT',
      cedula: '14860874',
      role: 'Founding Partner',
      specialty: ['Amparo', 'Adversarial Criminal Law', 'Civil Law', 'Family Law'],
      bio: 'Attorney with comprehensive practice in the adversarial criminal system and constitutional litigation. Founding partner and specialist in defense before the Federal Judiciary.',
    },
  ],
};

/* =====================================================
   UTILITY COMPONENTS
   ===================================================== */

const Container = ({ children, className = '' }) => (
  <div className={`max-w-6xl mx-auto px-6 ${className}`}>{children}</div>
);

const Pretitle = ({ children, color = C.gold }) => (
  <p
    style={{ fontFamily: FONT_NARROW, color, letterSpacing: '0.2em' }}
    className="text-xs font-bold uppercase mb-4"
  >
    {children}
  </p>
);

const GoldRule = ({ width = 60, color = C.gold }) => (
  <div className="h-px" style={{ width, backgroundColor: color }} />
);

const SectionTitle = ({ pretitle, title, subtitle, light = false, center = false }) => (
  <div className={`mb-12 ${center ? 'text-center' : ''}`}>
    {pretitle && <Pretitle>{pretitle}</Pretitle>}
    <h2
      style={{ fontFamily: FONT_SERIF, color: light ? C.white : C.navy, fontWeight: 700, lineHeight: 1.15 }}
      className="text-3xl md:text-4xl mb-4"
    >
      {title}
    </h2>
    {subtitle && (
      <p
        style={{ fontFamily: FONT_SANS, color: light ? '#ffffffb3' : C.textMid, lineHeight: 1.7 }}
        className={`text-base md:text-lg max-w-2xl ${center ? 'mx-auto' : ''}`}
      >
        {subtitle}
      </p>
    )}
    <div className={`mt-6 ${center ? 'mx-auto' : ''}`}>
      <GoldRule width={48} />
    </div>
  </div>
);

const PrimaryButton = ({ children, onClick, style = {}, className = '', as = 'button', href, target }) => {
  const baseStyle = {
    backgroundColor: C.navy,
    color: C.white,
    fontFamily: FONT_SANS,
    fontWeight: 700,
    fontSize: 14,
    ...style,
  };
  const props = {
    onClick,
    onMouseEnter: (e) => { e.currentTarget.style.backgroundColor = C.gold; e.currentTarget.style.color = C.navy; },
    onMouseLeave: (e) => { e.currentTarget.style.backgroundColor = baseStyle.backgroundColor; e.currentTarget.style.color = baseStyle.color; },
    style: baseStyle,
    className: `inline-flex items-center gap-2 rounded-full px-6 py-2.5 transition-all duration-300 ${className}`,
  };
  if (as === 'a') return <a href={href} target={target} {...props}>{children}</a>;
  return <button {...props}>{children}</button>;
};

const GoldButton = ({ children, onClick, className = '', as = 'button', href, target }) => {
  const baseStyle = { backgroundColor: C.gold, color: C.navy, fontFamily: FONT_SANS, fontWeight: 700, fontSize: 15 };
  const props = {
    onClick,
    onMouseEnter: (e) => { e.currentTarget.style.backgroundColor = C.goldDark; },
    onMouseLeave: (e) => { e.currentTarget.style.backgroundColor = C.gold; },
    style: baseStyle,
    className: `inline-flex items-center gap-2 rounded-full px-8 py-3.5 transition-all duration-300 shadow-lg hover:shadow-xl ${className}`,
  };
  if (as === 'a') return <a href={href} target={target} {...props}>{children}</a>;
  return <button {...props}>{children}</button>;
};

const OutlineLightButton = ({ children, onClick, className = '' }) => (
  <button
    onClick={onClick}
    style={{ border: '1.5px solid #ffffff', color: C.white, fontFamily: FONT_SANS, fontWeight: 600, fontSize: 15 }}
    className={`inline-flex items-center gap-2 rounded-full px-8 py-3.5 transition-all duration-300 hover:bg-white/10 ${className}`}
  >
    {children}
  </button>
);

const Logo = ({ inverse = false }) => (
  <div className="flex items-center gap-2.5 md:gap-3 select-none">
    <img
      src={inverse ? '/assets/logo-mark-white.png' : '/assets/logo-mark.png'}
      alt="Meza Figueroa, Tuchmann & Asociados"
      style={{ height: 44, width: 'auto' }}
      className="flex-shrink-0"
    />
    <div>
      <div
        style={{
          fontFamily: FONT_SERIF,
          color: inverse ? C.white : C.navy,
          fontWeight: 700,
          lineHeight: 1.1,
          letterSpacing: '0.02em',
        }}
        className="text-[12px] md:text-[14px]"
      >
        <span>MEZA FIGUEROA, TUCHMANN</span>
        <span style={{ color: C.gold }}> &amp; </span>
        <span>ASOCIADOS</span>
      </div>
      <div
        style={{
          fontFamily: FONT_NARROW,
          color: C.gold,
          letterSpacing: '0.18em',
          fontWeight: 700,
        }}
        className="text-[9px] md:text-[10px] uppercase mt-0.5"
      >
        Despacho de Abogados · La Paz, B.C.S.
      </div>
    </div>
  </div>
);

/* =====================================================
   NAVBAR
   ===================================================== */

const Navbar = ({ currentPage, setPage, lang, setLang, t }) => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const links = [
    { id: 'home', label: t.nav.home },
    { id: 'areas', label: t.nav.areas },
    { id: 'firm', label: t.nav.firm },
    { id: 'team', label: t.nav.team },
    { id: 'contact', label: t.nav.contact },
  ];

  const goTo = (id) => {
    setPage(id);
    setOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <header
        className="sticky top-0 z-40 transition-all duration-300"
        style={{
          backgroundColor: C.white,
          boxShadow: scrolled ? '0 4px 24px rgba(11,61,110,0.10)' : 'none',
          borderBottom: scrolled ? 'none' : `1px solid ${C.navy}10`,
        }}
      >
        <Container className="flex items-center justify-between py-3 md:py-4">
          <button onClick={() => goTo('home')} className="flex items-center" aria-label="MFT home">
            <Logo />
          </button>

          <nav className="hidden lg:flex items-center gap-7">
            {links.map((l) => {
              const active = currentPage === l.id;
              return (
                <button
                  key={l.id}
                  onClick={() => goTo(l.id)}
                  className="relative group py-2"
                  style={{ fontFamily: FONT_SANS, color: C.navy, fontSize: 13, fontWeight: active ? 700 : 500 }}
                >
                  {l.label}
                  <span
                    className="absolute left-0 right-0 -bottom-0.5 h-0.5 transition-all duration-300"
                    style={{
                      backgroundColor: C.gold,
                      transform: active ? 'scaleX(1)' : 'scaleX(0)',
                      transformOrigin: 'left',
                    }}
                  />
                  <span
                    className="absolute left-0 right-0 -bottom-0.5 h-0.5 transition-transform duration-300 origin-left scale-x-0 group-hover:scale-x-100"
                    style={{ backgroundColor: C.gold }}
                  />
                </button>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setLang(lang === 'es' ? 'en' : 'es')}
              className="hidden md:flex items-center gap-1 px-3 py-1.5 rounded-full"
              style={{ border: `1px solid ${C.navy}20`, fontFamily: FONT_NARROW, fontSize: 11, letterSpacing: '0.1em' }}
              aria-label="Toggle language"
            >
              <Languages size={13} color={C.navy} />
              <span style={{ color: lang === 'es' ? C.navy : C.textLight, fontWeight: lang === 'es' ? 700 : 400 }}>ES</span>
              <span style={{ color: C.textLight }}>·</span>
              <span style={{ color: lang === 'en' ? C.navy : C.textLight, fontWeight: lang === 'en' ? 700 : 400 }}>EN</span>
            </button>
            <PrimaryButton onClick={() => goTo('contact')} className="hidden md:inline-flex">
              {t.nav.cta}
            </PrimaryButton>
            <button
              onClick={() => setOpen((v) => !v)}
              className="lg:hidden p-2 rounded-lg"
              style={{ color: C.navy }}
              aria-label="Menu"
            >
              {open ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </Container>
      </header>

      {/* Mobile drawer */}
      <div
        className="lg:hidden fixed inset-0 z-30 transition-opacity duration-300"
        style={{
          backgroundColor: 'rgba(6, 43, 80, 0.6)',
          opacity: open ? 1 : 0,
          pointerEvents: open ? 'auto' : 'none',
        }}
        onClick={() => setOpen(false)}
      />
      <aside
        className="lg:hidden fixed top-0 right-0 bottom-0 z-30 w-[80%] max-w-sm transition-transform duration-300"
        style={{
          backgroundColor: C.navy,
          transform: open ? 'translateX(0)' : 'translateX(100%)',
        }}
      >
        <div className="p-6 pt-24 flex flex-col h-full">
          <GoldRule width={40} />
          <nav className="mt-8 flex flex-col gap-1">
            {links.map((l) => {
              const active = currentPage === l.id;
              return (
                <button
                  key={l.id}
                  onClick={() => goTo(l.id)}
                  className="text-left py-3 px-2 rounded-lg transition-all duration-300 flex items-center justify-between"
                  style={{
                    fontFamily: FONT_SANS,
                    color: active ? C.gold : C.white,
                    fontSize: 16,
                    fontWeight: active ? 700 : 500,
                    backgroundColor: active ? '#ffffff0D' : 'transparent',
                  }}
                >
                  {l.label}
                  <ChevronRight size={16} color={active ? C.gold : '#ffffff80'} />
                </button>
              );
            })}
          </nav>
          <div className="mt-auto">
            <button
              onClick={() => setLang(lang === 'es' ? 'en' : 'es')}
              className="flex items-center gap-2 px-4 py-2 rounded-full mb-4"
              style={{ border: '1px solid #ffffff33', fontFamily: FONT_NARROW, fontSize: 11, letterSpacing: '0.15em' }}
            >
              <Languages size={13} color={C.gold} />
              <span style={{ color: lang === 'es' ? C.gold : '#ffffff80', fontWeight: lang === 'es' ? 700 : 400 }}>ES</span>
              <span style={{ color: '#ffffff80' }}>·</span>
              <span style={{ color: lang === 'en' ? C.gold : '#ffffff80', fontWeight: lang === 'en' ? 700 : 400 }}>EN</span>
            </button>
            <GoldButton onClick={() => goTo('contact')} className="w-full justify-center">
              {t.nav.cta} <ArrowRight size={16} />
            </GoldButton>
          </div>
        </div>
      </aside>
    </>
  );
};

/* =====================================================
   HOME PAGE — HERO
   ===================================================== */

const Hero = ({ t, setPage }) => (
  <section
    className="relative overflow-hidden"
    style={{
      background: `linear-gradient(135deg, ${C.navy} 0%, ${C.navyDark} 100%)`,
    }}
  >
    {/* Diagonal lines pattern overlay */}
    <div
      className="absolute inset-0 pointer-events-none"
      style={{
        backgroundImage: 'repeating-linear-gradient(135deg, rgba(255,255,255,0.05) 0px, rgba(255,255,255,0.05) 1px, transparent 1px, transparent 12px)',
      }}
    />
    {/* Decorative blob */}
    <div
      className="absolute -right-32 -top-32 w-96 h-96 rounded-full pointer-events-none"
      style={{ background: `radial-gradient(circle, ${C.gold}1F 0%, transparent 70%)` }}
    />
    <Container className="relative py-20 md:py-28 lg:py-36">
      <div className="grid lg:grid-cols-[1.4fr_1fr] gap-12 items-center">
        <div>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-1 h-20" style={{ backgroundColor: C.gold }} />
            <Pretitle>{t.hero.pretitle}</Pretitle>
          </div>
          <h1
            style={{ fontFamily: FONT_SERIF, color: C.white, fontWeight: 700, lineHeight: 1.1 }}
            className="text-[34px] md:text-[44px] lg:text-[52px] mb-6"
          >
            {t.hero.title1}
            <br />
            {t.hero.title2}
            <em style={{ color: C.gold }}>{t.hero.titleAccent}</em>
          </h1>
          <p
            style={{ fontFamily: FONT_SANS, color: '#ffffffcc', lineHeight: 1.7 }}
            className="text-base md:text-[17px] max-w-xl mb-10"
          >
            {t.hero.desc}
          </p>
          <div className="flex flex-wrap gap-4">
            <GoldButton onClick={() => { setPage('contact'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
              {t.hero.ctaPrimary} <ArrowRight size={16} />
            </GoldButton>
            <OutlineLightButton onClick={() => { setPage('firm'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
              {t.hero.ctaSecondary}
            </OutlineLightButton>
          </div>
        </div>

        {/* Floating contact card */}
        <div
          className="rounded-2xl p-6 md:p-7"
          style={{
            backgroundColor: 'rgba(255,255,255,0.08)',
            border: '1px solid rgba(255,255,255,0.18)',
            backdropFilter: 'blur(14px)',
            WebkitBackdropFilter: 'blur(14px)',
          }}
        >
          <GoldRule width={36} />
          <p style={{ fontFamily: FONT_SERIF, color: C.white, fontWeight: 700 }} className="text-xl mt-4 mb-1">
            {t.hero.contactCardTitle}
          </p>
          <p style={{ fontFamily: FONT_SANS, color: '#ffffffb3' }} className="text-sm mb-6">
            {t.hero.contactCardSub}
          </p>
          <div className="space-y-4">
            {[
              { Icon: MapPin, text: 'Nayarit 1025, Col. Pueblo Nuevo, La Paz, B.C.S.' },
              { Icon: Phone, text: '612 146 3512' },
              { Icon: MessageCircle, text: 'WhatsApp · 612 111 0641 · 612 140 2313' },
              { Icon: Mail, text: 'meficlientes@gmail.com' },
            ].map(({ Icon, text }, i) => (
              <div key={i} className="flex items-start gap-3">
                <div
                  className="w-9 h-9 rounded-lg flex-shrink-0 flex items-center justify-center"
                  style={{ backgroundColor: 'rgba(201,168,76,0.15)' }}
                >
                  <Icon size={16} color={C.gold} strokeWidth={1.8} />
                </div>
                <span style={{ fontFamily: FONT_SANS, color: C.white, fontSize: 13, lineHeight: 1.55 }}>{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Container>
  </section>
);

/* =====================================================
   HOME — AREAS PREVIEW
   ===================================================== */

const AreasPreview = ({ t, lang, setPage, setAreaId }) => {
  const areas = AREAS_DATA[lang];
  return (
    <section className="py-20" style={{ backgroundColor: C.bg }}>
      <Container>
        <SectionTitle pretitle={t.areas.pretitle} title={t.areas.title} subtitle={t.areas.subtitle} center />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {areas.map((a) => {
            const Icon = a.icon;
            return (
              <div
                key={a.id}
                className="rounded-2xl p-8 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl cursor-pointer group"
                style={{ backgroundColor: C.white, border: `1px solid ${C.navy}1A` }}
                onClick={() => { setAreaId(a.id); setPage('areas'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              >
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center mb-5 transition-colors duration-300 group-hover:scale-110"
                  style={{ backgroundColor: `${C.navy}14` }}
                >
                  <Icon size={28} color={C.navy} strokeWidth={1.6} />
                </div>
                <h3 style={{ fontFamily: FONT_SERIF, color: C.navy, fontWeight: 700 }} className="text-lg mb-3">
                  {a.name}
                </h3>
                <p style={{ fontFamily: FONT_SANS, color: C.textMid, lineHeight: 1.65 }} className="text-sm mb-5">
                  {a.desc}
                </p>
                <span
                  style={{ fontFamily: FONT_SANS, color: C.gold, fontWeight: 700 }}
                  className="text-sm inline-flex items-center gap-1 group-hover:underline"
                >
                  {t.common.readMore} <ArrowRight size={14} />
                </span>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
};

/* =====================================================
   HOME — WHY US
   ===================================================== */

const WhyUs = ({ t }) => {
  const icons = [Award, BookOpen, UserCheck, Shield];
  return (
    <section className="py-20 relative overflow-hidden" style={{ backgroundColor: C.navy }}>
      <div className="absolute top-0 left-0 right-0 flex justify-center">
        <GoldRule width={120} />
      </div>
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'repeating-linear-gradient(45deg, rgba(255,255,255,0.03) 0px, rgba(255,255,255,0.03) 1px, transparent 1px, transparent 16px)',
        }}
      />
      <Container className="relative">
        <SectionTitle pretitle={t.why.pretitle} title={t.why.title} subtitle={t.why.subtitle} light />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {t.why.items.map((it, i) => {
            const Icon = icons[i];
            return (
              <div
                key={i}
                className="rounded-2xl p-7 transition-all duration-300 hover:bg-white/5"
                style={{ border: '1px solid rgba(255,255,255,0.12)' }}
              >
                <div className="flex items-start gap-4">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: 'rgba(201,168,76,0.15)' }}
                  >
                    <Icon size={22} color={C.gold} strokeWidth={1.8} />
                  </div>
                  <div>
                    <h3 style={{ fontFamily: FONT_SERIF, color: C.white, fontWeight: 700 }} className="text-lg mb-2">
                      {it.title}
                    </h3>
                    <p style={{ fontFamily: FONT_SANS, color: '#ffffffb3', lineHeight: 1.65 }} className="text-sm">
                      {it.desc}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
};

/* =====================================================
   HOME — STATS
   ===================================================== */

const Stats = ({ t }) => (
  <section className="py-20" style={{ backgroundColor: C.white }}>
    <Container>
      <div className="text-center mb-12">
        <Pretitle>{t.stats.pretitle}</Pretitle>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {t.stats.items.map((s, i) => (
          <div key={i} className="text-center">
            <div
              style={{
                fontFamily: FONT_SERIF,
                color: C.navy,
                fontWeight: 700,
                fontSize: 48,
                lineHeight: 1,
              }}
              className="md:text-[56px]"
            >
              {s.num}
            </div>
            <div className="mt-3 flex justify-center"><GoldRule width={24} /></div>
            <p
              style={{ fontFamily: FONT_SANS, color: C.textLight, letterSpacing: '0.04em' }}
              className="text-xs md:text-[13px] mt-3 uppercase font-bold"
            >
              {s.label}
            </p>
          </div>
        ))}
      </div>
    </Container>
  </section>
);

/* =====================================================
   HOME — PROCESS
   ===================================================== */

const Process = ({ t }) => (
  <section className="py-20" style={{ backgroundColor: C.bg }}>
    <Container>
      <SectionTitle pretitle={t.process.pretitle} title={t.process.title} subtitle={t.process.subtitle} center />
      <div className="relative grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="hidden md:block absolute top-7 left-[12.5%] right-[12.5%] h-px" style={{ backgroundColor: `${C.gold}66` }} />
        {t.process.steps.map((s, i) => (
          <div key={i} className="relative text-center">
            <div
              className="mx-auto w-14 h-14 rounded-full flex items-center justify-center relative z-10"
              style={{ backgroundColor: C.gold, color: C.navy, fontFamily: FONT_SERIF, fontWeight: 700, fontSize: 22 }}
            >
              {i + 1}
            </div>
            <h4
              style={{ fontFamily: FONT_SERIF, color: C.navy, fontWeight: 700 }}
              className="text-lg mt-5 mb-2"
            >
              {s.title}
            </h4>
            <p style={{ fontFamily: FONT_SANS, color: C.textMid, lineHeight: 1.65 }} className="text-sm">
              {s.desc}
            </p>
          </div>
        ))}
      </div>
    </Container>
  </section>
);

/* =====================================================
   HOME — CTA FINAL
   ===================================================== */

const CTAFinal = ({ t, setPage }) => (
  <section
    className="py-20 relative overflow-hidden"
    style={{ background: `linear-gradient(135deg, ${C.navy} 0%, ${C.navyDark} 100%)` }}
  >
    <div
      className="absolute inset-0 pointer-events-none"
      style={{
        backgroundImage: 'repeating-linear-gradient(-45deg, rgba(255,255,255,0.03) 0px, rgba(255,255,255,0.03) 1px, transparent 1px, transparent 18px)',
      }}
    />
    <Container className="relative text-center">
      <div className="mx-auto"><GoldRule width={48} /></div>
      <Pretitle>{t.cta.pretitle}</Pretitle>
      <h2
        style={{ fontFamily: FONT_SERIF, color: C.white, fontWeight: 700, lineHeight: 1.15 }}
        className="text-3xl md:text-4xl mb-4"
      >
        {t.cta.title}
      </h2>
      <p
        style={{ fontFamily: FONT_SANS, color: '#ffffffcc', lineHeight: 1.7 }}
        className="text-base md:text-lg max-w-xl mx-auto mb-10"
      >
        {t.cta.subtitle}
      </p>
      <div className="flex flex-wrap items-center justify-center gap-4">
        <GoldButton onClick={() => { setPage('contact'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
          {t.cta.primary} <ArrowRight size={16} />
        </GoldButton>
        <a
          href="tel:6121463512"
          style={{ fontFamily: FONT_SANS, color: C.white, fontWeight: 600 }}
          className="inline-flex items-center gap-2 px-6 py-3 text-sm hover:underline"
        >
          <Phone size={16} /> {t.cta.phone}
        </a>
        <a
          href="https://wa.me/526121110641"
          target="_blank"
          rel="noreferrer"
          style={{ fontFamily: FONT_SANS, color: C.white, fontWeight: 600 }}
          className="inline-flex items-center gap-2 px-6 py-3 text-sm hover:underline"
        >
          <MessageCircle size={16} /> {t.cta.whatsapp}
        </a>
      </div>
    </Container>
  </section>
);

/* =====================================================
   HOME PAGE
   ===================================================== */

const HomePage = ({ t, lang, setPage, setAreaId }) => (
  <>
    <Hero t={t} setPage={setPage} />
    <AreasPreview t={t} lang={lang} setPage={setPage} setAreaId={setAreaId} />
    <WhyUs t={t} />
    <Stats t={t} />
    <Process t={t} />
    <CTAFinal t={t} setPage={setPage} />
  </>
);

/* =====================================================
   AREAS PAGE
   ===================================================== */

const AreasPage = ({ t, lang, setPage, areaId, setAreaId }) => {
  const areas = AREAS_DATA[lang];
  const [expanded, setExpanded] = useState(areaId || areas[0].id);

  useEffect(() => {
    if (areaId) setExpanded(areaId);
  }, [areaId]);

  return (
    <section className="py-16 md:py-20" style={{ backgroundColor: C.bg }}>
      <Container>
        <SectionTitle pretitle={t.areas.pretitle} title={t.areas.title} subtitle={t.areas.subtitle} />
        <div className="space-y-4">
          {areas.map((a) => {
            const Icon = a.icon;
            const isOpen = expanded === a.id;
            return (
              <div
                key={a.id}
                className="rounded-2xl overflow-hidden transition-all duration-300"
                style={{ backgroundColor: C.white, border: `1px solid ${isOpen ? C.gold : `${C.navy}1A`}` }}
              >
                <button
                  onClick={() => setExpanded(isOpen ? null : a.id)}
                  className="w-full text-left p-6 md:p-7 flex items-center gap-5"
                >
                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: `${C.navy}14` }}
                  >
                    <Icon size={26} color={C.navy} strokeWidth={1.6} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p style={{ fontFamily: FONT_NARROW, color: C.gold, letterSpacing: '0.15em' }} className="text-[10px] uppercase font-bold mb-1">
                      {a.short}
                    </p>
                    <h3 style={{ fontFamily: FONT_SERIF, color: C.navy, fontWeight: 700 }} className="text-xl md:text-2xl">
                      {a.name}
                    </h3>
                  </div>
                  <ChevronDown
                    size={22}
                    color={C.navy}
                    className="transition-transform duration-300 flex-shrink-0"
                    style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
                  />
                </button>
                <div
                  className="overflow-hidden transition-all duration-500"
                  style={{ maxHeight: isOpen ? 1200 : 0 }}
                >
                  <div className="px-6 md:px-7 pb-7 pt-2">
                    <div className="grid md:grid-cols-[2fr_1fr] gap-8 pt-4 border-t" style={{ borderColor: `${C.navy}10` }}>
                      <div>
                        <p style={{ fontFamily: FONT_SANS, color: C.textMid, lineHeight: 1.75 }} className="text-base mb-6">
                          {a.long}
                        </p>
                        <Pretitle>{t.areaDetails.services}</Pretitle>
                        <ul className="space-y-2">
                          {a.services.map((s, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <CheckCircle2 size={16} color={C.gold} className="flex-shrink-0 mt-0.5" />
                              <span style={{ fontFamily: FONT_SANS, color: C.text, lineHeight: 1.6 }} className="text-sm">{s}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <div
                          className="rounded-xl p-5 mb-5"
                          style={{ backgroundColor: C.bg, border: `1px solid ${C.navy}14` }}
                        >
                          <Pretitle>{t.areaDetails.legalBasis}</Pretitle>
                          <p style={{ fontFamily: FONT_SERIF, color: C.navy, fontWeight: 700, lineHeight: 1.5 }} className="text-base">
                            {a.basis}
                          </p>
                        </div>
                        <PrimaryButton
                          onClick={() => { setPage('contact'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                          className="w-full justify-center"
                        >
                          {t.common.consultCase} <ArrowRight size={16} />
                        </PrimaryButton>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
};

/* =====================================================
   FIRM PAGE
   ===================================================== */

const FirmPage = ({ t }) => (
  <>
    <section className="py-16 md:py-20" style={{ backgroundColor: C.white }}>
      <Container>
        <div className="grid lg:grid-cols-[1.2fr_1fr] gap-12 items-start">
          <div>
            <Pretitle>{t.firmPage.pretitle}</Pretitle>
            <h1
              style={{ fontFamily: FONT_SERIF, color: C.navy, fontWeight: 700, lineHeight: 1.15 }}
              className="text-3xl md:text-4xl lg:text-[42px] mb-6"
            >
              {t.firmPage.title}
            </h1>
            <GoldRule width={48} />
            <p style={{ fontFamily: FONT_SANS, color: C.textMid, lineHeight: 1.75 }} className="text-base md:text-[17px] mt-6">
              {t.firmPage.history}
            </p>

            <div className="mt-10 flex flex-wrap gap-3">
              {t.firmPage.values.map((v) => (
                <span
                  key={v}
                  className="px-4 py-2 rounded-full"
                  style={{
                    backgroundColor: `${C.gold}1F`,
                    color: C.navy,
                    fontFamily: FONT_SERIF,
                    fontWeight: 700,
                    fontSize: 14,
                    border: `1px solid ${C.gold}66`,
                  }}
                >
                  {v}
                </span>
              ))}
            </div>
          </div>

          <div
            className="rounded-2xl p-8 md:p-10 relative overflow-hidden flex flex-col items-center text-center"
            style={{ background: `linear-gradient(135deg, ${C.navy}, ${C.navyDark})`, color: C.white }}
          >
            <img
              src="/assets/logo-mft-white.png"
              alt="Meza Figueroa, Tuchmann & Asociados"
              style={{ height: 170, width: 'auto' }}
              className="mb-6"
            />
            <GoldRule width={36} />
            <p style={{ fontFamily: FONT_SERIF, fontStyle: 'italic', fontWeight: 400, lineHeight: 1.5 }} className="text-lg md:text-xl mt-5 mb-4">
              "{t.common.tagline}"
            </p>
            <p style={{ fontFamily: FONT_NARROW, color: C.gold, letterSpacing: '0.2em' }} className="text-[11px] uppercase font-bold">
              MFT · 2010 — 2025
            </p>
          </div>
        </div>
      </Container>
    </section>

    <section className="py-16" style={{ backgroundColor: C.bg }}>
      <Container>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="rounded-2xl p-8 md:p-10" style={{ backgroundColor: C.white, border: `1px solid ${C.navy}14` }}>
            <Pretitle>{t.firmPage.missionTitle}</Pretitle>
            <h3 style={{ fontFamily: FONT_SERIF, color: C.navy, fontWeight: 700 }} className="text-2xl mb-4">
              {t.firmPage.missionTitle}
            </h3>
            <GoldRule width={36} />
            <p style={{ fontFamily: FONT_SANS, color: C.textMid, lineHeight: 1.75 }} className="text-base mt-5">
              {t.firmPage.mission}
            </p>
          </div>
          <div className="rounded-2xl p-8 md:p-10" style={{ backgroundColor: C.white, border: `1px solid ${C.navy}14` }}>
            <Pretitle>{t.firmPage.visionTitle}</Pretitle>
            <h3 style={{ fontFamily: FONT_SERIF, color: C.navy, fontWeight: 700 }} className="text-2xl mb-4">
              {t.firmPage.visionTitle}
            </h3>
            <GoldRule width={36} />
            <p style={{ fontFamily: FONT_SANS, color: C.textMid, lineHeight: 1.75 }} className="text-base mt-5">
              {t.firmPage.vision}
            </p>
          </div>
        </div>
      </Container>
    </section>

    <section className="py-16" style={{ backgroundColor: C.white }}>
      <Container>
        <SectionTitle title={t.firmPage.jurisdictionsTitle} subtitle={t.firmPage.jurisdictionsDesc} />
        <div className="grid md:grid-cols-2 gap-6">
          {[
            { title: t.firmPage.local, sub: 'La Paz · Los Cabos · Comondú · Mulegé · Loreto', icon: MapPin },
            { title: t.firmPage.federal, sub: 'Poder Judicial de la Federación · TFJA', icon: Globe },
          ].map((j, i) => {
            const I = j.icon;
            return (
              <div
                key={i}
                className="rounded-2xl p-8 relative overflow-hidden"
                style={{ backgroundColor: C.navy, color: C.white }}
              >
                <div className="absolute top-0 right-0 w-32 h-32 -translate-y-12 translate-x-12 rounded-full" style={{ backgroundColor: `${C.gold}1F` }} />
                <I size={28} color={C.gold} />
                <h4 style={{ fontFamily: FONT_SERIF, fontWeight: 700 }} className="text-xl mt-4 mb-2">{j.title}</h4>
                <GoldRule width={32} />
                <p style={{ fontFamily: FONT_SANS, color: '#ffffffcc', lineHeight: 1.65 }} className="text-sm mt-3">
                  {j.sub}
                </p>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  </>
);

/* =====================================================
   TEAM PAGE
   ===================================================== */

const TeamPage = ({ t, lang, setPage }) => (
  <section className="py-16 md:py-20" style={{ backgroundColor: C.bg }}>
    <Container>
      <SectionTitle pretitle={t.teamPage.pretitle} title={t.teamPage.title} subtitle={t.teamPage.subtitle} center />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {TEAM[lang].map((p) => (
          <div
            key={p.cedula}
            className="rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
            style={{ backgroundColor: C.white, border: `1px solid ${C.navy}14` }}
          >
            <div className="p-8 text-center" style={{ borderBottom: `1px solid ${C.navy}10` }}>
              <div
                className="mx-auto w-24 h-24 rounded-full flex items-center justify-center mb-5"
                style={{ backgroundColor: `${C.navy}14`, border: `2px solid ${C.gold}` }}
              >
                <span style={{ fontFamily: FONT_SERIF, color: C.navy, fontWeight: 700, fontSize: 30 }}>{p.initials}</span>
              </div>
              <h3 style={{ fontFamily: FONT_SERIF, color: C.navy, fontWeight: 700 }} className="text-xl mb-1">
                {p.name}
              </h3>
              <p style={{ fontFamily: FONT_NARROW, color: C.textLight, letterSpacing: '0.12em' }} className="text-[11px] uppercase font-bold mb-3">
                {t.common.cedula}: {p.cedula}
              </p>
              <p style={{ fontFamily: FONT_NARROW, color: C.gold, letterSpacing: '0.18em' }} className="text-[10px] uppercase font-bold">
                {p.role}
              </p>
            </div>
            <div className="p-7">
              <div className="flex flex-wrap gap-2 mb-5">
                {p.specialty.map((s) => (
                  <span
                    key={s}
                    style={{
                      fontFamily: FONT_NARROW,
                      color: C.goldDark,
                      backgroundColor: `${C.gold}1A`,
                      letterSpacing: '0.05em',
                      border: `1px solid ${C.gold}40`,
                    }}
                    className="text-[11px] px-2.5 py-1 rounded-full font-bold uppercase"
                  >
                    {s}
                  </span>
                ))}
              </div>
              <p style={{ fontFamily: FONT_SANS, color: C.textMid, lineHeight: 1.7 }} className="text-sm">
                {p.bio}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 text-center">
        <PrimaryButton onClick={() => { setPage('contact'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
          {t.nav.cta} <ArrowRight size={16} />
        </PrimaryButton>
      </div>
    </Container>
  </section>
);

/* =====================================================
   CONTACT PAGE
   ===================================================== */

const ContactPage = ({ t, lang }) => {
  const [form, setForm] = useState({ name: '', email: '', phone: '', area: '', message: '' });
  const onChange = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const onSubmit = (e) => {
    e.preventDefault();
    const subject = encodeURIComponent(`Consulta jurídica — ${form.area || (lang === 'es' ? 'General' : 'General')}`);
    const body = encodeURIComponent(
      (lang === 'es'
        ? `Nombre: ${form.name}\nCorreo: ${form.email}\nTeléfono: ${form.phone}\nÁrea: ${form.area}\n\nDescripción del caso:\n${form.message}`
        : `Name: ${form.name}\nEmail: ${form.email}\nPhone: ${form.phone}\nArea: ${form.area}\n\nCase description:\n${form.message}`)
    );
    window.open(`mailto:meficlientes@gmail.com?subject=${subject}&body=${body}`);
  };

  const mapsUrl = 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent('Nayarit 1025, Pueblo Nuevo, La Paz, Baja California Sur, 23060');
  const waUrl = 'https://wa.me/526121110641?text=' + encodeURIComponent(lang === 'es' ? 'Hola, me gustaría consultar sobre mi caso.' : 'Hello, I would like to consult about my case.');

  const inputStyle = {
    backgroundColor: C.white,
    border: `1.5px solid ${C.navy}26`,
    fontFamily: FONT_SANS,
    fontSize: 14,
    color: C.text,
  };

  return (
    <section className="py-16 md:py-20" style={{ backgroundColor: C.bg }}>
      <Container>
        <SectionTitle pretitle={t.contactPage.pretitle} title={t.contactPage.title} subtitle={t.contactPage.subtitle} center />
        <div className="grid lg:grid-cols-2 gap-8">
          {/* FORM */}
          <form
            onSubmit={onSubmit}
            className="rounded-2xl p-8 md:p-10"
            style={{ backgroundColor: C.white, border: `1px solid ${C.navy}14` }}
          >
            <div className="space-y-5">
              <div>
                <label style={{ fontFamily: FONT_NARROW, color: C.gold, letterSpacing: '0.15em' }} className="text-[10px] uppercase font-bold block mb-1.5">
                  {t.contactPage.form.name} *
                </label>
                <input
                  required
                  type="text"
                  value={form.name}
                  onChange={onChange('name')}
                  className="w-full px-4 py-3 rounded-lg outline-none transition-colors duration-300"
                  style={inputStyle}
                  onFocus={(e) => (e.currentTarget.style.borderColor = C.navy)}
                  onBlur={(e) => (e.currentTarget.style.borderColor = `${C.navy}26`)}
                />
              </div>
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label style={{ fontFamily: FONT_NARROW, color: C.gold, letterSpacing: '0.15em' }} className="text-[10px] uppercase font-bold block mb-1.5">
                    {t.contactPage.form.email} *
                  </label>
                  <input
                    required
                    type="email"
                    value={form.email}
                    onChange={onChange('email')}
                    className="w-full px-4 py-3 rounded-lg outline-none transition-colors duration-300"
                    style={inputStyle}
                    onFocus={(e) => (e.currentTarget.style.borderColor = C.navy)}
                    onBlur={(e) => (e.currentTarget.style.borderColor = `${C.navy}26`)}
                  />
                </div>
                <div>
                  <label style={{ fontFamily: FONT_NARROW, color: C.gold, letterSpacing: '0.15em' }} className="text-[10px] uppercase font-bold block mb-1.5">
                    {t.contactPage.form.phone}
                  </label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={onChange('phone')}
                    className="w-full px-4 py-3 rounded-lg outline-none transition-colors duration-300"
                    style={inputStyle}
                    onFocus={(e) => (e.currentTarget.style.borderColor = C.navy)}
                    onBlur={(e) => (e.currentTarget.style.borderColor = `${C.navy}26`)}
                  />
                </div>
              </div>
              <div>
                <label style={{ fontFamily: FONT_NARROW, color: C.gold, letterSpacing: '0.15em' }} className="text-[10px] uppercase font-bold block mb-1.5">
                  {t.contactPage.form.area} *
                </label>
                <select
                  required
                  value={form.area}
                  onChange={onChange('area')}
                  className="w-full px-4 py-3 rounded-lg outline-none transition-colors duration-300"
                  style={inputStyle}
                  onFocus={(e) => (e.currentTarget.style.borderColor = C.navy)}
                  onBlur={(e) => (e.currentTarget.style.borderColor = `${C.navy}26`)}
                >
                  <option value="">{t.contactPage.form.selectArea}</option>
                  {AREAS_DATA[lang].map((a) => (
                    <option key={a.id} value={a.name}>{a.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={{ fontFamily: FONT_NARROW, color: C.gold, letterSpacing: '0.15em' }} className="text-[10px] uppercase font-bold block mb-1.5">
                  {t.contactPage.form.message} *
                </label>
                <textarea
                  required
                  rows={4}
                  value={form.message}
                  onChange={onChange('message')}
                  className="w-full px-4 py-3 rounded-lg outline-none transition-colors duration-300 resize-none"
                  style={inputStyle}
                  onFocus={(e) => (e.currentTarget.style.borderColor = C.navy)}
                  onBlur={(e) => (e.currentTarget.style.borderColor = `${C.navy}26`)}
                />
              </div>
              <button
                type="submit"
                className="w-full inline-flex items-center justify-center gap-2 rounded-full px-8 py-3.5 transition-all duration-300"
                style={{ backgroundColor: C.navy, color: C.white, fontFamily: FONT_SANS, fontWeight: 700, fontSize: 15 }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = C.gold; e.currentTarget.style.color = C.navy; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = C.navy; e.currentTarget.style.color = C.white; }}
              >
                {t.contactPage.form.submit} <ArrowRight size={16} />
              </button>
            </div>
          </form>

          {/* INFO + MAP */}
          <div className="space-y-6">
            <div
              className="rounded-2xl p-8 md:p-10"
              style={{ backgroundColor: C.navy, color: C.white }}
            >
              <GoldRule width={40} />
              <h3 style={{ fontFamily: FONT_SERIF, fontWeight: 700 }} className="text-2xl mt-4 mb-6">
                {t.nav.contact}
              </h3>
              <div className="space-y-5">
                {[
                  { Icon: MapPin, label: t.contactPage.info.address, value: t.contactPage.info.addressValue },
                  { Icon: Phone, label: t.contactPage.info.phone, value: '612 146 3512', href: 'tel:6121463512' },
                  { Icon: MessageCircle, label: t.contactPage.info.whatsapp, value: '612 111 0641 · 612 140 2313', href: waUrl, target: '_blank' },
                  { Icon: Mail, label: t.contactPage.info.email, value: 'meficlientes@gmail.com', href: 'mailto:meficlientes@gmail.com' },
                  { Icon: Clock, label: t.contactPage.info.hours, value: t.contactPage.info.hoursValue },
                ].map(({ Icon, label, value, href, target }, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div
                      className="w-9 h-9 rounded-lg flex-shrink-0 flex items-center justify-center"
                      style={{ backgroundColor: 'rgba(201,168,76,0.15)' }}
                    >
                      <Icon size={16} color={C.gold} strokeWidth={1.8} />
                    </div>
                    <div>
                      <p style={{ fontFamily: FONT_NARROW, color: C.gold, letterSpacing: '0.15em' }} className="text-[10px] uppercase font-bold mb-0.5">
                        {label}
                      </p>
                      {href ? (
                        <a href={href} target={target} style={{ fontFamily: FONT_SANS, color: C.white, lineHeight: 1.55 }} className="text-sm hover:underline">
                          {value}
                        </a>
                      ) : (
                        <p style={{ fontFamily: FONT_SANS, color: C.white, lineHeight: 1.55 }} className="text-sm">{value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <a
                href={waUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-6 w-full inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 transition-all duration-300"
                style={{ backgroundColor: '#25D366', color: C.white, fontFamily: FONT_SANS, fontWeight: 700, fontSize: 14 }}
              >
                <MessageCircle size={18} /> {t.contactPage.info.whatsappCTA}
              </a>
            </div>

            {/* Map placeholder */}
            <a
              href={mapsUrl}
              target="_blank"
              rel="noreferrer"
              className="block rounded-2xl overflow-hidden relative group"
              style={{
                backgroundColor: `${C.navy}0D`,
                border: `1px solid ${C.navy}26`,
                aspectRatio: '16 / 9',
              }}
            >
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  backgroundImage: `
                    linear-gradient(${C.navy}1A 1px, transparent 1px),
                    linear-gradient(90deg, ${C.navy}1A 1px, transparent 1px)
                  `,
                  backgroundSize: '24px 24px',
                }}
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center mb-3 transition-transform duration-300 group-hover:scale-110"
                  style={{ backgroundColor: C.gold }}
                >
                  <MapPin size={22} color={C.navy} />
                </div>
                <p style={{ fontFamily: FONT_SERIF, color: C.navy, fontWeight: 700 }} className="text-base mb-1">
                  Nayarit 1025, Pueblo Nuevo
                </p>
                <p style={{ fontFamily: FONT_NARROW, color: C.navy, letterSpacing: '0.15em' }} className="text-[10px] uppercase font-bold">
                  {t.contactPage.info.mapCTA} →
                </p>
              </div>
            </a>
          </div>
        </div>
      </Container>
    </section>
  );
};

/* =====================================================
   FOOTER
   ===================================================== */

const Footer = ({ t, lang, setPage }) => {
  const go = (id) => () => { setPage(id); window.scrollTo({ top: 0, behavior: 'smooth' }); };
  return (
    <footer style={{ backgroundColor: C.navy, color: C.white }}>
      <div className="h-1" style={{ backgroundColor: C.gold }} />
      <Container className="py-14 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <Logo inverse />
            <p style={{ fontFamily: FONT_SERIF, color: C.gold, fontStyle: 'italic' }} className="text-base mt-5">
              "{t.footer.tagline}"
            </p>
            <div className="mt-5"><GoldRule width={36} /></div>
            <p style={{ fontFamily: FONT_NARROW, color: '#ffffff80', letterSpacing: '0.15em' }} className="text-[10px] uppercase mt-4">
              La Paz · B.C.S. · México
            </p>
          </div>

          <div>
            <p style={{ fontFamily: FONT_NARROW, color: C.gold, letterSpacing: '0.2em' }} className="text-[10px] uppercase font-bold mb-5">
              {t.footer.quickNav}
            </p>
            <ul className="space-y-2.5">
              {[
                ['home', t.nav.home],
                ['areas', t.nav.areas],
                ['firm', t.nav.firm],
                ['team', t.nav.team],
                ['contact', t.nav.contact],
              ].map(([id, label]) => (
                <li key={id}>
                  <button
                    onClick={go(id)}
                    style={{ fontFamily: FONT_SANS, color: '#ffffffb3' }}
                    className="text-sm hover:text-white transition-colors duration-300"
                  >
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p style={{ fontFamily: FONT_NARROW, color: C.gold, letterSpacing: '0.2em' }} className="text-[10px] uppercase font-bold mb-5">
              {t.footer.areas}
            </p>
            <ul className="space-y-2.5">
              {AREAS_DATA[lang].map((a) => (
                <li key={a.id}>
                  <button
                    onClick={go('areas')}
                    style={{ fontFamily: FONT_SANS, color: '#ffffffb3' }}
                    className="text-sm hover:text-white transition-colors duration-300 text-left"
                  >
                    {a.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p style={{ fontFamily: FONT_NARROW, color: C.gold, letterSpacing: '0.2em' }} className="text-[10px] uppercase font-bold mb-5">
              {t.footer.contact}
            </p>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <MapPin size={14} color={C.gold} className="flex-shrink-0 mt-1" />
                <span style={{ fontFamily: FONT_SANS, color: '#ffffffb3', lineHeight: 1.55 }} className="text-sm">
                  Nayarit 1025, Pueblo Nuevo, La Paz B.C.S., C.P. 23060
                </span>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={14} color={C.gold} className="flex-shrink-0" />
                <a href="tel:6121463512" style={{ fontFamily: FONT_SANS, color: '#ffffffb3' }} className="text-sm hover:text-white">612 146 3512</a>
              </li>
              <li className="flex items-center gap-2">
                <MessageCircle size={14} color={C.gold} className="flex-shrink-0" />
                <a href="https://wa.me/526121110641" target="_blank" rel="noreferrer" style={{ fontFamily: FONT_SANS, color: '#ffffffb3' }} className="text-sm hover:text-white">
                  612 111 0641 · 612 140 2313
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={14} color={C.gold} className="flex-shrink-0" />
                <a href="mailto:meficlientes@gmail.com" style={{ fontFamily: FONT_SANS, color: '#ffffffb3' }} className="text-sm hover:text-white">
                  meficlientes@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t flex flex-col md:flex-row justify-between gap-2" style={{ borderColor: '#ffffff14' }}>
          <p style={{ fontFamily: FONT_SANS, color: '#ffffff66' }} className="text-xs">
            {t.footer.rights}
          </p>
          <p style={{ fontFamily: FONT_NARROW, color: '#ffffff66', letterSpacing: '0.15em' }} className="text-[10px] uppercase">
            {t.footer.cedulas}
          </p>
        </div>
      </Container>
    </footer>
  );
};

/* =====================================================
   FLOATING WHATSAPP
   ===================================================== */

const FloatingWhatsApp = ({ tip }) => {
  const [hover, setHover] = useState(false);
  return (
    <a
      href="https://wa.me/526121110641?text=Hola%2C%20me%20gustaría%20consultar%20sobre%20mi%20caso."
      target="_blank"
      rel="noreferrer"
      className="fixed bottom-6 right-6 z-30 flex items-center gap-3 group"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      aria-label={tip}
    >
      <span
        className="hidden md:inline-block px-4 py-2 rounded-full transition-all duration-300"
        style={{
          backgroundColor: C.white,
          color: C.navy,
          fontFamily: FONT_SANS,
          fontSize: 13,
          fontWeight: 600,
          boxShadow: '0 8px 24px rgba(11,61,110,0.15)',
          opacity: hover ? 1 : 0,
          transform: hover ? 'translateX(0)' : 'translateX(8px)',
          pointerEvents: 'none',
        }}
      >
        {tip}
      </span>
      <span
        className="w-14 h-14 rounded-full flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
        style={{ backgroundColor: '#25D366', boxShadow: '0 10px 30px rgba(37,211,102,0.35)' }}
      >
        <MessageCircle size={24} color={C.white} />
      </span>
    </a>
  );
};

/* =====================================================
   ROOT COMPONENT
   ===================================================== */

export default function MFTWebsite() {
  const [lang, setLang] = useState('es');
  const [currentPage, setCurrentPage] = useState('home');
  const [areaId, setAreaId] = useState(null);

  const t = T[lang];

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage t={t} lang={lang} setPage={setCurrentPage} setAreaId={setAreaId} />;
      case 'areas':
        return <AreasPage t={t} lang={lang} setPage={setCurrentPage} areaId={areaId} setAreaId={setAreaId} />;
      case 'firm':
        return <FirmPage t={t} />;
      case 'team':
        return <TeamPage t={t} lang={lang} setPage={setCurrentPage} />;
      case 'contact':
        return <ContactPage t={t} lang={lang} />;
      default:
        return <HomePage t={t} lang={lang} setPage={setCurrentPage} setAreaId={setAreaId} />;
    }
  };

  return (
    <div style={{ backgroundColor: C.bg, color: C.text, minHeight: '100vh' }}>
      <Navbar currentPage={currentPage} setPage={setCurrentPage} lang={lang} setLang={setLang} t={t} />
      <main>{renderPage()}</main>
      <Footer t={t} lang={lang} setPage={setCurrentPage} />
      <FloatingWhatsApp tip={t.whatsappTip} />
    </div>
  );
}

#!/usr/bin/env node
// Semilla de precedentes de la Corte Interamericana de Derechos Humanos
// (Corte IDH) con relevancia directa para el derecho penal mexicano:
// libertad personal, garantías judiciales, juicio justo, imparcialidad,
// control de convencionalidad, principio pro persona, recurso efectivo,
// defensa adecuada, integridad personal y derechos de las víctimas.
//
// URLs canónicas: la Corte IDH publica cada sentencia contenciosa con
// número de Serie C en https://www.corteidh.or.cr/docs/casos/articulos/
// seriec_<N>_esp.pdf. Esta semilla usa esa URL cuando el número Serie C
// está verificado en doctrina ampliamente publicada; cuando hay duda,
// se usa el buscador oficial como fallback (url_canonical_pending=true).
//
// Cada entrada lleva:
//   - rubro: nombre del caso + año
//   - tema: derecho/principio interpretado
//   - source_url: enlace a la sentencia o ficha técnica oficial
//   - articulos_relacionados: arts. del CNPP cuya interpretación se ve
//     afectada por el control de convencionalidad ejercido en el caso.

import fs from 'node:fs';
import path from 'node:path';

const OUT = path.resolve('public/data/precedentes.json');
const VERIFIED_AT = '2026-06-05';
const FUENTE = 'Corte Interamericana de Derechos Humanos';
const SEARCH_BASE = 'https://www.corteidh.or.cr/cf/Jurisprudencia2/index.cfm?lang=es';

function seriecUrl(n) {
  return `https://www.corteidh.or.cr/docs/casos/articulos/seriec_${n}_esp.pdf`;
}

// Casos verificados por nombre + año + número de Serie C. La verificación
// final de cada URL (con hidratador externo o navegador) puede sustituir
// el campo source_url si la URL canónica del PDF cambia.
const CASES = [
  // === LIBERTAD PERSONAL Y DESAPARICIÓN FORZADA ===
  { name: 'Velásquez Rodríguez vs. Honduras', year: 1988, seriec: 4,
    tema: 'Desaparición forzada y deber estatal de investigar',
    derechos: ['Libertad personal', 'Vida', 'Integridad personal', 'Recurso judicial efectivo'],
    articulos_cnpp: ['113', '131', '132'] },
  { name: 'Castillo Páez vs. Perú', year: 1997, seriec: 34,
    tema: 'Desaparición forzada y recurso efectivo (hábeas corpus)',
    derechos: ['Libertad personal', 'Recurso judicial efectivo'],
    articulos_cnpp: ['113', '149', '150'] },
  { name: 'Cesti Hurtado vs. Perú', year: 1999, seriec: 56,
    tema: 'Detención arbitraria y eficacia del hábeas corpus',
    derechos: ['Libertad personal', 'Garantías judiciales'],
    articulos_cnpp: ['113', '149'] },
  { name: 'Suárez Rosero vs. Ecuador', year: 1997, seriec: 35,
    tema: 'Plazo razonable de la prisión preventiva y presunción de inocencia',
    derechos: ['Libertad personal', 'Plazo razonable', 'Presunción de inocencia'],
    articulos_cnpp: ['13', '155', '165', '167'] },
  { name: 'Tibi vs. Ecuador', year: 2004, seriec: 114,
    tema: 'Detención arbitraria, tortura e indefensión',
    derechos: ['Libertad personal', 'Integridad personal', 'Garantías judiciales', 'Defensa adecuada'],
    articulos_cnpp: ['113', '17', '155'] },
  { name: 'Acosta Calderón vs. Ecuador', year: 2005, seriec: 129,
    tema: 'Detención ilegal y plazo razonable de la prisión preventiva',
    derechos: ['Libertad personal', 'Plazo razonable'],
    articulos_cnpp: ['155', '165', '313'] },
  { name: 'Servellón García y otros vs. Honduras', year: 2006, seriec: 152,
    tema: 'Detención colectiva, abuso de la fuerza y derecho a la libertad',
    derechos: ['Libertad personal', 'Integridad personal', 'Vida'],
    articulos_cnpp: ['113', '147', '149'] },
  { name: 'Yvon Neptune vs. Haití', year: 2008, seriec: 180,
    tema: 'Detención sin orden judicial y control de legalidad',
    derechos: ['Libertad personal', 'Garantías judiciales'],
    articulos_cnpp: ['113', '146', '149'] },
  { name: 'Bayarri vs. Argentina', year: 2008, seriec: 187,
    tema: 'Detención prolongada y tortura como prueba ilícita',
    derechos: ['Libertad personal', 'Integridad personal', 'Prueba ilícita', 'Plazo razonable'],
    articulos_cnpp: ['113', '155', '264', '357'] },

  // === GARANTÍAS JUDICIALES Y JUICIO JUSTO ===
  { name: 'Castillo Petruzzi y otros vs. Perú', year: 1999, seriec: 52,
    tema: 'Juicio penal militar a civiles e indefensión',
    derechos: ['Juez natural', 'Defensa adecuada', 'Garantías judiciales'],
    articulos_cnpp: ['17', '121', '133'] },
  { name: 'Lori Berenson Mejía vs. Perú', year: 2004, seriec: 119,
    tema: 'Juicio penal militar, defensa adecuada y publicidad',
    derechos: ['Defensa adecuada', 'Juez natural', 'Publicidad'],
    articulos_cnpp: ['5', '17', '113'] },
  { name: 'Apitz Barbera y otros ("Corte Primera") vs. Venezuela', year: 2008, seriec: 182,
    tema: 'Imparcialidad e independencia judicial',
    derechos: ['Independencia judicial', 'Imparcialidad', 'Tutela judicial efectiva'],
    articulos_cnpp: ['10', '11', '12', '134'] },
  { name: 'Ruano Torres y otros vs. El Salvador', year: 2015, seriec: 303,
    tema: 'Defensa pública deficiente y derecho a defensor competente',
    derechos: ['Defensa adecuada', 'Garantías judiciales'],
    articulos_cnpp: ['17', '113', '117', '121'] },
  { name: 'Argüelles y otros vs. Argentina', year: 2014, seriec: 288,
    tema: 'Plazo razonable y prisión preventiva prolongada',
    derechos: ['Plazo razonable', 'Libertad personal'],
    articulos_cnpp: ['155', '165', '167'] },

  // === PRESUNCIÓN DE INOCENCIA / PRUEBA ===
  { name: 'López Mendoza vs. Venezuela', year: 2011, seriec: 233,
    tema: 'Presunción de inocencia y debido proceso administrativo-sancionatorio',
    derechos: ['Presunción de inocencia', 'Garantías judiciales'],
    articulos_cnpp: ['13', '402'] },

  // === CONTROL DE CONVENCIONALIDAD / PRO PERSONA ===
  { name: 'Almonacid Arellano y otros vs. Chile', year: 2006, seriec: 154,
    tema: 'Origen del control de convencionalidad ex officio',
    derechos: ['Control de convencionalidad', 'Acceso a la justicia'],
    articulos_cnpp: ['1', '14', '264'] },
  { name: 'Trabajadores Cesados del Congreso (Aguado Alfaro y otros) vs. Perú', year: 2006, seriec: 158,
    tema: 'Consolidación del control de convencionalidad por toda autoridad pública',
    derechos: ['Control de convencionalidad', 'Recurso efectivo'],
    articulos_cnpp: ['1', '14'] },
  { name: 'Gelman vs. Uruguay', year: 2011, seriec: 221,
    tema: 'Control de convencionalidad frente a leyes de amnistía',
    derechos: ['Control de convencionalidad', 'Acceso a la justicia para víctimas'],
    articulos_cnpp: ['1', '17'] },
  { name: 'Cabrera García y Montiel Flores vs. México', year: 2010, seriec: 220,
    tema: 'Tortura, prueba ilícita y control de convencionalidad por jueces mexicanos',
    derechos: ['Control de convencionalidad', 'Prueba ilícita', 'Integridad personal', 'Defensa adecuada'],
    articulos_cnpp: ['1', '17', '113', '264', '357'] },
  { name: 'Atala Riffo y niñas vs. Chile', year: 2012, seriec: 239,
    tema: 'Principio pro persona y no discriminación',
    derechos: ['Pro persona', 'No discriminación', 'Garantías judiciales'],
    articulos_cnpp: ['1', '10'] },

  // === TORTURA E INTEGRIDAD PERSONAL ===
  { name: 'Bámaca Velásquez vs. Guatemala', year: 2000, seriec: 70,
    tema: 'Tortura e investigación efectiva',
    derechos: ['Integridad personal', 'Vida', 'Recurso efectivo'],
    articulos_cnpp: ['113', '264'] },
  { name: 'Cantoral Benavides vs. Perú', year: 2000, seriec: 69,
    tema: 'Tortura como técnica de obtención de confesión',
    derechos: ['Integridad personal', 'No autoincriminación', 'Defensa adecuada'],
    articulos_cnpp: ['113', '155', '264'] },
  { name: 'Maritza Urrutia vs. Guatemala', year: 2003, seriec: 103,
    tema: 'Tortura psicológica y deber de investigar',
    derechos: ['Integridad personal', 'Recurso efectivo'],
    articulos_cnpp: ['113', '264'] },
  { name: 'Bueno Alves vs. Argentina', year: 2007, seriec: 164,
    tema: 'Estándar interamericano de prohibición absoluta de la tortura',
    derechos: ['Integridad personal', 'Prueba ilícita'],
    articulos_cnpp: ['113', '264'] },
  { name: 'Penal Miguel Castro Castro vs. Perú', year: 2006, seriec: 160,
    tema: 'Tratos crueles a personas privadas de libertad',
    derechos: ['Integridad personal', 'Trato digno de la persona privada de libertad'],
    articulos_cnpp: ['113'] },
];

function buildItem(c) {
  const id = `cidh:${c.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}`;
  const seriecUrlStr = seriecUrl(c.seriec);
  return {
    id,
    registro: `Serie C No. ${c.seriec}`,
    rubro: `Caso ${c.name} (Sentencia Corte IDH ${c.year})`,
    organo: 'Corte Interamericana de Derechos Humanos',
    tipo: 'Sentencia',
    epoca: 'Sistema Interamericano',
    fecha: String(c.year),
    materias: ['Penal', 'Constitucional', 'Derechos Humanos'],
    fuente: FUENTE,
    source_url: seriecUrlStr,
    fallback_url: SEARCH_BASE,
    url_canonical_pending: true, // a verificar tras primer hidratador exitoso
    tema: c.tema,
    derechos_interpretados: c.derechos,
    articulos_relacionados: c.articulos_cnpp,
    materia_penal: 'penal',
    text_pending: true,
    verified_by: 'manual_cidh_seed',
    verified_at: VERIFIED_AT,
  };
}

function main() {
  const data = JSON.parse(fs.readFileSync(OUT, 'utf8'));
  const byId = new Map(data.items.map(i => [i.id, i]));
  let added = 0, kept = 0;
  for (const c of CASES) {
    const item = buildItem(c);
    if (byId.has(item.id)) {
      const existing = byId.get(item.id);
      if (existing.text_pending) {
        Object.assign(existing, item);
        kept++;
      }
    } else {
      data.items.push(item);
      added++;
    }
  }
  data.metadata = data.metadata || {};
  data.metadata.last_cidh_seed = {
    timestamp: new Date().toISOString(),
    added,
    refreshed: kept,
    total_cases: CASES.length,
  };
  fs.writeFileSync(OUT, JSON.stringify(data, null, 2));
  console.log(`[cidh-seed] +${added} casos nuevos · ↻${kept} actualizados · ${CASES.length} casos totales`);
}

main();

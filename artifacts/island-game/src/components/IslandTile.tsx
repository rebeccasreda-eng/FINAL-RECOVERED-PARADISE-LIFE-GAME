import React, { useState, useEffect } from 'react';
import { useGame } from '../game/GameContext';
import { TileData } from '../game/types';
import { OBJECT_CONFIG, EMOJI_MAP, CROP_TYPES } from '../game/gameData';
import { useToast } from '@/hooks/use-toast';

/* ── Diamond colour palette — matches HTML reference ────────────────────── */
const COLORS = {
  GRASS:   { top: '#5aab3e', sideL: '#3f8a2a', sideR: '#4a9e32' },
  SAND:    { top: '#e8d29a', sideL: '#cdb277', sideR: '#d4b97f' },
  WATER:   { top: '#52C8E4', sideL: null,       sideR: null      },
  CLEARED: { top: '#8b5a2b', sideL: '#5a3a18',  sideR: '#6a4420' },
};

/** Lighten a #rrggbb hex colour by `amount` per channel */
function lightenHex(hex: string, amount = 22): string {
  try {
    const n = parseInt(hex.slice(1), 16);
    const r = Math.min(255, ((n >> 16) & 0xff) + amount);
    const g = Math.min(255, ((n >>  8) & 0xff) + amount);
    const b = Math.min(255, ( n        & 0xff) + amount);
    return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
  } catch { return hex; }
}
/** Darken a #rrggbb hex colour by `amount` per channel */
function darkenHex(hex: string, amount = 22): string {
  try {
    const n = parseInt(hex.slice(1), 16);
    const r = Math.max(0, ((n >> 16) & 0xff) - amount);
    const g = Math.max(0, ((n >>  8) & 0xff) - amount);
    const b = Math.max(0, ( n        & 0xff) - amount);
    return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
  } catch { return hex; }
}

/* ── SVG art for natural objects — 3-D chibi style ──────────────────────── */
const PETAL_COLORS  = ['#e8628a', '#f5a020', '#8a5ad4'] as const;
const PETAL_DARKS   = ['#b03460', '#c07010', '#5a2aa4'] as const;

const ObjectSVG: React.FC<{ object: string; tileX: number; tileY: number }> = ({ object, tileX: tx, tileY: ty }) => {
  // Build a unique gradient-ID prefix per tile to avoid SVG id collisions
  const g = (s: string) => `${s}${tx}x${ty}`;

  switch (object) {

    /* ── PALM TREE ─────────────────────────────────────────────────────── */
    case 'TREE_PALM': return (
      <svg viewBox="0 0 60 92" width="58" height="88" style={{ display:'block' }}>
        <defs>
          <linearGradient id={g('plt')} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"   stopColor="#e0aa4a"/>
            <stop offset="40%"  stopColor="#a07030"/>
            <stop offset="100%" stopColor="#5e3a10"/>
          </linearGradient>
          <radialGradient id={g('plc')} cx="36%" cy="30%" r="72%">
            <stop offset="0%"   stopColor="#92f060"/>
            <stop offset="52%"  stopColor="#46b430"/>
            <stop offset="100%" stopColor="#1c6410"/>
          </radialGradient>
        </defs>
        {/* Ground shadow */}
        <ellipse cx="30" cy="90" rx="16" ry="5" fill="rgba(0,0,0,0.30)"/>
        {/* Trunk dark right side */}
        <path d="M32,90 Q35,72 36,52 L39,52 Q42,72 42,90Z" fill="#3c1e06" opacity="0.50"/>
        {/* Trunk main — wider, more sculptural */}
        <path d="M19,90 Q23,72 27,52 L33,52 Q37,72 41,90Z" fill={`url(#${g('plt')})`}/>
        {/* Left highlight stripe */}
        <path d="M21.5,88 Q25,70 28.5,54" stroke="rgba(255,255,255,0.36)" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
        {/* Bark vertical groove */}
        <path d="M34,88 Q35,70 34.5,54" stroke="rgba(0,0,0,0.22)" strokeWidth="1.4" fill="none" strokeLinecap="round"/>
        {/* Bark rings — wider, more defined */}
        {[56,64,72,80].map(y => (
          <path key={y} d={`M21,${y} Q30,${y-2} 39,${y}`} stroke="rgba(0,0,0,0.32)" strokeWidth="2" fill="none" strokeLinecap="round"/>
        ))}
        {/* Bark knot texture */}
        <ellipse cx="27" cy="68" rx="2.5" ry="1.5" fill="rgba(0,0,0,0.18)" transform="rotate(-8 27 68)"/>
        <ellipse cx="33" cy="77" rx="2"   ry="1.2" fill="rgba(0,0,0,0.16)" transform="rotate(5 33 77)"/>
        {/* Back drooping fronds */}
        <path d="M30,48 Q10,56 2,62"  stroke="#1a6010" strokeWidth="11" fill="none" strokeLinecap="round" opacity="0.80"/>
        <path d="M30,48 Q50,56 58,62" stroke="#1a6010" strokeWidth="11" fill="none" strokeLinecap="round" opacity="0.80"/>
        {/* Mid fronds */}
        <path d="M30,46 Q8,40 2,28"   stroke="#286e18" strokeWidth="10.5" fill="none" strokeLinecap="round"/>
        <path d="M30,46 Q52,40 58,28" stroke="#286e18" strokeWidth="10.5" fill="none" strokeLinecap="round"/>
        {/* Upper fronds */}
        <path d="M30,44 Q16,28 10,12"  stroke="#349020" strokeWidth="10" fill="none" strokeLinecap="round"/>
        <path d="M30,44 Q44,28 50,12"  stroke="#349020" strokeWidth="10" fill="none" strokeLinecap="round"/>
        {/* Top frond */}
        <path d="M30,42 Q30,22 29,4"   stroke="#42aa28" strokeWidth="9.5" fill="none" strokeLinecap="round"/>
        {/* Leaflet pairs on left frond */}
        <path d="M20,52 L16,46" stroke="#2e8820" strokeWidth="2.2" fill="none" strokeLinecap="round"/>
        <path d="M20,52 L17,58" stroke="#226014" strokeWidth="2.2" fill="none" strokeLinecap="round"/>
        <path d="M11,57 L7,51"  stroke="#2e8820" strokeWidth="2" fill="none" strokeLinecap="round"/>
        <path d="M11,57 L8,63"  stroke="#226014" strokeWidth="2" fill="none" strokeLinecap="round"/>
        {/* Leaflet pairs on right frond */}
        <path d="M40,52 L44,46" stroke="#2e8820" strokeWidth="2.2" fill="none" strokeLinecap="round"/>
        <path d="M40,52 L43,58" stroke="#226014" strokeWidth="2.2" fill="none" strokeLinecap="round"/>
        <path d="M49,57 L53,51" stroke="#2e8820" strokeWidth="2" fill="none" strokeLinecap="round"/>
        <path d="M49,57 L52,63" stroke="#226014" strokeWidth="2" fill="none" strokeLinecap="round"/>
        {/* Leaflet pairs on upper fronds */}
        <path d="M21,39 L17,34" stroke="#3a9e24" strokeWidth="2" fill="none" strokeLinecap="round"/>
        <path d="M39,39 L43,34" stroke="#3a9e24" strokeWidth="2" fill="none" strokeLinecap="round"/>
        {/* Frond tip highlights */}
        <path d="M30,48 Q10,56 2,62"  stroke="#68d84a" strokeWidth="3.5" fill="none" strokeLinecap="round" opacity="0.55"/>
        <path d="M30,48 Q50,56 58,62" stroke="#68d84a" strokeWidth="3.5" fill="none" strokeLinecap="round" opacity="0.55"/>
        <path d="M30,44 Q16,28 10,12"  stroke="#68d84a" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.55"/>
        <path d="M30,44 Q44,28 50,12"  stroke="#68d84a" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.55"/>
        {/* Crown base */}
        <circle cx="30" cy="46" r="13" fill="#196010"/>
        <circle cx="30" cy="44" r="10" fill={`url(#${g('plc')})`}/>
        {/* Specular */}
        <ellipse cx="25" cy="38" rx="6" ry="3.8" fill="rgba(255,255,255,0.36)" transform="rotate(-15 25 38)"/>
        {/* Coconuts */}
        <circle cx="23" cy="50" r="4.8" fill="#7a4418"/>
        <circle cx="37" cy="51" r="4.4" fill="#6a3c12"/>
        <circle cx="30" cy="54" r="4"   fill="#723e16"/>
        <circle cx="21.5" cy="48" r="1.7" fill="rgba(255,255,255,0.34)"/>
        <circle cx="35.5" cy="49" r="1.5" fill="rgba(255,255,255,0.30)"/>
      </svg>
    );

    /* ── APPLE TREE ─────────────────────────────────────────────────────── */
    case 'TREE_APPLE': return (
      <svg viewBox="0 0 62 90" width="60" height="86" style={{ display:'block' }}>
        <defs>
          <linearGradient id={g('apt')} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"   stopColor="#d48840"/>
            <stop offset="44%"  stopColor="#8a5228"/>
            <stop offset="100%" stopColor="#4e2c10"/>
          </linearGradient>
          <radialGradient id={g('apc')} cx="35%" cy="28%" r="70%">
            <stop offset="0%"   stopColor="#84ee60"/>
            <stop offset="52%"  stopColor="#3cb030"/>
            <stop offset="100%" stopColor="#186010"/>
          </radialGradient>
          <radialGradient id={g('apr')} cx="36%" cy="30%" r="66%">
            <stop offset="0%"   stopColor="#ff7a68"/>
            <stop offset="52%"  stopColor="#e02c1a"/>
            <stop offset="100%" stopColor="#a01008"/>
          </radialGradient>
        </defs>
        {/* Ground shadow */}
        <ellipse cx="31" cy="88" rx="18" ry="5.5" fill="rgba(0,0,0,0.28)"/>
        {/* Trunk right shadow */}
        <path d="M33,86 Q35,70 36,52 L38,52 Q40,70 40,86Z" fill="#2e1404" opacity="0.50"/>
        {/* Trunk — wider, with roots flare */}
        <path d="M22,86 Q26,68 28,52 L34,52 Q36,68 40,86Z" fill={`url(#${g('apt')})`}/>
        {/* Trunk highlight */}
        <path d="M24,84 Q27.5,66 29.5,54" stroke="rgba(255,255,255,0.30)" strokeWidth="2.2" fill="none" strokeLinecap="round"/>
        {/* Bark groove */}
        <path d="M35,84 Q36,66 35.5,54" stroke="rgba(0,0,0,0.20)" strokeWidth="1.3" fill="none" strokeLinecap="round"/>
        {/* Bark rings */}
        {[60,70,78].map(y => (
          <path key={y} d={`M23,${y} Q31,${y-1.5} 39,${y}`} stroke="rgba(0,0,0,0.28)" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
        ))}
        {/* Root flare bumps */}
        <ellipse cx="24" cy="85" rx="4" ry="2.5" fill="#3e1e0a" opacity="0.50" transform="rotate(-12 24 85)"/>
        <ellipse cx="38" cy="85" rx="4" ry="2.5" fill="#3e1e0a" opacity="0.45" transform="rotate(12 38 85)"/>
        {/* Deep canopy shadow */}
        <ellipse cx="31" cy="38" rx="29" ry="23" fill="#144808" opacity="0.65"/>
        {/* Main canopy */}
        <ellipse cx="31" cy="32" rx="28" ry="23" fill={`url(#${g('apc')})`}/>
        {/* Side leaf clusters */}
        <ellipse cx="10" cy="38" rx="17" ry="13" fill="#247a16"/>
        <ellipse cx="52" cy="38" rx="17" ry="13" fill="#2a8e1c"/>
        {/* Mid leaf texture bumps */}
        <ellipse cx="20" cy="28" rx="12" ry="9" fill="#3a9820"/>
        <ellipse cx="42" cy="28" rx="12" ry="9" fill="#3ea824"/>
        <ellipse cx="31" cy="22" rx="14" ry="10" fill="#42a828"/>
        {/* Upper dome */}
        <ellipse cx="31" cy="16" rx="18" ry="14" fill="#50b830"/>
        {/* Leaf edge texture — dark micro-bumps */}
        <ellipse cx="8"  cy="30" rx="6" ry="5" fill="#1e6010" opacity="0.70"/>
        <ellipse cx="54" cy="30" rx="6" ry="5" fill="#1e6010" opacity="0.70"/>
        <ellipse cx="10" cy="48" rx="7" ry="5" fill="#1e6010" opacity="0.60"/>
        <ellipse cx="52" cy="48" rx="7" ry="5" fill="#1e6010" opacity="0.60"/>
        {/* Canopy specular */}
        <ellipse cx="19" cy="17" rx="12" ry="7" fill="rgba(255,255,255,0.30)" transform="rotate(-13 19 17)"/>
        {/* Apples */}
        <circle cx="14" cy="39" r="6.2" fill={`url(#${g('apr')})`}/>
        <circle cx="42" cy="37" r="6.2" fill={`url(#${g('apr')})`}/>
        <circle cx="28" cy="45" r="5.6" fill={`url(#${g('apr')})`}/>
        <circle cx="44" cy="48" r="5" fill={`url(#${g('apr')})`}/>
        {/* Apple shine */}
        <circle cx="12"  cy="36.5" r="2.4" fill="rgba(255,255,255,0.58)"/>
        <circle cx="40"  cy="34.5" r="2.4" fill="rgba(255,255,255,0.58)"/>
        <circle cx="26"  cy="42.5" r="2.2" fill="rgba(255,255,255,0.58)"/>
        <circle cx="42.5" cy="45.5" r="2" fill="rgba(255,255,255,0.55)"/>
        {/* Stems */}
        <line x1="14" y1="32.5" x2="15" y2="29"   stroke="#286010" strokeWidth="1.4"/>
        <line x1="42" y1="30.5" x2="43" y2="27"   stroke="#286010" strokeWidth="1.4"/>
        <line x1="28" y1="38.8" x2="29" y2="35.5" stroke="#286010" strokeWidth="1.4"/>
        <line x1="44" y1="42"   x2="45" y2="39"   stroke="#286010" strokeWidth="1.3"/>
      </svg>
    );

    /* ── ROCK ───────────────────────────────────────────────────────────── */
    case 'ROCK': return (
      <svg viewBox="0 0 54 44" width="52" height="42" style={{ display:'block' }}>
        <defs>
          <radialGradient id={g('rkg')} cx="34%" cy="28%" r="70%">
            <stop offset="0%"   stopColor="#d6d6ce"/>
            <stop offset="55%"  stopColor="#9e9e96"/>
            <stop offset="100%" stopColor="#606058"/>
          </radialGradient>
          <radialGradient id={g('rks')} cx="36%" cy="30%" r="68%">
            <stop offset="0%"   stopColor="#c8c8be"/>
            <stop offset="60%"  stopColor="#888880"/>
            <stop offset="100%" stopColor="#525248"/>
          </radialGradient>
        </defs>
        {/* Ground shadow */}
        <ellipse cx="24" cy="42" rx="21" ry="5" fill="rgba(0,0,0,0.25)"/>
        {/* Small back rock */}
        <ellipse cx="42" cy="27" rx="11" ry="9"   fill={`url(#${g('rks')})`}/>
        <ellipse cx="38" cy="23" rx="4"  ry="2.5" fill="rgba(255,255,255,0.28)" transform="rotate(-15 38 23)"/>
        {/* Main boulder */}
        <ellipse cx="22" cy="23" rx="21" ry="17"  fill={`url(#${g('rkg')})`}/>
        {/* Rim */}
        <ellipse cx="22" cy="23" rx="21" ry="17"  fill="none" stroke="rgba(0,0,0,0.14)" strokeWidth="1.5"/>
        {/* Specular highlight */}
        <ellipse cx="13" cy="14" rx="9" ry="5.5"  fill="rgba(255,255,255,0.44)" transform="rotate(-22 13 14)"/>
        {/* Secondary highlight */}
        <ellipse cx="9"  cy="19" rx="3" ry="2"    fill="rgba(255,255,255,0.22)" transform="rotate(-14 9 19)"/>
        {/* Subtle crack */}
        <path d="M18,17 Q20,23 19,29" stroke="rgba(0,0,0,0.12)" strokeWidth="1.3" fill="none"/>
      </svg>
    );

    /* ── FLOWER BUSH ───────────────────────────────────────────────────── */
    case 'FLOWER_BUSH': {
      const pi   = (tx * 7 + ty * 13) % 3;
      const petal = PETAL_COLORS[pi];
      const dark  = PETAL_DARKS[pi];
      const pid   = g('flp');
      return (
        <svg viewBox="0 0 38 38" width="36" height="36" style={{ display:'block' }}>
          <defs>
            <radialGradient id={pid} cx="36%" cy="30%" r="68%">
              <stop offset="0%"   stopColor={petal}/>
              <stop offset="100%" stopColor={dark}/>
            </radialGradient>
          </defs>
          {/* Shadow */}
          <ellipse cx="19" cy="36" rx="13" ry="4" fill="rgba(0,0,0,0.22)"/>
          {/* Leaf base */}
          <ellipse cx="19" cy="30" rx="13" ry="5.5" fill="#246a18"/>
          <ellipse cx="11" cy="27" rx="8"  ry="4.5" fill="#2e8020" transform="rotate(-18 11 27)"/>
          <ellipse cx="27" cy="27" rx="8"  ry="4.5" fill="#2e8020" transform="rotate(18 27 27)"/>
          {/* Leaf highlight */}
          <ellipse cx="12" cy="25.5" rx="3.5" ry="1.5" fill="rgba(255,255,255,0.22)" transform="rotate(-18 12 25.5)"/>
          {/* Back flowers */}
          <circle cx="10" cy="19" r="5.2" fill={`url(#${pid})`} opacity="0.9"/>
          <circle cx="28" cy="18" r="5.2" fill={`url(#${pid})`} opacity="0.9"/>
          {/* Front flowers */}
          <circle cx="19" cy="13" r="5.8" fill={`url(#${pid})`}/>
          <circle cx="10" cy="11" r="4.8" fill={`url(#${pid})`}/>
          <circle cx="28" cy="11" r="4.8" fill={`url(#${pid})`}/>
          {/* Centers */}
          <circle cx="10" cy="19" r="2.3" fill="#f8e030"/>
          <circle cx="28" cy="18" r="2.3" fill="#f8e030"/>
          <circle cx="19" cy="13" r="2.6" fill="#f8e838"/>
          <circle cx="10" cy="11" r="2.1" fill="#f8e030"/>
          <circle cx="28" cy="11" r="2.1" fill="#f8e030"/>
          {/* Center shine */}
          <circle cx="9.3"  cy="18.3" r="1"   fill="rgba(255,255,255,0.65)"/>
          <circle cx="27.3" cy="17.3" r="1"   fill="rgba(255,255,255,0.65)"/>
          <circle cx="18.3" cy="12.3" r="1.1" fill="rgba(255,255,255,0.65)"/>
          {/* Petal highlights */}
          <circle cx="8.5"  cy="17"   r="2"   fill="rgba(255,255,255,0.30)"/>
          <circle cx="17.5" cy="11"   r="2.2" fill="rgba(255,255,255,0.30)"/>
        </svg>
      );
    }

    /* ── DRIFTWOOD ──────────────────────────────────────────────────────── */
    case 'DRIFTWOOD': return (
      <svg viewBox="0 0 54 30" width="52" height="28" style={{ display:'block' }}>
        <defs>
          <linearGradient id={g('dwg')} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%"   stopColor="#caa462"/>
            <stop offset="45%"  stopColor="#a87840"/>
            <stop offset="100%" stopColor="#785028"/>
          </linearGradient>
          <radialGradient id={g('dwc')} cx="40%" cy="35%" r="65%">
            <stop offset="0%"   stopColor="#b09262"/>
            <stop offset="100%" stopColor="#6a4020"/>
          </radialGradient>
        </defs>
        {/* Ground shadow */}
        <ellipse cx="27" cy="29" rx="23" ry="4" fill="rgba(0,0,0,0.23)"/>
        {/* Left end-cap */}
        <ellipse cx="6.5" cy="15" rx="5.5" ry="10" fill="#8a6030"/>
        {/* Log body */}
        <rect x="5.5" y="5" width="43" height="20" rx="10" fill={`url(#${g('dwg')})`}/>
        {/* Top highlight */}
        <rect x="8" y="6.5" width="38" height="6.5" rx="5" fill="rgba(255,255,255,0.22)"/>
        {/* Wood grain */}
        <path d="M12,10 Q20,12 28,10 Q34,8 42,10" stroke="rgba(0,0,0,0.13)" strokeWidth="1" fill="none"/>
        <path d="M12,15 Q20,17 28,15 Q35,13 42,15" stroke="rgba(0,0,0,0.11)" strokeWidth="1" fill="none"/>
        <path d="M12,20 Q22,22 30,20 Q37,18 42,20" stroke="rgba(0,0,0,0.09)" strokeWidth="0.9" fill="none"/>
        {/* Right end-cap */}
        <ellipse cx="48.5" cy="15" rx="5.5" ry="10" fill={`url(#${g('dwc')})`}/>
        {/* End-cap growth rings */}
        <ellipse cx="48.5" cy="15" rx="4.5" ry="8"   fill="none" stroke="rgba(0,0,0,0.18)" strokeWidth="0.9"/>
        <ellipse cx="48.5" cy="15" rx="3"   ry="5.5" fill="none" stroke="rgba(0,0,0,0.14)" strokeWidth="0.8"/>
        <ellipse cx="48.5" cy="15" rx="1.4" ry="2.6" fill="rgba(0,0,0,0.12)"/>
        {/* Moss patches */}
        <ellipse cx="20" cy="8" rx="5.5" ry="2" fill="#3a8a28" opacity="0.52"/>
        <ellipse cx="35" cy="8" rx="4.5" ry="1.8" fill="#3a8a28" opacity="0.44"/>
      </svg>
    );

    /* ── COCONUT TREE ───────────────────────────────────────────────────── */
    case 'TREE_COCONUT': return (
      <svg viewBox="0 0 70 108" width="64" height="99" style={{ display:'block' }}>
        <defs>
          <linearGradient id={g('cot')} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"   stopColor="#e0aa48"/>
            <stop offset="44%"  stopColor="#9e6e2c"/>
            <stop offset="100%" stopColor="#5a3810"/>
          </linearGradient>
          <radialGradient id={g('coc')} cx="36%" cy="28%" r="70%">
            <stop offset="0%"   stopColor="#7ee050"/>
            <stop offset="54%"  stopColor="#2e9018"/>
            <stop offset="100%" stopColor="#126010"/>
          </radialGradient>
        </defs>
        {/* Ground shadow */}
        <ellipse cx="35" cy="106" rx="18" ry="6" fill="rgba(0,0,0,0.30)"/>
        {/* Trunk dark right side */}
        <path d="M36,104 Q40,82 41,60 L45,60 Q48,82 48,104Z" fill="#2e1004" opacity="0.52"/>
        {/* Trunk main — wide, with natural lean */}
        <path d="M23,104 Q27,82 31,60 L38,60 Q42,82 46,104Z" fill={`url(#${g('cot')})`}/>
        {/* Left highlight */}
        <path d="M25.5,102 Q29,80 33,62" stroke="rgba(255,255,255,0.34)" strokeWidth="3" fill="none" strokeLinecap="round"/>
        {/* Bark groove */}
        <path d="M40,102 Q41,82 40,62" stroke="rgba(0,0,0,0.22)" strokeWidth="1.6" fill="none" strokeLinecap="round"/>
        {/* Bark rings — full curved paths for realism */}
        {[68,76,84,92,100].map(y => (
          <path key={y} d={`M25,${y} Q35,${y-2.5} 45,${y}`} stroke="rgba(0,0,0,0.32)" strokeWidth="2.2" fill="none" strokeLinecap="round"/>
        ))}
        {/* Bark knots */}
        <ellipse cx="30" cy="80" rx="3" ry="1.8" fill="rgba(0,0,0,0.18)" transform="rotate(-6 30 80)"/>
        <ellipse cx="39" cy="90" rx="2.5" ry="1.5" fill="rgba(0,0,0,0.16)" transform="rotate(8 39 90)"/>
        {/* Back drooping fronds */}
        <path d="M34,56 Q14,62 4,68"  stroke="#1a6010" strokeWidth="13" fill="none" strokeLinecap="round" opacity="0.80"/>
        <path d="M34,56 Q54,62 66,68" stroke="#1a6010" strokeWidth="13" fill="none" strokeLinecap="round" opacity="0.80"/>
        {/* Mid fronds */}
        <path d="M34,54 Q12,48 4,36"   stroke="#228418" strokeWidth="12" fill="none" strokeLinecap="round"/>
        <path d="M34,54 Q56,48 66,36"  stroke="#228418" strokeWidth="12" fill="none" strokeLinecap="round"/>
        {/* Upper fronds */}
        <path d="M34,52 Q16,38 10,20"  stroke="#2c9e20" strokeWidth="11.5" fill="none" strokeLinecap="round"/>
        <path d="M34,52 Q52,38 60,20"  stroke="#2c9e20" strokeWidth="11.5" fill="none" strokeLinecap="round"/>
        {/* Top fronds */}
        <path d="M34,50 Q24,30 20,10"  stroke="#38b02a" strokeWidth="10.5" fill="none" strokeLinecap="round"/>
        <path d="M34,50 Q44,30 50,10"  stroke="#38b02a" strokeWidth="10.5" fill="none" strokeLinecap="round"/>
        <path d="M34,48 Q34,28 33,8"   stroke="#46c234" strokeWidth="10"   fill="none" strokeLinecap="round"/>
        {/* Leaflet pairs left drooping frond */}
        <path d="M22,60 L17,54" stroke="#2a8c1e" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
        <path d="M22,60 L18,66" stroke="#1e6412" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
        <path d="M12,65 L7,59"  stroke="#2a8c1e" strokeWidth="2.2" fill="none" strokeLinecap="round"/>
        <path d="M12,65 L8,71"  stroke="#1e6412" strokeWidth="2.2" fill="none" strokeLinecap="round"/>
        {/* Leaflet pairs right drooping frond */}
        <path d="M46,60 L51,54" stroke="#2a8c1e" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
        <path d="M46,60 L50,66" stroke="#1e6412" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
        <path d="M56,65 L61,59" stroke="#2a8c1e" strokeWidth="2.2" fill="none" strokeLinecap="round"/>
        <path d="M56,65 L60,71" stroke="#1e6412" strokeWidth="2.2" fill="none" strokeLinecap="round"/>
        {/* Leaflet pairs upper fronds */}
        <path d="M22,43 L17,37" stroke="#349e22" strokeWidth="2.2" fill="none" strokeLinecap="round"/>
        <path d="M46,43 L51,37" stroke="#349e22" strokeWidth="2.2" fill="none" strokeLinecap="round"/>
        {/* Frond tip highlights */}
        <path d="M34,56 Q14,62 4,68"  stroke="#68e040" strokeWidth="4" fill="none" strokeLinecap="round" opacity="0.52"/>
        <path d="M34,56 Q54,62 66,68" stroke="#68e040" strokeWidth="4" fill="none" strokeLinecap="round" opacity="0.52"/>
        <path d="M34,52 Q16,38 10,20"  stroke="#68e040" strokeWidth="3.5" fill="none" strokeLinecap="round" opacity="0.52"/>
        <path d="M34,52 Q52,38 60,20"  stroke="#68e040" strokeWidth="3.5" fill="none" strokeLinecap="round" opacity="0.52"/>
        {/* Crown */}
        <circle cx="34" cy="54" r="15" fill="#186010"/>
        <circle cx="34" cy="52" r="11" fill={`url(#${g('coc')})`}/>
        {/* Specular */}
        <ellipse cx="27" cy="44" rx="7.5" ry="4.5" fill="rgba(255,255,255,0.36)" transform="rotate(-18 27 44)"/>
        {/* Coconuts */}
        <circle cx="26" cy="58" r="6"   fill="#7a4418"/>
        <circle cx="40" cy="59" r="5.5" fill="#6a3c12"/>
        <circle cx="34" cy="63" r="5"   fill="#723e14"/>
        <circle cx="24.5" cy="56" r="2" fill="rgba(255,255,255,0.32)"/>
        <circle cx="38.5" cy="57" r="1.8" fill="rgba(255,255,255,0.28)"/>
      </svg>
    );

    /* ── MANGO TREE ─────────────────────────────────────────────────────── */
    case 'TREE_MANGO': return (
      <svg viewBox="0 0 74 92" width="68" height="85" style={{ display:'block' }}>
        <defs>
          <linearGradient id={g('mgt')} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"   stopColor="#d47e38"/>
            <stop offset="44%"  stopColor="#8a4e20"/>
            <stop offset="100%" stopColor="#4c280c"/>
          </linearGradient>
          <radialGradient id={g('mgc')} cx="34%" cy="27%" r="72%">
            <stop offset="0%"   stopColor="#7edc48"/>
            <stop offset="52%"  stopColor="#2e8e14"/>
            <stop offset="100%" stopColor="#105808"/>
          </radialGradient>
          <radialGradient id={g('mgm')} cx="38%" cy="28%" r="68%">
            <stop offset="0%"   stopColor="#ffe050"/>
            <stop offset="55%"  stopColor="#e09810"/>
            <stop offset="100%" stopColor="#a06008"/>
          </radialGradient>
        </defs>
        {/* Ground shadow */}
        <ellipse cx="37" cy="90" rx="22" ry="6.5" fill="rgba(0,0,0,0.30)"/>
        {/* Trunk dark right */}
        <path d="M37,88 Q40,70 41,56 L44,56 Q47,70 47,88Z" fill="#2a1004" opacity="0.52"/>
        {/* Trunk — wide, tapered */}
        <path d="M27,88 Q31,70 34,56 L40,56 Q43,70 47,88Z" fill={`url(#${g('mgt')})`}/>
        {/* Highlight */}
        <path d="M29.5,86 Q33,68 35.5,58" stroke="rgba(255,255,255,0.30)" strokeWidth="2.4" fill="none" strokeLinecap="round"/>
        {/* Bark groove */}
        <path d="M42,86 Q43,68 41.5,58" stroke="rgba(0,0,0,0.22)" strokeWidth="1.4" fill="none" strokeLinecap="round"/>
        {/* Bark rings */}
        {[64,72,80].map(y => (
          <path key={y} d={`M28,${y} Q37,${y-2} 46,${y}`} stroke="rgba(0,0,0,0.30)" strokeWidth="2" fill="none" strokeLinecap="round"/>
        ))}
        {/* Bark knots */}
        <ellipse cx="33" cy="67" rx="2.8" ry="1.6" fill="rgba(0,0,0,0.18)" transform="rotate(-7 33 67)"/>
        <ellipse cx="41" cy="78" rx="2.5" ry="1.4" fill="rgba(0,0,0,0.16)" transform="rotate(6 41 78)"/>
        {/* Root flare */}
        <ellipse cx="29" cy="87" rx="4.5" ry="2.5" fill="#3c1a08" opacity="0.48" transform="rotate(-15 29 87)"/>
        <ellipse cx="45" cy="87" rx="4.5" ry="2.5" fill="#3c1a08" opacity="0.44" transform="rotate(15 45 87)"/>
        {/* Canopy depth — back layers */}
        <ellipse cx="37" cy="44" rx="35" ry="28" fill="#0c4606" opacity="0.68"/>
        <ellipse cx="13" cy="50" rx="18" ry="15" fill="#145c0c"/>
        <ellipse cx="61" cy="50" rx="18" ry="15" fill="#186612"/>
        {/* Mid canopy */}
        <ellipse cx="37" cy="36" rx="31" ry="25" fill="#1e5e12"/>
        <ellipse cx="14" cy="42" rx="18" ry="15" fill="#246c16"/>
        <ellipse cx="60" cy="42" rx="18" ry="15" fill="#28761a"/>
        {/* Leaf texture bumps on sides */}
        <ellipse cx="8"  cy="36" rx="9" ry="7" fill="#0e4a08" opacity="0.70"/>
        <ellipse cx="66" cy="36" rx="9" ry="7" fill="#0e4a08" opacity="0.70"/>
        <ellipse cx="11" cy="50" rx="8" ry="6" fill="#124e0c" opacity="0.65"/>
        <ellipse cx="63" cy="50" rx="8" ry="6" fill="#124e0c" opacity="0.65"/>
        {/* Upper canopy with radial gradient */}
        <ellipse cx="37" cy="28" rx="27" ry="22" fill={`url(#${g('mgc')})`}/>
        <ellipse cx="19" cy="34" rx="16" ry="13" fill="#348a22"/>
        <ellipse cx="55" cy="34" rx="16" ry="13" fill="#38942a"/>
        {/* Upper leaf clusters */}
        <ellipse cx="26" cy="22" rx="12" ry="9" fill="#3e9c28"/>
        <ellipse cx="48" cy="22" rx="12" ry="9" fill="#42a02c"/>
        {/* Top dome */}
        <ellipse cx="37" cy="14" rx="20" ry="16" fill="#4eae30"/>
        {/* Canopy specular */}
        <ellipse cx="23" cy="14" rx="13" ry="7.5" fill="rgba(255,255,255,0.28)" transform="rotate(-14 23 14)"/>
        {/* Mangoes */}
        <ellipse cx="14" cy="50" rx="7.5" ry="10" fill={`url(#${g('mgm')})`} transform="rotate(-20 14 50)"/>
        <ellipse cx="36" cy="55" rx="7.5" ry="10" fill={`url(#${g('mgm')})`} transform="rotate(10 36 55)"/>
        <ellipse cx="57" cy="50" rx="7.5" ry="10" fill={`url(#${g('mgm')})`} transform="rotate(20 57 50)"/>
        <ellipse cx="23" cy="44" rx="6.5" ry="8.5" fill={`url(#${g('mgm')})`} transform="rotate(-12 23 44)"/>
        <ellipse cx="51" cy="44" rx="6.5" ry="8.5" fill={`url(#${g('mgm')})`} transform="rotate(14 51 44)"/>
        {/* Mango shine */}
        <ellipse cx="11.5" cy="47" rx="3" ry="4" fill="rgba(255,255,255,0.50)" transform="rotate(-20 11.5 47)"/>
        <ellipse cx="33.5" cy="52" rx="3" ry="4" fill="rgba(255,255,255,0.48)" transform="rotate(10 33.5 52)"/>
        <ellipse cx="54.5" cy="47" rx="3" ry="4" fill="rgba(255,255,255,0.46)" transform="rotate(20 54.5 47)"/>
      </svg>
    );

    /* ── GARDEN PATCH ───────────────────────────────────────────────────── */
    case 'GARDEN_PATCH': return (
      <svg viewBox="0 0 72 62" width="66" height="57" style={{ display:'block' }}>
        <defs>
          <linearGradient id={g('gpf')} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%"   stopColor="#5aa028"/>
            <stop offset="100%" stopColor="#327010"/>
          </linearGradient>
          <linearGradient id={g('gpw')} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%"   stopColor="#dcc070"/>
            <stop offset="100%" stopColor="#a07830"/>
          </linearGradient>
          <radialGradient id={g('gpb')} cx="36%" cy="30%" r="70%">
            <stop offset="0%"   stopColor="#6880e8"/>
            <stop offset="100%" stopColor="#2a40b8"/>
          </radialGradient>
          <radialGradient id={g('gpp')} cx="38%" cy="30%" r="68%">
            <stop offset="0%"   stopColor="#f0cc28"/>
            <stop offset="100%" stopColor="#b08010"/>
          </radialGradient>
        </defs>
        {/* Ground bed */}
        <rect x="2" y="26" width="68" height="32" rx="5" fill={`url(#${g('gpf')})`}/>
        <rect x="2" y="26" width="68" height="7"  rx="3" fill="rgba(255,255,255,0.14)"/>

        {/* ── Picket fence enclosing BLUEBERRY + PINEAPPLE cells (x=2..47) ── */}
        {/* Corner posts */}
        <rect x="2"  y="16" width="6" height="44" rx="2" fill={`url(#${g('gpw')})`}/>
        <rect x="43" y="16" width="6" height="44" rx="2" fill={`url(#${g('gpw')})`}/>
        {/* Mid post between berry and pineapple cells */}
        <rect x="22" y="16" width="5" height="44" rx="1.5" fill={`url(#${g('gpw')})`}/>
        {/* Top rails */}
        <rect x="2" y="20" width="47" height="4.5" rx="1.5" fill="#d4aa60"/>
        <rect x="2" y="20" width="47" height="1.5" rx="1"   fill="rgba(255,255,255,0.38)"/>
        <rect x="2" y="28" width="47" height="3.5" rx="1.5" fill="#b89050"/>
        {/* Bottom rails */}
        <rect x="2" y="43" width="47" height="4"   rx="1.5" fill="#d4aa60"/>
        <rect x="2" y="43" width="47" height="1.5" rx="1"   fill="rgba(255,255,255,0.25)"/>
        <rect x="2" y="50" width="47" height="3.5" rx="1.5" fill="#b89050"/>
        {/* Picket boards — left of left post */}
        {/* Left cell pickets (between x=8 and x=22) */}
        {[9,13,17].map(x => (
          <g key={x}>
            <polygon points={`${x},14 ${x+3},14 ${x+3},13 ${x+1.5},11 ${x},13`} fill="#ddb862"/>
            <rect x={x} y="14" width="3" height="34" rx="1" fill="#c89a48"/>
            <rect x={x} y="14" width="1.2" height="34" rx="0.6" fill="rgba(255,255,255,0.22)"/>
          </g>
        ))}
        {/* Right cell pickets (between x=27 and x=43) */}
        {[28,32,36,40].map(x => (
          <g key={x}>
            <polygon points={`${x},14 ${x+3},14 ${x+3},13 ${x+1.5},11 ${x},13`} fill="#ddb862"/>
            <rect x={x} y="14" width="3" height="34" rx="1" fill="#c89a48"/>
            <rect x={x} y="14" width="1.2" height="34" rx="0.6" fill="rgba(255,255,255,0.22)"/>
          </g>
        ))}

        {/* ── Flower section — simple low border only ── */}
        <rect x="49" y="20" width="5"  height="38" rx="1.5" fill={`url(#${g('gpw')})`}/>
        <rect x="63" y="20" width="5"  height="38" rx="1.5" fill={`url(#${g('gpw')})`}/>
        <rect x="49" y="23" width="19" height="3.5" rx="1.5" fill="#c8a464"/>
        <rect x="49" y="23" width="19" height="1.2" rx="1"   fill="rgba(255,255,255,0.25)"/>
        <rect x="49" y="43" width="19" height="3.5" rx="1.5" fill="#b89050"/>
        {/* Blueberries */}
        {([{cx:10,cy:31,r:5},{cx:17,cy:33,r:4.5},{cx:9,cy:38,r:4.5},{cx:16,cy:28,r:4},{cx:10,cy:44,r:4.5},{cx:17,cy:42,r:4}] as const).map((b,i) => (
          <g key={i}>
            <circle cx={b.cx} cy={b.cy} r={b.r} fill={`url(#${g('gpb')})`}/>
            <circle cx={b.cx-1} cy={b.cy-1} r={b.r*0.36} fill="rgba(255,255,255,0.52)"/>
          </g>
        ))}
        {/* Pineapples */}
        {([{cx:30,cy:42},{cx:44,cy:41}] as const).map((p,i) => (
          <g key={i}>
            <ellipse cx={p.cx} cy={p.cy}   rx="6"   ry="9"   fill={`url(#${g('gpp')})`}/>
            <ellipse cx={p.cx} cy={p.cy}   rx="4.5" ry="7"   fill="rgba(255,255,255,0.18)"/>
            {([35,38,41,44,47] as const).map(y2 => (
              <line key={y2} x1={p.cx-5.5} y1={y2} x2={p.cx+5.5} y2={y2} stroke="#9a7210" strokeWidth="1.2" opacity="0.7"/>
            ))}
            <path d={`M${p.cx},${p.cy-9} L${p.cx-5},${p.cy-18} M${p.cx},${p.cy-9} L${p.cx},${p.cy-19} M${p.cx},${p.cy-9} L${p.cx+5},${p.cy-18}`}
                  stroke="#2e8020" strokeWidth="2.8" fill="none" strokeLinecap="round"/>
            <ellipse cx={p.cx-1} cy={p.cy-5} rx="2.5" ry="3.5" fill="rgba(255,255,255,0.42)"/>
          </g>
        ))}
        {/* White flowers */}
        {([{cx:56,cy:29,r:4.5},{cx:63,cy:32,r:4},{cx:55,cy:36,r:4},{cx:62,cy:38,r:4.5},{cx:56,cy:43,r:4},{cx:63,cy:44,r:3.5}] as const).map((f,i) => (
          <g key={i}>
            <circle cx={f.cx} cy={f.cy} r={f.r}        fill="#f0f0ff"/>
            <circle cx={f.cx} cy={f.cy} r={f.r * 0.38} fill="#f0c820"/>
            <circle cx={f.cx-1} cy={f.cy-1} r={f.r * 0.20} fill="rgba(255,255,255,0.72)"/>
          </g>
        ))}
        <ellipse cx="59" cy="49" rx="9" ry="3.5" fill="#2a6a18" opacity="0.65"/>
      </svg>
    );

    default: return null;
  }
};

/** Objects that use SVG art instead of emoji */
const SVG_OBJECTS = new Set(['TREE_PALM', 'TREE_APPLE', 'ROCK', 'FLOWER_BUSH', 'DRIFTWOOD',
  'TREE_COCONUT', 'TREE_MANGO', 'GARDEN_PATCH']);
/** Objects that sway in the breeze */
const SWAY_OBJECTS = new Set(['TREE_PALM', 'TREE_APPLE', 'TREE_COCONUT', 'TREE_MANGO']);

/* ── Props ──────────────────────────────────────────────────────────────── */
interface IslandTileProps {
  tile: TileData;
  /** Pixel X of tile top-point in world space */
  screenX: number;
  /** Pixel Y of tile top-point in world space */
  screenY: number;
  /** CSS z-index (= (tile.x + tile.y) * 2) */
  tileZIndex: number;
  isDangerZone?: boolean;
  onTileClick?: (x: number, y: number) => void;
}

/* ── IslandTile ─────────────────────────────────────────────────────────── */
export const IslandTile: React.FC<IslandTileProps> = ({
  tile, screenX, screenY, tileZIndex, isDangerZone, onTileClick,
}) => {
  const {
    state, dispatch, interact, plant, place,
    activeTool, activeBuildItem,
    floatingTexts,
  } = useGame();
  const { toast } = useToast();

  const [now, setNow] = useState(Date.now());
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    if (tile.object === 'CROP_GROWING' || tile.object === 'CROP_READY') {
      const id = setInterval(() => setNow(Date.now()), 1000);
      return () => clearInterval(id);
    }
    return undefined;
  }, [tile.object]);

  /* ── Interaction ── */
  const handleClick = () => {
    onTileClick?.(tile.x, tile.y);
    if (activeTool === 'plant') {
      plant(tile.id);
    } else if (activeTool === 'build' && activeBuildItem) {
      place(tile.id, activeBuildItem);
    } else {
      interact(tile.id);
    }
  };

  /* ── Derived state ── */
  const isWater   = tile.type === 'WATER';
  const isCleared = tile.object === 'CLEARED_LAND' || tile.object === 'CROP_PLOT';

  /* ── Diamond colours ── */
  const palette = isCleared ? COLORS.CLEARED : (COLORS[tile.type] ?? COLORS.GRASS);

  let topFill = palette.top;
  if (!isWater && hovered) {
    if (activeTool === 'plant' && isCleared)      topFill = '#6acd5a';
    else if (activeTool === 'build' && isCleared) topFill = '#6aabdd';
    else                                           topFill = lightenHex(palette.top);
  }

  /* ── Object rendering — SVG art or emoji ── */
  const hasSvg = !isCleared && tile.object && SVG_OBJECTS.has(tile.object);
  // (sway intentionally disabled — keeping SWAY_OBJECTS for future use)

  let emoji = '';
  if (!hasSvg && tile.object && !isCleared) {
    if (tile.object === 'CROP_READY' && tile.cropType && CROP_TYPES[tile.cropType]) {
      emoji = CROP_TYPES[tile.cropType].emoji;
    } else {
      emoji = EMOJI_MAP[tile.object] || '';
    }
  }

  /* ── Crop timer ── */
  let badgeText    = '';
  let progressPct  = 0;
  if ((tile.object === 'CROP_GROWING' || tile.object === 'CROP_READY') && tile.placedAt && tile.cropType) {
    const cc = CROP_TYPES[tile.cropType];
    if (cc) {                                           // guard: unknown cropType → skip timer
      const elapsed  = now - tile.placedAt;
      const growTime = state.weather === 'RAINY' ? cc.growTime * 0.5 : cc.growTime;
      if (tile.object === 'CROP_GROWING') {
        const rem = Math.max(0, growTime - elapsed);
        badgeText   = `${Math.floor(rem / 60000)}m${Math.floor((rem % 60000) / 1000)}s`;
        progressPct = Math.min(100, (elapsed / growTime) * 100);
      } else {
        const rem = Math.max(0, (growTime + cc.wiltTime) - elapsed);
        badgeText   = `✓ ${Math.floor(rem / 60000)}m${Math.floor((rem % 60000) / 1000)}s`;
        progressPct = 100;
      }
    }
  }

  /* ── Tooltip ── */
  const config   = tile.object ? OBJECT_CONFIG[tile.object] : null;
  const tooltip  = config
    ? `${config.action} (⚡${config.energy + (isDangerZone && activeTool === 'clear' ? 1 : 0)})`
    : isCleared
    ? `Ready for ${activeTool === 'build' ? 'building' : 'planting'}`
    : '';

  const myTexts = floatingTexts.filter(t => t.tileId === tile.id);

  /* ── Render ── */
  return (
    <div
      style={{
        position: 'absolute',
        left: screenX,
        top: screenY,
        width: 80,
        height: 38,
        // Centre horizontally on screenX; top of diamond at screenY
        transform: 'translate(-50%, 0)',
        zIndex: tileZIndex,
        cursor: isWater ? 'default' : 'pointer',
      }}
      onClick={isWater ? undefined : handleClick}
      onMouseEnter={() => !isWater && setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      title={tooltip}
    >

      {/* ── SVG diamond ground ──────────────────────────── */}
      <svg
        viewBox="0 0 80 44"
        style={{ width: 80, height: 44, display: 'block', overflow: 'visible' }}
      >
        {/* Per-tile gradient defs (water + land) */}
        {(() => {
          const gid = `lg-${tile.x}-${tile.y}`;

          if (isWater) {
            // No per-tile gradient — flat colour prevents seaming between adjacent water tiles
            return null;
          }

          // No per-tile brightness nudge — keeps adjacent tiles blended seamlessly
          const v = 0;

          type RGB = [number, number, number];
          const hx = (r: number, g: number, b: number) =>
            `#${[r,g,b].map(c => Math.max(0,Math.min(255,c)).toString(16).padStart(2,'0')).join('')}`;
          const shift = ([r,g,b]: RGB, d: number): string => hx(r+d, g+d, b+d);

          let hi: RGB, lo: RGB;
          let sL: string, sR: string;
          if (isCleared) {
            hi = [0xaa, 0x78, 0x42]; lo = [0x6a, 0x40, 0x18];
            sL = '#5a3a18'; sR = '#6a4420';
          } else if (tile.type === 'SAND') {
            hi = [0xf4, 0xe0, 0xb0]; lo = [0xd8, 0xbc, 0x84];
            sL = '#cdb277'; sR = '#d4b97f';
          } else {
            // GRASS (default)
            hi = [0x72, 0xc4, 0x52]; lo = [0x48, 0x96, 0x2e];
            sL = '#3f8a2a'; sR = '#4a9e32';
          }

          return (
            <defs>
              {/* Top face: radial gradient — lit from upper-left */}
              <radialGradient id={gid} cx="30%" cy="22%" r="84%">
                <stop offset="0%"   stopColor={shift(hi, v + 20)} />
                <stop offset="55%"  stopColor={shift(hi, v)} />
                <stop offset="100%" stopColor={shift(lo, -v)} />
              </radialGradient>
            </defs>
          );
        })()}

        {/* Top face — expanded 1 px beyond nominal edges to seal sub-pixel seams */}
        <polygon
          points="40,-1 81,14 40,29 -1,14"
          fill={isWater
            ? '#0b3d5c'
            : hovered ? topFill : `url(#lg-${tile.x}-${tile.y})`}
          stroke="none"
        />

        {/* ── Deep pond depth layers ── */}
        {isWater && (
          <>
            {/* Abyssal darkness — centre-lower area, simulates depth */}
            <ellipse cx="40" cy="18" rx="20" ry="7"
              fill="rgba(0,12,28,0.48)"/>
            {/* Mid depth tint */}
            <ellipse cx="40" cy="14" rx="30" ry="10"
              fill="rgba(0,18,38,0.28)"/>
            {/* Sky reflection — upper-centre, lighter patch */}
            <ellipse cx="38" cy="9" rx="22" ry="6"
              fill="rgba(60,160,240,0.13)"/>
            {/* Glint highlight — small bright spot, like sunlight on still water */}
            <ellipse cx="28" cy="8" rx="7" ry="2.5"
              fill="rgba(200,238,255,0.22)" transform="rotate(-18 28 8)"/>
            {/* Secondary micro-glint */}
            <ellipse cx="50" cy="11" rx="4" ry="1.5"
              fill="rgba(200,238,255,0.15)" transform="rotate(10 50 11)"/>
          </>
        )}

        {/* Danger zone red pulse — same expanded points as base diamond */}
        {isDangerZone && (
          <polygon
            points="40,-1 81,14 40,29 -1,14"
            fill="rgba(239,68,68,0.28)"
            className="iso-danger-pulse"
          />
        )}

        {/* Wilted crop brown overlay — same expanded points */}
        {tile.object === 'CROP_WILTED' && (
          <polygon
            points="40,-1 81,14 40,29 -1,14"
            fill="rgba(139,90,43,0.55)"
          />
        )}
      </svg>

      {/* ── Fish swimming in water — ~1 in 5 water tiles ── */}
      {isWater && (tile.x * 7 + tile.y * 11) % 5 === 0 && (() => {
        const delay = (tile.x * 5 + tile.y * 7) % 16;
        // Alternate direction tile-by-tile
        const goRight = (tile.x + tile.y) % 2 === 0;
        const cls  = goRight ? 'fish-swim' : 'fish-swim-r';
        // Facing: right-swimmer faces right, left-swimmer is mirrored
        const flip = goRight ? 'none' : 'scaleX(-1)';

        return (
          <div
            className={cls}
            style={{
              position: 'absolute',
              left: 0,
              top: 18,                    // lower half of diamond — near the terrain edge
              animationDelay: `${delay}s`,
              zIndex: tileZIndex + 2,
            }}
          >
            <svg
              viewBox="0 0 22 11" width="20" height="10"
              style={{ display: 'block', transform: flip }}
            >
              {/* tail */}
              <polygon points="1,1 7,5.5 1,10" fill="#3aa8d8"/>
              {/* body */}
              <ellipse cx="13" cy="5.5" rx="9.5" ry="4.5" fill="#55c8f0"/>
              {/* belly shimmer */}
              <ellipse cx="13" cy="7.8" rx="6" ry="1.6" fill="#b8eeff" opacity="0.60"/>
              {/* dorsal fin */}
              <polygon points="8,1.5 11,5 14,1.5" fill="#2e90c0" opacity="0.85"/>
              {/* scale highlight */}
              <ellipse cx="11" cy="4.5" rx="3.5" ry="1.8" fill="rgba(255,255,255,0.28)" transform="rotate(-10 11 4.5)"/>
              {/* eye */}
              <circle cx="20" cy="4.2" r="1.4" fill="white"/>
              <circle cx="20.4" cy="4.2" r="0.7" fill="#0a2a40"/>
              <circle cx="20.1" cy="3.9" r="0.35" fill="rgba(255,255,255,0.8)"/>
            </svg>
          </div>
        );
      })()}

      {/* ── SVG art object (trees, rocks, flowers, driftwood) ── */}
      {hasSvg && tile.object && (
        // Outer div: positioning only (translate must not be overridden by sway animation)
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: 14,          // diamond vertical centre (TH/2 = 28/2)
            transform: 'translate(-50%, -100%)',
            pointerEvents: 'none',
            userSelect: 'none',
          }}
        >
          {/* Inner div: sway animation only — transformOrigin at the base of the tree */}
          <div
            style={{
              filter: 'drop-shadow(0 3px 5px rgba(0,0,0,0.38))',
              animation: undefined,
              transformOrigin: 'bottom center',
            }}
          >
            <ObjectSVG object={tile.object} tileX={tile.x} tileY={tile.y}/>
          </div>
        </div>
      )}

      {/* ── Emoji object (crops, fish, structures, enemies, neighbour) ── */}
      {emoji && (
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: 14,
            transform: 'translate(-50%, -100%)',
            pointerEvents: 'none',
            userSelect: 'none',
          }}
        >
          <div
            style={{
              fontSize: 28,
              lineHeight: 1,
              filter: tile.object === 'CROP_WILTED'
                ? 'grayscale(80%) sepia(40%)'
                : 'drop-shadow(0 3px 4px rgba(0,0,0,0.35))',
            }}
          >
            {emoji}
          </div>

          {/* Crop timer badge */}
          {badgeText && (
            <div
              style={{
                position: 'absolute',
                bottom: '100%',
                left: '50%',
                transform: 'translateX(-50%)',
                whiteSpace: 'nowrap',
                fontSize: 9,
                fontWeight: 800,
                background: 'rgba(0,0,0,0.74)',
                color: tile.object === 'CROP_READY' ? '#4ade80' : '#facc15',
                padding: '1px 5px',
                borderRadius: 8,
                marginBottom: 2,
                lineHeight: 1.4,
              }}
            >
              {badgeText}
              {tile.object === 'CROP_GROWING' && (
                <div style={{
                  width: 36, height: 3,
                  background: 'rgba(255,255,255,0.2)',
                  borderRadius: 2, marginTop: 2, overflow: 'hidden',
                }}>
                  <div style={{ width: `${progressPct}%`, height: '100%', background: '#4ade80' }} />
                </div>
              )}
            </div>
          )}

          {/* Enemy HP bar */}
          {(tile.object === 'CRAB' || tile.object === 'BOAR') && (
            <div style={{
              position: 'absolute', bottom: '100%',
              left: '50%', transform: 'translateX(-50%)',
              width: 36, height: 5,
              background: '#7f1d1d',
              borderRadius: 3, overflow: 'hidden',
              border: '1px solid rgba(255,255,255,0.5)',
              marginBottom: 2,
            }}>
              <div style={{
                width: `${((tile.crabHp ?? (tile.object === 'CRAB' ? 3 : 2)) / (tile.object === 'CRAB' ? 3 : 2)) * 100}%`,
                height: '100%', background: '#ef4444',
              }} />
            </div>
          )}
        </div>
      )}

      {/* ── Wilted crop action buttons ─────────────────── */}
      {tile.object === 'CROP_WILTED' && !tile.unwitherRequestedAt && (
        <div style={{
          position: 'absolute', left: '50%', top: -10,
          transform: 'translateX(-50%)',
          display: 'flex', gap: 2, zIndex: 10,
        }}>
          <button
            onClick={e => { e.stopPropagation(); interact(tile.id); }}
            style={{ background: '#ef4444', color: '#fff', fontSize: 8, padding: '1px 4px', borderRadius: 4, border: 'none', cursor: 'pointer' }}
          >Clear</button>
          <button
            onClick={e => {
              e.stopPropagation();
              dispatch({ type: 'REQUEST_UNWITHER', tileId: tile.id });
              toast({ title: 'Request Sent!', description: 'A friend will unwither this soon.' });
            }}
            style={{ background: '#3b82f6', color: '#fff', fontSize: 8, padding: '1px 4px', borderRadius: 4, border: 'none', cursor: 'pointer' }}
          >Ask Friend</button>
        </div>
      )}
      {tile.object === 'CROP_WILTED' && tile.unwitherRequestedAt && (
        <div style={{
          position: 'absolute', left: '50%', top: -12,
          transform: 'translateX(-50%)',
          fontSize: 7, fontWeight: 700,
          background: 'rgba(0,0,0,0.65)', color: '#fff',
          padding: '1px 5px', borderRadius: 8, whiteSpace: 'nowrap',
        }}>
          Waiting for friend…
        </div>
      )}

      {/* ── Floating reward texts ──────────────────────── */}
      {myTexts.map(t => (
        <div key={t.id} className="floating-text text-yellow-300 text-2xl">
          {t.text}
        </div>
      ))}
    </div>
  );
};

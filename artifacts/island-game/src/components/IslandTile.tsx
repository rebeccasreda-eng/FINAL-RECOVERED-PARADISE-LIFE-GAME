import React, { useState, useEffect } from 'react';
import { useGame } from '../game/GameContext';
import { TileData } from '../game/types';
import { OBJECT_CONFIG, EMOJI_MAP, CROP_TYPES } from '../game/gameData';
import { useToast } from '@/hooks/use-toast';

/* ── Diamond colour palette — matches HTML reference ────────────────────── */
const COLORS = {
  GRASS:   { top: '#7ccc18', sideL: '#52a00c', sideR: '#60b010' },
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
            <stop offset="0%"   stopColor="#e8b85a"/>
            <stop offset="40%"  stopColor="#b07c38"/>
            <stop offset="100%" stopColor="#7a4e1c"/>
          </linearGradient>
          <radialGradient id={g('plc')} cx="36%" cy="30%" r="72%">
            <stop offset="0%"   stopColor="#a8f468"/>
            <stop offset="52%"  stopColor="#52c83a"/>
            <stop offset="100%" stopColor="#1e7414"/>
          </radialGradient>
        </defs>
        {/* Soft ground blend — no hard shadow */}
        <ellipse cx="30" cy="89" rx="13" ry="3.5" fill="rgba(120,90,40,0.28)"/>
        {/* Trunk — single clean path, no dark overlay */}
        <path d="M19,89 Q23,72 27,52 L33,52 Q37,72 41,89Z" fill={`url(#${g('plt')})`}/>
        {/* Left highlight stripe */}
        <path d="M21.5,87 Q25,70 28.5,54" stroke="rgba(255,255,255,0.42)" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
        {/* Bark vertical groove */}
        <path d="M34,87 Q35,70 34.5,54" stroke="rgba(0,0,0,0.16)" strokeWidth="1.4" fill="none" strokeLinecap="round"/>
        {/* Bark rings */}
        {[56,64,72,80].map(y => (
          <path key={y} d={`M21,${y} Q30,${y-2} 39,${y}`} stroke="rgba(0,0,0,0.24)" strokeWidth="2" fill="none" strokeLinecap="round"/>
        ))}
        {/* Bark knot texture */}
        <ellipse cx="27" cy="68" rx="2.5" ry="1.5" fill="rgba(0,0,0,0.14)" transform="rotate(-8 27 68)"/>
        <ellipse cx="33" cy="77" rx="2"   ry="1.2" fill="rgba(0,0,0,0.12)" transform="rotate(5 33 77)"/>
        {/* Back drooping fronds */}
        <path d="M30,48 Q10,56 2,62"  stroke="#228018" strokeWidth="11" fill="none" strokeLinecap="round" opacity="0.80"/>
        <path d="M30,48 Q50,56 58,62" stroke="#228018" strokeWidth="11" fill="none" strokeLinecap="round" opacity="0.80"/>
        {/* Mid fronds */}
        <path d="M30,46 Q8,40 2,28"   stroke="#30901e" strokeWidth="10.5" fill="none" strokeLinecap="round"/>
        <path d="M30,46 Q52,40 58,28" stroke="#30901e" strokeWidth="10.5" fill="none" strokeLinecap="round"/>
        {/* Upper fronds */}
        <path d="M30,44 Q16,28 10,12"  stroke="#3eaa28" strokeWidth="10" fill="none" strokeLinecap="round"/>
        <path d="M30,44 Q44,28 50,12"  stroke="#3eaa28" strokeWidth="10" fill="none" strokeLinecap="round"/>
        {/* Top frond */}
        <path d="M30,42 Q30,22 29,4"   stroke="#50c032" strokeWidth="9.5" fill="none" strokeLinecap="round"/>
        {/* Leaflet pairs */}
        <path d="M20,52 L16,46" stroke="#38a022" strokeWidth="2.2" fill="none" strokeLinecap="round"/>
        <path d="M20,52 L17,58" stroke="#28781a" strokeWidth="2.2" fill="none" strokeLinecap="round"/>
        <path d="M11,57 L7,51"  stroke="#38a022" strokeWidth="2" fill="none" strokeLinecap="round"/>
        <path d="M11,57 L8,63"  stroke="#28781a" strokeWidth="2" fill="none" strokeLinecap="round"/>
        <path d="M40,52 L44,46" stroke="#38a022" strokeWidth="2.2" fill="none" strokeLinecap="round"/>
        <path d="M40,52 L43,58" stroke="#28781a" strokeWidth="2.2" fill="none" strokeLinecap="round"/>
        <path d="M49,57 L53,51" stroke="#38a022" strokeWidth="2" fill="none" strokeLinecap="round"/>
        <path d="M49,57 L52,63" stroke="#28781a" strokeWidth="2" fill="none" strokeLinecap="round"/>
        <path d="M21,39 L17,34" stroke="#48b82c" strokeWidth="2" fill="none" strokeLinecap="round"/>
        <path d="M39,39 L43,34" stroke="#48b82c" strokeWidth="2" fill="none" strokeLinecap="round"/>
        {/* Frond tip highlights */}
        <path d="M30,48 Q10,56 2,62"  stroke="#78e852" strokeWidth="3.5" fill="none" strokeLinecap="round" opacity="0.55"/>
        <path d="M30,48 Q50,56 58,62" stroke="#78e852" strokeWidth="3.5" fill="none" strokeLinecap="round" opacity="0.55"/>
        <path d="M30,44 Q16,28 10,12"  stroke="#78e852" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.55"/>
        <path d="M30,44 Q44,28 50,12"  stroke="#78e852" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.55"/>
        {/* Crown */}
        <circle cx="30" cy="46" r="13" fill="#1e7012"/>
        <circle cx="30" cy="44" r="10" fill={`url(#${g('plc')})`}/>
        {/* Specular */}
        <ellipse cx="25" cy="38" rx="6" ry="3.8" fill="rgba(255,255,255,0.40)" transform="rotate(-15 25 38)"/>
        {/* Coconuts */}
        <circle cx="23" cy="50" r="4.8" fill="#7a4418"/>
        <circle cx="37" cy="51" r="4.4" fill="#6a3c12"/>
        <circle cx="30" cy="54" r="4"   fill="#723e16"/>
        <circle cx="21.5" cy="48" r="1.7" fill="rgba(255,255,255,0.36)"/>
        <circle cx="35.5" cy="49" r="1.5" fill="rgba(255,255,255,0.32)"/>
      </svg>
    );

    /* ── APPLE TREE ─────────────────────────────────────────────────────── */
    case 'TREE_APPLE': return (
      <svg viewBox="0 0 62 90" width="60" height="86" style={{ display:'block' }}>
        <defs>
          <linearGradient id={g('apt')} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"   stopColor="#e0a060"/>
            <stop offset="40%"  stopColor="#b07038"/>
            <stop offset="100%" stopColor="#78461c"/>
          </linearGradient>
          <radialGradient id={g('apc')} cx="30%" cy="22%" r="76%">
            <stop offset="0%"   stopColor="#b8f460"/>
            <stop offset="44%"  stopColor="#54c42a"/>
            <stop offset="100%" stopColor="#1a7210"/>
          </radialGradient>
          <radialGradient id={g('apr')} cx="36%" cy="30%" r="66%">
            <stop offset="0%"   stopColor="#ff8070"/>
            <stop offset="52%"  stopColor="#e03020"/>
            <stop offset="100%" stopColor="#a01008"/>
          </radialGradient>
        </defs>
        {/* Trunk — thin, clean, no dark overlay */}
        <rect x="26" y="54" width="10" height="34" rx="4.5" fill={`url(#${g('apt')})`}/>
        {/* Trunk highlight */}
        <path d="M28,86 Q28,68 28.5,56" stroke="rgba(255,255,255,0.38)" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
        {/* Bark rings */}
        {[63,72,81].map(y => (
          <path key={y} d={`M27,${y} Q31,${y-1} 35,${y}`} stroke="rgba(0,0,0,0.16)" strokeWidth="1.3" fill="none" strokeLinecap="round"/>
        ))}
        {/* Soft ground blend */}
        <ellipse cx="31" cy="87" rx="12" ry="3.5" fill="rgba(130,100,50,0.30)"/>
        {/* Canopy depth base */}
        <circle cx="31" cy="36" r="27" fill="#186010" opacity="0.65"/>
        {/* Lower side clusters — fluffy edge */}
        <circle cx="7"  cy="46" r="16" fill="#22780e"/>
        <circle cx="55" cy="46" r="16" fill="#258018"/>
        {/* Main canopy ball */}
        <ellipse cx="31" cy="32" rx="26" ry="23" fill={`url(#${g('apc')})`}/>
        {/* Side clusters mid */}
        <circle cx="8"  cy="36" r="17" fill="#30901a"/>
        <circle cx="54" cy="36" r="17" fill="#349a1e"/>
        {/* Upper leaf bumps */}
        <circle cx="18" cy="23" r="14" fill="#42a822"/>
        <circle cx="44" cy="21" r="13" fill="#44ae24"/>
        {/* Top bright dome */}
        <circle cx="31" cy="14" r="15" fill="#56c02c"/>
        <circle cx="31" cy="10" r="10" fill="#68d038"/>
        {/* Specular highlight */}
        <ellipse cx="18" cy="14" rx="12" ry="7" fill="rgba(255,255,255,0.42)" transform="rotate(-14 18 14)"/>
        {/* Apples */}
        <circle cx="12" cy="44" r="5.8" fill={`url(#${g('apr')})`}/>
        <circle cx="44" cy="42" r="5.8" fill={`url(#${g('apr')})`}/>
        <circle cx="28" cy="49" r="5.2" fill={`url(#${g('apr')})`}/>
        <circle cx="46" cy="50" r="4.6" fill={`url(#${g('apr')})`}/>
        {/* Apple shine */}
        <circle cx="10"  cy="41.5" r="2.2" fill="rgba(255,255,255,0.62)"/>
        <circle cx="42"  cy="39.5" r="2.2" fill="rgba(255,255,255,0.62)"/>
        <circle cx="26"  cy="46.5" r="2"   fill="rgba(255,255,255,0.62)"/>
        <circle cx="44.5" cy="47.5" r="1.8" fill="rgba(255,255,255,0.58)"/>
        {/* Stems */}
        <line x1="12" y1="37.8" x2="13" y2="34.5" stroke="#2a6814" strokeWidth="1.3"/>
        <line x1="44" y1="35.8" x2="45" y2="32.5" stroke="#2a6814" strokeWidth="1.3"/>
        <line x1="28" y1="43"   x2="29" y2="40"   stroke="#2a6814" strokeWidth="1.3"/>
      </svg>
    );

    /* ── ROCK ───────────────────────────────────────────────────────────── */
    case 'ROCK': return (
      <svg viewBox="0 0 56 36" width="54" height="34" style={{ display:'block' }}>
        <defs>
          <radialGradient id={g('rkg')} cx="30%" cy="28%" r="75%">
            <stop offset="0%"   stopColor="#d8d8d0"/>
            <stop offset="50%"  stopColor="#a0a098"/>
            <stop offset="100%" stopColor="#606058"/>
          </radialGradient>
          <radialGradient id={g('rks')} cx="35%" cy="30%" r="70%">
            <stop offset="0%"   stopColor="#c6c6be"/>
            <stop offset="55%"  stopColor="#888882"/>
            <stop offset="100%" stopColor="#525248"/>
          </radialGradient>
        </defs>
        {/* Ground shadow — wide, low */}
        <ellipse cx="26" cy="34" rx="26" ry="4.5" fill="rgba(0,0,0,0.22)"/>
        {/* Small back rock — flat */}
        <ellipse cx="44" cy="22" rx="11" ry="6"   fill={`url(#${g('rks')})`}/>
        <ellipse cx="40" cy="19" rx="4"  ry="1.8" fill="rgba(255,255,255,0.26)" transform="rotate(-10 40 19)"/>
        {/* Main boulder — wide and flat */}
        <ellipse cx="22" cy="26" rx="23" ry="10"  fill={`url(#${g('rkg')})`}/>
        {/* Rim */}
        <ellipse cx="22" cy="26" rx="23" ry="10"  fill="none" stroke="rgba(0,0,0,0.12)" strokeWidth="1.4"/>
        {/* Specular highlight */}
        <ellipse cx="11" cy="21" rx="10" ry="3.5" fill="rgba(255,255,255,0.42)" transform="rotate(-12 11 21)"/>
        {/* Secondary highlight */}
        <ellipse cx="7"  cy="26" rx="3.5" ry="1.5" fill="rgba(255,255,255,0.20)" transform="rotate(-6 7 26)"/>
        {/* Subtle crack */}
        <path d="M20,22 Q22,26 21,31" stroke="rgba(0,0,0,0.10)" strokeWidth="1.2" fill="none"/>
        {/* Mossy patch */}
        <ellipse cx="30" cy="29" rx="6" ry="2.5" fill="#5a8820" opacity="0.28"/>
        <ellipse cx="14" cy="30" rx="4" ry="2"   fill="#4a7818" opacity="0.22"/>
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
            <stop offset="0%"   stopColor="#e8b85a"/>
            <stop offset="44%"  stopColor="#aa7832"/>
            <stop offset="100%" stopColor="#6a4418"/>
          </linearGradient>
          <radialGradient id={g('coc')} cx="36%" cy="28%" r="70%">
            <stop offset="0%"   stopColor="#a4f062"/>
            <stop offset="54%"  stopColor="#3aaa20"/>
            <stop offset="100%" stopColor="#147014"/>
          </radialGradient>
        </defs>
        {/* Soft ground blend — no dark shadow */}
        <ellipse cx="35" cy="105" rx="15" ry="4" fill="rgba(120,90,40,0.28)"/>
        {/* Trunk — single clean path, no dark overlay */}
        <path d="M23,104 Q27,82 31,60 L38,60 Q42,82 46,104Z" fill={`url(#${g('cot')})`}/>
        {/* Left highlight */}
        <path d="M25.5,102 Q29,80 33,62" stroke="rgba(255,255,255,0.40)" strokeWidth="3" fill="none" strokeLinecap="round"/>
        {/* Bark groove */}
        <path d="M40,102 Q41,82 40,62" stroke="rgba(0,0,0,0.15)" strokeWidth="1.6" fill="none" strokeLinecap="round"/>
        {/* Bark rings */}
        {[68,76,84,92,100].map(y => (
          <path key={y} d={`M25,${y} Q35,${y-2.5} 45,${y}`} stroke="rgba(0,0,0,0.22)" strokeWidth="2.2" fill="none" strokeLinecap="round"/>
        ))}
        {/* Bark knots */}
        <ellipse cx="30" cy="80" rx="3" ry="1.8" fill="rgba(0,0,0,0.14)" transform="rotate(-6 30 80)"/>
        <ellipse cx="39" cy="90" rx="2.5" ry="1.5" fill="rgba(0,0,0,0.12)" transform="rotate(8 39 90)"/>
        {/* Back drooping fronds */}
        <path d="M34,56 Q14,62 4,68"  stroke="#228020" strokeWidth="13" fill="none" strokeLinecap="round" opacity="0.80"/>
        <path d="M34,56 Q54,62 66,68" stroke="#228020" strokeWidth="13" fill="none" strokeLinecap="round" opacity="0.80"/>
        {/* Mid fronds */}
        <path d="M34,54 Q12,48 4,36"   stroke="#309c28" strokeWidth="12" fill="none" strokeLinecap="round"/>
        <path d="M34,54 Q56,48 66,36"  stroke="#309c28" strokeWidth="12" fill="none" strokeLinecap="round"/>
        {/* Upper fronds */}
        <path d="M34,52 Q16,38 10,20"  stroke="#3cb230" strokeWidth="11.5" fill="none" strokeLinecap="round"/>
        <path d="M34,52 Q52,38 60,20"  stroke="#3cb230" strokeWidth="11.5" fill="none" strokeLinecap="round"/>
        {/* Top fronds */}
        <path d="M34,50 Q24,30 20,10"  stroke="#48c43a" strokeWidth="10.5" fill="none" strokeLinecap="round"/>
        <path d="M34,50 Q44,30 50,10"  stroke="#48c43a" strokeWidth="10.5" fill="none" strokeLinecap="round"/>
        <path d="M34,48 Q34,28 33,8"   stroke="#58d445" strokeWidth="10"   fill="none" strokeLinecap="round"/>
        {/* Leaflet pairs left drooping frond */}
        <path d="M22,60 L17,54" stroke="#34a428" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
        <path d="M22,60 L18,66" stroke="#267818" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
        <path d="M12,65 L7,59"  stroke="#34a428" strokeWidth="2.2" fill="none" strokeLinecap="round"/>
        <path d="M12,65 L8,71"  stroke="#267818" strokeWidth="2.2" fill="none" strokeLinecap="round"/>
        {/* Leaflet pairs right drooping frond */}
        <path d="M46,60 L51,54" stroke="#34a428" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
        <path d="M46,60 L50,66" stroke="#267818" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
        <path d="M56,65 L61,59" stroke="#34a428" strokeWidth="2.2" fill="none" strokeLinecap="round"/>
        <path d="M56,65 L60,71" stroke="#267818" strokeWidth="2.2" fill="none" strokeLinecap="round"/>
        {/* Leaflet pairs upper fronds */}
        <path d="M22,43 L17,37" stroke="#42b830" strokeWidth="2.2" fill="none" strokeLinecap="round"/>
        <path d="M46,43 L51,37" stroke="#42b830" strokeWidth="2.2" fill="none" strokeLinecap="round"/>
        {/* Frond tip highlights */}
        <path d="M34,56 Q14,62 4,68"  stroke="#7aec52" strokeWidth="4" fill="none" strokeLinecap="round" opacity="0.52"/>
        <path d="M34,56 Q54,62 66,68" stroke="#7aec52" strokeWidth="4" fill="none" strokeLinecap="round" opacity="0.52"/>
        <path d="M34,52 Q16,38 10,20"  stroke="#7aec52" strokeWidth="3.5" fill="none" strokeLinecap="round" opacity="0.52"/>
        <path d="M34,52 Q52,38 60,20"  stroke="#7aec52" strokeWidth="3.5" fill="none" strokeLinecap="round" opacity="0.52"/>
        {/* Crown */}
        <circle cx="34" cy="54" r="15" fill="#1a7014"/>
        <circle cx="34" cy="52" r="11" fill={`url(#${g('coc')})`}/>
        {/* Specular */}
        <ellipse cx="27" cy="44" rx="7.5" ry="4.5" fill="rgba(255,255,255,0.42)" transform="rotate(-18 27 44)"/>
        {/* Coconuts */}
        <circle cx="26" cy="58" r="6"   fill="#7a4418"/>
        <circle cx="40" cy="59" r="5.5" fill="#6a3c12"/>
        <circle cx="34" cy="63" r="5"   fill="#723e14"/>
        <circle cx="24.5" cy="56" r="2" fill="rgba(255,255,255,0.34)"/>
        <circle cx="38.5" cy="57" r="1.8" fill="rgba(255,255,255,0.30)"/>
      </svg>
    );

    /* ── MANGO TREE ─────────────────────────────────────────────────────── */
    case 'TREE_MANGO': return (
      <svg viewBox="0 0 74 92" width="68" height="85" style={{ display:'block' }}>
        <defs>
          <linearGradient id={g('mgt')} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"   stopColor="#e2a862"/>
            <stop offset="40%"  stopColor="#b07838"/>
            <stop offset="100%" stopColor="#784818"/>
          </linearGradient>
          <radialGradient id={g('mgc')} cx="30%" cy="22%" r="76%">
            <stop offset="0%"   stopColor="#b4f05a"/>
            <stop offset="44%"  stopColor="#50bc26"/>
            <stop offset="100%" stopColor="#186210"/>
          </radialGradient>
          <radialGradient id={g('mgm')} cx="38%" cy="28%" r="68%">
            <stop offset="0%"   stopColor="#ffe858"/>
            <stop offset="55%"  stopColor="#e8a018"/>
            <stop offset="100%" stopColor="#a8680a"/>
          </radialGradient>
        </defs>
        {/* Trunk — thin, clean, no dark overlay */}
        <rect x="31" y="54" width="12" height="35" rx="5" fill={`url(#${g('mgt')})`}/>
        {/* Trunk highlight */}
        <path d="M33,87 Q33,68 33.5,56" stroke="rgba(255,255,255,0.40)" strokeWidth="2" fill="none" strokeLinecap="round"/>
        {/* Bark rings */}
        {[64,73,82].map(y => (
          <path key={y} d={`M32,${y} Q37,${y-1.5} 42,${y}`} stroke="rgba(0,0,0,0.16)" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
        ))}
        {/* Soft ground blend */}
        <ellipse cx="37" cy="88" rx="14" ry="4" fill="rgba(130,100,50,0.30)"/>
        {/* Canopy depth base */}
        <ellipse cx="37" cy="38" rx="34" ry="27" fill="#145408" opacity="0.65"/>
        {/* Lower side clusters */}
        <circle cx="7"  cy="48" r="20" fill="#1e6810"/>
        <circle cx="67" cy="48" r="20" fill="#227014"/>
        {/* Main canopy */}
        <ellipse cx="37" cy="33" rx="31" ry="26" fill={`url(#${g('mgc')})`}/>
        {/* Side clusters mid */}
        <circle cx="9"  cy="38" r="19" fill="#2e8a18"/>
        <circle cx="65" cy="38" r="19" fill="#32941c"/>
        {/* Upper clusters */}
        <circle cx="22" cy="22" r="16" fill="#3ea820"/>
        <circle cx="52" cy="20" r="15" fill="#42ae24"/>
        {/* Top bright dome */}
        <circle cx="37" cy="13" r="18" fill="#52be2c"/>
        <circle cx="37" cy="8"  r="12" fill="#66d038"/>
        {/* Specular */}
        <ellipse cx="22" cy="12" rx="14" ry="8" fill="rgba(255,255,255,0.40)" transform="rotate(-14 22 12)"/>
        {/* Mangoes */}
        <ellipse cx="11" cy="50" rx="7" ry="9.5" fill={`url(#${g('mgm')})`} transform="rotate(-18 11 50)"/>
        <ellipse cx="37" cy="56" rx="7" ry="9.5" fill={`url(#${g('mgm')})`} transform="rotate(8 37 56)"/>
        <ellipse cx="63" cy="50" rx="7" ry="9.5" fill={`url(#${g('mgm')})`} transform="rotate(18 63 50)"/>
        <ellipse cx="22" cy="45" rx="6" ry="8" fill={`url(#${g('mgm')})`} transform="rotate(-10 22 45)"/>
        <ellipse cx="52" cy="45" rx="6" ry="8" fill={`url(#${g('mgm')})`} transform="rotate(12 52 45)"/>
        {/* Mango shine */}
        <ellipse cx="8.5"  cy="47" rx="2.8" ry="3.8" fill="rgba(255,255,255,0.52)" transform="rotate(-18 8.5 47)"/>
        <ellipse cx="34.5" cy="53" rx="2.8" ry="3.8" fill="rgba(255,255,255,0.50)" transform="rotate(8 34.5 53)"/>
        <ellipse cx="60.5" cy="47" rx="2.8" ry="3.8" fill="rgba(255,255,255,0.48)" transform="rotate(18 60.5 47)"/>
      </svg>
    );

    /* ── GARDEN PATCH ───────────────────────────────────────────────────── */
    case 'GARDEN_PATCH': return (
      <svg viewBox="0 0 72 62" width="66" height="57" style={{ display:'block' }}>
        <defs>
          {/* Soil */}
          <linearGradient id={g('gpf')} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%"   stopColor="#4e9a20"/>
            <stop offset="100%" stopColor="#2d6010"/>
          </linearGradient>
          {/* Post wood — side-lit (bright left, dark right) */}
          <linearGradient id={g('gpw')} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"   stopColor="#d8c08a"/>
            <stop offset="55%"  stopColor="#b09858"/>
            <stop offset="100%" stopColor="#7a6030"/>
          </linearGradient>
          {/* Rail wood — top-lit */}
          <linearGradient id={g('gpr')} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%"   stopColor="#ccb07a"/>
            <stop offset="100%" stopColor="#8a6c3c"/>
          </linearGradient>
          {/* Blueberry — rich blue-purple */}
          <radialGradient id={g('gpb')} cx="30%" cy="25%" r="68%">
            <stop offset="0%"   stopColor="#8898f8"/>
            <stop offset="50%"  stopColor="#3a50d8"/>
            <stop offset="100%" stopColor="#162898"/>
          </radialGradient>
          {/* Pineapple body */}
          <radialGradient id={g('gpp')} cx="30%" cy="22%" r="72%">
            <stop offset="0%"   stopColor="#ffe250"/>
            <stop offset="52%"  stopColor="#d89a20"/>
            <stop offset="100%" stopColor="#8a6008"/>
          </radialGradient>
          {/* Clip masks for pineapple diamond texture */}
          <clipPath id={g('cp1')}><ellipse cx="44" cy="46" rx="8"   ry="11"/></clipPath>
          <clipPath id={g('cp2')}><ellipse cx="58" cy="43" rx="8.5" ry="12"/></clipPath>
        </defs>

        {/* ── Soil bed ── */}
        <rect x="3" y="30" width="66" height="28" rx="4" fill={`url(#${g('gpf')})`}/>
        <rect x="3" y="30" width="66" height="6"  rx="3" fill="rgba(255,255,255,0.12)"/>

        {/* ══ BLUEBERRY SECTION  (x 9 – 33) ══ */}
        {/* Leaf mass */}
        <ellipse cx="21" cy="40" rx="13" ry="12" fill="#1e8012"/>
        <ellipse cx="15" cy="44" rx="9"  ry="8"  fill="#187010"/>
        <ellipse cx="28" cy="43" rx="10" ry="9"  fill="#228818"/>
        <ellipse cx="19" cy="34" rx="11" ry="8"  fill="#2a9a1e"/>
        <ellipse cx="27" cy="36" rx="9"  ry="7"  fill="#289818"/>
        {/* Leaf lobes */}
        <path d="M13,28 Q18,21 23,28 Q18,35 13,28Z" fill="#32a81e" opacity="0.85"/>
        <path d="M21,25 Q26,18 31,25 Q26,32 21,25Z" fill="#2c9e1a" opacity="0.85"/>
        <path d="M10,36 Q14,29 18,36 Q14,43 10,36Z" fill="#28941a" opacity="0.80"/>
        <path d="M25,29 Q30,22 35,29 Q30,36 25,29Z" fill="#30a01c" opacity="0.75"/>
        {/* 10-berry cluster — back → front */}
        {([
          {cx:14,cy:36,r:4.2},{cx:21,cy:34,r:4.5},{cx:28,cy:36,r:4.0},
          {cx:11,cy:42,r:4.8},{cx:18,cy:40,r:5.2},{cx:25,cy:41,r:5.0},{cx:32,cy:42,r:4.5},
          {cx:14,cy:48,r:5.0},{cx:22,cy:49,r:5.4},{cx:29,cy:48,r:4.8},
        ] as const).map((b,i) => (
          <g key={i}>
            <circle cx={b.cx} cy={b.cy} r={b.r} fill={`url(#${g('gpb')})`}/>
            {/* Crown dimple */}
            <ellipse cx={b.cx} cy={b.cy-b.r+1.4} rx={b.r*0.40} ry={b.r*0.24} fill="rgba(0,0,0,0.32)"/>
            {/* Main specular */}
            <circle cx={b.cx-b.r*0.33} cy={b.cy-b.r*0.38} r={b.r*0.34} fill="rgba(255,255,255,0.58)"/>
            {/* Tiny secondary highlight */}
            <circle cx={b.cx+b.r*0.15} cy={b.cy-b.r*0.55} r={b.r*0.16} fill="rgba(255,255,255,0.34)"/>
          </g>
        ))}
        {/* Front leaves over berries */}
        <path d="M9,52  Q14,45 19,52  Q14,59 9,52Z"  fill="#1e8412" opacity="0.75"/>
        <path d="M26,51 Q31,44 36,51  Q31,58 26,51Z"  fill="#22901a" opacity="0.70"/>

        {/* ══ PINEAPPLE SECTION  (x 39 – 66) ══ */}
        {/* Base leaf mass */}
        <ellipse cx="52" cy="44" rx="15" ry="13" fill="#1a7a0e"/>
        <ellipse cx="44" cy="46" rx="10" ry="9"  fill="#187010"/>
        <ellipse cx="60" cy="46" rx="10" ry="9"  fill="#1e8014"/>

        {/* ── Pineapple 1 (left, slightly behind) ── */}
        <ellipse cx="44" cy="46" rx="8"   ry="11" fill={`url(#${g('gpp')})`}/>
        {/* Diamond grid texture, clipped to body */}
        <g clipPath={`url(#${g('cp1')})`}>
          {([36,39,42,45,48,51,54,57] as const).map(y => (
            <line key={y}   x1="33" y1={y} x2="55" y2={y} stroke="#7a5808" strokeWidth="1.1" opacity="0.60"/>
          ))}
          {([-10,-5,0,5,10,15] as const).map(o => (
            <line key={o}   x1={36+o} y1="35" x2={28+o} y2="57" stroke="#7a5808" strokeWidth="0.9" opacity="0.42"/>
          ))}
          {([-10,-5,0,5,10,15] as const).map(o => (
            <line key={`r${o}`} x1={36+o} y1="35" x2={44+o} y2="57" stroke="#7a5808" strokeWidth="0.9" opacity="0.42"/>
          ))}
        </g>
        {/* Body shine */}
        <ellipse cx="41" cy="41" rx="3" ry="5.5" fill="rgba(255,255,255,0.34)"/>
        {/* Crown — 5 main + 2 side leaves */}
        <path d="M44,35 L37,18" stroke="#1a7a0a" strokeWidth="3.6" fill="none" strokeLinecap="round"/>
        <path d="M44,35 L40,16" stroke="#228a14" strokeWidth="3.0" fill="none" strokeLinecap="round"/>
        <path d="M44,35 L44,14" stroke="#1a7a0a" strokeWidth="3.8" fill="none" strokeLinecap="round"/>
        <path d="M44,35 L48,16" stroke="#228a14" strokeWidth="3.0" fill="none" strokeLinecap="round"/>
        <path d="M44,35 L51,18" stroke="#1a7a0a" strokeWidth="3.6" fill="none" strokeLinecap="round"/>
        <path d="M44,35 L36,23" stroke="#2e9a1c" strokeWidth="2.2" fill="none" strokeLinecap="round"/>
        <path d="M44,35 L52,23" stroke="#2e9a1c" strokeWidth="2.2" fill="none" strokeLinecap="round"/>
        {/* Leaf tips (lighter) */}
        <path d="M37,18 L35,15" stroke="#4ab830" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
        <path d="M44,14 L44,11" stroke="#4ab830" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
        <path d="M51,18 L53,15" stroke="#4ab830" strokeWidth="1.8" fill="none" strokeLinecap="round"/>

        {/* ── Pineapple 2 (right, front, larger) ── */}
        <ellipse cx="58" cy="43" rx="8.5" ry="12" fill={`url(#${g('gpp')})`}/>
        <g clipPath={`url(#${g('cp2')})`}>
          {([31,34,37,40,43,46,49,52,55] as const).map(y => (
            <line key={y}   x1="46" y1={y} x2="70" y2={y} stroke="#7a5808" strokeWidth="1.1" opacity="0.60"/>
          ))}
          {([-10,-5,0,5,10,15] as const).map(o => (
            <line key={o}   x1={50+o} y1="31" x2={42+o} y2="55" stroke="#7a5808" strokeWidth="0.9" opacity="0.42"/>
          ))}
          {([-10,-5,0,5,10,15] as const).map(o => (
            <line key={`r${o}`} x1={50+o} y1="31" x2={58+o} y2="55" stroke="#7a5808" strokeWidth="0.9" opacity="0.42"/>
          ))}
        </g>
        <ellipse cx="55" cy="37" rx="3.2" ry="6" fill="rgba(255,255,255,0.36)"/>
        {/* Crown */}
        <path d="M58,31 L51,14" stroke="#1a7a0a" strokeWidth="3.8" fill="none" strokeLinecap="round"/>
        <path d="M58,31 L54,12" stroke="#228a14" strokeWidth="3.2" fill="none" strokeLinecap="round"/>
        <path d="M58,31 L58,10" stroke="#1a7a0a" strokeWidth="4.0" fill="none" strokeLinecap="round"/>
        <path d="M58,31 L62,12" stroke="#228a14" strokeWidth="3.2" fill="none" strokeLinecap="round"/>
        <path d="M58,31 L65,14" stroke="#1a7a0a" strokeWidth="3.8" fill="none" strokeLinecap="round"/>
        <path d="M58,31 L50,19" stroke="#2e9a1c" strokeWidth="2.4" fill="none" strokeLinecap="round"/>
        <path d="M58,31 L66,19" stroke="#2e9a1c" strokeWidth="2.4" fill="none" strokeLinecap="round"/>
        <path d="M51,14 L49,11" stroke="#4ab830" strokeWidth="1.9" fill="none" strokeLinecap="round"/>
        <path d="M58,10 L58,7"  stroke="#4ab830" strokeWidth="2.0" fill="none" strokeLinecap="round"/>
        <path d="M65,14 L67,11" stroke="#4ab830" strokeWidth="1.9" fill="none" strokeLinecap="round"/>

        {/* ══ RAIL FENCE (rendered last so it sits in front) ══ */}

        {/* ── Posts — thick, weathered, side-shaded ── */}
        {/* Left post */}
        <rect x="2"  y="14" width="7" height="46" rx="2.5" fill={`url(#${g('gpw')})`}/>
        <rect x="2"  y="14" width="2.2" height="46" rx="1" fill="rgba(255,255,255,0.26)"/>
        <rect x="7"  y="14" width="2"   height="46" rx="1" fill="rgba(0,0,0,0.24)"/>
        {/* Center post */}
        <rect x="33" y="14" width="7" height="46" rx="2.5" fill={`url(#${g('gpw')})`}/>
        <rect x="33" y="14" width="2.2" height="46" rx="1" fill="rgba(255,255,255,0.26)"/>
        <rect x="38" y="14" width="2"   height="46" rx="1" fill="rgba(0,0,0,0.24)"/>
        {/* Right post */}
        <rect x="63" y="14" width="7" height="46" rx="2.5" fill={`url(#${g('gpw')})`}/>
        <rect x="63" y="14" width="2.2" height="46" rx="1" fill="rgba(255,255,255,0.26)"/>
        <rect x="68" y="14" width="2"   height="46" rx="1" fill="rgba(0,0,0,0.24)"/>
        {/* Post top caps */}
        <ellipse cx="5.5"  cy="14" rx="4"   ry="2.4" fill="#e4cb90"/>
        <ellipse cx="36.5" cy="14" rx="4"   ry="2.4" fill="#e4cb90"/>
        <ellipse cx="66.5" cy="14" rx="4"   ry="2.4" fill="#e4cb90"/>

        {/* ── Rails — 2 per span, top-lit ── */}
        {/* Left span – top rail */}
        <rect x="9"  y="21" width="24" height="5.5" rx="2" fill={`url(#${g('gpr')})`}/>
        <rect x="9"  y="21" width="24" height="2"   rx="1" fill="rgba(255,255,255,0.30)"/>
        {/* Left span – bottom rail */}
        <rect x="9"  y="42" width="24" height="5.5" rx="2" fill={`url(#${g('gpr')})`}/>
        <rect x="9"  y="42" width="24" height="2"   rx="1" fill="rgba(255,255,255,0.22)"/>
        {/* Right span – top rail */}
        <rect x="40" y="21" width="23" height="5.5" rx="2" fill={`url(#${g('gpr')})`}/>
        <rect x="40" y="21" width="23" height="2"   rx="1" fill="rgba(255,255,255,0.30)"/>
        {/* Right span – bottom rail */}
        <rect x="40" y="42" width="23" height="5.5" rx="2" fill={`url(#${g('gpr')})`}/>
        <rect x="40" y="42" width="23" height="2"   rx="1" fill="rgba(255,255,255,0.22)"/>
        {/* Post ground shadows */}
        <ellipse cx="5.5"  cy="60" rx="4"   ry="1.8" fill="rgba(0,0,0,0.18)"/>
        <ellipse cx="36.5" cy="60" rx="4"   ry="1.8" fill="rgba(0,0,0,0.18)"/>
        <ellipse cx="66.5" cy="60" rx="4"   ry="1.8" fill="rgba(0,0,0,0.18)"/>
      </svg>
    );

    /* ── WEEDS (overgrown grass clump — clearable) ─────────────────────── */
    case 'WEEDS': {
      // 3 deterministic color variants per tile
      const wv = (tx * 5 + ty * 11) % 3;
      const [ws1, ws2, ws3, ws4, wseed] = ([
        ['#327016','#4e8e20','#6aa828','#92b830','#b89830'],  // dark green
        ['#4a7810','#669a18','#88b424','#aabe2c','#c8a828'],  // olive-yellow
        ['#266010','#3e7e1c','#5a9a24','#7aae2c','#a89030'],  // cool green
      ] as const)[wv];
      return (
        <svg viewBox="0 0 52 46" width="50" height="44" style={{ display:'block' }}>
          {/* Ground shadow */}
          <ellipse cx="26" cy="45" rx="21" ry="4" fill="rgba(0,0,0,0.22)"/>
          {/* Base vine / sprawl */}
          <path d="M4,41 Q14,38 26,39 Q38,40 49,38" stroke="#3a5a0e" strokeWidth="1.8" fill="none" strokeLinecap="round" opacity="0.60"/>
          <path d="M2,39 Q11,36 20,38 Q30,40 38,37 Q44,35 51,37" stroke="#4a700a" strokeWidth="1.4" fill="none" strokeLinecap="round" opacity="0.45"/>

          {/* ── BACK ROW — tallest blades ── */}
          <path d="M9,43  Q7,31  6,19  Q5,11  8,2"   stroke={ws1} strokeWidth="2.8" fill="none" strokeLinecap="round"/>
          <path d="M18,43 Q16,31 14,20 Q12,11 14,3"  stroke={ws3} strokeWidth="2.6" fill="none" strokeLinecap="round"/>
          <path d="M26,43 Q25,30 24,18 Q23,10 26,2"  stroke={ws1} strokeWidth="2.8" fill="none" strokeLinecap="round"/>
          <path d="M35,43 Q37,30 39,19 Q40,10 38,2"  stroke={ws3} strokeWidth="2.6" fill="none" strokeLinecap="round"/>
          <path d="M44,43 Q46,31 47,19 Q48,11 46,3"  stroke={ws1} strokeWidth="2.8" fill="none" strokeLinecap="round"/>

          {/* ── MID ROW — angled blades ── */}
          <path d="M7,43  Q9,31  13,19 Q16,10 13,2"  stroke={ws2} strokeWidth="2.5" fill="none" strokeLinecap="round"/>
          <path d="M22,43 Q21,31 20,21 Q19,12 21,3"  stroke={ws4} strokeWidth="2.4" fill="none" strokeLinecap="round"/>
          <path d="M31,43 Q32,31 33,21 Q34,12 32,3"  stroke={ws2} strokeWidth="2.4" fill="none" strokeLinecap="round"/>
          <path d="M46,43 Q44,31 43,21 Q42,12 44,3"  stroke={ws4} strokeWidth="2.5" fill="none" strokeLinecap="round"/>

          {/* ── FRONT ROW — leaning outward ── */}
          <path d="M14,44 Q10,33  7,22  Q5,13  8,5"  stroke={ws2} strokeWidth="2.7" fill="none" strokeLinecap="round"/>
          <path d="M38,44 Q42,33 45,22 Q47,13 45,5"  stroke={ws2} strokeWidth="2.7" fill="none" strokeLinecap="round"/>

          {/* ── YELLOWED / dried blades (overgrown look) ── */}
          <path d="M21,44 Q23,33 24,22 Q25,13 22,4"  stroke="#98ac28" strokeWidth="2.2" fill="none" strokeLinecap="round" opacity="0.80"/>
          <path d="M31,44 Q29,33 28,22 Q27,13 30,4"  stroke="#a4b020" strokeWidth="2.0" fill="none" strokeLinecap="round" opacity="0.75"/>

          {/* ── Seed heads on tallest blades ── */}
          <ellipse cx="8"  cy="1.5" rx="2.0" ry="3.6" fill={wseed} opacity="0.90"/>
          <ellipse cx="14" cy="2.5" rx="1.6" ry="2.8" fill={wseed} opacity="0.80"/>
          <ellipse cx="26" cy="1.5" rx="2.2" ry="4.0" fill={wseed} opacity="0.88"/>
          <ellipse cx="38" cy="2.5" rx="1.6" ry="2.8" fill={wseed} opacity="0.80"/>
          <ellipse cx="46" cy="1.5" rx="2.0" ry="3.6" fill={wseed} opacity="0.88"/>

          {/* ── Small weed flowers ── */}
          <circle cx="17" cy="9"  r="2.4" fill="#dcd030" opacity="0.72"/>
          <circle cx="35" cy="8"  r="2.1" fill="#e4d828" opacity="0.68"/>

          {/* ── Subtle blade edge highlights ── */}
          <path d="M9,43  Q7,31 6,19"  stroke="rgba(255,255,255,0.18)" strokeWidth="1.1" fill="none" strokeLinecap="round"/>
          <path d="M44,43 Q46,31 47,19" stroke="rgba(255,255,255,0.16)" strokeWidth="1.1" fill="none" strokeLinecap="round"/>
        </svg>
      );
    }

    default: return null;
  }
};

/** Objects that use SVG art instead of emoji */
const SVG_OBJECTS = new Set(['TREE_PALM', 'TREE_APPLE', 'ROCK', 'FLOWER_BUSH', 'DRIFTWOOD',
  'TREE_COCONUT', 'TREE_MANGO', 'GARDEN_PATCH', 'WEEDS']);
/** Objects that sway in the breeze */
const SWAY_OBJECTS = new Set(['TREE_PALM', 'TREE_APPLE', 'TREE_COCONUT', 'TREE_MANGO']);

/* ── Shore scatter helper ────────────────────────────────────────────────
   Deterministic per-tile RNG — no Math.random(), stable across renders.    */
function tileRng(tx: number, ty: number, n: number): number {
  let h = ((tx * 374761393) ^ (ty * 668265263) ^ (n * 2246822519)) | 0;
  h ^= h >>> 13;
  h  = Math.imul(h, 1540483477);
  h ^= h >>> 15;
  return ((h >>> 0) % 10000) / 10000;
}

/**
 * Returns SVG <ellipse> elements scattered near each shore edge of a water tile.
 * Diamond vertices: top=(40,-1) right=(81,14) bottom=(40,29) left=(-1,14)
 * Isometric direction mapping:
 *   nbN = tile(x-1,y) → upper-left edge  → scatter near (14, 7)
 *   nbE = tile(x,y-1) → upper-right edge → scatter near (66, 7)
 *   nbS = tile(x+1,y) → lower-right edge → scatter near (66, 21)
 *   nbW = tile(x,y+1) → lower-left edge  → scatter near (14, 21)
 */
function shoreScatter(
  tx: number, ty: number,
  nN: boolean, nE: boolean, nS: boolean, nW: boolean,
): React.ReactNode[] {
  const out: React.ReactNode[] = [];
  const edges = [
    { active: nN, bcx: 14, bcy:  7  },
    { active: nE, bcx: 66, bcy:  7  },
    { active: nS, bcx: 66, bcy: 21  },
    { active: nW, bcx: 14, bcy: 21  },
  ];

  edges.forEach(({ active, bcx, bcy }, ei) => {
    if (!active) return;
    const count = 3 + Math.floor(tileRng(tx, ty, ei * 7) * 3); // 3–5 blobs
    for (let i = 0; i < count; i++) {
      const base = ei * 100 + i;
      const ox   = (tileRng(tx, ty, base + 11) - 0.5) * 16;
      const oy   = (tileRng(tx, ty, base + 17) - 0.5) *  9;
      const cx   = bcx + ox;
      const cy   = bcy + oy;
      // skip blobs too close to the diamond border
      if (cx < 4 || cx > 76 || cy < 1 || cy > 28) continue;
      const rx   = 2.2 + tileRng(tx, ty, base + 23) * 3.2;
      const ry   = (1.0 + tileRng(tx, ty, base + 29) * 1.6) * 0.65;
      const rot  = (tileRng(tx, ty, base + 37) - 0.5) * 60;
      const op   = 0.28 + tileRng(tx, ty, base + 41) * 0.28;
      // colours range from pale sand (#dfc87a) to warm tan (#c8aa60)
      const sand = tileRng(tx, ty, base + 53) > 0.5 ? '#d4bc78' : '#c4a85c';
      out.push(
        <ellipse
          key={`sh-${ei}-${i}`}
          cx={cx} cy={cy} rx={rx} ry={ry}
          fill={sand} opacity={op}
          transform={`rotate(${rot.toFixed(1)} ${cx.toFixed(1)} ${cy.toFixed(1)})`}
        />
      );
    }
  });
  return out;
}

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
  /** Tile types of the 4 cardinal neighbours (undefined = outside map = water) */
  nbN?: string; nbE?: string; nbS?: string; nbW?: string;
}

/* ── IslandTile ─────────────────────────────────────────────────────────── */
export const IslandTile: React.FC<IslandTileProps> = ({
  tile, screenX, screenY, tileZIndex, isDangerZone, onTileClick,
  nbN, nbE, nbS, nbW,
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

  // Shore detection — a water tile is "near shore" if any cardinal neighbour is land
  const isLand = (t?: string) => t === 'SAND' || t === 'GRASS';
  const shN = isWater && isLand(nbN);
  const shE = isWater && isLand(nbE);
  const shS = isWater && isLand(nbS);
  const shW = isWater && isLand(nbW);
  const isShore = shN || shE || shS || shW;
  // Shallow water is 1–2 tiles from land — check 2nd-order neighbours too (approximated by
  // checking whether any neighbour is itself shore-adjacent, which we can't easily do here,
  // so we simply extend to tiles that share a diagonal land neighbour via type check)
  const isShallow = isShore; // used for colour shift

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
            // GRASS — bright lime-green matching reference image
            hi = [0xa8, 0xe4, 0x22]; lo = [0x6c, 0xb4, 0x0c];
            sL = '#52a00c'; sR = '#60b010';
          }

          const isGrass = !isCleared && tile.type === 'GRASS';
          const isSand  = !isCleared && tile.type === 'SAND';
          const gpid = `gp-${tile.x}-${tile.y}`;
          const spid = `sp-${tile.x}-${tile.y}`;
          return (
            <defs>
              {/* Top face gradient.
                  Sand: consistent LINEAR direction across every tile so adjacent tiles
                  share the same gradient direction — no per-tile bright spots, no gridlines.
                  Everything else: radial lit from upper-left as before. */}
              {isSand ? (
                <linearGradient id={gid} x1="20%" y1="0%" x2="80%" y2="100%">
                  <stop offset="0%"   stopColor="#f2dca6"/>
                  <stop offset="100%" stopColor="#dcc480"/>
                </linearGradient>
              ) : (
                <radialGradient id={gid} cx="30%" cy="22%" r="84%">
                  <stop offset="0%"   stopColor={shift(hi, v + 20)} />
                  <stop offset="55%"  stopColor={shift(hi, v)} />
                  <stop offset="100%" stopColor={shift(lo, -v)} />
                </radialGradient>
              )}
              {/* Sand stipple + ripple texture */}
              {isSand && (
                <pattern id={spid} x="0" y="0" width="16" height="11" patternUnits="userSpaceOnUse">
                  {/* grain dots — irregular scatter */}
                  <circle cx="2"  cy="3"   r="0.9" fill="rgba(155,110,50,0.26)"/>
                  <circle cx="7"  cy="8"   r="0.8" fill="rgba(170,130,60,0.20)"/>
                  <circle cx="12" cy="2"   r="0.9" fill="rgba(150,105,45,0.24)"/>
                  <circle cx="5"  cy="10"  r="0.7" fill="rgba(165,125,58,0.18)"/>
                  <circle cx="14" cy="7"   r="0.8" fill="rgba(155,110,50,0.20)"/>
                  <circle cx="9"  cy="4.5" r="0.7" fill="rgba(145,100,42,0.22)"/>
                  <circle cx="3"  cy="7"   r="0.8" fill="rgba(175,135,65,0.16)"/>
                  <circle cx="11" cy="9.5" r="0.7" fill="rgba(160,120,55,0.18)"/>
                  {/* subtle wind-ripple lines */}
                  <path d="M0,9 Q4,7.5 8,9 Q12,10.5 16,9"
                        stroke="rgba(145,100,42,0.13)" strokeWidth="0.7" fill="none"/>
                  <path d="M0,4.5 Q4,3 8,4.5 Q12,6 16,4.5"
                        stroke="rgba(145,100,42,0.09)" strokeWidth="0.6" fill="none"/>
                </pattern>
              )}
              {/* Grass blade texture pattern */}
              {isGrass && (
                <pattern id={gpid} x="0" y="0" width="10" height="8" patternUnits="userSpaceOnUse">
                  <line x1="1.5" y1="7.5" x2="3"   y2="4.5" stroke="#4a9010" strokeWidth="1.1" opacity="0.50"/>
                  <line x1="5.5" y1="7"   x2="7"   y2="3.8" stroke="#4a9010" strokeWidth="1"   opacity="0.42"/>
                  <line x1="8.5" y1="7.5" x2="9.5" y2="5"   stroke="#5aaa14" strokeWidth="0.9" opacity="0.32"/>
                  <line x1="3.5" y1="7.8" x2="4.5" y2="5.5" stroke="#3a7a08" strokeWidth="0.8" opacity="0.28"/>
                </pattern>
              )}
            </defs>
          );
        })()}

        {/* Top face — expanded 1 px beyond nominal edges to seal sub-pixel seams */}
        <polygon
          points="40,-1 81,14 40,29 -1,14"
          fill={isWater
            ? (isShallow ? '#28bce0' : '#1fa8e8')
            : hovered ? topFill : `url(#lg-${tile.x}-${tile.y})`}
          stroke="none"
        />

        {/* ── Shore scatter: sandy blobs on water tiles adjacent to land ── */}
        {isShore && shoreScatter(tile.x, tile.y, shN, shE, shS, shW)}

        {/* ── Wet-sand tint: sand tiles adjacent to water get a subtle blue wash ── */}
        {!isWater && tile.type === 'SAND' && (isLand(nbN) === false || isLand(nbE) === false || isLand(nbS) === false || isLand(nbW) === false) && (() => {
          const hasWaterNb = nbN === 'WATER' || nbE === 'WATER' || nbS === 'WATER' || nbW === 'WATER';
          if (!hasWaterNb) return null;
          return (
            <polygon
              points="40,-1 81,14 40,29 -1,14"
              fill="rgba(28,152,210,0.12)"
            />
          );
        })()}

        {/* ── Sand stipple texture overlay ── */}
        {!isWater && !isCleared && tile.type === 'SAND' && (
          <polygon
            points="40,-1 81,14 40,29 -1,14"
            fill={`url(#sp-${tile.x}-${tile.y})`}
          />
        )}

        {/* ── Grass blade texture overlay ── */}
        {!isWater && !isCleared && tile.type === 'GRASS' && (
          <polygon
            points="40,-1 81,14 40,29 -1,14"
            fill={`url(#gp-${tile.x}-${tile.y})`}
          />
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

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
            <stop offset="0%"   stopColor="#d09840"/>
            <stop offset="42%"  stopColor="#9a6828"/>
            <stop offset="100%" stopColor="#6a4818"/>
          </linearGradient>
          <radialGradient id={g('plc')} cx="36%" cy="30%" r="72%">
            <stop offset="0%"   stopColor="#88e85a"/>
            <stop offset="52%"  stopColor="#44aa2e"/>
            <stop offset="100%" stopColor="#1e6a10"/>
          </radialGradient>
        </defs>
        {/* Ground shadow */}
        <ellipse cx="30" cy="90" rx="13" ry="4" fill="rgba(0,0,0,0.26)"/>
        {/* Trunk shadow side */}
        <path d="M31.5,88 Q33,70 34,50 L35.5,50 Q37,70 36.5,88Z" fill="#5a3410" opacity="0.45"/>
        {/* Trunk */}
        <path d="M26,88 Q27.5,70 29,50 L31,50 Q33,70 34,88Z" fill={`url(#${g('plt')})`}/>
        {/* Trunk highlight stripe */}
        <path d="M27.5,86 Q28.8,68 29.5,52" stroke="rgba(255,255,255,0.28)" strokeWidth="1.6" fill="none" strokeLinecap="round"/>
        {/* Trunk rings */}
        {[58,67,76].map(y => <ellipse key={y} cx="30" cy={y} rx="2.6" ry="1.3" fill="rgba(0,0,0,0.28)"/>)}
        {/* Back drooping fronds */}
        <path d="M30,48 Q10,56 2,62"  stroke="#1a6010" strokeWidth="10" fill="none" strokeLinecap="round" opacity="0.82"/>
        <path d="M30,48 Q50,56 58,62" stroke="#1a6010" strokeWidth="10" fill="none" strokeLinecap="round" opacity="0.82"/>
        {/* Mid fronds */}
        <path d="M30,46 Q8,40 2,28"   stroke="#286e18" strokeWidth="9.5" fill="none" strokeLinecap="round"/>
        <path d="M30,46 Q52,40 58,28" stroke="#286e18" strokeWidth="9.5" fill="none" strokeLinecap="round"/>
        {/* Upper fronds */}
        <path d="M30,44 Q16,28 10,12"  stroke="#349020" strokeWidth="9" fill="none" strokeLinecap="round"/>
        <path d="M30,44 Q44,28 50,12"  stroke="#349020" strokeWidth="9" fill="none" strokeLinecap="round"/>
        {/* Top frond */}
        <path d="M30,42 Q30,22 29,4"   stroke="#42aa28" strokeWidth="8.5" fill="none" strokeLinecap="round"/>
        {/* Frond tip highlights */}
        <path d="M30,48 Q10,56 2,62"  stroke="#60cc44" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.55"/>
        <path d="M30,48 Q50,56 58,62" stroke="#60cc44" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.55"/>
        <path d="M30,44 Q16,28 10,12"  stroke="#60cc44" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.55"/>
        <path d="M30,44 Q44,28 50,12"  stroke="#60cc44" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.55"/>
        {/* Crown base */}
        <circle cx="30" cy="46" r="12" fill="#1a6010"/>
        <circle cx="30" cy="44" r="9"  fill={`url(#${g('plc')})`}/>
        {/* Specular */}
        <ellipse cx="25" cy="39" rx="5.5" ry="3.5" fill="rgba(255,255,255,0.34)" transform="rotate(-15 25 39)"/>
        {/* Coconuts */}
        <circle cx="23" cy="50" r="4.2" fill="#7a4418"/>
        <circle cx="37" cy="51" r="3.8" fill="#6a3c12"/>
        <circle cx="30" cy="53" r="3.5" fill="#723e16"/>
        <circle cx="21.5" cy="48.5" r="1.5" fill="rgba(255,255,255,0.32)"/>
        <circle cx="35.5" cy="49.5" r="1.3" fill="rgba(255,255,255,0.30)"/>
      </svg>
    );

    /* ── APPLE TREE ─────────────────────────────────────────────────────── */
    case 'TREE_APPLE': return (
      <svg viewBox="0 0 62 90" width="60" height="86" style={{ display:'block' }}>
        <defs>
          <linearGradient id={g('apt')} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"   stopColor="#c07a3a"/>
            <stop offset="44%"  stopColor="#8a5228"/>
            <stop offset="100%" stopColor="#5c3818"/>
          </linearGradient>
          <radialGradient id={g('apc')} cx="35%" cy="28%" r="70%">
            <stop offset="0%"   stopColor="#7ae058"/>
            <stop offset="52%"  stopColor="#3aa82e"/>
            <stop offset="100%" stopColor="#1e6418"/>
          </radialGradient>
          <radialGradient id={g('apr')} cx="36%" cy="30%" r="66%">
            <stop offset="0%"   stopColor="#ff7060"/>
            <stop offset="52%"  stopColor="#e02818"/>
            <stop offset="100%" stopColor="#a81408"/>
          </radialGradient>
        </defs>
        {/* Ground shadow */}
        <ellipse cx="31" cy="88" rx="15" ry="4.5" fill="rgba(0,0,0,0.25)"/>
        {/* Trunk */}
        <path d="M26.5,86 Q28.5,68 29.5,50 L31.5,50 Q32.5,68 34.5,86Z" fill={`url(#${g('apt')})`}/>
        <path d="M27.5,84 Q29.5,66 30,52" stroke="rgba(255,255,255,0.23)" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
        {/* Deep canopy shadow */}
        <ellipse cx="31" cy="38" rx="27" ry="21" fill="#164c0e" opacity="0.60"/>
        {/* Main canopy */}
        <ellipse cx="31" cy="32" rx="27" ry="22" fill={`url(#${g('apc')})`}/>
        {/* Side bumps */}
        <ellipse cx="12" cy="37" rx="16" ry="12" fill="#288018"/>
        <ellipse cx="50" cy="37" rx="16" ry="12" fill="#309424"/>
        {/* Upper dome */}
        <ellipse cx="31" cy="20" rx="18" ry="14" fill="#46aa2c"/>
        {/* Canopy specular */}
        <ellipse cx="20" cy="20" rx="11" ry="6.5" fill="rgba(255,255,255,0.28)" transform="rotate(-13 20 20)"/>
        {/* Apples */}
        <circle cx="17" cy="37" r="5.8" fill={`url(#${g('apr')})`}/>
        <circle cx="39" cy="35" r="5.8" fill={`url(#${g('apr')})`}/>
        <circle cx="28" cy="43" r="5.2" fill={`url(#${g('apr')})`}/>
        {/* Apple shine */}
        <circle cx="15.2" cy="34.5" r="2.2" fill="rgba(255,255,255,0.56)"/>
        <circle cx="37.2" cy="32.5" r="2.2" fill="rgba(255,255,255,0.56)"/>
        <circle cx="26.2" cy="40.5" r="2"   fill="rgba(255,255,255,0.56)"/>
        {/* Stems */}
        <line x1="17" y1="31.2" x2="18" y2="28"   stroke="#2c6010" strokeWidth="1.3"/>
        <line x1="39" y1="29.2" x2="40" y2="26"   stroke="#2c6010" strokeWidth="1.3"/>
        <line x1="28" y1="37.8" x2="29" y2="34.5" stroke="#2c6010" strokeWidth="1.3"/>
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
            <stop offset="0%"   stopColor="#d09040"/>
            <stop offset="44%"  stopColor="#9a6828"/>
            <stop offset="100%" stopColor="#6a4818"/>
          </linearGradient>
          <radialGradient id={g('coc')} cx="36%" cy="28%" r="70%">
            <stop offset="0%"   stopColor="#72d848"/>
            <stop offset="54%"  stopColor="#2c8e18"/>
            <stop offset="100%" stopColor="#146010"/>
          </radialGradient>
        </defs>
        {/* Ground shadow */}
        <ellipse cx="35" cy="106" rx="12" ry="4" fill="rgba(0,0,0,0.26)"/>
        {/* Trunk shadow side */}
        <path d="M33,102 Q34,80 35,58 L37.5,58 Q40,80 39,102Z" fill="#5a3410" opacity="0.45"/>
        {/* Trunk */}
        <path d="M30,102 Q31.5,80 33,58 L35,58 Q37,80 38,102Z" fill={`url(#${g('cot')})`}/>
        {/* Trunk highlight */}
        <path d="M31.5,100 Q33,78 33.8,60" stroke="rgba(255,255,255,0.27)" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
        {/* Trunk rings */}
        {[66,74,82,90,98].map(y => <ellipse key={y} cx="34" cy={y} rx="3.2" ry="1.5" fill="rgba(0,0,0,0.26)"/>)}
        {/* Back drooping fronds */}
        <path d="M34,56 Q14,62 4,68"  stroke="#1a6010" strokeWidth="11.5" fill="none" strokeLinecap="round" opacity="0.82"/>
        <path d="M34,56 Q54,62 66,68" stroke="#1a6010" strokeWidth="11.5" fill="none" strokeLinecap="round" opacity="0.82"/>
        {/* Mid fronds */}
        <path d="M34,54 Q12,48 4,36"   stroke="#228418" strokeWidth="11" fill="none" strokeLinecap="round"/>
        <path d="M34,54 Q56,48 66,36"  stroke="#228418" strokeWidth="11" fill="none" strokeLinecap="round"/>
        {/* Upper fronds */}
        <path d="M34,52 Q16,38 10,20"  stroke="#2c9e20" strokeWidth="10.5" fill="none" strokeLinecap="round"/>
        <path d="M34,52 Q52,38 60,20"  stroke="#2c9e20" strokeWidth="10.5" fill="none" strokeLinecap="round"/>
        {/* Top fronds */}
        <path d="M34,50 Q24,30 20,10"  stroke="#38b02a" strokeWidth="9.5" fill="none" strokeLinecap="round"/>
        <path d="M34,50 Q44,30 50,10"  stroke="#38b02a" strokeWidth="9.5" fill="none" strokeLinecap="round"/>
        <path d="M34,48 Q34,28 33,8"   stroke="#46c234" strokeWidth="9"   fill="none" strokeLinecap="round"/>
        {/* Frond tip highlights */}
        <path d="M34,56 Q14,62 4,68"  stroke="#62d840" strokeWidth="3.5" fill="none" strokeLinecap="round" opacity="0.52"/>
        <path d="M34,56 Q54,62 66,68" stroke="#62d840" strokeWidth="3.5" fill="none" strokeLinecap="round" opacity="0.52"/>
        <path d="M34,52 Q16,38 10,20"  stroke="#62d840" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.52"/>
        <path d="M34,52 Q52,38 60,20"  stroke="#62d840" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.52"/>
        {/* Crown */}
        <circle cx="34" cy="54" r="13" fill="#1a6010"/>
        <circle cx="34" cy="52" r="10" fill={`url(#${g('coc')})`}/>
        {/* Specular */}
        <ellipse cx="28" cy="45" rx="6.5" ry="3.8" fill="rgba(255,255,255,0.35)" transform="rotate(-18 28 45)"/>
        {/* Coconuts */}
        <circle cx="27" cy="58" r="5.2" fill="#7a4418"/>
        <circle cx="39" cy="59" r="4.8" fill="#6a3c12"/>
        <circle cx="34" cy="62" r="4.4" fill="#723e14"/>
        <circle cx="25.5" cy="56.5" r="1.8" fill="rgba(255,255,255,0.30)"/>
        <circle cx="37.5" cy="57.5" r="1.6" fill="rgba(255,255,255,0.28)"/>
      </svg>
    );

    /* ── MANGO TREE ─────────────────────────────────────────────────────── */
    case 'TREE_MANGO': return (
      <svg viewBox="0 0 74 92" width="68" height="85" style={{ display:'block' }}>
        <defs>
          <linearGradient id={g('mgt')} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"   stopColor="#c07030"/>
            <stop offset="44%"  stopColor="#8a4e20"/>
            <stop offset="100%" stopColor="#5c3210"/>
          </linearGradient>
          <radialGradient id={g('mgc')} cx="34%" cy="27%" r="72%">
            <stop offset="0%"   stopColor="#72d440"/>
            <stop offset="52%"  stopColor="#2e8a14"/>
            <stop offset="100%" stopColor="#145c08"/>
          </radialGradient>
          <radialGradient id={g('mgm')} cx="38%" cy="28%" r="68%">
            <stop offset="0%"   stopColor="#ffd040"/>
            <stop offset="55%"  stopColor="#e09010"/>
            <stop offset="100%" stopColor="#a85c08"/>
          </radialGradient>
        </defs>
        {/* Ground shadow */}
        <ellipse cx="37" cy="90" rx="18" ry="5.5" fill="rgba(0,0,0,0.25)"/>
        {/* Trunk */}
        <path d="M32,88 Q34,70 35,54 L37,54 Q38,70 40,88Z" fill={`url(#${g('mgt')})`}/>
        <path d="M33.5,86 Q35.5,68 35.5,56" stroke="rgba(255,255,255,0.22)" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
        <path d="M33,63 Q37,61 41,63" stroke="#3a2008" strokeWidth="1.3" fill="none" opacity="0.38"/>
        <path d="M33,72 Q37,70 41,72" stroke="#3a2008" strokeWidth="1.3" fill="none" opacity="0.38"/>
        {/* Canopy depth — back layers */}
        <ellipse cx="37" cy="44" rx="34" ry="27" fill="#0e4808" opacity="0.65"/>
        <ellipse cx="15" cy="50" rx="17" ry="14" fill="#165e0e"/>
        <ellipse cx="59" cy="50" rx="17" ry="14" fill="#1a6812"/>
        {/* Mid canopy */}
        <ellipse cx="37" cy="36" rx="30" ry="24" fill="#226014"/>
        <ellipse cx="16" cy="42" rx="17" ry="14" fill="#287018"/>
        <ellipse cx="58" cy="42" rx="17" ry="14" fill="#2c7a1c"/>
        {/* Upper canopy with radial gradient */}
        <ellipse cx="37" cy="28" rx="26" ry="21" fill={`url(#${g('mgc')})`}/>
        <ellipse cx="20" cy="34" rx="15" ry="12" fill="#3a8c24"/>
        <ellipse cx="54" cy="34" rx="15" ry="12" fill="#3e9428"/>
        {/* Top dome */}
        <ellipse cx="37" cy="18" rx="19" ry="16" fill="#4aaa2e"/>
        {/* Canopy specular */}
        <ellipse cx="24" cy="16" rx="12" ry="7"   fill="rgba(255,255,255,0.27)" transform="rotate(-14 24 16)"/>
        {/* Mangoes */}
        <ellipse cx="16" cy="50" rx="7" ry="9.5"  fill={`url(#${g('mgm')})`} transform="rotate(-20 16 50)"/>
        <ellipse cx="35" cy="54" rx="7" ry="9.5"  fill={`url(#${g('mgm')})`} transform="rotate(10 35 54)"/>
        <ellipse cx="54" cy="50" rx="7" ry="9.5"  fill={`url(#${g('mgm')})`} transform="rotate(20 54 50)"/>
        <ellipse cx="24" cy="44" rx="6" ry="8"    fill={`url(#${g('mgm')})`} transform="rotate(-12 24 44)"/>
        <ellipse cx="50" cy="44" rx="6" ry="8"    fill={`url(#${g('mgm')})`} transform="rotate(14 50 44)"/>
        {/* Mango shine */}
        <ellipse cx="13.5" cy="47" rx="2.8" ry="3.8" fill="rgba(255,255,255,0.46)" transform="rotate(-20 13.5 47)"/>
        <ellipse cx="32.5" cy="51" rx="2.8" ry="3.8" fill="rgba(255,255,255,0.46)" transform="rotate(10 32.5 51)"/>
        <ellipse cx="51.5" cy="47" rx="2.8" ry="3.8" fill="rgba(255,255,255,0.43)" transform="rotate(20 51.5 47)"/>
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
  const doSway = hasSvg && tile.object && SWAY_OBJECTS.has(tile.object);

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
          const gid = isWater ? `wg-${tile.x}-${tile.y}` : `lg-${tile.x}-${tile.y}`;
          const cid = `wc-${tile.x}-${tile.y}`;

          if (isWater) {
            return (
              <defs>
                <linearGradient id={gid} x1="10%" y1="0%" x2="90%" y2="100%">
                  <stop offset="0%"   stopColor="#b8eeff" />
                  <stop offset="38%"  stopColor="#52C8E4" />
                  <stop offset="100%" stopColor="#1e8ab0" />
                </linearGradient>
                <clipPath id={cid}>
                  <polygon points="40,0 80,14 40,28 0,14" />
                </clipPath>
              </defs>
            );
          }

          // Slight per-tile brightness nudge: deterministic, no random
          const v = ((tile.x * 11 + tile.y * 7) % 5) - 2; // -2 … +2

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
              {/* Side face gradients — lighter at top ridge, darker at base */}
              <linearGradient id={`sl-${tile.x}-${tile.y}`} x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%"   stopColor={lightenHex(sL, 10)} />
                <stop offset="100%" stopColor={darkenHex(sL, 14)} />
              </linearGradient>
              <linearGradient id={`sr-${tile.x}-${tile.y}`} x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%"   stopColor={lightenHex(sR, 6)} />
                <stop offset="100%" stopColor={darkenHex(sR, 14)} />
              </linearGradient>
            </defs>
          );
        })()}

        {/* Top face */}
        <polygon
          points="40,0 80,14 40,28 0,14"
          fill={isWater
            ? `url(#wg-${tile.x}-${tile.y})`
            : hovered ? topFill : `url(#lg-${tile.x}-${tile.y})`}
          stroke="none"
        />

        {/* Side faces (land tiles only) — gradient for depth */}
        {!isWater && palette.sideL && (
          <>
            <polygon points="0,14 40,28 40,38 0,24"  fill={`url(#sl-${tile.x}-${tile.y})`} />
            <polygon points="80,14 40,28 40,38 80,24" fill={`url(#sr-${tile.x}-${tile.y})`} />
          </>
        )}

        {/* Top ridge highlight — bright edge where light hits the tile crest */}
        {!isWater && (
          <polyline points="2,14 40,1 78,14" fill="none" stroke="rgba(255,255,255,0.42)" strokeWidth="0.9" strokeLinecap="round"/>
        )}
        {/* Water surface edge glint */}
        {isWater && (
          <polyline points="2,14 40,1 78,14" fill="none" stroke="rgba(255,255,255,0.22)" strokeWidth="0.8" strokeLinecap="round"/>
        )}

        {/* Water: painted wave strokes + shimmer */}
        {isWater && (() => {
          const cid   = `wc-${tile.x}-${tile.y}`;
          const phase = (tile.x * 5 + tile.y * 3) % 8;
          const y1    = 7  + phase * 0.4;
          const y2    = 18 + phase * 0.25;
          const cls1  = (tile.x + tile.y) % 2 === 0 ? 'water-wave-a' : 'water-wave-b';
          const cls2  = (tile.x + tile.y) % 2 === 0 ? 'water-wave-b' : 'water-wave-a';
          return (
            <g clipPath={`url(#${cid})`}>
              {/* Upper wave stroke */}
              <path
                d={`M -5,${y1} Q 20,${y1 - 2.5} 40,${y1} Q 60,${y1 + 2.5} 85,${y1}`}
                fill="none" stroke="rgba(255,255,255,0.28)" strokeWidth="1.6"
                strokeLinecap="round" className={cls1}
              />
              {/* Lower wave stroke */}
              <path
                d={`M -5,${y2} Q 20,${y2 + 2} 40,${y2} Q 60,${y2 - 2} 85,${y2}`}
                fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="1.2"
                strokeLinecap="round" className={cls2}
              />
              {/* Subtle centre highlight band — replicates the lighter area in the reference */}
              <ellipse cx="40" cy="13" rx="18" ry="6"
                fill="rgba(180,238,255,0.18)" className="water-glint" />
            </g>
          );
        })()}

        {/* Danger zone red pulse */}
        {isDangerZone && (
          <polygon
            points="40,0 80,14 40,28 0,14"
            fill="rgba(239,68,68,0.28)"
            className="iso-danger-pulse"
          />
        )}

        {/* Wilted crop brown overlay */}
        {tile.object === 'CROP_WILTED' && (
          <polygon
            points="40,0 80,14 40,28 0,14"
            fill="rgba(139,90,43,0.55)"
          />
        )}
      </svg>

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

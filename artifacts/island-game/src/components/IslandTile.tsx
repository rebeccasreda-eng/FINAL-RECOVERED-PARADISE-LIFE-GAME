import React, { useState, useEffect } from 'react';
import { useGame } from '../game/GameContext';
import { TileData } from '../game/types';
import { OBJECT_CONFIG, EMOJI_MAP, CROP_TYPES } from '../game/gameData';
import { useToast } from '@/hooks/use-toast';

/* ── Diamond colour palette — matches HTML reference ────────────────────── */
const COLORS = {
  GRASS:   { top: '#5cb828', sideL: '#2e8008', sideR: '#3a9810' },
  SAND:    { top: '#f0e8cc', sideL: '#d4c49a', sideR: '#dccca4' },
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
const PETAL_COLORS  = ['#e03818', '#e8628a', '#f59420', '#f0e018', '#c040d0'] as const;
const PETAL_DARKS   = ['#981408', '#b03060', '#c06810', '#c8a400', '#8020a0'] as const;
const FLOWER_ANGS   = [0, 72, 144, 216, 288] as const;

const ObjectSVG: React.FC<{ object: string; tileX: number; tileY: number; tileType?: string }> = ({ object, tileX: tx, tileY: ty, tileType }) => {
  // Build a unique gradient-ID prefix per tile to avoid SVG id collisions
  const g = (s: string) => `${s}${tx}x${ty}`;

  switch (object) {

    /* ── PALM TREE ─────────────────────────────────────────────────────── */
    case 'TREE_PALM': return (
      <svg viewBox="0 0 60 92" width="78" height="118" style={{ display:'block' }}>
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
      <svg viewBox="0 0 62 90" width="81" height="116" style={{ display:'block' }}>
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
    case 'ROCK': {
      const rg1 = g('rg1'), rg2 = g('rg2'), rg3 = g('rg3');
      const rlv = (tx * 7 + ty * 13) % 3;
      // Colours anchored near grass-tile top (#5cb828) so blades read as
      // natural turf framing the rocks, not a separate darker biome
      const rGrassBase  = '#5cb828'; // ground-level tufts — dissolve into tile
      const rGrass      = '#3e8e14'; // back blades — slightly darker (receding)
      const rGrassMid   = '#50aa20'; // mid blades
      const rGrassFront = '#68c430'; // front blades — closest to viewer
      const rb = (cx: number, by: number, h: number, lean: number) =>
        `M ${cx},${by} Q ${cx + lean * 0.5},${by - h * 0.55} ${cx + lean},${by - h}`;
      return (
        <svg viewBox="0 0 72 60" width="68" height="56" style={{ display:'block' }}>
          <defs>
            <radialGradient id={rg1} cx="28%" cy="24%" r="76%">
              <stop offset="0%"   stopColor="#e4e4dc"/>
              <stop offset="48%"  stopColor="#a2a29a"/>
              <stop offset="100%" stopColor="#5e5e56"/>
            </radialGradient>
            <radialGradient id={rg2} cx="30%" cy="26%" r="72%">
              <stop offset="0%"   stopColor="#d8d8d0"/>
              <stop offset="50%"  stopColor="#989890"/>
              <stop offset="100%" stopColor="#585850"/>
            </radialGradient>
            <radialGradient id={rg3} cx="32%" cy="22%" r="70%">
              <stop offset="0%"   stopColor="#dcdcd4"/>
              <stop offset="50%"  stopColor="#9c9c94"/>
              <stop offset="100%" stopColor="#5c5c54"/>
            </radialGradient>
          </defs>

          {/* Very faint contact shadow — no harsh dark ring */}
          <ellipse cx="36" cy="58" rx="28" ry="3" fill="rgba(0,0,0,0.08)"/>

          {/* ── Back grass blades (behind rocks) ── */}
          <path d={rb(8,  54, 44, -3 + rlv)} stroke={rGrass} strokeWidth="3.2" fill="none" strokeLinecap="round"/>
          <path d={rb(16, 54, 48, -1 + rlv)} stroke={rGrass} strokeWidth="3.4" fill="none" strokeLinecap="round"/>
          <path d={rb(28, 54, 46,  0 + rlv)} stroke={rGrass} strokeWidth="3.6" fill="none" strokeLinecap="round"/>
          <path d={rb(52, 54, 42, -2 + rlv)} stroke={rGrass} strokeWidth="3.0" fill="none" strokeLinecap="round"/>
          <path d={rb(62, 54, 40,  2 + rlv)} stroke={rGrass} strokeWidth="2.8" fill="none" strokeLinecap="round"/>
          <path d={rb(70, 54, 36,  3 + rlv)} stroke={rGrass} strokeWidth="2.6" fill="none" strokeLinecap="round"/>

          {/* ── Back-right small rock ── */}
          <path d="M50,28 Q58,20 68,24 Q74,28 70,38 Q66,44 56,42 Q46,40 46,34 Q46,30 50,28Z" fill={`url(#${rg2})`}/>
          <ellipse cx="56" cy="24" rx="9" ry="3" fill="rgba(255,255,255,0.38)" transform="rotate(-12 56 24)"/>
          <path d="M60,28 Q62,34 61,40" stroke="rgba(0,0,0,0.09)" strokeWidth="1.2" fill="none"/>

          {/* ── Back-left medium rock ── */}
          <path d="M2,30 Q4,20 16,18 Q26,18 28,28 Q30,36 20,40 Q10,42 5,36 Q2,33 2,30Z" fill={`url(#${rg3})`}/>
          <ellipse cx="12" cy="21" rx="8" ry="3" fill="rgba(255,255,255,0.36)" transform="rotate(-10 12 21)"/>
          <path d="M14,26 Q16,32 15,38" stroke="rgba(0,0,0,0.09)" strokeWidth="1.2" fill="none"/>

          {/* ── Mid grass blades (between rocks) ── */}
          <path d={rb(36, 54, 32,  0)} stroke={rGrassMid} strokeWidth="3.0" fill="none" strokeLinecap="round"/>
          <path d={rb(44, 54, 28,  2)} stroke={rGrassMid} strokeWidth="2.6" fill="none" strokeLinecap="round"/>

          {/* ── Main centre boulder ── */}
          <path d="M8,46 Q6,34 14,26 Q22,18 36,16 Q50,14 58,22 Q66,28 64,40 Q60,50 44,54 Q26,58 16,54 Q9,50 8,46Z" fill={`url(#${rg1})`}/>
          <ellipse cx="22" cy="22" rx="14" ry="4.5" fill="rgba(255,255,255,0.44)" transform="rotate(-14 22 22)"/>
          <ellipse cx="12" cy="30" rx="5"  ry="2"   fill="rgba(255,255,255,0.22)" transform="rotate(-6 12 30)"/>
          <path d="M34,22 Q36,32 35,44" stroke="rgba(0,0,0,0.09)" strokeWidth="1.4" fill="none"/>
          {/* Moss patches — now match the grass palette */}
          <ellipse cx="46" cy="50" rx="8" ry="2.5" fill="#5cb828" opacity="0.32"/>
          <ellipse cx="18" cy="50" rx="5" ry="2"   fill="#50aa20" opacity="0.28"/>

          {/* ── Front grass blades (in front of rocks) ── */}
          <path d={rb(10, 54, 26, -3 + rlv)} stroke={rGrassFront} strokeWidth="2.8" fill="none" strokeLinecap="round"/>
          <path d={rb(20, 54, 24, -1 + rlv)} stroke={rGrassFront} strokeWidth="3.0" fill="none" strokeLinecap="round"/>
          <path d={rb(50, 54, 24,  1 + rlv)} stroke={rGrassFront} strokeWidth="2.8" fill="none" strokeLinecap="round"/>
          <path d={rb(60, 54, 22,  3 + rlv)} stroke={rGrassFront} strokeWidth="2.6" fill="none" strokeLinecap="round"/>

          {/* ── Ground tufts — grass-coloured, dissolve base into tile ── */}
          <path d={rb(4,  54,  9, -2)} stroke={rGrassBase} strokeWidth="2.8" fill="none" strokeLinecap="round" opacity="0.90"/>
          <path d={rb(13, 54, 10,  1)} stroke={rGrassBase} strokeWidth="3.0" fill="none" strokeLinecap="round" opacity="0.85"/>
          <path d={rb(32, 54,  8,  0)} stroke={rGrassBase} strokeWidth="2.6" fill="none" strokeLinecap="round" opacity="0.88"/>
          <path d={rb(42, 54,  9, -1)} stroke={rGrassBase} strokeWidth="2.8" fill="none" strokeLinecap="round" opacity="0.85"/>
          <path d={rb(55, 54,  8,  2)} stroke={rGrassBase} strokeWidth="2.6" fill="none" strokeLinecap="round" opacity="0.88"/>
          <path d={rb(66, 54,  7,  3)} stroke={rGrassBase} strokeWidth="2.4" fill="none" strokeLinecap="round" opacity="0.80"/>
        </svg>
      );
    }

    /* ── SUNFLOWER (unripe — waiting to bloom) ─────────────────────────── */
    case 'SUNFLOWER': {
      // Slight variation per tile so clusters look natural
      const sv = (tx * 3 + ty * 7) % 3;
      const lean = sv === 0 ? -1.5 : sv === 1 ? 1.5 : 0;
      return (
        <svg viewBox="0 0 34 60" width="32" height="56" style={{ display:'block' }}>
          {/* Ground shadow */}
          <ellipse cx="17" cy="59" rx="9" ry="2.5" fill="rgba(0,0,0,0.18)"/>
          {/* Stem — slightly leaning per variant */}
          <path d={`M17,58 Q${16+lean},44 ${17+lean},30 Q${18+lean},20 ${17+lean},10`}
            stroke="#4a9c1c" strokeWidth="3.5" fill="none" strokeLinecap="round"/>
          {/* Stem highlight */}
          <path d={`M16,58 Q${15+lean},44 ${16+lean},30`}
            stroke="rgba(255,255,255,0.20)" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
          {/* Left leaf */}
          <path d={`M${16+lean},46 Q${7+lean},41 ${4+lean},33 Q${8+lean},30 ${13+lean},38 Q${15+lean},42 ${16+lean},46Z`}
            fill="#52a81e"/>
          <path d={`M${16+lean},46 Q${9+lean},41 ${4+lean},33`}
            stroke="#3a8010" strokeWidth="0.9" fill="none" opacity="0.60"/>
          {/* Right leaf */}
          <path d={`M${18+lean},33 Q${27+lean},28 ${30+lean},21 Q${26+lean},19 ${21+lean},26 Q${18+lean},30 ${18+lean},33Z`}
            fill="#52a81e"/>
          <path d={`M${18+lean},33 Q${24+lean},27 ${30+lean},21`}
            stroke="#3a8010" strokeWidth="0.9" fill="none" opacity="0.60"/>
          {/* ── Flower head — unripe, petals just opening ── */}
          {/* Petal backing (pale greenish-yellow, short) */}
          {Array.from({ length: 12 }, (_, i) => (
            <ellipse key={i}
              cx={17 + lean} cy={7}
              rx="2.8" ry="5.5"
              fill={i % 2 === 0 ? '#c8d830' : '#b8c828'}
              opacity="0.88"
              transform={`rotate(${i * 30} ${17 + lean} 12)`}
            />
          ))}
          {/* Center disk — green, unripe (not dark brown yet) */}
          <circle cx={17 + lean} cy={12} r="8" fill="#2e7c14"/>
          <circle cx={17 + lean} cy={12} r="7" fill="#3a9020"/>
          {/* Seed-head texture dots — sparse, small */}
          {([
            [0,-4],[3,-3],[5,0],[4,3],[1,5],[-2,5],[-5,3],[-5,0],[-3,-3],
          ] as const).map(([dx,dy], i) => (
            <circle key={i} cx={(17+lean)+dx} cy={12+dy} r="1.1"
              fill="#1e5e0a" opacity="0.55"/>
          ))}
          {/* Center highlight */}
          <ellipse cx={(17+lean)-2.5} cy={10} rx="3" ry="2"
            fill="rgba(255,255,255,0.22)" transform={`rotate(-20 ${(17+lean)-2.5} 10)`}/>
          {/* Petal tips — lighter, slightly greener */}
          {Array.from({ length: 12 }, (_, i) => {
            const angle = (i * 30 * Math.PI) / 180;
            const tx2 = (17 + lean) + Math.sin(angle) * 11.5;
            const ty2 = 12 - Math.cos(angle) * 11.5;
            return <circle key={i} cx={tx2} cy={ty2} r="1.8" fill="#d8e040" opacity="0.70"/>;
          })}
        </svg>
      );
    }

    /* ── PUDDLE (decorative water pool near trees) ─────────────────────── */
    case 'PUDDLE': {
      const pv = (tx * 11 + ty * 5) % 3;
      // slight size variation per tile
      const pr = pv === 0 ? 1.0 : pv === 1 ? 0.88 : 1.12;
      const W = 26 * pr, H = 12 * pr;
      const cx = 26, cy = 16;
      const pdgId = g('pdg');
      return (
        <svg viewBox="0 0 52 26" width="50" height="24" style={{ display:'block' }}>
          {/* Ground shadow — slightly offset below */}
          <ellipse cx={cx} cy={cy + 2} rx={W + 2} ry={H + 1} fill="rgba(0,0,0,0.15)"/>
          {/* Water body */}
          <ellipse cx={cx} cy={cy} rx={W} ry={H} fill="#2ab0d8"/>
          {/* Depth gradient — darker edges */}
          <ellipse cx={cx} cy={cy} rx={W} ry={H} fill={`url(#${pdgId})`}/>
          <defs>
            <radialGradient id={pdgId} cx="38%" cy="30%" r="75%">
              <stop offset="0%"   stopColor="rgba(100,220,255,0.55)"/>
              <stop offset="60%"  stopColor="rgba(30,160,210,0.20)"/>
              <stop offset="100%" stopColor="rgba(10,80,140,0.45)"/>
            </radialGradient>
          </defs>
          {/* Main surface reflection — bright streak */}
          <ellipse cx={cx - 4} cy={cy - 3} rx={W * 0.38} ry={H * 0.28}
            fill="rgba(200,240,255,0.58)" transform={`rotate(-18 ${cx-4} ${cy-3})`}/>
          {/* Secondary shimmer */}
          <ellipse cx={cx + 5} cy={cy - 1} rx={W * 0.18} ry={H * 0.18}
            fill="rgba(255,255,255,0.36)" transform={`rotate(10 ${cx+5} ${cy-1})`}/>
          {/* Ripple rings */}
          <ellipse cx={cx} cy={cy} rx={W * 0.55} ry={H * 0.52}
            fill="none" stroke="rgba(255,255,255,0.28)" strokeWidth="1.2"/>
          <ellipse cx={cx} cy={cy} rx={W * 0.78} ry={H * 0.74}
            fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="0.9"/>
          {/* Rim highlight — thin bright edge on top half */}
          <path d={`M ${cx - W} ${cy} A ${W} ${H} 0 0 1 ${cx + W} ${cy}`}
            fill="none" stroke="rgba(180,240,255,0.55)" strokeWidth="1.4"/>
          {/* Small lily pad (variant 0 only) */}
          {pv === 0 && (
            <g>
              <ellipse cx={cx + 8} cy={cy + 2} rx="5.5" ry="3.5" fill="#2a8e18" opacity="0.85"
                transform={`rotate(-12 ${cx+8} ${cy+2})`}/>
              <path d={`M${cx+8},${cy-1.5} L${cx+8},${cy+5.5}`}
                stroke="#1e7010" strokeWidth="0.9" fill="none" opacity="0.7"/>
            </g>
          )}
          {/* Tiny floating leaf (variant 1) */}
          {pv === 1 && (
            <ellipse cx={cx - 6} cy={cy + 3} rx="4" ry="2.5" fill="#3a9820" opacity="0.75"
              transform={`rotate(20 ${cx-6} ${cy+3})`}/>
          )}
        </svg>
      );
    }

    /* ── FLOWER BUSH ───────────────────────────────────────────────────── */
    case 'FLOWER_BUSH': {
      const pi    = (tx * 7 + ty * 13) % 5;
      const petal = PETAL_COLORS[pi];
      const dark  = PETAL_DARKS[pi];
      const pid   = g('flp');
      // Render one bloom: 5 rounded petals fanning from (bx, by)
      const Bloom = (bx: number, by: number, d: number, rw: number, rh: number, op: number, ctr: number) => (
        <g opacity={op}>
          {FLOWER_ANGS.map(a => (
            <ellipse key={a} cx={bx} cy={by - d} rx={rw} ry={rh}
              fill={`url(#${pid})`} transform={`rotate(${a} ${bx} ${by})`}/>
          ))}
          {/* Petal vein lines */}
          {FLOWER_ANGS.map(a => {
            const rad = (a * Math.PI) / 180;
            const vx  = bx + Math.sin(rad) * (d + rh * 0.55);
            const vy  = by - Math.cos(rad) * (d + rh * 0.55);
            return <line key={a} x1={bx} y1={by} x2={vx} y2={vy}
              stroke={dark} strokeWidth="0.7" opacity="0.45"/>;
          })}
          {/* Seed centre */}
          <circle cx={bx} cy={by} r={ctr + 0.8} fill="#1e0a04"/>
          <circle cx={bx} cy={by} r={ctr}        fill="#3a1408"/>
          <circle cx={bx - ctr * 0.4} cy={by - ctr * 0.4} r={ctr * 0.45}
            fill="rgba(255,140,60,0.60)"/>
        </g>
      );
      return (
        <svg viewBox="0 0 44 52" width="42" height="50" style={{ display:'block' }}>
          <defs>
            <radialGradient id={pid} cx="38%" cy="28%" r="70%">
              <stop offset="0%"   stopColor={petal}/>
              <stop offset="65%"  stopColor={petal} stopOpacity="0.85"/>
              <stop offset="100%" stopColor={dark}/>
            </radialGradient>
          </defs>
          {/* Shadow */}
          <ellipse cx="22" cy="51" rx="16" ry="4" fill="rgba(0,0,0,0.22)"/>
          {/* Leaf base */}
          <ellipse cx="22" cy="44" rx="16" ry="6.5" fill="#246a18"/>
          <ellipse cx="11" cy="41" rx="11" ry="5.5" fill="#2e8020" transform="rotate(-20 11 41)"/>
          <ellipse cx="33" cy="40" rx="11" ry="5.5" fill="#2e8020" transform="rotate(20 33 40)"/>
          <ellipse cx="22" cy="40" rx="7"  ry="3"   fill="#38a028"/>
          {/* Leaf veins */}
          <path d="M11,45 Q8,40 10,35" stroke="#1e6012" strokeWidth="0.9" fill="none" opacity="0.6"/>
          <path d="M33,44 Q36,39 34,34" stroke="#1e6012" strokeWidth="0.9" fill="none" opacity="0.6"/>
          {/* ── Back-left bloom (smaller) ── */}
          {Bloom(12, 33, 6, 4.2, 7.5, 0.90, 3.2)}
          {/* ── Back-right bloom (smaller) ── */}
          {Bloom(32, 30, 6, 4.2, 7.5, 0.90, 3.2)}
          {/* ── Front-centre bloom (main, larger) ── */}
          {Bloom(22, 18, 8.5, 5.8, 10, 1.0, 4.5)}
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
    /* ── UNRIPE COCONUT TREE ─────────────────────────────────────────────── */
    case 'TREE_COCONUT_UNRIPE': return (
      <svg viewBox="0 0 72 112" width="88" height="138" style={{ display:'block' }}>
        <defs>
          <linearGradient id={g('cot')} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"   stopColor="#f2ca72"/>
            <stop offset="28%"  stopColor="#c89038"/>
            <stop offset="70%"  stopColor="#8a5820"/>
            <stop offset="100%" stopColor="#503408"/>
          </linearGradient>
          <radialGradient id={g('coc')} cx="34%" cy="26%" r="70%">
            <stop offset="0%"   stopColor="#bcf874"/>
            <stop offset="40%"  stopColor="#44c428"/>
            <stop offset="76%"  stopColor="#1e8014"/>
            <stop offset="100%" stopColor="#0c5008"/>
          </radialGradient>
          {/* Unripe coconut — green sphere */}
          <radialGradient id={g('conut')} cx="30%" cy="26%" r="70%">
            <stop offset="0%"   stopColor="#b8e860"/>
            <stop offset="50%"  stopColor="#52a818"/>
            <stop offset="100%" stopColor="#1e5808"/>
          </radialGradient>
        </defs>
        <ellipse cx="36" cy="110" rx="17" ry="4.5" fill="rgba(60,40,10,0.32)"/>
        <path d="M22,108 Q26,84 30,62 L40,62 Q44,84 48,108Z" fill={`url(#${g('cot')})`}/>
        <path d="M24.5,106 Q28,82 32,64" stroke="rgba(255,255,255,0.46)" strokeWidth="3.5" fill="none" strokeLinecap="round"/>
        <path d="M44,106 Q45.5,82 43.5,64" stroke="rgba(0,0,0,0.24)" strokeWidth="3" fill="none" strokeLinecap="round"/>
        {[70,78,87,96,104].map(y => (
          <path key={y} d={`M24,${y} Q36,${y-3} 47,${y}`} stroke="rgba(0,0,0,0.20)" strokeWidth="2.0" fill="none" strokeLinecap="round"/>
        ))}
        <ellipse cx="29" cy="82" rx="3.2" ry="1.8" fill="rgba(0,0,0,0.16)" transform="rotate(-8 29 82)"/>
        <ellipse cx="41" cy="94" rx="2.8" ry="1.6" fill="rgba(0,0,0,0.13)" transform="rotate(7 41 94)"/>
        <path d="M35,58 Q13,65 1,72"  stroke="#186416" strokeWidth="13" fill="none" strokeLinecap="round" opacity="0.88"/>
        <path d="M35,58 Q57,65 69,72" stroke="#186416" strokeWidth="13" fill="none" strokeLinecap="round" opacity="0.88"/>
        <path d="M35,58 Q13,65 1,72"  stroke="#58d83c" strokeWidth="3.5" fill="none" strokeLinecap="round" opacity="0.40"/>
        <path d="M35,58 Q57,65 69,72" stroke="#58d83c" strokeWidth="3.5" fill="none" strokeLinecap="round" opacity="0.40"/>
        <path d="M35,56 Q10,48 1,35"   stroke="#228a20" strokeWidth="13" fill="none" strokeLinecap="round"/>
        <path d="M35,56 Q60,48 69,35"  stroke="#228a20" strokeWidth="13" fill="none" strokeLinecap="round"/>
        <path d="M35,56 Q10,48 1,35"   stroke="#6ae44a" strokeWidth="4"   fill="none" strokeLinecap="round" opacity="0.45"/>
        <path d="M35,56 Q60,48 69,35"  stroke="#6ae44a" strokeWidth="4"   fill="none" strokeLinecap="round" opacity="0.45"/>
        <path d="M35,54 Q16,38 9,17"   stroke="#2eaa2c" strokeWidth="12"  fill="none" strokeLinecap="round"/>
        <path d="M35,54 Q54,38 61,17"  stroke="#2eaa2c" strokeWidth="12"  fill="none" strokeLinecap="round"/>
        <path d="M35,54 Q16,38 9,17"   stroke="#74ee54" strokeWidth="3.8" fill="none" strokeLinecap="round" opacity="0.50"/>
        <path d="M35,54 Q54,38 61,17"  stroke="#74ee54" strokeWidth="3.8" fill="none" strokeLinecap="round" opacity="0.50"/>
        <path d="M35,52 Q23,30 17,7"   stroke="#3ec03a" strokeWidth="11"  fill="none" strokeLinecap="round"/>
        <path d="M35,52 Q47,30 53,7"   stroke="#3ec03a" strokeWidth="11"  fill="none" strokeLinecap="round"/>
        <path d="M35,50 Q35,27 34,5"   stroke="#52d448" strokeWidth="10.5" fill="none" strokeLinecap="round"/>
        <path d="M35,52 Q23,30 17,7"   stroke="#8af86a" strokeWidth="3.5" fill="none" strokeLinecap="round" opacity="0.55"/>
        <path d="M35,52 Q47,30 53,7"   stroke="#8af86a" strokeWidth="3.5" fill="none" strokeLinecap="round" opacity="0.55"/>
        <path d="M35,50 Q35,27 34,5"   stroke="#8af86a" strokeWidth="3"   fill="none" strokeLinecap="round" opacity="0.55"/>
        <path d="M22,62 L16,56" stroke="#38b028" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
        <path d="M22,62 L17,68" stroke="#226e12" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
        <path d="M9,68  L3,62"  stroke="#38b028" strokeWidth="2.2" fill="none" strokeLinecap="round"/>
        <path d="M9,68  L4,74"  stroke="#226e12" strokeWidth="2.2" fill="none" strokeLinecap="round"/>
        <path d="M48,62 L54,56" stroke="#38b028" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
        <path d="M48,62 L53,68" stroke="#226e12" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
        <path d="M61,68 L67,62" stroke="#38b028" strokeWidth="2.2" fill="none" strokeLinecap="round"/>
        <path d="M61,68 L66,74" stroke="#226e12" strokeWidth="2.2" fill="none" strokeLinecap="round"/>
        <path d="M21,44 L15,38" stroke="#4ccc38" strokeWidth="2.2" fill="none" strokeLinecap="round"/>
        <path d="M49,44 L55,38" stroke="#4ccc38" strokeWidth="2.2" fill="none" strokeLinecap="round"/>
        <circle cx="35" cy="56" r="19" fill="#0b4808" opacity="0.62"/>
        <circle cx="35" cy="54" r="16" fill={`url(#${g('coc')})`}/>
        <circle cx="35" cy="54" r="16" fill="none" stroke="rgba(140,250,90,0.24)" strokeWidth="3.5"/>
        <ellipse cx="27" cy="44" rx="8.5" ry="5.2" fill="rgba(255,255,255,0.48)" transform="rotate(-18 27 44)"/>
        <ellipse cx="29" cy="46" rx="4.2" ry="2.6" fill="rgba(255,255,255,0.30)" transform="rotate(-18 29 46)"/>
        {/* ── Unripe coconuts — small green spheres ── */}
        <circle cx="25" cy="62" r="5.5" fill={`url(#${g('conut')})`}/>
        <circle cx="42" cy="63" r="5"   fill={`url(#${g('conut')})`}/>
        <circle cx="35" cy="67" r="4.5" fill={`url(#${g('conut')})`}/>
        <circle cx="21.5" cy="59.5" r="1.8" fill="rgba(255,255,255,0.42)"/>
        <circle cx="39.5" cy="60.5" r="1.6" fill="rgba(255,255,255,0.36)"/>
        <circle cx="33"   cy="64.5" r="1.4" fill="rgba(255,255,255,0.30)"/>
      </svg>
    );

    case 'TREE_COCONUT': return (
      <svg viewBox="0 0 72 112" width="88" height="138" style={{ display:'block' }}>
        <defs>
          {/* Trunk — cylindrical, left edge lit */}
          <linearGradient id={g('cot')} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"   stopColor="#f2ca72"/>
            <stop offset="28%"  stopColor="#c89038"/>
            <stop offset="70%"  stopColor="#8a5820"/>
            <stop offset="100%" stopColor="#503408"/>
          </linearGradient>
          {/* Crown — radial sphere, lit upper-left */}
          <radialGradient id={g('coc')} cx="34%" cy="26%" r="70%">
            <stop offset="0%"   stopColor="#bcf874"/>
            <stop offset="40%"  stopColor="#44c428"/>
            <stop offset="76%"  stopColor="#1e8014"/>
            <stop offset="100%" stopColor="#0c5008"/>
          </radialGradient>
          {/* Coconut — sphere lit upper-left */}
          <radialGradient id={g('conut')} cx="30%" cy="26%" r="70%">
            <stop offset="0%"   stopColor="#b87840"/>
            <stop offset="52%"  stopColor="#6a4018"/>
            <stop offset="100%" stopColor="#382008"/>
          </radialGradient>
        </defs>

        {/* Ground shadow */}
        <ellipse cx="36" cy="110" rx="17" ry="4.5" fill="rgba(60,40,10,0.32)"/>

        {/* Trunk — tapered path with cylindrical shading */}
        <path d="M22,108 Q26,84 30,62 L40,62 Q44,84 48,108Z" fill={`url(#${g('cot')})`}/>
        {/* Left specular streak */}
        <path d="M24.5,106 Q28,82 32,64" stroke="rgba(255,255,255,0.46)" strokeWidth="3.5" fill="none" strokeLinecap="round"/>
        {/* Right rim shadow */}
        <path d="M44,106 Q45.5,82 43.5,64" stroke="rgba(0,0,0,0.24)" strokeWidth="3" fill="none" strokeLinecap="round"/>
        {/* Bark rings — curved cross-sections */}
        {[70,78,87,96,104].map(y => (
          <path key={y} d={`M24,${y} Q36,${y-3} 47,${y}`} stroke="rgba(0,0,0,0.20)" strokeWidth="2.0" fill="none" strokeLinecap="round"/>
        ))}
        {/* Bark knots */}
        <ellipse cx="29" cy="82" rx="3.2" ry="1.8" fill="rgba(0,0,0,0.16)" transform="rotate(-8 29 82)"/>
        <ellipse cx="41" cy="94" rx="2.8" ry="1.6" fill="rgba(0,0,0,0.13)" transform="rotate(7 41 94)"/>

        {/* ── Fronds: back drooping (darkest, farthest) ── */}
        <path d="M35,58 Q13,65 1,72"  stroke="#186416" strokeWidth="13" fill="none" strokeLinecap="round" opacity="0.88"/>
        <path d="M35,58 Q57,65 69,72" stroke="#186416" strokeWidth="13" fill="none" strokeLinecap="round" opacity="0.88"/>
        <path d="M35,58 Q13,65 1,72"  stroke="#58d83c" strokeWidth="3.5" fill="none" strokeLinecap="round" opacity="0.40"/>
        <path d="M35,58 Q57,65 69,72" stroke="#58d83c" strokeWidth="3.5" fill="none" strokeLinecap="round" opacity="0.40"/>

        {/* ── Fronds: mid layer ── */}
        <path d="M35,56 Q10,48 1,35"   stroke="#228a20" strokeWidth="13" fill="none" strokeLinecap="round"/>
        <path d="M35,56 Q60,48 69,35"  stroke="#228a20" strokeWidth="13" fill="none" strokeLinecap="round"/>
        <path d="M35,56 Q10,48 1,35"   stroke="#6ae44a" strokeWidth="4"   fill="none" strokeLinecap="round" opacity="0.45"/>
        <path d="M35,56 Q60,48 69,35"  stroke="#6ae44a" strokeWidth="4"   fill="none" strokeLinecap="round" opacity="0.45"/>

        {/* ── Fronds: upper ── */}
        <path d="M35,54 Q16,38 9,17"   stroke="#2eaa2c" strokeWidth="12"  fill="none" strokeLinecap="round"/>
        <path d="M35,54 Q54,38 61,17"  stroke="#2eaa2c" strokeWidth="12"  fill="none" strokeLinecap="round"/>
        <path d="M35,54 Q16,38 9,17"   stroke="#74ee54" strokeWidth="3.8" fill="none" strokeLinecap="round" opacity="0.50"/>
        <path d="M35,54 Q54,38 61,17"  stroke="#74ee54" strokeWidth="3.8" fill="none" strokeLinecap="round" opacity="0.50"/>

        {/* ── Fronds: top (brightest, thinnest) ── */}
        <path d="M35,52 Q23,30 17,7"   stroke="#3ec03a" strokeWidth="11"  fill="none" strokeLinecap="round"/>
        <path d="M35,52 Q47,30 53,7"   stroke="#3ec03a" strokeWidth="11"  fill="none" strokeLinecap="round"/>
        <path d="M35,50 Q35,27 34,5"   stroke="#52d448" strokeWidth="10.5" fill="none" strokeLinecap="round"/>
        <path d="M35,52 Q23,30 17,7"   stroke="#8af86a" strokeWidth="3.5" fill="none" strokeLinecap="round" opacity="0.55"/>
        <path d="M35,52 Q47,30 53,7"   stroke="#8af86a" strokeWidth="3.5" fill="none" strokeLinecap="round" opacity="0.55"/>
        <path d="M35,50 Q35,27 34,5"   stroke="#8af86a" strokeWidth="3"   fill="none" strokeLinecap="round" opacity="0.55"/>

        {/* Leaflet pairs — left drooping */}
        <path d="M22,62 L16,56" stroke="#38b028" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
        <path d="M22,62 L17,68" stroke="#226e12" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
        <path d="M9,68  L3,62"  stroke="#38b028" strokeWidth="2.2" fill="none" strokeLinecap="round"/>
        <path d="M9,68  L4,74"  stroke="#226e12" strokeWidth="2.2" fill="none" strokeLinecap="round"/>
        {/* Leaflet pairs — right drooping */}
        <path d="M48,62 L54,56" stroke="#38b028" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
        <path d="M48,62 L53,68" stroke="#226e12" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
        <path d="M61,68 L67,62" stroke="#38b028" strokeWidth="2.2" fill="none" strokeLinecap="round"/>
        <path d="M61,68 L66,74" stroke="#226e12" strokeWidth="2.2" fill="none" strokeLinecap="round"/>
        {/* Leaflet pairs — upper fronds */}
        <path d="M21,44 L15,38" stroke="#4ccc38" strokeWidth="2.2" fill="none" strokeLinecap="round"/>
        <path d="M49,44 L55,38" stroke="#4ccc38" strokeWidth="2.2" fill="none" strokeLinecap="round"/>

        {/* ── Crown — multi-layer sphere ── */}
        <circle cx="35" cy="56" r="19" fill="#0b4808" opacity="0.62"/>
        <circle cx="35" cy="54" r="16" fill={`url(#${g('coc')})`}/>
        <circle cx="35" cy="54" r="16" fill="none" stroke="rgba(140,250,90,0.24)" strokeWidth="3.5"/>
        {/* Specular — upper-left */}
        <ellipse cx="27" cy="44" rx="8.5" ry="5.2" fill="rgba(255,255,255,0.48)" transform="rotate(-18 27 44)"/>
        <ellipse cx="29" cy="46" rx="4.2" ry="2.6" fill="rgba(255,255,255,0.30)" transform="rotate(-18 29 46)"/>

        {/* ── Coconuts — proper 3D spheres ── */}
        <circle cx="25" cy="62" r="7"   fill={`url(#${g('conut')})`}/>
        <circle cx="42" cy="63" r="6.5" fill={`url(#${g('conut')})`}/>
        <circle cx="35" cy="68" r="6"   fill={`url(#${g('conut')})`}/>
        {/* Specular spots */}
        <circle cx="22.5" cy="59" r="2.4" fill="rgba(255,255,255,0.38)"/>
        <circle cx="39.5" cy="60" r="2.2" fill="rgba(255,255,255,0.34)"/>
        <circle cx="32.5" cy="65" r="2.0" fill="rgba(255,255,255,0.30)"/>
        {/* Ridge marks */}
        <path d="M21,59 Q25,65 29,63" stroke="rgba(0,0,0,0.26)" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
        <path d="M38,60 Q42,67 46,64" stroke="rgba(0,0,0,0.22)" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
      </svg>
    );

    /* ── UNRIPE MANGO TREE ───────────────────────────────────────────────── */
    case 'TREE_MANGO_UNRIPE': return (
      <svg viewBox="0 0 76 96" width="94" height="118" style={{ display:'block' }}>
        <defs>
          <linearGradient id={g('mgt')} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"   stopColor="#f0b870"/>
            <stop offset="30%"  stopColor="#c08040"/>
            <stop offset="72%"  stopColor="#885020"/>
            <stop offset="100%" stopColor="#543010"/>
          </linearGradient>
          <radialGradient id={g('mgc')} cx="30%" cy="22%" r="76%">
            <stop offset="0%"   stopColor="#bcf060"/>
            <stop offset="38%"  stopColor="#52c02a"/>
            <stop offset="70%"  stopColor="#206e10"/>
            <stop offset="100%" stopColor="#0e4808"/>
          </radialGradient>
          {/* Unripe mango — green teardrop */}
          <radialGradient id={g('mgm')} cx="34%" cy="26%" r="68%">
            <stop offset="0%"   stopColor="#cef070"/>
            <stop offset="42%"  stopColor="#6ac020"/>
            <stop offset="80%"  stopColor="#2a7808"/>
            <stop offset="100%" stopColor="#184808"/>
          </radialGradient>
        </defs>
        <ellipse cx="38" cy="93" rx="18" ry="5" fill="rgba(80,50,10,0.32)"/>
        <path d="M30,91 Q32,72 33,56 L41,56 Q42,72 44,91Z" fill={`url(#${g('mgt')})`}/>
        <path d="M31.5,89 Q33.5,70 34.5,58" stroke="rgba(255,255,255,0.44)" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
        <path d="M42.5,89 Q43.5,70 43,58" stroke="rgba(0,0,0,0.22)" strokeWidth="2.2" fill="none" strokeLinecap="round"/>
        {[65,73,82].map(y => (
          <path key={y} d={`M31,${y} Q37,${y-2} 43,${y}`} stroke="rgba(0,0,0,0.18)" strokeWidth="1.6" fill="none" strokeLinecap="round"/>
        ))}
        <ellipse cx="38" cy="40" rx="36" ry="29" fill="#0c4006" opacity="0.70"/>
        <circle cx="6"  cy="50" r="22" fill="#164e0c"/>
        <circle cx="70" cy="50" r="22" fill="#1a560e"/>
        <ellipse cx="38" cy="35" rx="33" ry="28" fill="#1e6e10"/>
        <circle cx="8"  cy="40" r="21" fill="#267a14"/>
        <circle cx="68" cy="40" r="21" fill="#2a8418"/>
        <ellipse cx="38" cy="32" rx="30" ry="26" fill={`url(#${g('mgc')})`}/>
        <circle cx="20" cy="24" r="18" fill="#38a81e"/>
        <circle cx="56" cy="22" r="17" fill="#3cae22"/>
        <circle cx="38" cy="14" r="20" fill="#4ec02a"/>
        <circle cx="38" cy="8"  r="13" fill="#64d43a"/>
        <ellipse cx="64" cy="32" rx="8" ry="14" fill="rgba(100,220,60,0.22)"/>
        <ellipse cx="22" cy="12" rx="15" ry="9" fill="rgba(255,255,255,0.44)" transform="rotate(-14 22 12)"/>
        <ellipse cx="25" cy="15" rx="7"  ry="4" fill="rgba(255,255,255,0.28)" transform="rotate(-14 25 15)"/>
        {/* ── Unripe mangoes — small green teardrops, no red blush ── */}
        <ellipse cx="10" cy="52" rx="6"   ry="8"   fill={`url(#${g('mgm')})`} transform="rotate(-20 10 52)"/>
        <ellipse cx="7.5" cy="49" rx="2.4" ry="3.2" fill="rgba(255,255,255,0.48)" transform="rotate(-20 7.5 49)"/>
        <ellipse cx="24" cy="47" rx="5.5" ry="7"   fill={`url(#${g('mgm')})`} transform="rotate(-12 24 47)"/>
        <ellipse cx="22" cy="44" rx="2.2" ry="2.8" fill="rgba(255,255,255,0.44)" transform="rotate(-12 22 44)"/>
        <ellipse cx="38" cy="58" rx="6"   ry="8"   fill={`url(#${g('mgm')})`} transform="rotate(6 38 58)"/>
        <ellipse cx="35.5" cy="55" rx="2.4" ry="3.2" fill="rgba(255,255,255,0.46)" transform="rotate(6 35.5 55)"/>
        <ellipse cx="52" cy="47" rx="5.5" ry="7"   fill={`url(#${g('mgm')})`} transform="rotate(14 52 47)"/>
        <ellipse cx="49.5" cy="44" rx="2.2" ry="2.8" fill="rgba(255,255,255,0.42)" transform="rotate(14 49.5 44)"/>
        <ellipse cx="66" cy="52" rx="6"   ry="8"   fill={`url(#${g('mgm')})`} transform="rotate(20 66 52)"/>
        <ellipse cx="63.5" cy="49" rx="2.4" ry="3.2" fill="rgba(255,255,255,0.44)" transform="rotate(20 63.5 49)"/>
        <path d="M10,43  Q10,38 14,36" stroke="#4a8020" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
        <path d="M38,48  Q37,43 40,40" stroke="#4a8020" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
        <path d="M66,43  Q67,38 62,36" stroke="#4a8020" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      </svg>
    );

    /* ── MANGO TREE ─────────────────────────────────────────────────────── */
    case 'TREE_MANGO': return (
      <svg viewBox="0 0 76 96" width="94" height="118" style={{ display:'block' }}>
        <defs>
          {/* Trunk — cylindrical left-lit */}
          <linearGradient id={g('mgt')} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"   stopColor="#f0b870"/>
            <stop offset="30%"  stopColor="#c08040"/>
            <stop offset="72%"  stopColor="#885020"/>
            <stop offset="100%" stopColor="#543010"/>
          </linearGradient>
          {/* Canopy — radial sphere, lit upper-left */}
          <radialGradient id={g('mgc')} cx="30%" cy="22%" r="76%">
            <stop offset="0%"   stopColor="#bcf060"/>
            <stop offset="38%"  stopColor="#52c02a"/>
            <stop offset="70%"  stopColor="#206e10"/>
            <stop offset="100%" stopColor="#0e4808"/>
          </radialGradient>
          {/* Mango fruit — lit upper-left, warm orange-gold */}
          <radialGradient id={g('mgm')} cx="34%" cy="26%" r="68%">
            <stop offset="0%"   stopColor="#fff080"/>
            <stop offset="40%"  stopColor="#f0aa20"/>
            <stop offset="78%"  stopColor="#c07010"/>
            <stop offset="100%" stopColor="#804208"/>
          </radialGradient>
          {/* Mango red blush — on the sun side */}
          <radialGradient id={g('mgr')} cx="70%" cy="30%" r="65%">
            <stop offset="0%"   stopColor="rgba(220,60,20,0.55)"/>
            <stop offset="100%" stopColor="rgba(180,40,10,0)"/>
          </radialGradient>
        </defs>

        {/* Ground shadow */}
        <ellipse cx="38" cy="93" rx="18" ry="5" fill="rgba(80,50,10,0.32)"/>

        {/* Trunk — tapered, cylindrical */}
        <path d="M30,91 Q32,72 33,56 L41,56 Q42,72 44,91Z" fill={`url(#${g('mgt')})`}/>
        {/* Left specular */}
        <path d="M31.5,89 Q33.5,70 34.5,58" stroke="rgba(255,255,255,0.44)" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
        {/* Right rim shadow */}
        <path d="M42.5,89 Q43.5,70 43,58" stroke="rgba(0,0,0,0.22)" strokeWidth="2.2" fill="none" strokeLinecap="round"/>
        {/* Bark rings */}
        {[65,73,82].map(y => (
          <path key={y} d={`M31,${y} Q37,${y-2} 43,${y}`} stroke="rgba(0,0,0,0.18)" strokeWidth="1.6" fill="none" strokeLinecap="round"/>
        ))}

        {/* ── Canopy — layered for deep 3D volume ── */}
        {/* AO shadow base — widest, darkest */}
        <ellipse cx="38" cy="40" rx="36" ry="29" fill="#0c4006" opacity="0.70"/>
        {/* Lower side blobs */}
        <circle cx="6"  cy="50" r="22" fill="#164e0c"/>
        <circle cx="70" cy="50" r="22" fill="#1a560e"/>
        {/* Wide mid layer */}
        <ellipse cx="38" cy="35" rx="33" ry="28" fill="#1e6e10"/>
        {/* Side clusters — mid height */}
        <circle cx="8"  cy="40" r="21" fill="#267a14"/>
        <circle cx="68" cy="40" r="21" fill="#2a8418"/>
        {/* Core canopy — radial gradient sphere */}
        <ellipse cx="38" cy="32" rx="30" ry="26" fill={`url(#${g('mgc')})`}/>
        {/* Upper lobes — add surface bumps */}
        <circle cx="20" cy="24" r="18" fill="#38a81e"/>
        <circle cx="56" cy="22" r="17" fill="#3cae22"/>
        {/* Top dome — brightest */}
        <circle cx="38" cy="14" r="20" fill="#4ec02a"/>
        <circle cx="38" cy="8"  r="13" fill="#64d43a"/>
        {/* Rim light on right edge — secondary light bounce */}
        <ellipse cx="64" cy="32" rx="8" ry="14" fill="rgba(100,220,60,0.22)"/>
        {/* Specular — upper-left */}
        <ellipse cx="22" cy="12" rx="15" ry="9" fill="rgba(255,255,255,0.44)" transform="rotate(-14 22 12)"/>
        <ellipse cx="25" cy="15" rx="7"  ry="4" fill="rgba(255,255,255,0.28)" transform="rotate(-14 25 15)"/>

        {/* ── Mangoes — teardrop 3D fruits ── */}
        {/* Outer left */}
        <ellipse cx="10" cy="52" rx="7.5" ry="10" fill={`url(#${g('mgm')})`} transform="rotate(-20 10 52)"/>
        <ellipse cx="10" cy="52" rx="7.5" ry="10" fill={`url(#${g('mgr')})`} transform="rotate(-20 10 52)"/>
        <ellipse cx="7.5" cy="49" rx="3" ry="4" fill="rgba(255,255,255,0.54)" transform="rotate(-20 7.5 49)"/>
        {/* Inner left */}
        <ellipse cx="24" cy="47" rx="6.5" ry="8.5" fill={`url(#${g('mgm')})`} transform="rotate(-12 24 47)"/>
        <ellipse cx="24" cy="47" rx="6.5" ry="8.5" fill={`url(#${g('mgr')})`} transform="rotate(-12 24 47)"/>
        <ellipse cx="22" cy="44" rx="2.6" ry="3.4" fill="rgba(255,255,255,0.50)" transform="rotate(-12 22 44)"/>
        {/* Centre bottom */}
        <ellipse cx="38" cy="58" rx="7.5" ry="10"  fill={`url(#${g('mgm')})`} transform="rotate(6 38 58)"/>
        <ellipse cx="38" cy="58" rx="7.5" ry="10"  fill={`url(#${g('mgr')})`} transform="rotate(6 38 58)"/>
        <ellipse cx="35.5" cy="55" rx="3" ry="4"   fill="rgba(255,255,255,0.52)" transform="rotate(6 35.5 55)"/>
        {/* Inner right */}
        <ellipse cx="52" cy="47" rx="6.5" ry="8.5" fill={`url(#${g('mgm')})`} transform="rotate(14 52 47)"/>
        <ellipse cx="52" cy="47" rx="6.5" ry="8.5" fill={`url(#${g('mgr')})`} transform="rotate(14 52 47)"/>
        <ellipse cx="49.5" cy="44" rx="2.6" ry="3.4" fill="rgba(255,255,255,0.48)" transform="rotate(14 49.5 44)"/>
        {/* Outer right */}
        <ellipse cx="66" cy="52" rx="7.5" ry="10"  fill={`url(#${g('mgm')})`} transform="rotate(20 66 52)"/>
        <ellipse cx="66" cy="52" rx="7.5" ry="10"  fill={`url(#${g('mgr')})`} transform="rotate(20 66 52)"/>
        <ellipse cx="63.5" cy="49" rx="3" ry="4"   fill="rgba(255,255,255,0.50)" transform="rotate(20 63.5 49)"/>
        {/* Mango stems */}
        <path d="M10,43  Q10,38 14,36" stroke="#4a8020" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
        <path d="M38,48  Q37,43 40,40" stroke="#4a8020" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
        <path d="M66,43  Q67,38 62,36" stroke="#4a8020" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
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

    /* ── WEEDS (tall reed/cattail cluster — clearable) ──────────────────── */
    case 'WEEDS': {
      const wv = (tx * 5 + ty * 11) % 3;
      const onSand = tileType === 'SAND';
      // cBase ≈ ground colour so the lowest tufts dissolve into the tile
      // Grass palette anchored near grass-top #5cb828 so tall blades read
      // as overgrown versions of the same turf rather than a foreign colour
      const [cBase, cDark, cMid, cFront, cHi] = onSand ? ([
        ['#b0bc48','#8a9a2c','#a0b238','#b8cc50','#d0e46a'],  // dusty sage
        ['#b2be4c','#8c9c30','#a2b43c','#bacc54','#d2e46e'],  // warm olive
        ['#acb844','#868e2a','#9ca636','#b2be4e','#cad668'],  // deep olive
      ] as const)[wv] : ([
        // base ≈ #5cb828 grass top; dark/mid/front step up in brightness
        ['#5cb828','#3e8e14','#52aa22','#6ecc36','#96ec52'],  // cool grass green
        ['#5ebc2a','#409016','#56ae26','#72d03a','#9aee56'],  // slightly warmer
        ['#5ab626','#3c8a12','#50a820','#6cca34','#92ea50'],  // deep forest
      ] as const)[wv];

      // Helper: filled sword-blade shape — base centered at (cx,baseY), height h,
      // tip leaning by `lean` px, half-width bw at widest point.
      const blade = (cx: number, baseY: number, h: number, lean: number, bw: number) => {
        const tipX = cx + lean, tipY = baseY - h;
        return `M ${cx - bw},${baseY} `
          + `C ${cx - bw * 0.85},${baseY - h * 0.35} ${tipX - bw * 0.45},${baseY - h * 0.65} ${tipX},${tipY} `
          + `C ${tipX + bw * 0.45},${baseY - h * 0.65} ${cx + bw * 0.85},${baseY - h * 0.35} ${cx + bw},${baseY} Z`;
      };
      // Midrib highlight down the centre of each blade
      const rib = (cx: number, baseY: number, h: number, lean: number) =>
        `M ${cx},${baseY} C ${cx + lean * 0.3},${baseY - h * 0.35} ${cx + lean * 0.7},${baseY - h * 0.65} ${cx + lean},${baseY - h}`;

      const by = 55;
      return (
        <svg viewBox="0 0 56 56" width="54" height="52" style={{ display:'block' }}>
          {/* Very faint contact shadow — no harsh dark ring */}
          <ellipse cx="28" cy="55" rx="22" ry="3" fill="rgba(0,0,0,0.07)"/>

          {/* ── BACK ROW — tallest, darkest ── */}
          <path d={blade(9,  by, 52, -3, 2.8)} fill={cDark}/>
          <path d={blade(18, by, 55, -1, 3.2)} fill={cDark}/>
          <path d={blade(28, by, 57,  0, 3.4)} fill={cDark}/>
          <path d={blade(37, by, 53,  2, 3.0)} fill={cDark}/>
          <path d={blade(46, by, 50,  4, 2.8)} fill={cDark}/>

          {/* ── MID ROW — medium height ── */}
          <path d={blade(4,  by, 40, -5, 2.4)} fill={cMid}/>
          <path d={blade(13, by, 42, -2, 2.6)} fill={cMid}/>
          <path d={blade(22, by, 44,  0, 2.8)} fill={cMid}/>
          <path d={blade(32, by, 42,  1, 2.6)} fill={cMid}/>
          <path d={blade(41, by, 40,  3, 2.4)} fill={cMid}/>
          <path d={blade(50, by, 38,  5, 2.2)} fill={cMid}/>

          {/* ── FRONT ROW — shorter, brighter ── */}
          <path d={blade(8,  by, 28, -4, 2.2)} fill={cFront}/>
          <path d={blade(17, by, 30, -1, 2.5)} fill={cFront}/>
          <path d={blade(27, by, 28,  0, 2.4)} fill={cFront}/>
          <path d={blade(37, by, 26,  2, 2.2)} fill={cFront}/>
          <path d={blade(47, by, 24,  4, 2.0)} fill={cFront}/>

          {/* ── Ground tufts — grass-coloured, dissolve base into tile ── */}
          <path d={blade(5,  by, 13, -3, 2.0)} fill={cBase} opacity="0.90"/>
          <path d={blade(14, by, 11, -1, 2.2)} fill={cBase} opacity="0.85"/>
          <path d={blade(23, by, 14,  0, 2.1)} fill={cBase} opacity="0.90"/>
          <path d={blade(32, by, 12,  2, 2.0)} fill={cBase} opacity="0.85"/>
          <path d={blade(41, by, 13,  3, 2.0)} fill={cBase} opacity="0.88"/>
          <path d={blade(50, by, 10,  4, 1.8)} fill={cBase} opacity="0.80"/>

          {/* ── Midrib highlights ── */}
          <path d={rib(18, by, 55, -1)} stroke={cHi} strokeWidth="0.9" fill="none" opacity="0.50" strokeLinecap="round"/>
          <path d={rib(28, by, 57,  0)} stroke={cHi} strokeWidth="1.0" fill="none" opacity="0.55" strokeLinecap="round"/>
          <path d={rib(37, by, 53,  2)} stroke={cHi} strokeWidth="0.9" fill="none" opacity="0.50" strokeLinecap="round"/>
          <path d={rib(22, by, 44,  0)} stroke={cHi} strokeWidth="0.8" fill="none" opacity="0.40" strokeLinecap="round"/>
          <path d={rib(17, by, 30, -1)} stroke={cHi} strokeWidth="0.7" fill="none" opacity="0.35" strokeLinecap="round"/>
          <path d={rib(27, by, 28,  0)} stroke={cHi} strokeWidth="0.7" fill="none" opacity="0.33" strokeLinecap="round"/>
        </svg>
      );
    }

    /* ── THORNS ─────────────────────────────────────────────────────────── */
    case 'THORNS': {
      const tv = (tx * 9 + ty * 17) % 3;
      // slight rotation variant so clusters don't all align
      const trot = tv === 0 ? 0 : tv === 1 ? 15 : -12;
      // thorn color variants: warm brown, grey-brown, olive-brown
      const [thorn, thornDk, leafC] = ([
        ['#9a7838', '#604a18', '#3a6e14'],
        ['#8a8060', '#544e30', '#2e6410'],
        ['#7a8040', '#4c5020', '#3a7018'],
      ] as const)[tv];
      return (
        <svg viewBox="0 0 46 36" width="44" height="34" style={{ display:'block' }}>
          {/* Ground shadow */}
          <ellipse cx="23" cy="35" rx="19" ry="3.5" fill="rgba(0,0,0,0.20)"/>

          {/* ── Leaf base — low oval mound ── */}
          <ellipse cx="23" cy="28" rx="18" ry="7"  fill={leafC} opacity="0.85"/>
          <ellipse cx="23" cy="26" rx="14" ry="5.5" fill={leafC}/>
          {/* leaf sheen */}
          <ellipse cx="19" cy="24" rx="5" ry="2.5" fill="rgba(255,255,255,0.18)" transform="rotate(-15 19 24)"/>

          {/* ── Thorn spikes — radiating outward ── */}
          <g transform={`rotate(${trot} 23 26)`}>
            {/* 8 main spikes at 45° intervals */}
            {([0,45,90,135,180,225,270,315] as const).map((a, i) => {
              const rad  = (a * Math.PI) / 180;
              const len  = i % 2 === 0 ? 13 : 10;   // alternate long/short
              const x2   = 23 + Math.sin(rad) * len;
              const y2   = 26 - Math.cos(rad) * len;
              const xm   = 23 + Math.sin(rad) * (len * 0.6);
              const ym   = 26 - Math.cos(rad) * (len * 0.6);
              // barb offsets perpendicular to spine
              const px   =  Math.cos(rad) * 2.2;
              const py   =  Math.sin(rad) * 2.2;
              return (
                <g key={a}>
                  {/* Thorn spine */}
                  <line x1="23" y1="26" x2={x2} y2={y2}
                    stroke={thorn} strokeWidth={i % 2 === 0 ? 2.4 : 1.9} strokeLinecap="round"/>
                  {/* Barb / side hook */}
                  <line x1={xm} y1={ym} x2={xm + px} y2={ym - py}
                    stroke={thornDk} strokeWidth="1.4" strokeLinecap="round"/>
                  {/* Sharp tip dot */}
                  <circle cx={x2} cy={y2} r="1.2" fill={thornDk}/>
                </g>
              );
            })}
            {/* 4 inner shorter spikes at 22.5° offset */}
            {([22,112,202,292] as const).map(a => {
              const rad = (a * Math.PI) / 180;
              const x2  = 23 + Math.sin(rad) * 7;
              const y2  = 26 - Math.cos(rad) * 7;
              return (
                <line key={a} x1="23" y1="26" x2={x2} y2={y2}
                  stroke={thorn} strokeWidth="1.5" strokeLinecap="round" opacity="0.75"/>
              );
            })}
          </g>

          {/* ── Centre knot ── */}
          <circle cx="23" cy="26" r="4.5" fill={leafC}/>
          <circle cx="23" cy="26" r="3"   fill={thorn} opacity="0.70"/>
          <circle cx="21.8" cy="24.8" r="1.2" fill="rgba(255,255,255,0.30)"/>
        </svg>
      );
    }

    /* ── BLUEBELL (tall purple-blue spike flowers) ──────────────────────── */
    case 'BLUEBELL': {
      const bv = (tx * 13 + ty * 7) % 3;
      // colour variants: cool violet, warm purple, soft lavender
      const [bellC, bellDk, bellHi] = ([
        ['#7060c8','#4030a0','#a898f0'],
        ['#8040c0','#5020a0','#c07ae0'],
        ['#5070d0','#304090','#88aaee'],
      ] as const)[bv];
      // slight lean per tile
      const lean = bv === 0 ? -2 : bv === 1 ? 2 : 0;
      return (
        <svg viewBox="0 0 38 56" width="36" height="54" style={{ display:'block' }}>
          {/* Shadow */}
          <ellipse cx="19" cy="55" rx="14" ry="3.5" fill="rgba(0,0,0,0.20)"/>
          {/* Leaf base */}
          <path d="M11,54 Q9,42 11,30 Q13,20 12,10" stroke="#2a8018" strokeWidth="6" fill="none" strokeLinecap="round"/>
          <path d="M19,54 Q18,40 19,26 Q20,14 19,4"  stroke="#2e9020" strokeWidth="6" fill="none" strokeLinecap="round"/>
          <path d="M27,54 Q29,42 27,30 Q25,20 26,10" stroke="#2a8018" strokeWidth="6" fill="none" strokeLinecap="round"/>
          {/* Stem highlights */}
          <path d="M12,54 Q10,42 12,30" stroke="rgba(255,255,255,0.22)" strokeWidth="2" fill="none" strokeLinecap="round"/>
          <path d="M20,54 Q19,40 20,26" stroke="rgba(255,255,255,0.22)" strokeWidth="2" fill="none" strokeLinecap="round"/>
          {/* ── Left spike — bells along stem ── */}
          {([50,42,34,27,21,16] as const).map((y, i) => (
            <ellipse key={y}
              cx={11 + lean - i * 0.4} cy={y}
              rx={3.2 - i * 0.25} ry={4.5 - i * 0.3}
              fill={bellC} stroke={bellDk} strokeWidth="0.8"
              transform={`rotate(${-10 + lean} ${11 + lean - i * 0.4} ${y})`}/>
          ))}
          {/* ── Centre spike ── */}
          {([50,41,32,24,17,11,6] as const).map((y, i) => (
            <ellipse key={y}
              cx={19 + lean * 0.5} cy={y}
              rx={3.5 - i * 0.28} ry={5 - i * 0.38}
              fill={i < 3 ? bellC : bellDk} stroke={bellDk} strokeWidth="0.8"
              transform={`rotate(${lean * 0.5} ${19 + lean * 0.5} ${y})`}/>
          ))}
          {/* ── Right spike ── */}
          {([50,42,34,27,21,16] as const).map((y, i) => (
            <ellipse key={y}
              cx={27 + lean + i * 0.4} cy={y}
              rx={3.2 - i * 0.25} ry={4.5 - i * 0.3}
              fill={bellC} stroke={bellDk} strokeWidth="0.8"
              transform={`rotate(${10 + lean} ${27 + lean + i * 0.4} ${y})`}/>
          ))}
          {/* Bell highlights */}
          {([50,41,32] as const).map(y => (
            <ellipse key={y} cx={18} cy={y - 1.2} rx="1.4" ry="1.0"
              fill={bellHi} opacity="0.55"/>
          ))}
        </svg>
      );
    }

    /* ── PANSY (yellow + blue low flower cluster) ───────────────────────── */
    case 'PANSY': {
      const pav = (tx * 11 + ty * 9) % 2;
      const pid2 = g('pny');
      return (
        <svg viewBox="0 0 46 42" width="44" height="40" style={{ display:'block' }}>
          <defs>
            <radialGradient id={pid2} cx="35%" cy="30%" r="68%">
              <stop offset="0%"   stopColor="#f8e840"/>
              <stop offset="100%" stopColor="#d4a010"/>
            </radialGradient>
          </defs>
          {/* Shadow */}
          <ellipse cx="23" cy="41" rx="18" ry="3.5" fill="rgba(0,0,0,0.20)"/>
          {/* Leaf mound */}
          <ellipse cx="23" cy="33" rx="19" ry="7.5" fill="#1e6010"/>
          <ellipse cx="12" cy="30" rx="12" ry="6"   fill="#246814" transform="rotate(-15 12 30)"/>
          <ellipse cx="34" cy="29" rx="12" ry="6"   fill="#246814" transform="rotate(15 34 29)"/>
          <ellipse cx="23" cy="28" rx="10" ry="5"   fill="#2e7a1a"/>
          {/* Leaf sheen */}
          <ellipse cx="14" cy="27" rx="4" ry="2" fill="rgba(255,255,255,0.16)" transform="rotate(-15 14 27)"/>
          {/* ── Yellow flowers (5-petal) ── */}
          {([
            [23, 18, 7.5, 9.5, 1.0],
            [10, 22, 6,   8,   0.92],
            [36, 21, 6,   8,   0.92],
          ] as const).map(([bx, by, d, rh, op], fi) => (
            <g key={fi} opacity={op}>
              {FLOWER_ANGS.map(a => (
                <ellipse key={a} cx={bx} cy={by - d} rx={4.5} ry={rh}
                  fill={`url(#${pid2})`}
                  transform={`rotate(${a} ${bx} ${by})`}/>
              ))}
              <circle cx={bx} cy={by} r={fi === 0 ? 4 : 3.2} fill="#4a2800"/>
              <circle cx={bx - 1} cy={by - 1} r={fi === 0 ? 1.6 : 1.2} fill="rgba(255,200,40,0.70)"/>
            </g>
          ))}
          {/* ── Blue accent flowers ── */}
          {(pav === 0
            ? [[16, 14], [30, 17]] as const
            : [[9,  20], [37, 18]] as const
          ).map(([bx, by]) => (
            <g key={`${bx}${by}`}>
              {FLOWER_ANGS.map(a => (
                <ellipse key={a} cx={bx} cy={by - 5} rx={3.2} ry={6.5}
                  fill="#4868e0"
                  transform={`rotate(${a} ${bx} ${by})`}/>
              ))}
              <circle cx={bx} cy={by} r="2.5" fill="#f0e030"/>
              <circle cx={bx - 0.6} cy={by - 0.6} r="1" fill="rgba(255,255,255,0.60)"/>
            </g>
          ))}
        </svg>
      );
    }

    /* ── TULIP (tall yellow tulips) ─────────────────────────────────────── */
    case 'TULIP': {
      const tlv = (tx * 7 + ty * 11) % 3;
      const [tulipC, tulipDk, tulipHi] = ([
        ['#f0d018','#c09000','#fff280'],  // classic yellow
        ['#f8c020','#b08000','#ffe060'],  // deep gold
        ['#f4dc30','#c8a010','#ffee90'],  // pale yellow
      ] as const)[tlv];
      // helper: draw one tulip cup at (hx, hy)
      const TulipHead = (hx: number, hy: number, sc: number) => (
        <g>
          {/* 3 back petals */}
          <path d={`M${hx},${hy + 2 * sc} Q${hx - 6 * sc},${hy - 4 * sc} ${hx - 2 * sc},${hy - 10 * sc} Q${hx},${hy - 8 * sc} ${hx},${hy + 2 * sc}`}
            fill={tulipDk}/>
          <path d={`M${hx},${hy + 2 * sc} Q${hx + 6 * sc},${hy - 4 * sc} ${hx + 2 * sc},${hy - 10 * sc} Q${hx},${hy - 8 * sc} ${hx},${hy + 2 * sc}`}
            fill={tulipDk}/>
          {/* 3 front petals */}
          <path d={`M${hx - 3 * sc},${hy + 1 * sc} Q${hx - 8 * sc},${hy - 6 * sc} ${hx - 3 * sc},${hy - 12 * sc} Q${hx},${hy - 10 * sc} ${hx - 3 * sc},${hy + 1 * sc}`}
            fill={tulipC}/>
          <path d={`M${hx},${hy + 2 * sc} Q${hx},${hy - 10 * sc} ${hx},${hy - 13 * sc} Q${hx},${hy - 10 * sc} ${hx},${hy + 2 * sc}`}
            fill={tulipHi} opacity="0.70"/>
          <path d={`M${hx + 3 * sc},${hy + 1 * sc} Q${hx + 8 * sc},${hy - 6 * sc} ${hx + 3 * sc},${hy - 12 * sc} Q${hx},${hy - 10 * sc} ${hx + 3 * sc},${hy + 1 * sc}`}
            fill={tulipC}/>
          {/* Petal highlight */}
          <path d={`M${hx - 1 * sc},${hy + 1 * sc} Q${hx - 2 * sc},${hy - 6 * sc} ${hx - 1 * sc},${hy - 12 * sc}`}
            stroke={tulipHi} strokeWidth={0.9 * sc} fill="none" opacity="0.70" strokeLinecap="round"/>
        </g>
      );
      return (
        <svg viewBox="0 0 40 58" width="38" height="56" style={{ display:'block' }}>
          {/* Shadow */}
          <ellipse cx="20" cy="57" rx="14" ry="3.5" fill="rgba(0,0,0,0.20)"/>
          {/* Stems */}
          <path d="M12,56 Q11,44 12,32 Q13,22 12,14" stroke="#2e8820" strokeWidth="3.5" fill="none" strokeLinecap="round"/>
          <path d="M20,56 Q20,42 20,28 Q20,16 20,8"  stroke="#349424" strokeWidth="3.8" fill="none" strokeLinecap="round"/>
          <path d="M29,56 Q30,44 29,32 Q28,22 29,14" stroke="#2e8820" strokeWidth="3.5" fill="none" strokeLinecap="round"/>
          {/* Strap leaves */}
          <path d="M13,46 Q5,40 4,30"  stroke="#3aaa28" strokeWidth="5" fill="none" strokeLinecap="round"/>
          <path d="M20,42 Q28,36 30,24" stroke="#3aaa28" strokeWidth="5" fill="none" strokeLinecap="round"/>
          <path d="M28,44 Q36,38 37,28" stroke="#3aaa28" strokeWidth="4.5" fill="none" strokeLinecap="round"/>
          <path d="M13,46 Q5,40 4,30"  stroke="rgba(255,255,255,0.20)" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
          {/* Leaf vein lines */}
          <path d="M13,46 Q7,41 5,32"  stroke="#1e6010" strokeWidth="0.8" fill="none" opacity="0.6"/>
          <path d="M20,42 Q26,37 28,26" stroke="#1e6010" strokeWidth="0.8" fill="none" opacity="0.6"/>
          {/* Tulip heads */}
          {TulipHead(12, 22, 1.0)}
          {TulipHead(20, 16, 1.1)}
          {TulipHead(29, 22, 1.0)}
        </svg>
      );
    }

    /* ── BLUEBERRY BUSH ─────────────────────────────────────────────────── */
    case 'BLUEBERRY_BUSH': {
      return (
        <svg viewBox="0 0 52 56" width="50" height="54" style={{ display:'block' }}>
          <defs>
            <radialGradient id={g('blb')} cx="30%" cy="25%" r="68%">
              <stop offset="0%"   stopColor="#8898f8"/>
              <stop offset="50%"  stopColor="#3a50d8"/>
              <stop offset="100%" stopColor="#162898"/>
            </radialGradient>
          </defs>
          {/* Shadow */}
          <ellipse cx="26" cy="55" rx="21" ry="4" fill="rgba(0,0,0,0.22)"/>
          {/* Leaf mass — back */}
          <ellipse cx="26" cy="34" rx="21" ry="19" fill="#1e8012"/>
          <ellipse cx="14" cy="38" rx="14" ry="12" fill="#187010"/>
          <ellipse cx="38" cy="38" rx="14" ry="12" fill="#228818"/>
          <ellipse cx="24" cy="24" rx="17" ry="12" fill="#2a9a1e"/>
          <ellipse cx="34" cy="26" rx="14" ry="10" fill="#289818"/>
          {/* Leaf lobes */}
          <path d="M10,20 Q17,10 24,20 Q17,30 10,20Z" fill="#32a81e" opacity="0.85"/>
          <path d="M21,15 Q28,5  35,15 Q28,25 21,15Z" fill="#2c9e1a" opacity="0.85"/>
          <path d="M6,30  Q12,20 18,30 Q12,40 6,30Z"  fill="#28941a" opacity="0.80"/>
          <path d="M30,20 Q37,10 44,20 Q37,30 30,20Z" fill="#30a01c" opacity="0.75"/>
          {/* Berry clusters — back row */}
          {([
            {cx:12,cy:28,r:3.8},{cx:20,cy:25,r:4.2},{cx:29,cy:27,r:4.0},{cx:38,cy:28,r:3.6},
            {cx:7, cy:37,r:4.4},{cx:16,cy:34,r:5.0},{cx:26,cy:33,r:5.2},{cx:36,cy:34,r:4.8},{cx:44,cy:36,r:4.0},
            {cx:11,cy:44,r:4.8},{cx:22,cy:43,r:5.4},{cx:32,cy:44,r:5.0},{cx:41,cy:43,r:4.4},
          ] as const).map((b, i) => (
            <g key={i}>
              <circle cx={b.cx} cy={b.cy} r={b.r} fill={`url(#${g('blb')})`}/>
              <ellipse cx={b.cx} cy={b.cy - b.r + 1.2} rx={b.r * 0.40} ry={b.r * 0.24} fill="rgba(0,0,0,0.30)"/>
              <circle cx={b.cx - b.r * 0.33} cy={b.cy - b.r * 0.38} r={b.r * 0.34} fill="rgba(255,255,255,0.58)"/>
              <circle cx={b.cx + b.r * 0.15} cy={b.cy - b.r * 0.55} r={b.r * 0.16} fill="rgba(255,255,255,0.34)"/>
            </g>
          ))}
          {/* Front leaf overhang */}
          <path d="M5,50  Q12,40 19,50  Q12,60 5,50Z"  fill="#1e8412" opacity="0.75"/>
          <path d="M28,49 Q35,39 42,49  Q35,59 28,49Z"  fill="#22901a" opacity="0.70"/>
        </svg>
      );
    }

    /* ── BABY PARROT ─────────────────────────────────────────────────────── */
    case 'BABY_PARROT': {
      // Alternate facing direction per tile so parrots look varied
      const facingRight = (tx + ty) % 2 === 0;
      const bkX = facingRight ? 30 : 18;   // beak base X
      const eyX = facingRight ? 29 : 19;   // eye X
      const bkPath = facingRight
        ? 'M30,26 L37,23.5 L36,27.5Z'
        : 'M18,26 L11,23.5 L12,27.5Z';
      return (
        <svg viewBox="0 0 48 62" width="44" height="57" style={{ display:'block' }}>
          {/* Ground shadow */}
          <ellipse cx="24" cy="60" rx="12" ry="3.2" fill="rgba(0,0,0,0.22)"/>

          {/* Legs */}
          <line x1="20" y1="52" x2="17" y2="58" stroke="#d07810" strokeWidth="2.2" strokeLinecap="round"/>
          <line x1="17" y1="58" x2="14" y2="59.5" stroke="#d07810" strokeWidth="1.8" strokeLinecap="round"/>
          <line x1="17" y1="58" x2="18" y2="60.5" stroke="#d07810" strokeWidth="1.8" strokeLinecap="round"/>
          <line x1="28" y1="52" x2="31" y2="58" stroke="#d07810" strokeWidth="2.2" strokeLinecap="round"/>
          <line x1="31" y1="58" x2="34" y2="59.5" stroke="#d07810" strokeWidth="1.8" strokeLinecap="round"/>
          <line x1="31" y1="58" x2="30" y2="60.5" stroke="#d07810" strokeWidth="1.8" strokeLinecap="round"/>

          {/* Body — compact green egg */}
          <ellipse cx="24" cy="44" rx="13" ry="12" fill="#1e8010"/>
          <ellipse cx="24" cy="43" rx="10" ry="10" fill="#2ca018"/>
          <ellipse cx="24" cy="43" rx="6"  ry="7"  fill="#38b420" opacity="0.75"/>
          {/* Wing curves */}
          <path d={facingRight ? 'M12,41 Q6,47 12,53'  : 'M36,41 Q42,47 36,53'} stroke="#16700c" strokeWidth="4.5" fill="none" strokeLinecap="round"/>
          {/* Belly highlight */}
          <ellipse cx="24" cy="46" rx="4.5" ry="5.5" fill="rgba(255,255,255,0.16)"/>

          {/* ── Head: fluffy orange-red ball with radiating feather spike tufts ── */}
          {/* Feather tufts behind head — 12 at 30° intervals */}
          {Array.from({ length: 12 }, (_, i) => {
            const ang = (i * 30 - 90) * (Math.PI / 180);
            const fx  = 24 + 17 * Math.cos(ang);
            const fy  = 24 + 17 * Math.sin(ang);
            return (
              <ellipse key={i}
                cx={fx} cy={fy} rx="3.2" ry="5.8"
                fill={i % 2 === 0 ? '#c82010' : '#e03820'}
                transform={`rotate(${i * 30} ${fx} ${fy})`}
              />
            );
          })}

          {/* Main head sphere */}
          <circle cx="24" cy="24" r="13.5" fill="#e04a1c"/>
          {/* Warm lit zone upper-left */}
          <circle cx="20" cy="19" r="8" fill="#f07030" opacity="0.55"/>
          {/* Specular */}
          <ellipse cx="18.5" cy="17" rx="4.5" ry="2.8" fill="rgba(255,255,255,0.34)" transform="rotate(-22 18.5 17)"/>
          {/* Chin shadow */}
          <ellipse cx="24" cy="34.5" rx="8" ry="3" fill="rgba(0,0,0,0.14)"/>

          {/* Eye */}
          <circle cx={eyX} cy="24" r="5" fill="white"/>
          <circle cx={eyX} cy="24" r="3.4" fill="#160800"/>
          <circle cx={eyX + (facingRight ? 0.8 : -0.8)} cy="22.5" r="1.3" fill="white"/>

          {/* Beak */}
          <path d={bkPath} fill="#e8c01a"/>
          <line x1={bkX} y1="26" x2={facingRight ? 37 : 11} y2="26" stroke="#c09c10" strokeWidth="1.3"/>

          {/* Top crest — small curved tuft */}
          <path d="M21,11 Q24,4 27,11" stroke="#b01808" strokeWidth="4" fill="none" strokeLinecap="round"/>
          <circle cx="24" cy="5" r="3" fill="#d02014"/>
          <circle cx="24" cy="5" r="1.2" fill="rgba(255,255,255,0.45)"/>
        </svg>
      );
    }

    /* ── DOCK — wooden pier with moored rowboat ─────────────────────────── */
    case 'DOCK': {
      const dg = g('dg'), dpst = g('dpst'), dbt = g('dbt');
      return (
        <svg viewBox="0 0 98 88" width="94" height="84" style={{ display: 'block' }}>
          <defs>
            <linearGradient id={dg} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor="#ddb468"/>
              <stop offset="100%" stopColor="#a07830"/>
            </linearGradient>
            <linearGradient id={dpst} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%"   stopColor="#cc9c48"/>
              <stop offset="100%" stopColor="#6a3c10"/>
            </linearGradient>
            <linearGradient id={dbt} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor="#e4c472"/>
              <stop offset="100%" stopColor="#96601c"/>
            </linearGradient>
          </defs>

          {/* Ground shadow */}
          <ellipse cx="49" cy="86" rx="44" ry="5" fill="rgba(0,0,0,0.20)"/>

          {/* ── Water ── */}
          <rect x="2" y="68" width="94" height="18" rx="3" fill="#1ab4e8"/>
          <path d="M4,73 Q14,70 26,73 Q38,76 50,73 Q62,70 74,73 Q86,76 94,73"
            stroke="rgba(160,235,255,0.55)" strokeWidth="1.6" fill="none"/>
          <path d="M2,79 Q16,76 30,79 Q44,82 58,79 Q72,76 92,79"
            stroke="rgba(160,235,255,0.38)" strokeWidth="1.3" fill="none"/>

          {/* ── Pilings (4 posts) ── */}
          <rect x="11" y="46" width="8" height="40" rx="3" fill={`url(#${dpst})`}/>
          <ellipse cx="15" cy="46" rx="4" ry="2" fill="#cc9c48"/>
          <rect x="79" y="46" width="8" height="40" rx="3" fill={`url(#${dpst})`}/>
          <ellipse cx="83" cy="46" rx="4" ry="2" fill="#cc9c48"/>
          <rect x="13" y="60" width="6" height="26" rx="2" fill="#7a4820"/>
          <rect x="79" y="60" width="6" height="26" rx="2" fill="#7a4820"/>

          {/* ── Deck planks ── */}
          {([46,51,56,61,66] as number[]).map((y, i) => (
            <rect key={i} x="11" y={y} width="76" height="5.5" rx="0.5"
              fill={i % 2 === 0 ? '#d2a050' : '#c49038'}
              stroke="#8a5820" strokeWidth="0.55"/>
          ))}
          {/* Deck side rails */}
          <rect x="11" y="46" width="3" height="25" fill="#7a4820"/>
          <rect x="84" y="46" width="3" height="25" fill="#7a4820"/>
          {/* Vertical plank joints */}
          {([30, 49, 67] as number[]).map(x => (
            <line key={x} x1={x} y1="46" x2={x} y2="70"
              stroke="#7a4820" strokeWidth="0.65" opacity="0.45"/>
          ))}

          {/* ── Flag pole (back-left) ── */}
          <rect x="14" y="5" width="4" height="43" rx="1.5" fill="#8a5e20"/>
          <path d="M14,5 L14,45" stroke="rgba(255,255,255,0.18)" strokeWidth="1.2" fill="none"/>
          {/* Pennant flag */}
          <path d="M18,6 L42,13 L18,22 Z" fill="#1d66d4"/>
          <path d="M20,12 Q28,10 38,14" stroke="rgba(160,220,255,0.70)" strokeWidth="1.4" fill="none"/>
          <path d="M20,17 Q26,15 32,18"  stroke="rgba(160,220,255,0.50)" strokeWidth="1.1" fill="none"/>
          {/* Sheen on flag */}
          <path d="M18,6 L24,8 L24,22 L18,22 Z" fill="rgba(255,255,255,0.10)"/>

          {/* ── Barrel (back-right) ── */}
          <ellipse cx="70" cy="45" rx="9.5" ry="3.5" fill="#8a5c28"/>
          <rect x="60.5" y="45" width="19" height="18" fill="#9e6c30"/>
          <ellipse cx="70" cy="63" rx="9.5" ry="3.5" fill="#7a4c1c"/>
          {([49.5, 55.5, 61] as number[]).map(y => (
            <ellipse key={y} cx="70" cy={y} rx="9.5" ry="3.5"
              fill="none" stroke="#2e1808" strokeWidth="2.0"/>
          ))}
          <path d="M63,46 Q62,54 63,63" stroke="rgba(255,255,255,0.22)"
            strokeWidth="2.5" fill="none" strokeLinecap="round"/>

          {/* ── Crate / storage box (centre-left deck) ── */}
          <rect x="30" y="48" width="18" height="15" rx="2" fill="#e0c468"/>
          <rect x="30" y="48" width="18" height="15" rx="2" fill="none"
            stroke="#9a7828" strokeWidth="1.2"/>
          <line x1="39" y1="48" x2="39" y2="63" stroke="#9a7828" strokeWidth="0.9"/>
          <line x1="30" y1="55" x2="48" y2="55" stroke="#9a7828" strokeWidth="0.9"/>
          <rect x="36" y="46.5" width="6" height="2.5" rx="1.2" fill="#c8a040"/>

          {/* ── Life preserver (right front post) ── */}
          <circle cx="83" cy="44" r="7.5" fill="white"/>
          <circle cx="83" cy="44" r="7.5" fill="none" stroke="#dd2020" strokeWidth="3.5"
            strokeDasharray="11.7 11.7"/>
          <circle cx="83" cy="44" r="3.2" fill="white"/>

          {/* ── Rowboat moored at front ── */}
          <ellipse cx="49" cy="82" rx="33" ry="5" fill="rgba(0,0,0,0.18)"/>
          {/* Hull */}
          <path d="M17,77 Q22,63 49,60 Q76,63 81,77 Q68,83 49,84 Q30,83 17,77Z"
            fill={`url(#${dbt})`}/>
          <path d="M17,77 Q22,63 49,60 Q76,63 81,77"
            stroke="#7a3e10" strokeWidth="1.8" fill="none"/>
          {/* Interior */}
          <path d="M22,76 Q27,66 49,64 Q71,66 76,76 Q65,79 49,80 Q33,79 22,76Z"
            fill="#d0a858"/>
          {/* Interior side shadow */}
          <path d="M22,76 Q24,68 29,65" stroke="rgba(0,0,0,0.14)" strokeWidth="2.5"
            fill="none" strokeLinecap="round"/>
          <path d="M76,76 Q74,68 69,65" stroke="rgba(0,0,0,0.14)" strokeWidth="2.5"
            fill="none" strokeLinecap="round"/>
          {/* Seat planks */}
          <rect x="36" y="66" width="26" height="3.5" rx="1" fill="#b89040"/>
          <rect x="33" y="71" width="32" height="3.5" rx="1" fill="#b89040"/>
          {/* Oars */}
          <path d="M21,77 Q10,74 3,70" stroke="#9a6830" strokeWidth="3.5"
            fill="none" strokeLinecap="round"/>
          <ellipse cx="2.5" cy="70" rx="5.5" ry="2.5" fill="#b88038"
            transform="rotate(-22 2.5 70)"/>
          <path d="M77,77 Q88,74 95,70" stroke="#9a6830" strokeWidth="3.5"
            fill="none" strokeLinecap="round"/>
          <ellipse cx="95.5" cy="70" rx="5.5" ry="2.5" fill="#b88038"
            transform="rotate(22 95.5 70)"/>
          {/* Mooring rope to dock */}
          <path d="M49,60 Q30,60 15,62" stroke="#c8a050" strokeWidth="1.3"
            fill="none" strokeLinecap="round" strokeDasharray="3 2"/>
        </svg>
      );
    }

    /* ── TALL ROCK — standing stone with weeds at the base ──────────────── */
    case 'TALL_ROCK': {
      const trg = g('trg'), trs = g('trs');
      const tlv = (tx * 11 + ty * 7) % 3;
      // Slight shape variant per tile: wider, narrower, or leaning
      const tw = tlv === 0 ? 26 : tlv === 1 ? 22 : 24;
      const th = tlv === 0 ? 48 : tlv === 1 ? 54 : 50;
      const lean = tlv === 0 ? -2 : tlv === 1 ? 2 : 0;
      // Grass colours
      const tgDark = '#1a6408', tgMid = '#268c10', tgFront = '#34aa18';
      const trb = (cx: number, by: number, h: number, l: number) =>
        `M ${cx},${by} Q ${cx + l * 0.5},${by - h * 0.55} ${cx + l},${by - h}`;
      // Stone centred at x=28, base at y=64
      const sx = 28 + lean, sy = 64 - th;
      return (
        <svg viewBox="0 0 56 70" width="52" height="66" style={{ display:'block' }}>
          <defs>
            <linearGradient id={trg} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%"   stopColor="#e2e2da"/>
              <stop offset="55%"  stopColor="#c4c4bc"/>
              <stop offset="100%" stopColor="#7a7a72"/>
            </linearGradient>
            <linearGradient id={trs} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor="rgba(255,255,255,0.35)"/>
              <stop offset="100%" stopColor="rgba(0,0,0,0.00)"/>
            </linearGradient>
          </defs>

          {/* Ground shadow */}
          <ellipse cx="28" cy="67" rx="18" ry="4" fill="rgba(0,0,0,0.24)"/>

          {/* Back grass blades */}
          <path d={trb(14, 64, 38, -3)} stroke={tgDark} strokeWidth="3.2" fill="none" strokeLinecap="round"/>
          <path d={trb(20, 64, 36, -1)} stroke={tgDark} strokeWidth="3.0" fill="none" strokeLinecap="round"/>
          <path d={trb(36, 64, 36,  2)} stroke={tgDark} strokeWidth="3.0" fill="none" strokeLinecap="round"/>
          <path d={trb(42, 64, 34,  3)} stroke={tgDark} strokeWidth="2.8" fill="none" strokeLinecap="round"/>

          {/* ── Standing stone body ── */}
          {/* Main face — rounded-rectangle shape */}
          <path
            d={`M ${sx - tw/2},${sy + 12} Q ${sx - tw/2},${sy} ${sx - tw/2 + 8},${sy - 4} Q ${sx},${sy - 8} ${sx + tw/2 - 8},${sy - 4} Q ${sx + tw/2},${sy} ${sx + tw/2},${sy + 12} L ${sx + tw/2},64 Q ${sx + tw/2 - 4},66 ${sx},66 Q ${sx - tw/2 + 4},66 ${sx - tw/2},64 Z`}
            fill={`url(#${trg})`}
          />
          {/* Top sheen overlay */}
          <path
            d={`M ${sx - tw/2},${sy + 12} Q ${sx - tw/2},${sy} ${sx - tw/2 + 8},${sy - 4} Q ${sx},${sy - 8} ${sx + tw/2 - 8},${sy - 4} Q ${sx + tw/2},${sy} ${sx + tw/2},${sy + 12} L ${sx + tw/2},${sy + 28} L ${sx - tw/2},${sy + 28} Z`}
            fill={`url(#${trs})`}
          />
          {/* Left specular streak */}
          <path
            d={`M ${sx - tw/2 + 4},${sy + 6} Q ${sx - tw/2 + 5},${sy + th * 0.45} ${sx - tw/2 + 4},${sy + th * 0.65}`}
            stroke="rgba(255,255,255,0.40)" strokeWidth="3.5" fill="none" strokeLinecap="round"
          />
          {/* Right shadow edge */}
          <path
            d={`M ${sx + tw/2 - 3},${sy + 8} L ${sx + tw/2 - 3},${sy + th - 6}`}
            stroke="rgba(0,0,0,0.18)" strokeWidth="3" fill="none" strokeLinecap="round"
          />
          {/* Crack 1 */}
          <path
            d={`M ${sx - 2},${sy + 10} Q ${sx},${sy + 20} ${sx - 3},${sy + 30}`}
            stroke="rgba(0,0,0,0.12)" strokeWidth="1.3" fill="none"
          />
          {/* Crack 2 */}
          <path
            d={`M ${sx + 5},${sy + 28} Q ${sx + 6},${sy + 38} ${sx + 4},${sy + 46}`}
            stroke="rgba(0,0,0,0.09)" strokeWidth="1.0" fill="none"
          />
          {/* Mossy band at base */}
          <ellipse cx={sx} cy="63" rx={tw / 2 - 1} ry="3" fill="#3a7e12" opacity="0.36"/>

          {/* Front grass blades (flanking the stone) */}
          <path d={trb(10, 64, 30, -4)} stroke={tgMid}   strokeWidth="2.8" fill="none" strokeLinecap="round"/>
          <path d={trb(16, 64, 28, -2)} stroke={tgFront} strokeWidth="2.6" fill="none" strokeLinecap="round"/>
          <path d={trb(38, 64, 28,  2)} stroke={tgFront} strokeWidth="2.6" fill="none" strokeLinecap="round"/>
          <path d={trb(44, 64, 26,  4)} stroke={tgMid}   strokeWidth="2.4" fill="none" strokeLinecap="round"/>
        </svg>
      );
    }

    /* ── PINEAPPLE PLANT ─────────────────────────────────────────────────── */
    case 'PINEAPPLE_PLANT': {
      return (
        <svg viewBox="0 0 60 62" width="56" height="58" style={{ display:'block' }}>
          <defs>
            <radialGradient id={g('pip')} cx="30%" cy="22%" r="72%">
              <stop offset="0%"   stopColor="#ffe250"/>
              <stop offset="52%"  stopColor="#d89a20"/>
              <stop offset="100%" stopColor="#8a6008"/>
            </radialGradient>
            <clipPath id={g('pc1')}><ellipse cx="22" cy="46" rx="9"   ry="12"/></clipPath>
            <clipPath id={g('pc2')}><ellipse cx="41" cy="42" rx="9.5" ry="13"/></clipPath>
          </defs>
          {/* Shadow */}
          <ellipse cx="30" cy="61" rx="23" ry="4.5" fill="rgba(0,0,0,0.22)"/>
          {/* Base leaf mass */}
          <ellipse cx="30" cy="48" rx="26" ry="16" fill="#1a7a0e"/>
          <ellipse cx="20" cy="50" rx="14" ry="11" fill="#187010"/>
          <ellipse cx="42" cy="50" rx="14" ry="11" fill="#1e8014"/>
          {/* ── Pineapple 1 — left, slightly behind ── */}
          <ellipse cx="22" cy="46" rx="9"   ry="12" fill={`url(#${g('pip')})`}/>
          <g clipPath={`url(#${g('pc1')})`}>
            {[34,38,42,46,50,54].map(y => (
              <line key={y} x1="11" y1={y} x2="33" y2={y} stroke="#7a5808" strokeWidth="1.1" opacity="0.55"/>
            ))}
            {[-8,-4,0,4,8,12].map(o => (
              <line key={o}      x1={15+o} y1="34" x2={7+o}  y2="58" stroke="#7a5808" strokeWidth="0.9" opacity="0.40"/>
            ))}
            {[-8,-4,0,4,8,12].map(o => (
              <line key={`r${o}`} x1={15+o} y1="34" x2={23+o} y2="58" stroke="#7a5808" strokeWidth="0.9" opacity="0.40"/>
            ))}
          </g>
          <ellipse cx="19" cy="40" rx="3" ry="5.5" fill="rgba(255,255,255,0.34)"/>
          {/* Crown 1 */}
          <path d="M22,34 L15,17" stroke="#1a7a0a" strokeWidth="3.2" fill="none" strokeLinecap="round"/>
          <path d="M22,34 L18,15" stroke="#228a14" strokeWidth="2.6" fill="none" strokeLinecap="round"/>
          <path d="M22,34 L22,13" stroke="#1a7a0a" strokeWidth="3.4" fill="none" strokeLinecap="round"/>
          <path d="M22,34 L26,15" stroke="#228a14" strokeWidth="2.6" fill="none" strokeLinecap="round"/>
          <path d="M22,34 L29,17" stroke="#1a7a0a" strokeWidth="3.2" fill="none" strokeLinecap="round"/>
          <path d="M22,34 L15,22" stroke="#2e9a1c" strokeWidth="2.0" fill="none" strokeLinecap="round"/>
          <path d="M22,34 L29,22" stroke="#2e9a1c" strokeWidth="2.0" fill="none" strokeLinecap="round"/>
          <path d="M15,17 L13,14" stroke="#4ab830" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
          <path d="M22,13 L22,10" stroke="#4ab830" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
          <path d="M29,17 L31,14" stroke="#4ab830" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
          {/* ── Pineapple 2 — right, front, larger ── */}
          <ellipse cx="41" cy="42" rx="9.5" ry="13" fill={`url(#${g('pip')})`}/>
          <g clipPath={`url(#${g('pc2')})`}>
            {[29,33,37,41,45,49,53].map(y => (
              <line key={y} x1="30" y1={y} x2="52" y2={y} stroke="#7a5808" strokeWidth="1.1" opacity="0.55"/>
            ))}
            {[-8,-4,0,4,8,12].map(o => (
              <line key={o}      x1={34+o} y1="29" x2={26+o} y2="55" stroke="#7a5808" strokeWidth="0.9" opacity="0.40"/>
            ))}
            {[-8,-4,0,4,8,12].map(o => (
              <line key={`r${o}`} x1={34+o} y1="29" x2={42+o} y2="55" stroke="#7a5808" strokeWidth="0.9" opacity="0.40"/>
            ))}
          </g>
          <ellipse cx="38" cy="35" rx="3.2" ry="6" fill="rgba(255,255,255,0.36)"/>
          {/* Crown 2 */}
          <path d="M41,29 L34,12" stroke="#1a7a0a" strokeWidth="3.5" fill="none" strokeLinecap="round"/>
          <path d="M41,29 L37,10" stroke="#228a14" strokeWidth="3.0" fill="none" strokeLinecap="round"/>
          <path d="M41,29 L41,8"  stroke="#1a7a0a" strokeWidth="3.8" fill="none" strokeLinecap="round"/>
          <path d="M41,29 L45,10" stroke="#228a14" strokeWidth="3.0" fill="none" strokeLinecap="round"/>
          <path d="M41,29 L48,12" stroke="#1a7a0a" strokeWidth="3.5" fill="none" strokeLinecap="round"/>
          <path d="M41,29 L33,19" stroke="#2e9a1c" strokeWidth="2.2" fill="none" strokeLinecap="round"/>
          <path d="M41,29 L49,19" stroke="#2e9a1c" strokeWidth="2.2" fill="none" strokeLinecap="round"/>
          <path d="M34,12 L32,9"  stroke="#4ab830" strokeWidth="1.9" fill="none" strokeLinecap="round"/>
          <path d="M41,8  L41,5"  stroke="#4ab830" strokeWidth="2.0" fill="none" strokeLinecap="round"/>
          <path d="M48,12 L50,9"  stroke="#4ab830" strokeWidth="1.9" fill="none" strokeLinecap="round"/>
        </svg>
      );
    }

    default: return null;
  }
};

/** Trees that trigger the axe-chop hint on hover */
const CHOP_TREES = new Set(['TREE_PALM', 'TREE_APPLE']);

/** Objects that use SVG art instead of emoji */
const SVG_OBJECTS = new Set(['TREE_PALM', 'TREE_APPLE', 'ROCK', 'FLOWER_BUSH', 'DRIFTWOOD',
  'TREE_COCONUT', 'TREE_MANGO', 'TREE_COCONUT_UNRIPE', 'TREE_MANGO_UNRIPE',
  'GARDEN_PATCH', 'WEEDS', 'SUNFLOWER', 'PUDDLE', 'THORNS',
  'BLUEBELL', 'PANSY', 'TULIP', 'PINEAPPLE_PLANT', 'BLUEBERRY_BUSH', 'BABY_PARROT', 'TALL_ROCK', 'DOCK']);
/** Objects that sway in the breeze */
const SWAY_OBJECTS = new Set(['TREE_PALM', 'TREE_APPLE', 'TREE_COCONUT', 'TREE_MANGO', 'TREE_COCONUT_UNRIPE', 'TREE_MANGO_UNRIPE']);

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
      // colours range from pale cream (#ede4c8) to warm buff (#dcd0b0)
      const sand = tileRng(tx, ty, base + 53) > 0.5 ? '#e8dcc0' : '#dcd0aa';
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
  playerX?: number;
  playerY?: number;
  tile: TileData;
  /** Pixel X of tile top-point in world space */
  screenX: number;
  /** Pixel Y of tile top-point in world space */
  screenY: number;
  /** CSS z-index (= (tile.x + tile.y) * 2) */
  tileZIndex: number;
  isDangerZone?: boolean;
  onTileClick?: (x: number, y: number, interactTileId?: string) => void;
  /** Tile types of the 4 cardinal neighbours (undefined = outside map = water) */
  nbN?: string; nbE?: string; nbS?: string; nbW?: string;
}

/* ── IslandTile ─────────────────────────────────────────────────────────── */
export const IslandTile: React.FC<IslandTileProps> = ({
  tile, screenX, screenY, tileZIndex, isDangerZone, onTileClick,
  nbN, nbE, nbS, nbW,
  playerX = 0, playerY = 0,
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
    if (activeTool === 'plant') {
      onTileClick?.(tile.x, tile.y);
      plant(tile.id);
    } else if (activeTool === 'build' && activeBuildItem) {
      onTileClick?.(tile.x, tile.y);
      place(tile.id, activeBuildItem);
    } else {
      // Clear / harvest: require the player to be adjacent before interacting.
      const chebyshev = Math.max(Math.abs(tile.x - playerX), Math.abs(tile.y - playerY));
      const hasInteractable = !!(tile.object && OBJECT_CONFIG[tile.object]);
      if (chebyshev <= 1.5) {
        // Already next to the tile — interact right away (walk nudge optional)
        onTileClick?.(tile.x, tile.y);
        interact(tile.id);
      } else {
        // Too far — walk there first; the game loop fires interact on arrival
        onTileClick?.(tile.x, tile.y, hasInteractable ? tile.id : undefined);
      }
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
        cursor: (isWater && tile.object !== 'DOCK') ? 'default' : 'pointer',
      }}
      onClick={(isWater && tile.object !== 'DOCK') ? undefined : handleClick}
      onMouseEnter={() => !(isWater && tile.object !== 'DOCK') && setHovered(true)}
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
            sL = '#d4c49a'; sR = '#dccca4';
          } else {
            // GRASS — medium bright green matching reference
            hi = [0x70, 0xd0, 0x30]; lo = [0x3a, 0x90, 0x10];
            sL = '#2e8008'; sR = '#3a9810';
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
                  <stop offset="0%"   stopColor="#f8f2e0"/>
                  <stop offset="100%" stopColor="#e8dcc4"/>
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
                  <circle cx="2"  cy="3"   r="0.9" fill="rgba(160,130,90,0.13)"/>
                  <circle cx="7"  cy="8"   r="0.8" fill="rgba(170,140,95,0.10)"/>
                  <circle cx="12" cy="2"   r="0.9" fill="rgba(155,125,85,0.12)"/>
                  <circle cx="5"  cy="10"  r="0.7" fill="rgba(165,132,90,0.09)"/>
                  <circle cx="14" cy="7"   r="0.8" fill="rgba(158,128,88,0.10)"/>
                  <circle cx="9"  cy="4.5" r="0.7" fill="rgba(150,122,84,0.11)"/>
                  <circle cx="3"  cy="7"   r="0.8" fill="rgba(172,138,92,0.08)"/>
                  <circle cx="11" cy="9.5" r="0.7" fill="rgba(162,130,88,0.09)"/>
                  {/* subtle wind-ripple lines */}
                  <path d="M0,9 Q4,7.5 8,9 Q12,10.5 16,9"
                        stroke="rgba(148,118,80,0.07)" strokeWidth="0.7" fill="none"/>
                  <path d="M0,4.5 Q4,3 8,4.5 Q12,6 16,4.5"
                        stroke="rgba(148,118,80,0.05)" strokeWidth="0.6" fill="none"/>
                </pattern>
              )}
              {/* Grass — subtle organic mottling, no blades */}
              {isGrass && (
                <pattern id={gpid} x="0" y="0" width="20" height="16" patternUnits="userSpaceOnUse">
                  {/* Slightly darker blobs */}
                  <ellipse cx="3"  cy="4"  rx="4.5" ry="3.5" fill="rgba(0,60,0,0.07)"/>
                  <ellipse cx="13" cy="3"  rx="5"   ry="3"   fill="rgba(0,60,0,0.06)"/>
                  <ellipse cx="8"  cy="10" rx="5.5" ry="3.5" fill="rgba(0,60,0,0.07)"/>
                  <ellipse cx="18" cy="11" rx="4"   ry="3"   fill="rgba(0,60,0,0.05)"/>
                  <ellipse cx="1"  cy="13" rx="3.5" ry="2.5" fill="rgba(0,60,0,0.06)"/>
                  {/* Slightly lighter highlights */}
                  <ellipse cx="6"  cy="7"  rx="3.5" ry="2.5" fill="rgba(255,255,255,0.06)"/>
                  <ellipse cx="16" cy="7"  rx="4"   ry="2.5" fill="rgba(255,255,255,0.05)"/>
                  <ellipse cx="11" cy="14" rx="3"   ry="2"   fill="rgba(255,255,255,0.05)"/>
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

        {/* ── Terrain edge blends ─────────────────────────────────────────────
            For each edge where the neighbour is a different terrain type, draw
            a gradient-filled triangle (one quarter of the diamond) that bleeds
            the neighbour's colour onto this tile from that shared edge inward.
            Diamond vertices: top (40,-1)  right (81,14)  bot (40,29)  left (-1,14)
            Centre: (40,14).  Edge midpoints used as gradient start:
              NW (nbN) = (19.5,6.5)   NE (nbE) = (60.5,6.5)
              SW (nbW) = (19.5,21.5)  SE (nbS) = (60.5,21.5)           ── */}
        {(() => {
          const myType = isCleared ? 'CLEARED' : tile.type;
          const edges = [
            { dir:'NW', nb:nbN, pts:'40,-1 -1,14 40,14',  ex:19.5, ey:6.5  },
            { dir:'NE', nb:nbE, pts:'40,-1 81,14 40,14',  ex:60.5, ey:6.5  },
            { dir:'SW', nb:nbW, pts:'-1,14 40,29 40,14',  ex:19.5, ey:21.5 },
            { dir:'SE', nb:nbS, pts:'81,14 40,29 40,14',  ex:60.5, ey:21.5 },
          ] as const;

          // RGB string for the terrain colour to bleed onto this tile.
          // undefined = outside map boundary, treated the same as WATER.
          const blendRgb = (t?: string): string | null => {
            const resolved = t ?? 'WATER'; // outside map = ocean
            if (resolved === myType) return null;
            if (resolved === 'WATER') return '28,152,215';
            if (resolved === 'SAND')  return '232,214,168';
            if (resolved === 'GRASS') return '78,186,34';
            return null;
          };

          return edges.map(({ dir, nb, pts, ex, ey }) => {
            const rgb = blendRgb(nb);
            if (!rgb) return null;
            // Water↔land transitions are stronger; sand↔grass are subtler
            const op = (nb === 'WATER' || myType === 'WATER') ? 0.52 : 0.40;
            const gid = `tb-${dir}-${tile.x}-${tile.y}`;
            return (
              <React.Fragment key={dir}>
                <defs>
                  <linearGradient id={gid} gradientUnits="userSpaceOnUse"
                    x1={ex} y1={ey} x2={40} y2={14}>
                    <stop offset="0%"  stopColor={`rgb(${rgb})`} stopOpacity={op}/>
                    <stop offset="82%" stopColor={`rgb(${rgb})`} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <polygon points={pts} fill={`url(#${gid})`}/>
              </React.Fragment>
            );
          });
        })()}

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
            <ObjectSVG object={tile.object} tileX={tile.x} tileY={tile.y} tileType={tile.type}/>
          </div>
        </div>
      )}

      {/* ── Axe badge: shown when hovering a choppable tree with the clear tool ── */}
      {hovered && activeTool === 'clear' && tile.object && CHOP_TREES.has(tile.object) && (
        <div
          style={{
            position: 'absolute',
            left: '68%',
            top: -42,
            transform: 'translateX(-50%)',
            pointerEvents: 'none',
            background: 'rgba(255,250,240,0.94)',
            borderRadius: '50%',
            width: 36,
            height: 36,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.38)',
            border: '2.5px solid #c08840',
            animation: 'axe-pop 0.14s ease-out',
            zIndex: tileZIndex + 10,
          }}
        >
          <svg viewBox="0 0 30 30" width="22" height="22">
            <path d="M27,4 Q26,6 21,13 L16,21 Q14,24 13,26" stroke="#7a4e1c" strokeWidth="4.5" fill="none" strokeLinecap="round"/>
            <path d="M27,4 Q26,6 21,13 L16,21 Q14,24 13,26" stroke="#c08840" strokeWidth="2.5" fill="none" strokeLinecap="round" opacity="0.55"/>
            <path d="M8,3 Q4,5 3,10 Q2,16 5,20 Q8,25 13,21 Q18,23 20,15 Q22,8 16,5 Q12,3 8,3Z" fill="#8898B4"/>
            <path d="M8,3 Q4,5 3,10 Q2,16 5,20 Q8,25 13,21" stroke="#6070A0" strokeWidth="1.1" fill="none" opacity="0.7"/>
            <path d="M9.5,5.5 Q7,9 7,15" stroke="rgba(210,225,255,0.55)" strokeWidth="2.2" fill="none" strokeLinecap="round"/>
          </svg>
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

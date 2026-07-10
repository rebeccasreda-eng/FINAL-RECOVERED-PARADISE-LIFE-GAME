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

/* ── SVG art for natural objects (matches HTML reference style) ─────────── */
const PETAL_COLORS = ['#e8628a', '#f2c94c', '#8a5ad4'];

const ObjectSVG: React.FC<{ object: string; tileX: number; tileY: number }> = ({ object, tileX, tileY }) => {
  switch (object) {
    case 'TREE_PALM':
      return (
        <svg viewBox="0 0 54 80" width="54" height="80" style={{ display: 'block' }}>
          <rect x="24" y="40" width="6" height="34" fill="#8a5a2b"/>
          <ellipse cx="27" cy="30" rx="22" ry="16" fill="#3f8a3a"/>
          <ellipse cx="15" cy="24" rx="14" ry="11" fill="#4aa044"/>
          <ellipse cx="39" cy="24" rx="14" ry="11" fill="#4aa044"/>
          <ellipse cx="27" cy="20" rx="11" ry="8" fill="#55b04e"/>
        </svg>
      );
    case 'TREE_APPLE':
      return (
        <svg viewBox="0 0 54 80" width="54" height="80" style={{ display: 'block' }}>
          <rect x="24" y="40" width="6" height="34" fill="#7a5025"/>
          <ellipse cx="27" cy="28" rx="22" ry="18" fill="#3a8840"/>
          <ellipse cx="15" cy="22" rx="13" ry="10" fill="#4aaa4a"/>
          <ellipse cx="39" cy="22" rx="13" ry="10" fill="#4aaa4a"/>
          <ellipse cx="27" cy="18" rx="10" ry="7" fill="#55b455"/>
          {/* Apples */}
          <circle cx="18" cy="30" r="4.5" fill="#dd3322"/>
          <circle cx="36" cy="28" r="4.5" fill="#dd3322"/>
          <circle cx="27" cy="34" r="4" fill="#cc2211"/>
          <circle cx="19" cy="30.5" r="1.5" fill="rgba(255,255,255,0.4)"/>
          <circle cx="37" cy="28.5" r="1.5" fill="rgba(255,255,255,0.4)"/>
        </svg>
      );
    case 'ROCK':
      return (
        <svg viewBox="0 0 36 26" width="36" height="26" style={{ display: 'block' }}>
          <ellipse cx="18" cy="16" rx="17" ry="10" fill="#8a8a82"/>
          <ellipse cx="18" cy="14" rx="15" ry="8" fill="#9a9a92"/>
          <ellipse cx="13" cy="11" rx="7" ry="5" fill="#b0b0a8"/>
          <ellipse cx="24" cy="13" rx="4" ry="3" fill="#a8a8a0"/>
        </svg>
      );
    case 'FLOWER_BUSH': {
      const petal = PETAL_COLORS[(tileX * 7 + tileY * 13) % 3];
      return (
        <svg viewBox="0 0 28 28" width="28" height="28" style={{ display: 'block' }}>
          {/* Stem/leaves */}
          <ellipse cx="14" cy="22" rx="8" ry="4" fill="#3a8a2a" opacity="0.7"/>
          {/* Petals */}
          <circle cx="14" cy="10" r="4" fill={petal}/>
          <circle cx="9"  cy="14" r="4" fill={petal}/>
          <circle cx="19" cy="14" r="4" fill={petal}/>
          <circle cx="9"  cy="8"  r="3.5" fill={petal}/>
          <circle cx="19" cy="8"  r="3.5" fill={petal}/>
          {/* Centre */}
          <circle cx="14" cy="13" r="4" fill="#f2c94c"/>
          <circle cx="14" cy="12" r="2" fill="#e8b820"/>
        </svg>
      );
    }
    case 'DRIFTWOOD':
      return (
        <svg viewBox="0 0 38 18" width="38" height="18" style={{ display: 'block' }}>
          <rect x="0" y="5" width="38" height="6" rx="3" fill="#a9884f"/>
          <rect x="4" y="0" width="30" height="5" rx="2" fill="#c9a86a"/>
          <rect x="8" y="11" width="22" height="4" rx="2" fill="#8a6a3a"/>
          {/* Wood grain */}
          <line x1="10" y1="2" x2="16" y2="2" stroke="#b09050" strokeWidth="1" opacity="0.5"/>
          <line x1="22" y1="2" x2="30" y2="2" stroke="#b09050" strokeWidth="1" opacity="0.5"/>
        </svg>
      );
    case 'TREE_COCONUT':
      return (
        <svg viewBox="0 0 62 100" width="58" height="93" style={{ display: 'block' }}>
          {/* Trunk shadow */}
          <ellipse cx="31" cy="97" rx="10" ry="3.5" fill="#000" opacity="0.16"/>
          {/* Trunk — narrows toward crown */}
          <path d="M27,94 Q28,74 30,52 L32,52 Q34,74 35,94Z" fill="#8b5e28"/>
          {/* Trunk ring segments */}
          <ellipse cx="31" cy="59" rx="4"   ry="2"   fill="#5a3810" opacity="0.65"/>
          <ellipse cx="31" cy="66" rx="3.8" ry="1.9" fill="#5a3810" opacity="0.65"/>
          <ellipse cx="31" cy="73" rx="3.6" ry="1.8" fill="#5a3810" opacity="0.65"/>
          <ellipse cx="31" cy="80" rx="3.4" ry="1.7" fill="#5a3810" opacity="0.65"/>
          <ellipse cx="31" cy="87" rx="3.2" ry="1.6" fill="#5a3810" opacity="0.65"/>
          {/* Fronds — thick bezier curves drooping from crown (31,50) */}
          {/* far-left droop */}
          <path d="M31,50 Q12,56  2,62" stroke="#1a5e10" strokeWidth="11" fill="none" strokeLinecap="round" opacity="0.88"/>
          {/* far-right droop */}
          <path d="M31,50 Q50,56 60,62" stroke="#1a5e10" strokeWidth="11" fill="none" strokeLinecap="round" opacity="0.88"/>
          {/* left-mid */}
          <path d="M31,48 Q10,43  2,30" stroke="#226618" strokeWidth="10" fill="none" strokeLinecap="round"/>
          {/* right-mid */}
          <path d="M31,48 Q52,43 60,30" stroke="#226618" strokeWidth="10" fill="none" strokeLinecap="round"/>
          {/* upper-left */}
          <path d="M31,46 Q14,32  8,14" stroke="#2c7e20" strokeWidth="9"  fill="none" strokeLinecap="round"/>
          {/* upper-right */}
          <path d="M31,46 Q48,32 54,14" stroke="#2c7e20" strokeWidth="9"  fill="none" strokeLinecap="round"/>
          {/* top-left */}
          <path d="M31,44 Q22,24 18,6"  stroke="#369830" strokeWidth="8"  fill="none" strokeLinecap="round"/>
          {/* top-right */}
          <path d="M31,44 Q40,24 44,6"  stroke="#369830" strokeWidth="8"  fill="none" strokeLinecap="round"/>
          {/* centre top */}
          <path d="M31,42 Q31,22 31,4"  stroke="#40aa38" strokeWidth="7"  fill="none" strokeLinecap="round"/>
          {/* Crown cap */}
          <circle cx="31" cy="48" r="10" fill="#1a5e10"/>
          <circle cx="31" cy="46" r="7"  fill="#226618"/>
        </svg>
      );
    case 'TREE_MANGO':
      return (
        <svg viewBox="0 0 68 84" width="62" height="76" style={{ display: 'block' }}>
          {/* Shadow */}
          <ellipse cx="34" cy="81" rx="16" ry="4.5" fill="#000" opacity="0.16"/>
          {/* Trunk */}
          <rect x="29" y="50" width="10" height="30" rx="4" fill="#6b4520"/>
          {/* Bark grooves */}
          <path d="M30,57 Q34,56 38,57" stroke="#4a3010" strokeWidth="1.5" fill="none" opacity="0.5"/>
          <path d="M30,65 Q34,64 38,65" stroke="#4a3010" strokeWidth="1.5" fill="none" opacity="0.5"/>
          <path d="M30,73 Q34,72 38,73" stroke="#4a3010" strokeWidth="1.5" fill="none" opacity="0.5"/>
          {/* Canopy — layered ellipses for depth and fullness */}
          <ellipse cx="34" cy="40" rx="30" ry="24" fill="#1a5c0e"/>
          <ellipse cx="14" cy="44" rx="15" ry="12" fill="#206014"/>
          <ellipse cx="54" cy="44" rx="15" ry="12" fill="#206014"/>
          <ellipse cx="34" cy="30" rx="26" ry="21" fill="#267018"/>
          <ellipse cx="16" cy="36" rx="15" ry="12" fill="#2c7c1e"/>
          <ellipse cx="52" cy="36" rx="15" ry="12" fill="#2c7c1e"/>
          <ellipse cx="34" cy="22" rx="22" ry="18" fill="#349024"/>
          <ellipse cx="20" cy="26" rx="13" ry="10" fill="#3ea02c"/>
          <ellipse cx="48" cy="26" rx="13" ry="10" fill="#3ea02c"/>
          <ellipse cx="34" cy="17" rx="16" ry="13" fill="#48b030"/>
          {/* Canopy highlight */}
          <ellipse cx="26" cy="14" rx="8"  ry="6"  fill="#5ec840" opacity="0.32"/>
          {/* Mango fruits — plump yellow ovals with a glint */}
          <ellipse cx="15" cy="44" rx="6"   ry="8"   fill="#f0be14" transform="rotate(-22,15,44)"/>
          <ellipse cx="13" cy="43" rx="2.5" ry="3.5" fill="#ffe05a" opacity="0.55" transform="rotate(-22,13,43)"/>
          <ellipse cx="32" cy="48" rx="6"   ry="8"   fill="#e8b610" transform="rotate(12,32,48)"/>
          <ellipse cx="30" cy="47" rx="2.5" ry="3.5" fill="#ffde50" opacity="0.55" transform="rotate(12,30,47)"/>
          <ellipse cx="49" cy="44" rx="6"   ry="8"   fill="#f0c018" transform="rotate(22,49,44)"/>
          <ellipse cx="47" cy="43" rx="2.5" ry="3.5" fill="#ffdc55" opacity="0.55" transform="rotate(22,47,43)"/>
          <ellipse cx="21" cy="35" rx="5"   ry="7"   fill="#e8b812" transform="rotate(-15,21,35)"/>
          <ellipse cx="48" cy="35" rx="5"   ry="7"   fill="#f0c01a" transform="rotate(15,48,35)"/>
          <ellipse cx="34" cy="38" rx="5"   ry="6.5" fill="#eeba14" transform="rotate(5,34,38)"/>
        </svg>
      );
    case 'GARDEN_PATCH':
      return (
        <svg viewBox="0 0 70 58" width="64" height="53" style={{ display: 'block' }}>
          {/* Ground bed */}
          <rect x="2"  y="24" width="66" height="30" rx="5" fill="#4a8a24"/>
          {/* ── Fence ── */}
          {/* Vertical posts */}
          <rect x="3"  y="20" width="5" height="34" rx="1.5" fill="#b88040"/>
          <rect x="22" y="20" width="5" height="34" rx="1.5" fill="#b88040"/>
          <rect x="42" y="20" width="5" height="34" rx="1.5" fill="#b88040"/>
          <rect x="62" y="20" width="5" height="34" rx="1.5" fill="#b88040"/>
          {/* Horizontal rails — back pair */}
          <rect x="3" y="22" width="64" height="4" rx="1.5" fill="#c8a464"/>
          <rect x="3" y="29" width="64" height="3.5" rx="1.5" fill="#ba9454"/>
          {/* Horizontal rails — front pair */}
          <rect x="3" y="38" width="64" height="4" rx="1.5" fill="#c8a464"/>
          <rect x="3" y="45" width="64" height="3.5" rx="1.5" fill="#ba9454"/>
          {/* ── Blueberries (left cell) ── */}
          <circle cx="10" cy="30" r="5"   fill="#3d58d0"/>
          <circle cx="17" cy="32" r="4.5" fill="#4666d8"/>
          <circle cx="9"  cy="36" r="4.5" fill="#3350c8"/>
          <circle cx="16" cy="27" r="4"   fill="#4a6add"/>
          <circle cx="9"  cy="43" r="4.5" fill="#3d58d0"/>
          <circle cx="16" cy="41" r="4"   fill="#4462cc"/>
          {/* Glints on berries */}
          <circle cx="8"  cy="28" r="1.5" fill="#aabbff" opacity="0.6"/>
          <circle cx="15" cy="30" r="1.2" fill="#aabbff" opacity="0.6"/>
          {/* Leaf base */}
          <ellipse cx="12" cy="48" rx="9" ry="3.5" fill="#2a6a18" opacity="0.7"/>
          {/* ── Pineapples (centre cell) ── */}
          {/* Pineapple A */}
          <ellipse cx="30" cy="41" rx="5.5" ry="8" fill="#d4a018"/>
          <line x1="25.5" y1="35" x2="34.5" y2="35" stroke="#9a7210" strokeWidth="1.3" opacity="0.75"/>
          <line x1="25.5" y1="38" x2="34.5" y2="38" stroke="#9a7210" strokeWidth="1.3" opacity="0.75"/>
          <line x1="25.5" y1="41" x2="34.5" y2="41" stroke="#9a7210" strokeWidth="1.3" opacity="0.75"/>
          <line x1="25.5" y1="44" x2="34.5" y2="44" stroke="#9a7210" strokeWidth="1.3" opacity="0.75"/>
          <line x1="25.5" y1="47" x2="34.5" y2="47" stroke="#9a7210" strokeWidth="1.3" opacity="0.75"/>
          {/* Pineapple A crown */}
          <path d="M30,33 L25,24 M30,33 L30,22 M30,33 L35,24 M30,33 L22,26 M30,33 L38,26"
                stroke="#2e8020" strokeWidth="2.8" fill="none" strokeLinecap="round"/>
          {/* Pineapple B */}
          <ellipse cx="44" cy="40" rx="5.5" ry="8" fill="#e0aa18"/>
          <line x1="39.5" y1="34" x2="48.5" y2="34" stroke="#9a7210" strokeWidth="1.3" opacity="0.75"/>
          <line x1="39.5" y1="37" x2="48.5" y2="37" stroke="#9a7210" strokeWidth="1.3" opacity="0.75"/>
          <line x1="39.5" y1="40" x2="48.5" y2="40" stroke="#9a7210" strokeWidth="1.3" opacity="0.75"/>
          <line x1="39.5" y1="43" x2="48.5" y2="43" stroke="#9a7210" strokeWidth="1.3" opacity="0.75"/>
          <line x1="39.5" y1="46" x2="48.5" y2="46" stroke="#9a7210" strokeWidth="1.3" opacity="0.75"/>
          <path d="M44,32 L39,23 M44,32 L44,21 M44,32 L49,23 M44,32 L36,25 M44,32 L52,25"
                stroke="#2e8020" strokeWidth="2.8" fill="none" strokeLinecap="round"/>
          {/* ── White flowers (right cell) ── */}
          {[{cx:56,cy:29,r:4.5},{cx:63,cy:32,r:4},{cx:55,cy:36,r:4},{cx:62,cy:38,r:4.5},{cx:56,cy:43,r:4},{cx:63,cy:44,r:3.5}]
            .map((f,i) => (
              <g key={i}>
                <circle cx={f.cx} cy={f.cy} r={f.r} fill="#f6f6ff"/>
                <circle cx={f.cx} cy={f.cy} r={f.r * 0.36} fill="#f0c820"/>
              </g>
            ))
          }
          {/* Leaf base for flowers */}
          <ellipse cx="59" cy="49" rx="9" ry="3.5" fill="#2a6a18" opacity="0.7"/>
        </svg>
      );
    default:
      return null;
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
        {/* Water gradient + clip defs — unique IDs per tile */}
        {isWater && (() => {
          const gid = `wg-${tile.x}-${tile.y}`;
          const cid = `wc-${tile.x}-${tile.y}`;
          /* Wave positions: stagger by tile coords so adjacent tiles feel connected */
          const phase = (tile.x * 5 + tile.y * 3) % 8;
          const y1 = 7  + phase * 0.4;
          const y2 = 18 + phase * 0.25;
          return (
            <defs>
              {/* Depth gradient: light sky-cyan top-left → vivid tropical center → deep edge */}
              <linearGradient id={gid} x1="15%" y1="0%" x2="85%" y2="100%">
                <stop offset="0%"   stopColor="#82DCF8" />
                <stop offset="40%"  stopColor="#52C8E4" />
                <stop offset="100%" stopColor="#30B0D2" />
              </linearGradient>
              {/* Clip to diamond so wave strokes don't bleed outside */}
              <clipPath id={cid}>
                <polygon points="40,0 80,14 40,28 0,14" />
              </clipPath>
            </defs>
          );
        })()}

        {/* Top face */}
        <polygon
          points="40,0 80,14 40,28 0,14"
          fill={isWater ? `url(#wg-${tile.x}-${tile.y})` : topFill}
          stroke={isWater ? 'none' : 'rgba(0,0,0,0.12)'}
          strokeWidth="1"
          strokeLinejoin="round"
        />

        {/* Side faces (land tiles only) */}
        {!isWater && palette.sideL && (
          <>
            <polygon points="0,14 40,28 40,38 0,24"   fill={palette.sideL} />
            <polygon points="80,14 40,28 40,38 80,24"  fill={palette.sideR!} />
          </>
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
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: 14,          // diamond vertical centre (TH/2 = 28/2)
            transform: 'translate(-50%, -100%)',
            pointerEvents: 'none',
            userSelect: 'none',
            filter: 'drop-shadow(0 3px 5px rgba(0,0,0,0.38))',
            animation: doSway ? 'treeSway 2.8s ease-in-out infinite alternate' : undefined,
            transformOrigin: 'bottom center',
          }}
        >
          <ObjectSVG object={tile.object} tileX={tile.x} tileY={tile.y}/>
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

import React, { useState, useEffect } from 'react';
import { useGame } from '../game/GameContext';
import { TileData } from '../game/types';
import { OBJECT_CONFIG, EMOJI_MAP, CROP_TYPES } from '../game/gameData';
import { useToast } from '@/hooks/use-toast';

/* ── Diamond colour palette — matches HTML reference ────────────────────── */
const COLORS = {
  GRASS:   { top: '#5aab3e', sideL: '#3f8a2a', sideR: '#4a9e32' },
  SAND:    { top: '#e8d29a', sideL: '#cdb277', sideR: '#d4b97f' },
  WATER:   { top: '#3f8fc9', sideL: null,       sideR: null      },
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
    default:
      return null;
  }
};

/** Objects that use SVG art instead of emoji */
const SVG_OBJECTS = new Set(['TREE_PALM', 'TREE_APPLE', 'ROCK', 'FLOWER_BUSH', 'DRIFTWOOD']);
/** Objects that sway in the breeze */
const SWAY_OBJECTS = new Set(['TREE_PALM', 'TREE_APPLE']);

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
    floatingTexts, setNeighborVisitPrompt,
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
  const isWater    = tile.type === 'WATER';
  const isCleared  = tile.object === 'CLEARED_LAND' || tile.object === 'CROP_PLOT';
  const isNeighbor = !!(state.visitingNeighbor && state.visitingNeighbor.tileId === tile.id);
  const neighbor   = isNeighbor
    ? state.neighbors.find(n => n.id === state.visitingNeighbor!.neighborId)
    : null;

  /* ── Diamond colours ── */
  const palette = isCleared ? COLORS.CLEARED : (COLORS[tile.type] ?? COLORS.GRASS);

  let topFill = palette.top;
  if (!isWater && hovered) {
    if (activeTool === 'plant' && isCleared)      topFill = '#6acd5a';
    else if (activeTool === 'build' && isCleared) topFill = '#6aabdd';
    else                                           topFill = lightenHex(palette.top);
  }

  /* ── Object rendering — SVG art or emoji ── */
  const hasSvg  = !isCleared && !isNeighbor && tile.object && SVG_OBJECTS.has(tile.object);
  const doSway  = hasSvg && tile.object && SWAY_OBJECTS.has(tile.object);

  let emoji = '';
  if (!hasSvg && tile.object && !isCleared) {
    if (tile.object === 'CROP_READY' && tile.cropType && CROP_TYPES[tile.cropType]) {
      emoji = CROP_TYPES[tile.cropType].emoji;
    } else {
      emoji = EMOJI_MAP[tile.object] || '';
    }
  }
  if (isNeighbor && neighbor) emoji = neighbor.avatar;

  /* ── Crop timer ── */
  let badgeText    = '';
  let progressPct  = 0;
  if ((tile.object === 'CROP_GROWING' || tile.object === 'CROP_READY') && tile.placedAt && tile.cropType) {
    const cc       = CROP_TYPES[tile.cropType];
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
        width: 64,
        height: 48,
        // Centre horizontally on screenX; top of diamond at screenY
        transform: 'translate(-50%, 0)',
        zIndex: tileZIndex,
        cursor: isWater ? 'default' : 'pointer',
      }}
      onClick={isWater ? undefined : isNeighbor ? () => setNeighborVisitPrompt(true) : handleClick}
      onMouseEnter={() => !isWater && setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      title={tooltip}
    >

      {/* ── SVG diamond ground ──────────────────────────── */}
      <svg
        viewBox="0 0 64 48"
        style={{ width: 64, height: 48, display: 'block', overflow: 'visible' }}
      >
        {/* Top face */}
        <polygon
          points="32,0 64,16 32,32 0,16"
          fill={topFill}
          stroke="rgba(0,0,0,0.12)"
          strokeWidth="1"
          strokeLinejoin="round"
        />

        {/* Side faces (land tiles only) */}
        {!isWater && palette.sideL && (
          <>
            <polygon points="0,16 32,32 32,42 0,26"   fill={palette.sideL} />
            <polygon points="64,16 32,32 32,42 64,26"  fill={palette.sideR!} />
          </>
        )}

        {/* Water shimmer highlight */}
        {isWater && (
          <polygon
            points="32,0 64,16 32,32 0,16"
            fill="rgba(255,255,255,0.10)"
            className="water-glint"
          />
        )}

        {/* Danger zone red pulse */}
        {isDangerZone && (
          <polygon
            points="32,0 64,16 32,32 0,16"
            fill="rgba(239,68,68,0.28)"
            className="iso-danger-pulse"
          />
        )}

        {/* Neighbour visit green pulse */}
        {isNeighbor && (
          <polygon
            points="32,0 64,16 32,32 0,16"
            fill="rgba(34,197,94,0.42)"
            className="iso-visit-pulse"
          />
        )}

        {/* Wilted crop brown overlay */}
        {tile.object === 'CROP_WILTED' && (
          <polygon
            points="32,0 64,16 32,32 0,16"
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
            top: 16,          // diamond vertical centre
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
            top: 16,
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

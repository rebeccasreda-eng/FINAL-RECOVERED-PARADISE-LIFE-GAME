import React from 'react';
import { useGame } from '../game/GameContext';
import { EMOJI_MAP } from '../game/gameData';
import { ResourceType } from '../game/types';
import { useToast } from '@/hooks/use-toast';

/* ─── SVG micro-icons (unchanged from previous impl) ──────────────────── */
/* ── Axe icon — metallic head + grape cluster (matches reference) ── */
const IcoAxe = () => (
  <svg viewBox="0 0 30 30" width="28" height="28">
    {/* Handle */}
    <path d="M27,4 Q26,6 21,13 L16,21 Q14,24 13,26" stroke="#7a4e1c" strokeWidth="4.5" fill="none" strokeLinecap="round"/>
    <path d="M27,4 Q26,6 21,13 L16,21 Q14,24 13,26" stroke="#c08840" strokeWidth="2.5" fill="none" strokeLinecap="round" opacity="0.55"/>
    {/* Axe head — steel blue-grey */}
    <path d="M8,3 Q4,5 3,10 Q2,16 5,20 Q8,25 13,21 Q18,23 20,15 Q22,8 16,5 Q12,3 8,3Z" fill="#8898B4"/>
    <path d="M8,3 Q4,5 3,10 Q2,16 5,20 Q8,25 13,21" stroke="#6070A0" strokeWidth="1.1" fill="none" opacity="0.7"/>
    {/* Blade shine */}
    <path d="M9.5,5.5 Q7,9 7,15" stroke="rgba(210,225,255,0.55)" strokeWidth="2.2" fill="none" strokeLinecap="round"/>
    <ellipse cx="15" cy="8" rx="2.5" ry="4.5" fill="rgba(200,215,255,0.22)" transform="rotate(30 15 8)"/>
    {/* Grapes — purple cluster on the blade */}
    <circle cx="10.5" cy="17" r="2.6" fill="#5535A8"/>
    <circle cx="13.8" cy="16.5" r="2.6" fill="#5535A8"/>
    <circle cx="12.2" cy="13.2" r="2.6" fill="#6848BB"/>
    <circle cx="9.2"  cy="13.8" r="2.2" fill="#4828A0"/>
    {/* Grape highlights */}
    <circle cx="9.8"  cy="16.2" r="1.0" fill="rgba(255,255,255,0.52)"/>
    <circle cx="13.0" cy="15.7" r="1.0" fill="rgba(255,255,255,0.52)"/>
    <circle cx="11.4" cy="12.5" r="0.9" fill="rgba(255,255,255,0.46)"/>
    {/* Grape stem */}
    <path d="M12.2,10.5 Q12.8,8.5 14.5,7.5" stroke="#3a7018" strokeWidth="1.4" fill="none" strokeLinecap="round"/>
    {/* Leaf */}
    <ellipse cx="15.5" cy="6.8" rx="3.8" ry="2.4" fill="#4aA028" transform="rotate(-25 15.5 6.8)"/>
    <path d="M14,7.5 Q15,7 16.5,6.5" stroke="#2a7010" strokeWidth="0.8" fill="none" strokeLinecap="round" opacity="0.8"/>
  </svg>
);
const IcoCollect = () => (
  <svg viewBox="0 0 28 28" width="26" height="26">
    <polygon points="14,3 17,11 26,11 19,17 22,25 14,20 6,25 9,17 2,11 11,11"
             fill="#f0c820" stroke="#b08010" strokeWidth="1"/>
    <polygon points="14,6 16.5,11.5 22.5,11.5 17.5,15.5 19.5,21 14,17.5 8.5,21 10.5,15.5 5.5,11.5 11.5,11.5"
             fill="#ffe860" opacity="0.55"/>
  </svg>
);
const IcoQuest = () => (
  <svg viewBox="0 0 28 28" width="26" height="26">
    <rect x="6" y="4" width="16" height="20" rx="2" fill="#f5e8c0" stroke="#a07830" strokeWidth="1.5"/>
    <rect x="6" y="4" width="16" height="5" rx="2" fill="#d4a840"/>
    {[12,16,20].map(y => <rect key={y} x="9" y={y} width="10" height="1.5" rx="0.7" fill="#c09040" opacity="0.7"/>)}
    <circle cx="21" cy="21" r="6" fill="#e84040"/>
    <text x="21" y="25" textAnchor="middle" fontSize="9" fontWeight="900" fill="white">!</text>
  </svg>
);
const IcoPlant = () => (
  <svg viewBox="0 0 28 28" width="26" height="26">
    <rect x="11" y="16" width="6" height="10" rx="2" fill="#8a6030"/>
    <ellipse cx="14" cy="18" rx="8" ry="10" fill="#40b820"/>
    <ellipse cx="14" cy="14" rx="6" ry="8" fill="#58d030"/>
    <ellipse cx="10" cy="17" rx="5" ry="6" fill="#48c028" transform="rotate(-30 10 17)"/>
    <ellipse cx="18" cy="17" rx="5" ry="6" fill="#48c028" transform="rotate(30 18 17)"/>
    <ellipse cx="14" cy="12" rx="4" ry="5" fill="#70e040"/>
  </svg>
);
const IcoBuild = () => (
  <svg viewBox="0 0 28 28" width="26" height="26">
    <rect x="4" y="14" width="20" height="12" rx="1" fill="#a0a8b8"/>
    <rect x="4" y="14" width="20" height="3" fill="#b8c0d0"/>
    <polygon points="3,14 14,5 25,14" fill="#9098a8"/>
    <rect x="11" y="18" width="6" height="8" fill="#708098"/>
    <rect x="6"  y="16" width="4" height="4" rx="1" fill="#d0d8e8"/>
    <rect x="18" y="16" width="4" height="4" rx="1" fill="#d0d8e8"/>
  </svg>
);

/* ─── Single toolbar tile ──────────────────────────────────────────────── */
const Tile = ({
  onClick, active, gradient, children,
}: {
  onClick: () => void; active?: boolean; gradient: string; children: React.ReactNode;
}) => (
  <button
    onClick={onClick}
    className="relative overflow-hidden active:scale-95 transition-transform shrink-0"
    style={{
      width: 50, height: 40,
      borderRadius: 10,
      background: active
        ? 'linear-gradient(180deg, #ffe870 0%, #c89020 100%)'
        : gradient,
      border: '2px solid rgba(0,0,0,0.35)',
      borderBottom: '4px solid rgba(0,0,0,0.55)',
      boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.22), 0 2px 4px rgba(0,0,0,0.35)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      cursor: 'pointer', padding: 0,
    }}
  >
    {/* Top-sheen */}
    <div style={{
      position: 'absolute', top: 0, left: 0, right: 0, height: '40%',
      background: 'linear-gradient(180deg, rgba(255,255,255,0.22), transparent)',
      borderRadius: '8px 8px 0 0', pointerEvents: 'none',
    }}/>
    {/* Active glow ring */}
    {active && (
      <div style={{
        position: 'absolute', inset: 0, borderRadius: 8,
        boxShadow: 'inset 0 0 8px rgba(255,220,0,0.7)', pointerEvents: 'none',
      }}/>
    )}
    {children}
  </button>
);

/* ─── Marina destination card illustration ─────────────────────────────── */
const MarinaIllus = () => (
  <svg viewBox="0 0 80 46" width="80" height="46" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
    <defs>
      <linearGradient id="marSky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#3ab0f0"/><stop offset="100%" stopColor="#78d0f8"/>
      </linearGradient>
      <linearGradient id="marSea" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#0e80c8"/><stop offset="100%" stopColor="#074e8a"/>
      </linearGradient>
    </defs>
    <rect width="80" height="46" fill="url(#marSky)"/>
    {/* Clouds */}
    <ellipse cx="14" cy="9"  rx="10" ry="4" fill="white" opacity="0.75"/>
    <ellipse cx="9"  cy="10" rx="6"  ry="3" fill="white" opacity="0.70"/>
    <ellipse cx="62" cy="7"  rx="12" ry="4" fill="white" opacity="0.70"/>
    <ellipse cx="57" cy="8"  rx="7"  ry="3" fill="white" opacity="0.65"/>
    {/* Sea */}
    <rect y="28" width="80" height="18" fill="url(#marSea)"/>
    <rect y="28" width="80" height="3"  fill="#40b0e0" opacity="0.40"/>
    {/* Shimmer */}
    <line x1="8"  y1="34" x2="22" y2="34" stroke="rgba(255,255,255,0.28)" strokeWidth="1.2" strokeLinecap="round"/>
    <line x1="50" y1="38" x2="68" y2="38" stroke="rgba(255,255,255,0.22)" strokeWidth="1.2" strokeLinecap="round"/>
    {/* Dock */}
    <rect x="30" y="24" width="20" height="4" rx="1" fill="#8a5820"/>
    <rect x="34" y="28" width="2"  height="9" fill="#6a4010"/>
    <rect x="44" y="28" width="2"  height="9" fill="#6a4010"/>
    {/* Boat hull */}
    <path d="M18,28 Q20,35 32,36 Q44,35 46,28Z" fill="#e8e0c8"/>
    <path d="M18,28 Q20,34 32,35 Q44,34 46,28" stroke="#b0a080" strokeWidth="1" fill="none"/>
    {/* Sail */}
    <line x1="32" y1="28" x2="32" y2="12" stroke="#8a7050" strokeWidth="1.5"/>
    <path d="M32,13 L32,26 L46,22Z" fill="white" opacity="0.90"/>
    <path d="M32,14 L32,24 L20,20Z" fill="#f8d0a0" opacity="0.80"/>
    {/* Cabin */}
    <rect x="26" y="24" width="8" height="4" rx="1" fill="#4a8ab8"/>
    <rect x="27" y="25" width="2" height="2" rx="0.5" fill="#a0d0f0" opacity="0.8"/>
  </svg>
);

/* ─── Neighbor destination card illustration ───────────────────────────── */
const NeighborIllus = () => (
  <svg viewBox="0 0 80 46" width="80" height="46" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
    <defs>
      <linearGradient id="nbSky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#a0d870"/><stop offset="100%" stopColor="#c8f090"/>
      </linearGradient>
    </defs>
    <rect width="80" height="46" fill="url(#nbSky)"/>
    {/* Island silhouettes (distant) */}
    <ellipse cx="40" cy="38" rx="28" ry="10" fill="#68b830" opacity="0.5"/>
    <ellipse cx="40" cy="36" rx="20" ry="7"  fill="#88d840" opacity="0.45"/>
    <ellipse cx="18" cy="40" rx="12" ry="6"  fill="#58a828" opacity="0.40"/>
    <ellipse cx="64" cy="40" rx="14" ry="6"  fill="#5ab030" opacity="0.40"/>
    {/* Big "+" in the centre */}
    <rect x="35" y="18" width="10" height="10" rx="2" fill="rgba(255,255,255,0.90)"/>
    <rect x="35" y="18" width="10" height="10" rx="2" fill="rgba(60,180,20,0.20)"/>
    <rect x="37" y="19.5" width="6" height="7"  rx="1" fill="rgba(255,255,255,0)" />
    {/* Actual + paths */}
    <path d="M40,20 L40,27 M36.5,23.5 L43.5,23.5" stroke="#1e8a08" strokeWidth="3" strokeLinecap="round"/>
  </svg>
);

/* ─── NeighborPanel props ───────────────────────────────────────────────── */
interface NeighborPanelProps {
  playerName?: string;
  playerLevel?: number;
  onOpenCollections?: () => void;
  onOpenQuests?: () => void;
}

export const NeighborPanel = ({
  playerName = 'Player',
  playerLevel = 1,
  onOpenCollections,
  onOpenQuests,
}: NeighborPanelProps) => {
  const {
    state, dispatch,
    activeTool, setActiveTool,
    activeBuildItem, setActiveBuildItem,
    setShopOpen,
  } = useGame();

  const { toast } = useToast();

  // Structures the player owns ≥1 of (must match ResourceType + ObjectType intersection)
  const BUILDABLES: ResourceType[] = ['HUT','DOCK','WELL','FLOWER_POT','FENCE','LANTERN'];
  const ownedStructures = BUILDABLES.filter(s => (state.inventory[s] ?? 0) > 0);

  return (
    <div
      className="absolute bottom-0 left-0 right-0 z-30 flex items-stretch select-none"
      style={{
        height: 96,
        background: 'linear-gradient(180deg, #b89a6a 0%, #8a6a3a 100%)',
        borderTop: '3px solid #5a3a10',
        boxShadow: '0 -4px 14px rgba(0,0,0,0.55)',
        fontFamily: "'Fredoka', sans-serif",
      }}
    >
      {/* ══ LEFT: 3 × 2 icon-tile toolbar ══════════════════════════════════ */}
      <div
        className="flex items-center justify-center shrink-0"
        style={{
          width: 172,
          padding: '6px 8px',
          borderRight: '2px solid #4a2e08',
          background: 'linear-gradient(180deg, #7a6040 0%, #5a4020 100%)',
        }}
      >
        <div className="grid gap-1.5" style={{ gridTemplateColumns: 'repeat(3, 50px)' }}>

          {/* Row 1 */}
          <Tile
            onClick={() => setActiveTool('clear')}
            active={activeTool === 'clear'}
            gradient="linear-gradient(180deg, #7090b8 0%, #405878 100%)"
          >
            <IcoAxe />
          </Tile>

          <Tile
            onClick={() => onOpenCollections?.()}
            gradient="linear-gradient(180deg, #9060c8 0%, #603898 100%)"
          >
            <IcoCollect />
          </Tile>

          {/* Row 2 */}
          <Tile
            onClick={() => onOpenQuests?.()}
            gradient="linear-gradient(180deg, #c07830 0%, #885020 100%)"
          >
            <IcoQuest />
          </Tile>

          <Tile
            onClick={() => setActiveTool('plant')}
            active={activeTool === 'plant'}
            gradient="linear-gradient(180deg, #60c038 0%, #308818 100%)"
          >
            <IcoPlant />
          </Tile>

          <Tile
            onClick={() => {
              setActiveTool('build');
              if (!activeBuildItem && ownedStructures.length > 0)
                setActiveBuildItem(ownedStructures[0] as any);
            }}
            active={activeTool === 'build'}
            gradient="linear-gradient(180deg, #608858 0%, #385038 100%)"
          >
            <IcoBuild />
          </Tile>
        </div>
      </div>

      {/* ══ RIGHT: Player's Island panel ════════════════════════════════════ */}
      <div
        className="flex flex-col flex-1 min-w-0"
        style={{ background: 'linear-gradient(180deg, #6a5030 0%, #3a2808 100%)' }}
      >
        {/* Header strip */}
        <div
          className="flex items-center justify-between px-3"
          style={{
            height: 20,
            background: 'linear-gradient(180deg, #2e1c08 0%, #3e2c18 100%)',
            borderBottom: '2px solid #5a3a10',
            flexShrink: 0,
          }}
        >
          <span
            style={{
              color: '#f5e8c0', fontSize: 11, fontWeight: 900,
              letterSpacing: '0.06em',
              textShadow: '0 1px 3px rgba(0,0,0,0.7)',
            }}
          >
            Player's Island
          </span>
          <span
            style={{
              color: '#c8a860', fontSize: 9, fontWeight: 700,
              letterSpacing: '0.04em',
              textShadow: '0 1px 2px rgba(0,0,0,0.5)',
            }}
          >
            {playerName} · Lv {playerLevel}
          </span>
        </div>

        {/* Destination cards row: Marina | Neighbor */}
        <div className="flex flex-1 gap-1.5 px-1.5 py-1.5 items-stretch overflow-hidden">

          {/* Marina card */}
          <button
            className="flex-1 relative overflow-hidden active:scale-95 transition-transform flex flex-col items-center justify-end"
            style={{
              borderRadius: 10,
              border: '2px solid #0a3868',
              borderBottom: '3px solid #062040',
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.18), 0 2px 6px rgba(0,0,0,0.40)',
              cursor: 'pointer',
              padding: '0 0 4px',
            }}
          >
            <MarinaIllus />
            <span style={{
              position: 'relative', zIndex: 1,
              color: '#ffffff', fontSize: 9, fontWeight: 900,
              letterSpacing: '0.07em',
              textShadow: '0 1px 4px rgba(0,0,0,0.80)',
            }}>MARINA</span>
          </button>

          {/* Neighbor card */}
          <button
            className="flex-1 relative overflow-hidden active:scale-95 transition-transform flex flex-col items-center justify-end"
            style={{
              borderRadius: 10,
              border: '2px solid #186408',
              borderBottom: '3px solid #0e3c04',
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.18), 0 2px 6px rgba(0,0,0,0.40)',
              cursor: 'pointer',
              padding: '0 0 4px',
            }}
          >
            <NeighborIllus />
            <span style={{
              position: 'relative', zIndex: 1,
              color: '#ffffff', fontSize: 9, fontWeight: 900,
              letterSpacing: '0.07em',
              textShadow: '0 1px 4px rgba(0,0,0,0.80)',
            }}>ADD NEIGHBOR</span>
          </button>

        </div>
      </div>

      {/* ══ Build tray popup ════════════════════════════════════════════════ */}
      {activeTool === 'build' && (
        <div
          data-nodrag
          className="absolute flex gap-2 p-2 rounded-xl border-4 shadow-2xl z-50"
          style={{
            bottom: 100, left: 6,
            background: '#3a2008',
            borderColor: '#1e1000',
          }}
        >
          {ownedStructures.length === 0 ? (
            <span className="text-yellow-200 text-xs font-bold px-2 py-1">Buy in Shop!</span>
          ) : (
            ownedStructures.map(item => (
              <button
                key={item}
                onClick={() => setActiveBuildItem(item as any)}
                className="w-12 h-12 rounded-lg flex items-center justify-center relative active:scale-95"
                style={{
                  background: activeBuildItem === item ? '#f5c842' : '#fff5d7',
                  border: `3px solid ${activeBuildItem === item ? '#d4a020' : '#c0a070'}`,
                }}
              >
                <span style={{ fontSize: 22 }}>{EMOJI_MAP[item]}</span>
                <span
                  className="absolute -top-2 -right-2 text-white text-[9px] font-black px-1 rounded-full border border-white"
                  style={{ background: '#e84040' }}
                >
                  {state.inventory[item as ResourceType]}
                </span>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
};

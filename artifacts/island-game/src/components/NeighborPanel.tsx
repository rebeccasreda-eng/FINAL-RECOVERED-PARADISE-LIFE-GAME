import React, { useState } from 'react';
import { useGame } from '../game/GameContext';
import { EMOJI_MAP } from '../game/gameData';
import { ResourceType } from '../game/types';

/* ─── Tiny SVG icons ──────────────────────────────────────────────────────── */
const IcoAxe = () => (
  <svg viewBox="0 0 30 30" width="20" height="20">
    <path d="M27,4 Q26,6 21,13 L16,21 Q14,24 13,26" stroke="#7a4e1c" strokeWidth="4.5" fill="none" strokeLinecap="round"/>
    <path d="M27,4 Q26,6 21,13 L16,21 Q14,24 13,26" stroke="#c08840" strokeWidth="2.5" fill="none" strokeLinecap="round" opacity="0.55"/>
    <path d="M8,3 Q4,5 3,10 Q2,16 5,20 Q8,25 13,21 Q18,23 20,15 Q22,8 16,5 Q12,3 8,3Z" fill="#8898B4"/>
    <path d="M9.5,5.5 Q7,9 7,15" stroke="rgba(210,225,255,0.55)" strokeWidth="2.2" fill="none" strokeLinecap="round"/>
    <circle cx="10.5" cy="17" r="2.6" fill="#5535A8"/>
    <circle cx="13.8" cy="16.5" r="2.6" fill="#5535A8"/>
    <circle cx="12.2" cy="13.2" r="2.6" fill="#6848BB"/>
  </svg>
);
const IcoCollect = () => (
  <svg viewBox="0 0 28 28" width="20" height="20">
    <polygon points="14,3 17,11 26,11 19,17 22,25 14,20 6,25 9,17 2,11 11,11" fill="#f0c820" stroke="#b08010" strokeWidth="1"/>
    <polygon points="14,6 16.5,11.5 22.5,11.5 17.5,15.5 19.5,21 14,17.5 8.5,21 10.5,15.5 5.5,11.5 11.5,11.5" fill="#ffe860" opacity="0.55"/>
  </svg>
);
const IcoQuest = () => (
  <svg viewBox="0 0 28 28" width="20" height="20">
    <rect x="6" y="4" width="16" height="20" rx="2" fill="#f5e8c0" stroke="#a07830" strokeWidth="1.5"/>
    <rect x="6" y="4" width="16" height="5" rx="2" fill="#d4a840"/>
    {[12,16,20].map(y => <rect key={y} x="9" y={y} width="10" height="1.5" rx="0.7" fill="#c09040" opacity="0.7"/>)}
    <circle cx="21" cy="21" r="6" fill="#e84040"/>
    <text x="21" y="25" textAnchor="middle" fontSize="9" fontWeight="900" fill="white">!</text>
  </svg>
);
const IcoPlant = () => (
  <svg viewBox="0 0 28 28" width="20" height="20">
    <rect x="11" y="16" width="6" height="10" rx="2" fill="#8a6030"/>
    <ellipse cx="14" cy="18" rx="8" ry="10" fill="#40b820"/>
    <ellipse cx="14" cy="14" rx="6" ry="8" fill="#58d030"/>
    <ellipse cx="10" cy="17" rx="5" ry="6" fill="#48c028" transform="rotate(-30 10 17)"/>
    <ellipse cx="18" cy="17" rx="5" ry="6" fill="#48c028" transform="rotate(30 18 17)"/>
    <ellipse cx="14" cy="12" rx="4" ry="5" fill="#70e040"/>
  </svg>
);
const IcoBuild = () => (
  <svg viewBox="0 0 28 28" width="20" height="20">
    <rect x="4" y="14" width="20" height="12" rx="1" fill="#a0a8b8"/>
    <rect x="4" y="14" width="20" height="3" fill="#b8c0d0"/>
    <polygon points="3,14 14,5 25,14" fill="#9098a8"/>
    <rect x="11" y="18" width="6" height="8" fill="#708098"/>
    <rect x="6"  y="16" width="4" height="4" rx="1" fill="#d0d8e8"/>
    <rect x="18" y="16" width="4" height="4" rx="1" fill="#d0d8e8"/>
  </svg>
);
const IcoWeather = () => (
  <svg viewBox="0 0 28 28" width="20" height="20">
    <circle cx="14" cy="10" r="5" fill="#ffc820"/>
    {[0,45,90,135,180,225,270,315].map(a => (
      <line key={a} x1={14+7*Math.cos(a*Math.PI/180)} y1={10+7*Math.sin(a*Math.PI/180)}
            x2={14+9*Math.cos(a*Math.PI/180)} y2={10+9*Math.sin(a*Math.PI/180)}
            stroke="#ffc820" strokeWidth="1.8" strokeLinecap="round"/>
    ))}
    <ellipse cx="10" cy="20" rx="6" ry="4" fill="white"/>
    <ellipse cx="15" cy="19" rx="7" ry="5" fill="white"/>
    <ellipse cx="20" cy="20" rx="5" ry="3.5" fill="white"/>
    <ellipse cx="14" cy="21" rx="9" ry="4" fill="#e8e8e8"/>
  </svg>
);

/* ─── Marina destination illustration ──────────────────────────────────────── */
const MarinaIllus = () => (
  <svg viewBox="0 0 72 54" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
    <defs>
      <linearGradient id="mpSky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#3ab0f0"/><stop offset="100%" stopColor="#78d0f8"/>
      </linearGradient>
      <linearGradient id="mpSea" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#0e80c8"/><stop offset="100%" stopColor="#074e8a"/>
      </linearGradient>
    </defs>
    <rect width="72" height="54" fill="url(#mpSky)"/>
    <ellipse cx="14" cy="9" rx="10" ry="4" fill="white" opacity="0.75"/>
    <ellipse cx="58" cy="7" rx="11" ry="4" fill="white" opacity="0.70"/>
    <rect y="32" width="72" height="22" fill="url(#mpSea)"/>
    <rect y="32" width="72" height="3" fill="#40b0e0" opacity="0.40"/>
    <line x1="6" y1="38" x2="20" y2="38" stroke="rgba(255,255,255,0.28)" strokeWidth="1.2" strokeLinecap="round"/>
    <rect x="26" y="28" width="20" height="4" rx="1" fill="#8a5820"/>
    <path d="M16,32 Q18,39 28,40 Q40,39 42,32Z" fill="#e8e0c8"/>
    <line x1="28" y1="32" x2="28" y2="16" stroke="#8a7050" strokeWidth="1.5"/>
    <path d="M28,17 L28,30 L42,26Z" fill="white" opacity="0.90"/>
    <rect x="24" y="28" width="7" height="4" rx="1" fill="#4a8ab8"/>
  </svg>
);

/* ─── Add-neighbor placeholder illustration ─────────────────────────────── */
const AddNeighborIllus = () => (
  <svg viewBox="0 0 72 54" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
    <defs>
      <linearGradient id="anSky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#a0d870"/><stop offset="100%" stopColor="#c8f090"/>
      </linearGradient>
    </defs>
    <rect width="72" height="54" fill="url(#anSky)"/>
    <ellipse cx="36" cy="44" rx="26" ry="10" fill="#68b830" opacity="0.55"/>
    <ellipse cx="36" cy="42" rx="18" ry="7"  fill="#88d840" opacity="0.45"/>
    {/* Big + */}
    <rect x="29" y="22" width="14" height="14" rx="3" fill="rgba(255,255,255,0.88)"/>
    <path d="M36,25 L36,33 M32,29 L40,29" stroke="#1e8a08" strokeWidth="3" strokeLinecap="round"/>
  </svg>
);

/* ─── Grass fence strip ─────────────────────────────────────────────────── */
const GrassFence = () => {
  const blades = Array.from({ length: 38 }, (_, i) => i);
  return (
    <div style={{
      height: 18,
      background: 'linear-gradient(180deg, #4aaa14 0%, #2e7c08 100%)',
      position: 'relative',
      overflow: 'hidden',
      borderTop: '2px solid #1a5404',
      flexShrink: 0,
    }}>
      {/* Fence rail */}
      <div style={{ position: 'absolute', top: 5, left: 0, right: 0, height: 3, background: '#8B5E20', opacity: 0.65, borderTop: '1px solid rgba(255,200,100,0.30)', borderBottom: '1px solid rgba(0,0,0,0.25)' }}/>
      {/* Grass blades */}
      {blades.map(i => {
        const lean = ((i * 7) % 5) - 2;
        const h = 7 + (i % 3) * 3;
        return (
          <div key={i} style={{
            position: 'absolute',
            bottom: 0,
            left: `${(i / 38) * 100}%`,
            width: 4,
            height: h,
            background: i % 2 === 0 ? '#6ed428' : '#52b818',
            borderRadius: '2px 2px 0 0',
            transform: `rotate(${lean * 6}deg)`,
            transformOrigin: 'bottom center',
          }}/>
        );
      })}
    </div>
  );
};

/* ─── Scroll arrow button ───────────────────────────────────────────────── */
const ArrowBtn = ({ dir, onClick }: { dir: '◀' | '▶'; onClick: () => void }) => (
  <button
    onClick={onClick}
    className="active:scale-90 transition-transform"
    style={{
      width: 22, flexShrink: 0, alignSelf: 'stretch',
      background: 'linear-gradient(180deg, #7a6040 0%, #4a3818 100%)',
      border: '2px solid #2e1c08',
      borderRadius: dir === '◀' ? '6px 0 0 6px' : '0 6px 6px 0',
      color: '#f5d080', fontSize: 11, fontWeight: 900,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      cursor: 'pointer',
    }}
  >{dir}</button>
);

/* ─── Tool tile ─────────────────────────────────────────────────────────── */
const ToolTile = ({
  onClick, active, bg, children, label,
}: {
  onClick: () => void; active?: boolean; bg: string; children: React.ReactNode; label: string;
}) => (
  <button
    onClick={onClick}
    title={label}
    className="active:scale-95 transition-transform relative flex flex-col items-center justify-center gap-0.5"
    style={{
      width: 38, height: 36,
      borderRadius: 8,
      background: active ? 'linear-gradient(180deg, #ffe870 0%, #c89020 100%)' : bg,
      border: '2px solid rgba(0,0,0,0.38)',
      borderBottom: '3px solid rgba(0,0,0,0.55)',
      boxShadow: active
        ? 'inset 0 0 8px rgba(255,220,0,0.7), 0 2px 4px rgba(0,0,0,0.35)'
        : 'inset 0 1px 0 rgba(255,255,255,0.22), 0 2px 4px rgba(0,0,0,0.35)',
      cursor: 'pointer',
    }}
  >
    {/* Top sheen */}
    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '40%', background: 'linear-gradient(180deg, rgba(255,255,255,0.22), transparent)', borderRadius: '6px 6px 0 0', pointerEvents: 'none' }}/>
    {children}
  </button>
);

/* ─── Neighbor card ─────────────────────────────────────────────────────── */
const NeighborCard = ({
  name, illus, hearts = 1, stars = 5,
}: {
  name: string; illus: React.ReactNode; hearts?: number; stars?: number;
}) => (
  <div
    className="active:scale-95 transition-transform"
    style={{
      width: 80, flexShrink: 0, height: '100%',
      border: '2px solid #c8880a',
      borderBottom: '3px solid #8a5004',
      borderRadius: 8,
      background: 'linear-gradient(180deg, #f5dea0 0%, #d4b060 100%)',
      display: 'flex', flexDirection: 'column', overflow: 'hidden', cursor: 'pointer',
      boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.35), 0 2px 6px rgba(0,0,0,0.35)',
    }}
  >
    {/* Name tab */}
    <div style={{
      background: 'linear-gradient(180deg, #3e2008 0%, #2a1404 100%)',
      padding: '2px 4px', textAlign: 'center',
      fontSize: 9, fontWeight: 900, color: '#f5e0a0', letterSpacing: '0.06em',
      flexShrink: 0, lineHeight: '14px',
    }}>{name}</div>
    {/* Illustration */}
    <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
      {illus}
    </div>
    {/* Hearts + Stars */}
    <div style={{
      display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8,
      padding: '3px 0', background: 'rgba(0,0,0,0.28)', flexShrink: 0,
    }}>
      <span style={{ fontSize: 9, color: '#ff8080', fontWeight: 900, display: 'flex', alignItems: 'center', gap: 1 }}>
        ♥<span style={{ color: '#ffe0e0' }}>{hearts}</span>
      </span>
      <span style={{ fontSize: 9, color: '#ffe820', fontWeight: 900, display: 'flex', alignItems: 'center', gap: 1 }}>
        ★<span style={{ color: '#fff4a0' }}>{stars}</span>
      </span>
    </div>
  </div>
);

/* ─── Add-neighbor card ─────────────────────────────────────────────────── */
const AddNeighborCard = () => (
  <div
    className="active:scale-95 transition-transform"
    style={{
      width: 76, flexShrink: 0, height: '100%',
      border: '2px solid #3a8a0e',
      borderBottom: '3px solid #246004',
      borderRadius: 8,
      background: 'linear-gradient(180deg, #d0eca0 0%, #a8d060 100%)',
      display: 'flex', flexDirection: 'column', overflow: 'hidden', cursor: 'pointer',
      boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.40), 0 2px 6px rgba(0,0,0,0.30)',
      position: 'relative',
    }}
  >
    {/* Top label */}
    <div style={{
      background: 'linear-gradient(180deg, #2a6008 0%, #1a4004 100%)',
      padding: '2px 2px', textAlign: 'center',
      fontSize: 8, fontWeight: 900, color: '#c8f060', letterSpacing: '0.07em',
      flexShrink: 0, lineHeight: '13px',
    }}>ADD NEIGHBOR</div>
    {/* Illustration */}
    <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
      <AddNeighborIllus />
    </div>
  </div>
);

/* ─── Market / shop button ──────────────────────────────────────────────── */
const MarketBtn = ({ onClick }: { onClick: () => void }) => (
  <button
    onClick={onClick}
    className="active:scale-95 transition-transform"
    style={{
      width: '100%', height: 26,
      background: 'linear-gradient(180deg, #60d040 0%, #309010 100%)',
      border: '2px solid #186010',
      borderBottom: '3px solid #0e4008',
      borderRadius: 7,
      color: 'white', fontSize: 11, fontWeight: 900,
      letterSpacing: '0.10em', textShadow: '0 1px 3px rgba(0,0,0,0.55)',
      boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.28)',
      cursor: 'pointer',
      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4,
    }}
  >
    🛒 MARKET
  </button>
);

/* ─── NeighborPanel props ───────────────────────────────────────────────── */
interface NeighborPanelProps {
  playerName?: string;
  playerLevel?: number;
  onOpenCollections?: () => void;
  onOpenQuests?: () => void;
}

const EMPTY_SLOTS = 5;

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

  const [scrollIdx, setScrollIdx] = useState(0);

  const BUILDABLES: ResourceType[] = ['HUT','DOCK','WELL','FLOWER_POT','FENCE','LANTERN'];
  const ownedStructures = BUILDABLES.filter(s => (state.inventory[s] ?? 0) > 0);

  const totalCards = EMPTY_SLOTS + 1; // 5 empty + Marina
  const visibleCards = 4; // at most 4 visible before scrolling
  const maxScroll = Math.max(0, totalCards - visibleCards);

  const scroll = (dir: -1 | 1) =>
    setScrollIdx(i => Math.max(0, Math.min(maxScroll, i + dir)));

  return (
    <div
      className="absolute bottom-0 left-0 right-0 z-30 flex flex-col select-none"
      style={{
        height: 108,
        fontFamily: "'Fredoka', sans-serif",
        boxShadow: '0 -4px 18px rgba(0,0,0,0.60)',
      }}
    >
      {/* ── Grass fence strip ──────────────────────────────────────────── */}
      <GrassFence />

      {/* ── Main panel body ─────────────────────────────────────────────── */}
      <div
        className="flex flex-1 min-h-0"
        style={{
          background: 'linear-gradient(180deg, #c4a56a 0%, #9a7838 100%)',
          borderTop: '2px solid #5a3a10',
        }}
      >
        {/* ── Header + neighbor cards (flex column) ─────────────────────── */}
        <div className="flex flex-col flex-1 min-w-0">
          {/* Header strip — "Player's Island" */}
          <div
            style={{
              height: 20, flexShrink: 0,
              background: 'linear-gradient(180deg, #2e1c08 0%, #3e2c18 100%)',
              borderBottom: '2px solid #5a3a10',
              display: 'flex', alignItems: 'center',
              padding: '0 6px', gap: 5,
            }}
          >
            <span style={{ fontSize: 12 }}>🏠</span>
            <span style={{ color: '#f5e0a0', fontSize: 11, fontWeight: 900, letterSpacing: '0.06em', textShadow: '0 1px 3px rgba(0,0,0,0.7)' }}>
              {playerName}&apos;s Island
            </span>
            <div style={{ flexGrow: 1 }}/>
            <span style={{ color: '#c8a060', fontSize: 9, fontWeight: 700, letterSpacing: '0.04em', textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>
              Lv {playerLevel}
            </span>
          </div>

          {/* Neighbor cards row */}
          <div className="flex flex-1 min-h-0" style={{ padding: '4px 0 4px 4px', gap: 4, alignItems: 'stretch' }}>
            <ArrowBtn dir="◀" onClick={() => scroll(-1)} />

            {/* Scrollable card strip */}
            <div className="flex flex-1 min-w-0" style={{ gap: 4, overflow: 'hidden', alignItems: 'stretch' }}>
              {/* Render cards offset by scrollIdx */}
              {Array.from({ length: EMPTY_SLOTS }, (_, i) => i)
                .concat([-1]) // -1 = Marina slot
                .slice(scrollIdx, scrollIdx + visibleCards)
                .map((slot) =>
                  slot === -1 ? (
                    <NeighborCard key="marina" name="Marina" illus={<MarinaIllus />} hearts={1} stars={5} />
                  ) : (
                    <AddNeighborCard key={slot} />
                  )
                )}
            </div>

            <ArrowBtn dir="▶" onClick={() => scroll(1)} />
          </div>
        </div>

        {/* ── Separator ──────────────────────────────────────────────────── */}
        <div style={{ width: 2, background: 'rgba(0,0,0,0.30)', alignSelf: 'stretch', margin: '4px 0' }}/>

        {/* ── Right dock ─────────────────────────────────────────────────── */}
        <div
          style={{
            width: 176, flexShrink: 0,
            background: 'linear-gradient(180deg, #7a5c30 0%, #4a3010 100%)',
            borderLeft: '2px solid #3a2008',
            display: 'flex', flexDirection: 'column',
            padding: '5px 6px', gap: 5,
          }}
        >
          {/* Tool row */}
          <div style={{ display: 'flex', gap: 4, justifyContent: 'center' }}>
            <ToolTile
              onClick={() => setActiveTool('clear')}
              active={activeTool === 'clear'}
              bg="linear-gradient(180deg, #7090b8 0%, #405878 100%)"
              label="Clear"
            ><IcoAxe /></ToolTile>

            <ToolTile
              onClick={() => setActiveTool('plant')}
              active={activeTool === 'plant'}
              bg="linear-gradient(180deg, #60c038 0%, #308818 100%)"
              label="Plant"
            ><IcoPlant /></ToolTile>

            <ToolTile
              onClick={() => {
                setActiveTool('build');
                if (!activeBuildItem && ownedStructures.length > 0)
                  setActiveBuildItem(ownedStructures[0] as any);
              }}
              active={activeTool === 'build'}
              bg="linear-gradient(180deg, #608858 0%, #385038 100%)"
              label="Build"
            ><IcoBuild /></ToolTile>

            <ToolTile
              onClick={() => onOpenQuests?.()}
              bg="linear-gradient(180deg, #c07830 0%, #885020 100%)"
              label="Quests"
            ><IcoQuest /></ToolTile>

            <ToolTile
              onClick={() => onOpenCollections?.()}
              bg="linear-gradient(180deg, #9060c8 0%, #603898 100%)"
              label="Collections"
            ><IcoCollect /></ToolTile>
          </div>

          {/* Market button */}
          <MarketBtn onClick={() => setShopOpen(true)} />
        </div>
      </div>

      {/* ── Build tray popup ─────────────────────────────────────────────── */}
      {activeTool === 'build' && (
        <div
          data-nodrag
          className="absolute flex gap-2 p-2 rounded-xl border-4 shadow-2xl z-50"
          style={{ bottom: 112, left: 'auto', right: 180, background: '#3a2008', borderColor: '#1e1000' }}
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

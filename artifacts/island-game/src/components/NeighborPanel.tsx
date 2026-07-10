import React, { useState } from 'react';
import { useGame } from '../game/GameContext';
import { EMOJI_MAP } from '../game/gameData';
import { ResourceType } from '../game/types';
import { useToast } from '@/hooks/use-toast';

/* ─── Marina chibi portrait SVG ─────────────────────────────────────────── */
const MarinaPortrait = () => (
  <svg viewBox="0 0 56 68" width="56" height="68" xmlns="http://www.w3.org/2000/svg">
    {/* Sky background */}
    <rect x="0" y="0" width="56" height="68" fill="#c0e8ff"/>
    <rect x="0" y="42" width="56" height="26" fill="#90c870"/>
    {/* Back hair */}
    <ellipse cx="28" cy="28" rx="21" ry="20" fill="#ff5baa"/>
    {/* Long side hair left */}
    <path d="M8,32 Q3,50 6,66" stroke="#ff5baa" strokeWidth="10" fill="none" strokeLinecap="round"/>
    {/* Long side hair right */}
    <path d="M48,32 Q53,50 50,66" stroke="#ff5baa" strokeWidth="10" fill="none" strokeLinecap="round"/>
    {/* Neck + body */}
    <rect x="22" y="44" width="12" height="12" rx="3" fill="#fde8d0"/>
    <path d="M16,56 Q22,52 28,54 Q34,52 40,56 Q38,68 28,68 Q18,68 16,56Z" fill="#e86888"/>
    {/* Head */}
    <ellipse cx="28" cy="28" rx="17" ry="18" fill="#fde8d0"/>
    {/* Fringe bangs */}
    <path d="M11,26 Q14,10 28,10 Q42,10 45,26 Q38,16 28,17 Q18,16 11,26Z" fill="#ff5baa"/>
    {/* Side fringe pieces */}
    <path d="M11,26 Q8,30 10,36" stroke="#ff5baa" strokeWidth="5" fill="none" strokeLinecap="round"/>
    <path d="M45,26 Q48,30 46,36" stroke="#ff5baa" strokeWidth="5" fill="none" strokeLinecap="round"/>
    {/* Eyes — big sparkly */}
    <ellipse cx="20" cy="29" rx="5" ry="6" fill="white"/>
    <ellipse cx="36" cy="29" rx="5" ry="6" fill="white"/>
    <ellipse cx="20" cy="30" rx="3.5" ry="4.5" fill="#2244cc"/>
    <ellipse cx="36" cy="30" rx="3.5" ry="4.5" fill="#2244cc"/>
    <circle cx="20" cy="29.5" r="2.2" fill="#111"/>
    <circle cx="36" cy="29.5" r="2.2" fill="#111"/>
    <circle cx="21.2" cy="28.2" r="1.1" fill="white"/>
    <circle cx="37.2" cy="28.2" r="1.1" fill="white"/>
    <circle cx="19.2" cy="30.8" r="0.6" fill="rgba(255,255,255,0.7)"/>
    <circle cx="35.2" cy="30.8" r="0.6" fill="rgba(255,255,255,0.7)"/>
    {/* Eyelashes */}
    <path d="M15,24 Q17,22 20,23" stroke="#333" strokeWidth="1.1" fill="none"/>
    <path d="M31,24 Q33,22 36,23" stroke="#333" strokeWidth="1.1" fill="none"/>
    {/* Blush */}
    <ellipse cx="13" cy="33" rx="4" ry="2.2" fill="#ff8888" opacity="0.5"/>
    <ellipse cx="43" cy="33" rx="4" ry="2.2" fill="#ff8888" opacity="0.5"/>
    {/* Nose */}
    <circle cx="28" cy="35" r="1.2" fill="#e0b090" opacity="0.6"/>
    {/* Smile */}
    <path d="M22,40 Q28,45 34,40" stroke="#cc4466" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
    {/* Hair accessories — star clips */}
    <polygon points="38,15 39.4,18.2 42.8,18.2 40.1,20.2 41.1,23.5 38,21.5 34.9,23.5 35.9,20.2 33.2,18.2 36.6,18.2"
             fill="#ffe040" stroke="#e0b000" strokeWidth="0.6"/>
    <circle cx="38" cy="19.5" r="1.5" fill="white" opacity="0.5"/>
  </svg>
);

/* ─── Blank player card portrait ─────────────────────────────────────────── */
const PlayerPortrait = () => (
  <svg viewBox="0 0 56 68" width="56" height="68" xmlns="http://www.w3.org/2000/svg">
    {/* Background */}
    <rect x="0" y="0" width="56" height="68" fill="#b0d8f0"/>
    <rect x="0" y="44" width="56" height="24" fill="#88b858"/>
    {/* Silhouette person */}
    <circle cx="28" cy="24" r="12" fill="rgba(80,100,140,0.35)"/>
    <path d="M10,68 Q14,44 28,42 Q42,44 46,68Z" fill="rgba(80,100,140,0.30)"/>
    {/* Dashed border hint */}
    <rect x="4" y="4" width="48" height="60" rx="3" fill="none"
          stroke="rgba(255,255,255,0.55)" strokeWidth="1.5" strokeDasharray="4 3"/>
    {/* Plus icon */}
    <rect x="25" y="18" width="6" height="18" rx="2" fill="rgba(255,255,255,0.65)"/>
    <rect x="19" y="24" width="18" height="6" rx="2" fill="rgba(255,255,255,0.65)"/>
  </svg>
);

/* ─── Neighbour card (shared frame for Player and Marina) ────────────────── */
interface NeighbourCardProps {
  portrait: React.ReactNode;
  name: string;
  hearts: number;
  stars: number;
  onClick?: () => void;
}
const NeighbourCard = ({ portrait, name, hearts, stars, onClick }: NeighbourCardProps) => (
  <div
    className="flex flex-col items-center shrink-0 cursor-pointer"
    style={{ width: 72 }}
    onClick={onClick}
  >
    {/* Golden frame */}
    <div
      className="relative overflow-hidden"
      style={{
        width: 68,
        height: 72,
        borderRadius: '50% 50% 10px 10px',
        border: '3px solid #8a5808',
        background: 'linear-gradient(180deg, #d4a020 0%, #a07010 40%, #d4a020 100%)',
        boxShadow: '0 4px 10px rgba(0,0,0,0.45), inset 0 1px 3px rgba(255,220,80,0.6)',
      }}
    >
      {/* Portrait inset */}
      <div
        className="absolute overflow-hidden flex items-center justify-center"
        style={{ inset: 3, borderRadius: '50% 50% 7px 7px' }}
      >
        {portrait}
      </div>
      {/* Top sheen */}
      <div
        className="absolute top-0 left-0 right-0 pointer-events-none"
        style={{
          height: '40%',
          borderRadius: '50% 50% 0 0',
          background: 'linear-gradient(180deg, rgba(255,255,255,0.28) 0%, transparent 100%)',
        }}
      />
    </div>

    {/* Name label */}
    <span
      className="mt-1 text-[10px] font-black text-center leading-none"
      style={{ color: '#f5e8c0', textShadow: '0 1px 2px rgba(0,0,0,0.7)', maxWidth: 68 }}
    >
      {name}
    </span>

    {/* Heart + Star count badges — matching reference layout */}
    <div className="flex items-center gap-1 mt-0.5">
      {/* Heart badge */}
      <div
        className="flex items-center gap-0.5"
        style={{
          background: 'linear-gradient(180deg, #e84444, #a81818)',
          borderRadius: 8,
          border: '1.5px solid #7a1010',
          padding: '1px 4px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.40)',
        }}
      >
        <span style={{ fontSize: 7, lineHeight: 1 }}>❤️</span>
        <span style={{ fontSize: 8, color: 'white', fontWeight: 900, lineHeight: 1 }}>{hearts}</span>
      </div>
      {/* Star badge */}
      <div
        className="flex items-center gap-0.5"
        style={{
          background: 'linear-gradient(180deg, #ffe860, #c89000)',
          borderRadius: 8,
          border: '1.5px solid #9a6800',
          padding: '1px 4px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.35)',
        }}
      >
        <span style={{ fontSize: 7, lineHeight: 1 }}>⭐</span>
        <span style={{ fontSize: 8, color: '#4a2800', fontWeight: 900, lineHeight: 1 }}>{stars}</span>
      </div>
    </div>
  </div>
);

/* ─── Add Neighbor empty slot ─────────────────────────────────────────────── */
const AddNeighborCard = () => (
  <div className="flex flex-col items-center shrink-0" style={{ width: 68 }}>
    <button
      aria-label="Add Neighbor"
      style={{
        width: 64,
        height: 72,
        borderRadius: 10,
        background: 'linear-gradient(180deg, #e2d9c8 0%, #cec4b0 100%)',
        border: '2.5px solid #a08868',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 4,
        boxShadow: '0 2px 6px rgba(0,0,0,0.28), inset 0 1px 3px rgba(255,255,255,0.55)',
        cursor: 'pointer',
        padding: 0,
      }}
    >
      {/* Big "?" */}
      <span
        style={{
          fontSize: 28,
          fontWeight: 900,
          color: '#b0a090',
          lineHeight: 1,
          textShadow: '0 1px 2px rgba(0,0,0,0.18)',
        }}
      >?</span>
      {/* Label */}
      <span
        style={{
          fontSize: 8,
          fontWeight: 900,
          color: '#6a5030',
          textAlign: 'center',
          lineHeight: 1.2,
        }}
      >Add<br/>Neighbor</span>
    </button>
  </div>
);

/* ─── Nav arrow button ───────────────────────────────────────────────────── */
const NavArrow = ({ label }: { label: string }) => (
  <div
    className="flex items-center justify-center cursor-pointer active:scale-95 transition-transform select-none"
    style={{
      width: 22,
      height: 19,
      background: 'linear-gradient(180deg, #8090a8, #506070)',
      border: '1.5px solid #304050',
      borderBottomWidth: 3,
      borderRadius: 4,
      color: 'white',
      fontSize: 11,
      fontWeight: 900,
    }}
  >
    {label}
  </div>
);

/* ─── Market item cell ───────────────────────────────────────────────────── */
const MarketCell = ({ emoji, bg }: { emoji: string; bg: string }) => (
  <div
    className="flex items-center justify-center cursor-pointer active:scale-95 transition-transform"
    style={{
      width: 36, height: 34,
      background: bg,
      border: '2px solid #7a5010',
      borderBottomWidth: 3,
      borderRadius: 6,
    }}
  >
    <span style={{ fontSize: 18 }}>{emoji}</span>
  </div>
);

/* ─── Top icon button ────────────────────────────────────────────────────── */
const TopIcon = ({ icon, bg, title }: { icon: string; bg: string; title?: string }) => (
  <div
    title={title}
    className="flex items-center justify-center cursor-pointer active:scale-95 transition-transform"
    style={{
      width: 26, height: 24,
      background: bg,
      border: '1.5px solid #3a2000',
      borderBottomWidth: 3,
      borderRadius: 5,
      fontSize: 13,
    }}
  >
    {icon}
  </div>
);

/* ─── Main bottom bar ────────────────────────────────────────────────────── */
interface NeighborPanelProps {
  playerName?: string;
  playerLevel?: number;
}

export const NeighborPanel = ({ playerName = 'Player', playerLevel = 1 }: NeighborPanelProps) => {
  const { state, dispatch, activeTool, setActiveTool, activeBuildItem, setActiveBuildItem, setShopOpen } = useGame();
  const { toast } = useToast();

  const ownedStructures = ['HUT','DOCK','WELL','FLOWER_POT','FENCE','LANTERN'].filter(
    (i) => (state.inventory[i as ResourceType] || 0) > 0
  );

  const handleVisit = (n: any) => {
    dispatch({ type: 'VISIT_NEIGHBOR', neighborId: n.id });
    toast({ title: `Visited ${n.name}!`, description: '+10 favor, +5 coins, +5 XP', duration: 2000 });
  };

  const handleHire = (n: any) => {
    const isNewDay = Date.now() - state.lastNeighborHire > 86400000;
    const hiredToday = isNewDay ? 0 : state.neighborsHiredToday;
    if (hiredToday >= 2) {
      toast({ title: 'Daily limit reached', description: 'Max 2 hires/day.', variant: 'destructive' });
      return;
    }
    if (state.inventory.coins < 50) {
      toast({ title: 'Need 50 coins!', variant: 'destructive' });
      return;
    }
    dispatch({ type: 'HIRE_NEIGHBOR', neighborId: n.id });
    toast({ title: `${n.name} is helping! +3 ⚡`, duration: 2000 });
  };

  // Marina is always the first (and only) neighbour
  const marina = state.neighbors?.find(n => n.id === 'n1');

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
      {/* ── LEFT: island name + ?/chat/⚙ icons ── */}
      <div
        className="flex flex-col justify-center px-3 shrink-0"
        style={{
          minWidth: 112,
          borderRight: '2px solid #5a3a10',
          background: 'linear-gradient(180deg, #7a6040 0%, #5a4020 100%)',
        }}
      >
        <span className="text-white font-black text-sm leading-tight drop-shadow">
          {playerLevel > 1 ? `Lv${playerLevel}` : ''}
        </span>
        <span
          className="font-black text-xs leading-tight"
          style={{ color: '#ffd060', textShadow: '0 1px 3px rgba(0,0,0,0.7)' }}
        >
          {playerName}'s Island
        </span>
        <div className="flex gap-1 mt-1">
          <TopIcon icon="?" bg="#3070c0" title="Help"/>
          <TopIcon icon="💬" bg="#30a060" title="Chat"/>
          <TopIcon icon="⚙️" bg="#806040" title="Settings"/>
        </div>
      </div>

      {/* ── NEIGHBOUR CARDS: Player + Marina + 5 empty slots ── */}
      <div
        className="flex items-center gap-2 px-3 overflow-x-auto"
        style={{
          borderRight: '2px solid #5a3a10',
          maxWidth: 380,
          minWidth: 0,
          flexShrink: 1,
        }}
      >
        {/* 5 empty Add Neighbor slots — come first */}
        {Array.from({ length: 5 }).map((_, i) => (
          <AddNeighborCard key={i} />
        ))}

        {/* Player card */}
        <NeighbourCard
          portrait={<PlayerPortrait />}
          name={playerName}
          hearts={2}
          stars={1}
        />

        {/* Marina card — ❤️1 ⭐5 */}
        {marina && (
          <div className="flex flex-col items-center gap-1">
            <NeighbourCard
              portrait={<MarinaPortrait />}
              name="Marina"
              hearts={1}
              stars={5}
              onClick={() => handleVisit(marina)}
            />
            <button
              onClick={() => handleHire(marina)}
              className="text-[9px] font-black px-2 py-0.5 rounded border active:scale-95 transition-transform"
              style={{
                background: 'linear-gradient(180deg, #50cc30, #289010)',
                borderColor: '#186808',
                borderBottomWidth: 2,
                color: 'white',
                marginTop: -4,
              }}
            >
              Hire
            </button>
          </div>
        )}
      </div>

      {/* ── NAV ARROWS (4 stacked) ── */}
      <div
        className="flex flex-col items-center justify-center gap-1 px-2 shrink-0"
        style={{ borderRight: '2px solid #5a3a10' }}
      >
        <NavArrow label="◄"/>
        <NavArrow label="◄"/>
        <NavArrow label="◄"/>
        <NavArrow label="◄"/>
      </div>

      {/* ── TOOLS column ── */}
      <div className="flex flex-col items-center justify-center gap-1 px-2 shrink-0"
        style={{ borderRight: '2px solid #5a3a10' }}
      >
        {/* Build tray popup */}
        {activeTool === 'build' && (
          <div
            className="absolute bottom-[100px] right-[168px] bg-[#5a3a10] p-2 rounded-xl flex gap-2 border-4 border-[#3a1a00] shadow-2xl z-50"
          >
            {ownedStructures.length === 0 ? (
              <span className="text-yellow-200 text-xs font-bold px-2 py-1">Buy in Shop!</span>
            ) : (
              ownedStructures.map((item) => (
                <button
                  key={item}
                  onClick={() => setActiveBuildItem(item as any)}
                  className="w-12 h-12 rounded-lg border-3 flex items-center justify-center relative active:scale-95"
                  style={{
                    background: activeBuildItem === item ? '#f5c842' : '#fff5d7',
                    border: `3px solid ${activeBuildItem === item ? '#d4a020' : '#c0a070'}`,
                  }}
                >
                  <span className="text-2xl">{EMOJI_MAP[item]}</span>
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[9px] font-black px-1 rounded-full border border-white">
                    {state.inventory[item as ResourceType]}
                  </span>
                </button>
              ))
            )}
          </div>
        )}

        {[
          { tool: 'clear' as const,  label: '👆', title: 'Pointer' },
          { tool: 'plant' as const,  label: '🌱', title: 'Plant'   },
          { tool: 'build' as const,  label: '🔨', title: 'Build'   },
        ].map(({ tool, label, title }) => (
          <button
            key={tool}
            title={title}
            onClick={() => {
              setActiveTool(tool);
              if (tool === 'build' && !activeBuildItem && ownedStructures.length > 0) {
                setActiveBuildItem(ownedStructures[0] as any);
              }
            }}
            className="w-10 h-10 rounded-lg flex items-center justify-center text-xl active:scale-95 transition-transform border-b-2"
            style={{
              background: activeTool === tool
                ? 'linear-gradient(180deg, #ffe860, #d4a020)'
                : 'linear-gradient(180deg, #b09060, #806040)',
              borderColor: activeTool === tool ? '#a07010' : '#3a2000',
              boxShadow: activeTool === tool ? '0 0 8px rgba(255,200,0,0.6)' : 'none',
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* ── RIGHT: MARKET label + grid ── */}
      <div
        className="flex flex-col shrink-0"
        style={{
          background: 'linear-gradient(180deg, #7a6040 0%, #5a4020 100%)',
          borderLeft: '2px solid #5a3a10',
        }}
      >
        {/* Top row: MARKET label + big button */}
        <div className="flex items-stretch flex-1">
          {/* Market big button */}
          <div className="flex flex-col items-center justify-start pt-1 px-1.5" style={{ width: 90 }}>
            <span
              className="text-[10px] font-black text-yellow-200 tracking-widest mb-0.5"
              style={{ textShadow: '0 1px 2px rgba(0,0,0,0.6)' }}
            >
              MARKET
            </span>
            <button
              onClick={() => setShopOpen(true)}
              className="w-[78px] h-[56px] rounded-lg overflow-hidden border-2 active:scale-95 transition-transform relative"
              style={{ borderColor: '#c0901a', background: '#8b6020' }}
              title="Open Market"
            >
              <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, #a8d868 0%, #70a028 50%, #c8a050 100%)' }}/>
              <div className="absolute top-0 left-0 right-0 h-4 flex items-center justify-center"
                style={{ background: 'linear-gradient(180deg, #d4a020, #a07010)', borderBottom: '1px solid #604000' }}>
                <span className="text-[8px] font-black text-yellow-100">🏪 SHOP</span>
              </div>
              <div className="absolute bottom-1 left-0 right-0 flex flex-wrap justify-center gap-0.5 px-1">
                {['🍎','🌽','🥥','🍅','🥚','🫐'].map((e, i) => (
                  <span key={i} style={{ fontSize: 10 }}>{e}</span>
                ))}
              </div>
            </button>
          </div>

          {/* Item grid: 2 columns × 2 rows */}
          <div className="flex flex-col justify-center gap-1 px-1.5 py-1">
            <div className="flex gap-1">
              <MarketCell emoji="🎁" bg="linear-gradient(180deg, #e8c060, #c09030)"/>
              <MarketCell emoji="🐰" bg="linear-gradient(180deg, #f0e8e0, #d8c8b8)"/>
            </div>
            <div className="flex gap-1">
              <MarketCell emoji="💎" bg="linear-gradient(180deg, #a0d8f8, #5090d0)"/>
              <MarketCell emoji="🌺" bg="linear-gradient(180deg, #f8a0b8, #d06080)"/>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

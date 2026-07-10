import React, { useState } from 'react';
import { useGame } from '../game/GameContext';
import { COLLECTIONS, EMOJI_MAP } from '../game/gameData';
import { ResourceType } from '../game/types';
import { useToast } from '@/hooks/use-toast';

/* ─── Anime "Add Neighbor" avatars ──────────────────────────────────────── */

const AvatarSilver = () => (
  <svg viewBox="0 0 60 80" xmlns="http://www.w3.org/2000/svg" width="60" height="80">
    <ellipse cx="30" cy="77" rx="18" ry="3" fill="#00000020" />
    {/* Legs */}
    <rect x="21" y="58" width="7" height="18" rx="3.5" fill="#fde8d0" />
    <rect x="32" y="58" width="7" height="18" rx="3.5" fill="#fde8d0" />
    {/* Body */}
    <path d="M15 44 Q13 62 20 70 Q30 74 40 70 Q47 62 45 44Z" fill="#b8d8ff" />
    <path d="M18 44 L22 36 L38 36 L42 44Z" fill="#88b4ee" />
    {/* Arms */}
    <path d="M18 44 Q7 48 9 56" stroke="#fde8d0" strokeWidth="6" fill="none" strokeLinecap="round" />
    <path d="M42 44 Q53 48 51 56" stroke="#fde8d0" strokeWidth="6" fill="none" strokeLinecap="round" />
    {/* Neck */}
    <rect x="26" y="30" width="8" height="8" rx="2" fill="#fde8d0" />
    {/* Head */}
    <circle cx="30" cy="22" r="16" fill="#fde8d0" />
    {/* Hair back */}
    <ellipse cx="30" cy="14" rx="18" ry="13" fill="#d0d4e8" />
    {/* Side hair */}
    <path d="M13 20 Q9 42 15 64" stroke="#c8ccdc" strokeWidth="8" fill="none" strokeLinecap="round" />
    <path d="M47 20 Q51 42 45 64" stroke="#c8ccdc" strokeWidth="8" fill="none" strokeLinecap="round" />
    {/* Front hair / bangs */}
    <path d="M14 20 Q18 6 30 6 Q42 6 46 20 Q42 12 30 12 Q18 12 14 20Z" fill="#dcdee8" />
    <path d="M14 20 Q17 25 22 22" fill="#d0d2e0" />
    <path d="M46 20 Q43 25 38 22" fill="#d0d2e0" />
    {/* Eyes white */}
    <ellipse cx="23" cy="23" rx="4.5" ry="5" fill="white" />
    <ellipse cx="37" cy="23" rx="4.5" ry="5" fill="white" />
    {/* Iris */}
    <ellipse cx="23" cy="24" rx="3" ry="3.5" fill="#66aaff" />
    <ellipse cx="37" cy="24" rx="3" ry="3.5" fill="#66aaff" />
    {/* Pupil */}
    <circle cx="23.5" cy="24.5" r="1.8" fill="#111128" />
    <circle cx="37.5" cy="24.5" r="1.8" fill="#111128" />
    {/* Eye shine */}
    <circle cx="24.5" cy="23" r="0.9" fill="white" />
    <circle cx="38.5" cy="23" r="0.9" fill="white" />
    {/* Eyebrows */}
    <path d="M19 18 Q23 15 27 18" stroke="#a0a0b8" strokeWidth="1.2" fill="none" strokeLinecap="round" />
    <path d="M33 18 Q37 15 41 18" stroke="#a0a0b8" strokeWidth="1.2" fill="none" strokeLinecap="round" />
    {/* Blush */}
    <ellipse cx="17" cy="27" rx="4.5" ry="2.5" fill="#ff8888" opacity="0.35" />
    <ellipse cx="43" cy="27" rx="4.5" ry="2.5" fill="#ff8888" opacity="0.35" />
    {/* Nose */}
    <ellipse cx="30" cy="26" rx="1.2" ry="0.8" fill="#e0b090" opacity="0.5" />
    {/* Smile */}
    <path d="M26 30 Q30 34 34 30" stroke="#d05070" strokeWidth="1.4" fill="none" strokeLinecap="round" />
    {/* Hair bow */}
    <path d="M23 9 Q30 5 37 9 Q30 13 23 9Z" fill="#e0e0f0" stroke="#b8b8cc" strokeWidth="0.5" />
    <circle cx="30" cy="9" r="2" fill="#c8c8e0" />
  </svg>
);

const AvatarPink = () => (
  <svg viewBox="0 0 60 80" xmlns="http://www.w3.org/2000/svg" width="60" height="80">
    <ellipse cx="30" cy="77" rx="18" ry="3" fill="#00000020" />
    <rect x="21" y="58" width="7" height="18" rx="3.5" fill="#fde8d0" />
    <rect x="32" y="58" width="7" height="18" rx="3.5" fill="#fde8d0" />
    <path d="M15 44 Q13 62 20 70 Q30 74 40 70 Q47 62 45 44Z" fill="#ffb8cc" />
    <path d="M18 44 L22 36 L38 36 L42 44Z" fill="#ff88aa" />
    <path d="M18 44 Q7 48 9 56" stroke="#fde8d0" strokeWidth="6" fill="none" strokeLinecap="round" />
    <path d="M42 44 Q53 48 51 56" stroke="#fde8d0" strokeWidth="6" fill="none" strokeLinecap="round" />
    <rect x="26" y="30" width="8" height="8" rx="2" fill="#fde8d0" />
    <circle cx="30" cy="22" r="16" fill="#fde8d0" />
    {/* Pink hair back */}
    <ellipse cx="30" cy="14" rx="18" ry="13" fill="#ff9ab8" />
    {/* Short hair sides */}
    <path d="M13 20 Q10 35 16 48" stroke="#ff88aa" strokeWidth="7" fill="none" strokeLinecap="round" />
    <path d="M47 20 Q50 35 44 48" stroke="#ff88aa" strokeWidth="7" fill="none" strokeLinecap="round" />
    {/* Front hair */}
    <path d="M14 20 Q18 6 30 6 Q42 6 46 20 Q42 12 30 12 Q18 12 14 20Z" fill="#ffaac4" />
    <path d="M14 20 Q18 25 23 21" fill="#ff98b8" />
    <path d="M46 20 Q42 25 37 21" fill="#ff98b8" />
    {/* Eyes */}
    <ellipse cx="23" cy="23" rx="4.5" ry="5" fill="white" />
    <ellipse cx="37" cy="23" rx="4.5" ry="5" fill="white" />
    <ellipse cx="23" cy="24" rx="3" ry="3.5" fill="#cc44aa" />
    <ellipse cx="37" cy="24" rx="3" ry="3.5" fill="#cc44aa" />
    <circle cx="23.5" cy="24.5" r="1.8" fill="#220022" />
    <circle cx="37.5" cy="24.5" r="1.8" fill="#220022" />
    <circle cx="24.5" cy="23" r="0.9" fill="white" />
    <circle cx="38.5" cy="23" r="0.9" fill="white" />
    <path d="M19 18 Q23 15 27 18" stroke="#d080a0" strokeWidth="1.2" fill="none" strokeLinecap="round" />
    <path d="M33 18 Q37 15 41 18" stroke="#d080a0" strokeWidth="1.2" fill="none" strokeLinecap="round" />
    <ellipse cx="17" cy="27" rx="4.5" ry="2.5" fill="#ff6688" opacity="0.4" />
    <ellipse cx="43" cy="27" rx="4.5" ry="2.5" fill="#ff6688" opacity="0.4" />
    <ellipse cx="30" cy="26" rx="1.2" ry="0.8" fill="#e0b090" opacity="0.5" />
    <path d="M26 30 Q30 34 34 30" stroke="#cc2255" strokeWidth="1.4" fill="none" strokeLinecap="round" />
    {/* Pink hair bow large */}
    <path d="M18 10 Q26 6 30 10 Q26 14 18 10Z" fill="#ff88aa" />
    <path d="M42 10 Q34 6 30 10 Q34 14 42 10Z" fill="#ff88aa" />
    <circle cx="30" cy="10" r="2.5" fill="#ff6699" />
  </svg>
);

const AvatarBlue = () => (
  <svg viewBox="0 0 60 80" xmlns="http://www.w3.org/2000/svg" width="60" height="80">
    <ellipse cx="30" cy="77" rx="18" ry="3" fill="#00000020" />
    <rect x="21" y="58" width="7" height="18" rx="3.5" fill="#fde8d0" />
    <rect x="32" y="58" width="7" height="18" rx="3.5" fill="#fde8d0" />
    <path d="M15 44 Q13 62 20 70 Q30 74 40 70 Q47 62 45 44Z" fill="#88ccee" />
    <path d="M18 44 L22 36 L38 36 L42 44Z" fill="#55aadd" />
    <path d="M18 44 Q7 48 9 56" stroke="#fde8d0" strokeWidth="6" fill="none" strokeLinecap="round" />
    <path d="M42 44 Q53 48 51 56" stroke="#fde8d0" strokeWidth="6" fill="none" strokeLinecap="round" />
    <rect x="26" y="30" width="8" height="8" rx="2" fill="#fde8d0" />
    <circle cx="30" cy="22" r="16" fill="#fde8d0" />
    {/* Blue wavy hair back */}
    <ellipse cx="30" cy="14" rx="18" ry="13" fill="#55aadd" />
    {/* Long wavy sides */}
    <path d="M13 20 Q7 44 14 68" stroke="#4499cc" strokeWidth="9" fill="none" strokeLinecap="round" />
    <path d="M47 20 Q53 44 46 68" stroke="#4499cc" strokeWidth="9" fill="none" strokeLinecap="round" />
    {/* Front hair */}
    <path d="M14 20 Q18 6 30 6 Q42 6 46 20 Q42 12 30 12 Q18 12 14 20Z" fill="#66bbee" />
    <path d="M14 20 Q18 26 24 22" fill="#55aadd" />
    {/* Eyes - green */}
    <ellipse cx="23" cy="23" rx="4.5" ry="5" fill="white" />
    <ellipse cx="37" cy="23" rx="4.5" ry="5" fill="white" />
    <ellipse cx="23" cy="24" rx="3" ry="3.5" fill="#33bb77" />
    <ellipse cx="37" cy="24" rx="3" ry="3.5" fill="#33bb77" />
    <circle cx="23.5" cy="24.5" r="1.8" fill="#0a2210" />
    <circle cx="37.5" cy="24.5" r="1.8" fill="#0a2210" />
    <circle cx="24.5" cy="23" r="0.9" fill="white" />
    <circle cx="38.5" cy="23" r="0.9" fill="white" />
    <path d="M19 18 Q23 15 27 18" stroke="#2288aa" strokeWidth="1.2" fill="none" strokeLinecap="round" />
    <path d="M33 18 Q37 15 41 18" stroke="#2288aa" strokeWidth="1.2" fill="none" strokeLinecap="round" />
    <ellipse cx="17" cy="27" rx="4.5" ry="2.5" fill="#ff8888" opacity="0.35" />
    <ellipse cx="43" cy="27" rx="4.5" ry="2.5" fill="#ff8888" opacity="0.35" />
    <ellipse cx="30" cy="26" rx="1.2" ry="0.8" fill="#e0b090" opacity="0.5" />
    <path d="M26 30 Q30 34 34 30" stroke="#cc4466" strokeWidth="1.4" fill="none" strokeLinecap="round" />
    {/* Starfish in hair */}
    <text x="24" y="10" fontSize="8" textAnchor="middle">⭐</text>
  </svg>
);

const AvatarBlonde = () => (
  <svg viewBox="0 0 60 80" xmlns="http://www.w3.org/2000/svg" width="60" height="80">
    <ellipse cx="30" cy="77" rx="18" ry="3" fill="#00000020" />
    <rect x="21" y="58" width="7" height="18" rx="3.5" fill="#fde8d0" />
    <rect x="32" y="58" width="7" height="18" rx="3.5" fill="#fde8d0" />
    <path d="M15 44 Q13 62 20 70 Q30 74 40 70 Q47 62 45 44Z" fill="#a8d870" />
    <path d="M18 44 L22 36 L38 36 L42 44Z" fill="#88bb40" />
    <path d="M18 44 Q7 48 9 56" stroke="#fde8d0" strokeWidth="6" fill="none" strokeLinecap="round" />
    <path d="M42 44 Q53 48 51 56" stroke="#fde8d0" strokeWidth="6" fill="none" strokeLinecap="round" />
    <rect x="26" y="30" width="8" height="8" rx="2" fill="#fde8d0" />
    <circle cx="30" cy="22" r="16" fill="#fde8d0" />
    {/* Blonde hair back */}
    <ellipse cx="30" cy="14" rx="18" ry="13" fill="#f0c840" />
    {/* Flowing side hair */}
    <path d="M13 20 Q9 42 16 62" stroke="#e8b830" strokeWidth="8" fill="none" strokeLinecap="round" />
    <path d="M47 20 Q51 42 44 62" stroke="#e8b830" strokeWidth="8" fill="none" strokeLinecap="round" />
    {/* Front hair */}
    <path d="M14 20 Q18 6 30 6 Q42 6 46 20 Q42 12 30 12 Q18 12 14 20Z" fill="#f8d848" />
    <path d="M14 20 Q18 26 23 21" fill="#f0c840" />
    <path d="M46 20 Q42 26 37 21" fill="#f0c840" />
    {/* Eyes - brown */}
    <ellipse cx="23" cy="23" rx="4.5" ry="5" fill="white" />
    <ellipse cx="37" cy="23" rx="4.5" ry="5" fill="white" />
    <ellipse cx="23" cy="24" rx="3" ry="3.5" fill="#886622" />
    <ellipse cx="37" cy="24" rx="3" ry="3.5" fill="#886622" />
    <circle cx="23.5" cy="24.5" r="1.8" fill="#221100" />
    <circle cx="37.5" cy="24.5" r="1.8" fill="#221100" />
    <circle cx="24.5" cy="23" r="0.9" fill="white" />
    <circle cx="38.5" cy="23" r="0.9" fill="white" />
    <path d="M19 18 Q23 15 27 18" stroke="#a08020" strokeWidth="1.2" fill="none" strokeLinecap="round" />
    <path d="M33 18 Q37 15 41 18" stroke="#a08020" strokeWidth="1.2" fill="none" strokeLinecap="round" />
    <ellipse cx="17" cy="27" rx="4.5" ry="2.5" fill="#ff8888" opacity="0.4" />
    <ellipse cx="43" cy="27" rx="4.5" ry="2.5" fill="#ff8888" opacity="0.4" />
    <ellipse cx="30" cy="26" rx="1.2" ry="0.8" fill="#e0b090" opacity="0.5" />
    <path d="M26 30 Q30 34 34 30" stroke="#cc4466" strokeWidth="1.4" fill="none" strokeLinecap="round" />
    {/* Flower in hair */}
    <text x="41" y="12" fontSize="9" textAnchor="middle">🌺</text>
  </svg>
);

const ADD_NEIGHBOR_AVATARS = [
  { avatar: <AvatarSilver />, bg: '#e8f0ff' },
  { avatar: <AvatarPink />,   bg: '#ffe8f0' },
  { avatar: <AvatarBlue />,   bg: '#e8f8ff' },
  { avatar: <AvatarBlonde />, bg: '#f8ffe8' },
];

/* ─── Neighbor portrait component ───────────────────────────────────────── */
const NeighborPortrait = ({
  n, onVisit, onHire, onHover, onLeave, isHovered, ownedCollections, dispatch, toast,
}: any) => (
  <div
    className="relative flex flex-col items-center"
    onMouseEnter={() => onHover(n.id)}
    onMouseLeave={onLeave}
  >
    {/* Golden frame portrait */}
    <div
      className="relative w-[68px] h-[72px] flex flex-col items-center justify-end pb-1 cursor-pointer"
      onClick={() => onVisit(n)}
      style={{
        background: 'linear-gradient(180deg, #d4a020 0%, #a87010 40%, #d4a020 100%)',
        borderRadius: '50% 50% 8px 8px',
        border: '3px solid #8a5808',
        boxShadow: '0 4px 8px rgba(0,0,0,0.4), inset 0 1px 2px rgba(255,220,80,0.6)',
      }}
    >
      {/* Inner portrait area */}
      <div
        className="absolute inset-[3px] rounded-[50%_50%_5px_5px] overflow-hidden flex items-center justify-center"
        style={{ background: 'linear-gradient(180deg, #c0e8ff 0%, #70b0e0 50%, #a0d060 100%)' }}
      >
        {n.avatar.startsWith('/') ? (
          <img src={n.avatar} alt={n.name} className="w-full h-full object-cover" />
        ) : (
          <span className="text-4xl">{n.avatar}</span>
        )}
      </div>
      {/* Level badge */}
      <div
        className="absolute -bottom-1.5 left-1 text-[10px] font-black text-white w-5 h-5 rounded-full flex items-center justify-center border-2 border-white z-10"
        style={{ background: n.level >= 5 ? '#e04020' : '#20a040' }}
      >
        {n.level}
      </div>
      {/* Stars */}
      <div className="absolute -bottom-1.5 right-1 z-10 flex">
        {'⭐'.repeat(Math.min(n.level, 3)).split('').map((s, i) => (
          <span key={i} style={{ fontSize: 8, marginLeft: -1 }}>⭐</span>
        ))}
      </div>
    </div>
    <span
      className="mt-2 text-[10px] font-bold text-center leading-tight"
      style={{ color: '#f5e8c0', textShadow: '0 1px 2px rgba(0,0,0,0.6)', maxWidth: 68 }}
    >
      {n.name.replace('Tropical', '').replace('Coconut', '').replace('Island', '')}
    </span>

    {/* Hire button below name */}
    <button
      onClick={(e) => { e.stopPropagation(); onHire(n); }}
      className="mt-0.5 text-[9px] font-black px-2 py-0.5 rounded border active:scale-95 transition-transform"
      style={{
        background: 'linear-gradient(180deg, #50cc30, #289010)',
        borderColor: '#186808',
        borderBottomWidth: 2,
        color: 'white',
      }}
    >
      Hire
    </button>

    {/* ◄ ► arrows beside portrait */}
    <div className="absolute -left-3 top-6">
      <div
        className="w-3 h-3 rounded-sm flex items-center justify-center text-[10px] font-black text-white cursor-pointer"
        style={{ background: '#506080' }}
      >◄</div>
    </div>
    <div className="absolute -right-3 top-6">
      <div
        className="w-3 h-3 rounded-sm flex items-center justify-center text-[10px] font-black text-white cursor-pointer"
        style={{ background: '#506080' }}
      >►</div>
    </div>

    {/* Wishlist popover */}
    {isHovered && n.wishlist?.length > 0 && (
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-44 bg-white border-4 border-pink-400 rounded-xl p-3 shadow-2xl z-50 animate-in fade-in slide-in-from-bottom-2">
        <div className="text-center font-black text-pink-500 text-xs uppercase tracking-wider mb-2">Wishlist</div>
        {n.wishlist.map((itemId: string) => {
          const item = COLLECTIONS.find((c) => c.id === itemId);
          if (!item) return null;
          const has = ownedCollections[itemId];
          return (
            <div key={itemId} className="flex items-center justify-between gap-1 bg-gray-50 p-1 rounded mb-1 border border-gray-200">
              <span className="text-base">{item.emoji}</span>
              <span className="text-[10px] font-bold text-gray-600 flex-1 ml-1">{item.name}</span>
              {has && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    dispatch({ type: 'GIFT_ITEM', itemId, neighborId: n.id });
                    toast({ title: 'Gift Sent! 🎁', description: `+5 Favor` });
                  }}
                  className="bg-pink-500 text-white text-[9px] px-1.5 py-0.5 rounded font-bold active:scale-95"
                >
                  Send
                </button>
              )}
            </div>
          );
        })}
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-3 h-3 bg-pink-400 rotate-45" />
      </div>
    )}
  </div>
);

/* ─── Main bottom bar ────────────────────────────────────────────────────── */
export const NeighborPanel = () => {
  const { state, dispatch, activeTool, setActiveTool, activeBuildItem, setActiveBuildItem, setShopOpen } = useGame();
  const { toast } = useToast();
  const [hovered, setHovered] = useState<string | null>(null);

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

  return (
    <div
      className="absolute bottom-0 left-0 right-0 z-30 flex items-stretch select-none"
      style={{
        height: 96,
        background: 'linear-gradient(180deg, #9a7a50 0%, #7a5a30 100%)',
        borderTop: '3px solid #5a3a10',
        boxShadow: '0 -4px 12px rgba(0,0,0,0.5)',
        fontFamily: "'Fredoka', sans-serif",
      }}
    >
      {/* ── LEFT: island name + icons ── */}
      <div
        className="flex flex-col justify-center px-3 shrink-0"
        style={{
          minWidth: 110,
          borderRight: '2px solid #5a3a10',
          background: 'linear-gradient(180deg, #7a6040 0%, #5a4020 100%)',
        }}
      >
        <span className="text-white font-black text-sm leading-tight drop-shadow">{state.level > 1 ? `Lv${state.level}` : ''}</span>
        <span
          className="font-black text-xs leading-tight"
          style={{ color: '#ffd060', textShadow: '0 1px 3px rgba(0,0,0,0.7)' }}
        >
          Player's Island
        </span>
        <div className="flex gap-1 mt-1">
          {[['?','#4080c0'],['💬','#40a060'],['⚙️','#806040']].map(([icon, bg]) => (
            <div
              key={icon}
              className="w-6 h-6 flex items-center justify-center rounded text-xs cursor-pointer active:scale-95 transition-transform border"
              style={{ background: bg as string, borderColor: '#2a1a00', borderBottomWidth: 2 }}
            >
              {icon}
            </div>
          ))}
        </div>
      </div>

      {/* ── CENTER: scroll arrows + ADD NEIGHBOR + neighbor portraits ── */}
      <div className="flex items-center flex-1 overflow-hidden px-1 gap-1">
        {/* Left arrow */}
        <button
          className="w-7 h-20 rounded flex items-center justify-center text-white font-black text-lg shrink-0 active:scale-95 transition-transform border-b-2"
          style={{ background: 'linear-gradient(180deg, #708090, #4a5a6a)', borderColor: '#2a3a4a' }}
        >
          ◄
        </button>

        {/* ADD NEIGHBOR slots */}
        {ADD_NEIGHBOR_AVATARS.map(({ avatar, bg }, idx) => (
          <div
            key={idx}
            className="flex flex-col items-center justify-end shrink-0 cursor-pointer rounded overflow-hidden border-2 active:scale-95 transition-transform relative"
            style={{
              width: 72,
              height: 84,
              background: bg,
              borderColor: '#c0a870',
              boxShadow: 'inset 0 0 8px rgba(0,0,0,0.1)',
            }}
          >
            <div className="absolute inset-0 flex items-center justify-center overflow-hidden" style={{ paddingBottom: 16 }}>
              {avatar}
            </div>
            <div
              className="w-full flex flex-col items-center justify-center py-0.5 relative z-10"
              style={{ background: 'rgba(160,120,60,0.85)' }}
            >
              <span className="text-white font-black text-[9px] leading-none tracking-wide">ADD</span>
              <span className="text-white font-black text-[9px] leading-none tracking-wide">NEIGHBOR</span>
            </div>
          </div>
        ))}

        {/* Neighbor portraits */}
        {state.neighbors?.map((n) => (
          <NeighborPortrait
            key={n.id}
            n={n}
            onVisit={handleVisit}
            onHire={handleHire}
            onHover={setHovered}
            onLeave={() => setHovered(null)}
            isHovered={hovered === n.id}
            ownedCollections={state.collections}
            dispatch={dispatch}
            toast={toast}
          />
        ))}

        {/* Right arrow */}
        <button
          className="w-7 h-20 rounded flex items-center justify-center text-white font-black text-lg shrink-0 active:scale-95 transition-transform border-b-2 ml-2"
          style={{ background: 'linear-gradient(180deg, #708090, #4a5a6a)', borderColor: '#2a3a4a' }}
        >
          ►
        </button>
      </div>

      {/* ── RIGHT: tool buttons + market ── */}
      <div
        className="flex shrink-0"
        style={{
          borderLeft: '2px solid #5a3a10',
          background: 'linear-gradient(180deg, #6a5030 0%, #4a3010 100%)',
        }}
      >
        {/* Tools column */}
        <div className="flex flex-col items-center justify-center gap-1 px-2 border-r border-[#5a3a10]">
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

        {/* Market panel */}
        <div className="flex flex-col items-center justify-between py-1 px-1.5 w-[80px]">
          <span
            className="text-[10px] font-black text-yellow-200 tracking-widest"
            style={{ textShadow: '0 1px 2px rgba(0,0,0,0.6)' }}
          >
            MARKET
          </span>
          <button
            onClick={() => setShopOpen(true)}
            className="w-[72px] h-[62px] rounded-lg overflow-hidden border-2 active:scale-95 transition-transform relative"
            style={{ borderColor: '#c0901a', background: '#8b6020' }}
            title="Open Market"
          >
            {/* Market stall scene */}
            <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, #a0d060 0%, #70a030 50%, #c8a050 100%)' }} />
            {/* Stall top */}
            <div className="absolute top-0 left-0 right-0 h-4 flex items-center justify-center text-center"
              style={{ background: 'linear-gradient(180deg, #d4a020, #a07010)', borderBottom: '1px solid #604000' }}>
              <span className="text-[8px] font-black text-yellow-100">🏪 SHOP</span>
            </div>
            {/* Items on shelves */}
            <div className="absolute bottom-1 left-0 right-0 flex flex-wrap justify-center gap-0.5 px-1">
              {['🍎','🌽','🥥','🍅','🥚','🫐'].map((e, i) => (
                <span key={i} style={{ fontSize: 11 }}>{e}</span>
              ))}
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

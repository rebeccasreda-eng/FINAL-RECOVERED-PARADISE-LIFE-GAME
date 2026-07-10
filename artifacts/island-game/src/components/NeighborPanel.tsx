import React, { useState } from 'react';
import { useGame } from '../game/GameContext';
import { COLLECTIONS, EMOJI_MAP } from '../game/gameData';
import { ResourceType } from '../game/types';
import { useToast } from '@/hooks/use-toast';

/* ─── "Add Neighbor" pair avatars (chibi boy + girl + pet) ──────────────── */

/** Reusable chibi head helper – keeps each pair SVG concise */
const ChibiHead = ({
  cx, cy, r = 13,
  skin = '#fde8d0',
  hairColor, hairStyle,
  eyeColor,
  blushColor = '#ff8888',
}: {
  cx: number; cy: number; r?: number;
  skin?: string; hairColor: string; hairStyle: 'short'|'twintail'|'wavy'|'spiky'|'ponytail'|'bob';
  eyeColor: string; blushColor?: string;
}) => {
  const top = cy - r;
  return (
    <g>
      {/* Hair back */}
      <ellipse cx={cx} cy={cy - r * 0.3} rx={r + 2} ry={r * 0.95} fill={hairColor} />
      {/* Side hair */}
      {(hairStyle === 'twintail') && (<>
        <path d={`M${cx-r+1} ${cy+2} Q${cx-r-5} ${cy+18} ${cx-r+2} ${cy+28}`} stroke={hairColor} strokeWidth="7" fill="none" strokeLinecap="round"/>
        <path d={`M${cx+r-1} ${cy+2} Q${cx+r+5} ${cy+18} ${cx+r-2} ${cy+28}`} stroke={hairColor} strokeWidth="7" fill="none" strokeLinecap="round"/>
      </>)}
      {(hairStyle === 'wavy') && (<>
        <path d={`M${cx-r+1} ${cy} Q${cx-r-6} ${cy+16} ${cx-r+1} ${cy+26}`} stroke={hairColor} strokeWidth="8" fill="none" strokeLinecap="round"/>
        <path d={`M${cx+r-1} ${cy} Q${cx+r+6} ${cy+16} ${cx+r-1} ${cy+26}`} stroke={hairColor} strokeWidth="8" fill="none" strokeLinecap="round"/>
      </>)}
      {(hairStyle === 'ponytail') && (
        <path d={`M${cx+r-1} ${cy-4} Q${cx+r+10} ${cy+6} ${cx+r+6} ${cy+22}`} stroke={hairColor} strokeWidth="7" fill="none" strokeLinecap="round"/>
      )}
      {/* Head */}
      <circle cx={cx} cy={cy} r={r} fill={skin} />
      {/* Bangs / top hair */}
      <path d={`M${cx-r} ${cy-2} Q${cx-r+3} ${top-5} ${cx} ${top-5} Q${cx+r-3} ${top-5} ${cx+r} ${cy-2} Q${cx+r-2} ${top+3} ${cx} ${top+2} Q${cx-r+2} ${top+3} ${cx-r} ${cy-2}Z`} fill={hairColor}/>
      {(hairStyle === 'spiky') && (<>
        <polygon points={`${cx-6},${top+2} ${cx-9},${top-7} ${cx-2},${top-2}`} fill={hairColor}/>
        <polygon points={`${cx},${top} ${cx},${top-9} ${cx+5},${top-2}`} fill={hairColor}/>
        <polygon points={`${cx+5},${top+2} ${cx+10},${top-6} ${cx+7},${top+4}`} fill={hairColor}/>
      </>)}
      {/* Eyes */}
      <ellipse cx={cx-4.5} cy={cy+1} rx={3.2} ry={3.8} fill="white"/>
      <ellipse cx={cx+4.5} cy={cy+1} rx={3.2} ry={3.8} fill="white"/>
      <ellipse cx={cx-4.5} cy={cy+1.5} rx={2.1} ry={2.6} fill={eyeColor}/>
      <ellipse cx={cx+4.5} cy={cy+1.5} rx={2.1} ry={2.6} fill={eyeColor}/>
      <circle cx={cx-4.2} cy={cy+1.8} r={1.4} fill="#111"/>
      <circle cx={cx+4.8} cy={cy+1.8} r={1.4} fill="#111"/>
      <circle cx={cx-3.5} cy={cy+0.8} r={0.7} fill="white"/>
      <circle cx={cx+5.5} cy={cy+0.8} r={0.7} fill="white"/>
      {/* Blush */}
      <ellipse cx={cx-r+3} cy={cy+4} rx={3.2} ry={1.8} fill={blushColor} opacity="0.45"/>
      <ellipse cx={cx+r-3} cy={cy+4} rx={3.2} ry={1.8} fill={blushColor} opacity="0.45"/>
      {/* Smile */}
      <path d={`M${cx-3.5} ${cy+6} Q${cx} ${cy+9.5} ${cx+3.5} ${cy+6}`} stroke="#cc4466" strokeWidth="1.3" fill="none" strokeLinecap="round"/>
    </g>
  );
};

/** Small chibi body (shirt + arms) */
const ChibiBody = ({ cx, cy, shirtColor }: { cx: number; cy: number; shirtColor: string }) => (
  <g>
    <path d={`M${cx-9} ${cy} Q${cx-10} ${cy+18} ${cx-6} ${cy+24} Q${cx} ${cy+27} ${cx+6} ${cy+24} Q${cx+10} ${cy+18} ${cx+9} ${cy}Z`} fill={shirtColor}/>
    <path d={`M${cx-9} ${cy+2} Q${cx-16} ${cy+7} ${cx-14} ${cy+15}`} stroke="#fde8d0" strokeWidth="5" fill="none" strokeLinecap="round"/>
    <path d={`M${cx+9} ${cy+2} Q${cx+16} ${cy+7} ${cx+14} ${cy+15}`} stroke="#fde8d0" strokeWidth="5" fill="none" strokeLinecap="round"/>
  </g>
);

/* ── Pair 1: Blonde boy + dark twintail girl + white cat (closest to reference) */
const AvatarPair1 = () => (
  <svg viewBox="0 0 80 72" xmlns="http://www.w3.org/2000/svg" width="80" height="72">
    {/* Boy (left) */}
    <ChibiBody cx={21} cy={42} shirtColor="#6699ee"/>
    <ChibiHead cx={21} cy={27} hairColor="#f0c840" hairStyle="short" eyeColor="#4488cc"/>
    {/* Girl (right) */}
    <ChibiBody cx={57} cy={42} shirtColor="#ffaacc"/>
    <ChibiHead cx={57} cy={27} hairColor="#5a3010" hairStyle="twintail" eyeColor="#cc6688"/>
    {/* Yellow dress skirt on girl */}
    <path d="M48 55 Q57 62 66 55 Q63 68 57 70 Q51 68 48 55Z" fill="#ffcc44"/>
    {/* Cat in middle */}
    <ellipse cx="39" cy="60" rx="9" ry="7" fill="#f8f0e8"/>
    <circle cx="39" cy="55" r="7" fill="#f8f0e8"/>
    <polygon points="33,51 35,44 38,51" fill="#f8f0e8"/>
    <polygon points="45,51 43,44 40,51" fill="#f8f0e8"/>
    <polygon points="34,51 35,46 37.5,51" fill="#ffc0c0"/>
    <polygon points="44,51 43,46 40.5,51" fill="#ffc0c0"/>
    <ellipse cx="37" cy="56.5" rx="1.8" ry="2.2" fill="#333"/>
    <ellipse cx="41" cy="56.5" rx="1.8" ry="2.2" fill="#333"/>
    <circle cx="37.3" cy="55.8" r="0.7" fill="white"/>
    <circle cx="41.3" cy="55.8" r="0.7" fill="white"/>
    <ellipse cx="39" cy="59" rx="2" ry="1.2" fill="#e09090"/>
    <line x1="32" y1="58" x2="39" y2="59.5" stroke="#aaa" strokeWidth="0.7"/>
    <line x1="32" y1="60" x2="39" y2="60.5" stroke="#aaa" strokeWidth="0.7"/>
    <line x1="46" y1="58" x2="39" y2="59.5" stroke="#aaa" strokeWidth="0.7"/>
    <line x1="46" y1="60" x2="39" y2="60.5" stroke="#aaa" strokeWidth="0.7"/>
    {/* Blonde boy hair accessories - small star */}
    <circle cx="21" cy="14" r="2.5" fill="#ffd700" stroke="#e0b000" strokeWidth="0.8"/>
  </svg>
);

/* ── Pair 2: Blue spiky boy + pink wavy girl + orange fox */
const AvatarPair2 = () => (
  <svg viewBox="0 0 80 72" xmlns="http://www.w3.org/2000/svg" width="80" height="72">
    <ChibiBody cx={21} cy={42} shirtColor="#ee6644"/>
    <ChibiHead cx={21} cy={27} hairColor="#4488dd" hairStyle="spiky" eyeColor="#223388"/>
    <ChibiBody cx={57} cy={42} shirtColor="#cc88ee"/>
    <ChibiHead cx={57} cy={27} hairColor="#ff88bb" hairStyle="wavy" eyeColor="#8844cc"/>
    {/* Purple skirt on girl */}
    <path d="M48 55 Q57 62 66 55 Q63 68 57 70 Q51 68 48 55Z" fill="#cc88ee"/>
    {/* Pink hair bow */}
    <path d="M50 18 Q57 13 64 18 Q57 23 50 18Z" fill="#ff88bb" stroke="#ff5599" strokeWidth="0.6"/>
    <circle cx="57" cy="18" r="2.2" fill="#ff66aa"/>
    {/* Fox */}
    <ellipse cx="39" cy="61" rx="9" ry="6.5" fill="#e87820"/>
    <circle cx="39" cy="55" r="7" fill="#e87820"/>
    <polygon points="33,51 35,43 38,51" fill="#e87820"/>
    <polygon points="45,51 43,43 40,51" fill="#e87820"/>
    <circle cx="39" cy="57" r="4" fill="#f8d8c0"/>
    <ellipse cx="36.5" cy="56" rx="1.6" ry="2" fill="#111"/>
    <ellipse cx="41.5" cy="56" rx="1.6" ry="2" fill="#111"/>
    <circle cx="36.8" cy="55.3" r="0.6" fill="white"/>
    <circle cx="41.8" cy="55.3" r="0.6" fill="white"/>
    <ellipse cx="39" cy="58.5" rx="1.8" ry="1.1" fill="#c06040"/>
    {/* Bushy tail */}
    <path d="M48 62 Q58 56 60 64 Q55 70 48 64Z" fill="#e87820"/>
    <path d="M52 63 Q58 58 59 65 Q55 69 52 64Z" fill="white" opacity="0.8"/>
  </svg>
);

/* ── Pair 3: Brown boy + red-ponytail girl + yellow duck */
const AvatarPair3 = () => (
  <svg viewBox="0 0 80 72" xmlns="http://www.w3.org/2000/svg" width="80" height="72">
    <ChibiBody cx={21} cy={42} shirtColor="#66bb55"/>
    <ChibiHead cx={21} cy={27} hairColor="#8b5a2b" hairStyle="short" eyeColor="#6b8c40"/>
    <ChibiBody cx={57} cy={42} shirtColor="#ff8844"/>
    <ChibiHead cx={57} cy={27} hairColor="#cc3322" hairStyle="ponytail" eyeColor="#882200"/>
    {/* Orange skirt */}
    <path d="M48 55 Q57 62 66 55 Q63 68 57 70 Q51 68 48 55Z" fill="#ffaa44"/>
    {/* Duck */}
    <ellipse cx="39" cy="62" rx="9" ry="6" fill="#f8e840"/>
    <circle cx="39" cy="55.5" r="7" fill="#f8e840"/>
    <path d="M32 56 Q28 59 32 60 Q30 62 33 61Z" fill="#f09820"/>
    <ellipse cx="36.5" cy="55.5" rx="2" ry="2.2" fill="#224488"/>
    <ellipse cx="41.5" cy="55.5" rx="2" ry="2.2" fill="#224488"/>
    <circle cx="36.8" cy="54.8" r="0.7" fill="white"/>
    <circle cx="41.8" cy="54.8" r="0.7" fill="white"/>
    {/* Wing */}
    <path d="M30 62 Q35 67 44 64 Q44 70 38 70 Q30 69 30 62Z" fill="#f0d820"/>
    {/* Head tuft */}
    <path d="M37 50 Q39 46 41 50" stroke="#f0d820" strokeWidth="3" fill="none" strokeLinecap="round"/>
  </svg>
);

/* ── Pair 4: Silver boy + purple girl + white bunny */
const AvatarPair4 = () => (
  <svg viewBox="0 0 80 72" xmlns="http://www.w3.org/2000/svg" width="80" height="72">
    <ChibiBody cx={21} cy={42} shirtColor="#6688cc"/>
    <ChibiHead cx={21} cy={27} hairColor="#c8cce0" hairStyle="short" eyeColor="#8899cc"/>
    <ChibiBody cx={57} cy={42} shirtColor="#aaeedd"/>
    <ChibiHead cx={57} cy={27} hairColor="#8855cc" hairStyle="bob" eyeColor="#5533aa"/>
    {/* Mint skirt */}
    <path d="M48 55 Q57 62 66 55 Q63 68 57 70 Q51 68 48 55Z" fill="#88ddcc"/>
    {/* Purple hair bow */}
    <path d="M50 19 Q57 14 64 19 Q57 24 50 19Z" fill="#8855cc" stroke="#6633aa" strokeWidth="0.6"/>
    <circle cx="57" cy="19" r="2.2" fill="#6633bb"/>
    {/* Bunny */}
    <ellipse cx="39" cy="62" rx="8" ry="6" fill="white"/>
    <circle cx="39" cy="56" r="7" fill="white"/>
    {/* Ears */}
    <ellipse cx="34" cy="48" rx="3" ry="7" fill="white"/>
    <ellipse cx="44" cy="48" rx="3" ry="7" fill="white"/>
    <ellipse cx="34" cy="48" rx="1.5" ry="5.5" fill="#ffbbcc"/>
    <ellipse cx="44" cy="48" rx="1.5" ry="5.5" fill="#ffbbcc"/>
    <ellipse cx="37" cy="57.5" rx="1.8" ry="2" fill="#333"/>
    <ellipse cx="41" cy="57.5" rx="1.8" ry="2" fill="#333"/>
    <circle cx="37.3" cy="56.8" r="0.6" fill="white"/>
    <circle cx="41.3" cy="56.8" r="0.6" fill="white"/>
    <ellipse cx="39" cy="60" rx="2" ry="1.2" fill="#ffaacc"/>
    <line x1="33" y1="59.5" x2="39" y2="60.5" stroke="#ccc" strokeWidth="0.7"/>
    <line x1="33" y1="61" x2="39" y2="61.5" stroke="#ccc" strokeWidth="0.7"/>
    <line x1="45" y1="59.5" x2="39" y2="60.5" stroke="#ccc" strokeWidth="0.7"/>
    <line x1="45" y1="61" x2="39" y2="61.5" stroke="#ccc" strokeWidth="0.7"/>
  </svg>
);

const ADD_NEIGHBOR_AVATARS = [
  { avatar: <AvatarPair1 />, bg: 'linear-gradient(160deg, #a8d888 0%, #78c048 100%)' },
  { avatar: <AvatarPair2 />, bg: 'linear-gradient(160deg, #a0d8a0 0%, #68b858 100%)' },
  { avatar: <AvatarPair3 />, bg: 'linear-gradient(160deg, #b0d890 0%, #70b840 100%)' },
  { avatar: <AvatarPair4 />, bg: 'linear-gradient(160deg, #a8e0a0 0%, #60b850 100%)' },
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
            className="flex flex-col items-center justify-end shrink-0 cursor-pointer rounded-lg overflow-hidden active:scale-95 transition-transform relative"
            style={{
              width: 84,
              height: 90,
              background: bg,
              border: '3px solid #3a8a2a',
              boxShadow: '0 3px 8px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.3)',
            }}
          >
            {/* Inner highlight rim */}
            <div className="absolute inset-0 rounded-lg pointer-events-none" style={{ boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.35)' }}/>
            <div className="absolute inset-0 flex items-center justify-center overflow-hidden" style={{ paddingBottom: 18 }}>
              {avatar}
            </div>
            <div
              className="w-full flex flex-col items-center justify-center py-1 relative z-10"
              style={{ background: 'linear-gradient(180deg, #2a7018, #1e5810)', borderTop: '2px solid #1a4810' }}
            >
              <span className="text-white font-black text-[9px] leading-none tracking-widest uppercase">Add</span>
              <span className="text-white font-black text-[9px] leading-none tracking-widest uppercase">Neighbor</span>
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

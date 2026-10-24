import React, { useState } from 'react';
import { useGame } from '../game/GameContext';
import { ResourceType } from '../game/types';

type QuickTab = 'player' | 'market' | 'marina' | null;

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

/* ─── Quick-panel SVG icons ─────────────────────────────────────────────── */
const IcoCursor = () => (
  <svg viewBox="0 0 28 28" width="22" height="22">
    <polygon points="5,3 5,22 10,17 14,25 17,24 13,16 20,16" fill="white" stroke="#333" strokeWidth="1.2" strokeLinejoin="round"/>
    <polygon points="5,3 5,22 10,17 14,25 17,24 13,16 20,16" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="0.5"/>
  </svg>
);
const IcoMarketSign = () => (
  <svg viewBox="0 0 36 28" width="32" height="24">
    <rect x="2" y="6" width="32" height="18" rx="3" fill="#e84020" stroke="#901010" strokeWidth="1.5"/>
    <rect x="2" y="6" width="32" height="6" rx="3" fill="#c83010"/>
    <text x="18" y="19" textAnchor="middle" fontSize="7.5" fontWeight="900" fill="white" fontFamily="'Fredoka', sans-serif" letterSpacing="0.5">MARKET</text>
    <rect x="15" y="2" width="6" height="6" rx="1" fill="#8a6020"/>
    <rect x="16.5" y="1" width="3" height="4" rx="1" fill="#6a4010"/>
  </svg>
);
const IcoCharacter = () => (
  <svg viewBox="0 0 28 28" width="22" height="22">
    <circle cx="14" cy="9" r="6" fill="#f5c890" stroke="#c08840" strokeWidth="1"/>
    <ellipse cx="14" cy="26" rx="9" ry="6" fill="#5080d8" stroke="#3060b0" strokeWidth="1"/>
    <circle cx="12" cy="8" r="1.2" fill="#3a2a10"/>
    <circle cx="16" cy="8" r="1.2" fill="#3a2a10"/>
    <path d="M12,12 Q14,14 16,12" stroke="#c08840" strokeWidth="1" fill="none" strokeLinecap="round"/>
  </svg>
);
const IcoFish = () => (
  <svg viewBox="0 0 32 24" width="28" height="20">
    <path d="M6,12 Q2,7 2,12 Q2,17 6,12Z" fill="#f0a020"/>
    <ellipse cx="17" cy="12" rx="13" ry="7" fill="#f0a020" stroke="#c07010" strokeWidth="1"/>
    <ellipse cx="17" cy="12" rx="11" ry="5.5" fill="#f8c040" opacity="0.5"/>
    <circle cx="25" cy="10" r="2" fill="white" stroke="#c07010" strokeWidth="0.7"/>
    <circle cx="25.5" cy="9.5" r="1" fill="#1a1a1a"/>
    <path d="M10,8 Q12,10 10,12 Q8,10 10,8Z" fill="#c07010" opacity="0.5"/>
  </svg>
);
const IcoGift = () => (
  <svg viewBox="0 0 28 28" width="22" height="22">
    <rect x="3" y="12" width="22" height="13" rx="2" fill="#e83050" stroke="#a01030" strokeWidth="1"/>
    <rect x="3" y="9" width="22" height="5" rx="1.5" fill="#f04060" stroke="#a01030" strokeWidth="1"/>
    <rect x="12" y="9" width="4" height="16" fill="#f0d000"/>
    <path d="M14,9 Q14,5 10,5 Q8,5 8,7 Q8,9 14,9Z" fill="#f04060" stroke="#a01030" strokeWidth="0.8"/>
    <path d="M14,9 Q14,5 18,5 Q20,5 20,7 Q20,9 14,9Z" fill="#f04060" stroke="#a01030" strokeWidth="0.8"/>
    <path d="M14,9 Q11,7 10,5" stroke="#f0d000" strokeWidth="1.5" fill="none"/>
    <path d="M14,9 Q17,7 18,5" stroke="#f0d000" strokeWidth="1.5" fill="none"/>
  </svg>
);
const IcoScreen = () => (
  <svg viewBox="0 0 28 24" width="22" height="18">
    <rect x="2" y="2" width="24" height="16" rx="2" fill="#1a2a3a" stroke="#4888c8" strokeWidth="1.5"/>
    <rect x="4" y="4" width="20" height="12" rx="1" fill="#0a4888"/>
    <rect x="4" y="4" width="20" height="12" rx="1" fill="url(#scrGrad)"/>
    <defs><linearGradient id="scrGrad" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#60b0ff" stopOpacity="0.3"/><stop offset="100%" stopColor="transparent"/></linearGradient></defs>
    <rect x="11" y="18" width="6" height="3" fill="#2a3a4a"/>
    <rect x="8" y="21" width="12" height="2" rx="1" fill="#3a4a5a"/>
  </svg>
);
const IcoQuestion = () => (
  <svg viewBox="0 0 22 22" width="18" height="18">
    <circle cx="11" cy="11" r="10" fill="#1a4a18" stroke="#2a7a20" strokeWidth="1.5"/>
    <text x="11" y="16" textAnchor="middle" fontSize="13" fontWeight="900" fill="white" fontFamily="'Fredoka', sans-serif">?</text>
  </svg>
);
const IcoGear = () => (
  <svg viewBox="0 0 22 22" width="18" height="18">
    <circle cx="11" cy="11" r="10" fill="#1a4a18" stroke="#2a7a20" strokeWidth="1.5"/>
    {[0,45,90,135,180,225,270,315].map(a=>(
      <rect key={a} x="10" y="2" width="2" height="4" rx="1" fill="white" opacity="0.85"
        transform={`rotate(${a} 11 11)`}/>
    ))}
    <circle cx="11" cy="11" r="3.5" fill="#1a4a18" stroke="white" strokeWidth="1.2"/>
  </svg>
);

/* ─── Quick-actions floating panel ─────────────────────────────────────── */
const QuickPanel = ({
  tab,
  onClose,
  onOpenShop,
  onOpenQuests,
  onOpenCollections,
}: {
  tab: QuickTab;
  onClose: () => void;
  onOpenShop: () => void;
  onOpenQuests?: () => void;
  onOpenCollections?: () => void;
}) => {
  if (!tab) return null;

  // Tile background — dark olive like the reference
  const tileBg = 'linear-gradient(180deg, #5a6838 0%, #3e4a24 100%)';
  const tileStyle: React.CSSProperties = {
    width: 52, height: 48,
    borderRadius: 8,
    background: tileBg,
    border: '2px solid #2a3010',
    borderBottom: '3px solid #1a2008',
    display: 'flex', flexDirection: 'column',
    alignItems: 'center', justifyContent: 'center',
    gap: 2, cursor: 'pointer',
    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.18), 0 2px 4px rgba(0,0,0,0.4)',
    position: 'relative', overflow: 'hidden',
    transition: 'transform 0.08s',
  };
  const tileLabel: React.CSSProperties = {
    fontSize: 8, fontWeight: 900, color: '#d8e8a0', letterSpacing: '0.04em',
    textShadow: '0 1px 2px rgba(0,0,0,0.7)', lineHeight: 1,
  };

  const actions = tab === 'market'
    ? [
        { icon: <IcoCursor />,      label: 'SELECT',    cb: onClose },
        { icon: <IcoMarketSign />,  label: 'MARKET',    cb: () => { onOpenShop(); onClose(); } },
        { icon: <IcoCharacter />,   label: 'PROFILE',   cb: onClose },
        { icon: <IcoFish />,        label: 'FISHING',   cb: onClose },
        { icon: <IcoGift />,        label: 'GIFTS',     cb: onClose },
        { icon: <IcoScreen />,      label: 'DISPLAY',   cb: onClose },
      ]
    : [
        { icon: <IcoCursor />,      label: 'SELECT',    cb: onClose },
        { icon: <IcoCharacter />,   label: 'PROFILE',   cb: onClose },
        { icon: <IcoMarketSign />,  label: 'SHOP',      cb: () => { onOpenShop(); onClose(); } },
        { icon: <IcoGift />,        label: 'GIFTS',     cb: onClose },
        { icon: <IcoFish />,        label: 'FISHING',   cb: onClose },
        { icon: <IcoScreen />,      label: 'DISPLAY',   cb: onClose },
      ];

  return (
    <div
      style={{
        position: 'absolute',
        bottom: 112, right: 10,
        width: 174, 
        background: 'linear-gradient(180deg, #3a4220 0%, #262e14 100%)',
        border: '3px solid #1a2008',
        borderRadius: 12,
        boxShadow: '0 -4px 20px rgba(0,0,0,0.65), inset 0 1px 0 rgba(255,255,255,0.10)',
        zIndex: 60,
        overflow: 'hidden',
        fontFamily: "'Fredoka', sans-serif",
      }}
    >
      {/* ── Header: Cancel + ? + Screen ── */}
      <div style={{ display: 'flex', gap: 4, padding: '6px 6px 4px', alignItems: 'center' }}>
        {/* Cancel */}
        <button
          onClick={onClose}
          style={{
            flex: 1, height: 26,
            background: 'linear-gradient(180deg, #e83020 0%, #a01808 100%)',
            border: '2px solid #700810', borderBottom: '3px solid #500408',
            borderRadius: 7, color: 'white', fontSize: 9, fontWeight: 900,
            letterSpacing: '0.08em', cursor: 'pointer',
            textShadow: '0 1px 2px rgba(0,0,0,0.5)',
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.22)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 3,
          }}
        >
          ✕ CANCEL
        </button>
        {/* ? */}
        <button
          style={{
            width: 28, height: 26,
            background: 'linear-gradient(180deg, #2a6020 0%, #184010 100%)',
            border: '2px solid #0e2808', borderBottom: '3px solid #0a1c04',
            borderRadius: 7, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.18)',
          }}
        ><IcoQuestion /></button>
        {/* Screen */}
        <button
          style={{
            width: 28, height: 26,
            background: 'linear-gradient(180deg, #2a6020 0%, #184010 100%)',
            border: '2px solid #0e2808', borderBottom: '3px solid #0a1c04',
            borderRadius: 7, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.18)',
          }}
        ><IcoScreen /></button>
      </div>

      {/* ── 3×2 Icon grid ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 4, padding: '0 6px 6px' }}>
        {actions.map(({ icon, label, cb }) => (
          <button
            key={label}
            onClick={cb}
            style={tileStyle}
            onMouseEnter={e => (e.currentTarget.style.transform = 'scale(0.94)')}
            onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
          >
            {/* Sheen */}
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '40%', background: 'linear-gradient(180deg, rgba(255,255,255,0.15), transparent)', borderRadius: '6px 6px 0 0', pointerEvents: 'none' }}/>
            {icon}
            <span style={tileLabel}>{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

/* ─── Nav arrow button — stone/beige pill like the reference ────────────── */
const NavArrowBtn = ({ symbol, title, onClick }: { symbol: React.ReactNode; title: string; onClick?: () => void }) => (
  <button
    onClick={onClick}
    title={title}
    className="active:scale-90 transition-transform"
    style={{
      width: 36, height: 22,
      borderRadius: 5,
      background: 'linear-gradient(180deg, #e6e0d5 0%, #a9a49c 100%)',
      border: '2px solid #6d665c',
      borderBottom: '3px solid #4f4a43',
      boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.65), 0 2px 3px rgba(0,0,0,0.35)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      cursor: 'pointer', color: '#514a40', fontSize: 11, fontWeight: 900,
    }}
  >{symbol}</button>
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

/* ─── Scattered-star background helper ──────────────────────────────────── */
const StarsBg = ({ fill = '#d4b060' }: { fill?: string }) => (
  <>
    <rect width="72" height="54" fill={fill}/>
    {([[8,6],[58,8],[65,22],[10,38],[52,44],[30,48],[20,22],[60,34],[36,14],[44,40]] as [number,number][]).map(([x,y],i) => (
      <polygon key={i}
        points={`${x},${y-4} ${x+1.2},${y-1.2} ${x+4},${y-1.2} ${x+2},${y+1.2} ${x+2.5},${y+4} ${x},${y+2} ${x-2.5},${y+4} ${x-2},${y+1.2} ${x-4},${y-1.2} ${x-1.2},${y-1.2}`}
        fill="#f8d820" opacity={0.35 + (i % 3) * 0.12}/>
    ))}
  </>
);

/* ─── Player blank card illustration ─────────────────────────────────────── */
const PlayerBlankIllus = () => (
  <svg viewBox="0 0 72 54" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
    <StarsBg fill="#c8b8a0"/>
    {/* Grey silhouette */}
    <circle cx="36" cy="19" r="10" fill="#9a8878" opacity="0.55"/>
    <ellipse cx="36" cy="44" rx="14" ry="10" fill="#9a8878" opacity="0.55"/>
    {/* Question mark */}
    <text x="36" y="24" textAnchor="middle" fontSize="13" fontWeight="900" fill="rgba(255,255,255,0.7)" fontFamily="'Fredoka',sans-serif">?</text>
  </svg>
);

/* ─── Marina character illustration ─────────────────────────────────────── */
const MarinaCharIllus = () => (
  <svg viewBox="0 0 72 54" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
    <StarsBg fill="#c0b0e8"/>
    {/* Body */}
    <ellipse cx="36" cy="50" rx="14" ry="9" fill="#e060a8"/>
    {/* Shirt detail */}
    <ellipse cx="36" cy="44" rx="10" ry="6" fill="#f070b8"/>
    {/* Neck */}
    <rect x="33" y="36" width="6" height="6" rx="2" fill="#f5c890"/>
    {/* Head */}
    <circle cx="36" cy="30" r="11" fill="#f5c890"/>
    {/* Hair back layer */}
    <ellipse cx="36" cy="24" rx="13" ry="9" fill="#f050b0"/>
    {/* Hair sides */}
    <ellipse cx="25" cy="32" rx="5" ry="11" fill="#f050b0"/>
    <ellipse cx="47" cy="32" rx="5" ry="11" fill="#f050b0"/>
    {/* Hair front */}
    <ellipse cx="36" cy="20" rx="12" ry="7" fill="#ff80cc"/>
    {/* Hair highlight */}
    <ellipse cx="31" cy="19" rx="4" ry="3" fill="#ffaade" opacity="0.7"/>
    {/* Eyes */}
    <ellipse cx="31.5" cy="30" rx="3" ry="3.5" fill="#5050e8"/>
    <ellipse cx="40.5" cy="30" rx="3" ry="3.5" fill="#5050e8"/>
    <ellipse cx="31.5" cy="29" rx="2.5" ry="3" fill="#7070ff"/>
    <ellipse cx="40.5" cy="29" rx="2.5" ry="3" fill="#7070ff"/>
    <circle cx="32.5" cy="28" r="1.2" fill="white"/>
    <circle cx="41.5" cy="28" r="1.2" fill="white"/>
    {/* Lashes */}
    <path d="M28.5,27.5 Q29.5,26 31,27" stroke="#2020a0" strokeWidth="1" fill="none"/>
    <path d="M37.5,27.5 Q38.5,26 40,27" stroke="#2020a0" strokeWidth="1" fill="none"/>
    {/* Smile */}
    <path d="M33,34.5 Q36,37.5 39,34.5" stroke="#c06840" strokeWidth="1.3" fill="none" strokeLinecap="round"/>
    {/* Rosy cheeks */}
    <circle cx="28" cy="33" r="3" fill="#ff9090" opacity="0.45"/>
    <circle cx="44" cy="33" r="3" fill="#ff9090" opacity="0.45"/>
  </svg>
);

const BlankPlayerAvatar = () => (
  <div style={{
    position: 'absolute', inset: 0,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    background: 'linear-gradient(180deg, #f6f4ef 0%, #e9e6df 100%)',
  }}>
    <svg width="46" height="46" viewBox="0 0 64 64" role="img" aria-label="Blank player avatar">
      <circle cx="32" cy="21" r="12" fill="#b6b6b6" />
      <path d="M9 59c1.7-13.3 10.6-21 23-21s21.3 7.7 23 21c.2 1.8-1.2 3-3 3H12c-1.8 0-3.2-1.2-3-3Z" fill="#b6b6b6" />
    </svg>
  </div>
);

const PlayerRatingBadges = ({ hearts, stars }: { hearts: number; stars: number }) => (
  <div style={{
    position: 'absolute', inset: 0, zIndex: 2, pointerEvents: 'none',
    display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
  }}>
    <svg width="26" height="23" viewBox="0 0 30 28" role="img" aria-label={`${hearts} heart`}>
      <path
        d="M15 26C12.5 23.8 2 17.1 2 9.7 2 2.6 10.6.5 15 6.5 19.4.5 28 2.6 28 9.7 28 17.1 17.5 23.8 15 26Z"
        fill="#e63a33" stroke="#a91d21" strokeWidth="1.5"
      />
      <text x="15" y="16" textAnchor="middle" fontSize="9" fontWeight="900" fill="#fff7df">{hearts}</text>
    </svg>
    <svg width="26" height="23" viewBox="0 0 30 28" role="img" aria-label={`${stars} stars`}>
      <path
        d="M15 1.2 18.7 9 27.4 9.9 20.9 15.7 22.7 24.2 15 19.8 7.3 24.2 9.1 15.7 2.6 9.9 11.3 9Z"
        fill="#ffd33f" stroke="#a97b1d" strokeWidth="1.5" strokeLinejoin="round"
      />
      <text x="15" y="16.5" textAnchor="middle" fontSize="8" fontWeight="900" fill="#4d3a1f">{stars}</text>
    </svg>
  </div>
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
  name, illus, hearts = 1, stars = 5, showStats = true,
}: {
  name: string; illus?: React.ReactNode; hearts?: number; stars?: number; showStats?: boolean;
}) => (
  <div
    className="active:scale-95 transition-transform"
    style={{
      width: 64, flexShrink: 0, height: 85, alignSelf: 'center',
      border: '2px solid #e4d3ab',
      borderBottom: '3px solid #96794a',
      borderRadius: 5,
      background: 'linear-gradient(180deg, #f1e2c0 0%, #d5c092 100%)',
      display: 'flex', flexDirection: 'column', overflow: 'hidden', cursor: 'pointer',
      boxShadow: 'inset 0 1px 0 rgba(255,255,255,.65), 0 2px 5px rgba(0,0,0,.3)',
    }}
  >
    {/* Name tab */}
    <div style={{
      background: 'linear-gradient(180deg, #eadbb7 0%, #d3be8e 100%)',
      padding: '2px 4px', textAlign: 'center',
      fontSize: 9, fontWeight: 900, color: '#3d3828', letterSpacing: '0.04em',
      flexShrink: 0, lineHeight: '14px',
    }}>{name}</div>
    {/* Illustration */}
    <div style={{ flex: 1, position: 'relative', overflow: 'hidden', background: 'linear-gradient(180deg, #f6eedb, #e5d6b4)' }}>
      {illus}
      {showStats && <PlayerRatingBadges hearts={hearts} stars={stars} />}
    </div>
  </div>
);

/* ─── Marina card — the source image includes its matching frame and ratings ─ */
const MarinaSnapshotCard = () => (
  <div
    style={{
      width: 64, flexShrink: 0, height: 85, alignSelf: 'center',
      overflow: 'hidden',
      borderRadius: 5,
      boxShadow: '0 2px 5px rgba(0,0,0,.3)',
    }}
  >
    <img
      src="/marina.jpg"
      alt="Marina, one heart and five stars"
      draggable={false}
      style={{ display: 'block', width: '100%', height: '100%', objectFit: 'contain' }}
    />
  </div>
);

/* ─── Add-neighbor card — flex-fill so 5 cards span the available width ── */
const AddNeighborCard = ({ image }: { image: string }) => (
  <div
    className="active:scale-95 transition-transform"
    style={{
      flex: 1, minWidth: 0, height: '100%',
      display: 'flex', overflow: 'hidden', cursor: 'pointer',
    }}
  >
    <img
      src={image}
      alt="Add neighbor invitation"
      draggable={false}
      style={{ display: 'block', width: '100%', height: '100%', objectFit: 'contain' }}
    />
  </div>
);

/* ─── Player card — player's own island ─────────────────────────────────── */
const PlayerCard = ({ name, level }: { name: string; level: number }) => (
  <div
    className="active:scale-95 transition-transform"
    style={{
      width: 76, flexShrink: 0, height: '100%',
      border: '2px solid #c8880a',
      borderBottom: '3px solid #8a5004',
      borderRadius: 8,
      background: 'linear-gradient(180deg, #f5dea0 0%, #d4b060 100%)',
      display: 'flex', flexDirection: 'column', overflow: 'hidden', cursor: 'pointer',
      boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.35), 0 2px 6px rgba(0,0,0,0.35)',
    }}
  >
    <div style={{
      background: 'linear-gradient(180deg, #3e2008 0%, #2a1404 100%)',
      padding: '2px 4px', textAlign: 'center',
      fontSize: 8, fontWeight: 900, color: '#f5e0a0', letterSpacing: '0.06em',
      flexShrink: 0, lineHeight: '13px',
    }}>MY ISLAND</div>
    <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
      <MarinaIllus />
    </div>
    <div style={{
      display: 'flex', justifyContent: 'center', alignItems: 'center',
      padding: '2px 0', background: 'rgba(0,0,0,0.28)', flexShrink: 0,
      fontSize: 8, color: '#f5e0a0', fontWeight: 900, gap: 3,
    }}>
      <span>{name}</span>
      <span style={{ color: '#c8a060' }}>Lv{level}</span>
    </div>
  </div>
);

/* ─── Marina card — always shown next to PlayerCard ─────────────────────── */
const MarinaCard = () => (
  <div
    style={{
      width: 76, flexShrink: 0, height: '100%',
      border: '2px solid #1870b8',
      borderBottom: '3px solid #0e4880',
      borderRadius: 8,
      background: 'linear-gradient(180deg, #a0d8f8 0%, #5090d0 100%)',
      display: 'flex', flexDirection: 'column', overflow: 'hidden',
      boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.40), 0 2px 6px rgba(0,0,0,0.35)',
    }}
  >
    <div style={{
      background: 'linear-gradient(180deg, #0e3870 0%, #082450 100%)',
      padding: '2px 4px', textAlign: 'center',
      fontSize: 8, fontWeight: 900, color: '#a0d8ff', letterSpacing: '0.06em',
      flexShrink: 0, lineHeight: '13px',
    }}>MARINA</div>
    <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
      <MarinaIllus />
    </div>
  </div>
);

/* ─── Inline market grid — bigger tiles, warm tan background ─────────────── */
const InlineMarketGrid = ({ onOpenShop, onOpenQuests, onOpenCollections }: {
  onOpenShop: () => void;
  onOpenQuests?: () => void;
  onOpenCollections?: () => void;
}) => {
  const cell: React.CSSProperties = {
    width: 52, height: 38,
    borderRadius: 4,
    background: 'linear-gradient(180deg, #eee4cd 0%, #c1b391 100%)',
    border: '2px solid #74654d',
    borderBottom: '3px solid #4e4435',
    display: 'flex', flexDirection: 'column',
    alignItems: 'center', justifyContent: 'center',
    gap: 0, cursor: 'pointer', padding: 0,
    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.45), 0 2px 3px rgba(0,0,0,0.35)',
    position: 'relative', overflow: 'hidden',
    transition: 'transform 0.08s',
  };
  const tiles = [
    { icon: <IcoCursor />,     label: 'Select',      cb: () => {} },
    { icon: <IcoMarketSign />, label: 'Market',      cb: onOpenShop },
    { icon: <IcoCharacter />,  label: 'Profile',     cb: onOpenCollections ?? (() => {}) },
    { icon: <IcoQuest />,      label: 'Quests',      cb: onOpenQuests ?? (() => {}) },
    { icon: <IcoGift />,       label: 'Collections', cb: onOpenCollections ?? (() => {}) },
    { icon: <IcoPlant />,      label: 'Garden',      cb: onOpenCollections ?? (() => {}) },
  ];
  return (
    <div style={{
      flexShrink: 0,
      padding: '0 5px',
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 52px)',
      gridTemplateRows: 'repeat(2, 38px)',
      gap: 4,
      alignSelf: 'center',
    }}>
      {tiles.map(({ icon, label, cb }) => (
        <button
          key={label}
          onClick={cb}
          style={cell}
          onMouseEnter={e => (e.currentTarget.style.transform = 'scale(0.94)')}
          onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
          title={label}
          aria-label={label}
        >
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '40%', background: 'linear-gradient(180deg, rgba(255,255,255,0.35), transparent)', borderRadius: '4px 4px 0 0', pointerEvents: 'none' }}/>
          <div style={{
            height: 30, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>{icon}</div>
        </button>
      ))}
    </div>
  );
};

/* ─── Market card — shop shortcut in the neighbor strip ─────────────────── */
const MarketCard = ({ onClick }: { onClick: () => void }) => (
  <button
    onClick={onClick}
    className="active:scale-95 transition-transform"
    style={{
      width: 76, flexShrink: 0, height: '100%',
      border: '2px solid #186010',
      borderBottom: '3px solid #0e4008',
      borderRadius: 8,
      background: 'linear-gradient(180deg, #70d850 0%, #38a018 100%)',
      display: 'flex', flexDirection: 'column', overflow: 'hidden', cursor: 'pointer',
      boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.35), 0 2px 6px rgba(0,0,0,0.35)',
    }}
  >
    <div style={{
      background: 'linear-gradient(180deg, #0e4008 0%, #083004 100%)',
      padding: '2px 4px', textAlign: 'center',
      fontSize: 8, fontWeight: 900, color: '#80f040', letterSpacing: '0.07em',
      flexShrink: 0, lineHeight: '13px',
    }}>MARKET</div>
    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26 }}>
      <IcoMarketSign />
    </div>
  </button>
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
    <IcoMarketSign /> MARKET
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

  const [quickTab, setQuickTab] = useState<QuickTab>(null);
  const toggleTab = (tab: 'player' | 'market') =>
    setQuickTab(prev => (prev === tab ? null : tab));

  const BUILDABLES: ResourceType[] = ['HUT','DOCK','WELL','FLOWER_POT','FENCE','LANTERN'];
  const ownedStructures = BUILDABLES.filter(s => (state.inventory[s] ?? 0) > 0);

  return (
    <div
      className="absolute bottom-0 left-0 right-0 z-30 flex flex-col select-none"
      style={{
        height: 'calc(105px + min(36px, 4.12vw))',
        fontFamily: "'Fredoka', sans-serif",
        boxShadow: '0 -4px 18px rgba(0,0,0,0.48)',
        border: '1px solid #242b33',
        boxSizing: 'border-box',
      }}
    >
      {/* Supplied Player's Island strip and icons; the earlier-removed Cancel button stays hidden. */}
      <div
        role="img"
        aria-label="Player's Island header with navigation, help, and settings icons"
        style={{
          position: 'relative',
          width: '100%',
          height: 'min(36px, 4.12vw)',
          flexShrink: 0,
          overflow: 'hidden',
        }}
      >
        <img
          src={islandPanelHeaderReference}
          alt=""
          draggable={false}
          style={{ display: 'block', width: '100%', height: '100%' }}
        />
        <span
          aria-hidden="true"
          style={{
            position: 'absolute',
            left: '76.4%',
            top: '8%',
            width: '10.2%',
            height: '80%',
            background: '#2aa0f4',
          }}
        />
      </div>

      {/* ── Main panel body ─────────────────────────────────────────────── */}
      <div
        className="flex flex-1 min-h-0"
        style={{
          background: 'repeating-linear-gradient(90deg, rgba(96,66,28,.05) 0 2px, transparent 2px 24px), linear-gradient(180deg, #e2d0a6 0%, #c3a878 100%)',
        }}
      >
        {/* ── Neighbor strip (flex-1) ────────────────────────────────────── */}
        <div className="flex flex-1 min-w-0">
          {/* Card row: neighbors, blank Jake profile, Marina, then paging arrows */}
          <div className="flex flex-1 min-h-0 min-w-0" style={{ padding: '4px', gap: 4, alignItems: 'center' }}>

            {/* Left-pointing arrows replacing the island cards */}
            <div className="hidden sm:flex" style={{ height: '100%', flexShrink: 0 }}>
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 3, flexShrink: 0 }}>
                <NavArrowBtn symbol="◀" title="Back" />
                <NavArrowBtn symbol="◀" title="Back" />
                <NavArrowBtn symbol="◀" title="Back" />
              </div>
            </div>

            {/* Thin divider */}
            <div className="hidden sm:block" style={{ width: 2, height: '82%', background: 'rgba(94,68,37,.45)', borderRadius: 1, flexShrink: 0, margin: '0 4px' }} />

            {/* Five repeated two-person neighbor invitation cards */}
            <div
              className="flex min-w-0"
              style={{
                width: 'min(44vw, 450px)', flexShrink: 1, gap: 3,
                alignItems: 'center', justifyContent: 'center',
              }}
            >
              {Array.from({ length: EMPTY_SLOTS }, (_, i) => (
                <div
                  key={i}
                  className={i >= 3 ? 'hidden sm:flex' : 'flex min-w-0'}
                  style={{ flex: 1, minWidth: 0, height: 85 }}
                >
                  <AddNeighborCard image={i % 2 === 0 ? addNeighborPortraitsA : addNeighborPortraitsB} />
                </div>
              ))}
            </div>

            {/* Thin divider before tabs */}
            <div className="hidden sm:block" style={{ width: 2, height: '82%', background: 'rgba(94,68,37,.45)', borderRadius: 1, flexShrink: 0, margin: '0 4px' }} />

            {/* PLAYER / MARKET / MARINA tabs */}
            <div className="hidden sm:flex" style={{ height: '100%', alignItems: 'center' }}>
              <NeighborCard name={playerName} illus={<BlankPlayerAvatar />} hearts={1} stars={1} />
            </div>
            <div style={{ height: '100%', display: 'flex', alignItems: 'center', flexShrink: 0 }}>
              <MarinaSnapshotCard />
            </div>

            {/* Right-pointing arrows after MARINA */}
            <div className="hidden sm:flex" style={{ height: '100%', flexShrink: 0 }}>
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 3, flexShrink: 0 }}>
                <NavArrowBtn symbol="▶" title="Next" />
                <NavArrowBtn symbol="▶" title="Next" />
                <NavArrowBtn symbol="▶" title="Next" />
              </div>
            </div>
          </div>
        </div>

        {/* ── Separator ──────────────────────────────────────────────────── */}
        <div className="hidden sm:block" style={{ width: 2, background: 'rgba(94,68,37,.55)', alignSelf: 'stretch', margin: '5px 0' }}/>

        {/* ── Right dock — market grid ────────────────────────────────────── */}
        <div
          className="hidden sm:flex"
          style={{
            flexShrink: 0,
            background: 'repeating-linear-gradient(90deg, rgba(96,66,28,.05) 0 2px, transparent 2px 24px), linear-gradient(180deg, #e2d0a6 0%, #c3a878 100%)',
            borderLeft: '2px solid #80603a',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '0 5px',
          }}
        >
          <InlineMarketGrid
            onOpenShop={() => setShopOpen(true)}
            onOpenQuests={onOpenQuests}
            onOpenCollections={onOpenCollections}
          />
        </div>
      </div>

      {/* ── Quick-actions floating panel ────────────────────────────────── */}
      <QuickPanel
        tab={quickTab}
        onClose={() => setQuickTab(null)}
        onOpenShop={() => setShopOpen(true)}
        onOpenQuests={onOpenQuests}
        onOpenCollections={onOpenCollections}
      />

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
                <span style={{ color: '#70502a', fontSize: 9, fontWeight: 900, letterSpacing: '.04em' }}>
                  {item.replace('_', ' ')}
                </span>
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

/** Shared chibi character SVG components — detailed anime style matching reference. */

type Facing = 'front' | 'back' | 'left' | 'right';
interface SpriteProps { size?: number; isWalking?: boolean; facing?: Facing; }

/* ═══════════════════════════════════════════════════════════════════════════
   ChMia — auburn hair, blue striped outfit
   ═══════════════════════════════════════════════════════════════════════════ */
export const ChMia = ({ size = 120, isWalking, facing }: SpriteProps) => {
  if (facing === 'back') return (
    <svg viewBox="0 0 100 140" width={size} height={size * 1.4} xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="50" cy="137" rx="22" ry="4" fill="#00000025"/>
      <g className={isWalking ? 'char-leg-a' : undefined} style={{ transformOrigin: '41.5px 108px' }}>
        <rect x="36" y="108" width="11" height="25" rx="5" fill="#fde8d0"/>
        <ellipse cx="41" cy="133" rx="9" ry="5" fill="#4466cc"/>
      </g>
      <g className={isWalking ? 'char-leg-b' : undefined} style={{ transformOrigin: '58.5px 108px' }}>
        <rect x="53" y="108" width="11" height="25" rx="5" fill="#fde8d0"/>
        <ellipse cx="59" cy="133" rx="9" ry="5" fill="#4466cc"/>
      </g>
      <path d="M28 90 Q30 118 42 118 L58 118 Q70 118 72 90Z" fill="#4466cc"/>
      <rect x="28" y="64" width="44" height="28" rx="8" fill="#4466cc"/>
      <rect x="28" y="68" width="44" height="3.5" fill="#334499"/>
      <rect x="28" y="76" width="44" height="3.5" fill="#334499"/>
      <rect x="28" y="84" width="44" height="3.5" fill="#334499"/>
      <g className={isWalking ? 'char-arm-b' : undefined} style={{ transformOrigin: '30px 68px' }}>
        <path d="M30 68 Q18 74 20 84" stroke="#fde8d0" strokeWidth="10" fill="none" strokeLinecap="round"/>
      </g>
      <g className={isWalking ? 'char-arm-a' : undefined} style={{ transformOrigin: '70px 68px' }}>
        <path d="M70 68 Q82 74 80 84" stroke="#fde8d0" strokeWidth="10" fill="none" strokeLinecap="round"/>
      </g>
      <rect x="43" y="55" width="14" height="12" rx="3" fill="#fde8d0"/>
      <circle cx="50" cy="36" r="28" fill="#fde8d0"/>
      <path d="M23 32 Q8 50 12 78" stroke="#7a4520" strokeWidth="14" fill="none" strokeLinecap="round"/>
      <path d="M77 32 Q92 50 88 78" stroke="#7a4520" strokeWidth="14" fill="none" strokeLinecap="round"/>
      <ellipse cx="50" cy="22" rx="28" ry="21" fill="#7a4520"/>
      <path d="M23 32 Q28 10 50 8 Q72 10 77 32 Q70 14 50 12 Q30 14 23 32Z" fill="#6a3a18"/>
    </svg>
  );
  return (
    <svg viewBox="0 0 100 140" width={size} height={size * 1.4} xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="50" cy="137" rx="22" ry="4" fill="#00000025"/>
      {/* Legs */}
      <g className={isWalking ? 'char-leg-a' : undefined} style={{ transformOrigin: '41.5px 108px' }}>
        <rect x="36" y="108" width="11" height="25" rx="5" fill="#fde8d0"/>
        <ellipse cx="41" cy="133" rx="9" ry="5" fill="#4466cc"/>
      </g>
      <g className={isWalking ? 'char-leg-b' : undefined} style={{ transformOrigin: '58.5px 108px' }}>
        <rect x="53" y="108" width="11" height="25" rx="5" fill="#fde8d0"/>
        <ellipse cx="59" cy="133" rx="9" ry="5" fill="#4466cc"/>
      </g>
      {/* Lower body */}
      <path d="M28 90 Q30 118 42 118 L58 118 Q70 118 72 90Z" fill="#4466cc"/>
      <path d="M28 90 L72 90" stroke="#334499" strokeWidth="1.5" fill="none"/>
      {/* Upper body — white shirt + blue stripes */}
      <rect x="30" y="65" width="40" height="28" rx="8" fill="white"/>
      <rect x="30" y="70" width="40" height="4"   fill="#4466cc"/>
      <rect x="30" y="78" width="40" height="4"   fill="#4466cc"/>
      <rect x="30" y="86" width="40" height="3"   fill="#4466cc"/>
      {/* Collar V */}
      <path d="M30 65 L50 78 L70 65 L63 65 L50 72 L37 65Z" fill="#334499" stroke="#222288" strokeWidth="0.5"/>
      <path d="M50 72 L50 90" stroke="#cc2222" strokeWidth="2.5" fill="none"/>
      {/* Arms */}
      <g className={isWalking ? 'char-arm-b' : undefined} style={{ transformOrigin: '30px 68px' }}>
        <path d="M30 68 Q18 74 20 84" stroke="#fde8d0" strokeWidth="10" fill="none" strokeLinecap="round"/>
      </g>
      <g className={isWalking ? 'char-arm-a' : undefined} style={{ transformOrigin: '70px 68px' }}>
        <path d="M70 68 Q82 74 80 84" stroke="#fde8d0" strokeWidth="10" fill="none" strokeLinecap="round"/>
      </g>
      {/* Neck */}
      <rect x="43" y="55" width="14" height="12" rx="3" fill="#fde8d0"/>
      {/* ── HEAD ── */}
      <circle cx="50" cy="36" r="28" fill="#fde8d0"/>
      {/* Hair — back mass */}
      <ellipse cx="50" cy="21" rx="29" ry="22" fill="#8a4520"/>
      {/* Hair side strands */}
      <path d="M22 30 Q11 46 14 64" stroke="#7a3a18" strokeWidth="12" fill="none" strokeLinecap="round"/>
      <path d="M78 30 Q89 46 86 64" stroke="#7a3a18" strokeWidth="12" fill="none" strokeLinecap="round"/>
      {/* Hair top layer + fringe */}
      <path d="M22 30 Q27 8 50 7 Q73 8 78 30 Q70 13 50 12 Q30 13 22 30Z" fill="#9e5530"/>
      {/* Bangs */}
      <path d="M22 30 Q30 41 40 34" fill="#8a4520"/>
      <path d="M78 30 Q70 41 60 34" fill="#8a4520"/>
      {/* Hair highlight */}
      <path d="M35 11 Q50 7 65 11" stroke="rgba(255,195,135,0.35)" strokeWidth="6" fill="none" strokeLinecap="round"/>
      {/* ── EYES ── */}
      {/* Whites */}
      <ellipse cx="38" cy="36" rx="8.5" ry="10"   fill="white"/>
      <ellipse cx="62" cy="36" rx="8.5" ry="10"   fill="white"/>
      {/* Upper lid shadow */}
      <ellipse cx="38" cy="30.5" rx="8.5" ry="5"  fill="rgba(80,30,10,0.18)"/>
      <ellipse cx="62" cy="30.5" rx="8.5" ry="5"  fill="rgba(80,30,10,0.18)"/>
      {/* Iris */}
      <ellipse cx="38" cy="37.5" rx="6"   ry="7"  fill="#885028"/>
      <ellipse cx="62" cy="37.5" rx="6"   ry="7"  fill="#885028"/>
      {/* Pupil */}
      <circle  cx="38.5" cy="38.5" r="3.8"        fill="#120800"/>
      <circle  cx="62.5" cy="38.5" r="3.8"        fill="#120800"/>
      {/* Upper eyelash arc */}
      <path d="M29 30 Q38 24 47 30" stroke="#3a1808" strokeWidth="2.8" fill="none" strokeLinecap="round"/>
      <path d="M53 30 Q62 24 71 30" stroke="#3a1808" strokeWidth="2.8" fill="none" strokeLinecap="round"/>
      {/* Main shine */}
      <circle  cx="41"   cy="32.5" r="2.8"        fill="white"/>
      <circle  cx="65"   cy="32.5" r="2.8"        fill="white"/>
      {/* Secondary shine */}
      <circle  cx="36"   cy="41"   r="1.1"        fill="rgba(255,255,255,0.55)"/>
      <circle  cx="60"   cy="41"   r="1.1"        fill="rgba(255,255,255,0.55)"/>
      {/* Eyebrows */}
      <path d="M29 25 Q38 20 47 24" stroke="#6a3810" strokeWidth="3.0" fill="none" strokeLinecap="round"/>
      <path d="M53 24 Q62 20 71 25" stroke="#6a3810" strokeWidth="3.0" fill="none" strokeLinecap="round"/>
      {/* Cheeks */}
      <ellipse cx="26" cy="44" rx="9"   ry="5.5"  fill="#ff8888" opacity="0.58"/>
      <ellipse cx="74" cy="44" rx="9"   ry="5.5"  fill="#ff8888" opacity="0.58"/>
      {/* Nose */}
      <ellipse cx="50" cy="45" rx="2"   ry="1.2"  fill="#e0a880" opacity="0.65"/>
      {/* Mouth */}
      <path d="M43 51 Q50 58 57 51" stroke="#cc4466" strokeWidth="2.2" fill="none" strokeLinecap="round"/>
    </svg>
  );
};

/* ═══════════════════════════════════════════════════════════════════════════
   ChLeo — blonde spiky hair, dark outfit with star
   ═══════════════════════════════════════════════════════════════════════════ */
export const ChLeo = ({ size = 120, isWalking, facing }: SpriteProps) => {
  if (facing === 'back') return (
    <svg viewBox="0 0 100 148" width={size} height={size * 1.48} xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="50" cy="145" rx="24" ry="4" fill="#00000025"/>
      <g className={isWalking ? 'char-leg-a' : undefined} style={{ transformOrigin: '40px 108px' }}>
        <rect x="34" y="108" width="12" height="32" rx="5" fill="#2244aa"/>
        <ellipse cx="40" cy="140" rx="11" ry="6" fill="#221100"/>
      </g>
      <g className={isWalking ? 'char-leg-b' : undefined} style={{ transformOrigin: '60px 108px' }}>
        <rect x="54" y="108" width="12" height="32" rx="5" fill="#2244aa"/>
        <ellipse cx="60" cy="140" rx="11" ry="6" fill="#221100"/>
      </g>
      <rect x="28" y="64" width="44" height="46" rx="8" fill="#222233"/>
      <g className={isWalking ? 'char-arm-b' : undefined} style={{ transformOrigin: '28px 68px' }}>
        <path d="M28 68 Q15 74 17 86" stroke="#222233" strokeWidth="12" fill="none" strokeLinecap="round"/>
        <path d="M17 86 Q16 92 20 96" stroke="#fde8d0" strokeWidth="10" fill="none" strokeLinecap="round"/>
      </g>
      <g className={isWalking ? 'char-arm-a' : undefined} style={{ transformOrigin: '72px 68px' }}>
        <path d="M72 68 Q85 74 83 86" stroke="#222233" strokeWidth="12" fill="none" strokeLinecap="round"/>
        <path d="M83 86 Q84 92 80 96" stroke="#fde8d0" strokeWidth="10" fill="none" strokeLinecap="round"/>
      </g>
      <rect x="42" y="54" width="16" height="12" rx="3" fill="#fde8d0"/>
      <circle cx="50" cy="34" r="30" fill="#fde8d0"/>
      <ellipse cx="50" cy="20" rx="29" ry="20" fill="#d4a824"/>
      <path d="M22 30 Q20 10 28 6 Q30 18 35 20" fill="#c89818"/>
      <path d="M34 15 Q36 2 44 0 Q44 14 48 18"  fill="#d4a824"/>
      <path d="M46 10 Q50 -2 56 2 Q54 14 52 18"  fill="#c89818"/>
      <path d="M54 12 Q60 0 68 4 Q64 16 60 20"   fill="#d4a824"/>
      <path d="M62 18 Q70 8 78 12 Q74 22 70 26"  fill="#c89818"/>
      <path d="M21 30 Q18 44 22 52" stroke="#d4a824" strokeWidth="9" fill="none" strokeLinecap="round"/>
      <path d="M79 30 Q82 44 78 52" stroke="#d4a824" strokeWidth="9" fill="none" strokeLinecap="round"/>
    </svg>
  );
  return (
    <svg viewBox="0 0 100 148" width={size} height={size * 1.48} xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="50" cy="145" rx="24" ry="4" fill="#00000025"/>
      {/* Legs */}
      <g className={isWalking ? 'char-leg-a' : undefined} style={{ transformOrigin: '40px 108px' }}>
        <rect x="34" y="108" width="12" height="32" rx="5" fill="#2244aa"/>
        <ellipse cx="40" cy="140" rx="11" ry="6" fill="#221100"/>
      </g>
      <g className={isWalking ? 'char-leg-b' : undefined} style={{ transformOrigin: '60px 108px' }}>
        <rect x="54" y="108" width="12" height="32" rx="5" fill="#2244aa"/>
        <ellipse cx="60" cy="140" rx="11" ry="6" fill="#221100"/>
      </g>
      {/* Body */}
      <rect x="28" y="64" width="44" height="46" rx="8" fill="#222233"/>
      <polygon points="50,72 52.8,80 61,80 54.8,85 57.2,93 50,88.5 42.8,93 45.2,85 39,80 47.2,80" fill="white" opacity="0.9"/>
      {/* Arms */}
      <g className={isWalking ? 'char-arm-b' : undefined} style={{ transformOrigin: '28px 68px' }}>
        <path d="M28 68 Q15 74 17 86" stroke="#222233" strokeWidth="12" fill="none" strokeLinecap="round"/>
        <path d="M17 86 Q16 92 20 96" stroke="#fde8d0" strokeWidth="10" fill="none" strokeLinecap="round"/>
      </g>
      <g className={isWalking ? 'char-arm-a' : undefined} style={{ transformOrigin: '72px 68px' }}>
        <path d="M72 68 Q85 74 83 86" stroke="#222233" strokeWidth="12" fill="none" strokeLinecap="round"/>
        <path d="M83 86 Q84 92 80 96" stroke="#fde8d0" strokeWidth="10" fill="none" strokeLinecap="round"/>
      </g>
      {/* Neck */}
      <rect x="42" y="54" width="16" height="12" rx="3" fill="#fde8d0"/>
      {/* ── HEAD ── */}
      <circle cx="50" cy="34" r="30" fill="#fde8d0"/>
      {/* Hair — back mass */}
      <ellipse cx="50" cy="19" rx="30" ry="21" fill="#d4a824"/>
      {/* Spiky hair pieces */}
      <path d="M22 30 Q20 10 28 6 Q30 18 35 20" fill="#e8c030"/>
      <path d="M34 15 Q36 2 44 0 Q44 14 48 18"  fill="#d4a824"/>
      <path d="M46 10 Q50 -2 56 2 Q54 14 52 18"  fill="#e8c030"/>
      <path d="M54 12 Q60 0 68 4 Q64 16 60 20"   fill="#d4a824"/>
      <path d="M62 18 Q70 8 78 12 Q74 22 70 26"  fill="#e8c030"/>
      {/* Side hair */}
      <path d="M21 30 Q18 44 22 52" stroke="#d4a824" strokeWidth="9" fill="none" strokeLinecap="round"/>
      <path d="M79 30 Q82 44 78 52" stroke="#d4a824" strokeWidth="9" fill="none" strokeLinecap="round"/>
      {/* Hair light side pieces */}
      <path d="M22 28 Q28 38 38 31" fill="#c89818"/>
      <path d="M78 28 Q72 38 62 31" fill="#c89818"/>
      {/* Hair highlight */}
      <path d="M36 10 Q50 5 64 10" stroke="rgba(255,240,160,0.38)" strokeWidth="6" fill="none" strokeLinecap="round"/>
      {/* ── EYES ── */}
      <ellipse cx="38" cy="35" rx="8.5" ry="10"  fill="white"/>
      <ellipse cx="62" cy="35" rx="8.5" ry="10"  fill="white"/>
      <ellipse cx="38" cy="29.5" rx="8.5" ry="5" fill="rgba(60,40,10,0.18)"/>
      <ellipse cx="62" cy="29.5" rx="8.5" ry="5" fill="rgba(60,40,10,0.18)"/>
      <ellipse cx="38" cy="36.5" rx="6"   ry="7"  fill="#3388ee"/>
      <ellipse cx="62" cy="36.5" rx="6"   ry="7"  fill="#3388ee"/>
      <circle  cx="38.5" cy="37.5" r="3.8"        fill="#0a1a30"/>
      <circle  cx="62.5" cy="37.5" r="3.8"        fill="#0a1a30"/>
      <path d="M29 29 Q38 23 47 29" stroke="#a07010" strokeWidth="2.8" fill="none" strokeLinecap="round"/>
      <path d="M53 29 Q62 23 71 29" stroke="#a07010" strokeWidth="2.8" fill="none" strokeLinecap="round"/>
      <circle  cx="41"   cy="31.5" r="2.8"        fill="white"/>
      <circle  cx="65"   cy="31.5" r="2.8"        fill="white"/>
      <circle  cx="36"   cy="40"   r="1.1"        fill="rgba(255,255,255,0.55)"/>
      <circle  cx="60"   cy="40"   r="1.1"        fill="rgba(255,255,255,0.55)"/>
      {/* Eyebrows */}
      <path d="M29 24 Q38 18 47 23" stroke="#a07010" strokeWidth="3.0" fill="none" strokeLinecap="round"/>
      <path d="M53 23 Q62 18 71 24" stroke="#a07010" strokeWidth="3.0" fill="none" strokeLinecap="round"/>
      {/* Cheeks */}
      <ellipse cx="26" cy="43" rx="9"   ry="5.5"  fill="#ff9999" opacity="0.50"/>
      <ellipse cx="74" cy="43" rx="9"   ry="5.5"  fill="#ff9999" opacity="0.50"/>
      {/* Nose */}
      <ellipse cx="50" cy="44" rx="2.2" ry="1.4"  fill="#e0a880" opacity="0.55"/>
      {/* Mouth */}
      <path d="M41 51 Q50 58 59 51" stroke="#cc4455" strokeWidth="2.2" fill="none" strokeLinecap="round"/>
    </svg>
  );
};

/* ═══════════════════════════════════════════════════════════════════════════
   ChAva — red/auburn long hair, pink dress
   ═══════════════════════════════════════════════════════════════════════════ */
export const ChAva = ({ size = 120, isWalking, facing }: SpriteProps) => {
  if (facing === 'back') return (
    <svg viewBox="0 0 100 142" width={size} height={size * 1.42} xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="50" cy="139" rx="22" ry="4" fill="#00000025"/>
      <g className={isWalking ? 'char-leg-a' : undefined} style={{ transformOrigin: '41.5px 108px' }}>
        <rect x="36" y="108" width="11" height="26" rx="5" fill="#fde8d0"/>
        <ellipse cx="41" cy="134" rx="9" ry="5" fill="#cc6688"/>
      </g>
      <g className={isWalking ? 'char-leg-b' : undefined} style={{ transformOrigin: '58.5px 108px' }}>
        <rect x="53" y="108" width="11" height="26" rx="5" fill="#fde8d0"/>
        <ellipse cx="59" cy="134" rx="9" ry="5" fill="#cc6688"/>
      </g>
      <path d="M26 88 Q24 114 38 116 L62 116 Q76 114 74 88Z" fill="#ff9ab0"/>
      <rect x="28" y="62" width="44" height="28" rx="9" fill="#ff88aa"/>
      <g className={isWalking ? 'char-arm-b' : undefined} style={{ transformOrigin: '28px 66px' }}>
        <path d="M28 66 Q16 72 18 82" stroke="#ff88aa" strokeWidth="11" fill="none" strokeLinecap="round"/>
        <circle cx="18" cy="84" r="6" fill="#fde8d0"/>
      </g>
      <g className={isWalking ? 'char-arm-a' : undefined} style={{ transformOrigin: '72px 66px' }}>
        <path d="M72 66 Q84 72 82 82" stroke="#ff88aa" strokeWidth="11" fill="none" strokeLinecap="round"/>
        <circle cx="82" cy="84" r="6" fill="#fde8d0"/>
      </g>
      <rect x="43" y="52" width="14" height="12" rx="3" fill="#fde8d0"/>
      <circle cx="50" cy="33" r="28" fill="#fde8d0"/>
      <path d="M23 32 Q14 60 20 90 Q24 100 30 104" stroke="#aa4418" strokeWidth="14" fill="none" strokeLinecap="round"/>
      <path d="M77 32 Q86 60 80 90 Q76 100 70 104" stroke="#aa4418" strokeWidth="14" fill="none" strokeLinecap="round"/>
      <ellipse cx="50" cy="22" rx="27" ry="20" fill="#aa4418"/>
      <path d="M23 32 Q27 12 50 11 Q73 12 77 32 Q72 16 50 16 Q28 16 23 32Z" fill="#993310"/>
    </svg>
  );
  return (
    <svg viewBox="0 0 100 142" width={size} height={size * 1.42} xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="50" cy="139" rx="22" ry="4" fill="#00000025"/>
      {/* Legs */}
      <g className={isWalking ? 'char-leg-a' : undefined} style={{ transformOrigin: '41.5px 108px' }}>
        <rect x="36" y="108" width="11" height="26" rx="5" fill="#fde8d0"/>
        <ellipse cx="41" cy="134" rx="9" ry="5" fill="#cc6688"/>
      </g>
      <g className={isWalking ? 'char-leg-b' : undefined} style={{ transformOrigin: '58.5px 108px' }}>
        <rect x="53" y="108" width="11" height="26" rx="5" fill="#fde8d0"/>
        <ellipse cx="59" cy="134" rx="9" ry="5" fill="#cc6688"/>
      </g>
      {/* Skirt */}
      <path d="M26 88 Q28 114 40 116 L60 116 Q72 114 74 88Z" fill="#ff9ab0"/>
      <path d="M26 88 Q32 95 38 88 Q44 95 50 88 Q56 95 62 88 Q68 95 74 88" stroke="#ffbbcc" strokeWidth="3" fill="none"/>
      {/* Top */}
      <rect x="28" y="62" width="44" height="28" rx="9" fill="#ff88aa"/>
      <path d="M28 62 L50 76 L72 62" stroke="#dd6688" strokeWidth="2" fill="none"/>
      {/* Arms */}
      <g className={isWalking ? 'char-arm-b' : undefined} style={{ transformOrigin: '28px 66px' }}>
        <path d="M28 66 Q16 72 18 82" stroke="#ff88aa" strokeWidth="11" fill="none" strokeLinecap="round"/>
        <circle cx="18" cy="84" r="6" fill="#fde8d0"/>
      </g>
      <g className={isWalking ? 'char-arm-a' : undefined} style={{ transformOrigin: '72px 66px' }}>
        <path d="M72 66 Q84 72 82 82" stroke="#ff88aa" strokeWidth="11" fill="none" strokeLinecap="round"/>
        <circle cx="82" cy="84" r="6" fill="#fde8d0"/>
      </g>
      {/* Neck */}
      <rect x="43" y="52" width="14" height="12" rx="3" fill="#fde8d0"/>
      {/* ── HEAD ── */}
      <circle cx="50" cy="33" r="28" fill="#fde8d0"/>
      {/* Hair — back mass */}
      <ellipse cx="50" cy="21" rx="28" ry="21" fill="#aa4418"/>
      {/* Long side hair */}
      <path d="M23 31 Q13 58 18 88 Q22 98 28 102" stroke="#993310" strokeWidth="14" fill="none" strokeLinecap="round"/>
      <path d="M77 31 Q87 58 82 88 Q78 98 72 102" stroke="#993310" strokeWidth="14" fill="none" strokeLinecap="round"/>
      {/* Top hair layer */}
      <path d="M23 31 Q27 10 50 9 Q73 10 77 31 Q72 15 50 15 Q28 15 23 31Z" fill="#bb5520"/>
      {/* Side hair piece */}
      <path d="M23 31 Q28 41 37 35" fill="#aa4418"/>
      {/* Hair highlight */}
      <path d="M35 11 Q50 7 65 11" stroke="rgba(255,190,130,0.32)" strokeWidth="6" fill="none" strokeLinecap="round"/>
      {/* ── EYES ── */}
      <ellipse cx="39" cy="34" rx="8"   ry="9.5"  fill="white"/>
      <ellipse cx="61" cy="34" rx="8"   ry="9.5"  fill="white"/>
      <ellipse cx="39" cy="29" rx="8"   ry="4.8"  fill="rgba(80,30,10,0.18)"/>
      <ellipse cx="61" cy="29" rx="8"   ry="4.8"  fill="rgba(80,30,10,0.18)"/>
      <ellipse cx="39" cy="35.5" rx="5.5" ry="6.5" fill="#22aa55"/>
      <ellipse cx="61" cy="35.5" rx="5.5" ry="6.5" fill="#22aa55"/>
      <circle  cx="39.5" cy="36.5" r="3.5"         fill="#082210"/>
      <circle  cx="61.5" cy="36.5" r="3.5"         fill="#082210"/>
      <path d="M30 28 Q39 23 48 28" stroke="#993310" strokeWidth="2.8" fill="none" strokeLinecap="round"/>
      <path d="M52 28 Q61 23 70 28" stroke="#993310" strokeWidth="2.8" fill="none" strokeLinecap="round"/>
      <circle  cx="42"   cy="30.5" r="2.6"          fill="white"/>
      <circle  cx="64"   cy="30.5" r="2.6"          fill="white"/>
      <circle  cx="37.5" cy="39"   r="1.0"          fill="rgba(255,255,255,0.55)"/>
      <circle  cx="59.5" cy="39"   r="1.0"          fill="rgba(255,255,255,0.55)"/>
      {/* Eyebrows */}
      <path d="M30 23 Q39 18 48 22" stroke="#993310" strokeWidth="3.0" fill="none" strokeLinecap="round"/>
      <path d="M52 22 Q61 18 70 23" stroke="#993310" strokeWidth="3.0" fill="none" strokeLinecap="round"/>
      {/* Cheeks */}
      <ellipse cx="27" cy="41" rx="9"   ry="5.5"  fill="#ff8888" opacity="0.60"/>
      <ellipse cx="73" cy="41" rx="9"   ry="5.5"  fill="#ff8888" opacity="0.60"/>
      {/* Nose */}
      <ellipse cx="50" cy="42" rx="2"   ry="1.2"  fill="#e0a880" opacity="0.60"/>
      {/* Mouth */}
      <path d="M42 49 Q50 56 58 49" stroke="#cc3355" strokeWidth="2.2" fill="none" strokeLinecap="round"/>
    </svg>
  );
};

/* ═══════════════════════════════════════════════════════════════════════════
   ChKai — dark spiky hair, orange/teal outfit, warm tan skin
   ═══════════════════════════════════════════════════════════════════════════ */
export const ChKai = ({ size = 120, isWalking, facing }: SpriteProps) => {
  if (facing === 'back') return (
    <svg viewBox="0 0 100 148" width={size} height={size * 1.48} xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="50" cy="145" rx="24" ry="4" fill="#00000025"/>
      <g className={isWalking ? 'char-leg-a' : undefined} style={{ transformOrigin: '40px 108px' }}>
        <rect x="34" y="108" width="12" height="30" rx="5" fill="#e8c898"/>
        <ellipse cx="40" cy="138" rx="11" ry="6" fill="#8b5a2b"/>
        <path d="M34 134 L46 134" stroke="#5c3a1e" strokeWidth="2.5" strokeLinecap="round"/>
      </g>
      <g className={isWalking ? 'char-leg-b' : undefined} style={{ transformOrigin: '60px 108px' }}>
        <rect x="54" y="108" width="12" height="30" rx="5" fill="#e8c898"/>
        <ellipse cx="60" cy="138" rx="11" ry="6" fill="#8b5a2b"/>
        <path d="M54 134 L66 134" stroke="#5c3a1e" strokeWidth="2.5" strokeLinecap="round"/>
      </g>
      <path d="M28 88 Q28 112 40 114 L60 114 Q72 112 72 88Z" fill="#20a898"/>
      <rect x="26" y="62" width="48" height="28" rx="9" fill="#f07020"/>
      <g className={isWalking ? 'char-arm-b' : undefined} style={{ transformOrigin: '26px 66px' }}>
        <path d="M26 66 Q13 72 15 84" stroke="#f07020" strokeWidth="12" fill="none" strokeLinecap="round"/>
        <circle cx="15" cy="86" r="6.5" fill="#e8c898"/>
      </g>
      <g className={isWalking ? 'char-arm-a' : undefined} style={{ transformOrigin: '74px 66px' }}>
        <path d="M74 66 Q87 72 85 84" stroke="#f07020" strokeWidth="12" fill="none" strokeLinecap="round"/>
        <circle cx="85" cy="86" r="6.5" fill="#e8c898"/>
      </g>
      <rect x="42" y="52" width="16" height="12" rx="3" fill="#e8c898"/>
      <circle cx="50" cy="33" r="30" fill="#e8c898"/>
      <ellipse cx="50" cy="20" rx="29" ry="18" fill="#1a1008"/>
      <path d="M22 30 Q21 8 30 4 Q32 18 37 22" fill="#1a1008"/>
      <path d="M36 14 Q40 0 50 2 Q48 16 50 20"  fill="#28180c"/>
      <path d="M50 10 Q56 -2 64 4 Q60 16 58 20"  fill="#1a1008"/>
      <path d="M60 14 Q68 2 76 8 Q70 18 66 22"   fill="#28180c"/>
      <path d="M21 30 Q18 46 22 55" stroke="#1a1008" strokeWidth="10" fill="none" strokeLinecap="round"/>
      <path d="M79 30 Q82 46 78 55" stroke="#1a1008" strokeWidth="10" fill="none" strokeLinecap="round"/>
    </svg>
  );
  return (
    <svg viewBox="0 0 100 148" width={size} height={size * 1.48} xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="50" cy="145" rx="24" ry="4" fill="#00000025"/>
      {/* Legs */}
      <g className={isWalking ? 'char-leg-a' : undefined} style={{ transformOrigin: '40px 108px' }}>
        <rect x="34" y="108" width="12" height="30" rx="5" fill="#e8c898"/>
        <ellipse cx="40" cy="138" rx="11" ry="6" fill="#8b5a2b"/>
        <path d="M34 134 L46 134" stroke="#5c3a1e" strokeWidth="2.5" strokeLinecap="round"/>
      </g>
      <g className={isWalking ? 'char-leg-b' : undefined} style={{ transformOrigin: '60px 108px' }}>
        <rect x="54" y="108" width="12" height="30" rx="5" fill="#e8c898"/>
        <ellipse cx="60" cy="138" rx="11" ry="6" fill="#8b5a2b"/>
        <path d="M54 134 L66 134" stroke="#5c3a1e" strokeWidth="2.5" strokeLinecap="round"/>
      </g>
      {/* Body */}
      <path d="M28 88 Q28 112 40 114 L60 114 Q72 112 72 88Z" fill="#20a898"/>
      <path d="M28 88 L50 100 L72 88" fill="#18907e" opacity="0.6"/>
      <rect x="26" y="62" width="48" height="28" rx="9" fill="#f07020"/>
      <path d="M26 62 L50 76 L74 62 L64 62 L50 70 L36 62Z" fill="#cc5010"/>
      <path d="M34 68 Q38 64 42 68 Q38 72 34 68Z" fill="#60c820" opacity="0.7"/>
      <path d="M56 72 Q60 68 64 72 Q60 76 56 72Z" fill="#60c820" opacity="0.7"/>
      <path d="M44 78 Q48 74 52 78 Q48 82 44 78Z" fill="#60c820" opacity="0.6"/>
      {/* Arms */}
      <g className={isWalking ? 'char-arm-b' : undefined} style={{ transformOrigin: '26px 66px' }}>
        <path d="M26 66 Q13 72 15 84" stroke="#f07020" strokeWidth="12" fill="none" strokeLinecap="round"/>
        <circle cx="15" cy="86" r="6.5" fill="#e8c898"/>
      </g>
      <g className={isWalking ? 'char-arm-a' : undefined} style={{ transformOrigin: '74px 66px' }}>
        <path d="M74 66 Q87 72 85 84" stroke="#f07020" strokeWidth="12" fill="none" strokeLinecap="round"/>
        <circle cx="85" cy="86" r="6.5" fill="#e8c898"/>
      </g>
      {/* Neck */}
      <rect x="42" y="52" width="16" height="12" rx="3" fill="#e8c898"/>
      {/* ── HEAD ── */}
      <circle cx="50" cy="33" r="30" fill="#e8c898"/>
      {/* Hair — back mass */}
      <ellipse cx="50" cy="19" rx="30" ry="19" fill="#1a1008"/>
      {/* Spiky hair */}
      <path d="M22 30 Q21 8 30 4 Q32 18 37 22"  fill="#28180c"/>
      <path d="M36 14 Q40 0 50 2 Q48 16 50 20"  fill="#1a1008"/>
      <path d="M50 10 Q56 -2 64 4 Q60 16 58 20"  fill="#28180c"/>
      <path d="M60 14 Q68 2 76 8 Q70 18 66 22"   fill="#1a1008"/>
      {/* Side hair */}
      <path d="M21 30 Q18 46 22 55" stroke="#1a1008" strokeWidth="10" fill="none" strokeLinecap="round"/>
      <path d="M79 30 Q82 46 78 55" stroke="#1a1008" strokeWidth="10" fill="none" strokeLinecap="round"/>
      <path d="M22 30 Q30 39 40 33" fill="#1a1008"/>
      {/* ── EYES ── */}
      <ellipse cx="38" cy="34" rx="8.5" ry="10"  fill="white"/>
      <ellipse cx="62" cy="34" rx="8.5" ry="10"  fill="white"/>
      <ellipse cx="38" cy="28.5" rx="8.5" ry="5" fill="rgba(40,20,0,0.22)"/>
      <ellipse cx="62" cy="28.5" rx="8.5" ry="5" fill="rgba(40,20,0,0.22)"/>
      <ellipse cx="38" cy="35.5" rx="6"   ry="7"  fill="#7a4818"/>
      <ellipse cx="62" cy="35.5" rx="6"   ry="7"  fill="#7a4818"/>
      <circle  cx="38.5" cy="36.5" r="3.8"        fill="#1a0a00"/>
      <circle  cx="62.5" cy="36.5" r="3.8"        fill="#1a0a00"/>
      <path d="M29 28 Q38 22 47 28" stroke="#1a1008" strokeWidth="2.8" fill="none" strokeLinecap="round"/>
      <path d="M53 28 Q62 22 71 28" stroke="#1a1008" strokeWidth="2.8" fill="none" strokeLinecap="round"/>
      <circle  cx="41"   cy="30.5" r="2.8"        fill="white"/>
      <circle  cx="65"   cy="30.5" r="2.8"        fill="white"/>
      <circle  cx="36"   cy="39.5" r="1.1"        fill="rgba(255,255,255,0.55)"/>
      <circle  cx="60"   cy="39.5" r="1.1"        fill="rgba(255,255,255,0.55)"/>
      {/* Eyebrows */}
      <path d="M29 22 Q38 17 47 22" stroke="#1a1008" strokeWidth="3.2" fill="none" strokeLinecap="round"/>
      <path d="M53 22 Q62 17 71 22" stroke="#1a1008" strokeWidth="3.2" fill="none" strokeLinecap="round"/>
      {/* Cheeks */}
      <ellipse cx="26" cy="41" rx="9"   ry="5.5"  fill="#e08060" opacity="0.50"/>
      <ellipse cx="74" cy="41" rx="9"   ry="5.5"  fill="#e08060" opacity="0.50"/>
      {/* Nose */}
      <ellipse cx="50" cy="43" rx="2.3" ry="1.5"  fill="#c8906a" opacity="0.60"/>
      {/* Mouth */}
      <path d="M40 50 Q50 58 60 50" stroke="#cc3344" strokeWidth="2.4" fill="none" strokeLinecap="round"/>
    </svg>
  );
};

/* ═══════════════════════════════════════════════════════════════════════════
   ChNora — dark hair with centre-part, navy school uniform
   ═══════════════════════════════════════════════════════════════════════════ */
export const ChNora = ({ size = 120, isWalking, facing }: SpriteProps) => {
  if (facing === 'back') return (
    <svg viewBox="0 0 100 140" width={size} height={size * 1.4} xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="50" cy="137" rx="22" ry="4" fill="#00000025"/>
      <g className={isWalking ? 'char-leg-a' : undefined} style={{ transformOrigin: '41.5px 108px' }}>
        <rect x="36" y="108" width="11" height="24" rx="5" fill="#fde8d0"/>
        <rect x="35" y="118" width="13" height="12" rx="3" fill="white"/>
        <ellipse cx="41" cy="132" rx="10" ry="5" fill="#1a1a2e"/>
      </g>
      <g className={isWalking ? 'char-leg-b' : undefined} style={{ transformOrigin: '58.5px 108px' }}>
        <rect x="53" y="108" width="11" height="24" rx="5" fill="#fde8d0"/>
        <rect x="52" y="118" width="13" height="12" rx="3" fill="white"/>
        <ellipse cx="59" cy="132" rx="10" ry="5" fill="#1a1a2e"/>
      </g>
      <path d="M26 70 Q24 112 38 116 L62 116 Q76 112 74 70Z" fill="#1a2a6c"/>
      <path d="M26 70 L50 88 L74 70 L68 70 L50 82 L32 70Z" fill="white"/>
      <g className={isWalking ? 'char-arm-b' : undefined} style={{ transformOrigin: '26px 70px' }}>
        <path d="M26 70 Q14 76 16 88" stroke="#1a2a6c" strokeWidth="12" fill="none" strokeLinecap="round"/>
        <circle cx="16" cy="90" r="6" fill="#fde8d0"/>
        <rect x="10" y="84" width="12" height="5" rx="2.5" fill="white"/>
      </g>
      <g className={isWalking ? 'char-arm-a' : undefined} style={{ transformOrigin: '74px 70px' }}>
        <path d="M74 70 Q86 76 84 88" stroke="#1a2a6c" strokeWidth="12" fill="none" strokeLinecap="round"/>
        <circle cx="84" cy="90" r="6" fill="#fde8d0"/>
        <rect x="78" y="84" width="12" height="5" rx="2.5" fill="white"/>
      </g>
      <rect x="43" y="55" width="14" height="12" rx="3" fill="#fde8d0"/>
      <circle cx="50" cy="35" r="28" fill="#fde8d0"/>
      <path d="M23 34 Q21 52 28 64" stroke="#2a1808" strokeWidth="13" fill="none" strokeLinecap="round"/>
      <path d="M77 34 Q79 52 72 64" stroke="#2a1808" strokeWidth="13" fill="none" strokeLinecap="round"/>
      <ellipse cx="50" cy="23" rx="28" ry="20" fill="#2a1808"/>
      <path d="M23 34 Q26 12 50 11 Q74 12 77 34 Q72 16 50 16 Q28 16 23 34Z" fill="#332010"/>
      <path d="M50 11 L50 34" stroke="#1a1008" strokeWidth="2" fill="none"/>
    </svg>
  );
  return (
    <svg viewBox="0 0 100 140" width={size} height={size * 1.4} xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="50" cy="137" rx="22" ry="4" fill="#00000025"/>
      {/* Legs */}
      <g className={isWalking ? 'char-leg-a' : undefined} style={{ transformOrigin: '41.5px 108px' }}>
        <rect x="36" y="108" width="11" height="24" rx="5" fill="#fde8d0"/>
        <rect x="35" y="118" width="13" height="12" rx="3" fill="white"/>
        <ellipse cx="41" cy="132" rx="10" ry="5" fill="#1a1a2e"/>
      </g>
      <g className={isWalking ? 'char-leg-b' : undefined} style={{ transformOrigin: '58.5px 108px' }}>
        <rect x="53" y="108" width="11" height="24" rx="5" fill="#fde8d0"/>
        <rect x="52" y="118" width="13" height="12" rx="3" fill="white"/>
        <ellipse cx="59" cy="132" rx="10" ry="5" fill="#1a1a2e"/>
      </g>
      {/* Body — navy uniform */}
      <path d="M26 70 Q24 112 38 116 L62 116 Q76 112 74 70Z" fill="#1a2a6c"/>
      <path d="M26 70 L50 88 L74 70 L68 70 L50 82 L32 70Z" fill="white"/>
      <path d="M50 82 L50 102 L47 82 Z" fill="#cc1122"/>
      <path d="M50 82 L50 102 L53 82 Z" fill="#cc1122"/>
      {/* Arms */}
      <g className={isWalking ? 'char-arm-b' : undefined} style={{ transformOrigin: '26px 70px' }}>
        <path d="M26 70 Q14 76 16 88" stroke="#1a2a6c" strokeWidth="12" fill="none" strokeLinecap="round"/>
        <circle cx="16" cy="90" r="6" fill="#fde8d0"/>
        <rect x="10" y="84" width="12" height="5" rx="2.5" fill="white"/>
      </g>
      <g className={isWalking ? 'char-arm-a' : undefined} style={{ transformOrigin: '74px 70px' }}>
        <path d="M74 70 Q86 76 84 88" stroke="#1a2a6c" strokeWidth="12" fill="none" strokeLinecap="round"/>
        <circle cx="84" cy="90" r="6" fill="#fde8d0"/>
        <rect x="78" y="84" width="12" height="5" rx="2.5" fill="white"/>
      </g>
      {/* Neck */}
      <rect x="43" y="55" width="14" height="12" rx="3" fill="#fde8d0"/>
      {/* ── HEAD ── */}
      <circle cx="50" cy="35" r="28" fill="#fde8d0"/>
      {/* Hair — back mass */}
      <ellipse cx="50" cy="22" rx="28" ry="21" fill="#2a1808"/>
      {/* Side hair strands */}
      <path d="M23 33 Q21 50 27 64" stroke="#1e1006" strokeWidth="12" fill="none" strokeLinecap="round"/>
      <path d="M77 33 Q79 50 73 64" stroke="#1e1006" strokeWidth="12" fill="none" strokeLinecap="round"/>
      {/* Top hair layer */}
      <path d="M23 34 Q26 12 50 11 Q74 12 77 34 Q72 18 50 18 Q28 18 23 34Z" fill="#332010"/>
      {/* Fringe pieces over forehead */}
      <path d="M23 34 Q36 44 50 39 Q64 44 77 34" fill="#2a1808"/>
      {/* Centre part */}
      <path d="M50 11 L50 35" stroke="#1a1008" strokeWidth="2" fill="none"/>
      {/* Hair highlight */}
      <path d="M36 13 Q50 9 64 13" stroke="rgba(100,70,30,0.28)" strokeWidth="5" fill="none" strokeLinecap="round"/>
      {/* ── EYES ── */}
      <ellipse cx="39" cy="36" rx="8"   ry="9.5"  fill="white"/>
      <ellipse cx="61" cy="36" rx="8"   ry="9.5"  fill="white"/>
      <ellipse cx="39" cy="30.5" rx="8" ry="4.8"  fill="rgba(40,15,5,0.20)"/>
      <ellipse cx="61" cy="30.5" rx="8" ry="4.8"  fill="rgba(40,15,5,0.20)"/>
      <ellipse cx="39" cy="37.5" rx="5.5" ry="6.5" fill="#553322"/>
      <ellipse cx="61" cy="37.5" rx="5.5" ry="6.5" fill="#553322"/>
      <circle  cx="39.5" cy="38.5" r="3.5"         fill="#1a0800"/>
      <circle  cx="61.5" cy="38.5" r="3.5"         fill="#1a0800"/>
      <path d="M30 30 Q39 24 48 30" stroke="#2a1808" strokeWidth="2.8" fill="none" strokeLinecap="round"/>
      <path d="M52 30 Q61 24 70 30" stroke="#2a1808" strokeWidth="2.8" fill="none" strokeLinecap="round"/>
      <circle  cx="42"   cy="32"   r="2.6"          fill="white"/>
      <circle  cx="64"   cy="32"   r="2.6"          fill="white"/>
      <circle  cx="37.5" cy="41"   r="1.0"          fill="rgba(255,255,255,0.55)"/>
      <circle  cx="59.5" cy="41"   r="1.0"          fill="rgba(255,255,255,0.55)"/>
      {/* Eyebrows */}
      <path d="M30 25 Q39 20 48 24" stroke="#2a1808" strokeWidth="3.0" fill="none" strokeLinecap="round"/>
      <path d="M52 24 Q61 20 70 25" stroke="#2a1808" strokeWidth="3.0" fill="none" strokeLinecap="round"/>
      {/* Cheeks */}
      <ellipse cx="27" cy="43" rx="9"   ry="5.5"  fill="#ff8888" opacity="0.55"/>
      <ellipse cx="73" cy="43" rx="9"   ry="5.5"  fill="#ff8888" opacity="0.55"/>
      {/* Nose */}
      <ellipse cx="50" cy="44" rx="2"   ry="1.2"  fill="#e0a880" opacity="0.60"/>
      {/* Mouth */}
      <path d="M43 51 Q50 57 57 51" stroke="#cc3355" strokeWidth="2.2" fill="none" strokeLinecap="round"/>
    </svg>
  );
};

export const CHARACTER_COMPONENTS: Record<string, React.FC<SpriteProps>> = {
  mia: ChMia, leo: ChLeo, ava: ChAva, kai: ChKai, nora: ChNora,
};

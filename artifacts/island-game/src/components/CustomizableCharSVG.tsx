import React, { useId } from 'react';

export interface CharAppearance {
  skinTone: string;
  hairStyle: string;
  hairColor: string;
  outfitStyle: string;
  outfitColor: string;
  hatStyle: string;
  eyeColor: string;
  mouthStyle: string;
  eyebrowStyle: string;
  makeupStyle: string;
  facialHairStyle: string;
  faceShape: string;  // 'round' | 'oval' | 'wide' | 'narrow' | 'heart' | 'soft'
  noseStyle: string;  // 'button' | 'dot' | 'round' | 'snub'
}

// Default boy: short reddish-auburn shaggy hair, warm cocoa-brown plain top — matches reference chibi
export const DEFAULT_MALE: CharAppearance = {
  skinTone: '#fde8d0',
  hairStyle: 'shaggy',
  hairColor: '#c85a28',
  outfitStyle: 'plain',
  outfitColor: '#7a3820',
  hatStyle: 'none',
  eyeColor: '#3388ee',
  mouthStyle: 'smile',
  eyebrowStyle: 'natural',
  makeupStyle: 'none',
  facialHairStyle: 'none',
  faceShape: 'round',
  noseStyle: 'button',
};

// Default girl: bob auburn hair, pink striped top — same colour family as the boy
export const DEFAULT_FEMALE: CharAppearance = {
  skinTone: '#fde8d0',
  hairStyle: 'bob',
  hairColor: '#c85a28',
  outfitStyle: 'stripes',
  outfitColor: '#c84a7a',
  hatStyle: 'none',
  eyeColor: '#88551a',
  mouthStyle: 'smile',
  eyebrowStyle: 'natural',
  makeupStyle: 'none',
  facialHairStyle: 'none',
  faceShape: 'round',
  noseStyle: 'button',
};

function darkenHex(hex: string, amt = 35): string {
  const n = parseInt(hex.replace('#', ''), 16);
  const r = Math.max(0, (n >> 16) - amt);
  const g = Math.max(0, ((n >> 8) & 0xff) - amt);
  const b = Math.max(0, (n & 0xff) - amt);
  return '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');
}
function lightenHex(hex: string, amt = 25): string {
  const n = parseInt(hex.replace('#', ''), 16);
  const r = Math.min(255, (n >> 16) + amt);
  const g = Math.min(255, ((n >> 8) & 0xff) + amt);
  const b = Math.min(255, (n & 0xff) + amt);
  return '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');
}

/* ─── Hair — rendered AFTER head circle, BEFORE face details ─── */
function HairLayer({ style, color }: { style: string; color: string }) {
  const c = color;
  const d = darkenHex(color, 28);
  switch (style) {
    case 'long_wavy': return (
      <>
        <ellipse cx="50" cy="22" rx="28" ry="21" fill={d}/>
        <path d="M23 32 Q8 50 12 78" stroke={c} strokeWidth="14" fill="none" strokeLinecap="round"/>
        <path d="M77 32 Q92 50 88 78" stroke={c} strokeWidth="14" fill="none" strokeLinecap="round"/>
        <path d="M23 32 Q28 10 50 8 Q72 10 77 32 Q70 16 50 14 Q30 16 23 32Z" fill={c}/>
      </>
    );
    case 'curly': return (
      <>
        <ellipse cx="50" cy="18" rx="34" ry="28" fill={c}/>
        <ellipse cx="16" cy="38" rx="14" ry="18" fill={c}/>
        <ellipse cx="84" cy="38" rx="14" ry="18" fill={c}/>
      </>
    );
    case 'ponytail': return (
      <>
        <ellipse cx="50" cy="22" rx="28" ry="21" fill={d}/>
        <path d="M23 32 Q28 10 50 8 Q72 10 77 32 Q70 16 50 14 Q30 16 23 32Z" fill={c}/>
        <path d="M70 12 Q88 8 86 26 Q80 18 68 20Z" fill={c}/>
        <path d="M78 16 Q96 14 94 30 Q88 22 76 24Z" fill={c}/>
      </>
    );
    case 'bob': return (
      <>
        <ellipse cx="50" cy="22" rx="28" ry="21" fill={d}/>
        <path d="M23 32 Q28 10 50 8 Q72 10 77 32 Q70 16 50 14 Q30 16 23 32Z" fill={c}/>
        <path d="M23 32 Q16 44 20 54 Q28 58 36 52" stroke={c} strokeWidth="12" fill="none" strokeLinecap="round"/>
        <path d="M77 32 Q84 44 80 54 Q72 58 64 52" stroke={c} strokeWidth="12" fill="none" strokeLinecap="round"/>
      </>
    );
    case 'braids': return (
      <>
        <ellipse cx="50" cy="22" rx="28" ry="21" fill={d}/>
        <path d="M23 32 Q28 10 50 8 Q72 10 77 32 Q70 16 50 14 Q30 16 23 32Z" fill={c}/>
        <path d="M23 32 Q14 52 18 74" stroke={c} strokeWidth="7" fill="none" strokeLinecap="round"/>
        <path d="M77 32 Q86 52 82 74" stroke={c} strokeWidth="7" fill="none" strokeLinecap="round"/>
        <path d="M20 42 Q26 46 20 52 Q14 56 20 62 Q26 66 20 70" stroke={d} strokeWidth="3.5" fill="none"/>
        <path d="M80 42 Q74 46 80 52 Q86 56 80 62 Q74 66 80 70" stroke={d} strokeWidth="3.5" fill="none"/>
      </>
    );
    case 'pigtails': return (
      <>
        <ellipse cx="50" cy="22" rx="28" ry="21" fill={d}/>
        <path d="M23 32 Q28 10 50 8 Q72 10 77 32 Q70 16 50 14 Q30 16 23 32Z" fill={c}/>
        <ellipse cx="14" cy="40" rx="12" ry="16" fill={c}/>
        <ellipse cx="86" cy="40" rx="12" ry="16" fill={c}/>
      </>
    );
    case 'shaggy': return (
      <>
        <ellipse cx="50" cy="22" rx="28" ry="21" fill={d}/>
        <path d="M23 32 Q28 10 50 8 Q72 10 77 32 Q70 16 50 14 Q30 16 23 32Z" fill={c}/>
        <path d="M28 8 L26 0 L33 7Z" fill={c}/>
        <path d="M40 5 L40 -2 L46 5Z" fill={c}/>
        <path d="M55 5 L58 -2 L60 5Z" fill={c}/>
        <path d="M23 32 Q11 44 15 58" stroke={c} strokeWidth="9" fill="none" strokeLinecap="round"/>
        <path d="M77 32 Q89 44 85 58" stroke={c} strokeWidth="9" fill="none" strokeLinecap="round"/>
      </>
    );
    case 'messy': return (
      <>
        <ellipse cx="50" cy="22" rx="28" ry="21" fill={d}/>
        <path d="M23 32 Q28 10 50 8 Q72 10 77 32 Q70 16 50 14 Q30 16 23 32Z" fill={c}/>
        <path d="M34 8 L33 2 L38 7Z" fill={c}/>
        <path d="M50 6 L51 -1 L54 5Z" fill={c}/>
        <path d="M23 32 Q18 42 22 50" stroke={c} strokeWidth="8" fill="none" strokeLinecap="round"/>
        <path d="M77 32 Q82 42 78 50" stroke={c} strokeWidth="8" fill="none" strokeLinecap="round"/>
      </>
    );
    case 'fro': return <circle cx="50" cy="18" r="36" fill={c}/>;
    case 'pompadour': return (
      <>
        <ellipse cx="50" cy="22" rx="28" ry="21" fill={d}/>
        <path d="M23 32 Q28 10 50 8 Q72 10 77 32 Q70 16 50 14 Q30 16 23 32Z" fill={c}/>
        <path d="M44 8 Q46 -2 54 0 Q54 8 48 12Z" fill={c}/>
        <path d="M50 5 Q54 -5 60 -2 Q58 7 52 11Z" fill={c}/>
      </>
    );
    case 'spikey': return (
      <>
        <ellipse cx="50" cy="22" rx="26" ry="20" fill={d}/>
        <path d="M26 32 Q28 12 50 8 Q72 12 74 32 Q66 18 50 16 Q34 18 26 32Z" fill={c}/>
        <path d="M32 10 L30 0 L38 8Z" fill={c}/>
        <path d="M48 6 L48 -4 L56 5Z" fill={c}/>
        <path d="M63 10 L68 0 L58 8Z" fill={c}/>
      </>
    );
    case 'wavy': return (
      <>
        <ellipse cx="50" cy="22" rx="28" ry="21" fill={d}/>
        <path d="M23 32 Q28 10 50 8 Q72 10 77 32 Q70 16 50 14 Q30 16 23 32Z" fill={c}/>
        <path d="M23 32 Q6 46 10 64" stroke={c} strokeWidth="12" fill="none" strokeLinecap="round"/>
        <path d="M77 32 Q94 46 90 64" stroke={c} strokeWidth="12" fill="none" strokeLinecap="round"/>
      </>
    );
    default: return null;
  }
}

/* ─── Hat — rendered absolutely last ─── */
function HatLayer({ style }: { style: string }) {
  switch (style) {
    case 'cap': return (
      <>
        <path d="M20 30 Q22 6 50 4 Q78 6 80 30 Q70 18 50 16 Q30 18 20 30Z" fill="#cc2222"/>
        <ellipse cx="50" cy="30" rx="33" ry="6" fill="#cc2222"/>
        <ellipse cx="26" cy="29" rx="20" ry="4" fill="#aa1111" opacity="0.75"/>
        <circle cx="50" cy="12" r="3.5" fill="white" opacity="0.6"/>
      </>
    );
    case 'cowboy': return (
      <>
        <ellipse cx="50" cy="30" rx="44" ry="7" fill="#8a5a2a"/>
        <path d="M22 30 Q24 6 50 4 Q76 6 78 30 Q68 18 50 16 Q32 18 22 30Z" fill="#8a5a2a"/>
        <path d="M6 28 Q14 22 22 30" stroke="#8a5a2a" strokeWidth="8" fill="none" strokeLinecap="round"/>
        <path d="M94 28 Q86 22 78 30" stroke="#8a5a2a" strokeWidth="8" fill="none" strokeLinecap="round"/>
        <path d="M22 30 Q50 36 78 30" stroke="#6a4010" strokeWidth="3" fill="none"/>
      </>
    );
    case 'crown': return (
      <>
        <rect x="24" y="22" width="52" height="14" rx="2" fill="#e8a030"/>
        <polygon points="24,22 30,8 36,22" fill="#e8a030"/>
        <polygon points="43,22 50,5 57,22" fill="#e8a030"/>
        <polygon points="64,22 70,8 76,22" fill="#e8a030"/>
        <circle cx="30" cy="10" r="3" fill="#cc2222"/>
        <circle cx="50" cy="7" r="3" fill="#4466cc"/>
        <circle cx="70" cy="10" r="3" fill="#cc2222"/>
        <rect x="24" y="34" width="52" height="4" rx="2" fill="#c88820"/>
      </>
    );
    case 'party': return (
      <>
        <polygon points="50,2 24,32 76,32" fill="#ee2244"/>
        <polygon points="50,2 24,32 76,32" fill="none" stroke="white" strokeWidth="1.5" strokeDasharray="5,3" opacity="0.6"/>
        <circle cx="50" cy="2" r="4.5" fill="#ffe000"/>
        <path d="M24 32 L76 32" stroke="white" strokeWidth="3"/>
      </>
    );
    case 'santa': return (
      <>
        <path d="M26 30 Q28 6 50 2 Q72 6 74 30 Q64 16 50 14 Q36 16 26 30Z" fill="#cc2222"/>
        <ellipse cx="50" cy="31" rx="30" ry="7" fill="white"/>
        <circle cx="54" cy="3" r="6.5" fill="white"/>
      </>
    );
    case 'beanie': return (
      <>
        <path d="M20 30 Q22 6 50 4 Q78 6 80 30 Q70 18 50 16 Q30 18 20 30Z" fill="#4466cc"/>
        <path d="M20 30 Q50 36 80 30" stroke="#2244aa" strokeWidth="4" fill="none"/>
        <path d="M20 30 Q50 38 80 30" stroke="#2244aa" strokeWidth="2.5" fill="none" opacity="0.6"/>
        <circle cx="50" cy="6" r="6" fill="white" opacity="0.75"/>
      </>
    );
    default: return null;
  }
}

/* ─── Outfit ─── */
function OutfitLayer({ style, color }: { style: string; color: string }) {
  const d = darkenHex(color, 30);
  switch (style) {
    case 'stripes': return (
      <>
        <rect x="28" y="65" width="44" height="43" rx="6" fill={color}/>
        {[70, 77, 84, 91].map(y => <rect key={y} x="28" y={y} width="44" height="3.5" fill="white" opacity="0.28"/>)}
      </>
    );
    case 'star': return (
      <>
        <rect x="28" y="65" width="44" height="43" rx="6" fill={color}/>
        <polygon points="50,72 52.5,80 61,80 54.5,85 57,93 50,88.5 43,93 45.5,85 39,80 47.5,80" fill="white" opacity="0.85"/>
      </>
    );
    case 'floral': return (
      <>
        <rect x="28" y="65" width="44" height="43" rx="6" fill={color}/>
        <circle cx="40" cy="76" r="4" fill="white" opacity="0.55"/>
        <circle cx="58" cy="82" r="3.5" fill="#ffe0e8" opacity="0.7"/>
        <circle cx="66" cy="73" r="3" fill="white" opacity="0.55"/>
        <circle cx="44" cy="91" r="3" fill="#ffe0e8" opacity="0.7"/>
        <circle cx="33" cy="84" r="2.5" fill="white" opacity="0.5"/>
      </>
    );
    case 'tropical': return (
      <>
        <rect x="28" y="65" width="44" height="43" rx="6" fill={color}/>
        <path d="M34 70 Q38 66 42 70 Q38 74 34 70Z" fill="#60c820" opacity="0.7"/>
        <path d="M54 76 Q58 72 62 76 Q58 80 54 76Z" fill="#60c820" opacity="0.7"/>
        <path d="M42 84 Q46 80 50 84 Q46 88 42 84Z" fill="#60c820" opacity="0.65"/>
        <circle cx="66" cy="85" r="4" fill="#ffcc00" opacity="0.6"/>
      </>
    );
    case 'uniform': return (
      <>
        <rect x="28" y="65" width="44" height="43" rx="6" fill={color}/>
        <path d="M28 65 L50 79 L72 65 L64 65 L50 73 L36 65Z" fill={d} opacity="0.7"/>
        <path d="M50 73 L50 91" stroke="#cc2222" strokeWidth="2.5" fill="none"/>
      </>
    );
    case 'plain': return (
      <>
        {/* Main body */}
        <rect x="28" y="65" width="44" height="43" rx="6" fill={color}/>
        {/* Crew-neck arc — small dark opening at top */}
        <path d="M43 65 Q50 71 57 65" fill={d} opacity="0.55"/>
        {/* Subtle centre seam */}
        <line x1="50" y1="71" x2="50" y2="108" stroke={d} strokeWidth="1.2" opacity="0.22"/>
        {/* Sleeve cuff hints at shoulders */}
        <rect x="28" y="65" width="44" height="5" rx="3" fill={d} opacity="0.25"/>
      </>
    );
    default: return <rect x="28" y="65" width="44" height="43" rx="6" fill={color}/>;
  }
}

/* ─── Main character component ─── */
export const CustomizableCharSVG: React.FC<{
  appearance: CharAppearance;
  gender: 'female' | 'male';
  size?: number;
  isWalking?: boolean;
}> = ({ appearance, gender, size = 120, isWalking }) => {
  const {
    skinTone: sk, hairStyle, hairColor, outfitStyle, outfitColor,
    hatStyle, eyeColor, mouthStyle, eyebrowStyle, makeupStyle, facialHairStyle,
    faceShape, noseStyle,
  } = appearance;

  const browColor = darkenHex(hairColor, 20);
  const shoeColor = gender === 'female' ? darkenHex(outfitColor, 10) : '#221100';
  const legColor  = gender === 'female' ? sk : darkenHex(outfitColor, 20);

  const mouthPaths: Record<string, string> = {
    smile: 'M46 48 Q50 51 54 48',   // small natural curve
    grin:  'M41 48 Q50 55 59 48',
    pout:  'M45 49 Q50 46 55 49',
    smirk: 'M44 48 Q47 51 50 50 Q53 49 56 47',
  };
  const mouthD = mouthPaths[mouthStyle] ?? mouthPaths.smile;

  const browPaths: Record<string, [string, string]> = {
    natural:  ['M34 27 Q40 24 46 26', 'M54 26 Q60 24 66 27'],
    thin:     ['M35 26 Q40 23 45 25', 'M55 25 Q60 23 65 26'],
    thick:    ['M33 28 Q40 23 47 27', 'M53 27 Q60 23 67 28'],
    arched:   ['M34 26 Q40 18 46 24', 'M54 24 Q60 18 66 26'],
  };
  const [lb, rb] = browPaths[eyebrowStyle] ?? browPaths.natural;
  const browW = eyebrowStyle === 'thick' ? 2.8 : 1.8;

  const mouthColor = makeupStyle === 'red_lips' ? '#cc1133' : makeupStyle === 'pink_glow' ? '#dd44aa' : '#cc4466';
  const blushOp = makeupStyle === 'pink_glow' ? 0.6 : makeupStyle === 'smoky' ? 0.18 : 0.35;

  // Per-instance unique prefix for gradient IDs — prevents cross-character style bleed
  const uid = useId().replace(/:/g, '');
  const gp  = uid;

  return (
    <svg viewBox="0 0 100 140" width={size} height={size * 1.4} xmlns="http://www.w3.org/2000/svg">
      <defs>
        {/* Head / face — radial sphere, lit from upper-left */}
        <radialGradient id={`cfs${gp}`} cx="36%" cy="30%" r="72%">
          <stop offset="0%"   stopColor={lightenHex(sk, 22)}/>
          <stop offset="55%"  stopColor={sk}/>
          <stop offset="100%" stopColor={darkenHex(sk, 26)}/>
        </radialGradient>
        {/* Arms / hands / neck — cylindrical, lit from left */}
        <linearGradient id={`cal${gp}`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"   stopColor={lightenHex(sk, 16)}/>
          <stop offset="38%"  stopColor={sk}/>
          <stop offset="100%" stopColor={darkenHex(sk, 28)}/>
        </linearGradient>
        {/* Legs — cylindrical, same scheme */}
        <linearGradient id={`clg${gp}`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"   stopColor={lightenHex(legColor, 18)}/>
          <stop offset="40%"  stopColor={legColor}/>
          <stop offset="100%" stopColor={darkenHex(legColor, 30)}/>
        </linearGradient>
        {/* Outfit shading overlay — adds cylinder depth without hiding patterns */}
        <linearGradient id={`cou${gp}`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"   stopColor="rgba(255,255,255,0.24)"/>
          <stop offset="40%"  stopColor="rgba(255,255,255,0.04)"/>
          <stop offset="72%"  stopColor="rgba(0,0,0,0.05)"/>
          <stop offset="100%" stopColor="rgba(0,0,0,0.24)"/>
        </linearGradient>
        {/* Shoes — top-lit */}
        <linearGradient id={`csh${gp}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%"   stopColor={lightenHex(shoeColor, 22)}/>
          <stop offset="100%" stopColor={darkenHex(shoeColor, 18)}/>
        </linearGradient>
      </defs>

      {/* Ground shadow */}
      <ellipse cx="50" cy="137" rx="22" ry="4" fill="#00000025"/>

      {/* ── Legs ── */}
      <g className={isWalking ? 'char-leg-a' : undefined} style={{ transformOrigin: '40px 108px' }}>
        <rect x="34" y="108" width="12" height="25" rx="5" fill={`url(#clg${gp})`}/>
        {/* Knee gloss */}
        <ellipse cx="38" cy="116" rx="3.2" ry="2" fill="rgba(255,255,255,0.28)"/>
        <ellipse cx="40" cy="133" rx="10" ry="5.5" fill={`url(#csh${gp})`}/>
        <ellipse cx="37" cy="130" rx="5.5" ry="2" fill="rgba(255,255,255,0.26)"/>
      </g>
      <g className={isWalking ? 'char-leg-b' : undefined} style={{ transformOrigin: '60px 108px' }}>
        <rect x="54" y="108" width="12" height="25" rx="5" fill={`url(#clg${gp})`}/>
        <ellipse cx="58" cy="116" rx="3.2" ry="2" fill="rgba(255,255,255,0.22)"/>
        <ellipse cx="60" cy="133" rx="10" ry="5.5" fill={darkenHex(shoeColor, 10)}/>
        <ellipse cx="57" cy="130" rx="5.5" ry="2" fill="rgba(255,255,255,0.18)"/>
      </g>

      {/* ── Outfit body ── */}
      <OutfitLayer style={outfitStyle} color={outfitColor}/>
      {/* Cylindrical depth overlay — sits above patterns at low opacity */}
      <rect x="28" y="65" width="44" height="43" rx="6" fill={`url(#cou${gp})`}/>
      {/* Right rim shadow crescent */}
      <path d="M66 68 Q71 86 67 107" stroke="rgba(0,0,0,0.16)" strokeWidth="7" fill="none" strokeLinecap="round"/>
      {/* Left rim highlight */}
      <path d="M33 68 Q28 86 32 107" stroke="rgba(255,255,255,0.18)" strokeWidth="5" fill="none" strokeLinecap="round"/>

      {/* ── Arms — relaxed, hanging straight down beside the body ── */}
      {/* Back arm — lit from left */}
      <g className={isWalking ? 'char-arm-b' : undefined} style={{ transformOrigin: '28px 68px' }}>
        <path d="M28 68 Q24 82 25 100" stroke={`url(#cal${gp})`} strokeWidth="11" fill="none" strokeLinecap="round"/>
        <path d="M27.5 68 Q23.5 81.5 24.5 98.5" stroke="rgba(255,255,255,0.28)" strokeWidth="3.5" fill="none" strokeLinecap="round"/>
        <circle cx="25" cy="101" r="6.5" fill={`url(#cal${gp})`}/>
        <circle cx="23.5" cy="99" r="2.2" fill="rgba(255,255,255,0.34)"/>
      </g>
      {/* Front arm — in shadow relative to light */}
      <g className={isWalking ? 'char-arm-a' : undefined} style={{ transformOrigin: '72px 68px' }}>
        <path d="M72 68 Q76 82 75 100" stroke={darkenHex(sk, 12)} strokeWidth="11" fill="none" strokeLinecap="round"/>
        <path d="M72 68 Q76 82 75 100" stroke="rgba(0,0,0,0.10)" strokeWidth="4" fill="none" strokeLinecap="round"/>
        <circle cx="75" cy="101" r="6.5" fill={darkenHex(sk, 12)}/>
      </g>

      {/* ── Neck ── */}
      <rect x="43" y="59" width="14" height="8" rx="3" fill={sk}/>
      {/* Neck right-side shadow */}
      <path d="M51 59 Q58 62 57 67" stroke="rgba(0,0,0,0.14)" strokeWidth="6" fill="none" strokeLinecap="round"/>

      {/* ── Fro (behind head) ── */}
      {hairStyle === 'fro' && <HairLayer style="fro" color={hairColor}/>}

      {/* ── Head — spherical skin gradient (bigger than body) ── */}
      {faceShape === 'oval'   ? <ellipse cx="50" cy="33" rx="26" ry="33" fill={`url(#cfs${gp})`}/> :
       faceShape === 'wide'   ? <ellipse cx="50" cy="32" rx="35" ry="26" fill={`url(#cfs${gp})`}/> :
       faceShape === 'narrow' ? <ellipse cx="50" cy="33" rx="22" ry="33" fill={`url(#cfs${gp})`}/> :
       faceShape === 'heart'  ? <path d="M50 66 Q24 50 22 28 Q20 8 36 4 Q50 0 50 16 Q50 0 64 4 Q80 8 78 28 Q76 50 50 66Z" fill={`url(#cfs${gp})`}/> :
       faceShape === 'soft'   ? <ellipse cx="50" cy="33" rx="29" ry="32" fill={`url(#cfs${gp})`}/> :
       <circle cx="50" cy="33" r="32" fill={`url(#cfs${gp})`}/>}
      {/* Chin shadow — reinforces sphere volume */}
      <ellipse cx="50" cy="61" rx="22" ry="7" fill="rgba(0,0,0,0.09)"/>
      {/* Cheek specular — lit from upper-left */}
      <ellipse cx="32" cy="28" rx="5.5" ry="3.5" fill="rgba(255,255,255,0.18)" transform="rotate(-16 32 28)"/>

      {/* ── Face texture lines — subtle contour detail ── */}
      {/* Nasolabial folds — left & right */}
      <path d="M38 36 Q36 40 37 45" stroke={darkenHex(sk, 22)} strokeWidth="0.9" fill="none" strokeLinecap="round" opacity="0.13"/>
      <path d="M62 36 Q64 40 63 45" stroke={darkenHex(sk, 22)} strokeWidth="0.9" fill="none" strokeLinecap="round" opacity="0.13"/>
      {/* Under-eye hollows */}
      <path d="M33 35 Q37 37 41 35" stroke={darkenHex(sk, 18)} strokeWidth="0.8" fill="none" strokeLinecap="round" opacity="0.11"/>
      <path d="M59 35 Q63 37 67 35" stroke={darkenHex(sk, 18)} strokeWidth="0.8" fill="none" strokeLinecap="round" opacity="0.11"/>
      {/* Chin cleft hint — kept above wide-face lower bound (y≈58) */}
      <path d="M47 55 Q50 57 53 55" stroke={darkenHex(sk, 16)} strokeWidth="0.9" fill="none" strokeLinecap="round" opacity="0.10"/>
      {/* Forehead faint line */}
      <path d="M40 14 Q50 11 60 14" stroke={darkenHex(sk, 12)} strokeWidth="0.7" fill="none" strokeLinecap="round" opacity="0.08"/>
      {/* Philtrum groove */}
      <path d="M49 43 Q50 46 51 43" stroke={darkenHex(sk, 20)} strokeWidth="0.8" fill="none" strokeLinecap="round" opacity="0.11"/>

      {/* ── Hair (on top of head) ── */}
      {hairStyle !== 'fro' && <HairLayer style={hairStyle} color={hairColor}/>}

      {/* ── Eyes — layered for 3D depth ── */}
      {/* Eyelid shadow (skin colour, above eye socket) */}
      <ellipse cx="40" cy="29.5" rx="8" ry="4.5" fill={darkenHex(sk, 16)} opacity="0.36"/>
      <ellipse cx="60" cy="29.5" rx="8" ry="4.5" fill={darkenHex(sk, 16)} opacity="0.36"/>
      {/* Relaxed upper eyelid droop — soft half-lid overlay */}
      <ellipse cx="40" cy="26.5" rx="7.2" ry="4.8" fill={sk} opacity="0.58"/>
      <ellipse cx="60" cy="26.5" rx="7.2" ry="4.8" fill={sk} opacity="0.58"/>
      {/* Whites */}
      <ellipse cx="40" cy="33" rx="7" ry="8" fill="white"/>
      <ellipse cx="60" cy="33" rx="7" ry="8" fill="white"/>
      {/* Upper-lid inner shadow on white */}
      <ellipse cx="40" cy="27" rx="7" ry="3.5" fill="rgba(0,0,0,0.11)"/>
      <ellipse cx="60" cy="27" rx="7" ry="3.5" fill="rgba(0,0,0,0.11)"/>
      {/* Iris */}
      <ellipse cx="40" cy="35" rx="5" ry="6" fill={eyeColor || '#88551a'}/>
      <ellipse cx="60" cy="35" rx="5" ry="6" fill={eyeColor || '#88551a'}/>
      {/* Iris rim darkening */}
      <ellipse cx="40" cy="35" rx="5" ry="6" fill="none" stroke={darkenHex(eyeColor || '#88551a', 35)} strokeWidth="1.0" opacity="0.55"/>
      <ellipse cx="60" cy="35" rx="5" ry="6" fill="none" stroke={darkenHex(eyeColor || '#88551a', 35)} strokeWidth="1.0" opacity="0.55"/>
      {/* Pupils */}
      <circle cx="40.8" cy="36" r="3" fill="#1a0a00"/>
      <circle cx="60.8" cy="36" r="3" fill="#1a0a00"/>
      {/* Primary specular (large) */}
      <circle cx="42.5" cy="33.5" r="1.8" fill="white"/>
      <circle cx="62.5" cy="33.5" r="1.8" fill="white"/>
      {/* Secondary micro-highlight */}
      <circle cx="39.2" cy="38" r="0.9" fill="rgba(255,255,255,0.62)"/>
      <circle cx="59.2" cy="38" r="0.9" fill="rgba(255,255,255,0.62)"/>
      {/* Lash line */}
      <path d="M33 27.5 Q40 24.5 47 27.5" stroke={darkenHex(hairColor, 8)} strokeWidth="2.0" fill="none" strokeLinecap="round" opacity="0.88"/>
      <path d="M53 27.5 Q60 24.5 67 27.5" stroke={darkenHex(hairColor, 8)} strokeWidth="2.0" fill="none" strokeLinecap="round" opacity="0.88"/>

      {/* ── Eyebrows ── */}
      <path d={lb} stroke={browColor} strokeWidth={browW} fill="none" strokeLinecap="round"/>
      <path d={rb} stroke={browColor} strokeWidth={browW} fill="none" strokeLinecap="round"/>

      {/* ── Blush ── */}
      <ellipse cx="30" cy="39" rx="7" ry="4" fill="#ff8888" opacity={blushOp}/>
      <ellipse cx="70" cy="39" rx="7" ry="4" fill="#ff8888" opacity={blushOp}/>
      {makeupStyle === 'shimmer' && <>
        <ellipse cx="30" cy="38" rx="6" ry="3" fill="#e8d060" opacity="0.4"/>
        <ellipse cx="70" cy="38" rx="6" ry="3" fill="#e8d060" opacity="0.4"/>
      </>}
      {makeupStyle === 'pink_glow' && <>
        <ellipse cx="30" cy="39" rx="9" ry="5" fill="#ff88cc" opacity="0.3"/>
        <ellipse cx="70" cy="39" rx="9" ry="5" fill="#ff88cc" opacity="0.3"/>
      </>}

      {/* ── Nose ── */}
      {noseStyle === 'dot'   ? <circle cx="50" cy="41" r="1.5" fill="#e0a880" opacity="0.7"/> :
       noseStyle === 'round' ? <ellipse cx="50" cy="41" rx="3.5" ry="2.2" fill="#e0a880" opacity="0.6"/> :
       noseStyle === 'snub'  ? <path d="M47 40 Q50 42 53 40 Q51 44 50 44 Q49 44 47 40Z" fill="#e0a880" opacity="0.55"/> :
       <ellipse cx="50" cy="41" rx="2" ry="1.2" fill="#e0a880" opacity="0.6"/>}

      {/* ── Mouth — upper lip fill + stroke curve ── */}
      {/* Upper lip shape */}
      <path d="M45 47 Q47 45 50 46 Q53 45 55 47 Q52 49 50 49 Q48 49 45 47Z"
        fill={mouthColor} opacity="0.55"/>
      {/* Smile stroke */}
      <path d={mouthD} stroke={mouthColor} strokeWidth="1.6" fill="none" strokeLinecap="round"/>
      {/* Lower lip highlight */}
      <ellipse cx="50" cy="51" rx="4" ry="1.4" fill={lightenHex(mouthColor, 20)} opacity="0.28"/>

      {/* ── Facial hair ── */}
      {facialHairStyle === 'stubble' && (
        <>{([[36,50],[40,52],[46,53],[54,53],[60,52],[64,50]] as [number,number][]).map(([x,y]) => (
          <circle key={`${x}${y}`} cx={x} cy={y} r="1.5" fill={browColor} opacity="0.45"/>
        ))}</>
      )}
      {facialHairStyle === 'mustache' && (
        <path d="M40 46 Q44 43 46 46 Q50 44 54 46 Q56 43 60 46" stroke={browColor} strokeWidth="2.5" fill="none" strokeLinecap="round"/>
      )}
      {facialHairStyle === 'goatee' && (
        <path d="M44 52 Q50 58 56 52 Q50 62 44 52Z" fill={browColor} opacity="0.7"/>
      )}
      {facialHairStyle === 'full_beard' && (
        <path d="M28 50 Q28 62 34 66 Q42 72 50 70 Q58 72 66 66 Q72 62 72 50 Q62 58 50 56 Q38 58 28 50Z" fill={browColor} opacity="0.6"/>
      )}
      {facialHairStyle === 'handlebar' && (
        <>
          <path d="M40 46 Q36 40 32 43" stroke={browColor} strokeWidth="2.5" fill="none" strokeLinecap="round"/>
          <path d="M60 46 Q64 40 68 43" stroke={browColor} strokeWidth="2.5" fill="none" strokeLinecap="round"/>
          <path d="M40 46 Q44 43 50 44 Q56 43 60 46" stroke={browColor} strokeWidth="2.5" fill="none" strokeLinecap="round"/>
        </>
      )}

      {/* ── Hat ── */}
      <HatLayer style={hatStyle}/>
    </svg>
  );
};

/* ─── Small hair preview icon for catalog grid ─── */
export const HairPreviewIcon: React.FC<{ style: string; color: string }> = ({ style, color }) => {
  const c = color;
  const d = darkenHex(color, 28);
  const isFro = style === 'fro';
  const hairShapes: Record<string, React.ReactNode> = {
    long_wavy: <><ellipse cx="30" cy="26" rx="18" ry="14" fill={d}/><path d="M12 36 Q3 50 7 66" stroke={c} strokeWidth="9" fill="none" strokeLinecap="round"/><path d="M48 36 Q57 50 53 66" stroke={c} strokeWidth="9" fill="none" strokeLinecap="round"/><path d="M12 36 Q14 22 30 20 Q46 22 48 36 Q44 28 30 26 Q16 28 12 36Z" fill={c}/></>,
    curly:     <><ellipse cx="30" cy="20" rx="24" ry="20" fill={c}/><ellipse cx="7" cy="38" rx="10" ry="14" fill={c}/><ellipse cx="53" cy="38" rx="10" ry="14" fill={c}/></>,
    ponytail:  <><ellipse cx="30" cy="26" rx="18" ry="14" fill={d}/><path d="M12 36 Q14 22 30 20 Q46 22 48 36 Q44 28 30 26 Q16 28 12 36Z" fill={c}/><path d="M44 22 Q58 18 56 32 Q52 24 44 26Z" fill={c}/></>,
    bob:       <><ellipse cx="30" cy="26" rx="18" ry="14" fill={d}/><path d="M12 36 Q14 22 30 20 Q46 22 48 36 Q44 28 30 26 Q16 28 12 36Z" fill={c}/><path d="M12 36 Q10 44 14 52 Q20 56 26 52" stroke={c} strokeWidth="8" fill="none" strokeLinecap="round"/><path d="M48 36 Q50 44 46 52 Q40 56 34 52" stroke={c} strokeWidth="8" fill="none" strokeLinecap="round"/></>,
    braids:    <><ellipse cx="30" cy="26" rx="18" ry="14" fill={d}/><path d="M12 36 Q14 22 30 20 Q46 22 48 36 Q44 28 30 26 Q16 28 12 36Z" fill={c}/><path d="M12 36 Q8 48 10 64" stroke={c} strokeWidth="5" fill="none" strokeLinecap="round"/><path d="M48 36 Q52 48 50 64" stroke={c} strokeWidth="5" fill="none" strokeLinecap="round"/></>,
    pigtails:  <><ellipse cx="30" cy="26" rx="18" ry="14" fill={d}/><path d="M12 36 Q14 22 30 20 Q46 22 48 36 Q44 28 30 26 Q16 28 12 36Z" fill={c}/><ellipse cx="5" cy="40" rx="7" ry="11" fill={c}/><ellipse cx="55" cy="40" rx="7" ry="11" fill={c}/></>,
    shaggy:    <><ellipse cx="30" cy="26" rx="18" ry="14" fill={d}/><path d="M12 36 Q14 22 30 20 Q46 22 48 36 Q44 28 30 26 Q16 28 12 36Z" fill={c}/><path d="M16 20 L14 11 L20 18Z" fill={c}/><path d="M27 16 L27 8 L31 15Z" fill={c}/><path d="M38 18 L42 10 L43 18Z" fill={c}/><path d="M12 36 Q5 46 8 56" stroke={c} strokeWidth="6" fill="none" strokeLinecap="round"/><path d="M48 36 Q55 46 52 56" stroke={c} strokeWidth="6" fill="none" strokeLinecap="round"/></>,
    messy:     <><ellipse cx="30" cy="26" rx="18" ry="14" fill={d}/><path d="M12 36 Q14 22 30 20 Q46 22 48 36 Q44 28 30 26 Q16 28 12 36Z" fill={c}/><path d="M30 20 L28 13 L33 19Z" fill={c}/><path d="M12 36 Q10 44 13 50" stroke={c} strokeWidth="6" fill="none" strokeLinecap="round"/><path d="M48 36 Q50 44 47 50" stroke={c} strokeWidth="6" fill="none" strokeLinecap="round"/></>,
    fro:       <circle cx="30" cy="20" r="30" fill={c}/>,
    pompadour: <><ellipse cx="30" cy="26" rx="18" ry="14" fill={d}/><path d="M12 36 Q14 22 30 20 Q46 22 48 36 Q44 28 30 26 Q16 28 12 36Z" fill={c}/><path d="M26 20 Q28 10 34 12 Q30 18 26 22Z" fill={c}/><path d="M30 16 Q34 6 40 8 Q36 16 32 20Z" fill={c}/></>,
    spikey:    <><ellipse cx="30" cy="26" rx="16" ry="12" fill={d}/><path d="M14 36 Q16 24 30 20 Q44 24 46 36 Q40 28 30 26 Q20 28 14 36Z" fill={c}/><path d="M17 22 L15 12 L21 20Z" fill={c}/><path d="M28 18 L28 9 L32 17Z" fill={c}/><path d="M39 22 L43 12 L37 20Z" fill={c}/></>,
    wavy:      <><ellipse cx="30" cy="26" rx="18" ry="14" fill={d}/><path d="M12 36 Q14 22 30 20 Q46 22 48 36 Q44 28 30 26 Q16 28 12 36Z" fill={c}/><path d="M12 36 Q2 48 6 64" stroke={c} strokeWidth="10" fill="none" strokeLinecap="round"/><path d="M48 36 Q58 48 54 64" stroke={c} strokeWidth="10" fill="none" strokeLinecap="round"/></>,
  };

  return (
    <svg viewBox="0 0 60 70" width="60" height="70">
      <rect x="0" y="0" width="60" height="70" fill="#f0e8d4" rx="4"/>
      {/* fro goes BEHIND head */}
      {isFro && <circle cx="30" cy="22" r="30" fill={c}/>}
      {/* Head */}
      <circle cx="30" cy="40" r="18" fill="#fde8d0"/>
      {/* Hair on top of head (non-fro) */}
      {!isFro && (hairShapes[style] ?? <circle cx="30" cy="28" r="20" fill={c}/>)}
      {/* Mini face */}
      <circle cx="22" cy="38" r="3" fill="#1a0a00" opacity="0.75"/>
      <circle cx="38" cy="38" r="3" fill="#1a0a00" opacity="0.75"/>
      <path d="M24 44 Q30 48 36 44" stroke="#cc4466" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
    </svg>
  );
};

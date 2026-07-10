import React, { useState, useCallback } from 'react';

export interface PlayerProfile {
  name: string;
  gender: 'female' | 'male';
  skinTone: number;
  hairColor: string;
  characterId: string;
  hasSetup: boolean;
}

/* ── Chibi character SVGs ────────────────────────────────────────────────── */

/** Character 1 – Mia: brown pigtails, white bow, blue-stripe sailor top */
const ChMia = ({ size = 120 }: { size?: number }) => (
  <svg viewBox="0 0 100 140" width={size} height={size * 1.4} xmlns="http://www.w3.org/2000/svg">
    {/* shadow */}
    <ellipse cx="50" cy="137" rx="22" ry="4" fill="#00000025"/>
    {/* legs */}
    <rect x="36" y="108" width="11" height="25" rx="5" fill="#fde8d0"/>
    <rect x="53" y="108" width="11" height="25" rx="5" fill="#fde8d0"/>
    {/* shoes */}
    <ellipse cx="41" cy="133" rx="9" ry="5" fill="#4466cc"/>
    <ellipse cx="59" cy="133" rx="9" ry="5" fill="#4466cc"/>
    {/* skirt */}
    <path d="M28 90 Q30 118 42 118 L58 118 Q70 118 72 90Z" fill="#4466cc"/>
    <path d="M28 90 L72 90" stroke="#334499" strokeWidth="1.5" fill="none"/>
    {/* body */}
    <rect x="30" y="65" width="40" height="28" rx="8" fill="white"/>
    {/* blue stripes on top */}
    <rect x="30" y="70" width="40" height="4" rx="0" fill="#4466cc"/>
    <rect x="30" y="78" width="40" height="4" rx="0" fill="#4466cc"/>
    <rect x="30" y="86" width="40" height="3" fill="#4466cc"/>
    {/* arms */}
    <path d="M30 68 Q18 74 20 84" stroke="#fde8d0" strokeWidth="10" fill="none" strokeLinecap="round"/>
    <path d="M70 68 Q82 74 80 84" stroke="#fde8d0" strokeWidth="10" fill="none" strokeLinecap="round"/>
    {/* neck */}
    <rect x="43" y="55" width="14" height="12" rx="3" fill="#fde8d0"/>
    {/* head */}
    <circle cx="50" cy="36" r="28" fill="#fde8d0"/>
    {/* hair back */}
    <ellipse cx="50" cy="24" rx="28" ry="21" fill="#7a4520"/>
    {/* pigtails */}
    <path d="M23 32 Q12 38 16 56" stroke="#6a3a18" strokeWidth="11" fill="none" strokeLinecap="round"/>
    <path d="M77 32 Q88 38 84 56" stroke="#6a3a18" strokeWidth="11" fill="none" strokeLinecap="round"/>
    {/* front hair */}
    <path d="M23 32 Q28 10 50 10 Q72 10 77 32 Q72 18 50 18 Q28 18 23 32Z" fill="#8b5428"/>
    {/* bangs */}
    <path d="M23 32 Q30 38 38 32" fill="#7a4520"/>
    <path d="M77 32 Q70 38 62 32" fill="#7a4520"/>
    {/* white bow */}
    <path d="M38 14 Q50 9 62 14 Q50 19 38 14Z" fill="white" stroke="#dddddd" strokeWidth="0.5"/>
    <circle cx="50" cy="14" r="3" fill="#eeeeee"/>
    {/* eyes white */}
    <ellipse cx="40" cy="36" rx="7" ry="8" fill="white"/>
    <ellipse cx="60" cy="36" rx="7" ry="8" fill="white"/>
    {/* iris */}
    <ellipse cx="40" cy="38" rx="5" ry="6" fill="#88551a"/>
    <ellipse cx="60" cy="38" rx="5" ry="6" fill="#88551a"/>
    {/* pupil */}
    <circle cx="40.8" cy="39" r="3" fill="#1a0a00"/>
    <circle cx="60.8" cy="39" r="3" fill="#1a0a00"/>
    {/* shine */}
    <circle cx="42.5" cy="36.5" r="1.5" fill="white"/>
    <circle cx="62.5" cy="36.5" r="1.5" fill="white"/>
    {/* lashes */}
    <path d="M33 30 Q35 27 37 30" stroke="#552200" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
    <path d="M53 30 Q55 27 57 30" stroke="#552200" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
    {/* brows */}
    <path d="M34 29 Q40 25 46 28" stroke="#6a3a18" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
    <path d="M54 28 Q60 25 66 29" stroke="#6a3a18" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
    {/* blush */}
    <ellipse cx="30" cy="42" rx="7" ry="4" fill="#ff8888" opacity="0.38"/>
    <ellipse cx="70" cy="42" rx="7" ry="4" fill="#ff8888" opacity="0.38"/>
    {/* nose */}
    <ellipse cx="50" cy="43" rx="2" ry="1.2" fill="#e0a880" opacity="0.6"/>
    {/* smile */}
    <path d="M43 49 Q50 55 57 49" stroke="#cc4466" strokeWidth="2" fill="none" strokeLinecap="round"/>
    {/* sailor collar */}
    <path d="M30 65 L50 78 L70 65 L63 65 L50 72 L37 65Z" fill="#334499" stroke="#222288" strokeWidth="0.5"/>
    <path d="M50 72 L50 90" stroke="#cc2222" strokeWidth="2.5" fill="none"/>
  </svg>
);

/** Character 2 – Leo: blonde spiky hair, dark star shirt, jeans */
const ChLeo = ({ size = 120 }: { size?: number }) => (
  <svg viewBox="0 0 100 148" width={size} height={size * 1.48} xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="50" cy="145" rx="24" ry="4" fill="#00000025"/>
    {/* legs */}
    <rect x="34" y="108" width="12" height="32" rx="5" fill="#2244aa"/>
    <rect x="54" y="108" width="12" height="32" rx="5" fill="#2244aa"/>
    {/* shoes */}
    <ellipse cx="40" cy="140" rx="11" ry="6" fill="#221100"/>
    <ellipse cx="60" cy="140" rx="11" ry="6" fill="#221100"/>
    {/* jeans pocket detail */}
    <path d="M34 108 Q34 120 46 120" stroke="#3355bb" strokeWidth="1.2" fill="none"/>
    {/* shirt body */}
    <rect x="28" y="64" width="44" height="46" rx="8" fill="#222233"/>
    {/* star on shirt */}
    <polygon points="50,72 52.8,80 61,80 54.8,85 57.2,93 50,88.5 42.8,93 45.2,85 39,80 47.2,80" fill="white" opacity="0.9"/>
    {/* arms */}
    <path d="M28 68 Q15 74 17 86" stroke="#222233" strokeWidth="12" fill="none" strokeLinecap="round"/>
    <path d="M72 68 Q85 74 83 86" stroke="#222233" strokeWidth="12" fill="none" strokeLinecap="round"/>
    {/* forearms */}
    <path d="M17 86 Q16 92 20 96" stroke="#fde8d0" strokeWidth="10" fill="none" strokeLinecap="round"/>
    <path d="M83 86 Q84 92 80 96" stroke="#fde8d0" strokeWidth="10" fill="none" strokeLinecap="round"/>
    {/* neck */}
    <rect x="42" y="54" width="16" height="12" rx="3" fill="#fde8d0"/>
    {/* head (slightly taller for boy) */}
    <circle cx="50" cy="34" r="30" fill="#fde8d0"/>
    {/* hair base */}
    <ellipse cx="50" cy="20" rx="29" ry="20" fill="#d4a824"/>
    {/* spiky hair */}
    <path d="M22 30 Q20 10 28 6 Q30 18 35 20" fill="#e8c030"/>
    <path d="M34 15 Q36 2 44 0 Q44 14 48 18" fill="#d4a824"/>
    <path d="M46 10 Q50 -2 56 2 Q54 14 52 18" fill="#e8c030"/>
    <path d="M54 12 Q60 0 68 4 Q64 16 60 20" fill="#d4a824"/>
    <path d="M62 18 Q70 8 78 12 Q74 22 70 26" fill="#e8c030"/>
    {/* side hair */}
    <path d="M21 30 Q18 44 22 52" stroke="#d4a824" strokeWidth="9" fill="none" strokeLinecap="round"/>
    <path d="M79 30 Q82 44 78 52" stroke="#d4a824" strokeWidth="9" fill="none" strokeLinecap="round"/>
    {/* front fringe */}
    <path d="M22 28 Q28 36 38 30" fill="#c89818"/>
    <path d="M78 28 Q72 36 62 30" fill="#c89818"/>
    {/* eyes */}
    <ellipse cx="38" cy="35" rx="7.5" ry="8.5" fill="white"/>
    <ellipse cx="62" cy="35" rx="7.5" ry="8.5" fill="white"/>
    <ellipse cx="38" cy="37" rx="5.5" ry="6.5" fill="#3388ee"/>
    <ellipse cx="62" cy="37" rx="5.5" ry="6.5" fill="#3388ee"/>
    <circle cx="39" cy="38" r="3.2" fill="#0a1a30"/>
    <circle cx="63" cy="38" r="3.2" fill="#0a1a30"/>
    <circle cx="40.8" cy="35.5" r="1.6" fill="white"/>
    <circle cx="64.8" cy="35.5" r="1.6" fill="white"/>
    {/* brows (boyish, thicker) */}
    <path d="M31 28 Q38 23 45 27" stroke="#a07010" strokeWidth="2.2" fill="none" strokeLinecap="round"/>
    <path d="M55 27 Q62 23 69 28" stroke="#a07010" strokeWidth="2.2" fill="none" strokeLinecap="round"/>
    {/* blush */}
    <ellipse cx="27" cy="42" rx="7" ry="4" fill="#ff9999" opacity="0.3"/>
    <ellipse cx="73" cy="42" rx="7" ry="4" fill="#ff9999" opacity="0.3"/>
    {/* nose */}
    <ellipse cx="50" cy="43" rx="2.2" ry="1.4" fill="#e0a880" opacity="0.5"/>
    {/* confident smile */}
    <path d="M41 50 Q50 57 59 50" stroke="#cc4455" strokeWidth="2.2" fill="none" strokeLinecap="round"/>
    {/* shirt collar */}
    <path d="M28 64 L42 72 L50 64 L58 72 L72 64" stroke="#444455" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

/** Character 3 – Ava: auburn flowing hair, green eyes, pink top */
const ChAva = ({ size = 120 }: { size?: number }) => (
  <svg viewBox="0 0 100 142" width={size} height={size * 1.42} xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="50" cy="139" rx="22" ry="4" fill="#00000025"/>
    {/* legs */}
    <rect x="36" y="108" width="11" height="26" rx="5" fill="#fde8d0"/>
    <rect x="53" y="108" width="11" height="26" rx="5" fill="#fde8d0"/>
    {/* shoes */}
    <ellipse cx="41" cy="134" rx="9" ry="5" fill="#cc6688"/>
    <ellipse cx="59" cy="134" rx="9" ry="5" fill="#cc6688"/>
    {/* skirt */}
    <path d="M26 88 Q28 114 40 116 L60 116 Q72 114 74 88Z" fill="#ff9ab0"/>
    <path d="M26 88 L74 88" stroke="#dd7090" strokeWidth="1.5" fill="none"/>
    {/* ruffle on skirt */}
    <path d="M26 88 Q32 95 38 88 Q44 95 50 88 Q56 95 62 88 Q68 95 74 88" stroke="#ffbbcc" strokeWidth="3" fill="none"/>
    {/* body / top */}
    <rect x="28" y="62" width="44" height="28" rx="9" fill="#ff88aa"/>
    {/* top detail - v-neck */}
    <path d="M28 62 L50 76 L72 62" stroke="#dd6688" strokeWidth="2" fill="none"/>
    {/* arms */}
    <path d="M28 66 Q16 72 18 82" stroke="#ff88aa" strokeWidth="11" fill="none" strokeLinecap="round"/>
    <path d="M72 66 Q84 72 82 82" stroke="#ff88aa" strokeWidth="11" fill="none" strokeLinecap="round"/>
    {/* hands */}
    <circle cx="18" cy="84" r="6" fill="#fde8d0"/>
    <circle cx="82" cy="84" r="6" fill="#fde8d0"/>
    {/* neck */}
    <rect x="43" y="52" width="14" height="12" rx="3" fill="#fde8d0"/>
    {/* head */}
    <circle cx="50" cy="33" r="28" fill="#fde8d0"/>
    {/* long flowing hair back */}
    <ellipse cx="50" cy="22" rx="27" ry="20" fill="#aa4418"/>
    <path d="M23 32 Q14 60 20 90 Q24 100 30 104" stroke="#993310" strokeWidth="14" fill="none" strokeLinecap="round"/>
    <path d="M77 32 Q86 60 80 90 Q76 100 70 104" stroke="#993310" strokeWidth="14" fill="none" strokeLinecap="round"/>
    {/* front hair */}
    <path d="M23 32 Q27 12 50 11 Q73 12 77 32 Q72 18 50 18 Q28 18 23 32Z" fill="#bb5520"/>
    {/* side swept bangs */}
    <path d="M23 32 Q28 40 36 35" fill="#aa4418"/>
    {/* eyes */}
    <ellipse cx="40" cy="34" rx="7" ry="8" fill="white"/>
    <ellipse cx="60" cy="34" rx="7" ry="8" fill="white"/>
    <ellipse cx="40" cy="36" rx="5" ry="6" fill="#22aa55"/>
    <ellipse cx="60" cy="36" rx="5" ry="6" fill="#22aa55"/>
    <circle cx="40.8" cy="37" r="3" fill="#082210"/>
    <circle cx="60.8" cy="37" r="3" fill="#082210"/>
    <circle cx="42.5" cy="34.5" r="1.5" fill="white"/>
    <circle cx="62.5" cy="34.5" r="1.5" fill="white"/>
    {/* lashes */}
    <path d="M33 27 Q36 24 39 27" stroke="#882200" strokeWidth="1.3" fill="none" strokeLinecap="round"/>
    <path d="M51 27 Q54 24 57 27" stroke="#882200" strokeWidth="1.3" fill="none" strokeLinecap="round"/>
    {/* brows */}
    <path d="M33 26 Q40 22 47 25" stroke="#993310" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
    <path d="M53 25 Q60 22 67 26" stroke="#993310" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
    {/* blush */}
    <ellipse cx="29" cy="40" rx="7" ry="4" fill="#ff8888" opacity="0.4"/>
    <ellipse cx="71" cy="40" rx="7" ry="4" fill="#ff8888" opacity="0.4"/>
    {/* nose */}
    <ellipse cx="50" cy="41" rx="2" ry="1.2" fill="#e0a880" opacity="0.55"/>
    {/* wide smile */}
    <path d="M42 48 Q50 55 58 48" stroke="#cc3355" strokeWidth="2" fill="none" strokeLinecap="round"/>
    <path d="M42 48 Q50 56 58 48" fill="#ff8899" opacity="0.3"/>
  </svg>
);

/** Character 4 – Nora: dark bob hair, sailor navy dress */
const ChNora = ({ size = 120 }: { size?: number }) => (
  <svg viewBox="0 0 100 140" width={size} height={size * 1.4} xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="50" cy="137" rx="22" ry="4" fill="#00000025"/>
    {/* legs */}
    <rect x="36" y="108" width="11" height="24" rx="5" fill="#fde8d0"/>
    <rect x="53" y="108" width="11" height="24" rx="5" fill="#fde8d0"/>
    {/* white knee socks */}
    <rect x="35" y="118" width="13" height="12" rx="3" fill="white"/>
    <rect x="52" y="118" width="13" height="12" rx="3" fill="white"/>
    {/* shoes */}
    <ellipse cx="41" cy="132" rx="10" ry="5" fill="#1a1a2e"/>
    <ellipse cx="59" cy="132" rx="10" ry="5" fill="#1a1a2e"/>
    {/* dress body */}
    <path d="M26 70 Q24 112 38 116 L62 116 Q76 112 74 70Z" fill="#1a2a6c"/>
    {/* white collar sailor */}
    <path d="M26 70 L50 88 L74 70 L68 70 L50 82 L32 70Z" fill="white"/>
    {/* red sailor tie */}
    <path d="M50 82 L50 102 L47 82 Z" fill="#cc1122"/>
    <path d="M50 82 L50 102 L53 82 Z" fill="#cc1122"/>
    {/* dress sleeves */}
    <path d="M26 70 Q14 76 16 88" stroke="#1a2a6c" strokeWidth="12" fill="none" strokeLinecap="round"/>
    <path d="M74 70 Q86 76 84 88" stroke="#1a2a6c" strokeWidth="12" fill="none" strokeLinecap="round"/>
    {/* hands */}
    <circle cx="16" cy="90" r="6" fill="#fde8d0"/>
    <circle cx="84" cy="90" r="6" fill="#fde8d0"/>
    {/* white cuffs */}
    <rect x="10" y="84" width="12" height="5" rx="2.5" fill="white"/>
    <rect x="78" y="84" width="12" height="5" rx="2.5" fill="white"/>
    {/* neck */}
    <rect x="43" y="55" width="14" height="12" rx="3" fill="#fde8d0"/>
    {/* head */}
    <circle cx="50" cy="35" r="28" fill="#fde8d0"/>
    {/* dark hair back */}
    <ellipse cx="50" cy="23" rx="28" ry="20" fill="#2a1808"/>
    {/* bob hair sides */}
    <path d="M23 34 Q21 52 28 64" stroke="#1e1006" strokeWidth="12" fill="none" strokeLinecap="round"/>
    <path d="M77 34 Q79 52 72 64" stroke="#1e1006" strokeWidth="12" fill="none" strokeLinecap="round"/>
    {/* front hair */}
    <path d="M23 34 Q26 12 50 11 Q74 12 77 34 Q72 18 50 18 Q28 18 23 34Z" fill="#332010"/>
    {/* bangs - straight cut */}
    <path d="M23 34 Q36 42 50 38 Q64 42 77 34" fill="#2a1808"/>
    {/* eyes */}
    <ellipse cx="40" cy="36" rx="7" ry="8" fill="white"/>
    <ellipse cx="60" cy="36" rx="7" ry="8" fill="white"/>
    <ellipse cx="40" cy="38" rx="5" ry="6" fill="#553322"/>
    <ellipse cx="60" cy="38" rx="5" ry="6" fill="#553322"/>
    <circle cx="40.8" cy="39" r="3" fill="#1a0800"/>
    <circle cx="60.8" cy="39" r="3" fill="#1a0800"/>
    <circle cx="42.5" cy="36.5" r="1.5" fill="white"/>
    <circle cx="62.5" cy="36.5" r="1.5" fill="white"/>
    {/* lashes */}
    <path d="M33 29 Q36 26 39 29" stroke="#1a0800" strokeWidth="1.4" fill="none" strokeLinecap="round"/>
    <path d="M51 29 Q54 26 57 29" stroke="#1a0800" strokeWidth="1.4" fill="none" strokeLinecap="round"/>
    {/* brows */}
    <path d="M33 28 Q40 24 47 27" stroke="#2a1808" strokeWidth="2" fill="none" strokeLinecap="round"/>
    <path d="M53 27 Q60 24 67 28" stroke="#2a1808" strokeWidth="2" fill="none" strokeLinecap="round"/>
    {/* blush */}
    <ellipse cx="29" cy="42" rx="7" ry="4" fill="#ff8888" opacity="0.35"/>
    <ellipse cx="71" cy="42" rx="7" ry="4" fill="#ff8888" opacity="0.35"/>
    {/* nose */}
    <ellipse cx="50" cy="43" rx="2" ry="1.2" fill="#e0a880" opacity="0.55"/>
    {/* gentle smile */}
    <path d="M43 50 Q50 56 57 50" stroke="#cc3355" strokeWidth="2" fill="none" strokeLinecap="round"/>
    {/* white stripe on collar */}
    <path d="M32 70 L50 82" stroke="#4466aa" strokeWidth="1" fill="none"/>
    <path d="M68 70 L50 82" stroke="#4466aa" strokeWidth="1" fill="none"/>
  </svg>
);

/* ── Character data ──────────────────────────────────────────────────────── */
const CHARACTERS = [
  { id: 'mia',   name: 'Mia',  gender: 'female' as const, Component: ChMia,  desc: 'Cheerful sailor girl' },
  { id: 'leo',   name: 'Leo',  gender: 'male'   as const, Component: ChLeo,  desc: 'Cool island adventurer' },
  { id: 'ava',   name: 'Ava',  gender: 'female' as const, Component: ChAva,  desc: 'Bright & fashionable' },
  { id: 'nora',  name: 'Nora', gender: 'female' as const, Component: ChNora, desc: 'Elegant sailor' },
];

interface Props {
  onPlay: (profile: PlayerProfile) => void;
}

export const WelcomeScreen: React.FC<Props> = ({ onPlay }) => {
  const [name, setName]         = useState('Player');
  const [charId, setCharId]     = useState('mia');
  const [nameError, setNameError] = useState('');

  const selected = CHARACTERS.find(c => c.id === charId) ?? CHARACTERS[0];

  const handlePlay = () => {
    const trimmed = name.trim();
    if (!trimmed)          { setNameError('Please enter a name!'); return; }
    if (trimmed.length > 20) { setNameError('Max 20 characters'); return; }
    onPlay({
      name: trimmed,
      gender: selected.gender,
      skinTone: 0,
      hairColor: '#8b4513',
      characterId: charId,
      hasSetup: true,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/30" />

      <div
        className="relative rounded-2xl overflow-hidden shadow-2xl"
        style={{ fontFamily: "'Fredoka', sans-serif", width: 540 }}
      >
        {/* Wooden header */}
        <div
          className="relative flex items-center justify-center py-3 px-8"
          style={{
            background: 'linear-gradient(180deg, #a0652a 0%, #7a4a1e 40%, #5c3311 100%)',
            borderBottom: '4px solid #3d2008',
            boxShadow: 'inset 0 2px 6px rgba(255,200,100,0.3)',
          }}
        >
          <div className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-10 rounded-full"
            style={{ background: 'radial-gradient(circle at 35% 35%, #c8851e, #7a4a1e)' }}/>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-10 rounded-full"
            style={{ background: 'radial-gradient(circle at 35% 35%, #c8851e, #7a4a1e)' }}/>
          <span
            className="text-3xl font-black tracking-widest text-white uppercase"
            style={{ textShadow: '2px 2px 0 #3d2008, 0 0 12px rgba(255,200,80,0.6)', letterSpacing: '0.12em' }}
          >
            WELcOME!
          </span>
        </div>

        {/* Parchment body */}
        <div
          className="flex flex-col items-center gap-4 px-8 pb-7 pt-5"
          style={{ background: 'linear-gradient(180deg, #f5e6c0 0%, #eedba0 100%)', border: '6px solid #8b5a2b', borderTop: 'none' }}
        >
          {/* Name */}
          <div className="w-full">
            <p className="text-center text-[#5c3a21] font-bold text-sm mb-1">Name Your Character</p>
            <input
              className="w-full text-center rounded-lg px-4 py-2 text-lg font-bold outline-none border-2 focus:border-[#8b5a2b]"
              style={{ background: '#fdf6e3', borderColor: '#c8a56a', color: '#3d2008', fontFamily: "'Fredoka', sans-serif" }}
              value={name}
              maxLength={20}
              onChange={e => { setName(e.target.value); setNameError(''); }}
              onKeyDown={e => e.key === 'Enter' && handlePlay()}
            />
            {nameError && <p className="text-red-600 text-xs font-bold text-center mt-1">{nameError}</p>}
          </div>

          {/* Character selection label */}
          <p className="text-[#5c3a21] font-bold text-sm">Choose Your Character</p>

          {/* 4 character cards */}
          <div className="grid grid-cols-4 gap-3 w-full">
            {CHARACTERS.map(ch => {
              const isSelected = ch.id === charId;
              return (
                <button
                  key={ch.id}
                  onClick={() => setCharId(ch.id)}
                  className="flex flex-col items-center rounded-xl overflow-hidden transition-all active:scale-95"
                  style={{
                    background: isSelected ? 'linear-gradient(180deg, #fff8d0 0%, #ffeea0 100%)' : '#fdf6e3',
                    border: isSelected ? '3px solid #d4a020' : '3px solid #c8a56a',
                    boxShadow: isSelected ? '0 0 0 3px #f5c842, 0 4px 12px rgba(212,160,32,0.5)' : '0 2px 4px rgba(0,0,0,0.1)',
                  }}
                >
                  {/* Character preview area */}
                  <div
                    className="w-full flex items-end justify-center overflow-hidden relative"
                    style={{
                      height: 128,
                      background: isSelected
                        ? 'linear-gradient(180deg, #ffe0f0 0%, #ffd0e8 60%, #d8f0c8 100%)'
                        : 'linear-gradient(180deg, #e8f4ff 0%, #d8ecff 60%, #d0ecc0 100%)',
                    }}
                  >
                    {/* Sky dots / stars when selected */}
                    {isSelected && (
                      <>
                        <span className="absolute top-2 left-2 text-base">✨</span>
                        <span className="absolute top-3 right-3 text-sm">⭐</span>
                      </>
                    )}
                    {/* Ground strip */}
                    <div className="absolute bottom-0 left-0 right-0 h-6" style={{ background: 'linear-gradient(180deg, #b8e870, #90cc50)' }}/>
                    {/* Character */}
                    <div className="relative z-10" style={{ marginBottom: 4 }}>
                      <ch.Component size={88} />
                    </div>
                  </div>
                  {/* Name + desc */}
                  <div className="py-2 px-1 text-center">
                    <div className="font-black text-sm" style={{ color: isSelected ? '#8b5a00' : '#5c3a21' }}>
                      {ch.name}
                    </div>
                    <div className="text-[9px] font-bold text-[#8b6a40] leading-tight mt-0.5">{ch.desc}</div>
                  </div>
                  {/* Selected check */}
                  {isSelected && (
                    <div
                      className="w-full py-1 text-center text-xs font-black"
                      style={{ background: '#d4a020', color: 'white' }}
                    >
                      ✓ SELECTED
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* PLAY button */}
          <button
            onClick={handlePlay}
            className="w-full py-4 rounded-2xl font-black text-2xl uppercase tracking-wider text-white border-b-4 active:scale-95 transition-transform mt-1"
            style={{
              background: 'linear-gradient(180deg, #4ade80, #16a34a)',
              borderColor: '#14532d',
              boxShadow: '0 4px 20px rgba(22,163,74,0.5)',
              textShadow: '0 2px 4px rgba(0,0,0,0.3)',
            }}
          >
            PLAY
          </button>
        </div>
      </div>
    </div>
  );
};

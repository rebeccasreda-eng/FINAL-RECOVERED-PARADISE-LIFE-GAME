import React, { useState, useCallback } from 'react';
import { ChMia, ChLeo, ChAva, ChKai, ChNora } from './CharacterSprites';

export interface PlayerProfile {
  name: string;
  gender: 'female' | 'male';
  skinTone: number;
  hairColor: string;
  characterId: string;
  hasSetup: boolean;
}

/* ── Character roster by gender ──────────────────────────────────────────── */
const FEMALE_CHARS = [
  { id: 'mia',  name: 'Mia',  Component: ChMia  },
  { id: 'ava',  name: 'Ava',  Component: ChAva  },
  { id: 'nora', name: 'Nora', Component: ChNora },
];
const MALE_CHARS = [
  { id: 'leo', name: 'Leo', Component: ChLeo },
  { id: 'kai', name: 'Kai', Component: ChKai },
];
const ALL_CHARS = [...FEMALE_CHARS, ...MALE_CHARS];

/* ── Beach stage background SVG ─────────────────────────────────────────── */
const StageBg = () => (
  <svg viewBox="0 0 380 240" xmlns="http://www.w3.org/2000/svg"
    style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
    <defs>
      <linearGradient id="skyG" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#5bc8f0"/>
        <stop offset="100%" stopColor="#9de4f8"/>
      </linearGradient>
      <linearGradient id="seaG" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#2a8fcf"/>
        <stop offset="100%" stopColor="#1a6eae"/>
      </linearGradient>
      <linearGradient id="sandG" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#e8d4a0"/>
        <stop offset="100%" stopColor="#ccb878"/>
      </linearGradient>
    </defs>
    <rect x="0" y="0" width="380" height="240" fill="url(#skyG)"/>
    <ellipse cx="310" cy="155" rx="55" ry="18" fill="#4a9a5a" opacity="0.5"/>
    <ellipse cx="295" cy="150" rx="35" ry="14" fill="#3a8a4a" opacity="0.6"/>
    <rect x="0" y="140" width="380" height="55" fill="url(#seaG)"/>
    <path d="M0 145 Q30 138 60 145 Q90 152 120 145 Q150 138 180 145 Q210 152 240 145 Q270 138 300 145 Q330 152 380 145 L380 195 L0 195Z" fill="#1a7fc0" opacity="0.55"/>
    <path d="M0 155 Q40 149 80 155 Q120 161 160 155 Q200 149 240 155 Q280 161 320 155 Q360 149 380 155" stroke="white" strokeWidth="1.5" fill="none" opacity="0.35"/>
    <rect x="0" y="190" width="380" height="50" fill="url(#sandG)"/>
    <ellipse cx="120" cy="208" rx="80" ry="8" fill="#c8a868" opacity="0.3"/>
    <ellipse cx="75" cy="55" rx="42" ry="20" fill="white" opacity="0.92"/>
    <ellipse cx="108" cy="47" rx="32" ry="18" fill="white" opacity="0.92"/>
    <ellipse cx="48" cy="60" rx="26" ry="14" fill="white" opacity="0.9"/>
    <ellipse cx="250" cy="38" rx="32" ry="16" fill="white" opacity="0.85"/>
    <ellipse cx="278" cy="30" rx="24" ry="13" fill="white" opacity="0.85"/>
    <path d="M328 75 Q322 130 318 200" stroke="#7a5a3a" strokeWidth="11" fill="none" strokeLinecap="round"/>
    <path d="M325 82 Q295 52 258 62 Q285 72 322 88" fill="#4a9a4a"/>
    <path d="M325 78 Q318 45 338 32 Q336 58 330 78" fill="#3a8a3a"/>
    <path d="M325 82 Q352 55 375 68 Q355 75 328 90" fill="#4a9a4a"/>
    <path d="M325 82 Q358 78 372 96 Q350 88 330 92" fill="#5aaa5a"/>
    <path d="M325 78 Q305 52 320 35 Q322 58 326 78" fill="#3a8a3a"/>
    <circle cx="320" cy="92" r="7" fill="#7a5a20"/>
    <circle cx="332" cy="88" r="6" fill="#8a6a28"/>
    <circle cx="18" cy="218" r="9" fill="#dd2222" opacity="0.95"/>
    <circle cx="11" cy="217" r="6.5" fill="#ffaa00" opacity="0.9"/>
    <circle cx="30" cy="213" r="8" fill="#ffdd00" opacity="0.9"/>
    <circle cx="46" cy="219" r="8.5" fill="#ee3333" opacity="0.9"/>
    <circle cx="58" cy="215" r="7" fill="#ff8822" opacity="0.85"/>
    <path d="M18 224 L18 240" stroke="#229922" strokeWidth="2.5"/>
    <path d="M30 218 L28 238" stroke="#229922" strokeWidth="2.5"/>
    <path d="M46 225 L44 240" stroke="#229922" strokeWidth="2.5"/>
    <path d="M58 221 L56 238" stroke="#229922" strokeWidth="2.5"/>
    <path d="M18 228 Q10 222 13 216" stroke="#22bb22" strokeWidth="3" fill="none" strokeLinecap="round"/>
    <path d="M30 223 Q22 218 24 212" stroke="#22bb22" strokeWidth="3" fill="none" strokeLinecap="round"/>
    <circle cx="358" cy="220" r="8" fill="#ff4488" opacity="0.9"/>
    <circle cx="370" cy="217" r="6.5" fill="#ffcc00" opacity="0.9"/>
    <path d="M358 226 L356 240" stroke="#229922" strokeWidth="2.5"/>
    <path d="M370 223 L368 238" stroke="#229922" strokeWidth="2.5"/>
    <ellipse cx="140" cy="175" rx="8" ry="3" fill="#5588cc" opacity="0.75"/>
    <ellipse cx="132" cy="173" rx="11" ry="5" fill="#88aaee" opacity="0.6" transform="rotate(-25 132 173)"/>
    <ellipse cx="148" cy="173" rx="11" ry="5" fill="#88aaee" opacity="0.6" transform="rotate(25 148 173)"/>
    <circle cx="140" cy="175" r="2.5" fill="#223366"/>
  </svg>
);

/* ── Customize swatches ──────────────────────────────────────────────────── */
const HAIR_OPTS   = ['#7a4a2a','#2b2020','#c98a3a','#883a88','#dd4830'];
const OUTFIT_OPTS = ['#3d5a8a','#dd4830','#3a8a5a','#8a3a7a','#e0a030'];

interface CustomizeState { hair: string; outfit: string; }

interface Props {
  onPlay: (profile: PlayerProfile) => void;
}

export const WelcomeScreen: React.FC<Props> = ({ onPlay }) => {
  const [name, setName]           = useState('Player');
  const [gender, setGender]       = useState<'female'|'male'|null>(null);
  const [charId, setCharId]       = useState('mia');
  const [nameError, setNameError] = useState('');
  const [genderError, setGenderError] = useState('');
  const [showCustomize, setShowCustomize] = useState(false);
  const [customize, setCustomize] = useState<CustomizeState>({ hair: '#7a4a2a', outfit: '#3d5a8a' });
  const [toast, setToast]         = useState('');

  const genderChars = gender === 'female' ? FEMALE_CHARS : gender === 'male' ? MALE_CHARS : FEMALE_CHARS;
  const displayChar = ALL_CHARS.find(c => c.id === charId) ?? FEMALE_CHARS[0];
  const CharComp    = displayChar.Component;

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 1600);
  };

  const handleGender = (g: 'female'|'male') => {
    setGender(g);
    setGenderError('');
    const chars = g === 'female' ? FEMALE_CHARS : MALE_CHARS;
    const currentIsFemale = FEMALE_CHARS.some(c => c.id === charId);
    const currentGender = currentIsFemale ? 'female' : 'male';
    if (currentGender !== g) setCharId(chars[0].id);
  };

  const handleRandom = useCallback(() => {
    const randomGender: 'female'|'male' = Math.random() < 0.5 ? 'female' : 'male';
    const pool = randomGender === 'female' ? FEMALE_CHARS : MALE_CHARS;
    const pick  = pool[Math.floor(Math.random() * pool.length)];
    const hair  = HAIR_OPTS[Math.floor(Math.random()  * HAIR_OPTS.length)];
    const outfit= OUTFIT_OPTS[Math.floor(Math.random()* OUTFIT_OPTS.length)];
    setGender(randomGender);
    setCharId(pick.id);
    setCustomize({ hair, outfit });
    setGenderError('');
    showToast('New look generated!');
  }, []);

  const handlePlay = () => {
    const trimmed = name.trim();
    let ok = true;
    if (!trimmed || trimmed.length < 2) { setNameError('Enter at least 2 characters'); ok = false; }
    if (!gender) { setGenderError('Choose a gender to continue'); ok = false; }
    if (!ok) return;
    onPlay({
      name: trimmed,
      gender: gender!,
      skinTone: 0,
      hairColor: customize.hair,
      characterId: charId,
      hasSetup: true,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" />

      {/* Outer wood frame */}
      <div
        className="relative rounded-[20px] shadow-2xl"
        style={{
          fontFamily: "'Fredoka', sans-serif",
          width: 420,
          background: 'repeating-linear-gradient(90deg,rgba(0,0,0,0.04) 0 2px,transparent 2px 26px), linear-gradient(180deg,#d8c193,#c9ac76)',
          border: '9px solid #7a4620',
          boxShadow: '0 0 0 3px #52290f inset, 0 0 0 13px #8a5426 inset, 0 12px 40px rgba(0,0,0,0.6)',
          padding: '18px 16px 16px',
        }}
      >
        {/* Corner nails */}
        <div className="absolute top-[6px] left-[6px] w-5 h-[9px] rounded bg-[#e8dcc0] border border-[#7a4620]"/>
        <div className="absolute top-[6px] right-[6px] w-5 h-[9px] rounded bg-[#e8dcc0] border border-[#7a4620]"/>

        {/* WELCOME! banner */}
        <div
          className="text-center rounded-3xl px-4 py-[5px] mb-4"
          style={{ background: '#c2521f', border: '4px solid #7a4620', boxShadow: '0 3px 0 rgba(0,0,0,0.2) inset' }}
        >
          <h1
            className="text-[28px] m-0 leading-none"
            style={{
              fontFamily: "'Luckiest Guy','Fredoka',cursive",
              color: '#fff2d6',
              WebkitTextStroke: '2px #6b3f1a',
              paintOrder: 'stroke fill',
              letterSpacing: '2px',
            }}
          >
            WELCOME!
          </h1>
        </div>

        {/* Name section */}
        <div
          className="rounded-xl px-3 py-2 mb-3 text-center"
          style={{ background: '#e8dcb8', border: '3px solid #a9884f' }}
        >
          <p className="text-xs font-extrabold uppercase tracking-widest mb-1" style={{ color: '#6f4e2a' }}>
            Name Your Character
          </p>
          <input
            className="w-full text-center rounded-md px-3 py-[6px] text-[17px] font-extrabold outline-none border-2 transition-shadow"
            style={{
              background: '#fbf6e8',
              borderColor: nameError ? '#c0392b' : '#c9a86a',
              color: '#4a3520',
              fontFamily: "'Fredoka',sans-serif",
            }}
            maxLength={12}
            value={name}
            onChange={e => { setName(e.target.value); setNameError(''); }}
            onKeyDown={e => e.key === 'Enter' && handlePlay()}
            onFocus={e => (e.target as HTMLInputElement).select()}
          />
          {nameError && <p className="text-[11px] font-extrabold mt-1" style={{ color: '#a02f2f' }}>{nameError}</p>}
        </div>

        {/* Character stage */}
        <div
          className="relative mb-3 overflow-hidden"
          style={{ height: 260, borderRadius: 12, border: '4px solid #8a5a2b' }}
        >
          <StageBg />
          <div
            className="idle-bob absolute bottom-[22px] left-1/2 -translate-x-1/2 z-10"
            style={{ filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.35))' }}
          >
            <CharComp size={150} />
          </div>

          {/* Customize overlay */}
          {showCustomize && (
            <div
              className="absolute inset-0 flex items-center justify-center z-20"
              style={{ background: 'rgba(30,24,12,0.58)', borderRadius: 8 }}
            >
              <div className="w-[88%] rounded-[14px] p-3" style={{ background: '#f4e6c1', border: '4px solid #8a5a2b' }}>
                <h2 className="text-sm font-extrabold uppercase tracking-wide text-center mb-3" style={{ color: '#6f4e2a' }}>
                  Customize
                </h2>
                <div className="mb-3">
                  <p className="text-[11px] font-extrabold uppercase tracking-wide mb-1" style={{ color: '#7a5a30' }}>Character</p>
                  <div className="flex gap-2 justify-center">
                    {genderChars.map(c => (
                      <button
                        key={c.id}
                        onClick={() => setCharId(c.id)}
                        className="rounded-xl overflow-hidden transition-all"
                        style={{
                          border: charId === c.id ? '3px solid #e39a3c' : '3px solid #c9a86a',
                          boxShadow: charId === c.id ? '0 0 0 2px #e39a3c' : 'none',
                          background: charId === c.id ? '#fff8d0' : '#fbf6e8',
                          padding: '4px 6px',
                        }}
                      >
                        <c.Component size={48} />
                        <p className="text-[9px] font-extrabold text-center mt-0.5" style={{ color: '#6f4e2a' }}>{c.name}</p>
                      </button>
                    ))}
                  </div>
                </div>
                <div className="mb-2">
                  <p className="text-[11px] font-extrabold uppercase tracking-wide mb-1" style={{ color: '#7a5a30' }}>Hair color</p>
                  <div className="flex gap-2">
                    {HAIR_OPTS.map(c => (
                      <button key={c} onClick={() => setCustomize(s => ({ ...s, hair: c }))}
                        className="rounded-full transition-all"
                        style={{ width: 26, height: 26, background: c,
                          border: customize.hair === c ? '3px solid #4a3520' : '2px solid rgba(0,0,0,0.15)',
                          boxShadow: customize.hair === c ? '0 0 0 2px white inset' : 'none' }} />
                    ))}
                  </div>
                </div>
                <div className="mb-3">
                  <p className="text-[11px] font-extrabold uppercase tracking-wide mb-1" style={{ color: '#7a5a30' }}>Outfit color</p>
                  <div className="flex gap-2">
                    {OUTFIT_OPTS.map(c => (
                      <button key={c} onClick={() => setCustomize(s => ({ ...s, outfit: c }))}
                        className="rounded-full transition-all"
                        style={{ width: 26, height: 26, background: c,
                          border: customize.outfit === c ? '3px solid #4a3520' : '2px solid rgba(0,0,0,0.15)',
                          boxShadow: customize.outfit === c ? '0 0 0 2px white inset' : 'none' }} />
                    ))}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setShowCustomize(false)}
                    className="flex-1 rounded-2xl py-2 text-sm font-extrabold transition-all active:scale-95"
                    style={{ background: 'linear-gradient(180deg,#fbf6e8,#ecdcae)', border: '3px solid #a9884f', color: '#6f4e2a' }}>
                    Cancel
                  </button>
                  <button onClick={() => { setShowCustomize(false); showToast('Look saved!'); }}
                    className="flex-1 rounded-2xl py-2 text-sm font-extrabold transition-all active:scale-95"
                    style={{ background: '#8fd15a', border: '3px solid #3c7d2e', color: '#234a12' }}>
                    Save
                  </button>
                </div>
              </div>
            </div>
          )}

          {toast && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-4 py-2 rounded-2xl text-xs font-extrabold text-white z-30 pointer-events-none"
              style={{ background: '#234a12', whiteSpace: 'nowrap' }}>
              {toast}
            </div>
          )}
        </div>

        {/* Choose Your Gender */}
        <div className="text-center mb-3">
          <p className="text-xs font-extrabold uppercase tracking-widest mb-2" style={{ color: '#6f4e2a' }}>
            Choose Your Gender
          </p>
          <div className="flex justify-center gap-5">
            <button
              onClick={() => handleGender('female')}
              className="flex items-center justify-center rounded-full transition-all active:scale-95"
              style={{
                width: 52, height: 52,
                background: '#f7c6da',
                border: `3px solid ${gender === 'female' ? '#c23d73' : '#d4548a'}`,
                boxShadow: gender === 'female' ? '0 0 0 3px #fff, 0 0 0 6px #e39a3c' : 'none',
                transform: gender === 'female' ? 'scale(1.08)' : 'scale(1)',
              }}
              aria-label="Select female"
            >
              <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="#c23d73" strokeWidth="2.2">
                <circle cx="12" cy="8" r="5"/><path d="M12 13v8M9 18h6"/>
              </svg>
            </button>
            <button
              onClick={() => handleGender('male')}
              className="flex items-center justify-center rounded-full transition-all active:scale-95"
              style={{
                width: 52, height: 52,
                background: '#bcdcf5',
                border: `3px solid ${gender === 'male' ? '#2f6da0' : '#3f7fbf'}`,
                boxShadow: gender === 'male' ? '0 0 0 3px #fff, 0 0 0 6px #e39a3c' : 'none',
                transform: gender === 'male' ? 'scale(1.08)' : 'scale(1)',
              }}
              aria-label="Select male"
            >
              <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="#2f6da0" strokeWidth="2.2">
                <circle cx="10" cy="14" r="5"/><path d="M14 10l6-6M14 4h6v6"/>
              </svg>
            </button>
          </div>
          {genderError && <p className="text-[11px] font-extrabold mt-2" style={{ color: '#a02f2f' }}>{genderError}</p>}
        </div>

        {/* Random / Customize row */}
        <div className="flex gap-3 mb-3">
          <button onClick={handleRandom}
            className="flex-1 rounded-2xl py-[9px] text-sm font-extrabold uppercase tracking-wide transition-all active:scale-95"
            style={{ background: 'linear-gradient(180deg,#fbf6e8,#ecdcae)', border: '3px solid #a9884f', color: '#6f4e2a' }}>
            Random
          </button>
          <button onClick={() => setShowCustomize(true)}
            className="flex-1 rounded-2xl py-[9px] text-sm font-extrabold uppercase tracking-wide transition-all active:scale-95"
            style={{ background: 'linear-gradient(180deg,#fbf6e8,#ecdcae)', border: '3px solid #a9884f', color: '#6f4e2a' }}>
            Customize
          </button>
        </div>

        {/* PLAY */}
        <button
          onClick={handlePlay}
          className="w-full rounded-3xl font-extrabold uppercase tracking-widest text-[22px] py-[11px] transition-all active:scale-[0.98]"
          style={{
            fontFamily: "'Luckiest Guy','Fredoka',cursive",
            background: 'linear-gradient(180deg,#9fdd5f,#63b23a)',
            border: '3px solid #2f6d1f',
            color: '#fff2d6',
            WebkitTextStroke: '1.5px #2f6d1f',
            paintOrder: 'stroke fill',
            boxShadow: '0 4px 0 #1e4a10, 0 6px 16px rgba(99,178,58,0.45)',
            letterSpacing: '3px',
          }}
        >
          PLAY
        </button>
      </div>
    </div>
  );
};

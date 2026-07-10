import React, { useState, useCallback } from 'react';
import { CharAppearance, CustomizableCharSVG, DEFAULT_FEMALE, DEFAULT_MALE } from './CustomizableCharSVG';
import { DressingRoom } from './DressingRoom';

export interface PlayerProfile {
  name: string;
  gender: 'female' | 'male';
  appearance: CharAppearance;
  characterId: string;
  hasSetup: boolean;
}

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

/* ── Map gender + appearance to a chibi characterId for the island ─── */
function pickCharacterId(gender: 'female' | 'male', hairStyle: string): string {
  if (gender === 'male') {
    return hairStyle === 'pompadour' || hairStyle === 'spikey' ? 'kai' : 'leo';
  }
  if (hairStyle === 'braids' || hairStyle === 'wavy' || hairStyle === 'bob') return 'ava';
  if (hairStyle === 'fro' || hairStyle === 'curly') return 'nora';
  return 'mia';
}

interface Props {
  onPlay: (profile: PlayerProfile) => void;
}

export const WelcomeScreen: React.FC<Props> = ({ onPlay }) => {
  const [name, setName]               = useState('Player');
  const [nameError, setNameError]     = useState('');
  const [genderError, setGenderError] = useState('');
  const [appearance, setAppearance]   = useState<CharAppearance>(DEFAULT_FEMALE);
  const [gender, setGender]           = useState<'female'|'male'|null>(null);
  const [showDressingRoom, setShowDressingRoom] = useState(false);
  const [toast, setToast]             = useState('');

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 1600);
  };

  const handleGender = (g: 'female'|'male') => {
    setGender(g);
    setGenderError('');
    setAppearance(g === 'female' ? DEFAULT_FEMALE : DEFAULT_MALE);
  };

  const handleRandom = useCallback(() => {
    const randomGender: 'female'|'male' = Math.random() < 0.5 ? 'female' : 'male';
    const def = randomGender === 'female' ? DEFAULT_FEMALE : DEFAULT_MALE;
    const hairOpts = randomGender === 'female'
      ? ['long_wavy','curly','ponytail','bob','braids','pigtails']
      : ['shaggy','messy','fro','pompadour','spikey','wavy'];
    const hairColors = ['#7a4520','#dd4488','#2b2020','#c98a3a','#1a1010','#cc4422','#e8c040','#5a3020','#ff4488','#884499'];
    const outfitColors = ['#4466cc','#dd4499','#222233','#f07020','#3a9a6a','#8a5aaa','#cc3322'];
    const hatOpts = ['none','none','none','cap','cowboy','crown','party','santa'];
    setGender(randomGender);
    setGenderError('');
    setAppearance({
      ...def,
      hairStyle: hairOpts[Math.floor(Math.random() * hairOpts.length)],
      hairColor: hairColors[Math.floor(Math.random() * hairColors.length)],
      outfitColor: outfitColors[Math.floor(Math.random() * outfitColors.length)],
      hatStyle: hatOpts[Math.floor(Math.random() * hatOpts.length)],
    });
    showToast('New look generated!');
  }, []);

  const handlePlay = () => {
    const trimmed = name.trim();
    let ok = true;
    if (!trimmed || trimmed.length < 2) { setNameError('Enter at least 2 characters'); ok = false; }
    if (!gender) { setGenderError('Choose a character to continue'); ok = false; }
    if (!ok) return;
    const g = gender!;
    onPlay({
      name: trimmed,
      gender: g,
      appearance,
      characterId: pickCharacterId(g, appearance.hairStyle),
      hasSetup: true,
    });
  };

  const handleDressingRoomSave = useCallback((
    newAppearance: CharAppearance,
    newName: string,
    newGender: 'female' | 'male',
  ) => {
    setAppearance(newAppearance);
    setName(newName);
    setGender(newGender);
    setGenderError('');
    setShowDressingRoom(false);
    showToast('Look saved!');
  }, []);

  const currentGender = gender ?? 'female';

  return (
    <>
      {showDressingRoom && (
        <DressingRoom
          initialAppearance={appearance}
          gender={currentGender}
          name={name}
          onSave={handleDressingRoomSave}
          onCancel={() => setShowDressingRoom(false)}
        />
      )}

      <div className="fixed inset-0 z-40 flex items-center justify-center">
        <div className="absolute inset-0 bg-black/40"/>

        {/* Outer wood frame */}
        <div
          style={{
            position: 'relative',
            width: 420,
            fontFamily: "'Fredoka', sans-serif",
            background: 'repeating-linear-gradient(90deg,rgba(0,0,0,0.04) 0 2px,transparent 2px 26px), linear-gradient(180deg,#d8c193,#c9ac76)',
            border: '9px solid #7a4620',
            boxShadow: '0 0 0 3px #52290f inset, 0 0 0 13px #8a5426 inset, 0 12px 40px rgba(0,0,0,0.6)',
            borderRadius: 20,
            padding: '18px 16px 16px',
          }}
        >
          {/* Corner nails */}
          <div className="absolute top-[6px] left-[6px] w-5 h-[9px] rounded bg-[#e8dcc0] border border-[#7a4620]"/>
          <div className="absolute top-[6px] right-[6px] w-5 h-[9px] rounded bg-[#e8dcc0] border border-[#7a4620]"/>

          {/* WELCOME! banner */}
          <div
            style={{ background: '#c2521f', border: '4px solid #7a4620', borderRadius: 24, boxShadow: '0 3px 0 rgba(0,0,0,0.2) inset', padding: '5px 16px', marginBottom: 14, textAlign: 'center' }}
          >
            <h1 style={{
              fontFamily: "'Luckiest Guy','Fredoka',cursive",
              fontSize: 28, margin: 0, lineHeight: 1,
              color: '#fff2d6',
              WebkitTextStroke: '2px #6b3f1a',
              paintOrder: 'stroke fill',
              letterSpacing: 2,
            }}>WELCOME!</h1>
          </div>

          {/* Name section */}
          <div style={{ background: '#e8dcb8', border: '3px solid #a9884f', borderRadius: 12, padding: '8px 12px', marginBottom: 12, textAlign: 'center' }}>
            <p style={{ fontSize: 11, fontWeight: 900, textTransform: 'uppercase', letterSpacing: 4, color: '#6f4e2a', margin: '0 0 4px' }}>
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
            {nameError && <p style={{ fontSize: 11, fontWeight: 900, marginTop: 3, color: '#a02f2f' }}>{nameError}</p>}
          </div>

          {/* Character stage — click to choose gender, no labels */}
          <div style={{ position: 'relative', height: 260, marginBottom: 12, borderRadius: 12, border: '4px solid #8a5a2b', overflow: 'hidden' }}>
            <StageBg/>

            {(['female', 'male'] as const).map((g, i) => {
              const isSelected = gender === g;
              const charAppearance = gender === g ? appearance : (g === 'female' ? DEFAULT_FEMALE : DEFAULT_MALE);
              return (
                <div
                  key={g}
                  onClick={() => handleGender(g)}
                  style={{
                    position: 'absolute',
                    bottom: 18,
                    left: i === 0 ? '25%' : '75%',
                    transform: 'translateX(-50%)',
                    zIndex: 10,
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                  }}
                >
                  {/* Selection arrow — only visible when chosen */}
                  <div style={{ height: 26, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', marginBottom: 2 }}>
                    {isSelected && (
                      <svg width="26" height="22" viewBox="0 0 26 22" style={{ display: 'block' }}>
                        <polygon points="13,22 0,0 26,0" fill="#33dd22" stroke="#1a8810" strokeWidth="1.5" strokeLinejoin="round"/>
                        <polygon points="13,18 3,3 23,3" fill="#55ff44" opacity="0.5"/>
                      </svg>
                    )}
                  </div>

                  <div
                    className={isSelected ? 'idle-bob' : undefined}
                    style={{
                      filter: isSelected
                        ? 'drop-shadow(0 4px 10px rgba(0,0,0,0.4))'
                        : 'drop-shadow(0 2px 4px rgba(0,0,0,0.25)) brightness(0.82)',
                      transform: isSelected ? 'scale(1.08)' : 'scale(1)',
                      transition: 'transform 0.15s, filter 0.15s',
                    }}
                  >
                    <CustomizableCharSVG appearance={charAppearance} gender={g} size={118}/>
                  </div>
                </div>
              );
            })}

            {toast && (
              <div style={{
                position: 'absolute', bottom: 12, left: '50%', transform: 'translateX(-50%)',
                background: '#234a12', color: 'white', padding: '6px 14px',
                borderRadius: 20, fontSize: 12, fontWeight: 900, zIndex: 30,
                pointerEvents: 'none', whiteSpace: 'nowrap',
              }}>
                {toast}
              </div>
            )}
            {genderError && (
              <div style={{
                position: 'absolute', top: 8, left: '50%', transform: 'translateX(-50%)',
                background: '#a02f2f', color: 'white', padding: '4px 12px',
                borderRadius: 12, fontSize: 11, fontWeight: 900, zIndex: 30,
                whiteSpace: 'nowrap',
              }}>
                {genderError}
              </div>
            )}
          </div>

          {/* Random / Customize row */}
          <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
            <button
              onClick={handleRandom}
              style={{
                flex: 1, fontFamily: "'Fredoka',sans-serif",
                fontWeight: 900, fontSize: 14, textTransform: 'uppercase', letterSpacing: 1,
                padding: '9px', borderRadius: 16,
                border: '3px solid #a9884f',
                background: 'linear-gradient(180deg,#fbf6e8,#ecdcae)',
                color: '#6f4e2a', cursor: 'pointer',
              }}
            >
              Random
            </button>
            <button
              onClick={() => setShowDressingRoom(true)}
              style={{
                flex: 1, fontFamily: "'Fredoka',sans-serif",
                fontWeight: 900, fontSize: 14, textTransform: 'uppercase', letterSpacing: 1,
                padding: '9px', borderRadius: 16,
                border: '3px solid #a9884f',
                background: 'linear-gradient(180deg,#fbf6e8,#ecdcae)',
                color: '#6f4e2a', cursor: 'pointer',
              }}
            >
              Customize
            </button>
          </div>

          {/* PLAY */}
          <button
            onClick={handlePlay}
            style={{
              width: '100%',
              fontFamily: "'Luckiest Guy','Fredoka',cursive",
              fontSize: 22,
              fontWeight: 900,
              textTransform: 'uppercase',
              letterSpacing: 3,
              padding: '11px',
              borderRadius: 24,
              border: '3px solid #2f6d1f',
              background: 'linear-gradient(180deg,#9fdd5f,#63b23a)',
              color: '#fff2d6',
              WebkitTextStroke: '1.5px #2f6d1f',
              paintOrder: 'stroke fill',
              boxShadow: '0 4px 0 #1e4a10, 0 6px 16px rgba(99,178,58,0.45)',
              cursor: 'pointer',
            }}
          >
            PLAY
          </button>
        </div>
      </div>
    </>
  );
};

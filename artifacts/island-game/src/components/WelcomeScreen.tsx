import React, { useState, useCallback } from 'react';

export interface PlayerProfile {
  name: string;
  gender: 'female' | 'male';
  skinTone: number;   // 0-4 index
  hairColor: string;
  hasSetup: boolean;
}

const SKIN_TONES = ['🏻', '🏼', '🏽', '🏾', '🏿'];
const HAIR_COLORS = ['#f5c842', '#8B4513', '#1a1a1a', '#c0392b', '#e88b4e'];
const HAIR_NAMES   = ['Blonde', 'Brunette', 'Black', 'Red', 'Auburn'];

const FEMALE_AVATARS = ['👩‍🌾', '👩🏻‍🌾', '👩🏼‍🌾', '👩🏽‍🌾', '👩🏾‍🌾', '👩🏿‍🌾'];
const MALE_AVATARS   = ['👨‍🌾', '👨🏻‍🌾', '👨🏼‍🌾', '👨🏽‍🌾', '👨🏾‍🌾', '👨🏿‍🌾'];

function randomProfile(): Omit<PlayerProfile, 'name' | 'hasSetup'> {
  const gender = Math.random() < 0.5 ? 'female' : 'male';
  const skinTone = Math.floor(Math.random() * SKIN_TONES.length);
  const hairColor = HAIR_COLORS[Math.floor(Math.random() * HAIR_COLORS.length)];
  return { gender, skinTone, hairColor };
}

function getAvatar(gender: 'female' | 'male', skinTone: number) {
  // index 0 = default (no modifier), 1-5 = skin tones 🏻-🏿
  return gender === 'female' ? FEMALE_AVATARS[skinTone + 1] ?? FEMALE_AVATARS[0] : MALE_AVATARS[skinTone + 1] ?? MALE_AVATARS[0];
}

interface Props {
  onPlay: (profile: PlayerProfile) => void;
}

export const WelcomeScreen: React.FC<Props> = ({ onPlay }) => {
  const [name, setName]           = useState('Player');
  const [gender, setGender]       = useState<'female' | 'male'>('female');
  const [skinTone, setSkinTone]   = useState(0);
  const [hairColor, setHairColor] = useState(HAIR_COLORS[0]);
  const [showCustom, setShowCustom] = useState(false);
  const [nameError, setNameError] = useState('');

  const avatar = getAvatar(gender, skinTone);

  const handleRandom = useCallback(() => {
    const r = randomProfile();
    setGender(r.gender);
    setSkinTone(r.skinTone);
    setHairColor(r.hairColor);
  }, []);

  const handlePlay = () => {
    const trimmed = name.trim();
    if (!trimmed) { setNameError('Please enter a name!'); return; }
    if (trimmed.length > 20) { setNameError('Name too long (max 20 chars)'); return; }
    onPlay({ name: trimmed, gender, skinTone, hairColor, hasSetup: true });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay dims background slightly like the original */}
      <div className="absolute inset-0 bg-black/30" />

      {/* Modal */}
      <div
        className="relative w-[400px] rounded-2xl overflow-hidden shadow-2xl"
        style={{ fontFamily: "'Fredoka', sans-serif" }}
      >
        {/* Wooden top frame */}
        <div
          className="relative flex items-center justify-center py-3 px-6"
          style={{
            background: 'linear-gradient(180deg, #a0652a 0%, #7a4a1e 40%, #5c3311 100%)',
            borderBottom: '4px solid #3d2008',
            boxShadow: 'inset 0 2px 6px rgba(255,200,100,0.3)',
          }}
        >
          {/* Scroll left knob */}
          <div className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-10 rounded-full"
            style={{ background: 'radial-gradient(circle at 35% 35%, #c8851e, #7a4a1e)' }} />
          {/* Scroll right knob */}
          <div className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-10 rounded-full"
            style={{ background: 'radial-gradient(circle at 35% 35%, #c8851e, #7a4a1e)' }} />

          <div
            className="relative z-10 px-10 py-1 text-white tracking-widest text-3xl font-black uppercase"
            style={{
              textShadow: '2px 2px 0 #3d2008, 0 0 12px rgba(255,200,80,0.6)',
              letterSpacing: '0.12em',
            }}
          >
            WELcOME!
          </div>
        </div>

        {/* Parchment body */}
        <div
          className="flex flex-col items-center gap-4 px-8 pb-8 pt-5"
          style={{
            background: 'linear-gradient(180deg, #f5e6c0 0%, #eedba0 100%)',
            border: '6px solid #8b5a2b',
            borderTop: 'none',
          }}
        >
          {/* Name input */}
          <div className="w-full">
            <p className="text-center text-[#5c3a21] font-bold text-sm mb-1">Name Your Character</p>
            <input
              className="w-full text-center rounded-lg px-4 py-2 text-lg font-bold outline-none border-2 focus:border-[#8b5a2b]"
              style={{
                background: '#fdf6e3',
                borderColor: '#c8a56a',
                color: '#3d2008',
                fontFamily: "'Fredoka', sans-serif",
              }}
              value={name}
              maxLength={20}
              onChange={e => { setName(e.target.value); setNameError(''); }}
              onKeyDown={e => e.key === 'Enter' && handlePlay()}
            />
            {nameError && <p className="text-red-600 text-xs font-bold text-center mt-1">{nameError}</p>}
          </div>

          {/* Character Preview Box */}
          <div
            className="w-full rounded-xl overflow-hidden relative"
            style={{
              height: 220,
              border: '4px solid #8b5a2b',
              boxShadow: 'inset 0 0 20px rgba(0,0,0,0.2)',
            }}
          >
            {/* Sky */}
            <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, #87ceeb 0%, #b0e0f5 55%, #89cff0 55%)' }} />
            {/* Ocean shimmer */}
            <div className="absolute" style={{ bottom: '38%', left: 0, right: 0, height: 32, background: 'linear-gradient(180deg, #4fc3f7 0%, #0288d1 100%)', opacity: 0.7 }} />
            {/* Sand */}
            <div className="absolute bottom-0 left-0 right-0" style={{ height: '42%', background: 'linear-gradient(180deg, #f6d365 0%, #e8bc50 100%)' }} />

            {/* Decorative palm trees */}
            <div className="absolute text-5xl select-none" style={{ bottom: '35%', left: '6%' }}>🌴</div>
            <div className="absolute text-3xl select-none" style={{ bottom: '36%', right: '8%' }}>🌴</div>

            {/* Flowers */}
            <div className="absolute text-2xl select-none" style={{ bottom: '39%', left: '18%' }}>🌺</div>
            <div className="absolute text-xl select-none" style={{ bottom: '38%', right: '20%' }}>🌸</div>
            <div className="absolute text-lg select-none" style={{ bottom: '37%', left: '38%' }}>🌼</div>

            {/* Clouds */}
            <div className="absolute text-3xl select-none opacity-80" style={{ top: '8%', left: '10%' }}>☁️</div>
            <div className="absolute text-2xl select-none opacity-70" style={{ top: '12%', right: '15%' }}>☁️</div>

            {/* Bird */}
            <div className="absolute text-base select-none opacity-90" style={{ top: '18%', left: '55%' }}>🕊️</div>

            {/* Character — show hair color band + avatar */}
            <div
              className="absolute flex flex-col items-center"
              style={{ bottom: '36%', left: '50%', transform: 'translateX(-50%)' }}
            >
              {/* Hair-colour dot above avatar */}
              <div
                className="w-5 h-5 rounded-full border-2 border-white mb-1 shadow-md"
                style={{ background: hairColor }}
              />
              <div className="text-[72px] leading-none select-none drop-shadow-lg" style={{ filter: 'drop-shadow(2px 4px 6px rgba(0,0,0,0.3))' }}>
                {avatar}
              </div>
            </div>
          </div>

          {/* Gender chooser */}
          <div className="w-full">
            <p className="text-center text-[#5c3a21] font-bold text-sm mb-2">Choose Your Gender</p>
            <div className="flex justify-center gap-6">
              <button
                onClick={() => setGender('female')}
                className="w-16 h-16 rounded-full flex items-center justify-center text-3xl border-4 transition-all active:scale-95"
                style={{
                  background: gender === 'female' ? 'linear-gradient(135deg, #f472b6, #ec4899)' : '#f9d7ea',
                  borderColor: gender === 'female' ? '#be185d' : '#fbb6d4',
                  boxShadow: gender === 'female' ? '0 4px 0 #9d174d, 0 0 12px rgba(236,72,153,0.4)' : '0 4px 0 #f9a8d4',
                }}
              >
                ♀
              </button>
              <button
                onClick={() => setGender('male')}
                className="w-16 h-16 rounded-full flex items-center justify-center text-3xl border-4 transition-all active:scale-95"
                style={{
                  background: gender === 'male' ? 'linear-gradient(135deg, #38bdf8, #0ea5e9)' : '#d4f0fc',
                  borderColor: gender === 'male' ? '#0369a1' : '#7dd3fc',
                  boxShadow: gender === 'male' ? '0 4px 0 #075985, 0 0 12px rgba(14,165,233,0.4)' : '0 4px 0 #93c5fd',
                }}
              >
                ♂
              </button>
            </div>
          </div>

          {/* Random / Customize row */}
          <div className="flex gap-3 w-full">
            <button
              onClick={handleRandom}
              className="flex-1 py-2 rounded-xl font-black text-sm uppercase tracking-wide border-b-4 active:scale-95 transition-transform"
              style={{
                background: 'linear-gradient(180deg, #f5c842, #e0a800)',
                borderColor: '#a07700',
                color: '#3d2008',
                boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
              }}
            >
              Random
            </button>
            <button
              onClick={() => setShowCustom(v => !v)}
              className="flex-1 py-2 rounded-xl font-black text-sm uppercase tracking-wide border-b-4 active:scale-95 transition-transform"
              style={{
                background: showCustom ? 'linear-gradient(180deg, #9b59b6, #6c3483)' : 'linear-gradient(180deg, #b07dd6, #7e2fa8)',
                borderColor: showCustom ? '#4a235a' : '#5b2080',
                color: '#fff',
                boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
              }}
            >
              Customize
            </button>
          </div>

          {/* Customization panel */}
          {showCustom && (
            <div
              className="w-full rounded-xl p-4 flex flex-col gap-3"
              style={{ background: 'rgba(139,90,43,0.12)', border: '2px solid #c8a56a' }}
            >
              {/* Skin tone */}
              <div>
                <p className="text-xs font-bold text-[#5c3a21] mb-2">Skin Tone</p>
                <div className="flex gap-2">
                  {SKIN_TONES.map((_, i) => {
                    const avatarForTone = getAvatar(gender, i);
                    return (
                      <button
                        key={i}
                        onClick={() => setSkinTone(i)}
                        className="w-10 h-10 rounded-full text-xl flex items-center justify-center border-2 transition-all active:scale-95"
                        style={{
                          borderColor: skinTone === i ? '#8b5a2b' : 'transparent',
                          background: skinTone === i ? 'rgba(139,90,43,0.2)' : 'transparent',
                        }}
                      >
                        {avatarForTone}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Hair color */}
              <div>
                <p className="text-xs font-bold text-[#5c3a21] mb-2">Hair Color</p>
                <div className="flex gap-2 flex-wrap">
                  {HAIR_COLORS.map((color, i) => (
                    <button
                      key={color}
                      onClick={() => setHairColor(color)}
                      title={HAIR_NAMES[i]}
                      className="w-8 h-8 rounded-full border-2 transition-all active:scale-95"
                      style={{
                        background: color,
                        borderColor: hairColor === color ? '#3d2008' : 'rgba(0,0,0,0.2)',
                        boxShadow: hairColor === color ? '0 0 0 3px rgba(255,255,255,0.8)' : 'none',
                        transform: hairColor === color ? 'scale(1.15)' : 'scale(1)',
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

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

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

    {/* ── Sky ── */}
    <rect x="0" y="0" width="380" height="240" fill="url(#skyG)"/>

    {/* ── BACK ROW: 4 tiny palm silhouettes aligned at horizon, every-other of 8 positions (48 px apart) ── */}
    {/* z-order: above sky, below clouds → appear as a very distant tree-line */}
    {/* x = 24, 120, 216, 312 */}

    {/* B1 x=24 */}
    <path d="M24 138 Q24 128 25 115" stroke="#2e4820" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
    <path d="M25 118 Q14 111 5 114 Q14 117 24 120" fill="#286018"/>
    <path d="M25 118 Q35 111 43 114 Q35 117 26 120" fill="#286018"/>
    <path d="M25 117 Q22 107 26 100 Q26 109 26 117" fill="#347020"/>

    {/* B2 x=120 */}
    <path d="M120 137 Q120 127 121 114" stroke="#2e4820" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
    <path d="M121 117 Q110 110 101 113 Q110 116 120 119" fill="#286018"/>
    <path d="M121 117 Q131 110 139 113 Q131 116 122 119" fill="#286018"/>
    <path d="M121 116 Q118 106 122 99 Q122 108 122 116" fill="#347020"/>

    {/* B3 x=216 */}
    <path d="M216 138 Q216 128 217 115" stroke="#2e4820" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
    <path d="M217 118 Q206 111 197 114 Q206 117 216 120" fill="#286018"/>
    <path d="M217 118 Q227 111 235 114 Q227 117 218 120" fill="#286018"/>
    <path d="M217 117 Q214 107 218 100 Q218 109 218 117" fill="#347020"/>

    {/* B4 x=312 */}
    <path d="M312 137 Q312 127 313 114" stroke="#2e4820" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
    <path d="M313 117 Q302 110 293 113 Q302 116 312 119" fill="#286018"/>
    <path d="M313 117 Q323 110 331 113 Q323 116 314 119" fill="#286018"/>
    <path d="M313 116 Q310 106 314 99 Q314 108 314 116" fill="#347020"/>

    {/* ── Clouds ── */}
    <ellipse cx="75"  cy="55" rx="42" ry="20" fill="white" opacity="0.92"/>
    <ellipse cx="108" cy="47" rx="32" ry="18" fill="white" opacity="0.92"/>
    <ellipse cx="48"  cy="60" rx="26" ry="14" fill="white" opacity="0.90"/>
    <ellipse cx="250" cy="38" rx="32" ry="16" fill="white" opacity="0.85"/>
    <ellipse cx="278" cy="30" rx="24" ry="13" fill="white" opacity="0.85"/>

    {/* ── MIDDLE-FAR: 2 small palms, spaced wide, appearing at horizon (rendered before sea) ── */}
    {/* Their bases sit at the waterline; the sea rect will cover the lower trunk */}

    {/* M1 x=155 */}
    <path d="M155 148 Q155 137 156 123" stroke="#3a4222" strokeWidth="4" fill="none" strokeLinecap="round"/>
    <path d="M156 126 Q143 117 131 121 Q143 125 155 129" fill="#327a1a"/>
    <path d="M156 126 Q167 117 177 121 Q167 125 157 129" fill="#3a8a20"/>
    <path d="M156 125 Q150 111 153 100 Q155 113 157 125" fill="#368420"/>
    <path d="M156 125 Q162 113 167 104 Q162 115 158 125" fill="#2a7016"/>
    <circle cx="153" cy="130" r="3"   fill="#6a4818"/>
    <circle cx="158" cy="128" r="2.5" fill="#7a5820"/>

    {/* M2 x=240 */}
    <path d="M240 148 Q240 137 241 123" stroke="#3a4222" strokeWidth="4" fill="none" strokeLinecap="round"/>
    <path d="M241 126 Q228 117 216 121 Q228 125 240 129" fill="#327a1a"/>
    <path d="M241 126 Q252 117 262 121 Q252 125 242 129" fill="#3a8a20"/>
    <path d="M241 125 Q235 111 238 100 Q240 113 242 125" fill="#368420"/>
    <path d="M241 125 Q247 113 252 104 Q247 115 243 125" fill="#2a7016"/>
    <circle cx="238" cy="130" r="3"   fill="#6a4818"/>
    <circle cx="243" cy="128" r="2.5" fill="#7a5820"/>

    {/* ── Right horizon island hint ── */}
    <ellipse cx="310" cy="155" rx="55" ry="18" fill="#4a9a5a" opacity="0.5"/>
    <ellipse cx="295" cy="150" rx="35" ry="14" fill="#3a8a4a" opacity="0.6"/>

    {/* ── Sea ── */}
    <rect x="0" y="140" width="380" height="55" fill="url(#seaG)"/>
    <path d="M0 145 Q30 138 60 145 Q90 152 120 145 Q150 138 180 145 Q210 152 240 145 Q270 138 300 145 Q330 152 380 145 L380 195 L0 195Z" fill="#1a7fc0" opacity="0.55"/>
    <path d="M0 155 Q40 149 80 155 Q120 161 160 155 Q200 149 240 155 Q280 161 320 155 Q360 149 380 155" stroke="white" strokeWidth="1.5" fill="none" opacity="0.35"/>

    {/* ── Sand ── */}
    <rect x="0" y="190" width="380" height="50" fill="url(#sandG)"/>
    <ellipse cx="120" cy="208" rx="80" ry="8" fill="#c8a868" opacity="0.3"/>

    {/* ── LEFT foreground palm (1 tree, very left, leans right) ── */}
    {/* trunk bottom (12,237) → top (26,163) */}
    <path d="M12 237 Q17 200 26 163" stroke="#7a5a3a" strokeWidth="9" fill="none" strokeLinecap="round"/>
    <path d="M26 169 Q55 159 76 164 Q55 174 28 173" fill="#4a9a4a"/>
    <path d="M26 166 Q50 146 70 150 Q53 160 28 168" fill="#3a8a3a"/>
    <path d="M26 169 Q3 160 -9 164 Q1 173 24 174" fill="#4a9a4a"/>
    <path d="M26 166 Q38 147 56 139 Q46 152 28 163" fill="#3a8a3a"/>
    <path d="M26 163 Q20 141 25 122 Q28 143 30 163" fill="#5aaa5a"/>
    <circle cx="29" cy="173" r="6"   fill="#7a5a20"/>
    <circle cx="23" cy="170" r="5"   fill="#8a6a28"/>

    {/* ── RIGHT foreground: 3 palms spaced across right side ── */}

    {/* R3 (leftmost of 3, x≈290) */}
    <path d="M286 226 Q288 193 292 160" stroke="#7a5a3a" strokeWidth="8" fill="none" strokeLinecap="round"/>
    <path d="M292 166 Q263 147 243 153 Q267 163 290 171" fill="#4a9a4a"/>
    <path d="M292 163 Q285 138 304 126 Q302 148 296 163" fill="#3a8a3a"/>
    <path d="M292 166 Q317 149 334 157 Q316 167 294 174" fill="#4a9a4a"/>
    <path d="M292 163 Q322 158 336 175 Q314 170 296 170" fill="#5aaa5a"/>
    <path d="M292 163 Q275 140 288 126 Q291 148 294 163" fill="#3a8a3a"/>
    <circle cx="287" cy="172" r="6"   fill="#7a5a20"/>
    <circle cx="298" cy="169" r="5"   fill="#8a6a28"/>

    {/* R2 (middle of 3, x≈322) */}
    <path d="M320 229 Q322 192 326 155" stroke="#7a5a3a" strokeWidth="10" fill="none" strokeLinecap="round"/>
    <path d="M326 161 Q296 142 274 148 Q299 158 324 169" fill="#4a9a4a"/>
    <path d="M326 158 Q319 130 337 118 Q335 143 330 158" fill="#3a8a3a"/>
    <path d="M326 161 Q353 143 372 151 Q353 161 328 169" fill="#4a9a4a"/>
    <path d="M326 161 Q358 157 373 173 Q352 167 329 171" fill="#5aaa5a"/>
    <path d="M326 158 Q306 135 320 122 Q323 144 328 158" fill="#3a8a3a"/>
    <circle cx="321" cy="170" r="7"   fill="#7a5a20"/>
    <circle cx="332" cy="167" r="6"   fill="#8a6a28"/>

    {/* R1 (rightmost of 3, x≈354) */}
    <path d="M357 234 Q355 197 351 162" stroke="#7a5a3a" strokeWidth="9" fill="none" strokeLinecap="round"/>
    <path d="M351 168 Q322 149 302 154 Q326 164 349 173" fill="#4a9a4a"/>
    <path d="M351 165 Q344 138 362 126 Q360 150 355 165" fill="#3a8a3a"/>
    <path d="M351 168 Q374 150 380 161 Q373 169 353 175" fill="#4a9a4a"/>
    <path d="M351 165 Q378 162 380 178 Q369 172 355 174" fill="#5aaa5a"/>
    <path d="M351 165 Q333 141 346 127 Q349 148 353 165" fill="#3a8a3a"/>
    <circle cx="346" cy="174" r="6.5" fill="#7a5a20"/>
    <circle cx="357" cy="171" r="5.5" fill="#8a6a28"/>

    {/* ── Thin beach grass + water channels ──────────────────────────────── */}
    {/* Layout: 5 sparse clumps (A x≈5-44, B x≈90-132, C x≈170-208, D x≈252-292, E x≈338-376)
        with open water-flow gaps between each pair. Two sinuous water channels snake
        the full width; they're most visible in the gaps. strokeWidth=1.5 keeps blades thin. */}

    {/* ── Water channel 1 (upper, y≈225-231) ─ runs full width behind the grass ── */}
    <path d="M0 228 Q22 223 44 228 Q68 233 90 228 Q112 223 132 228 Q152 233 170 228 Q190 223 208 228 Q230 233 252 228 Q272 223 292 228 Q314 233 338 228 Q358 223 380 228"
          stroke="#3aaedd" strokeWidth="2" fill="none" opacity="0.72" strokeLinecap="round"/>

    {/* ── Water channel 2 (lower, y≈233-239) ─ wider, fills the gaps prominently ── */}
    <path d="M0 236 Q44 232 58 237 Q76 242 96 236 Q118 230 136 236 Q158 242 172 236 Q194 230 212 236 Q234 242 256 236 Q278 230 296 236 Q318 242 340 236 Q362 231 380 236"
          stroke="#44b8ee" strokeWidth="2.5" fill="none" opacity="0.65" strokeLinecap="round"/>

    {/* ── Clump A (x=5-44, left edge) — 7 thin blades ── */}
    <path d="M8  240 Q7  231 6  220"  stroke="#58b828" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
    <path d="M15 240 Q14 230 16 219" stroke="#4a9e20" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
    <path d="M22 240 Q22 230 20 219" stroke="#62bc2e" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
    <path d="M30 240 Q30 231 32 221" stroke="#4a9e20" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
    <path d="M37 240 Q36 232 34 222" stroke="#58b028" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
    <path d="M43 240 Q44 231 46 221" stroke="#4a9e20" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
    {/* tiny accent flowers on a couple blades */}
    <circle cx="6"  cy="218" r="2.5" fill="#ee3322" opacity="0.9"/>
    <circle cx="20" cy="217" r="2"   fill="#ffcc00" opacity="0.9"/>
    <circle cx="34" cy="220" r="2.5" fill="#ff8822" opacity="0.85"/>

    {/* ── Clump B (x=90-132) — 6 thin blades ── */}
    <path d="M92  240 Q91  231 90  220" stroke="#58b828" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
    <path d="M100 240 Q100 230 102 220" stroke="#4a9e20" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
    <path d="M108 240 Q107 231 106 221" stroke="#62bc2e" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
    <path d="M116 240 Q117 230 119 220" stroke="#4a9e20" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
    <path d="M124 240 Q123 231 122 221" stroke="#58b028" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
    <path d="M132 240 Q133 231 135 221" stroke="#4a9e20" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
    <circle cx="90"  cy="218" r="2"   fill="#dd2255" opacity="0.85"/>
    <circle cx="119" cy="218" r="2.5" fill="#ffdd00" opacity="0.9"/>

    {/* ── Clump C (x=170-208, very sparse — center) — 4 thin blades ── */}
    <path d="M172 240 Q171 232 170 222" stroke="#58b828" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
    <path d="M182 240 Q183 232 185 223" stroke="#4a9e20" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
    <path d="M196 240 Q195 232 194 222" stroke="#62bc2e" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
    <path d="M208 240 Q209 232 211 222" stroke="#4a9e20" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
    <circle cx="185" cy="221" r="2" fill="#ff8822" opacity="0.85"/>

    {/* ── Clump D (x=252-292) — 6 thin blades ── */}
    <path d="M254 240 Q253 231 252 220" stroke="#58b828" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
    <path d="M262 240 Q262 230 264 220" stroke="#4a9e20" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
    <path d="M270 240 Q269 231 268 221" stroke="#62bc2e" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
    <path d="M278 240 Q279 230 281 220" stroke="#4a9e20" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
    <path d="M286 240 Q285 231 284 221" stroke="#58b028" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
    <path d="M292 240 Q293 231 295 221" stroke="#4a9e20" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
    <circle cx="252" cy="218" r="2.5" fill="#ee3322" opacity="0.9"/>
    <circle cx="281" cy="219" r="2"   fill="#ffcc00" opacity="0.85"/>

    {/* ── Clump E (x=338-376, right edge) — 6 thin blades ── */}
    <path d="M340 240 Q339 231 338 220" stroke="#58b828" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
    <path d="M348 240 Q348 230 350 220" stroke="#4a9e20" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
    <path d="M356 240 Q355 231 354 221" stroke="#62bc2e" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
    <path d="M364 240 Q365 230 367 220" stroke="#4a9e20" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
    <path d="M372 240 Q371 231 370 221" stroke="#58b028" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
    <circle cx="338" cy="218" r="2"   fill="#ff4488" opacity="0.9"/>
    <circle cx="367" cy="219" r="2.5" fill="#ffcc00" opacity="0.85"/>

    {/* ── Fish/sea creature ── */}
    <ellipse cx="140" cy="175" rx="8"  ry="3"   fill="#5588cc" opacity="0.75"/>
    <ellipse cx="132" cy="173" rx="11" ry="5"   fill="#88aaee" opacity="0.60" transform="rotate(-25 132 173)"/>
    <ellipse cx="148" cy="173" rx="11" ry="5"   fill="#88aaee" opacity="0.60" transform="rotate(25 148 173)"/>
    <circle  cx="140" cy="175" r="2.5"           fill="#223366"/>
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

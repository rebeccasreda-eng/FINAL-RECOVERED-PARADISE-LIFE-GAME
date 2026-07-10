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
    <ellipse cx="50" cy="137" rx="22" ry="4" fill="#00000025"/>
    <rect x="36" y="108" width="11" height="25" rx="5" fill="#fde8d0"/>
    <rect x="53" y="108" width="11" height="25" rx="5" fill="#fde8d0"/>
    <ellipse cx="41" cy="133" rx="9" ry="5" fill="#4466cc"/>
    <ellipse cx="59" cy="133" rx="9" ry="5" fill="#4466cc"/>
    <path d="M28 90 Q30 118 42 118 L58 118 Q70 118 72 90Z" fill="#4466cc"/>
    <path d="M28 90 L72 90" stroke="#334499" strokeWidth="1.5" fill="none"/>
    <rect x="30" y="65" width="40" height="28" rx="8" fill="white"/>
    <rect x="30" y="70" width="40" height="4" rx="0" fill="#4466cc"/>
    <rect x="30" y="78" width="40" height="4" rx="0" fill="#4466cc"/>
    <rect x="30" y="86" width="40" height="3" fill="#4466cc"/>
    <path d="M30 68 Q18 74 20 84" stroke="#fde8d0" strokeWidth="10" fill="none" strokeLinecap="round"/>
    <path d="M70 68 Q82 74 80 84" stroke="#fde8d0" strokeWidth="10" fill="none" strokeLinecap="round"/>
    <rect x="43" y="55" width="14" height="12" rx="3" fill="#fde8d0"/>
    <circle cx="50" cy="36" r="28" fill="#fde8d0"/>
    <ellipse cx="50" cy="24" rx="28" ry="21" fill="#7a4520"/>
    <path d="M23 32 Q12 38 16 56" stroke="#6a3a18" strokeWidth="11" fill="none" strokeLinecap="round"/>
    <path d="M77 32 Q88 38 84 56" stroke="#6a3a18" strokeWidth="11" fill="none" strokeLinecap="round"/>
    <path d="M23 32 Q28 10 50 10 Q72 10 77 32 Q72 18 50 18 Q28 18 23 32Z" fill="#8b5428"/>
    <path d="M23 32 Q30 38 38 32" fill="#7a4520"/>
    <path d="M77 32 Q70 38 62 32" fill="#7a4520"/>
    <path d="M38 14 Q50 9 62 14 Q50 19 38 14Z" fill="white" stroke="#dddddd" strokeWidth="0.5"/>
    <circle cx="50" cy="14" r="3" fill="#eeeeee"/>
    <ellipse cx="40" cy="36" rx="7" ry="8" fill="white"/>
    <ellipse cx="60" cy="36" rx="7" ry="8" fill="white"/>
    <ellipse cx="40" cy="38" rx="5" ry="6" fill="#88551a"/>
    <ellipse cx="60" cy="38" rx="5" ry="6" fill="#88551a"/>
    <circle cx="40.8" cy="39" r="3" fill="#1a0a00"/>
    <circle cx="60.8" cy="39" r="3" fill="#1a0a00"/>
    <circle cx="42.5" cy="36.5" r="1.5" fill="white"/>
    <circle cx="62.5" cy="36.5" r="1.5" fill="white"/>
    <path d="M33 30 Q35 27 37 30" stroke="#552200" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
    <path d="M53 30 Q55 27 57 30" stroke="#552200" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
    <path d="M34 29 Q40 25 46 28" stroke="#6a3a18" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
    <path d="M54 28 Q60 25 66 29" stroke="#6a3a18" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
    <ellipse cx="30" cy="42" rx="7" ry="4" fill="#ff8888" opacity="0.38"/>
    <ellipse cx="70" cy="42" rx="7" ry="4" fill="#ff8888" opacity="0.38"/>
    <ellipse cx="50" cy="43" rx="2" ry="1.2" fill="#e0a880" opacity="0.6"/>
    <path d="M43 49 Q50 55 57 49" stroke="#cc4466" strokeWidth="2" fill="none" strokeLinecap="round"/>
    <path d="M30 65 L50 78 L70 65 L63 65 L50 72 L37 65Z" fill="#334499" stroke="#222288" strokeWidth="0.5"/>
    <path d="M50 72 L50 90" stroke="#cc2222" strokeWidth="2.5" fill="none"/>
  </svg>
);

/** Character 2 – Leo: blonde spiky hair, dark star shirt, jeans */
const ChLeo = ({ size = 120 }: { size?: number }) => (
  <svg viewBox="0 0 100 148" width={size} height={size * 1.48} xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="50" cy="145" rx="24" ry="4" fill="#00000025"/>
    <rect x="34" y="108" width="12" height="32" rx="5" fill="#2244aa"/>
    <rect x="54" y="108" width="12" height="32" rx="5" fill="#2244aa"/>
    <ellipse cx="40" cy="140" rx="11" ry="6" fill="#221100"/>
    <ellipse cx="60" cy="140" rx="11" ry="6" fill="#221100"/>
    <path d="M34 108 Q34 120 46 120" stroke="#3355bb" strokeWidth="1.2" fill="none"/>
    <rect x="28" y="64" width="44" height="46" rx="8" fill="#222233"/>
    <polygon points="50,72 52.8,80 61,80 54.8,85 57.2,93 50,88.5 42.8,93 45.2,85 39,80 47.2,80" fill="white" opacity="0.9"/>
    <path d="M28 68 Q15 74 17 86" stroke="#222233" strokeWidth="12" fill="none" strokeLinecap="round"/>
    <path d="M72 68 Q85 74 83 86" stroke="#222233" strokeWidth="12" fill="none" strokeLinecap="round"/>
    <path d="M17 86 Q16 92 20 96" stroke="#fde8d0" strokeWidth="10" fill="none" strokeLinecap="round"/>
    <path d="M83 86 Q84 92 80 96" stroke="#fde8d0" strokeWidth="10" fill="none" strokeLinecap="round"/>
    <rect x="42" y="54" width="16" height="12" rx="3" fill="#fde8d0"/>
    <circle cx="50" cy="34" r="30" fill="#fde8d0"/>
    <ellipse cx="50" cy="20" rx="29" ry="20" fill="#d4a824"/>
    <path d="M22 30 Q20 10 28 6 Q30 18 35 20" fill="#e8c030"/>
    <path d="M34 15 Q36 2 44 0 Q44 14 48 18" fill="#d4a824"/>
    <path d="M46 10 Q50 -2 56 2 Q54 14 52 18" fill="#e8c030"/>
    <path d="M54 12 Q60 0 68 4 Q64 16 60 20" fill="#d4a824"/>
    <path d="M62 18 Q70 8 78 12 Q74 22 70 26" fill="#e8c030"/>
    <path d="M21 30 Q18 44 22 52" stroke="#d4a824" strokeWidth="9" fill="none" strokeLinecap="round"/>
    <path d="M79 30 Q82 44 78 52" stroke="#d4a824" strokeWidth="9" fill="none" strokeLinecap="round"/>
    <path d="M22 28 Q28 36 38 30" fill="#c89818"/>
    <path d="M78 28 Q72 36 62 30" fill="#c89818"/>
    <ellipse cx="38" cy="35" rx="7.5" ry="8.5" fill="white"/>
    <ellipse cx="62" cy="35" rx="7.5" ry="8.5" fill="white"/>
    <ellipse cx="38" cy="37" rx="5.5" ry="6.5" fill="#3388ee"/>
    <ellipse cx="62" cy="37" rx="5.5" ry="6.5" fill="#3388ee"/>
    <circle cx="39" cy="38" r="3.2" fill="#0a1a30"/>
    <circle cx="63" cy="38" r="3.2" fill="#0a1a30"/>
    <circle cx="40.8" cy="35.5" r="1.6" fill="white"/>
    <circle cx="64.8" cy="35.5" r="1.6" fill="white"/>
    <path d="M31 28 Q38 23 45 27" stroke="#a07010" strokeWidth="2.2" fill="none" strokeLinecap="round"/>
    <path d="M55 27 Q62 23 69 28" stroke="#a07010" strokeWidth="2.2" fill="none" strokeLinecap="round"/>
    <ellipse cx="27" cy="42" rx="7" ry="4" fill="#ff9999" opacity="0.3"/>
    <ellipse cx="73" cy="42" rx="7" ry="4" fill="#ff9999" opacity="0.3"/>
    <ellipse cx="50" cy="43" rx="2.2" ry="1.4" fill="#e0a880" opacity="0.5"/>
    <path d="M41 50 Q50 57 59 50" stroke="#cc4455" strokeWidth="2.2" fill="none" strokeLinecap="round"/>
    <path d="M28 64 L42 72 L50 64 L58 72 L72 64" stroke="#444455" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

/** Character 3 – Ava: auburn flowing hair, green eyes, pink top */
const ChAva = ({ size = 120 }: { size?: number }) => (
  <svg viewBox="0 0 100 142" width={size} height={size * 1.42} xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="50" cy="139" rx="22" ry="4" fill="#00000025"/>
    <rect x="36" y="108" width="11" height="26" rx="5" fill="#fde8d0"/>
    <rect x="53" y="108" width="11" height="26" rx="5" fill="#fde8d0"/>
    <ellipse cx="41" cy="134" rx="9" ry="5" fill="#cc6688"/>
    <ellipse cx="59" cy="134" rx="9" ry="5" fill="#cc6688"/>
    <path d="M26 88 Q28 114 40 116 L60 116 Q72 114 74 88Z" fill="#ff9ab0"/>
    <path d="M26 88 L74 88" stroke="#dd7090" strokeWidth="1.5" fill="none"/>
    <path d="M26 88 Q32 95 38 88 Q44 95 50 88 Q56 95 62 88 Q68 95 74 88" stroke="#ffbbcc" strokeWidth="3" fill="none"/>
    <rect x="28" y="62" width="44" height="28" rx="9" fill="#ff88aa"/>
    <path d="M28 62 L50 76 L72 62" stroke="#dd6688" strokeWidth="2" fill="none"/>
    <path d="M28 66 Q16 72 18 82" stroke="#ff88aa" strokeWidth="11" fill="none" strokeLinecap="round"/>
    <path d="M72 66 Q84 72 82 82" stroke="#ff88aa" strokeWidth="11" fill="none" strokeLinecap="round"/>
    <circle cx="18" cy="84" r="6" fill="#fde8d0"/>
    <circle cx="82" cy="84" r="6" fill="#fde8d0"/>
    <rect x="43" y="52" width="14" height="12" rx="3" fill="#fde8d0"/>
    <circle cx="50" cy="33" r="28" fill="#fde8d0"/>
    <ellipse cx="50" cy="22" rx="27" ry="20" fill="#aa4418"/>
    <path d="M23 32 Q14 60 20 90 Q24 100 30 104" stroke="#993310" strokeWidth="14" fill="none" strokeLinecap="round"/>
    <path d="M77 32 Q86 60 80 90 Q76 100 70 104" stroke="#993310" strokeWidth="14" fill="none" strokeLinecap="round"/>
    <path d="M23 32 Q27 12 50 11 Q73 12 77 32 Q72 18 50 18 Q28 18 23 32Z" fill="#bb5520"/>
    <path d="M23 32 Q28 40 36 35" fill="#aa4418"/>
    <ellipse cx="40" cy="34" rx="7" ry="8" fill="white"/>
    <ellipse cx="60" cy="34" rx="7" ry="8" fill="white"/>
    <ellipse cx="40" cy="36" rx="5" ry="6" fill="#22aa55"/>
    <ellipse cx="60" cy="36" rx="5" ry="6" fill="#22aa55"/>
    <circle cx="40.8" cy="37" r="3" fill="#082210"/>
    <circle cx="60.8" cy="37" r="3" fill="#082210"/>
    <circle cx="42.5" cy="34.5" r="1.5" fill="white"/>
    <circle cx="62.5" cy="34.5" r="1.5" fill="white"/>
    <path d="M33 27 Q36 24 39 27" stroke="#882200" strokeWidth="1.3" fill="none" strokeLinecap="round"/>
    <path d="M51 27 Q54 24 57 27" stroke="#882200" strokeWidth="1.3" fill="none" strokeLinecap="round"/>
    <path d="M33 26 Q40 22 47 25" stroke="#993310" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
    <path d="M53 25 Q60 22 67 26" stroke="#993310" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
    <ellipse cx="29" cy="40" rx="7" ry="4" fill="#ff8888" opacity="0.4"/>
    <ellipse cx="71" cy="40" rx="7" ry="4" fill="#ff8888" opacity="0.4"/>
    <ellipse cx="50" cy="41" rx="2" ry="1.2" fill="#e0a880" opacity="0.55"/>
    <path d="M42 48 Q50 55 58 48" stroke="#cc3355" strokeWidth="2" fill="none" strokeLinecap="round"/>
    <path d="M42 48 Q50 56 58 48" fill="#ff8899" opacity="0.3"/>
  </svg>
);

/** Character 4 – Kai: dark spiky hair, tropical orange shirt, board shorts */
const ChKai = ({ size = 120 }: { size?: number }) => (
  <svg viewBox="0 0 100 148" width={size} height={size * 1.48} xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="50" cy="145" rx="24" ry="4" fill="#00000025"/>
    <rect x="34" y="108" width="12" height="30" rx="5" fill="#e8c898"/>
    <rect x="54" y="108" width="12" height="30" rx="5" fill="#e8c898"/>
    <path d="M28 88 Q28 112 40 114 L60 114 Q72 112 72 88Z" fill="#20a898"/>
    <path d="M28 88 L50 100 L72 88" fill="#18907e" opacity="0.6"/>
    <path d="M34 92 L34 108" stroke="#18907e" strokeWidth="1.2" opacity="0.5"/>
    <path d="M66 92 L66 108" stroke="#18907e" strokeWidth="1.2" opacity="0.5"/>
    <ellipse cx="40" cy="138" rx="11" ry="6" fill="#8b5a2b"/>
    <ellipse cx="60" cy="138" rx="11" ry="6" fill="#8b5a2b"/>
    <path d="M34 134 L46 134" stroke="#5c3a1e" strokeWidth="2.5" strokeLinecap="round"/>
    <path d="M54 134 L66 134" stroke="#5c3a1e" strokeWidth="2.5" strokeLinecap="round"/>
    <rect x="26" y="62" width="48" height="28" rx="9" fill="#f07020"/>
    <path d="M26 62 L50 76 L74 62 L64 62 L50 70 L36 62Z" fill="#cc5010"/>
    <path d="M34 68 Q38 64 42 68 Q38 72 34 68Z" fill="#60c820" opacity="0.7"/>
    <path d="M56 72 Q60 68 64 72 Q60 76 56 72Z" fill="#60c820" opacity="0.7"/>
    <path d="M44 78 Q48 74 52 78 Q48 82 44 78Z" fill="#60c820" opacity="0.6"/>
    <path d="M26 66 Q13 72 15 84" stroke="#f07020" strokeWidth="12" fill="none" strokeLinecap="round"/>
    <path d="M74 66 Q87 72 85 84" stroke="#f07020" strokeWidth="12" fill="none" strokeLinecap="round"/>
    <circle cx="15" cy="86" r="6.5" fill="#e8c898"/>
    <circle cx="85" cy="86" r="6.5" fill="#e8c898"/>
    <rect x="42" y="52" width="16" height="12" rx="3" fill="#e8c898"/>
    <circle cx="50" cy="33" r="30" fill="#e8c898"/>
    <ellipse cx="50" cy="20" rx="29" ry="18" fill="#1a1008"/>
    <path d="M22 30 Q21 8 30 4 Q32 18 37 22" fill="#28180c"/>
    <path d="M36 14 Q40 0 50 2 Q48 16 50 20" fill="#1a1008"/>
    <path d="M50 10 Q56 -2 64 4 Q60 16 58 20" fill="#28180c"/>
    <path d="M60 14 Q68 2 76 8 Q70 18 66 22" fill="#1a1008"/>
    <path d="M21 30 Q18 46 22 55" stroke="#1a1008" strokeWidth="10" fill="none" strokeLinecap="round"/>
    <path d="M79 30 Q82 46 78 55" stroke="#1a1008" strokeWidth="10" fill="none" strokeLinecap="round"/>
    <path d="M22 30 Q30 38 40 32" fill="#1a1008"/>
    <ellipse cx="38" cy="35" rx="7.5" ry="8.5" fill="white"/>
    <ellipse cx="62" cy="35" rx="7.5" ry="8.5" fill="white"/>
    <ellipse cx="38" cy="37" rx="5.5" ry="6.5" fill="#7a4818"/>
    <ellipse cx="62" cy="37" rx="5.5" ry="6.5" fill="#7a4818"/>
    <circle cx="39" cy="38" r="3.2" fill="#1a0a00"/>
    <circle cx="63" cy="38" r="3.2" fill="#1a0a00"/>
    <circle cx="40.8" cy="35.5" r="1.6" fill="white"/>
    <circle cx="64.8" cy="35.5" r="1.6" fill="white"/>
    <path d="M31 28 Q38 23 45 27" stroke="#1a1008" strokeWidth="2.4" fill="none" strokeLinecap="round"/>
    <path d="M55 27 Q62 23 69 28" stroke="#1a1008" strokeWidth="2.4" fill="none" strokeLinecap="round"/>
    <ellipse cx="27" cy="42" rx="7" ry="4" fill="#e08060" opacity="0.35"/>
    <ellipse cx="73" cy="42" rx="7" ry="4" fill="#e08060" opacity="0.35"/>
    <ellipse cx="50" cy="43" rx="2.3" ry="1.5" fill="#c8906a" opacity="0.55"/>
    <path d="M40 51 Q50 59 60 51" stroke="#cc3344" strokeWidth="2.4" fill="none" strokeLinecap="round"/>
    <path d="M43 52 Q50 57 57 52" fill="#ff7799" opacity="0.3"/>
    <path d="M44 52 Q50 55 56 52" stroke="white" strokeWidth="1.2" fill="none" opacity="0.5"/>
  </svg>
);

/** Character 5 – Nora: dark bob hair, sailor navy dress */
const ChNora = ({ size = 120 }: { size?: number }) => (
  <svg viewBox="0 0 100 140" width={size} height={size * 1.4} xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="50" cy="137" rx="22" ry="4" fill="#00000025"/>
    <rect x="36" y="108" width="11" height="24" rx="5" fill="#fde8d0"/>
    <rect x="53" y="108" width="11" height="24" rx="5" fill="#fde8d0"/>
    <rect x="35" y="118" width="13" height="12" rx="3" fill="white"/>
    <rect x="52" y="118" width="13" height="12" rx="3" fill="white"/>
    <ellipse cx="41" cy="132" rx="10" ry="5" fill="#1a1a2e"/>
    <ellipse cx="59" cy="132" rx="10" ry="5" fill="#1a1a2e"/>
    <path d="M26 70 Q24 112 38 116 L62 116 Q76 112 74 70Z" fill="#1a2a6c"/>
    <path d="M26 70 L50 88 L74 70 L68 70 L50 82 L32 70Z" fill="white"/>
    <path d="M50 82 L50 102 L47 82 Z" fill="#cc1122"/>
    <path d="M50 82 L50 102 L53 82 Z" fill="#cc1122"/>
    <path d="M26 70 Q14 76 16 88" stroke="#1a2a6c" strokeWidth="12" fill="none" strokeLinecap="round"/>
    <path d="M74 70 Q86 76 84 88" stroke="#1a2a6c" strokeWidth="12" fill="none" strokeLinecap="round"/>
    <circle cx="16" cy="90" r="6" fill="#fde8d0"/>
    <circle cx="84" cy="90" r="6" fill="#fde8d0"/>
    <rect x="10" y="84" width="12" height="5" rx="2.5" fill="white"/>
    <rect x="78" y="84" width="12" height="5" rx="2.5" fill="white"/>
    <rect x="43" y="55" width="14" height="12" rx="3" fill="#fde8d0"/>
    <circle cx="50" cy="35" r="28" fill="#fde8d0"/>
    <ellipse cx="50" cy="23" rx="28" ry="20" fill="#2a1808"/>
    <path d="M23 34 Q21 52 28 64" stroke="#1e1006" strokeWidth="12" fill="none" strokeLinecap="round"/>
    <path d="M77 34 Q79 52 72 64" stroke="#1e1006" strokeWidth="12" fill="none" strokeLinecap="round"/>
    <path d="M23 34 Q26 12 50 11 Q74 12 77 34 Q72 18 50 18 Q28 18 23 34Z" fill="#332010"/>
    <path d="M23 34 Q36 42 50 38 Q64 42 77 34" fill="#2a1808"/>
    <ellipse cx="40" cy="36" rx="7" ry="8" fill="white"/>
    <ellipse cx="60" cy="36" rx="7" ry="8" fill="white"/>
    <ellipse cx="40" cy="38" rx="5" ry="6" fill="#553322"/>
    <ellipse cx="60" cy="38" rx="5" ry="6" fill="#553322"/>
    <circle cx="40.8" cy="39" r="3" fill="#1a0800"/>
    <circle cx="60.8" cy="39" r="3" fill="#1a0800"/>
    <circle cx="42.5" cy="36.5" r="1.5" fill="white"/>
    <circle cx="62.5" cy="36.5" r="1.5" fill="white"/>
    <path d="M33 29 Q36 26 39 29" stroke="#1a0800" strokeWidth="1.4" fill="none" strokeLinecap="round"/>
    <path d="M51 29 Q54 26 57 29" stroke="#1a0800" strokeWidth="1.4" fill="none" strokeLinecap="round"/>
    <path d="M33 28 Q40 24 47 27" stroke="#2a1808" strokeWidth="2" fill="none" strokeLinecap="round"/>
    <path d="M53 27 Q60 24 67 28" stroke="#2a1808" strokeWidth="2" fill="none" strokeLinecap="round"/>
    <ellipse cx="29" cy="42" rx="7" ry="4" fill="#ff8888" opacity="0.35"/>
    <ellipse cx="71" cy="42" rx="7" ry="4" fill="#ff8888" opacity="0.35"/>
    <ellipse cx="50" cy="43" rx="2" ry="1.2" fill="#e0a880" opacity="0.55"/>
    <path d="M43 50 Q50 56 57 50" stroke="#cc3355" strokeWidth="2" fill="none" strokeLinecap="round"/>
    <path d="M32 70 L50 82" stroke="#4466aa" strokeWidth="1" fill="none"/>
    <path d="M68 70 L50 82" stroke="#4466aa" strokeWidth="1" fill="none"/>
  </svg>
);

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
    {/* Sky */}
    <rect x="0" y="0" width="380" height="240" fill="url(#skyG)"/>
    {/* Distant island */}
    <ellipse cx="310" cy="155" rx="55" ry="18" fill="#4a9a5a" opacity="0.5"/>
    <ellipse cx="295" cy="150" rx="35" ry="14" fill="#3a8a4a" opacity="0.6"/>
    {/* Ocean */}
    <rect x="0" y="140" width="380" height="55" fill="url(#seaG)"/>
    {/* Wave 1 */}
    <path d="M0 145 Q30 138 60 145 Q90 152 120 145 Q150 138 180 145 Q210 152 240 145 Q270 138 300 145 Q330 152 380 145 L380 195 L0 195Z" fill="#1a7fc0" opacity="0.55"/>
    {/* Wave 2 lighter */}
    <path d="M0 155 Q40 149 80 155 Q120 161 160 155 Q200 149 240 155 Q280 161 320 155 Q360 149 380 155" stroke="white" strokeWidth="1.5" fill="none" opacity="0.35"/>
    {/* Sand */}
    <rect x="0" y="190" width="380" height="50" fill="url(#sandG)"/>
    {/* Sand ripple */}
    <ellipse cx="120" cy="208" rx="80" ry="8" fill="#c8a868" opacity="0.3"/>
    <ellipse cx="280" cy="215" rx="60" ry="6" fill="#c0a060" opacity="0.2"/>
    {/* Clouds */}
    <ellipse cx="75" cy="55" rx="42" ry="20" fill="white" opacity="0.92"/>
    <ellipse cx="108" cy="47" rx="32" ry="18" fill="white" opacity="0.92"/>
    <ellipse cx="48" cy="60" rx="26" ry="14" fill="white" opacity="0.9"/>
    <ellipse cx="250" cy="38" rx="32" ry="16" fill="white" opacity="0.85"/>
    <ellipse cx="278" cy="30" rx="24" ry="13" fill="white" opacity="0.85"/>
    {/* Palm tree trunk */}
    <path d="M328 75 Q322 130 318 200" stroke="#7a5a3a" strokeWidth="11" fill="none" strokeLinecap="round"/>
    {/* Palm fronds */}
    <path d="M325 82 Q295 52 258 62 Q285 72 322 88" fill="#4a9a4a"/>
    <path d="M325 78 Q318 45 338 32 Q336 58 330 78" fill="#3a8a3a"/>
    <path d="M325 82 Q352 55 375 68 Q355 75 328 90" fill="#4a9a4a"/>
    <path d="M325 82 Q358 78 372 96 Q350 88 330 92" fill="#5aaa5a"/>
    <path d="M325 78 Q305 52 320 35 Q322 58 326 78" fill="#3a8a3a"/>
    {/* Coconuts */}
    <circle cx="320" cy="92" r="7" fill="#7a5a20"/>
    <circle cx="332" cy="88" r="6" fill="#8a6a28"/>
    {/* Flowers left */}
    <circle cx="18" cy="218" r="9" fill="#dd2222" opacity="0.95"/>
    <circle cx="11" cy="217" r="6.5" fill="#ffaa00" opacity="0.9"/>
    <circle cx="30" cy="213" r="8" fill="#ffdd00" opacity="0.9"/>
    <circle cx="46" cy="219" r="8.5" fill="#ee3333" opacity="0.9"/>
    <circle cx="58" cy="215" r="7" fill="#ff8822" opacity="0.85"/>
    {/* Flower stems */}
    <path d="M18 224 L18 240" stroke="#229922" strokeWidth="2.5"/>
    <path d="M30 218 L28 238" stroke="#229922" strokeWidth="2.5"/>
    <path d="M46 225 L44 240" stroke="#229922" strokeWidth="2.5"/>
    <path d="M58 221 L56 238" stroke="#229922" strokeWidth="2.5"/>
    {/* Leaves */}
    <path d="M18 228 Q10 222 13 216" stroke="#22bb22" strokeWidth="3" fill="none" strokeLinecap="round"/>
    <path d="M30 223 Q22 218 24 212" stroke="#22bb22" strokeWidth="3" fill="none" strokeLinecap="round"/>
    {/* Flowers right corner */}
    <circle cx="358" cy="220" r="8" fill="#ff4488" opacity="0.9"/>
    <circle cx="370" cy="217" r="6.5" fill="#ffcc00" opacity="0.9"/>
    <path d="M358 226 L356 240" stroke="#229922" strokeWidth="2.5"/>
    <path d="M370 223 L368 238" stroke="#229922" strokeWidth="2.5"/>
    {/* Dragonfly */}
    <ellipse cx="140" cy="175" rx="8" ry="3" fill="#5588cc" opacity="0.75"/>
    <ellipse cx="132" cy="173" rx="11" ry="5" fill="#88aaee" opacity="0.6" transform="rotate(-25 132 173)"/>
    <ellipse cx="148" cy="173" rx="11" ry="5" fill="#88aaee" opacity="0.6" transform="rotate(25 148 173)"/>
    <circle cx="140" cy="175" r="2.5" fill="#223366"/>
  </svg>
);

/* ── Customize panel ─────────────────────────────────────────────────────── */
const HAIR_OPTS  = ['#7a4a2a','#2b2020','#c98a3a','#883a88','#dd4830'];
const OUTFIT_OPTS= ['#3d5a8a','#dd4830','#3a8a5a','#8a3a7a','#e0a030'];

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

  /* derive displayed character */
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
    // auto-switch to first char of that gender if current char is wrong gender
    const chars = g === 'female' ? FEMALE_CHARS : MALE_CHARS;
    const current = ALL_CHARS.find(c => c.id === charId);
    const currentGender = FEMALE_CHARS.some(c => c.id === charId) ? 'female' : 'male';
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
      {/* dim backdrop */}
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
          style={{
            background: '#c2521f',
            border: '4px solid #7a4620',
            boxShadow: '0 3px 0 rgba(0,0,0,0.2) inset',
          }}
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
          style={{
            height: 260,
            borderRadius: 12,
            border: '4px solid #8a5a2b',
          }}
        >
          {/* Beach background */}
          <StageBg />

          {/* Character standing on sand */}
          <div
            className="idle-bob absolute bottom-[22px] left-1/2 -translate-x-1/2 z-10"
            style={{ filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.35))' }}
          >
            <CharComp size={150} />
          </div>

          {/* Customize panel overlay */}
          {showCustomize && (
            <div
              className="absolute inset-0 flex items-center justify-center z-20"
              style={{ background: 'rgba(30,24,12,0.58)', borderRadius: 8 }}
            >
              <div
                className="w-[88%] rounded-[14px] p-3"
                style={{ background: '#f4e6c1', border: '4px solid #8a5a2b' }}
              >
                <h2 className="text-sm font-extrabold uppercase tracking-wide text-center mb-3" style={{ color: '#6f4e2a' }}>
                  Customize
                </h2>
                {/* Character picker for current gender */}
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
                {/* Hair swatches */}
                <div className="mb-2">
                  <p className="text-[11px] font-extrabold uppercase tracking-wide mb-1" style={{ color: '#7a5a30' }}>Hair color</p>
                  <div className="flex gap-2">
                    {HAIR_OPTS.map(c => (
                      <button
                        key={c}
                        onClick={() => setCustomize(s => ({ ...s, hair: c }))}
                        className="rounded-full transition-all"
                        style={{
                          width: 26, height: 26,
                          background: c,
                          border: customize.hair === c ? '3px solid #4a3520' : '2px solid rgba(0,0,0,0.15)',
                          boxShadow: customize.hair === c ? '0 0 0 2px white inset' : 'none',
                        }}
                      />
                    ))}
                  </div>
                </div>
                {/* Outfit swatches */}
                <div className="mb-3">
                  <p className="text-[11px] font-extrabold uppercase tracking-wide mb-1" style={{ color: '#7a5a30' }}>Outfit color</p>
                  <div className="flex gap-2">
                    {OUTFIT_OPTS.map(c => (
                      <button
                        key={c}
                        onClick={() => setCustomize(s => ({ ...s, outfit: c }))}
                        className="rounded-full transition-all"
                        style={{
                          width: 26, height: 26,
                          background: c,
                          border: customize.outfit === c ? '3px solid #4a3520' : '2px solid rgba(0,0,0,0.15)',
                          boxShadow: customize.outfit === c ? '0 0 0 2px white inset' : 'none',
                        }}
                      />
                    ))}
                  </div>
                </div>
                {/* Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowCustomize(false)}
                    className="flex-1 rounded-2xl py-2 text-sm font-extrabold transition-all active:scale-95"
                    style={{ background: 'linear-gradient(180deg,#fbf6e8,#ecdcae)', border: '3px solid #a9884f', color: '#6f4e2a' }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => { setShowCustomize(false); showToast('Look saved!'); }}
                    className="flex-1 rounded-2xl py-2 text-sm font-extrabold transition-all active:scale-95"
                    style={{ background: '#8fd15a', border: '3px solid #3c7d2e', color: '#234a12' }}
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Toast */}
          {toast && (
            <div
              className="absolute bottom-3 left-1/2 -translate-x-1/2 px-4 py-2 rounded-2xl text-xs font-extrabold text-white z-30 pointer-events-none"
              style={{ background: '#234a12', whiteSpace: 'nowrap' }}
            >
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
            {/* Female button */}
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
                <circle cx="12" cy="8" r="5"/>
                <path d="M12 13v8M9 18h6"/>
              </svg>
            </button>
            {/* Male button */}
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
                <circle cx="10" cy="14" r="5"/>
                <path d="M14 10l6-6M14 4h6v6"/>
              </svg>
            </button>
          </div>
          {genderError && <p className="text-[11px] font-extrabold mt-2" style={{ color: '#a02f2f' }}>{genderError}</p>}
        </div>

        {/* Random / Customize row */}
        <div className="flex gap-3 mb-3">
          <button
            onClick={handleRandom}
            className="flex-1 rounded-2xl py-[9px] text-sm font-extrabold uppercase tracking-wide transition-all active:scale-95"
            style={{ background: 'linear-gradient(180deg,#fbf6e8,#ecdcae)', border: '3px solid #a9884f', color: '#6f4e2a' }}
          >
            Random
          </button>
          <button
            onClick={() => setShowCustomize(true)}
            className="flex-1 rounded-2xl py-[9px] text-sm font-extrabold uppercase tracking-wide transition-all active:scale-95"
            style={{ background: 'linear-gradient(180deg,#fbf6e8,#ecdcae)', border: '3px solid #a9884f', color: '#6f4e2a' }}
          >
            Customize
          </button>
        </div>

        {/* PLAY button */}
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

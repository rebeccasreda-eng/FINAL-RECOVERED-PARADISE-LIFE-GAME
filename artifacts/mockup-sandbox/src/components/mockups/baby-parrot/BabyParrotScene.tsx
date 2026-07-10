export function BabyParrotScene() {
  return (
    <div style={{
      width: '100%', height: '100%', minHeight: '340px',
      background: 'linear-gradient(160deg, #b8f0a0 0%, #d4f7c0 40%, #e8ffd4 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      overflow: 'hidden', position: 'relative', borderRadius: 8,
    }}>
      <svg viewBox="0 0 340 340" xmlns="http://www.w3.org/2000/svg"
           style={{ width: '100%', height: '100%', position: 'absolute', inset: 0 }}>

        {/* ── Ground dirt patch ── */}
        <ellipse cx="170" cy="295" rx="145" ry="28" fill="#c8a050" opacity="0.45"/>
        <ellipse cx="170" cy="300" rx="130" ry="20" fill="#b89040" opacity="0.3"/>

        {/* ══ DEBRIS ══ */}

        {/* Fallen twig 1 */}
        <path d="M28 268 Q55 262 78 270" stroke="#7a5020" strokeWidth="3" fill="none" strokeLinecap="round"/>
        <path d="M42 264 Q38 252 32 248" stroke="#7a5020" strokeWidth="2" fill="none" strokeLinecap="round"/>
        <path d="M60 266 Q62 254 68 249" stroke="#7a5020" strokeWidth="2" fill="none" strokeLinecap="round"/>

        {/* Fallen twig 2 */}
        <path d="M255 280 Q278 274 305 278" stroke="#8a6028" strokeWidth="3" fill="none" strokeLinecap="round"/>
        <path d="M268 276 Q266 264 272 258" stroke="#8a6028" strokeWidth="2" fill="none" strokeLinecap="round"/>

        {/* Small pebbles */}
        <ellipse cx="45"  cy="285" rx="6"  ry="4"  fill="#a8a090" opacity="0.8"/>
        <ellipse cx="290" cy="290" rx="5"  ry="3.5" fill="#b0a898" opacity="0.75"/>
        <ellipse cx="120" cy="302" rx="4"  ry="3"  fill="#988880" opacity="0.7"/>
        <ellipse cx="230" cy="298" rx="5"  ry="3"  fill="#a8a090" opacity="0.7"/>

        {/* Leaf 1 — yellow-green fallen */}
        <path d="M68 277 Q80 268 90 274 Q82 282 68 277Z" fill="#9acd30" opacity="0.85"/>
        <path d="M79 271 L79 277" stroke="#5a8818" strokeWidth="1" fill="none"/>

        {/* Leaf 2 — orange fallen */}
        <path d="M248 270 Q258 262 268 268 Q260 278 248 270Z" fill="#d08020" opacity="0.8"/>
        <path d="M258 265 L257 271" stroke="#905010" strokeWidth="1" fill="none"/>

        {/* Leaf 3 — red */}
        <path d="M130 285 Q138 278 146 284 Q139 292 130 285Z" fill="#cc3820" opacity="0.75"/>
        <path d="M138 280 L137 285" stroke="#881810" strokeWidth="1" fill="none"/>

        {/* Leaf 4 — small dark green */}
        <path d="M196 291 Q202 285 208 290 Q203 297 196 291Z" fill="#38881a" opacity="0.8"/>
        <path d="M202 287 L201 292" stroke="#285810" strokeWidth="1" fill="none"/>

        {/* Feather 1 */}
        <path d="M308 252 Q315 238 320 222" stroke="#5ab8d8" strokeWidth="2" fill="none" strokeLinecap="round"/>
        <path d="M308 252 Q318 242 320 222" stroke="#88d8f0" strokeWidth="1" fill="none" opacity="0.6"/>
        <path d="M308 252 Q298 244 320 222" stroke="#38a8c8" strokeWidth="1" fill="none" opacity="0.5"/>

        {/* Feather 2 — green */}
        <path d="M22 242 Q14 228 18 212" stroke="#5acc38" strokeWidth="2" fill="none" strokeLinecap="round"/>
        <path d="M22 242 Q30 228 18 212" stroke="#88ee60" strokeWidth="1" fill="none" opacity="0.6"/>
        <path d="M22 242 Q10 232 18 212" stroke="#38a820" strokeWidth="1" fill="none" opacity="0.5"/>

        {/* Feather 3 — red, small */}
        <path d="M168 310 Q172 300 170 290" stroke="#ee4020" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
        <path d="M168 310 Q175 302 170 290" stroke="#ff7050" strokeWidth="1" fill="none" opacity="0.6"/>

        {/* Seed scatter */}
        <ellipse cx="92"  cy="296" rx="2.5" ry="1.5" fill="#8a6020" opacity="0.8" transform="rotate(-20 92 296)"/>
        <ellipse cx="106" cy="303" rx="2.5" ry="1.5" fill="#8a6020" opacity="0.7" transform="rotate(15 106 303)"/>
        <ellipse cx="214" cy="300" rx="2.5" ry="1.5" fill="#8a6020" opacity="0.8" transform="rotate(-10 214 300)"/>
        <ellipse cx="225" cy="294" rx="2"   ry="1.3" fill="#8a6020" opacity="0.7" transform="rotate(25 225 294)"/>
        <ellipse cx="155" cy="305" rx="2.5" ry="1.5" fill="#6a4810" opacity="0.75" transform="rotate(5 155 305)"/>

        {/* ══ FLOWERS ══ */}

        {/* Flower helper — daisy style: petals first, then center */}

        {/* Flower A — pink, bottom-left */}
        <g transform="translate(52, 260)">
          {[0,45,90,135,180,225,270,315].map((a,i) => (
            <ellipse key={i} cx={Math.cos(a*Math.PI/180)*11} cy={Math.sin(a*Math.PI/180)*11}
              rx="5.5" ry="3" fill="#f080b0" opacity="0.92"
              transform={`rotate(${a} ${Math.cos(a*Math.PI/180)*11} ${Math.sin(a*Math.PI/180)*11})`}/>
          ))}
          <circle cx="0" cy="0" r="6" fill="#ffd020"/>
          <circle cx="0" cy="0" r="3" fill="#e0a000"/>
          {/* stem */}
          <path d="M0 6 Q-3 18 -5 28" stroke="#3a9820" strokeWidth="2" fill="none" strokeLinecap="round"/>
          <path d="M-2 18 Q-12 14 -14 8" stroke="#3a9820" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
        </g>

        {/* Flower B — yellow, top-right */}
        <g transform="translate(285, 88)">
          {[0,40,80,120,160,200,240,280,320].map((a,i) => (
            <ellipse key={i} cx={Math.cos(a*Math.PI/180)*10} cy={Math.sin(a*Math.PI/180)*10}
              rx="5" ry="3" fill="#ffe040" opacity="0.9"
              transform={`rotate(${a} ${Math.cos(a*Math.PI/180)*10} ${Math.sin(a*Math.PI/180)*10})`}/>
          ))}
          <circle cx="0" cy="0" r="5.5" fill="#f08000"/>
          <circle cx="0" cy="0" r="2.5" fill="#c06000"/>
          <path d="M0 6 Q2 22 4 38" stroke="#3a9820" strokeWidth="2" fill="none" strokeLinecap="round"/>
          <path d="M2 22 Q12 16 14 8" stroke="#3a9820" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
        </g>

        {/* Flower C — white, bottom-right */}
        <g transform="translate(294, 258)">
          {[0,45,90,135,180,225,270,315].map((a,i) => (
            <ellipse key={i} cx={Math.cos(a*Math.PI/180)*9} cy={Math.sin(a*Math.PI/180)*9}
              rx="4.5" ry="2.8" fill="white" opacity="0.95"
              transform={`rotate(${a} ${Math.cos(a*Math.PI/180)*9} ${Math.sin(a*Math.PI/180)*9})`}/>
          ))}
          <circle cx="0" cy="0" r="5" fill="#ffd020"/>
          <circle cx="0" cy="0" r="2.5" fill="#e0a000"/>
          <path d="M0 5 Q2 16 1 26" stroke="#3a9820" strokeWidth="2" fill="none" strokeLinecap="round"/>
          <path d="M1 16 Q9 12 10 6" stroke="#3a9820" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
        </g>

        {/* Flower D — orange small, top-left */}
        <g transform="translate(48, 105)">
          {[0,60,120,180,240,300].map((a,i) => (
            <ellipse key={i} cx={Math.cos(a*Math.PI/180)*8} cy={Math.sin(a*Math.PI/180)*8}
              rx="4.5" ry="2.5" fill="#ff8020" opacity="0.9"
              transform={`rotate(${a} ${Math.cos(a*Math.PI/180)*8} ${Math.sin(a*Math.PI/180)*8})`}/>
          ))}
          <circle cx="0" cy="0" r="4.5" fill="#ffe040"/>
          <circle cx="0" cy="0" r="2" fill="#e0b000"/>
          <path d="M0 5 Q-2 18 0 32" stroke="#3a9820" strokeWidth="2" fill="none" strokeLinecap="round"/>
        </g>

        {/* Flower E — lavender, mid-left */}
        <g transform="translate(32, 188)">
          {[0,45,90,135,180,225,270,315].map((a,i) => (
            <ellipse key={i} cx={Math.cos(a*Math.PI/180)*8.5} cy={Math.sin(a*Math.PI/180)*8.5}
              rx="4" ry="2.5" fill="#c090f0" opacity="0.9"
              transform={`rotate(${a} ${Math.cos(a*Math.PI/180)*8.5} ${Math.sin(a*Math.PI/180)*8.5})`}/>
          ))}
          <circle cx="0" cy="0" r="4.5" fill="#ffd020"/>
          <circle cx="0" cy="0" r="2" fill="#e0a000"/>
          <path d="M0 5 Q1 18 2 30" stroke="#3a9820" strokeWidth="2" fill="none" strokeLinecap="round"/>
          <path d="M1 18 Q-8 14 -9 7" stroke="#3a9820" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
        </g>

        {/* Flower F — red tiny, mid-right */}
        <g transform="translate(318, 175)">
          {[0,60,120,180,240,300].map((a,i) => (
            <ellipse key={i} cx={Math.cos(a*Math.PI/180)*7} cy={Math.sin(a*Math.PI/180)*7}
              rx="3.5" ry="2.2" fill="#ee2030" opacity="0.9"
              transform={`rotate(${a} ${Math.cos(a*Math.PI/180)*7} ${Math.sin(a*Math.PI/180)*7})`}/>
          ))}
          <circle cx="0" cy="0" r="3.5" fill="#ffe040"/>
          <circle cx="0" cy="0" r="1.8" fill="#e0a000"/>
          <path d="M0 4 Q1 14 2 24" stroke="#3a9820" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
        </g>

        {/* Small grass blades */}
        <path d="M18 285 Q16 272 17 262" stroke="#5ab828" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
        <path d="M25 283 Q24 271 26 259" stroke="#4aaa20" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
        <path d="M310 283 Q312 271 311 260" stroke="#5ab828" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
        <path d="M320 285 Q318 273 320 262" stroke="#4aaa20" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
        <path d="M144 290 Q143 280 144 272" stroke="#5ab828" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
        <path d="M151 291 Q152 282 153 273" stroke="#4aaa20" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
        <path d="M182 291 Q181 281 182 272" stroke="#5ab828" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
        <path d="M188 289 Q189 280 190 271" stroke="#4aaa20" strokeWidth="1.5" fill="none" strokeLinecap="round"/>

        {/* ══ THE STICK ══ */}
        {/* Main perch stick — horizontal bar */}
        <path d="M100 210 Q170 205 240 210" stroke="#7a5020" strokeWidth="9" fill="none" strokeLinecap="round"/>
        <path d="M100 210 Q170 205 240 210" stroke="#9a7040" strokeWidth="5" fill="none" strokeLinecap="round" opacity="0.5"/>
        {/* Left support */}
        <path d="M118 210 Q112 240 108 278" stroke="#7a5020" strokeWidth="7" fill="none" strokeLinecap="round"/>
        <path d="M108 278 Q104 290 108 295" stroke="#5a3810" strokeWidth="6" fill="none" strokeLinecap="round"/>
        {/* Right support */}
        <path d="M222 210 Q228 240 232 278" stroke="#7a5020" strokeWidth="7" fill="none" strokeLinecap="round"/>
        <path d="M232 278 Q236 290 232 295" stroke="#5a3810" strokeWidth="6" fill="none" strokeLinecap="round"/>
        {/* Tiny branch nubs on stick */}
        <path d="M148 208 Q140 198 135 192" stroke="#7a5020" strokeWidth="3" fill="none" strokeLinecap="round"/>
        <path d="M192 207 Q200 196 205 190" stroke="#7a5020" strokeWidth="3" fill="none" strokeLinecap="round"/>

        {/* ══ BABY PARROT ══ */}
        <g transform="translate(170, 165)">
          {/* Fluffy body */}
          <ellipse cx="0" cy="18" rx="22" ry="26" fill="#4adc30"/>
          {/* Chest fluff */}
          <ellipse cx="0" cy="24" rx="16" ry="18" fill="#6aec50"/>
          <ellipse cx="0" cy="28" rx="12" ry="12" fill="#88f868"/>
          {/* Wing hints */}
          <path d="M-22 20 Q-30 12 -26 2 Q-18 12 -20 22" fill="#38b820"/>
          <path d="M22 20 Q30 12 26 2 Q18 12 20 22" fill="#38b820"/>
          {/* Wing detail */}
          <path d="M-20 18 Q-28 10 -24 2" stroke="#28a010" strokeWidth="1.5" fill="none" opacity="0.6"/>
          <path d="M20 18 Q28 10 24 2" stroke="#28a010" strokeWidth="1.5" fill="none" opacity="0.6"/>

          {/* Tail */}
          <path d="M-8 42 Q-10 56 -6 66" stroke="#38b820" strokeWidth="5" fill="none" strokeLinecap="round"/>
          <path d="M0 44 Q0 58 2 70" stroke="#4adc30" strokeWidth="5" fill="none" strokeLinecap="round"/>
          <path d="M8 42 Q10 56 8 66" stroke="#30a818" strokeWidth="4.5" fill="none" strokeLinecap="round"/>

          {/* Head — round, big baby head */}
          <circle cx="0" cy="-6" r="24" fill="#4adc30"/>
          <circle cx="0" cy="-8" r="20" fill="#5ae840"/>

          {/* Cheek patches — baby parrot characteristic */}
          <ellipse cx="-12" cy="-2" rx="7" ry="5" fill="#ff8888" opacity="0.85"/>
          <ellipse cx="12"  cy="-2" rx="7" ry="5" fill="#ff8888" opacity="0.85"/>

          {/* Eyes — big and round (baby eyes) */}
          <circle cx="-9" cy="-10" r="8.5" fill="white"/>
          <circle cx="9"  cy="-10" r="8.5" fill="white"/>
          <circle cx="-9" cy="-10" r="5.5" fill="#1a1a2e"/>
          <circle cx="9"  cy="-10" r="5.5" fill="#1a1a2e"/>
          {/* Pupils */}
          <circle cx="-8" cy="-11" r="3"  fill="#000010"/>
          <circle cx="10" cy="-11" r="3"  fill="#000010"/>
          {/* Eye shine */}
          <circle cx="-6.5" cy="-13" r="1.8" fill="white"/>
          <circle cx="11.5" cy="-13" r="1.8" fill="white"/>

          {/* Beak — tiny, hooked, open/gaping waiting-to-be-fed */}
          {/* Upper beak */}
          <path d="M-4 -1 Q0 2 4 -1 Q2 -6 0 -7 Q-2 -6 -4 -1Z" fill="#e8c020"/>
          {/* Lower beak (open) */}
          <path d="M-3 0 Q0 5 3 0 Q1 3 0 4 Q-1 3 -3 0Z" fill="#c8a010"/>
          {/* Inside mouth */}
          <path d="M-2 0 Q0 4 2 0" fill="#cc3010" opacity="0.8"/>

          {/* Head fluff tufts */}
          <path d="M-6 -29 Q-8 -38 -5 -44" stroke="#5ae840" strokeWidth="4" fill="none" strokeLinecap="round"/>
          <path d="M0 -30 Q0 -40 2 -46" stroke="#4adc30" strokeWidth="4" fill="none" strokeLinecap="round"/>
          <path d="M6 -29 Q8 -38 6 -44" stroke="#38c828" strokeWidth="3.5" fill="none" strokeLinecap="round"/>

          {/* Feet gripping the stick */}
          <path d="M-10 42 Q-14 48 -18 46" stroke="#c8a020" strokeWidth="3" fill="none" strokeLinecap="round"/>
          <path d="M-10 42 Q-12 50 -10 50" stroke="#c8a020" strokeWidth="3" fill="none" strokeLinecap="round"/>
          <path d="M-10 42 Q-6 50 -4 48" stroke="#c8a020" strokeWidth="3" fill="none" strokeLinecap="round"/>
          <path d="M10 42 Q14 48 18 46" stroke="#c8a020" strokeWidth="3" fill="none" strokeLinecap="round"/>
          <path d="M10 42 Q12 50 10 50" stroke="#c8a020" strokeWidth="3" fill="none" strokeLinecap="round"/>
          <path d="M10 42 Q6 50 4 48" stroke="#c8a020" strokeWidth="3" fill="none" strokeLinecap="round"/>

          {/* "Feed me!" sparkle lines / hungry aura */}
          <path d="M-30 -18 L-38 -24" stroke="#ffe040" strokeWidth="2" strokeLinecap="round" opacity="0.8"/>
          <path d="M-32 -10 L-42 -12" stroke="#ffe040" strokeWidth="2" strokeLinecap="round" opacity="0.7"/>
          <path d="M30 -18 L38 -24" stroke="#ffe040" strokeWidth="2" strokeLinecap="round" opacity="0.8"/>
          <path d="M32 -10 L42 -12" stroke="#ffe040" strokeWidth="2" strokeLinecap="round" opacity="0.7"/>
          <path d="M0 -32 L2 -42" stroke="#ffe040" strokeWidth="2" strokeLinecap="round" opacity="0.75"/>
        </g>

        {/* ══ "feed me!" speech bubble ══ */}
        <g transform="translate(218, 90)">
          <rect x="0" y="0" width="88" height="32" rx="14" fill="white" opacity="0.92"
                filter="drop-shadow(1px 2px 4px rgba(0,0,0,0.18))"/>
          {/* tail */}
          <path d="M20 30 L8 42 L30 30" fill="white" opacity="0.92"/>
          <text x="44" y="20" textAnchor="middle"
                fontFamily="'Fredoka', 'Arial Rounded MT Bold', sans-serif"
                fontWeight="700" fontSize="13" fill="#cc3010">
            feed me! 🍎
          </text>
        </g>

      </svg>
    </div>
  );
}

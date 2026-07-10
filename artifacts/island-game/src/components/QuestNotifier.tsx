/**
 * QuestNotifier — top-left quest widget
 *
 * Always shows the parrot/bush NPC icon.
 * When there is an active (uncompleted) quest it slides in a wooden
 * "NEW QUEST" arrow sign and, on hover, a speech bubble with the
 * quest title + "Click to view quest".
 */
import React, { useState } from 'react';
import { useGame } from '../game/GameContext';
import { QUESTS } from '../game/gameData';

/* ── Parrot-bush SVG icon ─────────────────────────────────────────────── */
const ParrotBushSVG = () => (
  <svg viewBox="0 0 84 84" xmlns="http://www.w3.org/2000/svg" width="84" height="84">
    {/* Drop shadow */}
    <ellipse cx="42" cy="80" rx="30" ry="5" fill="rgba(0,0,0,0.18)"/>

    {/* Bush — back layers */}
    <ellipse cx="42" cy="66" rx="36" ry="18" fill="#2a8018"/>
    <ellipse cx="28" cy="56" rx="24" ry="20" fill="#309e1e"/>
    <ellipse cx="56" cy="54" rx="22" ry="18" fill="#2e9a1c"/>

    {/* Bush — mid layers */}
    <ellipse cx="42" cy="50" rx="28" ry="22" fill="#3ab822"/>
    <ellipse cx="30" cy="42" rx="20" ry="18" fill="#44cc2c"/>
    <ellipse cx="54" cy="40" rx="18" ry="17" fill="#40c428"/>

    {/* Bush — top foliage */}
    <ellipse cx="42" cy="34" rx="22" ry="18" fill="#50d836"/>
    <ellipse cx="34" cy="26" rx="14" ry="13" fill="#58e040"/>
    <ellipse cx="50" cy="24" rx="13" ry="12" fill="#54dc3c"/>
    <ellipse cx="42" cy="20" rx="11" ry="10" fill="#62ea4a"/>

    {/* Red fruits */}
    <circle cx="22" cy="52" r="5"   fill="#e03020"/>
    <circle cx="60" cy="50" r="4.5" fill="#d82818"/>
    <circle cx="38" cy="62" r="4"   fill="#cc2010"/>
    <circle cx="62" cy="60" r="3.5" fill="#e03828"/>

    {/* Yellow fruits */}
    <circle cx="32" cy="44" r="3.5" fill="#f0d020"/>
    <circle cx="52" cy="58" r="3"   fill="#e8c818"/>

    {/* Pineapple silhouette (right side) */}
    <ellipse cx="68" cy="58" rx="6" ry="9" fill="#d4a020"/>
    <path d="M63 50 Q66 42 68 46" stroke="#38a822" strokeWidth="3" fill="none" strokeLinecap="round"/>
    <path d="M68 49 Q70 40 72 44" stroke="#30a018" strokeWidth="3" fill="none" strokeLinecap="round"/>
    <path d="M72 51 Q76 43 74 48" stroke="#38a822" strokeWidth="2.5" fill="none" strokeLinecap="round"/>

    {/* Banana bunch (left side) */}
    <path d="M18 44 Q10 36 14 26" stroke="#f0d020" strokeWidth="5" fill="none" strokeLinecap="round"/>
    <path d="M20 48 Q11 41 16 30" stroke="#e8c818" strokeWidth="4" fill="none" strokeLinecap="round"/>

    {/* ── Parrot ── */}
    {/* Body */}
    <ellipse cx="46" cy="18" rx="9" ry="10" fill="#22aa22"/>
    {/* Wing */}
    <path d="M37 16 Q28 20 32 30" stroke="#1a8a1a" strokeWidth="4" fill="none" strokeLinecap="round"/>
    {/* Tail feathers */}
    <path d="M46 27 Q40 34 38 42" stroke="#1e7a1e" strokeWidth="3" fill="none" strokeLinecap="round"/>
    <path d="M48 28 Q52 36 50 44" stroke="#228822" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
    {/* Head */}
    <circle cx="46" cy="9" r="8.5" fill="#dd2020"/>
    {/* Beak */}
    <path d="M51 10 Q57 12 53 16" stroke="#c09000" strokeWidth="1.5" fill="#f0b800" strokeLinecap="round"/>
    {/* Eye white */}
    <circle cx="43" cy="8" r="2.8" fill="white"/>
    <circle cx="43.5" cy="8.2" r="1.7" fill="#111"/>
    <circle cx="43" cy="7.6" r="0.7" fill="white"/>
    {/* Crest feathers */}
    <path d="M44 2 Q42 -3 46 1"  stroke="#ff6622" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
    <path d="M47 1 Q46 -4 50 0"  stroke="#ff9900" strokeWidth="2"   fill="none" strokeLinecap="round"/>
    <path d="M41 3 Q38 -2 43 2"  stroke="#ffcc00" strokeWidth="2"   fill="none" strokeLinecap="round"/>
  </svg>
);

/* ── Wooden arrow sign ────────────────────────────────────────────────── */
const NewQuestSign = () => (
  <svg
    viewBox="0 0 160 44"
    xmlns="http://www.w3.org/2000/svg"
    width="160"
    height="44"
    style={{ display: 'block', filter: 'drop-shadow(2px 3px 4px rgba(0,0,0,0.35))' }}
  >
    {/* Arrow-shaped wooden plank */}
    <path
      d="M4 4 L136 4 L156 22 L136 40 L4 40 Z"
      fill="#c8a050"
      stroke="#7a4c10"
      strokeWidth="2.5"
      strokeLinejoin="round"
    />
    {/* Wood grain highlight */}
    <path d="M4 4 L136 4 L156 22 L136 40 L4 40 Z" fill="url(#woodGrain)" opacity="0.18"/>
    <defs>
      <linearGradient id="woodGrain" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%"   stopColor="white"/>
        <stop offset="50%"  stopColor="transparent"/>
        <stop offset="100%" stopColor="rgba(0,0,0,0.2)"/>
      </linearGradient>
    </defs>
    {/* Grain lines */}
    <line x1="20" y1="8"  x2="120" y2="8"  stroke="#a07830" strokeWidth="1" opacity="0.4"/>
    <line x1="20" y1="22" x2="140" y2="22" stroke="#a07830" strokeWidth="1" opacity="0.3"/>
    <line x1="20" y1="36" x2="120" y2="36" stroke="#a07830" strokeWidth="1" opacity="0.4"/>
    {/* Nail dots */}
    <circle cx="14" cy="22" r="3" fill="#8a6020" stroke="#6a4010" strokeWidth="1"/>
    {/* Text */}
    <text
      x="78"
      y="28"
      textAnchor="middle"
      fontFamily="'Fredoka', 'Arial Black', sans-serif"
      fontWeight="900"
      fontSize="17"
      fill="#4a2800"
      letterSpacing="1.5"
    >
      NEW QUEST
    </text>
  </svg>
);

/* ── Speech bubble ────────────────────────────────────────────────────── */
const SpeechBubble = ({ title }: { title: string }) => (
  <div
    style={{
      position: 'absolute',
      top: 76,
      left: 0,
      background: 'white',
      border: '3px solid #c8a050',
      borderRadius: 12,
      padding: '8px 14px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
      whiteSpace: 'nowrap',
      zIndex: 30,
      fontFamily: "'Fredoka', sans-serif",
      minWidth: 200,
      pointerEvents: 'none',
    }}
  >
    {/* Tail pointing up-left */}
    <div
      style={{
        position: 'absolute',
        top: -12,
        left: 24,
        width: 0,
        height: 0,
        borderLeft: '10px solid transparent',
        borderRight: '10px solid transparent',
        borderBottom: '12px solid #c8a050',
      }}
    />
    <div
      style={{
        position: 'absolute',
        top: -9,
        left: 26,
        width: 0,
        height: 0,
        borderLeft: '8px solid transparent',
        borderRight: '8px solid transparent',
        borderBottom: '10px solid white',
      }}
    />
    <div style={{ fontWeight: 900, fontSize: 14, color: '#4a2800', textTransform: 'uppercase', letterSpacing: 0.5 }}>
      {title}
    </div>
    <div style={{ fontSize: 11, color: '#888', fontWeight: 600, marginTop: 2 }}>
      (Click to view quest)
    </div>
  </div>
);

/* ── Main component ───────────────────────────────────────────────────── */
export const QuestNotifier = ({ onOpenPanel }: { onOpenPanel: () => void }) => {
  const { state, dispatch } = useGame();
  const [hovered, setHovered] = useState(false);

  // First active (uncompleted, unlocked, prereqs met) quest
  const activeQuest = QUESTS.find(q =>
    state.level >= q.unlockLevel &&
    !state.quests[q.id]?.completed &&
    (!q.prereqs?.length || q.prereqs.every(pid => state.quests[pid]?.completed))
  );

  return (
    <div
      style={{
        position: 'absolute',
        top: 92,          // just below 88px top nav
        left: 8,
        zIndex: 20,
        display: 'flex',
        alignItems: 'center',
        gap: 4,
        cursor: 'pointer',
        userSelect: 'none',
      }}
      onClick={() => { dispatch({ type: 'TRACK', targetType: 'feed_parrot' }); onOpenPanel(); }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* ── Parrot bush icon ── */}
      <div
        style={{
          filter: 'drop-shadow(2px 3px 5px rgba(0,0,0,0.35))',
          transition: 'transform 0.15s',
          transform: hovered ? 'scale(1.08)' : 'scale(1)',
          flexShrink: 0,
          position: 'relative',
        }}
      >
        <ParrotBushSVG />
        {/* Pulse ring when there's an active quest */}
        {activeQuest && (
          <span
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: '50%',
              animation: 'ping 1.6s cubic-bezier(0,0,0.2,1) infinite',
              border: '3px solid rgba(255,200,0,0.7)',
              pointerEvents: 'none',
            }}
          />
        )}
      </div>

      {/* ── NEW QUEST sign (only when active quest exists) ── */}
      {activeQuest && (
        <div
          style={{
            animation: 'slideInSign 0.4s cubic-bezier(0.34,1.56,0.64,1) both',
          }}
        >
          <NewQuestSign />
        </div>
      )}

      {/* ── Speech bubble on hover ── */}
      {hovered && activeQuest && (
        <SpeechBubble title={activeQuest.title} />
      )}
    </div>
  );
};

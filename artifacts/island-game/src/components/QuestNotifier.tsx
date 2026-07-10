/**
 * QuestNotifier — NPC quest group display
 *
 * Shows one or more NPC icons (parrot, crab, palm tree) at the top-left
 * of the screen. Each NPC has stacked "NEW QUEST" signs for any quest
 * the player has not yet accepted. Clicking a sign accepts the quest and
 * opens the quest detail panel for that specific quest.
 *
 * NPCs disappear when all their quests are completed.
 * The second pair (crab + tree) appears after the first pair is done.
 */
import React from 'react';
import { useGame } from '../game/GameContext';
import { QUESTS, QUEST_GROUPS } from '../game/gameData';

/* ── Parrot-bush NPC ──────────────────────────────────────────────────── */
const ParrotNPC = () => (
  <svg viewBox="0 0 84 84" xmlns="http://www.w3.org/2000/svg" width="80" height="80">
    <ellipse cx="42" cy="80" rx="30" ry="5" fill="rgba(0,0,0,0.18)"/>
    <ellipse cx="42" cy="66" rx="36" ry="18" fill="#2a8018"/>
    <ellipse cx="28" cy="56" rx="24" ry="20" fill="#309e1e"/>
    <ellipse cx="56" cy="54" rx="22" ry="18" fill="#2e9a1c"/>
    <ellipse cx="42" cy="50" rx="28" ry="22" fill="#3ab822"/>
    <ellipse cx="30" cy="42" rx="20" ry="18" fill="#44cc2c"/>
    <ellipse cx="54" cy="40" rx="18" ry="17" fill="#40c428"/>
    <ellipse cx="42" cy="34" rx="22" ry="18" fill="#50d836"/>
    <ellipse cx="34" cy="26" rx="14" ry="13" fill="#58e040"/>
    <ellipse cx="50" cy="24" rx="13" ry="12" fill="#54dc3c"/>
    <ellipse cx="42" cy="20" rx="11" ry="10" fill="#62ea4a"/>
    <circle cx="22" cy="52" r="5"   fill="#e03020"/>
    <circle cx="60" cy="50" r="4.5" fill="#d82818"/>
    <circle cx="38" cy="62" r="4"   fill="#cc2010"/>
    <circle cx="62" cy="60" r="3.5" fill="#e03828"/>
    <circle cx="32" cy="44" r="3.5" fill="#f0d020"/>
    <circle cx="52" cy="58" r="3"   fill="#e8c818"/>
    <ellipse cx="68" cy="58" rx="6" ry="9" fill="#d4a020"/>
    <path d="M63 50 Q66 42 68 46" stroke="#38a822" strokeWidth="3" fill="none" strokeLinecap="round"/>
    <path d="M68 49 Q70 40 72 44" stroke="#30a018" strokeWidth="3" fill="none" strokeLinecap="round"/>
    <path d="M72 51 Q76 43 74 48" stroke="#38a822" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
    <path d="M18 44 Q10 36 14 26" stroke="#f0d020" strokeWidth="5" fill="none" strokeLinecap="round"/>
    <path d="M20 48 Q11 41 16 30" stroke="#e8c818" strokeWidth="4" fill="none" strokeLinecap="round"/>
    {/* Parrot */}
    <ellipse cx="46" cy="18" rx="9" ry="10" fill="#22aa22"/>
    <path d="M37 16 Q28 20 32 30" stroke="#1a8a1a" strokeWidth="4" fill="none" strokeLinecap="round"/>
    <path d="M46 27 Q40 34 38 42" stroke="#1e7a1e" strokeWidth="3" fill="none" strokeLinecap="round"/>
    <path d="M48 28 Q52 36 50 44" stroke="#228822" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
    <circle cx="46" cy="9" r="8.5" fill="#dd2020"/>
    <path d="M51 10 Q57 12 53 16" stroke="#c09000" strokeWidth="1.5" fill="#f0b800" strokeLinecap="round"/>
    <circle cx="43" cy="8" r="2.8" fill="white"/>
    <circle cx="43.5" cy="8.2" r="1.7" fill="#111"/>
    <circle cx="43" cy="7.6" r="0.7" fill="white"/>
    <path d="M44 2 Q42 -3 46 1"  stroke="#ff6622" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
    <path d="M47 1 Q46 -4 50 0"  stroke="#ff9900" strokeWidth="2"   fill="none" strokeLinecap="round"/>
    <path d="M41 3 Q38 -2 43 2"  stroke="#ffcc00" strokeWidth="2"   fill="none" strokeLinecap="round"/>
  </svg>
);

/* ── Crab NPC ──────────────────────────────────────────────────────────── */
const CrabNPC = () => (
  <svg viewBox="0 0 84 84" xmlns="http://www.w3.org/2000/svg" width="80" height="80">
    <ellipse cx="42" cy="80" rx="26" ry="5" fill="rgba(0,0,0,0.18)"/>
    {/* Left big claw */}
    <path d="M22 44 Q6 34 8 20 Q12 10 20 14" stroke="#bf2000" strokeWidth="6" fill="none" strokeLinecap="round"/>
    <ellipse cx="13" cy="12" rx="9" ry="6" fill="#e03020" stroke="#bf1800" strokeWidth="1.5"/>
    <ellipse cx="20" cy="17" rx="5" ry="4" fill="#e84030"/>
    {/* Right big claw */}
    <path d="M62 44 Q78 34 76 20 Q72 10 64 14" stroke="#bf2000" strokeWidth="6" fill="none" strokeLinecap="round"/>
    <ellipse cx="71" cy="12" rx="9" ry="6" fill="#e03020" stroke="#bf1800" strokeWidth="1.5"/>
    <ellipse cx="64" cy="17" rx="5" ry="4" fill="#e84030"/>
    {/* Legs */}
    <line x1="26" y1="52" x2="14" y2="66" stroke="#c82000" strokeWidth="3.5" strokeLinecap="round"/>
    <line x1="30" y1="56" x2="18" y2="70" stroke="#c82000" strokeWidth="3.5" strokeLinecap="round"/>
    <line x1="34" y1="58" x2="24" y2="72" stroke="#c82000" strokeWidth="3.5" strokeLinecap="round"/>
    <line x1="58" y1="52" x2="70" y2="66" stroke="#c82000" strokeWidth="3.5" strokeLinecap="round"/>
    <line x1="54" y1="56" x2="66" y2="70" stroke="#c82000" strokeWidth="3.5" strokeLinecap="round"/>
    <line x1="50" y1="58" x2="60" y2="72" stroke="#c82000" strokeWidth="3.5" strokeLinecap="round"/>
    {/* Body */}
    <ellipse cx="42" cy="48" rx="22" ry="16" fill="#e03020"/>
    <ellipse cx="42" cy="44" rx="20" ry="14" fill="#e84030"/>
    {/* Shell highlight */}
    <ellipse cx="42" cy="42" rx="14" ry="8" fill="rgba(255,100,60,0.35)"/>
    {/* Eye stalks */}
    <line x1="34" y1="34" x2="30" y2="26" stroke="#bf1800" strokeWidth="3" strokeLinecap="round"/>
    <line x1="50" y1="34" x2="54" y2="26" stroke="#bf1800" strokeWidth="3" strokeLinecap="round"/>
    {/* Eyes */}
    <circle cx="29" cy="24" r="6" fill="white" stroke="#bf1800" strokeWidth="1.5"/>
    <circle cx="55" cy="24" r="6" fill="white" stroke="#bf1800" strokeWidth="1.5"/>
    <circle cx="29" cy="24" r="3.5" fill="#111"/>
    <circle cx="55" cy="24" r="3.5" fill="#111"/>
    <circle cx="30.5" cy="22.5" r="1.5" fill="white"/>
    <circle cx="56.5" cy="22.5" r="1.5" fill="white"/>
  </svg>
);

/* ── Palm-tree NPC ─────────────────────────────────────────────────────── */
const TreeNPC = () => (
  <svg viewBox="0 0 84 84" xmlns="http://www.w3.org/2000/svg" width="80" height="80">
    <ellipse cx="42" cy="80" rx="20" ry="5" fill="rgba(0,0,0,0.18)"/>
    {/* Trunk */}
    <path d="M38 80 Q36 60 40 36 Q44 60 46 80Z" fill="#a07030"/>
    <path d="M38 80 Q36 60 40 36" stroke="#805820" strokeWidth="1.5" fill="none" opacity="0.5"/>
    {/* Coconuts */}
    <circle cx="38" cy="36" r="5.5" fill="#8a6020" stroke="#6a4810" strokeWidth="1"/>
    <circle cx="46" cy="33" r="5" fill="#8a6020" stroke="#6a4810" strokeWidth="1"/>
    {/* Fronds */}
    <path d="M40 34 Q22 20 10 24" stroke="#3a9818" strokeWidth="7" fill="none" strokeLinecap="round"/>
    <path d="M40 34 Q32 12 38 4"  stroke="#3a9818" strokeWidth="7" fill="none" strokeLinecap="round"/>
    <path d="M40 34 Q52 12 66 16" stroke="#3a9818" strokeWidth="7" fill="none" strokeLinecap="round"/>
    <path d="M40 34 Q56 26 70 32" stroke="#40a820" strokeWidth="6" fill="none" strokeLinecap="round"/>
    <path d="M40 34 Q24 28 12 38" stroke="#40a820" strokeWidth="6" fill="none" strokeLinecap="round"/>
    {/* Axe handle */}
    <rect x="55" y="50" width="5" height="26" rx="2.5" fill="#8a5020" transform="rotate(-20 57 63)"/>
    {/* Axe head */}
    <path d="M50 48 Q60 40 68 50 Q62 56 52 52Z" fill="#b0b0b0" stroke="#888" strokeWidth="1.2"/>
    <path d="M50 48 Q58 44 68 50" stroke="#d0d0d0" strokeWidth="2" fill="none" opacity="0.5"/>
  </svg>
);

const NPC_MAP: Record<string, React.FC> = { parrot: ParrotNPC, crab: CrabNPC, tree: TreeNPC };

/* ── Wooden arrow sign with quest icon ─────────────────────────────────── */
const QuestSign = ({ icon, onClick }: { icon: string; onClick: () => void }) => (
  <button
    onClick={onClick}
    className="active:scale-95 transition-transform"
    style={{
      background: 'none',
      border: 'none',
      padding: 0,
      cursor: 'pointer',
      position: 'relative',
      display: 'block',
      lineHeight: 0,
    }}
  >
    <svg
      viewBox="0 0 172 46"
      width="172"
      height="46"
      style={{ display: 'block', filter: 'drop-shadow(2px 3px 4px rgba(0,0,0,0.4))' }}
    >
      {/* Arrow-shaped plank */}
      <path
        d="M4 4 L142 4 L164 23 L142 42 L4 42 Z"
        fill="#c8a050"
        stroke="#7a4c10"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      {/* Top sheen */}
      <path d="M4 4 L142 4 L164 23 L142 42 L4 42 Z" fill="url(#nqGrad)" opacity="0.14"/>
      <defs>
        <linearGradient id="nqGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="white"/>
          <stop offset="60%" stopColor="transparent"/>
          <stop offset="100%" stopColor="rgba(0,0,0,0.15)"/>
        </linearGradient>
      </defs>
      {/* Grain lines */}
      <line x1="44" y1="9"  x2="136" y2="9"  stroke="#a07830" strokeWidth="1" opacity="0.35"/>
      <line x1="44" y1="23" x2="152" y2="23" stroke="#a07830" strokeWidth="1" opacity="0.25"/>
      <line x1="44" y1="37" x2="136" y2="37" stroke="#a07830" strokeWidth="1" opacity="0.35"/>
      {/* Icon backing circle */}
      <circle cx="24" cy="23" r="15" fill="#8a5808" stroke="#5a3808" strokeWidth="1.5"/>
      {/* Nail divider */}
      <circle cx="46" cy="23" r="3.2" fill="#7a5010" stroke="#5a3808" strokeWidth="1"/>
      {/* NEW QUEST text */}
      <text
        x="110"
        y="29"
        textAnchor="middle"
        fontFamily="'Fredoka', 'Arial Black', sans-serif"
        fontWeight="900"
        fontSize="15"
        fill="#4a2800"
        letterSpacing="2"
      >
        NEW QUEST
      </text>
    </svg>
    {/* Emoji icon overlaid on the circle */}
    <span
      style={{
        position: 'absolute',
        left: 10,
        top: '50%',
        transform: 'translateY(-50%)',
        fontSize: 20,
        lineHeight: 1,
        pointerEvents: 'none',
        userSelect: 'none',
      }}
    >
      {icon}
    </span>
  </button>
);

/* ── Main component ─────────────────────────────────────────────────────── */
export const QuestNotifier = ({ onOpenPanel }: { onOpenPanel: (questId: string) => void }) => {
  const { state, dispatch } = useGame();

  // Active groups: prereqs met AND at least one quest incomplete
  const activeGroups = QUEST_GROUPS.filter(group => {
    if (group.prereqs.some(pid => !state.quests[pid]?.completed)) return false;
    return group.quests.some(qid => !state.quests[qid]?.completed);
  });

  if (activeGroups.length === 0) return null;

  return (
    <div
      style={{
        position: 'absolute',
        top: 92,
        left: 8,
        zIndex: 20,
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        userSelect: 'none',
      }}
    >
      {activeGroups.map(group => {
        const NpcIcon = NPC_MAP[group.npcType] || ParrotNPC;

        // Signs only for quests not yet accepted AND not yet completed
        const newSigns = group.quests
          .map(qid => QUESTS.find(q => q.id === qid))
          .filter((q): q is NonNullable<typeof q> => !!q && !state.quests[q.id]?.completed && !state.quests[q.id]?.accepted);

        return (
          <div
            key={group.id}
            style={{ display: 'flex', alignItems: 'center', gap: 8 }}
          >
            {/* NPC icon with drop shadow + golden pulse ring when signs are available */}
            <div
              style={{
                position: 'relative',
                filter: 'drop-shadow(2px 4px 6px rgba(0,0,0,0.4))',
                flexShrink: 0,
              }}
            >
              <NpcIcon />
              {newSigns.length > 0 && (
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

            {/* Stacked NEW QUEST signs */}
            {newSigns.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                {newSigns.map(q => (
                  <QuestSign
                    key={q.id}
                    icon={q.icon}
                    onClick={() => {
                      dispatch({ type: 'ACCEPT_QUEST', questId: q.id });
                      onOpenPanel(q.id);
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

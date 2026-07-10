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
  <svg viewBox="0 0 84 84" xmlns="http://www.w3.org/2000/svg" width="46" height="46">
    {/* Shadow */}
    <ellipse cx="42" cy="81" rx="20" ry="4" fill="rgba(0,0,0,0.18)"/>

    {/* ── Branch / perch ── */}
    <rect x="16" y="70" width="52" height="7" rx="3.5" fill="#7a4a18"/>
    <rect x="16" y="70" width="52" height="3.5" rx="2" fill="#a06030"/>

    {/* ── Feet ── */}
    <line x1="34" y1="70" x2="28" y2="76" stroke="#c06020" strokeWidth="2.5" strokeLinecap="round"/>
    <line x1="34" y1="70" x2="32" y2="77" stroke="#c06020" strokeWidth="2.5" strokeLinecap="round"/>
    <line x1="34" y1="70" x2="36" y2="77" stroke="#c06020" strokeWidth="2.5" strokeLinecap="round"/>
    <line x1="50" y1="70" x2="44" y2="76" stroke="#c06020" strokeWidth="2.5" strokeLinecap="round"/>
    <line x1="50" y1="70" x2="48" y2="77" stroke="#c06020" strokeWidth="2.5" strokeLinecap="round"/>
    <line x1="50" y1="70" x2="52" y2="77" stroke="#c06020" strokeWidth="2.5" strokeLinecap="round"/>

    {/* ── Body ── */}
    <ellipse cx="42" cy="56" rx="20" ry="18" fill="#c83010"/>
    <ellipse cx="42" cy="53" rx="18" ry="16" fill="#e04020"/>
    {/* Body highlight */}
    <ellipse cx="38" cy="47" rx="8" ry="6" fill="rgba(255,120,60,0.38)" transform="rotate(-15 38 47)"/>

    {/* ── Green wing patch ── */}
    <ellipse cx="56" cy="57" rx="11" ry="9" fill="#2aaa18" transform="rotate(20 56 57)"/>
    <ellipse cx="55" cy="55" rx="8"  ry="6" fill="#38c020" transform="rotate(20 55 55)"/>
    <ellipse cx="54" cy="54" rx="5"  ry="3.5" fill="rgba(100,220,60,0.40)" transform="rotate(20 54 54)"/>

    {/* ── Tail feathers ── */}
    <path d="M30 70 Q22 76 20 82" stroke="#c02808" strokeWidth="5" fill="none" strokeLinecap="round"/>
    <path d="M33 71 Q28 79 27 84" stroke="#d83818" strokeWidth="4" fill="none" strokeLinecap="round"/>

    {/* ── Neck connector ── */}
    <ellipse cx="42" cy="40" rx="12" ry="8" fill="#d83818"/>

    {/* ── Head ── */}
    <circle cx="42" cy="30" r="17" fill="#c83010"/>
    <circle cx="42" cy="28" r="15" fill="#e04020"/>
    {/* Head highlight */}
    <ellipse cx="37" cy="22" rx="7" ry="5" fill="rgba(255,120,60,0.35)" transform="rotate(-20 37 22)"/>

    {/* ── Facial mask (pale orange cheek patch) ── */}
    <ellipse cx="42" cy="32" rx="10" ry="7" fill="#f06030" opacity="0.55"/>

    {/* ── Beak ── */}
    {/* Upper mandible */}
    <path d="M49 28 Q56 28 54 33 Q51 36 48 33Z" fill="#e8b800"/>
    <path d="M49 28 Q55 28 53 32" stroke="#c09000" strokeWidth="1" fill="none"/>
    {/* Lower mandible */}
    <path d="M49 32 Q53 34 51 36 Q48 36 48 33Z" fill="#d4a400"/>

    {/* ── Eyes ── */}
    <circle cx="38" cy="26" r="6.5" fill="white"/>
    <circle cx="38" cy="26" r="4.2" fill="#111"/>
    <circle cx="36.5" cy="24.5" r="1.8" fill="white"/>
    {/* Eye ring */}
    <circle cx="38" cy="26" r="6.5" fill="none" stroke="#b02808" strokeWidth="1.2"/>

    {/* ── Crest feathers — two golden balloon-like tufts ── */}
    {/* Left stem */}
    <line x1="37" y1="14" x2="34" y2="6"  stroke="#c09000" strokeWidth="2.2" strokeLinecap="round"/>
    {/* Right stem */}
    <line x1="43" y1="13" x2="46" y2="4"  stroke="#c09000" strokeWidth="2.2" strokeLinecap="round"/>
    {/* Left balloon */}
    <circle cx="34" cy="4"  r="5.5" fill="#f0c818"/>
    <circle cx="32.5" cy="2.5" r="2" fill="rgba(255,240,120,0.70)"/>
    <circle cx="34" cy="4"  r="5.5" fill="none" stroke="#c89800" strokeWidth="1"/>
    {/* Right balloon */}
    <circle cx="46" cy="2"  r="5.5" fill="#f0c818"/>
    <circle cx="44.5" cy="0.5" r="2" fill="rgba(255,240,120,0.70)"/>
    <circle cx="46" cy="2"  r="5.5" fill="none" stroke="#c89800" strokeWidth="1"/>
  </svg>
);

/* ── Crab NPC ──────────────────────────────────────────────────────────── */
const CrabNPC = () => (
  <svg viewBox="0 0 84 84" xmlns="http://www.w3.org/2000/svg" width="46" height="46">
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

/* ── Axe NPC (chop-tree group icon) ────────────────────────────────────── */
const TreeNPC = () => (
  <svg viewBox="0 0 84 84" xmlns="http://www.w3.org/2000/svg" width="46" height="46">
    <ellipse cx="42" cy="81" rx="22" ry="4.5" fill="rgba(0,0,0,0.20)"/>
    {/* Circular badge background */}
    <circle cx="42" cy="40" r="36" fill="#5a8030"/>
    <circle cx="42" cy="40" r="36" fill="none" stroke="#3a5820" strokeWidth="2.5"/>
    <circle cx="38" cy="36" r="36" fill="rgba(255,255,255,0.07)"/>
    {/* Handle — diagonal, bottom-right to upper-left */}
    <path d="M62,72 Q54,58 46,44 Q38,30 30,16"
      stroke="#7a4e1c" strokeWidth="9" fill="none" strokeLinecap="round"/>
    <path d="M62,72 Q54,58 46,44 Q38,30 30,16"
      stroke="#c08840" strokeWidth="5" fill="none" strokeLinecap="round" opacity="0.55"/>
    {/* Axe head — wide crescent blade at top of handle */}
    <path d="M14,6 Q8,10 7,19 Q6,28 11,34 Q16,40 23,36 Q30,38 34,30 Q38,20 32,12 Q26,6 14,6Z"
      fill="#8898b4"/>
    <path d="M14,6 Q8,10 7,19 Q6,28 11,34"
      stroke="#6070a0" strokeWidth="1.3" fill="none" opacity="0.7"/>
    {/* Blade shine */}
    <path d="M13,9 Q9,15 9,23"
      stroke="rgba(210,225,255,0.60)" strokeWidth="2.8" fill="none" strokeLinecap="round"/>
    <ellipse cx="24" cy="14" rx="4" ry="7" fill="rgba(200,215,255,0.20)" transform="rotate(25 24 14)"/>
    {/* Blade edge highlight */}
    <path d="M11,34 Q16,39 23,36"
      stroke="rgba(220,235,255,0.50)" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
    {/* Wood grain on handle */}
    <path d="M44,48 Q46,50 48,48" stroke="#5a3810" strokeWidth="0.9" fill="none" opacity="0.4"/>
    <path d="M50,58 Q52,60 54,58" stroke="#5a3810" strokeWidth="0.9" fill="none" opacity="0.4"/>
  </svg>
);

/* ── Fishing-rod NPC (fishing quest group icon) ─────────────────────────── */
const FishNPC = () => (
  <svg viewBox="0 0 84 84" xmlns="http://www.w3.org/2000/svg" width="46" height="46">
    <ellipse cx="42" cy="81" rx="22" ry="4.5" fill="rgba(0,0,0,0.20)"/>
    {/* Circular badge background — ocean blue */}
    <circle cx="42" cy="40" r="36" fill="#1282c4"/>
    <circle cx="42" cy="40" r="36" fill="none" stroke="#0a5890" strokeWidth="2.5"/>
    {/* Water in lower half */}
    <clipPath id="fcClip"><circle cx="42" cy="40" r="36"/></clipPath>
    <rect x="6" y="54" width="72" height="22" fill="#0e6eaa" clipPath="url(#fcClip)"/>
    {/* Water shimmer */}
    <path d="M8,55 Q18,52 28,55 Q38,58 48,55 Q58,52 76,55"
      stroke="rgba(140,220,255,0.50)" strokeWidth="1.8" fill="none" clipPath="url(#fcClip)"/>
    {/* ── Rod — diagonal from lower-left to upper-right ── */}
    {/* Cork grip (thick dark section at butt) */}
    <path d="M18,72 Q20,68 24,62"
      stroke="#5a3010" strokeWidth="8" fill="none" strokeLinecap="round"/>
    <path d="M18,72 Q20,68 24,62"
      stroke="#8a5828" strokeWidth="5" fill="none" strokeLinecap="round" opacity="0.7"/>
    {/* Main blank — tapers to tip */}
    <path d="M24,62 Q36,46 50,30 Q58,20 66,12"
      stroke="#7a5020" strokeWidth="5.5" fill="none" strokeLinecap="round"/>
    <path d="M24,62 Q36,46 50,30 Q58,20 66,12"
      stroke="#c09050" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.55"/>
    {/* Reel seat */}
    <ellipse cx="28" cy="58" rx="6" ry="4" fill="#4a4a60" transform="rotate(-45 28 58)"/>
    <ellipse cx="28" cy="58" rx="5" ry="3" fill="#6060a0" transform="rotate(-45 28 58)"/>
    {/* Guide rings along rod */}
    <circle cx="40" cy="42" r="2.8" fill="none" stroke="#888" strokeWidth="1.5"/>
    <circle cx="52" cy="28" r="2.2" fill="none" stroke="#888" strokeWidth="1.4"/>
    <circle cx="60" cy="18" r="1.6" fill="none" stroke="#888" strokeWidth="1.2"/>
    {/* ── Fishing line from tip curving down to water ── */}
    <path d="M66,12 Q68,28 62,44 Q60,52 58,58"
      stroke="rgba(220,240,255,0.85)" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
    {/* Hook */}
    <path d="M58,58 Q62,62 60,66 Q57,69 54,66"
      stroke="rgba(220,235,255,0.90)" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
    {/* Small fish on hook */}
    <ellipse cx="52" cy="64" rx="6" ry="3.5" fill="#ff7820" transform="rotate(20 52 64)"/>
    <path d="M57,61 Q60,64 57,67Z" fill="#ff9030" transform="rotate(20 57 64)"/>
    <circle cx="47" cy="63" r="1.4" fill="#1a1a1a" opacity="0.8"/>
    {/* Bubbles */}
    <circle cx="44" cy="58" r="2" fill="none" stroke="rgba(180,230,255,0.70)" strokeWidth="1.2"/>
    <circle cx="40" cy="50" r="1.4" fill="none" stroke="rgba(180,230,255,0.55)" strokeWidth="1"/>
  </svg>
);

/* ── Axe-stump NPC ─────────────────────────────────────────────────────── */
const AxeNPC = () => (
  <svg viewBox="0 0 84 84" xmlns="http://www.w3.org/2000/svg" width="46" height="46">
    <ellipse cx="42" cy="80" rx="30" ry="5" fill="rgba(0,0,0,0.18)"/>
    {/* Grass */}
    <ellipse cx="42" cy="74" rx="34" ry="11" fill="#3ab028"/>
    <ellipse cx="28" cy="72" rx="20" ry="8" fill="#44c030"/>
    <ellipse cx="56" cy="72" rx="18" ry="7" fill="#40bc2c"/>
    {/* Small grass blades */}
    <path d="M18,68 Q14,60 16,54" stroke="#4ccc34" strokeWidth="3" fill="none" strokeLinecap="round"/>
    <path d="M64,68 Q68,58 66,52" stroke="#4ccc34" strokeWidth="3" fill="none" strokeLinecap="round"/>
    {/* Coconut tree — upright, left side, behind stump */}
    {/* Trunk: straight up from grass to crown */}
    <path d="M13,73 Q12,55 13,38 Q14,22 13,8" stroke="#7a5020" strokeWidth="6"   fill="none" strokeLinecap="round"/>
    <path d="M13,73 Q12,55 13,38 Q14,22 13,8" stroke="#c09040" strokeWidth="3.5" fill="none" strokeLinecap="round" opacity="0.55"/>
    {/* Trunk ring marks */}
    <path d="M11,60 Q13,59 15,60" stroke="#5a3810" strokeWidth="1.2" fill="none" opacity="0.45"/>
    <path d="M11,50 Q13,49 15,50" stroke="#5a3810" strokeWidth="1.2" fill="none" opacity="0.45"/>
    <path d="M11,40 Q13,39 15,40" stroke="#5a3810" strokeWidth="1.2" fill="none" opacity="0.45"/>
    {/* Palm fronds fanning symmetrically from the crown */}
    <ellipse cx="13" cy="8" rx="18" ry="5"   fill="#28a818" transform="rotate(0   13 8)"/>
    <ellipse cx="13" cy="8" rx="17" ry="4.5" fill="#38c020" transform="rotate(-38 13 8)" opacity="0.92"/>
    <ellipse cx="13" cy="8" rx="17" ry="4.5" fill="#38c020" transform="rotate(38  13 8)" opacity="0.88"/>
    <ellipse cx="13" cy="8" rx="15" ry="4"   fill="#48d028" transform="rotate(-72 13 8)" opacity="0.82"/>
    <ellipse cx="13" cy="8" rx="15" ry="4"   fill="#48d028" transform="rotate(72  13 8)" opacity="0.78"/>
    <ellipse cx="13" cy="8" rx="13" ry="3.5" fill="#30b818" transform="rotate(-105 13 8)" opacity="0.70"/>
    {/* Coconuts clustered at crown base */}
    <circle cx="13" cy="11" r="3.5" fill="#c88820"/>
    <circle cx="17" cy="10" r="3.2" fill="#b87818"/>
    <circle cx="9"  cy="10" r="3"   fill="#d09028"/>
    {/* Stump body */}
    <rect x="18" y="40" width="48" height="32" rx="5" fill="#8a5020"/>
    {/* Stump top ring face */}
    <ellipse cx="42" cy="40" rx="24" ry="9" fill="#9a5a22"/>
    <ellipse cx="42" cy="40" rx="18" ry="6.5" fill="#a86428" opacity="0.85"/>
    <ellipse cx="42" cy="40" rx="11" ry="4" fill="#b87030" opacity="0.7"/>
    <ellipse cx="42" cy="40" rx="5.5" ry="2" fill="#c87838" opacity="0.6"/>
    {/* Stump side wood grain lines */}
    <path d="M26,44 Q25,56 26,64" stroke="#6a3a18" strokeWidth="1.5" fill="none" opacity="0.5"/>
    <path d="M56,44 Q57,56 56,64" stroke="#6a3a18" strokeWidth="1.5" fill="none" opacity="0.5"/>
    <path d="M35,43 Q34,57 35,66" stroke="#7a4820" strokeWidth="1" fill="none" opacity="0.35"/>
    {/* Flying wood chip left */}
    <path d="M18,42 Q12,36 14,28" stroke="#a06028" strokeWidth="3" fill="none" strokeLinecap="round"/>
    <ellipse cx="14" cy="27" rx="5" ry="3" fill="#b87030" transform="rotate(-35 14 27)"/>
    {/* Flying wood chip right */}
    <path d="M64,40 Q72,34 70,26" stroke="#8a5020" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
    <ellipse cx="70" cy="25" rx="4" ry="2.5" fill="#a06028" transform="rotate(25 70 25)"/>
    {/* Axe handle — diagonal, embedded in stump */}
    <path d="M60,4 Q58,14 54,26 Q51,34 48,42" stroke="#7a4e1c" strokeWidth="7" fill="none" strokeLinecap="round"/>
    <path d="M60,4 Q58,14 54,26 Q51,34 48,42" stroke="#c08840" strokeWidth="4" fill="none" strokeLinecap="round" opacity="0.55"/>
    {/* Axe head — steel blue-grey */}
    <path d="M36,4 Q30,6 28,13 Q26,21 30,27 Q34,33 40,29 Q46,31 50,23 Q54,15 48,9 Q44,5 36,4Z" fill="#8898B4"/>
    <path d="M36,4 Q30,6 28,13 Q26,21 30,27" stroke="#6070A0" strokeWidth="1.2" fill="none" opacity="0.7"/>
    {/* Blade shine */}
    <path d="M34,6 Q30,11 30,18" stroke="rgba(210,225,255,0.55)" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
    {/* Grape cluster on blade */}
    <circle cx="40" cy="20" r="3"   fill="#5535A8"/>
    <circle cx="44" cy="19" r="3"   fill="#5535A8"/>
    <circle cx="42" cy="16" r="3"   fill="#6848BB"/>
    <circle cx="38.5" cy="16.5" r="2.5" fill="#4828A0"/>
    <circle cx="39.5" cy="19.3" r="1.2" fill="rgba(255,255,255,0.55)"/>
    <circle cx="43.2" cy="18.3" r="1.2" fill="rgba(255,255,255,0.55)"/>
    {/* Grape stem + leaf */}
    <path d="M42,13.5 Q43,11 46,10" stroke="#3a7018" strokeWidth="1.4" fill="none" strokeLinecap="round"/>
    <ellipse cx="47" cy="9" rx="4.5" ry="2.8" fill="#4aA028" transform="rotate(-25 47 9)"/>
  </svg>
);

const NPC_MAP: Record<string, React.FC> = { parrot: ParrotNPC, crab: CrabNPC, tree: TreeNPC, fish: FishNPC, axe: AxeNPC };

/* ── Wooden arrow sign ──────────────────────────────────────────────────── */
const QuestSign = ({ onClick }: { onClick: () => void }) => (
  <button
    onClick={onClick}
    className="active:scale-95 transition-transform"
    style={{
      background: 'none',
      border: 'none',
      padding: 0,
      cursor: 'pointer',
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
      <defs>
        <linearGradient id="nqGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="white"/>
          <stop offset="60%" stopColor="transparent"/>
          <stop offset="100%" stopColor="rgba(0,0,0,0.15)"/>
        </linearGradient>
      </defs>
      {/* Arrow-shaped plank */}
      <path d="M4 4 L142 4 L164 23 L142 42 L4 42 Z" fill="#c8a050" stroke="#7a4c10" strokeWidth="2.5" strokeLinejoin="round"/>
      <path d="M4 4 L142 4 L164 23 L142 42 L4 42 Z" fill="url(#nqGrad)" opacity="0.14"/>
      {/* Grain lines */}
      <line x1="14" y1="9"  x2="136" y2="9"  stroke="#a07830" strokeWidth="1" opacity="0.35"/>
      <line x1="14" y1="23" x2="152" y2="23" stroke="#a07830" strokeWidth="1" opacity="0.25"/>
      <line x1="14" y1="37" x2="136" y2="37" stroke="#a07830" strokeWidth="1" opacity="0.35"/>
      {/* NEW QUEST text — centred in the plank */}
      <text
        x="80"
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
            {/* NPC icon — white glow pulse when new quests available */}
            <div
              style={{
                position: 'relative',
                flexShrink: 0,
                animation: newSigns.length > 0
                  ? 'questIconGlow 1.8s ease-in-out infinite'
                  : 'none',
                filter: newSigns.length > 0
                  ? undefined  // handled by animation
                  : 'drop-shadow(2px 4px 6px rgba(0,0,0,0.4))',
              }}
            >
              <NpcIcon />
            </div>

            {/* Stacked NEW QUEST signs — nudge leftward to gesture toward the icon */}
            {newSigns.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                {newSigns.map((q, i) => (
                  <div
                    key={q.id}
                    style={{
                      animation: `questSignNudge 2.2s ease-in-out ${i * 0.18}s infinite`,
                    }}
                  >
                    <QuestSign
                      onClick={() => {
                        dispatch({ type: 'ACCEPT_QUEST', questId: q.id });
                        onOpenPanel(q.id);
                      }}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

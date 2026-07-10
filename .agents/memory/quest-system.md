---
name: Island game quest system
description: NPC-grouped quest progression — parrot/crab/tree NPCs, acceptance gating, new quest data.
---

## Architecture

**Quest groups** (`QUEST_GROUPS` in gameData.ts): Each group has an `npcType` ('parrot'|'crab'|'tree'), a list of quest IDs it offers, and `prereqs` (quest IDs that must all be completed before this group's NPCs appear).

**Acceptance flow:**
1. Player sees NPC + stacked "NEW QUEST" arrow signs (one per quest)
2. Clicking a sign dispatches `ACCEPT_QUEST` (sets `accepted: true` on quest state) and opens `QuestPanel` for that quest
3. Signs disappear after acceptance; NPC remains until all its quests are `completed`
4. Progress is NOT tracked until `accepted: true` — gated via `GROUPED_QUEST_IDS` Set in GameContext

**Grouped quest IDs:** `q_fishing`, `q_clear`, `q_crab`, `q_chop` (legacy quests q1–q13 remain and auto-track as before)

**NPC unlock order:**
- Parrot (grp_parrot): always shown; quests: q_fishing + q_clear
- Crab (grp_crab): prereqs q_fishing + q_clear; quest: q_crab (300 coins, 15 XP, 2 FENCE)
- Tree (grp_tree): prereqs q_fishing + q_clear; quest: q_chop (150 coins, 10 XP, 3 wood)

## Key patterns

**Why acceptance gating matters:** Without it, a player could complete q_fishing by accidentally fishing 3 times before ever seeing the NPC, and the parrot NPC signs would never appear.

**How to apply:** Every new grouped quest must be added to QUEST_GROUPS and will automatically be gated. Do NOT manually add it to GROUPED_QUEST_IDS — that Set is derived from QUEST_GROUPS at module load.

**New tracking type:** `clear_driftwood` — tracked when DRIFTWOOD object is interacted with (GameContext INTERACT handler). Used by q_clear and q_chop objectives.

**rewardItems** (plural) on QuestDef: array of `{ type: ResourceType; count: number }`. Applied in `checkQuestCompletions` and displayed in QuestPanel alongside coins/XP. Legacy single `rewardItem` still works.

## selectedQuestId (Game.tsx)

- Opening via QuestNotifier (clicking NEW QUEST sign): sets `selectedQuestId` to the quest ID
- Opening via generic quest button (NeighborPanel): sets `selectedQuestId = null` → QuestPanel falls back to first active quest in QUEST_GROUPS order
- Closing panel always resets `selectedQuestId = null`

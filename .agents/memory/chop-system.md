---
name: Island game chop system
description: Tree-chopping HUD bar, avatar facing, swing animation, and 5-chop mechanic.
---

# Chop System

**Rule:** All trees require 5 chops (TREE_CHOPS must be updated in TWO places in GameContext.tsx — module-level const ~line 10 AND function-level const inside `interact()` ~line 754).

**Why:** The module-level const feeds the reducer; the function-level const feeds the `interact()` chop-tracking logic. Updating only one causes the system to show wrong chop counts.

**How to apply:** Any time tree chop counts change, search for both occurrences of `TREE_CHOPS` in GameContext.tsx and update both.

## Context fields added
- `activeChopTileId: string | null` — set on each intermediate chop, cleared on final chop and on any non-tree interact
- `chopCount: number` — incremented on every chop (used to trigger the character swing animation via useEffect watching this value)

## Key files
- `ChopProgressBar.tsx` — reads `activeChopTileId` + `state.tiles[id].treeHp` from context; shows circular SVG progress ring + "X/5 chops" label
- `IslandGrid.tsx` — reads `activeChopTileId`/`chopCount` from context; computes `chopFacing` (isometric screen-space decomposition: dsx = dx-dy, dsy = dx+dy); `isChopping` state driven by chopCount changes
- `CharacterOnIsland.tsx` — `isChopping` prop → `char-chop-swing` CSS class on a wrapper div with `key={isChopping ? 'chop' : 'idle'}` (key change forces re-animation)
- `index.css` — `@keyframes charChopSwing` + `.char-chop-swing` class (0.36s ease-out)

## treeHp logic
- `treeHp` = chops REMAINING after last hit; undefined = full HP (= maxChops)
- `chopsDone = MAX_CHOPS - (tile.treeHp ?? MAX_CHOPS)`
- First click: treeHp goes undefined → 4; chopsDone = 1
- Final click: reducer clears tile.object and treeHp; activeChopTileId set to null simultaneously

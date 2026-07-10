---
name: Island game crop-timer crash
description: Root cause and fix for the runtime crash in IslandTile when a saved cropType is unknown.
---

## The crash
`IslandTile.tsx` crop-timer block accessed `cc.growTime` / `cc.wiltTime` without checking if `cc` exists first:
```ts
const cc = CROP_TYPES[tile.cropType];     // could be undefined
const growTime = ... cc.growTime ...;      // TypeError if cc is undefined
```

If a player's localStorage has a `cropType` that no longer exists in `CROP_TYPES` (e.g. after a game data refactor, or stale/corrupted save), `cc` is `undefined` and the render throws `Cannot read properties of undefined`.

**Why:** The crop timer block has an outer guard `tile.cropType` (truthy string check) but NOT a guard for `CROP_TYPES[tile.cropType]` being a valid entry.

**How to apply:** Any time you add a new crop type or rename existing ones, also check for existing saved states. The fix is: `if (cc) { ... all cc accesses ... }` wrapping the timer calculation block.

## Fix applied
Wrapped the entire timer calculation in `if (cc)` so tiles with unknown crop types silently render without a badge rather than crashing.

---
name: Island game world layout
description: Grid size, ellipse formula, PRNG, world dimensions, and localStorage version for the 21×21 island.
---

## Island shape — ellipse formula
Grid is 21×21, center tile (10,10). Terrain uses iso-space ellipse:
```
sx = (x - y) * 32,  sy = (x + y) * 16 - 320
e  = sx²/255² + sy²/85²
e < 1     → GRASS
e < 1.35  → SAND
e < 1.8   → WATER (rendered)
e ≥ 1.8   → skipped (not in tiles map)
```

**Why:** Matches the HTML reference design that uses a wide/short elliptical island.

## Seeded PRNG decoration placement
LCG constants (matching HTML reference): `seed = (seed * 9301 + 49297) % 233280`.
Iteration: y outer, x inner over all 21×21.
- Water tiles (t=0): 0 rand() calls (critical for parity)
- Grass tiles: 1-2 rand() calls (tree 10%, then flower 8%)
- Sand tiles: 1-2 rand() calls (rock 8%, then driftwood 5%)

**Why:** Matches HTML reference's deterministic decoration layout.

## World dimensions & centering
- `WORLD_W = 880, WORLD_H = 640`
- `OX = WORLD_W/2 = 440, OY = 0`
- Center tile (10,10): `isoScreenX=440, isoScreenY=320 = WORLD_H/2`
- Game.tsx initial transform: `translate(-WORLD_CX, -WORLD_CY)` centers tile (10,10) in viewport

## Player start
`PLAYER_START = { x: 10, y: 10 }` — guaranteed GRASS (e=0 at center).

## localStorage
State key is `island-game-state-v6`. Bump version to force fresh island generation when terrain changes.

## New object type: DRIFTWOOD
Sand-tile decoration (5% probability). Interactive: clearable, drops 1 wood, respawns. Renders as SVG planks (not emoji). Fully wired in types.ts, gameData.ts (OBJECT_CONFIG + EMOJI_MAP), and IslandTile (ObjectSVG).

---
name: Island game world layout
description: Tile grid dimensions, world container size, iso projection constants — all must change together.
---

## Current values (as of grid expansion)

| Constant | Value | Where |
|---|---|---|
| GRID | 31 | gameData.ts `generateIsland` |
| Center tile | (15, 15) | gameData.ts |
| Ellipse radii | 500 (x), 160 (y) | gameData.ts |
| originX | 0 | gameData.ts (cx=cy so always 0) |
| originY | 480 | gameData.ts = (15+15)*16 |
| TW (gameData) | 64 | gameData.ts (used for island gen only) |
| TH (gameData) | 32 | gameData.ts (used for island gen only) |
| TW (IslandGrid) | 80 | IslandGrid.tsx (rendering) |
| TH (IslandGrid) | 28 | IslandGrid.tsx (rendering) |
| WORLD_W | 2200 | IslandGrid.tsx |
| WORLD_H | 1000 | IslandGrid.tsx |
| OX | 1100 (= WORLD_W/2) | IslandGrid.tsx |
| OY | 80 | IslandGrid.tsx; tile (15,15) → screenY=420+80=500=WORLD_H/2 |
| PLAYER_START | { x:15, y:15 } | Game.tsx |
| localStorage key | island-game-state-v8 | GameContext.tsx |
| INITIAL_ZOOM | 2.0 | Game.tsx |
| MIN_ZOOM | 0.4 | Game.tsx |
| MAX_ZOOM | 3.2 | Game.tsx |

**Why:** All four groups (gameData GRID/origin, IslandGrid WORLD/TW/TH/OY, Game PLAYER_START, GameContext localStorage key) must change together whenever the island is resized, or tiles will be misaligned and saved state will use stale coordinates.

**How to apply:** When changing grid size, recalculate:
- originY = (cx+cy) * (TH_gamedata/2)
- OY = WORLD_H/2 - (cx+cy) * (TH_IslandGrid/2)
- Bump localStorage key version
- Update PLAYER_START to new center

## Ocean immersion (added with grid expansion)
- Viewport div has a deep-blue radial gradient background (fallback ocean)
- IslandGrid world div has a `zIndex:0` ocean radial gradient fill covering the full world canvas
- `clampPan(px, py, z)` in Game.tsx prevents panning past world bounds when scaled dimension ≥ viewport dimension, so no void/white is ever visible when zoomed in

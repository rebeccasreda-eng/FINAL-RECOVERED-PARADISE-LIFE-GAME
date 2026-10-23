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
| INITIAL_ZOOM | 2.0 | Game.tsx |
| MIN_ZOOM | 0.4 | Game.tsx |
| MAX_ZOOM | 3.2 | Game.tsx |

**Why:** All four groups (gameData GRID/origin, IslandGrid WORLD/TW/TH/OY, Game PLAYER_START, GameContext localStorage key) must change together whenever the island is resized, or tiles will be misaligned and saved state will use stale coordinates.

**How to apply:** When changing grid size, recalculate:
- originY = (cx+cy) * (TH_gamedata/2)
- OY = WORLD_H/2 - (cx+cy) * (TH_IslandGrid/2)
- Bump localStorage key version
- Update PLAYER_START to new center

## Reference island composition

Match the supplied layout image with an open center, a narrow sand fringe beside broad surrounding water, one curved inlet from the screen-left shore to the dock at the player's vertical band, and a small lagoon toward the upper-right. Keep most fruit trees in a dense back line with only lighter side groves.

**Why:** The user asked for the water-to-sand ratio and back-heavy tree placement to match the supplied island screenshot.

**How to apply:** Keep future layout changes aligned with that composition. Apply terrain and scenery updates to saved worlds without resetting inventory, quests, object state, or player-built structures.

## Flower and rock clusters
Group natural flowers and rocks into small, distinct clusters around the outer grass and shoreline, leaving the center and main walking area open. When updating saved islands, move queued respawns with their scenery and preserve counts and timers.

**Why:** The user wants the existing island's scattered flowers and rocks arranged to match the supplied layout.

**How to apply:** Treat this as a one-time saved-world scenery migration; preserve inventory, quests, and player-built structures.

## Tree art identity
Render the island's palm/coconut family as banana trees and its apple/mango family as orange trees, using the supplied-reference art style while retaining the existing internal interaction types.

**Why:** The user wants the island populated with the two recognizable fruit-tree designs from their reference without breaking existing harvesting, quests, saves, or respawn logic.

**How to apply:** Keep internal object IDs for compatibility, but use banana/orange visuals and user-facing labels consistently.

## Environment art direction
Use the supplied island reference for a compact row of rounded palms along the back, mixed with the fruit trees and conifer; keep the ringed palm trunks muted brown with visible horizontal bark texture, blue water, and textured grass. Do not add a default pre-placed hut.

**Why:** The latest reference asks for smaller trees arranged at the back and trunks that match the darker brown reference, while keeping the pre-placed hut removed.

**How to apply:** Layer the rounded canopy over the textured trunk at a shared base anchor; keep fruit, pine, and palm trees at a compact, consistent scale, with several decorative palms spread across the back row. Preserve player-built `HUT` structures and inventory, but remove `ISLAND_HUT` from new and saved island tiles.

Use screenshot-derived image sprites, rather than newly drawn SVG substitutes, for visible natural scenery such as fenced gardens, fruit plants, flowers, and rocks.

**Why:** The user explicitly wants the supplied reference artwork carried into the game assets.

**How to apply:** Preserve object IDs and interactions, but map their renderers to clean transparent image assets extracted from the supplied references.

Place a few low, dry branch clusters near tropical-flower groups using the supplied cutout asset.

**Why:** The user asked to add the supplied branchy ground plant to the island.

**How to apply:** Keep it separate from the removed tall weeds and thorn plants; add it near tropical flowers on new and saved islands without resetting progress.

Keep pineapples only inside the fenced garden patches; do not place standalone pineapple plants elsewhere on the island.

**Why:** The user wants the pineapple plants outside the gate removed while retaining the fenced pineapple garden.

**How to apply:** Exclude standalone pineapple plants from new island generation and remove them from saved tiles and respawn queues without changing garden patches, quests, inventory, or other progress.

Render the supplied dock as a transparent standalone sprite rather than displaying the reference screenshot with its original terrain background or pointer overlay.

**Why:** The user wants the dock to look integrated with the island instead of like a pasted rectangular image.

**How to apply:** Preserve the dock's interaction and placement while compositing only its boat, planks, posts, flag, supplies, and life ring over the live game terrain.

Render fruit, pine, and palm tree sprites at the same compact visible height, and scale smaller plant sprites up while keeping every source image proportional and anchored at its base.

**Why:** The user first requested equal tree heights, then clarified that the trees should be smaller like the latest reference; plant scaling remains separate.

**How to apply:** Keep the visible height of fruit trees, conifers, and palm trunks equal at the latest smaller reference scale; adjust their widths to preserve source proportions and anchor them at the base. Scale flowers, bushes, crop icons, and fenced garden patches with enclosed plants, while keeping other non-plant scenery at its current size.

Keep grass tiles free of drawn contour strokes and shadow-like dark patches. Use the latest supplied bright yellow-green swatch as the shared base color, with only faint, softly curved texture variation. Use warm, fine-grain sand without repeated ripple lines.

**Why:** The user asked for grass texture closer to the supplied reference, with subtle curved variation but no shadows, then asked for one coherent color without conspicuous patches and supplied a brighter yellow-green swatch as the exact grass color; they also asked to remove grass lines and repeated sand ripples.

**How to apply:** Preserve terrain color transitions and shoreline effects, derive the grass base and edge blends from the latest swatch, keep texture low-opacity, avoid dark per-tile outlines or shadow tones, and use irregular subtle sand grains.

Align terrain patterns to the isometric world coordinates and use shared flat base colors so adjacent tiles read as continuous terrain rather than outlined grid cells.

**Why:** The user asked for every tile to blend together without square outlines.

**How to apply:** Keep grass, sand, and water texture phases continuous across neighboring tile faces; avoid per-tile gradients or texture resets that reveal the grid.

Do not highlight tiles or show hover-only markers when the pointer passes over the island. Clicking any ground point should set one destination and path the character there; do not require repeated clicks from tile to tile. Preserve obstacle collision and object interactions.

**Why:** The user asked to remove tile hover visuals and clarified that movement should follow a click anywhere on the island rather than requiring tile-by-tile clicks.

**How to apply:** Keep hover visuals disabled; resolve open-ground clicks to the nearest tile and use the existing pathfinder. Never path through blocked trees, plants, rocks, or structures, and keep object clicks mapped to their existing interactions.

Avoid the old standalone clearable tall-weed clumps and radiating thorn plants in island scenery; keep them out of new and saved maps. Add the supplied narrow grass sprigs directly at tropical-flower bases, keep low rounded grass around rocks/flowers, and use edge-grass selectively along grass-to-sand borders.

**Why:** The user asked to remove standalone spiky weeds and thorns, but separately wants the thin weed-like blades shown in the flower reference attached to the tropical flower itself.

**How to apply:** Keep standalone weed/thorn objects absent from new and saved maps. Render the flower-base blades as part of `FLOWER_BUSH` artwork so they do not restore interactable weed tiles or block movement; keep shoreline grass non-blocking.

Do not place the circular decorative puddle objects on the island.

**Why:** The user asked to remove the small blue puddle sprites from the island while keeping the surrounding water terrain.

**How to apply:** Exclude `PUDDLE` from new island generation and strip it from saved tiles and pending respawns; preserve shoreline and water tiles.

Render plantable and cleared tiles using their underlying grass or sand terrain, with no brown ground patches; keep initial trees moved onto the former crop-plot locations.

**Why:** The user later asked to remove all brown patches and replace them with grass or sand.

**How to apply:** Keep `CROP_PLOT` and `CLEARED_LAND` interactions, but draw the tile's native terrain and texture; move existing trees rather than duplicating them, and restore cleared land after a moved non-regrowing tree is felled.

## Ocean immersion (added with grid expansion)
- Viewport div has a deep-blue radial gradient background (fallback ocean)
- IslandGrid world div has a `zIndex:0` ocean radial gradient fill covering the full world canvas
- `clampPan(px, py, z)` in Game.tsx prevents panning past world bounds when scaled dimension ≥ viewport dimension, so no void/white is ever visible when zoomed in

Use asymmetrical, square-edged blue texture patches that vary by water tile while keeping the shoreline and soft wave highlights.

**Why:** The user asked for water texture to match the reference's varied, uneven block-like surface.

**How to apply:** Keep the water blue base and shoreline geometry, but vary subtle patch shapes and tones deterministically per tile.

## Top HUD panel
Match the supplied top-panel reference with warm wood framing, raised cream resource plaques, and bright blue energy and gold XP meters. Keep displayed counts connected to live game state and the layout responsive.

**Why:** The user wants the game's top navigation and resource panel to use the look and colors from the supplied game screenshot.

**How to apply:** Keep the header styling in TopNav/HUD, preserve real resource values and existing modal/actions, and avoid treating the reference screenshot itself as a static background.

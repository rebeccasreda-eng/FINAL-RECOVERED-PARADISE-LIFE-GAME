---
name: Island game ripening system
description: Coconut and mango trees start unripe and ripen over time before becoming harvestable.
---

## Rule
TREE_COCONUT and TREE_MANGO trees now spawn as TREE_COCONUT_UNRIPE / TREE_MANGO_UNRIPE and must ripen before harvest. They are NOT in TREE_CHOPS (single-tap harvest once ripe). Save key is **v15**.

## Key constants
- `COCONUT_RIPEN_TIME = SCALED(90000)` — 90 s
- `MANGO_RIPEN_TIME   = SCALED(120000)` — 120 s

## Flow
1. World-gen places unripe variants with staggered `ripensAt = now + rand() * ripenTime` (only for unripe types — not TREE_APPLE).
2. TICK scans every tile: if unripe + no ripensAt → set `ripensAt = now + ripenTime` (defensive); if now ≥ ripensAt → convert to ripe type.
3. INTERACT: if `config.action === 'Wait'` → block in both reducer (early return) and interact() helper (show toast "Not ripe yet / Ripens in Xm Ys").
4. After harvest, respawn pushes unripe variant; TICK respawn handler sets `ripensAt = now + ripenTime` for the new unripe tile.

**Why:** The defensive ripensAt init in TICK prevents permanently-stuck unripe trees from malformed/old saves.

## Render
Both unripe SVGs are in IslandTile.tsx case blocks: same tree structure as ripe variants but green fruit (no red blush on mango). Added to SVG_OBJECTS and SWAY_OBJECTS sets. CHOP_TREES now only has TREE_PALM and TREE_APPLE.

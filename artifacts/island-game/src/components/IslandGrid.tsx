import React, { useMemo, useState, useEffect } from 'react';
import { useGame } from '../game/GameContext';
import { IslandTile } from './IslandTile';
import { CharacterOnIsland } from './CharacterOnIsland';
import type { CharacterWalkFrames } from './CharacterOnIsland';

/* ── Isometric projection ──────────────────────────────────────────────── */
const TW = 80;   // tile width  (wider → more horizontal look)
const TH = 28;   // tile diamond height (flatter → more horizontal look)

export const GRID_COLS = 31;
export const GRID_ROWS = 31;

// World container size (px) — sized to contain the 31×31 elliptical island
// Center tile (15,15): screenY = (15+15)*(TH/2) = 30*14 = 420; OY=80 → 500 = WORLD_H/2 ✓
export const WORLD_W = 2200;
export const WORLD_H = 1000;

// Iso origin — tile (tx,ty) maps to:
//   screenX = (tx-ty)*(TW/2) + OX
//   screenY = (tx+ty)*(TH/2) + OY
// Center tile (15,15): screenX = 0+1100 = 1100 = WORLD_W/2 ✓
//                      screenY = 420+80 = 500 = WORLD_H/2 ✓
const OX = WORLD_W / 2;   // 1100
const OY = 80;             // tile (15,15) lands at screenY=500 = WORLD_H/2

/** Screen X of tile (tx, ty) within the world div */
export function isoScreenX(tx: number, ty: number): number {
  return (tx - ty) * (TW / 2) + OX;
}
/** Screen Y of tile (tx, ty) within the world div */
export function isoScreenY(tx: number, ty: number): number {
  return (tx + ty) * (TH / 2) + OY;
}

/** Convert a world-space click point to the nearest isometric tile. */
export function isoWorldToTile(worldX: number, worldY: number): { x: number; y: number } {
  // The tile coordinates point at the top vertex; shift the click to the
  // diamond center before finding the nearest tile center.
  const centerY = worldY - TH / 2;
  const isoX = (worldX - OX) / (TW / 2);
  const isoY = (centerY - OY) / (TH / 2);
  const guessX = (isoX + isoY) / 2;
  const guessY = (isoY - isoX) / 2;
  let nearest = { x: Math.round(guessX), y: Math.round(guessY) };
  let nearestDistance = Infinity;

  for (let x = Math.floor(guessX) - 1; x <= Math.ceil(guessX) + 1; x++) {
    for (let y = Math.floor(guessY) - 1; y <= Math.ceil(guessY) + 1; y++) {
      const dx = isoScreenX(x, y) - worldX;
      const dy = isoScreenY(x, y) + TH / 2 - worldY;
      const distance = dx * dx + dy * dy;
      if (distance < nearestDistance) {
        nearest = { x, y };
        nearestDistance = distance;
      }
    }
  }

  return nearest;
}

/* ── Props ─────────────────────────────────────────────────────────────── */
interface IslandGridProps {
  playerX: number;
  playerY: number;
  characterId: string;
  facing: 'front' | 'back' | 'left' | 'right';
  isMoving?: boolean;
  walkingFrames?: CharacterWalkFrames;
  onTileClick: (x: number, y: number, interactTileId?: string) => void;
}

/* ── IslandGrid ─────────────────────────────────────────────────────────── */
export const IslandGrid: React.FC<IslandGridProps> = ({
  playerX, playerY, characterId, facing, isMoving = false, walkingFrames, onTileClick,
}) => {
  const { state, activeChopTileId, chopCount, shovelCount } = useGame();

  // ── Tool-action animation pulses ──
  const [isChopping, setIsChopping] = useState(false);
  const [isShoveling, setIsShoveling] = useState(false);
  useEffect(() => {
    if (chopCount === 0) return;
    setIsChopping(true);
    setIsShoveling(false);
    const t = setTimeout(() => setIsChopping(false), 380);
    return () => clearTimeout(t);
  }, [chopCount]);
  useEffect(() => {
    if (shovelCount === 0) return;
    setIsShoveling(true);
    setIsChopping(false);
    const t = setTimeout(() => setIsShoveling(false), 440);
    return () => clearTimeout(t);
  }, [shovelCount]);

  // ── Compute facing toward the tree being chopped ──
  const chopFacing = useMemo((): 'front' | 'back' | 'left' | 'right' | null => {
    if (!activeChopTileId) return null;
    const [tx, ty] = activeChopTileId.split(',').map(Number);
    const dx = tx - Math.round(playerX);
    const dy = ty - Math.round(playerY);
    // Isometric screen-space decomposition
    const dsx = dx - dy;
    const dsy = dx + dy;
    if (Math.abs(dsx) >= Math.abs(dsy)) {
      return dsx >= 0 ? 'right' : 'left';
    }
    return dsy >= 0 ? 'front' : 'back';
  }, [activeChopTileId, playerX, playerY]);

  const activeFacing: 'front' | 'back' | 'left' | 'right' = chopFacing ?? facing;

  const dangerZoneTiles = useMemo(() => {
    const danger = new Set<string>();
    const enemies = Object.values(state.tiles).filter(
      t => (t.object === 'CRAB' || t.object === 'BOAR') && t.crabHp && t.crabHp > 0
    );
    for (const enemy of enemies) {
      for (let dx = -1; dx <= 1; dx++) {
        for (let dy = -1; dy <= 1; dy++) {
          if (dx === 0 && dy === 0) continue;
          danger.add(`${enemy.x + dx},${enemy.y + dy}`);
        }
      }
    }
    return danger;
  }, [state.tiles]);

  const tiles = useMemo(() => Object.values(state.tiles), [state.tiles]);

  const showChar = playerX >= 0 && playerX < GRID_COLS && playerY >= 0 && playerY < GRID_ROWS;
  // Keep the entire player portrait above tile art so nearby scenery cannot
  // cover parts of the character while changing direction or walking.
  const charZ = (GRID_COLS + GRID_ROWS) * 2 + 1;

  return (
    <div
      style={{
        position: 'relative',
        width: WORLD_W,
        height: WORLD_H,
        userSelect: 'none',
      }}
    >
      {/* Ocean fill — covers the world canvas so "outside tiles" = open sea */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: '#1fa8e8',
          zIndex: 0,
        }}
      />
      {tiles.map(tile => (
        <IslandTile
          key={tile.id}
          tile={tile}
          screenX={isoScreenX(tile.x, tile.y)}
          screenY={isoScreenY(tile.x, tile.y)}
          tileZIndex={(tile.x + tile.y) * 2}
          isDangerZone={dangerZoneTiles.has(tile.id)}
          onTileClick={onTileClick}
          playerX={playerX}
          playerY={playerY}
          nbN={state.tiles[`${tile.x - 1},${tile.y}`]?.type}
          nbE={state.tiles[`${tile.x},${tile.y - 1}`]?.type}
          nbS={state.tiles[`${tile.x + 1},${tile.y}`]?.type}
          nbW={state.tiles[`${tile.x},${tile.y + 1}`]?.type}
        />
      ))}

      {showChar && (
        <CharacterOnIsland
          screenX={isoScreenX(playerX, playerY)}
          screenY={isoScreenY(playerX, playerY)}
          tileZIndex={charZ}
          characterId={characterId}
          facing={activeFacing}
          isMoving={isMoving}
          walkingFrames={walkingFrames}
          isChopping={isChopping}
          isShoveling={isShoveling}
        />
      )}
    </div>
  );
};

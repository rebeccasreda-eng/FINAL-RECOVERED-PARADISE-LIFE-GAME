import React, { useMemo } from 'react';
import { useGame } from '../game/GameContext';
import { IslandTile } from './IslandTile';
import { CharacterOnIsland } from './CharacterOnIsland';

/* ── Isometric projection ──────────────────────────────────────────────── */
const TW = 64;   // tile width
const TH = 32;   // tile diamond height

export const GRID_COLS = 21;
export const GRID_ROWS = 21;

// World container size (px) — sized to contain the 21×21 elliptical island
// Center tile (10,10) is at (OX, 320+OY) = (440, 320) = (WORLD_W/2, WORLD_H/2)
// so island is visually centred on load.
export const WORLD_W = 880;
export const WORLD_H = 640;

// Iso origin — tile (tx,ty) maps to:
//   screenX = (tx-ty)*(TW/2) + OX
//   screenY = (tx+ty)*(TH/2) + OY
// Center tile (10,10): screenX = 0+440 = 440, screenY = 320+0 = 320
// → equals (WORLD_W/2, WORLD_H/2) ✓
const OX = WORLD_W / 2;   // 440
const OY = 0;              // tile (10,10) lands at screenY=320 = WORLD_H/2

/** Screen X of tile (tx, ty) within the world div */
export function isoScreenX(tx: number, ty: number): number {
  return (tx - ty) * (TW / 2) + OX;
}
/** Screen Y of tile (tx, ty) within the world div */
export function isoScreenY(tx: number, ty: number): number {
  return (tx + ty) * (TH / 2) + OY;
}

/* ── Props ─────────────────────────────────────────────────────────────── */
interface IslandGridProps {
  playerX: number;
  playerY: number;
  characterId: string;
  isWalking: boolean;
  facing: 'left' | 'right';
  onTileClick: (x: number, y: number) => void;
}

/* ── IslandGrid ─────────────────────────────────────────────────────────── */
export const IslandGrid: React.FC<IslandGridProps> = ({
  playerX, playerY, characterId, isWalking, facing, onTileClick,
}) => {
  const { state } = useGame();

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
  const charZ   = Math.round(playerX + playerY) * 2 + 1;

  return (
    <div
      style={{
        position: 'relative',
        width: WORLD_W,
        height: WORLD_H,
        userSelect: 'none',
      }}
    >
      {tiles.map(tile => (
        <IslandTile
          key={tile.id}
          tile={tile}
          screenX={isoScreenX(tile.x, tile.y)}
          screenY={isoScreenY(tile.x, tile.y)}
          tileZIndex={(tile.x + tile.y) * 2}
          isDangerZone={dangerZoneTiles.has(tile.id)}
          onTileClick={onTileClick}
        />
      ))}

      {showChar && (
        <CharacterOnIsland
          screenX={isoScreenX(playerX, playerY)}
          screenY={isoScreenY(playerX, playerY)}
          tileZIndex={charZ}
          characterId={characterId}
          isWalking={isWalking}
          facing={facing}
        />
      )}
    </div>
  );
};

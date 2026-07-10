import React, { useMemo } from 'react';
import { useGame } from '../game/GameContext';
import { IslandTile } from './IslandTile';
import { CharacterOnIsland } from './CharacterOnIsland';

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

/* ── Props ─────────────────────────────────────────────────────────────── */
interface IslandGridProps {
  playerX: number;
  playerY: number;
  characterId: string;
  isWalking: boolean;
  facing: 'front' | 'back' | 'left' | 'right';
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
          isWalking={isWalking}
          facing={facing}
        />
      )}
    </div>
  );
};

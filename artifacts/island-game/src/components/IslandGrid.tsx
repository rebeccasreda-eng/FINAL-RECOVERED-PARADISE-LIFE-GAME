import React, { useMemo } from 'react';
import { useGame } from '../game/GameContext';
import { IslandTile } from './IslandTile';
import { CharacterOnIsland } from './CharacterOnIsland';

/* ── Cloud SVG ─────────────────────────────────────────────────────────── */
const CloudSVG = ({ opacity = 0.92 }: { opacity?: number }) => (
  <svg viewBox="0 0 160 70" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block' }}>
    <ellipse cx="80"  cy="55" rx="68" ry="22" fill="white" opacity={opacity}/>
    <ellipse cx="50"  cy="42" rx="34" ry="28" fill="white" opacity={opacity}/>
    <ellipse cx="90"  cy="36" rx="40" ry="30" fill="white" opacity={opacity}/>
    <ellipse cx="128" cy="48" rx="26" ry="20" fill="white" opacity={opacity * 0.9}/>
    <ellipse cx="80"  cy="60" rx="64" ry="11" fill="#c8ddf0" opacity="0.28"/>
  </svg>
);

const CLOUDS = [
  { top: '8%',  width: 160, duration: '28s', delay: '0s',    opacity: 0.90 },
  { top: '18%', width: 110, duration: '38s', delay: '-12s',  opacity: 0.78 },
  { top: '5%',  width: 200, duration: '22s', delay: '-7s',   opacity: 0.95 },
  { top: '25%', width: 90,  duration: '45s', delay: '-20s',  opacity: 0.65 },
  { top: '12%', width: 130, duration: '33s', delay: '-3s',   opacity: 0.82 },
];

/* ── Props ──────────────────────────────────────────────────────────────── */
interface IslandGridProps {
  /** Current (interpolated) player position in tile coordinates */
  playerX: number;
  playerY: number;
  characterId: string;
  isWalking: boolean;
  facing: 'left' | 'right';
  /** Called when any non-water tile is clicked */
  onTileClick: (x: number, y: number) => void;
}

/* ── IslandGrid ─────────────────────────────────────────────────────────── */
export const IslandGrid: React.FC<IslandGridProps> = ({
  playerX,
  playerY,
  characterId,
  isWalking,
  facing,
  onTileClick,
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

  return (
    <div className="relative">
      {/* ── Cloud layer (floats above island, no iso transform) ── */}
      <div
        className="absolute pointer-events-none z-30 overflow-hidden"
        style={{ inset: '-120px -240px', top: '-80px' }}
        aria-hidden="true"
      >
        {CLOUDS.map((c, i) => (
          <div
            key={i}
            className="cloud-drift absolute"
            style={{
              top: c.top,
              width: c.width,
              animationDuration: c.duration,
              animationDelay: c.delay,
            }}
          >
            <CloudSVG opacity={c.opacity} />
          </div>
        ))}
      </div>

      {/* ── Isometric tile grid ── */}
      <div
        className="isometric-board"
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(15, 64px)`,
          gridTemplateRows: `repeat(12, 64px)`,
          gap: 0,
          position: 'relative',
        }}
      >
        {/* Render tiles */}
        {Array.from({ length: 12 }).map((_, y) =>
          Array.from({ length: 15 }).map((_, x) => {
            const id = `${x},${y}`;
            const tile = state.tiles[id];
            if (!tile) return <div key={id} />;
            return (
              <IslandTile
                key={id}
                tile={tile}
                isDangerZone={dangerZoneTiles.has(id)}
                onTileClick={onTileClick}
              />
            );
          })
        )}

        {/* ── Player character (absolutely positioned inside the iso board) ── */}
        <CharacterOnIsland
          tileX={playerX}
          tileY={playerY}
          characterId={characterId}
          isWalking={isWalking}
          facing={facing}
        />
      </div>
    </div>
  );
};

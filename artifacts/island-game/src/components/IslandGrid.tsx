import React, { useMemo } from 'react';
import { useGame } from '../game/GameContext';
import { IslandTile } from './IslandTile';

export const IslandGrid = () => {
  const { state } = useGame();
  
  const dangerZoneTiles = useMemo(() => {
    const danger = new Set<string>();
    const crabs = Object.values(state.tiles).filter(t => t.object === 'CRAB' && t.crabHp && t.crabHp > 0);
    
    for (const crab of crabs) {
      for (let dx = -1; dx <= 1; dx++) {
        for (let dy = -1; dy <= 1; dy++) {
          if (dx === 0 && dy === 0) continue;
          danger.add(`${crab.x + dx},${crab.y + dy}`);
        }
      }
    }
    return danger;
  }, [state.tiles]);
  
  return (
    <div className="isometric-board" style={{
      display: 'grid',
      gridTemplateColumns: `repeat(15, 64px)`,
      gridTemplateRows: `repeat(12, 64px)`,
      gap: 0
    }}>
      {Array.from({length: 12}).map((_, y) => 
        Array.from({length: 15}).map((_, x) => {
          const id = `${x},${y}`;
          const tile = state.tiles[id];
          if (!tile) return <div key={id} />;
          return <IslandTile key={id} tile={tile} isDangerZone={dangerZoneTiles.has(id)} />
        })
      )}
    </div>
  )
}
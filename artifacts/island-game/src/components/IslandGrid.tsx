import React from 'react';
import { useGame } from '../game/GameContext';
import { IslandTile } from './IslandTile';

export const IslandGrid = () => {
  const { state } = useGame();
  
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
          return <IslandTile key={id} tile={tile} />
        })
      )}
    </div>
  )
}
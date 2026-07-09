import React from 'react';
import { useGame } from '../game/GameContext';

export const QuestBanner = () => {
  const { questBanner } = useGame();
  
  if (!questBanner) return null;
  
  return (
    <div className="absolute top-40 left-1/2 -translate-x-1/2 z-50 pointer-events-none quest-banner">
      <h1 
        className="text-7xl font-black text-pink-500 uppercase italic tracking-tighter text-center" 
        style={{ 
          WebkitTextStroke: '3px white',
          textShadow: '0 8px 0 rgba(0,0,0,0.3), 0 15px 20px rgba(0,0,0,0.2)'
        }}
      >
        {questBanner.split('\n').map((line, i) => (
          <span key={i} className="block">{line}</span>
        ))}
      </h1>
    </div>
  )
}
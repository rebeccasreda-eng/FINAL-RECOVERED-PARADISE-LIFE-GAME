import React from 'react';
import { useGame } from '../game/GameContext';

export const CoolBanner: React.FC = () => {
  const { coolBanners } = useGame();
  if (!coolBanners.length) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 72,
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 120,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 6,
      pointerEvents: 'none',
    }}>
      {coolBanners.map(b => (
        <div key={b.id} className="cool-banner-wrap">
          {/* Pink pill bar */}
          <div className="cool-banner-pill" />
          {/* COOL! text */}
          <div className="cool-banner-text">COOL!</div>
          {/* Reward label */}
          <div className="cool-banner-reward">{b.label}</div>
        </div>
      ))}
    </div>
  );
};

/**
 * CharacterOnIsland — places the player sprite on the isometric grid.
 * Includes a bouncing green arrow above the character's head.
 */
import React from 'react';
import { CHARACTER_COMPONENTS, ChMia } from './CharacterSprites';

// Half of the tile's diamond height — aligns character feet to diamond centre
const TH_HALF = 14;

type Facing = 'front' | 'back' | 'left' | 'right';

interface Props {
  screenX: number;
  screenY: number;
  tileZIndex: number;
  characterId: string;
  isWalking: boolean;
  facing: Facing;
}

/** Green downward arrow — symmetric so scaleX flip doesn't matter */
const PlayerArrow = () => (
  <svg viewBox="0 0 36 28" width="36" height="28" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block' }}>
    {/* Stem */}
    <rect x="13" y="0" width="10" height="14" rx="3"
      fill="#22d022" stroke="#128a12" strokeWidth="1.5"/>
    {/* Arrowhead */}
    <polygon points="1,13 35,13 18,27"
      fill="#22d022" stroke="#128a12" strokeWidth="1.5" strokeLinejoin="round"/>
    {/* Stem highlight */}
    <rect x="15" y="2" width="4" height="8" rx="2" fill="rgba(255,255,255,0.42)"/>
    {/* Arrowhead highlight */}
    <polygon points="6,14 30,14 18,23" fill="rgba(255,255,255,0.22)"/>
    {/* Dark outline top of stem */}
    <rect x="13" y="0" width="10" height="2" rx="1" fill="rgba(0,0,0,0.15)"/>
  </svg>
);

export const CharacterOnIsland: React.FC<Props> = ({
  screenX,
  screenY,
  tileZIndex,
  characterId,
  isWalking,
  facing,
}) => {
  const Char = CHARACTER_COMPONENTS[characterId] ?? ChMia;
  const SIZE = 52;
  const scaleX = facing === 'left' ? -1 : 1;

  return (
    <div
      style={{
        position: 'absolute',
        left: screenX,
        top: screenY + TH_HALF,
        zIndex: tileZIndex,
        transform: `translate(-50%, -100%) scaleX(${scaleX})`,
        transformOrigin: 'bottom center',
        pointerEvents: 'none',
        willChange: 'left, top',
      }}
    >
      {/* Bouncing green arrow — symmetric so the scaleX flip is harmless */}
      <div
        style={{
          position: 'absolute',
          top: -38,
          left: '50%',
          animation: 'charArrowBounce 0.75s ease-in-out infinite',
          pointerEvents: 'none',
        }}
      >
        <PlayerArrow />
      </div>

      {/* Character sprite */}
      <div style={{ filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.40))' }}>
        <Char size={SIZE} isWalking={isWalking} facing={facing} />
      </div>
    </div>
  );
};

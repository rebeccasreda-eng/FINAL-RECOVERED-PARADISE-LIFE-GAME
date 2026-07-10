/**
 * CharacterOnIsland (pixel-isometric edition)
 *
 * Layer structure:
 *   outer div  → world-space position + left/right scaleX flip
 *   inner div  → drop-shadow filter
 *   Char SVG   → facing-aware sprite
 */
import React from 'react';
import { CHARACTER_COMPONENTS, ChMia } from './CharacterSprites';

// Half of the tile's diamond height — aligns character feet to diamond centre
// Must match TH/2 in IslandGrid.tsx (currently TH=28 → 14)
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
  // scaleX flip only for left-facing; back/front/right all draw naturally
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
      <div style={{ filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.40))' }}>
        <Char size={SIZE} isWalking={isWalking} facing={facing} />
      </div>
    </div>
  );
};

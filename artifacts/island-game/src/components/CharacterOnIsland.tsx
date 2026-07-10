/**
 * CharacterOnIsland (pixel-isometric edition)
 *
 * Position is in world-space pixels (pre-computed by IslandGrid from
 * fractional tile coordinates). The character is a plain absolutely-
 * positioned element — no counter-rotation needed in 2.5-D iso space.
 *
 * Layer structure:
 *   outer div  → world-space position + facing flip (scaleX)
 *   inner div  → bob animation (translateY only, no conflict with outer transform)
 *   Char SVG   → drop-shadow filter
 */
import React from 'react';
import { CHARACTER_COMPONENTS, ChMia } from './CharacterSprites';

// Half of the tile's diamond height — aligns character feet to diamond centre
// Must match TH/2 in IslandGrid.tsx (currently TH=28 → 14)
const TH_HALF = 14;

interface Props {
  screenX: number;
  screenY: number;
  tileZIndex: number;
  characterId: string;
  isWalking: boolean;
  facing: 'left' | 'right';
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

  return (
    <div
      style={{
        position: 'absolute',
        left: screenX,
        top: screenY + TH_HALF,      // align feet to diamond centre
        zIndex: tileZIndex,
        // Horizontally centre, bottom-align, then flip for direction
        transform: `translate(-50%, -100%) scaleX(${facing === 'left' ? -1 : 1})`,
        transformOrigin: 'bottom center',
        pointerEvents: 'none',
        // Smooth CSS slide between tile positions — one transition per tile step
        transition: 'left 420ms linear, top 420ms linear',
        willChange: 'left, top',
      }}
    >
      {/* Bob animation on inner div so scaleX and translateY never conflict */}
      <div
        className={isWalking ? 'char-walk-bob' : 'char-idle-bob'}
        style={{ filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.40))' }}
      >
        <Char size={SIZE} />
      </div>
    </div>
  );
};

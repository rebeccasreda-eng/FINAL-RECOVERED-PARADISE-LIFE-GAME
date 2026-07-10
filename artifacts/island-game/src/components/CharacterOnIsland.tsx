/**
 * CharacterOnIsland
 * Renders the player's chibi avatar inside the isometric board.
 * Position is in fractional tile coordinates (so movement interpolation is smooth).
 * The counter-rotation transform cancels the board's rotateX(60)rotateZ(-45)
 * so the character stands upright in isometric 3D space.
 */
import React from 'react';
import { CHARACTER_COMPONENTS, ChMia } from './CharacterSprites';

const TILE = 64; // px per tile

interface Props {
  /** Fractional tile X (smoothly interpolated between integer positions) */
  tileX: number;
  /** Fractional tile Y */
  tileY: number;
  characterId: string;
  isWalking: boolean;
  facing: 'left' | 'right';
}

export const CharacterOnIsland: React.FC<Props> = ({
  tileX,
  tileY,
  characterId,
  isWalking,
  facing,
}) => {
  const Char = CHARACTER_COMPONENTS[characterId] ?? ChMia;
  const SIZE = 68; // px width of the sprite

  // Centre of the tile in the board's local pixel space
  const cx = tileX * TILE + TILE / 2;
  const cy = tileY * TILE + TILE / 2;

  return (
    <div
      style={{
        position: 'absolute',
        // Pin top-left corner of a 0×0 anchor at the tile centre
        left: cx,
        top: cy,
        width: 0,
        height: 0,
        // Keep character on top of tiles at same or lower depth
        zIndex: Math.round(tileX + tileY) + 20,
        pointerEvents: 'none',
        willChange: 'transform',
      }}
    >
      {/*
        The counter-rotation makes the child stand upright inside the isometric board.
        Board transform:  rotateX(60) rotateZ(-45)
        Counter-rotation: rotateZ(45) rotateX(-60)
        Then we translateY upward so feet sit on the tile surface.
        The walk / idle CSS animation only modifies the translateY component.
      */}
      <div
        className={isWalking ? 'char-walk' : 'char-idle'}
        style={{
          position: 'absolute',
          // Horizontally centre the sprite on the anchor
          left: -(SIZE / 2),
          // Bottom of sprite aligns with the tile surface
          bottom: 0,
          transformOrigin: 'center bottom',
        }}
      >
        {/* Inner flip for facing direction (in sprite local space, before iso transform) */}
        <div
          style={{
            transform: `scaleX(${facing === 'left' ? -1 : 1})`,
            transformOrigin: 'center center',
            filter: 'drop-shadow(0 6px 8px rgba(0,0,0,0.4))',
          }}
        >
          <Char size={SIZE} />
        </div>
      </div>
    </div>
  );
};

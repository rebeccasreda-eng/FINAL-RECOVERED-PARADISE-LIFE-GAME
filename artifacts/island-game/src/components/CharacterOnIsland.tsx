/**
 * CharacterOnIsland — places the player sprite on the isometric grid.
 * Includes a 3D block arrow that bounces above the character's head.
 */
import React from 'react';
import { CHARACTER_COMPONENTS, ChMia } from './CharacterSprites';

const TH_HALF = 14;

type Facing = 'front' | 'back' | 'left' | 'right';

interface Props {
  screenX: number;
  screenY: number;
  tileZIndex: number;
  characterId: string;
  isWalking: boolean;
  facing: Facing;
  isChopping?: boolean;
}

/**
 * 3-D block arrow — extrusion layer + right side face + bright top face.
 * viewBox 32×26, rendered at 26×20 so it reads as compact and chunky.
 */
const PlayerArrow = () => (
  <svg viewBox="0 0 32 26" width="26" height="20" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block' }}>
    {/* ── Extrusion (depth) layer, offset +3,+3 — darkest green ── */}
    <rect    x="14" y="3" width="9" height="12" fill="#0a6a0a"/>
    <polygon points="4,14 32,14 18,26"           fill="#0a6a0a"/>
    {/* ── Side / connecting faces — medium green ── */}
    {/* Stem right face */}
    <path d="M20,0 L23,3 L23,15 L20,12Z"         fill="#1aaa1a"/>
    {/* Head right face */}
    <path d="M29,11 L32,14 L18,26 L15,23Z"       fill="#1aaa1a"/>
    {/* Top face of stem (parallelogram seen from above) */}
    <path d="M11,0 L14,3 L23,3 L20,0Z"           fill="#28c028"/>
    {/* ── Front (top) face — bright green ── */}
    <rect    x="11" y="0" width="9" height="12"  fill="#2ecc2e"/>
    <polygon points="1,11 29,11 15,23"            fill="#2ecc2e"/>
    {/* ── Highlights ── */}
    <rect    x="12.5" y="1.5" width="3" height="7" rx="1" fill="rgba(255,255,255,0.44)"/>
    <polygon points="3,11 11,11 6,17"             fill="rgba(255,255,255,0.16)"/>
    {/* ── Edge lines to sharpen faces ── */}
    <line x1="1"  y1="11" x2="29" y2="11" stroke="#0a6a0a" strokeWidth="0.8"/>
    <line x1="11" y1="0"  x2="20" y2="0"  stroke="rgba(0,0,0,0.18)" strokeWidth="0.6"/>
  </svg>
);

export const CharacterOnIsland: React.FC<Props> = ({
  screenX,
  screenY,
  tileZIndex,
  characterId,
  isWalking,
  facing,
  isChopping,
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
      {/* Bouncing 3-D block arrow */}
      <div
        style={{
          position: 'absolute',
          top: -30,
          left: '50%',
          animation: 'none',
          pointerEvents: 'none',
        }}
      >
        <PlayerArrow />
      </div>

      {/* Character sprite — chop-swing wrapper */}
      <div
        key={isChopping ? 'chop' : 'idle'}
        className={isChopping ? 'char-chop-swing' : undefined}
        style={{ transformOrigin: 'bottom center' }}
      >
        <div style={{ filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.40))' }}>
          <Char size={SIZE} isWalking={isWalking} facing={facing} />
        </div>
      </div>
    </div>
  );
};

/**
 * CharacterOnIsland — places the player sprite on the isometric grid.
 */
import React, { useEffect, useRef, useState } from 'react';
import girlSundressImage from '@assets/girl_sundress_cutout(2)(1)_1792655405137.png';
import blondBoyImage from '@assets/blond_boy_cutout(2)(1)_1792655405137.png';
import brunetteBoyImage from '@assets/brunette_boy_cutout(2)(1)_1792655405137.png';
import pinkDressGirlImage from '@assets/girl_asset_dress_no_bg_1792655854378.png';
import girlSundressBackImage from '@assets/generated_images/girl_sundress_back_sized.png';
import blondBoyBackImage from '@assets/generated_images/blond_boy_back_sized.png';
import brunetteBoyBackImage from '@assets/generated_images/brunette_boy_back_sized.png';
import pinkDressGirlBackImage from '@assets/generated_images/pink_dress_girl_back_sized.png';

const TH_HALF = 14;

type Facing = 'front' | 'back' | 'left' | 'right';
export type CharacterWalkFrames = Partial<Record<'front' | 'back', readonly string[]>>;
const WALK_FRAME_INTERVAL_MS = 120;
const EMPTY_WALK_FRAMES: readonly string[] = [];

const CHARACTER_PORTRAITS: Record<string, string> = {
  'girl-sundress': girlSundressImage,
  'blond-boy': blondBoyImage,
  'brunette-boy': brunetteBoyImage,
  'pink-dress-girl': pinkDressGirlImage,
  // Keep older saved profiles on a matching updated portrait.
  mia: girlSundressImage,
  ava: girlSundressImage,
  nora: girlSundressImage,
  leo: blondBoyImage,
  kai: brunetteBoyImage,
  player: blondBoyImage,
};

const BACK_PORTRAITS: Record<string, string> = {
  'girl-sundress': girlSundressBackImage,
  'blond-boy': blondBoyBackImage,
  'brunette-boy': brunetteBoyBackImage,
  'pink-dress-girl': pinkDressGirlBackImage,
  mia: girlSundressBackImage,
  ava: girlSundressBackImage,
  nora: girlSundressBackImage,
  leo: blondBoyBackImage,
  kai: brunetteBoyBackImage,
  player: blondBoyBackImage,
};

interface Props {
  screenX: number;
  screenY: number;
  tileZIndex: number;
  characterId: string;
  facing: Facing;
  isMoving?: boolean;
  walkingFrames?: CharacterWalkFrames;
  isChopping?: boolean;
  isShoveling?: boolean;
}

export const CharacterOnIsland: React.FC<Props> = ({
  screenX,
  screenY,
  tileZIndex,
  characterId,
  facing,
  isMoving = false,
  walkingFrames,
  isChopping,
  isShoveling,
}) => {
  const WIDTH = 68;
  const HEIGHT = 92;
  const activeFacing = facing;
  const portrait = CHARACTER_PORTRAITS[characterId] ?? girlSundressImage;
  const backPortrait = BACK_PORTRAITS[characterId] ?? girlSundressBackImage;
  const scaleX = activeFacing === 'left' ? -1 : 1;
  const idlePortrait = activeFacing === 'back' ? backPortrait : portrait;
  const activeWalkFrames = activeFacing === 'back'
    ? walkingFrames?.back ?? EMPTY_WALK_FRAMES
    : walkingFrames?.front ?? EMPTY_WALK_FRAMES;
  const hasWalkingFrames = Boolean(walkingFrames?.front?.length || walkingFrames?.back?.length);
  const activeWalkFramesRef = useRef(activeWalkFrames);
  activeWalkFramesRef.current = activeWalkFrames;
  const [walkFrameIndex, setWalkFrameIndex] = useState(0);

  // Use elapsed time rather than render count, and keep the cycle running across
  // direction changes. With no real pose frames, the original PNG stays still.
  useEffect(() => {
    if (!isMoving || !hasWalkingFrames) {
      setWalkFrameIndex(0);
      return;
    }

    let startTime: number | null = null;
    let lastFrameIndex = -1;
    let animationFrame = 0;
    const advanceFrame = (now: number) => {
      if (startTime === null) startTime = now;
      const frames = activeWalkFramesRef.current;
      if (frames.length > 0) {
        const nextFrame = Math.floor((now - startTime) / WALK_FRAME_INTERVAL_MS) % frames.length;
        if (nextFrame !== lastFrameIndex) {
          lastFrameIndex = nextFrame;
          setWalkFrameIndex(nextFrame);
        }
      }
      animationFrame = requestAnimationFrame(advanceFrame);
    };

    animationFrame = requestAnimationFrame(advanceFrame);
    return () => cancelAnimationFrame(animationFrame);
  }, [hasWalkingFrames, isMoving]);

  const activePortrait = isMoving && activeWalkFrames.length > 0
    ? activeWalkFrames[walkFrameIndex % activeWalkFrames.length] ?? idlePortrait
    : idlePortrait;

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
        overflow: 'visible',
      }}
    >
      <div
        key={isChopping ? 'chop' : isShoveling ? 'shovel' : 'idle'}
        className={isChopping ? 'char-chop-swing' : isShoveling ? 'char-shovel-swing' : undefined}
        style={{
          transformOrigin: 'bottom center',
          position: 'relative',
          width: WIDTH,
          height: HEIGHT,
          overflow: 'visible',
        }}
      >
        {activeFacing !== 'back' && <span className="player-portrait-ground-shadow" aria-hidden="true" />}
        <img
          className="player-portrait-image"
          src={activePortrait}
          alt=""
          draggable={false}
        />
      </div>
    </div>
  );
};

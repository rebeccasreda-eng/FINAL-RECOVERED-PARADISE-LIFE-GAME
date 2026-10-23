/**
 * ChopProgressBar — shown at the top of the viewport when the player
 * is actively chopping a tree. Matches the reference HUD style.
 */
import React from 'react';
import { useGame } from '../game/GameContext';

const TREE_NAMES: Record<string, string> = {
  TREE_PALM:    'Banana Tree',
  TREE_COCONUT: 'Banana Tree',
  TREE_MANGO:   'Orange Tree',
  TREE_APPLE:   'Orange Tree',
};

const TREE_ICONS: Record<string, string> = {
  TREE_PALM:    '🍌',
  TREE_COCONUT: '🍌',
  TREE_MANGO:   '🍊',
  TREE_APPLE:   '🍊',
};

const MAX_CHOPS = 5;

export const ChopProgressBar: React.FC = () => {
  const { state, activeChopTileId } = useGame();

  if (!activeChopTileId) return null;

  const tile = state.tiles[activeChopTileId];
  if (!tile || !tile.object || !(tile.object in TREE_NAMES)) return null;

  const treeName = TREE_NAMES[tile.object];
  const treeIcon = TREE_ICONS[tile.object] ?? '🌲';

  // treeHp = chops remaining AFTER the last hit; undefined = full (5)
  const chopsRemaining = tile.treeHp ?? MAX_CHOPS;
  // After first click treeHp becomes 4 → chopsDone = 5-4 = 1
  const chopsDone = MAX_CHOPS - chopsRemaining;

  // Circular SVG progress ring
  const R = 18;
  const circumference = 2 * Math.PI * R;
  const progress = chopsDone / MAX_CHOPS;
  const dashOffset = circumference * (1 - progress);

  return (
    <div
      data-nodrag
      style={{
        position: 'absolute',
        top: 10,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 45,
        display: 'flex',
        alignItems: 'center',
        gap: 0,
        background: 'linear-gradient(180deg, #2e1c08 0%, #1a1004 100%)',
        borderRadius: 48,
        border: '2.5px solid #a07830',
        boxShadow: '0 4px 18px rgba(0,0,0,0.65), inset 0 1px 0 rgba(255,255,255,0.08)',
        padding: '5px 14px 5px 5px',
        fontFamily: "'Fredoka', sans-serif",
        minWidth: 280,
        pointerEvents: 'none',
        userSelect: 'none',
      }}
    >
      {/* ── Tree icon circle ── */}
      <div style={{
        width: 44, height: 44,
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #2a8020 0%, #164010 100%)',
        border: '2.5px solid #4aac28',
        boxShadow: '0 2px 6px rgba(0,0,0,0.45)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 24, flexShrink: 0,
        marginRight: 10,
      }}>
        {treeIcon}
      </div>

      {/* ── Text block ── */}
      <div style={{ flex: 1 }}>
        {/* "Chopping" amber label */}
        <div style={{
          background: 'linear-gradient(90deg, #c87820 0%, #e8a030 100%)',
          borderRadius: 6,
          padding: '1px 9px',
          display: 'inline-block',
          marginBottom: 3,
          boxShadow: '0 1px 3px rgba(0,0,0,0.35)',
        }}>
          <span style={{
            color: 'white',
            fontSize: 11,
            fontWeight: 900,
            letterSpacing: '0.08em',
            textShadow: '0 1px 2px rgba(0,0,0,0.45)',
          }}>
            Chopping
          </span>
        </div>

        {/* Main chop count text */}
        <div style={{
          color: 'white',
          fontSize: 15,
          fontWeight: 900,
          lineHeight: 1.1,
          textShadow: '0 1px 3px rgba(0,0,0,0.6)',
        }}>
          {treeName}: {chopsDone}/{MAX_CHOPS} chop{chopsDone !== 1 ? 's' : ''}
        </div>

        {/* Hint */}
        <div style={{ color: 'rgba(255,255,255,0.60)', fontSize: 10, fontWeight: 700 }}>
          (Click to chop down)
        </div>
      </div>

      {/* ── Circular progress ring ── */}
      <div style={{ marginLeft: 10, flexShrink: 0 }}>
        <svg viewBox="0 0 48 48" width="52" height="52">
          {/* Background track */}
          <circle cx="24" cy="24" r={R}
            fill="rgba(0,0,0,0.40)"
            stroke="#1a4010"
            strokeWidth="5"
          />
          {/* Green progress arc */}
          <circle
            cx="24" cy="24" r={R}
            fill="none"
            stroke="#44d818"
            strokeWidth="5"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            transform="rotate(-90 24 24)"
            style={{ transition: 'stroke-dashoffset 0.28s ease' }}
          />
          {/* Glow pulse when nearly done */}
          {progress >= 0.75 && (
            <circle cx="24" cy="24" r={R}
              fill="none"
              stroke="rgba(80,255,40,0.22)"
              strokeWidth="9"
            />
          )}
          {/* Axe emoji in centre */}
          <text
            x="24" y="29"
            textAnchor="middle"
            fontSize="16"
            style={{ userSelect: 'none' }}
          >🪓</text>
        </svg>
      </div>
    </div>
  );
};

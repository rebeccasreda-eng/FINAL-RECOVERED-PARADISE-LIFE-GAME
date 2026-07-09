import React from 'react';
import { useGame } from '../game/GameContext';
import { TileData } from '../game/types';
import { OBJECT_CONFIG, EMOJI_MAP, CROP_TYPES } from '../game/gameData';

export const IslandTile = ({ tile }: { tile: TileData }) => {
  const { interact, plant, place, activeTool, activeBuildItem, floatingTexts } = useGame();
  
  const handleInteraction = () => {
    if (activeTool === 'plant') {
      plant(tile.id);
    } else if (activeTool === 'build' && activeBuildItem) {
      place(tile.id, activeBuildItem);
    } else {
      interact(tile.id);
    }
  };

  const config = tile.object ? OBJECT_CONFIG[tile.object] : null;
  const isCleared = tile.object === 'CLEARED_LAND' || tile.object === 'CROP_PLOT';
  const myTexts = floatingTexts.filter(t => t.tileId === tile.id);

  let hoverClass = "hover:brightness-110";
  if (activeTool === 'build' && isCleared) hoverClass = "hover:bg-blue-400";
  else if (activeTool === 'plant' && isCleared) hoverClass = "hover:bg-green-400";

  return (
    <div 
      className={`relative w-full h-full cursor-pointer transition-all group ${hoverClass} ${tile.type === 'WATER' ? 'water-wave' : tile.type === 'GRASS' ? 'bg-[#7ec850]' : 'bg-[#f6d365]'}`}
      onClick={handleInteraction}
      title={config ? `${config.action} (⚡${config.energy})` : isCleared ? `Ready for ${activeTool === 'build' ? 'building' : 'planting'}` : ''}
    >
      <div className="absolute inset-0 border border-black/5" />
      {isCleared && <div className="absolute inset-0 bg-[#8b5a2b] opacity-80" />}

      {tile.object && tile.object !== 'CLEARED_LAND' && tile.object !== 'CROP_PLOT' && (
        <div className={`isometric-object text-5xl select-none group-hover:scale-110 transition-transform ${tile.object === 'CROP_WILTED' ? 'wilt-grayscale' : ''}`}>
          {tile.object === 'CROP_READY' && tile.cropType && CROP_TYPES[tile.cropType] 
            ? CROP_TYPES[tile.cropType].emoji 
            : EMOJI_MAP[tile.object] || '?'}

          {tile.object === 'CROP_GROWING' && (
            <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-sm bg-black/60 text-white px-2 py-0.5 rounded-full border border-white/30 whitespace-nowrap">
               Growing
            </div>
          )}

          {tile.object === 'CRAB' && (
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-12 h-3 bg-red-900 rounded-full overflow-hidden border-2 border-white shadow-sm">
              <div className="bg-red-500 h-full transition-all" style={{ width: `${((tile.crabHp || 3) / 3) * 100}%` }}></div>
            </div>
          )}
        </div>
      )}

      {myTexts.map(t => (
        <div key={t.id} className="floating-text text-yellow-300 text-3xl">
          {t.text}
        </div>
      ))}
    </div>
  )
}
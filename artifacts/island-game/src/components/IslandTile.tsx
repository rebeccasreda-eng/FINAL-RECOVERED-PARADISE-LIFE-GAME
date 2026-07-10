import React, { useState, useEffect } from 'react';
import { useGame } from '../game/GameContext';
import { TileData } from '../game/types';
import { OBJECT_CONFIG, EMOJI_MAP, CROP_TYPES } from '../game/gameData';
import { useToast } from '@/hooks/use-toast';

export const IslandTile = ({ tile, isDangerZone }: { tile: TileData, isDangerZone?: boolean }) => {
  const { state, dispatch, interact, plant, place, activeTool, activeBuildItem, floatingTexts, setNeighborVisitPrompt } = useGame();
  const { toast } = useToast();
  
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    if (tile.object === 'CROP_GROWING' || tile.object === 'CROP_READY') {
      const interval = setInterval(() => setNow(Date.now()), 1000);
      return () => clearInterval(interval);
    }
    return undefined;
  }, [tile.object]);

  const handleInteraction = () => {
    if (activeTool === 'plant') {
      plant(tile.id);
    } else if (activeTool === 'build' && activeBuildItem) {
      place(tile.id, activeBuildItem);
    } else {
      interact(tile.id);
    }
  };

  if (state.visitingNeighbor && state.visitingNeighbor.tileId === tile.id) {
    const neighbor = state.neighbors.find(n => n.id === state.visitingNeighbor!.neighborId);
    if (neighbor) {
      return (
        <div 
          className={`relative w-full h-full cursor-pointer transition-all hover:brightness-110 bg-[#7ec850]`}
          onClick={() => setNeighborVisitPrompt(true)}
        >
          <div className="absolute inset-0 border border-black/5" />
          <div className="absolute inset-0 bg-green-500/30 animate-pulse pointer-events-none z-10 shadow-[inset_0_0_15px_rgba(34,197,94,0.5)]"></div>
          <div className="isometric-object text-5xl select-none hover:scale-110 transition-transform">
            {neighbor.avatar}
          </div>
        </div>
      );
    }
  }

  if (tile.object === 'CROP_WILTED') {
    return (
      <div className={`relative w-full h-full cursor-pointer transition-all hover:brightness-110 bg-[#7ec850]`}>
        <div className="absolute inset-0 border border-black/5" />
        <div className="absolute inset-0 bg-[#8b5a2b] opacity-80" />
        <div className="isometric-object text-5xl select-none wilt-grayscale">
          {EMOJI_MAP['CROP_WILTED']}
        </div>
        {!tile.unwitherRequestedAt && (
           <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 z-20">
             <button onClick={(e) => { e.stopPropagation(); interact(tile.id); }} className="bg-red-500 hover:bg-red-400 text-white text-[10px] px-2 py-0.5 rounded shadow">Clear (1⚡)</button>
             <button onClick={(e) => { 
                e.stopPropagation(); 
                dispatch({ type: 'REQUEST_UNWITHER', tileId: tile.id });
                toast({ title: 'Request Sent!', description: 'A friend will unwither this soon.' });
             }} className="bg-blue-500 hover:bg-blue-400 text-white text-[10px] px-2 py-0.5 rounded shadow">Ask Friend</button>
           </div>
        )}
        {tile.unwitherRequestedAt && (
          <div className="absolute top-2 left-1/2 transform -translate-x-1/2 text-[8px] bg-black/60 text-white px-2 py-0.5 rounded-full whitespace-nowrap z-20">
            Waiting for friend...
          </div>
        )}
      </div>
    );
  }

  const config = tile.object ? OBJECT_CONFIG[tile.object] : null;
  const isCleared = tile.object === 'CLEARED_LAND' || tile.object === 'CROP_PLOT';
  const myTexts = floatingTexts.filter(t => t.tileId === tile.id);

  let hoverClass = "hover:brightness-110";
  if (activeTool === 'build' && isCleared) hoverClass = "hover:bg-blue-400";
  else if (activeTool === 'plant' && isCleared) hoverClass = "hover:bg-green-400";

  let titleText = config ? `${config.action} (⚡${config.energy + (isDangerZone && activeTool === 'clear' ? 1 : 0)})` : isCleared ? `Ready for ${activeTool === 'build' ? 'building' : 'planting'}` : '';
  if (tile.object === 'CROP_READY' && tile.cropType && CROP_TYPES[tile.cropType]) {
    titleText += ` - Expected Yield: ${CROP_TYPES[tile.cropType].yield * 5} 🪙`;
  }

  const isTree = /PALM|TREE|COCO|MANGO|BAMBOO|BUSH|FLOWER/.test(tile.object || '');

  let badgeText = '';
  let progressWidth = 0;

  if ((tile.object === 'CROP_GROWING' || tile.object === 'CROP_READY') && tile.placedAt && tile.cropType) {
    const cropConfig = CROP_TYPES[tile.cropType];
    const timeElapsed = now - tile.placedAt;
    const growTime = state.weather === 'RAINY' ? cropConfig.growTime * 0.5 : cropConfig.growTime;
    
    if (tile.object === 'CROP_GROWING') {
      const remaining = Math.max(0, growTime - timeElapsed);
      const m = Math.floor(remaining / 60000);
      const s = Math.floor((remaining % 60000) / 1000);
      badgeText = `Ready in ${m}m ${s}s`;
      progressWidth = Math.min(100, (timeElapsed / growTime) * 100);
    } else if (tile.object === 'CROP_READY') {
      const wiltRemaining = Math.max(0, (growTime + cropConfig.wiltTime) - timeElapsed);
      const m = Math.floor(wiltRemaining / 60000);
      const s = Math.floor((wiltRemaining % 60000) / 1000);
      badgeText = `READY! Wilts in ${m}m ${s}s`;
      progressWidth = 100;
    }
  }

  return (
    <div 
      className={`relative w-full h-full cursor-pointer transition-all group ${hoverClass} ${tile.type === 'WATER' ? 'water-wave' : tile.type === 'GRASS' ? 'bg-[#7ec850]' : 'bg-[#f6d365]'}`}
      onClick={handleInteraction}
      title={titleText}
    >
      <div className="absolute inset-0 border border-black/5" />
      {isCleared && <div className="absolute inset-0 bg-[#8b5a2b] opacity-80" />}
      
      {isDangerZone && (
         <div className="absolute inset-0 bg-red-500/30 animate-pulse pointer-events-none z-10 shadow-[inset_0_0_15px_rgba(239,68,68,0.5)]"></div>
      )}

      {tile.object && tile.object !== 'CLEARED_LAND' && tile.object !== 'CROP_PLOT' && (
        <div className={`isometric-object text-5xl select-none group-hover:scale-110 transition-transform ${isTree ? 'tree-sway' : ''}`}>
          {tile.object === 'CROP_READY' && tile.cropType && CROP_TYPES[tile.cropType]
            ? CROP_TYPES[tile.cropType].emoji
            : EMOJI_MAP[tile.object] || '?'}

          {tile.object === 'CROP_GROWING' && (
            <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-[10px] bg-black/60 text-white px-2 py-0.5 rounded-full border border-white/30 whitespace-nowrap flex flex-col items-center gap-0.5 z-20">
              <span>{badgeText || 'Growing'}</span>
              {progressWidth > 0 && (
                <div className="w-12 h-1 bg-gray-500 rounded-full overflow-hidden">
                  <div className="h-full bg-green-400" style={{ width: `${progressWidth}%` }} />
                </div>
              )}
            </div>
          )}

          {tile.object === 'CROP_READY' && badgeText && (
            <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-[10px] bg-black/60 text-white px-2 py-0.5 rounded-full border border-white/30 whitespace-nowrap z-20">
              {badgeText}
            </div>
          )}

          {(tile.object === 'CRAB' || tile.object === 'BOAR') && (
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-12 h-3 bg-red-900 rounded-full overflow-hidden border-2 border-white shadow-sm">
              <div className="bg-red-500 h-full transition-all" style={{ width: `${((tile.crabHp || (tile.object === 'CRAB' ? 3 : 2)) / (tile.object === 'CRAB' ? 3 : 2)) * 100}%` }} />
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

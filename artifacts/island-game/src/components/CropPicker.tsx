import React from 'react';
import { useGame } from '../game/GameContext';
import { CROP_TYPES } from '../game/gameData';

export const CropPicker = () => {
  const { plantingTile, setPlantingTile, plant, state } = useGame();
  
  if (!plantingTile) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in" onClick={() => setPlantingTile(null)}>
      <div className="bg-[#fff5d7] p-8 rounded-3xl border-8 border-[#8b5a2b] shadow-2xl flex flex-col gap-6 w-[450px] relative" onClick={e => e.stopPropagation()}>
        <button onClick={() => setPlantingTile(null)} className="absolute top-4 right-4 text-3xl font-black text-[#8b5a2b] hover:scale-110 transition-transform">×</button>
        <h2 className="text-3xl font-black text-[#5c3a21] text-center uppercase tracking-widest">Select Crop</h2>
        
        <div className="flex flex-col gap-4">
          {Object.entries(CROP_TYPES).map(([id, crop]) => (
            <button 
              key={id} 
              onClick={() => {
                if (state.inventory.coins >= crop.cost) {
                  plant(plantingTile, id);
                  setPlantingTile(null);
                }
              }}
              className={`flex items-center justify-between p-4 rounded-xl border-4 transition-transform ${state.inventory.coins >= crop.cost ? 'bg-white border-[#d2b48c] hover:scale-[1.02] hover:border-[#8b5a2b] cursor-pointer shadow-sm' : 'bg-gray-200 border-gray-400 opacity-60 cursor-not-allowed'}`}
            >
              <div className="flex items-center gap-4">
                <span className="text-4xl drop-shadow-sm">{crop.emoji}</span>
                <div className="flex flex-col text-left">
                  <span className="font-bold text-xl text-[#5c3a21]">{crop.name}</span>
                  <span className="text-xs text-[#8b5a2b] font-black">Yield: {crop.yield}</span>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <span className={`font-black text-xl ${state.inventory.coins >= crop.cost ? 'text-yellow-600' : 'text-red-500'}`}>{crop.cost} 🪙</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

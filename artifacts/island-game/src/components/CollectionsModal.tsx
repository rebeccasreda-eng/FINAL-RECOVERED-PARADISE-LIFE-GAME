import React from 'react';
import { useGame } from '../game/GameContext';
import { COLLECTIONS } from '../game/gameData';

export const CollectionsModal = ({ onClose }: { onClose: () => void }) => {
  const { state } = useGame();

  const total = COLLECTIONS.length;
  const unlocked = COLLECTIONS.filter(c => state.collections[c.id]).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in" onClick={onClose}>
      <div className="bg-[#fdf6e3] p-8 rounded-[2rem] border-8 border-[#8b5a2b] shadow-2xl flex flex-col gap-6 w-[600px] h-[500px] relative" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-6 right-6 text-3xl font-black text-[#8b5a2b] hover:scale-110 transition-transform">×</button>
        
        <div className="text-center">
          <h2 className="text-4xl font-black text-[#5c3a21] uppercase tracking-widest flex items-center justify-center gap-3">
            <span>🗃️</span> Collections
          </h2>
          <p className="text-lg font-bold text-[#8b5a2b] mt-2">
            Found {unlocked} of {total} rare items
          </p>
          <div className="w-full h-4 bg-gray-200 rounded-full mt-4 border-2 border-[#d2b48c] overflow-hidden relative">
            <div className="bg-purple-500 h-full transition-all duration-500" style={{ width: `${(unlocked/total)*100}%` }}></div>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto grid grid-cols-2 gap-4 pr-2 mt-4">
          {COLLECTIONS.map(c => {
            const has = state.collections[c.id];
            return (
              <div key={c.id} className={`p-4 rounded-2xl border-4 flex items-center gap-4 transition-all ${has ? 'bg-white border-purple-400 shadow-md' : 'bg-gray-100 border-gray-300 opacity-60 grayscale'}`}>
                 <div className="text-5xl drop-shadow-sm">{has ? c.emoji : '❓'}</div>
                 <div className="flex-1">
                   <h4 className={`font-black text-lg ${has ? 'text-purple-900' : 'text-gray-500'}`}>{has ? c.name : 'Unknown'}</h4>
                   <p className="text-xs font-medium text-gray-500 leading-tight mt-1">{has ? c.description : 'Keep exploring to find this item.'}</p>
                 </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
import React from 'react';
import { useGame } from '../game/GameContext';
import { ResourceType } from '../game/types';
import { EMOJI_MAP } from '../game/gameData';

export const HUD = ({ onOpenCollections, onOpenWeather }: { onOpenCollections: () => void, onOpenWeather: () => void }) => {
  const { state, setShopOpen, activeTool, setActiveTool, activeBuildItem, setActiveBuildItem } = useGame();
  const { level, xp, inventory, energy, maxEnergy } = state;
  const nextLevelXp = Math.floor(100 * Math.pow(level, 1.5));

  const ownedStructures = ['HUT', 'DOCK', 'WELL', 'FLOWER_POT', 'FENCE', 'LANTERN'].filter(i => (inventory[i as ResourceType] || 0) > 0);

  return (
    <>
      {/* TOP BAR */}
      <div className="absolute top-0 left-0 right-0 h-16 bg-[#8b5a2b] border-b-4 border-[#5c3a21] flex items-center justify-between px-6 z-30 shadow-lg text-white font-bold select-none whitespace-nowrap">
        {/* Left: Level */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-12 h-12 bg-yellow-400 rounded-full border-2 border-yellow-600 shadow-md transform -translate-y-1">
             <span className="text-xl">⭐</span>
             <span className="absolute text-lg text-yellow-900 drop-shadow-sm font-black">{level}</span>
          </div>
          <div className="w-32 bg-black/30 h-5 rounded-full overflow-hidden border-2 border-[#5c3a21] shadow-inner relative">
            <div className="bg-blue-400 h-full transition-all duration-300" style={{ width: `${(xp / nextLevelXp) * 100}%` }} />
            <div className="absolute inset-0 flex items-center justify-center text-[10px] text-white/80 font-black tracking-widest">{xp} / {nextLevelXp}</div>
          </div>
        </div>

        {/* Middle: Resources */}
        <div className="flex items-center gap-4 bg-black/20 px-4 py-2 rounded-2xl border border-black/30 shadow-inner">
           <div className="flex items-center gap-1" title="Coins"><span className="text-2xl">🪙</span> <span className="text-lg w-8">{inventory.coins}</span></div>
           <div className="flex items-center gap-1" title="Wood"><span className="text-2xl">🪵</span> <span className="text-lg w-6">{inventory.wood}</span></div>
           <div className="flex items-center gap-1" title="Stone"><span className="text-2xl">🪨</span> <span className="text-lg w-6">{inventory.stone}</span></div>
           <div className="flex items-center gap-1" title="Food"><span className="text-2xl">🍎</span> <span className="text-lg w-6">{inventory.food}</span></div>
           <div className="flex items-center gap-1" title="Shells"><span className="text-2xl">🐚</span> <span className="text-lg w-6">{inventory.shells}</span></div>
        </div>

        {/* Right: Energy & Menus */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-black/20 px-4 py-2 rounded-2xl border border-black/30 shadow-inner mr-2">
             <span className="text-2xl">⚡</span>
             <div className="flex flex-col">
               <div className="text-xs leading-tight text-blue-200">ENERGY</div>
               <div className="w-24 bg-black/50 h-3 rounded-full overflow-hidden mt-0.5 relative shadow-inner">
                 <div className="bg-blue-500 h-full absolute top-0 left-0 transition-all duration-300 shadow-[0_0_8px_rgba(59,130,246,0.8)]" style={{ width: `${(energy / maxEnergy) * 100}%` }} />
               </div>
             </div>
             <div className="ml-2 font-mono text-lg">{energy}/{maxEnergy}</div>
          </div>
          
          <button onClick={onOpenCollections} className="bg-purple-500 hover:bg-purple-400 active:scale-95 transition-transform px-3 py-2 rounded-xl border-b-4 border-purple-700 shadow-md text-white font-bold flex items-center gap-2 text-lg" title="Collections">
            🗃️
          </button>
          
          <button onClick={onOpenWeather} className="bg-blue-400 hover:bg-blue-300 active:scale-95 transition-transform px-3 py-2 rounded-xl border-b-4 border-blue-600 shadow-md text-white font-bold flex items-center gap-2 text-lg" title="Weather">
            🌤️
          </button>
          
          <button onClick={() => setShopOpen(true)} className="bg-green-500 hover:bg-green-400 active:scale-95 transition-transform px-4 py-2 rounded-xl border-b-4 border-green-700 shadow-md text-white font-bold flex items-center gap-2 text-lg">
            🏪 Shop
          </button>
        </div>
      </div>

      {/* BOTTOM BAR */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-[#8b5a2b] border-t-4 border-[#5c3a21] flex items-center justify-between px-8 z-30 text-white font-bold select-none shadow-[0_-10px_20px_rgba(0,0,0,0.2)]">
        {/* Inventory items */}
        <div className="flex items-center gap-4">
           <div className="bg-black/20 px-5 py-3 rounded-xl flex items-center gap-3 border border-black/30 shadow-inner">
             <span className="text-3xl">🌽</span> <span className="text-xl">{inventory.produce} Produce</span>
           </div>
        </div>

        {/* Tools */}
        <div className="flex items-center gap-4 relative">
           
           {activeTool === 'build' && (
             <div className="absolute bottom-[110%] right-0 mb-2 bg-[#8b5a2b] p-3 rounded-2xl flex gap-3 border-4 border-[#5c3a21] shadow-2xl animate-in slide-in-from-bottom-4">
                {ownedStructures.length === 0 ? (
                  <span className="text-yellow-200 text-sm font-bold whitespace-nowrap px-4 py-2">Buy structures in Shop!</span>
                ) : (
                  ownedStructures.map(item => {
                    const count = inventory[item as ResourceType] || 0;
                    return (
                      <button 
                        key={item} 
                        onClick={() => setActiveBuildItem(item as any)} 
                        className={`w-14 h-14 rounded-xl border-4 flex items-center justify-center transition-transform ${activeBuildItem === item ? 'bg-yellow-400 border-yellow-600 scale-110' : 'bg-[#fff5d7] border-[#d2b48c] hover:bg-white'} relative`}
                      >
                         <span className="text-3xl">{EMOJI_MAP[item]}</span>
                         <span className="absolute -top-3 -right-3 bg-red-500 text-white text-xs font-black px-2 py-0.5 rounded-full border-2 border-white">{count}</span>
                      </button>
                    )
                  })
                )}
             </div>
           )}

           <button onClick={() => setActiveTool('clear')} className={`px-8 py-4 rounded-2xl border-b-4 font-black text-xl transition-all ${activeTool === 'clear' ? 'bg-yellow-400 border-yellow-600 text-yellow-900 scale-105 shadow-lg' : 'bg-gray-400 border-gray-600 text-gray-800 hover:bg-gray-300'}`}>
             👆 Pointer
           </button>
           
           <button onClick={() => setActiveTool('plant')} className={`px-8 py-4 rounded-2xl border-b-4 font-black text-xl transition-all ${activeTool === 'plant' ? 'bg-green-400 border-green-600 text-green-900 scale-105 shadow-lg' : 'bg-gray-400 border-gray-600 text-gray-800 hover:bg-gray-300'}`}>
             🌱 Plant
           </button>

           <button onClick={() => { setActiveTool('build'); if(!activeBuildItem && ownedStructures.length > 0) setActiveBuildItem(ownedStructures[0] as any); }} className={`px-8 py-4 rounded-2xl border-b-4 font-black text-xl transition-all ${activeTool === 'build' ? 'bg-blue-400 border-blue-600 text-blue-900 scale-105 shadow-lg' : 'bg-gray-400 border-gray-600 text-gray-800 hover:bg-gray-300'}`}>
             🔨 Build
           </button>
        </div>
      </div>
    </>
  )
}
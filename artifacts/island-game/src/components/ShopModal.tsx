import React, { useState } from 'react';
import { useGame } from '../game/GameContext';
import { ResourceType } from '../game/types';
import { EMOJI_MAP } from '../game/gameData';

const STRUCTURES: { id: ResourceType, name: string, cost: number, desc: string }[] = [
  { id: 'HUT', name: 'Wooden Hut', cost: 200, desc: 'A cozy place to rest.' },
  { id: 'DOCK', name: 'Fishing Dock', cost: 300, desc: 'Perfect for catching fish.' },
  { id: 'WELL', name: 'Water Well', cost: 150, desc: 'Fresh water source.' },
  { id: 'FLOWER_POT', name: 'Flower Pot', cost: 50, desc: 'Decorative plants.' },
  { id: 'FENCE', name: 'Wood Fence', cost: 20, desc: 'Keep the crabs out!' },
  { id: 'LANTERN', name: 'Lantern', cost: 80, desc: 'Lights up the night.' },
];

export const ShopModal = () => {
  const { state, dispatch, setShopOpen } = useGame();
  const [tab, setTab] = useState<'BUY' | 'SELL'>('BUY');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md animate-in fade-in" onClick={() => setShopOpen(false)}>
      <div className="bg-[#fff5d7] rounded-[2rem] border-[12px] border-[#8b5a2b] shadow-2xl flex flex-col w-[800px] h-[600px] overflow-hidden relative" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="bg-[#8b5a2b] text-white p-6 flex justify-between items-center shadow-md relative z-10">
          <h2 className="text-4xl font-black uppercase tracking-widest flex items-center gap-4">
            <span className="text-5xl">🏪</span> Island Shop
          </h2>
          <div className="flex items-center gap-4 bg-black/30 px-4 py-2 rounded-full border-2 border-[#5c3a21]">
            <span className="text-2xl">🪙</span>
            <span className="text-2xl font-bold">{state.inventory.coins}</span>
          </div>
          <button onClick={() => setShopOpen(false)} className="w-12 h-12 bg-red-500 hover:bg-red-400 rounded-full border-4 border-red-800 text-white font-black text-xl flex items-center justify-center transition-transform hover:scale-110 shadow-lg absolute -right-6 -top-6">×</button>
        </div>

        {/* Tabs */}
        <div className="flex bg-[#d2b48c] p-2 gap-2 shadow-inner border-b-4 border-[#5c3a21]">
          <button onClick={() => setTab('BUY')} className={`flex-1 py-3 text-xl font-black rounded-xl transition-all ${tab === 'BUY' ? 'bg-white text-[#5c3a21] shadow-md scale-[1.02]' : 'text-[#8b5a2b] hover:bg-[#e6d0a7]'}`}>🛒 Buy Structures</button>
          <button onClick={() => setTab('SELL')} className={`flex-1 py-3 text-xl font-black rounded-xl transition-all ${tab === 'SELL' ? 'bg-white text-[#5c3a21] shadow-md scale-[1.02]' : 'text-[#8b5a2b] hover:bg-[#e6d0a7]'}`}>💰 Sell Produce</button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-[#fff5d7]">
          {tab === 'BUY' && (
            <div className="grid grid-cols-2 gap-6">
              {STRUCTURES.map(s => (
                <div key={s.id} className="bg-white border-4 border-[#d2b48c] rounded-2xl p-4 flex gap-4 items-center shadow-sm hover:shadow-md transition-shadow">
                   <div className="w-24 h-24 bg-blue-100 rounded-xl border-2 border-blue-200 flex items-center justify-center text-6xl drop-shadow-md">
                     {EMOJI_MAP[s.id]}
                   </div>
                   <div className="flex-1 flex flex-col justify-center">
                     <h3 className="text-xl font-black text-[#5c3a21]">{s.name}</h3>
                     <p className="text-sm text-[#8b5a2b] font-medium leading-tight mt-1 h-10">{s.desc}</p>
                     <div className="mt-2 flex justify-between items-center">
                       <span className="font-black text-yellow-600 text-lg">{s.cost} 🪙</span>
                       <button 
                         onClick={() => dispatch({ type: 'BUY', itemType: s.id, cost: s.cost })}
                         disabled={state.inventory.coins < s.cost}
                         className={`px-4 py-2 rounded-lg font-bold border-b-4 transition-transform active:scale-95 ${state.inventory.coins >= s.cost ? 'bg-green-500 hover:bg-green-400 border-green-700 text-white' : 'bg-gray-300 border-gray-400 text-gray-500 cursor-not-allowed'}`}
                       >
                         Buy
                       </button>
                     </div>
                   </div>
                </div>
              ))}
            </div>
          )}

          {tab === 'SELL' && (
            <div className="flex flex-col items-center justify-center h-full gap-8">
              <div className="bg-white border-4 border-[#d2b48c] rounded-3xl p-8 flex flex-col items-center shadow-lg w-[400px] text-center">
                <div className="text-8xl drop-shadow-lg mb-4">🌽</div>
                <h3 className="text-3xl font-black text-[#5c3a21]">Harvested Produce</h3>
                <p className="text-lg text-[#8b5a2b] font-medium mt-2">You have <span className="font-black text-xl">{state.inventory.produce}</span> in stock.</p>
                
                <div className="w-full h-1 bg-gray-200 rounded-full my-6"></div>
                
                <div className="flex justify-between w-full mb-6 text-xl font-bold">
                  <span className="text-[#8b5a2b]">Value:</span>
                  <span className="text-yellow-600">{state.inventory.produce * 5} 🪙</span>
                </div>

                <button 
                  onClick={() => dispatch({ type: 'SELL_PRODUCE' })}
                  disabled={state.inventory.produce <= 0}
                  className={`w-full py-4 rounded-xl font-black text-2xl border-b-4 transition-transform active:scale-95 ${state.inventory.produce > 0 ? 'bg-yellow-400 hover:bg-yellow-300 border-yellow-600 text-yellow-900 shadow-md' : 'bg-gray-300 border-gray-400 text-gray-500 cursor-not-allowed'}`}
                >
                  Sell All
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
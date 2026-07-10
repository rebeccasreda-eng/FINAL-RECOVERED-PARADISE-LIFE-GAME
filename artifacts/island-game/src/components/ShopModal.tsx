import React, { useState } from 'react';
import { useGame } from '../game/GameContext';
import { ResourceType } from '../game/types';
import { EMOJI_MAP, CROP_TYPES, PREMIUM_ITEMS } from '../game/gameData';
import { useToast } from '@/hooks/use-toast';

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
  const { toast } = useToast();
  const [tab, setTab] = useState<'BUY' | 'SEEDS' | 'SELL' | 'PREMIUM'>('BUY');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md animate-in fade-in" onClick={() => setShopOpen(false)}>
      <div className="bg-[#fff5d7] rounded-[2rem] border-[12px] border-[#8b5a2b] shadow-2xl flex flex-col w-[800px] h-[600px] overflow-hidden relative" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="bg-[#8b5a2b] text-white p-6 flex justify-between items-center shadow-md relative z-10">
          <h2 className="text-4xl font-black uppercase tracking-widest flex items-center gap-4">
            <span className="text-5xl">🏪</span> Island Shop
          </h2>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-black/30 px-3 py-1.5 rounded-full border-2 border-[#5c3a21]">
              <span className="text-xl">🐚</span>
              <span className="text-xl font-bold">{state.inventory.shells || 0}</span>
            </div>
            <div className="flex items-center gap-2 bg-black/30 px-4 py-1.5 rounded-full border-2 border-[#5c3a21]">
              <span className="text-2xl">🪙</span>
              <span className="text-2xl font-bold">{state.inventory.coins}</span>
            </div>
          </div>
          <button onClick={() => setShopOpen(false)} className="w-12 h-12 bg-red-500 hover:bg-red-400 rounded-full border-4 border-red-800 text-white font-black text-xl flex items-center justify-center transition-transform hover:scale-110 shadow-lg absolute -right-6 -top-6">×</button>
        </div>

        {/* Tabs */}
        <div className="flex bg-[#d2b48c] p-2 gap-2 shadow-inner border-b-4 border-[#5c3a21] overflow-x-auto custom-scrollbar">
          <button onClick={() => setTab('BUY')} className={`px-4 py-3 text-sm font-black rounded-xl transition-all whitespace-nowrap ${tab === 'BUY' ? 'bg-white text-[#5c3a21] shadow-md scale-[1.02]' : 'text-[#8b5a2b] hover:bg-[#e6d0a7]'}`}>🛒 Structures</button>
          <button onClick={() => setTab('SEEDS')} className={`px-4 py-3 text-sm font-black rounded-xl transition-all whitespace-nowrap ${tab === 'SEEDS' ? 'bg-white text-[#5c3a21] shadow-md scale-[1.02]' : 'text-[#8b5a2b] hover:bg-[#e6d0a7]'}`}>🌱 Seeds</button>
          <button onClick={() => setTab('SELL')} className={`px-4 py-3 text-sm font-black rounded-xl transition-all whitespace-nowrap ${tab === 'SELL' ? 'bg-white text-[#5c3a21] shadow-md scale-[1.02]' : 'text-[#8b5a2b] hover:bg-[#e6d0a7]'}`}>💰 Sell</button>
          <button onClick={() => setTab('PREMIUM')} className={`px-4 py-3 text-sm font-black rounded-xl transition-all whitespace-nowrap flex items-center gap-2 ${tab === 'PREMIUM' ? 'bg-pink-100 text-pink-700 shadow-md scale-[1.02] border-2 border-pink-300' : 'text-[#8b5a2b] hover:bg-[#e6d0a7]'}`}><span>⭐</span> Premium</button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-[#fff5d7]">
          {tab === 'BUY' && (
            <div className="grid grid-cols-2 gap-6">
              {STRUCTURES.map(s => (
                <div key={s.id} className="bg-white border-4 border-[#d2b48c] rounded-2xl p-4 flex gap-4 items-center shadow-sm hover:shadow-md transition-shadow relative">
                   <div className="w-24 h-24 bg-blue-100 rounded-xl border-2 border-blue-200 flex items-center justify-center text-6xl drop-shadow-md shrink-0">
                     {EMOJI_MAP[s.id]}
                   </div>
                   <div className="flex-1 flex flex-col justify-center min-w-0">
                     <h3 className="text-xl font-black text-[#5c3a21] truncate">{s.name}</h3>
                     <p className="text-[11px] text-[#8b5a2b] font-medium leading-tight mt-1 h-8">{s.desc}</p>
                     <div className="mt-2 flex justify-between items-center">
                       <span className="font-black text-yellow-600 text-lg">{s.cost} 🪙</span>
                       <button 
                         onClick={() => dispatch({ type: 'BUY', itemType: s.id, cost: s.cost })}
                         disabled={state.inventory.coins < s.cost}
                         className={`px-3 py-1.5 rounded-lg font-bold border-b-4 transition-transform active:scale-95 ${state.inventory.coins >= s.cost ? 'bg-green-500 hover:bg-green-400 border-green-700 text-white' : 'bg-gray-300 border-gray-400 text-gray-500 cursor-not-allowed'}`}
                       >
                         Buy
                       </button>
                     </div>
                   </div>
                   
                   {s.id === 'HUT' && state.inventory.wood < 5 && (
                     <button 
                       onClick={() => {
                         dispatch({ type: 'REQUEST_RESOURCE', resource: 'wood', amount: 5 });
                         toast({ title: 'Request Sent', description: 'Asked neighbor for 5 wood.' });
                       }}
                       className="absolute -top-3 -right-3 bg-purple-500 hover:bg-purple-400 text-white text-[10px] font-black px-2 py-1 rounded-full shadow-lg border-2 border-purple-200 active:scale-95"
                     >
                       Ask Neighbor for Wood
                     </button>
                   )}
                </div>
              ))}
            </div>
          )}

          {tab === 'SEEDS' && (
            <div className="grid grid-cols-2 gap-6">
              {Object.entries(CROP_TYPES).map(([id, crop]) => {
                 const harvestCoins = crop.yield * 5;
                 const profit = harvestCoins - crop.cost;
                 return (
                  <div key={id} className="bg-white border-4 border-[#d2b48c] rounded-2xl p-4 flex gap-4 items-center shadow-sm">
                     <div className="w-24 h-24 bg-green-100 rounded-xl border-2 border-green-200 flex items-center justify-center text-6xl drop-shadow-md">
                       {crop.emoji}
                     </div>
                     <div className="flex-1 flex flex-col justify-center">
                       <h3 className="text-xl font-black text-[#5c3a21]">{crop.name}</h3>
                       <div className="text-sm font-bold flex flex-col mt-1">
                         <span className="text-red-600">Cost: {crop.cost} 🪙</span>
                         <span className="text-blue-600">Harvest: +{harvestCoins} 🪙</span>
                         <span className={profit >= 0 ? "text-green-600" : "text-red-600"}>
                           Profit: {profit >= 0 ? '+' : ''}{profit} 🪙
                         </span>
                       </div>
                       <p className="text-[10px] text-gray-500 mt-2 font-bold uppercase tracking-wider bg-gray-100 px-2 py-1 rounded inline-block text-center border border-gray-200">Use Plant Tool to grow</p>
                     </div>
                  </div>
                 )
              })}
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

          {tab === 'PREMIUM' && (
            <div className="grid grid-cols-1 gap-4">
              <div className="bg-blue-50 border-2 border-blue-200 p-3 rounded-xl mb-2 text-center text-blue-800 font-bold text-sm">
                Earn shells by leveling up or completing sets!
              </div>
              {PREMIUM_ITEMS.map(item => (
                <div key={item.id} className="bg-gradient-to-r from-pink-50 to-purple-50 border-4 border-pink-200 rounded-2xl p-4 flex gap-6 items-center shadow-sm">
                  <div className="text-6xl drop-shadow-md shrink-0">{item.emoji}</div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-black text-pink-900">{item.name}</h3>
                    <p className="text-sm font-bold text-pink-700 mt-1">{item.desc}</p>
                    {state.premiumBoosts[item.id] > 0 && item.id !== 'energy_boost' && (
                      <span className="inline-block mt-2 bg-green-100 text-green-700 text-xs px-2 py-1 rounded font-bold border border-green-300">ACTIVE</span>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <div className="font-black text-xl text-blue-600 bg-white px-3 py-1 rounded-lg border-2 border-blue-200">
                      {item.shellCost} 🐚
                    </div>
                    <button
                      onClick={() => dispatch({ type: 'BUY_PREMIUM', itemId: item.id, shellCost: item.shellCost })}
                      disabled={state.inventory.shells < item.shellCost}
                      className={`px-6 py-2 rounded-xl font-black border-b-4 transition-transform active:scale-95 ${state.inventory.shells >= item.shellCost ? 'bg-pink-500 hover:bg-pink-400 border-pink-700 text-white shadow-md' : 'bg-gray-300 border-gray-400 text-gray-500 cursor-not-allowed'}`}
                    >
                      Buy
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

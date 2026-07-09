import React, { useState } from 'react';
import { useGame } from '../game/GameContext';

const ShopItem = ({ title, icon, cost, onBuy, canAfford }: any) => (
  <div className={`p-4 rounded-2xl border-4 flex flex-col items-center gap-3 ${canAfford ? 'bg-white border-[#d2b48c]' : 'bg-gray-100 border-gray-300 opacity-70'}`}>
    <div className="text-6xl mb-2 drop-shadow-md">{icon}</div>
    <div className="font-bold text-[#5c3a21] text-xl text-center leading-tight">{title}</div>
    <button 
      onClick={onBuy} 
      disabled={!canAfford}
      className={`w-full py-3 rounded-xl font-black flex items-center justify-center gap-2 border-b-4 active:border-b-0 active:translate-y-1 transition-all text-lg ${canAfford ? 'bg-green-500 hover:bg-green-400 text-white border-green-700' : 'bg-gray-400 text-gray-200 border-gray-600'}`}
    >
      Buy {cost} 🪙
    </button>
  </div>
)

export const ShopModal = () => {
  const { state, dispatch, setShopOpen } = useGame();
  const [tab, setTab] = useState<'seeds'|'structures'|'decorations'|'sell'>('seeds');

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200 select-none">
       <div className="bg-[#fff5d7] w-full max-w-3xl rounded-[2rem] border-[12px] border-[#8b5a2b] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
          
          <div className="bg-[#8b5a2b] text-white p-6 flex justify-between items-center border-b-4 border-[#5c3a21]">
            <h2 className="text-3xl font-black tracking-widest uppercase">🏪 Island Shop</h2>
            <div className="flex items-center gap-6">
              <span className="bg-yellow-400 text-yellow-900 px-4 py-2 rounded-full font-black text-xl border-2 border-yellow-600 shadow-inner">
                🪙 {state.inventory.coins}
              </span>
              <button 
                onClick={() => setShopOpen(false)} 
                className="w-12 h-12 bg-red-500 text-white rounded-full font-black text-2xl border-b-4 border-red-700 hover:bg-red-400 active:translate-y-1 active:border-b-0 transition-all flex items-center justify-center shadow-md"
              >
                ✖
              </button>
            </div>
          </div>
          
          <div className="flex bg-[#d2b48c] p-3 gap-2 border-b-4 border-[#8b5a2b]/30">
             {['seeds', 'structures', 'decorations', 'sell'].map(t => (
               <button 
                 key={t} 
                 onClick={() => setTab(t as any)} 
                 className={`flex-1 py-3 font-black rounded-xl text-xl capitalize transition-colors ${tab === t ? 'bg-[#fff5d7] text-[#5c3a21] shadow-sm' : 'bg-transparent text-[#8b5a2b] hover:bg-white/30'}`}
               >
                 {t}
               </button>
             ))}
          </div>
          
          <div className="p-8 h-[450px] overflow-y-auto">
             {tab === 'seeds' && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  <ShopItem title="1 Seed" icon="🌱" cost={10} onBuy={() => dispatch({type:'BUY', itemType:'seeds', cost: 10, count: 1})} canAfford={state.inventory.coins >= 10} />
                  <ShopItem title="5 Seeds" icon="🌱" cost={45} onBuy={() => dispatch({type:'BUY', itemType:'seeds', cost: 45, count: 5})} canAfford={state.inventory.coins >= 45} />
                </div>
             )}
             
             {tab === 'structures' && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  <ShopItem title="Hut" icon="🏚️" cost={200} onBuy={() => dispatch({type:'BUY', itemType:'HUT', cost: 200})} canAfford={state.inventory.coins >= 200} />
                  <ShopItem title="Dock" icon="⛵" cost={150} onBuy={() => dispatch({type:'BUY', itemType:'DOCK', cost: 150})} canAfford={state.inventory.coins >= 150} />
                  <ShopItem title="Well" icon="💧" cost={100} onBuy={() => dispatch({type:'BUY', itemType:'WELL', cost: 100})} canAfford={state.inventory.coins >= 100} />
                </div>
             )}
             
             {tab === 'decorations' && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  <ShopItem title="Flower Pot" icon="🪴" cost={20} onBuy={() => dispatch({type:'BUY', itemType:'FLOWER_POT', cost: 20})} canAfford={state.inventory.coins >= 20} />
                  <ShopItem title="Fence" icon="🚧" cost={30} onBuy={() => dispatch({type:'BUY', itemType:'FENCE', cost: 30})} canAfford={state.inventory.coins >= 30} />
                  <ShopItem title="Lantern" icon="🏮" cost={40} onBuy={() => dispatch({type:'BUY', itemType:'LANTERN', cost: 40})} canAfford={state.inventory.coins >= 40} />
                </div>
             )}

             {tab === 'sell' && (
                <div className="flex flex-col items-center justify-center h-full">
                  <div className="text-8xl mb-6 drop-shadow-xl">🌽</div>
                  <h3 className="text-3xl font-black text-[#5c3a21] mb-8">You have {state.inventory.produce} Produce</h3>
                  <button 
                    onClick={() => dispatch({type: 'SELL_PRODUCE'})} 
                    disabled={state.inventory.produce < 1}
                    className="bg-yellow-400 hover:bg-yellow-300 disabled:bg-gray-400 disabled:border-gray-600 disabled:text-gray-200 text-yellow-900 px-12 py-6 rounded-3xl text-3xl font-black border-b-8 border-yellow-600 active:border-b-0 active:translate-y-2 transition-all shadow-xl disabled:shadow-none"
                  >
                    Sell All (+{state.inventory.produce * 5} 🪙)
                  </button>
                </div>
             )}
          </div>
       </div>
    </div>
  )
}
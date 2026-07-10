import React, { useState } from 'react';
import { useGame } from '../game/GameContext';
import { COLLECTIONS, COLLECTION_SETS } from '../game/gameData';
import { useToast } from '@/hooks/use-toast';

export const CollectionsModal = ({ onClose }: { onClose: () => void }) => {
  const { state, dispatch } = useGame();
  const { toast } = useToast();
  const [showAddMenu, setShowAddMenu] = useState<number | null>(null);
  const [giftMenu, setGiftMenu] = useState<string | null>(null);

  const total = COLLECTIONS.length;
  const unlocked = COLLECTIONS.filter(c => state.collections[c.id]).length;
  const wishlist = state.wishlist || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in" onClick={onClose}>
      <div className="bg-[#fdf6e3] p-8 rounded-[2rem] border-8 border-[#8b5a2b] shadow-2xl flex flex-col gap-6 w-[700px] max-h-[90vh] overflow-hidden relative" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-6 right-6 text-3xl font-black text-[#8b5a2b] hover:scale-110 transition-transform z-10">×</button>
        
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
        
        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar flex flex-col gap-6">
          {/* Sets Section */}
          <div className="flex flex-col gap-3">
             <h3 className="text-2xl font-black text-[#5c3a21] uppercase tracking-wider">Sets</h3>
             {COLLECTION_SETS.map(set => {
               const hasAll = set.items.every(id => state.collections[id]);
               return (
                 <div key={set.id} className={`p-4 rounded-2xl border-4 transition-all ${hasAll ? 'bg-purple-100 border-purple-400 shadow-md' : 'bg-gray-100 border-gray-300'}`}>
                    <div className="flex justify-between items-center mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-3xl">{set.emoji}</span>
                        <h4 className="font-black text-lg text-[#5c3a21]">{set.name}</h4>
                      </div>
                      <div className="text-xs font-bold bg-white px-2 py-1 rounded border-2 border-gray-300">
                        {set.rewardLabel}
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex gap-2">
                         {set.items.map(itemId => {
                           const c = COLLECTIONS.find(x => x.id === itemId);
                           const has = state.collections[itemId];
                           return (
                             <div key={itemId} className={`w-12 h-12 rounded-xl flex items-center justify-center text-3xl border-2 ${has ? 'bg-white border-purple-300' : 'bg-gray-200 border-gray-300 grayscale opacity-50'}`} title={c?.name}>
                               {c?.emoji}
                             </div>
                           )
                         })}
                      </div>
                      <button 
                        onClick={() => {
                          dispatch({ type: 'TRADE_COLLECTION', setId: set.id });
                          toast({ title: 'Set Traded!', description: `You earned: ${set.rewardLabel}` });
                        }}
                        disabled={!hasAll}
                        className={`px-4 py-2 font-black rounded-xl border-b-4 transition-transform active:scale-95 ${hasAll ? 'bg-purple-500 hover:bg-purple-400 text-white border-purple-700 shadow-lg shadow-purple-500/50 animate-pulse' : 'bg-gray-300 text-gray-500 border-gray-400 cursor-not-allowed'}`}
                      >
                        Trade In
                      </button>
                    </div>
                 </div>
               );
             })}
          </div>

          <div className="w-full h-1 bg-gray-200 rounded-full"></div>

          {/* Individual Items Grid */}
          <div className="grid grid-cols-2 gap-4">
            {COLLECTIONS.map(c => {
              const has = state.collections[c.id];
              return (
                <div key={c.id} className={`p-4 rounded-2xl border-4 flex items-center gap-4 transition-all ${has ? 'bg-white border-purple-400 shadow-md' : 'bg-gray-100 border-gray-300 opacity-60 grayscale'}`}>
                   <div className="text-5xl drop-shadow-sm">{has ? c.emoji : '❓'}</div>
                   <div className="flex-1">
                     <h4 className={`font-black text-lg ${has ? 'text-purple-900' : 'text-gray-500'}`}>{has ? c.name : 'Unknown'}</h4>
                     <p className="text-[10px] font-medium text-gray-500 leading-tight mt-1">{has ? c.description : 'Keep exploring.'}</p>
                     
                     {has && (
                       <div className="relative mt-2">
                         <button onClick={() => setGiftMenu(giftMenu === c.id ? null : c.id)} className="w-full bg-pink-100 hover:bg-pink-200 text-pink-700 text-xs font-black py-1 rounded border-b-2 border-pink-300 active:scale-95 transition-transform">
                           Gift to Neighbor
                         </button>
                         {giftMenu === c.id && (
                           <div className="absolute bottom-full left-0 mb-2 w-48 bg-white border-4 border-[#8b5a2b] rounded-xl p-2 shadow-xl z-20 flex flex-col gap-1">
                             <div className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-1 text-center">Select Neighbor</div>
                             {state.neighbors.map(n => (
                               <button 
                                 key={n.id}
                                 onClick={() => {
                                   dispatch({ type: 'GIFT_ITEM', itemId: c.id, neighborId: n.id });
                                   setGiftMenu(null);
                                   toast({ title: 'Gift Sent!', description: `${n.name} loved your ${c.name}! +5 Favor` });
                                 }}
                                 className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-pink-50 text-left text-sm"
                               >
                                 {n.avatar.startsWith('/') ? (
                                   <img src={n.avatar} alt={n.name} className="w-7 h-7 rounded-full object-cover shrink-0" />
                                 ) : (
                                   <span className="text-lg">{n.avatar}</span>
                                 )}
                                 <span className="font-bold flex-1 truncate">{n.name}</span>
                                 {n.wishlist.includes(c.id) && <span className="text-red-500 text-xs animate-bounce">❤️</span>}
                               </button>
                             ))}
                           </div>
                         )}
                       </div>
                     )}
                   </div>
                </div>
              )
            })}
          </div>

          <div className="w-full h-1 bg-gray-200 rounded-full"></div>

          {/* Wishlist */}
          <div className="bg-[#fff5d7] rounded-xl p-4 border-4 border-[#d2b48c] mb-2">
             <h3 className="text-xl font-black text-[#5c3a21] mb-3">My Wishlist</h3>
             <div className="flex gap-2">
               {[0, 1, 2, 3, 4].map(i => {
                 const itemId = wishlist[i];
                 const item = itemId ? COLLECTIONS.find(c => c.id === itemId) : null;
                 
                 return (
                   <div key={i} className="relative flex-1">
                     {item ? (
                       <div className="bg-white border-2 border-purple-300 rounded-lg p-2 flex flex-col items-center gap-1 shadow-sm relative group">
                         <span className="text-3xl">{item.emoji}</span>
                         <span className="text-[10px] font-bold text-center leading-tight">{item.name}</span>
                         <button onClick={() => dispatch({ type: 'REMOVE_WISHLIST', itemId: item.id })} className="absolute -top-2 -right-2 bg-red-500 text-white w-5 h-5 rounded-full flex items-center justify-center text-xs font-black opacity-0 group-hover:opacity-100 transition-opacity">×</button>
                       </div>
                     ) : (
                       <button onClick={() => setShowAddMenu(i)} className="w-full h-full min-h-[70px] border-2 border-dashed border-[#8b5a2b] bg-white/50 rounded-lg flex items-center justify-center text-[#8b5a2b] hover:bg-white transition-colors">
                         <span className="text-xl">+</span>
                       </button>
                     )}
                     
                     {showAddMenu === i && (
                       <div className="absolute bottom-full left-0 mb-2 bg-white border-4 border-[#8b5a2b] rounded-xl p-2 w-48 shadow-xl z-20 flex flex-col gap-1">
                         {COLLECTIONS.map(c => (
                           <button 
                             key={c.id}
                             onClick={() => {
                               dispatch({ type: 'ADD_WISHLIST', itemId: c.id });
                               setShowAddMenu(null);
                             }}
                             disabled={wishlist.includes(c.id)}
                             className={`flex items-center gap-2 p-2 rounded-lg text-left ${wishlist.includes(c.id) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-purple-50'}`}
                           >
                             <span className="text-xl">{c.emoji}</span>
                             <span className="font-bold text-sm">{c.name}</span>
                           </button>
                         ))}
                         <button onClick={() => setShowAddMenu(null)} className="mt-1 text-xs text-center text-gray-500 font-bold p-1 bg-gray-100 rounded hover:bg-gray-200">Cancel</button>
                       </div>
                     )}
                   </div>
                 )
               })}
             </div>
          </div>
        </div>
      </div>
    </div>
  )
}

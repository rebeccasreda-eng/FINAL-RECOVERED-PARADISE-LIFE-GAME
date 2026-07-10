import React, { useState } from 'react';
import { useGame } from '../game/GameContext';
import { COLLECTIONS } from '../game/gameData';

export const CollectionsModal = ({ onClose }: { onClose: () => void }) => {
  const { state, dispatch } = useGame();
  const [showAddMenu, setShowAddMenu] = useState<number | null>(null);

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
        
        <div className="bg-[#fff5d7] rounded-xl p-4 border-4 border-[#d2b48c]">
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
                     <div className="absolute top-full left-0 mt-2 bg-white border-4 border-[#8b5a2b] rounded-xl p-2 w-48 shadow-xl z-20 flex flex-col gap-1">
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
        
        <div className="flex-1 overflow-y-auto grid grid-cols-2 gap-4 pr-2">
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
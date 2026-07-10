import React, { useState } from 'react';
import { useGame } from '../game/GameContext';
import { COLLECTIONS } from '../game/gameData';
import { useToast } from '@/hooks/use-toast';

export const NeighborPanel = () => {
  const { state, dispatch } = useGame();
  const { toast } = useToast();
  const [hoveredNeighbor, setHoveredNeighbor] = useState<string | null>(null);
  
  const favorTiers = [
    { max: 25, name: 'Acquaintance' },
    { max: 50, name: 'Friend' },
    { max: 75, name: 'Good Friend' },
    { max: 100, name: 'Best Friend' }
  ];
  
  const currentTier = favorTiers.find(t => state.favorBar <= t.max)?.name || 'Best Friend';

  const handleVisit = (n: any) => {
    dispatch({ type: 'VISIT_NEIGHBOR', neighborId: n.id });
    toast({ title: `Visited ${n.name}!`, description: '+10 favor points, +5 coins, +5 XP', duration: 2000 });
  };
  
  const handleHire = (n: any) => {
    const now = Date.now();
    const isNewDay = now - state.lastNeighborHire > 86400000;
    const hiredToday = isNewDay ? 0 : state.neighborsHiredToday;
    
    if (hiredToday >= 2) {
      toast({ title: 'Daily limit reached', description: 'You can only hire 2 neighbors per day.', variant: 'destructive' });
      return;
    }
    
    if (state.inventory.coins < 50) {
      toast({ title: 'Not enough coins!', description: 'Need 50 coins to hire a neighbor.', variant: 'destructive' });
      return;
    }
    
    dispatch({ type: 'HIRE_NEIGHBOR', neighborId: n.id });
    toast({ title: `${n.name} is helping!`, description: '+3 energy restored! ⚡', duration: 2000 });
  };

  return (
    <div className="absolute bottom-[6rem] left-0 right-0 px-8 flex justify-center pointer-events-none z-20">
      <div className="bg-[#fff5d7]/90 backdrop-blur-md border-4 border-[#8b5a2b] rounded-t-3xl p-4 pb-6 flex flex-col gap-3 shadow-xl pointer-events-auto max-w-4xl w-full translate-y-2 hover:translate-y-0 transition-transform">
         
         <div className="flex justify-between items-center px-2">
            <h3 className="font-black text-[#5c3a21] text-lg uppercase tracking-widest">Neighbors</h3>
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-[#8b5a2b] uppercase">{currentTier}</span>
              <div className="w-48 h-3 bg-white border-2 border-[#8b5a2b] rounded-full overflow-hidden relative">
                <div className="bg-pink-400 h-full transition-all duration-500" style={{ width: `${state.favorBar}%` }}></div>
              </div>
            </div>
         </div>
         
         <div className="flex gap-4 overflow-visible pb-2 custom-scrollbar relative">
            {state.neighbors?.map(n => (
              <div 
                key={n.id} 
                className="relative"
                onMouseEnter={() => setHoveredNeighbor(n.id)}
                onMouseLeave={() => setHoveredNeighbor(null)}
              >
                <div className="bg-white border-4 border-[#d2b48c] rounded-2xl p-3 flex flex-col items-center gap-2 min-w-[160px] shadow-sm">
                  <div className="relative">
                    <div className="text-5xl bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center border-2 border-blue-300 shadow-sm">{n.avatar}</div>
                    <div className="absolute -bottom-2 -right-2 bg-yellow-400 text-yellow-900 w-6 h-6 rounded-full flex items-center justify-center text-xs font-black border-2 border-white">{n.level}</div>
                  </div>
                  <div className="font-bold text-[#5c3a21] text-sm text-center">{n.name}</div>
                  <div className="flex gap-1 w-full mt-1">
                    <button onClick={() => handleVisit(n)} className="flex-1 bg-purple-500 hover:bg-purple-400 text-white text-[10px] font-black py-1.5 rounded border-b-2 border-purple-700 shadow-sm active:scale-95 transition-transform">
                      Visit
                    </button>
                    <button onClick={() => handleHire(n)} className="flex-1 bg-green-500 hover:bg-green-400 text-white text-[10px] font-black py-1.5 rounded border-b-2 border-green-700 shadow-sm active:scale-95 transition-transform flex flex-col items-center leading-none">
                      <span>Hire</span>
                      <span className="text-[8px] opacity-90">50 🪙</span>
                    </button>
                  </div>
                </div>

                {/* Wishlist Popover */}
                {hoveredNeighbor === n.id && n.wishlist && n.wishlist.length > 0 && (
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 w-48 bg-white border-4 border-pink-400 rounded-xl p-3 shadow-2xl z-50 animate-in fade-in slide-in-from-bottom-2">
                    <div className="text-center font-black text-pink-500 text-xs uppercase tracking-wider mb-2">Wishlist</div>
                    <div className="flex flex-col gap-2">
                      {n.wishlist.map(itemId => {
                        const item = COLLECTIONS.find(c => c.id === itemId);
                        if (!item) return null;
                        const hasItem = state.collections[itemId];
                        return (
                          <div key={itemId} className="flex items-center justify-between gap-2 bg-gray-50 p-1.5 rounded-lg border border-gray-200">
                            <div className="flex items-center gap-1.5 min-w-0">
                              <span className="text-xl shrink-0">{item.emoji}</span>
                              <span className="text-xs font-bold text-gray-700 truncate">{item.name}</span>
                            </div>
                            {hasItem && (
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  dispatch({ type: 'GIFT_ITEM', itemId, neighborId: n.id });
                                  toast({ title: 'Gift Sent!', description: `${n.name} loved your ${item.name}! +5 Favor` });
                                }}
                                className="bg-pink-500 hover:bg-pink-400 text-white text-[10px] px-2 py-1 rounded font-bold shadow-sm shrink-0 active:scale-95"
                              >
                                Send
                              </button>
                            )}
                          </div>
                        )
                      })}
                    </div>
                    {/* Triangle pointer */}
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-3 h-3 bg-pink-400 rotate-45"></div>
                  </div>
                )}
              </div>
            ))}
         </div>
      </div>
    </div>
  )
}

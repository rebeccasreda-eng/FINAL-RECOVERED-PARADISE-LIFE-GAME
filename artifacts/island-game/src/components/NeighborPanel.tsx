import React from 'react';
import { useGame } from '../game/GameContext';
import { useToast } from '@/hooks/use-toast';

export const NeighborPanel = () => {
  const { state, dispatch } = useGame();
  const { toast } = useToast();
  
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
         
         <div className="flex gap-4 overflow-x-auto pb-2 custom-scrollbar">
            {state.neighbors?.map(n => (
              <div key={n.id} className="bg-white border-4 border-[#d2b48c] rounded-2xl p-3 flex flex-col items-center gap-2 min-w-[160px] shadow-sm">
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
            ))}
         </div>
      </div>
    </div>
  )
}
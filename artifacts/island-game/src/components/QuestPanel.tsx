import React from 'react';
import { useGame } from '../game/GameContext';
import { QUESTS } from '../game/gameData';

export const QuestPanel = () => {
  const { state } = useGame();
  
  const unlockedQuests = QUESTS.filter(q => state.level >= q.unlockLevel);

  return (
    <div className="absolute right-6 top-24 bottom-32 w-80 bg-[#fff5d7] border-8 border-[#8b5a2b] rounded-3xl shadow-2xl flex flex-col overflow-hidden z-10 select-none">
      <div className="bg-[#8b5a2b] text-white p-4 text-center font-black text-2xl uppercase tracking-widest border-b-4 border-[#5c3a21] shadow-md">
        📋 Quests
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {unlockedQuests.map(q => {
          const progress = state.quests[q.id]?.progress || 0;
          const completed = state.quests[q.id]?.completed;
          return (
            <div key={q.id} className={`p-4 rounded-2xl border-4 transition-colors ${completed ? 'bg-green-100 border-green-400' : 'bg-white border-[#d2b48c] shadow-sm'}`}>
              <div className="flex items-start gap-3">
                 <div className="text-4xl drop-shadow-sm">{q.icon}</div>
                 <div className="flex-1">
                   <h4 className="font-bold text-[#5c3a21] text-lg leading-tight">{q.title}</h4>
                   <p className="text-sm text-[#8b5a2b] leading-snug mt-1 font-medium">{q.description}</p>
                 </div>
                 {completed && <div className="text-green-500 text-3xl font-black shrink-0">✓</div>}
              </div>
              {!completed && (
                <div className="mt-4 relative w-full bg-gray-200 h-4 rounded-full overflow-hidden border-2 border-gray-300">
                   <div className="absolute top-0 left-0 h-full bg-blue-500 transition-all duration-500" style={{ width: `${Math.min(100, (progress/q.targetCount)*100)}%` }} />
                   <div className="absolute inset-0 flex items-center justify-center text-[10px] text-black font-bold tracking-widest">{progress}/{q.targetCount}</div>
                </div>
              )}
              {completed && q.rewardCoins > 0 && (
                <div className="mt-2 text-right text-xs font-bold text-green-700 bg-green-200 inline-block float-right px-2 py-1 rounded-full">
                  +{q.rewardCoins} 🪙 | +{q.rewardXP} ⭐
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
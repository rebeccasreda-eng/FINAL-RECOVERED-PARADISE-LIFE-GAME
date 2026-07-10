import React from 'react';
import { useGame } from '../game/GameContext';
import { QUESTS } from '../game/gameData';

export const QuestPanel = ({ onClose }: { onClose: () => void }) => {
  const { state } = useGame();

  // Active quest = first uncompleted, unlocked, prereqs met
  const activeQuest = QUESTS.find(q =>
    state.level >= q.unlockLevel &&
    !state.quests[q.id]?.completed &&
    (!q.prereqs?.length || q.prereqs.every(pid => state.quests[pid]?.completed))
  );

  return (
    /* ── Full-screen backdrop ── */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.55)', fontFamily: "'Fredoka', sans-serif" }}
      onClick={onClose}
    >
      {/* ── Modal card ── */}
      <div
        className="relative overflow-hidden rounded-2xl shadow-2xl"
        style={{ width: 420, maxHeight: '90vh' }}
        onClick={e => e.stopPropagation()}
      >
        {/* ── "Quest" badge top-left ── */}
        <div
          className="absolute top-2 left-3 z-20 px-3 py-1 rounded-lg font-black text-sm text-white"
          style={{
            background: '#5a7a28',
            border: '2px solid #3a5010',
            boxShadow: '1px 2px 6px rgba(0,0,0,0.45)',
            letterSpacing: 1,
          }}
        >
          〔Quest〕
        </div>

        {/* ── Red ✕ close button top-right ── */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 z-20 w-9 h-9 rounded-lg flex items-center justify-center font-black text-xl text-white active:scale-90 transition-transform"
          style={{
            background: '#dd2222',
            border: '2px solid #aa1111',
            boxShadow: '1px 2px 5px rgba(0,0,0,0.45)',
          }}
          aria-label="Close"
        >
          ✕
        </button>

        {/* ── Orange amber header ── */}
        {activeQuest ? (
          <>
            <div
              className="pt-10 pb-5 px-6 text-center"
              style={{ background: 'linear-gradient(180deg, #f0a030 0%, #c87020 100%)' }}
            >
              <h1
                className="font-black uppercase"
                style={{
                  color: '#3a1800',
                  fontSize: 22,
                  letterSpacing: 2,
                  textShadow: '0 1px 2px rgba(255,255,255,0.25)',
                }}
              >
                {activeQuest.title.toUpperCase()}
              </h1>
              {activeQuest.subtitle && (
                <p className="mt-1 font-semibold" style={{ color: '#6a3010', fontSize: 13 }}>
                  {activeQuest.subtitle}
                </p>
              )}
            </div>

            {/* ── Body — parchment ── */}
            <div style={{ background: '#d4b896' }} className="px-5 pb-5">

              {/* OBJECTIVES */}
              <h2
                className="font-black uppercase text-center py-3"
                style={{ color: '#4a2800', fontSize: 15, letterSpacing: 3 }}
              >
                OBJECTIVES:
              </h2>

              <div className="space-y-2">
                {activeQuest.objectives && activeQuest.objectives.length > 0
                  ? activeQuest.objectives.map((obj, i) => {
                      const prog = state.quests[activeQuest.id]?.objectiveProgress?.[i] ?? 0;
                      const done = prog >= obj.targetCount;
                      return (
                        <div
                          key={i}
                          className="flex items-center gap-3 rounded-xl px-3 py-2"
                          style={{ background: done ? '#92b85a' : '#b89060' }}
                        >
                          {/* Icon box */}
                          <div
                            className="w-13 h-13 rounded-xl flex items-center justify-center text-3xl shrink-0 border-2"
                            style={{
                              width: 52, height: 52,
                              background: '#987040',
                              borderColor: '#705020',
                            }}
                          >
                            {obj.icon}
                          </div>
                          {/* Label */}
                          <div className="flex-1 font-bold" style={{ color: '#2a1000', fontSize: 14 }}>
                            {obj.description}
                          </div>
                          {/* Counter */}
                          <div
                            className="rounded-lg px-3 py-1 font-black text-center"
                            style={{
                              minWidth: 50,
                              background: done ? '#6a9830' : '#987040',
                              color: done ? '#fff' : '#2a1000',
                              fontSize: 14,
                            }}
                          >
                            {done ? '✓' : `${prog}/${obj.targetCount}`}
                          </div>
                        </div>
                      );
                    })
                  : /* single-objective fallback */ (
                    <div className="flex items-center gap-3 rounded-xl px-3 py-2" style={{ background: '#b89060' }}>
                      <div className="w-[52px] h-[52px] rounded-xl flex items-center justify-center text-3xl shrink-0 border-2"
                        style={{ background: '#987040', borderColor: '#705020' }}>
                        {activeQuest.icon}
                      </div>
                      <div className="flex-1 font-bold" style={{ color: '#2a1000', fontSize: 14 }}>
                        {activeQuest.description}
                      </div>
                      <div className="rounded-lg px-3 py-1 font-black text-center"
                        style={{ minWidth: 50, background: '#987040', color: '#2a1000', fontSize: 14 }}>
                        {Math.min(state.quests[activeQuest.id]?.progress ?? 0, activeQuest.targetCount)}/{activeQuest.targetCount}
                      </div>
                    </div>
                  )
                }
              </div>

              {/* REWARDS */}
              <h2
                className="font-black uppercase text-center pt-4 pb-2"
                style={{ color: '#4a2800', fontSize: 15, letterSpacing: 3 }}
              >
                REWARDS:
              </h2>
              <div
                className="flex justify-center gap-10 rounded-xl py-4"
                style={{ background: '#b89060' }}
              >
                <div className="flex flex-col items-center gap-1">
                  <div className="text-4xl drop-shadow">🪙</div>
                  <div className="font-bold" style={{ color: '#2a1000', fontSize: 13 }}>
                    {activeQuest.rewardCoins} Coins
                  </div>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <div className="text-4xl drop-shadow">⭐</div>
                  <div className="font-bold" style={{ color: '#2a1000', fontSize: 13 }}>
                    {activeQuest.rewardXP} EXP
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          /* No active quest */
          <>
            <div className="pt-10 pb-5 px-6 text-center"
              style={{ background: 'linear-gradient(180deg, #f0a030 0%, #c87020 100%)' }}>
              <h1 className="font-black uppercase" style={{ color: '#3a1800', fontSize: 22, letterSpacing: 2 }}>
                ALL DONE! 🎉
              </h1>
            </div>
            <div style={{ background: '#d4b896' }} className="px-5 py-8 text-center">
              <p className="font-bold text-lg" style={{ color: '#4a2800' }}>
                You've completed all available quests!
              </p>
              <p className="mt-1 font-semibold text-sm" style={{ color: '#7a5030' }}>
                Amazing work, island builder!
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

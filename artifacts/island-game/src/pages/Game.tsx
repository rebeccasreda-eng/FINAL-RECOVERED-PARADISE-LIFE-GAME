import React from 'react';
import { GameProvider, useGame } from '../game/GameContext';
import { IslandGrid } from '../components/IslandGrid';
import { HUD } from '../components/HUD';
import { QuestPanel } from '../components/QuestPanel';
import { QuestBanner } from '../components/QuestBanner';
import { ShopModal } from '../components/ShopModal';

const GameInner = () => {
  const { shopOpen, tutorial } = useGame();
  
  return (
    <div className="w-full h-[100dvh] bg-[#89cff0] overflow-hidden relative font-sans">
      <div className="w-full h-full overflow-auto">
        <div className="min-w-[1400px] min-h-[1000px] flex items-center justify-center p-32 pb-48 pt-48">
          <IslandGrid />
        </div>
      </div>
      
      <HUD />
      <QuestPanel />
      <QuestBanner />
      {shopOpen && <ShopModal />}
      
      {tutorial && (
        <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-yellow-400 text-yellow-900 px-8 py-4 rounded-3xl shadow-2xl border-4 border-yellow-600 font-black text-2xl animate-pulse z-40 pointer-events-none text-center">
          👆 Click any glowing tile to start!
        </div>
      )}
    </div>
  )
}

export default function Game() {
  return (
    <GameProvider>
       <GameInner />
    </GameProvider>
  )
}
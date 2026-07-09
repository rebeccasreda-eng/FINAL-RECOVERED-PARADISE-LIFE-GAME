import React, { useState } from 'react';
import { GameProvider, useGame } from '../game/GameContext';
import { IslandGrid } from '../components/IslandGrid';
import { HUD } from '../components/HUD';
import { QuestPanel } from '../components/QuestPanel';
import { QuestBanner } from '../components/QuestBanner';
import { ShopModal } from '../components/ShopModal';
import { CollectionsModal } from '../components/CollectionsModal';
import { WeatherModal } from '../components/WeatherModal';
import { CropPicker } from '../components/CropPicker';

const GameInner = () => {
  const { shopOpen, tutorial, state } = useGame();
  const [collectionsOpen, setCollectionsOpen] = useState(false);
  const [weatherOpen, setWeatherOpen] = useState(false);
  
  return (
    <div className="w-full h-[100dvh] bg-[#89cff0] overflow-hidden relative font-sans">
      <div className={`weather-overlay ${state.weather}`}></div>
      {state.weather === 'RAINY' && <div className="absolute inset-0 pointer-events-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjIwIj48cmVjdCB3aWR0aD0iMSIgaGVpZ2h0PSIxMCIgZmlsbD0icmdiYSgyNTUsIDI1NSwgMjU1LCAwLjUpIiB4PSIyIiB5PSI1Ii8+PC9zdmc+')] opacity-50 z-10 animate-[slide_1s_linear_infinite]" style={{ backgroundSize: '20px 100px' }}></div>}
      
      <div className="w-full h-full overflow-auto relative">
        <div className="min-w-[1400px] min-h-[1000px] flex items-center justify-center p-32 pb-48 pt-48 relative">
          <IslandGrid />
          <div className="absolute top-[48%] left-[50%] transform -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none drop-shadow-2xl flex flex-col items-center">
            <div className="animate-bounce-slow text-9xl select-none">👩‍🌾</div>
          </div>
        </div>
      </div>
      
      <HUD onOpenCollections={() => setCollectionsOpen(true)} onOpenWeather={() => setWeatherOpen(true)} />
      <QuestPanel />
      <QuestBanner />
      <CropPicker />
      {shopOpen && <ShopModal />}
      {collectionsOpen && <CollectionsModal onClose={() => setCollectionsOpen(false)} />}
      {weatherOpen && <WeatherModal onClose={() => setWeatherOpen(false)} />}
      
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
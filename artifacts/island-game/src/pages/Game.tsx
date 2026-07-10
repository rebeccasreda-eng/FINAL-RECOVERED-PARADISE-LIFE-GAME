import React, { useState, useCallback } from 'react';
import { GameProvider, useGame } from '../game/GameContext';
import { IslandGrid } from '../components/IslandGrid';
import { HUD } from '../components/HUD';
import { QuestPanel } from '../components/QuestPanel';
import { QuestBanner } from '../components/QuestBanner';
import { ShopModal } from '../components/ShopModal';
import { CollectionsModal } from '../components/CollectionsModal';
import { WeatherModal } from '../components/WeatherModal';
import { CropPicker } from '../components/CropPicker';
import { NeighborPanel } from '../components/NeighborPanel';
import { WelcomeScreen, PlayerProfile } from '../components/WelcomeScreen';

const PROFILE_KEY = 'paradise-player-profile';

function loadProfile(): PlayerProfile | null {
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    if (raw) {
      const p = JSON.parse(raw) as PlayerProfile;
      if (p.hasSetup) return p;
    }
  } catch {}
  return null;
}

function saveProfile(p: PlayerProfile) {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(p));
}

const GameInner = ({ profile }: { profile: PlayerProfile }) => {
  const { shopOpen, tutorial, state, neighborVisitPrompt, setNeighborVisitPrompt, dispatch } = useGame();
  const [collectionsOpen, setCollectionsOpen] = useState(false);
  const [weatherOpen, setWeatherOpen] = useState(false);

  // Pick avatar emoji from profile
  const FEMALE_AVATARS = ['👩‍🌾','👩🏻‍🌾','👩🏼‍🌾','👩🏽‍🌾','👩🏾‍🌾','👩🏿‍🌾'];
  const MALE_AVATARS   = ['👨‍🌾','👨🏻‍🌾','👨🏼‍🌾','👨🏽‍🌾','👨🏾‍🌾','👨🏿‍🌾'];
  const avatarList = profile.gender === 'female' ? FEMALE_AVATARS : MALE_AVATARS;
  const farmerEmoji = avatarList[profile.skinTone + 1] ?? avatarList[0];

  return (
    <div className="w-full h-[100dvh] bg-[#89cff0] overflow-hidden relative font-sans">
      <div className={`weather-overlay ${state.weather}`}></div>
      {state.weather === 'RAINY' && <div className="absolute inset-0 pointer-events-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjIwIj48cmVjdCB3aWR0aD0iMSIgaGVpZ2h0PSIxMCIgZmlsbD0icmdiYSgyNTUsIDI1NSwgMjU1LCAwLjUpIiB4PSIyIiB5PSI1Ii8+PC9zdmc+')] opacity-50 z-10 animate-[slide_1s_linear_infinite]" style={{ backgroundSize: '20px 100px' }}></div>}

      <div className="w-full h-full overflow-auto relative">
        <div className="min-w-[1400px] min-h-[1000px] flex items-center justify-center p-32 pb-48 pt-48 relative">
          <IslandGrid />
          {/* Player avatar on island */}
          <div className="absolute top-[48%] left-[50%] transform -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none drop-shadow-2xl flex flex-col items-center">
            <div className="animate-bounce-slow text-9xl select-none">{farmerEmoji}</div>
          </div>
        </div>
      </div>

      <HUD
        onOpenCollections={() => setCollectionsOpen(true)}
        onOpenWeather={() => setWeatherOpen(true)}
        playerName={profile.name}
      />
      <NeighborPanel />
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

      {neighborVisitPrompt && state.visitingNeighbor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#fff5d7] p-8 rounded-3xl border-8 border-green-500 shadow-2xl flex flex-col items-center gap-4 w-[400px]">
            <div className="text-7xl bg-white w-24 h-24 rounded-full flex items-center justify-center border-4 border-green-300 shadow-md">
              {state.neighbors.find(n => n.id === state.visitingNeighbor?.neighborId)?.avatar}
            </div>
            <h2 className="text-2xl font-black text-[#5c3a21] text-center">
              {state.neighbors.find(n => n.id === state.visitingNeighbor?.neighborId)?.name} is visiting!
            </h2>
            <div className="bg-green-100 border-2 border-green-300 p-4 rounded-xl text-center w-full">
              <p className="text-green-800 font-bold mb-2">Offer a warm welcome?</p>
              <div className="flex justify-center gap-4 text-xl font-black">
                <span className="text-blue-600">+5 ⚡</span>
                <span className="text-yellow-600">+10 🪙</span>
              </div>
            </div>
            <div className="flex gap-4 w-full mt-2">
              <button
                onClick={() => { dispatch({ type: 'DECLINE_NEIGHBOR_VISIT' }); setNeighborVisitPrompt(false); }}
                className="flex-1 py-3 rounded-xl font-bold bg-gray-300 hover:bg-gray-400 text-gray-700 border-b-4 border-gray-500 active:scale-95 transition-transform"
              >
                No Thanks
              </button>
              <button
                onClick={() => { dispatch({ type: 'ACCEPT_NEIGHBOR_VISIT' }); setNeighborVisitPrompt(false); }}
                className="flex-1 py-3 rounded-xl font-black bg-green-500 hover:bg-green-400 text-white border-b-4 border-green-700 active:scale-95 transition-transform shadow-lg"
              >
                Welcome!
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default function Game() {
  const [profile, setProfile] = useState<PlayerProfile | null>(() => loadProfile());

  const handlePlay = useCallback((p: PlayerProfile) => {
    saveProfile(p);
    setProfile(p);
  }, []);

  return (
    <GameProvider>
      {/* Island always renders — visible as background on welcome screen */}
      {profile ? (
        <GameInner profile={profile} />
      ) : (
        <>
          {/* Background island (non-interactive, dimmed) */}
          <div className="w-full h-[100dvh] bg-[#89cff0] overflow-hidden relative pointer-events-none select-none">
            <div className="w-full h-full overflow-hidden flex items-center justify-center">
              <div className="min-w-[1400px] min-h-[1000px] flex items-center justify-center p-32 opacity-80">
                <IslandGrid />
              </div>
            </div>
          </div>
          <WelcomeScreen onPlay={handlePlay} />
        </>
      )}
    </GameProvider>
  );
}

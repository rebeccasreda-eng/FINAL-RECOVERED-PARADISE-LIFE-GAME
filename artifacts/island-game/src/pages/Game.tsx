import React, { useState, useCallback, useRef } from 'react';
import { GameProvider, useGame } from '../game/GameContext';
import { IslandGrid } from '../components/IslandGrid';
import { HUD } from '../components/HUD';
import { TopNav } from '../components/TopNav';
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

// Top bar heights: TopNav=36px, ResourceBar=52px → total 88px
// Bottom bar: 96px
const TOP_H  = 88;
const BOT_H  = 96;

const FEMALE_AVATARS = ['👩‍🌾','👩🏻‍🌾','👩🏼‍🌾','👩🏽‍🌾','👩🏾‍🌾','👩🏿‍🌾'];
const MALE_AVATARS   = ['👨‍🌾','👨🏻‍🌾','👨🏼‍🌾','👨🏽‍🌾','👨🏾‍🌾','👨🏿‍🌾'];

const GameInner = ({ profile }: { profile: PlayerProfile }) => {
  const { shopOpen, tutorial, state, neighborVisitPrompt, setNeighborVisitPrompt, dispatch } = useGame();
  const [collectionsOpen, setCollectionsOpen] = useState(false);
  const [weatherOpen, setWeatherOpen]         = useState(false);

  const avatarList  = profile.gender === 'female' ? FEMALE_AVATARS : MALE_AVATARS;
  const farmerEmoji = avatarList[profile.skinTone + 1] ?? avatarList[0];

  /* ── Mouse-drag pan ── */
  const scrollRef  = useRef<HTMLDivElement>(null);
  const dragging   = useRef(false);
  const dragOrigin = useRef({ x: 0, y: 0, sl: 0, st: 0 });
  const [cursor, setCursor] = useState<'grab' | 'grabbing'>('grab');

  const onMouseDown = (e: React.MouseEvent) => {
    // Don't intercept clicks on interactive elements
    if ((e.target as HTMLElement).closest('button, input, [role="button"], .no-drag')) return;
    dragging.current = true;
    dragOrigin.current = {
      x:  e.clientX,
      y:  e.clientY,
      sl: scrollRef.current?.scrollLeft ?? 0,
      st: scrollRef.current?.scrollTop  ?? 0,
    };
    setCursor('grabbing');
    e.preventDefault();
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!dragging.current || !scrollRef.current) return;
    const dx = e.clientX - dragOrigin.current.x;
    const dy = e.clientY - dragOrigin.current.y;
    scrollRef.current.scrollLeft = dragOrigin.current.sl - dx;
    scrollRef.current.scrollTop  = dragOrigin.current.st - dy;
  };

  const onMouseUp   = () => { dragging.current = false; setCursor('grab'); };
  const onMouseLeave = () => { dragging.current = false; setCursor('grab'); };

  return (
    <div className="w-full h-[100dvh] overflow-hidden relative font-sans" style={{ fontFamily: "'Fredoka', sans-serif" }}>
      {/* Weather overlay */}
      <div className={`weather-overlay ${state.weather}`} />
      {state.weather === 'RAINY' && (
        <div
          className="absolute inset-0 pointer-events-none opacity-50 z-10 animate-[slide_1s_linear_infinite]"
          style={{
            backgroundImage: "url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjIwIj48cmVjdCB3aWR0aD0iMSIgaGVpZ2h0PSIxMCIgZmlsbD0icmdiYSgyNTUsIDI1NSwgMjU1LCAwLjUpIiB4PSIyIiB5PSI1Ii8+PC9zdmc+')",
            backgroundSize: '20px 100px',
          }}
        />
      )}

      {/* ── Scrollable island area ── */}
      <div
        ref={scrollRef}
        className="absolute overflow-auto"
        style={{
          top: TOP_H,
          bottom: BOT_H,
          left: 0,
          right: 0,
          cursor,
          userSelect: 'none',
        }}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseLeave}
      >
        <div className="min-w-[1600px] min-h-[1200px] flex items-center justify-center p-40 relative"
          style={{ background: 'linear-gradient(135deg, #60b8e8 0%, #89cff0 40%, #a8dff8 100%)' }}
        >
          <IslandGrid />
          {/* Farmer avatar */}
          <div className="absolute top-[48%] left-[50%] -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none drop-shadow-2xl">
            <div className="animate-bounce-slow text-9xl select-none">{farmerEmoji}</div>
          </div>
        </div>
      </div>

      {/* ── Fixed chrome ── */}
      <TopNav
        playerName={profile.name}
        onOpenCollections={() => setCollectionsOpen(true)}
        onOpenShop={() => {}}
      />
      <HUD
        onOpenCollections={() => setCollectionsOpen(true)}
        onOpenWeather={() => setWeatherOpen(true)}
        playerName={profile.name}
      />
      <NeighborPanel />
      <QuestPanel />
      <QuestBanner />
      <CropPicker />

      {shopOpen      && <ShopModal />}
      {collectionsOpen && <CollectionsModal onClose={() => setCollectionsOpen(false)} />}
      {weatherOpen   && <WeatherModal onClose={() => setWeatherOpen(false)} />}

      {/* Tutorial hint */}
      {tutorial && (
        <div
          className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 px-8 py-4 rounded-3xl shadow-2xl border-4 font-black text-2xl animate-pulse z-40 pointer-events-none text-center"
          style={{ background: '#fde047', color: '#713f12', borderColor: '#ca8a04' }}
        >
          👆 Click any glowing tile to start!
        </div>
      )}

      {/* Visiting neighbour modal */}
      {neighborVisitPrompt && state.visitingNeighbor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
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
      {profile ? (
        <GameInner profile={profile} />
      ) : (
        <>
          <div className="w-full h-[100dvh] overflow-hidden relative pointer-events-none select-none"
            style={{ background: 'linear-gradient(135deg, #60b8e8 0%, #89cff0 100%)' }}>
            <div className="w-full h-full flex items-center justify-center opacity-80">
              <div className="min-w-[1600px] min-h-[1200px] flex items-center justify-center p-40">
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

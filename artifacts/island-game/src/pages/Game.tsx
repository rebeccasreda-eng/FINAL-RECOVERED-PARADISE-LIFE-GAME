import React, { useState, useCallback, useRef, useEffect, useLayoutEffect } from 'react';
import { GameProvider, useGame } from '../game/GameContext';
import { IslandGrid, WORLD_W, WORLD_H } from '../components/IslandGrid';
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
  } catch { /* noop */ }
  return null;
}

function saveProfile(p: PlayerProfile) {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(p));
}

const TOP_H = 88;
const BOT_H = 96;

// Player start tile — centre of the 21×21 elliptical island
const PLAYER_START = { x: 10, y: 10 };
const MS_PER_TILE  = 420; // walk speed in milliseconds per tile (matches reference)

// World centre (used to offset the world container so island is centred on load)
const WORLD_CX = WORLD_W / 2;
const WORLD_CY = WORLD_H / 2;

/* ── Cloud layer (fixed in viewport, not panned) ──────────────────────── */
const CLOUDS = [
  { top: '12%', width: 160, duration: '28s', delay: '0s',    opacity: 0.78 },
  { top: '22%', width: 110, duration: '38s', delay: '-12s',  opacity: 0.60 },
  { top:  '6%', width: 200, duration: '22s', delay: '-7s',   opacity: 0.85 },
  { top: '30%', width:  90, duration: '45s', delay: '-20s',  opacity: 0.50 },
  { top: '16%', width: 130, duration: '33s', delay: '-3s',   opacity: 0.68 },
];

const CloudSVG = ({ opacity = 0.9 }: { opacity?: number }) => (
  <svg viewBox="0 0 160 70" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block' }}>
    <ellipse cx="80"  cy="55" rx="68" ry="22" fill="white" opacity={opacity}/>
    <ellipse cx="50"  cy="42" rx="34" ry="28" fill="white" opacity={opacity}/>
    <ellipse cx="90"  cy="36" rx="40" ry="30" fill="white" opacity={opacity}/>
    <ellipse cx="128" cy="48" rx="26" ry="20" fill="white" opacity={opacity * 0.9}/>
    <ellipse cx="80"  cy="60" rx="64" ry="11" fill="#c8ddf0" opacity="0.28"/>
  </svg>
);

/* ── GameInner ─────────────────────────────────────────────────────────── */
const GameInner = ({ profile }: { profile: PlayerProfile }) => {
  const { shopOpen, tutorial, state, neighborVisitPrompt, setNeighborVisitPrompt, dispatch } = useGame();
  const [collectionsOpen, setCollectionsOpen] = useState(false);
  const [weatherOpen,     setWeatherOpen]     = useState(false);

  /* ── Player movement — tile-by-tile step walk (matches reference HTML) ── */
  // Current integer tile the player occupies
  const playerTileRef = useRef({ x: PLAYER_START.x, y: PLAYER_START.y });
  // Blocks new moves while walking (ref avoids stale closures in setTimeout chain)
  const movingRef = useRef(false);

  const [playerTile, setPlayerTile] = useState(playerTileRef.current);
  const [isWalking,  setIsWalking]  = useState(false);
  const [facing,     setFacing]     = useState<'left' | 'right'>('right');

  // Keep a layout-synchronous snapshot of tiles so the setTimeout chain always
  // sees the most recent tile state without stale-closure risk.
  const tilesRef = useRef(state.tiles);
  useLayoutEffect(() => { tilesRef.current = state.tiles; }, [state.tiles]);

  // Stores the pending walk-step timer so it can be cancelled on unmount.
  const walkTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Cancel any in-flight walk when the component unmounts.
  useEffect(() => () => {
    if (walkTimerRef.current !== null) clearTimeout(walkTimerRef.current);
  }, []);

  const moveTo = useCallback((tx: number, ty: number) => {
    if (movingRef.current) return;                           // ignore clicks mid-walk
    const dest = tilesRef.current[`${tx},${ty}`];
    if (!dest || dest.type === 'WATER') return;

    // Build a Chebyshev (8-directional) straight-line path to the target.
    // Stop at the first blocked tile so the character never hops over water.
    const path: { x: number; y: number }[] = [];
    const { x: ox, y: oy } = playerTileRef.current;
    const steps = Math.max(Math.abs(tx - ox), Math.abs(ty - oy));
    for (let i = 1; i <= steps; i++) {
      const nx = Math.round(ox + (tx - ox) * i / steps);
      const ny = Math.round(oy + (ty - oy) * i / steps);
      const t  = tilesRef.current[`${nx},${ny}`];
      if (!t || t.type === 'WATER') break;                  // stop, don't skip
      path.push({ x: nx, y: ny });
    }
    if (!path.length) return;

    movingRef.current = true;
    setIsWalking(true);

    // Set initial facing direction
    const firstDx = path[0].x - playerTileRef.current.x;
    if (firstDx !== 0) setFacing(firstDx > 0 ? 'right' : 'left');

    let idx = 0;
    function step() {
      const p    = path[idx];
      const prev = playerTileRef.current;

      // Update facing per step so diagonal paths look natural
      const dx = p.x - prev.x;
      if (dx !== 0) setFacing(dx > 0 ? 'right' : 'left');

      playerTileRef.current = p;
      setPlayerTile({ ...p });                              // triggers CSS transition

      idx++;
      if (idx < path.length) {
        walkTimerRef.current = setTimeout(step, MS_PER_TILE);
      } else {
        walkTimerRef.current = null;
        movingRef.current = false;
        setIsWalking(false);
      }
    }
    step();
  }, []);

  /* ── Pan + zoom (imperative DOM for 60fps drag perf) ── */
  const viewportRef  = useRef<HTMLDivElement>(null);
  const worldRef     = useRef<HTMLDivElement>(null);
  const panRef       = useRef({ x: 0, y: 0 });
  const zoomRef      = useRef(1.0);
  const [zoom, setZoom]     = useState(1.0);
  const [cursor, setCursor] = useState<'grab' | 'grabbing'>('grab');
  const dragStartRef = useRef<{ mx: number; my: number; px: number; py: number } | null>(null);
  const didDragRef   = useRef(false);

  /** Apply translate+scale directly to the world container DOM node. */
  const applyTransform = useCallback((px: number, py: number, z: number) => {
    if (worldRef.current) {
      worldRef.current.style.transform =
        `translate(${px - WORLD_CX}px, ${py - WORLD_CY}px) scale(${z})`;
    }
  }, []);

  // Initial position: island visually centred on load
  useEffect(() => { applyTransform(0, 0, 1.0); }, [applyTransform]);

  /* Mouse-wheel zoom (non-passive, zooms at cursor point) */
  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;
    const handler = (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) return;
      e.preventDefault();
      const rect = el.getBoundingClientRect();
      // Cursor offset from viewport centre (= world origin on screen)
      const cx = e.clientX - rect.left  - rect.width  / 2;
      const cy = e.clientY - rect.top   - rect.height / 2;
      const oldZ = zoomRef.current;
      const newZ = Math.max(0.4, Math.min(2.4, oldZ * (e.deltaY < 0 ? 1.1 : 0.9)));
      // Transform: translate(panX-CX, panY-CY) scale(z), origin 0 0
      // screen_x = z*wx + (panX - WORLD_CX)  →  newPanX that keeps wx at cx:
      // newPanX = cx + WORLD_CX - wx*newZ  where  wx = (cx + WORLD_CX - panX) / oldZ
      const ratio = newZ / oldZ;
      const newPX = panRef.current.x + (cx + WORLD_CX) * (1 - ratio);
      const newPY = panRef.current.y + (cy + WORLD_CY) * (1 - ratio);
      panRef.current = { x: newPX, y: newPY };
      zoomRef.current = newZ;
      applyTransform(newPX, newPY, newZ);
      setZoom(newZ);
    };
    el.addEventListener('wheel', handler, { passive: false });
    return () => el.removeEventListener('wheel', handler);
  }, [applyTransform]);

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('[data-nodrag], button, input')) return;
    dragStartRef.current = {
      mx: e.clientX, my: e.clientY,
      px: panRef.current.x, py: panRef.current.y,
    };
    didDragRef.current = false;
    setCursor('grabbing');
    e.preventDefault();
  }, []);

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    if (!dragStartRef.current) return;
    const dx = e.clientX - dragStartRef.current.mx;
    const dy = e.clientY - dragStartRef.current.my;
    if (!didDragRef.current && Math.abs(dx) + Math.abs(dy) > 3) didDragRef.current = true;
    if (didDragRef.current) {
      const nx = dragStartRef.current.px + dx;
      const ny = dragStartRef.current.py + dy;
      panRef.current = { x: nx, y: ny };
      applyTransform(nx, ny, zoomRef.current);
    }
  }, [applyTransform]);

  const onMouseUp = useCallback(() => {
    dragStartRef.current = null;
    setCursor('grab');
    // Delay clearing didDrag so the browser's click event (which fires after mouseup)
    // can still be suppressed when the user was panning.
    setTimeout(() => { didDragRef.current = false; }, 0);
  }, []);

  /** Zoom button helper — zooms centred on viewport */
  const zoomBy = useCallback((factor: number) => {
    const newZ = Math.max(0.4, Math.min(2.4, zoomRef.current * factor));
    zoomRef.current = newZ;
    applyTransform(panRef.current.x, panRef.current.y, newZ);
    setZoom(newZ);
  }, [applyTransform]);

  return (
    <div className="w-full h-[100dvh] overflow-hidden relative" style={{ fontFamily: "'Fredoka', sans-serif" }}>

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

      {/* ── Cloud layer (fixed in viewport — NOT panned with the world) ── */}
      <div
        className="absolute pointer-events-none overflow-hidden"
        style={{ top: TOP_H, bottom: BOT_H, left: 0, right: 0, zIndex: 12 }}
        aria-hidden="true"
      >
        {CLOUDS.map((c, i) => (
          <div
            key={i}
            className="cloud-drift absolute"
            style={{
              top: c.top, width: c.width,
              animationDuration: c.duration,
              animationDelay: c.delay,
            }}
          >
            <CloudSVG opacity={c.opacity} />
          </div>
        ))}
      </div>

      {/* ── Viewport (overflow:hidden, handles drag events) ── */}
      <div
        ref={viewportRef}
        className="absolute"
        style={{
          top: TOP_H, bottom: BOT_H, left: 0, right: 0,
          overflow: 'hidden',
          cursor,
        }}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
      >
        {/*
          World container — positioned so its (left: 50%, top: 50%) anchor
          maps to the viewport centre. The CSS transform is managed imperatively
          via worldRef for 60fps drag performance.
          Initial transform: translate(-WORLD_CX, -WORLD_CY) centres the island.
        */}
        <div
          ref={worldRef}
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            transformOrigin: '0 0',
            willChange: 'transform',
          }}
        >
          <IslandGrid
            playerX={playerTile.x}
            playerY={playerTile.y}
            characterId={profile.characterId || 'mia'}
            isWalking={isWalking}
            facing={facing}
            onTileClick={moveTo}
          />
        </div>
      </div>

      {/* ── Zoom controls ── */}
      <div
        data-nodrag
        className="absolute z-40 flex flex-col gap-1"
        style={{ bottom: BOT_H + 8, right: 12 }}
      >
        <button
          onClick={() => zoomBy(1.2)}
          className="w-9 h-9 rounded-full shadow-lg text-lg font-black flex items-center justify-center active:scale-95 transition-transform"
          style={{ background: 'rgba(255,255,255,0.92)', border: '2px solid #c8a56a', color: '#5c3a21' }}
          title="Zoom in"
        >+</button>
        <button
          onClick={() => { panRef.current = { x: 0, y: 0 }; zoomRef.current = 1; applyTransform(0, 0, 1); setZoom(1); }}
          className="w-9 h-9 rounded-full shadow-lg text-xs font-black flex items-center justify-center active:scale-95 transition-transform"
          style={{ background: 'rgba(255,255,255,0.92)', border: '2px solid #c8a56a', color: '#5c3a21' }}
          title="Reset view"
        >⌂</button>
        <button
          onClick={() => zoomBy(0.83)}
          className="w-9 h-9 rounded-full shadow-lg text-lg font-black flex items-center justify-center active:scale-95 transition-transform"
          style={{ background: 'rgba(255,255,255,0.92)', border: '2px solid #c8a56a', color: '#5c3a21' }}
          title="Zoom out"
        >−</button>
      </div>

      {/* ── Fixed HUD chrome ── */}
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

      {shopOpen         && <ShopModal />}
      {collectionsOpen  && <CollectionsModal onClose={() => setCollectionsOpen(false)} />}
      {weatherOpen      && <WeatherModal    onClose={() => setWeatherOpen(false)} />}

      {/* Tutorial banner */}
      {tutorial && (
        <div
          className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 px-8 py-4 rounded-3xl shadow-2xl border-4 font-black text-2xl animate-pulse z-40 pointer-events-none text-center"
          style={{ background: '#fde047', color: '#713f12', borderColor: '#ca8a04' }}
        >
          👆 Click any glowing tile to start!
        </div>
      )}

      {/* Neighbour visit prompt */}
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
              >No Thanks</button>
              <button
                onClick={() => { dispatch({ type: 'ACCEPT_NEIGHBOR_VISIT' }); setNeighborVisitPrompt(false); }}
                className="flex-1 py-3 rounded-xl font-black bg-green-500 hover:bg-green-400 text-white border-b-4 border-green-700 active:scale-95 transition-transform shadow-lg"
              >Welcome!</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/* ── Game root ─────────────────────────────────────────────────────────── */
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
          {/* Background island preview (static, no character) */}
          <div
            className="w-full h-[100dvh] overflow-hidden relative pointer-events-none select-none"
            style={{ background: 'linear-gradient(160deg, #60b8e8 0%, #89cff0 55%, #a8dff8 100%)' }}
          >
            <div
              style={{
                position: 'absolute',
                left: '50%',
                top: '50%',
                transform: `translate(-${WORLD_W / 2}px, -${WORLD_H / 2}px)`,
                opacity: 0.82,
              }}
            >
              <IslandGrid
                playerX={-999} playerY={-999}
                characterId="" isWalking={false} facing="right"
                onTileClick={() => {}}
              />
            </div>
          </div>
          <WelcomeScreen onPlay={handlePlay} />
        </>
      )}
    </GameProvider>
  );
}

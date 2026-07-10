import React, { useState, useCallback, useRef, useEffect, useLayoutEffect } from 'react';
import { GameProvider, useGame } from '../game/GameContext';
import { IslandGrid, WORLD_W, WORLD_H } from '../components/IslandGrid';
import { HUD } from '../components/HUD';
import { TopNav } from '../components/TopNav';
import { useBgm } from '../hooks/useBgm';
import { QuestPanel } from '../components/QuestPanel';
import { QuestNotifier } from '../components/QuestNotifier';
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
const MOVE_SPEED = 6.0; // tiles per second (free movement)

// World centre (used to offset the world container so island is centred on load)
const WORLD_CX = WORLD_W / 2;
const WORLD_CY = WORLD_H / 2;

/* ── Cloud layer (fixed in viewport, not panned) ──────────────────────── */

/* ── GameInner ─────────────────────────────────────────────────────────── */
const GameInner = ({ profile }: { profile: PlayerProfile }) => {
  const { shopOpen, tutorial, state, dispatch } = useGame();
  const [collectionsOpen,  setCollectionsOpen]  = useState(false);
  const [weatherOpen,      setWeatherOpen]      = useState(false);
  const [questPanelOpen,   setQuestPanelOpen]   = useState(false);
  const { muted: bgmMuted, toggle: toggleBgm } = useBgm('/bgm.mp3');

  /* ── Player movement — free analog movement (WASD / arrows + click-to-glide) ── */

  // Float tile-space position (supports sub-tile interpolation)
  const playerPosRef = useRef<{ x: number; y: number }>({ x: PLAYER_START.x, y: PLAYER_START.y });
  const [playerPos, setPlayerPos] = useState(playerPosRef.current);
  const [isWalking, setIsWalking] = useState(false);
  const [facing,    setFacing]    = useState<'left' | 'right'>('right');

  // Click-to-glide destination; null = no pending target
  const targetRef = useRef<{ x: number; y: number } | null>(null);

  // Currently held direction keys
  const keysRef = useRef({ up: false, down: false, left: false, right: false });

  // rAF bookkeeping
  const rafRef       = useRef<number | null>(null);
  const lastTimeRef  = useRef<number | null>(null);
  const wasWalkRef   = useRef(false);
  const facingRef    = useRef<'left' | 'right'>('right');

  // Stale-closure-safe tiles access
  const tilesRef = useRef(state.tiles);
  useLayoutEffect(() => { tilesRef.current = state.tiles; }, [state.tiles]);

  /** True if the tile nearest (x, y) exists and is not water */
  const canWalk = useCallback((x: number, y: number): boolean => {
    const t = tilesRef.current[`${Math.round(x)},${Math.round(y)}`];
    return !!t && t.type !== 'WATER';
  }, []);

  // Main game loop — runs every animation frame
  const tick = useCallback((now: number) => {
    if (lastTimeRef.current === null) lastTimeRef.current = now;
    const dt = Math.min((now - lastTimeRef.current) / 1000, 0.05); // cap at 50 ms
    lastTimeRef.current = now;

    const keys = keysRef.current;
    const pos  = playerPosRef.current;

    // ── Build velocity in tile-space ──────────────────────────────────────
    // Iso projection: screenX = (tx−ty)*TW/2, screenY = (tx+ty)*TH/2
    //   W/↑ → tile (−1,−1) → pure screen-up
    //   S/↓ → tile (+1,+1) → pure screen-down
    //   D/→ → tile (+1,−1) → pure screen-right
    //   A/← → tile (−1,+1) → pure screen-left
    let vx = 0, vy = 0;
    if (keys.up)    { vx -= 1; vy -= 1; }
    if (keys.down)  { vx += 1; vy += 1; }
    if (keys.right) { vx += 1; vy -= 1; }
    if (keys.left)  { vx -= 1; vy += 1; }

    const hasKeys = vx !== 0 || vy !== 0;

    if (hasKeys) {
      targetRef.current = null;           // keyboard overrides click target
      const len = Math.hypot(vx, vy);
      vx /= len; vy /= len;
    } else if (targetRef.current) {
      const ddx = targetRef.current.x - pos.x;
      const ddy = targetRef.current.y - pos.y;
      const dist = Math.hypot(ddx, ddy);
      if (dist < 0.06) {
        targetRef.current = null;         // arrived
      } else {
        vx = ddx / dist; vy = ddy / dist;
      }
    }

    // ── Apply movement with slide collision ───────────────────────────────
    let moved = false;
    if (vx !== 0 || vy !== 0) {
      const step = MOVE_SPEED * dt;
      const nx = pos.x + vx * step;
      const ny = pos.y + vy * step;

      let fx = pos.x, fy = pos.y;
      if (canWalk(nx, pos.y)) fx = nx;   // try X axis
      if (canWalk(fx, ny))    fy = ny;   // try Y axis

      if (fx !== pos.x || fy !== pos.y) {
        playerPosRef.current = { x: fx, y: fy };
        setPlayerPos({ x: fx, y: fy });
        moved = true;

        // Facing = screen-horizontal direction of movement (vx − vy = screen-dx sign)
        const screenDx = vx - vy;
        if (screenDx !== 0) {
          const nf = screenDx > 0 ? 'right' : 'left';
          if (nf !== facingRef.current) { facingRef.current = nf; setFacing(nf); }
        }
      }
    }

    // Only update walk animation state when it changes
    if (moved !== wasWalkRef.current) {
      wasWalkRef.current = moved;
      setIsWalking(moved);
    }

    rafRef.current = requestAnimationFrame(tick);
  }, [canWalk]);

  // Start loop on mount, cancel on unmount
  useEffect(() => {
    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current !== null) cancelAnimationFrame(rafRef.current); };
  }, [tick]);

  // WASD / arrow key listeners
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement)?.closest('input,textarea')) return;
      switch (e.code) {
        case 'KeyW': case 'ArrowUp':    keysRef.current.up    = true; e.preventDefault(); break;
        case 'KeyS': case 'ArrowDown':  keysRef.current.down  = true; e.preventDefault(); break;
        case 'KeyD': case 'ArrowRight': keysRef.current.right = true; e.preventDefault(); break;
        case 'KeyA': case 'ArrowLeft':  keysRef.current.left  = true; e.preventDefault(); break;
      }
    };
    const up = (e: KeyboardEvent) => {
      switch (e.code) {
        case 'KeyW': case 'ArrowUp':    keysRef.current.up    = false; break;
        case 'KeyS': case 'ArrowDown':  keysRef.current.down  = false; break;
        case 'KeyD': case 'ArrowRight': keysRef.current.right = false; break;
        case 'KeyA': case 'ArrowLeft':  keysRef.current.left  = false; break;
      }
    };
    window.addEventListener('keydown', down);
    window.addEventListener('keyup',   up);
    return () => { window.removeEventListener('keydown', down); window.removeEventListener('keyup', up); };
  }, []);

  // Click-to-glide: just set the target, loop does the rest
  const moveTo = useCallback((tx: number, ty: number) => {
    const dest = tilesRef.current[`${tx},${ty}`];
    if (!dest || dest.type === 'WATER') return;
    targetRef.current = { x: tx, y: ty };
  }, []);

  /* ── Pan + zoom (imperative DOM for 60fps drag perf) ── */
  const viewportRef  = useRef<HTMLDivElement>(null);
  const worldRef     = useRef<HTMLDivElement>(null);
  const panRef       = useRef({ x: 0, y: 0 });
  const INITIAL_ZOOM = 2.2;   // start close — tiles fill the screen nicely
  const MIN_ZOOM     = 0.5;   // zoom out to see the whole island at once
  const MAX_ZOOM     = 3.2;   // a bit extra for inspecting objects up close
  const zoomRef      = useRef(INITIAL_ZOOM);
  const [zoom, setZoom]     = useState(INITIAL_ZOOM);
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

  // Initial position: island visually centred on load, zoomed in
  useEffect(() => { applyTransform(0, 0, INITIAL_ZOOM); }, [applyTransform]); // eslint-disable-line react-hooks/exhaustive-deps

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
      const newZ = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, oldZ * (e.deltaY < 0 ? 1.1 : 0.9)));
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
    const newZ = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, zoomRef.current * factor));
    zoomRef.current = newZ;
    applyTransform(panRef.current.x, panRef.current.y, newZ);
    setZoom(newZ);
  }, [applyTransform]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="w-full h-[100dvh] overflow-hidden relative" style={{ fontFamily: "'Fredoka', sans-serif" }}>

      {/* Weather overlay */}
      <div className={`weather-overlay ${state.weather}`} />

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
            playerX={playerPos.x}
            playerY={playerPos.y}
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
          onClick={() => { panRef.current = { x: 0, y: 0 }; zoomRef.current = INITIAL_ZOOM; applyTransform(0, 0, INITIAL_ZOOM); setZoom(INITIAL_ZOOM); }}
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
        bgmMuted={bgmMuted}
        onToggleBgm={toggleBgm}
      />
      <HUD
        onOpenCollections={() => setCollectionsOpen(true)}
        onOpenWeather={() => setWeatherOpen(true)}
        playerName={profile.name}
      />
      <NeighborPanel playerName={profile.name} playerLevel={state.level} />
      <QuestNotifier onOpenPanel={() => setQuestPanelOpen(true)} />
      {questPanelOpen && <QuestPanel onClose={() => setQuestPanelOpen(false)} />}
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
          👆 WASD / arrows to move · click tiles to interact
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

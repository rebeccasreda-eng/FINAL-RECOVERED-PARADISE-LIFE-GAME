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
import { ChopProgressBar } from '../components/ChopProgressBar';
import { CoolBanner } from '../components/CoolBanner';

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

// Player start tile — centre of the 31×31 elliptical island
const PLAYER_START = { x: 15, y: 15 };
const MOVE_SPEED = 8.5; // tiles per second (free movement)

// World centre (used to offset the world container so island is centred on load)
const WORLD_CX = WORLD_W / 2;
const WORLD_CY = WORLD_H / 2;

/* ── Cloud layer (fixed in viewport, not panned) ──────────────────────── */

/* ── GameInner ─────────────────────────────────────────────────────────── */
const GameInner = ({ profile }: { profile: PlayerProfile }) => {
  const { shopOpen, tutorial, state, dispatch, interact } = useGame();
  const [collectionsOpen,  setCollectionsOpen]  = useState(false);
  const [weatherOpen,      setWeatherOpen]      = useState(false);
  const [questPanelOpen,   setQuestPanelOpen]   = useState(false);
  const [selectedQuestId,  setSelectedQuestId]  = useState<string | null>(null);
  const { muted: bgmMuted, toggle: toggleBgm } = useBgm('/bgm.mp3');

  /* ── Player movement — click-to-glide ── */

  // Float tile-space position (supports sub-tile interpolation)
  const playerPosRef = useRef<{ x: number; y: number }>({ x: PLAYER_START.x, y: PLAYER_START.y });
  const [playerPos, setPlayerPos] = useState(playerPosRef.current);
  const [isWalking, setIsWalking] = useState(false);
  const [facing,    setFacing]    = useState<'front' | 'back' | 'left' | 'right'>('front');

  // Click-to-glide destination; null = no pending target
  const targetRef = useRef<{ x: number; y: number } | null>(null);

  // rAF bookkeeping
  const rafRef       = useRef<number | null>(null);
  const lastTimeRef  = useRef<number | null>(null);
  const wasWalkRef   = useRef(false);
  const facingRef    = useRef<'front' | 'back' | 'left' | 'right'>('front');

  // Pending interact — tileId to interact with when the player arrives
  const pendingInteractTileRef = useRef<string | null>(null);
  // Stable ref to interact so the rAF loop can call it without stale closure
  const interactRef = useRef(interact);
  useLayoutEffect(() => { interactRef.current = interact; }, [interact]);

  // Stale-closure-safe tiles access
  const tilesRef = useRef(state.tiles);
  useLayoutEffect(() => { tilesRef.current = state.tiles; }, [state.tiles]);

  /** True if the tile at (x, y) is walkable land (GRASS or SAND only). */
  const canWalk = useCallback((x: number, y: number): boolean => {
    const t = tilesRef.current[`${Math.round(x)},${Math.round(y)}`];
    return !!t && (t.type === 'GRASS' || t.type === 'SAND');
  }, []);

  // Main game loop — runs every animation frame
  const tick = useCallback((now: number) => {
    if (lastTimeRef.current === null) lastTimeRef.current = now;
    const dt = Math.min((now - lastTimeRef.current) / 1000, 0.05); // cap at 50 ms
    lastTimeRef.current = now;

    const pos  = playerPosRef.current;
    let vx = 0, vy = 0;

    if (targetRef.current) {
      const ddx = targetRef.current.x - pos.x;
      const ddy = targetRef.current.y - pos.y;
      const dist = Math.hypot(ddx, ddy);
      if (dist < 0.06) {
        targetRef.current = null;         // arrived
        if (pendingInteractTileRef.current) {
          const tid = pendingInteractTileRef.current;
          pendingInteractTileRef.current = null;
          interactRef.current(tid);
        }
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

        // 4-way facing from screen-space velocity components:
        //   svx = vx−vy  (screen horizontal)  svx>0 → right, svx<0 → left
        //   svy = vx+vy  (screen vertical)    svy>0 → front, svy<0 → back
        const svx = vx - vy;
        const svy = vx + vy;
        let nf: 'front' | 'back' | 'left' | 'right';
        if (Math.abs(svx) >= Math.abs(svy)) {
          nf = svx > 0 ? 'right' : 'left';
        } else {
          nf = svy > 0 ? 'front' : 'back';
        }
        if (nf !== facingRef.current) { facingRef.current = nf; setFacing(nf); }
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


  // Click-to-glide: set target; optionally queue an interact on arrival
  const moveTo = useCallback((tx: number, ty: number, interactTileId?: string) => {
    const dest = tilesRef.current[`${tx},${ty}`];

    // Helper: fully cancel any pending movement + interact
    const cancel = () => {
      targetRef.current = null;
      pendingInteractTileRef.current = null;
    };

    if (!dest) { cancel(); return; }

    // Walkable land — go directly
    if (dest.type === 'GRASS' || dest.type === 'SAND') {
      targetRef.current = { x: tx, y: ty };
      pendingInteractTileRef.current = interactTileId ?? null;
      return;
    }

    // DOCK sits on a WATER tile — redirect to the closest adjacent land tile
    // relative to the player's current position so the path feels natural.
    if (dest.object === 'DOCK') {
      const { x: px, y: py } = playerPosRef.current;
      const landNeighbours = ([ [-1,0],[1,0],[0,-1],[0,1] ] as const)
        .map(([dx, dy]) => {
          const nb = tilesRef.current[`${tx+dx},${ty+dy}`];
          return nb && (nb.type === 'GRASS' || nb.type === 'SAND')
            ? { x: tx+dx, y: ty+dy, d: (tx+dx-px)**2 + (ty+dy-py)**2 }
            : null;
        })
        .filter(Boolean) as { x: number; y: number; d: number }[];

      if (landNeighbours.length) {
        landNeighbours.sort((a, b) => a.d - b.d);
        targetRef.current = { x: landNeighbours[0].x, y: landNeighbours[0].y };
        pendingInteractTileRef.current = interactTileId ?? null;
        return;
      }
    }

    // Water or anything else — cancel both target and pending action
    cancel();
  }, []);

  /* ── Discrete zoom — island always centred, no panning ── */
  const worldRef  = useRef<HTMLDivElement>(null);
  const viewRef   = useRef<HTMLDivElement>(null);
  // Four levels: start fully zoomed in, scroll out up to 3 steps
  const ZOOM_LEVELS = [2.0, 1.4, 0.9, 0.62] as const;
  const zoomIdxRef = useRef(0);

  // Formula: left/top 50% puts origin at viewport centre; translate(-CX*z,-CY*z)
  // then puts the world's own centre back at that point for every z value.
  const applyZoom = useCallback((idx: number) => {
    const z = ZOOM_LEVELS[idx];
    if (worldRef.current) {
      worldRef.current.style.transform =
        `translate(${-WORLD_CX * z}px, ${-WORLD_CY * z}px) scale(${z})`;
    }
  }, []);

  useEffect(() => { applyZoom(0); }, [applyZoom]);

  useEffect(() => {
    const el = viewRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) return;
      e.preventDefault();
      const dir = e.deltaY > 0 ? 1 : -1; // down = zoom out (+1)
      const next = Math.max(0, Math.min(ZOOM_LEVELS.length - 1, zoomIdxRef.current + dir));
      if (next === zoomIdxRef.current) return;
      zoomIdxRef.current = next;
      applyZoom(next);
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [applyZoom]);

  return (
    <div className="w-full h-[100dvh] overflow-hidden relative" style={{ fontFamily: "'Fredoka', sans-serif" }}>


      {/* ── Viewport — scroll to zoom, island always centred ── */}
      <div
        ref={viewRef}
        className="absolute"
        style={{
          top: TOP_H, bottom: BOT_H, left: 0, right: 0,
          overflow: 'hidden',
          background: '#1fa8e8',
        }}
      >
        {/* World: left/top 50% pins origin to viewport centre;
            imperative transform keeps island centre there at every zoom. */}
        <div
          ref={worldRef}
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            transformOrigin: '0 0',
            transition: 'transform 0.22s cubic-bezier(0.25,0.46,0.45,0.94)',
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

      {/* ── Chop progress bar (inside viewport overlay) ── */}
      <ChopProgressBar />
      <CoolBanner />

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
      <QuestNotifier
        onOpenPanel={(qid) => { setSelectedQuestId(qid); setQuestPanelOpen(true); }}
      />
      <NeighborPanel
        playerName={profile.name}
        playerLevel={state.level}
        onOpenCollections={() => setCollectionsOpen(true)}
        onOpenQuests={() => { setSelectedQuestId(null); setQuestPanelOpen(true); }}
      />
      {questPanelOpen && <QuestPanel onClose={() => { setQuestPanelOpen(false); setSelectedQuestId(null); }} questId={selectedQuestId} />}
      <CropPicker />

      {shopOpen         && <ShopModal />}
      {collectionsOpen  && <CollectionsModal onClose={() => setCollectionsOpen(false)} />}
      {weatherOpen      && <WeatherModal    onClose={() => setWeatherOpen(false)} />}

      {/* Tutorial banner */}

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
                characterId="" isWalking={false} facing="front"
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

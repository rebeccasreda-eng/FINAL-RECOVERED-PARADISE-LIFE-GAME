import React, { useState, useCallback, useRef, useEffect, useLayoutEffect } from 'react';
import { GameProvider, useGame } from '../game/GameContext';
import { IslandGrid, WORLD_W, WORLD_H, isoWorldToTile } from '../components/IslandGrid';
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
const BOT_H = 130;

// Player start tile — centre of the 31×31 elliptical island
const PLAYER_START = { x: 15, y: 15 };
const MOVE_SPEED = 8.5; // tiles per second (free movement)
type TilePosition = { x: number; y: number };

const WALK_NEIGHBORS: ReadonlyArray<readonly [number, number]> = [
  [1, 0], [0, 1], [-1, 0], [0, -1],
  [1, 1], [-1, 1], [1, -1], [-1, -1],
];
const INTERACTION_NEIGHBORS = WALK_NEIGHBORS;
const WALK_THROUGH_OBJECTS = new Set(['CLEARED_LAND', 'CROP_PLOT']);

function isWalkableTile(tile: { type: string; object?: string } | undefined): boolean {
  return !!tile
    && (tile.type === 'GRASS' || tile.type === 'SAND')
    && (!tile.object || WALK_THROUGH_OBJECTS.has(tile.object));
}

function findWalkPath(
  tiles: Record<string, { type: string; object?: string }>,
  start: TilePosition,
  goals: TilePosition[],
): TilePosition[] {
  if (!goals.length) return [];

  const startTile = { x: Math.round(start.x), y: Math.round(start.y) };
  const startKey = `${startTile.x},${startTile.y}`;
  const goalKeys = new Set(goals.map(({ x, y }) => `${x},${y}`));
  const queue = [startTile];
  const parent = new Map<string, string | null>([[startKey, null]]);
  let foundKey: string | null = goalKeys.has(startKey) ? startKey : null;

  const canEnter = (x: number, y: number) => {
    if (x === startTile.x && y === startTile.y) return true;
    return isWalkableTile(tiles[`${x},${y}`]);
  };

  for (let cursor = 0; cursor < queue.length && !foundKey; cursor++) {
    const current = queue[cursor];
    const currentKey = `${current.x},${current.y}`;

    for (const [dx, dy] of WALK_NEIGHBORS) {
      const x = current.x + dx;
      const y = current.y + dy;
      const key = `${x},${y}`;
      if (parent.has(key) || !canEnter(x, y)) continue;

      // Do not squeeze diagonally through the corner of a tree, fence, or prop.
      if (dx !== 0 && dy !== 0 && (!canEnter(current.x + dx, current.y) || !canEnter(current.x, current.y + dy))) {
        continue;
      }

      parent.set(key, currentKey);
      queue.push({ x, y });
      if (goalKeys.has(key)) {
        foundKey = key;
        break;
      }
    }
  }

  if (!foundKey) return [];
  const path: TilePosition[] = [];
  for (let key: string | null = foundKey; key && key !== startKey; key = parent.get(key) ?? null) {
    const [x, y] = key.split(',').map(Number);
    path.push({ x, y });
  }
  return path.reverse();
}

const facingFromIsoDelta = (dx: number, dy: number): 'front' | 'back' | 'left' | 'right' => {
  const screenX = dx - dy;
  const screenY = dx + dy;
  if (Math.abs(screenX) >= Math.abs(screenY)) return screenX >= 0 ? 'right' : 'left';
  return screenY >= 0 ? 'front' : 'back';
};

// World centre (used to offset the world container so island is centred on load)
const WORLD_CX = WORLD_W / 2;
const WORLD_CY = WORLD_H / 2;

/* ── Cloud layer (fixed in viewport, not panned) ──────────────────────── */

/* ── GameInner ─────────────────────────────────────────────────────────── */
const GameInner = ({ profile }: { profile: PlayerProfile }) => {
  const { shopOpen, setShopOpen, tutorial, state, dispatch, interact } = useGame();
  const [collectionsOpen,  setCollectionsOpen]  = useState(false);
  const [weatherOpen,      setWeatherOpen]      = useState(false);
  const [questPanelOpen,   setQuestPanelOpen]   = useState(false);
  const [selectedQuestId,  setSelectedQuestId]  = useState<string | null>(null);
  const { muted: bgmMuted, toggle: toggleBgm } = useBgm('/bgm.mp3');

  /* ── Player movement — click-to-glide ── */

  // Float tile-space position (supports sub-tile interpolation)
  const playerPosRef = useRef<{ x: number; y: number }>({ x: PLAYER_START.x, y: PLAYER_START.y });
  const [playerPos, setPlayerPos] = useState(playerPosRef.current);
  const [isMoving, setIsMoving] = useState(false);
  const isMovingRef = useRef(false);
  const [facing,    setFacing]    = useState<'front' | 'back' | 'left' | 'right'>('front');

  // Click-to-glide destination; null = no pending target
  const targetRef = useRef<TilePosition | null>(null);
  const routeRef = useRef<TilePosition[]>([]);

  // rAF bookkeeping
  const rafRef       = useRef<number | null>(null);
  const lastTimeRef  = useRef<number | null>(null);
  const facingRef    = useRef<'front' | 'back' | 'left' | 'right'>('front');
  const updateFacing = useCallback((dx: number, dy: number) => {
    if (dx === 0 && dy === 0) return;
    const nextFacing = facingFromIsoDelta(dx, dy);
    if (nextFacing !== facingRef.current) {
      facingRef.current = nextFacing;
      setFacing(nextFacing);
    }
  }, []);
  const updateMoving = useCallback((moving: boolean) => {
    if (moving === isMovingRef.current) return;
    isMovingRef.current = moving;
    setIsMoving(moving);
  }, []);

  // Pending interact — tileId to interact with when the player arrives
  const pendingInteractTileRef = useRef<string | null>(null);
  // Stable ref to interact so the rAF loop can call it without stale closure
  const interactRef = useRef(interact);
  useLayoutEffect(() => { interactRef.current = interact; }, [interact]);

  // Stale-closure-safe tiles access
  const tilesRef = useRef(state.tiles);
  useLayoutEffect(() => { tilesRef.current = state.tiles; }, [state.tiles]);

  /** Live movement checks the tile grid; sprite footprints are handled by pathfinding. */
  const canWalk = useCallback((x: number, y: number): boolean => {
    const tile = tilesRef.current[`${Math.round(x)},${Math.round(y)}`];
    return isWalkableTile(tile);
  }, []);

  // Main game loop — runs every animation frame
  const tick = useCallback((now: number) => {
    if (lastTimeRef.current === null) lastTimeRef.current = now;
    const dt = Math.min((now - lastTimeRef.current) / 1000, 0.05); // cap at 50 ms
    lastTimeRef.current = now;

    const pos  = playerPosRef.current;
    let vx = 0, vy = 0;
    let didMove = false;

    if (targetRef.current) {
      let ddx = targetRef.current.x - pos.x;
      let ddy = targetRef.current.y - pos.y;
      let dist = Math.hypot(ddx, ddy);
      if (dist < 0.06) {
        const next = routeRef.current.shift();
        if (next) {
          targetRef.current = next;
          ddx = next.x - pos.x;
          ddy = next.y - pos.y;
          dist = Math.hypot(ddx, ddy);
        } else {
          targetRef.current = null;
          if (pendingInteractTileRef.current) {
            const tid = pendingInteractTileRef.current;
            pendingInteractTileRef.current = null;
            interactRef.current(tid);
          }
        }
      }
      if (targetRef.current && dist > 0) {
        vx = ddx / dist; vy = ddy / dist;
      }
    }

    // ── Apply movement with slide collision ───────────────────────────────
    if (vx !== 0 || vy !== 0) {
      const step = MOVE_SPEED * dt;
      const nx = pos.x + vx * step;
      const ny = pos.y + vy * step;

      let fx = pos.x, fy = pos.y;
      if (canWalk(nx, pos.y)) fx = nx;   // try X axis
      if (canWalk(fx, ny))    fy = ny;   // try Y axis

      if (fx !== pos.x || fy !== pos.y) {
        didMove = true;
        playerPosRef.current = { x: fx, y: fy };
        setPlayerPos({ x: fx, y: fy });

        // Track the actual isometric screen-space direction of movement.
        updateFacing(vx, vy);
      } else {
        // A newly placed object may have blocked the current route.
        targetRef.current = null;
        routeRef.current = [];
        pendingInteractTileRef.current = null;
      }
    }

    updateMoving(didMove);
    rafRef.current = requestAnimationFrame(tick);
  }, [canWalk, updateFacing, updateMoving]);

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
      routeRef.current = [];
      pendingInteractTileRef.current = null;
    };

    if (!dest) { cancel(); return; }

    const tiles = tilesRef.current;
    const { x: px, y: py } = playerPosRef.current;
    const start = { x: Math.round(px), y: Math.round(py) };
    let goals: TilePosition[] = [];

    if (isWalkableTile(dest)) {
      goals = [{ x: tx, y: ty }];
    } else if (dest.type === 'GRASS' || dest.type === 'SAND' || dest.object === 'DOCK') {
      // Stop beside scenery instead of entering its occupied tile.
      goals = INTERACTION_NEIGHBORS
        .map(([dx, dy]) => ({ x: tx + dx, y: ty + dy }))
        .filter(({ x, y }) => isWalkableTile(tiles[`${x},${y}`]));
    }

    const path = findWalkPath(tiles, start, goals);
    if (!path.length) {
      cancel();
      return;
    }

    const firstStep = path.shift()!;
    updateFacing(firstStep.x - px, firstStep.y - py);
    targetRef.current = firstStep;
    routeRef.current = path;
    pendingInteractTileRef.current = interactTileId ?? null;
  }, [updateFacing]);

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

  // Let clicks in the small gaps between tile hit areas move to the nearest
  // ground tile too. Tile clicks keep their existing interactions/pathfinding.
  const handleViewportClick = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target instanceof Element && event.target.closest('[data-island-tile]')) return;
    const worldRect = worldRef.current?.getBoundingClientRect();
    if (!worldRect) return;

    const zoom = ZOOM_LEVELS[zoomIdxRef.current];
    const worldX = (event.clientX - worldRect.left) / zoom;
    const worldY = (event.clientY - worldRect.top) / zoom;
    const destination = isoWorldToTile(worldX, worldY);
    moveTo(destination.x, destination.y);
  }, [moveTo]);

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
        onClick={handleViewportClick}
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
            facing={facing}
            isMoving={isMoving}
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
        onOpenShop={() => setShopOpen(true)}
        bgmMuted={bgmMuted}
        onToggleBgm={toggleBgm}
      />
      <HUD
        onOpenCollections={() => setCollectionsOpen(true)}
        onOpenShop={() => setShopOpen(true)}
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
                characterId="" facing="front"
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

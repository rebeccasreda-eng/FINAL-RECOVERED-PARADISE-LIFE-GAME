  import { QuestDef, TileData, TileType, ObjectType, WeatherType } from './types';

export const DEV_SPEEDUP = 100;
export const SCALED = (ms: number) => Math.max(1000, ms / DEV_SPEEDUP); // Don't go below 1 second to avoid missing ticks
export const COCONUT_RIPEN_TIME  = SCALED(90000);  // 90 s — unripe → ripe
export const MANGO_RIPEN_TIME    = SCALED(120000); // 2 min — unripe → ripe
export const STUMP_REGROW_TIME   = SCALED(150000); // 2.5 min — stump → sapling

export const WEATHER_TYPES: WeatherType[] = ['SUNNY', 'RAINY', 'CLOUDY', 'STORMY', 'WINDY'];

export const CROP_TYPES: Record<string, { name: string, emoji: string, cost: number, growTime: number, wiltTime: number, yield: number }> = {
  CORN: { name: 'Corn', emoji: '🌽', cost: 5, growTime: SCALED(30000), wiltTime: SCALED(60000), yield: 2 },
  TOMATO: { name: 'Tomato', emoji: '🍅', cost: 8, growTime: SCALED(45000), wiltTime: SCALED(90000), yield: 3 },
  WHEAT: { name: 'Wheat', emoji: '🌾', cost: 12, growTime: SCALED(60000), wiltTime: SCALED(120000), yield: 5 }
};

export const COLLECTIONS = [
  { id: 'starfish', name: 'Starfish', emoji: '⭐', description: 'Found on the beach' },
  { id: 'pearl', name: 'Pearl', emoji: '⚪', description: 'Rarely found when fishing' },
  { id: 'conch', name: 'Conch', emoji: '🐚', description: 'Found on the sand' },
  { id: 'crab_claw', name: 'Crab Claw', emoji: '🦞', description: 'Dropped by crabs' },
];

export const COLLECTION_SETS = [
  { id: 'weeds', name: 'Weeds', emoji: '🌿', items: ['starfish', 'conch'], reward: { wood: 25, coins: 50, xp: 100 }, rewardLabel: '25 wood + 50 coins + 100 XP' },
  { id: 'ocean', name: 'Ocean Treasures', emoji: '🌊', items: ['pearl', 'crab_claw'], reward: { shells: 2, coins: 100, xp: 200 }, rewardLabel: '2 shells + 100 coins + 200 XP' }
];

export const PREMIUM_ITEMS = [
  { id: 'energy_boost', name: 'Energy Boost', emoji: '⚡', desc: '+10 max energy permanently', shellCost: 2 },
  { id: 'lucky_charm', name: 'Lucky Charm', emoji: '🍀', desc: '2x collection drops for 5 min', shellCost: 3 },
  { id: 'golden_crop', name: 'Golden Crop', emoji: '🌟', desc: 'Next harvest gives 3x yield', shellCost: 5 }
];

export interface QuestGroup {
  id: string;
  npcType: 'parrot' | 'crab' | 'tree' | 'fish' | 'axe';
  quests: string[];   // quest IDs offered by this NPC
  prereqs: string[];  // quest IDs that must all be completed first
}

export const QUEST_GROUPS: QuestGroup[] = [
  { id: 'grp_parrot', npcType: 'parrot', quests: ['q_welcome'],             prereqs: [] },
  { id: 'grp_fish',   npcType: 'fish',   quests: ['q_fishing'],             prereqs: [] },
  { id: 'grp_axe',    npcType: 'axe',    quests: ['q_clear'],               prereqs: [] },
  { id: 'grp_crab',   npcType: 'crab',   quests: ['q_crab'],                prereqs: ['q_fishing', 'q_clear'] },
  { id: 'grp_tree',   npcType: 'tree',   quests: ['q_chop'],                prereqs: ['q_fishing', 'q_clear'] },
];

export const QUESTS: QuestDef[] = [
  {
    id: 'q_welcome',
    title: 'Welcome To Paradise!',
    subtitle: "It's time to build the island of your dreams!",
    description: 'Complete your first island tasks',
    targetType: 'none',
    targetCount: 1,
    objectives: [
      { description: 'Harvest 1 orange tree',  targetType: 'harvest_mango',     targetCount: 1, icon: '🍊' },
      { description: 'Feed 1 parrot',           targetType: 'feed_parrot',       targetCount: 1, icon: '🦜' },
      { description: 'Harvest 3 pineapples',    targetType: 'harvest_pineapple', targetCount: 3, icon: '🍍' },
    ],
    rewardCoins: 50,
    rewardXP: 5,
    icon: '🌴',
    unlockLevel: 1,
  },
  { id: 'q1', title: 'First Steps', description: 'Clear 3 grass patches', targetType: 'clear_grass', targetCount: 3, rewardCoins: 20, rewardXP: 10, icon: '🌿', unlockLevel: 1 },
  { id: 'q2', title: 'Lumberjack', description: 'Chop 5 trees', targetType: 'chop_tree', targetCount: 5, rewardCoins: 50, rewardXP: 20, rewardItem: { type: 'wood', count: 2 }, icon: '🌴', unlockLevel: 1 },
  { id: 'q3', title: 'Green Thumb', description: 'Plant 3 crops', targetType: 'plant_crop', targetCount: 3, rewardCoins: 30, rewardXP: 15, icon: '🌱', unlockLevel: 2, prereqs: ['q1'] },
  { id: 'q4', title: 'Harvest Time', description: 'Harvest 5 crops', targetType: 'harvest_crop', targetCount: 5, rewardCoins: 80, rewardXP: 40, icon: '🌽', unlockLevel: 2, prereqs: ['q3'] },
  { id: 'q5', title: 'Miner\'s Luck', description: 'Mine 3 rocks', targetType: 'mine_rock', targetCount: 3, rewardCoins: 60, rewardXP: 30, rewardItem: { type: 'stone', count: 1 }, icon: '🪨', unlockLevel: 3, prereqs: ['q1'] },
  { id: 'q6', title: 'Gone Fishin\'', description: 'Fish 5 times', targetType: 'fish', targetCount: 5, rewardCoins: 100, rewardXP: 50, icon: '🎣', unlockLevel: 4, prereqs: ['q2'] },
  { id: 'q7', title: 'Energy Hoarder', description: 'Reach max energy', targetType: 'reach_energy', targetCount: 20, rewardCoins: 40, rewardXP: 20, icon: '⚡', unlockLevel: 5 },
  { id: 'q8', title: 'Island Wealth', description: 'Accumulate 500 coins', targetType: 'accumulate_coins', targetCount: 500, rewardCoins: 150, rewardXP: 50, icon: '🪙', unlockLevel: 6 },
  { id: 'q9', title: 'Builder\'s Dream', description: 'Place a structure', targetType: 'place_structure', targetCount: 1, rewardCoins: 200, rewardXP: 100, icon: '🏚️', unlockLevel: 7, prereqs: ['q5'] },
  { id: 'q10', title: 'Paradise Found', description: 'Reach level 10', targetType: 'reach_level', targetCount: 10, rewardCoins: 500, rewardXP: 200, icon: '⭐', unlockLevel: 8, prereqs: ['q9'] },
  { id: 'q11', title: 'Crab Slayer', description: 'Defeat 3 crabs', targetType: 'kill_crab', targetCount: 3, rewardCoins: 100, rewardXP: 50, icon: '🦀', unlockLevel: 2, prereqs: ['q1'] },
  { id: 'q12', title: 'Collector', description: 'Find a collection item', targetType: 'collect_item', targetCount: 1, rewardCoins: 200, rewardXP: 100, icon: '🐚', unlockLevel: 3, prereqs: ['q11'] },
  { id: 'q13', title: 'Forecast Fan', description: 'Check the weather', targetType: 'check_weather', targetCount: 1, rewardCoins: 20, rewardXP: 10, icon: '🌤️', unlockLevel: 2 },

  // ── NPC quest pairs ─────────────────────────────────────────────────────
  {
    id: 'q_fishing',
    title: 'Gone Fishing',
    subtitle: 'There are fish swimming all around your island. Go catch some!',
    description: 'Catch 3 fish on your island',
    targetType: 'none', targetCount: 1,
    objectives: [
      { description: 'Catch 3 fish on your island', targetType: 'fish', targetCount: 3, icon: '🎣' },
    ],
    rewardCoins: 80, rewardXP: 7, icon: '🎣', unlockLevel: 1,
  },
  {
    id: 'q_clear',
    title: 'Clear The Island',
    subtitle: 'Before you plant crops, clear grass on the island to create some space.',
    description: 'Clear grass and debris',
    targetType: 'none', targetCount: 1,
    objectives: [
      { description: 'Clear 3 patches of grass on your island', targetType: 'clear_grass',     targetCount: 3, icon: '🌿' },
      { description: 'Clear 1 fishbone on your island',          targetType: 'clear_driftwood', targetCount: 1, icon: '🦴' },
    ],
    rewardCoins: 100, rewardXP: 10, icon: '🪓', unlockLevel: 1,
  },
  {
    id: 'q_crab',
    title: 'Crab Attack',
    subtitle: "You will encounter some pesky crabs on your island. Scare 'em off or beat 'em up!",
    description: 'Defeat a crab',
    targetType: 'none', targetCount: 1,
    objectives: [
      { description: 'Find 1 crab by clearing debris and fishbones...then click to beat them with a stick!', targetType: 'kill_crab', targetCount: 1, icon: '🦀' },
    ],
    rewardCoins: 300, rewardXP: 15,
    rewardItems: [{ type: 'FENCE', count: 2 }],
    icon: '🦀', unlockLevel: 1, prereqs: ['q_fishing', 'q_clear'],
  },
  {
    id: 'q_chop',
    title: 'Chopping Time',
    subtitle: "You'll need some wood to build your home.",
    description: 'Chop a tree and clear the stump',
    targetType: 'none', targetCount: 1,
    objectives: [
      { description: 'Chop down 1 tree on your island',       targetType: 'chop_tree',       targetCount: 1, icon: '🌴' },
      { description: 'Clear 1 tree stump on your island',     targetType: 'clear_driftwood', targetCount: 1, icon: '⛏️' },
    ],
    rewardCoins: 150, rewardXP: 10,
    rewardItems: [{ type: 'wood', count: 3 }],
    icon: '🌴', unlockLevel: 1, prereqs: ['q_fishing', 'q_clear'],
  },
];

export const OBJECT_CONFIG: Record<string, any> = {
  GRASS_PATCH: { action: 'Clear', energy: 1, coins: 2, xp: 5 },
  WEEDS:       { action: 'Clear', energy: 1, coins: 3, xp: 8,  respawn: SCALED(180000) },
  THORNS:      { action: 'Clear', energy: 2, coins: 4, xp: 10, respawn: SCALED(240000) },
  TREE_PALM: { action: 'Chop', energy: 1, coins: 5, xp: 10, drops: { wood: 2 }, respawn: SCALED(60000) },
  TREE_APPLE: { action: 'Harvest', energy: 1, coins: 5, xp: 10, drops: { wood: 1, food: 2 }, respawn: SCALED(60000) },
  ROCK: { action: 'Mine', energy: 1, coins: 8, xp: 15, drops: { stone: 1 }, respawn: SCALED(90000) },
  FLOWER_BUSH: { action: 'Harvest', energy: 1, coins: 3, xp: 8, respawn: SCALED(45000) },
  BRANCH_CLUSTER: { action: 'Clear', energy: 1, coins: 2, xp: 5, respawn: SCALED(90000) },
  SUNFLOWER:   { action: 'Harvest', energy: 1, coins: 6, xp: 12, respawn: SCALED(90000) },
  BLUEBELL:       { action: 'Harvest', energy: 1, coins: 4, xp: 8,  respawn: SCALED(60000) },
  PANSY:          { action: 'Harvest', energy: 1, coins: 4, xp: 8,  respawn: SCALED(60000) },
  TULIP:          { action: 'Harvest', energy: 1, coins: 5, xp: 10, respawn: SCALED(70000) },
  PINEAPPLE_PLANT:{ action: 'Harvest', energy: 1, coins: 8, xp: 14, respawn: SCALED(90000) },
  BLUEBERRY_BUSH: { action: 'Harvest', energy: 1, coins: 6, xp: 12, respawn: SCALED(75000) },
  DRIFTWOOD: { action: 'Clear', energy: 1, coins: 3, xp: 5, drops: { wood: 1 }, respawn: SCALED(80000) },
  // Ripe: harvest fruit only — tree stays, transitions directly to unripe (no respawn queue)
  TREE_COCONUT: { action: 'Harvest', energy: 1, coins: 6, xp: 12, drops: { food: 2 } },
  TREE_MANGO:   { action: 'Harvest', energy: 1, coins: 8, xp: 14, drops: { food: 3 } },
  // Unripe: choppable — 5 hits give wood + leave a stump
  TREE_COCONUT_UNRIPE: { action: 'Chop', energy: 1, coins: 2, xp: 8,  drops: { wood: 2 } },
  TREE_MANGO_UNRIPE:   { action: 'Chop', energy: 1, coins: 3, xp: 10, drops: { wood: 3 } },
  // Stumps: wait quietly until growsAt fires → sapling
  COCONUT_STUMP: { action: 'Wait', energy: 0, coins: 0, xp: 0 },
  MANGO_STUMP:   { action: 'Wait', energy: 0, coins: 0, xp: 0 },
  GARDEN_PATCH: { action: 'Harvest', energy: 1, coins: 10, xp: 18, drops: { food: 2 }, respawn: SCALED(50000) },
  CROP_READY: { action: 'Harvest', energy: 1, coins: 10, xp: 20 },
  CROP_WILTED: { action: 'Clear', energy: 1, coins: 0, xp: 2 },
  FISH_SPOT: { action: 'Fish', energy: 1, coins: 12, xp: 15, respawn: SCALED(120000) },
  CRAB:        { action: 'Attack', energy: 1, coins: 5, xp: 10 },
  BOAR:        { action: 'Shoo',  energy: 1, coins: 8, xp: 12 },
  BABY_PARROT: { action: 'Feed',  energy: 0, coins: 2, xp: 5  },
  TALL_ROCK:   { action: 'Mine', energy: 1, coins: 10, xp: 18, drops: { stone: 2 }, respawn: SCALED(120000) },
  DOCK:        { action: 'Visit', energy: 0, coins: 0, xp: 0 },
  TOXIC_DRUM:  { action: 'Inspect', energy: 0, coins: 0, xp: 5 },
};

export const EMOJI_MAP: Record<string, string> = {
  TREE_PALM: '🍌', TREE_APPLE: '🍊', ROCK: '🪨', FLOWER_BUSH: '🌸', DRIFTWOOD: '🪵', SUNFLOWER: '🌻', PUDDLE: '💧', THORNS: '🌵',
  BLUEBELL: '💜', PANSY: '🌼', TULIP: '🌷', PINEAPPLE_PLANT: '🍍', BLUEBERRY_BUSH: '🫐',
  TREE_COCONUT: '🍌', TREE_MANGO: '🍊', GARDEN_PATCH: '🍍',
  TREE_COCONUT_UNRIPE: '🍌', TREE_MANGO_UNRIPE: '🍊',
  CROP_PLOT: '🟫', CROP_GROWING: '🌱', CROP_READY: '🌽', CROP_WILTED: '🥀',
  FISH_SPOT: '', HUT: '🏚️', DOCK: '⛵', WELL: '💧', 
  FLOWER_POT: '🪴', FENCE: '🚧', LANTERN: '🏮', CRAB: '🦀', BOAR: '🐗', BABY_PARROT: '🦜', TALL_ROCK: '🪨',
  TOXIC_DRUM: '☣️'
};

export const INITIAL_NEIGHBORS = [
  { id: 'n1', name: 'Marina', avatar: 'marina', level: 1, favorPoints: 0, wishlist: ['starfish'] },
];

const ISLAND_GRID_SIZE = 31;
const ISLAND_CENTER = 15;
const gaussian = (value: number, sigma: number) => Math.exp(-(value * value) / (2 * sigma * sigma));

function classifyReferenceTerrain(x: number, y: number): TileType | null {
  const dx = x - ISLAND_CENTER;
  const dy = y - ISLAND_CENTER;
  const contour =
    1 - (dx * dx) / (13.5 * 13.5) - (dy * dy) / (11.5 * 11.5) +
    0.026 * Math.sin((x + y * 0.7) * 0.52) +
    0.018 * Math.cos((x * 0.4 - y) * 0.66);

  if (contour < -0.38) return null;
  if (contour <= 0) return 'WATER';

  const screenU = x - y;
  const screenV = x + y;
  const inletReach = Math.max(0, Math.min(1, (-screenU - 1) / 4.5));
  const inletCenterV = 30 + 1.1 * Math.sin((screenU + 6) * 0.27);
  const leftInlet = gaussian(screenV - inletCenterV, 1.6) * 0.92 * inletReach;
  const lagoon = gaussian(screenU - 3.5, 1.6) * gaussian(screenV - 24, 1.15) * 0.95;
  const terrainValue = contour - Math.max(leftInlet, lagoon);

  if (terrainValue > 0.45) return 'GRASS';
  // Keep beaches to a narrow coastal band while maintaining a broad grassy island.
  if (terrainValue > 0.28) return 'SAND';
  return 'WATER';
}

function updateShoreDepth(tiles: Record<string, TileData>) {
  for (const tile of Object.values(tiles)) {
    if (tile.shoreDepth === undefined) continue;
    const updated = { ...tile };
    delete updated.shoreDepth;
    tiles[tile.id] = updated;
  }

  const queue: Array<{ id: string; depth: number }> = [];
  for (const tile of Object.values(tiles)) {
    if (tile.type === 'WATER') continue;
    for (const [dx, dy] of [[-1, 0], [1, 0], [0, -1], [0, 1]] as const) {
      const neighbor = tiles[`${tile.x + dx},${tile.y + dy}`];
      if (neighbor?.type === 'WATER' && neighbor.shoreDepth === undefined) {
        tiles[neighbor.id] = { ...neighbor, shoreDepth: 1 };
        queue.push({ id: neighbor.id, depth: 1 });
      }
    }
  }

  let index = 0;
  while (index < queue.length) {
    const { id, depth } = queue[index++];
    const [x, y] = id.split(',').map(Number);
    for (const [dx, dy] of [[-1, 0], [1, 0], [0, -1], [0, 1]] as const) {
      const neighbor = tiles[`${x + dx},${y + dy}`];
      if (neighbor?.type === 'WATER' && neighbor.shoreDepth === undefined) {
        tiles[neighbor.id] = { ...neighbor, shoreDepth: depth + 1 };
        queue.push({ id: neighbor.id, depth: depth + 1 });
      }
    }
  }
}

export function generateIsland(): Record<string, TileData> {
  const GRID = ISLAND_GRID_SIZE;
  const CX = ISLAND_CENTER, CY = ISLAND_CENTER;

  // ── Build tile map ──────────────────────────────────────────────────────
  const tiles: Record<string, TileData> = {};
  for (let y = 0; y < GRID; y++) {
    for (let x = 0; x < GRID; x++) {
      const type = classifyReferenceTerrain(x, y);
      if (!type) continue;
      const id = `${x},${y}`;
      tiles[id] = { id, x, y, type };
    }
  }

  // ── Seeded PRNG ─────────────────────────────────────────────────────────
  let seed = 42;
  const rand = () => { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; };

  // ── Forest intensity: high near island edge, low at centre ──────────────
  const forestFactor = (x: number, y: number): number => {
    const dx = x - CX, dy = y - CY;
    const r = Math.sqrt(dx * dx + dy * dy);
    return Math.max(0, Math.min(1, (r - 3) / 8));
  };

  // ── Object placement ────────────────────────────────────────────────────
  // Track placed tree positions so we can enforce minimum spacing (prevents clumping).
  const treePos: Array<[number, number]> = [];
  const tooClose = (x: number, y: number, minDist: number) =>
    treePos.some(([tx, ty]) => Math.abs(tx - x) <= minDist && Math.abs(ty - y) <= minDist);

  const placeTree = (tile: TileData, type: string, minDist: number, extras?: Partial<TileData>) => {
    if (tooClose(tile.x, tile.y, minDist)) return false;
    tile.object = type as any;
    if (extras) Object.assign(tile, extras);
    treePos.push([tile.x, tile.y]);
    return true;
  };

  for (let y = 0; y < GRID; y++) {
    for (let x = 0; x < GRID; x++) {
      if (x === CX && y === CY) continue;
      if (Math.hypot(x - CX, y - CY) < 4.4) continue;
      const tile = tiles[`${x},${y}`];
      if (!tile) continue;
      const ff = forestFactor(x, y);

      // Isometric "back" = small x+y (upper-screen area). Centre sum = CX+CY = 30.
      const diagSum    = x + y;
      const isDeepBack = diagSum < 23;
      const isMidBack  = diagSum >= 23 && diagSum < 29;
      const isSideGrove = Math.abs(x - y) >= 7 && diagSum >= 29 && diagSum <= 40;

      // Adjacent to water → eligible for a waterside coconut palm
      const adjToWater = [[-1,0],[1,0],[0,-1],[0,1]].some(([dx,dy]) => {
        const n = tiles[`${x+dx},${y+dy}`];
        return n && n.type === 'WATER';
      });

      if (tile.type === 'GRASS') {
        const r = rand();

        if (isDeepBack) {
          // Dense back tree line, with spacing so each imported canopy stays distinct.
          const treePct = 0.64 + ff * 0.08;
          if (r < treePct) {
            const tr = rand();
            const type = tr < 0.25 ? 'TREE_COCONUT_UNRIPE'
                       : tr < 0.55 ? 'TREE_MANGO_UNRIPE'
                       : tr < 0.80 ? 'TREE_APPLE'
                       :             'TREE_COCONUT_UNRIPE';
            const ripenOffset = type === 'TREE_COCONUT_UNRIPE' ? COCONUT_RIPEN_TIME
                             : type === 'TREE_MANGO_UNRIPE'   ? MANGO_RIPEN_TIME : 0;
            const extras = ripenOffset > 0 ? { ripensAt: Date.now() + Math.floor(rand() * ripenOffset) } : undefined;
            placeTree(tile, type, 1, extras); // denser back line with distinct canopies
          } else if (r < treePct + 0.04) {
            tile.object = 'FLOWER_BUSH';
          }

        } else if (isSideGrove) {
          const treePct = 0.15 + ff * 0.05;
          if (r < treePct) {
            const tr = rand();
            const type = tr < 0.45 ? 'TREE_COCONUT_UNRIPE'
                       : tr < 0.78 ? 'TREE_MANGO_UNRIPE'
                       :             'TREE_APPLE';
            const ripenOffset = type === 'TREE_COCONUT_UNRIPE' ? COCONUT_RIPEN_TIME
                              : type === 'TREE_MANGO_UNRIPE'   ? MANGO_RIPEN_TIME : 0;
            const extras = ripenOffset > 0 ? { ripensAt: Date.now() + Math.floor(rand() * ripenOffset) } : undefined;
            placeTree(tile, type, 2, extras);
          }

        } else if (isMidBack) {
          const treePct = 0.34 + ff * 0.10;
          if (r < treePct) {
            const tr = rand();
            const type = tr < 0.35 ? 'TREE_MANGO_UNRIPE'
                       : tr < 0.65 ? 'TREE_COCONUT_UNRIPE'
                       :             'TREE_APPLE';
            const ripenOffset2 = type === 'TREE_COCONUT_UNRIPE' ? COCONUT_RIPEN_TIME
                               : type === 'TREE_MANGO_UNRIPE'   ? MANGO_RIPEN_TIME : 0;
            const extras2 = ripenOffset2 > 0 ? { ripensAt: Date.now() + Math.floor(rand() * ripenOffset2) } : undefined;
            placeTree(tile, type, 1, extras2); // nearer, but still distinct canopies
          } else if (r < treePct + 0.03) {
            tile.object = 'FLOWER_BUSH';
          }

        } else {
          // Keep the central walking area open; only the outer edge gets sparse palms.
          const palmChance  = adjToWater ? 0.04 : 0.015;
          const mangoChance = 0.01;
          if (r < palmChance) {
            placeTree(tile, 'TREE_COCONUT_UNRIPE', 3, { ripensAt: Date.now() + Math.floor(rand() * COCONUT_RIPEN_TIME) }); // minDist=3
          } else if (r < palmChance + mangoChance) {
            placeTree(tile, 'TREE_MANGO_UNRIPE', 3, { ripensAt: Date.now() + Math.floor(rand() * MANGO_RIPEN_TIME) });
          } else if (r < palmChance + mangoChance + 0.03) {
            tile.object = 'FLOWER_BUSH';
          }
        }

      } else if (tile.type === 'SAND') {
        const r = rand();
        if (r < 0.065) tile.object = 'ROCK';   // half the original 0.13
        // DRIFTWOOD only appears when a coconut tree is chopped — not in world gen
      }
    }
  }

  // ── Special game objects ────────────────────────────────────────────────
  const pick = (arr: TileData[]) => arr.splice(Math.floor(rand() * arr.length), 1)[0];

  const emptyGrass = Object.values(tiles).filter(t =>
    t.type === 'GRASS' &&
    !t.object &&
    Math.hypot(t.x - CX, t.y - CY) >= 4.4
  );
  const inner = emptyGrass.filter(t => forestFactor(t.x, t.y) < 0.40);
  const outer = emptyGrass.filter(t => forestFactor(t.x, t.y) >= 0.40);

  // ── Near-mango section: fenced GARDEN_PATCH and BLUEBERRY_BUSH ──────────
  // These spawn within 5 tiles of a mango (yellow fruit) tree.
  const mangoTiles = Object.values(tiles).filter(t =>
    t.object === 'TREE_MANGO' || t.object === 'TREE_MANGO_UNRIPE'
  );
  const placeNearMango = (obj: typeof inner[0]['object'], count: number) => {
    const pool = inner.filter(t =>
      !t.object && mangoTiles.some(m => Math.abs(m.x - t.x) + Math.abs(m.y - t.y) <= 5)
    );
    for (let i = 0; i < count && pool.length; i++) {
      const tile = pick(pool);
      tile.object = obj;
      const idx = inner.indexOf(tile);
      if (idx >= 0) inner.splice(idx, 1);
    }
  };
  placeNearMango('GARDEN_PATCH',    4);
  placeNearMango('BLUEBERRY_BUSH',  3);

  for (let i = 0; i < 3 && inner.length; i++) pick(inner).object = 'CROP_PLOT';
  for (let i = 0; i < 5  && outer.length; i++) pick(outer).object = 'GRASS_PATCH';
  // Overgrown weed clumps — kept sparse so the island feels tidier
  for (let i = 0; i < 3  && inner.length; i++) pick(inner).object = 'WEEDS';
  for (let i = 0; i < 2  && outer.length; i++) pick(outer).object = 'WEEDS';
  for (let i = 0; i < 7  && inner.length; i++) pick(inner).object = 'THORNS';
  for (let i = 0; i < 8  && outer.length; i++) pick(outer).object = 'THORNS';
  for (let i = 0; i < 5  && inner.length; i++) pick(inner).object = 'BLUEBELL';
  for (let i = 0; i < 5  && outer.length; i++) pick(outer).object = 'BLUEBELL';
  for (let i = 0; i < 5  && inner.length; i++) pick(inner).object = 'PANSY';
  for (let i = 0; i < 4  && outer.length; i++) pick(outer).object = 'PANSY';
  for (let i = 0; i < 5  && inner.length; i++) pick(inner).object = 'TULIP';
  for (let i = 0; i < 4  && outer.length; i++) pick(outer).object = 'TULIP';
  for (let i = 0; i < 4  && inner.length; i++) pick(inner).object = 'BABY_PARROT';

  const waterTiles = Object.values(tiles).filter(t => t.type === 'WATER');

  // ── Marina dock — anchor it on the left inlet beside the player's vertical band ─
  const interiorWater = waterTiles.filter(t => {
    const dirs = [[-1,0],[1,0],[0,-1],[0,1]] as const;
    return dirs.some(([dx,dy]) => {
      const nb = tiles[`${t.x+dx},${t.y+dy}`];
      return nb && (nb.type === 'SAND' || nb.type === 'GRASS');
    });
  }).sort((a, b) => {
    const da = (a.x - 12) ** 2 + (a.y - 18) ** 2;
    const db = (b.x - 12) ** 2 + (b.y - 18) ** 2;
    return da - db;
  });
  if (interiorWater.length && !interiorWater[0].object) {
    interiorWater[0].object = 'DOCK';
    // Guarantee a visible fish near the dock. Check immediate neighbours
    // first; fall back to any empty water tile within distance 3.
    const dock = interiorWater[0];
    let placed = false;
    for (const [dx, dy] of [[-1,0],[1,0],[0,-1],[0,1]] as const) {
      const nb = tiles[`${dock.x+dx},${dock.y+dy}`];
      if (nb && nb.type === 'WATER' && !nb.object) {
        nb.object = 'FISH_SPOT';
        placed = true;
        break;
      }
    }
    if (!placed) {
      // Extended fallback — search water tiles up to radius 3
      const fallback = waterTiles
        .filter(t => !t.object)
        .sort((a, b) => {
          const da = (a.x - dock.x) ** 2 + (a.y - dock.y) ** 2;
          const db = (b.x - dock.x) ** 2 + (b.y - dock.y) ** 2;
          return da - db;
        });
      if (fallback.length) fallback[0].object = 'FISH_SPOT';
    }
  }

  // ── Fish spots — on water tiles that don't already have an object ──────
  const fishCandidates = waterTiles.filter(t => !t.object);
  for (let i = 0; i < 5 && fishCandidates.length; i++) pick(fishCandidates).object = 'FISH_SPOT';

  // ── Toxic drums — bobbing in mid-depth water (shoreDepth 2-5) ────────────
  const drumWater = waterTiles.filter(t =>
    !t.object && t.shoreDepth !== undefined && t.shoreDepth >= 2 && t.shoreDepth <= 5
  );
  for (let i = 0; i < 2 && drumWater.length; i++) pick(drumWater).object = 'TOXIC_DRUM';

  // ── Driftwood logs on the screen-left shore beside the inlet ─────────────
  const leftShore = Object.values(tiles).filter(t =>
    t.type === 'SAND' && !t.object && t.x - t.y < -2 &&
    ([[-1,0],[1,0],[0,-1],[0,1]] as const).some(([dx,dy]) => {
      const nb = tiles[`${t.x+dx},${t.y+dy}`];
      return nb?.type === 'WATER';
    })
  );
  for (let i = 0; i < 3 && leftShore.length; i++) pick(leftShore).object = 'DRIFTWOOD';

  // ── Tree-neighbor set for standing rocks around the canopy ───────────────
  const ALL_TREE_TYPES: ObjectType[] = ['TREE_COCONUT', 'TREE_MANGO', 'TREE_APPLE', 'TREE_PALM', 'TREE_COCONUT_UNRIPE', 'TREE_MANGO_UNRIPE'];
  const treeTiles = Object.values(tiles).filter(t => t.object && ALL_TREE_TYPES.includes(t.object as ObjectType));
  const TREE_NEIGHBORS = [[-1,0],[1,0],[0,-1],[0,1],[-1,-1],[1,-1],[-1,1],[1,1]] as const;

  // ── Tall rocks near trees — mossy standing stones beside the canopy ──────
  for (const tree of treeTiles) {
    for (const [dx, dy] of TREE_NEIGHBORS) {
      const nb = tiles[`${tree.x + dx},${tree.y + dy}`];
      if (nb && nb.type === 'GRASS' && !nb.object && rand() < 0.07) {
        nb.object = 'TALL_ROCK';
      }
    }
  }

  // ── Sunflowers near garden patches — waiting to ripe ────────────────────
  const gardenTiles = Object.values(tiles).filter(t => t.object === 'GARDEN_PATCH');
  const GARDEN_NEIGHBORS = [[-1,0],[1,0],[0,-1],[0,1],[-1,-1],[1,-1],[-1,1],[1,1]] as const;
  for (const garden of gardenTiles) {
    for (const [dx, dy] of GARDEN_NEIGHBORS) {
      const nb = tiles[`${garden.x + dx},${garden.y + dy}`];
      if (nb && nb.type === 'GRASS' && !nb.object && rand() < 0.60) {
        nb.object = 'SUNFLOWER';
      }
    }
  }

  // ── Weeds near rocks — overgrown look around boulders ───────────────────
  const rockTiles = Object.values(tiles).filter(t => t.object === 'ROCK');
  const ROCK_NEIGHBORS = [[-1,0],[1,0],[0,-1],[0,1],[-1,-1],[1,-1],[-1,1],[1,1]] as const;
  for (const rock of rockTiles) {
    for (const [dx, dy] of ROCK_NEIGHBORS) {
      const nb = tiles[`${rock.x + dx},${rock.y + dy}`];
      if (nb && nb.type === 'GRASS' && !nb.object && rand() < 0.15) {
        nb.object = 'WEEDS';
      }
    }
  }

  // ── Clear trees blocking garden patches and rocks ───────────────────────
  // In isometric view, trees on any neighboring tile can visually overlap a
  // GARDEN_PATCH or ROCK.  After all objects are placed, remove any tree from
  // the 8-directional neighborhood of every protected tile so they stay visible.
  const TREE_TYPES: ObjectType[] = ['TREE_PALM', 'TREE_APPLE', 'TREE_COCONUT', 'TREE_MANGO', 'TREE_COCONUT_UNRIPE', 'TREE_MANGO_UNRIPE'];
  const PROTECTED: ObjectType[]  = ['GARDEN_PATCH', 'ROCK'];
  const NEIGHBORS = [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]] as const;

  for (const tile of Object.values(tiles)) {
    if (!tile.object || !PROTECTED.includes(tile.object)) continue;
    for (const [dx, dy] of NEIGHBORS) {
      const nb = tiles[`${tile.x + dx},${tile.y + dy}`];
      if (nb?.object && TREE_TYPES.includes(nb.object as ObjectType)) {
        nb.object = undefined;
      }
    }
  }

  updateShoreDepth(tiles);

  return tiles;
}

/**
 * Applies the reference terrain and scenery layout to new worlds and older
 * saves while preserving object state, and keeps initial crop plots usable.
 */
export function ensureIslandScenery(sourceTiles: Record<string, TileData>): Record<string, TileData> {
  const tiles = { ...sourceTiles };
  const values = () => Object.values(tiles);
  const isLand = (tile: TileData) => tile.type === 'GRASS' || tile.type === 'SAND';
  const distance = (a: TileData, b: TileData) => Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
  const centerDistance = (tile: TileData) => Math.hypot(tile.x - 15, tile.y - 15);
  const inSceneryView = (tile: TileData) =>
    tile.x + tile.y >= 20 &&
    tile.x + tile.y <= 27 &&
    Math.abs(tile.x - tile.y) <= 12;
  const adjacentToWater = (tile: TileData) =>
    [[-1, 0], [1, 0], [0, -1], [0, 1]].some(([dx, dy]) =>
      tiles[`${tile.x + dx},${tile.y + dy}`]?.type === 'WATER'
    );
  const treeTypes = new Set<ObjectType>([
    'TREE_PALM',
    'TREE_APPLE',
    'TREE_COCONUT',
    'TREE_MANGO',
    'TREE_COCONUT_UNRIPE',
    'TREE_MANGO_UNRIPE',
  ]);

  // Convert the earlier visual soil marker to a gameplay-only flag before
  // scenery is moved, so these saved plots remain in their original positions.
  for (const tile of values()) {
    const legacyTile = tile as TileData & { soilPatch?: boolean };
    if (!legacyTile.soilPatch) continue;
    const migratedTile = { ...tile, cropPlotAfterTree: true } as TileData & { soilPatch?: boolean };
    delete migratedTile.soilPatch;
    tiles[tile.id] = migratedTile;
  }

  // Rebuild only the base terrain field. Existing objects and gameplay state
  // stay in the save; water objects are moved to the nearest matching water.
  const waterObjectsToRelocate: TileData[] = [];
  const waterOnlyObjects = new Set<ObjectType>(['DOCK', 'FISH_SPOT', 'TOXIC_DRUM']);
  for (const tile of values()) {
    const plannedType = classifyReferenceTerrain(tile.x, tile.y) ?? 'WATER';
    if (tile.object && waterOnlyObjects.has(tile.object) && plannedType !== 'WATER') {
      const cleared = { ...tile, type: plannedType, object: undefined };
      delete cleared.shoreDepth;
      tiles[tile.id] = cleared;
      waterObjectsToRelocate.push({ ...tile, type: 'WATER' });
      continue;
    }

    const preserveLandUnderObject =
      Boolean(tile.object) &&
      !waterOnlyObjects.has(tile.object as ObjectType) &&
      plannedType === 'WATER';
    const nextType = preserveLandUnderObject ? (isLand(tile) ? tile.type : 'GRASS') : plannedType;
    if (tile.type !== nextType) tiles[tile.id] = { ...tile, type: nextType };
  }

  for (const objectTile of waterObjectsToRelocate) {
    const destination = values()
      .filter(tile => tile.type === 'WATER' && !tile.object)
      .sort((a, b) =>
        ((a.x - objectTile.x) ** 2 + (a.y - objectTile.y) ** 2) -
        ((b.x - objectTile.x) ** 2 + (b.y - objectTile.y) ** 2)
      )[0];
    if (!destination) {
      const source = tiles[objectTile.id];
      if (source) tiles[source.id] = { ...source, type: 'WATER', object: objectTile.object };
      continue;
    }
    const moved = {
      ...objectTile,
      id: destination.id,
      x: destination.x,
      y: destination.y,
      type: 'WATER' as const,
    };
    delete moved.shoreDepth;
    tiles[destination.id] = moved;
  }

  // Keep the dock at the left inlet, beside the player's vertical band.
  const existingDock = values().find(tile => tile.object === 'DOCK');
  if (existingDock && Math.hypot(existingDock.x - 12, existingDock.y - 18) > 1) {
    const dockSpot = values()
      .filter(tile =>
        tile.type === 'WATER' &&
        !tile.object &&
        [[-1, 0], [1, 0], [0, -1], [0, 1]].some(([dx, dy]) =>
          isLand(tiles[`${tile.x + dx},${tile.y + dy}`] ?? tile)
        )
      )
      .sort((a, b) =>
        ((a.x - 12) ** 2 + (a.y - 18) ** 2) -
        ((b.x - 12) ** 2 + (b.y - 18) ** 2)
      )[0];
    if (dockSpot) {
      tiles[existingDock.id] = { ...existingDock, object: undefined };
      tiles[dockSpot.id] = { ...dockSpot, object: 'DOCK' };
    }
  }

  // Bring natural trees out of the spawn clearing without losing their
  // harvest/chop timers or health; the back line and side groves stay full.
  const centralTrees = values().filter(tile =>
    tile.object &&
    treeTypes.has(tile.object) &&
    centerDistance(tile) < 4.4 &&
    !tile.cropPlotAfterTree
  );
  for (const source of centralTrees) {
    const candidates = values()
      .filter(tile =>
        isLand(tile) &&
        !tile.object &&
        !tile.cropPlotAfterTree &&
        centerDistance(tile) >= 4.4 &&
        (tile.x + tile.y <= 27 || Math.abs(tile.x - tile.y) >= 7) &&
        !values().some(neighbor =>
          neighbor.object &&
          treeTypes.has(neighbor.object) &&
          Math.abs(neighbor.x - tile.x) <= 1 &&
          Math.abs(neighbor.y - tile.y) <= 1
        )
      )
      .sort((a, b) => {
        const score = (tile: TileData) =>
          Math.abs(tile.x + tile.y - 23) +
          Math.max(0, 5 - Math.abs(tile.x - tile.y)) +
          distance(tile, source) * 0.15;
        return score(a) - score(b);
      });
    const destination = candidates[0];
    if (!destination || !source.object) continue;

    tiles[destination.id] = {
      ...destination,
      object: source.object,
      treeHp: source.treeHp,
      ripensAt: source.ripensAt,
      growsAt: source.growsAt,
      layoutDecoration: source.layoutDecoration,
    };
    tiles[source.id] = {
      ...source,
      type: classifyReferenceTerrain(source.x, source.y) ?? 'WATER',
      object: undefined,
      treeHp: undefined,
      ripensAt: undefined,
      growsAt: undefined,
      layoutDecoration: undefined,
    };
  }

  // Keep most natural fruit trees in a readable line along the back of the island.
  const naturalTrees = values().filter(tile =>
    tile.object && treeTypes.has(tile.object) && !tile.cropPlotAfterTree
  );
  const targetBackTreeCount = Math.ceil(naturalTrees.length * 0.85);
  let backTreeCount = naturalTrees.filter(tile => tile.x + tile.y <= 30).length;
  const sideTrees = naturalTrees
    .filter(tile => tile.x + tile.y > 30)
    .sort((a, b) => (b.x + b.y) - (a.x + a.y) || a.id.localeCompare(b.id));

  for (const source of sideTrees) {
    if (backTreeCount >= targetBackTreeCount || !source.object) break;
    const destination = values()
      .filter(tile =>
        isLand(tile) &&
        !tile.object &&
        !tile.cropPlotAfterTree &&
        centerDistance(tile) >= 4.4 &&
        tile.x + tile.y <= 30
      )
      .sort((a, b) => {
        const score = (tile: TileData) =>
          Math.abs(tile.x + tile.y - 22) +
          Math.abs(tile.x - tile.y) * 0.04 +
          distance(tile, source) * 0.08;
        return score(a) - score(b) || a.id.localeCompare(b.id);
      })[0];
    if (!destination) break;

    tiles[destination.id] = {
      ...destination,
      object: source.object,
      treeHp: source.treeHp,
      ripensAt: source.ripensAt,
      growsAt: source.growsAt,
      layoutDecoration: source.layoutDecoration,
    };
    tiles[source.id] = {
      ...source,
      type: classifyReferenceTerrain(source.x, source.y) ?? 'WATER',
      object: undefined,
      treeHp: undefined,
      ripensAt: undefined,
      growsAt: undefined,
      layoutDecoration: undefined,
    };
    backTreeCount += 1;
  }

  // Remove the pre-placed decorative hut from new and saved islands.
  for (const tile of values()) {
    if (tile.object === 'ISLAND_HUT') {
      tiles[tile.id] = { ...tile, object: undefined };
    }
  }

  // Keep the fixed decorative trees in the area the player sees at spawn.
  for (const tile of values()) {
    if (
      (tile.object === 'PINE_TREE' || tile.object === 'PALM_TRUNK') &&
      !inSceneryView(tile)
    ) {
      tiles[tile.id] = { ...tile, object: undefined };
    }
  }

  // A player-built hut remains valid scenery anchor; never add one automatically.
  const home = values().find(tile => tile.object === 'HUT');

  if (home) {
    for (const tile of values()) {
      const pineIsInPlace =
        tile.object === 'PINE_TREE' &&
        inSceneryView(tile) &&
        distance(tile, home) <= 3 &&
        tile.x - tile.y < home.x - home.y;
      const trunkIsInPlace =
        tile.object === 'PALM_TRUNK' &&
        inSceneryView(tile) &&
        distance(tile, home) <= 7 &&
        tile.x - tile.y > home.x - home.y;
      if ((tile.object === 'PINE_TREE' && !pineIsInPlace) || (tile.object === 'PALM_TRUNK' && !trunkIsInPlace)) {
        tiles[tile.id] = { ...tile, object: undefined };
      }
    }
  }

  const placeIfMissing = (
    object: ObjectType,
    preferred: (tile: TileData) => boolean,
    score: (tile: TileData) => number,
  ) => {
    if (values().some(tile => tile.object === object)) return;
    const available = values().filter(tile => isLand(tile) && !tile.object);
    const preferredSpot = available.filter(preferred).sort((a, b) => score(a) - score(b))[0];
    const fallbackSpot = preferredSpot ?? available.sort((a, b) => score(a) - score(b))[0];
    if (fallbackSpot) tiles[fallbackSpot.id] = { ...fallbackSpot, object };
  };

  placeIfMissing(
    'PINE_TREE',
    tile =>
      isLand(tile) &&
      inSceneryView(tile) &&
      (home
        ? distance(tile, home) <= 3 && tile.x - tile.y < home.x - home.y
        : tile.x - tile.y < -3),
    tile => {
      const nearHome = home
        ? distance(tile, home)
        : Math.abs(tile.x + tile.y - 23) + Math.abs(tile.x - tile.y + 7) * 0.4;
      const sitsBehind = home && tile.x + tile.y < home.x + home.y;
      const sitsLeftOfHome = home && tile.x - tile.y < home.x - home.y;
      return nearHome +
        (tile.type === 'GRASS' ? 0 : 0.35) +
        (sitsBehind ? 0 : 0.4) +
        (sitsLeftOfHome ? 0 : 4);
    },
  );

  placeIfMissing(
    'PALM_TRUNK',
    tile =>
      adjacentToWater(tile) &&
      inSceneryView(tile) &&
      (home ? distance(tile, home) <= 7 : tile.x - tile.y >= 3),
    tile => {
      const nearHome = home
        ? distance(tile, home)
        : Math.abs(tile.x + tile.y - 25) + Math.abs(tile.x - tile.y - 5) * 0.4;
      const sitsRightOfHome = home && tile.x - tile.y > home.x - home.y;
      return nearHome + (sitsRightOfHome ? 0 : 4);
    },
  );

  // Add a few low branch clusters beside tropical flowers. This decoration is
  // also applied to saved islands without resetting any existing progress.
  const branchClusters = values().filter(tile => tile.object === 'BRANCH_CLUSTER');
  const tropicalFlowers = values().filter(tile => tile.object === 'FLOWER_BUSH');
  const targetBranchClusterCount = 3;
  while (branchClusters.length < targetBranchClusterCount) {
    const destination = values()
      .filter(tile =>
        tile.type === 'GRASS' &&
        !tile.object &&
        centerDistance(tile) >= 5 &&
        tropicalFlowers.some(flower => distance(tile, flower) <= 2) &&
        branchClusters.every(cluster => distance(tile, cluster) >= 3)
      )
      .sort((a, b) => {
        const nearestFlower = (tile: TileData) =>
          Math.min(...tropicalFlowers.map(flower => distance(tile, flower)));
        return nearestFlower(a) - nearestFlower(b) || a.id.localeCompare(b.id);
      })[0];
    if (!destination) break;
    const cluster: TileData = { ...destination, object: 'BRANCH_CLUSTER' };
    tiles[destination.id] = cluster;
    branchClusters.push(cluster);
  }

  // Add a small row of leafy palms behind the open center, spread across the
  // island to match the supplied layout rather than concentrating them at spawn.
  const backPalmAnchors = [{ x: 4, y: 18 }, { x: 8, y: 12 }, { x: 19, y: 8 }];
  const backPalmCount = 4;
  const palmTiles = values().filter(tile => tile.object === 'PALM_TRUNK');
  for (const anchor of backPalmAnchors) {
    if (palmTiles.length >= backPalmCount) break;
    if (palmTiles.some(tile => Math.hypot(tile.x - anchor.x, tile.y - anchor.y) < 2.5)) continue;

    const destination = values()
      .filter(tile =>
        isLand(tile) &&
        !tile.object &&
        tile.x + tile.y <= 27 &&
        Math.abs(tile.x - tile.y) <= 15 &&
        centerDistance(tile) >= 6 &&
        palmTiles.every(palm => Math.hypot(palm.x - tile.x, palm.y - tile.y) >= 3)
      )
      .sort((a, b) => {
        const score = (tile: TileData) =>
          Math.hypot(tile.x - anchor.x, tile.y - anchor.y) * 2 +
          (tile.type === 'GRASS' ? 0 : 1.25);
        return score(a) - score(b) || a.id.localeCompare(b.id);
      })[0];
    if (!destination) continue;

    const palm: TileData = { ...destination, object: 'PALM_TRUNK' };
    tiles[destination.id] = palm;
    palmTiles.push(palm);
  }

  // Move one existing fruit tree onto each untouched initial crop plot.
  // The tile keeps its grass/sand ground, and tree interactions stay unchanged.
  const brownPlots = values().filter(tile => tile.type === 'GRASS' && tile.object === 'CROP_PLOT');
  for (const plot of brownPlots) {
    const source = values()
      .filter(tile => tile.type === 'GRASS' && treeTypes.has(tile.object as ObjectType) && !tile.cropPlotAfterTree)
      .sort((a, b) => distance(a, plot) - distance(b, plot) || a.id.localeCompare(b.id))[0];
    if (!source || !source.object) continue;

    tiles[plot.id] = {
      ...plot,
      object: source.object,
      treeHp: source.treeHp,
      ripensAt: source.ripensAt,
      growsAt: source.growsAt,
      cropPlotAfterTree: true,
    };
    tiles[source.id] = {
      ...source,
      object: undefined,
      treeHp: undefined,
      ripensAt: undefined,
      growsAt: undefined,
    };
  }

  updateShoreDepth(tiles);
  return tiles;
}

type DecorationRespawn = { tileId: string; object: ObjectType; respawnAt: number };

const NATURAL_DECORATION_ANCHORS: Partial<Record<ObjectType, Array<{ x: number; y: number }>>> = {
  FLOWER_BUSH: [{ x: 6, y: 12 }, { x: 10, y: 17 }, { x: 22, y: 11 }, { x: 17, y: 22 }, { x: 22, y: 16 }],
  SUNFLOWER: [{ x: 12, y: 8 }, { x: 22, y: 16 }, { x: 22, y: 21 }],
  BLUEBELL: [{ x: 13, y: 7 }, { x: 17, y: 22 }, { x: 6, y: 12 }, { x: 22, y: 11 }],
  PANSY: [{ x: 16, y: 8 }, { x: 22, y: 16 }, { x: 21, y: 21 }, { x: 10, y: 17 }],
  TULIP: [{ x: 10, y: 17 }, { x: 24, y: 16 }, { x: 17, y: 22 }, { x: 12, y: 8 }],
  ROCK: [{ x: 11, y: 20 }, { x: 24, y: 10 }, { x: 24, y: 16 }, { x: 17, y: 22 }, { x: 21, y: 21 }],
  TALL_ROCK: [{ x: 24, y: 16 }, { x: 11, y: 20 }, { x: 21, y: 21 }, { x: 16, y: 8 }, { x: 17, y: 22 }],
};

/**
 * Groups naturally spawned flowers and rocks into reference-style clusters.
 * Existing object counts and queued respawns are preserved for saved islands.
 */
export function arrangeIslandNaturalDecorations(
  sourceTiles: Record<string, TileData>,
  sourceRespawns: DecorationRespawn[] = [],
): { tiles: Record<string, TileData>; respawns: DecorationRespawn[] } {
  const tiles = { ...sourceTiles };
  const respawns = sourceRespawns.map(respawn => ({ ...respawn }));
  const entriesByType = new Map<ObjectType, Array<{
    object: ObjectType;
    sourceId: string;
    sourceTile?: TileData;
    respawnIndex?: number;
  }>>();

  const addEntry = (object: ObjectType, entry: {
    object: ObjectType;
    sourceId: string;
    sourceTile?: TileData;
    respawnIndex?: number;
  }) => {
    const entries = entriesByType.get(object) ?? [];
    entries.push(entry);
    entriesByType.set(object, entries);
  };

  for (const tile of Object.values(tiles)) {
    if (!tile.object || !NATURAL_DECORATION_ANCHORS[tile.object]) continue;
    addEntry(tile.object, { object: tile.object, sourceId: tile.id, sourceTile: tile });
    tiles[tile.id] = {
      ...tile,
      type: classifyReferenceTerrain(tile.x, tile.y) ?? 'WATER',
      object: undefined,
      placedAt: undefined,
    };
  }

  respawns.forEach((respawn, respawnIndex) => {
    if (!NATURAL_DECORATION_ANCHORS[respawn.object]) return;
    addEntry(respawn.object, { object: respawn.object, sourceId: respawn.tileId, respawnIndex });
  });

  const reservedTileIds = new Set<string>();
  const isLand = (tile: TileData) => tile.type === 'GRASS' || tile.type === 'SAND';
  const scoreTile = (tile: TileData, anchor: { x: number; y: number }, preferredType: TileType) => {
    const du = (tile.x - tile.y) - (anchor.x - anchor.y);
    const dv = (tile.x + tile.y) - (anchor.x + anchor.y);
    const terrainPenalty = tile.type === preferredType ? 0 : 2;
    return du * du + dv * dv * 0.12 + terrainPenalty;
  };

  for (const [object, entries] of entriesByType) {
    const anchors = NATURAL_DECORATION_ANCHORS[object];
    if (!anchors?.length || !entries.length) continue;
    entries.sort((a, b) =>
      a.sourceId.localeCompare(b.sourceId) ||
      (a.respawnIndex ?? -1) - (b.respawnIndex ?? -1)
    );

    const clusterCount = Math.min(anchors.length, Math.max(1, Math.ceil(entries.length / 4)));
    const preferredType: TileType = object === 'ROCK' || object === 'TALL_ROCK' ? 'SAND' : 'GRASS';

    entries.forEach((entry, index) => {
      const clusterIndex = Math.min(clusterCount - 1, Math.floor(index * clusterCount / entries.length));
      const anchor = anchors[clusterIndex];
      const candidates = Object.values(tiles)
        .filter(tile =>
          isLand(tile) &&
          !tile.object &&
          !tile.cropPlotAfterTree &&
          Math.hypot(tile.x - 15, tile.y - 15) >= 6.2 &&
          !reservedTileIds.has(tile.id)
        )
        .sort((a, b) =>
          scoreTile(a, anchor, preferredType) - scoreTile(b, anchor, preferredType) ||
          a.id.localeCompare(b.id)
        );
      const destination = candidates[0];

      if (!destination) {
        if (entry.sourceTile && !tiles[entry.sourceTile.id]?.object) {
          tiles[entry.sourceTile.id] = { ...entry.sourceTile };
        }
        return;
      }

      reservedTileIds.add(destination.id);
      if (entry.respawnIndex !== undefined) {
        respawns[entry.respawnIndex] = { ...respawns[entry.respawnIndex], tileId: destination.id };
        return;
      }

      tiles[destination.id] = {
        ...destination,
        object: entry.object,
        ...(entry.sourceTile?.placedAt !== undefined ? { placedAt: entry.sourceTile.placedAt } : {}),
      };
    });
  }

  return { tiles, respawns };
}

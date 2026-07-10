 import { QuestDef, TileData, TileType, ObjectType, WeatherType } from './types';

export const DEV_SPEEDUP = 100;
export const SCALED = (ms: number) => Math.max(1000, ms / DEV_SPEEDUP); // Don't go below 1 second to avoid missing ticks
export const COCONUT_RIPEN_TIME = SCALED(90000);  // 90 s — unripe → ripe
export const MANGO_RIPEN_TIME   = SCALED(120000); // 2 min — unripe → ripe

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
      { description: 'Harvest 1 mango tree',   targetType: 'harvest_mango',     targetCount: 1, icon: '🥭' },
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
  SUNFLOWER:   { action: 'Harvest', energy: 1, coins: 6, xp: 12, respawn: SCALED(90000) },
  BLUEBELL:       { action: 'Harvest', energy: 1, coins: 4, xp: 8,  respawn: SCALED(60000) },
  PANSY:          { action: 'Harvest', energy: 1, coins: 4, xp: 8,  respawn: SCALED(60000) },
  TULIP:          { action: 'Harvest', energy: 1, coins: 5, xp: 10, respawn: SCALED(70000) },
  PINEAPPLE_PLANT:{ action: 'Harvest', energy: 1, coins: 8, xp: 14, respawn: SCALED(90000) },
  BLUEBERRY_BUSH: { action: 'Harvest', energy: 1, coins: 6, xp: 12, respawn: SCALED(75000) },
  DRIFTWOOD: { action: 'Clear', energy: 1, coins: 3, xp: 5, drops: { wood: 1 }, respawn: SCALED(80000) },
  TREE_COCONUT: { action: 'Harvest', energy: 1, coins: 6, xp: 12, drops: { food: 2 }, respawn: SCALED(70000) },
  TREE_MANGO:   { action: 'Harvest', energy: 1, coins: 8, xp: 14, drops: { food: 3 }, respawn: SCALED(80000) },
  TREE_COCONUT_UNRIPE: { action: 'Wait', energy: 0, coins: 0, xp: 0 },
  TREE_MANGO_UNRIPE:   { action: 'Wait', energy: 0, coins: 0, xp: 0 },
  GARDEN_PATCH: { action: 'Harvest', energy: 1, coins: 10, xp: 18, drops: { food: 2 }, respawn: SCALED(50000) },
  CROP_READY: { action: 'Harvest', energy: 1, coins: 10, xp: 20 },
  CROP_WILTED: { action: 'Clear', energy: 1, coins: 0, xp: 2 },
  FISH_SPOT: { action: 'Fish', energy: 1, coins: 12, xp: 15, respawn: SCALED(120000) },
  CRAB:        { action: 'Attack', energy: 1, coins: 5, xp: 10 },
  BOAR:        { action: 'Shoo',  energy: 1, coins: 8, xp: 12 },
  BABY_PARROT: { action: 'Feed',  energy: 0, coins: 2, xp: 5  },
  TALL_ROCK:   { action: 'Mine', energy: 1, coins: 10, xp: 18, drops: { stone: 2 }, respawn: SCALED(120000) },
  DOCK:        { action: 'Visit', energy: 0, coins: 0, xp: 0 },
};

export const EMOJI_MAP: Record<string, string> = {
  TREE_PALM: '🌴', TREE_APPLE: '🍎', ROCK: '🪨', FLOWER_BUSH: '🌸', DRIFTWOOD: '🪵', SUNFLOWER: '🌻', PUDDLE: '💧', THORNS: '🌵',
  BLUEBELL: '💜', PANSY: '🌼', TULIP: '🌷', PINEAPPLE_PLANT: '🍍', BLUEBERRY_BUSH: '🫐',
  TREE_COCONUT: '🌴', TREE_MANGO: '🥭', GARDEN_PATCH: '🍍',
  TREE_COCONUT_UNRIPE: '🌴', TREE_MANGO_UNRIPE: '🥭',
  CROP_PLOT: '🟫', CROP_GROWING: '🌱', CROP_READY: '🌽', CROP_WILTED: '🥀',
  FISH_SPOT: '', HUT: '🏚️', DOCK: '⛵', WELL: '💧', 
  FLOWER_POT: '🪴', FENCE: '🚧', LANTERN: '🏮', CRAB: '🦀', BOAR: '🐗', BABY_PARROT: '🦜', TALL_ROCK: '🪨'
};

export const INITIAL_NEIGHBORS = [
  { id: 'n1', name: 'Marina', avatar: 'marina', level: 1, favorPoints: 0, wishlist: ['starfish'] },
];

export function generateIsland(): Record<string, TileData> {
  const GRID = 31;
  const CX = 15, CY = 15; // island centre tile

  // ── Terrain value ───────────────────────────────────────────────────────
  // Two explicit Gaussian channels carve clear river gaps through the island:
  //   • Horizontal channel:  runs left→right at y ≈ CY-2  (upper third)
  //   • Vertical channel:    runs top→bottom at x ≈ CX+3  (right third)
  // Together they form a ⌐ shape, splitting the island into three sections.
  const G = (v: number, sigma: number) => Math.exp(-(v * v) / (2 * sigma * sigma));

  const terrainVal = (x: number, y: number): number => {
    const dx = x - CX, dy = y - CY;
    const distSq = (dx * dx) / (13.5 * 13.5) + (dy * dy) / (11.5 * 11.5);
    const radial  = 1.0 - distSq;

    // Horizontal channel — reduced depth so centre tiles become sand (connected)
    // while channel mouths at island edges remain water
    const hRiver = G(dy + 2, 1.35) * 0.68;

    // Vertical channel — likewise shallower so middle is sandy
    const vRiver = dy > -5 ? G(dx - 3, 1.15) * 0.60 : 0;

    return radial - Math.max(hRiver, vRiver);
  };

  // ── Classify terrain ────────────────────────────────────────────────────
  const classifyTile = (x: number, y: number): TileType | null => {
    const dx = x - CX, dy = y - CY;
    const distSq = (dx * dx) / (13.5 * 13.5) + (dy * dy) / (11.5 * 11.5);
    const radial  = 1.0 - distSq;
    if (radial < -0.38) return null;    // outside render range
    if (radial <= 0)    return 'WATER'; // outer ocean
    const tv = terrainVal(x, y);
    if (tv > 0.55) return 'GRASS';
    if (tv > 0.18) return 'SAND';
    return 'WATER'; // river/channel carved by Gaussian trough
  };

  // ── Build tile map ──────────────────────────────────────────────────────
  const tiles: Record<string, TileData> = {};
  for (let y = 0; y < GRID; y++) {
    for (let x = 0; x < GRID; x++) {
      const type = classifyTile(x, y);
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
      const tile = tiles[`${x},${y}`];
      if (!tile) continue;
      const ff = forestFactor(x, y);

      // Isometric "back" = small x+y (upper-screen area). Centre sum = CX+CY = 30.
      const diagSum    = x + y;
      const isDeepBack = diagSum < 22;            // dense-but-spaced forest zone
      const isMidBack  = diagSum >= 22 && diagSum < 28; // light transition strip

      // Adjacent to water → eligible for a waterside coconut palm
      const adjToWater = [[-1,0],[1,0],[0,-1],[0,1]].some(([dx,dy]) => {
        const n = tiles[`${x+dx},${y+dy}`];
        return n && n.type === 'WATER';
      });

      if (tile.type === 'GRASS') {
        const r = rand();

        if (isDeepBack) {
          // ── Back forest: high probability but minDist=1 → no two trees touch ──
          // treePct: 45–62 % raw chance; spacing thins it to ~35–45 % actual fill
          const treePct = 0.45 + ff * 0.17;
          if (r < treePct) {
            const tr = rand();
            const type = tr < 0.25 ? 'TREE_COCONUT_UNRIPE'
                       : tr < 0.55 ? 'TREE_MANGO_UNRIPE'
                       : tr < 0.80 ? 'TREE_APPLE'
                       :             'TREE_COCONUT_UNRIPE';
            const ripenOffset = type === 'TREE_COCONUT_UNRIPE' ? COCONUT_RIPEN_TIME
                             : type === 'TREE_MANGO_UNRIPE'   ? MANGO_RIPEN_TIME : 0;
            const extras = ripenOffset > 0 ? { ripensAt: Date.now() + Math.floor(rand() * ripenOffset) } : undefined;
            placeTree(tile, type, 1, extras); // minDist=1
          } else if (r < treePct + 0.04) {
            tile.object = 'FLOWER_BUSH';
          }

        } else if (isMidBack) {
          // ── Mid zone: more trees to fill the transition band ──────────
          const treePct = 0.30 + ff * 0.14;
          if (r < treePct) {
            const tr = rand();
            const type = tr < 0.35 ? 'TREE_MANGO_UNRIPE'
                       : tr < 0.65 ? 'TREE_COCONUT_UNRIPE'
                       :             'TREE_APPLE';
            const ripenOffset2 = type === 'TREE_COCONUT_UNRIPE' ? COCONUT_RIPEN_TIME
                               : type === 'TREE_MANGO_UNRIPE'   ? MANGO_RIPEN_TIME : 0;
            const extras2 = ripenOffset2 > 0 ? { ripensAt: Date.now() + Math.floor(rand() * ripenOffset2) } : undefined;
            placeTree(tile, type, 2, extras2); // minDist=2
          } else if (r < treePct + 0.03) {
            tile.object = 'FLOWER_BUSH';
          }

        } else {
          // ── Front / open: scattered palms, not just waterside ─────────
          const palmChance  = adjToWater ? 0.14 : 0.06;
          const mangoChance = 0.05;
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

  const emptyGrass = Object.values(tiles).filter(t => t.type === 'GRASS' && !t.object);
  const inner = emptyGrass.filter(t => forestFactor(t.x, t.y) < 0.40);
  const outer = emptyGrass.filter(t => forestFactor(t.x, t.y) >= 0.40);

  for (let i = 0; i < 3 && inner.length; i++) pick(inner).object = 'GARDEN_PATCH';
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
  for (let i = 0; i < 6  && inner.length; i++) pick(inner).object = 'PINEAPPLE_PLANT';
  for (let i = 0; i < 4  && outer.length; i++) pick(outer).object = 'PINEAPPLE_PLANT';
  for (let i = 0; i < 6  && inner.length; i++) pick(inner).object = 'BLUEBERRY_BUSH';
  for (let i = 0; i < 5  && outer.length; i++) pick(outer).object = 'BLUEBERRY_BUSH';
  for (let i = 0; i < 4  && inner.length; i++) pick(inner).object = 'BABY_PARROT';

  const waterTiles = Object.values(tiles).filter(t => t.type === 'WATER');

  // ── Marina dock — place on the interior channel water tile closest to centre ─
  const interiorWater = waterTiles.filter(t => {
    const dirs = [[-1,0],[1,0],[0,-1],[0,1]] as const;
    return dirs.some(([dx,dy]) => {
      const nb = tiles[`${t.x+dx},${t.y+dy}`];
      return nb && (nb.type === 'SAND' || nb.type === 'GRASS');
    });
  }).sort((a, b) => {
    const da = (a.x - CX) ** 2 + (a.y - CY) ** 2;
    const db = (b.x - CX) ** 2 + (b.y - CY) ** 2;
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

  // ── Puddles near trees — small water pools under the canopy ─────────────
  const ALL_TREE_TYPES: ObjectType[] = ['TREE_COCONUT', 'TREE_MANGO', 'TREE_APPLE', 'TREE_PALM', 'TREE_COCONUT_UNRIPE', 'TREE_MANGO_UNRIPE'];
  const treeTiles = Object.values(tiles).filter(t => t.object && ALL_TREE_TYPES.includes(t.object as ObjectType));
  const TREE_NEIGHBORS = [[-1,0],[1,0],[0,-1],[0,1],[-1,-1],[1,-1],[-1,1],[1,1]] as const;
  for (const tree of treeTiles) {
    for (const [dx, dy] of TREE_NEIGHBORS) {
      const nb = tiles[`${tree.x + dx},${tree.y + dy}`];
      if (nb && nb.type === 'GRASS' && !nb.object && rand() < 0.28) {
        nb.object = 'PUDDLE';
      }
    }
  }

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

  // ── Shore-depth BFS — stamp every WATER tile with distance to nearest land ─
  // Seed: water tiles directly adjacent to a non-water tile get depth 1
  const bfsQueue: Array<{ id: string; depth: number }> = [];
  for (const tile of Object.values(tiles)) {
    if (tile.type === 'WATER') continue;
    for (const [dx, dy] of [[-1,0],[1,0],[0,-1],[0,1]] as const) {
      const nb = tiles[`${tile.x + dx},${tile.y + dy}`];
      if (nb?.type === 'WATER' && nb.shoreDepth === undefined) {
        nb.shoreDepth = 1;
        bfsQueue.push({ id: nb.id, depth: 1 });
      }
    }
  }
  // Propagate outward
  let qi = 0;
  while (qi < bfsQueue.length) {
    const { id, depth } = bfsQueue[qi++];
    const [tx, ty] = id.split(',').map(Number);
    for (const [dx, dy] of [[-1,0],[1,0],[0,-1],[0,1]] as const) {
      const nb = tiles[`${tx + dx},${ty + dy}`];
      if (nb?.type === 'WATER' && nb.shoreDepth === undefined) {
        nb.shoreDepth = depth + 1;
        bfsQueue.push({ id: nb.id, depth: depth + 1 });
      }
    }
  }

  return tiles;
}

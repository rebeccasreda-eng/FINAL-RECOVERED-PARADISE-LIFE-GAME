 import { QuestDef, TileData, TileType, ObjectType, WeatherType } from './types';

export const DEV_SPEEDUP = 100;
export const SCALED = (ms: number) => Math.max(1000, ms / DEV_SPEEDUP); // Don't go below 1 second to avoid missing ticks

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

export const QUESTS: QuestDef[] = [
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
];

export const OBJECT_CONFIG: Record<string, any> = {
  GRASS_PATCH: { action: 'Clear', energy: 1, coins: 2, xp: 5 },
  TREE_PALM: { action: 'Chop', energy: 1, coins: 5, xp: 10, drops: { wood: 2 }, respawn: SCALED(60000) },
  TREE_APPLE: { action: 'Harvest', energy: 1, coins: 5, xp: 10, drops: { wood: 1, food: 2 }, respawn: SCALED(60000) },
  ROCK: { action: 'Mine', energy: 1, coins: 8, xp: 15, drops: { stone: 1 }, respawn: SCALED(90000) },
  FLOWER_BUSH: { action: 'Harvest', energy: 1, coins: 3, xp: 8, respawn: SCALED(45000) },
  DRIFTWOOD: { action: 'Clear', energy: 1, coins: 3, xp: 5, drops: { wood: 1 }, respawn: SCALED(80000) },
  TREE_COCONUT: { action: 'Harvest', energy: 1, coins: 6, xp: 12, drops: { food: 2 }, respawn: SCALED(70000) },
  TREE_MANGO: { action: 'Harvest', energy: 1, coins: 8, xp: 14, drops: { food: 3 }, respawn: SCALED(80000) },
  GARDEN_PATCH: { action: 'Harvest', energy: 1, coins: 10, xp: 18, drops: { food: 2 }, respawn: SCALED(50000) },
  CROP_READY: { action: 'Harvest', energy: 1, coins: 10, xp: 20 },
  CROP_WILTED: { action: 'Clear', energy: 1, coins: 0, xp: 2 },
  FISH_SPOT: { action: 'Fish', energy: 1, coins: 12, xp: 15, respawn: SCALED(120000) },
  CRAB: { action: 'Attack', energy: 1, coins: 5, xp: 10 },
  BOAR: { action: 'Shoo', energy: 1, coins: 8, xp: 12 }
};

export const EMOJI_MAP: Record<string, string> = {
  TREE_PALM: '🌴', TREE_APPLE: '🍎', ROCK: '🪨', FLOWER_BUSH: '🌸', DRIFTWOOD: '🪵',
  TREE_COCONUT: '🌴', TREE_MANGO: '🥭', GARDEN_PATCH: '🍍',
  CROP_PLOT: '🟫', CROP_GROWING: '🌱', CROP_READY: '🌽', CROP_WILTED: '🥀',
  FISH_SPOT: '✨', HUT: '🏚️', DOCK: '⛵', WELL: '💧', 
  FLOWER_POT: '🪴', FENCE: '🚧', LANTERN: '🏮', CRAB: '🦀', BOAR: '🐗'
};

export const INITIAL_NEIGHBORS = [
  { id: 'n1', name: 'Marina', avatar: '/marina.jpg', level: 1, favorPoints: 0, wishlist: ['starfish'] },
  { id: 'n2', name: 'IslandIan', avatar: '👨‍🌾', level: 5, favorPoints: 0, wishlist: ['pearl'] },
  { id: 'n3', name: 'CoconutCara', avatar: '🧑‍🌾', level: 7, favorPoints: 0, wishlist: ['conch', 'crab_claw'] }
];

export function generateIsland(): Record<string, TileData> {
  const GRID = 21;
  const TW = 64, TH = 32;
  // Center tile is (10,10); all iso coords are relative to it
  const originX = 0;  // (cx-cy)*(TW/2) = 0 since cx=cy=10
  const originY = 320; // (cx+cy)*(TH/2) = 20*16

  // Iso coords of tile (x,y) relative to center
  const isoX = (x: number, y: number) => (x - y) * (TW / 2) - originX;
  const isoY = (x: number, y: number) => (x + y) * (TH / 2) - originY;

  // Build type map for all 21×21 tiles (for PRNG parity even on outer water)
  const tmap: number[][] = [];
  for (let y = 0; y < GRID; y++) {
    tmap[y] = [];
    for (let x = 0; x < GRID; x++) {
      const sx = isoX(x, y), sy = isoY(x, y);
      const e = (sx * sx) / (255 * 255) + (sy * sy) / (85 * 85);
      tmap[y][x] = e < 1 ? 2 : (e < 1.35 ? 1 : 0);
    }
  }

  // Create tile data only for tiles within the rendered ellipse (e ≤ 1.8)
  const tiles: Record<string, TileData> = {};
  for (let y = 0; y < GRID; y++) {
    for (let x = 0; x < GRID; x++) {
      const sx = isoX(x, y), sy = isoY(x, y);
      const e = (sx * sx) / (255 * 255) + (sy * sy) / (85 * 85);
      if (e > 1.8) continue;
      let type: TileType = 'WATER';
      if (e < 1) type = 'GRASS';
      else if (e < 1.35) type = 'SAND';
      tiles[`${x},${y}`] = { id: `${x},${y}`, x, y, type };
    }
  }

  // Seeded PRNG — identical LCG to the HTML reference for deterministic layout
  let seed = 7;
  const rand = () => { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; };

  // Place natural decorations — same iteration order and probability chain as HTML
  // Water tiles (tmap=0) call rand() 0 times; grass calls 1-2 times; sand calls 1-2 times
  for (let y = 0; y < GRID; y++) {
    for (let x = 0; x < GRID; x++) {
      const tile = tiles[`${x},${y}`];
      const t = tmap[y][x];
      if (t === 2) {           // grass
        if (rand() < 0.1) {
          if (tile && !tile.object) tile.object = 'TREE_PALM';
        } else if (rand() < 0.08) {
          if (tile && !tile.object) tile.object = 'FLOWER_BUSH';
        }
      } else if (t === 1) {   // sand
        if (rand() < 0.08) {
          if (tile && !tile.object) tile.object = 'ROCK';
        } else if (rand() < 0.05) {
          if (tile && !tile.object) tile.object = 'DRIFTWOOD';
        }
      }
      // water (t=0): no rand() calls — matches HTML
    }
  }

  // Additional game-specific objects placed after the main seeded loop
  const emptyGrass = Object.values(tiles).filter(t => t.type === 'GRASS' && !t.object);
  const pick = (arr: TileData[]) => arr.splice(Math.floor(rand() * arr.length), 1)[0];

  for (let i = 0; i < 3 && emptyGrass.length; i++) pick(emptyGrass).object = 'TREE_APPLE';
  for (let i = 0; i < 4 && emptyGrass.length; i++) pick(emptyGrass).object = 'TREE_COCONUT';
  for (let i = 0; i < 3 && emptyGrass.length; i++) pick(emptyGrass).object = 'TREE_MANGO';
  for (let i = 0; i < 2 && emptyGrass.length; i++) pick(emptyGrass).object = 'GARDEN_PATCH';
  for (let i = 0; i < 6 && emptyGrass.length; i++) pick(emptyGrass).object = 'GRASS_PATCH';
  for (let i = 0; i < 1 && emptyGrass.length; i++) pick(emptyGrass).object = 'CROP_PLOT';

  const waterTiles = Object.values(tiles).filter(t => t.type === 'WATER');
  for (let i = 0; i < 4 && waterTiles.length; i++) pick(waterTiles).object = 'FISH_SPOT';

  return tiles;
}

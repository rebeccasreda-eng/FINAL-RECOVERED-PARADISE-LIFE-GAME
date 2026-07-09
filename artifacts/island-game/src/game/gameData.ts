import { QuestDef, TileData, TileType, ObjectType } from './types';

export const QUESTS: QuestDef[] = [
  { id: 'q1', title: 'First Steps', description: 'Clear 3 grass patches', targetType: 'clear_grass', targetCount: 3, rewardCoins: 20, rewardXP: 10, icon: '🌿', unlockLevel: 1 },
  { id: 'q2', title: 'Lumberjack', description: 'Chop 5 palm trees', targetType: 'chop_tree', targetCount: 5, rewardCoins: 50, rewardXP: 20, rewardItem: { type: 'wood', count: 2 }, icon: '🌴', unlockLevel: 1 },
  { id: 'q3', title: 'Green Thumb', description: 'Plant 3 crops', targetType: 'plant_crop', targetCount: 3, rewardCoins: 30, rewardXP: 15, icon: '🌱', unlockLevel: 2 },
  { id: 'q4', title: 'Harvest Time', description: 'Harvest 5 crops', targetType: 'harvest_crop', targetCount: 5, rewardCoins: 80, rewardXP: 40, icon: '🌽', unlockLevel: 2 },
  { id: 'q5', title: 'Miner\'s Luck', description: 'Mine 3 rocks', targetType: 'mine_rock', targetCount: 3, rewardCoins: 60, rewardXP: 30, rewardItem: { type: 'stone', count: 1 }, icon: '🪨', unlockLevel: 3 },
  { id: 'q6', title: 'Gone Fishin\'', description: 'Fish 5 times', targetType: 'fish', targetCount: 5, rewardCoins: 100, rewardXP: 50, icon: '🎣', unlockLevel: 4 },
  { id: 'q7', title: 'Energy Hoarder', description: 'Reach max energy', targetType: 'reach_energy', targetCount: 20, rewardCoins: 40, rewardXP: 20, icon: '⚡', unlockLevel: 5 },
  { id: 'q8', title: 'Island Wealth', description: 'Accumulate 500 coins', targetType: 'accumulate_coins', targetCount: 500, rewardCoins: 150, rewardXP: 50, icon: '🪙', unlockLevel: 6 },
  { id: 'q9', title: 'Builder\'s Dream', description: 'Place a structure', targetType: 'place_structure', targetCount: 1, rewardCoins: 200, rewardXP: 100, icon: '🏚️', unlockLevel: 7 },
  { id: 'q10', title: 'Paradise Found', description: 'Reach level 10', targetType: 'reach_level', targetCount: 10, rewardCoins: 500, rewardXP: 200, icon: '⭐', unlockLevel: 8 },
];

export const OBJECT_CONFIG: Record<string, any> = {
  GRASS_PATCH: { action: 'Clear', energy: 1, coins: 2, xp: 5 },
  TREE_PALM: { action: 'Chop', energy: 2, coins: 5, xp: 10, drops: { wood: 2 }, respawn: 60000 },
  ROCK: { action: 'Mine', energy: 3, coins: 8, xp: 15, drops: { stone: 1 }, respawn: 90000 },
  FLOWER_BUSH: { action: 'Harvest', energy: 1, coins: 3, xp: 8, respawn: 45000 },
  CROP_READY: { action: 'Harvest', energy: 1, coins: 10, xp: 20, drops: { produce: 1 } },
  FISH_SPOT: { action: 'Fish', energy: 2, coins: 8, xp: 15, respawn: 120000 }
};

export const EMOJI_MAP: Record<string, string> = {
  TREE_PALM: '🌴', ROCK: '🪨', FLOWER_BUSH: '🌸', 
  CROP_PLOT: '🟫', CROP_GROWING: '🌱', CROP_READY: '🌽', 
  FISH_SPOT: '✨', HUT: '🏚️', DOCK: '⛵', WELL: '💧', 
  FLOWER_POT: '🪴', FENCE: '🚧', LANTERN: '🏮'
};

export function generateIsland(): Record<string, TileData> {
  const tiles: Record<string, TileData> = {};
  const cx = 7, cy = 5.5;
  for (let x = 0; x < 15; x++) {
    for (let y = 0; y < 12; y++) {
      const dist = Math.sqrt(Math.pow(x - cx, 2) + Math.pow(y - cy, 2) * 1.2);
      let type: TileType = 'WATER';
      if (dist < 4.5) type = 'GRASS';
      else if (dist < 5.8) type = 'SAND';
      tiles[`${x},${y}`] = { id: `${x},${y}`, x, y, type };
    }
  }

  const grassTiles = Object.values(tiles).filter(t => t.type === 'GRASS');
  const waterTiles = Object.values(tiles).filter(t => t.type === 'WATER');
  
  const placeRandom = (count: number, obj: ObjectType) => {
    for (let i = 0; i < count; i++) {
      const empty = grassTiles.filter(t => !t.object);
      if (empty.length > 0) {
        const t = empty[Math.floor(Math.random() * empty.length)];
        t.object = obj;
        if (obj === 'CROP_GROWING') t.placedAt = Date.now();
      }
    }
  };

  placeRandom(8, 'TREE_PALM');
  placeRandom(6, 'GRASS_PATCH');
  placeRandom(3, 'ROCK');
  placeRandom(4, 'FLOWER_BUSH');
  placeRandom(1, 'CROP_PLOT');
  placeRandom(1, 'CROP_GROWING');

  for (let i = 0; i < 3; i++) {
    const empty = waterTiles.filter(t => !t.object);
    if (empty.length > 0) empty[Math.floor(Math.random() * empty.length)].object = 'FISH_SPOT';
  }

  return tiles;
}
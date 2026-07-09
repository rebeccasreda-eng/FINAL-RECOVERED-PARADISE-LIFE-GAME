export type ResourceType = 'coins' | 'wood' | 'stone' | 'produce' | 'food' | 'shells' | 'HUT' | 'DOCK' | 'WELL' | 'FLOWER_POT' | 'FENCE' | 'LANTERN';

export type TileType = 'WATER' | 'GRASS' | 'SAND';

export type ObjectType = 
  | 'GRASS_PATCH' | 'TREE_PALM' | 'TREE_APPLE' | 'ROCK' | 'FLOWER_BUSH' 
  | 'CROP_PLOT' | 'CROP_GROWING' | 'CROP_READY' | 'CROP_WILTED'
  | 'CLEARED_LAND' | 'FISH_SPOT' 
  | 'HUT' | 'DOCK' | 'WELL' | 'FLOWER_POT' | 'FENCE' | 'LANTERN'
  | 'CRAB';

export type WeatherType = 'SUNNY' | 'RAINY' | 'CLOUDY' | 'STORMY';

export interface TileData {
  id: string; 
  x: number; 
  y: number;
  type: TileType;
  object?: ObjectType;
  placedAt?: number;
  cropType?: string;
  crabHp?: number;
}

export interface QuestDef {
  id: string; 
  title: string; 
  description: string;
  targetType: string; 
  targetCount: number;
  rewardCoins: number; 
  rewardXP: number;
  rewardItem?: { type: ResourceType; count: number };
  icon: string; 
  unlockLevel: number;
}

export interface GameState {
  tiles: Record<string, TileData>;
  inventory: Record<ResourceType, number>;
  energy: number;
  maxEnergy: number;
  lastEnergyTick: number;
  xp: number;
  level: number;
  quests: Record<string, { progress: number; completed: boolean }>;
  respawns: { tileId: string; object: ObjectType; respawnAt: number }[];
  weather: WeatherType;
  nextWeatherAt: number;
  lastCrabSpawn: number;
  collections: Record<string, boolean>;
  stats: Record<string, number>;
}

export type GameAction = 
  | { type: 'TICK', now: number }
  | { type: 'INTERACT', tileId: string }
  | { type: 'PLANT', tileId: string, cropType: string }
  | { type: 'BUY', itemType: string, cost: number, count?: number }
  | { type: 'PLACE', tileId: string, object: ObjectType }
  | { type: 'SELL_PRODUCE' }
  | { type: 'CHECK_WEATHER' };

export interface GameContextType {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
  activeTool: 'clear' | 'plant' | 'build';
  setActiveTool: (t: 'clear' | 'plant' | 'build') => void;
  activeBuildItem: ObjectType | null;
  setActiveBuildItem: (o: ObjectType | null) => void;
  shopOpen: boolean;
  setShopOpen: (v: boolean) => void;
  questBanner: string | null;
  floatingTexts: { id: string; tileId: string; text: string }[];
  tutorial: boolean;
  interact: (tileId: string) => void;
  plant: (tileId: string, cropType?: string) => void;
  place: (tileId: string, obj: ObjectType) => void;
}
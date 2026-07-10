export type ResourceType = 'coins' | 'wood' | 'stone' | 'produce' | 'food' | 'shells' | 'HUT' | 'DOCK' | 'WELL' | 'FLOWER_POT' | 'FENCE' | 'LANTERN';

export type TileType = 'WATER' | 'GRASS' | 'SAND';

export type ObjectType = 
  | 'GRASS_PATCH' | 'TREE_PALM' | 'TREE_APPLE' | 'ROCK' | 'FLOWER_BUSH' 
  | 'CROP_PLOT' | 'CROP_GROWING' | 'CROP_READY' | 'CROP_WILTED'
  | 'CLEARED_LAND' | 'FISH_SPOT' 
  | 'HUT' | 'DOCK' | 'WELL' | 'FLOWER_POT' | 'FENCE' | 'LANTERN'
  | 'CRAB' | 'BOAR';

export type WeatherType = 'SUNNY' | 'RAINY' | 'CLOUDY' | 'STORMY' | 'WINDY';

export interface TileData {
  id: string; 
  x: number; 
  y: number;
  type: TileType;
  object?: ObjectType;
  placedAt?: number;
  cropType?: string;
  crabHp?: number;
  unwitherRequestedAt?: number;
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
  prereqs?: string[];
}

export interface Neighbor {
  id: string;
  name: string;
  avatar: string;
  level: number;
  favorPoints: number;
  wishlist: string[];
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
  lastBoarSpawn: number;
  collections: Record<string, boolean>;
  tradedSets: string[];
  stats: Record<string, number>;
  wishlist: string[];
  neighbors: Neighbor[];
  favorBar: number;
  lastNeighborHire: number;
  neighborsHiredToday: number;
  visitingNeighbor: { neighborId: string; tileId: string; expiresAt: number } | null;
  lastNeighborVisit: number;
  pendingResourceRequests: { resource: ResourceType; amount: number; arrivesAt: number }[];
  premiumBoosts: Record<string, number>;
}

export type GameAction = 
  | { type: 'TICK', now: number }
  | { type: 'INTERACT', tileId: string, energyCost?: number }
  | { type: 'PLANT', tileId: string, cropType: string }
  | { type: 'BUY', itemType: string, cost: number, count?: number }
  | { type: 'PLACE', tileId: string, object: ObjectType }
  | { type: 'SELL_PRODUCE' }
  | { type: 'CHECK_WEATHER' }
  | { type: 'BUY_ENERGY', foodCost: number }
  | { type: 'ADD_WISHLIST', itemId: string }
  | { type: 'REMOVE_WISHLIST', itemId: string }
  | { type: 'VISIT_NEIGHBOR', neighborId: string }
  | { type: 'HIRE_NEIGHBOR', neighborId: string }
  | { type: 'TRADE_COLLECTION', setId: string }
  | { type: 'ACCEPT_NEIGHBOR_VISIT' }
  | { type: 'DECLINE_NEIGHBOR_VISIT' }
  | { type: 'GIFT_ITEM', itemId: string, neighborId: string }
  | { type: 'REQUEST_UNWITHER', tileId: string }
  | { type: 'REQUEST_RESOURCE', resource: ResourceType, amount: number }
  | { type: 'BUY_PREMIUM', itemId: string, shellCost: number };

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
  neighborVisitPrompt: boolean;
  setNeighborVisitPrompt: (v: boolean) => void;
}

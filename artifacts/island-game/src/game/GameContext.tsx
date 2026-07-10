import React, { createContext, useContext, useEffect, useReducer, useRef, useState } from 'react';
import { GameState, GameAction, GameContextType, ResourceType, ObjectType } from './types';
import { generateIsland, QUESTS, OBJECT_CONFIG, SCALED, WEATHER_TYPES, CROP_TYPES, INITIAL_NEIGHBORS, COLLECTIONS } from './gameData';
import { useToast } from '@/hooks/use-toast';

export const GameContext = createContext<(GameContextType & { plantingTile: string | null; setPlantingTile: (id: string | null) => void; }) | null>(null);

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) throw new Error("useGame must be inside GameProvider");
  return context;
};

const getInitialState = (): GameState => ({
  tiles: generateIsland(),
  inventory: { coins: 50, wood: 0, stone: 0, produce: 0, food: 0, shells: 0, HUT: 0, DOCK: 0, WELL: 0, FLOWER_POT: 0, FENCE: 0, LANTERN: 0 },
  energy: 20,
  maxEnergy: 20,
  lastEnergyTick: Date.now(),
  xp: 0,
  level: 1,
  quests: {},
  respawns: [],
  weather: 'SUNNY',
  nextWeatherAt: Date.now() + SCALED(120000),
  lastCrabSpawn: Date.now(),
  collections: {},
  stats: { crabsKilled: 0 },
  wishlist: [],
  neighbors: INITIAL_NEIGHBORS,
  favorBar: 0,
  lastNeighborHire: 0,
  neighborsHiredToday: 0
});

function checkQuestCompletions(state: GameState): GameState {
  let changed = false;
  const nextQuests = { ...state.quests };
  
  for (const q of QUESTS) {
    if (state.level < q.unlockLevel) continue;
    const p = nextQuests[q.id] || { progress: 0, completed: false };
    if (p.completed) continue;

    let currentProgress = p.progress;
    if (q.targetType === 'reach_level') currentProgress = state.level;
    if (q.targetType === 'accumulate_coins') currentProgress = state.inventory.coins;
    if (q.targetType === 'reach_energy') currentProgress = state.energy;
    if (q.targetType === 'kill_crab') currentProgress = state.stats.crabsKilled || 0;

    if (currentProgress >= q.targetCount) {
      nextQuests[q.id] = { ...p, progress: currentProgress, completed: true };
      changed = true;
    } else if (currentProgress !== p.progress) {
      nextQuests[q.id] = { ...p, progress: currentProgress };
      changed = true;
    }
  }

  if (changed) {
    const nextState = { ...state, quests: nextQuests };
    let rewardCoins = 0;
    let rewardXP = 0;
    const rewardItems: any = {};
    
    for (const q of QUESTS) {
      const oldP = state.quests[q.id];
      const newP = nextQuests[q.id];
      if (!oldP?.completed && newP?.completed) {
        rewardCoins += q.rewardCoins;
        rewardXP += q.rewardXP;
        if (q.rewardItem) {
          rewardItems[q.rewardItem.type] = (rewardItems[q.rewardItem.type] || 0) + q.rewardItem.count;
        }
      }
    }
    
    if (rewardCoins > 0 || rewardXP > 0 || Object.keys(rewardItems).length > 0) {
       const ns = { ...nextState, inventory: { ...nextState.inventory } };
       ns.inventory.coins += rewardCoins;
       ns.xp += rewardXP;
       for (const [k, v] of Object.entries(rewardItems)) {
         ns.inventory[k as ResourceType] = (ns.inventory[k as ResourceType] || 0) + (v as number);
       }
       return ns;
    }
    return nextState;
  }
  return state;
}

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'TICK': {
      const { now } = action;
      let nextState = state;
      let changed = false;

      // Energy 5 min interval
      if (now - state.lastEnergyTick >= SCALED(300000)) {
        const ticks = Math.floor((now - state.lastEnergyTick) / SCALED(300000));
        if (state.energy < state.maxEnergy) {
          nextState = { ...nextState, energy: Math.min(state.maxEnergy, state.energy + ticks), lastEnergyTick: state.lastEnergyTick + ticks * SCALED(300000) };
          changed = true;
        } else {
          nextState = { ...nextState, lastEnergyTick: state.lastEnergyTick + ticks * SCALED(300000) };
          changed = true;
        }
      }

      let tilesChanged = false;
      let nextTiles = nextState.tiles;

      // Weather Change
      if (now >= nextState.nextWeatherAt) {
        const nextWeather = WEATHER_TYPES[Math.floor(Math.random() * WEATHER_TYPES.length)];
        nextState = { ...nextState, weather: nextWeather, nextWeatherAt: now + SCALED(120000) };
        changed = true;
      }

      // Crab Spawning
      let crabSpawnInterval = SCALED(180000);
      if (nextState.weather === 'STORMY') crabSpawnInterval = SCALED(90000);
      
      if (now - nextState.lastCrabSpawn >= crabSpawnInterval) {
        const crabs = Object.values(nextTiles).filter(t => t.object === 'CRAB').length;
        if (crabs < 2) {
          const emptyGrass = Object.values(nextTiles).filter(t => t.type === 'GRASS' && !t.object);
          if (emptyGrass.length > 0) {
            const spawnTile = emptyGrass[Math.floor(Math.random() * emptyGrass.length)];
            if (!tilesChanged) { nextTiles = { ...nextState.tiles }; tilesChanged = true; }
            nextTiles[spawnTile.id] = { ...spawnTile, object: 'CRAB', crabHp: 3 };
          }
        }
        nextState = { ...nextState, lastCrabSpawn: now };
        changed = true;
      }

      // Crops Wilting & Growing
      for (const [id, tile] of Object.entries(nextState.tiles)) {
        if ((tile.object === 'CROP_GROWING' || tile.object === 'CROP_READY') && tile.placedAt && tile.cropType) {
          const cropConfig = CROP_TYPES[tile.cropType];
          if (cropConfig) {
            const timeElapsed = now - tile.placedAt;
            const growTime = nextState.weather === 'RAINY' ? cropConfig.growTime * 0.5 : cropConfig.growTime;
            
            if (timeElapsed >= growTime + cropConfig.wiltTime) {
              if (!tilesChanged) { nextTiles = { ...nextState.tiles }; tilesChanged = true; }
              nextTiles[id] = { ...tile, object: 'CROP_WILTED' };
            } else if (timeElapsed >= growTime) {
              if (tile.object === 'CROP_GROWING') {
                if (!tilesChanged) { nextTiles = { ...nextState.tiles }; tilesChanged = true; }
                nextTiles[id] = { ...tile, object: 'CROP_READY' };
              }
            }
          }
        }
      }

      if (tilesChanged) {
        nextState = { ...nextState, tiles: nextTiles };
        changed = true;
      }

      // Respawns
      let respawnsChanged = false;
      const nextRespawns = nextState.respawns.filter(r => {
        if (now >= r.respawnAt) {
          if (!tilesChanged) { nextTiles = { ...nextState.tiles }; tilesChanged = true; }
          nextTiles[r.tileId] = { ...nextTiles[r.tileId], object: r.object };
          respawnsChanged = true;
          return false;
        }
        return true;
      });
      
      if (respawnsChanged) {
        nextState = { ...nextState, tiles: nextTiles, respawns: nextRespawns };
        changed = true;
      }

      return changed ? checkQuestCompletions(nextState) : state;
    }

    case 'INTERACT': {
      const { tileId, energyCost = 1 } = action;
      const tile = state.tiles[tileId];
      if (!tile || !tile.object) return state;
      const obj = tile.object;
      const config = OBJECT_CONFIG[obj];
      if (!config) return state;

      const nextState = { ...state, tiles: { ...state.tiles }, inventory: { ...state.inventory }, quests: { ...state.quests }, respawns: [...state.respawns], collections: { ...state.collections }, stats: { ...state.stats } };
      
      nextState.energy -= energyCost;
      
      let coinsDrop = config.coins || 0;
      if (obj === 'FISH_SPOT' && nextState.weather === 'STORMY') {
        coinsDrop *= 2;
      }
      nextState.inventory.coins += coinsDrop;
      
      if (config.drops) {
        for (const [k, v] of Object.entries(config.drops)) {
          let dropAmount = v as number;
          if (k === 'food' && obj === 'TREE_APPLE' && nextState.weather === 'CLOUDY') {
             dropAmount += 1;
          }
          nextState.inventory[k as ResourceType] = (nextState.inventory[k as ResourceType] || 0) + dropAmount;
        }
      }

      if (obj === 'GRASS_PATCH' && nextState.weather === 'WINDY') {
        if (Math.random() < 0.25) {
          nextState.energy = Math.min(nextState.maxEnergy, nextState.energy + 1);
        }
      }

      const track = (type: string) => {
        for (const q of QUESTS) {
          if (q.targetType === type && nextState.level >= q.unlockLevel) {
            const p = nextState.quests[q.id] || { progress: 0, completed: false };
            if (!p.completed) nextState.quests[q.id] = { ...p, progress: p.progress + 1 };
          }
        }
      };

      // Collection drops
      const rand = Math.random();
      if (rand < 0.05) { nextState.collections['starfish'] = true; track('collect_item'); }
      else if (rand < 0.1) { nextState.collections['conch'] = true; track('collect_item'); }
      
      if (obj === 'FISH_SPOT' && Math.random() < 0.3) {
         nextState.collections['pearl'] = true; track('collect_item');
      }

      if (obj === 'CRAB') {
        const hp = (tile.crabHp || 3) - 1;
        if (hp > 0) {
          nextState.tiles[tileId] = { ...tile, crabHp: hp };
          return nextState; // Don't do XP or respawn yet
        } else {
          nextState.tiles[tileId] = { ...tile, object: undefined, crabHp: undefined };
          nextState.stats.crabsKilled = (nextState.stats.crabsKilled || 0) + 1;
          nextState.inventory.food = (nextState.inventory.food || 0) + 1;
          nextState.collections['crab_claw'] = true; track('collect_item');
          track('kill_crab');
        }
      } else if (obj === 'CROP_READY') {
        nextState.tiles[tileId] = { ...tile, object: 'CLEARED_LAND' };
        if (tile.cropType && CROP_TYPES[tile.cropType]) {
          nextState.inventory.produce += CROP_TYPES[tile.cropType].yield;
        } else {
          nextState.inventory.produce += 1;
        }
      } else if (obj === 'CROP_WILTED') {
        nextState.tiles[tileId] = { ...tile, object: 'CLEARED_LAND', cropType: undefined };
      } else if (obj === 'GRASS_PATCH') {
        nextState.tiles[tileId] = { ...tile, object: 'CLEARED_LAND' };
        if (Math.random() < 0.3) nextState.inventory.wood += 1;
      } else {
        nextState.tiles[tileId] = { ...tile, object: undefined };
      }

      if (config.respawn) {
        nextState.respawns.push({ tileId, object: obj, respawnAt: Date.now() + config.respawn });
      }

      nextState.xp += config.xp || 0;
      const nextLevelXp = Math.floor(100 * Math.pow(nextState.level, 1.5));
      if (nextState.xp >= nextLevelXp) {
        nextState.level += 1;
        nextState.inventory.shells = (nextState.inventory.shells || 0) + 1;
        nextState.maxEnergy = 20 + Math.floor((nextState.level - 1) / 5) * 5;
        nextState.energy = nextState.maxEnergy;
      }

      if (obj === 'GRASS_PATCH') track('clear_grass');
      if (obj === 'TREE_PALM' || obj === 'TREE_APPLE') track('chop_tree');
      if (obj === 'ROCK') track('mine_rock');
      if (obj === 'CROP_READY') track('harvest_crop');
      if (obj === 'FISH_SPOT') track('fish');

      return checkQuestCompletions(nextState);
    }

    case 'PLANT': {
      const { tileId, cropType } = action;
      const cropConfig = CROP_TYPES[cropType];
      if (!cropConfig || state.energy < 1 || state.inventory.coins < cropConfig.cost) return state;
      
      const tile = state.tiles[tileId];
      if (!tile || (tile.object !== 'CLEARED_LAND' && tile.object !== 'CROP_PLOT')) return state;
      
      const nextState = { ...state, tiles: { ...state.tiles }, inventory: { ...state.inventory }, quests: { ...state.quests } };
      nextState.energy -= 1;
      nextState.inventory.coins -= cropConfig.cost;
      nextState.tiles[tileId] = { ...tile, object: 'CROP_GROWING', placedAt: Date.now(), cropType };
      
      for (const q of QUESTS) {
        if (q.targetType === 'plant_crop' && nextState.level >= q.unlockLevel) {
          const p = nextState.quests[q.id] || { progress: 0, completed: false };
          if (!p.completed) nextState.quests[q.id] = { ...p, progress: p.progress + 1 };
        }
      }
      return checkQuestCompletions(nextState);
    }

    case 'BUY': {
      const { itemType, cost, count = 1 } = action;
      if (state.inventory.coins < cost) return state;
      const nextState = { ...state, inventory: { ...state.inventory } };
      nextState.inventory.coins -= cost;
      nextState.inventory[itemType as ResourceType] = (nextState.inventory[itemType as ResourceType] || 0) + count;
      return checkQuestCompletions(nextState);
    }

    case 'PLACE': {
      const { tileId, object } = action;
      const tile = state.tiles[tileId];
      if (!tile || tile.object !== 'CLEARED_LAND') return state;
      if ((state.inventory[object as ResourceType] || 0) <= 0) return state;

      const nextState = { ...state, tiles: { ...state.tiles }, inventory: { ...state.inventory }, quests: { ...state.quests } };
      nextState.inventory[object as ResourceType] -= 1;
      nextState.tiles[tileId] = { ...tile, object };
      
      for (const q of QUESTS) {
        if (q.targetType === 'place_structure' && nextState.level >= q.unlockLevel) {
          const p = nextState.quests[q.id] || { progress: 0, completed: false };
          if (!p.completed) nextState.quests[q.id] = { ...p, progress: p.progress + 1 };
        }
      }
      return checkQuestCompletions(nextState);
    }

    case 'SELL_PRODUCE': {
      if (state.inventory.produce <= 0) return state;
      const nextState = { ...state, inventory: { ...state.inventory } };
      nextState.inventory.coins += nextState.inventory.produce * 5;
      nextState.inventory.produce = 0;
      return checkQuestCompletions(nextState);
    }
    
    case 'CHECK_WEATHER': {
      const nextState = { ...state, quests: { ...state.quests }, stats: { ...state.stats, weatherChecked: (state.stats.weatherChecked || 0) + 1 } };
      for (const q of QUESTS) {
        if (q.targetType === 'check_weather' && nextState.level >= q.unlockLevel) {
          const p = nextState.quests[q.id] || { progress: 0, completed: false };
          if (!p.completed) nextState.quests[q.id] = { ...p, progress: p.progress + 1 };
        }
      }
      return checkQuestCompletions(nextState);
    }

    case 'BUY_ENERGY': {
      if (state.inventory.food < action.foodCost || state.energy >= state.maxEnergy) return state;
      const nextState = { ...state, inventory: { ...state.inventory } };
      nextState.inventory.food -= action.foodCost;
      nextState.energy = Math.min(state.maxEnergy, state.energy + 5);
      return checkQuestCompletions(nextState);
    }

    case 'ADD_WISHLIST': {
      if (state.wishlist.includes(action.itemId) || state.wishlist.length >= 5) return state;
      return { ...state, wishlist: [...state.wishlist, action.itemId] };
    }

    case 'REMOVE_WISHLIST': {
      return { ...state, wishlist: state.wishlist.filter(id => id !== action.itemId) };
    }

    case 'VISIT_NEIGHBOR': {
      const neighbor = state.neighbors.find(n => n.id === action.neighborId);
      if (!neighbor) return state;
      
      const nextState = { 
        ...state, 
        inventory: { ...state.inventory }, 
        neighbors: state.neighbors.map(n => n.id === action.neighborId ? { ...n, favorPoints: n.favorPoints + 10 } : n)
      };
      
      nextState.inventory.coins += 5;
      nextState.xp += 5;
      nextState.favorBar = Math.min(100, nextState.favorBar + 10);
      
      const randColl = COLLECTIONS[Math.floor(Math.random() * COLLECTIONS.length)];
      if (randColl) {
         nextState.collections = { ...state.collections, [randColl.id]: true };
      }
      
      return checkQuestCompletions(nextState);
    }

    case 'HIRE_NEIGHBOR': {
      const neighbor = state.neighbors.find(n => n.id === action.neighborId);
      if (!neighbor || state.inventory.coins < 50) return state;
      
      const now = Date.now();
      const isNewDay = now - state.lastNeighborHire > 86400000;
      const hiredToday = isNewDay ? 0 : state.neighborsHiredToday;
      
      if (hiredToday >= 2) return state;
      
      const nextState = { ...state, inventory: { ...state.inventory } };
      nextState.inventory.coins -= 50;
      nextState.energy = Math.min(state.maxEnergy, state.energy + 3);
      nextState.lastNeighborHire = now;
      nextState.neighborsHiredToday = hiredToday + 1;
      
      return checkQuestCompletions(nextState);
    }

    default:
      return state;
  }
}

export const GameProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const { toast } = useToast();
  
  const [state, dispatch] = useReducer(gameReducer, undefined, () => {
    const saved = localStorage.getItem('island-game-state-v4');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.tiles) {
          const defaults = getInitialState();
          return {
            ...defaults,
            ...parsed,
            inventory: { ...defaults.inventory, ...(parsed.inventory || {}) },
            quests: parsed.quests || {},
            respawns: Array.isArray(parsed.respawns) ? parsed.respawns : [],
            collections: parsed.collections || {},
            stats: parsed.stats || { crabsKilled: 0 },
            energy: typeof parsed.energy === 'number' ? parsed.energy : defaults.energy,
            maxEnergy: typeof parsed.maxEnergy === 'number' ? parsed.maxEnergy : defaults.maxEnergy,
            lastEnergyTick: typeof parsed.lastEnergyTick === 'number' ? parsed.lastEnergyTick : Date.now(),
            xp: typeof parsed.xp === 'number' ? parsed.xp : 0,
            level: typeof parsed.level === 'number' ? parsed.level : 1,
            weather: parsed.weather || defaults.weather,
            nextWeatherAt: parsed.nextWeatherAt || defaults.nextWeatherAt,
            lastCrabSpawn: parsed.lastCrabSpawn || defaults.lastCrabSpawn,
            wishlist: parsed.wishlist || defaults.wishlist,
            neighbors: parsed.neighbors || defaults.neighbors,
            favorBar: typeof parsed.favorBar === 'number' ? parsed.favorBar : defaults.favorBar,
            lastNeighborHire: typeof parsed.lastNeighborHire === 'number' ? parsed.lastNeighborHire : defaults.lastNeighborHire,
            neighborsHiredToday: typeof parsed.neighborsHiredToday === 'number' ? parsed.neighborsHiredToday : defaults.neighborsHiredToday,
          };
        }
      } catch (e) {}
    }
    return getInitialState();
  });

  const [tutorial, setTutorial] = useState(() => !localStorage.getItem('island-game-action-v2'));
  const [activeTool, setActiveTool] = useState<'clear' | 'plant' | 'build'>('clear');
  const [activeBuildItem, setActiveBuildItem] = useState<ObjectType | null>(null);
  const [shopOpen, setShopOpen] = useState(false);
  const [plantingTile, setPlantingTile] = useState<string | null>(null);
  
  const [floatingTexts, setFloatingTexts] = useState<{id: string, tileId: string, text: string}[]>([]);
  const [questBanner, setQuestBanner] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('island-game-state-v4', JSON.stringify(state));
  }, [state]);

  useEffect(() => {
    const timer = setInterval(() => dispatch({ type: 'TICK', now: Date.now() }), 1000);
    return () => clearInterval(timer);
  }, []);

  const prevQuests = useRef(state.quests);
  useEffect(() => {
    Object.keys(state.quests).forEach(qId => {
      if (state.quests[qId].completed && !prevQuests.current[qId]?.completed) {
        const q = QUESTS.find(x => x.id === qId);
        setQuestBanner(`GORGEOUS! ${q?.title} Complete!`);
        setTimeout(() => setQuestBanner(null), 3000);
      }
    });
    prevQuests.current = state.quests;
  }, [state.quests]);

  const prevLevel = useRef(state.level);
  useEffect(() => {
    if (state.level > prevLevel.current) {
      setQuestBanner(`LEVEL ${state.level}! AMAZING!`);
      setTimeout(() => setQuestBanner(null), 3000);
      toast({ title: "Level Up! +1 🐚", description: `You reached level ${state.level}! Earned a shell.` });
    }
    prevLevel.current = state.level;
  }, [state.level, toast]);

  const dismissTutorial = () => {
    if (tutorial) {
      setTutorial(false);
      localStorage.setItem('island-game-action-v2', '1');
    }
  };

  const interact = (tileId: string) => {
    dismissTutorial();
    const tile = state.tiles[tileId];
    if (!tile || !tile.object) return;
    const config = OBJECT_CONFIG[tile.object];
    if (!config) return;

    let energyCost = config.energy;

    const [tx, ty] = tileId.split(',').map(Number);
    let inDangerZone = false;
    for (const [id, t] of Object.entries(state.tiles) as [string, import('./types').TileData][]) {
      if (t.object === 'CRAB' && t.crabHp && t.crabHp > 0) {
        const [cx, cy] = id.split(',').map(Number);
        if (Math.abs(tx - cx) <= 1 && Math.abs(ty - cy) <= 1 && id !== tileId) {
          inDangerZone = true;
          break;
        }
      }
    }
    
    if (inDangerZone) {
      energyCost += 1;
    }

    if (state.energy < energyCost) {
       toast({ title: 'Out of energy! ⚡', description: 'Wait for energy to recharge.', variant: 'destructive' });
       return;
    }

    if (inDangerZone) {
       toast({ title: 'Careful! 🦀', description: "You're in an animal's territory. -2 energy!", variant: 'destructive' });
    }

    dispatch({ type: 'INTERACT', tileId, energyCost });
    
    if (tile.object === 'CRAB' && (tile.crabHp || 3) > 1) {
       const id = Math.random().toString();
       setFloatingTexts(prev => [...prev, { id, tileId, text: `-${energyCost}⚡` }]);
       setTimeout(() => setFloatingTexts(prev => prev.filter(t => t.id !== id)), 1500);
       return;
    }

    let coinDrop = config.coins || 0;
    if (tile.object === 'FISH_SPOT' && state.weather === 'STORMY') coinDrop *= 2;

    const id = Math.random().toString();
    setFloatingTexts(prev => [...prev, { id, tileId, text: `+${coinDrop}🪙 +${config.xp || 0}⭐` }]);
    setTimeout(() => {
      setFloatingTexts(prev => prev.filter(t => t.id !== id));
    }, 1500);
  };

  const plant = (tileId: string, cropType?: string) => {
    dismissTutorial();
    const tile = state.tiles[tileId];
    if (!tile || (tile.object !== 'CLEARED_LAND' && tile.object !== 'CROP_PLOT')) return;
    
    if (!cropType) {
      setPlantingTile(tileId);
      return;
    }

    const cropConfig = CROP_TYPES[cropType];
    if (!cropConfig) return;

    if (state.energy < 1) {
      toast({ title: 'Out of energy! ⚡', variant: 'destructive' });
      return;
    }
    if (state.inventory.coins < cropConfig.cost) {
      toast({ title: 'Not enough coins! 🪙', description: 'Sell produce to get more.', variant: 'destructive' });
      return;
    }
    
    dispatch({ type: 'PLANT', tileId, cropType });
    
    const id = Math.random().toString();
    setFloatingTexts(prev => [...prev, { id, tileId, text: `-${cropConfig.cost}🪙 -1⚡` }]);
    setTimeout(() => {
      setFloatingTexts(prev => prev.filter(t => t.id !== id));
    }, 1500);
  };

  const place = (tileId: string, obj: ObjectType) => {
    dismissTutorial();
    const tile = state.tiles[tileId];
    if (!tile || tile.object !== 'CLEARED_LAND') return;
    if ((state.inventory[obj as ResourceType] || 0) <= 0) {
      toast({ title: 'None left!', description: 'Buy more in the Shop.', variant: 'destructive' });
      return;
    }
    dispatch({ type: 'PLACE', tileId, object: obj });
    setActiveBuildItem(null); 
  };

  return (
    <GameContext.Provider value={{
      state, dispatch,
      activeTool, setActiveTool,
      activeBuildItem, setActiveBuildItem,
      shopOpen, setShopOpen,
      plantingTile, setPlantingTile,
      questBanner, floatingTexts, tutorial,
      interact, plant, place
    }}>
      {children}
    </GameContext.Provider>
  );
};
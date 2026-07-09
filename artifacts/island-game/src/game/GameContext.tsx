import React, { createContext, useContext, useEffect, useReducer, useRef, useState } from 'react';
import { GameState, GameAction, GameContextType, ResourceType, ObjectType } from './types';
import { generateIsland, QUESTS, OBJECT_CONFIG } from './gameData';
import { useToast } from '@/hooks/use-toast';

export const GameContext = createContext<GameContextType | null>(null);

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) throw new Error("useGame must be inside GameProvider");
  return context;
};

const getInitialState = (): GameState => ({
  tiles: generateIsland(),
  inventory: { coins: 50, wood: 0, stone: 0, seeds: 10, produce: 0, HUT: 0, DOCK: 0, WELL: 0, FLOWER_POT: 0, FENCE: 0, LANTERN: 0 },
  energy: 20,
  maxEnergy: 20,
  lastEnergyTick: Date.now(),
  xp: 0,
  level: 1,
  quests: {},
  respawns: []
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

      // Energy
      if (now - state.lastEnergyTick >= 60000) {
        const ticks = Math.floor((now - state.lastEnergyTick) / 60000);
        if (state.energy < state.maxEnergy) {
          nextState = { ...nextState, energy: Math.min(state.maxEnergy, state.energy + ticks), lastEnergyTick: state.lastEnergyTick + ticks * 60000 };
          changed = true;
        } else {
          nextState = { ...nextState, lastEnergyTick: state.lastEnergyTick + ticks * 60000 };
          changed = true;
        }
      }

      // Crops
      let tilesChanged = false;
      let nextTiles = nextState.tiles;
      for (const [id, tile] of Object.entries(nextState.tiles)) {
        if (tile.object === 'CROP_GROWING' && tile.placedAt && now - tile.placedAt >= 30000) {
          if (!tilesChanged) { nextTiles = { ...nextState.tiles }; tilesChanged = true; }
          nextTiles[id] = { ...tile, object: 'CROP_READY' };
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
      const { tileId } = action;
      const tile = state.tiles[tileId];
      if (!tile || !tile.object) return state;
      const obj = tile.object;
      const config = OBJECT_CONFIG[obj];
      if (!config) return state;

      if (state.energy < config.energy) return state;

      const nextState = { ...state, tiles: { ...state.tiles }, inventory: { ...state.inventory }, quests: { ...state.quests }, respawns: [...state.respawns] };
      
      nextState.energy -= config.energy;
      nextState.inventory.coins += config.coins;
      
      if (config.drops) {
        for (const [k, v] of Object.entries(config.drops)) {
          nextState.inventory[k as ResourceType] = (nextState.inventory[k as ResourceType] || 0) + (v as number);
        }
      }

      if (obj === 'CROP_READY' || obj === 'GRASS_PATCH') {
        nextState.tiles[tileId] = { ...tile, object: 'CLEARED_LAND' };
        if (obj === 'GRASS_PATCH' && Math.random() < 0.3) nextState.inventory.wood += 1;
      } else {
        nextState.tiles[tileId] = { ...tile, object: undefined };
      }

      if (config.respawn) {
        nextState.respawns.push({ tileId, object: obj, respawnAt: Date.now() + config.respawn });
      }

      nextState.xp += config.xp;
      const nextLevelXp = Math.floor(100 * Math.pow(nextState.level, 1.5));
      if (nextState.xp >= nextLevelXp) {
        nextState.level += 1;
        nextState.maxEnergy = 20 + Math.floor((nextState.level - 1) / 5) * 5;
        nextState.energy = nextState.maxEnergy;
      }

      const track = (type: string) => {
        for (const q of QUESTS) {
          if (q.targetType === type && nextState.level >= q.unlockLevel) {
            const p = nextState.quests[q.id] || { progress: 0, completed: false };
            if (!p.completed) nextState.quests[q.id] = { ...p, progress: p.progress + 1 };
          }
        }
      };

      if (obj === 'GRASS_PATCH') track('clear_grass');
      if (obj === 'TREE_PALM') track('chop_tree');
      if (obj === 'ROCK') track('mine_rock');
      if (obj === 'CROP_READY') track('harvest_crop');
      if (obj === 'FISH_SPOT') track('fish');

      return checkQuestCompletions(nextState);
    }

    case 'PLANT': {
      const { tileId } = action;
      if (state.energy < 1 || state.inventory.seeds < 1) return state;
      const tile = state.tiles[tileId];
      if (!tile || (tile.object !== 'CLEARED_LAND' && tile.object !== 'CROP_PLOT')) return state;
      
      const nextState = { ...state, tiles: { ...state.tiles }, inventory: { ...state.inventory }, quests: { ...state.quests } };
      nextState.energy -= 1;
      nextState.inventory.seeds -= 1;
      nextState.tiles[tileId] = { ...tile, object: 'CROP_GROWING', placedAt: Date.now() };
      
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
      if (itemType === 'seeds') {
        nextState.inventory.seeds += count;
      } else {
        nextState.inventory[itemType as ResourceType] = (nextState.inventory[itemType as ResourceType] || 0) + count;
      }
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
    
    default:
      return state;
  }
}

export const GameProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const { toast } = useToast();
  
  const [state, dispatch] = useReducer(gameReducer, undefined, () => {
    const saved = localStorage.getItem('island-game-state');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.tiles) {
          // Merge with defaults so missing fields from older saves don't crash
          const defaults = getInitialState();
          return {
            ...defaults,
            ...parsed,
            inventory: { ...defaults.inventory, ...(parsed.inventory || {}) },
            quests: parsed.quests || {},
            respawns: Array.isArray(parsed.respawns) ? parsed.respawns : [],
            energy: typeof parsed.energy === 'number' ? parsed.energy : defaults.energy,
            maxEnergy: typeof parsed.maxEnergy === 'number' ? parsed.maxEnergy : defaults.maxEnergy,
            lastEnergyTick: typeof parsed.lastEnergyTick === 'number' ? parsed.lastEnergyTick : Date.now(),
            xp: typeof parsed.xp === 'number' ? parsed.xp : 0,
            level: typeof parsed.level === 'number' ? parsed.level : 1,
          };
        }
      } catch (e) {}
    }
    return getInitialState();
  });

  const [tutorial, setTutorial] = useState(() => !localStorage.getItem('island-game-action'));
  const [activeTool, setActiveTool] = useState<'clear' | 'plant' | 'build'>('clear');
  const [activeBuildItem, setActiveBuildItem] = useState<ObjectType | null>(null);
  const [shopOpen, setShopOpen] = useState(false);
  
  const [floatingTexts, setFloatingTexts] = useState<{id: string, tileId: string, text: string}[]>([]);
  const [questBanner, setQuestBanner] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('island-game-state', JSON.stringify(state));
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
    }
    prevLevel.current = state.level;
  }, [state.level]);

  const dismissTutorial = () => {
    if (tutorial) {
      setTutorial(false);
      localStorage.setItem('island-game-action', '1');
    }
  };

  const interact = (tileId: string) => {
    dismissTutorial();
    const tile = state.tiles[tileId];
    if (!tile || !tile.object) return;
    const config = OBJECT_CONFIG[tile.object];
    if (!config) return;
    if (state.energy < config.energy) {
       toast({ title: 'Out of energy! ⚡', description: 'Wait for energy to recharge.', variant: 'destructive' });
       return;
    }
    dispatch({ type: 'INTERACT', tileId });
    
    const id = Math.random().toString();
    setFloatingTexts(prev => [...prev, { id, tileId, text: `+${config.coins}🪙 +${config.xp}⭐` }]);
    setTimeout(() => {
      setFloatingTexts(prev => prev.filter(t => t.id !== id));
    }, 1500);
  };

  const plant = (tileId: string) => {
    dismissTutorial();
    if (state.energy < 1) {
      toast({ title: 'Out of energy! ⚡', variant: 'destructive' });
      return;
    }
    if (state.inventory.seeds < 1) {
      toast({ title: 'No seeds! 🌱', description: 'Buy seeds in the Shop.', variant: 'destructive' });
      return;
    }
    const tile = state.tiles[tileId];
    if (!tile || (tile.object !== 'CLEARED_LAND' && tile.object !== 'CROP_PLOT')) return;
    dispatch({ type: 'PLANT', tileId });
    
    const id = Math.random().toString();
    setFloatingTexts(prev => [...prev, { id, tileId, text: `-1🌱 -1⚡` }]);
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
      questBanner, floatingTexts, tutorial,
      interact, plant, place
    }}>
      {children}
    </GameContext.Provider>
  );
};
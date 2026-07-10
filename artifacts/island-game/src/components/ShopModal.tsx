import React, { useState } from 'react';
import { useGame } from '../game/GameContext';
import { ResourceType } from '../game/types';
import { EMOJI_MAP, CROP_TYPES, PREMIUM_ITEMS } from '../game/gameData';
import { useToast } from '@/hooks/use-toast';

/* ── Market catalogue ─────────────────────────────────────────────────────── */
type MarketItem = {
  id: string;
  name: string;
  emoji: string;
  coins: number;
  food?: number;
  xp: number;
  harvestTime: string;
  qty: number;            // display badge count
  unlockLevel?: number;
  unlockShells?: number;
};

const MARKET_CROPS: MarketItem[] = [
  { id: 'PUMPKIN',     name: 'Pumpkin',    emoji: '🎃', coins: 15,  xp: 1, harvestTime: '5 Mins',  qty: 12 },
  { id: 'CABBAGE',     name: 'Cabbage',    emoji: '🥬', coins: 32,  xp: 2, harvestTime: '15 Mins', qty: 28 },
  { id: 'PINEAPPLE',   name: 'Pineapple',  emoji: '🍍', coins: 70,  food: 1, xp: 3, harvestTime: '1 Hr',   qty: 55 },
  { id: 'SUNFLOWER',   name: 'Sunflower',  emoji: '🌻', coins: 105, food: 3, xp: 4, harvestTime: '2 Hrs',  qty: 78 },
  { id: 'RED_PEPPER',  name: 'Red Pepper', emoji: '🌶️', coins: 145, food: 2, xp: 5, harvestTime: '4 Hrs',  qty: 96 },
  { id: 'BLUEBERRY',   name: 'Blueberry',  emoji: '🫐', coins: 246, food: 2, xp: 6, harvestTime: '8 Hrs',  qty: 155 },
  { id: 'CARROT',      name: 'Carrot',     emoji: '🥕', coins: 320, xp: 7, harvestTime: '12 Hrs', qty: 0,
    unlockLevel: 7, unlockShells: 1 },
  { id: 'CORN',        name: 'Wheat',      emoji: '🌾', coins: 420, xp: 8, harvestTime: '16 Hrs', qty: 0,
    unlockLevel: 11, unlockShells: 5 },
];

type MarketStructure = {
  id: ResourceType;
  name: string;
  emoji: string;
  coins: number;
  desc: string;
  wood?: number;
  stone?: number;
};

const MARKET_BUILDINGS: MarketStructure[] = [
  { id: 'HUT',        name: 'Wooden Hut',   emoji: '🏚️', coins: 200, desc: 'A cozy home base.',     wood: 10 },
  { id: 'DOCK',       name: 'Fishing Dock', emoji: '⛵',  coins: 300, desc: 'For catching fish.',     wood: 15 },
  { id: 'WELL',       name: 'Water Well',   emoji: '🪣',  coins: 150, desc: 'Fresh water source.',   stone: 5 },
  { id: 'FLOWER_POT', name: 'Flower Pot',   emoji: '🪴',  coins: 50,  desc: 'Decorative planter.'   },
  { id: 'FENCE',      name: 'Wood Fence',   emoji: '🪵',  coins: 20,  desc: 'Keeps crabs out!',      wood: 3 },
  { id: 'LANTERN',    name: 'Lantern',      emoji: '🏮',  coins: 80,  desc: 'Lights the night.',     stone: 2 },
];

type TabId = 'SPECIAL' | 'CROPS' | 'ANIMALS' | 'TERRAIN' | 'TREES' | 'DECORATIONS' | 'BUILDINGS' | 'ENERGY' | 'DEBRIS';
const TABS: TabId[] = ['SPECIAL','CROPS','ANIMALS','TERRAIN','TREES','DECORATIONS','BUILDINGS','ENERGY','DEBRIS'];

/* ── Wooden scroll banner ─────────────────────────────────────────────────── */
const MarketBanner = () => (
  <div className="flex items-center justify-center gap-2 py-2">
    {/* left scroll end */}
    <div className="flex items-center gap-1">
      <div className="w-6 h-12 rounded-full" style={{ background: 'radial-gradient(circle at 35% 35%, #c8851e, #7a4a1e)' }}/>
      <div className="w-8 h-8 rounded-full" style={{ background: 'radial-gradient(circle at 35% 35%, #d49628, #9a6010)' }}/>
    </div>
    {/* banner text */}
    <div
      className="px-8 py-2 rounded-sm"
      style={{ background: 'linear-gradient(180deg, #ffe8a0 0%, #f0c040 50%, #ffe8a0 100%)', border: '2px solid #b08020' }}
    >
      <span
        className="text-3xl font-black tracking-[0.2em] uppercase"
        style={{ color: '#5c3a00', textShadow: '1px 1px 0 rgba(255,240,100,0.8)', fontFamily: "'Fredoka', sans-serif" }}
      >
        ← MARKET →
      </span>
    </div>
    {/* right scroll end */}
    <div className="flex items-center gap-1">
      <div className="w-8 h-8 rounded-full" style={{ background: 'radial-gradient(circle at 35% 35%, #d49628, #9a6010)' }}/>
      <div className="w-6 h-12 rounded-full" style={{ background: 'radial-gradient(circle at 35% 35%, #c8851e, #7a4a1e)' }}/>
    </div>
  </div>
);

/* ── Crop card ────────────────────────────────────────────────────────────── */
const CropCard = ({ item, coins, level, dispatch, toast }: { item: MarketItem; coins: number; level: number; dispatch: any; toast: any }) => {
  const locked = !!item.unlockLevel && level < item.unlockLevel;

  return (
    <div
      className="relative rounded-lg overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, #fffbe8 0%, #f5eec8 100%)',
        border: '3px solid #c8a050',
        boxShadow: '2px 2px 0 #a07820',
      }}
    >
      {/* Item image area */}
      <div
        className="flex items-center justify-center relative"
        style={{ height: 80, background: 'linear-gradient(180deg, #e8f8d0 0%, #d0e8a0 100%)', borderBottom: '2px solid #b09040' }}
      >
        <span style={{ fontSize: 48 }}>{item.emoji}</span>
        {/* Locked overlay */}
        {locked && (
          <div
            className="absolute inset-0 flex flex-col items-center justify-center"
            style={{ background: 'rgba(100,60,20,0.75)' }}
          >
            <span className="text-3xl">🔒</span>
            <span className="text-white font-black text-xs mt-1">LOCKED</span>
          </div>
        )}
      </div>

      {/* Name */}
      <div className="px-2 pt-1">
        <p className="font-black text-xs text-center" style={{ color: '#3a2008' }}>{item.name}</p>
      </div>

      {/* Stats */}
      <div className="px-2 py-1 text-[10px] font-bold" style={{ color: '#6a4010' }}>
        {locked ? (
          <>
            <p>Unlock at level {item.unlockLevel}</p>
            <p>Or unlock with {item.unlockShells} shell{(item.unlockShells ?? 1) > 1 ? 's' : ''}</p>
          </>
        ) : (
          <>
            <p>Coins: {item.coins}</p>
            {item.food != null && <p>Food: {item.food}</p>}
            <p>EXP: {item.xp}</p>
            <p>Harvest: {item.harvestTime}</p>
          </>
        )}
      </div>

      {/* Badge + BUY */}
      <div className="flex items-center justify-between px-2 pb-2 mt-1 gap-1">
        {!locked ? (
          <>
            {/* coin badge */}
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-[9px] font-black border-2"
              style={{ background: 'radial-gradient(circle at 40% 35%, #ffe87a, #d4a820)', borderColor: '#a07810', color: '#5c3a00' }}
            >
              {item.qty}
            </div>
            <button
              onClick={() => {
                if (coins < item.coins) {
                  toast({ title: 'Not enough coins!', variant: 'destructive' });
                  return;
                }
                dispatch({ type: 'BUY', itemType: item.id, cost: item.coins });
                toast({ title: `${item.name} seeds bought! 🌱`, duration: 1500 });
              }}
              disabled={coins < item.coins}
              className="flex-1 py-1 rounded font-black text-xs active:scale-95 transition-transform border-b-2"
              style={{
                background: coins >= item.coins ? 'linear-gradient(180deg, #60d040, #30a010)' : '#aaaaaa',
                borderColor: coins >= item.coins ? '#187010' : '#888888',
                color: 'white',
                textShadow: '0 1px 2px rgba(0,0,0,0.3)',
              }}
            >
              BUY
            </button>
          </>
        ) : (
          <button
            onClick={() => {
              if (!item.unlockShells) return;
              dispatch({ type: 'BUY_PREMIUM', itemId: item.id, shellCost: item.unlockShells });
              toast({ title: `${item.name} unlocked! 🔓`, duration: 1500 });
            }}
            className="w-full py-1 rounded font-black text-[10px] active:scale-95 transition-transform border-b-2"
            style={{ background: 'linear-gradient(180deg, #e8d050, #c0a020)', borderColor: '#806010', color: '#3a2008' }}
          >
            UNLOCK FOR {item.unlockShells} 🐚
          </button>
        )}
      </div>
    </div>
  );
};

/* ── Building card ────────────────────────────────────────────────────────── */
const BuildingCard = ({ s, coins, dispatch, toast }: { s: MarketStructure; coins: number; dispatch: any; toast: any }) => (
  <div
    className="relative rounded-lg overflow-hidden"
    style={{
      background: 'linear-gradient(180deg, #fffbe8 0%, #f5eec8 100%)',
      border: '3px solid #c8a050',
      boxShadow: '2px 2px 0 #a07820',
    }}
  >
    <div
      className="flex items-center justify-center"
      style={{ height: 80, background: 'linear-gradient(180deg, #d8e8f8 0%, #b8d0f0 100%)', borderBottom: '2px solid #b09040' }}
    >
      <span style={{ fontSize: 44 }}>{s.emoji}</span>
    </div>
    <div className="px-2 pt-1">
      <p className="font-black text-xs text-center" style={{ color: '#3a2008' }}>{s.name}</p>
    </div>
    <div className="px-2 py-1 text-[10px] font-bold" style={{ color: '#6a4010' }}>
      <p>Coins: {s.coins}</p>
      {s.wood && <p>Wood: {s.wood}</p>}
      {s.stone && <p>Stone: {s.stone}</p>}
      <p className="text-[9px] text-[#8a6030] mt-0.5">{s.desc}</p>
    </div>
    <div className="flex items-center justify-between px-2 pb-2 mt-1 gap-1">
      <div
        className="w-7 h-7 rounded-full flex items-center justify-center text-[9px] font-black border-2"
        style={{ background: 'radial-gradient(circle at 40% 35%, #ffe87a, #d4a820)', borderColor: '#a07810', color: '#5c3a00' }}
      >
        🪙
      </div>
      <button
        onClick={() => {
          dispatch({ type: 'BUY', itemType: s.id, cost: s.coins });
          toast({ title: `${s.name} bought! 🏗️`, duration: 1500 });
        }}
        disabled={coins < s.coins}
        className="flex-1 py-1 rounded font-black text-xs active:scale-95 transition-transform border-b-2"
        style={{
          background: coins >= s.coins ? 'linear-gradient(180deg, #60d040, #30a010)' : '#aaaaaa',
          borderColor: coins >= s.coins ? '#187010' : '#888888',
          color: 'white',
        }}
      >
        BUY
      </button>
    </div>
  </div>
);

/* ── Main modal ───────────────────────────────────────────────────────────── */
export const ShopModal = () => {
  const { state, dispatch, setShopOpen } = useGame();
  const { toast } = useToast();
  const [tab, setTab] = useState<TabId>('CROPS');

  const { coins, shells, wood, food, stone } = state.inventory;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 animate-in fade-in"
      onClick={() => setShopOpen(false)}
    >
      <div
        className="relative flex flex-col overflow-hidden animate-in zoom-in-95"
        style={{
          width: 680,
          maxHeight: '92vh',
          background: 'linear-gradient(180deg, #d4a050 0%, #b07830 100%)',
          border: '5px solid #7a5010',
          borderRadius: 10,
          boxShadow: '0 8px 40px rgba(0,0,0,0.7)',
          fontFamily: "'Fredoka', sans-serif",
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* ── Header ── */}
        <div
          className="flex items-center px-4 py-1"
          style={{ background: 'linear-gradient(180deg, #c89830 0%, #9a7010 100%)', borderBottom: '3px solid #6a4800' }}
        >
          {/* Coins */}
          <div className="flex items-center gap-1.5 mr-4">
            <div className="w-7 h-7 rounded-full flex items-center justify-center text-base border-2"
              style={{ background: 'radial-gradient(circle at 35% 35%, #ffe87a, #d4a820)', borderColor: '#a07810' }}>💰</div>
            <span className="font-black text-white text-sm tabular-nums">{coins}</span>
          </div>
          {/* Wood */}
          <div className="flex items-center gap-1 mr-3">
            <span className="text-lg">🥥</span>
            <span className="font-black text-white text-sm">{wood}</span>
          </div>

          {/* MARKET banner centre */}
          <div className="flex-1"><MarketBanner /></div>

          {/* Food */}
          <div className="flex items-center gap-1 ml-3">
            <span className="text-lg">🍔</span>
            <span className="font-black text-white text-sm">{food}</span>
          </div>

          {/* Close X */}
          <button
            onClick={() => setShopOpen(false)}
            className="ml-4 w-9 h-9 rounded flex items-center justify-center font-black text-xl active:scale-95 transition-transform border-b-2"
            style={{ background: 'linear-gradient(180deg, #ff5040, #cc2010)', borderColor: '#880a00', color: 'white' }}
          >
            ✕
          </button>
        </div>

        {/* Shells row */}
        <div
          className="flex items-center gap-2 px-4 py-1.5"
          style={{ background: '#9a7010', borderBottom: '2px solid #6a4800' }}
        >
          <div className="flex items-center gap-1.5">
            <div className="w-6 h-6 rounded-full flex items-center justify-center text-sm border-2"
              style={{ background: 'radial-gradient(circle at 35% 35%, #ffe87a, #d4a820)', borderColor: '#a07810' }}>🐚</div>
            <span className="font-black text-white text-sm">{shells}</span>
          </div>
          <button
            className="px-3 py-0.5 rounded text-xs font-black border-b-2 active:scale-95"
            style={{ background: 'linear-gradient(180deg, #60d040, #30a010)', borderColor: '#187010', color: 'white' }}
          >
            GET SHELLS
          </button>
          <div className="ml-auto flex items-center gap-1 text-xs font-bold text-yellow-100">
            🪨 {stone}
          </div>
        </div>

        {/* ── Category tabs ── */}
        <div
          className="flex items-center gap-0.5 px-2 py-1 overflow-x-auto"
          style={{ background: 'linear-gradient(180deg, #b08828, #8a6810)', borderBottom: '3px solid #6a4800' }}
        >
          {TABS.map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className="px-3 py-1 text-[11px] font-black rounded-sm whitespace-nowrap active:scale-95 transition-transform"
              style={{
                background: tab === t
                  ? 'linear-gradient(180deg, #fff8d0, #ffe870)'
                  : 'linear-gradient(180deg, #d4aa50, #a87820)',
                border: `1px solid ${tab === t ? '#b08010' : '#7a5010'}`,
                borderBottom: `2px solid ${tab === t ? '#906010' : '#5a3800'}`,
                color: tab === t ? '#3a2008' : '#f5e8c0',
                boxShadow: tab === t ? 'inset 0 1px 2px rgba(255,255,180,0.6)' : 'none',
              }}
            >
              {t}
            </button>
          ))}
        </div>

        {/* ── Content ── */}
        <div
          className="flex-1 overflow-y-auto p-3 relative"
          style={{ background: 'linear-gradient(180deg, #e8d4a0 0%, #d4bc80 100%)' }}
        >
          {/* Inner parchment frame */}
          <div
            className="rounded-lg p-3 min-h-full"
            style={{
              background: 'linear-gradient(180deg, #f8f0d0 0%, #ece0b0 100%)',
              border: '3px solid #b09040',
              boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.1)',
            }}
          >
            {(tab === 'CROPS' || tab === 'SPECIAL') && (
              <div className="grid grid-cols-4 gap-3">
                {MARKET_CROPS.map(item => (
                  <CropCard
                    key={item.id}
                    item={item}
                    coins={coins}
                    level={state.level}
                    dispatch={dispatch}
                    toast={toast}
                  />
                ))}
              </div>
            )}

            {tab === 'BUILDINGS' && (
              <div className="grid grid-cols-4 gap-3">
                {MARKET_BUILDINGS.map(s => (
                  <BuildingCard key={s.id} s={s} coins={coins} dispatch={dispatch} toast={toast} />
                ))}
              </div>
            )}

            {tab === 'ENERGY' && (
              <div className="grid grid-cols-2 gap-4">
                {PREMIUM_ITEMS.map(item => (
                  <div key={item.id}
                    className="rounded-lg p-4 flex items-center gap-3"
                    style={{ background: 'linear-gradient(180deg, #fffbe8, #f5eec8)', border: '3px solid #c8a050' }}
                  >
                    <span style={{ fontSize: 48 }}>{item.emoji}</span>
                    <div className="flex-1">
                      <p className="font-black text-sm" style={{ color: '#3a2008' }}>{item.name}</p>
                      <p className="text-xs text-[#6a4010] mt-0.5">{item.desc}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className="font-black text-sm text-blue-700">{item.shellCost} 🐚</span>
                      <button
                        onClick={() => dispatch({ type: 'BUY_PREMIUM', itemId: item.id, shellCost: item.shellCost })}
                        disabled={shells < item.shellCost}
                        className="px-3 py-1 rounded font-black text-xs active:scale-95 transition-transform border-b-2"
                        style={{
                          background: shells >= item.shellCost ? 'linear-gradient(180deg, #60d040, #30a010)' : '#aaaaaa',
                          borderColor: shells >= item.shellCost ? '#187010' : '#888',
                          color: 'white',
                        }}
                      >
                        BUY
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {tab === 'ANIMALS' && (
              <div className="flex flex-col items-center justify-center py-12 gap-3 text-center">
                <span style={{ fontSize: 64 }}>🐾</span>
                <p className="font-black text-lg" style={{ color: '#3a2008' }}>Coming Soon!</p>
                <p className="text-sm font-bold" style={{ color: '#6a4010' }}>Animals will be available in a future update.</p>
              </div>
            )}

            {!['CROPS','SPECIAL','BUILDINGS','ENERGY','ANIMALS'].includes(tab) && (
              <div className="flex flex-col items-center justify-center py-12 gap-3 text-center">
                <span style={{ fontSize: 64 }}>🚧</span>
                <p className="font-black text-lg" style={{ color: '#3a2008' }}>{tab}</p>
                <p className="text-sm font-bold" style={{ color: '#6a4010' }}>Coming soon to Paradise Life!</p>
              </div>
            )}
          </div>

          {/* Right arrow scroll hint */}
          <button
            className="absolute right-1 top-1/2 -translate-y-1/2 w-8 h-16 rounded flex items-center justify-center text-white font-black active:scale-95"
            style={{ background: 'linear-gradient(180deg, #c89830, #9a7010)', border: '2px solid #6a4800' }}
          >
            →
          </button>
        </div>
      </div>
    </div>
  );
};

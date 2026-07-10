import React, { useEffect, useState } from 'react';
import { useGame } from '../game/GameContext';
import { SCALED } from '../game/gameData';
import { useToast } from '@/hooks/use-toast';

interface HUDProps {
  onOpenCollections: () => void;
  onOpenWeather: () => void;
  playerName?: string;
}

export const HUD: React.FC<HUDProps> = ({ onOpenCollections, onOpenWeather, playerName = 'Player' }) => {
  const { state, dispatch } = useGame();
  const { level, xp, inventory, energy, maxEnergy } = state;
  const nextLevelXp = Math.floor(100 * Math.pow(level, 1.5));
  const { toast } = useToast();

  const [timeToNextEnergy, setTimeToNextEnergy] = useState(0);
  useEffect(() => {
    const t = setInterval(() => {
      const diff = SCALED(300000) - (Date.now() - state.lastEnergyTick);
      setTimeToNextEnergy(Math.max(0, diff));
    }, 1000);
    return () => clearInterval(t);
  }, [state.lastEnergyTick]);

  const fmtTime = (ms: number) => {
    const s = Math.floor(ms / 1000);
    return `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;
  };

  const handleBuyEnergy = () => {
    if (state.inventory.food < 1) {
      toast({ title: 'No food!', description: 'Harvest crops first.', variant: 'destructive' });
      return;
    }
    dispatch({ type: 'BUY_ENERGY', foodCost: 1 });
    toast({ title: '+5 ⚡', duration: 1500 });
  };

  const statBox = 'flex items-center gap-1 text-white font-bold text-sm';
  const iconBox = 'w-7 h-7 rounded-full flex items-center justify-center text-base border border-black/30 shadow-sm shrink-0';

  return (
    /* Resource bar — sits directly below TopNav */
    <div
      className="absolute left-0 right-0 z-30 flex flex-col select-none"
      style={{
        top: 36,
        background: 'linear-gradient(180deg, #9a7028 0%, #7a5010 100%)',
        borderBottom: '3px solid #4a2e08',
        boxShadow: '0 3px 8px rgba(0,0,0,0.4)',
        fontFamily: "'Fredoka', sans-serif",
      }}
    >
      {/* Row 1 */}
      <div className="flex items-center gap-3 px-3 py-1 h-7">
        {/* Coins */}
        <div className={statBox}>
          <div className={iconBox} style={{ background: 'radial-gradient(circle at 35% 35%, #ffe87a, #d4a820)' }}>💰</div>
          <span className="tabular-nums min-w-[36px]">{inventory.coins}</span>
        </div>

        {/* Wood */}
        <div className={statBox}>
          <div className={iconBox} style={{ background: 'radial-gradient(circle at 35% 35%, #c8904a, #8b5a2b)' }}>🥥</div>
          <span className="tabular-nums min-w-[28px]">{inventory.wood}</span>
        </div>

        {/* Food */}
        <div className={statBox}>
          <div className={iconBox} style={{ background: 'radial-gradient(circle at 35% 35%, #f4a040, #c87020)' }}>🍔</div>
          <span className="tabular-nums min-w-[28px]">{inventory.food}</span>
        </div>

        {/* Energy bar */}
        <div className="flex items-center gap-1.5">
          <div className={iconBox} style={{ background: 'radial-gradient(circle at 35% 35%, #60c0ff, #1880c0)' }}>⚡</div>
          <div className="relative w-28 h-4 rounded-full overflow-hidden border border-black/40 shadow-inner"
            style={{ background: '#1a3050' }}>
            <div className="h-full transition-all duration-500 rounded-full"
              style={{
                width: `${(energy / maxEnergy) * 100}%`,
                background: 'linear-gradient(90deg, #40a0ff 0%, #80d0ff 100%)',
                boxShadow: '0 0 6px rgba(80,180,255,0.8)',
              }} />
            <span className="absolute inset-0 flex items-center justify-center text-[10px] font-black text-white">
              {energy}/{maxEnergy}
            </span>
          </div>
          {energy < maxEnergy && (
            <span className="text-[10px] text-blue-200 font-bold whitespace-nowrap">{fmtTime(timeToNextEnergy)}</span>
          )}
        </div>

        {/* XP / Level bar */}
        <div className="flex items-center gap-1.5">
          <div className={iconBox} style={{ background: 'radial-gradient(circle at 35% 35%, #ffe860, #d4a000)' }}>
            <span className="text-xs font-black text-amber-800">{level}</span>
          </div>
          <div className="relative w-28 h-4 rounded-full overflow-hidden border border-black/40 shadow-inner"
            style={{ background: '#302010' }}>
            <div className="h-full transition-all duration-500 rounded-full"
              style={{
                width: `${(xp / nextLevelXp) * 100}%`,
                background: 'linear-gradient(90deg, #ffc030 0%, #ffe870 100%)',
                boxShadow: '0 0 6px rgba(255,200,0,0.8)',
              }} />
            <span className="absolute inset-0 flex items-center justify-center text-[10px] font-black text-amber-900">
              {xp}/{nextLevelXp}
            </span>
          </div>
        </div>

        {/* Shells */}
        <div className={statBox}>
          <div className={iconBox} style={{ background: 'radial-gradient(circle at 35% 35%, #ffdd80, #c8a030)' }}>🐚</div>
          <span className="tabular-nums min-w-[28px]">{inventory.shells}</span>
        </div>

        {/* Produce */}
        <div className={statBox}>
          <div className={iconBox} style={{ background: 'radial-gradient(circle at 35% 35%, #80e080, #308030)' }}>🌽</div>
          <span className="tabular-nums min-w-[20px]">{inventory.produce}</span>
        </div>
      </div>

      {/* Row 2 */}
      <div className="flex items-center gap-2 px-3 pb-1 h-6">
        <div className="flex items-center gap-1 text-xs text-yellow-100 font-bold">
          <span>🐚</span> <span className="tabular-nums">0</span>
        </div>
        <button
          onClick={handleBuyEnergy}
          className="px-2 py-0.5 rounded text-[10px] font-black border active:scale-95 transition-transform"
          style={{
            background: 'linear-gradient(180deg, #60d040, #30a010)',
            borderColor: '#187010',
            borderBottomWidth: 2,
            color: 'white',
            textShadow: '0 1px 2px rgba(0,0,0,0.4)',
          }}
        >
          GET SHELLS
        </button>
        {/* Space for collections / weather quick access */}
        <div className="ml-auto flex items-center gap-1">
          <button
            onClick={onOpenCollections}
            className="text-xs px-2 py-0.5 rounded border active:scale-95 transition-transform font-bold"
            style={{ background: '#9040c0', borderColor: '#602090', borderBottomWidth: 2, color: 'white' }}
          >
            🗃️
          </button>
          <button
            onClick={onOpenWeather}
            className="text-xs px-2 py-0.5 rounded border active:scale-95 transition-transform font-bold"
            style={{ background: '#3080d0', borderColor: '#105090', borderBottomWidth: 2, color: 'white' }}
          >
            🌤️
          </button>
        </div>
      </div>
    </div>
  );
};

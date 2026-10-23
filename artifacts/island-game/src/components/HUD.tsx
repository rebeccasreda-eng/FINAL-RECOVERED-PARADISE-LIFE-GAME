import React, { useEffect, useState } from 'react';
import { Apple, CloudSun, Coins, Package, ShoppingBag, Sparkles, TreePalm, Waves, Zap } from 'lucide-react';
import { useGame } from '../game/GameContext';
import { SCALED } from '../game/gameData';
import { useToast } from '@/hooks/use-toast';

interface HUDProps {
  onOpenCollections: () => void;
  onOpenShop: () => void;
  onOpenWeather: () => void;
  playerName?: string;
}

export const HUD: React.FC<HUDProps> = ({ onOpenCollections, onOpenShop, onOpenWeather, playerName = 'Player' }) => {
  const { state, dispatch } = useGame();
  const { level, xp, inventory, energy, maxEnergy } = state;
  const nextLevelXp = Math.floor(100 * Math.pow(level, 1.5));
  const { toast } = useToast();
  const [timeToNextEnergy, setTimeToNextEnergy] = useState(0);

  useEffect(() => {
    const update = () => {
      const diff = SCALED(300000) - (Date.now() - state.lastEnergyTick);
      setTimeToNextEnergy(Math.max(0, diff));
    };
    update();
    const timer = window.setInterval(update, 1000);
    return () => window.clearInterval(timer);
  }, [state.lastEnergyTick]);

  const fmtTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    return `${Math.floor(seconds / 60)}:${(seconds % 60).toString().padStart(2, '0')}`;
  };

  const handleBuyEnergy = () => {
    if (state.inventory.food < 1) {
      toast({ title: 'No food!', description: 'Harvest crops first.', variant: 'destructive' });
      return;
    }
    dispatch({ type: 'BUY_ENERGY', foodCost: 1 });
    toast({ title: '+5 energy', duration: 1500 });
  };

  const resources = [
    { label: 'Coins', value: inventory.coins, Icon: Coins, color: 'gold' },
    { label: 'Wood', value: inventory.wood, Icon: TreePalm, color: 'wood' },
    { label: 'Food', value: inventory.food, Icon: Apple, color: 'food' },
    { label: 'Shells', value: inventory.shells, Icon: Waves, color: 'shell' },
    { label: 'Produce', value: inventory.produce, Icon: Package, color: 'produce' },
  ];

  return (
    <section className="island-hud" aria-label={`${playerName}'s resources`}>
      <div className="island-resource-row">
        {resources.map(({ label, value, Icon, color }) => (
          <div className="island-resource" key={label} data-testid={`resource-${label.toLowerCase()}`}>
            <span className={`island-resource-icon icon-${color}`}><Icon size={18} strokeWidth={2.7} aria-hidden="true" /></span>
            <span className="island-resource-value">{value}</span>
          </div>
        ))}
        <div className="island-meter island-energy" data-testid="status-energy">
          <span className="island-resource-icon icon-energy"><Zap size={20} fill="currentColor" aria-hidden="true" /></span>
          <div className="island-meter-track">
            <div className="island-meter-fill energy-fill" style={{ width: `${Math.min(100, (energy / maxEnergy) * 100)}%` }} />
            <span className="island-meter-label">{energy}<span className="meter-divider"> / </span>{maxEnergy}</span>
          </div>
          {energy < maxEnergy && <span className="island-meter-timer">{fmtTime(timeToNextEnergy)}</span>}
          <button className="island-energy-action" onClick={handleBuyEnergy} title="Use food to restore energy" aria-label="Use food to restore energy" data-testid="button-buy-energy">
            <Sparkles size={14} aria-hidden="true" /> <span>+</span>
          </button>
        </div>
        <div className="island-meter island-xp" data-testid="status-level">
          <span className="island-level-badge">{level}</span>
          <div className="island-meter-track">
            <div className="island-meter-fill xp-fill" style={{ width: `${Math.min(100, (xp / nextLevelXp) * 100)}%` }} />
            <span className="island-meter-label">{xp}<span className="meter-divider"> / </span>{nextLevelXp}</span>
          </div>
        </div>
      </div>
      <div className="island-hud-footer">
        <button
          type="button"
          className="island-get-shells"
          onClick={onOpenShop}
          aria-label="Open the shell shop"
          data-testid="button-open-shell-shop"
        >
          <ShoppingBag size={13} aria-hidden="true" /> GET SHELLS
        </button>
        <div className="island-hud-quick-actions">
          <button className="island-quick-button collections-action" onClick={onOpenCollections} aria-label="Open collections" title="Collections" data-testid="button-open-collections">
            <Package size={17} aria-hidden="true" />
          </button>
          <button className="island-quick-button weather-action" onClick={onOpenWeather} aria-label="Open weather" title="Weather" data-testid="button-open-weather">
            <CloudSun size={17} aria-hidden="true" />
          </button>
        </div>
      </div>
    </section>
  );
};

import React, { useEffect } from 'react';
import { useGame } from '../game/GameContext';
import { WEATHER_TYPES } from '../game/gameData';

export const WeatherModal = ({ onClose }: { onClose: () => void }) => {
  const { state, dispatch } = useGame();

  useEffect(() => {
    dispatch({ type: 'CHECK_WEATHER' });
  }, [dispatch]);

  const weatherIcons: Record<string, string> = {
    SUNNY: '☀️',
    RAINY: '🌧️',
    CLOUDY: '☁️',
    STORMY: '⛈️',
    WINDY: '💨'
  };

  const weatherEffects: Record<string, string> = {
    SUNNY: "A beautiful day! No special effects.",
    RAINY: "Crops grow 2x faster! Time to plant.",
    CLOUDY: "Fruit trees drop extra food (+1 🍎).",
    STORMY: "Fishing gives double coins, but watch out for more crabs! 🦀",
    WINDY: "Clearing grass might reveal hidden energy (25% chance for +1 ⚡)."
  };

  const nextIndex = (WEATHER_TYPES.indexOf(state.weather) + 1) % WEATHER_TYPES.length;
  const nextWeather = WEATHER_TYPES[nextIndex];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in" onClick={onClose}>
      <div className="bg-gradient-to-b from-blue-400 to-blue-200 p-8 rounded-[2rem] border-8 border-blue-800 shadow-2xl flex flex-col gap-6 w-[450px] relative text-center" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-3xl font-black text-blue-900 hover:scale-110 transition-transform">×</button>
        <h2 className="text-3xl font-black text-blue-900 uppercase tracking-widest flex items-center justify-center gap-2">
          <span>🌤️</span> Forecast
        </h2>
        
        <div className="bg-white/50 p-6 rounded-2xl border-4 border-white shadow-inner flex flex-col items-center">
           <h3 className="text-xl font-bold text-blue-800 mb-2">Current Weather</h3>
           <div className="text-8xl drop-shadow-lg mb-2">{weatherIcons[state.weather]}</div>
           <div className="text-3xl font-black text-blue-900">{state.weather}</div>
           
           <div className="mt-4 bg-white/70 p-3 rounded-xl border-2 border-blue-300 w-full">
             <p className="text-sm font-bold text-blue-900">Today's Bonus:</p>
             <p className="text-xs font-bold text-blue-700 mt-1">{weatherEffects[state.weather]}</p>
           </div>
        </div>

        <div className="bg-white/30 p-4 rounded-2xl border-2 border-white flex justify-between items-center shadow-inner">
           <span className="font-bold text-blue-800 text-lg">Next Change:</span>
           <span className="text-2xl drop-shadow-sm font-black text-blue-900 flex items-center gap-2">
             {weatherIcons[nextWeather]} {nextWeather}
           </span>
        </div>
      </div>
    </div>
  )
}
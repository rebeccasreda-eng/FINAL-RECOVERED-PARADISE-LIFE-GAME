import React from 'react';

interface TopNavProps {
  playerName: string;
  onOpenCollections: () => void;
  onOpenShop: () => void;
  bgmMuted?: boolean;
  onToggleBgm?: () => void;
}

const NAV_TABS = [
  { label: 'PLAY', icon: null, active: true },
  { label: 'FREE GIFTS', icon: '🎁' },
  { label: 'INVITE FRIENDS', icon: null },
  { label: 'NEIGHBORS', icon: null },
  { label: 'GET SHELLS', icon: '🪙' },
  { label: 'FORUMS', icon: null },
];

export const TopNav: React.FC<TopNavProps> = ({ playerName, onOpenCollections, onOpenShop, bgmMuted, onToggleBgm }) => {
  return (
    <div
      className="absolute top-0 left-0 right-0 z-30 flex items-stretch h-9 select-none"
      style={{
        background: 'linear-gradient(180deg, #d4aa60 0%, #a87830 40%, #8a6018 100%)',
        borderBottom: '3px solid #5a3a08',
        boxShadow: '0 3px 8px rgba(0,0,0,0.4)',
        fontFamily: "'Fredoka', sans-serif",
      }}
    >
      {/* Logo */}
      <div
        className="flex items-center px-3 shrink-0 border-r"
        style={{ borderColor: '#5a3a08' }}
      >
        <span
          className="font-black text-base leading-none"
          style={{
            fontFamily: 'Georgia, "Times New Roman", serif',
            fontStyle: 'italic',
            color: '#2d7a1a',
            textShadow:
              '1px 1px 0 #f5c842, -1px 1px 0 #f5c842, 1px -1px 0 #f5c842, -1px -1px 0 #f5c842, 0 2px 6px rgba(0,0,0,0.4)',
          }}
        >
          Paradise<span style={{ color: '#1a6010' }}>Life</span>
        </span>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-0.5 px-1">
        {NAV_TABS.map((tab) => (
          <button
            key={tab.label}
            className="flex items-center gap-1 px-2.5 h-6 text-[11px] font-bold rounded-sm whitespace-nowrap active:scale-95 transition-transform"
            style={{
              background: tab.active
                ? 'linear-gradient(180deg, #ffe87a 0%, #f0c020 100%)'
                : 'linear-gradient(180deg, #f0d888 0%, #c8a030 100%)',
              border: `1px solid ${tab.active ? '#a07010' : '#8a6010'}`,
              borderBottom: `2px solid ${tab.active ? '#8a6010' : '#5a3a08'}`,
              color: '#3a2008',
              boxShadow: tab.active ? 'inset 0 1px 2px rgba(255,255,200,0.6)' : 'inset 0 1px 1px rgba(255,255,200,0.3)',
            }}
          >
            {tab.icon && <span>{tab.icon}</span>}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Mail icon */}
      <div className="flex items-center ml-1 relative">
        <button
          className="flex items-center justify-center w-8 h-6 rounded-sm text-sm active:scale-95 transition-transform relative"
          style={{
            background: 'linear-gradient(180deg, #f0d888 0%, #c8a030 100%)',
            border: '1px solid #8a6010',
            borderBottom: '2px solid #5a3a08',
          }}
        >
          ✉️
          <span
            className="absolute -top-1.5 -right-1.5 text-[9px] font-black text-white w-4 h-4 flex items-center justify-center rounded-full border border-white"
            style={{ background: '#e03020' }}
          >
            0
          </span>
        </button>
      </div>

      {/* Right side: music toggle + player name */}
      <div className="ml-auto flex items-center gap-2 pr-3">
        {onToggleBgm && (
          <button
            onClick={onToggleBgm}
            title={bgmMuted ? 'Unmute music' : 'Mute music'}
            className="flex items-center justify-center w-7 h-6 rounded-sm text-sm active:scale-95 transition-transform"
            style={{
              background: bgmMuted
                ? 'linear-gradient(180deg, #888, #555)'
                : 'linear-gradient(180deg, #f0d888 0%, #c8a030 100%)',
              border: '1px solid #8a6010',
              borderBottom: '2px solid #5a3a08',
              fontSize: 14,
            }}
          >
            {bgmMuted ? '🔇' : '🎵'}
          </button>
        )}
        <span className="text-[11px] font-bold text-yellow-100 opacity-80">{playerName}'s Island</span>
      </div>
    </div>
  );
};

import React from 'react';
import { Gift, Mail, Music2, Play, ShoppingBag, Users, VolumeX } from 'lucide-react';

interface TopNavProps {
  playerName: string;
  onOpenShop: () => void;
  bgmMuted?: boolean;
  onToggleBgm?: () => void;
}

const LINKS = [
  { label: 'PLAY', icon: Play, active: true },
  { label: 'FREE GIFTS', icon: Gift },
  { label: 'INVITE FRIENDS', icon: Users },
  { label: 'NEIGHBORS', icon: Users },
  { label: 'FORUMS', icon: null },
];

export const TopNav: React.FC<TopNavProps> = ({
  playerName, onOpenShop, bgmMuted, onToggleBgm,
}) => (
  <header className="island-topnav" aria-label={`${playerName}'s island navigation`}>
    <div className="island-nav-brand" aria-label="Paradise Life">
      <span>Paradise<span className="island-brand-life">Life</span></span>
    </div>
    <nav className="island-nav-links" aria-label="Game menu">
      {LINKS.slice(0, 2).map(({ label, icon: Icon, active }) => (
        <span key={label} className={`island-nav-tab${active ? ' is-active' : ''}`}>
          {Icon && <Icon size={14} strokeWidth={3} aria-hidden="true" />}
          {label}
        </span>
      ))}
      <span className="island-nav-tab island-nav-invite">
        <Users size={14} strokeWidth={3} aria-hidden="true" /> INVITE FRIENDS
      </span>
      <span className="island-nav-tab island-nav-neighbors">NEIGHBORS</span>
      <button className="island-nav-tab island-nav-shells" onClick={onOpenShop} data-testid="button-open-shop">
        <ShoppingBag size={14} strokeWidth={3} aria-hidden="true" /> GET SHELLS
      </button>
      <span className="island-nav-tab island-nav-forums">FORUMS</span>
    </nav>
    <div className="island-nav-actions">
      <span className="island-mail" aria-label="Mail">
        <Mail size={20} strokeWidth={2.5} aria-hidden="true" />
        <span className="island-mail-count">0</span>
      </span>
      {onToggleBgm && (
        <button
          className="island-sound-button"
          onClick={onToggleBgm}
          title={bgmMuted ? 'Unmute music' : 'Mute music'}
          aria-label={bgmMuted ? 'Unmute music' : 'Mute music'}
          data-testid="button-toggle-music"
        >
          {bgmMuted ? <VolumeX size={15} /> : <Music2 size={15} />}
        </button>
      )}
    </div>
  </header>
);

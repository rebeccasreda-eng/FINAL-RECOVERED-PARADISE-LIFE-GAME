import React, { useState } from 'react';
import { CharAppearance, DEFAULT_FEMALE, DEFAULT_MALE } from './CustomizableCharSVG';
import girlSundressImage from '@assets/girl_sundress_cutout(2)(1)_1792655405137.png';
import blondBoyImage from '@assets/blond_boy_cutout(2)(1)_1792655405137.png';
import brunetteBoyImage from '@assets/brunette_boy_cutout(2)(1)_1792655405137.png';
import pinkDressGirlImage from '@assets/girl_asset_dress_no_bg_1792655854378.png';

export type WelcomeCharacterId = 'girl-sundress' | 'blond-boy' | 'brunette-boy' | 'pink-dress-girl';

export interface PlayerProfile {
  name: string;
  gender: 'female' | 'male';
  appearance: CharAppearance;
  characterId: WelcomeCharacterId;
  hasSetup: boolean;
}

interface CharacterOption {
  id: WelcomeCharacterId;
  name: string;
  gender: PlayerProfile['gender'];
  appearance: CharAppearance;
  image: string;
}

const CHARACTERS: CharacterOption[] = [
  { id: 'girl-sundress', name: 'Sundress Girl', gender: 'female', appearance: DEFAULT_FEMALE, image: girlSundressImage },
  { id: 'blond-boy', name: 'Blond Boy', gender: 'male', appearance: DEFAULT_MALE, image: blondBoyImage },
  { id: 'brunette-boy', name: 'Brunette Boy', gender: 'male', appearance: DEFAULT_MALE, image: brunetteBoyImage },
  { id: 'pink-dress-girl', name: 'Pink Dress Girl', gender: 'female', appearance: DEFAULT_FEMALE, image: pinkDressGirlImage },
];

const StageBg: React.FC = () => (
  <svg
    viewBox="0 0 380 240"
    preserveAspectRatio="xMidYMid slice"
    aria-hidden="true"
    style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
  >
    <defs>
      <linearGradient id="welcome-sky" x2="0" y2="1">
        <stop stopColor="#56c7ed" />
        <stop offset="1" stopColor="#b9efff" />
      </linearGradient>
      <linearGradient id="welcome-sea" x2="0" y2="1">
        <stop stopColor="#36a4d5" />
        <stop offset="1" stopColor="#1675ae" />
      </linearGradient>
      <linearGradient id="welcome-sand" x2="0" y2="1">
        <stop stopColor="#f6df9e" />
        <stop offset="1" stopColor="#d3b875" />
      </linearGradient>
    </defs>
    <rect width="380" height="240" fill="url(#welcome-sky)" />
    <g fill="#fff" opacity=".9">
      <ellipse cx="67" cy="46" rx="35" ry="12" />
      <ellipse cx="94" cy="39" rx="27" ry="14" />
      <ellipse cx="276" cy="55" rx="38" ry="13" />
      <ellipse cx="303" cy="48" rx="25" ry="15" />
    </g>
    <path d="M0 125Q55 112 110 126T220 124T380 121V198H0Z" fill="url(#welcome-sea)" />
    <path d="M0 138Q35 132 70 138T140 138T210 138T280 138T380 135" fill="none" stroke="#c3f4ff" strokeWidth="3" opacity=".7" />
    <path d="M0 160Q48 151 96 160T192 160T288 158T380 157" fill="none" stroke="#d9faff" strokeWidth="2" opacity=".55" />
    <path d="M0 184Q80 166 152 185T300 180T380 177V240H0Z" fill="url(#welcome-sand)" />
    <path d="M0 199Q65 190 120 200T240 200T380 192" fill="none" stroke="#fff0bc" strokeWidth="5" opacity=".8" />
    <path d="M338 184Q340 119 351 71" fill="none" stroke="#795231" strokeWidth="13" strokeLinecap="round" />
    <g fill="#347b2e">
      <path d="M351 79Q307 64 282 75Q310 87 350 88Z" />
      <path d="M351 78Q326 45 335 20Q350 44 355 78Z" />
      <path d="M353 79Q372 48 397 49Q378 70 356 87Z" />
      <path d="M350 82Q318 83 297 103Q326 100 354 90Z" />
      <path d="M354 81Q376 79 393 96Q372 94 355 91Z" />
    </g>
    <g fill="#f17842">
      <circle cx="27" cy="211" r="8" /><circle cx="39" cy="215" r="6" />
      <circle cx="366" cy="220" r="7" /><circle cx="350" cy="216" r="5" />
    </g>
    <g fill="#4f9c35">
      <path d="M0 240 8 213l8 27 10-21 8 21 10-28 10 28Z" />
      <path d="m310 240 8-29 9 29 9-23 7 23 11-28 9 28Z" />
    </g>
  </svg>
);

interface Props {
  onPlay: (profile: PlayerProfile) => void;
}

export const WelcomeScreen: React.FC<Props> = ({ onPlay }) => {
  const [name, setName] = useState('Player');
  const [nameError, setNameError] = useState('');
  const [selectedId, setSelectedId] = useState<WelcomeCharacterId>('girl-sundress');
  const selected = CHARACTERS.find(character => character.id === selectedId)!;

  const handlePlay = () => {
    const trimmedName = name.trim();
    if (trimmedName.length < 2) {
      setNameError('Enter at least 2 characters');
      return;
    }

    onPlay({
      name: trimmedName,
      gender: selected.gender,
      appearance: selected.appearance,
      characterId: selected.id,
      hasSetup: true,
    });
  };

  const handleRandom = () => {
    const choices = CHARACTERS.filter(character => character.id !== selectedId);
    setSelectedId(choices[Math.floor(Math.random() * choices.length)].id);
  };

  return (
    <div className="welcome-overlay">
      <div className="welcome-dim" />
      <section className="welcome-frame" role="dialog" aria-modal="true" aria-labelledby="welcome-title">
        <span className="welcome-nail welcome-nail-left" aria-hidden="true" />
        <span className="welcome-nail welcome-nail-right" aria-hidden="true" />

        <header className="welcome-sign">
          <span className="welcome-sign-leaf" aria-hidden="true">◆</span>
          <h1 id="welcome-title">WELCOME!</h1>
          <span className="welcome-sign-leaf" aria-hidden="true">◆</span>
        </header>

        <div className="welcome-name-panel">
          <label htmlFor="welcome-player-name">Name Your Character</label>
          <input
            id="welcome-player-name"
            className={nameError ? 'has-error' : ''}
            maxLength={12}
            value={name}
            onChange={event => {
              setName(event.target.value);
              setNameError('');
            }}
            onKeyDown={event => event.key === 'Enter' && handlePlay()}
            onFocus={event => event.currentTarget.select()}
            aria-invalid={!!nameError}
            aria-describedby={nameError ? 'welcome-name-error' : undefined}
          />
          {nameError && <p id="welcome-name-error" className="welcome-error">{nameError}</p>}
        </div>

        <div className="welcome-preview" aria-label={`Selected character: ${selected.name}`}>
          <StageBg />
          <img className="welcome-preview-character" src={selected.image} alt={selected.name} />
          <div className="welcome-preview-caption">{selected.name}</div>
        </div>

        <div className="welcome-choice-section">
          <p className="welcome-section-label">Choose Your Character</p>
          <div className="welcome-character-options" role="group" aria-label="Choose your character">
            {CHARACTERS.map(character => {
              const isSelected = character.id === selectedId;
              return (
                <button
                  key={character.id}
                  type="button"
                  className={`welcome-character-option${isSelected ? ' is-selected' : ''}`}
                  aria-pressed={isSelected}
                  onClick={() => setSelectedId(character.id)}
                >
                  <img src={character.image} alt="" />
                  <span>{character.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="welcome-actions">
          <button type="button" className="welcome-random-button" onClick={handleRandom}>Random</button>
          <button type="button" className="welcome-play-button" onClick={handlePlay}>Play</button>
        </div>
      </section>
    </div>
  );
};

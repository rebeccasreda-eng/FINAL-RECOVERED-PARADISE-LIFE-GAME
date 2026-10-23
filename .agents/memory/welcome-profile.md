---
name: Island game WelcomeScreen PlayerProfile
description: Shape of PlayerProfile and stable welcome character identifiers.
---

## PlayerProfile shape
```ts
interface PlayerProfile {
  name: string;
  gender: 'female' | 'male';
  appearance: CharAppearance;   // full appearance object — NOT raw skinTone/hairColor strings
  characterId: WelcomeCharacterId;
  hasSetup: boolean;
}
```

## Stable welcome character identifiers
The welcome screen saves the exact selected preset ID: `girl-sundress`, `blond-boy`, `brunette-boy`, or `pink-dress-girl`. Random selection must use this same preset list. Game.tsx reads `profile.characterId` and `profile.name`; it does not read appearance fields directly.

**Why:** These identifiers are persisted in localStorage, so renaming or deriving them from appearance would break stable selection identity.

**How to apply:** Add future welcome presets to the typed preset list and preserve every existing ID.

---
name: Island game WelcomeScreen PlayerProfile
description: Shape of PlayerProfile and how characterId is derived for the island.
---

## PlayerProfile shape
```ts
interface PlayerProfile {
  name: string;
  gender: 'female' | 'male';
  appearance: CharAppearance;   // full appearance object — NOT raw skinTone/hairColor strings
  characterId: string;          // chibi sprite id for CharacterOnIsland (mia/ava/nora/leo/kai)
  hasSetup: boolean;
}
```

## characterId derivation
`pickCharacterId(gender, hairStyle)` maps gender + hairStyle to one of the 5 chibi sprites. Game.tsx only reads `profile.characterId` and `profile.name`; it does not read appearance fields directly.

**Why:** The island still uses the 5 fixed chibi sprites (CharacterOnIsland.tsx unchanged). The full appearance is only used by CustomizableCharSVG on the welcome screen and dressing room. Future work: thread appearance through GameContext to optionally render CustomizableCharSVG on the island.

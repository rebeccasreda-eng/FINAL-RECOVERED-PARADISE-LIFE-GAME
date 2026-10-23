---
name: Island game character system
description: How CustomizableCharSVG, CharAppearance, DressingRoom, and fro hair rendering fit together.
---

## Fro hair rendering rule
The `fro` HairLayer must be rendered **before** the head circle in SVG order so it appears behind the head. All other hair styles render after the head circle. Pattern:

```tsx
{hairStyle === 'fro' && <HairLayer style="fro" color={hairColor}/>}
<circle cx="50" cy="36" r="28" fill={sk}/>   {/* head */}
{hairStyle !== 'fro' && <HairLayer style={hairStyle} color={hairColor}/>}
```

**Why:** SVG has no z-index; paint order is document order. Fro is a large circle that should appear as an afro halo behind/around the head, not on top.

## CharAppearance fields
All fields are `string` (union values enforced by convention, not TS):
- `skinTone`, `hairStyle`, `hairColor`, `outfitStyle`, `outfitColor`, `hatStyle`
- `eyeColor`, `mouthStyle`, `eyebrowStyle`, `makeupStyle`, `facialHairStyle`
- `faceShape` — drives head ellipse shape (round/oval/wide/narrow/heart/soft)
- `noseStyle` — drives nose rendering (button/dot/round/snub)

Both `faceShape` and `noseStyle` were added to make FACE SHAPE and NOSE dressing room tabs functional.

## Gender reset policy
Both WelcomeScreen and DressingRoom fully reset appearance to the gender default (DEFAULT_FEMALE / DEFAULT_MALE) on gender toggle. This prevents cross-gender appearance carryover (e.g. facial hair on female).

**Why:** Partial reset (hair + outfit only) left makeup/facial-hair combinations that are confusing.

## DressingRoom onSave signature
`(appearance: CharAppearance, name: string, gender: 'female' | 'male') => void`
Must match WelcomeScreen's `handleDressingRoomSave`.

## Player avatar visual consistency
The roaming player should use the same supplied character cutout selected on the welcome screen, rather than an unrelated default player sprite.

**Why:** The user requested consistent identity and art style between character selection and the character moving around the island.

**How to apply:** Keep the saved welcome `characterId` mapped to its matching cutout in the in-world player renderer; preserve legacy ID aliases where practical.

## Roaming-character motion
Use a time-based walk-frame controller for the roaming character, but do not fake a gait by splitting, shaking, rotating, scaling, or bouncing the flattened welcome cutout. If no genuine full-body walk poses are available, preserve the matching front/back cutout as the idle image until those poses are supplied. Keep chopping/shoveling actions separate.

**Why:** The user now wants a genuine walking cycle while retaining the original character artwork; prior split-limb and bob approximations looked blurry and unstable. The current welcome cutouts are still single static PNGs.

**How to apply:** Drive animation state from actual movement, advance real full-body pose frames by elapsed time, preserve phase while facing changes, and return to the static portrait when movement stops or frames are unavailable. Keep the interpolated movement and facing logic unchanged; keep tool-action animations separate.

Keep the whole roaming-player portrait visible above neighboring island tile art.

**Why:** The user reported the back-facing or walking character being partially obscured and asked that the avatar stay intact.

**How to apply:** Give the player layer priority over map-tile artwork and keep the portrait wrapper overflow visible.

Do not display a direction arrow above the roaming player.

**Why:** The user decided the avatar should have no arrow marker overhead.

**How to apply:** Keep movement and facing behavior unchanged while rendering only the character portrait and action effects.

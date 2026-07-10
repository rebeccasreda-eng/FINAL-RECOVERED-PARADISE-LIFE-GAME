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

import React, { useState, useCallback } from 'react';
import { CharAppearance, DEFAULT_FEMALE, DEFAULT_MALE, CustomizableCharSVG, HairPreviewIcon } from './CustomizableCharSVG';

export type { CharAppearance };

interface CatalogItem {
  id: string;
  name: string;
  preview: React.ReactNode;
  changes: Partial<CharAppearance>;
}

/* ── tiny helpers ── */
const Pill = ({ children, bg = '#ffe000' }: { children: React.ReactNode; bg?: string }) => (
  <div style={{ background: bg, borderRadius: 4, padding: '1px 5px', fontSize: 10, fontWeight: 900, color: '#222' }}>{children}</div>
);

/* ── Small shirt icon ── */
const ShirtIcon = ({ color, pattern }: { color: string; pattern?: string }) => (
  <svg viewBox="0 0 60 60" width="60" height="60">
    <rect width="60" height="60" fill="#f0e8d4" rx="4"/>
    <path d="M10 14 L20 9 L24 20 Q30 17 36 20 L40 9 L50 14 L44 28 L38 26 L38 54 L22 54 L22 26 L16 28Z" fill={color}/>
    {pattern === 'stripes' && [28,34,40,46].map(y=><line key={y} x1="22" y1={y} x2="38" y2={y} stroke="white" strokeWidth="2" opacity="0.4"/>)}
    {pattern === 'star' && <polygon points="30,27 31.8,33 38,33 33,37 34.8,43 30,39.5 25.2,43 27,37 22,33 28.2,33" fill="white" opacity="0.8"/>}
    {pattern === 'floral' && <><circle cx="27" cy="32" r="3" fill="white" opacity="0.55"/><circle cx="35" cy="40" r="2.5" fill="#ffe0e8" opacity="0.7"/></>}
    {pattern === 'tropical' && <><path d="M26 30 Q29 27 32 30 Q29 33 26 30Z" fill="#60c820" opacity="0.8"/><circle cx="34" cy="38" r="3" fill="#ffcc00" opacity="0.7"/></>}
    {pattern === 'uniform' && <path d="M22 26 L30 32 L38 26 L35 26 L30 30 L25 26Z" fill="white" opacity="0.5"/>}
  </svg>
);

const SkinIcon = ({ color, name }: { color: string; name: string }) => (
  <svg viewBox="0 0 60 60" width="60" height="60">
    <rect width="60" height="60" fill="#f0e8d4" rx="4"/>
    <circle cx="30" cy="30" r="22" fill={color} stroke="rgba(0,0,0,0.1)" strokeWidth="1"/>
    <text x="30" y="55" textAnchor="middle" fontSize="7" fill="#6f4e2a" fontWeight="900">{name}</text>
  </svg>
);

const HatIcon = ({ emoji }: { emoji: string }) => (
  <div style={{ fontSize: 40, lineHeight: 1, textAlign: 'center', width: 60, height: 60,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    background: '#f0e8d4', borderRadius: 4 }}>
    {emoji}
  </div>
);

const EyeIcon = ({ color }: { color: string }) => (
  <svg viewBox="0 0 60 60" width="60" height="60">
    <rect width="60" height="60" fill="#f0e8d4" rx="4"/>
    <ellipse cx="30" cy="30" rx="22" ry="14" fill="white" stroke="#ccc" strokeWidth="1"/>
    <circle cx="30" cy="30" r="10" fill={color}/>
    <circle cx="30" cy="30" r="6" fill="#1a0a00"/>
    <circle cx="32.5" cy="27.5" r="3" fill="white"/>
  </svg>
);

const MouthIcon = ({ type }: { type: string }) => {
  const paths: Record<string, string> = {
    smile: 'M14 30 Q30 42 46 30', grin: 'M10 28 Q30 44 50 28',
    pout:  'M16 32 Q30 26 44 32', smirk:'M14 30 Q22 36 30 34 Q38 32 46 30',
  };
  return (
    <svg viewBox="0 0 60 60" width="60" height="60">
      <rect width="60" height="60" fill="#f0e8d4" rx="4"/>
      <path d={paths[type] ?? paths.smile} stroke="#cc4466" strokeWidth="3" fill="none" strokeLinecap="round"/>
    </svg>
  );
};

const BrowIcon = ({ type }: { type: string }) => {
  const shapes: Record<string, [string, string]> = {
    natural: ['M8 24 Q20 18 32 22', 'M28 22 Q40 18 52 24'],
    thin:    ['M10 22 Q20 18 30 20', 'M30 20 Q40 18 50 22'],
    thick:   ['M6 26 Q20 17 34 23', 'M26 23 Q40 17 54 26'],
    arched:  ['M8 28 Q20 14 32 24', 'M28 24 Q40 14 52 28'],
  };
  const [l, r] = shapes[type] ?? shapes.natural;
  const w = type === 'thick' ? 4 : 2.5;
  return (
    <svg viewBox="0 0 60 60" width="60" height="60">
      <rect width="60" height="60" fill="#f0e8d4" rx="4"/>
      <path d={l} stroke="#7a4520" strokeWidth={w} fill="none" strokeLinecap="round"/>
      <path d={r} stroke="#7a4520" strokeWidth={w} fill="none" strokeLinecap="round"/>
    </svg>
  );
};

const NoseIcon = ({ type }: { type: string }) => {
  const shapes: Record<string, React.ReactNode> = {
    button: <ellipse cx="30" cy="32" rx="5" ry="3.5" fill="#e0a880" opacity="0.7"/>,
    dot:    <circle cx="30" cy="32" r="3" fill="#e0a880" opacity="0.75"/>,
    round:  <ellipse cx="30" cy="32" rx="7" ry="4" fill="#e0a880" opacity="0.65"/>,
    snub:   <path d="M26 28 Q30 32 34 28 Q32 36 30 36 Q28 36 26 28Z" fill="#e0a880" opacity="0.6"/>,
  };
  return (
    <svg viewBox="0 0 60 60" width="60" height="60">
      <rect width="60" height="60" fill="#f0e8d4" rx="4"/>
      {shapes[type] ?? shapes.button}
    </svg>
  );
};

const MakeupIcon = ({ type }: { type: string }) => {
  const emojis: Record<string, string> = {
    none: '🚫', red_lips: '💄', pink_glow: '🌸', smoky: '🖤', shimmer: '✨', natural_rose: '🌹',
  };
  return <HatIcon emoji={emojis[type] ?? '💄'}/>;
};

const FacialHairIcon = ({ type }: { type: string }) => {
  const emojis: Record<string, string> = {
    none: '🚫', stubble: '😶', mustache: '👨', goatee: '🧔', full_beard: '🧔‍♂️', handlebar: '🥸',
  };
  return <HatIcon emoji={emojis[type] ?? '🧔'}/>;
};

/* ─── Catalog ─── */
function getCatalogItems(categoryId: string, gender: 'female' | 'male'): CatalogItem[] {
  switch (categoryId) {
    case 'hair':
      return gender === 'female' ? [
        { id: 'long_wavy', name: 'Long Wavy',    preview: <HairPreviewIcon style="long_wavy" color="#7a4520"/>, changes: { hairStyle: 'long_wavy', hairColor: '#7a4520' } },
        { id: 'curly',     name: 'Curly Pink',    preview: <HairPreviewIcon style="curly"     color="#dd4488"/>, changes: { hairStyle: 'curly',     hairColor: '#dd4488' } },
        { id: 'ponytail',  name: 'Ponytail',      preview: <HairPreviewIcon style="ponytail"  color="#2b2020"/>, changes: { hairStyle: 'ponytail',  hairColor: '#2b2020' } },
        { id: 'bob',       name: 'Short Bob',     preview: <HairPreviewIcon style="bob"       color="#c98a3a"/>, changes: { hairStyle: 'bob',       hairColor: '#c98a3a' } },
        { id: 'braids',    name: 'Braids',        preview: <HairPreviewIcon style="braids"    color="#1a1010"/>, changes: { hairStyle: 'braids',    hairColor: '#1a1010' } },
        { id: 'pigtails',  name: 'Pigtails',      preview: <HairPreviewIcon style="pigtails"  color="#884499"/>, changes: { hairStyle: 'pigtails',  hairColor: '#884499' } },
      ] : [
        { id: 'shaggy',    name: 'Shaggy Red',    preview: <HairPreviewIcon style="shaggy"    color="#cc4422"/>, changes: { hairStyle: 'shaggy',    hairColor: '#cc4422' } },
        { id: 'messy',     name: 'Messy Brown',   preview: <HairPreviewIcon style="messy"     color="#7a4520"/>, changes: { hairStyle: 'messy',     hairColor: '#7a4520' } },
        { id: 'fro',       name: 'Fro',           preview: <HairPreviewIcon style="fro"       color="#1a1010"/>, changes: { hairStyle: 'fro',       hairColor: '#1a1010' } },
        { id: 'pompadour', name: 'Pompadour',     preview: <HairPreviewIcon style="pompadour" color="#e8c040"/>, changes: { hairStyle: 'pompadour', hairColor: '#e8c040' } },
        { id: 'spikey',    name: 'Pink Spikey',   preview: <HairPreviewIcon style="spikey"    color="#ff4488"/>, changes: { hairStyle: 'spikey',    hairColor: '#ff4488' } },
        { id: 'wavy',      name: 'Wavy Brown',    preview: <HairPreviewIcon style="wavy"      color="#5a3020"/>, changes: { hairStyle: 'wavy',      hairColor: '#5a3020' } },
      ];

    case 'hat':
      return [
        { id: 'none',   name: 'No Hat',       preview: <HatIcon emoji="🚫"/>, changes: { hatStyle: 'none'   } },
        { id: 'cap',    name: 'Baseball Cap', preview: <HatIcon emoji="🧢"/>, changes: { hatStyle: 'cap'    } },
        { id: 'cowboy', name: 'Cowboy Hat',   preview: <HatIcon emoji="🤠"/>, changes: { hatStyle: 'cowboy' } },
        { id: 'crown',  name: 'Crown',        preview: <HatIcon emoji="👑"/>, changes: { hatStyle: 'crown'  } },
        { id: 'party',  name: 'Party Hat',    preview: <HatIcon emoji="🎉"/>, changes: { hatStyle: 'party'  } },
        { id: 'santa',  name: 'Santa Hat',    preview: <HatIcon emoji="🎅"/>, changes: { hatStyle: 'santa'  } },
      ];

    case 'clothes':
      return gender === 'female' ? [
        { id: 'stripes',  name: 'Sailor',    preview: <ShirtIcon color="#4466cc" pattern="stripes"/>,  changes: { outfitStyle: 'stripes',  outfitColor: '#4466cc' } },
        { id: 'floral',   name: 'Floral',    preview: <ShirtIcon color="#dd4499" pattern="floral"/>,   changes: { outfitStyle: 'floral',   outfitColor: '#dd4499' } },
        { id: 'tropical', name: 'Tropical',  preview: <ShirtIcon color="#e8780a" pattern="tropical"/>, changes: { outfitStyle: 'tropical', outfitColor: '#e8780a' } },
        { id: 'plain_gr', name: 'Mint',      preview: <ShirtIcon color="#3a9a6a"/>,                    changes: { outfitStyle: 'plain',    outfitColor: '#3a9a6a' } },
        { id: 'plain_pk', name: 'Pink',      preview: <ShirtIcon color="#ee5599"/>,                    changes: { outfitStyle: 'plain',    outfitColor: '#ee5599' } },
        { id: 'plain_lv', name: 'Lavender',  preview: <ShirtIcon color="#8a5aaa"/>,                    changes: { outfitStyle: 'plain',    outfitColor: '#8a5aaa' } },
      ] : [
        { id: 'star',     name: 'Star Tee',  preview: <ShirtIcon color="#222233" pattern="star"/>,     changes: { outfitStyle: 'star',     outfitColor: '#222233' } },
        { id: 'stripes',  name: 'Sailor',    preview: <ShirtIcon color="#3355aa" pattern="stripes"/>,  changes: { outfitStyle: 'stripes',  outfitColor: '#3355aa' } },
        { id: 'tropical', name: 'Tropical',  preview: <ShirtIcon color="#f07020" pattern="tropical"/>, changes: { outfitStyle: 'tropical', outfitColor: '#f07020' } },
        { id: 'plain_rd', name: 'Red',       preview: <ShirtIcon color="#cc3322"/>,                    changes: { outfitStyle: 'plain',    outfitColor: '#cc3322' } },
        { id: 'plain_gr', name: 'Forest',    preview: <ShirtIcon color="#3a7a3a"/>,                    changes: { outfitStyle: 'plain',    outfitColor: '#3a7a3a' } },
        { id: 'plain_dk', name: 'Charcoal',  preview: <ShirtIcon color="#444455"/>,                    changes: { outfitStyle: 'plain',    outfitColor: '#444455' } },
      ];

    case 'suit':
      return gender === 'female' ? [
        { id: 'suit_bl',  name: 'Navy Set',  preview: <ShirtIcon color="#1a2a6c" pattern="uniform"/>,  changes: { outfitStyle: 'uniform',  outfitColor: '#1a2a6c' } },
        { id: 'suit_pk',  name: 'Rose Set',  preview: <ShirtIcon color="#cc5588" pattern="uniform"/>,  changes: { outfitStyle: 'uniform',  outfitColor: '#cc5588' } },
        { id: 'suit_tl',  name: 'Teal Set',  preview: <ShirtIcon color="#20a898" pattern="uniform"/>,  changes: { outfitStyle: 'uniform',  outfitColor: '#20a898' } },
        { id: 'suit_vio', name: 'Violet',    preview: <ShirtIcon color="#7733cc" pattern="uniform"/>,  changes: { outfitStyle: 'uniform',  outfitColor: '#7733cc' } },
        { id: 'suit_grn', name: 'Jade',      preview: <ShirtIcon color="#2a7a4a" pattern="uniform"/>,  changes: { outfitStyle: 'uniform',  outfitColor: '#2a7a4a' } },
        { id: 'suit_blk', name: 'Midnight',  preview: <ShirtIcon color="#1a1a2a" pattern="uniform"/>,  changes: { outfitStyle: 'uniform',  outfitColor: '#1a1a2a' } },
      ] : [
        { id: 'suit_bl',  name: 'Navy',      preview: <ShirtIcon color="#1a2a6c" pattern="uniform"/>,  changes: { outfitStyle: 'uniform',  outfitColor: '#1a2a6c' } },
        { id: 'suit_bk',  name: 'Tuxedo',    preview: <ShirtIcon color="#0a0a0a" pattern="uniform"/>,  changes: { outfitStyle: 'uniform',  outfitColor: '#0a0a0a' } },
        { id: 'suit_rd',  name: 'Crimson',   preview: <ShirtIcon color="#aa1122" pattern="uniform"/>,  changes: { outfitStyle: 'uniform',  outfitColor: '#aa1122' } },
        { id: 'suit_gr',  name: 'Forest',    preview: <ShirtIcon color="#1a5a2a" pattern="uniform"/>,  changes: { outfitStyle: 'uniform',  outfitColor: '#1a5a2a' } },
        { id: 'suit_tl',  name: 'Teal',      preview: <ShirtIcon color="#10706a" pattern="uniform"/>,  changes: { outfitStyle: 'uniform',  outfitColor: '#10706a' } },
        { id: 'suit_gy',  name: 'Steel',     preview: <ShirtIcon color="#445566" pattern="uniform"/>,  changes: { outfitStyle: 'uniform',  outfitColor: '#445566' } },
      ];

    case 'skin':
      return [
        { id: 'fair',   name: 'Fair',       preview: <SkinIcon color="#fde8d0" name="Fair"/>,     changes: { skinTone: '#fde8d0' } },
        { id: 'light',  name: 'Light',      preview: <SkinIcon color="#f5c5a3" name="Light"/>,    changes: { skinTone: '#f5c5a3' } },
        { id: 'warm',   name: 'Warm',       preview: <SkinIcon color="#e8c898" name="Warm"/>,     changes: { skinTone: '#e8c898' } },
        { id: 'med',    name: 'Medium',     preview: <SkinIcon color="#d4956a" name="Medium"/>,   changes: { skinTone: '#d4956a' } },
        { id: 'tan',    name: 'Tan',        preview: <SkinIcon color="#b07040" name="Tan"/>,      changes: { skinTone: '#b07040' } },
        { id: 'deep',   name: 'Deep',       preview: <SkinIcon color="#6a3820" name="Deep"/>,     changes: { skinTone: '#6a3820' } },
      ];

    case 'face':
      return [
        { id: 'round',  name: 'Round',   preview: <svg viewBox="0 0 60 60" width="60" height="60"><rect width="60" height="60" fill="#f0e8d4" rx="4"/><circle cx="30" cy="32" r="20" fill="#fde8d0" stroke="#c8a870" strokeWidth="1.5"/></svg>, changes: { faceShape: 'round'  } },
        { id: 'oval',   name: 'Oval',    preview: <svg viewBox="0 0 60 60" width="60" height="60"><rect width="60" height="60" fill="#f0e8d4" rx="4"/><ellipse cx="30" cy="32" rx="16" ry="22" fill="#fde8d0" stroke="#c8a870" strokeWidth="1.5"/></svg>, changes: { faceShape: 'oval'   } },
        { id: 'wide',   name: 'Wide',    preview: <svg viewBox="0 0 60 60" width="60" height="60"><rect width="60" height="60" fill="#f0e8d4" rx="4"/><ellipse cx="30" cy="32" rx="24" ry="18" fill="#fde8d0" stroke="#c8a870" strokeWidth="1.5"/></svg>, changes: { faceShape: 'wide'   } },
        { id: 'narrow', name: 'Narrow',  preview: <svg viewBox="0 0 60 60" width="60" height="60"><rect width="60" height="60" fill="#f0e8d4" rx="4"/><ellipse cx="30" cy="32" rx="13" ry="22" fill="#fde8d0" stroke="#c8a870" strokeWidth="1.5"/></svg>, changes: { faceShape: 'narrow' } },
        { id: 'heart',  name: 'Heart',   preview: <svg viewBox="0 0 60 60" width="60" height="60"><rect width="60" height="60" fill="#f0e8d4" rx="4"/><path d="M30 50 Q10 36 14 22 Q18 12 30 20 Q42 12 46 22 Q50 36 30 50Z" fill="#fde8d0" stroke="#c8a870" strokeWidth="1.5"/></svg>, changes: { faceShape: 'heart'  } },
        { id: 'soft',   name: 'Soft',    preview: <svg viewBox="0 0 60 60" width="60" height="60"><rect width="60" height="60" fill="#f0e8d4" rx="4"/><ellipse cx="30" cy="34" rx="18" ry="19" fill="#fde8d0" stroke="#c8a870" strokeWidth="1.5"/></svg>, changes: { faceShape: 'soft'   } },
      ];

    case 'eyes':
      return [
        { id: 'brown',  name: 'Brown',   preview: <EyeIcon color="#88551a"/>, changes: { eyeColor: '#88551a' } },
        { id: 'blue',   name: 'Blue',    preview: <EyeIcon color="#3388ee"/>, changes: { eyeColor: '#3388ee' } },
        { id: 'green',  name: 'Green',   preview: <EyeIcon color="#22aa55"/>, changes: { eyeColor: '#22aa55' } },
        { id: 'purple', name: 'Purple',  preview: <EyeIcon color="#884499"/>, changes: { eyeColor: '#884499' } },
        { id: 'gray',   name: 'Gray',    preview: <EyeIcon color="#667788"/>, changes: { eyeColor: '#667788' } },
        { id: 'amber',  name: 'Amber',   preview: <EyeIcon color="#cc8820"/>, changes: { eyeColor: '#cc8820' } },
      ];

    case 'mouth':
      return [
        { id: 'smile', name: 'Smile',  preview: <MouthIcon type="smile"/>, changes: { mouthStyle: 'smile' } },
        { id: 'grin',  name: 'Grin',   preview: <MouthIcon type="grin"/>,  changes: { mouthStyle: 'grin'  } },
        { id: 'pout',  name: 'Pout',   preview: <MouthIcon type="pout"/>,  changes: { mouthStyle: 'pout'  } },
        { id: 'smirk', name: 'Smirk',  preview: <MouthIcon type="smirk"/>, changes: { mouthStyle: 'smirk' } },
        { id: 'smile2', name: 'Beam',  preview: <MouthIcon type="smile"/>, changes: { mouthStyle: 'smile' } },
        { id: 'open',  name: 'Happy',  preview: <MouthIcon type="grin"/>,  changes: { mouthStyle: 'grin'  } },
      ];

    case 'nose':
      return [
        { id: 'button', name: 'Button', preview: <NoseIcon type="button"/>, changes: { noseStyle: 'button' } },
        { id: 'dot',    name: 'Dot',    preview: <NoseIcon type="dot"/>,    changes: { noseStyle: 'dot'    } },
        { id: 'round',  name: 'Round',  preview: <NoseIcon type="round"/>,  changes: { noseStyle: 'round'  } },
        { id: 'snub',   name: 'Snub',   preview: <NoseIcon type="snub"/>,   changes: { noseStyle: 'snub'   } },
        { id: 'small',  name: 'Small',  preview: <NoseIcon type="button"/>, changes: { noseStyle: 'button' } },
        { id: 'wide',   name: 'Wide',   preview: <NoseIcon type="round"/>,  changes: { noseStyle: 'round'  } },
      ];

    case 'eyebrows':
      return [
        { id: 'natural', name: 'Natural',  preview: <BrowIcon type="natural"/>, changes: { eyebrowStyle: 'natural' } },
        { id: 'thin',    name: 'Thin',     preview: <BrowIcon type="thin"/>,    changes: { eyebrowStyle: 'thin'    } },
        { id: 'thick',   name: 'Thick',    preview: <BrowIcon type="thick"/>,   changes: { eyebrowStyle: 'thick'   } },
        { id: 'arched',  name: 'Arched',   preview: <BrowIcon type="arched"/>,  changes: { eyebrowStyle: 'arched'  } },
        { id: 'natural2',name: 'Soft',     preview: <BrowIcon type="natural"/>, changes: { eyebrowStyle: 'natural' } },
        { id: 'thin2',   name: 'Fine',     preview: <BrowIcon type="thin"/>,    changes: { eyebrowStyle: 'thin'    } },
      ];

    case 'makeup':
      return [
        { id: 'none',        name: 'None',          preview: <MakeupIcon type="none"/>,         changes: { makeupStyle: 'none'         } },
        { id: 'red_lips',    name: 'Red Lips',      preview: <MakeupIcon type="red_lips"/>,     changes: { makeupStyle: 'red_lips'     } },
        { id: 'pink_glow',   name: 'Pink Glow',     preview: <MakeupIcon type="pink_glow"/>,    changes: { makeupStyle: 'pink_glow'    } },
        { id: 'smoky',       name: 'Smoky',         preview: <MakeupIcon type="smoky"/>,        changes: { makeupStyle: 'smoky'        } },
        { id: 'shimmer',     name: 'Shimmer',       preview: <MakeupIcon type="shimmer"/>,      changes: { makeupStyle: 'shimmer'      } },
        { id: 'natural_rose',name: 'Natural Rose',  preview: <MakeupIcon type="natural_rose"/>, changes: { makeupStyle: 'natural_rose' } },
      ];

    case 'facial_hair':
      return gender === 'female' ? [
        { id: 'none',   name: 'None',      preview: <FacialHairIcon type="none"/>,   changes: { facialHairStyle: 'none'     } },
        { id: 'none2',  name: 'Clean',     preview: <FacialHairIcon type="none"/>,   changes: { facialHairStyle: 'none'     } },
        { id: 'none3',  name: 'Smooth',    preview: <FacialHairIcon type="none"/>,   changes: { facialHairStyle: 'none'     } },
        { id: 'none4',  name: 'Fresh',     preview: <FacialHairIcon type="none"/>,   changes: { facialHairStyle: 'none'     } },
        { id: 'none5',  name: 'Natural',   preview: <FacialHairIcon type="none"/>,   changes: { facialHairStyle: 'none'     } },
        { id: 'none6',  name: 'Bare',      preview: <FacialHairIcon type="none"/>,   changes: { facialHairStyle: 'none'     } },
      ] : [
        { id: 'none',      name: 'None',         preview: <FacialHairIcon type="none"/>,        changes: { facialHairStyle: 'none'        } },
        { id: 'stubble',   name: 'Stubble',      preview: <FacialHairIcon type="stubble"/>,     changes: { facialHairStyle: 'stubble'     } },
        { id: 'mustache',  name: 'Mustache',     preview: <FacialHairIcon type="mustache"/>,    changes: { facialHairStyle: 'mustache'    } },
        { id: 'goatee',    name: 'Goatee',       preview: <FacialHairIcon type="goatee"/>,      changes: { facialHairStyle: 'goatee'      } },
        { id: 'full_beard',name: 'Full Beard',   preview: <FacialHairIcon type="full_beard"/>,  changes: { facialHairStyle: 'full_beard'  } },
        { id: 'handlebar', name: 'Handlebar',    preview: <FacialHairIcon type="handlebar"/>,   changes: { facialHairStyle: 'handlebar'   } },
      ];

    default:
      return [];
  }
}

/* ─── Category tabs data ─── */
const CATEGORIES = [
  { id: 'suit',       label: 'SUIT',        row: 1 },
  { id: 'clothes',    label: 'CLOTHES',     row: 1 },
  { id: 'hat',        label: 'HAT',         row: 1 },
  { id: 'hair',       label: 'HAIR',        row: 1 },
  { id: 'skin',       label: 'SKIN TONE',   row: 1 },
  { id: 'face',       label: 'FACE SHAPE',  row: 1 },
  { id: 'eyes',       label: 'EYES',        row: 2 },
  { id: 'mouth',      label: 'MOUTH',       row: 2 },
  { id: 'nose',       label: 'NOSE',        row: 2 },
  { id: 'eyebrows',   label: 'EYEBROWS',    row: 2 },
  { id: 'makeup',     label: 'MAKE UP',     row: 2 },
  { id: 'facial_hair',label: 'FACIAL HAIR', row: 2 },
] as const;

/* ─── Props ─── */
interface DressingRoomProps {
  initialAppearance: CharAppearance;
  gender: 'female' | 'male';
  name: string;
  onSave: (appearance: CharAppearance, name: string, gender: 'female' | 'male') => void;
  onCancel: () => void;
}

/* ─── Component ─── */
export const DressingRoom: React.FC<DressingRoomProps> = ({
  initialAppearance, gender: initGender, name: initName, onSave, onCancel,
}) => {
  const [appearance, setAppearance]     = useState<CharAppearance>(initialAppearance);
  const [gender, setGender]             = useState<'female' | 'male'>(initGender);
  const [name, setName]                 = useState(initName);
  const [activeCategory, setActiveCategory] = useState<string>('hair');
  const [page, setPage]                 = useState(0);
  const savedRef = React.useRef(initialAppearance);

  const items = getCatalogItems(activeCategory, gender);
  const totalPages = Math.ceil(items.length / 6);
  const pageItems = items.slice(page * 6, (page + 1) * 6);

  const handleTabChange = useCallback((id: string) => {
    setActiveCategory(id);
    setPage(0);
  }, []);

  const handleTry = useCallback((changes: Partial<CharAppearance>) => {
    if (Object.keys(changes).length > 0) {
      setAppearance(prev => ({ ...prev, ...changes }));
    }
  }, []);

  const handleGender = useCallback((g: 'female' | 'male') => {
    setGender(g);
    setPage(0);
    // Reset to full gender default to prevent cross-gender appearance carryover
    setAppearance(g === 'female' ? DEFAULT_FEMALE : DEFAULT_MALE);
  }, []);

  const handleRandom = useCallback(() => {
    const g: 'female' | 'male' = Math.random() < 0.5 ? 'female' : 'male';
    setGender(g);
    const items_hair  = getCatalogItems('hair',    g);
    const items_hat   = getCatalogItems('hat',     g);
    const items_cloth = getCatalogItems('clothes', g);
    const items_skin  = getCatalogItems('skin',    g);
    const items_eye   = getCatalogItems('eyes',    g);
    const pick = <T extends object>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)];
    setAppearance(prev => ({
      ...prev,
      ...(pick(items_hair)?.changes  ?? {}),
      ...(pick(items_hat)?.changes   ?? {}),
      ...(pick(items_cloth)?.changes ?? {}),
      ...(pick(items_skin)?.changes  ?? {}),
      ...(pick(items_eye)?.changes   ?? {}),
    }));
  }, []);

  const handleRestore = useCallback(() => {
    setAppearance(savedRef.current);
    setGender(initGender);
    setName(initName);
  }, [initGender, initName]);

  /* Shared tab style */
  const tabBase: React.CSSProperties = {
    fontFamily: "'Fredoka',sans-serif",
    fontWeight: 900,
    fontSize: 10,
    letterSpacing: 0.5,
    padding: '4px 6px',
    borderRadius: 6,
    cursor: 'pointer',
    border: '2px solid #b09060',
    background: 'linear-gradient(180deg,#ddd0a8,#c8b882)',
    color: '#5a3e1a',
    transition: 'all 0.1s',
    whiteSpace: 'nowrap' as const,
    userSelect: 'none' as const,
  };
  const tabActive: React.CSSProperties = {
    ...tabBase,
    background: '#fffbe8',
    border: '2px solid #9a7038',
    color: '#4a2e0a',
    boxShadow: '0 1px 0 #c8a870 inset',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50"/>

      {/* Main modal */}
      <div
        style={{
          position: 'relative',
          width: 790,
          maxWidth: '98vw',
          fontFamily: "'Fredoka',sans-serif",
          background: 'repeating-linear-gradient(90deg,rgba(0,0,0,0.04) 0 2px,transparent 2px 26px), linear-gradient(180deg,#d8c193,#c9ac76)',
          border: '9px solid #7a4620',
          boxShadow: '0 0 0 3px #52290f inset, 0 0 0 13px #8a5426 inset, 0 12px 40px rgba(0,0,0,0.6)',
          borderRadius: 20,
          padding: '14px 14px 12px',
        }}
      >
        {/* Corner nails */}
        <div className="absolute top-[6px] left-[6px] w-5 h-[9px] rounded bg-[#e8dcc0] border border-[#7a4620]"/>
        <div className="absolute top-[6px] right-[6px] w-5 h-[9px] rounded bg-[#e8dcc0] border border-[#7a4620]"/>

        {/* Title banner */}
        <div style={{
          background: 'linear-gradient(180deg,#d0a050,#a86a20)',
          border: '3px solid #7a4620',
          borderRadius: 10,
          padding: '4px 12px',
          marginBottom: 10,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 10,
        }}>
          <span style={{ fontSize: 16, lineHeight: 1 }}>⚔️</span>
          <h1 style={{
            fontFamily: "'Luckiest Guy','Fredoka',cursive",
            fontSize: 22,
            margin: 0,
            color: '#fff8e0',
            WebkitTextStroke: '1.5px #6b3f1a',
            paintOrder: 'stroke fill',
            letterSpacing: 3,
          }}>DRESSING ROOM</h1>
          <span style={{ fontSize: 16, lineHeight: 1 }}>⚔️</span>
        </div>

        {/* Body: left + right */}
        <div style={{ display: 'flex', gap: 10, alignItems: 'stretch' }}>
          {/* ── LEFT PANEL ── */}
          <div style={{
            width: 194,
            flexShrink: 0,
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
          }}>
            {/* Name */}
            <div style={{ background: '#e8dcb8', border: '2px solid #a9884f', borderRadius: 10, padding: '6px 8px' }}>
              <p style={{ fontSize: 10, fontWeight: 900, textTransform: 'uppercase', letterSpacing: 1, color: '#6f4e2a', margin: '0 0 3px' }}>
                Name Your Character
              </p>
              <input
                value={name}
                onChange={e => setName(e.target.value)}
                maxLength={12}
                style={{
                  width: '100%', boxSizing: 'border-box',
                  textAlign: 'center', borderRadius: 6,
                  padding: '4px 6px', fontSize: 15, fontWeight: 900,
                  border: '2px solid #c9a86a', background: '#fbf6e8',
                  color: '#4a3520', fontFamily: "'Fredoka',sans-serif",
                  outline: 'none',
                }}
              />
            </div>

            {/* Character preview */}
            <div style={{
              background: 'linear-gradient(180deg,#7ab8e8,#a8d8f0)',
              border: '3px solid #8a5a2b',
              borderRadius: 10,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '10px 0 4px',
              flex: 1,
              minHeight: 200,
              position: 'relative',
            }}>
              {/* Sand floor */}
              <div style={{
                position: 'absolute', bottom: 0, left: 0, right: 0, height: 36,
                background: 'linear-gradient(180deg,#e8d4a0,#ccb878)',
                borderRadius: '0 0 7px 7px',
              }}/>
              {/* Arrow buttons */}
              <div style={{
                position: 'absolute', bottom: 6, left: 6,
                width: 28, height: 28,
                background: '#3a8a3a',
                border: '2px solid #1a5a1a',
                borderRadius: 6,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', fontSize: 16,
              }}>⬅</div>
              <div style={{
                position: 'absolute', bottom: 6, right: 6,
                width: 28, height: 28,
                background: '#3a8a3a',
                border: '2px solid #1a5a1a',
                borderRadius: 6,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', fontSize: 16,
              }}>➡</div>
              <div style={{ filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))', position: 'relative', zIndex: 1 }}>
                <CustomizableCharSVG appearance={appearance} gender={gender} size={130}/>
              </div>
            </div>

            {/* Gender */}
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: 10, fontWeight: 900, textTransform: 'uppercase', letterSpacing: 1, color: '#6f4e2a', margin: '0 0 5px' }}>
                Choose Your Gender
              </p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: 12 }}>
                {(['female','male'] as const).map(g => (
                  <button
                    key={g}
                    onClick={() => handleGender(g)}
                    style={{
                      width: 44, height: 44,
                      borderRadius: '50%',
                      background: g === 'female' ? '#f7c6da' : '#bcdcf5',
                      border: `3px solid ${gender === g ? (g === 'female' ? '#c23d73' : '#2f6da0') : (g === 'female' ? '#d4548a' : '#3f7fbf')}`,
                      boxShadow: gender === g ? '0 0 0 2px #fff, 0 0 0 5px #e39a3c' : 'none',
                      transform: gender === g ? 'scale(1.08)' : 'scale(1)',
                      cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      transition: 'all 0.15s',
                    }}
                  >
                    {g === 'female'
                      ? <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#c23d73" strokeWidth="2.2"><circle cx="12" cy="8" r="5"/><path d="M12 13v8M9 18h6"/></svg>
                      : <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#2f6da0" strokeWidth="2.2"><circle cx="10" cy="14" r="5"/><path d="M14 10l6-6M14 4h6v6"/></svg>
                    }
                  </button>
                ))}
              </div>
            </div>

            {/* RANDOM + RESTORE */}
            <div style={{ display: 'flex', gap: 6 }}>
              {[['RANDOM', handleRandom], ['RESTORE', handleRestore]].map(([label, fn]) => (
                <button
                  key={label as string}
                  onClick={fn as () => void}
                  style={{
                    flex: 1,
                    fontFamily: "'Luckiest Guy','Fredoka',cursive",
                    fontWeight: 900,
                    fontSize: 12,
                    letterSpacing: 1,
                    padding: '7px 4px',
                    borderRadius: 8,
                    border: '2px solid #8a6030',
                    background: 'linear-gradient(180deg,#e8d890,#c8a848)',
                    color: '#4a3010',
                    cursor: 'pointer',
                    boxShadow: '0 2px 0 #8a6030',
                  }}
                >
                  {label as string}
                </button>
              ))}
            </div>
          </div>

          {/* ── RIGHT PANEL ── */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
            {/* Tab rows */}
            {([1, 2] as const).map(row => (
              <div key={row} style={{ display: 'flex', gap: 4, flexWrap: 'nowrap' }}>
                {CATEGORIES.filter(c => c.row === row).map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => handleTabChange(cat.id)}
                    style={activeCategory === cat.id ? tabActive : tabBase}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            ))}

            {/* Item grid */}
            <div style={{ flex: 1, position: 'relative' }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: 8,
              }}>
                {pageItems.map(item => (
                  <div
                    key={item.id}
                    style={{
                      background: 'linear-gradient(180deg,#e8ddb8,#d4c490)',
                      border: '2px solid #b09060',
                      borderRadius: 10,
                      padding: '8px 6px 7px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 6,
                    }}
                  >
                    {/* Item name */}
                    <p style={{
                      margin: 0,
                      fontSize: 11,
                      fontWeight: 900,
                      color: '#5a3e1a',
                      textAlign: 'center',
                      letterSpacing: 0.3,
                    }}>
                      {item.name}
                    </p>

                    {/* Item preview */}
                    <div style={{
                      width: 80,
                      height: 72,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: '#f4ead8',
                      borderRadius: 8,
                      border: '1.5px solid #c8b070',
                      overflow: 'hidden',
                    }}>
                      {item.preview}
                    </div>

                    {/* TRY button */}
                    <button
                      onClick={() => handleTry(item.changes)}
                      style={{
                        fontFamily: "'Luckiest Guy','Fredoka',cursive",
                        fontSize: 13,
                        letterSpacing: 1,
                        padding: '4px 18px',
                        borderRadius: 20,
                        border: '2px solid #2a7a1a',
                        background: 'linear-gradient(180deg,#8fdb5a,#5aaa2a)',
                        color: '#fff8e8',
                        WebkitTextStroke: '0.5px #1a5a10',
                        paintOrder: 'stroke fill',
                        cursor: 'pointer',
                        boxShadow: '0 2px 0 #1a5a10',
                        transition: 'transform 0.1s',
                      }}
                      onMouseDown={e => (e.currentTarget.style.transform = 'scale(0.95)')}
                      onMouseUp={e => (e.currentTarget.style.transform = 'scale(1)')}
                    >
                      TRY
                    </button>
                  </div>
                ))}
              </div>

              {/* Pagination arrow */}
              {totalPages > 1 && (
                <button
                  onClick={() => setPage(p => (p + 1) % totalPages)}
                  style={{
                    position: 'absolute',
                    right: -38,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: 32,
                    height: 56,
                    background: 'linear-gradient(180deg,#d4a050,#a86020)',
                    border: '2px solid #7a4020',
                    borderRadius: 8,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 16,
                    color: '#fff8e0',
                    boxShadow: '0 2px 0 #7a4020',
                  }}
                >
                  →
                </button>
              )}
            </div>

            {/* Save / Cancel */}
            <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
              <button
                onClick={onCancel}
                style={{
                  flex: 1,
                  fontFamily: "'Luckiest Guy','Fredoka',cursive",
                  fontSize: 14,
                  letterSpacing: 1,
                  padding: '8px',
                  borderRadius: 10,
                  border: '2px solid #a9884f',
                  background: 'linear-gradient(180deg,#fbf6e8,#ecdcae)',
                  color: '#6f4e2a',
                  cursor: 'pointer',
                }}
              >
                CANCEL
              </button>
              <button
                onClick={() => onSave(appearance, name.trim() || initName, gender)}
                style={{
                  flex: 2,
                  fontFamily: "'Luckiest Guy','Fredoka',cursive",
                  fontSize: 16,
                  letterSpacing: 2,
                  padding: '8px',
                  borderRadius: 10,
                  border: '2px solid #2f6d1f',
                  background: 'linear-gradient(180deg,#9fdd5f,#63b23a)',
                  color: '#fff2d6',
                  WebkitTextStroke: '1px #2f6d1f',
                  paintOrder: 'stroke fill',
                  cursor: 'pointer',
                  boxShadow: '0 3px 0 #1e4a10',
                }}
              >
                SAVE LOOK
              </button>
            </div>
          </div>
        </div>

        {/* ★ decoration */}
        <div style={{
          position: 'absolute', top: 24, left: 220, fontSize: 16, color: '#e8d030',
          filter: 'drop-shadow(0 1px 0 #8a6a00)',
        }}>★</div>
      </div>
    </div>
  );
};

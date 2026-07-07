'use client';

import React, { useState } from 'react';
import { Palette, User, Scissors, Shield, Shirt, Users, ChevronDown, Moon } from 'lucide-react';
import { SKIN_TONES, HAIR_COLORS, GLOVE_COLORS, SHOE_COLORS, TOP_COLORS, type BodyType } from '@/data/fighterSprites';
import { useFighterCustomization } from '@/hooks/useFighterCustomization';
import './FighterCustomizer.css';

interface ColorOption {
  id: number;
  name: string;
  hex: string;
}

interface ColorRowProps {
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  options: ColorOption[];
  selected: number;
  onChange: (id: number) => void;
  isLocked?: (id: number) => boolean;
}

function ColorRow({ label, icon: Icon, options, selected, onChange, isLocked }: ColorRowProps) {
  return (
    <div className="customizer-row">
      <div className="customizer-row__header">
        <Icon size={16} className="customizer-row__icon" />
        <span className="customizer-row__label">{label}</span>
        <span className="customizer-row__value">{options[selected]?.name}</span>
      </div>
      <div className="customizer-row__swatches">
        {options.map(opt => {
          const locked = isLocked ? isLocked(opt.id) : false;
          return (
            <button
              key={opt.id}
              className={`customizer-swatch ${selected === opt.id ? 'customizer-swatch--active' : ''} ${locked ? 'customizer-swatch--locked' : ''}`}
              style={{ backgroundColor: opt.hex }}
              onClick={() => {
                if (locked) {
              alert(`This option is locked. Earn Seed Coins and unlock it in the Kitchen Shop!`);
            } else {
              onChange(opt.id);
            }
          }}
          aria-label={`${label}: ${opt.name}${locked ? ' (Locked)' : ''}`}
          title={`${opt.name}${locked ? ' (Locked — Visit Kitchen Shop)' : ''}`}
        >
          {selected === opt.id && !locked && (
            <span className="customizer-swatch__check" aria-hidden="true">✓</span>
          )}
          {locked && (
            <span className="customizer-swatch__lock" aria-hidden="true">🔒</span>
          )}
        </button>
      );
    })}
  </div>
</div>
);
}

const BODY_TYPES: { id: BodyType; label: string }[] = [
{ id: 'male', label: 'Male' },
{ id: 'female', label: 'Female' },
];

export default function FighterCustomizer() {
const { customization: custom, update } = useFighterCustomization();
const [isOpen, setIsOpen] = useState(false);
const [manualSleep, setManualSleep] = useState(() => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('PlateWiki_manual_sleep') === 'true';
  }
  return false;
});

const handleToggleSleep = () => {
  const next = !manualSleep;
  setManualSleep(next);
  localStorage.setItem('PlateWiki_manual_sleep', String(next));
  window.dispatchEvent(new Event('storage'));
  window.dispatchEvent(new Event('platewiki:sleep-toggled'));
};

if (!custom) return null;

const isFemale = custom.bodyType === 'female';

// Preview swatches for the collapsed state
const previewColors = [
SKIN_TONES[custom.skinTone]?.hex,
HAIR_COLORS[custom.hairColor]?.hex,
GLOVE_COLORS[custom.gloveColor]?.hex,
SHOE_COLORS[custom.shoeColor]?.hex,
...(isFemale ? [TOP_COLORS[custom.topColor]?.hex] : []),
].filter(Boolean);

const unlocked = custom.unlockedGear || [];

return (
<div className={`fighter-customizer glass-panel ${isOpen ? 'fighter-customizer--open' : ''}`}>
  <button
    className="fighter-customizer__toggle"
    onClick={() => setIsOpen(o => !o)}
    aria-expanded={isOpen}
  >
    <div className="fighter-customizer__toggle-left">
      <Palette size={18} />
      <span className="fighter-customizer__title">Customize Avatar</span>
    </div>

        <div className="fighter-customizer__toggle-right">
          {!isOpen && (
            <div className="fighter-customizer__preview" aria-hidden="true">
              {previewColors.map((hex, i) => (
                <span key={i} className="fighter-customizer__preview-dot" style={{ backgroundColor: hex }} />
              ))}
            </div>
          )}
          <ChevronDown size={18} className={`fighter-customizer__chevron ${isOpen ? 'fighter-customizer__chevron--open' : ''}`} />
        </div>
      </button>

      {isOpen && (
        <div className="fighter-customizer__body">
          <div className="customizer-row">
            <div className="customizer-row__header">
              <Users size={16} className="customizer-row__icon" />
              <span className="customizer-row__label">Avatar</span>
              <span className="customizer-row__value">{isFemale ? 'Female' : 'Male'}</span>
            </div>
            <div className="customizer-body-toggle" role="radiogroup" aria-label="Avatar body type">
              {BODY_TYPES.map(bt => (
                <button
                  key={bt.id}
                  role="radio"
                  aria-checked={custom.bodyType === bt.id}
                  className={`customizer-body-btn ${custom.bodyType === bt.id ? 'customizer-body-btn--active' : ''}`}
                  onClick={() => update({ bodyType: bt.id })}
                >
                  {bt.label}
                </button>
              ))}
            </div>
          </div>
          <ColorRow
            label="Skin"
            icon={User}
            options={SKIN_TONES}
            selected={custom.skinTone}
            onChange={(id) => update({ skinTone: id })}
          />
          <ColorRow
            label="Hair"
            icon={Scissors}
            options={HAIR_COLORS}
            selected={custom.hairColor}
            onChange={(id) => update({ hairColor: id })}
            isLocked={(id) => {
              if (id === 2) return !unlocked.includes('hair-blonde');
              if (id === 5) return !unlocked.includes('hair-platinum');
              return false;
            }}
          />
          <ColorRow
            label="Hand Gear"
            icon={Shield}
            options={GLOVE_COLORS}
            selected={custom.gloveColor}
            onChange={(id) => update({ gloveColor: id })}
            isLocked={(id) => {
              if (id === 4) return !unlocked.includes('glove-gold');
              if (id === 5) return !unlocked.includes('glove-green');
              return false;
            }}
          />
          <ColorRow
            label="Footwear"
            icon={Shield}
            options={SHOE_COLORS}
            selected={custom.shoeColor}
            onChange={(id) => update({ shoeColor: id })}
            isLocked={(id) => {
              if (id === 2) return !unlocked.includes('shoe-red');
              if (id === 3) return !unlocked.includes('shoe-blue');
              return false;
            }}
          />
          {isFemale && (
            <ColorRow
              label="Apron/Top"
              icon={Shirt}
              options={TOP_COLORS}
              selected={custom.topColor}
              onChange={(id) => update({ topColor: id })}
              isLocked={(id) => {
                if (id === 4) return !unlocked.includes('top-pink');
                if (id === 5) return !unlocked.includes('top-purple');
                return false;
              }}
            />
          )}
          <div className="customizer-row" style={{ marginTop: '0.5rem', borderTop: '1px dashed rgba(255,255,255,0.08)', paddingTop: '1rem' }}>
            <div className="customizer-row__header">
              <Moon size={16} className="customizer-row__icon" />
              <span className="customizer-row__label">Sleep Override (Dev)</span>
              <span className="customizer-row__value">{manualSleep ? 'Force Nighttime' : 'Auto (System)'}</span>
            </div>
            <button
              type="button"
              className={`customizer-body-btn ${manualSleep ? 'customizer-body-btn--active' : ''}`}
              onClick={handleToggleSleep}
              style={{ width: '100%', marginTop: '0.25rem' }}
            >
              {manualSleep ? '☀️ Force Daytime (Wake Up)' : '🌙 Force Nighttime (Send to Sleep)'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

import React from 'react';
import { ExternalLink } from 'lucide-react';
import {
  GloveFilledIcon,
  WrapsFilledIcon,
  HeadgearFilledIcon,
  MittsFilledIcon,
  SetFilledIcon,
  SparringGloveFilledIcon,
} from '@/components/icons/GearIcons';
import { analytics } from '../utils/analytics';
import './GearCard.css';

/** Map icon ID → filled SVG component */
const GEAR_ICONS: Record<string, React.FC<{ size?: number; className?: string }>> = {
  'glove': GloveFilledIcon,
  'sparring-glove': SparringGloveFilledIcon,
  'wraps': WrapsFilledIcon,
  'headgear': HeadgearFilledIcon,
  'mitts': MittsFilledIcon,
  'set': SetFilledIcon,
};


interface GearCardProps {
  name: string;
  description: string;
  affiliateUrl: string;
  icon: string;
  category?: string;
}

const GearCard = ({ name, description, affiliateUrl, icon, category }: GearCardProps) => {
  const handleClick = () => {
    analytics.affiliateClick(name, affiliateUrl);
  };

  const IconComponent = GEAR_ICONS[icon];

  return (
    <a
      href={affiliateUrl}
      target="_blank"
      rel="noopener noreferrer sponsored"
      className="gear-card glass-panel"
      onClick={handleClick}
      aria-label={`${name} — ${description}`}
    >
      <div className="gear-icon">
        {IconComponent ? <IconComponent size={22} className="gear-svg-icon" /> : <span className="gear-emoji">{icon}</span>}
      </div>
      <div className="gear-info">
        <h3 className="gear-name">
          {name}
          <span className="gear-badge">Partner</span>
        </h3>
        <p className="gear-desc">{description}</p>
      </div>
      <ExternalLink size={14} className="gear-link-icon" />
    </a>
  );
};

export default GearCard;




import React from 'react';
import { ExternalLink } from 'lucide-react';
import { analytics } from '../utils/analytics';
import './GearCard.css';

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

  return (
    <a
      href={affiliateUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="gear-card glass-panel"
      onClick={handleClick}
      aria-label={`${name} — ${description}`}
    >
      <div className="gear-icon">
        <span className="gear-emoji">{icon}</span>
      </div>
      <div className="gear-info">
        <h3 className="gear-name">
          {name}
        </h3>
        <p className="gear-desc">{description}</p>
      </div>
      <ExternalLink size={14} className="gear-link-icon" />
    </a>
  );
};

export default GearCard;

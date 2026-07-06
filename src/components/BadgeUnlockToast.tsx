'use client';

import React, { useEffect, useState, useCallback } from 'react';
import {
  Zap,
  Flame,
  BookOpen,
  GraduationCap,
  Award,
  Brain,
  Dumbbell,
  Timer,
  Trophy,
  type LucideIcon,
} from 'lucide-react';
import { useFighterProfile } from '@/context/FighterProfileContext';
import './BadgeUnlockToast.css';

const iconMap: Record<string, LucideIcon> = {
  Zap,
  Flame,
  BookOpen,
  GraduationCap,
  Award,
  Brain,
  Dumbbell,
  Timer,
  Trophy,
};

export default function BadgeUnlockToast() {
  const { badgeUnlockEvent, clearBadgeUnlockEvent } = useFighterProfile();
  const [visible, setVisible] = useState(false);
  const [exiting, setExiting] = useState(false);

  const dismiss = useCallback(() => {
    setExiting(true);
    const timer = setTimeout(() => {
      setVisible(false);
      setExiting(false);
      clearBadgeUnlockEvent();
    }, 350);
    return () => clearTimeout(timer);
  }, [clearBadgeUnlockEvent]);

  useEffect(() => {
    if (!badgeUnlockEvent) return;
    setVisible(true);
    setExiting(false);

    const autoHide = setTimeout(dismiss, 4000);
    return () => clearTimeout(autoHide);
  }, [badgeUnlockEvent, dismiss]);

  if (!visible || !badgeUnlockEvent) return null;

  const badge = badgeUnlockEvent;
  const Icon = iconMap[badge.icon] ?? Award;

  return (
    <div
      className={`badge-unlock-toast${exiting ? ' badge-unlock-toast--exit' : ''}`}
      style={{ '--badge-color': badge.color } as React.CSSProperties}
      role="status"
      aria-live="polite"
    >
      <span className="badge-unlock-toast__icon">
        <Icon size={20} color={badge.color} />
      </span>

      <div className="badge-unlock-toast__text">
        <span className="badge-unlock-toast__label">Badge Unlocked</span>
        <span className="badge-unlock-toast__name">{badge.name}</span>
        <span className="badge-unlock-toast__desc">{badge.description}</span>
      </div>
    </div>
  );
}

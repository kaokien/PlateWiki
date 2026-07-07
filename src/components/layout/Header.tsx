'use client';

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ChevronDown, Crown, Search, BookOpen, Scale, Timer, Info, Dumbbell, Target,
  Play, Flame, Map, Crosshair, Newspaper, GraduationCap, CalendarDays, Wand2,
  Users, Trophy, MessageCircle, ShoppingBag, Shirt, Heart,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import dynamic from 'next/dynamic';
import { useSubscription } from '@/context/SubscriptionContext';

// The ⌘K command palette is interaction-only — load its chunk on first open
// instead of shipping it (plus its CSS) with every page's initial bundle.
const GlobalSearch = dynamic(() => import('@/components/GlobalSearch'), { ssr: false });
import { useFighterProfile } from '@/context/FighterProfileContext';
import { RankIcon } from '@/components/RankIcons';
import { SignInButton, UserButton, Show, useUser } from '@clerk/nextjs';

/* ── Nav structure ─────────────────────────────────────────────────────
   Single source of truth for every header destination. Desktop renders
   the groups as dropdowns and the singles inline; mobile renders all of
   it as always-expanded titled sections so nothing hides behind a tap. */

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  external?: boolean;
}

interface NavGroup {
  label: string;
  items: NavItem[];
}

const NAV_GROUPS: NavGroup[] = [
  {
    label: 'Learn',
    items: [
      { href: '/', label: 'Anatomy Map', icon: Map },
      { href: '/foods', label: 'Foods', icon: Crosshair },
      { href: '/articles', label: 'Articles', icon: Newspaper },
      { href: '/glossary', label: 'Glossary', icon: BookOpen },
      { href: '/rules', label: 'Dietary Rules', icon: Scale },
      { href: '/course', label: 'Earthy Blueprint', icon: GraduationCap },
    ],
  },
  {
    label: 'Prep & Fuel',
    items: [
      { href: '/meals', label: 'Recipes', icon: Target },
      { href: '/recipes', label: 'Nutrients', icon: Dumbbell },
      { href: '/programs', label: 'Programs', icon: CalendarDays },
      { href: '/meal-generator', label: 'Meal Planner', icon: Wand2 },
      { href: '/kitchen', label: 'Fasting Timer', icon: Timer },
    ],
  },
  {
    label: 'Community',
    items: [
      { href: '/leaderboard', label: 'Leaderboard', icon: Trophy },
      { href: 'https://discord.gg/Vhygw7DpVM', label: 'Join the Discord', icon: MessageCircle, external: true },
      { href: '/about', label: 'About', icon: Info },
    ],
  },
  {
    label: 'Shop',
    items: [
      { href: '/shop', label: 'Kitchen Shop', icon: ShoppingBag },
      { href: '/merch', label: 'Merch', icon: Shirt },
    ],
  },
];

const NAV_SINGLES: NavItem[] = [
  { href: '/athletes', label: 'Athletes', icon: Users },
  { href: '/favorites', label: 'Saved', icon: Heart },
];

function NavLink({
  item,
  onClick,
  showIcon = false,
}: {
  item: NavItem;
  onClick?: () => void;
  showIcon?: boolean;
}) {
  const pathname = usePathname();
  // Compare without any #fragment so anchor links still mark their page active
  const isActive = !item.external && pathname === item.href.split('#')[0];
  const Icon = item.icon;
  if (item.external) {
    return (
      <a href={item.href} target="_blank" rel="noopener noreferrer" onClick={onClick}>
        {showIcon && <Icon size={16} className="nav-icon" />} {item.label}
      </a>
    );
  }
  return (
    <Link
      href={item.href}
      className={isActive ? 'active-nav' : ''}
      onClick={onClick}
      aria-current={isActive ? 'page' : undefined}
    >
      {showIcon && <Icon size={16} className="nav-icon" />} {item.label}
    </Link>
  );
}

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  // Latches true on first open — mounts the lazy GlobalSearch chunk once,
  // then keeps it mounted so open/close transitions stay instant
  const [searchEverOpened, setSearchEverOpened] = useState(false);
  const desktopNavRef = useRef<HTMLElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const hamburgerRef = useRef<HTMLButtonElement>(null);
  const { isPro, tier, trialDaysLeft } = useSubscription();
  const { rank, profile, nextRankInfo, streak } = useFighterProfile();
  const { isSignedIn } = useUser();

  // The anatomy map lives on the homepage for visitors and on the dashboard
  // for signed-in users (/ redirects there) — deep-link to whichever copy
  // the user will actually land on
  const navGroups = useMemo(() => {
    const anatomyHref = isSignedIn ? '/dashboard#body-map' : '/#body-map';
    return NAV_GROUPS.map((group) =>
      group.label === 'Learn'
        ? {
            ...group,
            items: group.items.map((item) =>
              item.label === 'Anatomy Map' ? { ...item, href: anatomyHref } : item
            ),
          }
        : group
    );
  }, [isSignedIn]);

  const closeMenus = useCallback(() => {
    setMobileMenuOpen(false);
    setOpenGroup(null);
  }, []);

  // Lock body scroll when mobile menu is open (iOS-safe)
  useEffect(() => {
    if (mobileMenuOpen) {
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.left = '0';
      document.body.style.right = '0';
      document.body.style.overflow = 'hidden';
    } else {
      const scrollY = document.body.style.top;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.left = '';
      document.body.style.right = '';
      document.body.style.overflow = '';
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY, 10) * -1);
      }
    }
    return () => {
      const scrollY = document.body.style.top;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.left = '';
      document.body.style.right = '';
      document.body.style.overflow = '';
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY, 10) * -1);
      }
    };
  }, [mobileMenuOpen]);

  // Close mobile menu on outside click
  useEffect(() => {
    if (!mobileMenuOpen) return;
    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      if (
        navRef.current &&
        !navRef.current.contains(e.target as Node) &&
        hamburgerRef.current &&
        !hamburgerRef.current.contains(e.target as Node)
      ) {
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [mobileMenuOpen]);

  // Close any open desktop dropdown on outside click
  useEffect(() => {
    if (!openGroup) return;
    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      if (desktopNavRef.current && !desktopNavRef.current.contains(e.target as Node)) {
        setOpenGroup(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [openGroup]);

  // Close menus on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (mobileMenuOpen) setMobileMenuOpen(false);
        if (openGroup) setOpenGroup(null);
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [mobileMenuOpen, openGroup]);

  // ⌘K / Ctrl+K global shortcut to open search
  const openSearch = useCallback(() => {
    setSearchEverOpened(true);
    setSearchOpen(true);
    setMobileMenuOpen(false);
  }, []);

  useEffect(() => {
    const handleSearchShortcut = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchEverOpened(true);
        setSearchOpen((prev) => !prev);
      }
    };
    document.addEventListener('keydown', handleSearchShortcut);
    return () => document.removeEventListener('keydown', handleSearchShortcut);
  }, []);

  /* ── Shared account/utility controls (desktop tail + mobile drawer foot) ── */
  const utilityControls = (
    <>
      {/* athlete Rank Chip + Streak Flame — only for signed-in users */}
      <Show when="signed-in">
        <Link
          href="/athlete"
          className="nav-rank-chip"
          onClick={closeMenus}
          style={{ '--rank-color': rank.color } as React.CSSProperties}
        >
          <span className="nav-rank-chip__ring">
            <svg viewBox="0 0 36 36" className="nav-rank-chip__ring-svg">
              <circle cx="18" cy="18" r="15.5" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.12" />
              <circle
                cx="18" cy="18" r="15.5"
                fill="none"
                stroke={rank.color}
                strokeWidth="2.5"
                strokeDasharray={`${nextRankInfo.progress * 97.4} 97.4`}
                strokeLinecap="round"
                transform="rotate(-90 18 18)"
                className="nav-rank-chip__ring-progress"
              />
            </svg>
            <RankIcon rankName={rank.name} size={16} color={rank.color} className="nav-rank-chip__icon" />
          </span>
          <span className="nav-rank-chip__text">
            <span className="nav-rank-chip__name">{rank.name}</span>
            <span className="nav-rank-chip__xp">{profile.xp} XP</span>
          </span>
          {streak > 0 && (
            <span className={`nav-rank-chip__streak${streak >= 3 ? ' nav-rank-chip__streak--hot' : ''}`}>
              <Flame size={14} fill="currentColor" />
              <span className="nav-rank-chip__streak-count">{streak}</span>
            </span>
          )}
        </Link>
        <Link href="/shop" className="nav-coins-chip" onClick={closeMenus}>
          <span className="nav-coins-chip__icon">🌱</span>
          <span className="nav-coins-chip__amount">{(profile.fightCoins || 0).toLocaleString()}</span>
        </Link>
      </Show>

      {/* Pro/Upgrade — dev only until payment processor is wired */}
      {process.env.NODE_ENV !== 'production' && (
        isPro ? (
          <Link
            href={tier === 'trial' ? '/pricing' : '/history'}
            className="nav-pro-badge"
            onClick={closeMenus}
          >
            <Crown size={12} />
            {tier === 'trial' ? `Trial · ${trialDaysLeft}d` : 'PRO'}
          </Link>
        ) : (
          <Link href="/pricing" className="nav-upgrade-btn" onClick={closeMenus}>
            Upgrade
          </Link>
        )
      )}
    </>
  );

  return (
    <>
      <header className="app-header">
        <Link href="/" className="logo" style={{ display: 'flex', alignItems: 'center' }}>
          <svg
            viewBox="0 0 24 24"
            width="22"
            height="22"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="logo-icon"
            style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '8px', color: 'var(--color-primary)' }}
          >
            <circle cx="12" cy="12" r="9" />
            <circle cx="12" cy="12" r="5" strokeWidth="1.5" strokeDasharray="2 2" opacity="0.6" />
            <path d="M8 8v3c0 .4.3.7.7.7h0c.4 0 .7-.3.7-.7V8" strokeWidth="1.5" />
            <line x1="8.7" y1="11.7" x2="8.7" y2="15.5" strokeWidth="1.5" />
            <line x1="15.3" y1="8" x2="15.3" y2="15.5" strokeWidth="1.5" />
            <path d="M15.3 8.5h1.2c.3 0 .5.3.5.5v2.5c0 .3-.2.5-.5.5h-1.2" fill="currentColor" strokeWidth="1.5" />
          </svg>
          <span><span className="logo-accent">PLATE</span>WIKI</span>
        </Link>

        {/* Desktop inline nav — hidden on mobile via CSS */}
        <nav className="nav-links nav-links--desktop" ref={desktopNavRef}>
          {navGroups.map((group) => (
            <div key={group.label} className={`nav-dropdown ${openGroup === group.label ? 'open' : ''}`}>
              <button
                className="nav-dropdown__trigger"
                onClick={() => setOpenGroup(openGroup === group.label ? null : group.label)}
                aria-expanded={openGroup === group.label}
                aria-haspopup="true"
              >
                {group.label}{' '}
                <ChevronDown
                  size={14}
                  className={`dropdown-chevron ${openGroup === group.label ? 'rotated' : ''}`}
                />
              </button>
              <div className="nav-dropdown__menu">
                {group.items.map((item) => (
                  <NavLink key={item.href} item={item} showIcon onClick={closeMenus} />
                ))}
              </div>
            </div>
          ))}

          {NAV_SINGLES.map((item) => (
            <NavLink key={item.href} item={item} onClick={closeMenus} />
          ))}

          {/* Search trigger */}
          <button className="nav-search-trigger" onClick={openSearch} aria-label="Search (⌘K)">
            <Search size={16} />
            <span className="nav-search-trigger__text">Search</span>
            <kbd className="nav-search-trigger__kbd">⌘K</kbd>
          </button>

          {utilityControls}

          {/* Clerk Auth — desktop only (mobile auth is in header bar) */}
          <span className="nav-auth-desktop">
            <Show when="signed-out">
              <SignInButton mode="modal">
                <button className="nav-signin-btn">Sign In</button>
              </SignInButton>
            </Show>
            <Show when="signed-in">
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: { width: 32, height: 32 },
                  },
                }}
              />
            </Show>
          </span>
        </nav>

        {/* Mobile header actions — auth + search + hamburger */}
        <div className="mobile-header-actions">
          {/* Mobile auth — lives in header bar, NOT in nav overlay */}
          <span className="mobile-auth-slot">
            <Show when="signed-out">
              <SignInButton mode="modal">
                <button className="mobile-signin-btn" aria-label="Sign in">
                  Sign In
                </button>
              </SignInButton>
            </Show>
            <Show when="signed-in">
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: { width: 30, height: 30 },
                    userButtonPopoverCard: {
                      zIndex: '10000',
                    },
                  },
                }}
              />
            </Show>
          </span>
          <button
            className="mobile-search-btn"
            onClick={openSearch}
            aria-label="Search"
          >
            <Search size={20} />
          </button>
          <button
            ref={hamburgerRef}
            className="hamburger"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            <span className={`hamburger-line ${mobileMenuOpen ? 'open' : ''}`} />
            <span className={`hamburger-line ${mobileMenuOpen ? 'open' : ''}`} />
            <span className={`hamburger-line ${mobileMenuOpen ? 'open' : ''}`} />
          </button>
        </div>
      </header>

      {/* Mobile nav overlay — portaled to body to escape sticky header's containing block.
          Every destination is visible in titled sections; nothing is collapsed. */}
      {mobileMenuOpen && createPortal(
        <nav
          ref={navRef}
          className="nav-links mobile-open"
          role="dialog"
          aria-modal="true"
          aria-label="Navigation menu"
        >
          <div className="mobile-nav-section">
            <div className="mobile-nav-section__title">Explore</div>
            <div className="mobile-nav-section__grid">
              {NAV_SINGLES.map((item) => (
                <NavLink key={item.href} item={item} showIcon onClick={closeMenus} />
              ))}
            </div>
          </div>
          {navGroups.map((group) => (
            <div key={group.label} className="mobile-nav-section">
              <div className="mobile-nav-section__title">{group.label}</div>
              <div className="mobile-nav-section__grid">
                {group.items.map((item) => (
                  <NavLink key={item.href} item={item} showIcon onClick={closeMenus} />
                ))}
              </div>
            </div>
          ))}
          <div className="mobile-nav-utility">
            {utilityControls}
          </div>
        </nav>,
        document.body
      )}

      {searchEverOpened && (
        <GlobalSearch isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
      )}
    </>
  );
}

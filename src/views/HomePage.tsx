'use client';
import React, { useEffect, useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight, Clock, ChevronRight, Heart, Activity, Flag, MessageSquare, BookOpen, Target, Zap, Shield, Dumbbell } from 'lucide-react';
import BoxerPlaceholder from '../components/BoxerPlaceholder';
const InteractiveBoxer = dynamic(() => import('../components/InteractiveBoxer'), {
  ssr: false,
  loading: () => <BoxerPlaceholder />,
});
const AdSlot = dynamic(() => import('../components/AdSlot'), { ssr: false });
const DailyWidget = dynamic(() => import('../components/DailyWidget'), { ssr: false });

import GearCard from '../components/GearCard';
import CoursePromo from '../components/CoursePromo';
const OnboardingOverlay = dynamic(() => import('../components/OnboardingOverlay'), { ssr: false });

import DesktopSectionNav from '../components/DesktopSectionNav';
import { analytics } from '../utils/analytics';
import { bodyParts } from '../data/bodyParts';
import { gearRecommendations } from '../data/gearRecommendations';
import { getFavorites, getRecentlyViewed } from '../utils/favorites';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { useSubscription } from '../context/SubscriptionContext';
import { getOrAssignVariant } from '../utils/abTest';
import { Show, useUser } from '@clerk/nextjs';
import './HomePage.css';

export interface TechniqueSummary {
  id: string;
  name: string;
  category: string;
}

export interface HomePageProps {
  totalTechniques: number;
  categoryCounts: Record<string, number>;
  techniqueIndex: Record<string, TechniqueSummary>;
}

const CATEGORY_CARDS = [
  { name: 'Macronutrients', Icon: Dumbbell, path: '/techniques/macronutrients', countKey: 'Macronutrients', unit: 'complex macronutrients' },
  { name: 'Hydration & Salts', Icon: Activity, path: '/techniques/hydration-salts', countKey: 'Hydration & Salts', unit: 'essential electrolytes' },
  { name: 'Micronutrients', Icon: Shield, path: '/techniques/micronutrients', countKey: 'Micronutrients', unit: 'bioavailable vitamins' },
  { name: 'Gut & Digestion', Icon: Heart, path: '/techniques/gut-digestion', countKey: 'Gut & Digestion', unit: 'fermented probiotics' },
  { name: 'Superfoods & Adaptogens', Icon: Zap, path: '/techniques/superfoods-adaptogens', countKey: 'Superfoods & Adaptogens', unit: 'herbal adaptogens' },
];

const PROGRAM_DAYS = [
  { day: 1, name: 'Hydration Prime', focus: 'Baseline electrolytes & salts' },
  { day: 2, name: 'Glycogen Saturation', focus: 'Complex slow-burn carbs' },
  { day: 3, name: 'Protein Synthesis', focus: 'Bioavailable amino acids' },
  { day: 4, name: 'Gut Optimization', focus: 'Active ferments & flora' },
  { day: 5, name: 'Cortisol Management', focus: 'Adaptogens for recovery' },
  { day: 6, name: 'Micronutrient Density', focus: 'Polyphenols & antioxidants' },
  { day: 7, name: 'Synergistic Pacing', focus: 'Putting the meal plan together' },
];

const HomePage = ({ totalTechniques, categoryCounts, techniqueIndex }: HomePageProps) => {
  const router = useRouter();
  const { isSignedIn } = useUser();
  const [abVariant, setAbVariant] = useState<'A' | 'B'>('A');
  const [recentIds, setRecentIds] = useState<any[]>([]);
  const [favIds, setFavIds] = useState<any[]>([]);
  const [joinedDiscord, setJoinedDiscord] = useState(false);

  useEffect(() => {
    setAbVariant(getOrAssignVariant('onboarding_flow'));
    setRecentIds(getRecentlyViewed());
    setFavIds(getFavorites());
    setJoinedDiscord(localStorage.getItem('joined_discord') === 'true');
  }, []);

  const recentTechniques = useMemo(() => {
    return recentIds.map(id => techniqueIndex[id]).filter(Boolean).slice(0, 4);
  }, [recentIds, techniqueIndex]);

  const favTechniques = useMemo(() => {
    return favIds.map(id => techniqueIndex[id]).filter(Boolean).slice(0, 4);
  }, [favIds, techniqueIndex]);

  const pageRef = useScrollReveal([recentTechniques, favTechniques]);

  useEffect(() => {
    if (isSignedIn) router.replace('/dashboard');
  }, [isSignedIn, router]);

  const handleJoinDiscord = () => {
    localStorage.setItem('joined_discord', 'true');
    setJoinedDiscord(true);
    analytics.customEvent('discord_join_click', { source: 'homepage' });
  };

  const handlePartSelect = (partId: string) => {
    const muscle = bodyParts[partId];
    analytics.muscleClick(muscle?.name || partId, partId);
    router.push(`/anatomy/${partId}`);
  };

  return (
    <div className="home-page" ref={pageRef}>
      <OnboardingOverlay />
      


      <div className="hero-bg"></div>

      {/* Hero Section — Split layout on desktop */}
      <section className="hero-content" id="body-map">
        <div className="hero-copy">
          <h1 className="hero-title hero-entrance">Fuel Your Body, <span className="text-primary">Master Your Meals</span></h1>
          <p className="hero-subtitle hero-entrance stagger-1">Your complete food science library — {totalTechniques} whole foods, 45 athlete recipes, and step-by-step nutrition guides built for runners, lifters, and fighters.</p>
          <div className="hero-cta-row hero-entrance stagger-2">
            <Show when="signed-out">
              <Link href="/onboarding" className="hero-cta-primary">
                <Flag size={18} /> Start Fueling Free
              </Link>
            </Show>
            <Show when="signed-in">
              <Link href="/dashboard" className="hero-cta-primary">
                <Flag size={18} /> Your Dashboard
              </Link>
            </Show>
            <Link href="/techniques" className="hero-cta-secondary">
              Browse Foods <ArrowRight size={16} />
            </Link>
          </div>
        </div>
        <div className="hero-body-map" id="body-map">
          <h2 className="section-heading hero-map-heading">Explore by <span className="text-primary">Body System</span></h2>
          <InteractiveBoxer onPartSelect={handlePartSelect} activePart={null} />
          <Link href="/workout-generator" className="body-map-cta">
            <Dumbbell size={18} />
            Build My Fuel Plan
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* Signed-out: daily widget */}
      <Show when="signed-out">
        <DailyWidget />
      </Show>

      {/* Desktop Section Navigation */}
      <DesktopSectionNav />

      {/* AD SLOT A */}
      <AdSlot id="post-hero" format="horizontal" />

      {/* Quick-Access Category Cards */}
      <section className="home-section scroll-reveal" id="categories">
        <h2 className="section-heading">Explore by Category</h2>
        <div className="category-grid">
          {CATEGORY_CARDS.map(cat => (
            <Link
              href={cat.path}
              key={cat.name}
              className="glass-panel category-card"
            >
              <span className="cat-icon"><cat.Icon size={22} /></span>
              <h3>{cat.name}</h3>
              <p>{categoryCounts[cat.countKey] || 0} {cat.unit}</p>
              <span className="card-arrow"><ArrowRight size={16} /></span>
            </Link>
          ))}
        </div>
      </section>

      {/* AD SLOT B */}
      <AdSlot id="post-categories" format="horizontal" />

      {/* Continue Learning */}
      {recentTechniques.length > 0 && (
        <section className="home-section scroll-reveal">
          <div className="section-header-row">
            <h2 className="section-heading"><Clock size={20} /> Continue Learning</h2>
            <Link href="/favorites" className="see-all-link">View All <ChevronRight size={14} /></Link>
          </div>
          <div className="mini-card-row">
            {recentTechniques.map(tech => (
              <Link href={`/technique/${tech.id}`} key={tech.id} className="glass-panel mini-card">
                <span className="mini-cat">{tech.category}</span>
                <h3>{tech.name}</h3>
                <span className="mini-read">Continue →</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Favorites */}
      {favTechniques.length > 0 && (
        <section className="home-section scroll-reveal">
          <div className="section-header-row">
            <h2 className="section-heading"><Heart size={20} className="text-primary" /> Your Favorites</h2>
            <Link href="/favorites" className="see-all-link">View All <ChevronRight size={14} /></Link>
          </div>
          <div className="mini-card-row">
            {favTechniques.map(tech => (
              <Link href={`/technique/${tech.id}`} key={tech.id} className="glass-panel mini-card">
                <span className="mini-cat">{tech.category}</span>
                <h3>{tech.name}</h3>
                <span className="mini-read">Study →</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Beginner CTA */}
      <section className="home-section scroll-reveal" id="beginner">
        <div className="beginner-cta glass-panel">
          <div className="beginner-text">
            <span className="beginner-badge"><Flag size={14} /> START HERE</span>
            <h2>New to Performance Fueling?</h2>
            <p>Begin with our 7-Day Clean Fueling program. Learn glycogen loading, protein repair, hydration balance, and stress adaptation.</p>
            <Link href="/programs" className="beginner-btn">
              Start 7-Day Program <ArrowRight size={16} />
            </Link>
          </div>
          <div className="beginner-preview">
            <div className="program-timeline">
              {PROGRAM_DAYS.map(d => (
                <div className={`timeline-day ${d.day === 1 ? 'active' : ''}`} key={d.day}>
                  <span className="timeline-marker">{d.day}</span>
                  <div className="timeline-info">
                    <span className="timeline-name">{d.name}</span>
                    <span className="timeline-focus">{d.focus}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Discord Community Section */}
      <section className="home-section scroll-reveal" id="community">
        <div className="discord-community-banner glass-panel">
          <div className="discord-community-content">
            <span className="discord-badge"><MessageSquare size={14} /> ONLINE KITCHEN</span>
            <h2>{joinedDiscord ? "Welcome to the Kitchen" : "Join Our Fueling Discord"}</h2>
            <p className="discord-subtitle">
              {joinedDiscord 
                ? "Jump right back in to track your macro goals, share recipe photos, and chat with the community."
                : "Fuel, log your daily intake, and get feedback on your sports nutrition plan with 400+ athletes worldwide."
              }
            </p>
            
            <div className="discord-channels-grid">
              <div className="discord-channel-group">
                <h4>🌱 The Fuel</h4>
                <div className="discord-channel-tag-wrapper">
                  <span className="discord-channel-tag">#macro-goals</span>
                  <span className="discord-channel-tag">#recipe-swap</span>
                  <span className="discord-channel-tag">#athlete-fuel</span>
                </div>
              </div>
              <div className="discord-channel-group">
                <h4>🤝 Community</h4>
                <div className="discord-channel-tag-wrapper">
                  <span className="discord-channel-tag">#locker-room</span>
                  <span className="discord-channel-tag">#ask-the-nutritionist</span>
                  <span className="discord-channel-tag">#lifestyle</span>
                </div>
              </div>
            </div>
            
            <a 
              href={joinedDiscord ? "discord://discord.gg/Vhygw7DpVM" : "https://discord.gg/Vhygw7DpVM"}
              onClick={handleJoinDiscord}
              target="_blank" 
              rel="noopener noreferrer" 
              className="discord-btn"
            >
              {joinedDiscord ? "Open Discord App" : "Enter the Kitchen Community"} <ArrowRight size={16} />
            </a>
          </div>
        </div>
      </section>

      {/* Course Upsell */}
      <section className="home-section scroll-reveal">
        <CoursePromo location="homepage" variant="banner" />
      </section>

      {/* FAQ Section */}
      <section className="home-section scroll-reveal" id="faq">
        <h2 className="section-heading">Frequently Asked Questions</h2>
        <div className="home-faq">
          <details className="glass-panel faq-item">
            <summary>Is FoodWiki free to use?</summary>
            <p>
              Yes. The entire food library — all {totalTechniques} clean ingredients with step-by-step benefits,
              biological synergies, and preparation parameters — is free and always will be. We also offer
              free tools including a digestion timer, custom meal plans, and interactive physiological map.
              Optional premium features and the Sports Fueling course are available for those who want to go
              deeper.
            </p>
          </details>
          <details className="glass-panel faq-item">
            <summary>Can I optimize my nutrition from a website?</summary>
            <p>
              A website cannot replace a certified sports dietitian. However, FoodWiki serves as an excellent reference layer that complements your daily meals — a guide to check nutrient synergies and recovery protocols. Many athletes have used structured resources like this to build a solid baseline of clean sports nutrition.
            </p>
          </details>
          <details className="glass-panel faq-item">
            <summary>What makes FoodWiki different from YouTube cooking channels?</summary>
            <p>
              YouTube is great for recipe videos, but the information is scattered across thousands of
              channels with varying quality and contradictory advice. FoodWiki organizes every food and nutrient into
              a structured database where each entry includes the same comprehensive format: steps, physiological biomarkers,
              mistakes to avoid, pro tips, prep parameters, and links to related items.
            </p>
          </details>
          <details className="glass-panel faq-item">
            <summary>Do I need a kitchen scale to use FoodWiki?</summary>
            <p>
              No equipment is required to start learning. You can learn about clean foods, nutrient synergies, and lifestyle changes immediately. As you progress, simple tools like a cast-iron skillet, a high-speed blender, or a kitchen scale will enhance your preparation. Our guides note which tools are recommended for each recipe.
            </p>
          </details>
          <details className="glass-panel faq-item">
            <summary>Who writes the food and nutrition content?</summary>
            <p>
              All technique pages are written and reviewed with input from experienced sports nutritionists and physical trainers, cross-referencing multiple verified science sources and updating content based on community feedback to ensure accuracy.
            </p>
          </details>
        </div>
        <div className="post-section-cta scroll-reveal">
          <Link href="/onboarding" className="hero-cta-primary">
            <Flag size={18} /> Start Fueling Free
          </Link>
        </div>
      </section>

      {/* AD SLOT C */}
      <AdSlot id="pre-gear" format="horizontal" />

      <section className="home-section scroll-reveal" id="gear">
        <h2 className="section-heading">Essential Kitchen Tools</h2>
        <p className="section-sub">The tools and gear every health enthusiast needs to build a vibrant kitchen.</p>
        <div className="gear-row">
          {gearRecommendations.slice(0, 4).map(gear => (
            <GearCard key={gear.id} {...gear} />
          ))}
        </div>
      </section>

      {/* What You'll Learn */}
      <section className="home-section scroll-reveal" id="learn">
        <h2 className="section-heading">What You&apos;ll Learn</h2>
        <div className="home-intro-text">
          <div className="learn-card">
            <span className="learn-card-icon"><BookOpen size={24} /></span>
            <h3>{totalTechniques}-Food Library</h3>
            <p>
              Every food page includes active compound breakdowns, metabolic benefits, mistakes to avoid, and prep parameters you need to build the physical attributes behind each movement.
            </p>
          </div>
          <div className="learn-card">
            <span className="learn-card-icon"><Target size={24} /></span>
            <h3>Goal-Aware Fueling</h3>
            <p>
              Browse food options tailored to your physical focus: runners, weightlifters, or endurance fighters. Learn nutrient synergies and clean fueling guides.
            </p>
          </div>
          <div className="learn-card">
            <span className="learn-card-icon"><Activity size={24} /></span>
            <h3>Physiology Target Mapping</h3>
            <p>
              Our interactive body silhouette connects each system to the foods that support it, so you understand not just what to eat but how your body processes nutrients.
            </p>
          </div>
        </div>
        <div className="post-section-cta">
          <Link href="/onboarding" className="hero-cta-primary">
            <Flag size={18} /> Start Fueling Free
          </Link>
        </div>
      </section>

      {/* AD SLOT D */}
      <AdSlot id="pre-footer" format="horizontal" />
    </div>
  );
};

export default HomePage;

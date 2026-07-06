'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Trophy, Flame, Dumbbell, RefreshCw } from 'lucide-react';
import { RANK_TIERS, getRankForXP } from '@/utils/fighterProfile';
import PixelFighter from '@/components/PixelFighter';
import './LeaderboardPage.css';

interface LeaderboardEntry {
  rank: number;
  displayName: string;
  xp: number;
  currentStreak: number;
  workoutsCompleted: number;
}

interface LeaderboardData {
  entries: LeaderboardEntry[];
  you: { rank: number; xp: number } | null;
}

type LoadState = 'loading' | 'ready' | 'error';

export default function LeaderboardPage() {
  const [data, setData] = useState<LeaderboardData | null>(null);
  const [state, setState] = useState<LoadState>('loading');

  const load = () => {
    setState('loading');
    fetch('/api/leaderboard')
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((json: LeaderboardData) => {
        setData(json);
        setState('ready');
      })
      .catch(() => setState('error'));
  };

  useEffect(load, []);

  const entries = data?.entries ?? [];
  const podium = entries.slice(0, 3);
  const rest = entries.slice(3);

  return (
    <div className="leaderboard-page">
      <header className="leaderboard-header">
        <h1>
          GLOBAL <span className="text-primary">LEADERBOARD</span>
        </h1>
        <p className="leaderboard-sub">
          Top fighters ranked by training XP — earned from workouts, technique study, quizzes, and streaks.
        </p>
        {data?.you && (
          <div className="leaderboard-you-banner">
            <Trophy size={16} />
            You&apos;re ranked <strong>#{data.you.rank}</strong> with {data.you.xp.toLocaleString()} XP
          </div>
        )}
      </header>

      {state === 'loading' && (
        <div className="leaderboard-status">Loading rankings…</div>
      )}

      {state === 'error' && (
        <div className="leaderboard-status">
          Couldn&apos;t load the leaderboard.
          <button className="leaderboard-retry" onClick={load}>
            <RefreshCw size={14} /> Retry
          </button>
        </div>
      )}

      {state === 'ready' && entries.length === 0 && (
        <div className="leaderboard-status">
          No ranked fighters yet — <Link href="/dashboard">start training</Link> to claim the top spot.
        </div>
      )}

      {state === 'ready' && podium.length > 0 && (
        <>
          <div className="leaderboard-podium">
            {/* visual order: 2nd, 1st, 3rd */}
            {[podium[1], podium[0], podium[2]].filter(Boolean).map((entry) => {
              const tier = getRankForXP(entry.xp);
              return (
                <div
                  key={entry.rank}
                  className={`podium-card podium-card--${entry.rank}`}
                  style={{ borderColor: tier.color }}
                >
                  <div className="podium-place" style={{ color: tier.color }}>#{entry.rank}</div>
                  <PixelFighter rankName={tier.name} size={entry.rank === 1 ? 'lg' : 'md'} animation="idle" />
                  <div className="podium-name">{entry.displayName}</div>
                  <div className="podium-tier" style={{ color: tier.color }}>{tier.name}</div>
                  <div className="podium-xp">{entry.xp.toLocaleString()} XP</div>
                </div>
              );
            })}
          </div>

          {rest.length > 0 && (
            <ol className="leaderboard-list" start={4}>
              {rest.map((entry) => {
                const tier = getRankForXP(entry.xp);
                const isYou = data?.you?.rank === entry.rank;
                return (
                  <li key={entry.rank} className={`leaderboard-row ${isYou ? 'leaderboard-row--you' : ''}`}>
                    <span className="row-rank">#{entry.rank}</span>
                    <span className="row-name">
                      {entry.displayName}
                      {isYou && <span className="row-you-badge">YOU</span>}
                    </span>
                    <span className="row-tier" style={{ color: tier.color }}>{tier.name}</span>
                    <span className="row-stat" title="Current streak">
                      <Flame size={13} /> {entry.currentStreak}
                    </span>
                    <span className="row-stat" title="Workouts completed">
                      <Dumbbell size={13} /> {entry.workoutsCompleted}
                    </span>
                    <span className="row-xp">{entry.xp.toLocaleString()} XP</span>
                  </li>
                );
              })}
            </ol>
          )}

          <div className="leaderboard-tiers">
            <h2>RANK TIERS</h2>
            <div className="leaderboard-tier-chips">
              {RANK_TIERS.map((tier) => (
                <span key={tier.name} className="tier-chip" style={{ borderColor: tier.color, color: tier.color }}>
                  {tier.name} · {tier.minXP.toLocaleString()}+ XP
                </span>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

'use client';
import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import Link from 'next/link';
import { Dumbbell, Trophy, Flame, Clock, Calendar, ChevronRight, BarChart3 } from 'lucide-react';
import { useSubscription } from '../context/SubscriptionContext';
import AuthGate from '../components/AuthGate';
import { getWorkoutLog, getWorkoutStats, type WorkoutLogRecord } from '../utils/storage';
import { techniques } from '../data/techniques';
import './TrainingHistoryPage.css';

const TrainingHistoryPage = () => {
  const { isPro } = useSubscription();
  const { user, isLoaded } = useUser();
  const [log, setLog] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    setLog(getWorkoutLog());
    setStats(getWorkoutStats());
  }, []);

  useEffect(() => {
    const handleSyncComplete = () => {
      setLog(getWorkoutLog());
      setStats(getWorkoutStats());
    };
    window.addEventListener('cloud-sync-complete', handleSyncComplete);
    return () => window.removeEventListener('cloud-sync-complete', handleSyncComplete);
  }, []);

  if (isLoaded && !user) {
    return (
      <div className="training-history-page">
        <AuthGate feature="Training History" description="Sign in to track your workouts, streaks, and training stats." />
      </div>
    );
  }

  // Group log entries by date
  const groupByDate = (entries: WorkoutLogRecord[]) => {
    const groups: Record<string, WorkoutLogRecord[]> = {};
    entries.forEach(entry => {
      const date = entry.completedAt.split('T')[0];
      if (!groups[date]) groups[date] = [];
      groups[date].push(entry);
    });
    return Object.entries(groups);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr + 'T00:00:00');
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    if (dateStr === today.toISOString().split('T')[0]) return 'Today';
    if (dateStr === yesterday.toISOString().split('T')[0]) return 'Yesterday';

    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatTime = (isoStr: string) => {
    return new Date(isoStr).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  const grouped = groupByDate(log);

  const getLast7Days = () => {
    const result: string[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      result.push(d.toISOString().split('T')[0]);
    }
    return result;
  };

  const last7Days = getLast7Days();
  const workoutsByDay = last7Days.map(dateStr => {
    const count = log.filter(entry => entry.completedAt.split('T')[0] === dateStr).length;
    return {
      date: dateStr,
      dayName: new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'short' }),
      count
    };
  });
  const maxCount = Math.max(...workoutsByDay.map(d => d.count), 1);

  const getCategoryDistribution = () => {
    const distribution: Record<string, number> = {
      'Punches': 0,
      'Defense': 0,
      'Footwork': 0,
      'Conditioning': 0,
      'Combinations': 0,
    };
    
    let totalMapped = 0;
    
    log.forEach(entry => {
      let category = '';
      if (entry.techniqueId) {
        const tech = (techniques as any)[entry.techniqueId];
        if (tech && tech.category) {
          category = tech.category;
        } else if (entry.workoutId?.includes('interval')) {
          if (entry.workoutId.includes('Punches')) category = 'Punches';
          else if (entry.workoutId.includes('Defense')) category = 'Defense';
          else if (entry.workoutId.includes('Footwork')) category = 'Footwork';
          else if (entry.workoutId.includes('Conditioning')) category = 'Conditioning';
          else if (entry.workoutId.includes('Combinations')) category = 'Combinations';
        }
      }
      
      if (!category) {
        category = 'Punches';
      }
      
      if (category === 'Ring IQ' || category === 'Tactics') category = 'Defense';
      if (category.includes('Conditioning') || category.includes('Drill')) category = 'Conditioning';
      if (category.includes('Combo') || category.includes('Combination')) category = 'Combinations';
      
      if (distribution[category] !== undefined) {
        distribution[category]++;
        totalMapped++;
      } else {
        distribution['Punches']++;
        totalMapped++;
      }
    });

    return { distribution, totalMapped };
  };

  const { distribution, totalMapped } = getCategoryDistribution();

  return (
    <div className="th-page">
      <div className="th-header">
        <h1>Training <span style={{ color: 'var(--color-primary)' }}>History</span></h1>
        <p>Every completed workout, tracked.</p>
      </div>

      {/* Stats */}
      {stats && (
        <div className="th-stats">
          <div className="th-stat glass-panel">
            <span className="th-stat-value accent">{stats.totalWorkouts}</span>
            <span className="th-stat-label">Total Workouts</span>
          </div>
          <div className="th-stat glass-panel">
            <span className="th-stat-value amber">{stats.streak}</span>
            <span className="th-stat-label">Day Streak</span>
          </div>
          <div className="th-stat glass-panel">
            <span className="th-stat-value green">{stats.thisWeek}</span>
            <span className="th-stat-label">This Week</span>
          </div>
          <div className="th-stat glass-panel">
            <span className="th-stat-value">{stats.totalSets}</span>
            <span className="th-stat-label">Total Sets</span>
          </div>
        </div>
      )}

      {log.length > 0 && (
        <div className="th-charts-grid mt-6">
          <div className="th-chart-card glass-panel">
            <h3>Weekly Training Volume</h3>
            <p className="text-muted">Workouts completed per day</p>
            <div className="bar-chart-container mt-4">
              {workoutsByDay.map((day, idx) => {
                const heightPct = (day.count / maxCount) * 100;
                return (
                  <div key={idx} className="bar-chart-col">
                    <div className="bar-chart-val">{day.count > 0 ? day.count : ''}</div>
                    <div className="bar-chart-track">
                      <div 
                        className={`bar-chart-fill ${day.count > 0 ? 'active' : ''}`} 
                        style={{ height: `${day.count > 0 ? Math.max(heightPct, 12) : 0}%` }}
                      />
                    </div>
                    <div className="bar-chart-label">{day.dayName}</div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="th-chart-card glass-panel">
            <h3>Technique Category Focus</h3>
            <p className="text-muted">Target training focus distribution</p>
            <div className="focus-distribution-container mt-4">
              {Object.entries(distribution).map(([cat, count]) => {
                const pct = totalMapped > 0 ? Math.round((count / totalMapped) * 100) : 0;
                return (
                  <div key={cat} className="focus-row">
                    <div className="focus-label-row">
                      <span className="focus-name">{cat}</span>
                      <span className="focus-pct">{pct}% ({count})</span>
                    </div>
                    <div className="focus-bar-track">
                      <div 
                        className={`focus-bar-fill ${cat.toLowerCase()}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Log */}
      {log.length === 0 ? (
        <div className="th-empty glass-panel mt-6">
          <Dumbbell size={40} className="th-empty-icon" />
          <h3>No workouts logged yet</h3>
          <p>Complete a gym workout to see your history here.</p>
          <Link href="/workout" className="th-empty-cta">
            <Dumbbell size={16} /> Browse Workouts
          </Link>
        </div>
      ) : (
        <div className="mt-8">
          <h2 className="th-log-title">
            <BarChart3 size={18} /> Workout Log
          </h2>

          {grouped.map(([date, entries]) => (
            <div key={date} className="th-day-group">
              <div className="th-day-label">{formatDate(date)}</div>
              <div className="th-log-list">
                {entries.map(entry => (
                  <Link
                    href={`/technique/${entry.techniqueId}/workout`}
                    key={entry.id}
                    className="th-log-entry glass-panel"
                  >
                    <div className="th-log-icon">
                      <Dumbbell size={18} />
                    </div>
                    <div className="th-log-body">
                      <p className="th-log-name">{entry.workoutTitle}</p>
                      <div className="th-log-meta">
                        <span><Clock size={11} /> {entry.duration}</span>
                        <span><Trophy size={11} /> {entry.exercisesCompleted} exercises</span>
                        <span><Flame size={11} /> {entry.totalSets} sets</span>
                      </div>
                    </div>
                    <div className="th-log-date">
                      {formatTime(entry.completedAt)}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TrainingHistoryPage;

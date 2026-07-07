'use client';
import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ChevronLeft, ChevronRight, ChevronDown, CheckCircle, Circle, Play, BookOpen, RotateCcw } from 'lucide-react';
import { programs, type ProgramDay } from '../data/programs';
import { techniques } from '../data/foods';
import { getProgramProgress, completeProgramDay, startProgram, resetProgram } from '../utils/storage';
import { analytics } from '../utils/analytics';
import { useStance } from '../context/StanceContext';
import { useSubscription, FREE_PROGRAM_DAYS } from '../context/SubscriptionContext';
import { parseStanceText } from '../utils/stanceParser';
import ProGate from '../components/ProGate';
import ProBadge from '../components/ProBadge';
import AdBanner from '../components/AdBanner';
import './ProgramsPage.css'; // Shared CSS

// Phase/week grouping for long programs
interface PhaseGroup {
  phase: string;
  weeks: { weekNum: number; label: string; days: ProgramDay[] }[];
}

function getPhaseGroups(programId: string, days: ProgramDay[]): PhaseGroup[] | null {
  // Only group programs with phases defined
  if (programId === 'gym-boxing-12week') {
    const phases = [
      { phase: 'Phase 1 — Foundation', start: 1, end: 20 },
      { phase: 'Phase 2 — Development', start: 21, end: 40 },
      { phase: 'Phase 3 — Performance', start: 41, end: 60 },
    ];
    return phases.map(p => {
      const phaseDays = days.filter(d => d.day >= p.start && d.day <= p.end);
      const weeks: { weekNum: number; label: string; days: ProgramDay[] }[] = [];
      for (let i = 0; i < phaseDays.length; i += 5) {
        const weekDays = phaseDays.slice(i, i + 5);
        const weekNum = Math.ceil(weekDays[0].day / 5);
        weeks.push({ weekNum, label: `Week ${weekNum}`, days: weekDays });
      }
      return { phase: p.phase, weeks };
    });
  }
  return null;
}

const ProgramPage = () => {
  const params = useParams<{ id: string }>();
  const id = params?.id ?? '';
  const program = programs[id];
  const [progress, setProgress] = useState<any>(null);
  const [expandedWeeks, setExpandedWeeks] = useState<Set<number>>(new Set());
  const { isSouthpaw } = useStance();
  const { isPro, isProgramFree } = useSubscription();
  const programIsFree = isProgramFree(id);
  const hasFullAccess = isPro || programIsFree;

  const phaseGroups = useMemo(() => {
    if (!program) return null;
    return getPhaseGroups(id, program.days);
  }, [id, program]);

  useEffect(() => {
    if (program) {
      const p = getProgramProgress(id);
      setProgress(p || { currentDay: 1, completedDays: [] });
      
      analytics.customEvent('program_view', {
        program_id: id,
        program_title: program.title
      });
    }
  }, [id, program]);

  // Auto-expand the week containing the current day
  useEffect(() => {
    if (progress && phaseGroups) {
      const currentWeek = Math.ceil((progress.currentDay || 1) / 5);
      setExpandedWeeks(new Set([currentWeek]));
    }
  }, [progress, phaseGroups]);

  if (!program) {
    return (
      <div className="not-found page-content text-center">
        <h1>PROGRAM NOT FOUND</h1>
        <Link href="/programs" className="btn mt-4">Browse Programs</Link>
      </div>
    );
  }

  const handleCompleteDay = (dayNum: number) => {
    const updated = completeProgramDay(id, dayNum);
    setProgress(updated);
    
    analytics.customEvent('program_day_complete', {
      program_id: id,
      day: dayNum
    });
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset your progress?')) {
      resetProgram(id);
      setProgress({ currentDay: 1, completedDays: [] });
    }
  };

  const toggleWeek = (weekNum: number) => {
    setExpandedWeeks(prev => {
      const next = new Set(prev);
      if (next.has(weekNum)) next.delete(weekNum);
      else next.add(weekNum);
      return next;
    });
  };

  const completedCount = progress ? progress.completedDays.length : 0;
  const isAllComplete = completedCount === program.days.length;

  const renderDayCard = (dayData: ProgramDay) => {
    const isCompleted = progress?.completedDays.includes(dayData.day);
    const isCurrent = progress?.currentDay === dayData.day;
    let statusClass = '';
    if (isCompleted) statusClass = 'completed';
    else if (isCurrent) statusClass = 'current';
    else statusClass = 'locked';

    const dayLocked = !hasFullAccess && dayData.day > FREE_PROGRAM_DAYS;

    return (
      <div key={dayData.day} className={`day-card card ${statusClass}`}>
        <div className="day-header">
          <h2>Day {dayData.day}: {dayData.title} {dayLocked && <ProBadge />}</h2>
          {isCompleted ? (
            <CheckCircle className="text-primary" size={28} />
          ) : (
            <Circle className="text-secondary" size={28} />
          )}
        </div>
        <p className="day-desc">{dayData.description}</p>

        <div className="day-tasks">
          {dayLocked ? (
            <ProGate
              feature={`Day ${dayData.day}: ${dayData.title}`}
              description={`Unlock all ${program.days.length} days of ${program.title} with Pro.`}
            >
              <div className="task-item learn-task" style={{ opacity: 0.3 }}>
                <BookOpen size={18} />
                <div className="task-content">
                  <span className="task-label">LEARN:</span> Locked
                </div>
              </div>
            </ProGate>
          ) : (
            dayData.tasks.map((task, idx) => {
              if (task.type === 'learn') {
                const tech = techniques[task.techniqueId];
                if (!tech) return null;
                return (
                  <Link href={`/food/${task.techniqueId}`} key={idx} className="task-item learn-task">
                    <BookOpen size={18} />
                    <div className="task-content">
                      <span className="task-label">LEARN:</span> {parseStanceText(tech.name, isSouthpaw)}
                    </div>
                    <ChevronRight size={16} className="forward-icon" />
                  </Link>
                );
              } else {
                return (
                  <div key={idx} className="task-item practice-task">
                    <Play size={18} />
                    <div className="task-content">
                      <span className="task-label">PRACTICE:</span> {parseStanceText(task.description, isSouthpaw)}
                    </div>
                  </div>
                );
              }
            })
          )}
        </div>

        {!isCompleted && isCurrent && !dayLocked && (
          <button className="complete-day-btn" onClick={() => handleCompleteDay(dayData.day)}>
            MARK DAY {dayData.day} COMPLETE
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="program-detail-page">
<div className="breadcrumb">
        <Link href="/programs" className="back-link"><ChevronLeft size={20} /> All Programs</Link>
      </div>

      <div className="program-hero card">
        <div className="program-hero-header">
          <span className={`level-badge ${program.level.toLowerCase()}`}>{program.level}</span>
          <span className="duration-badge">{program.duration}</span>
        </div>
        <h1>{program.title}</h1>
        <p className="description">{program.description}</p>
        
        <div className="program-hero-progress">
          <div className="progress-stats">
            <span>Progress: {completedCount} / {program.days.length} Days</span>
            <span>{Math.round((completedCount / program.days.length) * 100)}%</span>
          </div>
          <div className="progress-bar-bg">
            <div className="progress-bar-fill" style={{ width: `${(completedCount / program.days.length) * 100}%` }}></div>
          </div>
          {completedCount > 0 && (
            <button className="reset-progress-btn" onClick={handleReset}>
              <RotateCcw size={12} /> Reset Progress
            </button>
          )}
        </div>
      </div>

      {phaseGroups ? (
        /* Grouped layout for long programs */
        <div className="program-phases">
          {phaseGroups.map((phase, pi) => {
            const phaseDays = phase.weeks.flatMap(w => w.days);
            const phaseCompleted = phaseDays.filter(d => progress?.completedDays.includes(d.day)).length;
            const phaseTotal = phaseDays.length;
            const phasePercent = Math.round((phaseCompleted / phaseTotal) * 100);

            return (
              <div key={pi} className="program-phase">
                <div className="phase-header">
                  <h2 className="phase-title">{phase.phase}</h2>
                  <div className="phase-progress-mini">
                    <span>{phaseCompleted}/{phaseTotal} days</span>
                    <div className="phase-bar-bg">
                      <div className="phase-bar-fill" style={{ width: `${phasePercent}%` }}></div>
                    </div>
                  </div>
                </div>

                {phase.weeks.map(week => {
                  const isExpanded = expandedWeeks.has(week.weekNum);
                  const weekCompleted = week.days.filter(d => progress?.completedDays.includes(d.day)).length;
                  const weekHasCurrent = week.days.some(d => progress?.currentDay === d.day);

                  return (
                    <div key={week.weekNum} className={`program-week ${weekHasCurrent ? 'week-current' : ''}`}>
                      <button
                        className={`week-toggle ${isExpanded ? 'expanded' : ''}`}
                        onClick={() => toggleWeek(week.weekNum)}
                        aria-expanded={isExpanded}
                      >
                        <ChevronDown size={18} className="week-chevron" />
                        <span className="week-label">{week.label}</span>
                        <span className="week-day-range">
                          Days {week.days[0].day}–{week.days[week.days.length - 1].day}
                        </span>
                        <span className="week-progress-badge">
                          {weekCompleted}/{week.days.length}
                          {weekCompleted === week.days.length && ' ✓'}
                        </span>
                      </button>

                      {isExpanded && (
                        <div className="week-days">
                          {week.days.map(renderDayCard)}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      ) : (
        /* Flat layout for shorter programs */
        <div className="program-days">
          {program.days.map(renderDayCard)}
        </div>
      )}

      {isAllComplete && (
        <div className="program-complete card text-center mt-8">
          <h1>🏆 PROGRAM COMPLETE 🏆</h1>
          <p>Incredible work. You have completed all {program.days.length} days of {program.title}.</p>
          <Link href="/programs" className="btn mt-4">Find Your Next Challenge</Link>
        </div>
      )}

      <div className="mt-8">
        <AdBanner />
      </div>
    </div>
  );
};

export default ProgramPage;

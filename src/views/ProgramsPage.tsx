'use client';
import React from 'react';
import Link from 'next/link';
import { Calendar, Play, CheckCircle } from 'lucide-react';
import { programs } from '../data/programs';
import { getProgramsProgress } from '../utils/storage';
import { useSubscription } from '../context/SubscriptionContext';
import ProBadge from '../components/ProBadge';
import AdBanner from '../components/AdBanner';
import './ProgramsPage.css';

const ProgramsPage = () => {
  const progress = getProgramsProgress();
  const { isProgramFree } = useSubscription();

  return (
    <div className="programs-page">
<div className="programs-header text-center">
        <h1>TRAINING <span className="text-primary">PROGRAMS</span></h1>
        <p className="subtitle">Structured paths to reach your boxing goals.</p>
      </div>

      <div className="programs-grid">
        {Object.values(programs).map(program => {
          const pData = progress[program.id];
          const isStarted = !!pData;
          const completedCount = isStarted ? pData.completedDays.length : 0;
          const totalDays = program.days.length;
          const isComplete = completedCount === totalDays;
          
          return (
            <Link href={`/program/${program.id}`} key={program.id} className="program-card card">
              <div className="program-card-header">
                <span className={`level-badge ${program.level.toLowerCase()}`}>{program.level}</span>
                <span className="duration-badge"><Calendar size={14} /> {program.duration}</span>
              </div>
              
              <h2>{program.title} {!isProgramFree(program.id) && <ProBadge size="md" />}</h2>
              <p>{program.shortDesc}</p>
              
              {isStarted ? (
                <div className="program-progress">
                  <div className="progress-text">
                    <span>{isComplete ? 'Completed!' : `Day ${pData.currentDay || 1} of ${totalDays}`}</span>
                    <span>{Math.round((completedCount / totalDays) * 100)}%</span>
                  </div>
                  <div className="progress-bar-bg">
                    <div className="progress-bar-fill" style={{ width: `${(completedCount / totalDays) * 100}%` }}></div>
                  </div>
                </div>
              ) : (
                <div className="program-start-prompt">
                  <Play size={16} /> Start Program
                </div>
              )}
            </Link>
          );
        })}
      </div>

      <div className="mt-8">
        <AdBanner />
      </div>
    </div>
  );
};

export default ProgramsPage;

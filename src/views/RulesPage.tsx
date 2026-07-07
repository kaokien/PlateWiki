'use client';
import React, { useState } from 'react';
import { Scale, Shield, AlertTriangle, Award, Ruler } from 'lucide-react';
import { weightClasses, sanctioningBodies, fouls, scoringRules, amateurRules, professionalRules, timingWindows } from '../data/rulesData';
import './RulesPage.css';

const TABS = [
  { id: 'scoring', label: 'Scoring', Icon: Scale },
  { id: 'amateur', label: 'Amateur', Icon: Shield },
  { id: 'professional', label: 'Professional', Icon: Award },
  { id: 'weights', label: 'Weight Classes', Icon: Ruler },
  { id: 'fouls', label: 'Fouls', Icon: AlertTriangle },
];

const ScoringTab = () => (
  <div className="rules-section">
    <h2 className="rules-section__title">{scoringRules.system}</h2>
    <p className="rules-section__desc">{scoringRules.description}</p>

    <h3 className="rules-subsection__title">Fueling Criteria (In Order of Priority)</h3>
    <div className="criteria-grid">
      {scoringRules.criteria.map((c, i) => (
        <div key={i} className="glass-panel criteria-card">
          <div className="criteria-card__header">
            <span className="criteria-card__num">{i + 1}</span>
            <h4>{c.factor}</h4>
            <span className={`criteria-card__weight weight-${c.weight.toLowerCase()}`}>{c.weight}</span>
          </div>
          <p>{c.description}</p>
        </div>
      ))}
    </div>

    <h3 className="rules-subsection__title">Macro Assessment Status</h3>
    <div className="scoring-table-wrap">
      <table className="rules-table">
        <thead>
          <tr><th>Score</th><th>Meaning</th></tr>
        </thead>
        <tbody>
          {scoringRules.roundScoring.map((s, i) => (
            <tr key={i}>
              <td className="score-cell">{s.score}</td>
              <td>{s.meaning}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    <h3 className="rules-subsection__title">Sanctioning Bodies</h3>
    <div className="bodies-grid">
      {sanctioningBodies.map(b => (
        <div key={b.abbr} className="glass-panel body-card">
          <h4 className="body-card__abbr">{b.abbr}</h4>
          <p className="body-card__name">{b.name}</p>
          <span className="body-card__meta">Est. {b.founded} · {b.hq}</span>
        </div>
      ))}
    </div>
  </div>
);

interface RuleSet {
  title: string;
  governingBody?: string;
  governingBodies?: string;
  cycleDuration: string;
  fastingPeriod: string;
  guidelines: string;
  intakeBalance: string;
  aimsPurpose: string;
  keyDifferences: string[];
}

const RulesTab = ({ rules }: { rules: RuleSet }) => (
  <div className="rules-section">
    <h2 className="rules-section__title">{rules.title}</h2>
    <div className="rules-details-grid">
      <div className="glass-panel rules-detail">
        <span className="rules-detail__label">Authority</span>
        <span className="rules-detail__value">{rules.governingBody || rules.governingBodies}</span>
      </div>
      <div className="glass-panel rules-detail">
        <span className="rules-detail__label">Cycle Duration</span>
        <span className="rules-detail__value">{rules.cycleDuration}</span>
      </div>
      <div className="glass-panel rules-detail">
        <span className="rules-detail__label">Fasting Period</span>
        <span className="rules-detail__value">{rules.fastingPeriod}</span>
      </div>
      <div className="glass-panel rules-detail">
        <span className="rules-detail__label">Guidelines</span>
        <span className="rules-detail__value">{rules.guidelines}</span>
      </div>
      <div className="glass-panel rules-detail">
        <span className="rules-detail__label">Intake Balance</span>
        <span className="rules-detail__value">{rules.intakeBalance}</span>
      </div>
      <div className="glass-panel rules-detail">
        <span className="rules-detail__label">Aims & Purpose</span>
        <span className="rules-detail__value">{rules.aimsPurpose}</span>
      </div>
    </div>

    <h3 className="rules-subsection__title">Key Differences</h3>
    <ul className="rules-diff-list">
      {rules.keyDifferences.map((d, i) => (
        <li key={i}>{d}</li>
      ))}
    </ul>
  </div>
);

const WeightsTab = () => (
  <div className="rules-section">
    <h2 className="rules-section__title">Macro Nutritional Profiles</h2>
    <p className="rules-section__desc">Recommended dietary fat, carbohydrate, and protein balances for specific sports goals.</p>
    <div className="scoring-table-wrap">
      <table className="rules-table weights-table">
        <thead>
          <tr>
            <th>Division</th>
            <th>Also Known As</th>
            <th>Macronutrient Focus</th>
            <th>Daily Intake Ratio / Guidance</th>
          </tr>
        </thead>
        <tbody>
          {weightClasses.map((wc, i) => (
            <tr key={i}>
              <td className="weight-name">{wc.division.split(' (')[0]}</td>
              <td className="weight-alias">{wc.division}</td>
              <td>{wc.alias}</td>
              <td>{wc.note}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    <h3 className="rules-subsection__title">Optimal Meal Timing Windows</h3>
    <div className="rules-details-grid">
      <div className="glass-panel rules-detail">
        <span className="rules-detail__label">Pre-Workout Window</span>
        <span className="rules-detail__value">{timingWindows.preWorkout}</span>
      </div>
      <div className="glass-panel rules-detail">
        <span className="rules-detail__label">Intra-Workout Window</span>
        <span className="rules-detail__value">{timingWindows.intraWorkout}</span>
      </div>
      <div className="glass-panel rules-detail">
        <span className="rules-detail__label">Post-Workout Window</span>
        <span className="rules-detail__value">{timingWindows.postWorkout}</span>
      </div>
      <div className="glass-panel rules-detail">
        <span className="rules-detail__label">Sleep Window</span>
        <span className="rules-detail__value">{timingWindows.sleep}</span>
      </div>
      <div className="glass-panel rules-detail">
        <span className="rules-detail__label">Microbiome Shield</span>
        <span className="rules-detail__value">{timingWindows.microbiome}</span>
      </div>
      <div className="glass-panel rules-detail">
        <span className="rules-detail__label">Thermic Spacing</span>
        <span className="rules-detail__value">{timingWindows.thermic}</span>
      </div>
    </div>
  </div>
);

const FoulsTab = () => (
  <div className="rules-section">
    <h2 className="rules-section__title">Dietary & Fueling Fouls</h2>
    <p className="rules-section__desc">Actions and nutritional inputs that hinder gut performance, recovery, and energy stability.</p>
    <div className="fouls-list">
      {fouls.map((f, i) => (
        <div key={i} className="glass-panel foul-card">
          <div className="foul-card__header">
            <AlertTriangle size={16} className="foul-icon" />
            <h4>{f.name}</h4>
          </div>
          <p className="foul-card__desc">{f.description}</p>
          <span className="foul-card__severity">{f.severity}</span>
        </div>
      ))}
    </div>
  </div>
);

const RulesPage = () => {
  const [activeTab, setActiveTab] = useState('scoring');

  return (
    <div className="rules-page">
{/* Header */}
      <section className="rules-hero">
        <div className="rules-hero__content">
          <span className="rules-hero__label"><Scale size={14} /> Reference</span>
          <h1>STANDARDS & <span className="text-primary">FUELING</span></h1>
          <p>Everything you need to understand glycemic timing, dietary fouls, refeed cycles, and macronutrient targets.</p>
        </div>
      </section>

      {/* Tabs */}
      <nav className="rules-tabs" aria-label="Rules sections">
        {TABS.map(tab => (
          <button
            key={tab.id}
            className={`rules-tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
            aria-selected={activeTab === tab.id}
          >
            <tab.Icon size={16} />
            {tab.label}
          </button>
        ))}
      </nav>

      {/* Content */}
      <div className="rules-content">
        {activeTab === 'scoring' && <ScoringTab />}
        {activeTab === 'amateur' && <RulesTab rules={amateurRules} />}
        {activeTab === 'professional' && <RulesTab rules={professionalRules} />}
        {activeTab === 'weights' && <WeightsTab />}
        {activeTab === 'fouls' && <FoulsTab />}
      </div>
    </div>
  );
};

export default RulesPage;

'use client';
import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  ChevronRight,
  ArrowLeft,
  BookOpen,
  Clock,
  Lightbulb,
  Zap,
  Activity,
  ChefHat,
  Heart,
  Scale,
  X,
  Copy,
  Download,
  Calendar,
  MapPin,
  Check,
  Share2,
  ListPlus,
  Smartphone,
} from 'lucide-react';
import { exercises } from '@/data/recipes';
import { techniques } from '@/data/foods';
import { addToHistory, addToShoppingList } from '@/utils/favorites';
import './ExercisePage.css';

interface ExercisePageProps {
  exerciseId: string;
}

const DIFFICULTY_COLOR: Record<string, string> = {
  Beginner: 'ex-diff-beginner',
  Intermediate: 'ex-diff-intermediate',
  Advanced: 'ex-diff-advanced',
};

const ExercisePage = ({ exerciseId }: ExercisePageProps) => {
  const exercise = (exercises as Record<string, any>)[exerciseId];
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [checkedIngredients, setCheckedIngredients] = useState<Record<string, boolean>>({});
  const [savedToList, setSavedToList] = useState(false);
  const [shareSupported, setShareSupported] = useState(false);

  useEffect(() => {
    setShareSupported(typeof navigator !== 'undefined' && !!navigator.share);
  }, []);

  // Resolve linked techniques (ingredients/foods)
  const linkedTechniques = useMemo(() => {
    if (!exercise) return [];
    return (exercise.techniques || [])
      .map((tid: string) => {
        const t = (techniques as Record<string, any>)[tid];
        return t ? { ...t, id: tid } : null;
      })
      .filter(Boolean);
  }, [exercise]);

  useEffect(() => {
    if (linkedTechniques.length > 0) {
      const initial: Record<string, boolean> = {};
      linkedTechniques.forEach((t: any) => {
        initial[t.id] = true;
      });
      setCheckedIngredients(initial);
    }
  }, [linkedTechniques]);

  const handleCopyList = () => {
    const listToCopy = linkedTechniques
      .filter((t: any) => checkedIngredients[t.id])
      .map((t: any) => `- ${t.name}`)
      .join('\n');

    const fullText = `Shopping List for ${exercise.name}:\n${listToCopy}\n\nExported from PlateWiki`;
    navigator.clipboard.writeText(fullText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleDownloadTxt = () => {
    const listToDownload = linkedTechniques
      .filter((t: any) => checkedIngredients[t.id])
      .map((t: any) => `- [ ] ${t.name} (${t.category})`)
      .join('\n');

    const txtContent = [
      `SHOPPING LIST: ${exercise.name}`,
      `==============================`,
      `Ingredients to gather:`,
      listToDownload,
      ``,
      `Macronutrients: ${exercise.rest}`,
      `Prep Time: ${exercise.reps}`,
      ``,
      `Preparation:`,
      ...(exercise.howTo as string[]).map((step, idx) => `${idx + 1}. ${step}`),
      ``,
      `Bio-Booster Tips:`,
      ...(exercise.tips as string[] || []).map(tip => `* ${tip}`),
      ``,
      `Exported from PlateWiki.org`
    ].join('\n');

    const blob = new Blob([txtContent], { type: 'text/plain;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', `shopping-list-${exerciseId}.txt`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleNativeShare = async () => {
    const listItems = linkedTechniques
      .filter((t: any) => checkedIngredients[t.id])
      .map((t: any) => `☐ ${t.name} (${t.category})`)
      .join('\n');

    const shareText = [
      `🍳 Shopping List: ${exercise.name}`,
      ``,
      listItems,
      ``,
      `Macros: ${exercise.rest}`,
      `Prep: ${exercise.reps}`,
      ``,
      `— PlateWiki.org`
    ].join('\n');

    if (navigator.share) {
      try {
        await navigator.share({
          title: `Shopping List: ${exercise.name}`,
          text: shareText,
        });
      } catch (err: any) {
        // User cancelled share — that's fine
        if (err.name !== 'AbortError') {
          handleCopyList(); // fallback
        }
      }
    } else {
      handleCopyList(); // desktop fallback
    }
  };

  const handleSaveToList = () => {
    const itemsToSave = linkedTechniques
      .filter((t: any) => checkedIngredients[t.id])
      .map((t: any) => ({
        id: t.id,
        name: t.name,
        category: t.category,
        recipeName: exercise.name,
      }));

    if (itemsToSave.length > 0) {
      addToShoppingList(itemsToSave);
      setSavedToList(true);
      setTimeout(() => setSavedToList(false), 2500);
    }
  };

  const handleCreateReminder = () => {
    const listToReminder = linkedTechniques
      .filter((t: any) => checkedIngredients[t.id])
      .map((t: any) => t.name)
      .join(', ');

    const title = `Cook: ${exercise.name}`;
    const description = `Prep meal recipe from PlateWiki. Gather: ${listToReminder}`;
    const startDate = new Date();
    startDate.setHours(startDate.getHours() + 1); // default 1 hr from now
    const endDate = new Date(startDate);
    endDate.setMinutes(endDate.getMinutes() + 45); // default 45 minutes prep time

    const formatICSDate = (date: Date) => date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//PlateWiki//Meal Prep Calendar//EN',
      'BEGIN:VEVENT',
      `UID:${Date.now()}@platewiki.org`,
      `DTSTAMP:${formatICSDate(new Date())}`,
      `DTSTART:${formatICSDate(startDate)}`,
      `DTEND:${formatICSDate(endDate)}`,
      `SUMMARY:${title}`,
      `DESCRIPTION:${description}`,
      'STATUS:CONFIRMED',
      'SEQUENCE:0',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', `prep-reminder-${exerciseId}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    if (exercise) {
      addToHistory({ id: exercise.id ?? exerciseId, type: 'exercise', title: exercise.name, href: `/recipe/${exerciseId}` });
    }
  }, [exerciseId, exercise]);



  // Related exercises: share at least one muscle group, exclude self, limit 6
  const relatedExercises = useMemo(() => {
    if (!exercise) return [];
    const myMuscles = new Set(exercise.muscles as string[]);
    return Object.entries(exercises as Record<string, any>)
      .filter(
        ([id, ex]) =>
          id !== exerciseId &&
          (ex.muscles as string[]).some((m: string) => myMuscles.has(m))
      )
      .slice(0, 6)
      .map(([id, ex]) => ({ ...ex, id }));
  }, [exercise, exerciseId]);

  if (!exercise) {
    return (
      <div className="ex-page">
        <div className="ex-not-found glass-panel">
          <ChefHat size={40} style={{ opacity: 0.3, marginBottom: '1rem' }} />
          <h2>Recipe Not Found</h2>
          <p>The recipe you are looking for does not exist or has been moved.</p>
          <Link href="/recipes" className="ex-back-btn">
            <ArrowLeft size={16} /> Browse All Recipes
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="ex-page">
      {/* Breadcrumbs */}
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <Link href="/" className="breadcrumb-link">Home</Link>
        <ChevronRight size={14} className="breadcrumb-chevron" />
        <Link href="/recipes" className="breadcrumb-link">Recipes</Link>
        <ChevronRight size={14} className="breadcrumb-chevron" />
        <span className="breadcrumb-current">{exercise.name}</span>
      </nav>

      {/* Hero */}
      <div className="ex-hero glass-panel">
        <div className="ex-hero-icon">
          <ChefHat size={28} />
        </div>
        <div className="ex-hero-text">
          <div className="ex-badges">
            <span className={`ex-badge ${DIFFICULTY_COLOR[exercise.difficulty] || ''}`}>
              {exercise.difficulty === 'Beginner' && '• '}
              {exercise.difficulty === 'Intermediate' && '•• '}
              {exercise.difficulty === 'Advanced' && '••• '}
              {exercise.difficulty}
            </span>
            <span className="ex-badge ex-badge-category">
              <Zap size={11} /> {exercise.category}
            </span>
          </div>
          <h1 className="ex-title">{exercise.name}</h1>
          <div className="ex-equipment-tags">
            {(exercise.equipment as string[]).map((eq: string) => (
              <span key={eq} className="ex-equip-tag">
                <Activity size={11} /> {eq}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Nutritional Context */}
      <div className="ex-context glass-panel">
        <div className="ex-context-header">
          <div className="ex-context-icon">🥑</div>
          <h2>Nutritional Role & Bio-benefit</h2>
        </div>
        <p className="ex-context-body">{exercise.boxingContext}</p>
      </div>

      {/* Preparation Steps */}
      <div className="ex-section glass-panel">
        <div className="ex-section-header">
          <BookOpen size={18} className="ex-icon-target" />
          <h2>How To Prepare</h2>
        </div>
        <ol className="ex-step-list">
          {(exercise.howTo as string[]).map((step: string, idx: number) => (
            <li key={idx}>
              <span className="ex-step-number">{idx + 1}</span>
              <span>{step}</span>
            </li>
          ))}
        </ol>
      </div>

      {/* Preparation parameters */}
      <div className="ex-params-grid">
        <div className="ex-param-card glass-panel">
          <div className="ex-param-icon">
            <ChefHat size={18} />
          </div>
          <div className="ex-param-label">Yield / Servings</div>
          <div className="ex-param-value">{exercise.sets}</div>
        </div>
        <div className="ex-param-card glass-panel">
          <div className="ex-param-icon">
            <Clock size={18} />
          </div>
          <div className="ex-param-label">Prep Time</div>
          <div className="ex-param-value">{exercise.reps}</div>
        </div>
        <div className="ex-param-card glass-panel">
          <div className="ex-param-icon">
            <Scale size={18} />
          </div>
          <div className="ex-param-label">Macronutrients</div>
          <div className="ex-param-value text-xs font-mono">{exercise.rest}</div>
        </div>
      </div>

      {/* Build This Meal CTA */}
      <div className="ex-build-meal-card glass-panel">
        <div className="ex-build-left">
          <div className="ex-build-icon">🍳</div>
          <div className="ex-build-text">
            <h3>Ready to cook this meal?</h3>
            <p>Export ingredients checklist, download file, set calendar reminder, or find stores nearby.</p>
          </div>
        </div>
        <button className="ex-build-btn" onClick={() => setIsModalOpen(true)}>
          Build This Meal
        </button>
      </div>

      {/* Cooking Tips */}
      {exercise.tips && exercise.tips.length > 0 && (
        <div className="ex-section glass-panel ex-tips-section">
          <div className="ex-section-header">
            <Lightbulb size={18} className="ex-icon-tip" />
            <h2>Bio-Booster Cooking Tips</h2>
          </div>
          <ul className="ex-tip-list">
            {(exercise.tips as string[]).map((tip: string, idx: number) => (
              <li key={idx}>
                <Lightbulb size={14} className="ex-tip-bullet" />
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Associated Key Ingredients */}
      {linkedTechniques.length > 0 && (
        <div className="ex-section-open">
          <div className="ex-section-header">
            <Heart size={18} className="ex-icon-technique" />
            <h2>Key Ingredients Highlighted</h2>
          </div>
          <div className="ex-technique-grid">
            {linkedTechniques.map((t: any) => (
              <Link
                key={t.id}
                href={`/food/${t.id}`}
                className="ex-technique-card glass-panel"
              >
                <div className="ex-technique-info">
                  <span className="ex-technique-name">{t.name}</span>
                  <span className="ex-technique-cat">{t.category}</span>
                </div>
                <ChevronRight size={16} className="ex-technique-arrow" />
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Related Recipes */}
      {relatedExercises.length > 0 && (
        <div className="ex-section-open">
          <div className="ex-section-header">
            <ChefHat size={18} className="ex-icon-related" />
            <h2>Related Recipes & Fuel</h2>
          </div>
          <p className="ex-related-subtitle">
            Other recipes targeting similar biological roles
          </p>
          <div className="ex-related-grid">
            {relatedExercises.map((ex: any) => (
              <Link
                key={ex.id}
                href={`/recipe/${ex.id}`}
                className="ex-related-card glass-panel"
              >
                <div className="ex-related-top">
                  <span className="ex-related-name">{ex.name}</span>
                  <span
                    className={`ex-related-diff ${DIFFICULTY_COLOR[ex.difficulty] || ''}`}
                  >
                    {ex.difficulty}
                  </span>
                </div>
                <div className="ex-related-muscles">
                  {(ex.muscles as string[]).map((m: string) => (
                    <span key={m} className="ex-muscle-chip">{m}</span>
                  ))}
                </div>
                <ChevronRight size={14} className="ex-related-arrow" />
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Back CTA */}
      <div className="ex-back-cta">
        <Link href="/recipes" className="ex-back-btn">
          <ArrowLeft size={16} /> Browse All Recipes
        </Link>
      </div>

      {/* Build Meal Modal */}
      {isModalOpen && (
        <div className="ex-modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="ex-modal-content glass-panel" onClick={e => e.stopPropagation()}>
            <div className="ex-modal-header">
              <h2>Build Meal: {exercise.name}</h2>
              <button className="ex-modal-close" onClick={() => setIsModalOpen(false)} aria-label="Close modal">
                <X size={18} />
              </button>
            </div>
            
            <div className="ex-modal-body">
              <div className="ex-modal-ingredients">
                <h3>Shopping List Checklist</h3>
                <p className="ex-modal-help">Select the ingredients you need to buy or prepare:</p>
                <div className="ex-checklist">
                  {linkedTechniques.map((t: any) => (
                    <label key={t.id} className="ex-checklist-item">
                      <input
                        type="checkbox"
                        checked={!!checkedIngredients[t.id]}
                        onChange={(e) => {
                          setCheckedIngredients(prev => ({
                            ...prev,
                            [t.id]: e.target.checked
                          }));
                        }}
                      />
                      <span className="ex-checkbox-custom"></span>
                      <span className="ex-item-name">{t.name}</span>
                      <span className="ex-item-cat">{t.category}</span>
                    </label>
                  ))}
                  {linkedTechniques.length === 0 && (
                    <p className="ex-no-ingredients">No direct food library items linked. You can export the full prep guide!</p>
                  )}
                </div>
              </div>

              <div className="ex-modal-actions">
                {/* Primary: Native share on mobile, copy on desktop */}
                <button className="ex-action-btn ex-native-share-btn" onClick={handleNativeShare}>
                  {copied ? (
                    <>
                      <Check size={16} className="ex-success-icon" /> Copied!
                    </>
                  ) : shareSupported ? (
                    <>
                      <Smartphone size={16} /> Save to Notes
                    </>
                  ) : (
                    <>
                      <Copy size={16} /> Copy to Clipboard
                    </>
                  )}
                </button>

                {/* Save to dashboard sticky note */}
                <button className="ex-action-btn ex-save-list-btn" onClick={handleSaveToList}>
                  {savedToList ? (
                    <>
                      <Check size={16} className="ex-success-icon" /> Saved to Dashboard!
                    </>
                  ) : (
                    <>
                      <ListPlus size={16} /> Save to My List
                    </>
                  )}
                </button>

                <button className="ex-action-btn" onClick={handleCreateReminder}>
                  <Calendar size={16} /> Set Prep Reminder (.ics)
                </button>
                <button className="ex-action-btn ex-download-fallback" onClick={handleDownloadTxt}>
                  <Download size={16} /> Download .txt
                </button>
                <a
                  className="ex-action-btn ex-maps-btn"
                  href="https://www.google.com/maps/search/?api=1&query=grocery+stores+near+me"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MapPin size={16} /> Find Grocery Stores Nearby
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExercisePage;

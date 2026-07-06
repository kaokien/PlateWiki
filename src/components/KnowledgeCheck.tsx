'use client';

import { useMemo, useState, useCallback } from 'react';
import { Brain, ChevronDown, Check, X, RotateCcw } from 'lucide-react';
import { generateQuiz } from '@/utils/quizGenerator';
import { useFighterProfile } from '@/context/FighterProfileContext';
import './KnowledgeCheck.css';

interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
}

interface KnowledgeCheckProps {
  techniqueId: string;
  techniqueName: string;
}

export default function KnowledgeCheck({ techniqueId, techniqueName }: KnowledgeCheckProps) {
  const { profile, awardXP } = useFighterProfile();

  const [expanded, setExpanded] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [xpAwarded, setXpAwarded] = useState(false);
  // completed users can retake the quiz as practice (no repeat XP)
  const [practiceMode, setPracticeMode] = useState(false);

  // each attempt gets a different question mix where the data allows
  const questions: QuizQuestion[] = useMemo(
    () => generateQuiz(techniqueId, attempt),
    [techniqueId, attempt],
  );

  const isCompleted = profile.quizzesCompleted?.includes(techniqueId);

  const restart = useCallback((asPractice: boolean) => {
    setAttempt((a) => a + 1);
    setCurrentIndex(0);
    setSelectedIndex(null);
    setAnswered(false);
    setScore(0);
    setShowResults(false);
    setXpAwarded(false);
    setPracticeMode(asPractice);
    setExpanded(true);
  }, []);

  const handleSelect = useCallback(
    (optIdx: number) => {
      if (answered) return;
      setSelectedIndex(optIdx);
      setAnswered(true);
      if (optIdx === questions[currentIndex].correctIndex) {
        setScore((s) => s + 1);
      }
    },
    [answered, currentIndex, questions],
  );

  const handleNext = useCallback(() => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((i) => i + 1);
      setSelectedIndex(null);
      setAnswered(false);
    } else {
      setShowResults(true);
      // Award XP if passing and not already completed (score is final here —
      // handleSelect updated it before the Next button became visible)
      const passingScore = score >= 2;
      if (passingScore && !isCompleted) {
        awardXP('quiz_complete', { techniqueId });
        setXpAwarded(true);
      }
    }
  }, [currentIndex, questions, score, isCompleted, awardXP, techniqueId]);

  // Nothing to render if no questions
  if (!questions || questions.length === 0) return null;

  const q = questions[currentIndex];
  const isCorrect = selectedIndex === q?.correctIndex;

  // Already completed — show badge header with a practice option
  // (keep the results screen visible right after a run finishes)
  if (isCompleted && !practiceMode && !showResults) {
    return (
      <div className="knowledge-check">
        <div className="knowledge-check__header" style={{ cursor: 'default' }}>
          <div className="knowledge-check__header-left">
            <Brain size={18} />
            <span className="knowledge-check__title">Test Your Knowledge</span>
          </div>
          <div className="knowledge-check__header-right">
            <span className="knowledge-check__badge">
              <Check size={12} /> Completed
            </span>
            <button className="knowledge-check__retry" onClick={() => restart(true)}>
              <RotateCcw size={12} /> Practice Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="knowledge-check">
      {/* Header */}
      <button
        className="knowledge-check__header"
        onClick={() => setExpanded((e) => !e)}
        aria-expanded={expanded}
      >
        <div className="knowledge-check__header-left">
          <Brain size={18} />
          <span className="knowledge-check__title">Test Your Knowledge</span>
        </div>
        <ChevronDown
          size={18}
          className={`knowledge-check__chevron${expanded ? ' knowledge-check__chevron--expanded' : ''}`}
        />
      </button>

      {/* Content */}
      <div className={`knowledge-check__content${expanded ? ' knowledge-check__content--open' : ''}`}>
        <div className="knowledge-check__body">
          {showResults ? (
            /* ---------- Results ---------- */
            <div className="knowledge-check__results">
              <div className="knowledge-check__score-number">
                {score}/{questions.length}
              </div>
              <div className="knowledge-check__score-label">Questions Correct</div>
              {xpAwarded && (
                <div className="knowledge-check__xp-award">+XP Earned!</div>
              )}
              {practiceMode && (
                <div className="knowledge-check__score-msg">
                  Practice round — XP was already earned for this quiz.
                </div>
              )}
              {!practiceMode && !xpAwarded && score < 2 && (
                <div className="knowledge-check__score-msg">
                  Score 2+ to earn XP. Review the technique and try again.
                </div>
              )}
              <button className="knowledge-check__next" onClick={() => restart(practiceMode || xpAwarded)}>
                <RotateCcw size={14} /> {practiceMode || xpAwarded ? 'Practice Again' : 'Try Again'}
              </button>
            </div>
          ) : (
            /* ---------- Question ---------- */
            <>
              <div className="knowledge-check__counter">
                Q{currentIndex + 1} of {questions.length}
              </div>
              <div className="knowledge-check__question">{q.question}</div>

              <div className="knowledge-check__options">
                {q.options.map((opt, i) => {
                  let cls = 'knowledge-check__option';
                  if (answered) {
                    if (i === selectedIndex && isCorrect) cls += ' knowledge-check__option--correct';
                    else if (i === selectedIndex && !isCorrect) cls += ' knowledge-check__option--wrong';
                    else if (i === q.correctIndex && !isCorrect) cls += ' knowledge-check__option--reveal';
                  }

                  return (
                    <button
                      key={i}
                      className={cls}
                      onClick={() => handleSelect(i)}
                      disabled={answered}
                    >
                      {answered && i === selectedIndex && isCorrect && (
                        <Check size={16} className="knowledge-check__option-icon" />
                      )}
                      {answered && i === selectedIndex && !isCorrect && (
                        <X size={16} className="knowledge-check__option-icon" />
                      )}
                      {answered && i === q.correctIndex && !isCorrect && (
                        <Check size={16} className="knowledge-check__option-icon" />
                      )}
                      {opt}
                    </button>
                  );
                })}
              </div>

              {answered && (
                <>
                  <div
                    className={`knowledge-check__feedback ${
                      isCorrect
                        ? 'knowledge-check__feedback--correct'
                        : 'knowledge-check__feedback--wrong'
                    }`}
                  >
                    {isCorrect ? 'Correct!' : 'Incorrect'}
                  </div>
                  <button className="knowledge-check__next" onClick={handleNext}>
                    {currentIndex < questions.length - 1 ? 'Next Question' : 'See Results'}
                  </button>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

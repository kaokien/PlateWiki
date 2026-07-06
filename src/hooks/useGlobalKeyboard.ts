import { useEffect } from 'react';

interface UseGlobalKeyboardOptions {
  onSpace: () => void;
  onEscape: () => void;
  onMuteToggle: () => void;
  isActive: boolean;
}

/**
 * Reusable hook to standardize global keyboard controls (Space, Escape, M)
 * across training pages while ignoring keypresses on inputs or textareas.
 */
export function useGlobalKeyboard({
  onSpace,
  onEscape,
  onMuteToggle,
  isActive,
}: UseGlobalKeyboardOptions) {
  useEffect(() => {
    if (!isActive) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (
        !target ||
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        return;
      }

      if (e.key === ' ') {
        e.preventDefault();
        onSpace();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        onEscape();
      } else if (e.key === 'm' || e.key === 'M') {
        e.preventDefault();
        onMuteToggle();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isActive, onSpace, onEscape, onMuteToggle]);
}

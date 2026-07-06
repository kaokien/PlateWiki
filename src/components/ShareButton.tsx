'use client';
import React, { useState, useCallback } from 'react';
import { Share2, Link2, Check, X as XIcon } from 'lucide-react';
import './ShareButton.css';

interface ShareButtonProps {
  /** Page title for sharing */
  title: string;
  /** Optional description / subtitle */
  description?: string;
  /** Canonical URL path (e.g. /articles/my-article). Full URL built automatically. */
  url?: string;
  /** Visual variant */
  variant?: 'inline' | 'floating';
}

const SITE_URL = 'https://FoodWiki.org';

/**
 * ShareButton — Web Share API on mobile, manual share menu on desktop.
 * Shows copy-link, X (Twitter), and Reddit share options.
 */
const ShareButton = ({ title, description, url, variant = 'inline' }: ShareButtonProps) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const fullUrl = url?.startsWith('http') ? url : `${SITE_URL}${url || ''}`;
  const shareText = description ? `${title} — ${description}` : title;

  const handleShare = useCallback(async () => {
    // Use native Web Share API on supported devices (mostly mobile)
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({ title, text: shareText, url: fullUrl });
        return;
      } catch {
        // User cancelled or API failed — fall through to manual menu
      }
    }
    setMenuOpen(prev => !prev);
  }, [title, shareText, fullUrl]);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const input = document.createElement('input');
      input.value = fullUrl;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [fullUrl]);

  const shareToX = () => {
    const tweetUrl = `https://x.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(fullUrl)}`;
    window.open(tweetUrl, '_blank', 'noopener,noreferrer,width=600,height=400');
    setMenuOpen(false);
  };

  const shareToReddit = () => {
    const redditUrl = `https://www.reddit.com/submit?url=${encodeURIComponent(fullUrl)}&title=${encodeURIComponent(title)}`;
    window.open(redditUrl, '_blank', 'noopener,noreferrer,width=600,height=600');
    setMenuOpen(false);
  };

  return (
    <div className={`share-wrapper share-wrapper--${variant}`}>
      <button
        className="share-trigger"
        onClick={handleShare}
        aria-label="Share this page"
        aria-expanded={menuOpen}
      >
        <Share2 size={16} />
        <span className="share-trigger-label">Share</span>
      </button>

      {menuOpen && (
        <>
          <div className="share-backdrop" onClick={() => setMenuOpen(false)} />
          <div className="share-menu glass-panel" role="menu">
            <button className="share-option" onClick={handleCopy} role="menuitem">
              {copied ? <Check size={16} /> : <Link2 size={16} />}
              <span>{copied ? 'Copied!' : 'Copy Link'}</span>
            </button>
            <button className="share-option" onClick={shareToX} role="menuitem">
              <XIcon size={16} />
              <span>Share on X</span>
            </button>
            <button className="share-option" onClick={shareToReddit} role="menuitem">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 13.38c.15.36.24.75.24 1.15 0 2.35-2.73 4.25-6.1 4.25s-6.1-1.9-6.1-4.25c0-.4.08-.79.24-1.15a1.54 1.54 0 0 1-.64-1.26c0-.85.69-1.54 1.54-1.54.42 0 .8.17 1.07.44a8.46 8.46 0 0 1 3.6-1.1l.74-3.48a.3.3 0 0 1 .35-.24l2.47.53a1.07 1.07 0 1 1-.12.56l-2.2-.47-.66 3.1a8.4 8.4 0 0 1 3.48 1.1 1.53 1.53 0 0 1 1.07-.44c.85 0 1.54.69 1.54 1.54 0 .5-.24.96-.64 1.26zM9.23 13.5a1.07 1.07 0 1 0 0 2.14 1.07 1.07 0 0 0 0-2.14zm5.54 0a1.07 1.07 0 1 0 0 2.14 1.07 1.07 0 0 0 0-2.14zm-4.88 3.07a.3.3 0 0 0 .42 0c.35-.35.97-.52 1.69-.52s1.34.17 1.69.52a.3.3 0 0 0 .42-.42c-.46-.46-1.22-.69-2.11-.69s-1.65.23-2.11.69a.3.3 0 0 0 0 .42z"/>
              </svg>
              <span>Share on Reddit</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ShareButton;

'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('FoodWiki Error:', error);
  }, [error]);

  return (
    <div
      style={{
        textAlign: 'center',
        padding: '4rem 2rem',
        maxWidth: '600px',
        margin: '0 auto',
      }}
    >
      <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>
        Something went wrong
      </h1>
      <p
        style={{
          color: 'var(--color-text-muted)',
          marginBottom: '2rem',
          lineHeight: 1.6,
        }}
      >
        An unexpected error occurred. Try refreshing or head back to the
        homepage.
      </p>
      <button
        onClick={reset}
        style={{
          background: 'var(--color-primary)',
          color: '#fff',
          border: 'none',
          padding: '0.75rem 1.5rem',
          borderRadius: 'var(--radius-md)',
          fontWeight: 700,
          cursor: 'pointer',
          marginRight: '1rem',
        }}
      >
        Try Again
      </button>
      <a href="/" style={{ color: 'var(--color-primary)', fontWeight: 600 }}>
        Go Home
      </a>
    </div>
  );
}

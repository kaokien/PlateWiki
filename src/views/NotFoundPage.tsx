import React from 'react';
import Link from 'next/link';
import { Home, BookOpen } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div className="legal-page" style={{ textAlign: 'center', paddingTop: '3rem' }}>
<div className="glass-panel" style={{ maxWidth: '500px', margin: '0 auto', padding: '3rem 2rem' }}>
        <div style={{ fontSize: '4rem', marginBottom: '1rem' }} className="wobble-anim">🥊</div>
        <h1 style={{ fontSize: 'var(--font-size-hero)', fontWeight: 900, marginBottom: '0.5rem' }}>
          <span style={{ color: 'var(--color-primary)' }}>404</span>
        </h1>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--color-text)' }}>
          Page Not Found
        </h2>
        <p style={{ color: 'var(--color-text-muted)', marginBottom: '2rem', lineHeight: 1.6 }}>
          That page is gone. It may have moved, or the link is broken.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/" style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
            background: 'var(--color-primary)', color: '#fff', padding: '0.75rem 1.5rem',
            borderRadius: 'var(--radius-full)', fontWeight: 700, textDecoration: 'none',
            transition: 'all 0.15s ease'
          }}>
            <Home size={18} /> Interactive Map
          </Link>
          <Link href="/techniques" style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
            background: 'var(--color-surface)', border: '1px solid var(--color-border)',
            color: 'var(--color-text)', padding: '0.75rem 1.5rem',
            borderRadius: 'var(--radius-full)', fontWeight: 700, textDecoration: 'none',
            transition: 'all 0.15s ease'
          }}>
            <BookOpen size={18} /> Browse Techniques
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;

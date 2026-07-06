import Link from 'next/link';

export default function NotFound() {
  return (
    <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
      <p style={{ fontSize: '4rem', marginBottom: '1rem' }} className="wobble-anim">
        🥊
      </p>
      <h1
        style={{
          fontSize: 'var(--font-size-title)',
          fontFamily: 'var(--font-display)',
          marginBottom: '1rem',
        }}
      >
        Page Not Found
      </h1>
      <p
        style={{
          color: 'var(--color-text-muted)',
          marginBottom: '2rem',
          maxWidth: '400px',
          margin: '0 auto 2rem',
        }}
      >
        The technique you&apos;re looking for doesn&apos;t exist. Maybe it&apos;s still in the gym.
      </p>
      <Link
        href="/"
        style={{
          display: 'inline-block',
          background: 'var(--color-primary)',
          color: '#fff',
          padding: '0.75rem 1.5rem',
          borderRadius: 'var(--radius-md)',
          fontWeight: 700,
          textDecoration: 'none',
        }}
      >
        Back to FoodWiki
      </Link>
    </div>
  );
}

'use client';
import React from 'react';
import Link from 'next/link';

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends React.Component<React.PropsWithChildren, ErrorBoundaryState> {
  constructor(props: React.PropsWithChildren) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '60vh',
          textAlign: 'center',
          padding: '2rem',
          gap: '1rem',
        }}>
          <span style={{ fontSize: '3rem' }}>🥊</span>
          <h1 style={{ margin: 0 }}>Something went wrong</h1>
          <p style={{ color: 'var(--color-text-muted)', maxWidth: '400px' }}>
            Something broke on our end. Refresh the page, or head back home.
          </p>
          <Link
            href="/"
            onClick={() => this.setState({ hasError: false })}
            style={{
              color: 'var(--color-primary)',
              fontWeight: 700,
              fontSize: '1rem',
            }}
          >
            ← Back to Home
          </Link>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

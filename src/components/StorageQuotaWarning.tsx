'use client';

import React, { useState, useEffect } from 'react';
import { ShieldAlert, X } from 'lucide-react';
import './StorageQuotaWarning.css';

export default function StorageQuotaWarning() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleStorageError = () => {
      setVisible(true);
    };

    window.addEventListener('storage-lockout-error', handleStorageError);

    // Run startup test to detect private/incognito lockout immediately
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const testKey = '__storage_test_mount__';
        window.localStorage.setItem(testKey, testKey);
        window.localStorage.removeItem(testKey);
      } else {
        setVisible(true);
      }
    } catch (e) {
      setVisible(true);
    }

    return () => {
      window.removeEventListener('storage-lockout-error', handleStorageError);
    };
  }, []);

  if (!visible) return null;

  return (
    <div className="storage-warning-banner" role="alert" aria-live="assertive">
      <div className="storage-warning-content">
        <ShieldAlert size={20} className="storage-warning-icon" />
        <p className="storage-warning-text">
          <strong>Storage Disabled:</strong> Progress tracking and stats saving are temporarily disabled (private browsing or quota limit reached).
        </p>
      </div>
      <button 
        className="storage-warning-close" 
        onClick={() => setVisible(false)}
        aria-label="Dismiss warning"
      >
        <X size={16} />
      </button>
    </div>
  );
}

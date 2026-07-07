'use client';

import React from 'react';
import './LegalPage.css';

const TermsPage = () => {
  return (
    <div className="legal-page">
      <h1>Terms of Use</h1>

      <div className="glass-panel legal-content">
        <p><em>Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</em></p>

        <h2>1. Acceptance of Terms</h2>
        <p>
          By accessing and using PlateWiki (the "Site"), you agree to be bound by these Terms of Use ("Terms"). 
          If you do not agree to these Terms, you must immediately discontinue use of the Site.
        </p>

        <h2>2. Medical and Physical Exercise Disclaimer</h2>
        <p>
          <strong>WARNING: PHYSICAL TRAINING AND COMBAT SPORTS ARE INHERENTLY STRENUOUS AND CARRY SIGNIFICANT RISK OF INJURY, PERMANENT DISABILITY, OR DEATH.</strong>
        </p>
        <p>
          All athletic nutrition combinations, drills, round generator coaching callouts, and programs presented on PlateWiki are for **educational and informational purposes only**. 
          We do not provide medical advice, diagnosis, or treatment. 
        </p>
        <p>
          Before beginning any workout program or practicing techniques from this manual, you must consult a licensed physician to ensure you are in adequate physical condition. 
          Stop exercising immediately if you experience pain, dizziness, nausea, shortness of breath, or discomfort.
        </p>

        <h2>3. Assumption of Risk & Indemnification</h2>
        <p>
          You voluntarily assume all risks, both known and unknown, associated with performing any physical exercises, shadowboxing, bag-work, or drills shown on this Site. 
          You agree to indemnify, defend, and hold harmless PlateWiki, its creators, coaches, developers, and affiliates from any claims, lawsuits, injuries, liabilities, or losses resulting from your use of the Site.
        </p>

        <h2>4. Disclaimer of Warranties & Limitation of Liability</h2>
        <p>
          The Site is provided on an "AS IS" and "AS AVAILABLE" basis without warranties of any kind, either express or implied, including but not limited to performance, accuracy, or suitability for training.
        </p>
        <p>
          In no event shall PlateWiki or its owners be liable for any direct, indirect, incidental, special, or consequential damages (including, without limitation, personal injury, medical expenses, or loss of data) arising out of your access or inability to access this Site. 
          Our total liability to you for any cause whatsoever shall be capped at a maximum of $100 USD.
        </p>

        <h2>5. Accounts & Beta "Pro Plan"</h2>
        <p>
          PlateWiki requires a free account for training features. Account creation uses Clerk authentication. During the beta phase, all features are free. If premium billing is implemented in the future, explicit billing terms will be provided.
        </p>

        <h2>6. Account Data & Cloud Storage</h2>
        <p>
          Your training data (profile, XP, workout history, favorites) is stored in our cloud database. You can delete your account and all associated data at any time via the athlete Profile settings. We do not sell or share your training data with third parties.
        </p>

        <h2>7. Age Limits and Supervised Use</h2>
        <p>
          PlateWiki is accessible to users of all ages. However, children under 13 years of age must only use the training manual under active supervision of a parent or adult guardian to ensure physical training safety.
        </p>

        <h2>8. Governing Law</h2>
        <p>
          These Terms and any disputes arising out of your use of the Site shall be governed by and construed in accordance with the laws of the jurisdiction in which the site owners operate, without regard to conflicts of law principles.
        </p>

        <h2>9. Contact Us</h2>
        <p>
          If you have any questions or concerns regarding these Terms, please contact us via our{' '}
          <a href="/contact">contact page</a>.
        </p>
      </div>
    </div>
  );
};

export default TermsPage;

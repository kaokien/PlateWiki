import React from 'react';
import { getBreadcrumbSchema } from '../utils/seoSchemas';
import './LegalPage.css';

const PrivacyPage = () => {
  return (
    <div className="legal-page">
      <h1>Privacy Policy</h1>

      <div className="glass-panel legal-content">
        <p><em>Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</em></p>

        <h2>1. Data We Collect & How We Store It</h2>
        <p>
          When you create a free account, we store your training data (profile, XP, workout history, favorites, browsing history) securely in our cloud database hosted on Supabase.
        </p>
        <p>
          We use <strong>Clerk</strong> for authentication. Clerk processes your email address, display name, and authentication credentials under their own privacy policy (<a href="https://clerk.com/legal/privacy" target="_blank" rel="noopener noreferrer">clerk.com/legal/privacy</a>).
        </p>
        <p>
          Data syncs automatically across all your devices when signed in.
        </p>
        <p>
          Without an account, no personal data is stored — you browse content as a guest.
        </p>

        <h2>2. Third-Party Integrations & Tracking Cookies</h2>
        <p>
          We partner with third-party providers to analyze usage patterns and support site operations:
        </p>
        <ul>
          <li>
            <strong>Google Analytics (GA4):</strong> We use GA4 to gather information on user interaction (e.g. which techniques are viewed, workouts started).
            Google Analytics sets tracking cookies and processes your coarse location, browser user-agent, and IP address.
          </li>
          <li>
            <strong>Google AdSense:</strong> We display advertisements to support the free tier. Google AdSense uses cookies to deliver relevant ads based on your prior browsing history.
          </li>
        </ul>

        <h2>3. Cookie Consent & Google Consent Mode v2</h2>
        <p>
          We respect your privacy choice. PlateWiki has implemented <strong>Google Consent Mode v2</strong>.
          By default, all analytics and advertising cookies are blocked until you click "Accept" on our cookie consent banner.
          If you decline, Google Analytics is disabled, and ad services operate in a restricted, non-personalized manner. You can reset your choice at any time by clearing your browser cache.
        </p>

        <h2>4. Your Privacy Rights (GDPR & CCPA)</h2>
        <p>
          We fully support your data subject rights under global frameworks (such as GDPR and California CCPA):
        </p>
        <ul>
          <li><strong>Right to Erasure (Delete Data):</strong> Delete your account and all associated data via the Fighter Profile page settings (<strong>Danger Zone &gt; Delete Account</strong>), or by contacting us.</li>
          <li><strong>Right to Data Portability (Export Data):</strong> Export a machine-readable copy of your data via the Fighter Profile page (<strong>Download My Data</strong>).</li>
          <li><strong>Right to Access:</strong> All your data is visible in your Fighter Profile dashboard.</li>
        </ul>

        <h2>5. Children's Privacy (Age Limits)</h2>
        <p>
          PlateWiki is suitable for users of all ages. However, minors under the age of 13 must use this training resource under parental or guardian supervision. 
          We do not knowingly collect or store personal data of children under 13 on any remote server.
        </p>

        <h2>6. Contact Us</h2>
        <p>
          If you have questions about our privacy practices or how your browser data is handled, feel free to contact us through our{' '}
          <a href="/contact">contact page</a>.
        </p>
      </div>
    </div>
  );
};

export default PrivacyPage;

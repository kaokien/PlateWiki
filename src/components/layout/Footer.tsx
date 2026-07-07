import React from 'react';
import Link from 'next/link';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-content">
        <div className="footer-brand">
          <Link href="/" className="footer-logo" style={{ display: 'flex', alignItems: 'center' }}>
            <svg
              viewBox="0 0 24 24"
              width="22"
              height="22"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="logo-icon"
              style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '8px', color: 'var(--color-primary)' }}
            >
              <circle cx="12" cy="12" r="9" />
              <circle cx="12" cy="12" r="5" strokeWidth="1.5" strokeDasharray="2 2" opacity="0.6" />
              <path d="M8 8v3c0 .4.3.7.7.7h0c.4 0 .7-.3.7-.7V8" strokeWidth="1.5" />
              <line x1="8.7" y1="11.7" x2="8.7" y2="15.5" strokeWidth="1.5" />
              <line x1="15.3" y1="8" x2="15.3" y2="15.5" strokeWidth="1.5" />
              <path d="M15.3 8.5h1.2c.3 0 .5.3.5.5v2.5c0 .3-.2.5-.5.5h-1.2" fill="currentColor" strokeWidth="1.5" />
            </svg>
            <span><span className="logo-accent">PLATE</span>WIKI</span>
          </Link>
          <p className="footer-tagline">The free, open sports nutrition and whole food library. Fuel smarter.</p>
        </div>

        <div className="footer-links">
          <div className="footer-col">
            <strong className="footer-heading">Explore</strong>
            <Link href="/">Anatomy Map</Link>
            <Link href="/foods">All Foods</Link>
            <Link href="/programs">Programs</Link>
            <Link href="/articles">Articles</Link>
            <Link href="/athletes">Athlete Profiles</Link>
            <Link href="/favorites">Saved Foods</Link>
          </div>
          <div className="footer-col">
            <strong className="footer-heading">Learn</strong>
            <Link href="/course">Earthy Blueprint</Link>
            <Link href="/merch">Merch</Link>
            <Link href="/partner">Partner With Us</Link>
          </div>
          <div className="footer-col">
            <strong className="footer-heading">Resources</strong>
            <Link href="/glossary">Nutrition Glossary</Link>
            <Link href="/rules">Dietary Rules</Link>
            <Link href="/timer">Fasting Timer</Link>
            <Link href="/about">About</Link>
          </div>
          <div className="footer-col">
            <strong className="footer-heading">Community</strong>
            <a href="https://discord.gg/Vhygw7DpVM" target="_blank" rel="noopener noreferrer">Join the Discord</a>
            <a href="https://www.instagram.com/coachjoshofficial/" target="_blank" rel="noopener noreferrer">Nutrition Board (IG)</a>
            <Link href="/contact">Contact</Link>
          </div>
          <div className="footer-col">
            <strong className="footer-heading">Legal</strong>
            <Link href="/privacy">Privacy Policy</Link>
            <Link href="/terms">Terms of Use</Link>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p className="footer-disclaimer">
          <strong>Disclaimer:</strong> Sports nutrition guidance and fasting timers carry risks if you have underlying conditions. Consult a medical professional before beginning any diet or fasting protocol. PlateWiki assumes no liability for health issues or nutritional decisions.
        </p>
        <p className="footer-source-reference" style={{ fontSize: '0.75rem', opacity: 0.7, marginTop: '0.5rem', fontStyle: 'italic' }}>
          Nutritional data and dietary guidelines are curated in reference to the USDA FoodData Central database.
        </p>
        <p>&copy; {new Date().getFullYear()} PlateWiki. All rights reserved.</p>
      </div>
    </footer>
  );
}

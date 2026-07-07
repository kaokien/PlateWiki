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
              viewBox="0 0 12 12"
              width="22"
              height="22"
              fill="currentColor"
              className="logo-icon-pixel"
              style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '8px', color: 'var(--color-primary)' }}
            >
              {/* Plate top & bottom rim */}
              <rect x="3" y="1" width="6" height="1" />
              <rect x="3" y="10" width="6" height="1" />
              {/* Plate corners */}
              <rect x="2" y="2" width="1" height="1" />
              <rect x="9" y="2" width="1" height="1" />
              <rect x="2" y="9" width="1" height="1" />
              <rect x="9" y="9" width="1" height="1" />
              {/* Plate sides */}
              <rect x="1" y="3" width="1" height="6" />
              <rect x="10" y="3" width="1" height="6" />
              
              {/* Left Fork */}
              <rect x="3" y="4" width="1" height="2" />
              <rect x="5" y="4" width="1" height="2" />
              <rect x="4" y="5" width="1" height="3" />
              
              {/* Right Knife */}
              <rect x="7" y="4" width="1" height="3" />
              <rect x="8" y="4" width="1" height="2" />
              <rect x="7" y="7" width="1" height="1" />
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

import React from 'react';
import Link from 'next/link';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-content">
        <div className="footer-brand">
          <Link href="/" className="footer-logo">
            <span className="logo-accent">FOOD</span>WIKI
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

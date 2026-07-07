'use client';
import React from 'react';
import Link from 'next/link';
import './LegalPage.css';

const AboutPage = () => {
  return (
    <div className="legal-page">
      <h1>About <span className="text-primary">PlateWiki</span></h1>

      <div className="glass-panel legal-content">
        <h2>The Story Behind PlateWiki</h2>
        <p>
          PlateWiki started with a simple frustration. As a tech nerd who fell in love with fitness and
          sports performance, I kept running into the same problem: my coach or nutritionist would explain
          a nutrition concept, and I would understand it in the moment, but by the time I got home, the details had faded.
          I would search online and find scattered YouTube clips, contradictory Reddit threads, and paywalled courses.
          Never a single, well-organized reference that treated food and nutrient knowledge the way a developer treats
          documentation.
        </p>
        <p>
          I wanted a repository. Not a diet course with a sales funnel. Not a social media recipe reel. A{' '}
          <strong>structured, searchable, free database</strong> of sports nutrition where every whole food, every
          macro profile, and every adaptogen is broken down with clear steps, common preparation pitfalls, target muscle groups,
          and performance guidelines. The kind of reference I wished existed when I was learning how to fuel my body.
        </p>
        <p>
          So I built it.
        </p>

        <h2>Our Mission</h2>
        <p>
          Sports nutrition has often been taught through oral tradition, passed athlete to athlete, gym to gym. That system
          works inside a community, but it leaves millions of people without access to quality nutrition science.
          We believe that <strong>foundational sports nutrition knowledge should be accessible to everyone, everywhere.</strong>
        </p>
        <p>
          PlateWiki is designed to be the <strong>world&apos;s best-organized nutrition database.</strong> Every food
          page includes step-by-step nutrient profiles, preparation tips from experienced athletes, the specific muscle target groups involved,
          common pitfalls to avoid, meal prep combinations to build the physical attributes you need, and connections
          to related nutrients so you can see how everything fits together.
        </p>
        <p>
          We are not trying to replace your nutritionist. We are trying to be the reference you pull up after buying groceries to
          review what you bought, or before meal prepping to come prepared.
        </p>

        <h2>What Makes PlateWiki Different</h2>
        <ul>
          <li>
            <strong>Interactive Anatomy Map:</strong> Click any muscle group on our anatomical model to see its nutritional targets
            and the whole foods that feed it. Understanding the &ldquo;why&rdquo; behind each food makes the nutrition stick.
          </li>
          <li>
            <strong>Premium Food Library:</strong> Every food entry includes step-by-step nutritional instructions, pro tips,
            common pitfalls, targeting cues, and meal combinations.
          </li>
          <li>
            <strong>AI Digestion & Fasting Timer:</strong> Track your feeding intervals and refeed schedules in real-time.
          </li>
          <li>
            <strong>Goal-Aware Instructions:</strong> Adapt recommendations to your athlete type (runner, lifter, fighter) and biometric goals.
          </li>
          <li>
            <strong>No Paywalls on Fundamentals:</strong> The core food library will always be free. We
            support the site through non-intrusive advertising and optional premium features.
          </li>
        </ul>

        <h2>Meet the Team</h2>
        <p>
          PlateWiki was founded by software engineer Kevin Adu-Poku in collaboration with PlayersClub LLC, the company co-founded by Joshua Anthony Aquino and Coach Josh.
        </p>
        <div className="team-grid">
          <div className="team-card glass-panel">
            <h3>Kevin Adu-Poku</h3>
            <div className="role">Founder & Software Engineer</div>
            <p>
              Kevin is a solutions engineer and software developer specializing in front-end architecture, interactive data modeling, and web performance. He built PlateWiki's core codebase, including the Interactive Anatomy Map and the webcam-based AI Harvest Tracker, and collaborates with PlayersClub LLC on the platform's content and growth.
            </p>
            <div className="team-links">
              <a href="https://www.linkedin.com/in/kevinadupoku" target="_blank" rel="noopener noreferrer">LinkedIn</a>
            </div>
          </div>

          <div className="team-card glass-panel">
            <h3>Joshua Anthony Aquino</h3>
            <div className="role">Co-Founder, PlayersClub LLC</div>
            <p>
              Joshua is a data engineer who specializes in analytics pipelines and operational strategy. A UMass Amherst graduate, he co-founded PlayersClub LLC with Coach Josh and runs the data, business operations, and content performance side of the company. At PlateWiki, he handles content strategy, SEO analysis, and growth.
            </p>
            <div className="team-links">
              <a href="https://www.linkedin.com/in/jpanthony2018" target="_blank" rel="noopener noreferrer">LinkedIn</a>
            </div>
          </div>

          <div className="team-card glass-panel">
            <h3>Coach Josh</h3>
            <div className="role">Co-Founder, PlayersClub LLC</div>
            <p>
              Josh is an athletic coach and fitness creator with 6+ years of experience and 200+ athletes trained. He co-founded PlayersClub LLC with Joshua Aquino. Known for his viral technique breakdowns with 150M+ views across social media, Coach Josh provides the technical authority, drills, and training blueprints that form the foundation of PlateWiki's content.
            </p>
            <div className="team-links">
              <a href="https://www.coachjoshofficial.com/" target="_blank" rel="noopener noreferrer">Website</a>
              <a href="https://instagram.com/coachjoshofficial" target="_blank" rel="noopener noreferrer">Instagram</a>
              <a href="https://youtube.com/@coachjoshofficial" target="_blank" rel="noopener noreferrer">YouTube</a>
            </div>
          </div>
        </div>

        <h2>Community</h2>
        <p>
          PlateWiki is also a growing community of performance fueling enthusiasts, beginners, and
          experienced athletes who share a passion for clean nutrition. Join our{' '}
          <strong>Discord community</strong> to discuss recipes, share meal prep photos, get feedback on your
          macronutrients, and connect with other health-conscious athletes around the world.
        </p>

        <h2>Our Editorial Process</h2>
        <p>
          Every food page on PlateWiki is written and reviewed with input from experienced coaches and nutritionists.
          We cross-reference multiple scientific sources to ensure accuracy, and we update content regularly as we
          receive feedback from the community. Our goal is <strong>accuracy over quantity</strong>.
        </p>
        <p>
          If you spot an error, have a suggestion, or want to contribute, reach out through
          our <Link href="/contact">contact page</Link>. We take every piece of feedback seriously.
        </p>

        <h2>Built With ❤️ and Code</h2>
        <p>
          PlateWiki is an independent project built by a small team that loves both technology and sports nutrition. We are
          constantly improving the platform: adding new whole foods, refining the digestion tools, and building
          features that make learning nutrition more accessible and effective.
        </p>
      </div>
    </div>
  );
};

export default AboutPage;

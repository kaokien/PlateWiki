'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { ShoppingBag, Bell, ChevronRight } from 'lucide-react';
import './Merch.css';

interface Product {
  id: string;
  name: string;
  tagline: string;
  price: string;
  image: string;
  category: 'apparel' | 'gear';
  badge?: string;
}

const products: Product[] = [
  {
    id: 'tshirt-black',
    name: 'Foundation Tee',
    tagline: 'Heavyweight cotton. Built for the gym and the street.',
    price: '$34.99',
    image: '/images/merch/tshirt-black.png',
    category: 'apparel',
    badge: 'Core',
  },
  {
    id: 'hoodie-charcoal',
    name: 'Ringside Hoodie',
    tagline: 'Premium pullover. Warm up, cool down, rep the sport.',
    price: '$64.99',
    image: '/images/merch/hoodie-charcoal.png',
    category: 'apparel',
    badge: 'Popular',
  },
  {
    id: 'tshirt-white',
    name: '"Train Like You Mean It" Tee',
    tagline: 'Clean design. Loud statement.',
    price: '$34.99',
    image: '/images/merch/tshirt-white.png',
    category: 'apparel',
  },
  {
    id: 'cap-black',
    name: 'BW Snapback',
    tagline: 'Structured crown. Embroidered monogram.',
    price: '$29.99',
    image: '/images/merch/cap-black.png',
    category: 'apparel',
  },
  {
    id: 'handwraps',
    name: 'Mexican-Style Hand Wraps',
    tagline: '180" semi-elastic. Protect your hands, rep the brand.',
    price: '$16.99',
    image: '/images/merch/handwraps.png',
    category: 'gear',
    badge: 'Fight Gear',
  },
  {
    id: 'gymbag',
    name: 'Gym Duffel',
    tagline: 'Fits gloves, wraps, and everything else. Red zipper pulls.',
    price: '$49.99',
    image: '/images/merch/gymbag.png',
    category: 'gear',
  },
];

function ProductCard({ product }: { product: Product }) {
  return (
    <div className="merch-card">
      <div className="merch-card__image-wrap">
        <Image
          src={product.image}
          alt={product.name}
          width={600}
          height={600}
          className="merch-card__image"
        />
        {product.badge && (
          <span className="merch-card__badge">{product.badge}</span>
        )}
      </div>
      <div className="merch-card__body">
        <h3 className="merch-card__name">{product.name}</h3>
        <p className="merch-card__tagline">{product.tagline}</p>
        <div className="merch-card__footer">
          <span className="merch-card__price">{product.price}</span>
          <button className="merch-card__btn" disabled>
            Coming Soon
          </button>
        </div>
      </div>
    </div>
  );
}

export default function MerchPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleNotify = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubmitted(true);
    }
  };

  const apparel = products.filter((p) => p.category === 'apparel');
  const gear = products.filter((p) => p.category === 'gear');

  return (
    <main className="merch-page">
      {/* Hero */}
      <section className="merch-hero">
        <div className="merch-hero__badge">
          <ShoppingBag size={14} /> Coming Soon
        </div>
        <h1>FoodWiki Merch</h1>
        <p className="merch-hero__subtitle">
          Premium gear for fighters, coaches, and fans. Every piece designed to
          rep the sport, not just wear it.
        </p>

        {/* Notify form */}
        {!submitted ? (
          <form className="merch-notify" onSubmit={handleNotify}>
            <input
              type="email"
              placeholder="Enter your email for launch day access"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="merch-notify__input"
              required
            />
            <button type="submit" className="merch-notify__btn">
              <Bell size={16} /> Notify Me
            </button>
          </form>
        ) : (
          <div className="merch-notify__success">
            <Bell size={16} /> You&apos;re on the list. We&apos;ll email you on drop day.
          </div>
        )}
      </section>

      {/* Apparel */}
      <section className="merch-section">
        <div className="merch-section__header">
          <h2>Apparel</h2>
          <p className="merch-section__count">{apparel.length} items</p>
        </div>
        <div className="merch-grid">
          {apparel.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* Gear */}
      <section className="merch-section">
        <div className="merch-section__header">
          <h2>Fight Gear</h2>
          <p className="merch-section__count">{gear.length} items</p>
        </div>
        <div className="merch-grid">
          {gear.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="merch-bottom">
        <p className="merch-bottom__text">
          Want to collaborate on a design or stock FoodWiki gear at your gym?
        </p>
        <a href="/contact" className="merch-bottom__link">
          Get in touch <ChevronRight size={16} />
        </a>
      </section>
    </main>
  );
}

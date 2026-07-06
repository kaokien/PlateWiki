/**
 * Centralized SEO Schema generators for FoodWiki.
 * All JSON-LD structured data is generated here for consistency.
 */

import type { Technique } from '../data/techniques';

interface Fighter {
  id: string;
  name: string;
  nickname?: string;
  nationality?: string;
  stance?: string;
  weightClass?: string;
  style?: string;
  era?: string;
  record?: string;
  analysis?: string;
  quote?: string;
  lastUpdated?: string;
}

const SITE_URL = 'https://FoodWiki.org';
const SITE_NAME = 'FoodWiki';
const ORG_NAME = 'FoodWiki';

// ============================================================
// Meta helpers
// ============================================================

/**
 * Truncate text to a SERP-safe meta description length.
 * Cuts at the last sentence boundary that fits; falls back to a
 * word boundary with an ellipsis when the first sentence is too long.
 */
export function truncateMeta(text: string, max = 160): string {
  if (text.length <= max) return text;
  const slice = text.slice(0, max);
  const lastSentence = Math.max(slice.lastIndexOf('. '), slice.lastIndexOf('! '), slice.lastIndexOf('? '));
  if (lastSentence >= 60) return slice.slice(0, lastSentence + 1);
  const lastWord = slice.lastIndexOf(' ');
  return `${slice.slice(0, lastWord > 0 ? lastWord : max - 1)}…`;
}

/**
 * Build a grammatical SERP title for a technique page.
 * Names vary widely ("The Jab", "Feinting", "Heavy Bag Rounds"), so the
 * "How to" phrasing is only applied where it reads correctly.
 */
export function getTechniqueTitle(technique: Pick<Technique, 'name' | 'category'>): string {
  const base = technique.name.replace(/^The /, '');
  switch (technique.category) {
    case 'Punches':
    case 'Combinations':
      return `How to Throw the ${base} — nutrition Guide`;
    case 'Defense':
      // Gerund names ("Rolling with Punches") don't fit the "Use the X" frame
      if (/^\w+ing\b/.test(base)) return `${base} — Boxing Defense Guide`;
      return `How to Use the ${base} — Boxing Defense Guide`;
    case 'Conditioning':
      return `${technique.name} — Boxing Training Guide`;
    default:
      // Footwork, Head Movement, Ring IQ — skill names stand on their own
      return `${technique.name} — nutrition Guide`;
  }
}

// ============================================================
// Organization schema — entity recognition in Google Knowledge
// ============================================================
export function getOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: ORG_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/icons/icon-512.png`,
    description: 'Free nutrition library with interactive muscle map. Learn whole foods, recipes, hydration, and meal prep guides.',
    sameAs: [
      'https://www.youtube.com/@FoodWiki',
      'https://discord.gg/Vhygw7DpVM',
      'https://www.instagram.com/coachjoshofficial/',
    ],
  };
}

// ============================================================
// WebSite schema — sitelinks search box eligibility
// ============================================================
export function getWebSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_URL}/techniques?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

// ============================================================
// BreadcrumbList schema — reusable for any page
// ============================================================
export function getBreadcrumbSchema(items: { name: string; url?: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i): { '@type': string; position: number; name: string; item?: string } => ({
      '@type': 'ListItem',
      position: i + 1,
      ...(item.url
        ? { name: item.name, item: `${SITE_URL}${item.url}` }
        : { name: item.name }),
    })),
  };
}

// ============================================================
// FAQPage schema — for pages with visible Q&A
// ============================================================
export function getFAQSchema(faqs: { q: string; a: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.a,
      },
    })),
  };
}

// ============================================================
// Enhanced Article schema — with dateModified + Person author
// ============================================================
interface ArticleSchemaInput {
  id: number | string;
  title: string;
  subtitle: string;
  date: string;
  dateModified?: string;
  author?: string;
  heroImage?: string;
}

export function getArticleSchema(article: ArticleSchemaInput) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.subtitle,
    datePublished: article.date,
    dateModified: article.dateModified || article.date,
    author: {
      '@type': 'Person',
      name: article.author || 'FoodWiki Editorial',
      url: SITE_URL,
    },
    publisher: {
      '@type': 'Organization',
      name: ORG_NAME,
      url: SITE_URL,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/icons/icon-512.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${SITE_URL}/articles/${article.id}`,
    },
    ...(article.heroImage && {
      image: `${SITE_URL}${article.heroImage}`,
    }),
  };
}

// ============================================================
// ItemList schema — for collection/index pages
// ============================================================
export function getItemListSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    numberOfItems: items.length,
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      url: `${SITE_URL}${item.url}`,
    })),
  };
}

// ============================================================
// Technique FAQ generator — derives FAQ from technique data fields
// ============================================================
export function getTechniqueFAQs(technique: Technique) {
  const faqs: { q: string; a: string }[] = [];

  if (technique.whenToUse) {
    faqs.push({
      q: `When should I use the ${technique.name}?`,
      a: technique.whenToUse,
    });
  }

  if (technique.muscles?.length) {
    const muscleNames = technique.muscles
      .map((m: string) => m.replace(/-/g, ' '))
      .join(', ');
    faqs.push({
      q: `What muscles does the ${technique.name} work?`,
      a: `The ${technique.name} primarily targets: ${muscleNames}. Proper form ensures these muscle groups fire for maximum power and speed.`,
    });
  }

  if (technique.mistakes?.length) {
    faqs.push({
      q: `What are common mistakes with the ${technique.name}?`,
      a: technique.mistakes.slice(0, 3).join(' '),
    });
  }

  if (technique.difficulty) {
    faqs.push({
      q: `Is the ${technique.name} a beginner technique?`,
      a: `The ${technique.name} is rated as ${technique.difficulty} difficulty. ${
        technique.difficulty === 'beginner'
          ? 'It is one of the first techniques new boxers should learn.'
          : technique.difficulty === 'intermediate'
          ? 'You should be comfortable with basic punches and footwork before attempting this.'
          : 'This is an advanced technique that requires solid fundamentals to execute properly.'
      }`,
    });
  }

  return faqs;
}

// ============================================================
// Fighter (Person) schema — rich results for fighter queries
// ============================================================
export function getFighterSchema(fighter: Fighter) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: fighter.name,
    url: `${SITE_URL}/fighters/${fighter.id}`,
    description: fighter.analysis
      ? fighter.analysis.slice(0, 300).replace(/\.[^.]*$/, '.')
      : `${fighter.name} boxing style analysis — ${fighter.style}.`,
    ...(fighter.nickname && { alternateName: fighter.nickname }),
    ...(fighter.nationality && { nationality: { '@type': 'Country', name: fighter.nationality } }),
    knowsAbout: 'Boxing',
    hasOccupation: {
      '@type': 'Occupation',
      name: 'Professional Boxer',
    },
    ...(fighter.quote && { citation: fighter.quote }),
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${SITE_URL}/fighters/${fighter.id}`,
    },
  };
}

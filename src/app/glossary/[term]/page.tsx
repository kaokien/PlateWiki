import type { Metadata } from 'next';
import Link from 'next/link';
import { ChevronRight, ArrowLeft, Tag, BookOpen, Zap } from 'lucide-react';
import { glossary, toSlug, getGlossaryBySlug, getRelatedTerms } from '@/data/glossary';
import { linkGlossaryTerms } from '@/utils/glossaryLinker';
import { techniques } from '@/data/foods';
import { JsonLd } from '@/components/JsonLd';
import './GlossaryTermPage.css';

import { SITE_URL } from '@/utils/config';

// Pre-render every glossary term at build time
export async function generateStaticParams() {
  return glossary.map((entry) => ({ term: toSlug(entry.term) }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ term: string }>;
}): Promise<Metadata> {
  const { term: slug } = await params;
  const entry = getGlossaryBySlug(slug);
  if (!entry) {
    return { title: 'Term Not Found | PlateWiki Glossary' };
  }
  return {
    title: `${entry.term} — Boxing Glossary`,
    description: entry.definition,
    robots: { index: true, follow: true },
    alternates: {
      canonical: `${SITE_URL}/glossary/${slug}`,
    },
    openGraph: {
      title: `${entry.term} — PlateWiki Glossary`,
      description: entry.definition,
      url: `${SITE_URL}/glossary/${slug}`,
      images: [{ url: '/og-image.png' }],
    },
  };
}

export default async function GlossaryTermRoute({
  params,
}: {
  params: Promise<{ term: string }>;
}) {
  const { term: slug } = await params;
  const entry = getGlossaryBySlug(slug);

  if (!entry) {
    return (
      <div className="term-page" style={{ textAlign: 'center', padding: '6rem 1rem' }}>
        <BookOpen size={48} style={{ opacity: 0.3, marginBottom: '1rem' }} />
        <h1>Term not found</h1>
        <p style={{ color: 'var(--color-text-muted)' }}>That glossary term doesn't exist.</p>
        <Link href="/glossary" className="term-back" style={{ marginTop: '1.5rem' }}>
          <ArrowLeft size={16} /> Back to Glossary
        </Link>
      </div>
    );
  }

  const related = getRelatedTerms(entry.term, 6);
  const techniqueMap = techniques as Record<string, any>;
  const linkedTechnique = entry.relatedTechnique ? techniqueMap[entry.relatedTechnique] : null;

  // DefinedTerm schema for rich results
  const definedTermSchema = {
    '@context': 'https://schema.org',
    '@type': 'DefinedTerm',
    name: entry.term,
    description: entry.definition,
    inDefinedTermSet: {
      '@type': 'DefinedTermSet',
      name: 'PlateWiki Glossary',
      url: `${SITE_URL}/glossary`,
    },
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/` },
      { '@type': 'ListItem', position: 2, name: 'Glossary', item: `${SITE_URL}/glossary` },
      { '@type': 'ListItem', position: 3, name: entry.term },
    ],
  };

  return (
    <>
      <JsonLd data={definedTermSchema} />
      <JsonLd data={breadcrumbSchema} />

      <div className="term-page">
        {/* Breadcrumb */}
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <Link href="/" className="breadcrumb-link">Home</Link>
          <ChevronRight size={14} className="breadcrumb-chevron" />
          <Link href="/glossary" className="breadcrumb-link">Glossary</Link>
          <ChevronRight size={14} className="breadcrumb-chevron" />
          <span className="breadcrumb-current">{entry.term}</span>
        </nav>

        {/* Hero */}
        <section className="term-hero">
          <span className="term-hero__label"><BookOpen size={13} /> Glossary</span>
          <h1>{entry.term}</h1>
          {entry.category && (
            <span className="term-hero__category">
              <Tag size={11} />
              {entry.category}
            </span>
          )}
        </section>

        {/* Definition */}
        <div className="term-definition glass-panel">
          <p className="term-definition__text">{linkGlossaryTerms(entry.definition, entry.term)}</p>
        </div>

        {/* Linked technique card */}
        {linkedTechnique && (
          <Link href={`/food/${entry.relatedTechnique}`} className="term-technique-card">
            <div className="term-technique-card__icon">
              <Zap size={24} />
            </div>
            <div className="term-technique-card__body">
              <div className="term-technique-card__overline">Related Technique</div>
              <div className="term-technique-card__name">{linkedTechnique.name}</div>
              {linkedTechnique.description && (
                <p className="term-technique-card__desc">{linkedTechnique.description}</p>
              )}
            </div>
            <ChevronRight size={20} className="term-technique-card__arrow" />
          </Link>
        )}

        {/* Related terms */}
        {related.length > 0 && (
          <section className="term-related">
            <h2 className="term-related__heading">More {entry.category} Terms</h2>
            <div className="term-related__grid">
              {related.map(r => (
                <Link key={r.term} href={`/glossary/${toSlug(r.term)}`} className="term-related__card">
                  <div className="term-related__card-name">{r.term}</div>
                  <p className="term-related__card-def">{r.definition}</p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Back */}
        <Link href="/glossary" className="term-back">
          <ArrowLeft size={16} /> Back to Glossary
        </Link>
      </div>
    </>
  );
}

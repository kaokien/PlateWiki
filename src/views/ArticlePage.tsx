import React, { useEffect, useRef } from 'react';
import { addToHistory } from '../utils/favorites';
import type { Article, ArticleSection } from '../utils/contentLoader';
import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { redirect } from 'next/navigation';
import { Clock, ChevronRight, ArrowLeft, BookOpen, ExternalLink, Play, User } from 'lucide-react';
import { getArticleById, getRelatedArticles } from '../data/articles';
import { techniques } from '../data/techniques';
import { useFighterProfile } from '../context/FighterProfileContext';
import FloatingAudioPlayer from './FloatingAudioPlayer';
import ShareButton from '../components/ShareButton';
import './ArticlePage.css';

interface ArticlePageProps {
  article?: Article;
}


/**
 * Lightweight content renderer.
 * Supports **bold** markers and \n paragraph breaks.
 */
const renderContent = (text: string) => {
  if (!text) return null;

  // Split on double newlines for paragraphs
  const paragraphs = text.split(/\n\n|\n/);

  return paragraphs.map((para, i) => {
    // Parse **bold** markers within each paragraph
    const parts = para.split(/(\*\*[^*]+\*\*)/);
    const rendered = parts.map((part, j) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={j}>{part.slice(2, -2)}</strong>;
      }
      return part;
    });

    return <p key={i}>{rendered}</p>;
  });
};

const ArticlePage = ({ article: propArticle }: ArticlePageProps) => {
  const params = useParams<{ id: string }>();
  const id = params?.id ?? '';
  const article = propArticle || getArticleById(id);

  if (!article) { redirect('/articles'); return null; }

  const related = article.relatedArticles
    ? article.relatedArticles.map((relId) => getArticleById(relId)).filter((a): a is Article => Boolean(a))
    : getRelatedArticles(id);

  const linkedTechniques = (article.relatedTechniques || [])
    .map(techId => techniques[techId])
    .filter(Boolean);

  const { awardXP } = useFighterProfile();
  const xpAwardedRef = useRef(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  // Award XP when user scrolls past ~80% of article
  useEffect(() => {
    if (article) {
      addToHistory({ id, type: 'article', title: article.title, href: `/article/${id}` });
    }
  }, [id, article]);

  useEffect(() => {
    xpAwardedRef.current = false;
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !xpAwardedRef.current) {
          xpAwardedRef.current = true;
          awardXP('article_read', { articleId: id });
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [id, awardXP]);

  const breadcrumbItems = [
    { name: 'Home', url: '/' },
    { name: 'Articles', url: '/articles' },
    { name: article.category, url: `/articles?category=${encodeURIComponent(article.category)}` },
    { name: article.title },
  ];

  return (
    <div className="article-page">
{/* Breadcrumbs */}
      <nav className="article-breadcrumbs" aria-label="Breadcrumb">
        <Link href="/articles"><ArrowLeft size={14} /> Articles</Link>
        <ChevronRight size={14} />
        <span>{article.category}</span>
      </nav>

      {/* Hero */}
      <header className="article-hero">
        {article.heroImage && (
          <div className="article-hero__image">
            <Image src={article.heroImage} alt={article.title} fill className="article-hero__img" priority sizes="100vw" />
            <div className="article-hero__gradient" />
          </div>
        )}
        <div className="article-hero__content">
          <span className="article-hero__category">{article.category}</span>
          <h1>{article.title}</h1>
          <p className="article-hero__subtitle">{article.subtitle}</p>
          <div className="article-hero__meta">
            <span className="article-hero__author">
              <User size={14} />
              {article.author || 'FoodWiki Editorial'}
            </span>
            <span className="article-hero__divider">·</span>
            <span className="article-hero__date">
              {new Date(article.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </span>
            {article.dateModified && article.dateModified !== article.date && (
              <>
                <span className="article-hero__divider">·</span>
                <span className="article-hero__updated">
                  Updated {new Date(article.dateModified).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </span>
              </>
            )}
            <span className="article-hero__divider">·</span>
            <span className="article-hero__read-time">
              <Clock size={14} />
              {article.readTime} read
            </span>
            <ShareButton title={article.title} description={article.subtitle} url={`/articles/${article.id}`} />
          </div>
          {article.tags && (
            <div className="article-hero__tags">
              {article.tags.map(tag => (
                <span key={tag} className="article-tag">{tag}</span>
              ))}
            </div>
          )}
        </div>
      </header>

      <div className="article-layout">
        {/* Main Content */}
        <article className="article-body">
          {/* YouTube Embed */}
          {article.youtubeId && /^[a-zA-Z0-9_-]{11}$/.test(article.youtubeId) && (
            <div className="article-video">
              <div className="article-video__embed">
                <iframe
                  src={`https://www.youtube.com/embed/${article.youtubeId}`}
                  title={article.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  loading="lazy"
                />
              </div>
            </div>
          )}

          {/* Markdown Content (Remote) or Static Sections (Local) */}
          {article.contentHtml ? (
            <div 
              className="article-markdown-body" 
              dangerouslySetInnerHTML={{ __html: article.contentHtml }} 
            />
          ) : (
            article.sections.map((section, i) => (
              <section key={i} className="article-section">
                <h2>{section.heading}</h2>
                {section.content && <div className="article-section__content">{renderContent(section.content)}</div>}
                {section.list && (
                  <ul className="article-section__list">
                    {section.list.map((item: string, j: number) => (
                      <li key={j}>{renderContent(item)}</li>
                    ))}
                  </ul>
                )}
              </section>
            ))
          )}

          {/* YouTube CTA */}
          <div className="article-youtube-cta">
            <Play size={20} />
            <div>
              <strong>Watch related tutorials on YouTube</strong>
              <p>See these techniques broken down by featured creator Coach Josh.</p>
            </div>
            <a
              href="https://www.youtube.com/@Coachjoshofficial"
              target="_blank"
              rel="noopener noreferrer"
              className="article-youtube-cta__link"
            >
              Visit Channel
              <ExternalLink size={14} />
            </a>
          </div>

          {/* Course CTA */}
          {article.callToAction && (
            <div className="article-course-cta">
              <h3>{article.callToAction.text}</h3>
              <p>The Boxing Blueprint is a 4-part video course covering fundamentals, conditioning, footwork, and fight strategy.</p>
              <Link href={article.callToAction.link} className="article-course-cta__button">
                View The Boxing Blueprint
                <ChevronRight size={16} />
              </Link>
            </div>
          )}

          {/* Practice CTA */}
          <div className="article-practice-cta glass-panel">
            <div className="article-practice-cta__content">
              <h3>Ready to Practice?</h3>
              <p>Put what you learned into action with a guided shadowboxing session or timed heavy bag workout.</p>
            </div>
            <div className="article-practice-cta__actions">
              <Link href="/workout" className="btn-primary">Start Workout →</Link>
              <Link href="/techniques" className="btn-secondary">Browse Techniques →</Link>
            </div>
          </div>
        </article>
        {/* Scroll-depth sentinel for XP tracking (placed after article body) */}
        <div ref={sentinelRef} aria-hidden="true" style={{ height: 1 }} />

        {/* Sidebar */}
        <aside className="article-sidebar">
          {/* Table of Contents */}
          <div className="article-toc">
            <h4>In This Article</h4>
            <ul>
              {article.sections.map((section, i) => (
                <li key={i}>
                  <a href={`#section-${i}`} onClick={(e) => {
                    e.preventDefault();
                    const selector = article.contentHtml ? '.article-markdown-body h2' : '.article-section';
                    document.querySelectorAll(selector)[i]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }}>
                    {section.heading}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Related Techniques */}
          {linkedTechniques.length > 0 && (
            <div className="article-sidebar-section">
              <h4>Related Techniques</h4>
              <div className="article-sidebar__links">
                {linkedTechniques.map(tech => (
                  <Link key={tech.id} href={`/technique/${tech.id}`} className="article-sidebar__tech-link">
                    <BookOpen size={14} />
                    {tech.name}
                    <ChevronRight size={14} />
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Tags */}
          {article.tags && (
            <div className="article-sidebar-section">
              <h4>Tags</h4>
              <div className="article-sidebar__tags">
                {article.tags.map(tag => (
                  <span key={tag} className="sidebar-tag">{tag}</span>
                ))}
              </div>
            </div>
          )}
        </aside>
      </div>

      {related.length > 0 && (
        <section className="article-related">
          <h3>Related Articles</h3>
          <div className="article-related__grid">
            {related.map(rel => (
              <Link key={rel.id} href={`/articles/${rel.id}`} className="article-related__card">
                {rel.heroImage && (
                  <div className="article-related__image">
                    <Image src={rel.heroImage} alt={rel.title} width={300} height={170} className="article-related__img" />
                  </div>
                )}
                <div className="article-related__info">
                  <span className="article-related__category">{rel.category}</span>
                  <h4>{rel.title}</h4>
                  <span className="article-related__meta">
                    <Clock size={12} />
                    {rel.readTime}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      <FloatingAudioPlayer articleId={article.id} articleTitle={article.title} />
    </div>
  );
};

export default ArticlePage;

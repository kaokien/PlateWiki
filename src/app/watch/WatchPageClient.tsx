'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Play, ExternalLink, BookOpen } from 'lucide-react';
import {
  watchVideos,
  VIDEO_CATEGORIES,
  type VideoCategory,
  type WatchVideo,
} from '@/data/watchVideos';
import './WatchPage.css';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type FilterValue = 'all' | VideoCategory;

const CATEGORY_ORDER: VideoCategory[] = [
  'fundamentals',
  'technique',
  'conditioning',
  'recovery',
  'lifestyle',
];

/* ------------------------------------------------------------------ */
/*  JSON-LD Schema                                                     */
/* ------------------------------------------------------------------ */

function VideoSchemaScripts() {
  const items = watchVideos.map((v) => ({
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name: v.title,
    description: v.description,
    contentUrl: v.url,
    embedUrl:
      v.platform === 'youtube'
        ? `https://www.youtube.com/embed/${v.videoId}`
        : v.url,
    uploadDate: '2025-01-01',
    thumbnailUrl:
      v.platform === 'youtube'
        ? `https://img.youtube.com/vi/${v.videoId}/hqdefault.jpg`
        : `https://FoodWiki.org${v.thumbnail}`,
    publisher: {
      '@type': 'Organization',
      name: 'FoodWiki',
      url: 'https://FoodWiki.org',
    },
  }));

  return (
    <>
      {items.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Video Card                                                         */
/* ------------------------------------------------------------------ */

function VideoCard({
  video,
  featured,
}: {
  video: WatchVideo;
  featured?: boolean;
}) {
  const [playing, setPlaying] = useState(false);
  const isYouTube = video.platform === 'youtube';
  const thumbSrc = isYouTube
    ? `https://img.youtube.com/vi/${video.videoId}/hqdefault.jpg`
    : video.thumbnail;
  const platformLabel = isYouTube ? 'YouTube' : 'Instagram';
  const formatLabel = video.format === 'long' ? '' : ' · Short';

  const handleClick = (e: React.MouseEvent) => {
    if (isYouTube) {
      e.preventDefault();
      setPlaying(true);
    }
  };

  return (
    <a
      href={video.url}
      target={isYouTube ? undefined : '_blank'}
      rel={isYouTube ? undefined : 'noopener noreferrer'}
      className={`watch-card${featured ? ' watch-card--featured' : ''}`}
      aria-label={`Watch ${video.title} on ${platformLabel}`}
      onClick={handleClick}
    >
      <div className="watch-card__thumbnail">
        {playing ? (
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${video.videoId}?autoplay=1&rel=0`}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="watch-card__player"
          />
        ) : (
          <>
            {isYouTube ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={thumbSrc}
                alt={video.title}
                className="watch-card__image"
                loading={featured ? 'eager' : 'lazy'}
              />
            ) : (
              <Image
                src={thumbSrc}
                alt={video.title}
                width={featured ? 720 : 540}
                height={featured ? 405 : 540}
                className="watch-card__image"
                priority={featured}
              />
            )}
            <div className="watch-card__play-overlay">
              <Play size={featured ? 64 : 48} fill="white" strokeWidth={0} />
            </div>
          </>
        )}
      </div>
      <div className="watch-card__body">
        <div className="watch-card__top-row">
          <span className={`watch-badge watch-badge--${video.category}`}>
            {VIDEO_CATEGORIES[video.category].label}
          </span>
          <span className="watch-card__source">
            <ExternalLink size={12} /> {platformLabel}
            {formatLabel}
          </span>
        </div>
        <h3 className="watch-card__title">{video.title}</h3>
        <p className="watch-card__desc">{video.description}</p>
        {video.relatedTechniques && video.relatedTechniques.length > 0 && (
          <div className="watch-card__techniques">
            <BookOpen size={13} />
            {video.relatedTechniques.map((t, i) => (
              <React.Fragment key={t.slug}>
                {i > 0 && <span className="watch-card__tech-sep">·</span>}
                <a
                  href={`/technique/${t.slug}`}
                  className="watch-card__tech-link"
                  onClick={(e) => e.stopPropagation()}
                >
                  {t.label}
                </a>
              </React.Fragment>
            ))}
          </div>
        )}
      </div>
    </a>
  );
}

/* ------------------------------------------------------------------ */
/*  Section (used in "All" view)                                       */
/* ------------------------------------------------------------------ */

function VideoSection({
  category,
  videos,
}: {
  category: VideoCategory;
  videos: WatchVideo[];
}) {
  if (videos.length === 0) return null;
  const meta = VIDEO_CATEGORIES[category];
  return (
    <section className="watch-section">
      <div className="watch-section__header">
        <h2>
          <span className="watch-section__icon">{meta.emoji}</span> {meta.label}
        </h2>
        <p className="watch-section__count">
          {videos.length} video{videos.length !== 1 ? 's' : ''}
        </p>
      </div>
      <div className="watch-grid">
        {videos.map((video) => (
          <VideoCard key={video.id} video={video} />
        ))}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function WatchPageClient() {
  const [filter, setFilter] = useState<FilterValue>('all');

  // Featured = first long-form YouTube video (only shown in "all" view)
  const longForm = watchVideos.filter(
    (v) => v.platform === 'youtube' && v.format === 'long'
  );
  const featured = longForm[0];

  // Build filter options with counts
  const filters: { value: FilterValue; label: string; count: number }[] = [
    { value: 'all', label: 'All', count: watchVideos.length },
    ...CATEGORY_ORDER.map((cat) => ({
      value: cat as FilterValue,
      label: VIDEO_CATEGORIES[cat].label,
      count: watchVideos.filter((v) => v.category === cat).length,
    })).filter((f) => f.count > 0),
  ];

  // Filtered videos (exclude featured from "all" section view)
  const remaining = filter === 'all'
    ? watchVideos.filter((v) => v.id !== featured?.id)
    : watchVideos.filter((v) => v.category === filter);

  return (
    <>
      <VideoSchemaScripts />

      <main className="watch-page">
        {/* Hero */}
        <section className="watch-hero">
          <p className="watch-hero__label">🥊 Training Videos</p>
          <h1>Coach Josh Training Videos</h1>
          <p className="watch-hero__subtitle">
            Free nutrition breakdowns, conditioning drills, and recovery
            routines from Coach Josh, co-founder of{' '}
            <a
              href="https://www.coachjoshofficial.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              PlayersClub LLC
            </a>{' '}
            and FoodWiki&apos;s lead coach.
          </p>
          <div className="watch-hero__links">
            <a
              href="https://www.youtube.com/@Coachjoshofficial"
              target="_blank"
              rel="noopener noreferrer"
              className="watch-hero__follow watch-hero__follow--yt"
            >
              YouTube
            </a>
            <a
              href="https://instagram.com/coachjoshofficial"
              target="_blank"
              rel="noopener noreferrer"
              className="watch-hero__follow watch-hero__follow--ig"
            >
              Instagram
            </a>
          </div>
        </section>

        {/* Filters */}
        <div className="watch-filters" role="tablist" aria-label="Filter videos by category">
          {filters.map((f) => (
            <button
              key={f.value}
              className={`watch-filter-btn${filter === f.value ? ' watch-filter-btn--active' : ''}`}
              onClick={() => setFilter(f.value)}
              role="tab"
              aria-selected={filter === f.value}
            >
              {f.label}
              <span className="watch-filter-btn__count">{f.count}</span>
            </button>
          ))}
        </div>

        {/* "All" view: featured + sections */}
        {filter === 'all' && (
          <>
            {featured && (
              <section className="watch-featured">
                <VideoCard video={featured} featured />
              </section>
            )}
            {CATEGORY_ORDER.map((cat) => {
              const vids = remaining.filter((v) => v.category === cat);
              return <VideoSection key={cat} category={cat} videos={vids} />;
            })}
          </>
        )}

        {/* Filtered view: flat grid */}
        {filter !== 'all' && (
          <>
            <p className="watch-count">
              {remaining.length} video{remaining.length !== 1 ? 's' : ''}
            </p>
            <div className="watch-grid">
              {remaining.map((video) => (
                <VideoCard key={video.id} video={video} />
              ))}
            </div>
          </>
        )}
      </main>
    </>
  );
}

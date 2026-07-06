# BoxingWiki Articles System — Scalable Content Engine

Build a MuscleWiki-style articles section that scales to 100+ SEO-optimized pages, each linking back to Coach Josh's YouTube Shorts.

## Key Findings

### MuscleWiki Articles Structure
- **Categories sidebar**: Nutrition, Muscle Gain, Science Simplified, Body Fat Loss, Exercise Form, For Total Newbies, Workouts, Equipment Reviews, Golden Programs
- **Featured carousel** at top + card grid below
- **Individual articles**: Hero image, author byline, date, category tag, long-form content
- **No complex CMS** — content is statically defined and rendered

### Coach Josh YouTube Shorts
- **~200+ shorts** on the channel
- **Critical issue**: Most shorts use **hashtag-only titles** (e.g., `#boxeo #boxing #coaching #mma`) with no descriptive text
- **This means**: We cannot auto-generate articles from video titles. Instead, we build articles based on Josh's known expertise areas and **manually map relevant shorts to each article** via YouTube embed IDs
- **Recommendation**: Going forward, Josh should title shorts descriptively (e.g., "How to Throw a Jab — Boxing Tutorial") to enable future automation

### Current Architecture
- 54 technique pages already exist in `src/data/` (punches, defense, footwork, combos, conditioning, ring strategy)
- Data-driven pattern: JSON objects → React components render them
- Same pattern will power articles — **one JSON file per category, one React component renders all articles**

---

## User Review Required

> [!IMPORTANT]
> **YouTube Shorts Mapping**: Since shorts have hashtag-only titles, I'll create articles based on Josh's coaching topics and you'll need to provide the **YouTube short video IDs** for each article. I'll create a placeholder system where you drop in the ID and it auto-embeds. For now, articles will have a "Watch the Tutorial" CTA linking to the channel.

> [!IMPORTANT]
> **Content Voice**: Articles will be written in Coach Josh's coaching voice (direct, no-BS, authoritative) matching the existing technique pages. Should I maintain this voice or shift to a more editorial/third-person style?

> [!IMPORTANT]
> **Pricing Tier**: Should any articles be Pro-gated, or should all articles be free to maximize SEO reach? MuscleWiki keeps all articles free. **My recommendation: keep all articles free for SEO, use them to funnel into the paid course and Pro subscription.**

## Open Questions

> [!NOTE]
> **YouTube Channel ID**: Do you want me to use the channel handle `@Coachjoshofficial` for all "Watch on YouTube" links, or a specific playlist URL?

> [!NOTE]
> **Article Images**: Should I generate AI hero images for each article, or will you provide real gym/training photos? AI images can be generated now; real photos can replace them later.

---

## Proposed Changes

### Phase 1: Infrastructure (This Session)

Build the article rendering engine, routing, and first batch of content.

---

#### Article Data Layer

##### [NEW] [articles/](file:///c:/Documents-Fuck%20Microsoft/BoxingWiki/src/data/articles/)
New directory for article content, organized by category:

##### [NEW] [boxing-fundamentals.js](file:///c:/Documents-Fuck%20Microsoft/BoxingWiki/src/data/articles/boxing-fundamentals.js)
##### [NEW] [conditioning-fitness.js](file:///c:/Documents-Fuck%20Microsoft/BoxingWiki/src/data/articles/conditioning-fitness.js)  
##### [NEW] [nutrition-weight.js](file:///c:/Documents-Fuck%20Microsoft/BoxingWiki/src/data/articles/nutrition-weight.js)
##### [NEW] [equipment-gear.js](file:///c:/Documents-Fuck%20Microsoft/BoxingWiki/src/data/articles/equipment-gear.js)
##### [NEW] [sparring-competition.js](file:///c:/Documents-Fuck%20Microsoft/BoxingWiki/src/data/articles/sparring-competition.js)
##### [NEW] [defense-countering.js](file:///c:/Documents-Fuck%20Microsoft/BoxingWiki/src/data/articles/defense-countering.js)
##### [NEW] [footwork-movement.js](file:///c:/Documents-Fuck%20Microsoft/BoxingWiki/src/data/articles/footwork-movement.js)
##### [NEW] [mindset-strategy.js](file:///c:/Documents-Fuck%20Microsoft/BoxingWiki/src/data/articles/mindset-strategy.js)
##### [NEW] [index.js](file:///c:/Documents-Fuck%20Microsoft/BoxingWiki/src/data/articles/index.js)
Barrel file that merges all categories into a single `articles` array, exports categories list.

**Article data model:**
```js
{
  id: 'how-to-throw-a-jab',           // URL slug
  title: 'How to Throw a Perfect Jab',
  subtitle: 'The most important punch in boxing, broken down step by step.',
  category: 'Boxing Fundamentals',
  tags: ['beginner', 'punches', 'technique'],
  date: '2026-05-10',
  readTime: '5 min',
  author: 'Coach Josh',
  youtubeId: null,                      // Placeholder — drop in short ID
  youtubeChannel: '@Coachjoshofficial',
  heroImage: null,                      // AI-generated or real photo path
  relatedTechniques: ['jab', 'cross'],  // Links to existing technique pages
  relatedArticles: ['jab-cross-combo-guide', 'footwork-for-beginners'],
  sections: [
    {
      heading: 'Why the Jab Matters',
      content: '...',                   // Markdown-like content
      list: ['...', '...'],             // Optional bullet points
    },
    // ... more sections
  ],
  callToAction: {
    text: 'Master the fundamentals with The Boxing Blueprint',
    link: '/course',
    type: 'course',                     // 'course' | 'youtube' | 'pro'
  },
}
```

---

#### Page Components

##### [NEW] [ArticlesPage.jsx](file:///c:/Documents-Fuck%20Microsoft/BoxingWiki/src/pages/ArticlesPage.jsx)
Article listing page (MuscleWiki-inspired):
- Category sidebar/filter bar
- Featured article carousel (latest 3)
- Card grid of all articles (thumbnail, title, category badge, read time)
- Search/filter by category
- SEO: JSON-LD `CollectionPage` schema, proper `<title>` and meta description

##### [NEW] [ArticlesPage.css](file:///c:/Documents-Fuck%20Microsoft/BoxingWiki/src/pages/ArticlesPage.css)

##### [NEW] [ArticlePage.jsx](file:///c:/Documents-Fuck%20Microsoft/BoxingWiki/src/pages/ArticlePage.jsx)
Individual article view:
- Hero section with category badge, title, author, date, read time
- YouTube Short embed (if `youtubeId` provided)
- Section-by-section content rendering
- Related techniques sidebar (links to existing `/technique/:id` pages)
- Related articles grid at bottom
- Course upsell CTA
- "Watch on YouTube" CTA linking to Coach Josh's channel
- SEO: JSON-LD `Article` schema, breadcrumbs, OG tags

##### [NEW] [ArticlePage.css](file:///c:/Documents-Fuck%20Microsoft/BoxingWiki/src/pages/ArticlePage.css)

---

#### Routing & Navigation

##### [MODIFY] [App.jsx](file:///c:/Documents-Fuck%20Microsoft/BoxingWiki/src/App.jsx)
- Add lazy imports for `ArticlesPage` and `ArticlePage`
- Add routes: `/articles` and `/articles/:id`

##### [MODIFY] [Footer.jsx](file:///c:/Documents-Fuck%20Microsoft/BoxingWiki/src/components/layout/Footer.jsx)
- Add "Articles" link in the Explore column

---

### Phase 2: Initial Content Seed (20+ Articles)

First batch across all 8 categories. Each article is 800-1500 words, SEO-optimized, with internal links.

| Category | Articles | Examples |
|---|---|---|
| **Boxing Fundamentals** | 5 | How to Throw a Jab, Proper Boxing Stance, The 1-2 Combo, How to Wrap Your Hands, Guard Position Explained |
| **Conditioning & Fitness** | 3 | Boxing Cardio vs Cardio Kickboxing, 20-Min Heavy Bag HIIT, Fighter's Conditioning Blueprint |
| **Nutrition & Weight** | 2 | What to Eat Before Training, Fight Week Weight Cut Guide |
| **Equipment & Gear** | 2 | Best Boxing Gloves for Beginners, Heavy Bag vs Double-End Bag |
| **Sparring & Competition** | 2 | Your First Sparring Session, How to Prepare for Your First Fight |
| **Defense & Countering** | 3 | Slip vs Roll: When to Use Each, The Shoulder Roll Explained, How to Parry a Jab |
| **Footwork & Movement** | 2 | Pendulum Step Breakdown, Cutting the Ring |
| **Mindset & Strategy** | 2 | Ring IQ: Reading Your Opponent, Building Confidence Through Boxing |

**Total: ~21 articles = 21 new SEO-indexable pages**

---

### Phase 3: Scale to 100+ (Future)

> [!NOTE]
> Phase 3 is a roadmap, not part of this implementation session.

- **YouTube Integration Script**: Once Josh re-titles shorts with descriptive names, we build a script that pulls video titles via YouTube Data API → auto-generates article stubs
- **Guest Articles**: Framework supports `author` field for future contributors
- **Pro-Gated Deep Dives**: Advanced strategy articles behind Pro paywall
- **Auto Internal Linking**: Script that cross-links articles ↔ techniques based on tag overlap
- **Sitemap Generation**: Auto-generate XML sitemap from article data for Google Search Console

---

## Content Category Taxonomy

```
Articles
├── Boxing Fundamentals      (stance, punches, combos, basics)
├── Defense & Countering     (slip, roll, block, parry, counter)
├── Footwork & Movement      (angles, distance, rhythm, ring control)
├── Conditioning & Fitness   (cardio, HIIT, strength, endurance)
├── Nutrition & Weight       (diet, hydration, weight cutting, recovery)
├── Equipment & Gear         (gloves, bags, wraps, gear reviews)
├── Sparring & Competition   (sparring tips, amateur fights, rules)
└── Mindset & Strategy       (ring IQ, fight prep, mental game)
```

---

## SEO Strategy

Each article page will include:
1. **Unique `<title>`**: `{Article Title} | BoxingWiki`
2. **Meta description**: First 155 chars of subtitle/intro
3. **Canonical URL**: `https://boxing.coachjoshofficial.com/articles/{slug}`
4. **JSON-LD Article schema**: Author, datePublished, headline, image
5. **Breadcrumbs**: Home > Articles > {Category} > {Title}
6. **Internal links**: Every article links to 2-3 related technique pages + 2-3 related articles
7. **YouTube embed**: Embedded short with proper `<iframe>` + noscript fallback
8. **Course CTA**: Every article ends with a Boxing Blueprint upsell

---

## Verification Plan

### Automated Tests
- `npm run build` — zero errors
- Verify all article routes render without crashes
- Check JSON-LD output with structured data testing tool

### Manual Verification
- Browser preview of `/articles` listing page
- Browser preview of individual article pages
- Verify YouTube embeds render (when IDs provided)
- Verify internal links to technique pages work
- Verify course CTA links to `/course`

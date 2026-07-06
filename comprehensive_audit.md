# BoxingWiki — Comprehensive Project Audit

**Date**: 2026-05-22 · **Scope**: Full codebase · **Stack**: Next.js 16 / React 19 / TypeScript / Vanilla CSS

---

## Executive Summary

BoxingWiki is a well-structured content-first boxing education site with 28 routes, 98+ techniques, 12 fighters, 102 glossary terms, and a camera-based shadowboxing trainer. The architecture is sound for its scale — static data modules, ISR for articles, localStorage persistence, no database.

**Overall Grade: B+** — Strong SEO foundation, good error handling, lean dependency tree. Dragged down by 3 critical security issues, a 114KB god component, 10MB of unoptimized images, and gaps in TypeScript strictness.

| Dimension | Grade | Key Issue |
|-----------|-------|-----------|
| Architecture | B | ShadowboxTracker god component (114KB), empty `src/pages/` dir |
| SEO | A- | Excellent JSON-LD + sitemap; homepage missing explicit metadata |
| Performance | C+ | 10.4MB unoptimized PNGs, 28MB audio, 350KB total CSS |
| Code Quality | B- | 91% coverage but 0 component tests; `noImplicitAny: false`; ESLint skips TS |
| Security | D+ | Hardcoded revalidation secret, unsanitized markdown→HTML, no CSP |
| Accessibility | B | Good aria-live coverage; ProGate modal fully inaccessible; globals missing reduced-motion |

---

## 🔴 Critical & High Priority Fixes

### 1. Hardcoded Revalidation Secret — 🔴 CRITICAL
**File**: [route.ts](file:///c:/Documents-Fuck%20Microsoft/BoxingWiki/src/app/api/revalidate/route.ts#L7)
```
const secret = process.env.REVALIDATE_SECRET || 'boxingwiki-secret-key-123';
```
Anyone can call `/api/revalidate?secret=boxingwiki-secret-key-123` to flush ISR cache. **Remove fallback, make env var required.**

### 2. Unsanitized Markdown → HTML (XSS) — 🔴 HIGH
**Files**: [contentLoader.ts:169](file:///c:/Documents-Fuck%20Microsoft/BoxingWiki/src/utils/contentLoader.ts#L169), [ArticlePage.tsx:164](file:///c:/Documents-Fuck%20Microsoft/BoxingWiki/src/views/ArticlePage.tsx#L164)

Markdown from GitHub → `marked.parse()` → raw HTML → `dangerouslySetInnerHTML`. No DOMPurify. If the repo is compromised, it's full XSS.

**Fix**: `npm install isomorphic-dompurify` → `DOMPurify.sanitize(await marked.parse(content))`

### 3. No Content Security Policy — 🔴 HIGH
**File**: [next.config.ts](file:///c:/Documents-Fuck%20Microsoft/BoxingWiki/next.config.ts)

Has X-Frame-Options and X-Content-Type-Options, but **no CSP header**. Given GA, AdSense, YouTube embeds, and `dangerouslySetInnerHTML`, CSP would significantly limit XSS blast radius.

### 4. ProGate Modal Fully Inaccessible — 🔴 HIGH (A11y)
**File**: [ProGate.tsx](file:///c:/Documents-Fuck%20Microsoft/BoxingWiki/src/components/ProGate.tsx)

- `<div onClick>` wrapper — no `role`, no `tabIndex`, no `onKeyDown`
- No `useFocusTrap`, no Escape handler
- No `role="dialog"`, no `aria-modal`
- Close button has icon-only, no `aria-label`

### 5. ShadowboxTracker God Component — 🟡 HIGH (Architecture)
**Files**: [ShadowboxTracker.tsx](file:///c:/Documents-Fuck%20Microsoft/BoxingWiki/src/components/ShadowboxTracker.tsx) (114KB, ~2741 lines), [ShadowboxTracker.css](file:///c:/Documents-Fuck%20Microsoft/BoxingWiki/src/components/ShadowboxTracker.css) (69KB, ~3100 lines)

Single file contains game logic, camera management, audio, recording, practice mode, combo mode, settings drawer, analytics, and full HUD rendering. Should be decomposed into sub-modules.

### 6. 10.4MB Unoptimized Images — 🟡 HIGH (Performance)
**Dir**: `public/images/`

| Sample | Size |
|--------|------|
| equipment-gear.png | 969 KB |
| nutrition-weight.png | 912 KB |
| course-impact.png | 824 KB |
| conditioning-fitness.png | 831 KB |
| **Total (~15 PNGs)** | **~10.4 MB** |

Already have proof: `gym-bg.webp` is 64KB vs `gym-bg.jpg` at 811KB — **92% savings**. Convert all PNGs to WebP.

---

## Architecture

### Stats
| Metric | Value |
|--------|-------|
| Routes | 28 (20 static, 8 dynamic) |
| Components | 44 files |
| Views | 54 files |
| Data modules | 20 files (~290KB) |
| Context providers | 3 (Stance, Subscription, FighterProfile) |
| API routes | 1 (`/api/revalidate`) |
| Dependencies | 7 runtime (very lean) |

### Data Layer
All content is static JS exports in `src/data/`. Articles additionally fetched from GitHub via `contentLoader.ts` with ISR (1hr revalidation). No database. All user state in localStorage with migration support via `storage.ts`.

### Strengths ✅
- Lean dependency tree — no heavy libs
- Proper error boundaries at root level
- `next/dynamic` lazy loading for heavy components
- Clean route structure with `generateStaticParams` for SSG

### Issues
| Severity | Issue |
|----------|-------|
| 🟡 | **`noImplicitAny: false`** in tsconfig — undermines strict mode |
| 🟡 | **`src/pages/`** empty dir — leftover from Vite migration, delete it |
| 🟡 | **`src/assets/`** has unused `react.svg`, `vite.svg` — stale artifacts |
| 🟡 | Data files are `.js` not `.ts` — no type safety on data definitions |
| 🟡 | Duplicate `Article` type in `types/index.ts` and `contentLoader.ts` |
| ℹ️ | `next: "latest"` unpinned — could break builds unexpectedly |

---

## SEO & Metadata

### Strengths ✅
- **Sitemap**: Dynamic, covers all techniques/fighters/glossary/articles
- **JSON-LD**: 7 schema types (Organization, WebSite, HowTo, Article, FAQPage, BreadcrumbList, ItemList)
- **Structured data test suite** at `seo.test.ts`
- **Semantic HTML**: Proper `<main>`, `<header>`, `<footer>`, `<nav>`, `<article>`, `<section>`, `<aside>`
- **Image optimization**: All using `next/image` with alt text, decorative images use `alt=""`
- **robots.txt**: Properly configured, blocks `/api/` and `/history`
- **404 page**: Custom branded

### Issues
| Severity | Issue |
|----------|-------|
| 🟡 | **Homepage** (`/`) has no explicit metadata — relies on layout fallback |
| 🟡 | **`program/[id]`** uses static `title: 'Training Program'` on dynamic route — every program gets same title |
| 🟡 | **`fighters/[id]`** missing OpenGraph override — no OG image |
| ℹ️ | Missing canonicals on filterable list pages (`/techniques?category=...`) |
| ℹ️ | No per-page Twitter card overrides on dynamic pages |

---

## Performance

### Strengths ✅
- Fonts via `next/font/google` with `display: 'swap'` — no render-blocking
- 7 components lazy-loaded via `next/dynamic`
- ISR with 1hr revalidation + tag-based on-demand revalidation
- GA loaded with `strategy="lazyOnload"`
- Lean runtime deps (no moment, no lodash, no jQuery)

### Issues
| Severity | Issue | Impact |
|----------|-------|--------|
| 🔴 | **10.4MB unoptimized PNGs** in `public/` | Slow page loads, high bandwidth |
| 🟡 | **28MB MP3 audio** in `public/audio/` (21 files) | No `preload="none"`, full download on mount |
| 🟡 | **ShadowboxTracker** 114KB + 69KB CSS | Largest single-component bundle |
| 🟡 | **GlobalSearch** eagerly imports ~290KB of data modules | All bundled into client JS |
| 🟡 | **`AudioContext` created per `playSound()` call** | Resource leak in ShadowboxTracker |
| 🟡 | **`frameHistoryRef.shift()`** in animation loop | O(n) per frame, should be ring buffer |
| 🟡 | **350KB total CSS** across 46 files | ShadowboxTracker.css alone is 69KB |
| ℹ️ | 3 `console.log` in production code | Minor noise |
| ℹ️ | PWA icons both 340KB | Should be optimized per resolution |
| ℹ️ | `ScreenRecording_05-15-2026.mov` (1.33MB) in repo root | Delete from repo |

---

## Code Quality & Testing

### Test Coverage
```
Overall:   91.83% statements | 81.08% branches | 90.24% functions | 94.06% lines
```

**13 test files, 209 tests, 1,817 lines of test code.**

### Strengths ✅
- 91%+ statement coverage on tested modules
- Comprehensive edge-case testing (quota exceeded, disabled storage, malformed data)
- SEO test suite validates sitemap coverage and schema integrity
- Zero `@ts-ignore` / `@ts-expect-error`
- Zero `TODO` / `FIXME` / `HACK`
- Consistent naming conventions (PascalCase components, camelCase utils)

### Issues
| Severity | Issue |
|----------|-------|
| 🟡 | **`noImplicitAny: false`** — defeats strict mode |
| 🟡 | **ESLint only targets `.js/.jsx`** — all TypeScript files skip linting |
| 🟡 | **45 `any` usages** (26 type annotations + 19 `as any` casts) |
| 🟡 | **Zero component/view tests** — 20+ components, 25+ views completely untested |
| 🟡 | **vitest uses `environment: 'node'`** — prevents DOM testing (jsdom already in devDeps) |
| ℹ️ | `useScrollReveal.js` should be `.ts` |
| ℹ️ | Article-related props use `any` instead of proper interfaces |

### `any` Hotspots
- `ArticlePage.tsx` / `ArticlesPage.tsx` — article props fully untyped
- `GlobalSearch.tsx` — 4× `(t: any)` filter callbacks
- `CookieConsent.tsx` — 4× `(window as any).gtag`
- `seoSchemas.ts` — function params untyped

---

## Security

### Strengths ✅
- No `.env` files committed
- No `eval()` or `Function()` usage
- Cookie consent with Google Consent Mode v2 — well implemented
- localStorage access wrapped in try/catch via `safeStorage.ts`
- All fetch calls have error handling
- No file upload handling
- No CORS issues (single API route, same-origin)

### Issues
| Severity | Issue | File |
|----------|-------|------|
| 🔴 | **Hardcoded revalidation secret** `'boxingwiki-secret-key-123'` | `route.ts:7,40` |
| 🔴 | **Unsanitized markdown→HTML** via `marked` + `dangerouslySetInnerHTML` | `contentLoader.ts:169`, `ArticlePage.tsx:164` |
| 🟡 | **No CSP header** | `next.config.ts` |
| 🟡 | **`.gitignore` missing `.env`** — only has `*.local` | `.gitignore` |
| 🟡 | **No JSON schema validation** on parsed localStorage data | All storage utils |
| 🟡 | **Client-side subscription state** trivially spoofable | `SubscriptionContext.tsx` |
| ℹ️ | AdSense loaded as raw `<script>` not `next/Script` | `layout.tsx:132` |
| ℹ️ | YouTube embed `youtubeId` not validated with regex | `ArticlePage.tsx:149` |

---

## Accessibility (WCAG 2.2 AA)

### Strengths ✅
- Skip-to-content link properly implemented
- `useFocusTrap` hook used in 5 modal components
- Good `aria-live` coverage (contact form, email capture, HUD overlays, storage warnings)
- Roving tabindex pattern on article category tabs
- Contact form has `aria-describedby`, `aria-invalid` — exemplary
- ShadowboxTracker HUD has comprehensive `prefers-reduced-motion` support
- All images have alt text

### Issues
| Severity | Issue | WCAG | File |
|----------|-------|------|------|
| 🔴 | **ProGate modal** — no focus trap, no dialog role, no keyboard handling | 2.1.1, 2.4.3 | `ProGate.tsx` |
| 🟡 | **globals.css missing `prefers-reduced-motion`** — fadeIn/wobble/shimmer fire for all users | 2.3.3 | `globals.css` |
| 🟡 | **TechniquePage autoplay video** — no pause/play controls | 2.2.2 | `TechniquePage.tsx:141` |
| 🟡 | **`rgba(255,255,255,0.4)` text** — ~3.3:1 contrast, fails AA | 1.4.3 | `ArticlePage.css:12` |
| 🟡 | **`.sr-only` class defined but never used** | 1.3.1 | `globals.css` |
| ℹ️ | WorkoutGenerator step transitions not announced | 4.1.3 | `WorkoutGeneratorPage.tsx` |
| ℹ️ | XPToast dismiss only via click, no keyboard | 2.1.1 | `XPToast.tsx:32` |

---

## Prioritized Fix Backlog

### 🔴 Critical (fix immediately)
1. Remove hardcoded revalidation secret from `route.ts`
2. Add DOMPurify to markdown→HTML pipeline in `contentLoader.ts`
3. Add CSP header in `next.config.ts`

### 🟡 High (fix this sprint)
4. Fix ProGate modal accessibility (focus trap, dialog role, keyboard)
5. Convert all PNGs to WebP (~90% size reduction)
6. Add `.env` to `.gitignore`
7. Enable `noImplicitAny: true` in tsconfig
8. Fix ESLint to target `.ts/.tsx` files

### 🟠 Medium (fix this month)
9. Add `prefers-reduced-motion` to `globals.css`
10. Add pause controls to TechniquePage autoplay video
11. Fix `rgba(0.4)` contrast failure in `ArticlePage.css`
12. Add `preload="none"` to audio elements
13. Split ShadowboxTracker into sub-modules
14. Move GlobalSearch corpus to server-side API
15. Fix AudioContext leak in ShadowboxTracker
16. Add homepage explicit metadata
17. Fix `program/[id]` to use `generateMetadata`

### 🟢 Low (backlog)
18. Delete empty `src/pages/` directory
19. Delete stale `src/assets/` Vite files
20. Delete `.mov` recording from repo root
21. Convert data files from `.js` to `.ts`
22. Add component tests with jsdom environment
23. Use ring buffer for frameHistory instead of Array.shift()
24. Validate YouTube embed IDs with regex
25. Start using `.sr-only` class for icon-only buttons

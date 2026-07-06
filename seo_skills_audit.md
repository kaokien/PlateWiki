# BoxingWiki — Relevant SEO Skills from Repository

Scanned 500+ skills. Here are the ones directly applicable to BoxingWiki's SEO goals, organized by priority.

---

## 🔴 Tier 1 — Use Now (Highest Impact)

### 1. `seo-audit`
**What it does:** Full diagnostic SEO audit with a scored 0-100 Health Index across 5 categories (Crawlability, Technical, On-Page, Content Quality/E-E-A-T, Authority).
**Why BoxingWiki needs it:** We're a client-side React SPA with 102 URLs. This skill will identify the exact SEO blockers — JS rendering issues, missing canonicals, crawl budget problems, and index coverage gaps.
**Action:** Run a full audit against the production site.

### 2. `schema-markup`
**What it does:** Designs, validates, and optimizes JSON-LD structured data for Google rich result eligibility.
**Why BoxingWiki needs it:** We have basic `Article` and `CollectionPage` schema but are missing several opportunities:
- `HowTo` schema on technique pages (step-by-step boxing instructions = perfect fit)
- `BreadcrumbList` schema (we render breadcrumbs but don't have schema for them)
- `Organization` schema on the about/homepage
- `Course` schema on the Boxing Blueprint page
- `FAQPage` schema if we add FAQ sections to articles
**Action:** Run the Schema Eligibility Index on each page type.

### 3. `seo-fundamentals`
**What it does:** Core principles — E-E-A-T evaluation, Core Web Vitals, technical foundations, content quality signals.
**Why BoxingWiki needs it:** Establishes the baseline framework. Key insight: "Technical SEO enables ranking; content quality earns it." Our content is strong but technical SEO (CSR SPA) is the constraint.

---

## 🟡 Tier 2 — Use Next (Growth Multipliers)

### 4. `geo-fundamentals` (Generative Engine Optimization)
**What it does:** Optimizes content to be cited by AI search engines (ChatGPT, Claude, Perplexity, Gemini).
**Why BoxingWiki needs it:** Boxing technique content is exactly the kind of structured, authoritative, step-by-step content that AI engines cite. The GEO checklist includes:
- Question-based titles ✅ (most articles already have these)
- Clear definitions ✅
- Step-by-step guides ✅
- Expert quotes (need to add Coach Josh attribution)
- FAQ sections (not yet implemented)
- Author credentials (not yet shown)
- `"Last updated"` timestamps (have dates but not "updated" dates)
**Action:** Run through the GEO Content Checklist on top 5 articles.

### 5. `page-cro` (Conversion Rate Optimization)
**What it does:** Diagnoses why pages aren't converting, scores conversion readiness 0-100.
**Why BoxingWiki needs it:** Every article funnels to The Boxing Blueprint course. The `/course` page and in-article CTAs need CRO analysis to maximize conversion from organic traffic → course purchase.
**Action:** Audit the `/course` page and article CTA patterns.

### 6. `content-creator`
**What it does:** Brand voice analysis, SEO-optimized content creation, content calendar planning.
**Why BoxingWiki needs it:** Has Python scripts (`seo_optimizer.py`, `brand_voice_analyzer.py`) that can audit article content for keyword density, readability, and voice consistency. Useful for scaling to 100+ articles while maintaining editorial quality.
**Action:** Run `seo_optimizer.py` on existing articles to benchmark optimization.

### 7. `analytics-tracking`
**What it does:** Designs measurement systems — GA4 event taxonomy, conversion definitions, UTM discipline.
**Why BoxingWiki needs it:** We have no analytics tracking. Can't measure what's working without it. This skill defines:
- What events to track (article reads, CTA clicks, course page visits)
- Conversion funnel definition (article → course page → Gumroad purchase)
- UTM strategy for YouTube → BoxingWiki traffic
**Action:** Implement GA4 with the event model this skill defines.

---

## 🟢 Tier 3 — Use Later (Polish & Scale)

### 8. `wcag-audit-patterns`
**What it does:** WCAG 2.2 accessibility audit with remediation strategies.
**Why BoxingWiki needs it:** Accessibility improvements directly benefit SEO (semantic HTML, alt text, heading hierarchy, keyboard navigation). Google factors page experience into rankings.

### 9. `favicon`
**What it does:** Generate proper favicons from source images.
**Why BoxingWiki needs it:** Complete brand identity in SERPs (favicon shows in Google search results next to the URL).

---

## 📋 Also Relevant (Specialized)

| Skill | Use Case for BoxingWiki |
|---|---|
| `ab-test-setup` | Test article CTA variants once traffic is sufficient |
| `programmatic-seo` | Template-based page generation at scale (future) |
| `web-performance-optimization` | CWV improvements for ranking |
| `unsplash-integration` | Stock photos for articles without AI generation |
| `deep-research` | Competitive analysis of MuscleWiki, ExRx, etc. |
| `avoid-ai-writing` | Audit articles for detectable AI patterns |

---

## Recommended Execution Order

1. **`seo-audit`** → Get the baseline Health Index score
2. **`schema-markup`** → Add HowTo, BreadcrumbList, Organization, Course schema
3. **`analytics-tracking`** → Set up GA4 so we can measure everything after
4. **`geo-fundamentals`** → Optimize top articles for AI search citation
5. **`page-cro`** → Optimize the course page conversion funnel
6. **`content-creator`** → Scale article production with quality guardrails

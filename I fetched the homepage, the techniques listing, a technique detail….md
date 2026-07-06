I fetched the homepage, the /techniques listing, a technique detail page (/technique/double-jab), and /pricing. One caveat before the analysis: I can’t measure real page speed, run Lighthouse, or interact with the JS app (body map, workout generator, auth flows), so those areas get inferences flagged as such. Everything else below is based on what actually came back from your server.  
  
The single most important finding, up front: your homepage serves full content in the initial HTML, but your technique detail pages and the /techniques listing returned only nav and footer to my fetcher — no steps, no coaching cues, no body content. The metadata is excellent (unique title “How to Double Jab (1-1) — Boxing Technique Guide”, rich unique meta description referencing Larry Holmes and the Soviet amateur system ￼), but the actual content appears to be client-side rendered. If that’s true in production, your entire 98-page content moat is invisible to most crawlers, AI search engines, and possibly degraded in Google. Also, /pricing (linked in your footer as “BoxingWiki Pro”) redirects straight to the homepage. Verify both in view-source and Search Console before anything else.  
  
1. Production Readiness — 7/10  
  
What’s genuinely strong:  
  
	•	Clear hero: “MASTER THE SWEET SCIENCE — The free, interactive boxing encyclopedia. 98 techniques across punches, defense, footwork, combinations, and conditioning” ￼ with two CTAs. A visitor knows what this is in 3 seconds.  
	•	Trust infrastructure exists: FAQ, About, Privacy, Terms, an injury disclaimer advising users to consult a physician, plus a proper affiliate disclosure for the Lead Boxing partnership ￼.  
	•	Coach attribution: content is written and reviewed with input from coaches including Coach Josh, 6+ years coaching, 200+ athletes trained ￼. That’s the right instinct for E-E-A-T, even if thin.  
	•	Skip-to-content link, OG/Twitter cards, theme color — someone cared about the details.  
  
What’s not ready:  
  
	•	Dead/redirecting footer link: “BoxingWiki Pro” → /pricing → homepage. Either build the page or remove the link. A footer link to a product that doesn’t exist reads as abandoned.  
	•	Navigation redundancy: “Round Timer,” “Timer & Drills,” and “Heavy Bag Timer” are three different labels across nav and footer pointing at /timer and /workout. “Interactive Map” in the main nav links to “/” — the homepage — which is confusing as a nav destination.  
	•	Logged-out gamification leakage: “Prospect 0 XP” appears in the header before any account exists. To a first-time visitor that’s noise, not motivation.  
	•	Inconsistent claims: Twitter card says “98+ techniques with video guides”; the technique-page format described in the FAQ lists steps, muscles, mistakes, pro tips, drills, and related techniques ￼ — no video. If most technique pages lack video, the meta copy is overpromising.  
  
Score rationale: the shell is polished and legally buttoned-up, but a dead monetization link, IA duplication, and the rendering question keep it at 7. Fix those and it’s an 8.5.  
  
2. Value Proposition  
  
The core value prop is real and well-articulated in your own FAQ: YouTube boxing content is scattered across thousands of channels with contradictory advice; BoxingWiki structures every technique into a consistent database format — the reference layer that complements video learning ￼. That’s the wedge. The differentiators that actually matter:  
  
	1.	Stance-aware content — toggle orthodox/southpaw and every description updates ￼. Nobody else does this. Southpaws are chronically underserved by boxing content. This should be louder.  
	2.	Anatomy integration — the body map connects muscle groups to the techniques that depend on them ￼. Unique, but it’s a curiosity, not a retention driver.  
	3.	Consistent schema per technique — the actual Wikipedia-of-boxing play.  
  
Where it’s muddled: the homepage tries to be encyclopedia + training app + Discord gym + course storefront + gear shop simultaneously. The hero says “encyclopedia” but the primary CTA “Start Training Free” goes to /programs — a training-app action. Pick one identity for the first screen.  
  
Suggested positioning: “The structured reference layer for learning boxing — every technique, one consistent format, adapted to your stance.”  
  
Suggested homepage copy:  
  
	•	Headline: “Every Boxing Technique. One Structured Library.”  
	•	Subheadline: “98 techniques broken down the same way every time — steps, common mistakes, coaching cues, and the muscles behind the movement. Toggles to southpaw instantly.”  
	•	Primary CTA: “Browse the Library” (match the encyclopedia identity)  
	•	Secondary CTA: “Start the Free 7-Day Fundamentals”  
	•	Bullets: Stance-aware instructions · Coach-reviewed breakdowns · No paywall on techniques, ever · Interactive muscle map · 400+ fighter Discord  
  
3. Traction Potential — 6/10  
  
Best early adopters, in order: (1) self-taught home boxers (huge, underserved, exactly who searches “how to throw a hook”), (2) southpaws frustrated with orthodox-only content, (3) new gym members who want pre/post-class reference, (4) fitness boxers transitioning to “real” boxing — your own course headline “Stop doing cardio kickboxing. Learn the real thing” ￼ already targets them.  
  
Why users return weekly: the 7-day program, workout tracker, and Discord feedback loop (“log your progress and get direct feedback on your form with 400+ fighters” ￼ — form-check feedback is a genuinely sticky loop if it works). Why they churn: an encyclopedia is a look-it-up-and-leave product; once you’ve read “the jab” you don’t reread it. Retention has to come from the training tools and community, not the reference content.  
  
Shareable loops are weak right now. The body map and stance toggle are demo-able (good TikTok material); nothing else is inherently viral. The growth wedge is clearly SEO + short-form video, not word of mouth. 6/10 because the wedge exists but depends entirely on fixing the rendering issue and on Discord actually delivering form feedback.  
  
4. SEO Analysis  
  
Strengths: unique per-page titles in “How to X — Boxing Technique Guide” format, genuinely well-written unique meta descriptions with historical hooks (the Larry Holmes detail is exactly what earns clicks), clean URL structure (/technique/double-jab), canonical tags present, category-segmented architecture (Punches/Defense/Footwork/Combos/Conditioning/Ring IQ = 98 pages of programmatic surface area), plus glossary and rules pages for definitional queries.  
  
Risks, in priority order:  
  
	1.	Client-side rendering of money pages (described above). If technique content isn’t in initial HTML, you’re invisible to Bing, Perplexity, ChatGPT browsing, and partially handicapped in Google. With Next.js this is usually a one-line fix per route (SSG/ISR). This is the #1 item on the entire audit.  
	2.	URL inconsistency: nav links to /techniques?category=Punches (query params) — make sure crawlable static category URLs exist (/techniques/punches) and the param versions canonicalize to them.  
	3.	Technique pages reuse the generic Twitter card description — minor, fix in the same pass.  
	4.	Schema markup: no evidence of HowTo, FAQPage, or VideoObject structured data. The FAQ section is a free FAQPage rich-result win; every technique page is a natural HowTo.  
	5.	The name collision: boxing.fandom.com and Wikipedia own “boxing wiki”-adjacent queries. You won’t win navigational “boxing wiki” searches soon — win the long-tail instead.  
  
25+ keyword targets by category:  
  
Beginner: how to start boxing at home, boxing for beginners no equipment, boxing basics for beginners, how long to learn boxing, boxing stance for beginners → “Boxing for Beginners: The Complete 7-Day Starting Plan”  
  
Techniques: how to throw a jab, how to throw a hook without hurting your wrist, cross punch technique, uppercut technique boxing, how to throw a check hook → “How to Throw a Left Hook — Step-by-Step (Orthodox & Southpaw)”  
  
Defense: how to slip punches, boxing head movement drills, how to parry a jab, shoulder roll defense, high guard vs philly shell → “Slipping Punches: Mechanics, Mistakes, and Drills”  
  
Footwork: boxing footwork drills at home, how to pivot in boxing, lateral movement boxing, boxing footwork for beginners → “10 Boxing Footwork Drills You Can Do in a Small Room”  
  
Combinations: best boxing combos for beginners, 1-2-3 combo boxing, boxing combinations list with numbers, southpaw combinations → “Every Numbered Boxing Combination, Explained”  
  
Conditioning: boxing conditioning workout, heavy bag workout for beginners, shadow boxing workout routine, boxing roadwork explained → “The 30-Minute Heavy Bag Workout (With Round Timer)”  
  
At-home: shadow boxing benefits, learn boxing without a gym, boxing workout no equipment, is shadow boxing enough → “Can You Learn Boxing at Home? An Honest Answer”  
  
Mechanics/anatomy (your unique angle): what muscles does boxing work, punching power muscles, why rotate hips when punching, boxing and core strength → “The Anatomy of a Punch: Which Muscles Generate Power” — this category maps directly to your body map and almost nobody competes on it well.  
  
Southpaw (underpriced niche): southpaw boxing guide, southpaw vs orthodox strategy, best punches for southpaws → “The Southpaw’s Handbook” — your stance toggle makes you the canonical destination here.  
  
5. UX and Conversion  
  
Highest-impact improvements:  
  
	1.	Resolve the dual identity above the fold: encyclopedia first, training tools second. Right now “Start Training Free” → /programs while the headline promises an encyclopedia.  
	2.	Consolidate the Train menu — seven items (Drills, S&C, Workouts, Programs, Timer & Drills, Tracker, Coach Josh Videos) is too many for a new visitor. Collapse to Techniques / Train / Community / Resources.  
	3.	Kill or gate the “Prospect 0 XP” header element for logged-out users; replace with “Sign in.”  
	4.	Hide or fix the body map on the homepage if it doesn’t render meaningfully fast — it’s billed as the marquee feature, so it has to wow immediately or it’s a liability.  
	5.	Add visible empty/loading states audit to your QA list (I couldn’t test these — verify the tracker, favorites, and generator with a fresh account on a mid-range Android phone).  
	6.	The gear section sits above the FAQ on the homepage. Affiliate gear before you’ve delivered any value is a trust drag for first-time visitors — move it below FAQ or onto a dedicated /gear page.  
  
6. Content Strategy  
  
The structured format you describe — steps, muscles involved, mistakes to avoid, pro tips, conditioning drills, related techniques ￼ — is the right schema. What each technique page still needs to be best-in-class: a short looping video or GIF (text-only technique instruction loses to YouTube every time), common counters, and an explicit “reviewed by [coach name] on [date]” byline for credibility. The single-reviewer model (Coach Josh) is fine at this stage but should expand to 2–3 named coaches with credentials to de-risk the “one guy’s opinion as a wiki” problem.  
  
90-day content roadmap:  
  
	•	Days 1–30: Fix rendering; add HowTo + FAQPage schema; add review bylines and dates to all 98 pages; produce 15-second demo clips for the 15 punches (highest-traffic pages).  
	•	Days 31–60: Ship the southpaw content hub; write the 8–10 pillar articles from the keyword list above; add “common counters” to all Defense and Punch pages; interlink technique ↔ article ↔ drill aggressively.  
	•	Days 61–90: Anatomy/mechanics article series tied to the body map (your defensible moat); fighter-style pages linking styles → techniques (e.g., “Peek-a-boo: the techniques behind Tyson’s style”); glossary expansion targeting definitional snippets.  
  
7. Growth Strategy  
  
First 100 users: your own Discord plus 3–5 honest “I built a structured boxing reference, tear it apart” posts in r/amateur_boxing, r/boxing, and Sherdog’s boxing forum. Ask for corrections, not signups — boxing communities reward humility and punish promotion.  
  
First 1,000: short-form video of the two demo-able features: screen-record the stance toggle flipping a technique to southpaw (“every boxing site ignores southpaws — we didn’t”) and the body map. Coach Josh’s Instagram is the distribution channel you already have; every IG/TikTok clip should end on a technique-page URL.  
  
Prioritized by impact/effort:  
  
	1.	SEO (high impact, the work is mostly done once rendering is fixed)  
	2.	Short-form video of stance toggle + body map (high impact, low effort)  
	3.	Reddit credibility seeding (medium impact, low effort, high blowup risk if done salesy)  
	4.	Coach partnerships — offer gyms a free QR-code poster linking to the technique library; gyms get a reference tool, you get backlinks and local credibility (medium impact, medium effort)  
	5.	Email: a free “7-Day Fundamentals by email” capture is the obvious newsletter wedge (medium/medium)  
	6.	Referral mechanics — skip for now; you don’t have the retention base to make referrals matter yet.  
  
8. Monetization — already started, mostly correctly  
  
You have three streams live: Lead Boxing affiliate (with proper disclosure — good), the Boxing Blueprint course, and a “Pro” tier that currently leads nowhere. Recommended posture for this stage:  
  
	•	Keep: affiliate gear (move it lower on the page) and the course. Course + free library is the classic content-funnel model and it preserves the “techniques free forever” promise you make in the FAQ.  
	•	Fix or kill: the Pro footer link. If Pro isn’t built, remove the link entirely. A premium tier this early fragments a tiny user base; the course is the better paid product because it doesn’t degrade the free experience.  
	•	Later (90+ days): coach-created premium programs and gym partnerships. Donations don’t fit the brand.  
  
The trust risk to watch: the “wiki” framing implies neutrality, but the site is visibly a Coach Josh commerce funnel (his course, his discount code, his IG in the footer). That’s fine — but be transparent about it on the About page rather than letting users discover the tension themselves.  
  
9. Competitive Position  
  
	•	vs YouTube: you lose on demonstration, win on structure and consistency. Don’t fight video — embed it.  
	•	vs ExpertBoxing: the closest analog; it’s aging, text-heavy, and not interactive. Your stance toggle, body map, and tools are a generational upgrade. This is the incumbent you actually displace.  
	•	vs boxing.fandom.com / Wikipedia: they own the name-adjacent queries and general-knowledge intent, but their content is descriptive, not instructional (Fandom’s jab page reads as encyclopedia trivia, not coaching ￼). You win on “how to,” they win on “what is” — target accordingly.  
	•	vs FightCamp/fitness apps: different product (hardware/subscription workouts). Don’t compete; their churned users are your audience.  
	•	vs Reddit: community advice is fragmented and contradictory — which is literally your pitch. Coexist; recruit there.  
	•	vs gyms: you correctly position as supplement, not replacement (“a website cannot replace a coach who watches your form” ￼). Keep that honesty — it’s a trust asset.  
  
10. Risks and Mitigations  
  
	1.	Rendering/indexability → SSG/ISR on all content routes. Existential for the SEO strategy.  
	2.	Single-coach credibility → add 2–3 named reviewers with verifiable credentials; per-page review bylines.  
	3.	Injury/safety → disclaimer exists; also add inline safety callouts on sparring-adjacent pages (headgear, never spar without supervision). Cheap insurance, big trust signal.  
	4.	Encyclopedia churn → invest in tracker + Discord form-feedback loop; that’s the only retention engine you have.  
	5.	Wiki-name trust tension → transparent About page on who runs this and how it’s funded.  
	6.	Discord moderation → form-check channels attract bad advice; require coach-flaired answers in #ask-the-coach.  
	7.	Brand confusion with Fandom/Wikipedia → don’t chase “boxing wiki” queries; build brand via “BoxingWiki” + technique long-tail.  
	8.	Gear-before-value layout → move affiliate section down; it currently undercuts the “free, open” framing within one scroll.  
  
11. Prioritized Action Plan  
  
Fix before public launch:  
  
	1.	Verify and fix server-rendering of /techniques and all /technique/* pages  
	2.	Fix or remove the /pricing “Pro” footer link  
	3.	Consolidate the Train nav; fix “Interactive Map” linking to homepage  
	4.	Remove “Prospect 0 XP” for logged-out users  
	5.	Align meta copy with reality (“video guides” claim)  
  
Within 30 days: HowTo/FAQPage schema; review bylines on all technique pages; static category URLs; 15-second clips for the 15 punch pages; “7-Day by email” capture; Reddit feedback posts.  
  
Within 60 days: Southpaw hub; 8–10 pillar SEO articles; common-counters field on technique pages; stance-toggle and body-map short-form video push; Discord coach-flair moderation system.  
  
Within 90 days: Anatomy article series; fighter-style → technique linking; gym QR-poster partnership pilot; revisit Pro tier only if weekly retention justifies it.  
  
12. Final Verdict  
  
	•	Production readiness: 7/10 · Traction potential: 6/10 · SEO potential: 8/10 (conditional on the rendering fix — 3/10 without it) · Retention potential: 5/10  
	•	Biggest strength: the consistent structured technique schema plus stance-aware content — a real, defensible product idea nobody else has shipped.  
	•	Biggest weakness: the highest-value pages may be invisible to crawlers, and the product identity (encyclopedia vs. training app vs. coach funnel) is blurred above the fold.  
	•	Best target user: the self-taught home boxer, with southpaws as the beachhead niche.  
	•	Best growth channel: long-tail SEO on “how to [technique]” queries, amplified by short-form video of the stance toggle.  
	•	Fix immediately: the rendering/indexability of technique pages.  
	•	Don’t waste time on yet: the Pro subscription tier and referral mechanics.  
	•	Overall recommendation: soft launch. The site is too polished to keep private and the Discord proves demand, but actively promoting it before the rendering fix and IA cleanup would burn your one shot at first impressions in the Reddit communities you need. Fix the launch-blockers (a week of work, most likely), then promote hard.  
  
Want me to draft the southpaw hub structure, the Reddit launch posts, or the JSON-LD HowTo schema template for the technique pages?  

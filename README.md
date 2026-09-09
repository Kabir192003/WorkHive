# Handoff: Work Hive — Endorsement-Based Hiring Platform

## Overview
Work Hive is a hiring platform built around attributed "endorsements": short, named statements from former colleagues attached to a candidate's applications, instead of anonymous references. This package documents a full, high-fidelity click-through prototype covering the candidate experience end to end — search, apply, build a profile, request endorsements, browse company/salary/relocation data, and several supporting marketing/community pages.

## About the Design Files
The bundled file (`Work Hive Platform.dc.html`) is a **design reference built in HTML** — a working prototype with real interactivity (client-side state, filtering, navigation, modals) used to communicate layout, content, and behavior. **It is not production code.** The task is to recreate this design in your actual codebase's stack (React/Next, Vue, native, etc. — whatever the project uses, or your best choice if this is a fresh build) using that stack's own component patterns, routing, and state management. Do not literally port the inline-styled markup; treat it as a spec.

## Fidelity
**High-fidelity.** Colors, type, spacing, and copy are final/intentional. Recreate pixel-accurately using the tokens below. A few areas are explicitly interaction-only placeholders (e.g. some pagination arrows, resume upload) — see "Known placeholders" below.

## Design Tokens

**Colors**
- Accent (brand amber): `#F9AD16` — gradient variants `#F58A0B → #FDB515 → #FFCB3D` (hero bands), `#FFC02E → #F79E1B → #EE7D0E` (logo mark)
- Amber hover: `#EA9E08`; amber-on-dark text: `#241A00`; amber label text on dark: `#FFC94D`
- Ink/near-black: `#16181D`
- Dark surfaces: `#23262C` (hero/CTA bands), `#2A2C31`, `#33363C` (sidebar/buttons), `#26282D` (facet dropdown)
- Body text scale: `#4B4E55` (primary body), `#5C5F66`, `#6B6E75`, `#8C8F96` (meta/muted), `#9A9CA1`/`#A7A9AE` (placeholder)
- Borders: `#E7E7EA` (default), `#EDEDEF`, `#F0F0F2`, `#F4F4F5` (hairline), `#DDDDE1` (inputs)
- Backgrounds: `#FFFFFF`, `#FAFAFB` (page bg), `#F4F4F5`/`#F2F2F3` (chips/utility bar)
- Semantic: success `#2E7D53` / bg `#EAF6EF`; warning `#9A6A00` / bg `#FFF6E2` or `#FFFBEF`; error `#B4483A` / bg `#FBEDEB`
- Link: `#B26A00`, hover `#8A5200`

**Typography**
- UI/body font: **Figtree** (400/500/600/700/800)
- Labels, meta, mono data (results counts, timestamps, table headers): **IBM Plex Mono** (400/500/600), always uppercase with `letter-spacing: 0.06–0.16em`, size 9–11px
- Headline scale: 46px (home hero) / 32–36px (section heroes) / 22–30px (page/card titles) / 13–17px (body/labels), all with tight `letter-spacing: -0.01 to -0.03em` on large weights
- Body copy: 12.5–14px, `line-height: 1.55–1.75`

**Shape & spacing**
- Border radius: 3–5px on cards/buttons/inputs; circles for avatars
- A distinctive **hexagon clip-path** (`polygon(50% 0, 100% 25%, 100% 75%, 50% 100%, 0 75%, 0 25%)`) is used throughout as a bullet/icon motif (facet dots, task markers, timeline dots, quick-link icons) — this is a core brand signature, keep it
- Card shadow: `0 1px 2px rgba(20,22,28,0.04)` resting, `0 10px 24px rgba(20,22,28,0.10)` hover
- 1px hairline borders everywhere; no heavy drop shadows

## Screens / Views
The prototype is a single-page app with client-side routing via a `screen` state value. Screens below map 1:1 to that state.

1. **Home** (`home`) — has 4 internal tabs (not separate routes): Overview (hero search, stats strip, "how an endorsement works" 3-step, city hub cards, insights tool cards, dark CTA band), Why Work Hive (explainer + value pillars), For Employers (employer pitch + CTA), Pricing (3 tier cards: Candidate/Free, Recruiter Starter, Recruiter Growth).
2. **Dashboard** (`dashboard`) — candidate workspace: Endorsement Score card w/ progress bar, task list, activity feed, "applications in flight" table.
3. **Profile** (`profile`) — public-style profile: photo/stats sidebar, skills, about, experience timeline, endorsements received, work samples grid.
4. **Search Jobs** (`search`) — dark left rail with 13 collapsible refine-search facets (real multi-select filtering, see Interactions), amber hero search band, result cards with save/dismiss/expand icons and Refer/Apply/Get Endorsed actions.
5. **Connections** (`connections`) — search bar + radial network-graph visualization (SVG) of first/second-degree connections around a target role, plus 3 match gauges (semi-circular meters).
6. **Company Ratings** (`ratings`) — dark photo hero + quick-search band, rating tabs, star distributions, company facts, photo carousel, two "reach out to endorsers" people-grid sections.
7. **Salaries** (`salaries`) — calculator form, median/percentile bar chart by seniority, benefits stat cards, comparable-roles grid.
8. **Cost of Living** (`cost`) — calculator form, city-vs-city comparison cards, line-item comparison table, quick-links grid.
9. **Relocation** (`relocation`) — calculator, one-off cost table, 4-step relocation timeline, quick-links grid.
10. **Insights Home** (`insights`) — hub linking to Ratings/Salaries/Cost/Relocation, "best places to work" ranked list.
11. **Job Detail** (`jobDetail`) — full posting: responsibilities/requirements lists, endorsers-for-this-team grid, sticky sidebar (match %, Get Endorsed/Apply/Refer actions, about-company blurb, more roles at company).
12. **Company Profile** (`company`) — hero with logo tile, 3 tabs (Overview/Open Roles/People), reuses ratings/facts/endorsement-groups patterns.
13. **Messages** (`messages`) — two-pane inbox: thread list (tabbed Endorsement Requests / Messages) + conversation view with accept/decline action card for endorsement requests.
14. **Onboarding** (`onboarding`) — 3-step wizard (progress bar): basic info form → work history matcher → suggested first endorsement requests.
15. **Settings** (`settings`) — left nav (Account/Privacy/Notifications/Connected Accounts) + right detail pane with toggle switches.
16. **Apply Direct** (`apply`) — 2-step: application form (contact fields, resume placeholder, cover note, "also request an endorsement" checkbox) → confirmation screen.
17. **Mentorship / Alumni / Internships / Events / About Us** — supporting content screens off the top nav (mentor cards, alumni move list, internship listings, event list, company stats + values).
18. **Endorsement modal** — global overlay (2-step: screening questions → confirmation), opened from job cards/detail, scoped to the job that triggered it.

### Shared chrome (present on every screen)
- **Utility bar** (46px, `#F2F2F3` bg): horizontal-scrolling top nav (HOME/CAREERS/INSIGHTS/MENTORSHIP/ALUMNI/INTERNSHIPS/EVENTS/ABOUT US, active = amber pill) + 4 icon circles top-right: profile avatar, Messages (✦), Create-profile/onboarding (◉), Settings (⚙) — each has a `title` tooltip.
- **Logo/sub-nav bar**: hexagon "Work Hive" logo mark on an amber gradient tile (overlaps upward −46px), plus a secondary tab row scoped to the active top-level section (e.g. Dashboard/Profile/Search/Connections/Messages under CAREERS).

## Interactions & Behavior
- **Facet filtering (Search Jobs)** is fully functional: each of the 13 facets (Designation, Location, Date Posted, Industry, Job Type, Job Function, Seniority, Experience, Relocation, Company Name, Company Type, Company Rating, Company Size) expands an inline multi-select checklist derived from the job data; selections AND across facets, OR within a facet; result count and cards update live; a "Clear" link appears once any filter is active; empty state shown when no jobs match.
- Job card icons: expand (→ Job Detail), flag (toggle "saved" highlight), ✕ (dismiss from results, client-side only).
- Get Endorsed always opens the endorsement modal scoped to that specific job/company (title/company/location interpolated into the modal).
- Apply Direct routes to the dedicated Apply screen (not a dashboard shortcut), pre-filled with the candidate's saved details; submit shows a confirmation step with links to Dashboard or back to Search.
- Refer Someone routes to Connections.
- Onboarding and Settings toggles are simple boolean state flips with the standard pill-switch component (track color = accent when on, `#D5D5D9` off; knob slides).
- Home's sub-nav tabs (Overview/Why Work Hive/For Employers/Pricing) swap content in place — no route change.
- Company Profile and Job Detail share underlying data (clicking a company name/job title anywhere routes with the right record pre-selected).

## State Management
Minimal state needed per screen (all client-side in the prototype):
- `screen`: active route key (see list above)
- `jobIndex`, `company`: currently-focused job/company record for detail-style screens
- `facetSelections`: `{ [facetLabel]: string[] }`, `facetOpen`: currently expanded facet
- `savedJobs`, `dismissedJobs`: arrays of job ids
- `companyTab`, `messagesTab`/`activeThreadIdx`, `onboardStep`, `settingsTab`, `homeTab`, `applyStep`: per-screen sub-navigation state
- `modal` (0/1/2): endorsement modal step
- A handful of settings booleans (`profilePublic`, `showSalary`, `searchable`, `notifEmail`, `notifVouch`→rename, `notifJobs`)

No real backend in the prototype — all data (jobs, companies, endorsers, threads, etc.) is inline mock data in the component. A real implementation needs API-backed equivalents for: job search/filter, endorsement request/response, applications, messaging, and profile/settings persistence.

## Assets
All photography is real, credited Unsplash imagery loaded by direct URL (hero bands, city cards, mentor/endorser avatars, profile photo) — each carries a visible photographer credit overlay per Unsplash's license terms. Replace with your own licensed/produced photography in production; keep the credit-overlay pattern if you keep using Unsplash. No other external assets — icons are text glyphs/CSS (hexagon clip-paths, ‹›/⚑/✕/✦/◉/⚙ glyph characters), not an icon font or SVG library.

## Known placeholders (not fully wired)
- Resume upload on Apply Direct is a static "click to replace" box (no real file picker).
- Pagination arrows (‹ ›) on carousels (Life at Company, endorser groups, quick links) are decorative.
- Messages compose box and Accept/Decline buttons on endorsement requests don't persist state.
- "Quick Search" buttons on Ratings/Salaries/Cost/Relocation hero bands are decorative (the calculator forms below them are the real interaction).

## Files
- `Work Hive Platform.dc.html` — the full prototype (all 18 screens + modal), open directly in a browser.

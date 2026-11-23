# Vidyaarthi Setu

**Bridging the Learning Gap. Empowering Every Student.**  
*wHACKiest 2026 · Track: UnlockED — Low-Bandwidth Adaptive Learning for Rural Schools*

Vidyaarthi Setu is an offline-first adaptive learning platform for Grade 6–8 Mathematics (starting with Grade 6 Fractions in English and Kannada). It enables multiple students to share one device offline, diagnoses repeated conceptual misconceptions using a deterministic TypeScript engine, adapts visual instruction and practice, and surfaces actionable **Common Learning Gaps** to teachers.

---

## Core Features Built

1. **Shared-Device Student Profiles (`IndexedDB` via Dexie.js)**
   - Two illustrative Grade 6 demo profiles (**Ananya R.** and **Karthik M.**) with completely isolated progress, attempt logs, and adaptive recommendations.
   - All progress persists across browser refreshes without login or cloud API keys.
2. **Diagnostic Assessment Engine**
   - 10 bilingual (English & Kannada) Grade 6 Fractions questions across 4 concepts:
     - Numerator & Denominator
     - Fraction Representation
     - Equivalent Fractions
     - Comparing Fractions
   - Incorrect choices map to specific fraction misconceptions; a learning gap is only flagged when repeated evidence appears across **≥ 2 distinct questions**.
3. **Deterministic Misconception-Based Adaptive Engine**
   - Transparent rule-based TypeScript engine (`src/engine/`):
     - `< 50%` or confirmed misconception (`≥ 2` distinct questions) → Visual remediation + foundational exercises.
     - `50%–79%` → Guided exercises with hints.
     - `≥ 80%` → Challenge enrichment problems.
     - Reassessment after remediation updates concept mastery (80% reassessment weight) and resolves flagged misconceptions.
   - Displays a transparent **Rule Trace** explaining why each lesson/exercise was chosen.
4. **Interactive Visual Learning Lab**
   - Interactive Equivalent Fraction Split Explorer (`×1` to `×4` with "+Same Number" trap comparison).
   - Interactive Fraction Comparison Strip Lab with `1/2` benchmark line and live sliders.
   - Interactive Part & Whole Builder (synchronized circle + bar models).
5. **Offline-First PWA & Local-First Sync Queue**
   - Service Worker asset & font caching via `vite-plugin-pwa`.
   - Every attempt receives a unique `eventId` and enters the local `syncQueue` (`OFFLINE` / `PENDING_SYNC` / `SYNCED`) with deduplication.
   - Includes a **Simulate Offline** toggle for live demonstration and a clearly labelled **Demo Sync Adapter** when Supabase credentials are not configured.
6. **Teacher Intelligence Dashboard**
   - Concept-wise mastery chart (Recharts), student-wise progress table, students needing support, **Common Learning Gaps** with recommended group revision activities, and intervention completion tracking.

---

## Local Installation

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

---

## Running Tests, Typecheck & Production Build

```bash
# Run adaptive engine & sync deduplication unit tests
npx --yes tsx --test tests/adaptiveEngine.test.ts

# Typecheck
npm run lint

# Production PWA build
npm run build
```

---

## Optional Cloud Sync (Supabase + PostgreSQL)

Vidyaarthi Setu works 100% offline with zero configuration. To connect a live Supabase PostgreSQL backend:

1. Create a Supabase project and run the SQL migration in `supabase/migrations/001_initial_schema.sql`.
2. Copy `.env.example` to `.env` and set:
   ```env
   VITE_SUPABASE_URL="https://your-project.supabase.co"
   VITE_SUPABASE_ANON_KEY="your-anon-key"
   ```
3. Rebuild or restart the dev server. When online, `syncService.ts` will upsert deduplicated events into `public.learning_events` (`onConflict: 'event_id'`).

---

## Deployment

Build static assets with `npm run build` and deploy the `dist/` directory to Vercel, Netlify, or Cloudflare Pages. Ensure HTTPS is enabled so the Service Worker and PWA install prompt function properly.

---

## Honest Scope & Limitations

- The current MVP covers **Grade 6 Mathematics (Fractions)** in **English and Kannada** with two preloaded illustrative student profiles.
- Adaptive recommendations are driven by a transparent deterministic rule engine (`src/engine/`), not a trained machine learning model.
- When `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` are not supplied, synchronization uses the local **Demo Sync Adapter** inside IndexedDB rather than transmitting to a remote server.

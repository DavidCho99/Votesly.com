# Votesly.com (SchoolRankingApp)

GridironVote is a real-time College Football Fan Support Ranking application. It allows users to vote for their favorite university sports teams and see the leaderboard update instantly across all connected clients.

## 🚀 Key Features

*   **Real-time Leaderboard:** Rankings and vote counts update live for all users without requiring a page refresh.
*   **Instant Feedback (Optimistic UI):** When you vote, the UI instantly increments with a satisfying "Pop" animation, while server synchronizations happen perfectly in the background.
*   **Dynamic Re-sorting:** Team cards smoothly slide up and down the leaderboard as their rankings change.
*   **Zero-Hang Architecture:** Built to handle high-frequency clicks. Backend rate-limiting and a robust database fallback mechanism ensure the app never freezes, even if the Redis cache becomes temporarily unavailable.
*   **Hybrid Access Control:** The leaderboard is public, but voting requires authentication, protecting against spam while maximizing visibility.

## 🛠️ Technology Stack

*   **Frontend:** Next.js (App Router), React, Tailwind CSS, Framer Motion, TanStack Query (@tanstack/react-query).
*   **Backend:** NestJS, TypeScript, TypeORM.
*   **Database:** PostgreSQL (Supabase), Redis (Upstash) for caching and rate-limiting.
*   **Real-time Communication:** Server-Sent Events (SSE).

## 📈 Development Phases & Steps Accomplished

The project was developed and optimized in the following distinct phases:

### Phase 1: Architecture Research & SSE Migration
*   Explored real-time architectures handling high-frequency interactions (like popsenzawa/echo).
*   Migrated from heavy WebSocket (Socket.io) implementations to lightweight, unidirectional **Server-Sent Events (SSE)**.
*   Implemented `RankingsController` and refactored `TeamsService` to push broadcast events.
*   Created a native frontend hook (`useRankings`) to consume the SSE stream efficiently.

### Phase 2: Voting Functionality & Resilience
*   Wired up the frontend vote buttons to the NestJS backend (`POST /teams/:id/vote`).
*   Implemented a 5-second cooldown/rate-limit using Redis.
*   Built a **"Zero-Hang" fallback mechanism**: If Redis fails, the system immediately falls back to direct PostgreSQL writes, ensuring the app never goes down.
*   Fixed request hanging issues by disabling Redis command buffering.

### Phase 3: Instant UI Feedback & Polish
*   Integrated TanStack Query with the SSE stream for seamless data synchronization.
*   Implemented **Optimistic Updates**: The UI updates instantly upon user click, deducting local pending votes when the server broadcast arrives to prevent double-counting.
*   Added `framer-motion` layout animations for smooth team card re-sorting.
*   Implemented a 5-second background auto-polling fallback to guarantee 100% data consistency.
*   Separated complex touch gesture logic (pull-to-refresh) into a custom React hook for better Separation of Concerns.

### Phase 4: Data Persistence & Security
*   Transitioned from simple aggregate counts to persisting individual vote records in the `user_likes` table, maintaining a complete history of user interactions with a cascading delete constraint.
*   Implemented Hybrid Page Access Control:
    *   `/rankings` (Public view, read-only for guests).
    *   `/Support` (Private view, redirects to login).

## 💻 Getting Started (Local Development)

### Frontend (Next.js)
```bash
cd frontend
npm install
npm run dev
# Runs on http://localhost:3000
```

### Backend (NestJS)
```bash
cd backend
npm install
# Ensure .env is populated with DATABASE_URL, REDIS_URL, etc.
npm run start:dev
# Runs on http://localhost:3001
```

## 📅 Recent Updates

### **February 27, 2026**

**1. Next.js App Router Refactoring**
*   **What:** Analyzed the directory tree and renamed all capitalized route folders (e.g., `Login`, `Profile`, `Support`, `Onboarding` etc.) to their lowercase equivalents (`login`, `profile`, `support`).
*   **Why:** To strictly adhere to Next.js App Router standard conventions, which favor lowercase URLs and folder names for consistency and SEO.

**2. Dead Code Elimination**
*   **What:** Completely removed the deprecated `Onboarding` directory (`src/app/Onboarding`) and cleanly stripped out all associated client/server-side logic, routing steps, and redirects.
*   **Why:** The onboarding flow for nickname creation was deactivated. Removing the dead code reduces bundle size, eliminates confusion, and streamlines the authentication journey.

**3. Hard Account Deletion (Supabase Integration)**
*   **What:** Fixed an account deletion edge case where destroying an account only dropped the user from the application's `public.users` table but orphaned their identity in the Supabase Authentication system (`auth.users`).
*   **Why:** True "hard deletion" was restored by securely implementing the Supabase Admin API (`supabaseAdmin.auth.admin.deleteUser`) invoked inside a backend TypeORM transaction via the `SUPABASE_SERVICE_ROLE_KEY`.

**4. Custom SMTP & Email Templates**
*   **What:** Successfully configured **Resend** as the custom SMTP provider for Supabase Auth, migrating off the rate-limited built-in mailer. Additionally, built and attached cleanly formatted, responsive HTML email templates for the "Confirm Signup" and "Reset Password" triggered workflows.
*   **Why:** To dramatically improve deliverability (preventing confirmation emails from going to spam) and deliver a premium, branded email UX.

**5. ReScript Organization & Component Review**
*   **What:** Audited project components and segregated ReScript logic. Migrated scattered `.res` and compiled `.res.js` files out of Typescript standard `hooks/` and `lib/` and into a dedicated `src/rescript/` isolated architecture.
*   **Why:** This clean separation avoids mixing functional ReScript output with the primary TypeScript environment, drastically improving repo navigability.

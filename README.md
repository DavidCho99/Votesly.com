# Votesly.com (SchoolRankingApp)
### High-Concurrency Real-Time Ranking Engine with Zero-Hang Architecture

**Votesly** is a high-performance polling platform for College Football, engineered with a focus on real-time data consistency and system resilience. 
---

## 🏗️ 1. Architectural Principles & Implementation

The system is partitioned into four critical layers, mirroring the separation of concerns found in large-scale production environments.

### **I. Frontend: Optimistic UI & Reactive State**
*   **Layered UI Components:** Built using **Next.js 14 (App Router)**, separating low-level "Base" primitives from "Workbench" domain-specific components (e.g., `MatchupCard`, `Leaderboard`).
*   **Optimistic UI Pattern:** Leveraging **TanStack Query**, the system implements optimistic updates. On user interaction, the UI reflects the state change at **0ms latency**, while the server synchronization handles the eventual consistency in the background.
*   **Motion Engineering:** Uses **Framer Motion** for layout-level animations, ensuring smooth re-ordering of ranked elements as live data streams in.

### **II. Backend: Modular Micro-services**
*   **Inversion of Control (IoC):** Built on **NestJS**, utilizing dependency injection to decouple `Auth`, `Teams`, and `Ranking` modules.
*   **Database Optimization:** Interfaced via **TypeORM** with PostgreSQL. Implemented SQL-level optimizations, including case-insensitive indexing (`LOWER()`) and relational integrity with cascading constraints.
*   **Validation & Serialization:** Strict schema enforcement using **DTOs** and **Class-Validators** to ensure data hygiene at the edge.

### **III. Identity: Secure & Domain-Specific Auth**
*   **Passwordless Auth (OTP):** Implemented a 6-digit One-Time Password (OTP) flow via **Supabase Auth** to minimize friction and eliminate password-related security risks.
*   **Advanced Ingress Filtering:** Dual-layer guardrails (Client + Server-side Guards) restrict registration to specific educational domains (e.g., `.edu`), ensuring community integrity.
*   **Reactive Auth Listeners:** A global `onAuthStateChange` listener manages the user lifecycle, handling complex edge cases like password recovery redirects and session hydration.

### **IV. Resilience: The "Zero-Hang" Strategy**
*   **Real-time Streaming:** Utilizes **Server-Sent Events (SSE)** for lightweight, unidirectional data broadcasting, significantly reducing server overhead compared to traditional WebSockets.
*   **Fault-Tolerant Caching:** A Redis-first write-back strategy is implemented. If the Redis cache fails, the system executes a **Circuit Breaker**-style fallback directly to PostgreSQL, ensuring 100% uptime (Zero-Hang).
*   **PKCE Flow Integration:** Resolved race conditions between Next.js server-side rendering and Supabase PKCE authentication flows through conditional rendering and token-detection logic.

---

## 🛠️ 2. Technical Stack

| Domain           | Technology                                                  |
| :--------------- | :---------------------------------------------------------- |
| **Frontend**     | **Next.js 14**, Tailwind CSS, Framer Motion, TanStack Query |
| **Backend**      | **NestJS**, TypeORM, Passport.js (JWT)                      |
| **Data & Cache** | **Supabase (PostgreSQL)**, Redis (Upstash)                  |
| **Languages**    | TypeScript                                                  |
| **DevOps**       | Vercel (CDNX), Railway (Containerized Backend)              |

---

## 📂 3. Source Code Organization (VS Code Standard)

Following the **VS Code Wiki guidelines**, the repository is organized by target runtime and contribution scope:

*   **`src/vs/common/`**: Shared interfaces and DTOs used by both the Node.js backend and the Browser client.
*   **`src/vs/platform/`**: Core infrastructure services (Database, Redis, Logger) shared across all modules.
*   **Standardized Naming**: Strictly enforced lowercase routing and kebab-case file naming for cross-platform compatibility and SEO.

---

## 🔄 4. System Flow Lifecycle

1.  **Event Ingress:** User triggers a vote.
2.  **Optimistic Execution:** Client UI updates immediately; request sent to NestJS.
3.  **Distributed Locking & Validation:** Server validates the session and checks Redis for rate-limiting.
4.  **Resilient Persistence:** Data is committed to Redis. In case of downtime, the system falls back to the RDBMS (PostgreSQL).
5.  **Global Broadcast:** Updated rankings are pushed to all active clients via **SSE**, triggering a layout-level re-render across the platform.



# CriticsHub — Tourist Guide

CriticsHub is a social platform for critics and travelers to publish reviews, share itineraries, and track engagement. This repository contains a React frontend and an Express + Prisma backend with media uploads, analytics, and user profile features.

---

## Table of Contents
- [Quick summary](#quick-summary)
- [Features](#features)
- [High-level architecture (HLD)](#high-level-architecture-hld)
  - [Mermaid diagram](#mermaid-diagram)
  - [HLD image placeholder](#hld-image-placeholder)
- [Repository layout](#repository-layout)
- [Prerequisites](#prerequisites)
- [Environment variables](#environment-variables)
- [Quick start (development)](#quick-start-development)
- [API overview (important endpoints)](#api-overview-important-endpoints)
- [Key design decisions](#key-design-decisions)
- [Upload pipeline (detailed)](#upload-pipeline-detailed)
- [Analytics & privacy](#analytics--privacy)
- [Operational notes & scaling](#operational-notes--scaling)
- [Troubleshooting](#troubleshooting)
- [How to present this in an interview](#how-to-present-this-in-an-interview)
- [Contributing & License](#contributing--license)

---

## Quick summary
CriticsHub connects critics and travelers. Users can create posts (with media), like/comment, view analytics scoped to their content, and manage profiles. Media uploads are staged and batched to Cloudinary to reduce third-party calls and allow moderation.

---

## Features
- User authentication (JWT)
- Create/edit posts, media uploads (staging → Cloudinary)
- Likes, comments, views tracking
- User-specific analytics (likes/comments by weekday, demographics)
- Profile management with avatar upload
- Background jobs: scheduled publish, batch upload worker
- Email notifications (Ethereal/Brevo for testing)

---

## High-level architecture (HLD)

### Mermaid diagram
```mermaid
flowchart LR

  %% --- CLIENT ---
  subgraph CLIENT
    direction TB
    CTitle["Client: React + Tailwind"]
    A1["UI: Dashboard · Create · Profile · Settings · Analytics"]
    A2["Stores JWT (localStorage)"] 
  end

  %% --- API SERVER ---
  subgraph API
    direction TB
    ATitle["API Server: Node.js + Express"]
    B1["Auth Middleware (verifies JWT → req.userId)"]
    B2["Controllers: posts, uploads, analytics, profile, auth"]
    B3["Cron + Worker Trigger"]
  end

  %% --- DATABASE ---
  subgraph DB
    direction TB
    DTitle["Postgres via Prisma"]
    D1["Users"]
    D2["Posts"]
    D3["Likes · Views · Comments"]
    D4["Uploads (staging metadata)"]
  end

  %% --- STAGING STORE ---
  subgraph STAGING
    direction TB
    STitle["Staging Store: local/S3"]
    S1["Temporary upload storage"]
  end

  %% --- BACKGROUND WORKERS ---
  subgraph WORKER
    direction TB
    WTitle["Background Workers (BullMQ / Redis)"]
    W1["Batches uploads → Cloudinary"]
    W2["Analytics aggregation (optional)"]
    W3["Retries · Moderation"]
  end

  %% --- CLOUDINARY / CDN ---
  subgraph CLOUD
    direction TB
    CTitle["Cloudinary (CDN)"]
    C1["Final media URLs / delivery"]
  end

  %% --- EMAIL SERVICE ---
  subgraph SMTP
    direction TB
    MTitle["SMTP: Ethereal / Brevo"]
    M1["Email sending (signup, notifications)"]
  end

  %% --- OBSERVABILITY ---
  subgraph OBS
    direction TB
    OTitle["Observability Stack"]
    O1["Logs (morgan)"]
    O2["Errors (Sentry)"]
    O3["Metrics (Prometheus / Grafana)"]
  end


  %% --- CONNECTIONS ---
  A1 -->|"HTTP (Bearer JWT)"| B2
  A1 -->|"Auth token"| B1
  A2 --> B1

  %% Create post + staging upload flow
  A1 -->|"POST /uploads (multipart)"| B2
  B2 -->|"validate & store"| S1
  B2 -->|"create upload record"| D4
  B2 -->|"return preview URL"| A1

  %% Worker batch -> Cloudinary
  S1 -->|"cron / worker picks staged files"| W1
  W1 -->|"upload"| C1
  W1 -->|"update upload record (cloudUrl)"| D4
  W1 -->|"notify / webhook"| B2
  B2 -->|"notify user (in-app/email)"| A1
  W1 -->|"on failure → retry"| W3

  %% Interaction events -> DB -> Analytics
  A1 -->|"POST like/comment"| B2
  B2 -->|"store event"| D3
  B2 -->|"store view"| D3
  B2 -->|"analytics endpoints use req.userId"| A1
  D3 -->|"raw queries or worker aggregates"| W2
  W2 -->|"optional pre-aggregated tables"| D3

  %% Auth / emails
  B2 -->|"send email via nodemailer"| M1
  M1 -->|"view in dev"| A1

  %% Observability
  B2 --> O1
  B2 --> O2
  W1 --> O3

  %% --- COLORS ---
  style CLIENT fill:#fef3f2,stroke:#f97316
  style API fill:#eef2ff,stroke:#6366f1
  style DB fill:#ecfdf5,stroke:#10b981
  style STAGING fill:#fefce8,stroke:#f59e0b
  style WORKER fill:#f0f9ff,stroke:#06b6d4
  style CLOUD fill:#fff7ed,stroke:#fb923c
  style SMTP fill:#fff1f2,stroke:#f43f5e
  style OBS fill:#f3f4f6,stroke:#64748b
```

### HLD image placeholder
![High-Level Design - placeholder](./client/src/assets/CriticsHubSystemDesign.png)

---

## Repository layout
- `/client` — React frontend (Tailwind CSS).
- `/server` — Node.js / Express backend (TypeScript), Prisma ORM.
- `/server/src` — application source.
- `/server/src/cron` — scheduled jobs (auto-publish, batch upload triggers).
- `/docs` — diagrams, HLD images.

---

## Prerequisites
- Node.js (v18+)
- npm or pnpm
- PostgreSQL (or compatible DB)
- Redis (optional — recommended for queue)
- Cloudinary account
- SMTP credentials for email testing (Ethereal/Brevo)

---

## Environment variables
Create `/server/.env`:

```text
DATABASE_URL=postgresql://user:pass@host:port/dbname
PORT=8080
JWT_SECRET=your_jwt_secret
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=...
SMTP_PASS=...
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
STAGING_STORAGE=local|s3
```

---

## Quick start (development)

1. Backend
```powershell
cd c:\Users\prans\myprojects\touristGuide\server
npm install
npx prisma migrate dev    # apply migrations if needed
npx prisma studio         # inspect DB
npm run dev               # start server (watch)
```

2. Frontend
```powershell
cd c:\Users\prans\myprojects\touristGuide\client
npm install
npm start
```

---

## API overview (important endpoints)
- POST /api/v1/auth/signup — register user
- POST /api/v1/auth/signin — sign in, returns JWT
- GET  /api/v1/user/profile — (auth) returns profile info for authenticated user
- PUT  /api/v1/user/profile — (auth) update profile / upload avatar
- POST /api/v1/uploads — (auth) upload file to staging (returns preview URL)
- GET  /api/v1/analytics/daily-interactions — (auth) likes/comments grouped by weekday for user's posts
- GET  /api/v1/analytics/demographics — (auth) computed from likes joined to users
- Other CRUD endpoints: /posts, /comments, /likes, /views

---

## Key design decisions
- Backend always scopes analytics to `req.userId` — eliminates spoofed queries.
- Staged uploads with 24-hour batch to Cloudinary to reduce third-party calls, enabling moderation, retries and cost control.
- Server-side Cloudinary uploads keep secrets safe and allow optimization.
- Background workers handle heavy tasks (uploads, aggregation) and retries.

---

## Upload pipeline (detailed)
1. Frontend uploads file to `/api/v1/uploads` (multipart).
2. Server validates and stores file to staging (local or S3) and inserts an upload record.
3. Server returns a temporary preview (local or signed URL) to frontend for immediate UX.
4. A worker/cron batches staged uploads (e.g., every 24h) and uploads to Cloudinary.
5. On success, worker updates DB with final Cloudinary URL and notifies the user (in-app/email).
6. On failure, worker retries with exponential backoff and logs errors.

**Advantages:** fewer Cloudinary requests, moderation window, retry capability.  
**Trade-off:** slight delay before final CDN URL is available.

---

## Analytics & privacy
- All analytics endpoints use the authenticated user id; frontend does not send arbitrary `userId`.
- Analytics are computed from event tables (Likes, Comments, Views) on-demand.
- Optionally pre-aggregate with background workers if read latency becomes critical.

---

## Operational notes & scaling
- Use Redis + BullMQ for reliable background job processing.
- Horizontal scaling of stateless API behind a load balancer.
- Add DB read replicas and caching (Redis) for analytics scale.
- Integrate Sentry for error tracking and Prometheus/Grafana for metrics.
- Enforce HTTPS in production and protect secrets in environment.

---

## Troubleshooting
- Prisma Studio typo: run `npx prisma studio` (not `prima`).
- SMTP: verify `SMTP_USER` / `SMTP_PASS` in `.env`. Use Ethereal for dev.
- Missing profile image/initials: ensure `profile` object is loaded before rendering initials.

---

## How to present this in an interview
Concise pitch:
- "We stage uploads for 24 hours and batch them to Cloudinary. This reduces third‑party calls, enables moderation and retries, and lowers cost. Analytics are scoped server-side to the authenticated user to ensure privacy. Heavy tasks run in background workers to keep the API responsive."

---

## Contributing & License
- Contributions welcome — open a PR with tests and description.
- License: MIT.

---

## Contact
Project owner: Pranshul Gupta 
Local repo path: `https://github.com/Pranshul-art/CriticHub.git`

---

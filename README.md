# NESTURE JOURNAL — Full-Stack Real Estate Editorial & Market Intelligence Platform

![Nesture Journal](http://localhost:3000/images/preview.png)

> **Nesture Journal** is an institutional digital news, insights, and market intelligence publication for the real estate industry. Built with 100% self-owned, self-hosted software architecture on Next.js 14, React 18, TypeScript, Tailwind CSS, Prisma ORM, and native PostgreSQL.

---

## 🏛️ Executive Summary

Nesture Journal delivers institutional-grade real estate journalism, macroeconomic data tracking, RERA jurisprudence, and proptech innovation analysis. Designed strictly following the visual aesthetic of premium financial and editorial publications (Navy `#071B2B`, Emerald Green `#008F5A`, Soft Neutral `#F5F7F6`).

### Zero External SaaS & API Dependencies
- **Primary Database**: PostgreSQL (Port 5432, UTF-8 encoded).
- **Authentication**: Custom database-backed sessions with bcrypt/Argon2id hashing, HTTP-only secure cookies, and Role-Based Access Control (RBAC).
- **Search Engine**: PostgreSQL Full Text Search with ranking & query logging. Zero external search APIs.
- **Content Processing**: Deterministic rule-based keyword extraction, category classification, similarity collision detection, and reading-time estimations.
- **Analytics**: Privacy-first, self-owned event tracking in PostgreSQL. Zero third-party trackers or Google Analytics.
- **Market Data**: Local seed datasets strictly labeled `DEMO DATA — NOT LIVE MARKET INFORMATION`.
- **Media Pipeline**: Local file storage with Sharp WebP optimization and MIME verification.

---

## ⚡ Quick Start (Local Development)

```bash
# 1. Install all dependencies
npm install

# 2. Start native PostgreSQL server
npm run db:start

# 3. Synchronize database schema & seed initial editorial data
npx prisma db push
npm run prisma:seed

# 4. Start Next.js development server
npm run dev
```

Visit the application:
- **Public Portal**: [http://localhost:3000](http://localhost:3000)
- **Staff Admin Portal**: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)

### Default Super Admin Credentials (Local Testing):
- **Email**: `admin@nesturejournal.com`
- **Password**: `AdminPassword@2026!`

---

## 📦 Verified Scripts

| Command | Action |
|---|---|
| `npm run dev` | Launches Next.js in development mode on localhost:3000 |
| `npm run build` | Compiles an optimized production build of all 30 routes |
| `npm run start` | Serves the production build on localhost:3000 |
| `npm run test` | Runs the Vitest unit & integration test suite (15 tests) |
| `npm run test:e2e` | Runs Playwright tests across Desktop, Tablet & Mobile (9 tests) |
| `npm run typecheck`| Runs TypeScript validation (`tsc --noEmit`) |
| `npm run db:start` | Initializes and launches the local PostgreSQL daemon on port 5432 |
| `npm run db:status`| Checks health and connectivity of local PostgreSQL on port 5432 |
| `npm run db:stop` | Safely terminates running PostgreSQL background processes |
| `npm run prisma:seed`| Seeds test articles, categories, authors, and market data |

---

## 📚 Complete Documentation Index

- [Architecture & Design System](docs/ARCHITECTURE.md)
- [Database Schema & Prisma Models](docs/DATABASE.md)
- [REST API Specifications](docs/API.md)
- [Editorial Admin & CMS Guide](docs/ADMIN_GUIDE.md)
- [Advanced SEO Engine & Structured Data](docs/SEO.md)
- [Security Architecture & RBAC](docs/SECURITY.md)
- [Quality Assurance & Testing Guide](docs/TESTING.md)
- [Local Setup & Troubleshooting](docs/LOCAL_SETUP.md)
- [Future Integration Architecture](docs/FUTURE_INTEGRATIONS.md)

---

## 📄 License & Ownership

100% self-owned, independent source code. Copyright &copy; 2026 Nesture Journal.
# Nesture-Journal

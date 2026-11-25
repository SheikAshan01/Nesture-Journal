# Local Setup & Operational Guide

Step-by-step instructions for running and evaluating Nesture Journal on your local development machine.

---

## 1. Prerequisites

- **Node.js**: v18.0.0 or higher (Tested and certified on Node v20 and v26).
- **npm**: v9.0.0 or higher.
- **PostgreSQL**: Either the included embedded PostgreSQL daemon (zero install required) OR local PostgreSQL service / Docker Compose.

---

## 2. Standard Installation

```bash
# Clone or open workspace directory
cd d:/demo2

# Install dependencies
npm install
```

---

## 3. Database Startup

Nesture Journal includes a bundled native PostgreSQL server runner that requires **no external PostgreSQL installation or Docker Desktop**:

```bash
# Start native PostgreSQL daemon on default port 5432
npm run db:start

# Verify that PostgreSQL is healthy and accepting connections
npm run db:status
```

*Note: For environments with Docker Desktop installed, `docker compose up -d` can also be used.*

---

## 4. Schema Sync & Seeding

```bash
# Push Prisma schema to PostgreSQL
npx prisma db push

# Generate Prisma Client
npx prisma generate

# Populate database with editorial articles, taxonomies, and market demo data
npm run prisma:seed
```

---

## 5. Launch Application

```bash
# Start Next.js development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 6. Accessing Staff Administration

1. Go to [http://localhost:3000/admin/login](http://localhost:3000/admin/login).
2. Use credentials:
   - **Email**: `admin@nesturejournal.com`
   - **Password**: `AdminPassword@2026!`
3. Click **Authenticate Session** to enter the editorial management dashboard.

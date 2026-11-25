# Future Integration Architecture

While all external APIs remain **strictly disabled** for local development and self-contained operation, the codebase is engineered with clean modular abstraction boundaries to accommodate future production services without refactoring core logic.

---

## 1. External AI Providers (Modular Interface)

- **Current Implementation**: `lib/content-engine/rule-engine.ts` provides deterministic keyword extraction, categorization, and quality auditing.
- **Future Hook Point**: Create an adapter `lib/content-engine/providers/ai-provider.ts` implementing `ContentEngineInterface`. The editor form and API routes already consume a standardized `{ analysis }` contract.

---

## 2. Live Market Equities Feed

- **Current Implementation**: `app/api/market/route.ts` serves local PostgreSQL records flagged with `isDemo: true`.
- **Future Hook Point**: Create a background cron adapter in `services/market/ingest.ts` polling NSE/BSE or licensed financial vendor APIs, writing updates to `MarketData`.

---

## 3. Authorized News & RSS Ingestion

- **Current Implementation**: Model `ContentSource` with `sourceType: 'RSS_MODULAR'` exists in PostgreSQL schema with `isEnabled: false`.
- **Future Hook Point**: An ingestion worker can be toggled on to fetch licensed feeds and stage incoming stories in `PENDING_APPROVAL` status.

---

## 4. Transactional Email Delivery

- **Current Implementation**: `app/api/newsletter/route.ts` registers subscribers in PostgreSQL with zero external SMTP calls.
- **Future Hook Point**: An adapter `lib/email/mailer.ts` can be plugged in (e.g. self-hosted Postfix or standard SMTP) to send newsletter editions to verified subscribers.

---

## 5. Cloud Media Storage (S3 / R2)

- **Current Implementation**: `lib/media/storage.ts` saves optimized WebP images to `/public/uploads`.
- **Future Hook Point**: Replace the local filesystem write in `processAndSaveImage()` with an S3-compatible client (`@aws-sdk/client-s3`), returning the CDN asset URL.

# Quality Assurance & Testing Suite

Nesture Journal includes automated testing suites across unit, database integration, and end-to-end multi-viewport workflows.

---

## 1. Vitest Unit & Integration Suite

To execute the test suite:
```bash
npm run test
```

### Coverage Highlights:
- `tests/unit/rule-engine.test.ts`:
  - Keyword frequency extraction and stop-word filtering.
  - Deterministic category recommendation for residential and commercial text.
  - Tag recommendation logic.
  - Duplicate title collision detection via Jaccard similarity.
  - Reading-time calculation based on word density.
  - SEO and content quality audit calculations.
- `tests/unit/auth-security.test.ts`:
  - Password hashing and verification.
  - IP sliding-window login rate limiting.
  - Wildcard permission checks for `SUPER_ADMIN`.
  - Scoped role permissions for `EDITOR` and `AUTHOR`.
- `tests/integration/api.test.ts`:
  - PostgreSQL live connection and category verification.
  - Article query validation matching reference screenshot data.
  - Market data `isDemo: true` integrity verification.
  - Newsletter subscriber duplicate email constraint enforcement.

---

## 2. Playwright Multi-Device E2E Suite

To execute the browser test suite:
```bash
npx playwright test
```

### Configured Viewports:
1. **Desktop Chrome** (1440 × 900)
2. **Tablet Viewport** (768 × 1024)
3. **Mobile Viewport** (390 × 844)

### Automated Test Scenarios:
1. **Homepage Visual Integrity**:
   - Nesture Journal logo and branding subtext.
   - Realty stocks ticker bar and quotes.
   - Breaking news flash ticker.
   - Hero slider story and 3 stacked right cards.
   - 8 category navigation ribbon items.
   - Latest insights grid and Market Intelligence chart widget.
   - Complete editorial footer and social channels.
2. **Public Routing**:
   - Validates `/category/residential`, `/articles/[slug]`, `/market-intelligence`, `/realty-stocks`, and `/search`.
3. **Admin Security Flow**:
   - Rejects unauthorized credentials.
   - Authenticates Super Admin and verifies redirect to `/admin` dashboard.

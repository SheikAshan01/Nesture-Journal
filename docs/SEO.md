# Advanced SEO Engine & Structured Data

Search engine discoverability and semantic correctness are core priorities of Nesture Journal.

---

## 1. Technical SEO Architecture

- **Clean URL Hierarchy**:
  - `/articles/[slug]`: Canonical article permalink.
  - `/category/[slug]`: Topic hub index.
  - `/category/[slug]/[subslug]`: Sector niche index.
- **Dynamic Meta Tags**: Every article and category injects unique `<title>`, `<meta name="description">`, `<link rel="canonical">`, OpenGraph cards, and Twitter summary tags.
- **Indexation Directives (`/robots.txt`)**:
  - Permits full public crawling on editorial hubs.
  - Disallows crawler access to staff portals (`/admin`, `/api/*`).
  - References dynamic XML sitemap.
- **Dynamic XML Sitemap (`/sitemap.xml`)**:
  - Real-time sitemap querying PostgreSQL for all published articles and active categories.
  - Includes `lastmod`, `changefreq`, and `priority` attributes.
- **Syndication RSS Feed (`/feed.xml`)**:
  - RSS 2.0 valid feed containing the latest 30 editorial publications with CDATA encapsulation.

---

## 2. Structured Data (JSON-LD)

### A. NewsMediaOrganization (Root Layout)
```json
{
  "@context": "https://schema.org",
  "@type": "NewsMediaOrganization",
  "name": "Nesture Journal",
  "url": "http://localhost:3000",
  "logo": "http://localhost:3000/images/logo.png",
  "description": "Real Estate News, Insights, Research & Market Intelligence Platform."
}
```

### B. WebSite & SearchAction (Root Layout)
Enables Google Sitelinks Search Box for internal search queries.

### C. NewsArticle Schema (Individual Article Pages)
Injected on all individual article pages (`/articles/[slug]`):
- `headline`
- `description`
- `datePublished`
- `dateModified`
- `image`
- `author` (Person entity)
- `publisher` (Organization entity)
- `mainEntityOfPage`

---

## 3. SEO Health Audit Engine

The internal scanner evaluates each article against 5 technical criteria:
1. **Title Length**: 20-80 character optimal range.
2. **Meta Description**: Minimum 50 characters, optimal 120-160 characters.
3. **Content Depth**: Minimum 300 words recommended to prevent thin content demotions.
4. **Image Accessibility**: Descriptive `alt` attribute required on featured photography.
5. **Canonical Consistency**: Valid URL scheme matching site domain.

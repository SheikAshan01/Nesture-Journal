# Internal REST API Documentation

All endpoints are self-owned, internal Next.js Route Handlers. Zero external APIs are called.

---

## 1. Authentication Endpoints

### `POST /api/auth/login`
- **Description**: Authenticates staff user, applies sliding-window IP rate limiting, sets HTTP-only cookie, and logs audit record.
- **Request Body**:
  ```json
  { "email": "admin@nesturejournal.com", "password": "AdminPassword@2026!" }
  ```
- **Responses**:
  - `200 OK`: `{ "success": true, "user": { ... } }`
  - `401 Unauthorized`: `{ "error": "Invalid email or password." }`
  - `429 Too Many Requests`: Rate limit triggered (max 5 failures per 15 min window).

### `POST /api/auth/logout`
- **Description**: Invalidates database session token and clears HTTP-only cookie.

### `GET /api/auth/me`
- **Description**: Returns current user profile, role, and fine-grained permissions array.

---

## 2. Article Endpoints

### `GET /api/articles`
- **Query Parameters**:
  - `category` (string, category slug)
  - `status` (`PUBLISHED`, `DRAFT`, `SCHEDULED`, `ARCHIVED`)
  - `featured` (`true` / `false`)
  - `trending` (`true` / `false`)
  - `breaking` (`true` / `false`)
  - `q` (string, full-text search)
  - `page` (default: 1)
  - `limit` (default: 10, max: 50)
- **Response**: List of articles with category, author, tags, and pagination metadata.

### `POST /api/articles`
- **Requires**: `article:create` permission.
- **Payload**: `title`, `slug` (optional), `shortDescription`, `content`, `featuredImage`, `imageAlt`, `categoryId`, `subcategoryId`, `tagIds`, `status`, `isFeatured`, `isTrending`, `isBreaking`, `seoTitle`, `seoDescription`.
- **Validation**: Performs collision check for identical or near-duplicate titles (>95% text similarity) and calculates reading time.

### `PUT /api/articles/[id]`
- **Requires**: `article:edit` permission.
- **Description**: Updates article fields, refreshes reading time, and maintains audit history.

### `DELETE /api/articles/[id]`
- **Requires**: `article:delete` permission.
- **Description**: Permanently removes an article and associated tag relations.

---

## 3. Taxonomy Endpoints

### `GET /api/categories`
- **Description**: Retrieves all categories with subcategories and article count.

### `POST /api/categories`
- **Requires**: `category:manage` permission.
- **Payload**: `{ "name": "Logistics", "color": "#008F5A", "description": "..." }`

### `DELETE /api/categories/[id]`
- **Safety Rule**: Rejects deletion if articles are actively assigned to the category (`400 Bad Request`).

---

## 4. Media Endpoints

### `GET /api/media`
- **Description**: Lists locally uploaded images with file size, dimensions, and alt text.

### `POST /api/media`
- **Requires**: `media:manage` permission.
- **Payload**: Multipart form data with `file` and `alt`.
- **Processing**: Enforces 5MB size limit, validates MIME (`image/jpeg`, `image/png`, `image/webp`, `image/avif`), optimizes to WebP with Sharp, generates unique filename, and saves to `/public/uploads`.

---

## 5. Intelligence & Content Engine Endpoints

### `POST /api/content-engine/analyze`
- **Payload**: `{ "title": "...", "shortDescription": "...", "content": "..." }`
- **Response**: Extracted keywords, recommended category, suggested tags, duplicate title check, and 0-100 quality/SEO score.

### `GET /api/market`
- **Response**: List of demo stocks, market index series, and QoQ KPIs with `notice: "DEMO DATA — NOT LIVE MARKET INFORMATION."`

### `GET /api/seo/audit`
- **Response**: Complete health score (0-100), total audited entities, error count, recommendation count, and specific issues list.

# Editorial Admin & CMS User Guide

The Nesture Journal Admin Dashboard provides staff editors and administrators with complete oversight of publication workflows.

---

## 1. Accessing the Admin Workspace

1. Navigate to: `http://localhost:3000/admin/login`
2. Authenticate using authorized editorial credentials:
   - **Super Admin**: `admin@nesturejournal.com` / `AdminPassword@2026!`
   - **Editor**: `editor@nesturejournal.com` / `AdminPassword@2026!`
3. For local evaluation, click the convenient **Auto-fill Super Admin** button on the login form.

---

## 2. Editorial Modules

### A. Operations Dashboard (`/admin`)
- Real-time counts of Published stories, Drafts, Cumulative Pageviews, and Active Categories.
- Quick links to draft new stories or launch the SEO health scanner.
- Leaderboard table of most-read stories.
- Audit feed showing the latest staff actions.

### B. Article Desk (`/admin/articles`)
- **Status Filtering**: Instantly toggle between `Published`, `Draft`, `Scheduled`, or `Archived`.
- **Search**: Search across headlines and text bodies.
- **One-Click Actions**:
  - **Publish/Unpublish**: Toggle story live status without entering editor.
  - **Duplicate Story**: Creates an exact clone as a Draft for template reuse.
  - **Edit Story**: Launches the rich article form.
  - **Safe Delete**: Prompts confirmation before removing records.

### C. Article Creator & Content Engine (`/admin/articles/new`)
- **Headline & URL**: Auto-generates clean slugs or allows custom URI overrides.
- **Internal Content Engine Panel**:
  - Click **Run Audit** to invoke the deterministic rule-based analyzer.
  - **Rule Recommendation**: Suggests optimal category (e.g. Residential vs Commercial) with a 1-click **Apply** button.
  - **Quality Score**: Real-time 0-100 health score verifying title length, depth (300+ words), summary quality, and image alt text.
  - **Collision Warning**: Alerts the editor if an identical or near-duplicate title exists.
  - **Suggested Tags**: Displays auto-discovered topic tags with 1-click addition.

### D. Media Library (`/admin/media`)
- Drag-and-drop or file upload for local editorial photography.
- Automatic Sharp compression into WebP format to conserve storage and optimize loading.
- Instant 1-click **Copy URL** button for inserting into articles.

### E. SEO Health Scanner (`/admin/seo`)
- Platform-wide scanner auditing all articles and category records.
- Reports missing meta titles, thin content warnings (< 200 words), and missing image alt tags.
- Direct links to **Fix** affected stories.

### F. Subscribers Desk (`/admin/subscribers`)
- View newsletter opt-ins.
- Click **Export Subscribers (CSV)** to download subscriber data for authorized local mail workflows.

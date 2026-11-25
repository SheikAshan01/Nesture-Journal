# Security Architecture & RBAC

Security is implemented natively using defense-in-depth principles.

---

## 1. Authentication & Password Security

- **Cryptographic Hashing**: Passwords hashed with bcrypt (salt rounds: 12).
- **Session Tokens**: Generated with `crypto.randomBytes(32).toString('hex')` producing 256 bits of entropy.
- **Database-Backed Sessions**: Tokens stored in PostgreSQL `Session` table with strict expiration timestamps (`expiresAt: 7 days`).
- **HTTP-Only Cookies**:
  - `httpOnly: true` (prevents JavaScript/XSS session theft).
  - `sameSite: 'lax'` (mitigates CSRF vulnerabilities).
  - `secure: true` (enforced automatically in production HTTPS).

---

## 2. Rate Limiting & Brute Force Prevention

- In-memory sliding-window tracker monitoring failed authentication attempts per IP address.
- **Threshold**: Maximum 5 failed attempts within a 15-minute window.
- **Enforcement**: Returns `429 Too Many Requests` with exact retry countdown seconds.
- **Clearing**: Successful authentication resets failure counters.

---

## 3. Role-Based Access Control (RBAC)

| Role | Article Create/Edit | Article Publish | Category Manage | Media Upload/Delete | Settings & SEO |
|---|---|---|---|---|---|
| **SUPER_ADMIN** | ✅ Full | ✅ Full | ✅ Full | ✅ Full | ✅ Full |
| **ADMIN** | ✅ Full | ✅ Full | ✅ Full | ✅ Full | ✅ Full |
| **EDITOR** | ✅ Full | ✅ Full | ❌ Read Only | ✅ Full | ❌ Read Only |
| **AUTHOR** | ✅ Draft Only | ❌ Needs Approval | ❌ Read Only | ✅ Upload | ❌ Read Only |

Server-side authorization is validated in all Next.js Route Handlers before executing database writes.

---

## 4. Input Sanitization & Media Protection

- **SQL Injection Prevention**: All queries parameterized via Prisma ORM. No raw string interpolation.
- **Path Traversal Prevention**: File uploads use `path.basename` and generate cryptographic UUID filenames, preventing directory traversal attacks (`../../`).
- **MIME & Size Restrictions**: Enforces maximum 5MB file size and whitelists only image types (`image/jpeg`, `image/png`, `image/webp`, `image/avif`).
- **Audit Logging**: Sensitive editorial modifications, logins, logouts, and category deletions are immutably recorded in the `AuditLog` table.

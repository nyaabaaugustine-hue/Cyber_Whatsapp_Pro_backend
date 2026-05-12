# Cyber WhatsApp Pro — License System Setup Guide

## 📁 Folder Structure

```
cwp-license-system/
├── backend/                        ← Next.js API (deploy to Vercel)
│   ├── prisma/
│   │   ├── schema.prisma           ← Prisma ORM schema
│   │   └── schema.sql              ← Raw SQL (run in Neon SQL Editor)
│   ├── src/
│   │   ├── lib/
│   │   │   ├── prisma.js           ← Prisma singleton client
│   │   │   └── keyGenerator.js     ← Key generator + format validator
│   │   └── app/api/
│   │       ├── verify-license/
│   │       │   └── route.js        ← POST /api/verify-license
│   │       └── admin/
│   │           ├── generate-key/
│   │           │   └── route.js    ← POST /api/admin/generate-key
│   │           └── keys/
│   │               └── route.js    ← GET/PATCH /api/admin/keys
│   ├── .env.example                ← Environment variable template
│   └── package.json
│
└── extension/                      ← Chrome Extension (Manifest V3)
    ├── manifest.json
    ├── popup.html
    ├── css/
    │   └── popup.css
    ├── js/
    │   ├── license.js              ← Core license logic
    │   ├── popup.js                ← Popup UI controller
    │   ├── background.js           ← Service worker
    │   └── proinjt.js              ← Content script gate
    └── logo/                       ← Your extension icons
```

---

## 🗄️ Step 1 — Set Up Neon PostgreSQL

1. Go to **https://console.neon.tech** and create a free account.
2. Create a new project: `cyber-whatsapp-pro`
3. In your project, open the **SQL Editor**.
4. Paste and run the full contents of **`prisma/schema.sql`**.
5. Go to **Connection Details** and copy both connection strings:
   - **Pooled** → `DATABASE_URL`
   - **Direct** → `DIRECT_URL`

---

## 🔧 Step 2 — Set Up the Backend

```bash
cd backend
npm install

# Copy env template
cp .env.example .env.local
# Edit .env.local with your Neon credentials and admin token

# Push schema via Prisma (alternative to running schema.sql)
npx prisma generate
npx prisma db push

# Run locally
npm run dev
```

Test locally at: `http://localhost:3000/api/verify-license`

---

## 🚀 Step 3 — Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

cd backend
vercel

# Follow prompts, then add environment variables:
vercel env add DATABASE_URL
vercel env add DIRECT_URL
vercel env add ADMIN_SECRET_TOKEN

# Redeploy with env vars
vercel --prod
```

Your API will be live at:
`https://your-project.vercel.app/api/verify-license`

---

## 🔌 Step 4 — Configure the Extension

1. Open `extension/manifest.json`
2. Update `host_permissions` with your Vercel URL:
   ```json
   "https://your-project.vercel.app/*"
   ```
3. Open `extension/js/license.js`
4. Update `LICENSE_API_URL`:
   ```js
   const LICENSE_API_URL = "https://your-project.vercel.app/api/verify-license";
   ```

---

## 📦 Step 5 — Load Extension in Chrome

1. Go to `chrome://extensions/`
2. Enable **Developer mode** (top right)
3. Click **Load unpacked**
4. Select the `extension/` folder
5. The extension will appear in your toolbar

---

## 🔑 Step 6 — Generate License Keys (Admin)

```bash
# Generate a single premium key (365 days)
curl -X POST https://your-project.vercel.app/api/admin/generate-key \
  -H "Authorization: Bearer YOUR_ADMIN_SECRET_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"email": "customer@example.com", "plan": "premium", "durationDays": 365}'

# Generate a lifetime key
curl -X POST https://your-project.vercel.app/api/admin/generate-key \
  -H "Authorization: Bearer YOUR_ADMIN_SECRET_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"plan": "lifetime", "durationDays": null}'

# Generate 5 keys at once
curl -X POST https://your-project.vercel.app/api/admin/generate-key \
  -H "Authorization: Bearer YOUR_ADMIN_SECRET_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"plan": "premium", "durationDays": 365, "quantity": 5}'
```

Example response:
```json
{
  "success": true,
  "generated": 1,
  "keys": [
    {
      "license_key": "CWP-PREM-2026-X8A91",
      "plan": "premium",
      "expiry": "2027-05-12",
      "created_at": "2026-05-12T10:00:00.000Z"
    }
  ]
}
```

---

## 📋 Admin API Reference

### List All Keys
```bash
GET /api/admin/keys
Authorization: Bearer YOUR_ADMIN_SECRET_TOKEN

# Filter by plan or status
GET /api/admin/keys?plan=premium&active=true
```

### Deactivate a Key
```bash
PATCH /api/admin/keys
Authorization: Bearer YOUR_ADMIN_SECRET_TOKEN
Content-Type: application/json

{ "licenseKey": "CWP-PREM-2026-X8A91", "active": false }
```

### Verify License (Extension calls this)
```bash
POST /api/verify-license
Content-Type: application/json

{ "licenseKey": "CWP-PREM-2026-X8A91" }
```

Success response:
```json
{ "valid": true, "plan": "premium", "expiry": "2027-05-12", "lifetime": false }
```

Failure response:
```json
{ "valid": false, "error": "License key not found." }
```

---

## 🔁 Customer Activation Flow

```
Customer pays via Mobile Money
        ↓
Admin generates key via /api/admin/generate-key
        ↓
Admin sends key to customer on WhatsApp (+233541988383)
        ↓
Customer opens extension popup
        ↓
Customer enters key → clicks "Activate Premium"
        ↓
Extension calls POST /api/verify-license
        ↓
Backend checks Neon PostgreSQL
        ↓
If valid → chrome.storage.local saves license
         → Premium features unlock
         → Background alarm set for re-check every 6h
        ↓
If invalid → error message shown to user
```

---

## 🔒 Security Notes

- **Never hardcode** the admin token in code — use environment variables only.
- The `ADMIN_SECRET_TOKEN` protects key generation. Use `openssl rand -hex 32` to generate one.
- License re-verification happens every 6 hours automatically via `chrome.alarms`.
- Expired keys are auto-deactivated in the database on next check.
- The extension never bypasses the server — premium access is always server-verified.
- `DATABASE_URL` and `DIRECT_URL` are never exposed to the extension.

---

## 🧪 Test Keys (from seed data)

| Key                   | Plan     | Status   | Expires         |
|-----------------------|----------|----------|-----------------|
| CWP-PRO-2026-X8A91   | premium  | Active   | +1 year         |
| CWP-PREM-L9A21M      | lifetime | Active   | Never           |
| CWP-PRO-2026-DEMO1   | premium  | Active   | +7 days         |
| CWP-PRO-2025-EXP99   | premium  | Inactive | Already expired |

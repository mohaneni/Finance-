# Money Line Finance — R.S. Puram, Coimbatore

A pure **HTML, CSS, and Vanilla JavaScript** loan-enquiry storefront for **Money Line Finance**, New No. 91, Old No. 58, W Sambandam Rd, R.S. Puram, Coimbatore, Tamil Nadu 641002.

> **100% Static Frontend — Ready for GitHub & GitHub Pages**
> No backend, database, or React build step is required to host the site on GitHub Pages. All routes use hash navigation (`#/loans`, `#/apply`, `#/admin`, etc.) and relative asset paths (`./css/styles.css`, `./js/app.js`, `./images/...`) so it works both at custom domains and `https://<username>.github.io/<repo-name>/`.

---

## Project Structure

```text
├── index.html                  # Semantic HTML entry point + SEO & JSON-LD schema
├── 404.html                    # GitHub Pages fallback redirect
├── robots.txt                  # Search crawler rules
├── sitemap.xml                 # Sitemap for static routes
├── css/
│   └── styles.css              # Responsive design system (#0B1F3A Navy, #D4A53A Gold, #F7F9FC)
├── js/
│   ├── app.js                  # Hash router, bilingual renderer, EMI UI, 3-step Apply & Admin console
│   ├── site-config.js          # Single source of truth for address, hours, phone & 5 loan products
│   ├── translations.js         # Complete English (EN) and Tamil (தமிழ்) dictionaries
│   ├── emi.js                  # Reducing-balance EMI calculator & INR formatting
│   ├── hero3d.js               # Zero-dependency Canvas 3D hero (Shield + Rupee + Gold Coins)
│   ├── storage.js              # Browser localStorage/sessionStorage lead store, draft autosave & CSV export
│   └── icons.js                # Inline SVG icon helper
├── images/
│   ├── hero-vault.jpg          # Hero fallback / poster visual
│   └── office-coimbatore.jpg   # R.S. Puram branch showcase image
└── .github/workflows/
    └── deploy.yml              # GitHub Actions workflow for GitHub Pages
```

---

## Key Features

- **Above-the-Fold 5-Service Clarity**: Direct quick-select service tiles in the hero + filterable storefront for **Personal Loan**, **Business Loan**, **Vehicle Loan**, **Gold Loan**, and **Loan Against Property**.
- **Bilingual (`EN` / `தமிழ்`)**: Instant language toggle persisting across pages.
- **Zero-Dependency 3D Hero Canvas**: Interactive `Shield + ₹ + Gold Coins` rendered via HTML5 Canvas (`hero3d.js`) that pauses when scrolled off-screen and automatically falls back to `./images/hero-vault.jpg` on `prefers-reduced-motion` or low-memory mobile devices.
- **Reducing-Balance EMI Calculator**: Loan-product presets, synced sliders + numeric inputs, animated SVG donut chart, and **Apply for this amount** jump that pre-fills `#/apply`.
- **3-Step Enquiry Wizard (`#/apply`)**: Autosaves draft in `sessionStorage`, validates 10-digit Indian mobile numbers (`6–9`), enforces consent, collects **NO Aadhaar, PAN, or bank numbers**, generates a Reference ID (`MLF-YYYYMMDD-XXXX`), and stores enquiries locally in `localStorage`.
- **Local Admin Preview (`#/admin`)**: Client-side enquiry tracker (`password: moneyline2026`) with KPI counts, search & filters, status tracking, call/WhatsApp shortcuts, and CSV export.

---

## Customizing Business Details

Open `js/site-config.js` and search for `TODO` comments to update:
- Owner email (`ownerEmail`) and Grievance Officer email
- License / registration details (`licenseDetails`)
- Interest rates, tenures, and loan amount ranges (`loanProducts`)
- Years in business, customers served, and verified customer testimonials

---

## Deploying to GitHub Pages

### Option A — Deploy via GitHub Actions (Recommended)
1. Push this repository to GitHub (`main` branch).
2. Open your repository **Settings → Pages**.
3. Under **Build and deployment → Source**, choose **GitHub Actions**.
4. The included `.github/workflows/deploy.yml` workflow will automatically publish your static site whenever you push to `main`.

### Option B — Deploy Directly from the `main` Branch
1. Push this repository to GitHub (`main` branch).
2. Go to **Settings → Pages → Source: Deploy from a branch**.
3. Select branch **`main`** and folder **`/ (root)`**, then click **Save**.
4. Your site will be live within ~1 minute at `https://<your-username>.github.io/<your-repo>/`.

---

## Local Preview

- **Static HTTP Server / VS Code Live Server**: Open `index.html` with Live Server or run `npx serve .`
- **Vite Dev Server (Port 3000)**:
  ```bash
  npm install
  npm run dev
  ```
- **Static Production Bundle (`dist/`)**:
  ```bash
  npm run build
  ```

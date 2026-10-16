# VOUCHERA — vouchera.in

Static website for VOUCHERA, an Indian cashback and rewards business.
Plain HTML, CSS and JavaScript — no build step, no server, no admin dashboard.

## Deploy (GitHub + Vercel)

1. Upload everything in this folder to a GitHub repository (keep the folder structure).
2. In Vercel: **Add New → Project → Import** the repository.
   Framework preset: **Other**. Build command: *none*. Output directory: `./`.
3. Add your domain `vouchera.in` under **Settings → Domains**.

`vercel.json` adds security headers (CSP, HSTS, frame protection) automatically.

## Publishing offers

Edit **`assets/js/offers-data.js`** only. Instructions and a blank template are at the top
of that file. Offers appear on the Home page and Explore Offers automatically, and hide
themselves after their `validUntil` date. Add an offer only after the store or affiliate
network confirms the rate and conditions.

When there are no live offers, the Home page hides its "Live offers" section and Explore
Offers shows an explanatory message.

## Contact form

The site has no server. The contact form checks the details and opens the visitor's email
app with a ready-to-send message to support@vouchera.in. Nothing is stored on the website.

## Files

| Path | Purpose |
| --- | --- |
| `index.html` … `refund-policy.html` | The nine pages |
| `404.html` | Not-found page (Vercel uses it automatically) |
| `assets/css/styles.css` | All styles and brand colours |
| `assets/js/main.js` | Menu, header, small interactions |
| `assets/js/offers-data.js` | **Your offers** |
| `assets/js/offers.js` | Renders offer cards (no need to edit) |
| `assets/js/contact.js` | Contact form |
| `assets/img/` | Logo, favicon, app icons, social-sharing image |
| `sitemap.xml`, `robots.txt`, `site.webmanifest` | SEO and install metadata |

## Updating policies

Policies live in `privacy-policy.html`, `terms.html`, `cashback-policy.html` and
`refund-policy.html`. If you change one, update the "Last updated" date at the top of it
and the `<lastmod>` date in `sitemap.xml`.

## Brand

- Ink `#1C1A3B` · Paper `#FBF7EF` · Marigold `#F2A72E` · Vermilion `#E0553D` · Jade `#1F8A74`
- Type: Fraunces (headings), Manrope (text), JetBrains Mono (labels)
- Logo: `assets/img/logo.svg` (full) and `assets/img/logo-mark.svg` (symbol)

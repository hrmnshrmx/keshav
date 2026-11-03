# Keshav Sharma — Graphic Designer Portfolio

Single-page portfolio built with plain HTML, CSS and vanilla JavaScript, deployed on **Cloudflare Pages**.
The contact form saves submissions to **Cloudflare D1** through a Pages Function.

## Structure

```
index.html                 Page markup (SEO meta, JSON-LD, all sections)
css/style.css              Design tokens, dark/light themes, layout, responsive rules
js/main.js                 Theme toggle (localStorage), menu, scroll-spy, reveals,
                           filters, testimonial slider, contact form
functions/api/contact.js   POST /api/contact → validates, rate-limits, writes to D1
migrations/0001_*.sql      contact_submissions table (also auto-created by the function)
assets/img/                Portrait + project images (replace with same file names)
_headers, robots.txt, sitemap.xml, favicon.svg
```

## Contact form / D1

- `wrangler.toml` binds the D1 database `keshav-db` as `DB` (Pages uses this file as the source of truth for bindings).
- The function uses the D1 binding named `DB`. If the binding has another name, it finds the
  first D1 binding attached to the Pages project, so the existing connection is reused.
- The table `"keshav-ct"` (name, email, project_type, description, created_at, ip_hash,
  user_agent) is created automatically on the first submission. To create it up front:
  `npx wrangler d1 execute <DATABASE_NAME> --remote --file=migrations/0001_create_keshav_ct.sql`
- Spam protection: hidden honeypot field, minimum fill time (3 s), form expiry, max 3 links,
  and a limit of 5 submissions per IP (stored as a salted hash) per hour. Set an `IP_SALT`
  environment variable for a private salt.
- View submissions:
  `npx wrangler d1 execute <DATABASE_NAME> --remote --command "SELECT * FROM \"keshav-ct\" ORDER BY id DESC"`

## Local development

```
npx wrangler pages dev . --d1 DB=local-db
```

## Updating images

Drop new files into `assets/img/` with the same names (`hero.webp`, `about.webp`,
`work-alvora.webp`, `work-brew.webp`, `work-urban.webp`) and update the `width`/`height`
attributes in `index.html`. Larger originals (1200px+ wide) give the sharpest result.

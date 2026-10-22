# Keshav Sharma - Animation Designer Portfolio

A premium, cinematic, dark-themed single-page portfolio website for Keshav Sharma, an Animation Designer. Built with vanilla HTML5, CSS3, and JavaScript. Optimized for deployment on GitHub Pages, Cloudflare Pages, Netlify, or any static hosting provider.

## Live Site
[https://keshavsharma.in/](https://keshavsharma.in/)

## Features

- **Custom Brand**: "Keshav" (off-white) + "Sharma" (purple) wordmark with a KS monogram logo, shared by the header and footer
- **Premium Design**: Dark-first theme with purple accents, editorial typography, and a cohesive design-token system
- **Typography**: Space Grotesk (headings/branding) + Inter (body/UI/forms), fluid `clamp()` sizing throughout
- **Signature Motion**: One restrained brand effect — an SVG signature line that draws itself beside the hero label (and in the header), plus a desktop-only pointer glow in the hero
- **Layered Temporary Artwork**: Every image is a purpose-built, category-specific SVG illustration (not a repeated placeholder motif), generated reproducibly by `tools/generate-artwork.js` and labelled in-image as temporary
- **Showreel Section**: "Motion in Every Frame." — 16:9 stage with a prominent play control. With no video file it shows a designed four-discipline artwork collage labelled as a temporary preview, and never fakes playback
- **Services Section**: Four distinct service cards (Character Animation, Motion Graphics, 3D & Product Animation, Video Editing & Compositing), each with its own visual, description, and an inquiry link that pre-fills the contact form's project type
- **Editorial Gallery**: One visually dominant featured project, then a 12-column gallery on an alternating 7/5 → 5/7 → 6/6 rhythm with larger thumbnails and a category badge on each
- **Behind the Frames**: Four-stage image-led sequence (Concept → Storyboard → Animation → Final Render) with a wide opener and full-width finale, followed by a compact 5-step timeline strip
- **Responsive**: Tested with no horizontal overflow at 320, 360, 390, 430, 768, 1024 and 1440px
- **Project Filters**: All Work / Animation / Motion Graphics / Product 3D / Editing (no reload)
- **Project Details Modal**: Accessible overlay with focus trap, Escape/backdrop close, scroll lock, focus restore
- **Smooth Animations**: Hero entrance stagger, IntersectionObserver scroll reveals, refined hover states
- **Theme Toggle**: Genuine dark/light themes, persisted in localStorage, no flash on load. Dark is the default
- **Contact Form**: Client-side validation, honeypot spam trap, honest status states, optional budget range, configurable endpoint
- **Back to Top**: Appears after scrolling, smooth-scrolls home, hidden from the tab order while off-screen
- **Accessibility**: Semantic HTML, ARIA labels, keyboard navigation, visible focus, reduced-motion support
- **SEO**: Meta tags, Open Graph + Twitter Cards with a custom social preview, canonical URL, robots.txt, sitemap.xml
- **Performance**: Lazy-loaded below-fold images, explicit dimensions, passive listeners, CSS transforms

## Fonts

- **Headings / branding**: `Space Grotesk` — weights 500, 600, 700
- **Body / UI / forms**: `Inter` — weights 400, 500, 600
- Loaded from Google Fonts with `display=swap` and sensible system fallbacks.

## File Structure

```
/
├── index.html          # Main HTML file with all sections
├── css/
│   └── style.css       # All styles and responsive design
├── js/
│   └── script.js       # Interactive functionality
├── tools/
│   └── generate-artwork.js  # Regenerates the temporary SVG artwork set
├── assets/
│   ├── images/         # Hero + about artwork (replace with real photos)
│   ├── projects/       # Per-project artwork (replace with real stills)
│   ├── process/        # Behind-the-Frames stage artwork
│   ├── services/       # Service card visuals
│   ├── video/          # Showreel video (add your own)
│   ├── showreel-collage.svg   # Temporary showreel preview collage
│   └── og-image.svg    # Social sharing preview (1200×630)
├── favicon.svg         # KS monogram favicon
├── robots.txt          # SEO robots file
├── sitemap.xml         # SEO sitemap
└── README.md           # This file
```

### Regenerating the temporary artwork

The stand-in illustrations are produced by a script, so they are reproducible and easy to swap:

```bash
node tools/generate-artwork.js
```

This writes every file listed in the [Asset Manifest](#asset-manifest) below. Editing the script is the quickest way to restyle the whole set consistently.

## Getting Started

### Local Development
1. Clone or download this repository
2. Open `index.html` in your browser, or use a local server:
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js
   npx serve .
   
   # Using PHP
   php -S localhost:8000
   ```
3. Visit `http://localhost:8000`

### No Build Required
This is a static site with no build tools. Just edit HTML, CSS, and JS files directly.

## Content Replacement Guide

### 1. Hero Portrait (Required)
The hero currently shows a designed character illustration, clearly labelled in-image as temporary artwork. Replace it with Keshav's actual portrait.
- **Recommended size**: 900x1200px (3:4)
- **Format**: JPG or WebP
- **Location**: `assets/images/hero-artwork.svg` (replace the file, or point the `<img src>` in `index.html` at a `.jpg`/`.webp` and update `width`/`height`)
- **Alt text**: Update the `alt` in `index.html` — it currently explains that the image is temporary artwork

### 2. About Section Portrait
The About section shows a designed studio-desk illustration, also labelled as temporary.
- **Recommended size**: 800x1000px (4:5)
- **Location**: `assets/images/about-artwork.svg`

### 3. Project Artwork
Each project has its own category-specific illustration in `assets/projects/`. Replace with real stills:
- `character-animation.svg` → a character animation still
- `anime-edit.svg` → an anime edit / motion graphics still
- `product-animation.svg` → a 3D or product animation still
- `cinematic-title-sequence.svg` → a title sequence still
- `cinematic-title-sequence-wide.svg` → a wide (16:9) crop of the same project, used by the featured block
- `explainer-animation.svg` → an explainer frame
- `animated-short-film.svg` → a short film / narrative scene frame

**Recommended specs:**
- **Size**: 1200x750px (16:10); the wide featured crop is 1600x900
- **Format**: JPG or WebP
- **Keep the filenames** (swapping the extension is fine) or update the paths in `index.html` **and** in the `PROJECTS` object in `js/script.js`

### 4. Update Project Information
Project titles, descriptions, tools, process notes and image paths all live in the single `PROJECTS` object in `js/script.js` — it feeds the gallery cards, the featured block, and the details modal:

```javascript
'cinematic-title-sequence': {
    title: 'Cinematic Title Sequence',
    category: 'Motion Graphics',
    description: 'Dramatic opening sequences with impactful typography and motion design.',
    details: 'Longer copy shown in the details modal.',
    process: 'Shown in the modal as a short "Process:" line.',
    tools: ['After Effects', 'Typography'],
    image: 'assets/projects/cinematic-title-sequence.svg',
    link: ''            // optional — a live project URL shows an "Open Project" button
}
```

Nothing in that object claims a client, award, testimonial or result, so it is safe to extend as real work arrives.

### 5. Configure Social Links
Update social media URLs in both hero and contact sections:
- Instagram: Search for `https://instagram.com/`
- YouTube: Search for `https://youtube.com/`
- Behance: Search for `https://behance.net/`
- LinkedIn: Search for `https://linkedin.com/`

Replace with actual URLs. If a platform isn't used, you can remove that link or keep as placeholder.

### 6. Contact Information
Update in the contact section:
- **Email**: Change `contact@keshavsharma.in` to actual email
- **Location**: Update "To be updated" with actual location if desired

### 7. Configure Contact Form
The form ships **without an endpoint**, so it never falsely claims a message was sent — it shows a clear "not connected yet" notice instead.

To enable real delivery, set one value in `js/script.js`:

```javascript
var FORM_ENDPOINT = ''; // add your endpoint here
```

#### Option A: Formspree (Free)
```javascript
var FORM_ENDPOINT = 'https://formspree.io/f/YOUR_FORM_ID';
```

#### Option B: Cloudflare Worker
Point it at your Worker URL (recommended if the site is on Cloudflare Pages). The Worker can forward to email or store the message:
```javascript
var FORM_ENDPOINT = 'https://your-worker.your-subdomain.workers.dev/contact';
```

#### Option C: Other Services
Any endpoint that accepts `POST` with `multipart/form-data` and returns 2xx works (Netlify Forms, Basin, Getform, etc.).

The form already includes a hidden honeypot field (`companyWebsite`) for basic spam filtering. Do **not** put private API keys in `js/script.js` — keep secrets in the Worker/endpoint.

### 8. Configure the Default Theme
Dark is the intentional default for all visitors. Light mode is only applied when a visitor explicitly clicks the toggle (stored in `localStorage`). To change the default, edit the inline script at the top of `index.html` and the `defaultTheme()` function in `js/script.js`.

### 9. Add the Showreel Video
The showreel section ships **without a video file**, so it shows a designed four-discipline artwork collage (`assets/showreel-collage.svg`) labelled in the caption as a temporary preview. Pressing the play control reveals the honest note — it never fakes playback.

To enable real playback, set one value in `js/script.js`:

```javascript
var SHOWREEL_SRC = 'assets/video/showreel.mp4';
var SHOWREEL_TYPE = 'video/mp4';   // or 'video/webm'
```

Recommended: also add `assets/video/showreel.webm` for smaller file sizes and better quality. The `<video>` element already has `controls`, `playsinline` and `preload="none"` — there is no autoplay and no sound until the visitor presses play.

Once a real video is set, the poster and the temporary-preview note are hidden automatically and the large play button steps aside for the native controls. You may also drop a real poster at `assets/showreel-collage.svg`'s replacement path and update the `src` in `index.html`.

### 10. Configure the Availability Status
The availability line in the hero and contact section makes **no claim by default**. Change it in one place in `js/script.js`:

```javascript
var AVAILABILITY = {
    status: 'available',                  // 'unconfirmed' | 'available' | 'booked'
    unconfirmed: 'Status not confirmed — ask me',
    available: 'Available for freelance projects',
    booked: 'Currently booked'
};
```

Only set `status: 'available'` once that is actually true.

### 11. Add Real Project Videos (optional)
The details modal includes a native `<video>` element (`#modalVideo`) that stays hidden until a project has a real video file. Add a `video:` path to a project entry in the `PROJECTS` object in `js/script.js` and wire it into `openModal()`. No fake video URLs are included.

## Asset Manifest

**Every image currently on the site is temporary artwork.** None of it is stock photography, and none of it is presented as Keshav's finished work. The illustrations are original SVGs, generated by `tools/generate-artwork.js`, and the hero/about/showreel pieces carry a visible in-image "TEMPORARY ARTWORK" label. Replace them with real work using the paths below.

### Currently in use (temporary — replace these)

| Path | Used for | Size | Replace with |
|---|---|---|---|
| `assets/images/hero-artwork.svg` | Hero portrait | 900×1200 | A real 3:4 portrait of Keshav |
| `assets/images/about-artwork.svg` | About section portrait | 800×1000 | A real 4:5 photo of Keshav working |
| `assets/showreel-collage.svg` | Showreel preview | 1600×900 | A real showreel poster frame (or enable a video) |
| `assets/projects/character-animation.svg` | Character Animation card + modal | 1200×750 | A real still from the project |
| `assets/projects/anime-edit.svg` | Anime Edit & Motion Graphics card + modal | 1200×750 | A real still from the project |
| `assets/projects/product-animation.svg` | Product Animation card + modal | 1200×750 | A real still from the project |
| `assets/projects/cinematic-title-sequence.svg` | Title Sequence card + modal | 1200×750 | A real still from the project |
| `assets/projects/cinematic-title-sequence-wide.svg` | Featured project block | 1600×900 | A wide crop of the same project |
| `assets/projects/explainer-animation.svg` | Explainer Animation card + modal | 1200×750 | A real still from the project |
| `assets/projects/animated-short-film.svg` | Short Film card + modal | 1200×750 | A real still from the project |
| `assets/process/concept.svg` | Stage 01 — Concept | 900×675 | A real moodboard / reference image |
| `assets/process/storyboard.svg` | Stage 02 — Storyboard | 900×675 | A real storyboard sheet |
| `assets/process/animation.svg` | Stage 03 — Animation | 900×675 | A real in-progress / rig screenshot |
| `assets/process/final.svg` | Stage 04 — Final Render | 900×675 | A real final graded frame |
| `assets/services/character.svg` | Character Animation service card | 400×260 | A real service visual |
| `assets/services/motion.svg` | Motion Graphics service card | 400×260 | A real service visual |
| `assets/services/product.svg` | 3D & Product Animation service card | 400×260 | A real service visual |
| `assets/services/editing.svg` | Video Editing service card | 400×260 | A real service visual |

### Not yet in the repo (add when available)

| Path | Purpose | How to enable |
|---|---|---|
| `assets/video/showreel.mp4` / `.webm` | The actual showreel | Set `SHOWREEL_SRC` in `js/script.js` |

A real hero/about photo can simply overwrite `assets/images/hero-artwork.svg` and
`assets/images/about-artwork.svg`, or be added as a `.jpg`/`.webp` next to them with
the `<img src>` in `index.html` repointed.

Each artwork folder also carries a short `.README.txt` next to the files, naming
exactly what to drop in and at what size.

### Real files already in the repo

- `assets/og-image.svg` — 1200×630 social sharing preview
- `favicon.svg` — KS monogram favicon

### Behaviour when an image is missing

Any `<img>` that carries a `data-placeholder` attribute falls back to a branded SVG if the file 404s, so nothing ever renders as a broken icon. The temporary artwork above means that fallback is currently unused.

### Still placeholder (text, not assets)

- **Contact email** — `contact@keshavsharma.in`
- **Location** — "To be updated"
- **Social URLs** — point to the platform homepages, not to Keshav's real profiles
- **Availability** — set `AVAILABILITY.status` in `js/script.js`; the default says the status is unconfirmed rather than claiming availability

Project titles, descriptions, tools and process notes live in the `PROJECTS` object in `js/script.js` (used by both the cards' modal and the featured block).

## Deployment

### GitHub Pages
1. Push code to GitHub repository
2. Go to Settings > Pages
3. Source: Deploy from a branch
4. Branch: `main` / `master`, folder: `/ (root)`
5. Save and wait for deployment

### Cloudflare Pages
1. Connect your GitHub repository to [Cloudflare Pages](https://pages.cloudflare.com/)
2. Build settings: Leave empty (no build command needed)
3. Build output directory: `/`
4. Deploy

### Netlify
1. Connect repository to [Netlify](https://www.netlify.com/)
2. Build command: Leave empty
3. Publish directory: `/`
4. Deploy

### Custom Domain (keshavsharma.in)
1. Add your domain in your hosting provider's settings
2. Update DNS records as instructed
3. Update canonical URL in `index.html` if needed (already set)
4. Update `robots.txt` and `sitemap.xml` with your domain

## Customization

### Colors
Edit CSS variables in `css/style.css`:
```css
:root {
    --bg: #08070d;
    --surface: #110d19;
    --accent: #8b5cf6;
    --accent-bright: #a970ff;
    --accent-text: #a970ff;   /* accent used as small text — kept AA-legible */
    /* ... other tokens */
}
```
The light theme overrides the same variable names under `[data-theme="light"]`.

### Typography
Fonts are loaded from Google Fonts (Inter, Manrope, Space Grotesk). To change:
1. Update font imports in `index.html`
2. Update font-family in `css/style.css`

### Animations
- Scroll animations use IntersectionObserver in `js/script.js`
- CSS animations in `css/style.css`
- Disable/reduce with `prefers-reduced-motion` (already implemented)

## Browser Support
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Performance Tips
- Optimize images before uploading (use WebP when possible)
- Keep image sizes reasonable
- The site uses lazy loading for below-fold images
- CSS and JS are minimal and efficient

## Notes & Limitations
- **No Backend**: This is a static site. Form requires external service for email delivery
- **Temporary artwork**: Every image on the site is placeholder artwork, not real work. See the [Asset Manifest](#asset-manifest)
- **Placeholders**: Social links, email and location are still placeholder values - replace with real data
- **No Analytics**: Add your own analytics if needed (Google Analytics, Plausible, etc.)

## License
This project is created for Keshav Sharma. All rights reserved.

## Support
For questions or issues, please contact through the website form once configured.

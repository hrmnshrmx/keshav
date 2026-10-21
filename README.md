# Keshav Sharma - Animation Designer Portfolio

A premium, cinematic, dark-themed single-page portfolio website for Keshav Sharma, an Animation Designer. Built with vanilla HTML5, CSS3, and JavaScript. Optimized for deployment on GitHub Pages, Cloudflare Pages, Netlify, or any static hosting provider.

## Live Site
[https://keshavsharma.in/](https://keshavsharma.in/)

## Features

- **Premium Design**: Dark-first theme with purple accents, editorial typography, and a cohesive design-token system
- **Typography**: Space Grotesk (headings) + Inter (body/UI), fluid `clamp()` sizing throughout
- **Responsive**: Tested with no horizontal overflow at 320, 360, 375, 390, 430, 768, 1024, 1280 and 1440px
- **Selected Work Feature**: Asymmetric featured-project block above the gallery
- **Project Filters**: All Work / Animation / Motion Graphics / Product 3D / Editing (no reload)
- **Project Details Modal**: Accessible overlay with focus trap, Escape/backdrop close, scroll lock, focus restore
- **Smooth Animations**: Hero entrance stagger, IntersectionObserver scroll reveals, refined hover states
- **Theme Toggle**: Genuine dark/light themes, persisted in localStorage, no flash on load. Dark is the default
- **Contact Form**: Client-side validation, honeypot spam trap, honest status states, configurable endpoint
- **Accessibility**: Semantic HTML, ARIA labels, keyboard navigation, visible focus, reduced-motion support
- **SEO**: Meta tags, Open Graph, Twitter Cards, canonical URL, robots.txt, sitemap.xml
- **Performance**: Lazy-loaded below-fold images, explicit dimensions, passive listeners, CSS transforms

## Fonts

- **Headings / display**: `Space Grotesk` — weights 500, 600, 700
- **Body / UI**: `Inter` — weights 400, 500, 600
- Loaded from Google Fonts with `display=swap` and sensible system fallbacks.

## File Structure

```
/
├── index.html          # Main HTML file with all sections
├── css/
│   └── style.css       # All styles and responsive design
├── js/
│   └── script.js       # Interactive functionality
├── assets/
│   ├── images/         # Images (portraits, backgrounds)
│   ├── icons/          # Icons (if needed)
│   └── projects/       # Project thumbnails
├── favicon.svg         # Site favicon
├── robots.txt          # SEO robots file
├── sitemap.xml         # SEO sitemap
└── README.md           # This file
```

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
Replace `assets/images/keshav-portrait-hero.jpg` with Keshav's actual portrait.
- **Recommended size**: 800x1000px or similar aspect ratio (3:4)
- **Format**: JPG or WebP
- **Location**: `assets/images/keshav-portrait-hero.jpg`
- **Alt text**: Already set to "Keshav Sharma - Animation Designer"

### 2. About Section Portrait
Replace `assets/images/keshav-portrait-about.jpg` with another photo of Keshav working.
- **Recommended size**: 500x625px or 4:5 ratio
- **Location**: `assets/images/keshav-portrait-about.jpg`

### 3. Project Thumbnails
Replace the placeholder images in `assets/projects/`:
- `character-animation.jpg`
- `anime-edit.jpg`
- `product-animation.jpg`
- `title-sequence.jpg`
- `explainer-animation.jpg`
- `short-film.jpg`

**Recommended specs:**
- **Size**: 600x375px or 16:10 ratio
- **Format**: JPG or WebP
- **Keep the filenames** or update paths in `index.html`

### 4. Update Project Information
Edit the project cards in `index.html` (around line ~200-320):
```html
<article class="creation-card">
    <div class="creation-card__image-container">
        <img src="assets/projects/your-project.jpg" alt="Your Project Name">
    </div>
    <div class="creation-card__content">
        <h3 class="creation-card__title">Your Project Title</h3>
        <p class="creation-card__description">Your project description.</p>
        <div class="creation-card__tags">
            <span class="creation-card__tag">Tool 1</span>
            <span class="creation-card__tag">Tool 2</span>
        </div>
    </div>
</article>
```

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

### 9. Add Real Project Videos (optional)
The details modal includes a native `<video>` element (`#modalVideo`) that stays hidden until a project has a real video file. Add a `video:` path to a project entry in the `PROJECTS` object in `js/script.js` and wire it into `openModal()`. No fake video URLs are included.

### Important: Replaceable Placeholders
The portrait and every project thumbnail reference files that do **not exist yet** in this repo. Until you add them, the site automatically swaps in a branded SVG placeholder (so nothing looks broken). Expected files:

- `assets/images/keshav-portrait-hero.jpg`
- `assets/images/keshav-portrait-about.jpg`
- `assets/projects/character-animation.jpg`
- `assets/projects/anime-edit.jpg`
- `assets/projects/product-animation.jpg`
- `assets/projects/title-sequence.jpg`
- `assets/projects/explainer-animation.jpg`
- `assets/projects/short-film.jpg`

Project titles, descriptions and tools live in the `PROJECTS` object in `js/script.js` (used by both the cards' modal and the featured block).

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
    --bg-primary: #08070D;
    --primary-purple: #8B5CF6;
    --bright-accent: #A970FF;
    /* ... other colors */
}
```

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
- **Placeholders**: Some content uses placeholders (social links, email, location) - replace with real data
- **Images**: Portrait and project images need to be replaced with actual work
- **No Analytics**: Add your own analytics if needed (Google Analytics, Plausible, etc.)

## License
This project is created for Keshav Sharma. All rights reserved.

## Support
For questions or issues, please contact through the website form once configured.

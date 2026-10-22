/* ==========================================================================
   Artwork generator — Keshav Sharma portfolio
   Produces rich, category-specific SVG artwork so the site is visually
   complete before real assets exist. Each piece is intentionally different:
   no repeated triangle motif.

   These are TEMPORARY stand-ins. They are clearly labelled in the UI and
   documented in README.md. Replace the referenced .jpg/.mp4 files with real
   work and the site picks them up automatically.

   Run:  node tools/generate-artwork.js
   ========================================================================== */
const fs = require('fs');
const path = require('path');

const OUT = path.join(__dirname, '..', 'assets');

function write(rel, svg) {
  const full = path.join(OUT, rel);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, svg.trim() + '\n', 'utf8');
  const kb = (Buffer.byteLength(svg) / 1024).toFixed(1);
  console.log(`  ${rel.padEnd(42)} ${kb.padStart(6)} KB`);
}

/* Shared defs/filters ------------------------------------------------ */
const defs = () => `
  <defs>
    <filter id="soft" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="34"/>
    </filter>
    <filter id="soft2" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="14"/>
    </filter>
    <filter id="grain" x="0" y="0" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" stitchTiles="stitch" result="n"/>
      <feColorMatrix in="n" type="saturate" values="0" result="g"/>
      <feComponentTransfer in="g" result="faint">
        <feFuncA type="linear" slope="0.32" intercept="0"/>
      </feComponentTransfer>
    </filter>
    <linearGradient id="vig" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#05040a" stop-opacity="0.55"/>
      <stop offset="45%" stop-color="#05040a" stop-opacity="0"/>
      <stop offset="100%" stop-color="#05040a" stop-opacity="0.85"/>
    </linearGradient>
  </defs>`;

const ground = (w, h, c1 = '#1a1226') =>
  `<rect width="${w}" height="${h}" fill="${c1}"/>
   <rect width="${w}" height="${h}" fill="url(#vig)"/>`;

/* Fine grid / scanline texture common to "editorial" pieces */
function grid(w, h, step = 40, op = 0.05) {
  let d = '';
  for (let x = step; x < w; x += step) d += `M${x} 0V${h}`;
  for (let y = step; y < h; y += step) d += `M0 ${y}H${w}`;
  return `<path d="${d}" stroke="#cbb6ff" stroke-opacity="${op}" stroke-width="1" fill="none"/>`;
}

/* Subtle film-grain veil. NOTE: the filter must not blend the (opaque)
   SourceGraphic back in — that washes the whole artwork out to white.
   The filter output is faint monochrome noise applied over the art. */
function grain(w, h) {
  return `<rect width="${w}" height="${h}" filter="url(#grain)" fill="#808080" style="mix-blend-mode:soft-light" opacity="0.45"/>`;
}

/* Small helper: labelled corner tag (kept subtle) */
function cornerTag(text) {
  return `<g transform="translate(40,46)">
    <rect width="${text.length * 11 + 34}" height="34" rx="17" fill="#000" fill-opacity="0.42" stroke="#8b5cf6" stroke-opacity="0.55"/>
    <text x="17" y="23" fill="#d6c5ff" font-family="Inter, Segoe UI, Arial, sans-serif"
      font-size="15" font-weight="600" letter-spacing="1.6">${text}</text>
  </g>`;
}

/* ====================================================================
   1. HERO PORTRAIT (portrait orientation, 900 x 1200)
   A designed character-art vignette — silhouette + rim light + halftone
   ==================================================================== */
function heroPortrait() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 1200" width="900" height="1200" role="img" aria-label="Temporary character artwork standing in for a portrait of Keshav Sharma">
  ${defs()}
  <defs>
    <radialGradient id="hpGlow" cx="62%" cy="30%" r="70%">
      <stop offset="0%" stop-color="#a970ff" stop-opacity="0.75"/>
      <stop offset="55%" stop-color="#6d28d9" stop-opacity="0.28"/>
      <stop offset="100%" stop-color="#0b0714" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="hpRim" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#e9dcff"/>
      <stop offset="40%" stop-color="#a970ff"/>
      <stop offset="100%" stop-color="#6d28d9"/>
    </linearGradient>
    <linearGradient id="hpBody" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#2a1c3f"/>
      <stop offset="100%" stop-color="#120d1e"/>
    </linearGradient>
    <clipPath id="hpClip"><rect width="900" height="1200"/></clipPath>
  </defs>

  <g clip-path="url(#hpClip)">
    ${ground(900, 1200)}
    <rect width="900" height="1200" fill="url(#hpGlow)"/>

    <!-- backlight arcs (motion trails) -->
    <g fill="none" stroke="url(#hpRim)" stroke-linecap="round" opacity="0.5">
      <path d="M120 980 C 90 640, 250 300, 620 210" stroke-width="2" stroke-dasharray="6 12"/>
      <path d="M170 1010 C 150 700, 300 380, 660 290" stroke-width="1.4" stroke-opacity="0.6"/>
    </g>

    <!-- head -->
    <g>
      <ellipse cx="452" cy="392" rx="132" ry="156" fill="url(#hpBody)"/>
      <path d="M452 236 c-74 0-132 62-132 156 0 40 8 76 22 106 -34-30-56-76-56-132 0-96 74-166 166-166z" fill="#3b2a58"/>
      <ellipse cx="452" cy="392" rx="132" ry="156" fill="none" stroke="url(#hpRim)" stroke-opacity="0.55" stroke-width="2"/>
    </g>

    <!-- shoulders / body -->
    <g>
      <path d="M452 560 c-150 0-286 96-320 226 -10 40-16 96-18 160 h676 c-2-64-8-120-18-160 -34-130-170-226-320-226z" fill="url(#hpBody)"/>
      <path d="M452 560 c-150 0-286 96-320 226" fill="none" stroke="#a970ff" stroke-opacity="0.35" stroke-width="2"/>
      <path d="M452 560 c150 0 286 96 320 226" fill="none" stroke="#a970ff" stroke-opacity="0.35" stroke-width="2"/>
      <!-- collar accent -->
      <path d="M392 566 L452 660 L512 566" fill="none" stroke="#d6c5ff" stroke-opacity="0.6" stroke-width="3" stroke-linejoin="round"/>
    </g>

    <!-- rim light down the right edge -->
    <path d="M584 300 c40 40 62 96 62 160 0 66-24 124-66 164" fill="none" stroke="url(#hpRim)" stroke-width="5" stroke-linecap="round" opacity="0.9"/>

    <!-- floating frame markers (editorial / motion language) -->
    <g stroke="#a970ff" stroke-opacity="0.7" fill="none" stroke-width="2">
      <path d="M96 150 h44 M96 150 v44"/>
      <path d="M804 150 h-44 M804 150 v44"/>
      <path d="M96 1050 h44 M96 1050 v-44"/>
      <path d="M804 1050 h-44 M804 1050 v-44"/>
    </g>
    <circle cx="118" cy="1068" r="4" fill="#a970ff"/>
    <text x="138" y="1074" fill="#b7aec8" font-family="Inter, Segoe UI, Arial, sans-serif"
      font-size="17" letter-spacing="3">FRAME 001</text>

    ${grain(900, 1200)}
  </g>

  <!-- explicit temporary-asset caption -->
  <g transform="translate(40,1120)">
    <rect width="470" height="42" rx="21" fill="#000" fill-opacity="0.5" stroke="#8b5cf6" stroke-opacity="0.6"/>
    <text x="22" y="27" fill="#d6c5ff" font-family="Inter, Segoe UI, Arial, sans-serif"
      font-size="15" font-weight="600" letter-spacing="1.4">TEMPORARY ARTWORK &#8212; REPLACE PORTRAIT</text>
  </g>
</svg>`;
}

/* ====================================================================
   2. SHOWREEL COLLAGE (16:9, 1600 x 900)
   A montage of the four service disciplines
   ==================================================================== */
function showreelCollage() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900" width="1600" height="900" role="img" aria-label="Temporary animation artwork collage standing in for the showreel preview">
  ${defs()}
  <defs>
    <linearGradient id="srSky" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#160f24"/>
      <stop offset="50%" stop-color="#241540"/>
      <stop offset="100%" stop-color="#0c0817"/>
    </linearGradient>
    <linearGradient id="srP1" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#a970ff"/><stop offset="100%" stop-color="#5b21b6"/>
    </linearGradient>
    <linearGradient id="srP2" x1="0" y1="1" x2="1" y2="0">
      <stop offset="0%" stop-color="#7c3aed"/><stop offset="100%" stop-color="#e879f9"/>
    </linearGradient>
    <linearGradient id="srP3" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#38bdf8"/><stop offset="100%" stop-color="#8b5cf6"/>
    </linearGradient>
    <linearGradient id="srP4" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#f59e0b"/><stop offset="100%" stop-color="#a970ff"/>
    </linearGradient>
    <clipPath id="srClip"><rect width="1600" height="900" rx="0"/></clipPath>
  </defs>
  <g clip-path="url(#srClip)">
    <rect width="1600" height="900" fill="url(#srSky)"/>
    <ellipse cx="1180" cy="180" rx="520" ry="360" fill="#7c3aed" opacity="0.28" filter="url(#soft)"/>
    <ellipse cx="330" cy="760" rx="420" ry="300" fill="#38bdf8" opacity="0.16" filter="url(#soft)"/>
    ${grid(1600, 900, 80, 0.045)}

    <!-- panel A : character animation (keyframed figure) -->
    <g transform="translate(70,90)">
      <rect width="380" height="300" rx="18" fill="#0e0a18" stroke="#8b5cf6" stroke-opacity="0.5"/>
      <path d="M120 240 v-70 M190 240 v-70" stroke="url(#srP1)" stroke-width="9" stroke-linecap="round"/>
      <circle cx="155" cy="120" r="30" fill="url(#srP1)"/>
      <path d="M155 150 v60 M125 175 l30 20 30-20" stroke="#e9dcff" stroke-width="7" fill="none" stroke-linecap="round"/>
      <g fill="#a970ff" opacity="0.5">
        <circle cx="286" cy="70" r="3"/><circle cx="306" cy="70" r="3"/><circle cx="326" cy="70" r="3"/>
        <circle cx="286" cy="90" r="3"/><circle cx="306" cy="90" r="3"/>
      </g>
      <text x="24" y="278" fill="#c9bbdd" font-family="Inter, Arial, sans-serif" font-size="17" letter-spacing="2">CHARACTER</text>
    </g>

    <!-- panel B : motion graphics (kinetic type + shards) -->
    <g transform="translate(500,60)">
      <rect width="600" height="360" rx="18" fill="#120b1f" stroke="#8b5cf6" stroke-opacity="0.5"/>
      <g transform="translate(70,120)">
        <rect width="300" height="16" rx="8" fill="url(#srP2)"/>
        <rect y="40" width="220" height="16" rx="8" fill="#e9dcff" opacity="0.75"/>
        <rect y="80" width="260" height="16" rx="8" fill="url(#srP1)" opacity="0.8"/>
        <rect y="120" width="140" height="16" rx="8" fill="#e9dcff" opacity="0.4"/>
      </g>
      <g fill="none" stroke="url(#srP2)" stroke-width="3" opacity="0.85">
        <path d="M430 70 l90 60 -90 60z" fill="#a970ff" fill-opacity="0.18"/>
        <path d="M470 250 l60 40 -60 40z" fill="#e879f9" fill-opacity="0.15"/>
      </g>
      <text x="24" y="338" fill="#c9bbdd" font-family="Inter, Arial, sans-serif" font-size="17" letter-spacing="2">MOTION GRAPHICS</text>
    </g>

    <!-- panel C : 3D / product (wireframe object) -->
    <g transform="translate(1140,90)">
      <rect width="390" height="300" rx="18" fill="#0b1018" stroke="#38bdf8" stroke-opacity="0.45"/>
      <g transform="translate(195,140)" fill="none" stroke="url(#srP3)" stroke-width="2.2">
        <path d="M0 -80 L86 -36 L86 52 L0 96 L-86 52 L-86 -36z"/>
        <path d="M0 -80 L0 8 L86 52 M0 8 L-86 52 M0 8 L0 96"/>
      </g>
      <circle cx="195" cy="140" r="104" fill="none" stroke="#38bdf8" stroke-opacity="0.25" stroke-dasharray="4 10"/>
      <text x="24" y="278" fill="#c9bbdd" font-family="Inter, Arial, sans-serif" font-size="17" letter-spacing="2">3D / PRODUCT</text>
    </g>

    <!-- panel D : editing / compositing (timeline) -->
    <g transform="translate(70,430)">
      <rect width="1030" height="360" rx="18" fill="#140d18" stroke="#f59e0b" stroke-opacity="0.4"/>
      <g transform="translate(50,70)">
        <g fill="url(#srP4)" opacity="0.9">
          <rect width="180" height="34" rx="8"/>
          <rect x="200" width="240" height="34" rx="8" fill="#a970ff"/>
          <rect x="460" width="130" height="34" rx="8" fill="#e879f9"/>
          <rect x="610" width="300" height="34" rx="8" fill="#38bdf8"/>
        </g>
        <g fill="#e9dcff" opacity="0.32">
          <rect y="56" width="300" height="26" rx="7"/>
          <rect x="320" y="56" width="420" height="26" rx="7"/>
          <rect x="760" y="56" width="180" height="26" rx="7"/>
        </g>
        <g fill="#a970ff" opacity="0.5">
          <rect y="102" width="500" height="20" rx="6"/>
          <rect x="520" y="102" width="420" height="20" rx="6"/>
        </g>
        <path d="M0 150 H930" stroke="#8b5cf6" stroke-opacity="0.35" stroke-width="2"/>
        <!-- playhead -->
        <path d="M470 20 V170" stroke="#fff" stroke-opacity="0.85" stroke-width="3"/>
        <path d="M462 12 h16 l-8 16z" fill="#fff"/>
      </g>
      <text x="24" y="338" fill="#c9bbdd" font-family="Inter, Arial, sans-serif" font-size="17" letter-spacing="2">EDITING / COMPOSITING</text>
    </g>

    <!-- right column : title card -->
    <g transform="translate(1140,430)">
      <rect width="390" height="360" rx="18" fill="#0e0a18" stroke="#a970ff" stroke-opacity="0.55"/>
      <text x="34" y="120" fill="#f7f4fc" font-family="'Space Grotesk', Inter, Arial, sans-serif" font-size="58" font-weight="700" letter-spacing="-2">Keshav</text>
      <text x="34" y="184" fill="#a970ff" font-family="'Space Grotesk', Inter, Arial, sans-serif" font-size="58" font-weight="700" letter-spacing="-2">Sharma</text>
      <rect x="34" y="214" width="150" height="4" rx="2" fill="url(#srP1)"/>
      <text x="34" y="262" fill="#b7aec8" font-family="Inter, Arial, sans-serif" font-size="16" letter-spacing="4">ANIMATION DESIGNER</text>
      <text x="34" y="308" fill="#81788f" font-family="Inter, Arial, sans-serif" font-size="15">Reel 01 &#183; duration to be set</text>
    </g>

    ${grain(1600, 900)}
  </g>

  <g transform="translate(70,830)">
    <rect width="560" height="42" rx="21" fill="#000" fill-opacity="0.55" stroke="#8b5cf6" stroke-opacity="0.65"/>
    <text x="22" y="27" fill="#d6c5ff" font-family="Inter, Arial, sans-serif" font-size="15" font-weight="600" letter-spacing="1.4">TEMPORARY PREVIEW ARTWORK &#8212; NO VIDEO FILE YET</text>
  </g>
</svg>`;
}

/* ====================================================================
   3. PROJECT ARTWORK — one bespoke composition per project
   ==================================================================== */
const projectArt = {
  'character-animation': () => `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 750" width="1200" height="750" role="img" aria-label="Temporary character animation artwork">
  ${defs()}
  <defs>
    <linearGradient id="caBg" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#1b1030"/><stop offset="100%" stop-color="#0a0714"/></linearGradient>
    <linearGradient id="caFig" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#c4a6ff"/><stop offset="100%" stop-color="#7c3aed"/></linearGradient>
  </defs>
  ${ground(1200, 750, '#160e28')}
  <rect width="1200" height="750" fill="url(#caBg)" opacity="0.85"/>
  ${grid(1200, 750, 60, 0.05)}
  <ellipse cx="980" cy="140" rx="360" ry="240" fill="#a970ff" opacity="0.2" filter="url(#soft)"/>

  <!-- ground line + shadow -->
  <ellipse cx="520" cy="682" rx="230" ry="30" fill="#000" opacity="0.45"/>
  <path d="M120 686 H1080" stroke="#8b5cf6" stroke-opacity="0.4" stroke-width="2"/>

  <!-- key poses: breakdown / inbetween study -->
  <g opacity="0.32" fill="url(#caFig)">
    <g transform="translate(190,300) scale(0.8)">
      <circle cx="60" cy="60" r="46"/><path d="M60 106 v110 M20 160 l40 30 40-30 M60 216 l-40 90 M60 216 l40 90" stroke="url(#caFig)" stroke-width="20" fill="none" stroke-linecap="round"/>
    </g>
    <g transform="translate(920,290) scale(0.86)">
      <circle cx="60" cy="60" r="46"/><path d="M60 106 v110 M20 160 l40 30 40-30 M60 216 l-40 90 M60 216 l40 90" stroke="url(#caFig)" stroke-width="20" fill="none" stroke-linecap="round"/>
    </g>
  </g>

  <!-- hero pose -->
  <g transform="translate(520,230)">
    <circle cx="80" cy="78" r="60" fill="url(#caFig)"/>
    <circle cx="80" cy="78" r="60" fill="none" stroke="#e9dcff" stroke-opacity="0.7" stroke-width="2"/>
    <path d="M80 138 v150" stroke="url(#caFig)" stroke-width="30" stroke-linecap="round"/>
    <path d="M80 190 l-84 54 M80 190 l92 -30" stroke="url(#caFig)" stroke-width="26" stroke-linecap="round" fill="none"/>
    <path d="M80 288 l-58 118 M80 288 l72 106" stroke="url(#caFig)" stroke-width="28" stroke-linecap="round" fill="none"/>
  </g>

  <!-- motion arcs -->
  <g fill="none" stroke="#e879f9" stroke-opacity="0.55" stroke-width="2.5" stroke-linecap="round">
    <path d="M120 300 C 240 180, 380 180, 470 250" stroke-dasharray="8 12"/>
    <path d="M700 250 C 820 190, 960 210, 1050 300" stroke-dasharray="8 12"/>
  </g>
  ${cornerTag('CHARACTER')}
  ${grain(1200, 750)}
</svg>`,

  'anime-edit': () => `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 750" width="1200" height="750" role="img" aria-label="Temporary editing and motion artwork">
  ${defs()}
  <defs>
    <linearGradient id="aeSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#2a1046"/><stop offset="60%" stop-color="#7c3aed"/><stop offset="100%" stop-color="#f472b6"/></linearGradient>
  </defs>
  ${ground(1200, 750, '#140c22')}
  <rect width="1200" height="750" fill="url(#aeSky)" opacity="0.55"/>
  <!-- speed lines -->
  <g stroke="#fff" stroke-opacity="0.35" stroke-width="3" stroke-linecap="round">
    ${Array.from({ length: 26 }, (_, i) => {
      const y = 40 + i * 27; const len = 90 + (i % 5) * 80;
      return `<path d="M${40 + (i % 4) * 30} ${y} h${len}"/>`;
    }).join('')}
  </g>
  <g stroke="#e9dcff" stroke-opacity="0.22" stroke-width="2">
    ${Array.from({ length: 18 }, (_, i) => {
      const y = 60 + i * 38;
      return `<path d="M${1120 - (i % 3) * 26} ${y} h-${120 + (i % 4) * 70}"/>`;
    }).join('')}
  </g>

  <!-- focal silhouette (back to camera, wind) -->
  <g transform="translate(760,180)">
    <ellipse cx="120" cy="500" rx="200" ry="26" fill="#000" opacity="0.4"/>
    <path d="M120 60 c-58 0-96 46-96 112 0 46 20 82 44 104 l-14 74 c-56 34-92 96-100 180 h332 c-8-84-44-146-100-180 l-14-74 c24-22 44-58 44-104 0-66-38-112-96-112z" fill="#100a1c"/>
    <path d="M40 100 c-30 40-34 96-12 140 -30-10-52-46-52-90 0-58 40-104 92-112z" fill="#2a1a44"/>
    <path d="M62 96 c-40 34-52 96-30 148" fill="none" stroke="#e879f9" stroke-opacity="0.75" stroke-width="3" stroke-linecap="round"/>
    <path d="M178 96 c40 34 52 96 30 148" fill="none" stroke="#f472b6" stroke-opacity="0.75" stroke-width="3" stroke-linecap="round"/>
  </g>

  <!-- collage strips -->
  <g opacity="0.9">
    <rect x="60" y="540" width="220" height="140" rx="10" fill="#0d0916" stroke="#a970ff" stroke-opacity="0.6"/>
    <rect x="300" y="580" width="180" height="100" rx="10" fill="#0d0916" stroke="#e879f9" stroke-opacity="0.5"/>
    <rect x="60" y="70" width="180" height="110" rx="10" fill="#0d0916" stroke="#8b5cf6" stroke-opacity="0.5"/>
  </g>
  ${cornerTag('EDIT')}
  ${grain(1200, 750)}
</svg>`,

  'product-animation': () => `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 750" width="1200" height="750" role="img" aria-label="Temporary 3D product animation artwork">
  ${defs()}
  <defs>
    <linearGradient id="paKey" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#6d28d9"/><stop offset="100%" stop-color="#0b0714"/></linearGradient>
    <linearGradient id="paBody" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#8b5cf6"/><stop offset="100%" stop-color="#3b1d6b"/></linearGradient>
    <linearGradient id="paBody2" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#e9dcff"/><stop offset="100%" stop-color="#7c3aed"/></linearGradient>
    <radialGradient id="paFloor" cx="50%" cy="50%" r="60%"><stop offset="0%" stop-color="#a970ff" stop-opacity="0.5"/><stop offset="100%" stop-color="#a970ff" stop-opacity="0"/></radialGradient>
  </defs>
  <rect width="1200" height="750" fill="url(#paKey)"/>
  <ellipse cx="600" cy="560" rx="420" ry="150" fill="url(#paFloor)"/>
  ${grid(1200, 750, 75, 0.06)}

  <!-- studio light cones -->
  <g opacity="0.3">
    <path d="M200 0 L360 470 L40 470z" fill="#a970ff" filter="url(#soft2)"/>
    <path d="M1000 0 L1160 470 L840 470z" fill="#38bdf8" filter="url(#soft2)"/>
  </g>

  <!-- isometric product object -->
  <g transform="translate(600,340)">
    <g stroke="#e9dcff" stroke-opacity="0.5" stroke-width="2" fill="none">
      <path d="M0 -170 L150 -85 L150 85 L0 170 L-150 85 L-150 -85z"/>
    </g>
    <path d="M0 -170 L150 -85 L0 0 L-150 -85z" fill="url(#paBody2)" opacity="0.95"/>
    <path d="M-150 -85 L0 0 L0 170 L-150 85z" fill="url(#paBody)" opacity="0.9"/>
    <path d="M150 -85 L0 0 L0 170 L150 85z" fill="#4c1d95" opacity="0.95"/>
    <path d="M0 0 L0 170" stroke="#e9dcff" stroke-opacity="0.35" stroke-width="2"/>
    <circle cx="0" cy="0" r="14" fill="#e9dcff" opacity="0.9"/>
  </g>

  <!-- orbit rings -->
  <g fill="none" stroke="#a970ff" stroke-opacity="0.45">
    <ellipse cx="600" cy="360" rx="360" ry="120" stroke-dasharray="5 14" stroke-width="2"/>
    <ellipse cx="600" cy="360" rx="430" ry="150" stroke-opacity="0.22" stroke-width="1.5"/>
  </g>
  <g fill="#e879f9"><circle cx="960" cy="360" r="6"/><circle cx="240" cy="360" r="5" opacity="0.7"/></g>
  ${cornerTag('3D / PRODUCT')}
  ${grain(1200, 750)}
</svg>`,

  'cinematic-title-sequence': () => `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 750" width="1200" height="750" role="img" aria-label="Temporary cinematic title sequence artwork">
  ${defs()}
  <defs>
    <linearGradient id="tsBg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#0a0714"/><stop offset="100%" stop-color="#1d1030"/></linearGradient>
    <linearGradient id="tsText" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="#a970ff"/><stop offset="100%" stop-color="#e9dcff"/></linearGradient>
  </defs>
  <rect width="1200" height="750" fill="url(#tsBg)"/>
  <ellipse cx="600" cy="300" rx="520" ry="300" fill="#7c3aed" opacity="0.22" filter="url(#soft)"/>

  <!-- letterbox bars -->
  <rect width="1200" height="86" fill="#04030a"/>
  <rect y="664" width="1200" height="86" fill="#04030a"/>

  <!-- title lockup -->
  <g transform="translate(600,375)" text-anchor="middle">
    <text y="-30" fill="url(#tsText)" font-family="'Space Grotesk', Inter, Arial, sans-serif" font-size="112" font-weight="700" letter-spacing="10">TITLE</text>
    <text y="80" fill="#f7f4fc" font-family="'Space Grotesk', Inter, Arial, sans-serif" font-size="64" font-weight="500" letter-spacing="26" opacity="0.9">SEQUENCE</text>
    <rect x="-190" y="118" width="380" height="3" fill="#a970ff" opacity="0.8"/>
  </g>

  <!-- light streaks -->
  <g stroke="#a970ff" stroke-linecap="round" opacity="0.5">
    <path d="M60 150 H420" stroke-width="2"/>
    <path d="M780 600 H1140" stroke-width="2"/>
    <path d="M100 620 H320" stroke-width="1.4" stroke-opacity="0.6"/>
  </g>
  <!-- focus brackets -->
  <g stroke="#e9dcff" stroke-opacity="0.5" fill="none" stroke-width="2">
    <path d="M90 120 h50 M90 120 v50"/><path d="M1110 120 h-50 M1110 120 v50"/>
    <path d="M90 630 h50 M90 630 v-50"/><path d="M1110 630 h-50 M1110 630 v-50"/>
  </g>
  <text x="600" y="716" fill="#81788f" font-family="Inter, Arial, sans-serif" font-size="16" letter-spacing="6" text-anchor="middle">SCENE 01 &#183; TITLE CARD</text>
  ${grain(1200, 750)}
</svg>`,

  'explainer-animation': () => `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 750" width="1200" height="750" role="img" aria-label="Temporary explainer and motion graphics artwork">
  ${defs()}
  <defs>
    <linearGradient id="exBg" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#f4f0ff"/><stop offset="100%" stop-color="#ddd2f7"/></linearGradient>
  </defs>
  <rect width="1200" height="750" fill="url(#exBg)"/>
  ${grid(1200, 750, 60, 0.07)}

  <!-- flow diagram -->
  <g fill="none" stroke="#6d28d9" stroke-width="3" stroke-linecap="round" opacity="0.75">
    <path d="M300 300 H420" stroke-dasharray="10 10"/>
    <path d="M640 300 H760" stroke-dasharray="10 10"/>
  </g>
  <g>
    <rect x="120" y="220" width="180" height="160" rx="20" fill="#fff" stroke="#7c3aed" stroke-width="3"/>
    <circle cx="210" cy="285" r="26" fill="none" stroke="#7c3aed" stroke-width="4"/>
    <path d="M160 340 h100" stroke="#a970ff" stroke-width="8" stroke-linecap="round"/>

    <rect x="420" y="180" width="220" height="240" rx="20" fill="#7c3aed"/>
    <path d="M480 250 h100 M480 285 h100 M480 320 h60" stroke="#f4f0ff" stroke-width="10" stroke-linecap="round"/>
    <circle cx="600" cy="360" r="14" fill="#e879f9"/>

    <rect x="760" y="220" width="180" height="160" rx="20" fill="#fff" stroke="#7c3aed" stroke-width="3"/>
    <path d="M800 300 l34 30 66-70" fill="none" stroke="#10b981" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/>
  </g>

  <!-- numeral markers -->
  <g font-family="'Space Grotesk', Inter, Arial, sans-serif" font-size="26" font-weight="700" fill="#6d28d9">
    <text x="140" y="200">01</text><text x="440" y="160">02</text><text x="780" y="200">03</text>
  </g>

  <!-- caption strip -->
  <rect x="120" y="470" width="820" height="120" rx="18" fill="#fff" opacity="0.85" stroke="#7c3aed" stroke-opacity="0.35"/>
  <path d="M170 510 h360 M170 545 h260" stroke="#a970ff" stroke-width="12" stroke-linecap="round" opacity="0.55"/>
  <circle cx="860" cy="530" r="34" fill="#7c3aed"/>
  <path d="M848 516 l34 14-34 14z" fill="#fff"/>
  ${grain(1200, 750)}
</svg>`,

  'animated-short-film': () => `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 750" width="1200" height="750" role="img" aria-label="Temporary animated short film artwork">
  ${defs()}
  <defs>
    <linearGradient id="sfSky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#0a1030"/><stop offset="45%" stop-color="#4c1d95"/><stop offset="75%" stop-color="#c026d3"/><stop offset="100%" stop-color="#f59e0b"/>
    </linearGradient>
    <radialGradient id="sfSun" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="#fde68a"/><stop offset="100%" stop-color="#f59e0b" stop-opacity="0"/></radialGradient>
  </defs>
  <rect width="1200" height="750" fill="url(#sfSky)"/>
  <circle cx="820" cy="430" r="170" fill="url(#sfSun)" opacity="0.95"/>
  <circle cx="820" cy="430" r="66" fill="#fde68a"/>

  <!-- parallax ridges -->
  <path d="M0 520 L180 440 L320 500 L470 420 L620 490 L790 430 L950 500 L1200 440 V750 H0z" fill="#2a1a4a" opacity="0.85"/>
  <path d="M0 590 L200 520 L400 580 L560 510 L740 578 L920 520 L1120 580 L1200 545 V750 H0z" fill="#170f2c"/>
  <path d="M0 660 L260 610 L520 660 L780 605 L1040 660 L1200 630 V750 H0z" fill="#0a0714"/>

  <!-- distant figure + long shadow -->
  <g transform="translate(360,540)">
    <ellipse cx="0" cy="118" rx="86" ry="14" fill="#000" opacity="0.5"/>
    <path d="M0 -60 c-24 0-40 19-40 46 0 19 8 34 18 43 l-6 31 c-24 14-38 40-42 74 h140 c-4-34-18-60-42-74 l-6-31 c10-9 18-24 18-43 0-27-16-46-40-46z" fill="#05030b"/>
  </g>

  <!-- stars -->
  <g fill="#fff" opacity="0.7">
    ${Array.from({ length: 40 }, (_, i) => {
      const x = (i * 197) % 1200, y = (i * 91) % 300, r = (i % 3) * 0.8 + 1;
      return `<circle cx="${x}" cy="${y}" r="${r}"/>`;
    }).join('')}
  </g>
  <!-- letterbox -->
  <rect width="1200" height="70" fill="#04030a"/>
  <rect y="680" width="1200" height="70" fill="#04030a"/>
  <text x="600" y="724" fill="#81788f" font-family="Inter, Arial, sans-serif" font-size="16" letter-spacing="6" text-anchor="middle">SHORT FILM &#183; SCENE STUDY</text>
  ${grain(1200, 750)}
</svg>`,

  /* wide, cinematic crop for the featured block */
  'cinematic-title-sequence-wide': () => `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900" width="1600" height="900" role="img" aria-label="Temporary cinematic title sequence artwork, wide crop">
  ${defs()}
  <defs>
    <linearGradient id="wBg" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#0a0714"/><stop offset="100%" stop-color="#241040"/></linearGradient>
    <linearGradient id="wText" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="#a970ff"/><stop offset="100%" stop-color="#e9dcff"/></linearGradient>
  </defs>
  <rect width="1600" height="900" fill="url(#wBg)"/>
  <ellipse cx="1080" cy="380" rx="640" ry="380" fill="#7c3aed" opacity="0.28" filter="url(#soft)"/>
  <ellipse cx="300" cy="700" rx="420" ry="260" fill="#38bdf8" opacity="0.12" filter="url(#soft)"/>
  ${grid(1600, 900, 90, 0.04)}

  <!-- sweeping light band -->
  <path d="M-100 640 L1700 180 L1700 300 L-100 760z" fill="#a970ff" opacity="0.12"/>
  <path d="M-100 660 L1700 200" stroke="#e9dcff" stroke-opacity="0.5" stroke-width="2"/>

  <g transform="translate(800,430)" text-anchor="middle">
    <text y="-60" fill="#b7aec8" font-family="Inter, Arial, sans-serif" font-size="22" letter-spacing="12">MOTION GRAPHICS &#183; TITLE DESIGN</text>
    <text y="60" fill="url(#wText)" font-family="'Space Grotesk', Inter, Arial, sans-serif" font-size="150" font-weight="700" letter-spacing="-4">Title Sequence</text>
    <rect x="-260" y="110" width="520" height="4" fill="#a970ff"/>
  </g>

  <g stroke="#e9dcff" stroke-opacity="0.45" fill="none" stroke-width="2">
    <path d="M80 80 h60 M80 80 v60"/><path d="M1520 80 h-60 M1520 80 v60"/>
    <path d="M80 820 h60 M80 820 v-60"/><path d="M1520 820 h-60 M1520 820 v-60"/>
  </g>
  <text x="80" y="864" fill="#81788f" font-family="Inter, Arial, sans-serif" font-size="18" letter-spacing="4">TEMP ARTWORK &#8212; REPLACE WITH REAL STILL</text>
  ${grain(1600, 900)}
</svg>`
};

/* ====================================================================
   4. BEHIND THE FRAMES — four distinct process visuals
   ==================================================================== */
const processArt = {
  concept: () => `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 675" width="900" height="675" role="img" aria-label="Temporary concept and reference moodboard placeholder">
  ${defs()}
  <rect width="900" height="675" fill="#120c1e"/>
  ${grid(900, 675, 45, 0.05)}
  <g>
    <rect x="40" y="40" width="250" height="190" rx="10" fill="#7c3aed" opacity="0.55"/>
    <rect x="310" y="40" width="180" height="190" rx="10" fill="#38bdf8" opacity="0.4"/>
    <rect x="510" y="40" width="350" height="120" rx="10" fill="#e879f9" opacity="0.35"/>
    <rect x="510" y="175" width="160" height="55" rx="10" fill="#f59e0b" opacity="0.4"/>
    <rect x="685" y="175" width="175" height="55" rx="10" fill="#a970ff" opacity="0.5"/>
    <rect x="40" y="250" width="820" height="30" rx="8" fill="#a970ff" opacity="0.22"/>
    <rect x="40" y="300" width="380" height="140" rx="10" fill="#e9dcff" opacity="0.14"/>
    <rect x="440" y="300" width="200" height="140" rx="10" fill="#7c3aed" opacity="0.4"/>
    <rect x="660" y="300" width="200" height="140" rx="10" fill="#38bdf8" opacity="0.3"/>
    <rect x="40" y="460" width="260" height="175" rx="10" fill="#e879f9" opacity="0.25"/>
    <rect x="320" y="460" width="540" height="175" rx="10" fill="#7c3aed" opacity="0.3"/>
  </g>
  <!-- colour swatch rail -->
  <g transform="translate(40,650)">
    ${['#0a0714', '#3b1d6b', '#7c3aed', '#a970ff', '#e879f9', '#f59e0b', '#e9dcff']
      .map((c, i) => `<rect x="${i * 58}" y="-46" width="48" height="34" rx="6" fill="${c}" stroke="#fff" stroke-opacity="0.15"/>`).join('')}
  </g>
  ${cornerTag('MOODBOARD')}
  ${grain(900, 675)}
</svg>`,

  storyboard: () => `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 675" width="900" height="675" role="img" aria-label="Temporary storyboard sheet placeholder">
  ${defs()}
  <rect width="900" height="675" fill="#f4f1ea"/>
  <!-- storyboard frames -->
  ${Array.from({ length: 6 }, (_, i) => {
    const col = i % 3, row = Math.floor(i / 3);
    const x = 45 + col * 275, y = 60 + row * 285;
    const variant = [
      '<path d="M20 120 L90 40 L150 120z" fill="#8b5cf6" opacity="0.5"/>',
      '<circle cx="85" cy="85" r="45" fill="#7c3aed" opacity="0.45"/>',
      '<rect x="30" y="50" width="110" height="80" rx="8" fill="#a970ff" opacity="0.45"/>',
      '<path d="M20 130 Q85 20 150 130" fill="#38bdf8" opacity="0.45"/>',
      '<path d="M30 30 h110 v110 h-110z" fill="none" stroke="#7c3aed" stroke-width="4" opacity="0.6"/>',
      '<path d="M20 120 L85 60 L150 120z" fill="#e879f9" opacity="0.45"/>'
    ][i];
    return `
    <g transform="translate(${x},${y})">
      <rect width="230" height="150" rx="8" fill="#fff" stroke="#3b1d6b" stroke-width="2.5"/>
      <g transform="translate(35,15)">${variant}</g>
      <g stroke="#7c3aed" stroke-opacity="0.3" stroke-width="1.5">
        <path d="M0 113 H230 M115 0 V150"/>
      </g>
      <text x="10" y="170" fill="#4c1d95" font-family="Inter, Arial, sans-serif" font-size="15" font-weight="600">SHOT 0${i + 1}</text>
      <path d="M70 168 h140" stroke="#a970ff" stroke-width="2" stroke-opacity="0.5"/>
    </g>`;
  }).join('')}
  <g transform="translate(45,632)">
    <text x="0" y="0" fill="#4c1d95" font-family="Inter, Arial, sans-serif" font-size="16" letter-spacing="3">STORYBOARD &#183; SEQUENCE 01 &#183; PLACEHOLDER SHEET</text>
    <circle cx="700" cy="-5" r="12" fill="none" stroke="#7c3aed" stroke-width="2.5"/>
  </g>
  ${grain(900, 675)}
</svg>`,

  animation: () => `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 675" width="900" height="675" role="img" aria-label="Temporary animation and rigging placeholder">
  ${defs()}
  <rect width="900" height="675" fill="#0e0a18"/>
  ${grid(900, 675, 45, 0.06)}
  <ellipse cx="450" cy="360" rx="330" ry="220" fill="#7c3aed" opacity="0.22" filter="url(#soft)"/>

  <!-- rig skeleton -->
  <g stroke="#a970ff" stroke-width="7" stroke-linecap="round" fill="none">
    <path d="M450 300 V470"/>
    <path d="M450 340 L340 250 M450 340 L560 250"/>
    <path d="M340 250 L300 340 M560 250 L600 340"/>
    <path d="M450 470 L380 600 M450 470 L520 600"/>
  </g>
  <g fill="#e9dcff">
    <circle cx="450" cy="290" r="34"/>
    <circle cx="340" cy="250" r="12"/><circle cx="560" cy="250" r="12"/>
    <circle cx="300" cy="340" r="12"/><circle cx="600" cy="340" r="12"/>
    <circle cx="380" cy="600" r="12"/><circle cx="520" cy="600" r="12"/>
    <circle cx="450" cy="470" r="16"/>
  </g>
  <!-- onion-skin ghosts -->
  <g fill="#a970ff" opacity="0.18">
    <circle cx="410" cy="292" r="34"/><circle cx="490" cy="292" r="34"/>
  </g>

  <!-- keyframe timeline -->
  <g transform="translate(60,610)">
    <path d="M0 0 H780" stroke="#8b5cf6" stroke-opacity="0.5" stroke-width="2"/>
    ${Array.from({ length: 13 }, (_, i) => `<path d="M${i * 65} -8 v16" stroke="#a970ff" stroke-opacity="${i % 3 === 0 ? 0.9 : 0.35}" stroke-width="2"/>`).join('')}
    <path d="M390 -26 v52" stroke="#fff" stroke-width="3"/>
  </g>
  ${cornerTag('RIG / KEYFRAMES')}
  ${grain(900, 675)}
</svg>`,

  final: () => `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 675" width="900" height="675" role="img" aria-label="Temporary final render grade placeholder">
  ${defs()}
  <defs>
    <linearGradient id="frSky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#0b1230"/><stop offset="50%" stop-color="#4c1d95"/><stop offset="80%" stop-color="#c026d3"/><stop offset="100%" stop-color="#f59e0b"/>
    </linearGradient>
  </defs>
  <rect width="900" height="675" fill="url(#frSky)"/>
  <circle cx="620" cy="380" r="90" fill="#fde68a" opacity="0.95"/>
  <circle cx="620" cy="380" r="180" fill="#f59e0b" opacity="0.25" filter="url(#soft)"/>
  <path d="M0 470 L150 400 L280 460 L430 390 L580 455 L740 400 L900 455 V675 H0z" fill="#2a1a4a"/>
  <path d="M0 560 L180 500 L360 555 L540 495 L720 550 L900 510 V675 H0z" fill="#150e28"/>
  <path d="M0 630 L240 590 L480 630 L720 585 L900 620 V675 H0z" fill="#08060f"/>
  <g transform="translate(280,520)">
    <ellipse cx="0" cy="92" rx="70" ry="11" fill="#000" opacity="0.5"/>
    <path d="M0 -46 c-19 0-32 15-32 37 0 15 6 27 14 34 l-5 25 c-19 11-30 32-33 59 h112 c-3-27-14-48-33-59 l-5-25 c8-7 14-19 14-34 0-22-13-37-32-37z" fill="#05030b"/>
  </g>
  <!-- grade bars -->
  <g transform="translate(40,40)">
    ${['#0a0714', '#3b1d6b', '#7c3aed', '#c026d3', '#f59e0b', '#fde68a']
      .map((c, i) => `<rect x="${i * 46}" width="38" height="26" rx="5" fill="${c}"/>`).join('')}
    <text x="0" y="52" fill="#e9dcff" font-family="Inter, Arial, sans-serif" font-size="14" letter-spacing="2">FINAL GRADE</text>
  </g>
  <rect width="900" height="56" fill="#04030a" opacity="0.75"/>
  <rect y="619" width="900" height="56" fill="#04030a" opacity="0.75"/>
  ${grain(900, 675)}
</svg>`
};

/* ====================================================================
   5. ABOUT PORTRAIT (4:5 upright, warmer + more personal)
   ==================================================================== */
function aboutPortrait() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1000" width="800" height="1000" role="img" aria-label="Temporary studio artwork standing in for a photo of Keshav Sharma at work">
  ${defs()}
  <defs>
    <linearGradient id="abWall" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#1a1230"/><stop offset="100%" stop-color="#0b0714"/></linearGradient>
    <linearGradient id="abDesk" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#3b2a58"/><stop offset="100%" stop-color="#170f28"/></linearGradient>
    <linearGradient id="abScreen" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#a970ff"/><stop offset="100%" stop-color="#38bdf8"/></linearGradient>
  </defs>
  <rect width="800" height="1000" fill="url(#abWall)"/>
  <ellipse cx="600" cy="200" rx="360" ry="260" fill="#7c3aed" opacity="0.25" filter="url(#soft)"/>
  ${grid(800, 1000, 50, 0.04)}

  <!-- monitor -->
  <g transform="translate(120,200)">
    <rect width="560" height="340" rx="14" fill="#0a0714" stroke="#a970ff" stroke-opacity="0.55" stroke-width="2"/>
    <rect x="18" y="18" width="524" height="304" rx="8" fill="#0f0a1c"/>
    <!-- timeline UI on screen -->
    <g transform="translate(46,52)">
      <rect width="150" height="20" rx="6" fill="url(#abScreen)"/>
      <rect y="34" width="290" height="14" rx="5" fill="#a970ff" opacity="0.6"/>
      <rect y="58" width="210" height="14" rx="5" fill="#e879f9" opacity="0.5"/>
      <rect y="82" width="360" height="14" rx="5" fill="#38bdf8" opacity="0.45"/>
      <rect y="120" width="440" height="90" rx="8" fill="#a970ff" opacity="0.14"/>
      <circle cx="200" cy="165" r="26" fill="#7c3aed" opacity="0.75"/>
      <path d="M120 240 H460" stroke="#8b5cf6" stroke-opacity="0.4" stroke-width="2"/>
      <path d="M250 110 V250" stroke="#fff" stroke-opacity="0.8" stroke-width="2.5"/>
    </g>
    <path d="M250 340 v40 h60 v-40" fill="none" stroke="#a970ff" stroke-opacity="0.5" stroke-width="3"/>
    <rect x="200" y="380" width="160" height="14" rx="7" fill="#3b2a58"/>
  </g>

  <!-- desk + tablet + stylus -->
  <path d="M0 720 H800 V1000 H0z" fill="url(#abDesk)"/>
  <path d="M0 720 H800" stroke="#a970ff" stroke-opacity="0.35" stroke-width="2"/>
  <g transform="translate(430,760)">
    <rect width="300" height="200" rx="12" fill="#0f0a1c" stroke="#e879f9" stroke-opacity="0.45" stroke-width="2"/>
    <g transform="translate(30,30)">
      <circle cx="60" cy="60" r="42" fill="none" stroke="#a970ff" stroke-width="5"/>
      <path d="M110 30 q50 30 90 0" fill="none" stroke="#38bdf8" stroke-opacity="0.7" stroke-width="4"/>
      <path d="M20 130 h180" stroke="#e879f9" stroke-opacity="0.5" stroke-width="8" stroke-linecap="round"/>
    </g>
  </g>
  <g transform="translate(690,740) rotate(24)">
    <rect width="14" height="150" rx="7" fill="#e9dcff"/>
    <path d="M0 150 h14 l-7 22z" fill="#a970ff"/>
  </g>

  <!-- warm practical light -->
  <circle cx="80" cy="640" r="60" fill="#f59e0b" opacity="0.3" filter="url(#soft)"/>
  <path d="M80 560 v50" stroke="#f59e0b" stroke-opacity="0.5" stroke-width="4"/>

  ${grain(800, 1000)}
  <g transform="translate(40,930)">
    <rect width="470" height="42" rx="21" fill="#000" fill-opacity="0.5" stroke="#8b5cf6" stroke-opacity="0.6"/>
    <text x="22" y="27" fill="#d6c5ff" font-family="Inter, Arial, sans-serif" font-size="15" font-weight="600" letter-spacing="1.4">TEMPORARY ARTWORK &#8212; REPLACE STUDIO PHOTO</text>
  </g>
</svg>`;
}

/* ====================================================================
   6. SERVICE CARD VISUALS (small, distinct icons/illustrations)
   ==================================================================== */
const serviceArt = {
  character: () => `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 260" width="400" height="260" role="img" aria-label="Character animation illustration">
  ${defs()}
  <rect width="400" height="260" fill="#150e26"/>
  <ellipse cx="300" cy="60" rx="180" ry="120" fill="#a970ff" opacity="0.25" filter="url(#soft)"/>
  ${grid(400, 260, 34, 0.05)}
  <g transform="translate(200,140)">
    <circle cx="0" cy="-42" r="34" fill="#e9dcff"/>
    <path d="M0 0 v70" stroke="#a970ff" stroke-width="20" stroke-linecap="round"/>
    <path d="M0 24 l-52 34 M0 24 l54 -20" stroke="#a970ff" stroke-width="17" stroke-linecap="round" fill="none"/>
    <path d="M0 70 l-36 62 M0 70 l42 56" stroke="#e879f9" stroke-width="18" stroke-linecap="round" fill="none"/>
  </g>
  <g fill="none" stroke="#e879f9" stroke-opacity="0.6" stroke-width="2.5" stroke-dasharray="6 10">
    <path d="M40 90 C 110 20, 190 20, 240 70"/>
  </g>
  ${grain(400, 260)}
</svg>`,

  motion: () => `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 260" width="400" height="260" role="img" aria-label="Motion graphics illustration">
  ${defs()}
  <rect width="400" height="260" fill="#140b22"/>
  <ellipse cx="120" cy="220" rx="200" ry="120" fill="#e879f9" opacity="0.2" filter="url(#soft)"/>
  ${grid(400, 260, 34, 0.05)}
  <g transform="translate(60,70)">
    <rect width="240" height="18" rx="9" fill="#a970ff"/>
    <rect y="34" width="180" height="18" rx="9" fill="#e9dcff" opacity="0.8"/>
    <rect y="68" width="280" height="18" rx="9" fill="#e879f9" opacity="0.85"/>
    <rect y="102" width="120" height="18" rx="9" fill="#e9dcff" opacity="0.45"/>
  </g>
  <path d="M300 40 l50 40 -50 40z" fill="#a970ff" opacity="0.55"/>
  <path d="M330 150 l40 30 -40 30z" fill="#e879f9" opacity="0.5"/>
  ${grain(400, 260)}
</svg>`,

  product: () => `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 260" width="400" height="260" role="img" aria-label="3D product animation illustration">
  ${defs()}
  <rect width="400" height="260" fill="#0b1018"/>
  <ellipse cx="200" cy="230" rx="190" ry="90" fill="#38bdf8" opacity="0.18" filter="url(#soft)"/>
  ${grid(400, 260, 34, 0.05)}
  <g transform="translate(200,130)">
    <path d="M0 -70 L70 -35 L70 35 L0 70 L-70 35 L-70 -35z" fill="none" stroke="#38bdf8" stroke-width="2"/>
    <path d="M0 -70 L70 -35 L0 0 L-70 -35z" fill="#e9dcff" opacity="0.9"/>
    <path d="M-70 -35 L0 0 L0 70 L-70 35z" fill="#8b5cf6" opacity="0.9"/>
    <path d="M70 -35 L0 0 L0 70 L70 35z" fill="#4c1d95"/>
  </g>
  <ellipse cx="200" cy="130" rx="150" ry="52" fill="none" stroke="#a970ff" stroke-opacity="0.45" stroke-dasharray="4 10"/>
  ${grain(400, 260)}
</svg>`,

  editing: () => `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 260" width="400" height="260" role="img" aria-label="Video editing and compositing illustration">
  ${defs()}
  <rect width="400" height="260" fill="#130d18"/>
  <ellipse cx="320" cy="60" rx="180" ry="120" fill="#f59e0b" opacity="0.16" filter="url(#soft)"/>
  ${grid(400, 260, 34, 0.05)}
  <g transform="translate(40,60)">
    <rect width="90" height="30" rx="7" fill="#f59e0b"/>
    <rect x="100" width="120" height="30" rx="7" fill="#a970ff"/>
    <rect x="230" width="70" height="30" rx="7" fill="#e879f9"/>
    <rect y="46" width="150" height="22" rx="6" fill="#e9dcff" opacity="0.3"/>
    <rect x="160" y="46" width="140" height="22" rx="6" fill="#e9dcff" opacity="0.22"/>
    <rect y="84" width="220" height="18" rx="6" fill="#a970ff" opacity="0.5"/>
    <path d="M0 130 H300" stroke="#8b5cf6" stroke-opacity="0.5" stroke-width="2"/>
    <path d="M150 20 V145" stroke="#fff" stroke-opacity="0.85" stroke-width="3"/>
    <path d="M142 10 h16 l-8 16z" fill="#fff"/>
  </g>
  ${grain(400, 260)}
</svg>`
};

/* ====================================================================
   Run
   ==================================================================== */
console.log('\nGenerating portfolio artwork...\n');

console.log('Hero / about portraits');
write('images/hero-artwork.svg', heroPortrait());
write('images/about-artwork.svg', aboutPortrait());

console.log('\nShowreel');
write('showreel-collage.svg', showreelCollage());

console.log('\nProject artwork');
Object.entries(projectArt).forEach(([name, fn]) => {
  const file = name.endsWith('-wide') ? `${name}.svg` : `${name}.svg`;
  write(`projects/${file}`, fn());
});

console.log('\nBehind the frames');
Object.entries(processArt).forEach(([name, fn]) => {
  write(`process/${name}.svg`, fn());
});

console.log('\nService visuals');
Object.entries(serviceArt).forEach(([name, fn]) => {
  write(`services/${name}.svg`, fn());
});

console.log('\nDone.\n');

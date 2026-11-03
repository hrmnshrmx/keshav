/**
 * Cloudflare Pages Function — POST /api/contact
 * Saves contact form submissions to the project's D1 database.
 *
 * Uses the D1 binding named `DB` when present; otherwise it falls back to the
 * first D1 binding attached to the Pages project, so the existing database
 * connection is reused without extra configuration.
 */

const PROJECT_TYPES = [
  'Brand Identity',
  'Social Media Design',
  'Print & Digital Design',
  'Packaging Design',
  'Other',
];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const MIN_FILL_MS = 3000;            // humans need more than 3s to fill the form
const MAX_FORM_AGE_MS = 24 * 3600e3; // stale/replayed forms are rejected
const RATE_LIMIT = 5;                // submissions per IP …
const RATE_WINDOW_MIN = 60;          // … per this many minutes

const SCHEMA = [
  `CREATE TABLE IF NOT EXISTS contact_submissions (
     id INTEGER PRIMARY KEY AUTOINCREMENT,
     name TEXT NOT NULL,
     email TEXT NOT NULL,
     project_type TEXT NOT NULL,
     description TEXT NOT NULL,
     created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
     ip_hash TEXT,
     user_agent TEXT
   )`,
  `CREATE INDEX IF NOT EXISTS idx_contact_submissions_ip_created
     ON contact_submissions (ip_hash, created_at)`,
];

const json = (body, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' },
  });

function isD1(v) {
  if (!v || typeof v !== 'object') return false;
  const ctor = v.constructor && v.constructor.name;
  return typeof ctor === 'string' && ctor.includes('D1') && typeof v.prepare === 'function';
}

function getDatabase(env) {
  if (env.DB && typeof env.DB.prepare === 'function') return env.DB;
  for (const key of Object.keys(env || {})) {
    if (key === 'ASSETS') continue;
    if (isD1(env[key])) return env[key];
  }
  return null;
}

async function sha256(text) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

const clean = (v, max) =>
  String(v ?? '')
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '')
    .trim()
    .slice(0, max + 1);

async function readBody(request) {
  const type = request.headers.get('content-type') || '';
  if (type.includes('application/json')) return request.json();
  if (type.includes('form')) return Object.fromEntries(await request.formData());
  throw new Error('Unsupported content type');
}

export async function onRequestPost({ request, env }) {
  // Basic payload size guard
  const len = Number(request.headers.get('content-length') || 0);
  if (len > 20000) return json({ ok: false, error: 'Message is too large.' }, 413);

  let body;
  try {
    body = await readBody(request);
  } catch {
    return json({ ok: false, error: 'Invalid request.' }, 400);
  }

  // ---- Spam protection ----
  const silentOk = () => json({ ok: true, message: "Thanks! Your message has been sent." });
  if (clean(body.website, 200)) return silentOk(); // honeypot filled → bot
  const startedAt = Number(body.startedAt);
  const elapsed = Date.now() - startedAt;
  if (!Number.isFinite(startedAt) || elapsed < MIN_FILL_MS) {
    return json({ ok: false, error: 'That was quick! Please take a moment and try again.' }, 400);
  }
  if (elapsed > MAX_FORM_AGE_MS) {
    return json({ ok: false, error: 'This form has expired. Please refresh the page and try again.' }, 400);
  }

  // ---- Validation ----
  const name = clean(body.name, 80);
  const email = clean(body.email, 254).toLowerCase();
  const projectType = clean(body.projectType, 60);
  const description = clean(body.description, 2000);

  const errors = {};
  if (name.length < 2 || name.length > 80) errors.name = 'Please enter your name (2–80 characters).';
  if (!EMAIL_RE.test(email) || email.length > 254) errors.email = 'Please enter a valid email address.';
  if (!PROJECT_TYPES.includes(projectType)) errors.projectType = 'Please choose a valid project type.';
  if (description.length < 10 || description.length > 2000) {
    errors.description = 'Please describe your project (10–2000 characters).';
  }
  const linkCount = (description.match(/https?:\/\/|www\./gi) || []).length;
  if (linkCount > 3) errors.description = 'Please include no more than 3 links.';

  if (Object.keys(errors).length) {
    return json({ ok: false, error: 'Please fix the highlighted fields.', errors }, 422);
  }

  const db = getDatabase(env);
  if (!db) {
    console.error('contact: no D1 binding found on this Pages project');
    return json({ ok: false, error: 'The form is temporarily unavailable. Please email hello@keshavsharma.in.' }, 503);
  }

  try {
    await db.batch(SCHEMA.map((sql) => db.prepare(sql)));

    const ip = request.headers.get('cf-connecting-ip') || request.headers.get('x-forwarded-for') || 'unknown';
    const ipHash = await sha256(`${ip}|${env.IP_SALT || 'ks-portfolio'}`);

    const recent = await db
      .prepare(
        `SELECT COUNT(*) AS n FROM contact_submissions
         WHERE ip_hash = ?1 AND created_at > strftime('%Y-%m-%dT%H:%M:%fZ', 'now', ?2)`
      )
      .bind(ipHash, `-${RATE_WINDOW_MIN} minutes`)
      .first();
    if (recent && recent.n >= RATE_LIMIT) {
      return json({ ok: false, error: 'Too many messages in a short time. Please try again later.' }, 429);
    }

    const createdAt = new Date().toISOString();
    const userAgent = clean(request.headers.get('user-agent'), 300);
    await db
      .prepare(
        `INSERT INTO contact_submissions (name, email, project_type, description, created_at, ip_hash, user_agent)
         VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7)`
      )
      .bind(name, email, projectType, description, createdAt, ipHash, userAgent)
      .run();

    return json({ ok: true, message: `Thanks, ${name.split(' ')[0]}! Your message has been sent. I'll get back to you within 24 hours.` });
  } catch (err) {
    console.error('contact: D1 error', err && err.message);
    return json({ ok: false, error: 'Could not save your message right now. Please try again shortly.' }, 500);
  }
}

export function onRequest() {
  return json({ ok: false, error: 'Method not allowed.' }, 405);
}

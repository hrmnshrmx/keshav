-- Contact form submissions table (also created automatically by functions/api/contact.js)
CREATE TABLE IF NOT EXISTS "keshav-ct" (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  project_type TEXT NOT NULL,
  description TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  ip_hash TEXT,
  user_agent TEXT
);

CREATE INDEX IF NOT EXISTS idx_keshav_ct_ip_created
  ON "keshav-ct" (ip_hash, created_at);

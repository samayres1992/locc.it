-- locc.it — SQLite schema
--
-- One file, two tables. The locks table stores opaque ciphertext blobs that
-- the server never decrypts (see decryptRoutes.js). The users table holds
-- OAuth identities and bcrypt-hashed local passwords; nothing about a user's
-- own secrets is correlated here beyond the user_id foreign key.

PRAGMA foreign_keys = ON;

-- Users — OAuth (Google / GitHub) plus optional local email/password.
-- IDs are UUIDv4 strings minted at insert time so we don't depend on the
-- driver to surface an auto-increment value (and so URLs that link back to
-- a user can't be enumerated by counting up).
CREATE TABLE IF NOT EXISTS users (
  id           TEXT PRIMARY KEY,
  github_id    TEXT UNIQUE,
  google_id    TEXT UNIQUE,
  email        TEXT UNIQUE,
  password     TEXT,
  activated    INTEGER NOT NULL DEFAULT 0,
  activate_by  TEXT NOT NULL,
  created_at   TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_users_github_id ON users(github_id);
CREATE INDEX IF NOT EXISTS idx_users_google_id ON users(google_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Locks — one row per active secret.
-- url is the random identifier the sender shares with the recipient. It's
-- also the primary key, so the same shortid that goes on the wire is the
-- one the database is keyed by — no separate _id leaking on the network.
-- encrypted_data holds the flatted-stringified CryptoJS AES output. The
-- server never reads it (the new client-side decrypt flow runs AES in the
-- recipient's browser); SQLite is just durable storage for an opaque blob.
CREATE TABLE IF NOT EXISTS locks (
  url             TEXT PRIMARY KEY,
  user_id         TEXT REFERENCES users(id) ON DELETE SET NULL,
  title           TEXT,
  encrypted_data  TEXT NOT NULL,
  expiry          TEXT NOT NULL,
  viewed          INTEGER NOT NULL DEFAULT 0,
  viewed_at       TEXT,
  created_at      TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_locks_user_id   ON locks(user_id);
CREATE INDEX IF NOT EXISTS idx_locks_expiry    ON locks(expiry);
CREATE INDEX IF NOT EXISTS idx_locks_viewed_at ON locks(viewed_at);

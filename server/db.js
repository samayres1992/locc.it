/**
 * locc.it — SQLite handle.
 *
 * One process, one file, zero database server. Replaces what used to be a
 * Mongoose connection against MongoDB Atlas. The file lives at the path
 * configured in keys.dbPath (or a sensible default next to the server code),
 * and the schema in schema.sql is applied on every boot with CREATE IF NOT
 * EXISTS so cold-starting a fresh box is a single `node index.js`.
 *
 * better-sqlite3 is synchronous, which is fine for a workload that's
 * tiny inserts + tiny lookups + an hourly cleanup sweep. No connection
 * pool, no driver tuning, no Atlas tier to outgrow.
 */
const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const keys = require('./config/keys');

const dbPath = keys.dbPath || path.join(__dirname, '..', 'data', 'loccit.db');

// Ensure the directory exists. On a fresh VPS / Docker image / dev machine
// the data/ folder doesn't exist yet; mkdirSync({ recursive: true }) is a
// no-op if it already does.
fs.mkdirSync(path.dirname(dbPath), { recursive: true });

const db = new Database(dbPath);

// WAL gives us concurrent reads alongside writes — for locc.it that means
// the cron sweep doesn't lock encrypt/decrypt requests for the few ms it
// runs. foreign_keys = ON is off by default in SQLite for historical
// reasons; turning it on makes the locks.user_id REFERENCES users(id)
// constraint actually enforced.
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// Apply schema. CREATE IF NOT EXISTS is idempotent so this is safe to run
// on every boot.
const schemaPath = path.join(__dirname, 'schema.sql');
const schema = fs.readFileSync(schemaPath, 'utf-8');
db.exec(schema);

// Small helper exported alongside the db handle so route files don't all
// have to require('crypto') just for user IDs.
const uuid = () => crypto.randomUUID();

module.exports = { db, uuid };

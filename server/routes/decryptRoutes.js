const { db } = require('../db');
const throttle = require("express-throttle");

// How long a freshly-fetched record is held server-side before purge.
// Tolerates page refreshes during the decrypt UX while keeping brute-force
// against the encrypted blob bounded.
const GRACE_PERIOD_MS = 60 * 1000;

// Prepared statements compiled once at module load.
const getLockByUrl = db.prepare(`SELECT * FROM locks WHERE url = ?`);
const markViewed   = db.prepare(`UPDATE locks SET viewed = 1, viewed_at = ? WHERE url = ?`);
const deleteLock   = db.prepare(`DELETE FROM locks WHERE url = ?`);

module.exports = app => {

  // ============================================================
  // Zero-knowledge client-side decrypt flow
  // ============================================================
  //
  // GET  /api/secret/:url  — fetch ciphertext (one-shot + grace window)
  // DELETE /api/secret/:url — recipient confirms decryption; purge record
  //
  // The passcode never crosses the wire. The server stores ciphertext,
  // sees the recipient's request to fetch it, marks the record as viewed,
  // and then has nothing further to do until the client confirms
  // consumption (or the grace window times out and the record is purged).
  //
  // The pre-migration server-side decrypt routes (`/api/check_url` and
  // `/api/decrypt_attempt`) were removed during the SQLite cutover. There
  // is no legacy path; every recipient runs CryptoJS.AES.decrypt in their
  // own browser.

  app.get('/api/secret/:url', throttle({ "rate": "10/m" }), async (req, res) => {
    const { url } = req.params;
    try {
      const row = getLockByUrl.get(String(url));
      if (!row) {
        return res.status(404).send({ error: 'Not found or already consumed.' });
      }

      const now = new Date();

      // Past expiry — purge and 410.
      if (now > new Date(row.expiry)) {
        deleteLock.run(String(url));
        return res.status(410).send({ error: 'Expired.' });
      }

      // Already viewed: allow re-fetch within the grace window (refresh
      // tolerance), purge otherwise.
      if (row.viewed && row.viewed_at) {
        const elapsed = now.getTime() - new Date(row.viewed_at).getTime();
        if (elapsed > GRACE_PERIOD_MS) {
          deleteLock.run(String(url));
          return res.status(410).send({ error: 'Grace window elapsed.' });
        }
      } else {
        // First fetch — start the grace window.
        markViewed.run(now.toISOString(), String(url));
      }

      return res.send({
        url: row.url,
        title: row.title || '',
        ciphertext: row.encrypted_data,
        expiry: row.expiry,
      });
    } catch (err) {
      console.error('GET /api/secret error:', err);
      return res.status(500).send({ error: 'Server error.' });
    }
  });

  app.delete('/api/secret/:url', throttle({ "rate": "10/m" }), async (req, res) => {
    const { url } = req.params;
    try {
      deleteLock.run(String(url));
      // Idempotent: returning 204 either way (already-deleted is fine).
      return res.status(204).send();
    } catch (err) {
      console.error('DELETE /api/secret error:', err);
      return res.status(500).send({ error: 'Server error.' });
    }
  });
};

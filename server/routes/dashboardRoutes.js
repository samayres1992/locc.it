const { db } = require('../db');
const Moment = require('moment');
const requireLogin = require('../middlewares/requireLogin');
const throttle = require("express-throttle");

// The dashboard surfaces locks the logged-in user has created so they can
// see what's outstanding and revoke or extend it. The url field is the
// natural identifier (it's the primary key and what gets shared with
// recipients), so the legacy lockId concept just maps to url here.

const deleteOwnedLock = db.prepare(
  `DELETE FROM locks WHERE url = ? AND user_id = ?`
);
const findLocksForUser = db.prepare(
  `SELECT * FROM locks WHERE user_id = ? ORDER BY created_at DESC`
);
const updateExpiryOwned = db.prepare(
  `UPDATE locks SET expiry = ? WHERE url = ? AND user_id = ?`
);

module.exports = app => {
  app.post('/api/delete_lock', requireLogin, throttle({ "rate": "50/m" }), async (req, res) => {
    const { user } = req;
    // lockId from the older client is the url — both the legacy and new
    // dashboards pass the same opaque identifier here.
    const { lockId } = req.body;

    try {
      const info = deleteOwnedLock.run(String(lockId), String(user.id));
      // info.changes is the number of rows deleted (0 if the lock isn't
      // theirs or doesn't exist). Returning false matches the legacy contract.
      return info.changes ? res.send({ deleted: true }) : res.send(false);
    } catch (err) {
      console.error('delete_lock error:', err);
      return res.status(500).send(false);
    }
  });

  app.get('/api/fetch_locks', requireLogin, throttle({ "rate": "10/m" }), async (req, res) => {
    const { user } = req;
    if (!user.id) return res.send(false);
    try {
      const rows = findLocksForUser.all(String(user.id));
      return res.send(rows);
    } catch (err) {
      console.error('fetch_locks error:', err);
      return res.send(false);
    }
  });

  app.post('/api/update_expiry', requireLogin, throttle({ "rate": "50/m" }), async (req, res) => {
    const { user } = req;
    const { lockId, expiry } = req.body;
    try {
      const info = updateExpiryOwned.run(
        Moment(expiry).toISOString(),
        String(lockId),
        String(user.id)
      );
      return info.changes
        ? res.send({ updated: true })
        : res.send('Failed to update expiry date');
    } catch (err) {
      console.error('update_expiry error:', err);
      return res.send('Failed to update expiry date');
    }
  });
};

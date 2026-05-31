const { db } = require('../db');
const { every } = require('bella-scheduler');

// Grace window after which a viewed record is purged even if the recipient
// hasn't called DELETE /api/secret/:url. The on-fetch self-clean in the route
// is the primary mechanism; this is the safety net for records that nobody
// ever re-visits.
const GRACE_PERIOD_MS = 60 * 1000;

// Prepared statements compiled once at module load.
const deleteExpiredLocks = db.prepare(
  `DELETE FROM locks WHERE expiry < ?`
);
const deleteStaleViewedLocks = db.prepare(
  `DELETE FROM locks WHERE viewed = 1 AND viewed_at IS NOT NULL AND viewed_at < ?`
);
const deleteUnactivatedUsers = db.prepare(
  `DELETE FROM users WHERE activated = 0 AND activate_by < ?`
);

every('1h', () => {
  const now = new Date();
  const nowIso = now.toISOString();

  try {
    const r1 = deleteExpiredLocks.run(nowIso);
    if (r1.changes) console.log(`Expired locks purged: ${r1.changes}`);
  } catch (e) {
    console.error('cron expired-locks sweep failed:', e);
  }

  try {
    const cutoff = new Date(now.getTime() - GRACE_PERIOD_MS).toISOString();
    const r2 = deleteStaleViewedLocks.run(cutoff);
    if (r2.changes) console.log(`Stale viewed locks purged: ${r2.changes}`);
  } catch (e) {
    console.error('cron stale-viewed sweep failed:', e);
  }

  try {
    const r3 = deleteUnactivatedUsers.run(nowIso);
    if (r3.changes) console.log(`Unactivated users purged: ${r3.changes}`);
  } catch (e) {
    console.error('cron unactivated-users sweep failed:', e);
  }
});

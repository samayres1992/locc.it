const mongoose = require('mongoose');
const Encrypt = mongoose.model('locks');
const Moment = require('moment');
const CryptoJS = require('crypto-js');
const { parse } = require('flatted/cjs');
const throttle = require("express-throttle");

// How long a freshly-fetched record is held server-side before purge.
// Tolerates page refreshes during the decrypt UX while keeping brute-force
// against the encrypted blob bounded.
const GRACE_PERIOD_MS = 60 * 1000;

module.exports = app => {

  // ============================================================
  // NEW — zero-knowledge client-side decrypt flow
  // ============================================================
  //
  // GET  /api/secret/:url  — fetch ciphertext (one-shot + grace window)
  // DELETE /api/secret/:url — recipient confirms decryption; purge record
  //
  // The passcode never crosses the wire in this flow. The server stores
  // ciphertext, sees the recipient's request to fetch it, marks the record
  // as viewed, and then has nothing further to do until the client confirms
  // consumption (or the grace window times out and the record is purged).

  app.get('/api/secret/:url', throttle({ "rate": "10/m" }), async (req, res) => {
    const { url } = req.params;
    try {
      const data = await Encrypt.findOne({ url: String(url) });
      if (!data) {
        return res.status(404).send({ error: 'Not found or already consumed.' });
      }

      // Past expiry — purge and 410
      if (new Date() > new Date(data.expiry)) {
        await Encrypt.findByIdAndDelete(data._id);
        return res.status(410).send({ error: 'Expired.' });
      }

      // Already viewed: allow re-fetch within the grace window (refresh
      // tolerance), purge otherwise.
      if (data.viewed && data.viewedAt) {
        const elapsed = Date.now() - new Date(data.viewedAt).getTime();
        if (elapsed > GRACE_PERIOD_MS) {
          await Encrypt.findByIdAndDelete(data._id);
          return res.status(410).send({ error: 'Grace window elapsed.' });
        }
      } else {
        // First fetch — start the grace window.
        await Encrypt.findByIdAndUpdate(data._id, {
          viewed: true,
          viewedAt: new Date(),
        });
      }

      return res.send({
        url: data.url,
        title: data.title || '',
        ciphertext: data.encryptedData,
        expiry: data.expiry,
      });
    } catch (err) {
      console.error('GET /api/secret error:', err);
      return res.status(500).send({ error: 'Server error.' });
    }
  });

  app.delete('/api/secret/:url', throttle({ "rate": "10/m" }), async (req, res) => {
    const { url } = req.params;
    try {
      await Encrypt.findOneAndDelete({ url: String(url) });
      // Idempotent: returning 204 either way (already-deleted is fine).
      return res.status(204).send();
    } catch (err) {
      console.error('DELETE /api/secret error:', err);
      return res.status(500).send({ error: 'Server error.' });
    }
  });

  // ============================================================
  // LEGACY — server-side decrypt flow (pre client-side migration)
  // ============================================================
  //
  // Kept for backward compatibility while older clients are in the wild.
  // The new client never calls these. Safe to remove once analytics show
  // no /api/check_url or /api/decrypt_attempt traffic.

  app.post('/api/check_url', throttle({ "rate": "5/m" }), async (req, res) => {
    const { url } = req.body;
    Encrypt.findOne({
      url: String(url)
    }).then((data) => {
      if (data) {
        const { _id, locked } = data;
        if (_id && !locked) {
          // We got everything, send them the info
          return res.send({ lockId: _id });
        }
        else if (locked) {
          // Inform the user how long they are locked out for
          return res.send({ locked: locked });
        }
      }
      else {
        // If no results
        return res.send(false);
      }
    });
  });

  app.post('/api/decrypt_attempt', throttle({ "rate": "5/m" }), async (req, res) => {
    const { lockId, passcode } = req.body;

    // Let's take the value and decrypt it
    Encrypt.findOne({
      '_id': lockId
    }).then((data) => {
      if (data) {
        const { _id, title, encryptedData, active, locked } = data;
        // TODO: REFACTOR
        try {
          // If the passcode is correct, decrypt the data and delete lock.
          const parsedData = parse(encryptedData);
          let bytes = CryptoJS.AES.decrypt(parsedData, passcode.passcode.toString());
          let decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

          // The details are correct, so delete the data from the db
          Encrypt.findByIdAndDelete({ _id }, (result => {
            console.log('result', result);
          }));

          // Add in the title for simplicity elsewhere
          Object.assign(decryptedData, { title });
          res.send({title, decryptedData, active, locked});
        } catch(e) {
          // Failed to find a result
          Encrypt.findByIdAndUpdate(
            lockId,
            { $inc: { attempts: 1 }},
            { "new": true }
         ).then((attemptResult) => {
            if (attemptResult.attempts >= 3) {
              // If the user fails 3 attempts, lock them out
              Encrypt.findByIdAndUpdate(
                lockId,
                { active: false, locked: Moment().add(1, 'hour') },
                { "new": true },
                (err, lockResult) => {
                  if (err) {
                    return;
                  }
                  res.send({ lockId: lockResult._id, locked: lockResult.locked, decryptedData: false });
                }
             );
            } else {
              res.send({ lockId: attemptResult._id, attempts: attemptResult.attempts, decryptedData: false });
            }
          });
        }
      } else {
        res.redirect('/');
      }
    });
  });
};

const { db } = require('../db');
const Moment = require('moment');
const throttle = require("express-throttle");

// Prepared statement compiled once at module load.
const insertLock = db.prepare(`
  INSERT INTO locks (url, user_id, title, encrypted_data, expiry)
  VALUES (@url, @user_id, @title, @encrypted_data, @expiry)
`);

module.exports = app => {
  app.post('/api/encrypt', throttle({ "rate": "10/m" }), async (req, res) => {
    // Deconstruct the request
    const { userId, title, expiry, encryptedData, url } = req.body;

    try {
      insertLock.run({
        url: String(url),
        user_id: userId ? String(userId) : null,
        title: title || null,
        // encryptedData arrives as a flatted-stringified CryptoJS payload —
        // we store it as the opaque text it is. The server never decrypts.
        encrypted_data: String(encryptedData),
        expiry: Moment(expiry).toISOString(),
      });
      return res.send({ url, expiry });
    } catch (err) {
      // Most likely cause: UNIQUE constraint violation on the url. The
      // client retries with a fresh shortid on failure.
      return res.status(400).send({ message: 'Encryption failed.' });
    }
  });
};

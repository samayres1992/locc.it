const mongoose = require('mongoose');
const Encrypt = mongoose.model('locks');
const Moment = require('moment');
const throttle = require("express-throttle");

module.exports = app => {
  app.post('/api/encrypt', throttle({ "rate": "10/m" }), async (req, res) => {
    // Deconstruct the request
    const { userId, title, expiry, encryptedData, url } = req.body;
    await new Encrypt({
      userId: userId,
      title: title,
      encryptedData: encryptedData,
      url: url,
      expiry: Moment(expiry).format()
    }).save(( err, { url, expiry }) => {
      if (err) {
        return res.status(400).send({
          message: 'Encryption failed.'
        });
      }
      return res.send({ url, expiry });
    });
  });
};
const mongoose = require('mongoose');
const Encrypt = mongoose.model('locks');
const Moment = require('moment');

module.exports = app => {
  app.post('/api/encrypt', async (req, res) => {
    // Deconstruct the request
    const { userId, title, expiry, encryptedData, url } = req.body;
    const encrypted = await new Encrypt({
      userId: userId,
      title: title,
      encryptedData: encryptedData,
      url: url,
      expiry: Moment(expiry).format()
    }).save();
    res.send(encrypted);
  });
};
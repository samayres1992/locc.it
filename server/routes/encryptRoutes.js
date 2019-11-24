const mongoose = require('mongoose');
const Encrypt = mongoose.model('locks');
const Moment = require('moment');

module.exports = app => {
  app.post('/api/encrypt', async (req, res) => {
    // Deconstruct the request
    const { title, expiry, encryptedData, url } = req.body;

    console.log('expiry', expiry);
    const encrypted = await new Encrypt({
      title: title,
      encryptedData: encryptedData,
      url: url,
      expiry: Moment(expiry).format()
    }).save();
    res.send(encrypted);
  });
};
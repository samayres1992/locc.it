const mongoose = require('mongoose');
const Encrypt = mongoose.model('encrypted');

module.exports = app => {
  app.post('/api/encrypt', async (req, res) => {
    // Deconstruct the request
    const { title, encryptedData } = req.body;
    let date = new Date();
    req.encrypted.title = title;
    req.encrypted.encryptedData = encryptedData;
    req.encrypted.expiry = date.setDate(date.getDate() + 7);
    const encrypted = await req.encrypted.save();
    res.send(encrypted);
  });
};
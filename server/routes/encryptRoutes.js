const mongoose = require('mongoose');
const Encrypt = mongoose.model('locks');

module.exports = app => {
  app.post('/api/encrypt', async (req, res) => {
    // Deconstruct the request
    const { title, encryptedData } = req.body;

    console.log('req', req.body);
    let date = new Date();
    const encrypted = await new Encrypt({
      title: title,
      encryptedData: encryptedData,
      expiry: date.setDate(date.getDate() + 7) // TODO: give user option to set amount of time
    }).save();
    // console.log('encrypted', encrypted);
    res.send(encrypted);
  });
};
const mongoose = require('mongoose');
const Encrypt = mongoose.model('locks');

module.exports = app => {
  app.post('/api/check_url', async (req, res) => {
    const { url } = req.body;
    Encrypt.findOne({ 'url': url }).then((data) => {
      if (data) {
        console.log('data from server', data);
        res.send(data);
      } else {
        // Failed to find a result
        res.send(false);
      }
    });
  });
};
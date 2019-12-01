const mongoose = require('mongoose');
const Encrypt = mongoose.model('locks');

module.exports = app => {
  app.post('/api/check_url', async (req, res) => {
    const { url } = req.body;
    Encrypt.findOne({ 'url': url }).then((data) => {
      if (data) {
        res.send(data);
      } else {
        // Failed to find a result
        res.send(false);
      }
    });
  });
  app.post('/api/fetch_locks', async (req, res) => {
    const { userId } = req.body;
    Encrypt.find({ 
      'active': true,
      'userId': userId
    }).then((data) => {
      if (data) {
        console.log("data", data);
        res.send(data);
      } else {
        // Failed to find a result
        res.send(false);
      }
    });
  });
};
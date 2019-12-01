const mongoose = require('mongoose');
const Encrypt = mongoose.model('locks');

module.exports = app => {
  app.post('/api/delete_lock', async (req, res) => {
    const { lockId } = req.body;
    console.log('lockid server', lockId);
    Encrypt.deleteOne({ '_id': lockId }).then((data) => {
      if (data) {
        console.log('data encrypt', data);
        res.send(data);
      } else {
        // Failed to find a result
        res.send(false);
      }
    });
  });

  app.post('/api/update_expiry', async (req, res) => {
    const { lockId, expiry } = req.body;

    Encrypt.updateOne(
      { '_id': lockId }, // Find Lock
      { 'expiry': expiry } // Update value
    ).then((data) => {
      if (data) {
        console.log('data encrypt', data);
        res.send(data);
      } else {
        // Failed to find a result
        res.send(false);
      }
    });
  });
};
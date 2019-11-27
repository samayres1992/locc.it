const mongoose = require('mongoose');
const Encrypt = mongoose.model('locks');

module.exports = app => {
  app.post('/api/delete_lock', async (req, res) => {
    const { lockId } = req.body;
    Encrypt.deleteOne({ 'id': lockId }).then((data) => {
      if (data) {
        res.send(data);
      } else {
        // Failed to find a result
        res.send(false);
      }
    });
  });
};
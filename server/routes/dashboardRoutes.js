const mongoose = require('mongoose');
const Encrypt = mongoose.model('locks');

module.exports = app => {
  app.post('/api/delete_lock', async (req, res) => {
    const { lockId } = req.body;
    
    Encrypt.deleteOne({ '_id': lockId }).then((data) => {
      if (data) {
        res.send(data);
      } else {
        // Failed to find a result
        res.send(false);
      }
    });
  });

  app.get('/api/fetch_locks', async (req, res) => {
    const { user } = req;

    if (user._id) {
      console.log("user_id", user._id);
      Encrypt.find({ 
        'userId': String(user._id)
      }).then(( data ) => {
        console.log("fetchlocks route", data);
        if (data) {
          return res.send(data);
        }
        else {
          // Failed to find a result
          res.send(false);
        }
      });
    }
  });

  app.post('/api/update_expiry', async (req, res) => {
    const { lockId, expiry } = req.body;

    Encrypt.updateOne(
      { '_id': lockId }, // Find Lock
      { 'expiry': expiry } // Update value
    ).then((data) => {
      if (data) {
        res.send(data);
      } 
      else {
        // Failed to find a result
        res.send("Failed to update expiry date");
      }
    });
  });
};
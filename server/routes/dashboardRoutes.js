const mongoose = require('mongoose');
const Encrypt = mongoose.model('locks');
const requireLogin = require('../middlewares/requireLogin');

module.exports = app => {
  app.post('/api/delete_lock', requireLogin, async (req, res) => {
    const { user } = req;
    const { lockId } = req.body;
    
    Encrypt.deleteOne({ 
      '_id': lockId,
      'userId': String(user._id) 
    }).then((data) => {
      if (data) {
        res.send(data);
      } else {
        // Failed to find a result
        res.send(false);
      }
    });
  });

  app.get('/api/fetch_locks', requireLogin, async (req, res) => {
    const { user } = req;

    if (user._id) {
      Encrypt.find({ 
        'userId': String(user._id)
      }).then(( data ) => {
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

  app.post('/api/update_expiry', requireLogin, async (req, res) => {
    const { user } = req;
    const { lockId, expiry } = req.body;

    Encrypt.updateOne(
      { '_id': lockId, 'userId': String(user._id) }, // Find Lock
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
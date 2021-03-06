const mongoose = require('mongoose');
const Encrypt = mongoose.model('locks');
const Moment = require('moment');
const CryptoJS = require('crypto-js');
const { parse } = require('flatted/cjs');
const throttle = require("express-throttle");

module.exports = app => {
  app.post('/api/check_url', throttle({ "rate": "5/m" }), async (req, res) => {
    const { url } = req.body;
    Encrypt.findOne({ 
      url: String(url)
    }).then((data) => {
      if (data) {
        const { _id, locked } = data;
        if (_id && !locked) {
          // We got everything, send them the info
          return res.send({ lockId: _id });
        }
        else if (locked) {
          // Inform the user how long they are locked out for
          return res.send({ locked: locked });
        }
      }
      else { 
        // If no results
        return res.send(false);
      }
    });
  });

  app.post('/api/decrypt_attempt', throttle({ "rate": "5/m" }), async (req, res) => {
    const { lockId, passcode } = req.body;

    // Let's take the value and decrypt it
    Encrypt.findOne({ 
      '_id': lockId
    }).then((data) => {
      if (data) {
        const { _id, title, encryptedData, active, locked } = data;
        // TODO: REFACTOR
        try {
          // If the passcode is correct, decrypt the data and delete lock.
          const parsedData = parse(encryptedData);
          let bytes = CryptoJS.AES.decrypt(parsedData, passcode.passcode.toString());
          let decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

          // The details are correct, so delete the data from the db
          Encrypt.findByIdAndDelete({ _id }, (result => {
            console.log('result', result);
          }));

          // Add in the title for simplicity elsewhere
          Object.assign(decryptedData, { title });
          res.send({title, decryptedData, active, locked});
        } catch(e) {
          // Failed to find a result
          Encrypt.findByIdAndUpdate(
            lockId,
            { $inc: { attempts: 1 }},
            { "new": true }
         ).then((attemptResult) => {
            if (attemptResult.attempts >= 3) {
              // If the user fails 3 attempts, lock them out
              Encrypt.findByIdAndUpdate(
                lockId,
                { active: false, locked: Moment().add(1, 'hour') },
                { "new": true },
                (err, lockResult) => {
                  if (err) {
                    return;
                  }
                  res.send({ lockId: lockResult._id, locked: lockResult.locked, decryptedData: false });
                }
             );
            } else {
              res.send({ lockId: attemptResult._id, attempts: attemptResult.attempts, decryptedData: false });
            }
          });
        }
      } else {
        res.redirect('/');
      }
    });
  });
};
const mongoose = require('mongoose');
const Encrypt = mongoose.model('locks');
const Moment = require('moment');
const CryptoJS = require('crypto-js');
const { parse } = require('flatted/cjs');

module.exports = app => {
  app.post('/api/check_url', async (req, res) => {
    const { url } = req.body;
    console.log('url', url);
    Encrypt.findOne({ 
      url: url
    }, (err, { _id, active, locked }) => {
      console.log("found", { _id, active, locked });
      if ( _id && active && !locked ) {
        // We got everything, send them the info
        res.send({ lockId: _id });
      }
      else if ( locked ) {
        // Inform the user how long they are locked out for
        res.send({ locked: locked });
      }
      else {
        // Failed to find a result
        res.redirect("/404");
      }
    });
  });

  app.post('/api/decrypt_attempt', async (req, res) => {
    const { lockId, passcode } = req.body;
    console.log("decryptroutes lockId", lockId);
    console.log("decryptroutes passcode", passcode);
    // Let's take the value and decrypt it
    console.log("lockid", lockId);
    Encrypt.findOne({ 
      '_id': lockId
    }).then(( data ) => {
      if ( data ) {
        const { title, encryptedData, active, locked } = data;
        console.log('decrypt attempt', {encryptedData, active, locked});
        // TODO: REFACTOR
        if ( active ) {
          try {
            // If the passcode is correct, decrypt the data and delete lock.
            const parsedData = parse(encryptedData);
            let bytes = CryptoJS.AES.decrypt(parsedData, passcode.passcode.toString());
            let decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
            Encrypt.findByIdAndDelete(lockId);
            // Add in the title for simplicity elsewhere
            Object.assign(decryptedData, { title });
            res.send({ decryptedData });
          } catch(e) {
            // Failed to find a result
            Encrypt.findByIdAndUpdate(
              lockId,
              { $inc: { attempts: 1 }},
              { "new": true }
            ).then(( attemptResult ) => {
              if ( attemptResult.attempts >= 3 ) {
                // If the user fails 3 attempts, lock them out
                Encrypt.findByIdAndUpdate(
                  lockId,
                  { active: false, locked: Moment().add(1, 'hour') },
                  { "new": true },
                  (err, lockResult) => {
                    if (err) {
                      console.log('Error', err);
                      return;
                    }
                    res.send({ lockId: lockResult._id, locked: lockResult.locked });
                  }
                );
              } else {
                res.send({ lockId: attemptResult._id, attempts: attemptResult.attempts });
              }
            });
          }
        } else {
          res.send({ locked: locked });
        }
      } else {
        console.log("nothing found");
        res.redirect("/404");
      }
    });
  });
};
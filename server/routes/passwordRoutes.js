const mongoose = require('mongoose');
const Password = mongoose.model('passwords');

module.exports = app => {
  app.post('/api/password', (req, res) => {
    const { _user, title, data, expiry, used, active } = req.body;

    const password = new Password({
      _user,
      title,
      data,
      expiry,
      used,
      active
    });

    password.save();
  });
};
const keys = require('../config/keys');
const stripe = require('stripe')(keys.stripeSecretKey);
const requireLogin = require('../middlewares/requireLogin');

module.exports = app => {
  app.post(
    '/api/stripe', requireLogin, async (req, res) => {
      if (!req.user) {
        return res.status(401).send({ error: 'You need to be logged in to make payments to locc.it'})
      }

      // Charge for purchase
      stripe.charges.create({
        amount: 500,
        currency: 'usd',
        description: 'Payment for premium membership with locc.it',
        source: req.body.id
      }, async (err, charge) => {
        if(charge.status === 'succeeded') {
          // Update the user to be premium
          req.user.membership = 'Premium';
          req.user.membershipDuration = 30;
          req.user.paymentDate = + new Date();
          const user = await req.user.save();
          res.send(user);
        }
        else {
          res.send({Error: err});
        }
      });
    }
  );
}
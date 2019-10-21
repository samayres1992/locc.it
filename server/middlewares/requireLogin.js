module.exports = (req, res, next) => {
  if(!req.user) {
    return res.status(401).send({ error: 'You need to be logged in to make payments to locc.it'});
  }
  next();
};
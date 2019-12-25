module.exports = (req, res, next) => {
  if(!req.isAuthenticated()) {
    return res.status(401).send({ errors: 'You need to be logged in to perform this action.'});
  }
  next();
};
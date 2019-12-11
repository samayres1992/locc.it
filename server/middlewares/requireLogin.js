module.exports = (req, res, next) => {
  if(!req.user) {
    return res.status(401).send({ error: 'You need to be logged in to perform this action.'});
  }
  next();
};
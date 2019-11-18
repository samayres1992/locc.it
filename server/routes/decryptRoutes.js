module.exports = app => {
  app.get('/decrypt/*', async (req, res) => {
    res.send("123");
  });
};
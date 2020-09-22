const config = require('config');

module.exports = (app) => {
  const serverConfig = config.get('server');
  const context = serverConfig.context;

  app.get(encodeURI(context + '/health'), (req, res) => {
    res.json({ status: 'UP' });
  });
};

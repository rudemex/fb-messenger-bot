const signale = require('../utils/signale');
const config = require('config');

module.exports = (app) => {
    const serverConfig = config.get('server');
    const context = serverConfig.context;

    app.get(encodeURI(context + '/health'), (req, res) => {
        signale.info('API HEALTH');
        res.json({ status: 'UP' });
    });
}
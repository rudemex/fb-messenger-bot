const { Signale } = require('signale-logger');
const config = require('config');

const secrets = config.get('params').secrets;
/*
* Signale Types:
* error, fatal, fav, info, star, success, wait, warn, complete, pending, note, start, pause, debug, await, watch, log
*
* Used Type:
* success, error, info, note
* */

const options = {
  secrets: secrets ? secrets.split(',') : [],
  types: {
    santa: {
      badge: '🎅',
      color: 'red',
      label: 'santa',
      logLevel: 'info'
    }
  }
};

module.exports = new Signale(options);

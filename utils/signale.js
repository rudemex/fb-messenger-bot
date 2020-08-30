const {Signale} = require('signale-logger');

/*
* Signale Types:
* error, fatal, fav, info, star, success, wait, warn, complete, pending, note, start, pause, debug, await, watch, log
*
* Used Type:
* success, error, info, note
* */

const options = {
    types: {
        santa: {
            badge: '🎅',
            color: 'red',
            label: 'santa',
            logLevel: 'info'
        }
    },
};

module.exports = new Signale(options);

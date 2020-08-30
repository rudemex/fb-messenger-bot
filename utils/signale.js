const {Signale} = require('signale-logger');

/*
* Signale Types:
* error, fatal, fav, info, star, success, wait, warn, complete, pending, note, start, pause, debug, await, watch, log
*
* Used Type:
* success, error, info, note
* */

const secureID = ['3172896426164477','102854611541230','100054364543925','1220895001581500','101843218318136'];

const options = {
    secrets: [...secureID],
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

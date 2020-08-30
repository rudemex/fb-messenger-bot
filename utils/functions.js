const config = require('config');
const request = require('request');
const signale = require('./signale');

const servicesConfig = config.get('services');
const paramsConfig = config.get('params');

const isDefined = (obj) => {
  if (typeof obj == 'undefined') {
    return false;
  }

  if (!obj) {
    return false;
  }

  return obj != null;
};

const doSubscribeRequest = () => {
  request(
    {
      method: 'POST',
      uri: `${servicesConfig.fbApiUrl}/${paramsConfig.fbApiVersion}/me/subscribed_apps?access_token=${paramsConfig.accessToken}&subscribed_fields=${paramsConfig.subscribedFields}`,
    },
    (error, response, body) => {
      if (error) {
        signale.error({
          prefix: `[subscribe] ERROR`,
          message: `Error while subscription: ${error}`,
        });
      } else {
        signale.success({
          prefix: `[subscribe] RESPONSE`,
          message: `Subscription result: ${response.body}`,
        });
      }
    }
  );
};

const typingOn = (senderId) => {
  request(
    {
      url: `${servicesConfig.fbApiUrl}/${paramsConfig.fbApiVersion}/me/messages`,
      qs: { access_token: paramsConfig.accessToken },
      method: 'POST',
      json: {
        recipient: { id: senderId },
        sender_action: 'typing_on',
      },
    },
    (error, response, body) => {
      if (error) {
        signale.error({
          prefix: `[typingOn] ERROR`,
          message: error,
        });
      } else {
        signale.success({
          prefix: `[typingOn] RESPONSE`,
          message: response.body,
        });
      }
    }
  );
};

const typingOff = (senderId) => {
  request(
    {
      url: `${servicesConfig.fbApiUrl}/${paramsConfig.fbApiVersion}/me/messages`,
      qs: { access_token: paramsConfig.accessToken },
      method: 'POST',
      json: {
        recipient: { id: senderId },
        sender_action: 'typing_off',
      },
    }, (error, response, body) => {
      if (error) {
        signale.error({
          prefix: `[typingOff] ERROR`,
          message: error,
        });
      } else {
        signale.success({
          prefix: `[typingOff] RESPONSE`,
          message: response.body,
        });
      }
    }
  );
};

const sendMessage = (data) => {
  console.log(data)
  typingOn(data.recipient.id);
  request(
    {
      url: `${servicesConfig.fbApiUrl}/${paramsConfig.fbApiVersion}/me/messages`,
      qs: { access_token: paramsConfig.accessToken },
      method: 'POST',
      json: data,
    }, (error, response, body) => {
      typingOff(data.recipient.id);
      if (error) {
        signale.error({
          prefix: `[sendMessage] ERROR`,
          message: error,
        });
      } else {
        signale.success({
          prefix: `[sendMessage] RESPONSE`,
          message: response.body,
        });
      }
    }
  );
};

module.exports = {
  isDefined,
  doSubscribeRequest,
  typingOn,
  typingOff,
  sendMessage,
};

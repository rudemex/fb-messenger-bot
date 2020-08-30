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
  return new Promise((resolve, reject) => {
    request(
        {
          method: 'POST',
          uri: `${servicesConfig.fbApiUrl}/${paramsConfig.fbApiVersion}/me/subscribed_apps?access_token=${paramsConfig.accessToken}&subscribed_fields=${paramsConfig.subscribedFields}`,
        }, (error, response, body) => {
          try {
            response.body = JSON.parse(response.body);
            if (response.body.success) {
              resolve(response.body);
            } else {
              reject(response.body.error);
            }
          } catch (error) {
            signale.error({
              prefix: `[subscribe] ERROR`,
              message: `Error while subscription: ${error}`,
            });
            reject(error);
          }
        }
    );
  });
};

const eventType = (event) => {
  let eventType;

  /*
  Atachment: event.message.attachments
  quick reply: event.message.quick_reply.payload
  text: event.message.text
  Postback: event.postback.payload
  */
  if(event.message){
    eventType = event.message.text ? 'text' : event.message.quick_reply ? 'quick_reply' : 'attachments';
  }else{
    // Delivery, read, optin and others, you must configure it in the webhook of the app administration and enable the subscription in the request (env)
    eventType = event.postback ? 'postback': event.read ? 'read' : event.delivery ? 'delivery' : event.optin ? 'optin': null;
  }

  return eventType;
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
          message: JSON.stringify(response.body),
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
    },
    (error, response, body) => {
      if (error) {
        signale.error({
          prefix: `[typingOff] ERROR`,
          message: error,
        });
      } else {
        signale.success({
          prefix: `[typingOff] RESPONSE`,
          message: JSON.stringify(response.body),
        });
      }
    }
  );
};

const sendMessage = (data) => {
  typingOn(data.recipient.id);
  request(
    {
      url: `${servicesConfig.fbApiUrl}/${paramsConfig.fbApiVersion}/me/messages`,
      qs: { access_token: paramsConfig.accessToken },
      method: 'POST',
      json: data,
    },
    (error, response, body) => {
      typingOff(data.recipient.id);
      if (error) {
        signale.error({
          prefix: `[sendMessage] ERROR`,
          message: error,
        });
      } else {
        signale.success({
          prefix: `[sendMessage] RESPONSE`,
          message: JSON.stringify(response.body),
        });
      }
    }
  );
};

module.exports = {
  isDefined,
  doSubscribeRequest,
  eventType,
  typingOn,
  typingOff,
  sendMessage,
};

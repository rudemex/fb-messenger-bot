const config = require('config');
const request = require('request');
const moment = require('moment-timezone');
const CryptoJS = require('crypto-js');
const signale = require('./signale');

const serverConfig = config.get('server');
const servicesConfig = config.get('services');
const paramsConfig = config.get('params');

const createSecretProof = () => {
  const { accessToken, appSecret } = paramsConfig;
  const { tz } = serverConfig;
  const time = (moment().tz(tz).format('X') | 0);
  const secret_proof = CryptoJS.HmacSHA256(`${accessToken}|${time}`, appSecret).toString(CryptoJS.enc.Hex);

  return { appsecret_time: time, appsecret_proof: secret_proof };
};

const generateQS = () => {
  const { accessToken, requireProof } = paramsConfig;
  const qs = {
    access_token: accessToken
  };

  if (requireProof) {
    Object.assign(qs, createSecretProof());
  }
  return { qs };
};

const doSubscribeRequest = () => {
  return new Promise((resolve, reject) => {
    const { fbApiUrl } = servicesConfig;
    const { fbApiVersion, subscribedFields } = paramsConfig;
    const defaultQS = generateQS().qs;
    request(
      {
        method: 'POST',
        uri: `${fbApiUrl}/${fbApiVersion}/me/subscribed_apps`,
        qs: Object.assign(defaultQS, {
          subscribed_fields: subscribedFields
        })
      },
      (error, response) => {
        try {
          response.body = JSON.parse(response.body);
          if (response.body.success) {
            resolve(response.body);
          } else {
            reject(response.body.error);
          }
        } catch (error) {
          signale.error({
            prefix: '[subscribe] ERROR',
            message: `Error while subscription: ${error}`
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
  read: event.read
  delivery: event.delivery
  optin: event.optin
  */

  if (event.message) {
    eventType = event.message.text
      ? 'text'
      : event.message.quick_reply
        ? 'quick_reply'
        : 'attachments';
  } else {
    // Delivery, read, optin and others, you must configure it in the webhook of the app administration and enable the subscription in the request (env)
    eventType = event.postback
      ? 'postback'
      : event.read
        ? 'read'
        : event.delivery
          ? 'delivery'
          : event.optin
            ? 'optin'
            : null;
  }

  return eventType;
};

const markSeen = (senderId) => {
  const { fbApiUrl } = servicesConfig;
  const { fbApiVersion } = paramsConfig;
  const defaultQS = generateQS().qs;
  request(
    {
      url: `${fbApiUrl}/${fbApiVersion}/me/messages`,
      qs: defaultQS,
      method: 'POST',
      json: {
        recipient: { id: senderId },
        sender_action: 'mark_seen'
      }
    },
    (error, response) => {
      if (error) {
        signale.error({
          prefix: '[markSeen] ERROR',
          message: error
        });
      } else {
        signale.success({
          prefix: '[markSeen] RESPONSE',
          message: JSON.stringify(response.body)
        });
      }
    }
  );
};

const typingOn = (senderId) => {
  const { fbApiUrl } = servicesConfig;
  const { fbApiVersion } = paramsConfig;
  const defaultQS = generateQS().qs;
  request(
    {
      url: `${fbApiUrl}/${fbApiVersion}/me/messages`,
      qs: defaultQS,
      method: 'POST',
      json: {
        recipient: { id: senderId },
        sender_action: 'typing_on'
      }
    },
    (error, response) => {
      if (error) {
        signale.error({
          prefix: '[typingOn] ERROR',
          message: error
        });
      } else {
        signale.success({
          prefix: '[typingOn] RESPONSE',
          message: JSON.stringify(response.body)
        });
      }
    }
  );
};

const typingOff = (senderId) => {
  const { fbApiUrl } = servicesConfig;
  const { fbApiVersion } = paramsConfig;
  const defaultQS = generateQS().qs;
  request(
    {
      url: `${fbApiUrl}/${fbApiVersion}/me/messages`,
      qs: defaultQS,
      method: 'POST',
      json: {
        recipient: { id: senderId },
        sender_action: 'typing_off'
      }
    },
    (error, response) => {
      if (error) {
        signale.error({
          prefix: '[typingOff] ERROR',
          message: error
        });
      } else {
        signale.success({
          prefix: '[typingOff] RESPONSE',
          message: JSON.stringify(response.body)
        });
      }
    }
  );
};

const sendConfigs = (reqMethod = 'POST', data) => {
  return new Promise((resolve, reject) => {
    const { fbApiUrl } = servicesConfig;
    const { fbApiVersion } = paramsConfig;
    const defaultQS = generateQS().qs;
    request(
      {
        url: `${fbApiUrl}/${fbApiVersion}/me/messenger_profile`,
        qs: defaultQS,
        method: reqMethod,
        json: data
      },
      (error, response) => {
        if (response.error) {
          signale.error({
            prefix: '[sendConfigs] ERROR',
            message: response.error
          });
          reject(response.error);
        } else {
          signale.success({
            prefix: '[sendConfigs] RESPONSE',
            message: JSON.stringify(response.body)
          });
          resolve(response.body);
        }
      }
    );
  });
};

const getUserData = (senderId) => {
  return new Promise((resolve, reject) => {
    const { fbApiUrl } = servicesConfig;
    const { fbApiVersion, userFields, accessToken } = paramsConfig;
    request(
      {
        url: `${fbApiUrl}/${fbApiVersion}/${senderId}`,
        qs: { fields: userFields },
        method: 'GET',
        auth: { bearer: accessToken }
      },
      (error, response) => {
        if (response.error) {
          signale.error({
            prefix: '[getRecipientData] ERROR',
            message: response.error
          });
          reject(response.error);
        } else {
          signale.success({
            prefix: '[getRecipientData] RESPONSE',
            message: JSON.stringify(response.body)
          });
          resolve(response.body);
        }
      }
    );
  });
};

const sendMessage = (data) => {
  return new Promise((resolve, reject) => {
    const { fbApiUrl } = servicesConfig;
    const { fbApiVersion } = paramsConfig;
    const defaultQS = generateQS().qs;
    typingOn(data.recipient.id);
    request(
      {
        url: `${fbApiUrl}/${fbApiVersion}/me/messages`,
        qs: defaultQS,
        method: 'POST',
        json: data
      },
      (error, response) => {
        typingOff(data.recipient.id);
        if (response.error) {
          signale.error({
            prefix: '[sendMessage] ERROR',
            message: response.error
          });
          reject(response.error);
        } else {
          signale.success({
            prefix: '[sendMessage] RESPONSE',
            message: JSON.stringify(response.body)
          });
          resolve(response.body);
        }
      }
    );
  });
};

module.exports = {
  generateQS,
  doSubscribeRequest,
  eventType,
  markSeen,
  typingOn,
  typingOff,
  sendConfigs,
  getUserData,
  sendMessage
};

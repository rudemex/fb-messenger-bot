const idx = require('idx');
const config = require('config');
const signale = require('./signale');
const functions = require('./functions');

const serverUrl = config.get('server.url');

// HANDLE MESSAGE
const message = (senderId, event) => {
  signale.note('HANDLE TEXT: ', event.text);
  const messageData = {
    recipient: {
      id: senderId
    },
    message: {
      text: 'Hola soy un bot de messenger y te invito a utilizar nuestro menu',
      quick_replies: [
        {
          content_type: 'text',
          title: 'Opcion 1',
          payload: 'OPTION_1_PAYLOAD'
        },
        {
          content_type: 'text',
          title: 'Opcion 2',
          payload: 'OPTION_2_PAYLOAD'
        }
      ]
    }
  };
  functions.sendMessage(messageData);
};

// HANDLE POSTBACK
const postback = (senderId, event) => {
  signale.note('HANDLE POSTBACK');
  const payload = idx(event, (_) => _.payload);

  switch (payload) {
  case 'GET_STARTED_PAYLOAD':
    signale.note('STARTED PAYLOAD');
    message(senderId, event);
    break;
  case 'OPTION_1_PAYLOAD':
    signale.note('OPTION 1 PAYLOAD');
    break;
  case 'OPTION_2_PAYLOAD':
    signale.note('OPTION 2 PAYLOAD');
    break;
  case 'GET_ID_MESSENGER_PAYLOAD':
    getUserID(senderId);
    break;
  default:
    signale.info('default postback');
    break;
  }
};

// Get ID
const getUserID = (senderId) => {
  const messageData = {
    recipient: {
      id: senderId
    },
    message: {
      text: `Your messenger id is *${senderId}* and you can try other functions from *${serverUrl}/api-docs*`
    }
  };
  functions.sendMessage(messageData);
};

// HANDLE QUICK REPLY
const quickReply = (senderId, event) => {
  signale.note('HANDLE QUICK-REPLY');
  const payload = idx(event, (_) => _.payload);

  switch (payload) {
  case 'OPTION_1_PAYLOAD':
    signale.info('OPCION 1');
    break;
  case 'OPTION_2_PAYLOAD':
    signale.info('OPCION 2');
    break;
  default:
    signale.info('default quick reply');
    break;
  }
};

// HANDLE ATTACHMENTS
const attachments = (senderId, event) => {
  signale.note('HANDLE ATTACHMENTS');
  /* console.log(event.text);
    console.log(event.attachments[0]);
    console.log(event.attachments[0].type);
    console.log(event.attachments[0].title);
    console.log(event.attachments[0].url);
    console.log(event.attachments[0].payload); */

  const attachmentType = idx(event, (_) => _.attachments[0].type);
  const attachmentUrl = idx(event, (_) => _.attachments[0].payload.url);

  switch (attachmentType.toLowerCase()) {
  case 'image':
    signale.info(attachmentType);
    signale.info(attachmentUrl);
    break;
  case 'video':
    signale.info(attachmentType);
    signale.info(attachmentUrl);
    break;
  case 'audio':
    signale.info(attachmentType);
    signale.info(attachmentUrl);
    break;
  case 'file':
    signale.info(attachmentType);
    signale.info(attachmentUrl);
    break;
  case 'location':
    signale.info(attachmentType);
    signale.info(attachmentUrl);
    break;
  default:
    signale.info(attachmentType);
    signale.info(encodeURI(event.message.attachments[0].url));
    break;
  }
};

module.exports = {
  message,
  postback,
  quickReply,
  attachments
};

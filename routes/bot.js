const config = require('config');
const bodyParser = require('body-parser');
const idx = require('idx');
const request = require('request');
const uuid = require('node-uuid');
const signale = require('../utils/signale');
const functions = require('../utils/functions');

module.exports = (app) => {
  const sessionIds = new Map();
  const serverConfig = config.get('server');
  const paramsConfig = config.get('params');
  const context = serverConfig.context;

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  const handleEvent = (event) => {
    signale.info({
      prefix: '[handleEvent] EVENT',
      message: JSON.stringify(event),
    });

    const senderId = idx(event, (_) => _.sender.id);
    const eventType = functions.eventType(event);

    signale.info({
      prefix: '[handleEvent] EVENT TYPE',
      message: eventType
    });

    if (!sessionIds.has(senderId)) {
      sessionIds.set(senderId, uuid.v4());
    }

    switch (eventType) {
      case 'postback':
        handlePostback(senderId, event.postback);
        break;
      case 'quick_reply':
        handleQuickReply(senderId, event.message.quick_reply);
        break;
      case 'attachments':
        handleAttachments(senderId, event.message);
        break;
      case 'text':
        handleMessage(senderId, event.message);
        break;
      default:
        // Event delivery and read
        break;
    }
  };

  // HANDLE MESSAGE
  const handleMessage = (senderId, event) => {
    signale.note('HANDLE TEXT: ', event.text);
    const messageData = {
      recipient: {
        id: senderId,
      },
      message: {
        text: 'Hola soy un bot de messenger y te invito a utilizar nuestro menu',
        quick_replies: [
          {
            content_type: 'text',
            title: 'Opcion 1',
            payload: 'OPTION_1_PAYLOAD',
          },
          {
            content_type: 'text',
            title: 'Opcion 2',
            payload: 'OPTION_2_PAYLOAD',
          },
        ],
      },
    };
    functions.sendMessage(messageData);
  };

  // HANDLE POSTBACK
  const handlePostback = (senderId, event) => {
    signale.note('HANDLE POSTBACK');
    const payload = idx(event, (_) => _.payload);

    switch (payload) {
      case 'GET_STARTED_PAYLOAD':
        signale.note('STARTED PAYLOAD');
        break;
      default:
        signale.info('default postback');
        break;
    }
  };

  // HANDLE QUICK REPLY
  const handleQuickReply = (senderId, event) => {
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
  const handleAttachments = (senderId, event) => {
    signale.note('HANDLE ATTACHMENTS');
    /*console.log(event.text);
    console.log(event.attachments[0]);
    console.log(event.attachments[0].type);
    console.log(event.attachments[0].title);
    console.log(event.attachments[0].url);
    console.log(event.attachments[0].payload);*/

    let attachmentType = idx(event, (_) => _.attachments[0].type);
    let attachmentUrl = idx(event, (_) => _.attachments[0].payload.url);

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
        console.log(attachmentUrl);
        break;
      case 'location':
        signale.info(attachmentType);
        signale.info(attachmentUrl);
        break;
      default:
        signale.info(attachmentType);
        signale.info(event.message.attachments[0].url);
        break;
    }
  };

  /*
    /!**
     * @swagger
     * definitions:
     *   segments:
     *      type: object
     *      properties:
     *          code:
     *              type: string
     *          name:
     *              type: string
     *!/
    /!**
     * @swagger
     * /segments:
     *   get:
     *     tags:
     *       - Segments
     *     name: Obtención de todos los segmentos.
     *     summary: Obtención de todos los segmentos.
     *     security:
     *       - bearerAuth: []
     *     consumes:
     *       - application/json
     *     produces:
     *       - application/json
     *     responses:
     *       '200':
     *          description: Consulta satisfactoria.
     *          schema:
     *              $ref: '#/definitions/segments'
     *       '409':
     *          description: Error generico.
     *       '5xx':
     *          description: Error generico en el servidor
     *!/
    app.get(encodeURI(context + '/segments'), async (req, res) => {
        signale.note('GET ALL SEGMENTS');
        functions.doSubscribeRequest();

        try {
            signale.success("SUCCESS");
        } catch (error) {
            signale.error('ERROR');
        }
    });*/

  app.get(encodeURI('/webhook/'), (req, res) => {
    if (req.query['hub.verify_token'] === paramsConfig.verifyToken) {
      res.send(req.query['hub.challenge']);
      setTimeout(() => {
        functions.doSubscribeRequest();
      }, 3000);
    } else {
      signale.error({
        prefix: '[webhook]',
        message: 'Error, wrong validation token',
      });
      res.send('Error, wrong validation token');
    }
  });

  app.post(encodeURI('/webhook/'), (req, res) => {
    try {
      const webhook_event = req.body.entry[0];
      if (webhook_event.messaging) {
        webhook_event.messaging.forEach((event) => {
          handleEvent(event);
        });
      }
      signale.success({
        prefix: '[webhook]',
        message: 'ok',
      });
      res.status(200).json({ status: 'ok' });
    } catch (err) {
      signale.error({
        prefix: '[webhook] ERROR',
        message: err,
      });
      res.status(400).json({ status: 'error', error: err });
    }
  });
};

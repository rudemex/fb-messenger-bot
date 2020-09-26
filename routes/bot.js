const config = require('config');
const bodyParser = require('body-parser');
const idx = require('idx');
const uuid = require('node-uuid');
const signale = require('../utils/signale');
const handle = require('../utils/handles');
const functions = require('../utils/functions');

module.exports = (app) => {
  const sessionIds = new Map();
  const serverConfig = config.get('server');
  const paramsConfig = config.get('params');
  const context = serverConfig.context;

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  const handleEvent = (event) => {
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
      handle.postback(senderId, event.postback);
      break;
    case 'quick_reply':
      handle.quickReply(senderId, event.message.quick_reply);
      break;
    case 'attachments':
      handle.attachments(senderId, event.message);
      break;
    case 'text':
      handle.message(senderId, event.message);
      break;
    default:
      // Event delivery and read
      break;
    }
  };

  /**
   * @swagger
   * definitions:
   *   get-webhook-400:
   *      type: object
   *      properties:
   *          message:
   *              type: string
   *          code:
   *              type: number
   *   get-webhook-409:
   *      type: object
   *      properties:
   *          message:
   *              type: string
   *          type:
   *              type: string
   *          code:
   *              type: number
   *          fbtrace_id:
   *              type: string
   */
  /**
   * @swagger
   * /webhook:
   *   get:
   *     tags:
   *       - Webhook
   *     name: Webhook to validate message.
   *     summary: Webhook to validate message.
   *     security:
   *       - bearerAuth: []
   *     consumes:
   *       - application/json
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: hub.verify_token
   *         in: query
   *         type: string
   *         required: true
   *         description: Token of verification.
   *     responses:
   *       '200':
   *          description: Consulta satisfactoria - hub.challenge - Generated by the Messenger Platform. Contains the expected response.
   *       '400':
   *          description: Error token.
   *          schema:
   *              $ref: '#/definitions/get-webhook-400'
   *       '409':
   *          description: Error subscription.
   *          schema:
   *              $ref: '#/definitions/get-webhook-409'
   *       '5xx':
   *          description: Error generico en el servidor
   */
  app.get(encodeURI(`${context}/webhook/`), (req, res) => {
    const { verifyToken } = paramsConfig;

    const mode = req.query['hub.mode '];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    if (mode === 'subscribe' && token === verifyToken) {
      setTimeout(() => {
        functions
          .doSubscribeRequest()
          .then((response) => {
            signale.success({
              prefix: '[subscribe] RESPONSE',
              message: `Subscription result: ${response.success}`
            });
            res.status(200).send(challenge);
          })
          .catch((error) => {
            signale.error({
              prefix: '[subscribe] ERROR',
              message: error.message
            });
            res.status(409).send(error);
          });
      }, 3000);
    } else {
      signale.error({
        prefix: '[webhook]',
        message: 'Error, wrong validation token'
      });
      res
        .status(400)
        .send({ code: 400, message: 'Error, wrong validation token' });
    }
  });

  app.post(encodeURI(`${context}/webhook/`), (req, res) => {
    try {
      const webhook_event = req.body.entry[0];
      if (webhook_event.messaging) {
        webhook_event.messaging.forEach((event) => {
          signale.success({
            prefix: '[webhook] EVENT RECEIVED',
            message: JSON.stringify(event)
          });
          handleEvent(event);
        });
      }
      res.status(200).send({ status: 'success' });
    } catch (err) {
      signale.error({
        prefix: '[webhook] ERROR',
        message: err
      });
      res.status(400).send({ code: 400, message: err });
    }
  });
};

const config = require('config');
const bodyParser = require('body-parser');
const signale = require('../utils/signale');
const functions = require('../utils/functions');

// Templates
const { TemplateMessage } = require('../templates/message');
const {
  TemplateAttachmentImage,
  TemplateAttachmentVideo,
  TemplateAttachmentAudio,
  TemplateAttachmentFile,
} = require('../templates/attachment');
const { TemplateQuickReply } = require('../templates/quickReply');
const { TemplateGeneric } = require('../templates/generic');
const { TemplateButton } = require('../templates/button');
const {
  TemplateMediaImage,
  TemplateMediaVideo,
} = require('../templates/media');
const { TemplateReceipt } = require('../templates/receipt');

module.exports = (app) => {
  const serverConfig = config.get('server');
  const context = serverConfig.context;

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  /**
   * @swagger
   * definitions:
   *   post-message-200:
   *      type: object
   *      properties:
   *         recipient_id:
   *              type: string
   *         message_id:
   *              type: string
   *         attachment_id:
   *              type: string
   *   post-message-400:
   *      type: object
   *      properties:
   *          error:
   *              type: object
   *              properties:
   *                  message:
   *                      type: string
   *                  type:
   *                      type: string
   *                  code:
   *                      type: number
   *                  error_subcode:
   *                      type: number
   *                  fbtrace_id:
   *                      type: string
   *   post-message-409:
   *      type: object
   *      properties:
   *          error:
   *              type: object
   *              properties:
   *                  message:
   *                      type: string
   *                  type:
   *                      type: string
   *                  code:
   *                      type: number
   *                  fbtrace_id:
   *                      type: string
   */
  /**
   * @swagger
   * /message:
   *   post:
   *     tags:
   *       - Messages
   *     name: Send message.
   *     summary: Send message.
   *     security:
   *       - bearerAuth: []
   *     consumes:
   *       - application/json
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: recipientId
   *         in: query
   *         type: string
   *         default: 3172896426164477
   *         required: true
   *         description: id recipient.
   *       - name: messageType
   *         in: query
   *         type: string
   *         required: true
   *         description: type message to send.
   *         enum: [ "text", "attachment-image", "attachment-video", "attachment-audio", "attachment-file", "quickReply", "template-generic", "template-button", "template-media-image", "template-media-video", "template-receipt"]
   *     responses:
   *       '200':
   *          description: Consulta satisfactoria.
   *          schema:
   *              $ref: '#/definitions/post-message-200'
   *       '400':
   *          description: Error send message.
   *          schema:
   *              $ref: '#/definitions/post-message-400'
   *       '409':
   *          description: Error subscription.
   *          schema:
   *              $ref: '#/definitions/post-message-409'
   *       '5xx':
   *          description: Error generico en el servidor
   */
  app.post(encodeURI(`${context}/message`), (req, res) => {
    let recipientId = encodeURI(req.query.recipientId);
    let messageType = encodeURI(req.query.messageType);
    let messageData;
    switch (messageType) {
      case 'text':
        messageData = {
          recipient: {
            id: recipientId,
          },
          message: TemplateMessage,
        };
        break;
      case 'attachment-image':
        messageData = {
          recipient: {
            id: recipientId,
          },
          message: TemplateAttachmentImage,
        };
        break;
      case 'attachment-video':
        messageData = {
          recipient: {
            id: recipientId,
          },
          message: TemplateAttachmentVideo,
        };
        break;
      case 'attachment-audio':
        messageData = {
          recipient: {
            id: recipientId,
          },
          message: TemplateAttachmentAudio,
        };
        break;
      case 'attachment-file':
        messageData = {
          recipient: {
            id: recipientId,
          },
          message: TemplateAttachmentFile,
        };
        break;
      case 'quickReply':
        messageData = {
          recipient: {
            id: recipientId,
          },
          message: TemplateQuickReply,
        };
        break;
      case 'template-generic':
        messageData = {
          recipient: {
            id: recipientId,
          },
          message: TemplateGeneric,
        };
        break;
      case 'template-button':
        messageData = {
          recipient: {
            id: recipientId,
          },
          message: TemplateButton,
        };
        break;
      case 'template-media-image':
        messageData = {
          recipient: {
            id: recipientId,
          },
          message: TemplateMediaImage,
        };
        break;
      case 'template-media-video':
        messageData = {
          recipient: {
            id: recipientId,
          },
          message: TemplateMediaVideo,
        };
        break;
      case 'template-receipt':
        messageData = {
          recipient: {
            id: recipientId,
          },
          message: TemplateReceipt,
        };
        break;
    }

    functions
      .sendMessage(messageData)
      .then((response) => {
        if (!response.error) {
          signale.success({
            prefix: `[sendMessage] RESPONSE`,
            message: response,
          });
          res.status(200).send(response);
        } else {
          signale.error({
            prefix: '[sendMessage] ERROR',
            message: response.error,
          });
          res.status(400).send(response.error);
        }
      })
      .catch((error) => {
        signale.error({
          prefix: `[sendMessage] ERROR`,
          message: error,
        });
        res.status(409).send(error);
      });
  });
};

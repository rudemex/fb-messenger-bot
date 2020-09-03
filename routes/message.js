const config = require('config');
const bodyParser = require('body-parser');
const path = require('path');
const signale = require('../utils/signale');
const functions = require('../utils/functions');

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
   *       - name: templateMessage
   *         in: query
   *         type: string
   *         required: true
   *         description: template message to send.
   *         enum: [ "text", "attachment", "quickReply"]
   *     responses:
   *       '200':
   *          description: Consulta satisfactoria.
   *          schema:
   *              $ref: '#/definitions/post-message-200'
   *       '409':
   *          description: Error subscription.
   *          schema:
   *              $ref: '#/definitions/post-message-409'
   *       '5xx':
   *          description: Error generico en el servidor
   */
  app.post(encodeURI(`${context}/message`), (req, res) => {
    let recipientId = encodeURI(req.query.recipientId);
    let templateMessage = encodeURI(req.query.templateMessage);
    let messageData;
    switch (templateMessage) {
      case 'text':
        messageData = {
          recipient: {
            id: recipientId,
          },
          message: {
            text: 'Hola mundo!',
          },
        };
        break;
      case 'attachment':
        messageData = {
          recipient: {
            id: recipientId,
          },
          message: {
            attachment: {
              type: 'image',
              payload: {
                url: `https://images.unsplash.com/photo-1527430253228-e93688616381?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=891&q=80`,
                is_reusable: true,
              },
            },
          },
        };
        break;
      case 'quickReply':
        messageData = {
          recipient: {
            id: recipientId,
          },
          message: {
            text: 'Seleccione una opción',
            quick_replies: [
              {
                content_type: 'text',
                title: 'Opc 1',
                payload: 'OPC_1_PAYLOAD',
              },
              {
                content_type: 'text',
                title: 'Opc 2',
                payload: 'OPC_2_PAYLOAD',
                image_url:
                  'https://www.lavanguardia.com/r/GODO/LV/p5/WebSite/2018/06/22/Recortada/img_melies_20180622-173809_imagenes_lv_terceros_img_0691-knNG--656x656@LaVanguardia-Web.jpeg',
              },
              {
                content_type: 'text',
                title: 'Opc 3 🍀',
                payload: 'OPC_3_PAYLOAD',
              },
            ],
          },
        };
        break;
      case 'text':
        messageData = {
          recipient: {
            id: recipientId,
          },
          message: {
            text: 'Hola mundo!',
          },
        };
        break;
    }

    functions
      .sendMessage(messageData)
      .then((response) => {
        signale.success({
          prefix: `[sendMessage] RESPONSE`,
          message: response,
        });
        res.status(200).send(response);
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

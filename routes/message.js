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
   *         enum: [ "text", "attachment", "quickReply", "template-generic", "template-button", "template-media-image", "template-media-video", "template-receipt"]
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
                url: `${serverConfig.url}/static/assets/images/robot.jpg`,
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
                image_url: `${serverConfig.url}/static/assets/images/emoji-smile.jpeg`,
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
      case 'template-generic':
        messageData = {
          recipient: {
            id: recipientId,
          },
          message: {
            attachment: {
              type: 'template',
              payload: {
                template_type: 'generic',
                elements: [
                  {
                    title: 'Cool T-shirt',
                    image_url:`${serverConfig.url}/static/assets/images/tshirt-red.png`,
                    subtitle: 'this is a t-shirt very awesome',
                    buttons: [
                      {
                        type: 'postback',
                        title: 'Buy',
                        payload: 'DEVELOPER_DEFINED_PAYLOAD',
                      },
                      {
                        type: 'postback',
                        title: 'Start Chatting',
                        payload: 'DEVELOPER_DEFINED_PAYLOAD',
                      },
                    ],
                  },
                  {
                    title: 'Cool T-shirt',
                    image_url:`${serverConfig.url}/static/assets/images/tshirt-red.png`,
                    subtitle: 'this is a t-shirt very awesome',
                    buttons: [
                      {
                        type: 'postback',
                        title: 'Buy',
                        payload: 'DEVELOPER_DEFINED_PAYLOAD',
                      },
                      {
                        type: 'postback',
                        title: 'Start Chatting',
                        payload: 'DEVELOPER_DEFINED_PAYLOAD',
                      },
                    ],
                  },
                ],
              },
            },
          },
        };
        break;
      case 'template-button':
        messageData = {
          recipient: {
            id: recipientId,
          },
          message: {
            attachment: {
              type: 'template',
              payload: {
                template_type: 'button',
                text: 'What do you want to do next?',
                buttons: [
                  {
                    type: 'web_url',
                    url: 'https://www.messenger.com',
                    title: 'Visit Messenger',
                  },
                  {
                    type: 'postback',
                    title: 'Btn postback',
                    payload: 'BTN_POSTBACK_PAYLOAD',
                  },
                  {
                    type: 'phone_number',
                    title: 'Call Representative',
                    payload: '+15105551234',
                  },
                ],
              },
            },
          },
        };
        break;
      case 'template-media-image':
        messageData = {
          recipient: {
            id: recipientId,
          },
          message: {
            attachment: {
              type: 'template',
              payload: {
                template_type: 'media',
                elements: [
                  {
                    media_type: 'image',
                    url:
                      'https://www.facebook.com/enespanol/photos/a.398784743469240/857414157606294',
                    buttons: [
                      {
                        type: 'web_url',
                        url: 'https://www.facebook.com/enespanol',
                        title: 'View Website',
                      },
                    ],
                  },
                ],
              },
            },
          },
        };
        break;
      case 'template-media-video':
        messageData = {
          recipient: {
            id: recipientId,
          },
          message: {
            attachment: {
              type: 'template',
              payload: {
                template_type: 'media',
                elements: [
                  {
                    media_type: 'video',
                    url:
                      'https://www.facebook.com/185150934832623/videos/1131916223489418',
                    buttons: [
                      {
                        type: 'web_url',
                        url: 'https://www.facebook.com/enespanol',
                        title: 'View Website',
                      },
                    ],
                  },
                ],
              },
            },
          },
        };
        break;
      case 'template-receipt':
        messageData = {
          recipient: {
            id: recipientId,
          },
          message: {
            attachment: {
              type: 'template',
              payload: {
                template_type: 'receipt',
                recipient_name: 'Stephane Crozatier',
                order_number: '12345678902',
                currency: 'USD',
                payment_method: 'Visa 2345',
                order_url: 'https://mystore.com/order?order_id=123456',
                timestamp: '1428444852',
                address: {
                  street_1: '1 Hacker Way',
                  street_2: '',
                  city: 'Menlo Park',
                  postal_code: '94025',
                  state: 'CA',
                  country: 'US',
                },
                summary: {
                  subtotal: 75.0,
                  shipping_cost: 4.95,
                  total_tax: 6.19,
                  total_cost: 56.14,
                },
                adjustments: [
                  {
                    name: 'New Customer Discount',
                    amount: 20,
                  },
                  {
                    name: '$10 Off Coupon',
                    amount: 10,
                  },
                ],
                elements: [
                  {
                    title: 'Classic White T-Shirt',
                    subtitle: '100% Soft and Luxurious Cotton',
                    quantity: 2,
                    price: 50,
                    currency: 'USD',
                    image_url:`${serverConfig.url}/static/assets/images/tshirt-red.png`,
                  },
                  {
                    title: 'Classic Gray T-Shirt',
                    subtitle: '100% Soft and Luxurious Cotton',
                    quantity: 1,
                    price: 25,
                    currency: 'USD',
                    image_url:`${serverConfig.url}/static/assets/images/tshirt-red.png`,
                  },
                ],
              },
            },
          },
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

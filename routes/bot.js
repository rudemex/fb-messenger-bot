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
      prefix: '[handleEvent] EVENT: ',
      message: event,
    });

    const senderId = idx(event, (_) => _.sender.id);

    if (!sessionIds.has(senderId)) {
      sessionIds.set(senderId, uuid.v4());
    }

    if (event.message) {
      signale.info('EVENT MESSAGE');
      handleMessage(senderId, event.message);
    } else if (event.postback) {
      signale.info('EVENT POSTBACK');
      handlePostback(senderId, event.postback);
    }

    /*if ((event.message && event.message.text) || (event.postback && event.postback.payload)) {
      const text = event.message ? event.message.text : event.postback.payload;
      console.log('[i] TEXT: ', text);
      // Handle a text message from this sender
      switch (text) {
        case 'GET_STARTED_PAYLOAD':
          console.log('[i] STARTED PAYLOAD');
          break;
        default:
          /!*if(event.message.quick_reply){
                        console.log('[i] QUICK REPLY: ',event.message.quick_reply.payload);

                        if(event.message.quick_reply.payload == 'RECIPE_SOUP'){
                            console.log('[i] RUN RECIPE SOUP');
                            startRecipeSoup(sender)
                        }else if(event.message.quick_reply.payload == 'CUSTOMER_SERVICE'){
                            console.log('[i] CALL TO CUSTOMER SERVICE');
                            callCustomerService(sender);
                        }else if( event.message.quick_reply.payload == 'YES_CELIAC_SOUP'){
                            console.log('[i] CUSTOM SOUP FROM CELIAC');

                            customSoup[sender]['celiac'] = 1;

                            request({
                                url: API_URL+'/recipes/custom/celiac',
                                method: 'POST',
                                form: {
                                    'id_sender': sender,
                                    'celiac' : 1
                                }
                            }, function(error, response, body) {
                                var response = JSON.parse(body);
                                console.log('[r] RESP:',response);

                                setCustomSoupMain(sender)

                            });
                        }else if( event.message.quick_reply.payload == 'NO_CELIAC_SOUP'){
                            console.log('[i] CUSTOM SOUP NO CELIAC');

                            customSoup[sender]['celiac'] = 0;

                            request({
                                url: API_URL+'/recipes/custom/celiac',
                                method: 'POST',
                                form: {
                                    'id_sender': sender,
                                    'celiac' : 0
                                }
                            }, function(error, response, body) {
                                var response = JSON.parse(body);
                                console.log('[r] RESP:',response);

                                setCustomSoupMain(sender);

                            });
                        }else if( event.message.quick_reply.payload == 'VEGETARIAN_SOUP'){
                            console.log('[i] CUSTOM SOUP VEGETARIAN');

                            customSoup[sender]['main_ingredient'] = 'vegetales';

                            request({
                                url: API_URL+'/recipes/custom/main',
                                method: 'POST',
                                form: {
                                    'id_sender': sender,
                                    'main_ingredient' : 'vegetales'
                                }
                            }, function(error, response, body) {
                                var response = JSON.parse(body);
                                console.log('[r] RESP:',response);

                                setCustomSoupOther(sender);

                            });
                        }else if( event.message.quick_reply.payload == 'WITH_EAT_SOUP'){
                            console.log('[i] CUSTOM SOUP EAT');

                            customSoup[sender]['main_ingredient'] = 'carne';

                            request({
                                url: API_URL+'/recipes/custom/main',
                                method: 'POST',
                                form: {
                                    'id_sender': sender,
                                    'main_ingredient' : 'carne'
                                }
                            }, function(error, response, body) {
                                var response = JSON.parse(body);
                                console.log('[r] RESP:',response);

                                setCustomSoupOther(sender);

                            });
                        }

                    }else{

                    }*!/
          break;
      }
    } else {
      // ATTACHSMENTS ----------------------------------- //

      if (event.message.attachments) {
        console.log('[i] ATTACHMENTS IN MSG');
        console.log(event.message.text);
        console.log(event.message.attachments[0]);
        console.log(event.message.attachments[0].type);
        console.log(event.message.attachments[0].title);
        console.log(event.message.attachments[0].url);
        console.log(event.message.attachments[0].payload);
      }

      if (event.message.attachments[0]) {
        console.log('[i] ATTACHMENTS');
        console.log(event.message.attachments[0]);

        //LOCATION
        if (event.message.attachments[0].type === 'location') {
          let lat = event.message.attachments[0].payload.coordinates.lat;
          let lng = event.message.attachments[0].payload.coordinates.long;

          getTodaySoup(sender, lat, lng);
        }
      }
      // ----------------------------------------------- //
    }*/
  };

  const handleMessage = (senderId, event) => {
    if (event.text) {
      defaultMessage(senderId);
    } else if (event.attachments) {
      handleAttachments(senderId, event);
    }
  };

  const defaultMessage = (senderId) => {
    const messageData = {
      recipient: {
        id: senderId,
      },
      message: {
        text:
          'Hola soy un bot de messenger y te invito a utilizar nuestro menu',
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

  const handlePostback = (senderId, event) => {
    const payload = idx(event, (_) => _.payload);

    switch (payload) {
      case 'GET_STARTED_PAYLOAD':
        console.log('[i] STARTED PAYLOAD');
        break;
      default:
        console.log('default');
        break;
    }
  };

  const handleAttachments = (senderId, event) => {
    let attachment_type = event.attachments[0].type;
    switch (attachment_type.toLowerCase()) {
      case 'image':
        signale.info(attachment_type);
        break;
      case 'video':
        signale.info(attachment_type);
        break;
      case 'audio':
        signale.info(attachment_type);
        break;
      case 'file':
        console.log(attachment_type);
        break;
      case 'location':
        signale.info(attachment_type);
        break;
      default:
        signale.info(attachment_type);
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

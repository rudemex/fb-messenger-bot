const config = require('config');
const bodyParser = require('body-parser');
const signale = require('../utils/signale');
const functions = require('../utils/functions');

// Templates
const { btnGetStarted } = require('../docs/templates/configs/btnGetStarted');
const { greeting } = require('../docs/templates/configs/greeting');
const { persistentMenu } = require('../docs/templates/configs/persistentMenu');
const {
  deleteGetStarted,
  deleteGreeting,
  deletePersistentMenu,
  deleteAll
} = require('../docs/templates/configs/deleteConfigs');

module.exports = (app) => {
  const serverConfig = config.get('server');
  const context = serverConfig.context;

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  /**
   * @swagger
   * definitions:
   *   post-config-200:
   *      type: object
   *      properties:
   *         result:
   *              type: string
   *   post-config-400:
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
   *   post-config-409:
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
   *   delete-config-200:
   *      type: object
   *      properties:
   *         result:
   *              type: string
   *   delete-config-400:
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
   *   delete-config-409:
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
   * /config:
   *   post:
   *     tags:
   *       - Bot configurations
   *     name: Send configs to bot ex. button get started, persistent menu, etc.
   *     summary: Send configs to bot ex. button get started, persistent menu, etc.
   *     consumes:
   *       - application/json
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: configType
   *         in: query
   *         type: string
   *         required: true
   *         description: type config to send.
   *         enum: [ "btn_get_started", "greeting", "persistent_menu"]
   *     responses:
   *       '200':
   *          description: Consulta satisfactoria.
   *          schema:
   *              $ref: '#/definitions/post-config-200'
   *       '400':
   *          description: Error send message.
   *          schema:
   *              $ref: '#/definitions/post-config-400'
   *       '409':
   *          description: Error subscription.
   *          schema:
   *              $ref: '#/definitions/post-config-409'
   *       '5xx':
   *          description: Error generico en el servidor
   */
  app.post(encodeURI(`${context}/config`), (req, res) => {
    const configType = encodeURI(req.query.configType);
    const reqMethod = 'POST';
    let configData;

    switch (configType) {
    case 'btn_get_started':
      configData = btnGetStarted;
      break;
    case 'greeting':
      configData = greeting;
      break;
    case 'persistent_menu':
      configData = persistentMenu;
      break;
    }

    functions
      .sendConfigs(reqMethod, configData)
      .then((response) => {
        if (!response.error) {
          signale.success({
            prefix: `[sendConfigs] RESPONSE ${configType}`,
            message: response
          });
          res.status(200).send(response);
        } else {
          signale.error({
            prefix: `[sendConfigs] ERROR ${configType}`,
            message: response.error
          });
          res.status(400).send(response.error);
        }
      })
      .catch((error) => {
        signale.error({
          prefix: `[sendConfigs] ERROR ${configType}`,
          message: error
        });
        res.status(409).send(error);
      });
  });

  /**
   * @swagger
   * /config:
   *   delete:
   *     tags:
   *       - Bot configurations
   *     name: Delete configs to bot ex. button get started, persistent menu, etc.
   *     summary: Delete configs to bot ex. button get started, persistent menu, etc.
   *     consumes:
   *       - application/json
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: configType
   *         in: query
   *         type: string
   *         required: true
   *         description: type config to send.
   *         enum: ["get_started", "greeting", "persistent_menu", "all"]
   *     responses:
   *       '200':
   *          description: Consulta satisfactoria.
   *          schema:
   *              $ref: '#/definitions/delete-config-200'
   *       '400':
   *          description: Error send message.
   *          schema:
   *              $ref: '#/definitions/delete-config-400'
   *       '409':
   *          description: Error subscription.
   *          schema:
   *              $ref: '#/definitions/delete-config-409'
   *       '5xx':
   *          description: Error generico en el servidor
   */
  app.delete(encodeURI(`${context}/config`), (req, res) => {
    const configType = encodeURI(req.query.configType);
    const reqMethod = 'DELETE';
    let configData;

    switch (configType) {
    case 'get_started':
      configData = deleteGetStarted;
      break;
    case 'greeting':
      configData = deleteGreeting;
      break;
    case 'persistent_menu':
      configData = deletePersistentMenu;
      break;
    case 'all':
      configData = deleteAll;
      break;
    }

    functions
      .sendConfigs(reqMethod, configData)
      .then((response) => {
        if (!response.error) {
          signale.success({
            prefix: `[deleteConfigs] RESPONSE ${configType}`,
            message: response
          });
          res.status(200).send(response);
        } else {
          signale.error({
            prefix: `[deleteConfigs] ERROR ${configType}`,
            message: response.error
          });
          res.status(400).send(response.error);
        }
      })
      .catch((error) => {
        signale.error({
          prefix: `[deleteConfigs] ERROR ${configType}`,
          message: error
        });
        res.status(409).send(error);
      });
  });
};

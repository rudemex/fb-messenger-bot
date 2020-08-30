const MongoClient = require('mongodb').MongoClient;
const config = require('config');
const bodyParser = require('body-parser');
const xss = require('xss');
const signale = require('../utils/signale');

module.exports = (app, redis) => {
    const serverConfig = config.get('server');
    const paramsConfig = config.get('params');
    const context = serverConfig.context;
    const expireCache = parseInt(paramsConfig.expire);

    signale.info(`Expire Cache: ${expireCache}`);

    const mongoConfig = config.get('database');
    const databaseName = mongoConfig.databaseName;
    const mongoCollection = 'segments';
    //signale.info('DATABASE ENVS: ', mongoConfig);
    const mongo_url = encodeURI(
        `mongodb://${mongoConfig.username}:${mongoConfig.password}@${mongoConfig.server}:${mongoConfig.port}/${databaseName}`
    );

    const mongo_options = {
        useNewUrlParser: true,
        useUnifiedTopology: true
    };

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));

    const checkCache = (req, res, next) => {
        const code = encodeURI(req.params.code);

        redis.get(code, (err, data) => {
            if (err) {
                signale.error({
                    prefix: '[redis] GET ERROR',
                    message: err,
                });
                res.status(500).send(err);
            }
            //if no match found
            if (data != null) {
                signale.success({
                    prefix: '[redis] GET CACHE',
                    message: data,
                });
                res.status(200).send(data);
            } else {
                //proceed to next middleware function
                signale.info({
                    prefix: '[redis] GET CACHE',
                    message: `Doesen't exist ${code} in the Redis`,
                });
                next();
            }
        });
    };

    /**
     * @swagger
     * definitions:
     *   segments:
     *      type: object
     *      properties:
     *          code:
     *              type: string
     *          name:
     *              type: string
     */
    /**
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
     */
    app.get(encodeURI(context + '/segments'), async (req, res) => {
        signale.note('GET ALL SEGMENTS');

        const client = await MongoClient.connect(mongo_url, mongo_options).catch(
            (error) => {
                signale.error({
                    prefix: '[mongoClient] ERROR',
                    message: error,
                });
                res.status(409).send({ error_message: `Error inesperado: ${error}` });
            }
        );

        if (!client) {
            signale.error({
                prefix: '[mongoClient] ERROR',
                message: 'Error inesperado: not client',
            });
            res.status(409).send({ error_message: 'Error inesperado: not client' });
            return;
        }

        try {
            const db = client.db(databaseName); // seteo de base de datos
            let collection = db.collection(mongoCollection);

            collection.find().toArray((err, items) => {
                signale.success({
                    prefix: '[mongo] FIND ITEMS',
                    message: items,
                });
                res.status(200).send(xss(JSON.stringify(items)));
                client.close();
            });
        } catch (error) {
            signale.error({
                prefix: '[mongo] ERROR',
                message: error,
            });
            res.status(409).send({ error_message: `Error inesperado: ${error}` });
        }
    });

    /**
     * @swagger
     * /segments/{code}:
     *   get:
     *     tags:
     *       - Segments
     *     name: Obtención del segmento por código.
     *     summary: Obtención del segmento por código
     *     security:
     *       - bearerAuth: []
     *     consumes:
     *       - application/json
     *     produces:
     *       - application/json
     *     parameters:
     *       - name: code
     *         in: path
     *         type: string
     *         required: false
     *     responses:
     *       '200':
     *          description: Consulta satisfactoria.
     *          schema:
     *              $ref: '#/definitions/segments'
     *       '409':
     *          description: Error generico.
     *       '5xx':
     *          description: Error generico en el servidor
     */
    app.get(encodeURI(context + '/segments/:code'), checkCache, async (req, res) => {
            signale.note('GET SEGMENT BY CODE');

            const code = req.params.code;

            const client = await MongoClient.connect(mongo_url, mongo_options).catch((error) => {
                signale.error({
                    prefix: '[mongoClient] ERROR',
                    message: error,
                });
                res.status(409).send({ error_message: `Error inesperado: ${error}` });
            });

            if (!client) {
                signale.error({
                    prefix: '[mongoClient] ERROR',
                    message: 'Error inesperado: not client',
                });
                res.status(409).send({ error_message: 'Error inesperado: not client' });
                return;
            }

            try {
                const db = client.db(databaseName); // seteo de base de datos
                let collection = db.collection(mongoCollection);

                collection.findOne({ code: code }, (err, item) => {
                    if (!err) {
                        if (item) {
                            signale.success({
                                prefix: '[mongo] FIND ITEM',
                                message: item,
                            });

                            const saveInRedis = redis.setex(code, expireCache || 2592000, JSON.stringify(item));

                            if(saveInRedis){
                                signale.success({
                                    prefix: '[redis] SAVE',
                                    message: `Save data of ${code} in redis`,
                                });
                            }else{
                                signale.error({
                                    prefix: '[redis] ERROR',
                                    message: `Don't save data of ${code} in redis`,
                                });
                            }

                            res.status(200).send(xss(JSON.stringify(item)));
                        } else {
                            signale.error({
                                prefix: '[mongo] ERROR',
                                message: "Doesen't exist",
                            });
                            res.status(404).send(null);
                        }
                    } else {
                        signale.error({
                            prefix: '[mongo] ERROR',
                            message: err,
                        });
                        res.status(409).send({ error_message: `Error inesperado: ${err}` });
                    }

                    client.close();
                });
            } catch (error) {
                signale.error({
                    prefix: '[mongo] ERROR',
                    message: error,
                });
                res.status(409).send({ error_message: `Error inesperado: ${error}` });
            }
        }
    );

    /**
     * @swagger
     * /segments/{code}:
     *   put:
     *     tags:
     *       - Segments
     *     name: Update del segmento por código.
     *     summary: Update del segmento por código
     *     security:
     *       - bearerAuth: []
     *     consumes:
     *       - application/json
     *     produces:
     *       - application/json
     *     parameters:
     *       - name: code
     *         in: path
     *         type: string
     *         required: false
     *     responses:
     *       '200':
     *          description: Consulta satisfactoria.
     *          schema:
     *              $ref: '#/definitions/segments'
     *       '409':
     *          description: Error generico.
     *       '5xx':
     *          description: Error generico en el servidor
     */
    app.put(encodeURI(context + '/segments/:code'), async (req, res) => {
        signale.note('UPDATE SEGMENT BY CODE');
        const code = req.params.code;

        const client = await MongoClient.connect(mongo_url, mongo_options).catch((error) => {
            signale.error({
                prefix: '[mongoClient] ERROR',
                message: error,
            });
            res.status(409).send({ error_message: `Error inesperado: ${error}` })
        });

        if (!client) {
            signale.error({
                prefix: '[mongoClient] ERROR',
                message: 'Error inesperado: not client',
            });
            res.status(409).send({ error_message: 'Error inesperado: not client' });
            return;
        }

        try {
            const db = client.db(databaseName); // seteo de base de datos
            let collection = db.collection(mongoCollection);

            collection.findOne({ code: code }, (err, item) => {
                if (!err) {
                    if (item) {
                        signale.success({
                            prefix: '[mongo] FIND ITEM',
                            message: item,
                        });

                        const saveInRedis = redis.setex(code, expireCache || 2592000, JSON.stringify(item));

                        if(saveInRedis){
                            signale.success({
                                prefix: '[redis] SAVE',
                                message: `Save data of ${code} in redis`,
                            });
                        }else{
                            signale.error({
                                prefix: '[redis] ERROR',
                                message: `Don't save data of${code} in redis`,
                            });
                        }

                        res.status(200).send(xss(JSON.stringify(item)));

                    } else {
                        signale.error({
                            prefix: '[mongo] ERROR',
                            message: "Doesen't exist",
                        });
                        res.status(404).send(null);
                    }
                } else {
                    signale.error({
                        prefix: '[mongo] ERROR',
                        message: err,
                    });
                    res.status(409).send({ error_message: `Error inesperado: ${err}` });
                }

                client.close();
            });
        } catch (error) {
            signale.error({
                prefix: '[mongo] ERROR',
                message: error,
            });
            res.status(409).send({ error_message: `Error inesperado: ${error}` });
        }
    });

};

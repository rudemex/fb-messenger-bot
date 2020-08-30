const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const pjson = require('./package.json');
const signale = require('./utils/signale');

const swagger =  (app, config) => {

    const swaggerDefinition = {
        info: {
            title: `${pjson.name}`,
            version: `${pjson.version}`,
            description: `Swagger - ${pjson.description}`,
        },

        basePath: config.context
    };

    const options = {
        swaggerDefinition,
        apis: ['./routes/*.js'],
    };
    const swaggerSpec = swaggerJSDoc(options);
    app.get('/swagger.json', (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        res.send(swaggerSpec);
    });
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
    signale.info("Swagger is enabled in : /api-docs ");
}

module.exports = swagger;
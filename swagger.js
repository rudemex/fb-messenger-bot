const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const swagger =  (app, config) => {

    const swaggerDefinition = {
        info: {
            title: 'API Segmento - Swagger API',
            version: '1.0.0',
            description: 'API Segmento - Endpoints',
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
    console.log("Swagger is enabled in : /api-docs ");
}

module.exports = swagger;
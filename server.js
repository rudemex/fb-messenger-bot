'use strict';
const config = require('config');
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const swagger = require('./swagger');
const routes = require('./routes/routes');
const signale = require('./utils/signale');
const pjson = require('./package.json');

const serverConfig = config.get('server');
const swaggerConfig = config.get('swagger');

const port = parseInt(serverConfig.port, 10) || 8080;
const cors_options_enabled = {
  origin: serverConfig.origins,
  methods: 'GET,HEAD,PUT,POST,DELETE,PATCH',
  credentials: true,
  allowedHeaders:
    'Content-Type,Authorization,Set-Cookie,Access-Control-Allow-Origin,Cache-Control,Pragma,id_channel'
};
const cors_options_disabled = {
  origin: '*',
  methods: 'GET,HEAD,PUT,POST,DELETE,PATCH',
  credentials: false,
  allowedHeaders:
    'Content-Type,Authorization,Set-Cookie,Access-Control-Allow-Origin,Cache-Control,Pragma,id_channel'
};

// signale.info("Using config: ", config);

const app = express();

app.set('port', port);
app.use('/static', express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use((req, res, next) => {
  const output_reqHeaders = {
    output: req.headers
  };

  const output_reqBody = {
    output: req.body
  };

  if (serverConfig.showLogInterceptor == 'true') {
    signale.info('Interceptor: REQUEST to ', encodeURI(req.url));
    signale.info('Interceptor: REQUEST HEADERS ', output_reqHeaders);
    signale.info('Interceptor: REQUEST BODY ', output_reqBody);
  }

  const whitelist = serverConfig.origins;
  const origin = req.headers.origin;

  if (serverConfig.corsEnabled == 'true' && whitelist.indexOf(origin) > -1) {
    res.header('Access-Control-Allow-Origin', req.headers.origin);
    res.header(
      'Access-Control-Allow-Methods',
      'GET,HEAD,PUT,POST,DELETE,PATCH,OPTIONS'
    ); //
    res.header(
      'Access-Control-Allow-Headers',
      'Content-Type,Authorization,Set-Cookie,Access-Control-Allow-Origin,Cache-Control,Pragma,id_channel'
    );
    res.header('Access-Control-Allow-Credentials', 'true');
  }

  next();
});

if (serverConfig.corsEnabled == 'true') {
  signale.info('Using cors config: ', cors_options_enabled);
  app.use(cors(cors_options_enabled));
} else {
  signale.info('Using cors config: ', cors_options_disabled);
  app.use(cors(cors_options_disabled));
}

if (swaggerConfig.enabled == 'true') {
  swagger(app, serverConfig);
}

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

routes(app, pjson.version);

app.listen(app.get('port'), () => {
  signale.info(`Version: ${pjson.version}`);
  signale.success(`App running on port: ${app.get('port')}`);
});

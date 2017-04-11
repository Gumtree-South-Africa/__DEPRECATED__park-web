'use strict';

// Modules ===========================================================
var apiProxy = require('./rest-api-proxy-service')
  , appServerConfig = require('../config/app-server-config')
  , logger = require('winston')
  , fs = require('fs')
  , bodyParser = require('body-parser')
  , accounting = require('accounting');

module.exports = function (app) {

  // client config to be sent to the web
  app.get('/api/config/app-config', function (req, res) {
    let appClientConfig = require('../config/app-client-config');
    // set environemnet dependent variables
    appClientConfig.facebook = {
      clientId : appServerConfig.facebook.clientId,
      clientSecret : appServerConfig.facebook.clientSecret
    };
    appClientConfig.googleAnalyticsTrackingId = appServerConfig.googleAnalyticsTrackingId;
    appClientConfig.smartBanner.branchId = appServerConfig.branchIOId;
    res.send('var appConfig = ' + JSON.stringify(appClientConfig));
  });

  // Close Proxy Server ======================================================
  app.use('/api', require('./proxy-api-server'));


  app.use(bodyParser.json());
  app.use(bodyParser.json({type: 'application/vnd.api+json'}));

  // app.use('/api', require('./proxy-local-server'));

  // Server status
  app.get('/boot/status', function(req, res, next) {
    res.send('OK');
  });

  // Close API Redirects =====================================================
  app.use('/', require('./routes/redirects'));

  // No JS =====================================================
  app.use('/', require('./routes/no-js'));

  // Location Stuff ==========================================================
  app.use('/api-locations', require('./routes/location-routes'));

  // Close API Auth ==========================================================
  app.use('/auth', require('./routes/auth-routes'));

  // Close API Items =========================================================
  //app.use('/auth', require('./routes/items'));

  // Close API Usage =========================================================
  // frontend routes =========================================================
  //several libs are calling '/favicon.ico'
  app.get('/app.version', function (req, res) {
    var uri = `/health/v3/probe`;
    apiProxy.get(uri)
    .then(status => res.send({ 'web-version' : {version: appServerConfig.version}, 'backend-version': status }))
    .catch(error => res.send({'backend-version': 'service down'}))
  });

  // frontend routes =========================================================
  //several libs are calling '/favicon.ico'
  app.get('/favicon.ico', function (req, res) {
    res.sendfile('./dist/images/favicon.ico');
  });

  // route to handle all angular requests
  app.get('*', function (req, res) {
    logger.log('verbose', '[WEB] - handle angular request: %s', req.originalUrl);
    res.sendfile('./dist/index.html');
  });
};

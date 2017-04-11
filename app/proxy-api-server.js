/**
 * Created by neto on 14/03/16.
 */
'use strict';

var http = require('http')
  , httpProxy = require('http-proxy')
  , express = require('express')
  , router = express.Router()
  , jwt = require('jwt-simple')
  , appServerConfig = require('../config/app-server-config')
  , logger = require('winston');

let proxy = httpProxy.createProxyServer({target: appServerConfig.restApiUrl});

proxy.on('proxyReq', function (proxyRequest, request, response, options) {
  let authToken = request.headers['authorization'];
  if(authToken){
    let bearerToken = authToken.split(' ')[1];
    let appToken = jwt.decode(bearerToken, 'the-super-secure-secret-for-encoding').token;
    // console.log(JSON.stringify(appToken));
    proxyRequest.setHeader('token', appToken);
  }
  logger.log('verbose', '[API REQ] proxyReq: %s', proxyRequest.path);
});

proxy.on('proxyRes', function (proxyResponse, request, response) {
  //logger.log('verbose', '[API RES] proxyRes: %s', response.headers);
});

proxy.on('error', function (e) {
  logger.error('[API CALL ERROR]: %s', e);
});

router.all('/*', function (req, res, next) {
  logger.log('verbose', '[PROXY CALL]: target url: %s', req.path);
  proxy.web(req, res);
});

module.exports = router;

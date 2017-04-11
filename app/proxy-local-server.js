/**
 * Created by mike on 21/01/17.
 */
'use strict';

var http = require('http')
  // , httpProxy = require('http-proxy')
  , express = require('express')
  , router = express.Router()
  , jwt = require('jwt-simple')
  , appServerConfig = require('../config/app-server-config')
  , logger = require('winston')
  , rp = require('request-promise');

router.get('/*', function (req, res, next) {
    var options = {
      method: 'GET',
      uri: appServerConfig.restApiUrl +  req.path,
      headers: {
          'x-device-platform': 'com',
          'Content-Type' : 'application/json; charset=utf-8'
      },
      qs: req.query,
      json: true
    }
    let authToken = req.headers['authorization'];
    if(authToken){
      let bearerToken = authToken.split(' ')[1];
      let appToken = jwt.decode(bearerToken, 'the-super-secure-secret-for-encoding').token;
      options.headers['token'] = appToken;
    }
    rp(options)
    .then(resp => res.send(resp));
});

router.post('/*', function (req, res, next) {
  var options = {
    method: 'POST',
    uri: appServerConfig.restApiUrl +  req.path,
    headers: {
        'x-device-platform': 'com',
        'Content-Type' : 'application/json; charset=utf-8'
    },
    body: req.body,
    json: true
  }
  let authToken = req.headers['authorization'];
  if(authToken){
    let bearerToken = authToken.split(' ')[1];
    let appToken = jwt.decode(bearerToken, 'the-super-secure-secret-for-encoding').token;
    options.headers['token'] = appToken;
  }
  rp(options)
  .then(resp => res.send(resp));
});

router.put('/*', function (req, res, next) {
  var options = {
    method: 'PUT',
    uri: appServerConfig.restApiUrl +  req.path,
    headers: {
        'x-device-platform': 'com',
        'Content-Type' : 'application/json; charset=utf-8'
    },
    body: req.body,
    json: true
  }
  let authToken = req.headers['authorization'];
  if(authToken){
    let bearerToken = authToken.split(' ')[1];
    let appToken = jwt.decode(bearerToken, 'the-super-secure-secret-for-encoding').token;
    options.headers['token'] = appToken;
  }
  rp(options)
  .then(resp => res.send(resp));
});

router.delete('/*', function (req, res, next) {
  var options = {
    method: 'DELETE',
    uri: appServerConfig.restApiUrl +  req.path,
    headers: {
        'x-device-platform': 'com',
        'Content-Type' : 'application/json; charset=utf-8'
    },
    body: req.body,
    json: true
  }
  let authToken = req.headers['authorization'];
  if(authToken){
    let bearerToken = authToken.split(' ')[1];
    let appToken = jwt.decode(bearerToken, 'the-super-secure-secret-for-encoding').token;
    options.headers['token'] = appToken;
  }
  rp(options)
  .then(resp => res.send(resp));
});

// let proxy = httpProxy.createProxyServer({target: appServerConfig.restApiUrl});
//
// proxy.on('proxyReq', function (proxyRequest, request, response, options) {
//   let authToken = request.headers['authorization'];
//   if(authToken){
//     let bearerToken = authToken.split(' ')[1];
//     let appToken = jwt.decode(bearerToken, 'the-super-secure-secret-for-encoding').token;
//     // console.log(JSON.stringify(appToken));
//     proxyRequest.setHeader('token', appToken);
//   }
//   logger.log('verbose', '[API REQ] proxyReq: %s', proxyRequest.path);
// });
//
// proxy.on('proxyRes', function (proxyResponse, request, response) {
//   //logger.log('verbose', '[API RES] proxyRes: %s', response.headers);
// });
//
// proxy.on('error', function (e) {
//   logger.error('[API CALL ERROR]: %s', e);
// });

// router.all('/*', function (req, res, next) {
//   logger.log('verbose', '[PROXY CALL]: target url: %s', req.path);
//   proxy.web(req, res);
// });

module.exports = router;

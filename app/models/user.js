/**
 * Created by neto on 11/03/16.
 */
'use strict';

var rp = require('request-promise')
  , appServerConfig = require('../../config/app-server-config');

var options = (params) => {
  let options = {
    method: 'POST',
    uri: params.uri,
    headers: {
      'Accept-Language': 'es',
      'Content-Type': 'application/json'
    },
    body: params.body,
    json: true // Automatically parses the JSON string in the response
  };
  if (appServerConfig.proxy) {
    options.proxy = appServerConfig.proxy;
  }
  return options;
};

var user = module.exports = {
  loginByUsername: (username, password) => {
    return rp(options({
      body: {
        username: username,
        password: password
      },
      uri: appServerConfig.restApiUrl + '/users/v3/signin'
    }));
  },
  loginByEmail: (email, password) => {
    return rp(options({
      body: {
        email: email,
        password: password
      },
      uri: appServerConfig.restApiUrl + '/users/v3/signin'
    }));
  },
  loginByFacebook: (fb_token, fb_user_id) => {
    return rp(options({
      body: {
        fb_token: fb_token,
        fb_user_id: fb_user_id
      },
      uri: appServerConfig.restApiUrl + '/users/v3/signin'
    }));
  },
  signUp: (userData) => {
    return rp(options({
      body: userData,
      uri: appServerConfig.restApiUrl + '/users/v3/signup'
    }));
  }
};

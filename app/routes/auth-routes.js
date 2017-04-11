/**
 * Created by neto on 10/03/16.
 */

'use strict';

var express = require('express')
  , router = express.Router()
  , request = require('request')
  , jwt = require('jwt-simple')
  , moment = require('moment')
  , logger = require('winston')
  , serverConfig = require('../../config/app-server-config')
  , User = require('../models/user');

/*
 |--------------------------------------------------------------------------
 | Generate JSON Web Token
 |--------------------------------------------------------------------------
 */
function createJWT(data) {
  logger.log('info', '[Login success]: %s', data);
  let secret = 'the-super-secure-secret-for-encoding';
  // var payload = {
  //   sub: appToken,
  //   iat: moment().unix(),
  //   exp: moment().add(14, 'days').unix()
  // };
  return jwt.encode(data, secret);
}

/*
 |--------------------------------------------------------------------------
 | Login with Email
 |--------------------------------------------------------------------------
 */
router.post('/login', function (req, res) {
  let password = req.body.password;
  let username = req.body.username;
  if (typeof password !== 'undefined' && password !== '' && typeof username !== 'undefined' && username !== '') {
    if (username.indexOf('@') > -1) {
      let email = username;
      if (/.+@.+\..+/i.test(email)) {
        return User.loginByEmail(email, password)
          .then(resp => {
            if (resp.statusCode !== 1) {
              logger.info('Login failed - %s - email: %s :: %s', resp.statusCode, email, resp.statusMessage);
              res.status(401).send({message: resp.statusMessage});
            } else {
              res.send({token: createJWT(resp.data)});
            }
          })
          .catch(err => {
            logger.error('API is not available -\n %j', err);
            res.status(500).send({message: 'El api no está disponible'});
          });
      } else {
        logger.info('Login failed - 401 - Email is invalid: %s', email);
        res.status(401).send({message: 'Debes introducir un email válido'});
      }
    } else {
      return User.loginByUsername(username, password)
        .then(resp => {
          if (resp.statusCode !== 1) {
            logger.info('Login failed - %s - username: %s :: %s', resp.statusCode, username, resp.statusMessage);
            res.status(401).send({message: resp.statusMessage});
          } else {
            res.send({token: createJWT(resp.data)});
          }
        })
        .catch(err => {
          logger.error('API is not available -\n %j', err);
          res.status(500).send({message: 'El api no está disponible'});
        });
    }
  } else {
    logger.info('Login failed - 401 - no credentials introduced');
    res.status(401).send({message: 'Debes introducir tus credenciales'});
  }
});


/*
 |--------------------------------------------------------------------------
 | Login with Facebook
 |--------------------------------------------------------------------------
 */
router.post('/facebook', function (req, res) {
  var fields = ['id', 'email', 'first_name', 'last_name', 'link', 'name', 'picture'];
  var accessTokenUrl = 'https://graph.facebook.com/v2.5/oauth/access_token';
  var graphApiUrl = 'https://graph.facebook.com/v2.5/me?fields=' + fields.join(',');
  var params = {
    code: req.body.code,
    client_id : serverConfig.facebook.clientId,
    client_secret : serverConfig.facebook.clientSecret,
    redirect_uri: req.body.redirectUri
  };

  // Step 1. Exchange authorization code for access token.
  request.get({url: accessTokenUrl, qs: params, json: true}, function (err, response, accessToken) {
    if (response.statusCode !== 200) {
      logger.error('[FB login] Exchange authorization code for access token failed -\n%s', accessToken.error.message);
      return res.status(500).send({message: accessToken.error.message});
    }

    // Step 2. Retrieve profile information about the current user.
    request.get({url: graphApiUrl, qs: accessToken, json: true}, function (err, response, profile) {
      if (response.statusCode !== 200) {
        logger.error('[FB login] Retrieve profile information about the current user failed: $s', profile.error.message);
        return res.status(500).send({message: profile.error.message});
      }

      User.loginByFacebook(accessToken.access_token, profile.id)
        .then(resp => {
          if (resp.statusCode === 2) {
            return res.status(401).send({
              message: 'Nuevo usuario con facebook',
              body: response.body,
              fb_token: accessToken.access_token,
              fb_user_id: profile.id
            });
          } else if (resp.statusCode !== 1) {
            return res.status(401).send({message: resp.statusMessage});
          } else {
            return res.send({token: createJWT(resp.data)});
          }
        })
        .catch(err => {
           logger.error('[FB login] 500 - API unavailable: \n%j', err);
           res.status(500).send({message: 'El api no está disponible'});
        });
    });
  });
});

/*
 |--------------------------------------------------------------------------
 | Sing Up with Facebook
 |--------------------------------------------------------------------------
 */
router.post('/signup', function (req, res) {
  User.signUp(req.body)
    .then(resp => {
      if (resp.statusCode !== 1) {
        logger.info('[Signup] 401 - Signup failed: %s', resp.statusMessage);
        res.status(401).send({message: resp.statusMessage});
      } else {
        res.send({token: createJWT(resp.data)});
      }
    })
    .catch(err => {
      logger.error('[Signup] 500 - API unavailable: \n%j', err);
      res.status(500).send({message: 'El api no está disponible'});
    });
});

module.exports = router;

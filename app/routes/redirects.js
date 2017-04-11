/**
 * Created by neto on 16/03/16.
 */
var express = require('express')
  , router = express.Router()
  , serverConfig = require('../../config/app-server-config');

/////////////////
// help center
/////////////////
router.get('/help', function (req, res, next) {
  res.redirect(301, serverConfig.redirects.help);
});

router.get('/help/offers', function (req, res, next) {
  res.redirect(301, serverConfig.redirects.help);
});

router.get('/help/chat', function (req, res, next) {
  res.redirect(301, serverConfig.redirects.help);
});

router.get('/help/private-chat', function (req, res, next) {
  res.redirect(301, serverConfig.redirects.helpPrivateChat);
});

router.get('/help/profile', function (req, res, next) {
  res.redirect(301, serverConfig.redirects.helpProfile);
});


/////////////////
// blog
/////////////////
router.get('/blog', function (req, res, next) {
  res.redirect(301, serverConfig.redirects.blog);
});


/////////////////
// app store
/////////////////
router.get('/download', function (req, res, next) {
  res.redirect(301, serverConfig.redirects.itunes);
});

router.get('/iphone', function (req, res, next) {
  res.redirect(301, serverConfig.redirects.itunes);
});

router.get('/android', function (req, res, next) {
  res.redirect(301, serverConfig.redirects.googleplay);
});

/////////////////
// landing pages
/////////////////
router.get('/familyswapmeet', function (req, res, next) {
  res.redirect(302, serverConfig.redirects.familyswapmeet);
});

module.exports = router;
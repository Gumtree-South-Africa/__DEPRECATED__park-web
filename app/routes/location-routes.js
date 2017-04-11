/**
 * Created by neto on 16/03/16.
 */

'use strict';

var express = require('express')
  , router = express.Router()
  , request = require('request')
  , logger = require('winston')
  , fs = require('fs')
  , locationService = require('../location-services');

router.get('/locations/popularCities', function (req, res) {
  logger.log('verbose', '[API CALL]: %s', req.originalUrl);
  let popularCities = JSON.parse(fs.readFileSync('./app/data/popular-locations.json', 'utf8'));
  logger.log('verbose', '[PROXY response]: %s', req.originalUrl);
  res.send(popularCities);
});

router.get('/locations/:lat/:lng', function (req, res) {
  let lat = req.params.lat;
  let lng = req.params.lng;
  logger.log('verbose', '[location router]: %s', req.originalUrl);
  if (lat && lng) {
    locationService.getByLatLng(lat, lng)
      .then(function (loc) {
        logger.log('verbose', '[PROXY response]: %s', req.originalUrl);
        if (loc.length === 0) {
          res.status(404).send({message: 'Location not found'});
        } else {
          res.send(loc[0]);
        }
      });
  } else {
    logger.log('info', '[PROXY response] 400 - Lat and/or Lng missing: %s', req.originalUrl);
    res.status(400).send({message: 'Lat and Lng missing'});
  }
});

router.get('/locations/:locationId', function (req, res) {
  logger.log('verbose', '[location router]: %s', req.originalUrl);
  let locationId = req.params.locationId.replace(/ /gi, '').toLowerCase();
  let locations = JSON.parse(fs.readFileSync('./app/data/locations.json', 'utf8'));
  let currentLocation = locations.find(l => l.id === locationId);
  if (typeof currentLocation === 'undefined') {
    locationService.getById(locationId)
      .then(function (loc) {
        if (typeof loc === 'undefined') {
          logger.log('info', '[PROXY response] 404 - Location was not found: %s', req.originalUrl);
          res.status(404).send({message: 'Location not found'});
        } else {
          res.send(loc);
        }
      });
  } else {
    logger.log('verbose', '[PROXY response]: %s', req.originalUrl);
    res.send(currentLocation);
  }
});

router.get('/locations', function (req, res) {
  logger.log('verbose', '[PROXY request]: %s', req.originalUrl);
  let locations = JSON.parse(fs.readFileSync('./app/data/locations.json', 'utf8'));
  logger.log('verbose', '[PROXY response]: %s', req.originalUrl);
  res.send(locations);
});

router.get('/automatic/location', function (req, res) {
  var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  logger.log('verbose', '[Find location]: %s', ip);
  locationService.localize(ip)
    .then( (location) => {
      res.send({
        ip: ip,
        location: location
      });
    });
});

module.exports = router;

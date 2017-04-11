/**
 * Created by neto on 16/03/16.
 * Modified by miguelromero.
 */

 'use strict';

var express = require('express')
  , metaDataBuilder = require('../meta-data-builder')
  , router = express.Router()
  , apiCalls = require('../services/api-calls-service')
  , logger = require('winston')
  , utilService = require('../services/util-service')
  , locationService = require('../location-services');

/////////////////
// routes to OG FB, Twitterbot, Pinterest/0.1
/////////////////

router.get('/pr/:category/:shortDesc/:id', sendVip);
router.get('/items/:id', sendItem);
router.get('/gr/:name/:id', sendGroup);
router.get('/profile/:id', sendUser);
router.get('/c/:location/:category', sendSearchByCategory);
router.get('/home', sendHome);
router.get('/home/:location', sendHome);

/////////////////
// description of functions that renders the request
/////////////////

function getLocation (req, res, next) {
  var ua = req.headers['user-agent'];
  if (metaDataBuilder.isBot(ua)) {
    var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    locationService.localize(ip)
      .then((location) => {
        var latitude = location.latitude;
        var longitude = location.longitude;
        if (location.country_code !== 'US') {
          latitude = 29.7589;
          longitude = -95.3677;
        }
        return locationService.getByLatLng(latitude, longitude);
      })
      .then((mapBoxResponse) => {
        req.mapBox = mapBoxResponse[0];
        next();
      })
      .catch(err => {
        res.send(err);
      });
  } else {
    next();
  }
}

function sendHome (req, res, next) {
  var ua = req.headers['user-agent'];
  if (metaDataBuilder.isBot(ua)) {
    locationService.getById(req.params.location)
     .then( (mapBoxResponse) => {
      res.render('home', metaDataBuilder.homeData(req, mapBoxResponse));
     });
  } else {
    next();
  }
}

function sendVip (req, res, next) {
  var ua = req.headers['user-agent'];
  if (metaDataBuilder.isBot(ua)) {
    var mItem;
    var mUser;
    apiCalls.findItemById(req.params.id)
    .then(item => {
      mItem = item;
      return apiCalls.getUserWithItems(item.user.username);
    })
    .then(function (user) {
      mUser = user;
      return locationService.getByLatLng(mItem.latitude, mItem.longitude);
    })
    .then(mapBox => {
      res.render('vip', metaDataBuilder.vipData(mItem, mUser, req, mapBox[0]));
    })
    .catch(err => {
      res.send(err);
    });
  } else {
    next();
  }
}

function sendGroup (req, res, next) {
  var ua = req.headers['user-agent'];
  if (metaDataBuilder.isBot(ua)) {
    var mGroupData;
    apiCalls.getGroupWithItems(req.params.id)
    .then(groupDataExtended => {
      mGroupData = groupDataExtended;
      var location = groupDataExtended.group.location.split(',');
      return locationService.getByLatLng(+location[0], +location[1]);
    })
    .then(mapBox => {
      res.render('group', metaDataBuilder.groupWithItems(mGroupData, req, mapBox[0]));
    }).catch(err => {
      res.send(err);
    });
  } else {
    next();
  }
}

function sendUser (req, res, next) {
  var ua = req.headers['user-agent'];
  if (metaDataBuilder.isBot(ua)) {
    var mUser;
    apiCalls.getUserWithItems(req.params.id)
    .then(user => {
      mUser = user;
      return locationService.getById(mUser.user.locationName);
    })
    .then(mapBox => {
      res.render('user', metaDataBuilder.userWithItems(mUser, req, mapBox));
    })
    .catch(err => {
      res.send(err);
    });
  } else {
    next();
  }
}

function sendItem (req, res, next) {
  var ua = req.headers['user-agent'];
  if (metaDataBuilder.isBot(ua)) {
    apiCalls.findItemData(req.params.id)
    .then(function(item) {
      item.name = capitalize(item.name, true);
      if (item.description) {
        item.description = capitalize(item.description, false);
      } else {
        item.description = 'Gana $ Vendiendo eso que no usas en Vivanuncios.';
      }
    res.render('item', item);
    }).catch(err => {
      res.send(err);
    });
  } else {
    next();
  }
}

function sendSearchByCategory (req, res, next) {
  var ua = req.headers['user-agent'];
  var locationCanonical = '';
  var categories = {};
  if (metaDataBuilder.isBot(ua)) {
    if(!utilService.getCategoryId(req.params.category)) {
      res.send({});
    } else {
      var mapBox;
      apiCalls.getCategories()
      .then(categoriesRes => {
        categories = categoriesRes;
        return locationService.getById(req.params.location);
      } )
      .then(location => {
        mapBox = location;
        let params = {
          categoryId: utilService.getCategoryId(req.params.category),
          page: 0,
          pageSize: 10,
          latitude: location.latitude,
          longitude: location.longitude,
          radius: 20,
          order: 'published,nearest'
        };
        locationCanonical = location.canonical_name;
        return apiCalls.findItemsByCategory(params);
      })
      .then(search => {
        search.locationCanonical = locationCanonical;
        search.categories = categories.categories;
        res.render('search-by-category', metaDataBuilder.searchByCategoryData(search, req, mapBox));
      })
      .catch(err => {
        res.send(err);
      });
    }
  } else {
    next();
  }
}

module.exports = router;

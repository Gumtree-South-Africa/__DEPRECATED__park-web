// modules =================================================
var Q = require('q');
var rp = require('request-promise');
var appConfig = require('../config/app-server-config');
var logger = require('winston');

/**
 * Categories and locations should be an api call.
 * @type {string[]}
 */

/**
 * {
     CategoryId: "9af9dfe5-57b4-4953-a45c-b5cb1b1bd3b2",
     Name: "Home Goods"
   }
 */


var categoriesPromise = () => rp({
  method: 'GET',
  uri:  `${appConfig.sitemap.instanceUrl}/api/category`,
  json: true
}).then(p => ({
  name: 'categories',
  values: p.map(c => [`/byCategory/${c.id}`, `viva://categories/${c.id}`])
})).catch(err => {
  logger.info('[XML - categories- Error]:' + err);
  return {
    name: 'categories',
    values: []
  };
});

var spawn = (generatorFunc) => {
  'use strict';
  let continuer = (verb, arg) => {
    var result;
    try {
      result = generator[verb](arg);
    } catch (err) {
      return Promise.reject(err);
    }
    if (result.done) {
      return result.value;
    } else {
      return Promise.resolve(result.value).then(onFulfilled, onRejected);
    }
  };
  var generator = generatorFunc();
  var onFulfilled = continuer.bind(continuer, "next");
  var onRejected = continuer.bind(continuer, "throw");
  return onFulfilled();
};


var categoriesLocations = () => {
  'use strict';
  return Q.Promise(resolve => {
    var urlLocation = `${appConfig.sitemap.instanceUrl}/api/locations`;
    if(appConfig.sitemap.usePopularCities){
      urlLocation = urlLocation + '/popularCities';
    }
    Q.all([
        rp({
          method: 'GET',
          uri: urlLocation,
          json: true
        }),
        rp({
          method: 'GET',
          uri: `${appConfig.sitemap.instanceUrl}/api/category`,
          json: true
        })
      ])
      .then(results => {

        var locations = results[0].slice(0, appConfig.sitemap.citiesToUse);
        var categories = results[1].slice(0, appConfig.sitemap.categoriesToUse);
        var urls = categories
          .map(c => locations
            .map(l => ({
              idCategory: c.id,
              latitude: l.latitude,
              longitude: l.longitude,
              idLocation: l.id
            })))
          .reduce((a, b) => a.concat(b), []);

        spawn(function *() {
          let resultsURLs = [];
          for (let u of urls) {
            let idCategory = u.idCategory;
            let latitude = u.latitude;
            let longitude = u.longitude;
            let idLocation = u.idLocation;
            let uri = `${appConfig.sitemap.instanceUrl}/api/items/byCategory/1/${idCategory}/${latitude}/${longitude}` + '';
            logger.info('[XML - locations generator - URL]:' + uri);

            let options = {
              method: 'GET',
              uri: uri,
              json: true
            };
            logger.info('[XML] [categories-location]:' + uri);

            let urlCL = yield rp(options)
              .then(p => {
                return {
                  hasAds: p.rows.length > 0,
                  url: `byCategory/${idCategory}/${idLocation}`
                };
              })
              .catch(err => {
                logger.info('[XML - locations generator - Error]: ' + err);
                logger.info('[XML - locations generator - In URL]: ' + uri);
                return {
                  hasAds: false
                };
              });
            if (urlCL.hasAds) {
              resultsURLs.push([urlCL.url]);
            }
          }
          resolve({
            name: 'categories-locations',
            values: resultsURLs
          });
        });
      });
  });
};

var locationsPromise = () => {
  var urlLocation = `${appConfig.sitemap.instanceUrl}/api/locations`;
  if(appConfig.sitemap.usePopularCities){
    urlLocation = urlLocation + '/popularCities';
  }
  return rp({
    method: 'GET',
    uri: urlLocation,
    json: true
  }).then(p => {
    return Q.promise(resolve => {
      var locationsWithAdds = [];
      var urlsToCheck = p.map(l => {
        var url = `${appConfig.sitemap.instanceUrl}/api/items/byCategory/1/everything/${l.latitude}/${l.longitude}`;
        return rp({
          method: 'GET',
          uri: url,
          json: true
        })
          .then(p => {
            return {
              hasAds: p.rows.length > 0,
              url: `byCategory/everything/${l.id}`
            };
          })
          .catch(err => {
            logger.info('[XML - locations - Error]:' + err);
            return {
              hasAds: false
            };
          });
      });
      Q.allSettled(urlsToCheck)
        .then(function (results) {
          results.forEach(function (result) {
            if (result.state === "fulfilled") {
              var value = result.value;
              if (value.hasAds) {
                locationsWithAdds.push([value.url]);
              }
            }
          });
          resolve({
            name: 'locations',
            values: locationsWithAdds
          });
        });

    });
  }).catch(err => {
    logger.info('[XML - locations - Error]:' + err);
    return {
      name: 'locations',
      values: []
    };
  });
};

/**
 * This is a generator that makes request until the upperLimit is reached.
 * @param limit, Integer for pagination
 * @param upperLimit, max number of elements to get from the api
 */
var requestGenerator = function *(limit, upperLimit) {
  var i = 0;
  while (i * limit <= upperLimit) {
    var uri = appConfig.sitemap.instanceUrl + `/api/items/paginated/${limit}/${i * limit}`;

    var options = {
      method: 'GET',
      uri: uri,
      json: true
    };
    logger.info('[XML]:' + uri);
    i++;
    yield rp(options)
      .then(p => p.rows
        .filter(r => r.hasOwnProperty('live') ? r.live : false)
        .map(r => r.id))
      .catch(err => {
        logger.info('[XML - items]:' + err);
        return [];
      });
  }
};

var liveAdds = () => {
  return Q.Promise(function (resolve) {
    var ta = [];
    var rg = requestGenerator(appConfig.sitemap.itemPerRequest, appConfig.sitemap.totalItems);
    var done = false;
    while (!done) {
      var currentValue = rg.next();
      done = currentValue.done;
      if (!done) {
        ta.push(currentValue.value)
      } else {
        Q.all(ta).then(taf => {
          resolve({
            name: 'liveAdds',
            values: taf.reduce((a, b) => a.concat(b), []).map(i => [`itemDetail/${i}`, `viva://items/${i}`])
          })
        });
      }
    }
  });
};

var users = () => {
  'use strict';
  return Q.Promise(resolve => {
    var letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26'].slice(0, appConfig.sitemap.usersToUse);
    var idsPromises = letters.map(
      l => {
        logger.info('[XML]:' + appConfig.sitemap.instanceUrl + `/api/users/byFirstLetter/${l}`);
        return rp({
          method: 'GET',
          uri: appConfig.sitemap.instanceUrl + `/api/users/byFirstLetter/${l}`,
          json: true
        }).then(p => p.map(r => r.userId))
          .catch(err => {
            logger.info('[XML - users]:' + err);
            return [];
          });
      });
    Q.all(idsPromises).then(ids => {
      var bigList = ids.reduce((a, b) => a.concat(b), []);
      spawn(function *() {
        let resultsURLs = [];
        for (let userId of bigList) {
          let uri = `${appConfig.sitemap.instanceUrl}/api/items/byUser/1/${userId}`;
          logger.info('[XML - locations generator - URL]: ' + uri);

          let options = {
            method: 'GET',
            uri: uri,
            json: true
          };
          logger.info('[XML] [users-has-adds]: ' + uri);

          let urlCL = yield rp(options)
            .then(response => {
              return {
                hasAds: response.count > 0,
                userId: userId
              };
            })
            .catch(err => {
              logger.info('[XML - locations generator - Error]: ' + err);
              logger.info('[XML - locations generator - In URL]: ' + uri);
              return {
                hasAds: false
              };
            });
          if (urlCL.hasAds) {
            resultsURLs.push([`users/${urlCL.userId}`, `viva://users/${urlCL.userId}`]);
          }
        }
        resolve({
          name: 'users',
          values: resultsURLs
        });
      });
    });
  });
};


module.exports = {
  categories: categoriesPromise,
  locations: locationsPromise,
  users: users,
  liveAdds: liveAdds,
  categoriesLocations: categoriesLocations
};
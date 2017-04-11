(function() {
  'use strict';

  function LocationService ($q, $http, UtilsService, QueryApiService) {
    'ngInject';

    var queued = [],
      dp = {},
      currentLocation = {
        id: '',
        name: ''
      },
      apiToken = appConfig.mapboxApiToken,
      statesCodes = [
        {name: 'Alabama', code: 'AL'},
        {name: 'Alaska', code: 'AK'},
        {name: 'Arizona', code: 'AZ'},
        {name: 'Arkansas', code: 'AR'},
        {name: 'California', code: 'CA'},
        {name: 'Colorado', code: 'CO'},
        {name: 'Connecticut', code: 'CT'},
        {name: 'Delaware', code: 'DE'},
        {name: 'District of Columbia', code: 'DC'},
        {name: 'Florida', code: 'FL'},
        {name: 'Georgia', code: 'GA'},
        {name: 'Hawaii', code: 'HI'},
        {name: 'Idaho', code: 'ID'},
        {name: 'Illinois', code: 'IL'},
        {name: 'Indiana', code: 'IN'},
        {name: 'Iowa', code: 'IA'},
        {name: 'Kansas', code: 'KS'},
        {name: 'Kentucky', code: 'KY'},
        {name: 'Louisiana', code: 'LA'},
        {name: 'Maine', code: 'ME'},
        {name: 'Maryland', code: 'MD'},
        {name: 'Massachusetts', code: 'MA'},
        {name: 'Michigan', code: 'MI'},
        {name: 'Minnesota', code: 'MN'},
        {name: 'Mississippi', code: 'MS'},
        {name: 'Missouri', code: 'MO'},
        {name: 'Montana', code: 'MT'},
        {name: 'Nebraska', code: 'NE'},
        {name: 'Nevada', code: 'NV'},
        {name: 'New Hampshire', code: 'NH'},
        {name: 'New Jersey', code: 'NJ'},
        {name: 'New Mexico', code: 'NM'},
        {name: 'New York', code: 'NY'},
        {name: 'North Carolina', code: 'NC'},
        {name: 'North Dakota', code: 'ND'},
        {name: 'Ohio', code: 'OH'},
        {name: 'Oklahoma', code: 'OK'},
        {name: 'Oregon', code: 'OR'},
        {name: 'Pennsylvania', code: 'PA'},
        {name: 'Rhode Island', code: 'RI'},
        {name: 'South Carolina', code: 'SC'},
        {name: 'South Dakota', code: 'SD'},
        {name: 'Tennessee', code: 'TN'},
        {name: 'Texas', code: 'TX'},
        {name: 'Utah', code: 'UT'},
        {name: 'Vermont', code: 'VT'},
        {name: 'Virginia', code: 'VA'},
        {name: 'Washington', code: 'WA'},
        {name: 'West Virginia', code: 'WV'},
        {name: 'Wisconsin', code: 'WI'},
        {name: 'Wyoming', code: 'WY'},
        {name: 'Puerto Rico', code: 'PR'}
      ];

    var mapFeature = function (f) {
      var cl = {
        id_mapbox: f.id,
        latitude: f.center[1],
        longitude: f.center[0],
        name: f.text,
        place_name: f.place_name,
        context: f.context
      };
      if (f.id.startsWith('place')) {
        cl.state = f.context[1].text;
        var stateObject = getStateByName(cl.state);
        var stateCode = stateObject ? stateObject.code : cl.state.replace(/ /gi, '_');
        cl.id = (cl.name.replace(/ /gi, '_') + "-" + stateCode).toLowerCase();
        cl.canonical_name = cl.name + ', ' + stateCode;
      }
      return cl;
    };

    /**
     * This function adds some useful properties to the mapbox response, e.j. the id city_state
     * @param mr The mapbox response
     */
    var mapMapBoxResponse = function (mr) {
      return mr.features.map(mapFeature);
    };


    var getStateByCode = function (code) {
      return _.find(statesCodes, function (state) {
        return state.code === code;
      });
    };

    var getStateByName = function (name) {
      return _.find(statesCodes, function (state) {
        return state.name === name;
      });
    };

    var isWholeUSA = function () {
      return currentLocation.id === '';
    };

    var setCurrentLocation = function (loc) {
      currentLocation = loc;
    };

    var getCurrentLocation = function () {
      return currentLocation;
    };

    /**
     * This function return the city found at lat, lng
     * @param lat Latitude in decimal degrees
     * @param lng Longitude in decimal degrees
     */
    var getCityByLatLng = function (lat, lng) {
      return QueryApiService.makeRequest({
        method: 'GET',
        url: '/api-locations/locations/' + lat + '/' + lng
      });
    };

    var getCityByZipcode = function (zipcode) {
      return QueryApiService.makeRequest({
        method: 'GET',
        url: 'https://api.mapbox.com/geocoding/v5/mapbox.places/' + zipcode + '.json?country=us,pr&types=postcode&access_token=' + apiToken
      });
    };

    /**
     * The main function this search for the city and returns
     * lat, lng, and other information of the city.
     * This uses the localStorage API if available.
     * @param locationId The location id to search in the form city_name-state_name (all spaces should be replace with _)
     * @returns {*|Promise.<T>} A promise that will resolve to the city
     */
    var getCityById = function (locationId) {
      if (UtilsService.isUndefinedOrEmptyString(locationId)) {
        return getLocationUSA();
      }
      if (queued.indexOf(locationId) >= 0) {
        return dp[locationId];
      } else {
        if (UtilsService.isLocalStorageAvailable()) {
          var close5Cities = [];
          if (typeof localStorage.close5Cities3 !== 'undefined') {
            close5Cities = JSON.parse(localStorage.close5Cities3);
            for (var i = 0; i < close5Cities.length; i++) {
              if (close5Cities[i].id === locationId) {
                return $q.when(close5Cities[i]);
              }
            }
            queued.push(locationId);
            var pr = QueryApiService.makeRequest({
              method: 'GET',
              url: '/api-locations/locations/' + locationId
            });
            dp[locationId] = pr;
            pr.then(function (city) {
              localStorage.setItem('close5Cities3', JSON.stringify(close5Cities.concat([city])));
              var io = queued.indexOf(locationId);
              if (io >= 0) {
                queued = queued.splice(io, 1);
                //delete dp[locationId];
              }
            });
            return pr;
          } else {
            var pr = QueryApiService.makeRequest({
              method: 'GET',
              url: '/api-locations/locations/' + locationId
            });
            dp[locationId] = pr;
            pr.then(function (city) {
              localStorage.setItem('close5Cities3', JSON.stringify(close5Cities.concat([city])));
              var io = queued.indexOf(locationId);
              if (io >= 0) {
                queued = queued.splice(io, 1);
                //delete dp[locationId];
              }
            });
            return pr;
          }
        } else {
          return QueryApiService.makeRequest({
            method: 'GET',
            url: '/api-locations/locations/' + locationId
          });
        }

      }
    };

    /**
     * Utility function for getting the lat, lng and other info for the whole country.
     * @returns {Promise} A promise with the USA data
     */
    var getLocationUSA = function () {
      return $q.when({
        "id_mapbox": "country.5877825732302570",
        "name": "United States",
        "canonical_name": "United States",
        "place_name": "United States",
        "state": "",
        "latitude": 36.892576,
        "longitude": -98.994022,
        "context": [{
          "id": "country.5877825732302570",
          "text": "United States", "short_code": "us"
        }],
        "id": "USA"
      });
    };

    /**
     * This method checks for the user's browser location api,
     * if it finds it ask for the user's permissions and look for the location.
     * @returns A promise holding the currentPosition.
     */
    var getUserPosition = function () {
      return $q(function (resolve, reject) {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(function (position) {
            resolve({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude
            });
          }, function (err) {
            console.log(err);
            reject({error: "No permission form user."});
          })
        } else {
          reject({error: "Geolocation is not supported by this browser."});
        }
      });

    };

    var getPopularCities = function () {
      return QueryApiService.makeRequest({
        method: 'GET',
        url: '/api-locations/locations/popularCities'
      });
    };

    return {
      isWholeUSA: isWholeUSA,
      setCurrentLocation: setCurrentLocation,
      getCurrentLocation: getCurrentLocation,
      getUserPosition: getUserPosition,
      getLocationUSA: getLocationUSA,
      getCityById: getCityById,
      getPopularCities: getPopularCities,
      getCityByLatLng: getCityByLatLng,
      getCityByZipcode: getCityByZipcode,
      getStateByCode: getStateByCode,
      getCodeState: getStateByName,
      mapFeature: mapFeature
    };
  }

  angular.module('app.services')
  .service('LocationService', LocationService);

}());


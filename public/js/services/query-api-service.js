/**
 * Created by neto on 15/03/16.
 */
(function() {
  'use strict';

  function QueryApiService ($http) {
    'ngInject';

    return {
      makeRequest: function (options) {
        if (!options.data && !options.params) {
          options.data = {}
        }
        if (!options.headers) {
          options.headers = {
            "Content-Type": "application/json"
          }
        }
        options.headers['Accept-Language'] = 'es';
        return $http(options)
          .then(function (data) {
            return data.data;
          })
      }
    }
  }

  angular.module('app.services')
  .service('QueryApiService', QueryApiService);
}());


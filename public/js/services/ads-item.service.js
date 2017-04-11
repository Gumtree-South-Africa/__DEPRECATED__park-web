(function() {
  'use strict';

  function AdsItemService (QueryApiService, $http, $q, $rootScope, $auth) {
    'ngInject';

    var findByUser = function (username, params, itemId) {
      itemId = itemId || '';
      return QueryApiService.makeRequest({
        method: 'GET',
        url: '/api/items/v3/user/' + username + '/' + itemId,
        params: params
      })
    };

    var find = function (id) {
      return QueryApiService.makeRequest({
        method: 'GET',
        url: '/api/public/items/v3/' + id
      })
    };

    var searchPublic = function (params) {
      return QueryApiService.makeRequest({
        method: 'GET',
        url: '/api/public/items/v3/search',
        params: params
      })
    };

    var search = function (params) {
      return QueryApiService.makeRequest({
        method: 'GET',
        url: '/api/items/v3/search',
        params: params
      })
    };

    var toggleLikeItem = function (id, like) {
      return QueryApiService.makeRequest({
        method: like ? 'PUT' : 'DELETE',
        headers: {
          'Content-type': 'application/json'
        },
        url: '/api/items/v3/' + id + '/follow'
      })
    };

    var unLikeItem = function (id, token) {
      return QueryApiService.makeRequest({
        method: 'DELETE',
        headers: {
          'token': token,
          'Content-type': 'application/json'
        },
        url: '/api/items/v3/' + id + '/follow'
      })
    };

    function isSold (status) {
      return status === 'SOLD';
    }

    function sellItem (itemId) {
      var deferred = $q.defer();
      return QueryApiService.makeRequest({
        method: 'PUT',
        headers: {
          'Content-type': 'application/json'
        },
        url: '/api/items/v3/' + itemId + '/buy'
      }).
      then(function(res) {
        if (res.statusCode === 1) {
          return res.data;
        } else {
          return $q.reject(res);
        }
      });
    }

    return {
      findByUser: findByUser,
      find: find,
      searchPublic: searchPublic,
      search: search,
      toggleLikeItem: toggleLikeItem,
      unLikeItem: unLikeItem,
      isSold: isSold,
      sellItem: sellItem
    };
  }

  angular.module('app.services')
  .service('AdsItemService', AdsItemService);
}());

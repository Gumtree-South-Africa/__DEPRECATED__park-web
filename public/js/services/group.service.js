(function() {
  'use strict';

  function GroupService ($q, $http, $auth, $rootScope, QueryApiService) {
    'ngInject';

    return {
      find: function (groupId, params) {
        return QueryApiService.makeRequest({
          method: 'GET',
          url: '/' + appConfig.api.namespace + '/groups/' + appConfig.api.version + '/' + groupId,
          params: params
        })
      },
      getItems: function (groupId, params) {
        return QueryApiService.makeRequest({
          method: 'GET',
          url: '/' + appConfig.api.namespace + '/groups/' + appConfig.api.version + '/' + groupId + '/items',
          params: params
        })
      },
      getSubscribers: function (groupId, params) {
        var uri = ''; // group endpoint '/' + appConfig.api.namespace + '/groups/' + appConfig.api.version + '/' + groupId + '/subscribers',
        if ($auth.isAuthenticated()) {
          uri = '/' + appConfig.api.namespace + '/social/v3/' + $auth.getPayload().username + '/search';
        } else {
          uri = '/' + appConfig.api.namespace + '/public/users/v3/search';
        }
        params.groupId = groupId;
        return QueryApiService.makeRequest({
          method: 'GET',
          url: uri,
          params: params
        })
      },
      subscribe: function (groupId) {
        return QueryApiService.makeRequest({
          method: 'POST',
          url: '/' + appConfig.api.namespace + '/groups/' + appConfig.api.version + '/' + groupId + '/subscribe'
        })
      },
      unsubscribe: function (groupId) {
        return QueryApiService.makeRequest({
          method: 'POST',
          url: '/' + appConfig.api.namespace + '/groups/' + appConfig.api.version + '/' + groupId + '/unsubscribe'
        })
      }
    };
  }

  angular.module('app.services')
  .service('GroupService', GroupService);

}());

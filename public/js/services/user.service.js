(function() {
  'use strict';

  function UserService ($q, $http, $rootScope, QueryApiService) {
    'ngInject';

    return {
      find: function (id) {
        return QueryApiService.makeRequest({
          method: 'GET',
          url: '/api/public/users/v3/' + username + '/info'
        })
      },
      getByUsername: function (username) {
        return QueryApiService.makeRequest({
          method: 'GET',
          url: '/api/public/users/v3/' + username + '/info'
        })
      },
      signOut: function () {
        return QueryApiService.makeRequest({
          method: 'POST',
          url: '/api/users/v3/signout'
        })
      },
      getRates: function (username, rateType) {
        return QueryApiService.makeRequest({
          method: 'GET',
          url: '/api/public/users/v3/' + username + '/rates',
          params: {
            rate: rateType
          }
        })
      },
      listRates: function (parameters) {
        return QueryApiService.makeRequest({
          method: 'GET',
          url: '/api/public/ratings/v3',
          params: parameters
        })
      },
      unFollowUser: function (username, userToUnFollow) {
        return QueryApiService.makeRequest({
          method: 'PUT',
          url: '/api/users/v3/' + username + '/unfollow',
          data: {userToUnfollow: userToUnFollow}
        })
      },
      followUser: function (username, userToFollow) {
        return QueryApiService.makeRequest({
          method: 'PUT',
          url: '/api/users/v3/' + username + '/follow',
          data: {userToFollow: userToFollow}
        })
      },
      getFollowers: function (username, isAuthenticate) {
        var url = isAuthenticate ?
          '/api/users/v3/' + username + '/followers':
          '/api/public/users/v3/' + username + '/followers' ;
        return QueryApiService.makeRequest({
          method: 'GET',
          url: url
        })
      },
      getFollowings: function (username, isAuthenticate) {
        var url = isAuthenticate ?
        '/api/users/v3/' + username + '/follow':
        '/api/public/users/v3/' + username + '/follow' ;
        return QueryApiService.makeRequest({
          method: 'GET',
          url: url
        })
      },
      updateProfile: function (username, parameters) {
        return QueryApiService.makeRequest({
          method: 'PUT',
          url: '/api/users/v3/' + username + '/info',
          data: parameters
        })
      },
      verifyEmail: function () {
        return QueryApiService.makeRequest({
          method: 'POST',
          url: 'api/users/v3/sendverification'
        })
      }
    };
  }

  angular.module('app.services')
  .service('UserService', UserService);

}());


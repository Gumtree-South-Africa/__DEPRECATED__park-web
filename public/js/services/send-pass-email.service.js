(function() {
  'use strict';

  function SendPassLinkService ($http) {
    'ngInject';

    this.sendResetPasswordLink = function(email) {

      var resetPasswordApi = '/api/password-reset/email';

      var emailJson = {"email":email};

      $http.defaults.useXDomain = true;
      return $http({
        method: 'POST',
        url: resetPasswordApi,
        dataType: 'JSON',
        data: emailJson
      }).then(function (results) {
        return results.data;
      }, function errorCallback(response) {
        return {error: 'Api unavailable'};
      });
    };

    this.resetPasswordAPI = function(id, newPass) {

      var uri = 'api/password-reset/email/' + id;
      $http.defaults.useXDomain = true;
      return $http({
        method: 'POST',
        data: {'password': newPass},
        dataType: 'JSON',
        url: uri
      }).then(function (results) {
        return results.data
      },
      function errorCallback(response) {
        return {error: 'Api unavailable'};
      });
    };
  }

  angular.module('app.services')
  .service('SendPassLinkService', SendPassLinkService);
}());


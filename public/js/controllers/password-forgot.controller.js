(function() {
  'use strict';

  function PasswordForgotController ($scope, $http, SendPassLinkService) {
    'ngInject';

    $scope.email = "";

    $scope.sendEmail = function (email) {
      SendPassLinkService.sendResetPasswordLink(email).then(function (results) {
          if (results.ok) {
            $scope.sent = true;
            $scope.error = false;
          } else {
            $scope.error = true;
            $scope.sent = false;
          }
        }
      );
    };
  }

  angular.module('app.controllers')
.controller('PasswordForgotController', PasswordForgotController);

}());

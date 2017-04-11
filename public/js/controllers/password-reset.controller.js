(function() {
  'use strict';

  function PasswordResetController ($scope, $stateParams, $location, SendPassLinkService) {
      'ngInject';

      $scope.currentPass;
      $scope.newPass;
      $scope.newPassVerify;

      $scope.validpassword = true;

      $scope.checkpassword = function () {

        $scope.validpassword = ($scope.newPass == $scope.newPassVerify);

      };

      $scope.submit = function () {
        var id = $stateParams.id;
        SendPassLinkService.resetPasswordAPI(id, $scope.newPass)
        .then(
          function (response) {
            if (response.ok) {
              $location.path('/password-success');
            } else {
              $scope.error = true;
            }
          },
          function errorCallback(response) {
            console.log(response.error);
          }
        );
    };
  }

  angular.module('app.controllers')
  .controller('PasswordResetController', PasswordResetController);

}());

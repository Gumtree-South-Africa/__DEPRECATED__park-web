(function  () {
  'use strict';

  function RejectOfferNegotiationController ($scope, $uibModalInstance) {
    'ngInject';

    $scope.reason = '';
    $scope.confirm = confirm;

    function confirm (flag) {
      $uibModalInstance.close({
        flag: flag,
        reason: $scope.reason
      });
    }
  }

  angular.module('app.controllers')
  .controller('RejectOfferNegotiationController', RejectOfferNegotiationController);
}());

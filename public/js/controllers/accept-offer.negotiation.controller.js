(function() {
  'use strict';

  function AcceptOfferNegotiationController ($scope, $uibModalInstance, offer) {
    'ngInject';

    $scope.offer = offer;
    $scope.confirm = confirm;

    function confirm (flag) {
      $uibModalInstance.close(flag);
    }
  }

  angular.module('app.controllers')
  .controller('AcceptOfferNegotiationController', AcceptOfferNegotiationController);
}());

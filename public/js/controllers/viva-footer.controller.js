(function() {
  'use strict';

  function VivaFooterController ($scope) {
    'ngInject';

    $scope.$on('$stateChangeSuccess', shouldShowFooter);
    $scope.shouldShowFooter = true;

    function shouldShowFooter (event, toState, toParams, fromState, fromParams) {
      $scope.shouldShowFooter = toState.name !== 'negotiationItem'
      && toState.name !== 'negotiation'
      && toState.name !== 'negotiationsList'
      && toState.name !== 'negotiationsListItem';
    }
  }

  angular.module('app.controllers')
  .controller('VivaFooterController',VivaFooterController);
}());

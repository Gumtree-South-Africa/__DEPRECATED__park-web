(function() {
  'use strict';

  function ModalTopHeader ($scope, $rootScope, $state) {
    'ngInject';

    $scope.cancelNegotiation = cancelNegotiation;
    $scope.shouldVisible = $state.is('negotiation') || $state.is('negotiationItem');
    $scope.shouldShowCancelAction = true;

    $rootScope.$on('VIVA.chatNegotiation.shouldShowCancelAction', showCancelAction);

    $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
      $scope.shouldVisible = toState.name === 'negotiation' || toState.name === 'negotiationItem';
    });

    function cancelNegotiation () {
      $rootScope.$broadcast('VIVA.chatNegotiation.cancelNegotiation');
    }

    function showCancelAction (ev, flag) {
      $scope.shouldShowCancelAction = flag;
    }
  }

  angular.module('app.controllers')
  .controller('ModalTopHeader', ModalTopHeader);
}());

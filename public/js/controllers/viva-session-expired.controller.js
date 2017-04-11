(function () {
  'use strict';

  function VivaSessionExpiredController ($scope, $auth, $state, $uibModalInstance) {
    'ngInject';

    $scope.reload = reload;

    $auth.logout();
    $state.reload();

    function reload() {
      $uibModalInstance.dismiss('cancel');
    }
  }

  angular.module('vivaApp')
  .controller('VivaSessionExpiredController', VivaSessionExpiredController);
}());

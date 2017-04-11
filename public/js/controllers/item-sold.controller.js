(function() {
  'use strict';

  function ItemSoldController ($scope, $uibModalInstance) {
    'ngInject';

    $scope.ok = ok;

    function ok () {
      $uibModalInstance.close();
    }
  }

  angular.module('app.controllers')
  .controller('ItemSoldController', ItemSoldController);
}());

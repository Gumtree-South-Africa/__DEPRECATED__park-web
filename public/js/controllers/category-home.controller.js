(function () {

  'use strict';

  function CategoryHomeController ($scope, CategoryService) {

    'ngInject';

    $scope.text = 'Category home view';

    $scope.init = function () {
      CategoryService.getSubcategoryList().then(function (response) {
        $scope.categories = response;
      });
    };

    $scope.init();
  }

  angular.module('app.controllers')
  .controller('CategoryHomeController', CategoryHomeController);

}());


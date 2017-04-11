(function() {
  'use strict;'

  function NoResultsController ($scope, $state, $stateParams, $window, $timeout, SearchModelFactory, LocationService, CategoryService) {

    'ngInject';

    $window.scrollTo(0, 0);
    $scope.searchData = SearchModelFactory.location;
    $scope.categoryId = $stateParams.categoryId;
    $scope.keyword = $stateParams.keyword;
    $scope.categoryName = '';
    $scope.no_results_keyword = '';

    angular.element(document).ready(function () {

      $timeout(function () {

        $scope.isReady = true;

      }, 3000);

    });

    $scope.getNoResultValue = function () {
      CategoryService.findByCode($scope.categoryId).then(function (response) {
        $scope.categoryName = response.name;
        $scope.no_results_keyword = $scope.keyword != undefined ? $scope.keyword: $scope.categoryName;
      });
    };

    $scope.getNoResultValue();
  }

  angular.module('app.controllers')
  .controller('NoResultsController', NoResultsController);

}());

(function() {
  'use strict';

  function TopSellersController ($scope, AdsItemService, SearchModelFactory, $stateParams, LocationService) {
    'ngInject';
    $scope.topSellersList = [];
    $scope.loading = true;
    $scope.page = 1;
    $scope.imgPathUrl = appConfig.imgUrlTemplate;

    $scope.theresTopSellersItems = function () {
      return ($scope.topSellersList.length > 0)
    };

    $scope.getTopSellersPaged = function () {
      LocationService.getCityById($stateParams.locationId).then(function (city) {
        AdsItemService.getTopSellers(city.latitude, city.longitude, $scope.page)
          .then(function (result) {
            $scope.topSellersList = $scope.topSellersList.concat(result.rows);
            $scope.hasMoreTopSellers = result.hasMore;
            $scope.loading = false;
            $scope.page += 1;
          });
      });
    };

    $scope.getTopSellersPaged();
  }

  angular.module('app.controllers')
  .controller('TopSellersController', TopSellersController);

}());

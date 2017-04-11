(function() {
  'use strict';

  function OurFavoritesController ($scope, AdsItemService, SearchModelFactory, $stateParams, LocationService) {
    'ngInject';
    $scope.ourFavoritesList = [];
    $scope.ourFavoritesPaged = [];
    $scope.loading = true;
    $scope.page = 1;
    $scope.imgPathUrl = appConfig.imgUrlTemplate;
    $scope.hasMoreFavorites = false;

    $scope.getOurFavoritesFiltered = function () {
      LocationService.getCityById($stateParams.locationId).then(function (city) {
        AdsItemService.getOurFavorites(city.latitude, city.longitude, $scope.page)
        .then(function (result) {
            $scope.ourFavoritesList = $scope.ourFavoritesList.concat(result.rows);
            if (result.hasMore) {
              $scope.hasMoreFavorites = true;
              $scope.page += 1;
              $scope.loading = false;
            } else {
              $scope.hasMoreFavorites = false;
            }
        });
      });
    };

    $scope.theresOurFavoritesItems = function(count){
        var nCount = (typeof count !== 'undefined')? count : 1;
        return ($scope.ourFavoritesList.length >= nCount)
    };


    $scope.getOurFavoritesFiltered();

  }

  angular.module('app.controllers')
  .controller('OurFavoritesController', OurFavoritesController);

}());

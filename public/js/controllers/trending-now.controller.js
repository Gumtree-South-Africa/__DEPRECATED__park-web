(function() {
  'use strict';

  function TrendingNowController ($scope, AdsItemService, SearchModelFactory) {
    'ngInject';

    $scope.trendingNowList = [];

    //watch changes on MainSeachData
    $scope.$watch(
      function(  ) {
        //When the return value change, the second function is called
        return( SearchModelFactory.location.id );
      },
      function( newValue, oldValue ) {

        $scope.getTrendingNowFiltered();
        //This is the place to process the new data. For example query the services again
      }
    );

    $scope.getTrendingNowFiltered = function () {

        AdsItemService.getTrendingItems(SearchModelFactory.location.latitude, SearchModelFactory.location.longitude)
        .then(function (result) {
            $scope.trendingNowList = result;
        });
    };

      $scope.theresTrendingNowItems=function(){
          return ($scope.trendingNowList.length > 0);
      }

    $scope.init = function () {
      this.getTrendingNowFiltered();
    };

    $scope.init();
  }

  angular.module('app.controllers')
  .controller('TrendingNowController', TrendingNowController);

}());

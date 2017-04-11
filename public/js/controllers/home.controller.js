(function() {
  'use strict';

  function HomeController ($scope, $rootScope, $state, $stateParams, $window, SearchModelFactory, UtilsService, BranchIoService, LocationService, AdsItemService, CategoryService) {

    'ngInject';
    /**
     * The 'state' is the one without location so we use the USA location if not,
     * that means we are in homeLocation as that state is the only other that uses this controller
     * so we ask for the location by the :locationId param
     */

    var locationPromise = $state.is('home') ?
      LocationService.getLocationUSA() :
      LocationService.getCityById($stateParams.locationId);
    var pageSize = 20;
    var radius = 20;
    var page = 0;
    var order = 'published,nearest';
    var getHomeItemsPaged = function () {};

    $scope.mySearchText = 'test';
    $scope.city_canonical_name = '';
    $scope.items = [];
    $scope.loading = true;
    $scope.hasMore = false;

    $scope.$on('vivalistItems.getMoreItems', function (e, scrollOptions) {
      scrollOptions.busy = true;
      $scope.getItems(function  () {
        scrollOptions.busy = !$scope.hasMore;
      });
    });

    var getMD = function () {
      var meta = {};
      if ($scope.items.length > 0) {
        meta['robots'] = 'index, follow';
      } else {
        meta['robots'] = 'follow, noindex';
      }

      meta['title'] = CategoryService.seoTags['Home Page'].title.replace(/#location#/g, $scope.city_canonical_name);
      meta['metaTitle'] = CategoryService.seoTags['Home Page'].metaTitle.replace(/#location#/g, $scope.city_canonical_name);
      meta['keywords'] = CategoryService.seoTags['Home Page'].metaKeywords.replace(/#location#/g, $scope.city_canonical_name);
      meta['description'] = CategoryService.seoTags['Home Page'].metaDescription.replace(/#location#/g, $scope.city_canonical_name);
      return meta;
    };

    getHomeItemsPaged = function (callback) {
        $scope.getItems(callback);
    };

    $scope.getItems = function(callback) {
      return locationPromise
          .then(function (responseLocation) {
            var items = [];
            $scope.city_canonical_name = responseLocation.canonical_name;
            var requestOptions = {
              page: page,
              pageSize: pageSize,
              order: order,
              radius: radius,
              latitude: responseLocation.latitude,
              longitude: responseLocation.longitude
            };
            var itemsPromise = $scope.isAuthenticated() ? AdsItemService.search(requestOptions) : AdsItemService.searchPublic(requestOptions);
            itemsPromise.then(function (resp) {
              $scope.items = $scope.items.concat(resp.data.items);
              $scope.loading = false;
              var totalItems = resp.data.totalElements;
              $scope.hasMore = pageSize * (page + 1) < totalItems;
              $rootScope.$emit('newMetaData', UtilsService.newMetadata($scope.metadata, getMD()));
              page = page + 1;
              if (callback) {
                callback();
              }
            });
          })
          .catch(function (err) {
            $scope.loading = false;
            console.log(err);
          });
    };


    getHomeItemsPaged();
  }

  angular.module('app.controllers')
  .controller('HomeController', HomeController);

}());

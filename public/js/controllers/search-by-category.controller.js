(function() {
  'use strict';

  function SearchByCategoryController ($scope, $stateParams, $state, $location, $window, UtilsService, AdsItemService, LocationService, SearchModelFactory, capitalizeFilter,CategoryService) {
      'ngInject';

      $window.scrollTo(0, 0);
      $scope.category = $stateParams.category;
      $scope.page = 1;
      $scope.itemList = [];
      $scope.hasMore = false;

      var dataLayer = window.dataLayer = window.dataLayer || [];
      dataLayer.push({
        "p": {
          "t": "ResultsBrowse"
        }
      });

      var getMD = function () {
        var meta = {};
        if($scope.locMD.name === '' || $scope.locMD.name === 'USA') {
          meta['description'] = capitalizeFilter($stateParams.category) + ' en Estados Unidos | Viva';
          meta['hasAppIndexingLink'] = true;
          meta['appIndexingLink'] = 'viva://categories/' + $stateParams.category;
        } else {
          meta['description'] = capitalizeFilter($stateParams.category) + ' en ' + $scope.locMD.name + ' | Viva';
        }
        if($scope.itemList.length > 0){
          meta['robots'] = 'index, follow';
        } else {
          meta['robots'] = 'follow, noindex';
        }
        meta['canonical'] = 'http://www.vivanuncios.com/';
        if ($scope.hasMore) {
          meta['hasPaginationNext'] = true;
          meta['next'] = $location.path() + "?page=" + ($scope.page + 1);
        }
        if ($scope.page > 1) {
          meta['hasPaginationPrev'] = true;
          meta['prev'] = $location.path() + "?page=" + ($scope.page - 1);
        }
        if($scope.locMD.name === '' || $scope.locMD.name === 'USA'){
          meta['title'] = capitalizeFilter($stateParams.category) + ' en Estados Unidos | Viva';
          meta['h1'] = capitalizeFilter($stateParams.category) + ' en Estados Unidos';
        } else {
          meta['title'] = capitalizeFilter($stateParams.category) + ' en ' + $scope.locMD.name + ' | Viva';
          meta['h1'] = capitalizeFilter($stateParams.category) + ' en venta en ' + $scope.locMD.name;
        }
        return meta;
      };

      var isWholeUsa = (!$stateParams.locationId);
      var resultCategory = CategoryService.getCategoryBreadcrumbName($stateParams.category);
      if($stateParams.category == 'allcategories'){
        SearchModelFactory.updateBreadcrumb($scope, 'All Categories', isWholeUsa);
      } else {
        resultCategory.then(function(category) {
          SearchModelFactory.updateBreadcrumb($scope, category.name, isWholeUsa);
        });
      }

      $scope.loadItems = function () {

        var loc = SearchModelFactory.getLocation(isWholeUsa);
        $scope.locMD = loc;

        if(isWholeUsa){
          loc.latitude = 0;
          loc.longitude = 0;
        }
        $scope.lsPromise = LocationService.getCoodsLocation(loc.latitude, loc.longitude);
        if (isWholeUsa) {
          LocationService.getCoodsLocationUSA.then(function (responseLocation) {
            var dataLayer = window.dataLayer = window.dataLayer || [];
            var ll = responseLocation[0].context.reverse();
            dataLayer.push({
              "l": {
                "l1": {
                  "id": ll[0].id,
                  "n": ll[0].text
                },
                "c": {
                  "id": ll[0].id,
                  "n": ll[0].text
                }
              }
            });
          });
        } else {
          $scope.lsPromise.then(function (responseLocation) {
            var dataLayer = window.dataLayer = window.dataLayer || [];
            var ll = responseLocation[0].context.reverse();
            dataLayer.push({
              "l": {
                "l1": {
                  "id": ll[0].id,
                  "n": ll[0].text
                },
                "l2": {
                  "id": ll[1].id,
                  "n": ll[1].text
                },
                "c": {
                  "id": responseLocation[0].id,
                  "n": responseLocation[0].place_name
                },
                "pcid": ll[2].text
              }
            });
          });
        }

        AdsItemService.getByCategory($scope.page, $scope.category, loc.latitude, loc.longitude).then(function (response) {
          $scope.itemList = $scope.itemList.concat(response.rows);
          UtilsService.getItemsUrl($scope.itemList);
          $scope.page += 1;
          $scope.count = response.count;
          $scope.hasMore = response.hasMore;

          $scope.$emit('newMetaData', UtilsService.newMetadata($scope.metadata, getMD()));
        });

      };

      CategoryService.getCategoryById($stateParams.category).then(function (c) {
        var dataLayer = window.dataLayer = window.dataLayer || [];
        dataLayer.push({
          "c": {
            "l1": {
              "id": c.id,
              "n": c.name
            }
          }
        });
      });

      $scope.loadItems();
  }

  angular.module('app.controllers')
  .controller('SearchByCategoryController', SearchByCategoryController);

}());

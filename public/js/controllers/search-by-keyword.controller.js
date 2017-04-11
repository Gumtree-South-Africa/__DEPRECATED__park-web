(function() {
  'use strict';

  function SearchByKeywordController ($scope, $rootScope, $stateParams, AdsItemService, $location, $window, $state, UtilsService, SearchModelFactory, capitalizeFilter, CategoryService, $q, locationResponse, itemsFounded, InstanceModal) {

    'ngInject';

    $window.scrollTo(0, 0);
    $scope.itemList = [];
    $scope.page = 0;
    $scope.hasMore = false;
    $scope.loading = true;
    $scope.keyword = $stateParams.keyword;
    $scope.categoryId = $stateParams.categoryId;
    $scope.categoryName = $stateParams.categoryId ?
      CategoryService
      .findByCode($stateParams.categoryId)
      .then(function (c) {
        return c.name;
      }) : $q.when('Home Page');

    $scope.pageSize = 10;
    $scope.city_canonical_name = '';

    var getMDPromise = function () {
      return $scope.categoryName
        .then(function (catName) {
          var meta = {};
          if ($scope.itemList.length > 0) {
            meta['robots'] = 'index, follow';
          } else {
            meta['robots'] = 'follow, noindex';
          }
          // meta['canonical'] = 'http://www.close5.com/';
          if ($scope.hasMore) {
            meta['hasPaginationNext'] = true;
            meta['next'] = $location.path() + "?page=" + ($scope.page + 1);
          }
          if ($scope.page > 1) {
            meta['hasPaginationPrev'] = true;
            meta['prev'] = $location.path() + "?page=" + ($scope.page - 1);
          }
          meta['title'] = CategoryService.seoTags[catName].title.replace(/#location#/g, $scope.city_canonical_name);
          meta['metaTitle'] = CategoryService.seoTags[catName].metaTitle.replace(/#location#/g, $scope.city_canonical_name);
          // meta['h1'] = CategoryService.seoTags[catName].metaTitle.replace(/#location#/g', $scope.city_canonical_name);
          meta['keywords'] = CategoryService.seoTags[catName].metaKeywords.replace(/#location#/g, $scope.city_canonical_name);
          meta['description'] = CategoryService.seoTags[catName].metaDescription.replace(/#location#/g, $scope.city_canonical_name);
          return meta;
        });
    };

    function init () {

      if (locationResponse) {
        $scope.city_canonical_name = locationResponse.canonical_name;
      }

      if (itemsFounded) {
        setMoreItems(itemsFounded.data);
      }

    }

    function setMoreItems (newItems) {
      $scope.count = newItems.totalElements;
      $scope.itemList = $scope.itemList.concat(newItems.items);
      UtilsService.getItemsUrl($scope.itemList);
      var totalItems = newItems.totalElements;
      $scope.loading = false;
      if ($scope.pageSize * ($scope.page + 1) < totalItems) {
        $scope.hasMore = true;
      } else {
        $scope.hasMore = false;
      }
      $rootScope.$emit('newMetaDataPromise', UtilsService.newMetadataPromise($scope.metadata, getMDPromise()));
      $scope.page = $scope.page + 1;
    }

    $scope.loadItems = function () {

      if ($scope.hasMore) {

        if (!locationResponse) {
          LocationService.getCityById($stateParams.locationId)
          .then(function(location) {
            var requestOption = {
              categoryId: CategoryService.codesToIds[$stateParams.categoryId],
              page: $scope.page,
              pageSize: 10,
              latitude: location.latitude,
              longitude: location.longitude,
              radius: 20,
              order: 'published,nearest'
            };
            AdsItemService.searchPublic(requestOption)
            .then(function(itemsFounded) {
              setMoreItems(itemsFounded.data);
            });
          });
        } else {
          var requestOption = {
              categoryId: CategoryService.codesToIds[$stateParams.categoryId],
              page: $scope.page,
              pageSize: 10,
              latitude: locationResponse.latitude,
              longitude: locationResponse.longitude,
              radius: 20,
              order: 'published,nearest'
            };
          AdsItemService.searchPublic(requestOption)
          .then(function(itemsFounded) {
            setMoreItems(itemsFounded.data);
          });
        }
      }

    };

    $scope.likeToggle = function (item) {
      if ($scope.isAuthenticated()) {
        AdsItemService.toggleLikeItem(item.id, !item.followedByUser).then(function () {
          item.followedByUser = !item.followedByUser;
          item.totalOfFollowers = item.followedByUser ?
            item.totalOfFollowers + 1 :
            item.totalOfFollowers - 1;
        });
      } else {
        InstanceModal.loginModal({
  resolve: {
    DisplayTitleMessage: function () {
      return false;
    }
  }
});
      }
    };

    init();
  }

  angular.module('app.controllers')
  .controller('SearchByKeywordController', SearchByKeywordController);

}());

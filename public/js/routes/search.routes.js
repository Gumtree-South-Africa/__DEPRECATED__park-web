(function() {
  'use strict';

  function SearchAppRoutes ($stateProvider) {
    'ngInject';

    $stateProvider
      .state('search',
        {
          abstract: true,
          url: '/s/{locationId:[a-zA-Z\-]{1,}\-[a-zA-Z\-]{1,}}',
          template: '<ui-view>',
          resolve: {
            'locationResponse' : ['LocationService', '$stateParams' , function (LocationService, $stateParams) {
              return LocationService.getCityById($stateParams.locationId);
            }]
          }
        })
      .state('search.keyword',
        {
          url: '/{keyword:[^/]*}',
          views: {
            '@': {
              templateUrl: 'views/search-results.html',
              controller: 'SearchByKeywordController'
            }
          },
          resolve: {
            'itemsFounded' : ['locationResponse', 'AdsItemService', '$stateParams', function (locationResponse, AdsItemService, $stateParams) {
              var requestOption = {
                q: $stateParams.keyword,
                page: 0,
                pageSize: 10,
                latitude: locationResponse.latitude,
                longitude: locationResponse.longitude,
                radius: 20,
                order: 'published,nearest'
              };
              return AdsItemService.searchPublic(requestOption);
            }]
          },
          reloadOnSearch: false
        })
      .state('search.keywordCategory',
        {
          url: '/{keyword:[^/]*}/:categoryId',
          views: {
            '@': {
              templateUrl: 'views/search-results.html',
              controller: 'SearchByKeywordController'
            }
          },
          resolve: {
            'itemsFounded' : ['locationResponse', 'AdsItemService', 'CategoryService', '$stateParams', function (locationResponse, AdsItemService, CategoryService, $stateParams) {
              var requestOption = {
                q: $stateParams.keyword,
                categoryId: CategoryService.codesToIds[$stateParams.categoryId],
                page: 0,
                pageSize: 10,
                latitude: locationResponse.latitude,
                longitude: locationResponse.longitude,
                radius: 20,
                order: 'published,nearest'
              };
              return AdsItemService.searchPublic(requestOption);
            }]
          },
          reloadOnSearch: false
        })
      .state('searchCategory',
        {
          url: '/c/{locationId:[a-zA-Z\-]{1,}\-[a-zA-Z\-]{1,}}/:categoryId',
          views: {
            '@': {
              templateUrl: 'views/search-results.html',
              controller: 'SearchByKeywordController'
            }
          },
          resolve: {
            'locationResponse' : ['LocationService', '$stateParams', function (LocationService, $stateParams) {
              return LocationService.getCityById($stateParams.locationId);
            }],
            'itemsFounded': ['locationResponse', 'AdsItemService', 'CategoryService', '$stateParams', function (locationResponse, AdsItemService, CategoryService, $stateParams) {
              var requestOption = {
                categoryId: CategoryService.codesToIds[$stateParams.categoryId],
                page: 0,
                pageSize: 10,
                latitude: locationResponse.latitude,
                longitude: locationResponse.longitude,
                radius: 20,
                order: 'published,nearest'
              };
              return AdsItemService.searchPublic(requestOption);
            }]
          },
          reloadOnSearch: false
        });

  }

  angular.module('vivaApp')
  .config(SearchAppRoutes);

}());

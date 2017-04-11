(function() {
  'use strict';

  function HomeAppRoutes ($stateProvider) {
    'ngInject';

    $stateProvider
      .state('root',
        {
          url: '/',
          template: '<ui-view>',
          controller: rootController
        })
      .state('home',
        {
          url: '/home',
          template: '<ui-view>',
          controller: homeController
        })
      .state('homeNoLocation',
        {
          url: '/home/',
          template: '<ui-view>',
          controller: rootController
        })
      .state('homeLocation',
        {
          url: "/home/{locationId:[a-zA-Z\-]{1,}\-[a-zA-Z\-]{1,}}",
          templateUrl: 'views/home.html',
          controller: 'HomeController',
          reloadOnSearch: false
        });

    function rootController ($state) {
      'ngInject';
      $state.go('home');
    }

    function homeController ($state, LocationService, $cookies) {
      'ngInject';
      LocationService.getUserPosition()
        .then(function (coors) {
          LocationService.getCityByLatLng(coors.latitude, coors.longitude)
            .then(function (city) {
              $cookies.put('user-location', city.id);
              $state.go('homeLocation', {
                locationId: city.id
              });
            })
            .catch(function (err) {
              $cookies.put('user-location', 'houston-tx');
              $state.go('homeLocation', {
                locationId: 'houston-tx'
              });
            })
        })
        .catch(function (err) {
          $cookies.put('user-location', 'houston-tx');
          $state.go('homeLocation', {
            locationId: 'houston-tx'
          });
        });
    }
  }

  angular.module('vivaApp')
  .config(HomeAppRoutes);

}());

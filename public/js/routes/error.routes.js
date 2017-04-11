(function() {
  'use strict';

  function ErrorAppRoutes ($stateProvider) {
    'ngInject';

    $stateProvider
      .state('error',
        {
          abstract: true,
          url: '/error',
          template: '<ui-view>'
        })
      .state('error.productNotFound',
        {
          url: '/productNotFound',
          templateUrl: 'views/error/product-not-found.html',
          controller: notFoundController
        })
      .state('error.groupNotFound',
        {
          url: '/groupNotFound',
          templateUrl: 'views/error/group-not-found.html',
          controller: notFoundController
        })
      .state('error.profileNotFound',
        {
          url: '/profileNotFound',
          templateUrl: 'views/error/profile-not-found.html',
          controller: notFoundController
        })
      .state('error.userNotAuthorized',
        {
          url: '/userNotAuthorized',
          templateUrl: 'views/error/user-not-authorized.html',
          controller: notFoundController
        })
      .state('error.userAccessRestricted',
      {
        url: '/userAccessRestricted',
        templateUrl: 'views/error/user-access-restricted.html',
        controller: notFoundController
      })
      .state('404', {
        templateUrl: 'views/404-page.html'
      });

      function notFoundController ($rootScope, UtilsService, $scope) {
        'ngInject';
        $rootScope.$emit('newMetaData', UtilsService.newMetadata($scope.metadata, {
          'title': 'Vivanuncios Estados Unidos',
          'description': '',
          'robots': 'follow, noindex'
        }));
      };
  }

  angular.module('vivaApp')
  .config(ErrorAppRoutes);

}());

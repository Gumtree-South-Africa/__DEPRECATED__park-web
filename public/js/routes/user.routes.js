(function() {
  'use strict';

  function UserAppRoutes ($stateProvider) {
    'ngInject';

    $stateProvider
      .state('group',
        {
          url: '/gr/:groupName/:groupId',
          templateUrl: 'views/group.html',
          controller: 'GroupController'
        })
      .state('userProfile',
        {
          url: '/profile/:id',
          templateUrl: 'views/user-profile.html',
          controller: 'UserProfileController'
        })
      .state('userProfileName',
        {
          url: '/:username/users/:id',
          templateUrl: 'views/user-profile.html',
          controller: 'UserProfileController'
        })
      .state('verifyAccount',
        {
          abstract: true,
          url: '/signup/verify',
          template: '<ui-view>'
        })
      .state('verifyAccount.success',
        {
          url:'/success',
          templateUrl: '/views/statics/verify-account-success.html'
        })
      .state('verifyAccount.error',
          {
            url:'/error',
            templateUrl: '/views/statics/verify-account-error.html'
          })

  }

  angular.module('vivaApp')
  .config(UserAppRoutes);

}());

(function() {
  'use strict';

  function UserProfileController ($rootScope, $scope, $window, AdsItemService, UserService, $stateParams, $state, UtilsService, $auth, FollowUserService, InstanceModal) {
    'ngInject';

    var page = 0;
    var totalPages = 0;

    var pageSize = UtilsService.isRunningOnMobile() ? 4 : 25;
    var username = $stateParams.id;

    $scope.followersPromise = function (username) {
      UserService.getFollowers(username, $auth.isAuthenticated())
        .then(function (resp) {
          var followers = resp.data.users;
          $scope.followers = followers;
        });
    };
    $scope.followingsPromise = function (username) {
      UserService.getFollowings(username, $auth.isAuthenticated())
        .then(function (resp) {
          var followings = resp.data.users;
          $scope.followings = followings;
        });
    };

    $scope.items = [];
    $scope.followers = [];
    $scope.followings = [];
    $scope.hasMore = true;
    $scope.loadingProfile = true;
    $scope.loadingItems = false;
    $scope.userPromise = UserService.getByUsername(username);
    $scope.runningOnMobile = UtilsService.isRunningOnMobile();
    $scope.tabModalFollowersFollowings = {};
    $scope.tabModalFollowersFollowings.active = '';
    $scope.isUserLogged = false;
    // $scope.cbFollowers = function () {
    //   followersPromise();
    // };
    // $scope.cbFollowings = function () {
    //   followingsPromise();
    // };
    $scope.cb = function () {
      UserService.getByUsername(username).then(function (resp) {
        $scope.user = resp.data;
      });
      $scope.followersPromise(username);
      $scope.followingsPromise(username);
    };

    $scope.isFollowed = FollowUserService.isFollowed;
    $scope.isLoggedUser = FollowUserService.isLoggedUser;
    $scope.toggleFollowUser = FollowUserService.toggleFollowUser;

    $scope.userPromise.then(function (resp) {
      if(resp.statusCode === 1){
        $rootScope.$emit('newMetaData', UtilsService.newMetadata($scope.metadata, {
          'title': resp.data.username + ' vende en ' + resp.data.locationName + ' ' + resp.data.zipCode + ' | Vivanuncios Estados Unidos',
          'canonical': 'http://www.vivanuncios.com/profile/' + UtilsService.$formatURLString(resp.data.username)
        }));
        $scope.user = resp.data;
        if ($auth.getPayload()) {
          $scope.isUserLogged = $auth.getPayload().username === $scope.user.username;
        }
        $scope.followersPromise(resp.data.username);
        $scope.followingsPromise(resp.data.username);
        $scope.loadItems();
        $scope.hasSocial = function (social) {
          var userSocials = $scope.user.userSocials;
          if (userSocials === undefined) {
            return false;
          }
          return ( userSocials.indexOf(social) != -1);
        };
      } else {
        $state.go('error.profileNotFound');
      }
      $scope.loadingProfile = false;
      $scope.loadingItems = true;
    });

    $scope.loadItems = function () {
      if (page === 0 || page < totalPages) {
        AdsItemService.findByUser($scope.user.username, {page: page, pageSize: pageSize}).then(function (resp) {
          $scope.items = $scope.items.concat(resp.data.items);
          UtilsService.getItemsUrl($scope.items);
          totalPages = resp.data.totalPages;
          page++;
          $scope.hasMore = page < totalPages;
          $scope.loadingItems = false;
        })
      }
    };

    $scope.likeToggle = function (item) {
      if ($scope.isAuthenticated()) {
        if (item.status === 'ACTIVE') {
          AdsItemService.toggleLikeItem(item.id, !item.followedByUser).then(function () {
            item.followedByUser = !item.followedByUser;
            item.totalOfFollowers = item.followedByUser ?
            item.totalOfFollowers + 1 :
            item.totalOfFollowers - 1;
          });
        }
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

    $scope.$formatDate = function (strDate) {
      if (typeof strDate === 'undefined') {
        return "";
      }
      return moment.unix(strDate).format("MM/DD/YYYY");
    };

  }

  angular.module('app.controllers')
  .controller('UserProfileController', UserProfileController);

}());

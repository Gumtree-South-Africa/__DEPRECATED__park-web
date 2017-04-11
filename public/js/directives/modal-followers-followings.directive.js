/**
 * Created by neto on 04/04/16.
 */
(function() {
  'use strict';

  function ModalFollowersFollowings (
    $auth,
    $filter,
    $rootScope,
    $state,
    $timeout,
    FollowUserService,
    SmartBanner,
    UserService,
    UtilsService
  ) {
    'ngInject';

    return {
      restrict: 'E',
      transclude: true,
      replace: true,
      templateUrl: 'views/partials/modal-followers-followings.directive.html',
      scope: {
        userInfo: '=',
        followers: '=',
        followings: '=',
        retriveFollowers: '&',
        retriveFollowings: '&',
        tabActive: '='
      },
      link: function (scope, element, attrs) {

        var defaultImage = '../../../images/vivanuncios/avatar_ph_image_4.svg';
        var defaultImage = '../../../images/vivanuncios/avatar_ph_image_4.svg';
        var isOpened = false;
        var updateFollowers = false;
        scope.usernameLogged = '';
        scope.titleTxt = '';
        scope.followersCopy = [];
        scope.followingsCopy = [];


        if ($auth.isAuthenticated()) {
          scope.usernameLogged = $auth.getPayload().username;
        }

        var bannerWasVisible = false;

        $rootScope.$on('$stateChangeStart',
        function(event, toState, toParams, fromState, fromParams, options){
          $('#modal-followers-followings').modal('hide');
        });

        $('#modal-followers-followings').on('shown.bs.modal', function () {
          isOpened = true;
          scope.followingsCopy = angular.copy(scope.followings);
          scope.followersCopy = angular.copy(scope.followers);
          $('.tab-pane').animate({ scrollTop: 0 }, 0);
          if (scope.usernameLogged === scope.userInfo.username) {
            updateFollowers = true;
          }
          updateTitle();

          if (UtilsService.isRunningOnMobile() && SmartBanner.isVisible()) {
            SmartBanner.hideBanner();
            bannerWasVisible = true;
          }

          scope.$apply();
        });

        $('#modal-followers-followings').on('hidden.bs.modal', function () {
          isOpened = false;
          if (UtilsService.isRunningOnMobile() && bannerWasVisible) {
            SmartBanner.showBanner();
            bannerWasVisible = false;
          }
        });

        $('#tabs-follwer-following a:first').on('shown.bs.tab',function () {
          scope.tabActive.active = 'followings';
        });

        $('#tabs-follwer-following a:last').on('shown.bs.tab',function () {
          scope.tabActive.active = 'followers';
        });

        function updateTitle () {
           if (scope.tabActive.active === 'followings') {
            scope.titleTxt = 'Siguiendo (' + scope.followingsCopy.length + ')';
            $('#tabs-follwer-following a:first').tab('show');
          } else if (scope.tabActive.active === 'followers') {
            scope.titleTxt = 'Seguidores (' + scope.followersCopy.length +')';
            $('#tabs-follwer-following a:last').tab('show');
          }
        }

        scope.isAuthenticated = function () {
          return $auth.isAuthenticated();
        };

        var followersPromise = function (username) {
          return UserService.getFollowers(username, $auth.isAuthenticated())
            .then(function (resp) {
              var followers = resp.data.users;
              scope.followers = followers;
            });
        };
        var followingsPromise = function (username) {
          return UserService.getFollowings(username, $auth.isAuthenticated())
            .then(function (resp) {
              var followings = resp.data.users;
              scope.followings = followings;
            });
        };

        var isOnArray = function (array, element) {
          return $filter('filter')(array, function (val, index, arr) {
            return val.userId === element.userId;
          }).length > 0;
        }

        scope.toggleFollowUser = function  (followering) {
          FollowUserService.toggleFollowUser(followering.username, followering.followedByUser, function  () {
            followering.followedByUser = !followering.followedByUser;


            if (scope.tabActive.active === 'followings') {
              followersPromise(scope.userInfo.username)
              .then(function () {
                scope.followersCopy = angular.copy(scope.followers);
                updateTitle();
              });
              followingsPromise(scope.userInfo.username);
            } else {
              followingsPromise(scope.userInfo.username)
              .then(function () {
                if ( !updateFollowers ) {
                  scope.followingsCopy = angular.copy(scope.followings);
                } else if ( isOnArray(scope.followingsCopy, followering) ) {
                  angular.forEach(scope.followingsCopy,function (val, index) {
                    if (val.userId === followering.userId) {
                      val.followedByUser = followering.followedByUser;
                    }
                  });
                } else {
                  scope.followingsCopy.push(followering);
                  scope.followingsCopy = $filter('orderBy')(scope.followingsCopy, 'userId');
                }

                updateTitle();

              });
              followersPromise(scope.userInfo.username);
            }

          }, function (message) {
            if (message === 'no-auth') {
              $('#modal-followers-followings').modal('hide');
            }
          });
        };

        scope.setBackground = function(picture) {
          var style = {};
          if (picture) {
            style['background-image'] = 'url('+picture+')';
          } else {
            style['background-image'] = 'url('+defaultImage+')';
          }
          return style;
        };

        scope.visitProfile = function (username) {
          $('#modal-followers-followings').modal('hide');
          $state.go('userProfile',{id:username});
        }

        scope.$on('$stateChangeStart',function () {
          if (isOpened) {
            $('#modal-followers-followings').modal('hide');
          }
        });

      }
    }
  }

  angular.module('app.directives')
  .directive('modalFollowersFollowings', ModalFollowersFollowings);

}());

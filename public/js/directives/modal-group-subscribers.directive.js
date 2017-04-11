/**
 * Created by neto on 04/04/16.
 */
(function() {
  'use strict';

  function ModalGroupSubscribers (GroupService, $timeout, $auth, FollowUserService, $rootScope, $state) {
    'ngInject';

    return {
      restrict: 'E',
      transclude: true,
      replace: true,
      templateUrl: 'views/partials/modal-group-subscribers.directive.html',
      scope: {
        groupSubscribers: '=',
        groupName: '=',
        hasMoreSubscribers: '=',
        getMoreSubscribers: '&',
        scrollBusy: '='
      },
      link: function (scope, element, attrs) {
        scope.hasMore = true;
        scope.usernameLogged = '';

        var defaultImage = '../../../images/vivanuncios/avatar_ph_image_4.svg';
        var isOpened = false;

        if ($auth.isAuthenticated()) {
          scope.usernameLogged = $auth.getPayload().username;
        }

        $('#modal-group-subscribers').on('shown.bs.modal', function () {
          isOpened = true;
          scope.groupName = scope.groupName.replace(/\.$/,"");
          $('#suscribers-scroll-content').animate({ scrollTop: 0 }, 0);
        });

        $('#modal-group-subscribers').on('hidden.bs.modal', function () {
          isOpened = false;
        });

        scope.toggleFollowUser = function  (subscriber) {
          FollowUserService.toggleFollowUser(subscriber.username, subscriber.followedByUser, function () {
            subscriber.followedByUser = !subscriber.followedByUser;
            subscriber.isFollowed = scope.isAuthenticated() && subscriber.followedByUser;
          }, function (message) {
            if (message === 'no-auth') {
              $('#modal-group-subscribers').modal('hide');
            }
          });
        };

        scope.isAuthenticated = function () {
          return $auth.isAuthenticated();
        };

        scope.getMore = function () {
          scope.getMoreSubscribers();
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
          $('#modal-group-subscribers').modal('hide');
          $state.go('userProfile',{id:username});
        }

        scope.$on('$stateChangeStart',function () {
          if (isOpened) {
            $('#modal-group-subscribers').modal('hide');
          }
        });

      }

    }
  }

  angular.module('app.directives')
  .directive('modalGroupSubscribers', ModalGroupSubscribers);

}());


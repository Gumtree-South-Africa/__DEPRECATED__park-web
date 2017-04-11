(function() {
  'use strict';

  function FollowUserService (UserService, $auth, InstanceModal) {
    'ngInject';

    return {
      toggleFollowUser: function (toggleUsername, followedByUser, callback, rejectCallback) {
        if ($auth.isAuthenticated()) {
          var currentUsername = $auth.getPayload().username;
          var request = followedByUser ?
            UserService.unFollowUser(currentUsername, toggleUsername) :
            UserService.followUser(currentUsername, toggleUsername);
          request.then(function (resp) {
            if (resp.statusCode === 1 && callback) {
              callback();
            } else {
              if (rejectCallback) {
                rejectCallback('reject',resp);
              }
            }
          })
        } else {
          if (rejectCallback) {
            rejectCallback('no-auth');
          }
          InstanceModal.loginModal({
  resolve: {
    DisplayTitleMessage: function () {
      return false;
    }
  }
});
        }
      },
      isFollowed: function (user) {
        return user && user.followedByUser;
      },
      isLoggedUser: function (username) {
        return $auth.isAuthenticated() && ($auth.getPayload().username === username);
      }
    };
  }

  angular.module('app.services')
  .service('FollowUserService', FollowUserService);

}());

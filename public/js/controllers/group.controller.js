(function () {
  'use strict';

  function GroupController ($rootScope, $scope, $window, AdsItemService, UserService, $stateParams, $state, UtilsService, GroupService, $auth, InstanceModal) {
    'ngInject';

    var groupId = $stateParams.groupId;

    $scope.loadingGroup = true;
    $scope.loadingItems = false;
    $scope.hasMore = false;
    $scope.hasMoreSubscribers = false;
    $scope.groupItems = [];
    $scope.groupSubscribers = [];
    $scope.groupName = '';
    $scope.subscribeButtonText = 'SUSCRIBIR';
    $scope.isOwner = false;
    $scope.groupPromise = function () {
      var promise;
      if ($auth.isAuthenticated()) {
        promise = GroupService.find(groupId);
      } else {
        promise = GroupService.find(groupId, { 'includeAdminUser': true });
      }
      return promise;
    }


    var pageSize = 24;
    var page = 0;
    var pageSubscribers = 0;

    $scope.modalScrollBusy = true;

    $scope.getMoreSubscribers = function () {
      $scope.modalScrollBusy = true;
      return GroupService.getSubscribers(groupId, {
          page: pageSubscribers,
          pageSize: pageSize
        })
        .then(function (resp) {
          if (resp.data.amountUsersFound > 0) {
            $scope.groupSubscribers = $scope.groupSubscribers.concat(resp.data.users);
            angular.forEach($scope.groupSubscribers, function (subscriber, index) {
              subscriber.isFollowed = $auth.isAuthenticated() && subscriber.followedByUser;
            });
            var totalItems = resp.data.totalElements;
            $scope.hasMoreSubscribers = pageSize * (pageSubscribers + 1) < totalItems;
            pageSubscribers = pageSubscribers + 1;
            $scope.modalScrollBusy = false;
          } else {
            $scope.modalScrollBusy = true;
          }
        });
    };


    $scope.showSubscribersModal = function () {
      $('#modal-group-subscribers').modal();
      $scope.modalScrollBusy = false;
    };


    $scope.groupPromise()
      .then(function (resp) {
        if(resp.statusCode === 1){
          $rootScope.$emit('newMetaData', UtilsService.newMetadata($scope.metadata, {
            'title': resp.data.name + ' | Grupo en ' + resp.data.locationName + ' ' + resp.data.zipCode + ' | Vivanuncios Estados Unidos',
            'canonical': 'http://www.vivanuncios.com/gr/' + UtilsService.$formatURLString(resp.data.name) + '/' + resp.data.id
          }));
          $scope.group = resp.data;
          $scope.groupName = $scope.group.name;
          $scope.getMoreSubscribers().then(function(){
            $scope.modalScrollBusy = true;
          });
          if ($auth.isAuthenticated()) {
            $scope.isOwner = $scope.group.owner.username.toLowerCase() === $auth.getPayload().username.toLowerCase();
          }
          if ($scope.group.subscribers.length > 0 ) {
            $scope.subscribersPreview = shiftUserLogged($scope.group.subscribers.slice(0, 4));

            // $scope.subscribersPreview.unshift({
            //   picture: $scope.group.owner.profilePicture,
            //   userId: $scope.group.owner.id,
            //   username: $scope.group.owner.username
            // });
          } else if ($auth.isAuthenticated()) {
            // when a user is logged in the group endpoint only brings the subscribers that the user follows, so if the user doesn't follow any of the subscribers, the preview list will be empty. In this case we call the getSubscribers service to get them.
            GroupService.getSubscribers(groupId, {
                page: pageSubscribers,
                pageSize: pageSize
              })
            .then(function (resp) {
              $scope.subscribersPreview = _.map(resp.data.users.slice(0, 4), function (item) {
                return { username: item.username, picture: item.profilePicture };
              });
              $scope.subscribersPreview = shiftUserLogged($scope.subscribersPreview);
            });
          }
          if (resp.data.subscribed) {
            $scope.subscribeButtonText = 'SUSCRIPTO';
          }
          $scope.getMoreItemsPaged();
        } else {
          $state.go('error.groupNotFound');
        }
        $scope.loadingGroup = false;
        $scope.loadingItems = true;
      });

    function shiftUserLogged(suscribers) {
      if($auth.isAuthenticated()) {
        var index = suscribers.findIndex(function (suscriber) {
          return suscriber.username.toLowerCase() === $auth.getPayload().username.toLowerCase();
        });
        if (index >= 0) {
          suscribers.splice(index,1);
        }
        return suscribers;
      }
      return suscribers;
    }

    $scope.toggleSubscribe = function () {
      if ($scope.isAuthenticated()) {
        if($scope.group.subscribed){
          GroupService.unsubscribe(groupId).then(function (resp) {
            if(resp.statusCode === 1){
              $scope.group.subscribed = false;
              $scope.subscribeButtonText = 'SUSCRIBIR';
              return GroupService.getSubscribers(groupId, {
                    page: 0,
                    pageSize: pageSize
                  });
            }
          })
          .then(function (resp) {
            if (resp.data.amountUsersFound > 0) {
              $scope.groupSubscribers = resp.data.users;
              angular.forEach($scope.groupSubscribers, function (subscriber, index) {
                subscriber.isFollowed = $auth.isAuthenticated() && subscriber.followedByUser;
              });
              var totalItems = resp.data.totalElements;
              $scope.hasMoreSubscribers = pageSize * (pageSubscribers + 1) < totalItems;
              pageSubscribers = pageSubscribers + 1;
              $scope.subscribersPreview.forEach(function(val, index) {
                if (val.username.toLowerCase() === $auth.getPayload().username.toLowerCase()) {
                  $scope.subscribersPreview.splice(index,1);
                }
              });
              $scope.group.totalSubscribers = $scope.group.totalSubscribers - 1;
              $scope.modalScrollBusy = false;
            } else {
              $scope.modalScrollBusy = true;
            }
          });
        } else {
          GroupService.subscribe(groupId)
          .then(function (resp) {
            if(resp.statusCode === 1){
              $scope.group.subscribed = true;
              $scope.subscribeButtonText = 'SUSCRIPTO';
            return GroupService.getSubscribers(groupId, {
                    page: 0,
                    pageSize: pageSize
                  });
            }
          })
          .then(function (resp) {
            if (resp.data.amountUsersFound > 0) {
              $scope.groupSubscribers = resp.data.users;
              angular.forEach($scope.groupSubscribers, function (subscriber, index) {
                subscriber.isFollowed = $auth.isAuthenticated() && subscriber.followedByUser;
              });
              var totalItems = resp.data.totalElements;
              $scope.hasMoreSubscribers = pageSize * (pageSubscribers + 1) < totalItems;
              $scope.group.totalSubscribers = $scope.group.totalSubscribers + 1;
              pageSubscribers = pageSubscribers + 1;
              $scope.modalScrollBusy = false;
            } else {
              $scope.modalScrollBusy = true;
            }

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

    $scope.getMoreItemsPaged = function () {
      if (page === 0 || $scope.hasMore) {
        if ($scope.isAuthenticated()) {
          AdsItemService.search({
            pageSize: 24,
            tagNewItem: true,
            groupId: groupId,
            order: 'published',
            page: page
          })
            .then(function (resp) {
              $scope.groupItems = $scope.groupItems.concat(resp.data.items);
              UtilsService.getItemsUrl($scope.groupItems);
              var totalItems = resp.data.totalElements;
              $scope.hasMore = pageSize * (page + 1) < totalItems;
              page = page + 1;
              $scope.loadingItems = false;
            });
        } else {
          AdsItemService.searchPublic({
            pageSize: 24,
            groupId: groupId,
            order: 'published',
            page: page
          })
            .then(function (resp) {
              $scope.groupItems = $scope.groupItems.concat(resp.data.items);
              UtilsService.getItemsUrl($scope.groupItems);
              var totalItems = resp.data.totalElements;
              $scope.hasMore = pageSize * (page + 1) < totalItems;
              page = page + 1;
              $scope.loadingItems = false;
            });
        }
      }
    };

  }

  angular.module('app.controllers')
  .controller('GroupController', GroupController);

}());

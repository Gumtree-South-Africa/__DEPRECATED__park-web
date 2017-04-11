(function() {
  'use strict';

  function ItemDetailController ($rootScope, $scope, $stateParams, $state, $window, $timeout, AdsItemService, LocationService, UtilsService, SearchModelFactory, CategoryService, $q, BranchIoService, UserService, FollowUserService, $auth, $uibModal, InstanceModal) {

    'ngInject';

    var deferred = $q.defer();
    //$scope.imgPathUrl = appConfig.imgUrlTemplate;
    $scope.entityId = $stateParams.itemId;
    $scope.entity = {
      description: '',
      photoCount: 0
    };
    $scope.comments = {};
    $scope.map = {};
    $scope.map.showMap = false;
    $scope.runningOnMobile = false;
    $scope.activeImageIndex = 0;
    $scope.photoCount = 0;
    $scope.itemLocation = '';
    $scope.imageIndexList = [];
    $scope.otherItemList = [];
    $scope.userPromise = deferred.promise;
    $scope.descriptionForItem = '';
    $scope.isReady = false;
    $scope.loadingItem = true;
    $scope.loadingProfileItems = false;
    $scope.linkReady = false;
    $scope.userInfo = [];
    $scope.isCollapsed = true;
    $scope.followers = [];
    $scope.followings = [];
    $scope.tabModalFollowersFollowings = {};
    $scope.tabModalFollowersFollowings.active = '';
    $scope.isUserLogged = false;
    $scope.goChat = goChat;
    $scope.city = 'USA';

    //sliders variables
    $scope.slides = [];
    $scope.myInterval = 5000;
    $scope.noWrapSlides = false;
    $scope.active = 0;

    var currIndex = 0;
    var circleRadioMeters = appConfig.mapSetting.redCircleRadioMiles * 1609.34;
    var draggingEnable = !UtilsService.isRunningOnMobile();

    $scope.isFollowed = FollowUserService.isFollowed;
    $scope.isLoggedUser = FollowUserService.isLoggedUser;
    $scope.toggleFollowUser = FollowUserService.toggleFollowUser;

    angular.extend($scope.map, {
      center: {
        lat: 0,
        lng: 0,
        zoom: appConfig.mapSetting.zoom
      },
      tiles: {
        name: '',
        url: 'https://api.tiles.mapbox.com/v4/{mapid}/{z}/{x}/{y}.png?access_token={apikey}',
        type: 'xyz',
        options: {
          apikey: appConfig.mapboxApiToken,
          mapid: 'mapbox.' + appConfig.mapSetting.style
        }
      },
      paths: {
        circle: {
          type: "circle",
          color: "red",
          weight: 0.5,
          radius: circleRadioMeters,
          latlngs: {
            lat: 0,
            lng: 0
          },
          clickable: false
        }
      },
      defaults: {
        scrollWheelZoom: false,
        dragging: draggingEnable,
        touchZoom: draggingEnable,
        doubleClickZoom: true,
        zoomControl: draggingEnable
      }
    });

    var x = {};

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

    angular.extend($scope, {
      setActiveImageIndex: function (index) {
        $scope.imageIndexList = UtilsService.range(0, $scope.entity.pictures.length);
        var i = $scope.imageIndexList.indexOf(index);
        $scope.imageIndexList.splice(i, 1);
        $scope.activeImageIndex = index;
      },
      mustShowImageList: function (index) {
        return (this.imageIndexList.length >= 1);
      },
      mustShowComments: function (index) {
        return (this.comments.length > 1);
      },
      isLiked: function () {
        if ($scope.entity.followedByUser === undefined) {
          return false;
        }
        return ($scope.entity.followedByUser);
      },
      hasSocial: function (social) {
        var userSocials = $scope.userInfo.userSocials;
        if (userSocials === undefined) {
          return false;
        }
        return (userSocials.indexOf(social) !== -1);
      },

      isRunningOnMobile: UtilsService.isRunningOnMobile
    });

    $scope.init = function () {

      this.runningOnMobile = this.isRunningOnMobile();

      AdsItemService.find(this.entityId).then(function (item) {

        if (item.statusCode === 1) {
          $rootScope.$emit('newMetaData', UtilsService.newMetadata($scope.metadata, {
            'title': item.data.name + ' en ' + item.data.locationName + ' ' + item.data.zipCode + ' | Vivanuncios Estados Unidos',
            'canonical': 'http://www.vivanuncios.com/pr/' + UtilsService.$formatURLString(item.data.category.name) + '/' + UtilsService.$formatURLString(item.data.name) + '/' + item.data.id
          }));

          $scope.cbFollowUser = function () {
            UserService.getByUsername(item.data.user.username).then(function (userInfo) {
              $scope.userInfo = userInfo.data;
            });
          };

          $scope.imageIndexList = UtilsService.range(1, item.data.pictures.length);
          // Get Location
          LocationService.getCityByLatLng(item.data.latitude, item.data.longitude)
          .then(function (city) {
            $scope.map.showMap = true;
            $scope.map.center.lng = city.longitude;
            $scope.map.center.lat = city.latitude;
            $scope.map.paths.circle.latlngs.lat = city.latitude;
            $scope.map.paths.circle.latlngs.lng = city.longitude;
            $scope.itemLocation = city.canonical_name;
          })
          .catch(function (error) {
            LocationService.getCityByZipcode(item.data.zipCode)
            .then(function (city) {
              var feat = city.features[0];
              $scope.map.showMap = true;
              $scope.map.center.lng = feat.center[0];
              $scope.map.center.lat = feat.center[1];
              $scope.map.paths.circle.latlngs.lat = feat.center[1];
              $scope.map.paths.circle.latlngs.lng = feat.center[0];
              $scope.itemLocation = item.data.locationName;
            });
          });
          $scope.loadingItem = false;
          $scope.loadingProfileItems = true;

          var pageSize = $scope.isRunningOnMobile() ? 2 : 5;
          var requestOptions = {
            page: 0,
            pageSize: pageSize
          };
          var otherItemsPromise = AdsItemService.findByUser(item.data.user.username, requestOptions, item.data.id);
          otherItemsPromise.then(function (resultotherItemList) {
            $scope.otherItemList = resultotherItemList.data.items;
            UtilsService.getItemsUrl($scope.otherItemList);
            $scope.hasMore = resultotherItemList.data.totalPages > 1;
            $scope.loadingProfileItems = false;
          });
          if ($auth.getPayload()) {
            $scope.isUserLogged = $auth.getPayload().username === item.data.user.username;
          }
          $scope.userPromise = UserService
            .getByUsername(item.data.user.username);


          $scope.userPromise.then(function (userInfo) {
            $scope.userInfo = userInfo.data;
            $scope.followingsPromise(userInfo.data.username);
            $scope.followersPromise(userInfo.data.username);
            deferred.resolve(userInfo);
          });

          $scope.entity = item.data;
          $scope.photoCount = item.data.pictures.length;
          var i = 0;
          for (i; i < $scope.photoCount; i++) {
            $scope.addSlide(item.data.pictures[i]);
          }
        } else if (item.statusCode === 2 && item.errorCode === 724) {
          $state.go('error.userNotAuthorized');
        } else {
          $state.go('error.productNotFound');
        }
      });
    };

    $scope.fullName = function (firstName, lastInitial) {
      if ((!firstName) || (!lastInitial)) {
        return "";
      }
      return firstName + " " + lastInitial + ".";
    };


    //Slider functionality

    $scope.addSlide = function (url, index) {
      $scope.slides.push({
        image: url,
        id: currIndex++
      });
    };

    $scope.randomize = function () {
      var indexes = generateIndexesArray();
      assignNewIndexesToSlides(indexes);
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

    $scope.formatPublishedDate = function () {
      return (moment().diff($scope.entity.published, 'days') <= 14) ?
          moment($scope.entity.published).fromNow() :
          moment($scope.entity.published).format('ll');
    };

    function goChat () {
      if ($scope.isAuthenticated()) {
        if (FollowUserService.isLoggedUser($scope.userInfo.username)) {
          $state.go('negotiationsListItem', {
            idItem: $scope.entity.id
          });

        } else {
          $state.go('negotiationItem',{
            idItem: $scope.entity.id
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
    }

    $scope.init();

  }

  angular.module('app.controllers')
  .controller('ItemDetailController', ItemDetailController);

}());

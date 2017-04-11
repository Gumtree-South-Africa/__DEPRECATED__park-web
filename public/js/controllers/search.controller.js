(function() {
  'use strict';

  function SearchController (
    $auth,
    $cookies,
    $location,
    $timeout,
    $rootScope,
    $scope,
    $state,
    $stateParams,
    $uibModal,
    CategoryService,
    InstanceModal,
    LocationService,
    NegotiationFactory,
    SearchModelFactory,
    screenSize,
    SmartBanner,
    UtilsService
  ) {
    'ngInject';

    // scope vars
    $scope.offersCount = 0;
    /**
     * Utils variables
     */
    // $rootScope.isScrolled = false;
    $scope.apiToken = appConfig.mapboxApiToken;
    $scope.isMobileNavActive = false;
    $scope.isSuggestionsDisplayed = false;
    $scope.homeRoot = $state;
    $scope.cityUrl = $state.locationId;
    $scope.vivaIconUrl = '/home/houston-tx';
    /**
     * Search text
     * @type {string}
     */
    $scope.util = {};
    $scope.searchText = "";
    $scope.util.searchLocationText = "";
    $scope.userName = '';
    $scope.imagePicture = '';
    $scope.isLogoutSelectedBt = false;
    /**
     * Category stuff
     * @type {Array}
     */
    $scope.categoryList = [];
    $scope.categoryId = null;
    $scope.listEnabled = false;
    $scope.categoriesButtonText = 'Categoría';
    $scope.isCategoriesActive = false;
    /**
     * The default location
     * Locations Stuff, name in the form City, State
     * and LocationId as city-state ej. san_francisco-california
     * @type {string}
     * @type {{locationId: string, canonical_name: string, latitude: number, longitude: number}}
     */
    $scope.location = {
      locationId: '',
      canonical_name: '',
      latitude: 29.7399453,
      longitude: -95.3987408
    };
    var mainMarker = {
      lat: $scope.location.latitude,
      lng: $scope.location.longitude,
      focus: true,
      // message: "Puedes arrastrar la marca para seleccionar un lugar",
      draggable: true,
      tap: false
    };
    angular.extend($scope, {
      center: {
        lat: $scope.location.latitude,
        lng: $scope.location.longitude,
        zoom: 13
      },
      markers: {
        mainMarker: mainMarker
      },
      position: {
        lat: $scope.location.latitude,
        lng: $scope.location.longitude
      },
      events: {
        markers: {
          enable: ['dragend']
        }
      }
    });
    $scope.modalHeight = "299px";

    // scope functions declaration
    $scope.showUserData = showUserData;
    $scope.setCategory = setCategory;
    $scope.displayCategoriesOnSpan = displayCategoriesOnSpan;
    $scope.safeApply = safeApply;
    $scope.hideLocationModal = hideLocationModal;
    $scope.onSearchTextChanged = onSearchTextChanged;
    $scope.onSearchTextOnclick = onSearchTextOnclick;
    $scope.clearKeyword = clearKeyword;
    $scope.onBlurSearchText = onBlurSearchText;
    $scope.setMobileNavigation = setMobileNavigation;
    $scope.changeModalHeight = changeModalHeight;
    $scope.updateLocation = updateLocation;
    $scope.showLoginForm = showLoginForm;
    $scope.openMapModal = openMapModal;

    //scope events
    $scope.$on(NegotiationFactory.eventRecountBuyerOffers, recountOffers);
    $scope.$on(NegotiationFactory.eventRecountSellerOffers, recountOffers);
    $rootScope.$on('location.changeMap', eventLocationChangeMap);
    $rootScope.$on('location.changed', eventLocationChanged);
    $rootScope.$on('location.cancel', eventLocationCancel);
    $scope.$on('leafletDirectiveMarker.dragend', eventLeafletDirectiveMarkerDragend);
    $scope.$on('$stateChangeSuccess', searchControllerStateChangeSuccess);

    $(window).on('touchstart',function() {
      $scope.safeApply(function () {
        $scope.displayCategoriesOnSpan(false);
      })
    });

    if (UtilsService.isRunningOnMobile()) {
      $scope.shouldVisible = (!$state.is('negotiation') && !$state.is('negotiationItem'));

      $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
        $scope.shouldVisible = (toState.name !== 'negotiation' && toState.name !== 'negotiationItem');
      });
    } else {
      $scope.shouldVisible = true;
    }

    CategoryService.all().then(function (resp) {
      $scope.categoryList = resp.data.categories;
    });

    screenSize.when('xs, sm', function () {
      $scope.visible = "hidden";
    });

    screenSize.when('md, lg', function () {
      $scope.visible = "show";
    });

    function eventLocationChangeMap (event, mapboxResponse) {
      syncLocationAndMapAndMarkers(mapboxResponse.latitude, mapboxResponse.longitude);
    }

    function recountOffers (ev, count1, count2) {
      $scope.offersCount = count1 + count2;
    }

    function showUserData () {
      if ($auth.isAuthenticated()) {
        $scope.userName = $auth.getPayload().username;
        $scope.imagePicture = $auth.getPayload().profilePicture;
        return true;
      }
      return false;
    }

    function setCategory (category) {
      $scope.categoryId = category.code || category.name;
      $scope.categoriesButtonText = category.name;
      changeStates($scope.searchText, $scope.categoryId, $scope.location.locationId);
    }

    function displayCategoriesOnSpan (click) {
      $scope.isCategoriesActive = click && !$scope.isCategoriesActive;
    }

    function safeApply(fn) {
      var phase = this.$root.$$phase;
      if(phase == '$apply' || phase == '$digest') {
        if(fn && (typeof(fn) === 'function')) {
          fn();
        }
      } else {
        this.$apply(fn);
      }
    }

    function syncLocationAndMapAndMarkers (lat, lng) {
      $timeout(function () {
        $scope.center.lat = mainMarker.lat = lat;
        $scope.center.lng = mainMarker.lng = lng;
      }, 0);
    }

    function eventLocationChanged (event, newLocation) {
      $scope.location = {
        locationId: newLocation.id,
        canonical_name: newLocation.canonical_name,
        latitude: newLocation.latitude,
        longitude: newLocation.longitude
      };
      changeStates($scope.searchText, $scope.categoryId, $scope.location.locationId);
      $scope.hideLocationModal();
    }

    function eventLocationCancel () {
      $scope.hideLocationModal();
    }

    function hideLocationModal () {
      $('#locationModal').modal('hide');
    }

    function eventLeafletDirectiveMarkerDragend (e, args) {
      LocationService.getCityByLatLng(args.model.lat, args.model.lng)
        .then(function (city) {
          $scope.util.searchLocationText = city.canonical_name;
          $rootScope.$broadcast('searchNewLocation', $scope.util.searchLocationText);
        });
    }

    function onSearchTextChanged (event) {
      var inputText = event.target.value.trim();
      $scope.searchText = inputText;
      var keyCode = event.keyCode;
      if (keyCode === 13 && inputText.length > 0) {
        changeStates($scope.searchText, $scope.categoryId, $scope.location.locationId);
      }
    }

    function changeStates (keyword, categoryId, locationId) {
      if (categoryId) {
        if (keyword) {
          $state.go('search.keywordCategory', {
            keyword: keyword,
            locationId: locationId,
            categoryId: categoryId
          });
        } else {
          $state.go('searchCategory', {
            locationId: locationId,
            categoryId: categoryId
          });
        }
      } else {
        if (keyword) {
          $state.go('search.keyword', {
            keyword: keyword,
            locationId: locationId
          });
        } else {
          $state.go('homeLocation', {
            locationId: locationId
          });
        }
      }
    }

    function onSearchTextOnclick () {
      $scope.listEnabled = $scope.searchText.length === 0;
      $scope.isMobileNavActive = false;
      changeStates($scope.searchText, $scope.categoryId, $scope.location.locationId);
    }

    function clearKeyword () {
      if ($scope.searchText !== null || $scope.searchText !== '') {
        if ($state.is('search.keyword') || $state.is('byCategory.category')) {
          $scope.searchText = null;
          // this.onSearchByKeyword(null);
        } else {
          $scope.searchText = null;
        }
      }
    }

    function onBlurSearchText () {
      $timeout(function () {
        $scope.listEnabled = false;
      }, 200);
    }

    function setMobileNavigation () {
      $scope.isMobileNavActive = !$scope.isMobileNavActive;
    }

    function changeModalHeight () {
      $timeout(function () {
        $scope.modalHeight = "478px";
      }, 0);
    }

    function updateLocation () {
      LocationService.getCityById($cookies.get('user-location') || 'houston-tx')
        .then(function (city) {
          $scope.location.locationId = city.id;
          $scope.location.canonical_name = city.canonical_name;
          $scope.location.latitude = city.latitude;
          $scope.location.longitude = city.longitude;
          $scope.location.id = city.id;
          $scope.util.searchLocationText = city.canonical_name;
          syncLocationAndMapAndMarkers($scope.location.latitude, $scope.location.longitude);
          $scope.$broadcast('geolocation.update',$scope.location);
          $state.go('homeLocation', {
            locationId: city.id
          });
        });
    }

    function searchControllerStateChangeSuccess (event, toState, toParams, fromState, fromParams, current) {
        $scope.vivaIconUrl = '/home/' + UtilsService.$formatURLString( ($cookies.get('user-location') || 'houston-tx'));

        if (toParams.categoryId) {
          $scope.categoryId = toParams.categoryId;
          CategoryService.findByCode($scope.categoryId)
            .then(function (c) {
              $scope.categoriesButtonText = c.name;
            });
        } else {
          $scope.categoriesButtonText = 'Categoría';
          $scope.categoryId = null;
        }

        var location = toParams.locationId;

        if (!fromParams.locationId && !toParams.locationId) {
          location = $cookies.get('user-location') || 'houston-tx';
        } else if (fromParams.locationId && !toParams.locationId) {
          location = fromParams.locationId;
        }

        LocationService.getCityById(location)
          .then(function (city) {
            $scope.location.locationId = city.id;
            $scope.location.canonical_name = city.canonical_name;
            $scope.location.latitude = city.latitude;
            $scope.location.longitude = city.longitude;
            $scope.util.searchLocationText = city.canonical_name;
            syncLocationAndMapAndMarkers($scope.location.latitude, $scope.location.longitude);
          });

        if (toParams.keyword) {
          $scope.searchText = toParams.keyword;
        } else {
          $scope.searchText = '';
        }
    }

    // REFACT: refact this method to create login form directive with modal ui-bootstrap

    function showLoginForm (displayTitleMessage) {
      $scope.displayTitleMessage = displayTitleMessage;
      InstanceModal.loginModal({
        resolve: {
          DisplayTitleMessage: function () {
            return true;
          }
        }
      });
    }

    function openMapModal() {
      $('#locationModal').on('shown.bs.modal', function () {
        if (UtilsService.isRunningOnMobile() && SmartBanner.isVisible()) {
          SmartBanner.hideBanner();
          bannerWasVisible = true;
        }
      });

      $('#locationModal').on('hidden.bs.modal', function () {
        if (UtilsService.isRunningOnMobile() && bannerWasVisible) {
          SmartBanner.showBanner();
          bannerWasVisible = false;
        }
      });
      $('#locationModal').modal('show');
      $scope.changeModalHeight();
    };
    var bannerWasVisible = false;
  }

  angular.module('app.controllers')
  .controller('SearchController', SearchController);

}());

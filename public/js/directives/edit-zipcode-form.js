(function() {
  'use strict';

  function EditZipcodeForm ($timeout, $rootScope, UtilsService, LocationService, $auth, UserService, SmartBanner) {
    'ngInject';

    return {
      templateUrl: 'views/partials/edit-zipcode-form.html',
      restrict: 'E',
      transclude: true,
      replace: true,
      scope: {
        zipcodeCb: '=',
        editZipcode: '&'
      },
      link: function postLink(scope, element, attrs) {
        scope.zipcode = '';
        scope.isLocationEmpty = true;
        scope.disableInvalidZipCodeMessage = false;

        var bannerWasVisible = false;


        scope.zipcodeCb.cb = function (error, hasSuccess, backendValidated) {
          scope.error = error;
          scope.hasSuccess = hasSuccess;
          scope.backendValidated = backendValidated;
          if (hasSuccess) {
            $(element).modal('hide');
          }
        };

        $rootScope.$on('$stateChangeStart',
        function(event, toState, toParams, fromState, fromParams, options){
          $(element).modal('hide');
        });

        scope.$watch('editZipcodeForm.zipCode.$valid',
        function(validity) {
          if (validity) {
            LocationService.getCityByZipcode(editZipcodeForm.zipCode.value)
            .then(function (data) {
              var locationData = data.features[0];
              if (locationData != undefined) {
                var lat = locationData.geometry.coordinates[1];
                var lng = locationData.geometry.coordinates[0];
                scope.location = lat + ',' + lng;
                LocationService.getCityByLatLng(lat, lng)
                .then(function (city) {
                  scope.locationName = city.canonical_name;
                  scope.isLocationEmpty = false;
                });
                scope.validZipcode = true;
                scope.disableInvalidZipCodeMessage = false;
              } else {
                scope.isLocationEmpty = true;
                scope.disableInvalidZipCodeMessage = true;
              }
            });
          } else {
            scope.disableInvalidZipCodeMessage = false;
            scope.isLocationEmpty = true;
            scope.validZipcode = false;
          }
        });

        $(element).on('shown.bs.modal', function () {
          if ($auth.isAuthenticated()) {
            scope.user = {
              username: $auth.getPayload().username,
              profilePicture: $auth.getPayload().profilePicture
            };
            UserService.getByUsername($auth.getPayload().username).then(
            function (resp) {
              scope.user.email = resp.data.email;
              scope.user.zipCode = resp.data.zipCode;
              scope.locationName = resp.data.locationName;
            });
          }
          if (UtilsService.isRunningOnMobile() && SmartBanner.isVisible()) {
            SmartBanner.hideBanner();
            bannerWasVisible = true;
          }
        });

        scope.submit = function () {
          scope.editZipcode({
            location: {
              zipCode: editZipcodeForm.zipCode.value,
              location: scope.location,
              locationName: scope.locationName
            }
          });
        };

        scope.runningOnMobile = function () {
          return UtilsService.isRunningOnMobile();
        };

        $(element).on('hidden.bs.modal', function () {
          scope.zipcode = '';
          scope.error = '';
          scope.hasSuccess = false;
          scope.backendValidated = false;
          scope.isLocationEmpty = false;
          scope.validZipcode = false;
          scope.disableInvalidZipCodeMessage = false;
          if (UtilsService.isRunningOnMobile() && bannerWasVisible) {
            SmartBanner.showBanner();
            bannerWasVisible = false;
          }
        });


      }
    };
  }

  angular.module('app.directives')
  .directive('editZipcodeForm', EditZipcodeForm);

}());


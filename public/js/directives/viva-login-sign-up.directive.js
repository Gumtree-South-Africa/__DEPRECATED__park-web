(function  () {

  'use strict';

  function VivaLoginSignUp (LocationService) {
    'ngInject';

    return {
      restrict: 'E',
      transclude: true,
      replace: true,
      templateUrl: 'views/partials/login-form-register.html',
      scope: {
        user: '=',
        registrationForm: '=',
        apiError: '=',
        validZipcode: '=',
        disableInvalidZipCodeMessage: '=',
        isLocationEmpty: '=',
        registrationFormDisplayed: '=',
        signupSubmit: '='
      },
      link: function (scope, element, attr) {

        scope.$watch('registrationForm.zipCode.$valid',
          function(validity) {
            if (validity) {
                LocationService.getCityByZipcode(registrationForm.zipCode.value)
                .then(function (data) {
                  var locationData = data.features[0];
                  if (locationData != undefined) {
                    scope.user.zipcode = registrationForm.zipCode.value;
                    var lat = locationData.geometry.coordinates[1];
                    var lng = locationData.geometry.coordinates[0];
                    scope.user.location = lat + ',' + lng;
                    LocationService.getCityByLatLng(lat, lng)
                    .then(function (city) {
                      scope.user.locationName = city.canonical_name;
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

      }
    };
  }

  angular.module('app.directives')
  .directive('vivaLoginSignUp',VivaLoginSignUp);

}());


(function() {
  'use strict';

  function LoginFormController (
    $auth,
    $scope,
    $state,
    $timeout,
    $uibModalInstance,
    DisplayTitleMessage,
    LocationService,
    RecoverPasswordService,
    UtilsService
  ) {
    'ngInject';

    $scope.validUsername = true;
    $scope.validSubmit = false;
    $scope.loginFormDisplayed = false;
    $scope.headerFormDisplayed = false;
    $scope.registrationFormDisplayed = false;
    $scope.recoverPasswordFormDisplayed = false;
    $scope.recoverPwdSuccess = false;
    $scope.recoverPwdError = '';
    $scope.isLocationEmpty = false;
    $scope.validZipcode = false;
    $scope.disableInvalidZipCodeMessage = false;
    $scope.apiToken = appConfig.mapboxApiToken;
    $scope.username = '';
    $scope.password = '';
    $scope.user = {};
    $scope.user = {
      username : '',
      password : ''
    };
    $scope.minUsernameLength = 5;
    $scope.minPasswordLength = 6;
    $scope.signUpError = {};
    $scope.displayTitleMessage = DisplayTitleMessage;
    $scope.apiError = {};

    $scope.validateUsername =  validateUsername;
    $scope.runningOnMobile =  runningOnMobile;
    $scope.goToLegalTerms =  goToLegalTerms;
    $scope.loginEmail =  loginEmail;
    $scope.submitFacebook =  submitFacebook;
    $scope.signupSubmit =  signupSubmit;
    $scope.backToMainMenu =  backToMainMenu;
    $scope.showRecoverPasswordForm =  showRecoverPasswordForm;
    $scope.showLoginForm =  showLoginForm;
    $scope.showEmailRegistration =  showEmailRegistration;
    $scope.showEmailRegistrationView =  showEmailRegistrationView;
    $scope.recoverPasswordSubmit =  recoverPasswordSubmit;
    $scope.recoverpwdCb =  cb;
    $scope.signup = signup;
    $scope.login = login;
    $scope.recoverPassword = recoverPassword;
    $scope.closeModal = closeModal;

    $scope.$on('$stateChangeStart',
    function(event, toState, toParams, fromState, fromParams, options){
      $uibModalInstance.dismiss();
    });

    $scope.$watch('registrationForm.zipCode.$valid',
      function (validity) {
        if (validity) {
          if ($scope.registrationFormDisplayed) {
            LocationService.getCityByZipcode(registrationForm.zipCode.value)
            .then(function (data) {
              var locationData = data.features[0];
              if (locationData != undefined) {
                $scope.user.zipcode = registrationForm.zipCode.value;
                var lat = locationData.geometry.coordinates[1];
                var lng = locationData.geometry.coordinates[0];
                $scope.user.location = lat + ',' + lng;
                LocationService.getCityByLatLng(lat, lng)
                .then(function (city) {
                  $scope.user.locationName = city.canonical_name;
                  $scope.isLocationEmpty = false;
                });
                $scope.validZipcode = true;
                $scope.disableInvalidZipCodeMessage = false;
              } else {
                $scope.isLocationEmpty = true;
                $scope.disableInvalidZipCodeMessage = true;
              }
            });
          }
        } else {
          $scope.disableInvalidZipCodeMessage = false;
          $scope.isLocationEmpty = true;
          $scope.validZipcode = false;
        }
    });

    function closeModal() {
      $uibModalInstance.dismiss();
    }

    function signup (user) {
      $auth.signup(user)
        .then(function (response) {
          $auth.login({
            username: user.username,
            password: user.password
          }).then(function () {
            $uibModalInstance.dismiss();
          });

        })
        .catch(function (error) {
          $scope.apiError = error.data;
        });
    }

    function login (options) {
      var authPromise = options.provider === 'facebook' ? $auth.authenticate('facebook') : $auth.login(options.credentials);
      return authPromise
        .then(function () {
          $scope.error = '';
          $uibModalInstance.dismiss();
          $state.reload();
        })
        .catch(function (error) {
          var message = error.data.message;
          if (message === 'Nuevo usuario con facebook') {
            return error;
          } else {
            $scope.error = message;
          }
        });
    }

    function recoverPassword (email) {
      RecoverPasswordService.recoverPassword(email)
        .then(function successCallback(resp) {
          if (resp.statusCode === 1) {
            $scope.recoverpwdCb('', true, true);
          } else {
            $scope.recoverpwdCb(resp.statusMessage, false, true);
          }
        }, function errorCallback(error) {
          $scope.recoverpwdCb('Ocurrió un error al procesar tu solicitud, inténtalo más tarde', false, true);
        });
    }

    function validateUsername () {
      if (!$scope.username) {
        $scope.validSubmit = $scope.validUsername = false;
      } else {
        if ($scope.username.indexOf('@') > -1) {
          $scope.validSubmit = $scope.validUsername = /.+@.+\..+/i.test($scope.username);
        } else {
          $scope.validSubmit = $scope.validUsername = $scope.username !== '';
        }
      }
      $scope.validSubmit = $scope.validSubmit && $scope.password;
    }


    function runningOnMobile () {
      return UtilsService.isRunningOnMobile();
    }

    function goToLegalTerms() {
      $uibModalInstance.dismiss();
      $state.go('statics.legalDisclosures',{'#':'terms'});
    }

    function loginEmail () {
      var username = $scope.username;
      var password = $scope.password;
      if (username && password) {
        $scope.login({
          provider: 'login',
          credentials: {
            username: username,
            password: password
          }
        });
      }
    }

    function submitFacebook () {
      $scope.login({
        provider: 'facebook'
      }).then(function(data) {
        var message = data.data.message;
        if (message === 'Nuevo usuario con facebook') {
          $scope.showEmailRegistration({
            username: data.data.body.first_name + data.data.body.last_name,
            password: '',
            email: data.data.body.email,
            location: '',
            locationName: '',
            zipCode: '',
            fb_token: data.data.fb_token,
            fb_user_id: data.data.fb_user_id
          });
        }
      });
    }

    function signupSubmit () {
      if (typeof $scope.user.fb_token !== 'undefined' && $scope.user.fb_token.length > 0 &&
        typeof $scope.user.fb_user_id !== 'undefined' && $scope.user.fb_user_id.length > 0) {
      } else {
        delete $scope.user.fb_token;
        delete $scope.user.fb_user_id;
      }
      $scope.signup($scope.user);
    }

    function backToMainMenu () {
      $scope.loginFormDisplayed = false;
      $scope.headerFormDisplayed = false;
      $scope.registrationFormDisplayed = false;
      $scope.recoverPasswordFormDisplayed = false;
      $scope.validUsername = true;
      $scope.validSubmit = false;
      $scope.username = '';
      $scope.password = '';
      $scope.user = {};
      $scope.apiError.message = '';
      $scope.error = '';
    }

    function showRecoverPasswordForm () {
      $scope.recoverPasswordFormDisplayed = true;
      $scope.loginFormDisplayed = false;
    }

    function showLoginForm () {
      $scope.loginFormDisplayed = true;
      $scope.headerFormDisplayed = true;
      $scope.registrationFormDisplayed = false;
    }

    function showEmailRegistration (user) {
      $scope.showEmailRegistrationView();

      if (user.username.length > 15) {
        user.username = user.username.slice(0,15);
      }
      $scope.user = user;
    }

    function showEmailRegistrationView () {
      $scope.loginFormDisplayed = false;
      $scope.headerFormDisplayed = !$scope.headerFormDisplayed;
      $scope.registrationFormDisplayed = !$scope.registrationFormDisplayed;
    }

    function recoverPasswordSubmit () {
      $scope.recoverPassword({email: {email: $scope.recoverEmail}});
    }

    function cb (error, success, beVal) {
      $scope.recoverPwdError = error;
      $scope.recoverPwdSuccess = success;
      $scope.recoverPwdBEval = beVal;
    }

  }

  angular.module('app.directives')
  .controller('LoginFormController', LoginFormController);

}());

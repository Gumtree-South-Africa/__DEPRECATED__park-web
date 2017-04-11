
(function() {
  'use strict';

  function AppController ($scope, $state, $stateParams, $rootScope, ChangePasswordService, UtilsService, $location, currencyFilter, $auth, $timeout, UserService, $uibModal, RecoverPasswordService) {
    'ngInject';

    $scope.loginError = '';
    $scope.signUpError = {};
    $scope.signUpFunctions = {};
    $scope.passwordCb = {
      cb: function () {}
    };
    $scope.recoverpwdCb = {
      cb: function () {}
    };
    $scope.zipcodeCb = {
      cb: function () {}
    };
    $scope.verifyemailCb = {
      cb: function () {}
    };

    $scope.login = function (provider, credentials) {
      var authPromise = provider === 'facebook' ? $auth.authenticate('facebook') : $auth.login(credentials);
      return authPromise
        .then(function () {
          $scope.loginError = '';
          $('#login-form').modal('hide');
          $state.reload();
        })
        .catch(function (error) {
          var message = error.data.message;
          if (message === 'Nuevo usuario con facebook') {
            return error;
          } else {
            $scope.loginError = message;
          }
        });
    };
    // </editor-fold>

    $scope.isAuthenticated = function () {
      return $auth.isAuthenticated();
    };

    $scope.logout = function () {
      UserService.signOut().then(function (response) {
        $auth.logout();
        $state.reload();
      });

    };
    $scope.updateShowLoginModal = function () {
      $timeout(function () {
        $scope.loginError = '';
      });
    };

    // <editor-fold desc="Change Password Stuff">
    $scope.changePassword = function (passwords) {
      ChangePasswordService.changePassword(passwords)
        .then(function successCallback(resp) {
          if (resp.statusCode === 1) {
            $scope.passwordCb.cb('', true, true);
            // $scope.logout();
          } else {
            $scope.passwordCb.cb(resp.statusMessage, false, true);
          }
        }, function errorCallback(error) {
          $scope.passwordCb.cb('Ocurrió un error al procesar su solicitud, inténtelo más tarde', false, true);
          //console.log(error);
        });
    };

    $scope.recoverPassword = function (email) {
      RecoverPasswordService.recoverPassword(email)
        .then(function successCallback(resp) {
          if (resp.statusCode === 1) {
            $scope.recoverpwdCb.cb('', true, true);
          } else {
            $scope.recoverpwdCb.cb(resp.statusMessage, false, true);
          }
        }, function errorCallback(error) {
          $scope.recoverpwdCb.cb('Ocurrió un error al procesar tu solicitud, inténtalo más tarde', false, true);
          //console.log(error);
        });
    };

    $scope.verifyEmail = function () {
      UserService.verifyEmail()
      .then(function successCallback(resp) {
        if (resp.statusCode === 1) {
          $scope.verifyemailCb.cb('', true, true);
        } else {
          $scope.verifyemailCb.cb(resp.statusMessage, false, true);
        }
      }, function errorCallback(error) {
        $scope.verifyemailCb.cb('Ocurrió un error al procesar tu solicitud, inténtalo más tarde', false, true);
      });
    };
    // </editor-fold>

    // <editor-fold desc="signup stuff">
    $scope.signup = function (user) {
      $auth.signup(user)
        .then(function (response) {
          $auth.login({
            username: user.username,
            password: user.password
          }).then(function () {
            $('#login-form').modal('hide');
          });

        })
        .catch(function (error) {
          $scope.signUpError = error.data;
        });
    };
    // </editor-fold>

    $scope.editZipCode = function (location) {
      UserService.updateProfile($auth.getPayload().username, location)
        .then(function (resp) {
          if (resp.statusCode === 1) {
            $scope.zipcodeCb.cb('', true, true);
            $state.reload();
          } else {
            $scope.zipcodeCb.cb(resp.statusMessage, false, true);
          }
        }, function errorCallback(error) {
          $scope.zipcodeCb.cb('Ocurrió un error al procesar tu solicitud, inténtalo más tarde', false, true);
        });
    };

    $scope.metadata = angular.copy(appConfig.metadata);
    $scope.webmaster = angular.copy(appConfig.webmaster);

    // whenever a controller emits the newMetaData event, we update the app's metadata
    $rootScope.$on('newMetaData', function (event, metadata) {
      $scope.metadata = angular.copy(metadata);
    });

    $rootScope.$on('newMetaDataPromise', function (event, metadataPromise) {
      metadataPromise.then(function (metadata) {
        $scope.metadata = angular.copy(metadata);
      });
    });

    $scope.$on('defaultMetaData', function () {
      $scope.metadata = angular.copy(appConfig.metadata);
    });

    $rootScope.$on('$stateChangeStart',
      function (event, toState, toParams, fromState, fromParams) {
        //console.log('Changed state [' + fromState.name + '] to [' + toState.name + ']');
        $scope.hideCities = toState.name.split('.')[0] === 'statics';
        $scope.metadata = angular.copy(appConfig.metadata);
      });

    $scope.$back = function () {
      window.history.back();
    };

    $scope.runningOnMobile = function () {
      return UtilsService.isRunningOnMobile();
    };

    $scope.openShareModal = function (template, type, info) {
      var templateUrl = 'views/partials/' + template;
      $uibModal.open({
        animation: false,
        templateUrl: templateUrl,
        controller: 'ModalShareController',
        keyboard: true,
        resolve: {
          entity: function () {
            return info;
          },
          url: function () {
            switch (type) {
            case 'app':
              return 'https://bnc.lt/VivanunciosUSA';
            case 'user':
              return $state.href('userProfile', {
                id: UtilsService.$formatURLString(info.username)
              }, {
                absolute: true
              });
            case 'item':
              return $state.href('item', {
                itemCategory: UtilsService.$formatURLString(info.category.name),
                itemName: UtilsService.$formatURLString(info.name),
                itemId: info.id
              }, {
                absolute: true
              });
            case 'group':
              return $state.href('group', {
                groupId: info.id,
                groupName: UtilsService.$formatURLString(info.name)
              }, {
                absolute: true
              });
            }
          },
          type: function () {
            return type;
          }
        }
      });
    };

    //

    $scope.safeApply = function(fn) {
      var phase = this.$root.$$phase;
      if(phase == '$apply' || phase == '$digest') {
        if(fn && (typeof(fn) === 'function')) {
          fn();
        }
      } else {
        this.$apply(fn);
      }
    };

  }

  angular.module('app.controllers')
  .controller('AppController', AppController);

}());

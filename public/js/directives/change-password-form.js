(function() {
  'use strict';

  function ChangePasswordForm ($timeout, $rootScope, UtilsService, SmartBanner, $auth, $state, UserService, InstanceModal) {
    'ngInject';

    return {
      templateUrl: 'views/partials/change-password-form.html',
      restrict: 'E',
      transclude: true,
      replace: true,
      scope: {
        passwordCb: '=',
        changePassword: '&'
      },
      link: function postLink(scope, element, attrs) {
        scope.currentPassword =
          scope.newPassword =
          scope.newPasswordConfirm =
          scope.error = '';
        scope.hasSuccess = false;
        scope.backendValidated = false;

        var bannerWasVisible = false;

        $rootScope.$on('$stateChangeStart',
        function(event, toState, toParams, fromState, fromParams, options){
          $(element).modal('hide');
        });

        $(element).on('shown.bs.modal', function () {
          if (UtilsService.isRunningOnMobile() && SmartBanner.isVisible()) {
            SmartBanner.hideBanner();
            bannerWasVisible = true;
          }
        });

        scope.passwordCb.cb = function (error, hasSuccess, backendValidated) {
          // $timeout(function(){
          scope.error = error;
          scope.hasSuccess = hasSuccess;
          scope.backendValidated = backendValidated;
          // });
        };

        // scope.passwordCb.cb('asdjfoaisjdfa', false)

        scope.submit = function () {
          if (scope.newPassword.length >= 6) {
          // if (true) {
            scope.changePassword({
              passwords: {
                currentPassword: scope.currentPassword,
                newPassword: scope.newPassword
              }
            });
          } else {
            $timeout(function () {
              scope.error = 'Debe contener al menos 6 caracteres';
              scope.hasSuccess = false;
              scope.backendValidated = true;
            });
          }
        };

        scope.runningOnMobile = function () {
          return UtilsService.isRunningOnMobile();
        };

        scope.enableConfirmBtn = function () {
          if (scope.backendValidated) {
            return true;
          }
          if (scope.currentPassword && scope.newPassword && scope.newPasswordConfirm) {
            if (scope.newPassword === scope.newPasswordConfirm) {
              scope.error = '';
              return true;
            } else {
              scope.error = 'La nueva contraseña y su confirmación deben ser iguales.';
              return false;
            }
          }
          return false;
        };

        scope.showLoginForm = function () {
          UserService.signOut()
          .then(function (response) {
            $auth.logout();
            $state.reload();
            InstanceModal.loginModal({
  resolve: {
    DisplayTitleMessage: function () {
      return false;
    }
  }
});
          });
        };

        $(element).on('hidden.bs.modal', function () {
          scope.currentPassword = '';
          scope.newPassword = '';
          scope.newPasswordConfirm = '';
          scope.error = '';
          scope.hasSuccess = false;
          scope.backendValidated = false;
          if (UtilsService.isRunningOnMobile() && bannerWasVisible) {
            SmartBanner.showBanner();
            bannerWasVisible = false;
          }
        });
      }
    };
  }

  angular.module('app.directives')
  .directive('changePasswordForm', ChangePasswordForm);

}());

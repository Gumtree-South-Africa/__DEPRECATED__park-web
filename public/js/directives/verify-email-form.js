(function() {
  'use strict';

  function VerifyEmailForm ($timeout, $rootScope, $auth, UserService, UtilsService, SmartBanner) {
    'ngInject';

    return {
      templateUrl: 'views/partials/verify-email-form.html',
      restrict: 'E',
      transclude: true,
      replace: true,
      scope: {
        verifyEmail: '&',
        verifyemailCb: '='
      },
      link: function postLink(scope, element, attrs) {
        scope.hasSuccess = false;

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

        $(element).on('hidden.bs.modal', function () {
          if (UtilsService.isRunningOnMobile() && bannerWasVisible) {
            SmartBanner.showBanner();
            bannerWasVisible = false;
          }
        });

        scope.verifyemailCb.cb = function (error, hasSuccess, backendValidated) {
          scope.error = error;
          scope.hasSuccess = hasSuccess;
        };

        //
        scope.sendVerification = function () {
          scope.verifyEmail();
        };

        $(element).on('hidden.bs.modal', function () {
          scope.hasSuccess = false;
          scope.error = '';
        });


      }
    };
  }

  angular.module('app.directives')
  .directive('verifyEmailForm', VerifyEmailForm);

}());

(function() {
  'use strict';

  var SESSION_EXPIRED = false;

  function AppAuthConfig ($authProvider) {
    'ngInject';

    $authProvider.facebook({
      clientId: window.appConfig.facebook.clientId,
      scope: ['user_friends','email']
    });

  }

  function HttpInteceptorsConfig($httpProvider) {
    'ngInject';
    $httpProvider.interceptors.push(function ($q, $injector) {
      'ngInject';
      var pwdChanged = false;
      return {
        'request': function (config) {
          if (config.url === '/api/users/v3/changepwd') {
            pwdChanged = true;
          }
          return config;
        },
        'response': function (response) {
          if (response.data.errorCode === 302 && !SESSION_EXPIRED && !pwdChanged) {
            pwdChanged = false;
            SESSION_EXPIRED = true;
            var uibModal = $injector.get('$uibModal');
            var modalInstance = uibModal.open({
              animation: true,
              templateUrl: 'views/partials/viva-session-expired.html',
              controller: 'VivaSessionExpiredController',
              windowClass: 'modal-make-offer-negotiation',
              keyboard: false
            });

            modalInstance.closed
            .then(function () {
              SESSION_EXPIRED = false;
            });
            return {};
          }
          return response;
        }
      }
    });
  }

  angular.module('vivaApp').config(AppAuthConfig);
  angular.module('vivaApp').config(HttpInteceptorsConfig);

}());

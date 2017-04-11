(function() {
  'use strict';

  function InstanceModal ($uibModal, UtilsService, SmartBanner) {
    'ngInject';

    var service = {};

    service.loginModal = loginModal;

    function loginModal (options) {
      var modalInstance = $uibModal.open({
        controller: 'LoginFormController',
        templateUrl: 'views/partials/login-form.html',
        windowClass: 'login-form modal full-screen-modal',
        resolve: options.resolve
      });

      modalInstance.rendered
      .then(options.instanceRendered || instanceRendered);

      modalInstance.closed
      .then(options.instanceClosed || instanceClosed);

      function instanceRendered () {
        if (UtilsService.isRunningOnMobile() && SmartBanner.isVisible()) {
          SmartBanner.hideBanner();
        }
      }

      function instanceClosed () {
        if (UtilsService.isRunningOnMobile() && !SmartBanner.isVisible()) {
          SmartBanner.showBanner();
        }
      }
    }

    return service;
  }

  angular.module('app.services')
  .service('InstanceModal', InstanceModal);
}());

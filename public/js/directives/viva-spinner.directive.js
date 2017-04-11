(function() {
  'use strict';

  function VivaSpinner ($timeout, $rootScope, UtilsService) {
    'ngInject';

    return {
      templateUrl: 'views/partials/viva-spinner.html',
      restrict: 'E',
      transclude: true,
      replace: true,
      scope: {
        loading: '=?',
        serviceId: '@?'
      },
      link: function postLink(scope, element, attrs) {

        var count = 0;
        var serviceList = [];
        var namePushListener = 'VIVA.spinner.pushLoadingService' + scope.serviceId;
        var namePopListener = 'VIVA.spinner.popLoadingService' + scope.serviceId;

        scope.$on(namePushListener,pushLoadingService);
        scope.$on(namePopListener, popLoadingService);

        function pushLoadingService (ev, service) {
          var idService = generateConsecutive();
          serviceList.push(idService);
          scope.loading = true;
          service.then(function() {
                popLoadingService('',idService);
              }).catch(function() {
                popLoadingService('',idService);
              });
        }

        function popLoadingService (ev, idService) {
          serviceList.splice(serviceList.indexOf(idService), 1);
          if (!serviceList.length) {
            scope.loading = false
          }
        }

        function generateConsecutive () {
          return count++;
        }
      }
    };
  }

  angular.module('app.directives')
  .directive('vivaSpinner', VivaSpinner);

}());


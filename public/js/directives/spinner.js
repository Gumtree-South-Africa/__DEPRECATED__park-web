(function() {
  'use strict';

  function Spinner ($timeout, $rootScope, UtilsService) {
    'ngInject';

    return {
      templateUrl: 'views/partials/spinner.html',
      restrict: 'E',
      transclude: true,
      replace: true,
      scope: {
        loading: '=?',
        serviceId: '@?'
      },
      link: function postLink(scope, element, attrs) {

      }
    };
  }

  angular.module('app.directives')
  .directive('spinner', Spinner);

}());


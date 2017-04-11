(function() {
  'use strict';

  function VivaCurrency (currencyFilter) {
    'ngInject';

    return function (input) {
      return  currencyFilter(input, '$', (input % 1 > 0) ? 2 : 0);
    }
  }
  angular.module('app.filters')
  .filter('vivaCurrency', VivaCurrency);

}());

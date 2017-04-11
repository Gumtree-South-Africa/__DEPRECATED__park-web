/**
 * Created by neto on 19/11/15.
 */
 (function() {
  'use strict';

  function Trusted ($sce) {
    'ngInject';

    return function(text) {
        return $sce.trustAsHtml(text);
    };
  }

  angular.module('app.filters')
  .filter('trusted', Trusted);

}());


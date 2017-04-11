/**
 * Created by neto on 09/12/15.
 */
 (function() {
  'use strict';

  function Capitalize () {
    return function (input, all) {
      var reg = (all) ? /([^\W_]+[^\s-]*) */g : /([^\W_]+[^\s-]*)/;
      return (!!input) ? input.replace(reg, function (txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
      }) : '';
    };
  }

  angular.module('app.filters')
  .filter('capitalize', Capitalize);
 }());

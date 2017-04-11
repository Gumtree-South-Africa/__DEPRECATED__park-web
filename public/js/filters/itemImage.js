/**
 * Created by neto on 09/12/15.
 */
 (function() {
  'use strict';

  function ItemImage () {
    return function (input, all) {
      return appConfig.imgUrlTemplate  + input + '/image?number=0';
    }
  }

  angular.module('app.filters')
  .filter('itemImage', ItemImage);
 }());

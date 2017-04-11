(function () {
  'use strict';

  function DirectoryOfSearchesController ($scope,$window) {
    'ngInject';

      var dataLayer = window.dataLayer = window.dataLayer || [];
      dataLayer.push({
        "p": {
          "t": "Sitemap"
        }
      });

    $window.scrollTo(0, 0);
  }

  angular.module('app.controllers')
  .controller('DirectoryOfSearchesController', DirectoryOfSearchesController);

}());

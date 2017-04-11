(function() {
  'use strict';

  function AppBreadcrumb ($breadcrumbProvider) {

    'ngInject';

    $breadcrumbProvider.setOptions({
      prefixStateName: 'home',
      templateUrl: 'views/breadcrumbs.html'
    });
  }

  angular.module('vivaApp').config(AppBreadcrumb);

}());

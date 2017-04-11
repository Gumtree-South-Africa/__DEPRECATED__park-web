(function() {
  'use strict';

  function AppRoutes ($provide, $urlRouterProvider, $locationProvider) {
    'ngInject';

    $urlRouterProvider.otherwise(OtherwiseUrlRoutes);

    $locationProvider.html5Mode(true);

    $provide.decorator('$uiViewScroll', decorator);

    function decorator ($delegate) {
      'ngInject';
      return function (uiViewElement) {
        var top = uiViewElement[0].getBoundingClientRect().top;
        window.scrollTo(0, (top - 1000));
      };
    }

    function OtherwiseUrlRoutes ($injector, $location){
      'ngInject';
      var state = $injector.get('$state');
      state.go('404');
      return $location.path();
    }

  }

  angular.module('vivaApp')
  .config(AppRoutes);

}());

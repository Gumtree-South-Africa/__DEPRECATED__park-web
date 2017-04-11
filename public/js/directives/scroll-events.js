(function() {
  'use strict';

  function ScrollEvents ($state, $window, UtilsService) {
    'ngInject';

    return function(scope, element, attrs) {
      angular.element($window).bind("scroll", function() {
        if($state.current.name == 'homeLocation' || $state.current.name.startsWith('home.') ){
          var bgHeight = angular.element(document.querySelector('.bg-color'))[0].offsetHeight;
          scope.bgColor = {'background-color': 'rgba(0, 217, 220,' + (0 + this.pageYOffset/bgHeight) + ')'};
          scope.bgSloganPosition = {'background-position-y': 245 + this.pageYOffset + 'px'};
          scope.bgPhonesPosition = {'background-position-y': 136 + this.pageYOffset*1.2 + 'px'};
          if ($window.innerWidth > 768 && this.pageYOffset > (bgHeight - 130)) {
              scope.isScrolled = true;
          } else {
              scope.isScrolled = false;
          }
          // if ($window.innerWidth <= 768) {
          //   scope.hideSearch = true;
          // }
          scope.$apply();
        } else { // if the app is in a different page from home, set vars to initial values, so when it comes back to home everything is in the right position
          scope.bgColor = {'background-color': 'rgba(0, 217, 220, 0)'};
          scope.bgSloganPosition = {'background-position-y': '245px'};
          scope.bgPhonesPosition = {'background-position-y': '136px'};
        }
      });
    };
  }

  angular.module('app.directives')
  .directive("scrollEvents", ScrollEvents);

}());

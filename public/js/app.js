(function() {
  'use strict';

  function AppRun ($auth, $rootScope, UtilsService, SmartBanner, $state, NegotiationFactory) {
    'ngInject';

    var chLS = function () {
      var close5 = 'close5';
      try {
        localStorage.setItem(close5, close5);
        localStorage.removeItem(close5);
        return true;
      } catch(e) {
        return false;
      }
    };
    if (chLS() && typeof localStorage.close5Cities3 !== 'undefined') {
      localStorage.removeItem('close5Cities3');
    }
    try {
      var uername = $auth.getPayload().username;
      NegotiationFactory.startServiceListOffers();
    } catch (err) {
      // using old token or not logged
      $auth.logout();
    }
    // $FB.init(appConfig.facebook.appId);

    SmartBanner.initBanner()
    .then(function () {
      if(UtilsService.isRunningOnMobile()) {
          if (    $state.is('homeLocation')
              ||  $state.is('search.keyword')
              ||  $state.is('search.keywordCategory')
              ||  $state.is('searchCategory')
              ||  $state.is('item')
            )
          {
              SmartBanner.showBanner();
          } else {
            SmartBanner.hideBanner();
          }
        } else {
          if ($state.is('item')) {
            SmartBanner.showBanner();
          } else {
            SmartBanner.hideBanner();
          }
        }
    });

    $rootScope.$on('$stateChangeStart',
      function(event, toState, toParams, fromState, fromParams, options){

        angular.forEach(toParams,function (value,key) {
          if (typeof value === "string") {
            toParams[key] = UtilsService.$formatURLString(value.toLowerCase());
          }
        });

      });
    $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {

      window.scrollTo(0, 0);

      if (!NegotiationFactory.isServiceRunning() && $auth.isAuthenticated()) {
          NegotiationFactory.startServiceListOffers();
        }

        if (NegotiationFactory.isServiceRunning() && !$auth.isAuthenticated()) {
          NegotiationFactory.stopServiceListOffers();
        }

      if(UtilsService.isRunningOnMobile()) {
          if (   toState.name == 'homeLocation'
              || toState.name == 'search.keyword'
              || toState.name == 'search.keywordCategory'
              || toState.name == 'searchCategory'
              || toState.name == 'item'
            )
          {
              SmartBanner.showBanner();
          } else {
            SmartBanner.hideBanner();
          }
        } else {
          if (toState.name === 'item') {
            SmartBanner.showBanner();
          } else {
            SmartBanner.hideBanner();
          }
        }
    });
  }

  angular.module('app.services', []);
  angular.module('app.controllers', ['ngSanitize']);
  angular.module('app.directives', []);
  angular.module('app.filters', []);

  angular.module('vivaApp',
    [
    'ui.router',
    'leaflet-directive',
    'djds4rce.angular-socialshare',
    'ngCookies',
    'door3.css',
    'pascalprecht.translate',
    'app.controllers',
    'app.directives',
    'app.filters',
    'app.services',
    'ncy-angular-breadcrumb',
    'afkl.lazyImage',
    'matchMedia',
    'angulartics',
    //'angulartics.google.tagmanager',
    'angulartics.google.analytics',
    'ui.bootstrap',
    'ngTouch',
    'angularMoment',
    'ui.bootstrap.tpls',
    'satellizer',
    'ngclipboard',
    'infinite-scroll'
    ])
  .run(AppRun);

}());

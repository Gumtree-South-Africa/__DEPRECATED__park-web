(function() {
  'use strict';

  function StaticAppRoutes ($stateProvider) {
    'ngInject';

    $stateProvider
      .state('statics',
        {
          abstract: true,
          url: '/statics',
          template: '<ui-view>'
        })
      .state('statics.about',
        {
          url: '/about',
          templateUrl: 'views/statics/about.html'
        })
      .state('statics.communityRules',
        {
          url: '/communityRules',
          templateUrl: 'views/statics/community-rules.html'
        })
      .state('statics.support',
        {
          url: '/support',
          templateUrl: 'views/statics/support.html'
        })
      .state('statics.legalDisclosures',
        {
          url: '/legalDisclosures',
          templateUrl: 'views/statics/legal-disclosures.html'
        })

      .state('underConstruction',
        {
          url: '/under-construction',
          templateUrl: 'views/under-construction.html'
        });
  }

  angular.module('vivaApp')
  .config(StaticAppRoutes);

}());

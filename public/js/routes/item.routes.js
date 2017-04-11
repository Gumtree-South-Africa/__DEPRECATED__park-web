(function() {
  'use strict';

  function ItemAppRoutes ($stateProvider) {
    'ngInject';

    $stateProvider
      .state('item',
        {
          url: '/pr/:itemCategory/:itemName/:itemId',
          templateUrl: 'views/item-detail.html',
          controller: 'ItemDetailController',
          ncyBreadcrumb: {
            label: '{{category|capitalize}}'
          }
        })
      .state('itemAndDescription',
        {
          url: '/:itemDescription/items/:itemId',
          templateUrl: 'views/item-detail.html',
          controller: 'ItemDetailController',
          ncyBreadcrumb: {
            label: '{{category|capitalize}}'
          }
        });
  }

  angular.module('vivaApp')
  .config(ItemAppRoutes);

}());

/**
 * Created by neto on 04/04/16.
 */
(function() {
  'use strict';

  function RateInfo (UserService, $timeout) {
    'ngInject';

    return {
      restrict: 'E',
      transclude: true,
      replace: true,
      templateUrl: 'views/partials/modal-rate-info.directive.html',
      scope: {
        userPromise: '='
      },
      link: function (scope, element, attrs) {

        var currentTime = (new Date).valueOf().toString();

        scope.ratesBuyer = [];
        scope.hasMoreSeller = true;
        scope.pageBuyer = 0;

        scope.ratesSeller = [];
        scope.hasMoreBuyer = true;
        scope.pageSeller = 0;

        scope.pageSize = 100;

        scope.moreRates = function (type) {
          var options = {
            pageSize: scope.pageSize,
            username: scope.user.username
            // requestTime: new Date()
          };
          if (type === 'buyer') {
            options['role'] = 'buyer';
            options['page'] = scope.pageBuyer;
          } else {
            options['role'] = 'seller';
            options['page'] = scope.pageSeller;
          }
          UserService.listRates(options)
            .then(function (response) {
              var rates = response.data.ratings;
              var totalElements = response.data.totalElements;
              if (type === 'buyer') {
                scope.ratesBuyer = scope.ratesBuyer.concat(rates);
                if(totalElements > scope.pageSize * scope.pageBuyer){
                  scope.pageBuyer++;
                } else {
                  scope.hasMoreBuyer = false;
                }
              } else {
                scope.ratesSeller = scope.ratesSeller.concat(rates);
                if(totalElements > scope.pageSize * scope.pageSeller){
                  scope.pageSeller++;
                } else {
                  scope.hasMoreSeller = false;
                }
              }
            });
        };
        scope.userPromise.then(function (user) {
          scope.user = user.data;
          scope.moreRates('buyer');
          scope.moreRates('seller');
        });
      }
    }
  }

  angular.module('app.directives')
  .directive('rateInfo', RateInfo);

}());


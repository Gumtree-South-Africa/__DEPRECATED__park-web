(function() {
  'use strict';

  function NegotiationsListItemController ($scope, ListConversations, NegotiationFactory, $rootScope, $timeout, IdItem) {
    'ngInject';

    $scope.listConversations = ListConversations;
    $scope.offersBuyer = sortOffers(ListConversations);

    // var deregistrationEvent = $rootScope.$on('$stateChangeStart', markAsSeen);
    $scope.$on(NegotiationFactory.eventRecountBuyerOffers, refreshBuyerList);


    function sortOffers(hashOffer) {
      var keysSorted = Object.keys(hashOffer).sort(function(a,b) {
        if (!hashOffer[a].lastChat || !hashOffer[b].lastChat) {
          return 0;
        }
        return (-1) * (parseInt(hashOffer[a].lastChat.postTime) - parseInt(hashOffer[b].lastChat.postTime))
      });
      var offerSorted = [];
      keysSorted.forEach(function(key) {
        if (hashOffer[key].lastChat) {
          offerSorted.push(hashOffer[key]);
        }
      });
      return offerSorted;
    }

    function refreshBuyerList () {
      $scope.offersBuyer = sortOffers(ListConversations);
    }

    // function markAsSeen () {
    //   NegotiationFactory.seenNewChatsBuyer(+$scope.offersBuyer[0].lastChat.postTime+1000);
    //   deregistrationEvent();
    // }

  }


  angular.module('app.controllers')
  .controller('NegotiationsListItemController',NegotiationsListItemController);
}());

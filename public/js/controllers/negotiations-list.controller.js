(function() {
  'use strict';

  function NegotiationsListController ($scope, conversationsSeller, conversationsBuyer, NegotiationFactory, $rootScope, $timeout) {
    'ngInject';

    var pageBuyer = 1;
    var pageSeller = 1;

    $scope.offersBuyer = conversationsBuyer;
    $scope.offersSeller = conversationsSeller;
    $scope.showTab = showTab;
    $scope.scrollOptions = {seller : false, buyer: true};

    var deregistrationEvent = $rootScope.$on('$stateChangeStart', markAsSeen);
    $scope.getMoreConversationsSeller = getMoreConversationsSeller;
    $scope.getMoreConversationsBuyer = getMoreConversationsBuyer;
    // $scope.$on(NegotiationFactory.eventRecountBuyerOffers, refreshBuyerList);
    // $scope.$on(NegotiationFactory.eventRecountSellerOffers, refreshSellerList);

    function showTab (tab) {
      if (tab === 'seller') {
        $('#buyer').removeClass('active');
        $('#buyer-tab').removeClass('active');
        $scope.scrollOptions.buyer = true;
        $scope.scrollOptions.seller = false;
        if ($scope.offersBuyer.length) {
          var lastChat = getLastChat($scope.offersBuyer.offersBuyerArray)[0].lastChat;
          NegotiationFactory.seenNewChatsBuyer(lastChat.postTime);
        }
      } else {
        $('#seller').removeClass('active');
        $('#seller-tab').removeClass('active');
        $scope.scrollOptions.buyer = false;
        $scope.scrollOptions.seller = true;
        if ($scope.offersSeller.length) {
          var lastChat = getLastChat($scope.offersSeller.offersSellerArray)[0].lastChat;
          NegotiationFactory.seenNewChatsSeller(lastChat.postTime);
        }
      }

      $('#'+tab).addClass('active');
      $('#'+tab+'-tab').addClass('active');
    }

    function getLastChat (listConversations) {
      var listSorter = listConversations.sort(function(a,b) {
        if (!a.lastChat || !b.lastChat) {
          return 0;
        }
        return (-1) * (parseInt(a.lastChat.postTime) - parseInt(b.lastChat.postTime))
      });
      var offerSorted = [];
      listSorter.forEach(function(val) {
        if (val.lastChat) {
          offerSorted.push(val);
        }
      });
      return offerSorted;
    }

    function getMoreConversationsSeller () {
      $scope.scrollOptions.seller = true;
      if ($scope.offersSeller.hasMoreResults) {
        NegotiationFactory.getOffersSeller({page: pageSeller++, pageSize: 24, count: $scope.offersSeller.offersSellerArray.length}, false)
          .then(function(listConversations) {
            $scope.offersSeller.hasMoreResults = listConversations.hasMoreResults;
            $scope.offersSeller.offersSellerArray = $scope.offersSeller.offersSellerArray.concat(listConversations.offersSellerArray);
            $scope.scrollOptions.seller = false;
          });
      }
    }

    function getMoreConversationsBuyer () {
      $scope.scrollOptions.buyer = true;
      if ($scope.offersBuyer.hasMoreResults) {
        NegotiationFactory.getOffersBuyer({page: pageBuyer++, pageSize: 24, count: $scope.offersBuyer.offersBuyerArray.length}, false)
          .then(function  (listConversations) {
            $scope.offersBuyer.hasMoreResults = listConversations.hasMoreResults;
            $scope.scrollOptions.buyer = false;
            $scope.offersBuyer.offersBuyerArray = $scope.offersBuyer.offersBuyerArray.concat(listConversations.offersBuyerArray);
          });
      }
    }

    // function refreshSellerList () {
    //   $scope.offersSeller = $scope.listConversations.offersSellerArray;
    // }

    // function refreshBuyerList () {
    //   $scope.offersBuyer = $scope.listConversations.offersBuyerArray;
    // }

    function markAsSeen () {
      if ($('#buyer.active').length) {
        var lastChat = getLastChat($scope.offersBuyer.offersBuyerArray)[0].lastChat;
        NegotiationFactory.seenNewChatsBuyer(+lastChat.postTime+1000);
      } else {
        var lastChat = getLastChat($scope.offersSeller.offersSellerArray)[0].lastChat;
        NegotiationFactory.seenNewChatsSeller(+lastChat.postTime+1000);
      }
      deregistrationEvent();
    }

  }


  angular.module('app.controllers')
  .controller('NegotiationsListController',NegotiationsListController);
}());

(function() {
  'use strict';

  function VivaNegotiationItem (DateHandler, NegotiationService, $state) {
    'ngInject';

    return {
      restrict: 'E',
      transclude: true,
      replace: true,
      templateUrl: 'views/partials/viva-negotiation-list-item.html',
      scope: {
        offer: '='
      },
      link: function(scope, ele, attr) {

        scope.goToThisConversation = goToThisConversation;

        if (scope.offer.lastChat) {
          scope.date = DateHandler.formattDateToPostTime(parseInt(scope.offer.lastChat.postTime));
        }
        scope.$on('VIVA.negotiationListItems.changeOffer', changeOffer);

        if (NegotiationService.isBuyer(scope.offer.role)) {
          if (scope.offer.buyerThumbnail) {
            scope.userStyle = {
              'background': 'url("'+scope.offer.buyerThumbnail+'") center center / cover'
            };
          }
        } else {
          if (scope.offer.sellerThumbnail) {
            scope.userStyle = {
              'background': 'url("'+scope.offer.sellerThumbnail+'") center center / cover'
            };
          }
        }
        scope.itemStyle = {
          'background': 'url("'+scope.offer.itemPicture+'") center center / cover'
        };

        if (NegotiationService.isRejected(scope.offer.status)) {
          scope.date += ' <span class="text-red"><b>·</b> Negociación cancelada</span>'
        }

        if (NegotiationService.isAccepted(scope.offer.status)) {
          scope.date += ' <span class="text-green"><b>·</b> Oferta aceptada</span>'
        }

        function changeOffer (ev, offer) {
          if (offer.conversationId === scope.offer.conversationId) {
            scope.offer = offer;
          }
        }

        function goToThisConversation () {
          $state.go('negotiation', {
            idNegotiation: scope.offer.conversationId
          });
        }
      }
    };
  }

  angular.module('app.directives')
  .directive('vivaNegotiationItem',VivaNegotiationItem);
}());

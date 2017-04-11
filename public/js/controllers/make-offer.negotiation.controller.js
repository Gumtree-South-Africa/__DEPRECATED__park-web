(function() {
  'use strict';

  function MakeOfferNegotiationController ($scope, $uibModalInstance, conversation, item, sellerHasOffer, $filter, NegotiationService) {
    'ngInject';

    $scope.makeOffer = makeOffer;
    $scope.confirm = confirm;
    $scope.cancel = cancel;
    $scope.confirmOffer = false;
    $scope.conversation = conversation;
    $scope.offer = {};
    $scope.offer.price = '$' + parseFloat(NegotiationService.isBuyer($scope.conversation.role)
                        ? $scope.conversation.currentPriceProposedByBuyer  || item.price
                        : $scope.conversation.currentPriceProposedBySeller || item.price);
    // $scope.formMakeOffer.price.$setViewValue('$' + $scope.offer.price);
    $scope.isNumberKey = isNumberKey;

    var textOfferBuyer = $scope.conversation.username +' vende su producto a ' + $filter('vivaCurrency')($scope.conversation.currentPriceProposedByBuyer || item.price);
    var questionOfferBuyer = '¿Cuánto quieres ofertar por él?';
    var textOfferSeller = 'El producto está publicado a ' + $filter('vivaCurrency')($scope.conversation.currentPriceProposedBySeller || item.price);
    var questionOfferSeller = '¿A cuánto quieres ofertarlo?';
    var textImproveOfferSeller = 'La última oferta fue de ' +( parseFloat(NegotiationService.isBuyer($scope.conversation.role))
                            ? $filter('vivaCurrency')($scope.conversation.currentPriceProposedBySeller  || item.price)
                            : $filter('vivaCurrency')($scope.conversation.currentPriceProposedByBuyer || item.price));
    var questionImproveOfferSeller = '¿Quieres mejorarla?';
    var textCounterOffer = $scope.conversation.username + ' ofertó ' +
                                                          $scope.offer.price
                                                         + ' por el producto';
    var questionCounterOffer = '¿Cuánto quieres contraofertar por él?';

    if (!sellerHasOffer && $scope.conversation.hasOffer) {
      $scope.presentationText = textImproveOfferSeller;
      $scope.questionText = questionImproveOfferSeller;
      $scope.offer.price = '$' + parseFloat(NegotiationService.isBuyer($scope.conversation.role)
                        ? $scope.conversation.currentPriceProposedBySeller  || item.price
                        : $scope.conversation.currentPriceProposedByBuyer || item.price);
    } else {
      if (!$scope.conversation.hasOffer) {
        if (NegotiationService.isSeller($scope.conversation.role)) {
          $scope.presentationText = textOfferBuyer;
          $scope.questionText = questionOfferBuyer;
        } else {
          $scope.presentationText = textOfferSeller;
          $scope.questionText = questionOfferSeller;
        }
      } else {
          $scope.presentationText = textCounterOffer;
          $scope.questionText = questionCounterOffer;
      }
    }

    function makeOffer () {
      if (parseFloat($scope.offer.price) === 0 && parseFloat($scope.offer.price) < 1000000) {
        $('.error-message').addClass('active');
      } else {
        $('.error-message').removeClass('active');
        if ($scope.offer.price.indexOf('$')>= 0) {
          $scope.offer.price = $scope.offer.price.substr(1,$scope.offer.price.length);
        }
        $scope.confirmOffer = !$scope.confirmOffer;
      }
    }

    function cancel () {
      $uibModalInstance.dismiss('cancel');
    }

    function confirm(flag) {
      if (flag) {
        $uibModalInstance.close($scope.offer.price);
      } else {
        if ($scope.offer.price.indexOf('$') < 0) {
          $scope.offer.price = '$' + $scope.offer.price;
        }
        $scope.confirmOffer = !$scope.confirmOffer;
      }
    }

    function isNumberKey(evt) {
      var charCode = (evt.which) ? evt.which : event.keyCode;
      if (charCode != 46 && charCode > 31
      && (charCode < 48 || charCode > 57))
          return false;

      return true;
    }

  }

  angular.module('app.controllers')
  .controller('MakeOfferNegotiationController', MakeOfferNegotiationController);

}());

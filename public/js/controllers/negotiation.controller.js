(function() {
  'use strict';

  function NegotiationController ($scope, Conversation, Chats, Item, $uibModal, NegotiationService, $timeout, AdsItemService, NegotiationFactory, $state, $auth, UtilsService) {
    'ngInject';

    $scope.myConversation = {};
    $scope.myConversation.status = {};
    $scope.myConversation.hashChats = Chats;
    $scope.myConversation.conversation = Conversation;
    $scope.item = Item.data;
    $scope.itemPrice = parseFloat($scope.item.price);
    $scope.makeOffer = makeOffer;
    $scope.sellerHasOffer = false;
    $scope.isSold = AdsItemService.isSold($scope.item.status);
    $scope.phrase = NegotiationService.isAccepted($scope.myConversation.conversation.status)
      ? 'Cerrado en'
      : 'Publicado en';
    $scope.itemImageStyle = {
      'background': 'url("' + $scope.item.pictures[0] +'")',
      'background-position': '50% 50%',
      'background-repeat': 'no-repeat',
      'background-size': 'cover'
    };

    $scope.$on('VIVA.chatNegotiation.sendChat', sendChat);
    $scope.$on('VIVA.chatNegotiation.cancelNegotiation', cancelNegotiationEvent);
    $scope.$on('$stateChangeStart', cancelNegotiationSearching);

    $scope.$watch('myConversation.conversation', conversationWatcher);

    var newChatsListener = null;
    var blockChatLister = false;
    var wasAcceptedRequest = false;
    var lastOfferTime = 0;

    $scope.acceptOffer = acceptOffer;
    $scope.rejectOffer = rejectOffer;
    $scope.openItem = openItem;

    if (Conversation.conversationId) {
      initConversationVar();
    } else {
      $scope.myConversation.status.isRejected = false;
      $scope.myConversation.status.isAccepted = false;
      $scope.myConversation.conversation.hasOffer = false;
      $scope.isSeller = $auth.getPayload().username.toLowerCase() !== $scope.item.user.username.toLowerCase();
    }

    function initConversationVar () {
      $scope.myConversation.status.isRejected = isRejected();
      $scope.myConversation.status.isAccepted = isAccepted();
      $scope.isSeller = NegotiationService.isSeller($scope.myConversation.conversation.role);
      newChatsListener = $timeout(getNewChats, 10000)

      // if (NegotiationService.isBuyer($scope.myConversation.conversation.role)) {
        Conversation.chats.forEach(function(chat) {
            validateOffer(chat);
            validateOfferAccepted(chat);
        });
      // }
    }

    function setChats (chats, addChatsFunction) {
      NegotiationFactory.getHashChats({
        chats: chats,
        username: $scope.myConversation.conversation.username,
        role: $scope.myConversation.conversation.role,
        userId:$scope.myConversation.conversation.userId,
        buyerThumbnail:$scope.myConversation.conversation.buyerThumbnail,
        sellerThumbnail:$scope.myConversation.conversation.sellerThumbnail,
        conversationId:$scope.myConversation.conversation.conversationId
      }, function(chat, chatObj) {
        validateOffer(chat);
        validateOfferAccepted(chat);
        $scope.myConversation.hashChats[chat.chatId] = chatObj;
        $scope.$broadcast('VIVA.chatNegotiation.appendChat', chat.chatId);
        $scope.$emit('VIVA.chatNegotiation.shouldShowCancelAction', !$scope.myConversation.status.isRejected || $scope.myConversation.conversation.conversationId);
      });
    }

    function sendChat (event ,comment) {
      if (comment.length) {
        var d = new Date();
        var promise = NegotiationService
        .sendChat({
          itemId: $scope.item.id,
          comment: comment,
          conversationId: $scope.myConversation.conversation.conversationId
        })
        .then(function (resp) {
          $scope.myConversation.conversation.conversationId = resp.conversationId;
          if (newChatsListener === null || $timeout.cancel(newChatsListener)) {
            getNewChats();
            $scope.$broadcast('VIVA.chatNegotiation.cleanInputBox');
          }
        })
        .catch(function(error) {
          if (error.errorCode === 701) {
            $state.go('error.productNotFound');
          }
        });
        $scope.$broadcast('VIVA.spinner.pushLoadingServiceNegotiation', promise);
      }
    }

    function getNewChats (conversationId) {
      return NegotiationService
      .getConversation(conversationId || $scope.myConversation.conversation.conversationId)
      .then(function(resp) {
        $scope.myConversation.conversation = resp;
        pushNewChats(resp.chats)
        if (!blockChatLister) {
          newChatsListener = $timeout(getNewChats, 10000);
        }
        return AdsItemService.find($scope.item.id);
      })
      .then(function (resp) {
        $scope.item = resp.data;
        $scope.isSold = AdsItemService.isSold($scope.item.status);
      })
      .catch(function(error) {
        if (error.errorCode === 703) {
          $state.go('error.productNotFound');
        }
      });
    }

    function pushNewChats (chats) {
      var newChats = [];
      var saveChat = null;
      angular.forEach(chats, function(chat, index) {
        if (!$scope.myConversation.hashChats[chat.chatId]) {
          if (NegotiationService.isAccepted(chat.action)) {
            saveChat = chat;
          } else {
            newChats.push(chat);
          }
          if (wasAcceptedRequest) {
            // saveChat = chat;
            wasAcceptedRequest = false;
          }
        }
      });
      if (saveChat) {
        newChats.push(saveChat);
      }
      if (newChats.length) {
        setChats(newChats);
      }
    }

    function makeOffer () {
      var modalInstance = $uibModal.open({
        animation: true,
        templateUrl: 'views/partials/viva-negotiation-make-offer.html',
        controller: 'MakeOfferNegotiationController',
        resolve: {
          conversation: function () {
            return $scope.myConversation.conversation;
          },
          item : function() {
            return $scope.item;
          },
          sellerHasOffer: function () {
            return $scope.sellerHasOffer;
          }
        },
        windowClass: 'modal-make-offer-negotiation'
      });

      modalInstance.result
      .then(function(offer) {
        var promise = NegotiationService
        .sendOffer({
          itemId: $scope.item.id,
          conversationId: $scope.myConversation.conversation.conversationId,
          offeredPrice: offer,
          brandPublish: 'web',
          versionPublish: '2'
        })
        .then(function(resp) {
          $scope.myConversation.conversation.conversationId = resp.conversationId;
          if (newChatsListener === null || $timeout.cancel(newChatsListener)) {
            getNewChats();
          }
        });
        $scope.$broadcast('VIVA.spinner.pushLoadingServiceNegotiation', promise);
      });
    }

    function acceptOffer () {
      var modalInstance = $uibModal.open({
        animation: true,
        templateUrl: 'views/partials/viva-negotiation-accept-offer.html',
        controller: 'AcceptOfferNegotiationController',
        resolve: {
          offer : function() {
            return NegotiationService.isBuyer($scope.myConversation.conversation.role)
                  ? $scope.myConversation.conversation.currentPriceProposedByBuyer || $scope.item.price
                  : $scope.myConversation.conversation.currentPriceProposedBySeller || $scope.item.price
          }
        },
        windowClass: 'modal-accept-offer-negotiation'
      });

      modalInstance.result
      .then(function (flag) {
        if (flag) {
          if ($scope.myConversation.conversation.chats && $scope.myConversation.conversation.chats.length ) {
            var promise = NegotiationService
            .acceptOffer({
              conversationId: $scope.myConversation.conversation.conversationId
            })
            .then(function(res) {
              if (newChatsListener === null || $timeout.cancel(newChatsListener)) {
                wasAcceptedRequest = true;
                getNewChats();
                $scope.phrase = 'Cerrado en';
              }
            });
            $scope.$broadcast('VIVA.spinner.pushLoadingServiceNegotiation', promise);
          } else {
            var promise = AdsItemService.sellItem($scope.item.id)
            .then(function(res) {
              return NegotiationService.getConversation(res.conversationId)
                    .then(function (resp) {
                        $scope.myConversation.conversation = resp;
                        NegotiationFactory.getHashChats(resp , function(chat, chatObj) {
                        $scope.myConversation.hashChats[chat.chatId] = chatObj;

                        $scope.$broadcast('VIVA.chatNegotiation.prependChat', chat.chatId);
                      });
                    });
            });
            $scope.$broadcast('VIVA.spinner.pushLoadingServiceNegotiation', promise);
          }
        }
      });
    }

    function rejectOffer () {

      var modalInstance = $uibModal.open({
        animation: true,
        templateUrl: 'views/partials/viva-negotiation-reject-offer.html',
        controller: 'RejectOfferNegotiationController',
        resolve: {
          offer : function() {
            return NegotiationService.isBuyer($scope.myConversation.conversation.role)
                  ? $scope.myConversation.conversation.currentPriceProposedByBuyer
                  : $scope.myConversation.conversation.currentPriceProposedBySeller
          }
        },
        windowClass: 'modal-reject-offer-negotiation'
      });

      modalInstance.result
      .then(function (confirmation) {
        if (confirmation.flag) {
          var promise = NegotiationService
          .rejectOffer({
            conversationId: $scope.myConversation.conversation.conversationId,
            explanation: confirmation.reason
          })
          .then(function(res) {
            if (newChatsListener === null || $timeout.cancel(newChatsListener)) {
                getNewChats();
              }
          });
          $scope.$broadcast('VIVA.spinner.pushLoadingServiceNegotiation', promise);
        }
      });
    }

    function isRejected () {
      return NegotiationService.isRejected($scope.myConversation.conversation.status);
    }

    function isAccepted () {
      return NegotiationService.isAccepted($scope.myConversation.conversation.status);
    }

    function conversationWatcher (newV, oldV) {
      if (newV) {
        $scope.myConversation.status.isRejected = isRejected();
        $scope.myConversation.status.isAccepted = isAccepted();
        if ($scope.myConversation.status.isAccepted) {
          $scope.phrase = 'Cerrado en';
        }
        if ($scope.myConversation.status.isRejected || !$scope.myConversation.conversation.conversationId) {
          $scope.$emit('VIVA.chatNegotiation.shouldShowCancelAction', false);
        }
      }
    }

    function cancelNegotiationEvent (ev) {
      rejectOffer();
    }

    function validateOffer(chat) {

      if (NegotiationService.isOffer(chat.action) && lastOfferTime < chat.postTime) {
        $scope.phrase = 'Última oferta recibida:';
        $scope.itemPrice = chat.offeredPrice;
        lastOfferTime = parseInt(chat.postTime);
      }

      if (!$scope.sellerHasOffer) {
        $scope.sellerHasOffer = ($scope.myConversation.conversation.hasOffer
        && NegotiationService.isOpen($scope.myConversation.conversation.status)
        && NegotiationService.isOffer(chat.action)
        && chat.senderUsername === $scope.myConversation.conversation.username)
      }
      return $scope.sellerHasOffer;
    }

    function cancelNegotiationSearching () {
      if (newChatsListener) {
        if (!$timeout.cancel(newChatsListener)) {
          blockChatLister = true;
        }
      }
    }

    function validateOfferAccepted (chat) {
      if (NegotiationService.isAccepted(chat.action)) {
        $scope.itemPrice = chat.offeredPrice;
      }
    }

    function openItem () {
      $state.go('item', {itemCategory: $scope.item.category.name, itemName: $scope.item.name, itemId: $scope.item.id})
    }

  }

  angular.module('app.controllers')
  .controller('NegotiationController', NegotiationController);

}());

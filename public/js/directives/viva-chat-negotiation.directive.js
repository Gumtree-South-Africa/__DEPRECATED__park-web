(function  () {
    'use strict';

    function VivaChatNegotiation ($compile, NegotiationService, UtilsService, $timeout) {
      'ngInject';

        return {
            restrict: 'E',
            transclude: true,
            replace: true,
            templateUrl: 'views/partials/viva-chat.html',
            scope: {
              myConversation: '='
            },
            link: function (scope, element, attr) {
              var VIVA_ID_CHATS_CONTAINER = '#id-viva-chats-container';
              var IPHONE_FLAG = false;
              scope.sendChat = sendChat;
              scope.chatInput = '';

              if (UtilsService.isRunningOnMobile()) {
                var is_keyboard = false;
                var initial_screen_size = window.innerHeight;

                /* Android */
                window.addEventListener("resize", function() {
                    is_keyboard = (window.innerHeight < initial_screen_size);

                    updateViews();
                }, false);

                /* iOS */
                $("#textarea-message").bind("focus blur",function() {
                    // $(window).scrollTop(10);
                    // is_keyboard = $(window).scrollTop() > 0;
                    // $(window).scrollTop(0);
                    // is_keyboard = IPHONE_FLAG = !IPHONE_FLAG;
                    // updateViews();
                });
              }

              scope.$on('VIVA.chatNegotiation.appendChat', appendChat);
              scope.$on('VIVA.chatNegotiation.prependChat', prependChat);
              scope.$on('VIVA.chatNegotiation.offerAccepted', setOfferAccepted);
              scope.$on('VIVA.chatNegotiation.offerRejected', setOfferRejected);
              // scope.$on('VIVA.chatNegotiation.cleanInputBox', cleanInputBox);

              function appendChat (event, chatId) {
                var chatElement = $compile('<viva-chat-message chat="myConversation.hashChats['+chatId+']"></viva-chat-message>')(scope);
                $(VIVA_ID_CHATS_CONTAINER).append(chatElement);
                $timeout(function() {
                  $(VIVA_ID_CHATS_CONTAINER).animate({ scrollTop: $(VIVA_ID_CHATS_CONTAINER).prop("scrollHeight")}, 1000);
                },500);
              }

              function prependChat (event, chatId) {
                var chatElement = $compile('<viva-chat-message chat="myConversation.hashChats['+chatId+']"></viva-chat-message>')(scope);
                $(VIVA_ID_CHATS_CONTAINER).prepend(chatElement);
                $timeout(function() {
                  $(VIVA_ID_CHATS_CONTAINER).animate({ scrollTop: $(VIVA_ID_CHATS_CONTAINER).prop("scrollHeight")}, 1000);
                },500);
              }

              function setChats (chats) {
                chats.forEach(function (chat, index) {
                  var chatElement = $compile('<viva-chat-message chat="myConversation.hashChats['+chat.chatId+']"></viva-chat-message>')(scope);
                  $(VIVA_ID_CHATS_CONTAINER).prepend(chatElement);
                });
                $timeout(function() {
                  $(VIVA_ID_CHATS_CONTAINER).animate({ scrollTop: $(VIVA_ID_CHATS_CONTAINER).prop("scrollHeight")}, 1000);
                },500);
              }

              function sendChat () {
                if (scope.chatInput.length) {
                  scope.$emit('VIVA.chatNegotiation.sendChat', scope.chatInput);
                  scope.chatInput = '';
                }
              }

              $('#textarea-message').keypress(function (ev) {
                if (ev.which === 13) {
                  sendChat();
                  event.preventDefault();
                }
              });

              function updateViews () {
                if (is_keyboard) {
                  $('#id-viva-chats-container').height('28vh');
                } else {
                  $('#id-viva-chats-container').height('57vh');
                }
              }

              function setOfferAccepted () {
                var legendHtml = '<div class="accepted-offer"><b>¡Felicitaciones, cerraron un trato!</b> <span class="light-text">El anuncio fue marcado como vendido y sólo resta coordinar dónde y cuándo desean completar la transacción.</span></div>';
                $(VIVA_ID_CHATS_CONTAINER).append($compile(legendHtml)(scope));
              }

              function setOfferRejected () {
                var legendHtml = '<div class="rejected-offer"><div><b>La negociación ya no es válida.</b></div><div class="light-text">El anuncio no esta disponible</div></div>';
                $(VIVA_ID_CHATS_CONTAINER).append($compile(legendHtml)(scope));
              }

              function cleanInputBox () {
                scope.chatInput = '';
              }

              function scrollSafe (to) {
                if (navigator.userAgent.match(/(iPod|iPhone|iPad|Android)/)) {
                 window.scrollTo(0,100) // first value for left offset, second value for top offset
                } else{
                  $timeout(function() {
                    $(VIVA_ID_CHATS_CONTAINER).animate({ scrollTop: $(VIVA_ID_CHATS_CONTAINER).prop("scrollHeight")}, 800,
                      function(){
                      $(VIVA_ID_CHATS_CONTAINER).clearQueue();
                    });
                  },500);
                }
              }

              if (scope.myConversation.conversation.conversationId) {
                setChats(scope.myConversation.conversation.chats);
              }
            }
        };
    }

    angular.module('app.directives')
    .directive('vivaChatNegotiation',VivaChatNegotiation);

}());

(function() {
  'use strict';

  function VivaChatMessage (DateHandler, NegotiationService, $filter, $timeout) {
    'ngInject';

    return {
      restrict: 'E',
      transclude: true,
      replace: true,
      templateUrl: 'views/partials/viva-chat-message.html',
      scope: {
        chat: '='
      },
      link: function (scope, element, attr) {

        scope.userStyle = {};
        scope.postTime = formattName();
        scope.comment = scope.chat.comment;
        scope.isMyMessage = scope.chat.isMyMessage;
        scope.isAccepted = NegotiationService.isAccepted(scope.chat.action);
        scope.isRejected = NegotiationService.isRejected(scope.chat.action);
        $timeout(checkPostTime,300000);

        if (scope.chat.thumbnail) {
          scope.userStyle = {
            'background': 'url("'+scope.chat.thumbnail+'") center center / cover'
          }
        }

        if (NegotiationService.isOffer(scope.chat.action)) {
          scope.comment = scope.comment.toUpperCase();
          scope.comment += '<br><b>' + $filter('vivaCurrency')(scope.chat.offeredPrice) + '</b>';
        }

        if (scope.isAccepted) {
          scope.comment = '<b>' + scope.chat.comment + '</b> <span class="light-text">' + scope.chat.hint + '</span>';
        }

        if (scope.isRejected) {
          scope.comment = scope.chat.comment + '<br><span class="light-text">' + scope.chat.hint + '</span>';
        }

        if (scope.chat.action === 'MARKED_AS_SOLD') {
          var index = scope.comment.indexOf('.');
          var itemName = scope.comment.substr(11,index-11);
          scope.comment = scope.comment.replace(itemName, '<b>'+itemName+'</b>');
        }

        function formattName () {
          return scope.chat.username + ' · ' + DateHandler.formattDateToPostTime(parseInt(scope.chat.postTime));
        }

        function checkPostTime () {
          return scope.chat.username + ' · ' + DateHandler.formattDateToPostTime(parseInt(scope.chat.postTime));
        }

      }
    };
  }

  angular.module('app.directives')
  .directive('vivaChatMessage',VivaChatMessage);
}());

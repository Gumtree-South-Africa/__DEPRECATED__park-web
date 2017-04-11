(function() {
  'use strict';

  function ModalShareController ($scope, $timeout, $uibModalInstance, entity, url, type) {
    'ngInject';

    $scope.hasCopy = false;
    $scope.onSuccess = function (e) {
      $scope.hasCopy = true;
      $timeout(function () {
        $scope.hasCopy = false;
      }, 2000);
    };

    $scope.$on('modal.closing', function () {
      $scope.hasCopy = false;
    });

    $scope.closeModal = function () {
      $('.modal').modal('hide');
    };

    $scope.url = url;

    $scope.shareFacebook = function () {
      FB.ui({
        method: 'share',
        href: url
      }, function(response){
      });
    };
    var text = "";
    switch (type) {
      case 'app':
        text = 'Únete a la comunidad de anuncios clasificados. Baja la App Ahora!';
        break;
      case 'item':
        text ='Encontré esta oferta en Vivanuncios Estados Unidos!';
      case 'group':
        var entityName = entity.username || entity.name;
        text = 'Mira las ofertas que tiene publicadas ' + entityName +' en VivanunciosUSA!';
        break;
      default:
      text = "Únete a la comunidad de anuncios clasificados. Baja la App Ahora!";
    }

    $scope.twitterUrl =
      'https://twitter.com/intent/tweet?text=' + text + '&url=' +
      window.encodeURIComponent(url);

    if(typeof(entity) != "undefined") {

      // var clipboard = new Clipboard('a.link-logo');

      $scope.entity = entity;
      if (typeof(entity.pictureUrl) === "undefined") {
        if (typeof(entity.pictures) != "undefined") {
          $scope.entity.pictureUrl = entity.pictures[0];
        }
      }
    }
  }

  angular.module('app.controllers')
  .controller('ModalShareController', ModalShareController);

}());

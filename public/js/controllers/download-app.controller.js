(function () {
  'use strict';

  function DownloadAppController ($scope, $window, $stateParams, BranchIoService) {

    'ngInject';

    $scope.phoneNumber = '';

    $window.scrollTo(0, 0);
    $scope.sendMeLink = function () {
      switch ($stateParams.smsType){
        case 'app':
          BranchIoService.sendSMS($scope.phoneNumber, 'app', {});
          break;
        case 'item':
          BranchIoService.sendSMS($scope.phoneNumber, 'item', {
            itemId: $stateParams.id,
            itemDescription: $stateParams.description,
            itemImage: $stateParams.img
          });
          break;
        case 'user':
          BranchIoService.sendSMS($scope.phoneNumber, 'user', {
            itemId: $stateParams.id,
            itemDescription: $stateParams.description,
            itemImage: $stateParams.img
          });
          break;
        default:
          BranchIoService.sendSMS($scope.phoneNumber, 'app', {});
          break;
      }
    };
  }

  angular.module('app.controllers')
  .controller('DownloadAppController', DownloadAppController);

}());

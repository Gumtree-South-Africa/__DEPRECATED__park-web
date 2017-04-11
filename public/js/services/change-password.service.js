(function() {
  'use strict';

  function ChangePasswordService (QueryApiService) {
    'ngInject';

    return {
      changePassword: function (passwords){
        return QueryApiService.makeRequest({
          method: 'POST',
          url: '/api/users/v3/changepwd',
          data: passwords
        })
      }
    };
  }

  angular.module('app.services')
  .service('ChangePasswordService', ChangePasswordService);
}());

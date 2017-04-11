(function() {
  'use strict';

  function RecoverPasswordService (QueryApiService) {
    'ngInject';

    return {
      recoverPassword: function (email){
        return QueryApiService.makeRequest({
          method: 'POST',
          url: '/api/users/v3/forgotpwd',
          data: email
        })
      }
    };
  }

  angular.module('app.services')
  .service('RecoverPasswordService', RecoverPasswordService);
}());


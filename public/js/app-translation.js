
(function() {

  'use strict';

  function AppTranslation ($translateProvider) {

    'ngInject';

    //To clean local storage navigate this url "chrome://chrome/settings/clearBrowserData"
    //Or from dev tools navigate menu "Resources" -> "LocalStorage"

    $translateProvider.useSanitizeValueStrategy('escape');

      //website_v2\app\data\en-US\resx_main.json
    $translateProvider.useStaticFilesLoader({
      prefix: 'data/',
      suffix: '/main.resource.json'
    });

    //set a default language
    $translateProvider.preferredLanguage( appConfig.defaultLanguage );
    $translateProvider.useLocalStorage();
  }

  angular.module('vivaApp')
  .config(AppTranslation);

}());

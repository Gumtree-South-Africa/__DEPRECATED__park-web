(function() {
  'use strict';

  function VivaCurrencyInput ($filter) {
    'ngInject';

    return {
      restrict: 'A',
      require: 'ngModel',
      link: function  (scope, ele, attr, ngModelCtr) {
        var lastValue = '';
        // ngModelCtr.$viewChangeListeners.push(parserToCurrency);
        ngModelCtr.$parsers.push(parseFromCurrency);
        function parserToCurrency () {
          if (ngModelCtr.$modelValue && ngModelCtr.$modelValue.length) {
            var inputValue = ngModelCtr.$modelValue;
            var transformedInput = inputValue ? inputValue.replace(/[^\d.-]/g,'') : inputValue;

            if (transformedInput!=inputValue) {
                ngModelCtr.$setViewValue(transformedInput);
                ngModelCtr.$render();
            }
            return lastValue;
          }
        }
        function parseFromCurrency (inputValue) {
          var transformedInput = inputValue ? inputValue.replace(/[^\d.-]/g,'') : inputValue;
          var validator = new RegExp(/^(\d{0,6}\.\d{0,2}|\d{0,6})$/);

          if (!validator.test(transformedInput)) {
            transformedInput = lastValue;
          }
          lastValue = transformedInput;
          ngModelCtr.$setViewValue('$' +transformedInput);
          ngModelCtr.$render();

          return transformedInput;
        }
      }
    }
  }

  angular.module('app.directives')
  .directive('vivaCurrencyInput',VivaCurrencyInput);
}());

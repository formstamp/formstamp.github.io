(function() {
  angular.module('formstamp').directive('fsTimeFormat', [
    '$filter', function($filter) {
      return {
        restrict: 'A',
        require: 'ngModel',
        link: function(scope, element, attrs, ngModel) {
          return ngModel.$parsers.unshift(function(value) {
            var pattern, _ref;
            value || (value = '');
            pattern = /^([0-1][0-9]|2[0-3]):?([0-5][0-9])/;
            value = (_ref = value.match(pattern)) != null ? _ref[0] : void 0;
            if (value) {
              if (value.length > 2 && /^(\d\d)([^:]*)$/.test(value)) {
                value = value.replace(/^(\d\d)([^:]*)$/, "$1:$2");
                ngModel.$setViewValue(value);
                ngModel.$render();
              }
              return value;
            } else {
              return null;
            }
          });
        }
      };
    }
  ]);

}).call(this);

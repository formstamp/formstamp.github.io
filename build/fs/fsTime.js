(function() {
  angular.module("formstamp").directive("fsTime", [
    '$compile', '$filter', function($compile, $filter) {
      return {
        restrict: "A",
        scope: {
          disabled: '=ngDisabled',
          "class": '@'
        },
        require: '?ngModel',
        replace: true,
        template: function(el) {
          return "<div class=\"fs-time fs-widget-root\">\n  <input\n    fs-null-form\n    fs-time-format\n    ng-model=\"value\"\n    class=\"form-control\"\n    ng-disabled=\"disabled\"\n    type=\"text\"/>\n  <span class=\"glyphicon glyphicon-time\"></span>\n  <div fs-list items=\"dropdownItems\">\n    {{item}}\n  </div>\n</div>";
        },
        link: function(scope, element, attrs, ngModelCtrl) {
          var h, hours, items, m, minutes, num, watchFn, zh, _i, _j, _len, _len1;
          hours = (function() {
            var _i, _results;
            _results = [];
            for (num = _i = 0; _i <= 23; num = ++_i) {
              _results.push(num);
            }
            return _results;
          })();
          minutes = ['00', '15', '30', '45'];
          items = [];
          for (_i = 0, _len = hours.length; _i < _len; _i++) {
            h = hours[_i];
            zh = h < 10 ? "0" + h : h;
            for (_j = 0, _len1 = minutes.length; _j < _len1; _j++) {
              m = minutes[_j];
              items.push("" + zh + ":" + m);
            }
          }
          if (ngModelCtrl) {
            watchFn = function(newValue, oldValue) {
              if (!angular.equals(newValue, oldValue)) {
                return ngModelCtrl.$setViewValue(newValue);
              }
            };
            scope.$watch('value', watchFn);
            return ngModelCtrl.$render = function() {
              return scope.value = ngModelCtrl.$viewValue;
            };
          }
        }
      };
    }
  ]);

}).call(this);

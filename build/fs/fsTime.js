(function() {
  angular.module("formstamp").directive("fsTime", [
    '$compile', function($compile) {
      return {
        restrict: "A",
        scope: {
          disabled: '=ngDisabled',
          "class": '@'
        },
        require: '?ngModel',
        replace: true,
        template: function(el) {
          var datalistId, h, hours, m, minutes, num, res, timeoptions, zh, _i, _j, _len, _len1;
          hours = (function() {
            var _i, _results;
            _results = [];
            for (num = _i = 0; _i <= 23; num = ++_i) {
              _results.push(num);
            }
            return _results;
          })();
          minutes = ['00', '15', '30', '45'];
          res = [];
          for (_i = 0, _len = hours.length; _i < _len; _i++) {
            h = hours[_i];
            zh = h < 10 ? "0" + h : h;
            for (_j = 0, _len1 = minutes.length; _j < _len1; _j++) {
              m = minutes[_j];
              res.push("<option value='" + zh + ":" + m + "'/>");
            }
          }
          datalistId = "fsTimeDatalist_" + (nextUid());
          timeoptions = res.join('');
          return "<div class=\"fs-time fs-widget-root\">\n  <input\n    fs-null-form\n    ng-model=\"value\"\n    fs-time-format\n    class=\"form-control\"\n    ng-disabled=\"disabled\"\n    list=\"" + datalistId + "\"\n    type=\"text\"/>\n  <span class=\"glyphicon glyphicon-time\"></span>\n  <datalist id=\"" + datalistId + "\">\n  " + timeoptions + "\n  </datalist>\n</div>";
        },
        link: function(scope, element, attrs, ngModelCtrl) {
          if (ngModelCtrl) {
            scope.$watch('value', function(newValue, oldValue) {
              if (!angular.equals(newValue, oldValue)) {
                return ngModelCtrl.$setViewValue(newValue);
              }
            });
            return ngModelCtrl.$render = function() {
              return scope.value = ngModelCtrl.$viewValue;
            };
          }
        }
      };
    }
  ]);

}).call(this);

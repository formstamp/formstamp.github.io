(function() {
  angular.module('formstamp').directive('fsTimeFormat', [
    '$filter', function($filter) {
      return {
        restrict: 'A',
        require: 'ngModel',
        link: function(scope, element, attrs, ngModel) {
          ngModel.$formatters.push(function(time) {
            var h, m, _ref, _ref1;
            if (time == null) {
              return '';
            }
            h = (_ref = time.hours) != null ? _ref.toString() : void 0;
            if ((h != null ? h.length : void 0) < 2) {
              h = "0" + h;
            }
            m = (_ref1 = time.minutes) != null ? _ref1.toString() : void 0;
            if ((m != null ? m.length : void 0) < 2) {
              m = "0" + m;
            }
            return "" + h + ":" + m;
          });
          return ngModel.$parsers.unshift(function(value) {
            var hours, matched, minutes, p, parts, patterns, res, _i, _len;
            value || (value = '');
            patterns = [/^[012]/, /^([0-1][0-9]|2[0-3]):?/, /^([0-1][0-9]|2[0-3]):?[0-5]/, /^([0-1][0-9]|2[0-3]):?([0-5][0-9])/];
            matched = null;
            for (_i = 0, _len = patterns.length; _i < _len; _i++) {
              p = patterns[_i];
              res = value.match(p);
              if (res) {
                matched = res[0];
              }
            }
            value = matched;
            if (value) {
              if (value.length > 2 && /^(\d\d)([^:]*)$/.test(value)) {
                value = value.replace(/^(\d\d)([^:]*)$/, "$1:$2");
                ngModel.$setViewValue(value);
                ngModel.$render();
              }
              parts = value.split(':');
              return {
                hours: isNaN(hours = parseInt(parts[0])) ? null : hours,
                minutes: isNaN(minutes = parseInt(parts[1])) ? null : minutes
              };
            } else {
              return null;
            }
          });
        }
      };
    }
  ]);

}).call(this);

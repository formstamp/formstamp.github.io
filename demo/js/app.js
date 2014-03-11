(function() {
  var app, unindentCode, widgets;

  unindentCode = function(str) {
    var leadingSpaces, re;
    str = str != null ? str : "";
    str = str.replace(/^\n/, "");
    leadingSpaces = str.match(/^\s+/);
    if (leadingSpaces) {
      re = new RegExp("^[ ]{" + leadingSpaces[0].length + "}", 'gm');
      return str.replace(re, '');
    } else {
      return str;
    }
  };

  widgets = [
    {
      name: 'Form Builder',
      template: 'formbuilder'
    }, {
      name: 'Select Widget',
      template: 'select'
    }, {
      name: 'MultiSelect Widget',
      template: 'multiselect'
    }, {
      name: 'Radio Group',
      template: 'radio'
    }, {
      name: 'Checkboxes',
      template: 'checkbox'
    }, {
      name: 'Date/Time Widgets',
      template: 'datetime'
    }, {
      name: 'fsList',
      template: 'list'
    }
  ];

  app = angular.module('formstamp-demo', ['formstamp', 'ngRoute', 'ngSanitize', 'ngAnimate'], function($routeProvider, $locationProvider) {
    var w, _i, _len, _results;
    $routeProvider.when('/', {
      controller: 'ReadmeCtrl',
      templateUrl: 'demo/templates/welcome.html'
    });
    _results = [];
    for (_i = 0, _len = widgets.length; _i < _len; _i++) {
      w = widgets[_i];
      _results.push((function(w) {
        var templateName;
        templateName = w.template != null ? w.template : w.name;
        return $routeProvider.when("/widgets/" + templateName, {
          templateUrl: "demo/templates/" + templateName + ".html",
          controller: 'WidgetCtrl'
        });
      })(w));
    }
    return _results;
  });

  if (window.testMode) {
    app.run(function($animate) {
      return $animate.enabled(false);
    });
  }

  app.filter('prettify', function() {
    return function(code) {
      if (code) {
        return hljs.highlightAuto(code).value;
      }
    };
  });

  app.run(function($rootScope, $location) {
    $rootScope.widgets = widgets;
    return $rootScope.$on("$routeChangeStart", function(event, next, current) {
      var parts;
      parts = $location.path().split('/');
      return $rootScope.currentWidget = parts[parts.length - 1];
    });
  });

  app.controller('ReadmeCtrl', function($scope, $http) {
    return $http.get('/README.md').success(function(data) {
      return $scope.readme = markdown.toHTML(data);
    });
  });

  app.controller('WidgetCtrl', function($scope, $http) {});

  app.directive('sample', function() {
    return {
      restrict: 'E',
      scope: {
        label: '@'
      },
      controller: function($scope) {
        return $scope.current = "demo";
      },
      template: function($el, attrs) {
        var el, html, js, orig;
        el = $el[0];
        orig = el.innerHTML;
        js = unindentCode($(el).find('script').remove().text());
        js = hljs.highlightAuto(js).value;
        html = unindentCode(el.innerHTML);
        html = hljs.highlightAuto(html).value.replace(/{{([^}]*)}}/g, "<b style='color:green;'>{{$1}}</b>");
        html = html.replace(/(fs-[-a-zA-Z]*)/g, "<b style='color:#c00;'>$1</b>");
        return "<div class=\"fsdemo-sample\">\n  <h4 class=\"pull-left\">{{ label || \"EXAMPLE\" }}</h4>\n\n  <div class=\"btn-group fstabs pull-right\">\n    <a class=\"btn btn-default\" ng-class=\"{'active': current == 'demo'}\" ng-click=\"current='demo'\">Demo</a>\n    <a class=\"btn btn-default\" ng-class=\"{'active': current == 'html'}\" ng-click=\"current='html'\">HTML</a>\n    <a class=\"btn btn-default\" ng-class=\"{'active': current == 'js'}\" ng-click=\"current='js'\">JavaScript</a>\n  </div>\n\n  <div class='clearfix' style=\"height: 0;\"></div>\n  <div ng-show=\"current=='demo'\">" + orig + "</div>\n  <div ng-show=\"current=='html'\"><pre ng-non-bindable>" + html + "</pre> </div>\n  <div ng-show=\"current=='js'\"><pre ng-non-bindable>" + js + "</pre> </div>\n</div>";
      }
    };
  });

  app.directive("demoAudio", function() {
    return {
      restrict: "E",
      scope: {
        track: '='
      },
      template: "<audio controls />",
      replace: true,
      link: function($scope, $element, $attrs) {
        return $scope.$watch('track', function(track) {
          $element.attr('src', track.stream_url + "?client_id=8399f2e0577e0acb4eee4d65d6c6cce6");
          return $element.get(0).play();
        });
      }
    };
  });

}).call(this);

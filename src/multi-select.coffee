hash_key = (item)->
  angular.toJson(item)

difference = (a, b)->
  return a unless b && a
  hash = {}
  hash[hash_key(b_element)] = true for b_element in b
  a.filter ((a_element)-> not hash[hash_key(a_element)])

angular
.module("angular-w")
.directive "wMultiSelect", ['$window', ($window) ->
    restrict: "A"
    scope:
      errors: '='
      items: '='
      invalid: '='
      limit: '='
      keyAttr: '@'
      valueAttr: '@'
    require: '?ngModel'
    replace: true
    transclude: true
    templateUrl: "/templates/multi-select.html"
    controller: ($scope, $element, $attrs) ->

      move = (d) ->
        items = $scope.shownItems
        activeIndex = getActiveIndex() + d
        activeIndex = Math.min(Math.max(activeIndex,0), items.length - 1)
        $scope.activeItem = items[activeIndex]
        scrollIfNeeded(activeIndex)

      scrollIfNeeded = (activeIndex) ->
        ul = $element.find('ul')[0]
        li = ul.querySelector('li.active')

        return unless ul and li

        viewport =
          top: ul.scrollTop
          bottom: ul.scrollTop + innerHeightOf(ul)

        li = ul.querySelector('li.active')
        liHeight = innerHeightOf(li)
        item =
          top: activeIndex * liHeight
          bottom: (activeIndex + 1) * liHeight

        # Scroll down
        if item.bottom > viewport.bottom
          ul.scrollTop += item.bottom - viewport.bottom
          # Scroll up
        else if item.top < viewport.top
          ul.scrollTop -= viewport.top - item.top

      search = (q) ->
        $scope.shownItems = difference(
          filter(q, $scope.items, $scope.valueAttr).slice(0, $scope.limit),
          $scope.selectedItems
        )
        $scope.activeItem = $scope.shownItems[0]
        $scope.prevSearch = q

      resetDropDown = ->
        $scope.shownItems = difference(
          $scope.items.slice(0, $scope.limit),
          $scope.selectedItems
        )
        $scope.activeItem = $scope.shownItems[0]

      #TODO: why is this method's name a noun instead of a verb?
      $scope.selection = (item)->
        if item? and indexOf($scope.selectedItems, item) == -1
          $scope.selectedItems.push(item)
          $scope.hideDropDown()
          resetDropDown()

      $scope.deselect = (item)->
        index = indexOf($scope.selectedItems, item)
        if index > -1
          $scope.selectedItems.splice(index, 1)
          resetDropDown()

      $scope.reset = ->
        $scope.selectedItems = []
        $scope.focus = true
        search('')

      $scope.onkeys = (event)->
        switch event.keyCode
          when 40 then move(1)
          when 38 then move(-1)
          when 13
            $scope.selection($scope.activeItem)
            $scope.focus=true
            event.preventDefault()
          when  9 then $scope.selection($scope.activeItem)
          when 27
            $scope.hideDropDown()
            $scope.focus=true
          when 34 then move(11)
          when 33 then move(-11)

      $scope.$watch 'search', search

      $scope.$watch 'active', (value) ->
        window.setTimeout((()-> scrollIfNeeded(getActiveIndex())) , 0) if value

      $scope.hideDropDown = ->
        $scope.active = false

      getActiveIndex = ->
        indexOf($scope.shownItems, $scope.activeItem) || 0

      $scope.invalid = ->
        $scope.errors? and $scope.errors.length > 0

      # TODO move to init
      $scope.selectedItems = []
      # run
      resetDropDown()

    compile: (tElement, tAttrs) ->
      tAttrs.keyAttr ||= 'id'
      tAttrs.valueAttr ||= 'label'

      # Link function
      (scope, element, attrs, ngModelCtrl, transcludeFn) ->

        if ngModelCtrl
          scope.$watch 'selectedItems', ->
            ngModelCtrl.$setViewValue(scope.selectedItems)
            #TODO: activeItem can't hold an array
            scope.activeItem = scope.selectedItems

          ngModelCtrl.$render = ->
            scope.selectedItems = ngModelCtrl.$modelValue || []

        scope.$watch  'selectedItems', ->
          childScope = scope.$new()
          childScope.items = scope.selectedItems
          transcludeFn childScope, (clone) ->
            if clone.text().trim() isnt ""
              link = element[0].querySelector('a.w-multi-select-active')
              angular.element(link).empty().append(clone)

        # Hide drop down list on click elsewhere
        $window.addEventListener 'click', (e) ->
          parent = $(e.target).parents('div.w-multi-select')[0]
          if parent != element[0]
            scope.$apply(scope.hideDropDown)
  ]

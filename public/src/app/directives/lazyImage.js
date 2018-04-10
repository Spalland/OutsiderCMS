angular.module("lazyImage", [])
.directive('lazyImage', function (){

  return {
    restrict: 'A',
    scope: { lazy: '@' },
    link: function(scope, element, attrs) {
    	element.bind('load', function() {
            element.attr('src', scope.lazy);
            element.unbind('load');
        });
    }
  };
});
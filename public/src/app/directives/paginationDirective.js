angular.module("paginationDirective", [])
.directive('pagination', ['$compile', '$templateCache', function ($compile, $templateCache){

    var getTemplate = function(data) {
        // use data to determine which template to use
        var template = $templateCache.get(data);
        return template;
    }

    return {
        templateUrl: 'views/partials/modal-pages.html',
        scope: false,
        transclude:true,
        restrict: 'E',
        link: function(scope, element) {
	        
	        var template = getTemplate(scope.image.currentPage);
			
            element.html(template);
            $compile(element.contents())(scope);

	        
	        scope.$watch( function(){return scope.image.currentPage} ,function(){
		        template = getTemplate(scope.image.currentPage);
		        element.html(template);
				$compile(element.contents())(scope);
	        })
           
        }
    };
}]);

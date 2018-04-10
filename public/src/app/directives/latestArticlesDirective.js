angular.module('latestArticlesDirective', [])
.directive('latestArticles', function() {
	return {
		restrict: 'E',
		transclude: false,
		scope: {
			count:'=', 
			bucket:'@'
		},
		templateUrl: 'views/partials/latest-articles.html',
		controllerAs : "la",
		controller: ['$scope' , 'Article', 'toasty', function($scope, Article, toasty){ 
		    
		    var ctrl = this;
	
		    ctrl.bucket = $scope.bucket;
		    
		    Article.latest({rpp: $scope.count + 1, page :1}).then(function(response){ 
			    
			    var data = response.data;
			    console.log(response);
			    
			    if(data.success === true){ 
				    
				    ctrl.articles = data.data;
				    
			    }else{ 
				    
				    toasty.error({title: "Failed to retreive latest articles", msg: data.error});
				    
			    }
			    
			    
		    })

		        	    
		}]
	};
});
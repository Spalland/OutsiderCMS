angular.module('activityCtrl', [])


.controller('activityController',  ['Article', '$routeParams', function(Article, $routeParams){ 
	
	var ctrl = this;
	ctrl.activity = $routeParams.activity;
	ctrl.articles = [];
	ctrl.currentPage = 1; 
	ctrl.articlesPerPage = 10;
	ctrl.title = $routeParams.activity;
	ctrl.moreToLoad = true;
	
	Article.allOfActivity(ctrl.activity, {rpp: ctrl.articlesPerPage, page :ctrl.currentPage})
	.then(function(response){ 
		
		ctrl.articles = response.data.data;
		
		
		
	});
	
	
	ctrl.loadMore = function(){ 
		
		
		if(ctrl.loadingMore === true){ 
			
			return; 
		}else{ 
		
			ctrl.loadingMore = true;
			
			ctrl.currentPage ++; 
			
			Article.allOfActivity(ctrl.activity, {rpp: ctrl.articlesPerPage, page :ctrl.currentPage}).then(function(response){ 
			
				var newArticles = response.data.data;
				
				if(newArticles.length < ctrl.articlesPerPage) { ctrl.moreToLoad = false }
				
				for( var i = 0; i < newArticles.length; i++){ 
				
					ctrl.articles.push(newArticles[i]); 
					
				}
				
				ctrl.loadingMore = false;
			
			});
		}
		
	}
	
	
	

	
}]);
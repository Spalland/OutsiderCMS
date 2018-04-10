angular.module('categoryCtrl', [])


.controller('categoryController',  ['Article', '$routeParams','toasty', function(Article, $routeParams, toasty){ 
	

	var ctrl = this;
	ctrl.category = $routeParams.category;
	ctrl.articles = [];
	ctrl.currentPage = 1; 
	ctrl.articlesPerPage = 10;
	ctrl.title = $routeParams.category;
	ctrl.moreToLoad = true;
	
	Article.allOfCategory(ctrl.category, {rpp: ctrl.articlesPerPage, page :ctrl.currentPage})
	.then(function(response){
		
		ctrl.articles = response.data.data;
		
		toasty.success({
            title: 'Woop',
            msg: ctrl.articles.length  + ' articles loaded!'
        });
	
		
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
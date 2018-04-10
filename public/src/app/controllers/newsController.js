angular.module('newsCtrl', [])


.controller('newsController',  ['Article', function(Article){ 
	
	var ctrl = this;
	ctrl.currentPage = 1; 
	ctrl.articlesPerPage = 10;
	ctrl.articles = [];
	ctrl.moreToLoad = true;
	ctrl.title = "Latest";
	ctrl.loadingMore = false;
	
	
	Article.latest({rpp: ctrl.articlesPerPage, page :ctrl.currentPage}).then(function(response){ 
		
		ctrl.articles = response.data.data;
		


		
	});
	
	ctrl.loadMore = function(){ 
		
		
		if(ctrl.loadingMore === true){ 
			
			return; 
		}else{ 
		
			ctrl.loadingMore = true;
			
			ctrl.currentPage ++; 
			
			Article.latest({rpp: ctrl.articlesPerPage, page :ctrl.currentPage}).then(function(response){ 
			
				var newArticles = response.data.data;
				
				if(newArticles.length < ctrl.articlesPerPage) { ctrl.moreToLoad = false }
				
				for( var i = 0; i < newArticles.length; i++){ 
				
					console.log(newArticles[i]);
					ctrl.articles.push(newArticles[i]); 
					
				}
				
				ctrl.loadingMore = false;
			
			});
		}
		
	}

	
}]); 
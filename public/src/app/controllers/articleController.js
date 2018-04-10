angular.module('articleCtrl', [])


.controller('articleController',  ['Article', '$routeParams' , function(Article, $routeParams){ 
	
	var ctrl = this;

	
	Article.getArticle($routeParams.slug)
	
	.then(function(response){ 
	

		ctrl.article = response.data.data;
		
		console.log("article", ctrl.article);
		
		ctrl.dataReady = true;
		
		Article.update(ctrl.article.id, {views:1});
		
	});
	
							
	
	
}]); 
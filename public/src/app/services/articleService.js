angular.module('articleService', [])

////////////////////////////////////////////////////////
// -------------------------------------------------- //
// ---------------- Article Service ----------------- //
// --------------------- CRUD ----------------------- //
// -------------------------------------------------- //
////////////////////////////////////////////////////////

.factory('Article', ['$http', function($http){ 
	
////////////////////////////////////
// ------- Set Up Object -------- //
////////////////////////////////////
		
	var article = {};
		
////////////////////////////////////
// ------------ CRUD ------------ //
////////////////////////////////////
	
	// Get All article
	
	article.all = function(){ 
		
		return $http.get('api/articles');
	};
	
	
	article.allOfActivity = function(activity, params){ 
	
		return $http({
			method: "GET",
			url : 'api/articles/activities/' + activity,
			params : params
			
		});		
	};
	
	article.allOfCategory = function(category, params){ 
	
		return $http({
			method: "GET",
			url : 'api/articles/categories/' + category,
			params : params
			
		});	
			
	};
	
	article.latest = function(p){ 
		
		return $http({
			method: "GET",
			url : 'api/articles/latest',
			params : p
			
		});	
		
	};
	
	// Get One article
	
	article.get = function(id){
		
		return $http.get('api/articles/' + id); 
	};
	
	// Get a Published Article
	
	article.getArticle = function(slug){
		
		return $http.get('api/articles/article/' + slug); 
	};
	
	// Add New article
	
	article.create = function(data){ 

		return $http.post('api/articles/', data); 
	};
	
	// Update Existing article
	
	article.update = function(id, data){ 
		
		return $http.put('api/articles/'+ id, data); 
	}; 
	
	// Delete article
	
	article.delete = function(id){ 
		
		return $http.delete('api/articles/'+ id); 
	};
	
	article.reserveSlug = function(slug){ 

		return $http.get('api/articles/reserve/' + slug);
	}
	
	
////////////////////////////////////
// ------- Return Object -------- //
////////////////////////////////////
	
	return article;
	
}]);
angular.module('commentService', [])

////////////////////////////////////////////////////////
// -------------------------------------------------- //
// ---------------- Comment Service ----------------- //
// --------------------- CRUD  ---------------------- //
// -------------------------------------------------- //
////////////////////////////////////////////////////////

.factory('Comment', ['$http', function($http){ 
	
////////////////////////////////////
// ------- Set Up Object -------- //
////////////////////////////////////
		
	var comment = {};
		
////////////////////////////////////
// ------------ CRUD ------------ //
////////////////////////////////////
	
	// Get All comments
	
	comment.all = function(){ 
		
		return $http.get('api/comments');
	};
	
	// Get One comment
	
	comment.get = function(id){
		
		return $http.get('api/comments/' + id); 
	};
	
	comment.getArticleComments = function(articleId){
		
		
		return $http.get('api/comments/article/' + articleId);
	}
	
	// Add New comment
	
	comment.create = function(data){ 
		
		return $http.post('api/comments/', data); 
	};
	
	// Update Existing comment
	
	comment.update = function(id, data){ 
		
		return $http.put('api/comments/'+ id, data); 
	}; 
	
	
	comment.flag = function(id, data){ 
		
		return $http.put('api/comments/flag/'+ id, data); 
	}; 
	
	// Delete comment
	
	comment.delete = function(id){ 
		
		return $http.delete('api/comments/'+ id); 
	};
	
	
////////////////////////////////////
// ------- Return Object -------- //
////////////////////////////////////
	
	return comment;
	
}]);
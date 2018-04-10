angular.module('categoryService', [])

////////////////////////////////////////////////////////
// -------------------------------------------------- //
// ------------------ category Service ------------------ //
// --------------------- CRUD  ---------------------- //
// -------------------------------------------------- //
////////////////////////////////////////////////////////

.factory('Category', ['$http', function($http){ 
	
////////////////////////////////////
// ------- Set Up Object -------- //
////////////////////////////////////
		
	var category = {};
		
////////////////////////////////////
// ------------ CRUD ------------ //
////////////////////////////////////
	
	// Get All categories
	
	category.all = function(){ 
		
		return $http.get('api/categories');
	};

	
	// Get One category
	
	category.get = function(id){
		
		return $http.get('api/categories/' + id); 
	};
	
	// Add New category
	
	category.create = function(data){ 
		
		return $http.post('api/categories/', data); 
	};
	
	// Update Existing category
	
	category.update = function(id, data){ 
		
		return $http.put('api/categories/'+ id, data); 
	}; 
	
	// Delete category
	
	category.delete = function(id){ 
		
		return $http.delete('api/categories/'+ id); 
	};
	
	
////////////////////////////////////
// ------- Return Object -------- //
////////////////////////////////////
	
	return category;
	
}]);
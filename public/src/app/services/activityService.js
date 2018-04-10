angular.module('activityService', [])

////////////////////////////////////////////////////////
// -------------------------------------------------- //
// ------------------ activity Service ------------------ //
// --------------------- CRUD  ---------------------- //
// -------------------------------------------------- //
////////////////////////////////////////////////////////

.factory('Activity', ['$http', function($http){ 
	
////////////////////////////////////
// ------- Set Up Object -------- //
////////////////////////////////////
		
	var activity = {};
		
////////////////////////////////////
// ------------ CRUD ------------ //
////////////////////////////////////
	
	// Get All activities
	
	activity.all = function(){ 
		
		return $http.get('api/activities');
	};

	
	// Get One activity
	
	activity.get = function(id){
		
		return $http.get('api/activities/' + id); 
	};
	
	// Add New activity
	
	activity.create = function(data){ 
		
		return $http.post('api/activities/', data); 
	};
	
	// Update Existing activity
	
	activity.update = function(id, data){ 
		
		return $http.put('api/activities/'+ id, data); 
	}; 
	
	// Delete activity
	
	activity.delete = function(id){ 
		
		return $http.delete('api/activities/'+ id); 
	};
	
	
////////////////////////////////////
// ------- Return Object -------- //
////////////////////////////////////
	
	return activity;
	
}]);
angular.module('userService', [])

////////////////////////////////////////////////////////
// -------------------------------------------------- //
// ------------------ User Service ------------------ //
// ------ CRUD and Password Reset Functions --------- //
// -------------------------------------------------- //
////////////////////////////////////////////////////////

.factory('User', ['$http', function($http){ 
	
////////////////////////////////////
// ------- Set Up Object -------- //
////////////////////////////////////

	var currentUser = {};
		
	var user = {};
	
	
		
////////////////////////////////////
// ------------ CRUD ------------ //
////////////////////////////////////
	
	// Get All Users
	
	user.all = function(){ 
		
		return $http.get('api/users');
	};
	
	// Get One User
	
	user.get = function(id){
		
		return $http.get('api/users/' + id); 
	};
	
	// Add New User
	
	user.create = function(data){ 
		
		return $http.post('api/users/', data); 
	};
	
	// Update Existing User
	
	user.update = function(id, data){ 
		
		return $http.put('api/users/'+ id, data); 
	}; 
	
	// Delete User
	
	user.delete = function(id){ 
		
		return $http.delete('api/users/'+ id); 
	};
	
////////////////////////////////////
// -- Password Reset Functions -- //
////////////////////////////////////
	
	// Forgot Password
	
	user.forgot = function(data){ 
		
		return $http.post('api/users/forgot', data);
	}
	
	// Reset Password 
	
	user.reset = function(data){ 
		
		return $http.post('api/users/reset', data);
		
	}
	
	
////////////////////////////////////
// --- Verify Email Functions --- //
////////////////////////////////////
	
	// Verify Email
	
	user.verify = function(data){ 
		
		return $http.post('api/users/verify', data);
	}
	
	user.request = function(){ 
		
		return $http.get('api/users/verify');
		
	}
	
	
////////////////////////////////////
// ---- Email Prefs Functions --- //
////////////////////////////////////
	

	
	user.newsletter = function(data){ 
		
		return $http.post('api/users/newsletter', data);
	}
	

	
	
	
////////////////////////////////////
// ------- Return Object -------- //
////////////////////////////////////



	
	return user;
	
}]);
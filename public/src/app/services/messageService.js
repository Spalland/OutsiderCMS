angular.module('messageService', [])

////////////////////////////////////////////////////////
// -------------------------------------------------- //
// ---------------- Message Service ----------------- //
// --------------------- CRUD  ---------------------- //
// -------------------------------------------------- //
////////////////////////////////////////////////////////

.factory('Message', ['$http', function($http){ 
	
////////////////////////////////////
// ------- Set Up Object -------- //
////////////////////////////////////
		
	var message = {};
		
////////////////////////////////////
// ------------ CRUD ------------ //
////////////////////////////////////
	
	// Get All messages
	
	message.all = function(){ 
		
		return $http.get('api/messages');
	};
	
	// Get One message
	
	message.get = function(id){
		
		return $http.get('api/messages/' + id); 
	};
	

	// Add New message
	
	message.create = function(data){ 
		
		return $http.post('api/messages/', data); 
	};
	
	// Add New contact message
	
	message.contact = function(data){ 
		
		return $http.post('api/messages/contact', data); 
	};
	
	// Update Existing message
	
	message.update = function(id, data){ 
		
		return $http.put('api/messages/'+ id, data); 
	}; 
	
	
	message.flag = function(id, data){ 
		
		return $http.put('api/messages/flag/'+ id, data); 
	}; 
	
	// Delete message
	
	message.delete = function(id){ 
		
		return $http.delete('api/messages/'+ id); 
	};
	
	
////////////////////////////////////
// ------- Return Object -------- //
////////////////////////////////////
	
	return message;
	
}]);
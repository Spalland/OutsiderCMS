angular.module('imageService', [])

////////////////////////////////////////////////////////
// -------------------------------------------------- //
// ------------------ image Service ------------------ //
// --------------------- CRUD  ---------------------- //
// -------------------------------------------------- //
////////////////////////////////////////////////////////

.factory('Image', ['$http', 'Upload', function($http, Upload){ 
	
////////////////////////////////////
// ------- Set Up Object -------- //
////////////////////////////////////
		
	var image = {};
		
////////////////////////////////////
// ------------ CRUD ------------ //
////////////////////////////////////
	
	// Get All image
	
	image.all = function(){ 
		
		return $http.get('api/images');
	};
	
	image.latest = function(){ 
	
		return $http.get('api/images/latest');	
		
	};
	
	// Get One image
	
	image.get = function(id){
		
		return $http.get('api/images/' + id); 
	};
	
	
	image.getCrop = function(id){ 
		
		return $http.get('api/images/cropped/' + id);
	}
	
	// Add New image
	
	image.add = function(file){ 
		
		return Upload.upload({
        	url: 'api/images/add',
			file: file, 
			test: "spoons"
    	})

	};
	
	// Update Existing image
	
	image.update = function(id, data){ 
		
		return $http.put('api/images/'+ id, data); 
	}; 
	
	// Delete image
	
	image.delete = function(id){ 
		
		return $http.delete('api/images/'+ id); 
	};
	
	
	image.crop = function(data){
		
		return $http.put('api/images/crop', data);
	}
	
	
////////////////////////////////////
// ------- Return Object -------- //
////////////////////////////////////
	
	return image;
	
}]);
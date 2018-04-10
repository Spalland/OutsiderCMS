angular.module('authService' , [])

////////////////////////////////////////////////////////
// -------------------------------------------------- //
// ------------------ Auth Service ------------------ //
// --------------- Log In and Log Out --------------- //
// -------------------------------------------------- //
////////////////////////////////////////////////////////

.factory('Auth', ['$http', '$q' , 'Token', '$localStorage', function($http, $q, Token, $localStorage){ 
	

////////////////////////////////////
// ---- Create Return Object ---- //
////////////////////////////////////

	var currentUser;
	
	var auth = {};
	
	
	
////////////////////////////////////
// ------- Factory Actions ------ //
////////////////////////////////////
	
	// Log In
	
	auth.login = function(email, password){ 
		
		return $http.post('api/auth', { 
			
			email:email,
			password:password
			
		})
			.success(function(data){ 
				
				Token.set(data.token)
			
				
				return data; 	
		});
	};
	
	// Log Out
	
	auth.logout = function(){
		console.log("Hey");
		Token.set(); 
	};
	
	// Add New User
	
	auth.isLoggedIn = function(){ 
		if (Token.get()){
			return true;
		}else{ 
			return false;
		}
		
	};
	
	// Get User Details
	
	auth.pullUser = function(){ 
		
		if(Token.get()){
			console.log("Getting");
		
			return $http.get('/api/me');
		}else{ 
	
			return $q.reject({message:'No token found'}); 
		}
		
	}
	

	auth.setUser = function(data){ 
		
		if(data){
			
			$localStorage.user = data;
		}else{ 
			$localStorage.user = undefined;
		}
		
	}
	
	auth.getUser = function(data){ 
		
		return $localStorage.user; 
		
	}
	
	
	auth.hasRole = function(r){ 
		
		if($localStorage.user.role){ 
			
			if($localStorage.user.role.indexOf(r) > -1){ 
				
				return true;
			}else{ 
				
				return false;
			}
			
		}else{ 
			
			return false;
		}
		
	}


////////////////////////////////////
// -------- Return Object ------- //
////////////////////////////////////
	
	return auth;
	
}])




////////////////////////////////////////////////////////
// -------------------------------------------------- //
// ------------------ Token Service ----------------- //
// --------- Getters and Setter for Tokens ---------- //
// -------------------------------------------------- //
////////////////////////////////////////////////////////

.factory('Token', ['$window', function($window){ 
	
////////////////////////////////////
// ---- Create Return Object ---- //
////////////////////////////////////
	
	var token = {};
	
////////////////////////////////////
// ------- Factory Actions ------ //
////////////////////////////////////	
	
	// Get Token
	
	token.get = function(){ 
		
		return $window.localStorage.getItem('token');
		
	};
	
	// Set or Destroy Token
	
	token.set = function(token){
		if(token){ 
			
			$window.localStorage.setItem('token', token);
			
		}else{ 
			
			$window.localStorage.removeItem('token',token);
			
		}
	};
	
////////////////////////////////////
// -------- Return Object ------- //
////////////////////////////////////	
		
	return token;
	
}])


////////////////////////////////////////////////////////
// -------------------------------------------------- //
// --------------- Interceptor Service -------------- //
// --------- Intercept Requests & Responses --------- //
// -------------------------------------------------- //
////////////////////////////////////////////////////////

.factory('Interceptor', ['$q', '$location', 'Token', function($q, $location, Token){ 
	
////////////////////////////////////
// ---- Create Return Object ---- //
////////////////////////////////////	
	
	var interceptor = {}; 
	
////////////////////////////////////
// ------- Factory Actions ------ //
////////////////////////////////////	
	
	// Intercept outgoing requests and add token if available
	
	interceptor.request = function(config){ 
		
		var token = Token.get();
		
		
		if(token){ 
			config.headers['x-access-token'] = token; 
		}
		
		return config;
	};
	
	// Intercept responses and handle errors
	
	interceptor.response = function(response) {
		

	
		if(response.data.falseStatus){ 
			$location.path('/' + response.data.falseStatus);
		}
		
		return response;
		
	}
	
	interceptor.responseError = function(response) { 
		
		console.log(response);
		switch(response.falseStatus){
			case 401: 
				Token.set();
				Auth.setUser();
				$location.path('/401');
				break;
			case 403: 
				$location.path('/403');
				break;	
			case 404: 
				$location.path('/404');
				break;	
			default:
				$location.path('/500');
		}
				
		return $q.reject(response);
	};
	
////////////////////////////////////
// -------- Return Object ------- //
////////////////////////////////////	
	
	return interceptor;			
			
	
}]);

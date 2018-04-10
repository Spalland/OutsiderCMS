angular.module('mainCtrl', [])

.controller('mainController', ['$rootScope', '$location', 'Auth', '$scope', 'Token' , 'Modal', '$http', 'Bucket', '$window','toasty', function($rootScope, $location, Auth, $scope, Token, Modal, $http, Bucket, $window, toasty){ 
	
	var ctrl = this; 
	ctrl.error = [];
	ctrl.collapsed = true;
	$window.analyticsMode = 'none';
	ctrl.motd = 'Go have an adventure <i><a href="https://twitter.com/hashtag/getoutthere">#getoutthere</a></i>'

	
	
	$http.get("/servermode").then(function(response){
		
		if (response.data.success == true){ 
			Bucket.set(response.data.data); 
			ctrl.bucket = Bucket.get();
			
			if(response.data.env == 'production'){
				
				$window.analyticsMode = "auto";
			}
		}	
	})
	
	// Delete expired user information
	var dateNow = Date.now();
	
	if (Auth.getUser() !== undefined){
		
		if ((dateNow / 1000) > Auth.getUser().exp){ 
						
			Token.set();
			Auth.setUser();
		}
	}
	
	
	// Check whether errors are present, to be used on NG-CLASS fields; 


	ctrl.hasError = function(field){ 
		
		for(var l = 0; l < ctrl.error.length; l++){ 
			
			if(ctrl.error[l].field === field){ 
				return "has-error";
			}
		}
		
		return "";
		
	}
	

	
	
	// Get Logged In Status of User
	$scope.$watch(Auth.isLoggedIn, function(logged){ 
		
		ctrl.loggedIn = logged;
	});

	$scope.$watch(Auth.getUser, function(user){ 
		
		ctrl.user = user;
	});

	
	
	$rootScope.$on("$routeChangeSuccess", function(){ 
		
		if($location.path().indexOf("/admin") > -1){ 
			ctrl.hideJumbo = true;
		}else{ 
			ctrl.hideJumbo = false;
			
		}		
		
	})
	

	
		
	// Function to handle login
	ctrl.login = function(){ 
		
		if(!ctrl.loginData){ 
			
			toasty.error({title: "Login Failed" , msg: "Email and password cannot be blank"});
			return;
		}
		
		Auth.login(ctrl.loginData.email, ctrl.loginData.password)
			.success(function(data) { 
				
				console.log(data);
			
				if (data.success){
					
					Auth.setUser(data.data);
					toasty.success({title: "Successful Login", msg : "Welcome back " + data.data.first_name, sticky: true});
					$location.path('/profile');
		
				}else{
					ctrl.error.push(data.error);
					toasty.error({title: "Login Failed" , msg: data.error});
				}
		}); 
	};
	
	
	// Function to handle logout
	ctrl.logout = function(){ 
		
		
		Auth.logout();
		
		// Reset user information
		Auth.setUser(); 
		$location.path('/');
		
		ctrl.collapsed = true;
	};
	
}])


.directive('hideUnless', ['ngIfDirective', 'Auth', function(ngIfDirective, Auth) {
  var ngIf = ngIfDirective[0];

  return {
    transclude: ngIf.transclude,
    priority: ngIf.priority - 1,
    terminal: ngIf.terminal,
    restrict: ngIf.restrict,
    link: function($scope, $element, $attr) {
	    var reqRole = $attr['hideUnless'];
	      
		var initialNgIf = $attr.ngIf, ifEval; 
		
		function getRole(){ 
			
			var role = Auth.getUser() ? Auth.getUser().role : false;
			
			if(role){
			    if(role.toString().indexOf(reqRole) > -1){
					return true; 
			
				    
			    }else{ 
				
				    return false;
			    }
			}
		}
		
		
		if(initialNgIf){
			
			ifEval = function() { 
				
				return $scope.$eval(initialNgIf) && getRole();
				
			}
			
		}else{ 
			
			ifEval = function() { 
				
				return getRole(); 
				
			}
	        
	    };
	    
	    $attr.ngIf = ifEval
	    ngIf.link.apply(ngIf, arguments);
    }
  };
}])

.directive('ifPathContains', ['ngIfDirective', '$location', function(ngIfDirective, $location) {
  var ngIf = ngIfDirective[0];

  return {
    transclude: ngIf.transclude,
    priority: ngIf.priority,
    terminal: ngIf.terminal,
    restrict: ngIf.restrict,
    link: function($scope, $element, $attr) {
	    var path = $attr['ifPathContains'];
	      

	
	    $attr.ngIf = function() {

		    if($location.path().indexOf(path) > -1){
			  
				return true; 
			    
		    }else{ 
			    
			    return false;
		    }
		
	        
	    };
	    ngIf.link.apply(ngIf, arguments);
    }
  };
}])



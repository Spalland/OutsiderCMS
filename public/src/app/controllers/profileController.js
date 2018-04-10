angular.module('profileCtrl', [])


.controller('profileController', [ 'User', "$rootScope", "Auth", "$routeParams", '$location', function(User, $rootScope, Auth, $routeParams, $location){ 
	
	var ctrl = this;
	
	ctrl.buttonMessage = "Request New Verification Email";
	ctrl.buttonDanger = false;
	ctrl.hovering = false;
	ctrl.user = {};
	
	if($location.path().indexOf('profile') > -1 ){ 

		Auth.pullUser().then(function(response){ 
			
			var data = response.data;
			
			console.log(response);
			
			ctrl.user = data;
			
			console.log(ctrl.user);
			
		})
	
	}else{ 
		
		if($routeParams.id){
			
			User.get($routeParams.id).then(function(response){ 
				
				var data = response.data;
				
				ctrl.user = data;
			}) 
			
		}else if($routeParams.username){
			
			User.get($routeParams.username).then(function(response){
			
				var data = response.data;
				
				ctrl.user = data;	
				
			})	
		}
		
	}
	
	
	

	ctrl.request = function(){ 
		
		User.request()
		.then(function(data){
			
			var data = data.data;
			
			if(data.success){
				ctrl.buttonMessage = data.message;
			}else{ 
				
				ctrl.buttonMessage = data.message[0].message;
				ctrl.buttonDanger = true; 
			} 
			
			
		});
		
	};
	
	ctrl.hover = function(bool){ 
	
		ctrl.hovering = bool;
	}
	

	
}]);
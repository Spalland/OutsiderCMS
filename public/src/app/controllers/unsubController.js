angular.module('unsubCtrl', [])


.controller('unsubController',  ['User', '$routeParams' , function(User, $routeParams){ 
	
	var ctrl = this;
	
	ctrl.token = $routeParams.token;
	
		
							
	
	
}]); 
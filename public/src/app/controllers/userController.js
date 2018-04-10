angular.module('userCtrl', [])

////////////////////////////////////////////////////////
// -------------------------------------------------- //
// ---------------- User Controller ----------------- //
// -------- Handling all user related tasks --------- //
// -------------------------------------------------- //
////////////////////////////////////////////////////////

.controller('userController',['User', '$location', '$routeParams', 'toasty', function(User, $location, $routeParams, toasty){ 
	
////////////////////////////////////
// --------- Map "this" --------- //
////////////////////////////////////

	var ctrl = this; 
	
////////////////////////////////////
// ------ Initialise Values ----- //
////////////////////////////////////
	
	ctrl.signupData = {};
	ctrl.error = [];
	
	ctrl.signupData.first_name = "";
	ctrl.signupData.last_name = "";
	ctrl.signupData.email = "";
	ctrl.signupData.password = "";
	ctrl.signupData.username = "";
	ctrl.forgotSuccess = false;
	
	if($routeParams.token){ 
		
		ctrl.signupData.token = $routeParams.token;
	}
	
////////////////////////////////////
// ---- Controller Functions ---- //
////////////////////////////////////


	// Check whether errors are present, to be used on NG-CLASS fields; 
	
	ctrl.hasError = function(field){ 
		
		for(var l = 0; l < ctrl.error.length; l++){ 
			
			if(ctrl.error[l].field === field){ 
				return "has-error";
			}
		}
		
		return "";
		
	}
	
	
	// Process signup and handle response 
	
	ctrl.signup = function() { 
		
		User.create(ctrl.signupData)
		.success(function(data){ 
			 
			 
			if(data.success){ 
				 
				console.log(data);
				toasty.success({title: "Successful Signup", msg : 'Thanks for joining Outsider.guide ' + data.data.first_name + '. You have been sent an email to verify your address.', sticky: true});
				$location.path('/login');
				 
			}else{ 
				
				ctrl.error.push(data);
				console.log(data);
				toasty.error({
					
					title : 'Uh oh',
					msg : data.error
				 
				})
				
			}
			
		
			 
		});
		
	}
	
	// Process forgotten password and handle response 
	
	ctrl.forgot = function() { 
		
		User.forgot({
			email : ctrl.signupData.email
		})
		.success(function(data){
			
			if(data.success){ 
				 
				ctrl.forgotSuccess = true;
				toasty.success({title: "Reset email sent", msg : 'You have been sent an email to reset your password.', sticky: true});
				$location.path('/');
				 
			}else{ 
				
				ctrl.error.push(data);
				toasty.error({
					
					title : 'Uh oh',
					msg : data.error
				 
				})
				 
			}
				
		});
	}
	
	// Process password reset and handle response 
	
	ctrl.reset = function() { 
		
		
		User.reset({
			password: ctrl.signupData.password, 
			token	:$routeParams.token
		})
		.success(function(data){ 
			
			console.log(data);
			
			if(data.success){ 
				
				$location.path('/login');
				
			}else{ 
				
				ctrl.error.push(data);
				toasty.error({
					
					title : 'Uh oh',
					msg : data.error
				 
				})
				
			}
			
		})
	}
	
	// Process email verification
	
	ctrl.verify = function() {
		

		User.verify({
			email 	: ctrl.signupData.email,
			password: ctrl.signupData.password, 
			token	: $routeParams.token
		})
		.success(function(data){ 
			
			
			
			if(data.success){ 
				
				$location.path('/login');
				
			}else{ 
				
				ctrl.error.push(data);
				toasty.error({
					
					title : 'Uh oh',
					msg : data.error
				 
				})
				
			}
			
		})

	}
	
	
}]);
	
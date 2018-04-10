angular.module('newsletterDirective', [])
.directive('newsletter', function() {
	return {
		restrict: 'E',
		transclude: false,
		scope: {},
		templateUrl: 'views/partials/newsletter.html',
		controllerAs : "nl",
		controller: ['$scope' , 'User', 'toasty', function($scope, User, toasty){ 
		    
		    var ctrl = this;
		    
		    ctrl.nlSignup = function(){ 
			    
			    console.log("Submitting");
			    
			    console.log(ctrl.email !== "", ctrl.email !== undefined);
			    
			    if(ctrl.email !== "" && ctrl.email !== undefined){
				    
				    console.log("Passed if");
			   
			    	User.newsletter({email:ctrl.email})
			    	.then(function(response){ 
				    	
				    	var data = response.data; 
				    	
				    	console.log(data);
				    	
				    	if(data.success === true){ 
					    	
					    	toasty.success({title: "Successfully Subscribed", msg:"You have signed up with " + data.data.email});
					    	
				    	}else{ 
					    	
					    	toasty.error({title : "Subscription Failed", msg : data.error});
					    	
				    	}
			    	});
				}  		    
		    }	    	    
		}]
	};
});
angular.module('contactCtrl', [])


.controller('contactController',  ['Message', "toasty", '$location', function(Message, toasty, $location){ 
	
	var ctrl = this;
	
	ctrl.submit = function(){
		
		if(!ctrl.body || ctrl.body == ""){ 
			
			toasty.error({title: "Message not sent", msg: "Message body can't be blank"});
			
		}else{
			
			
			Message.contact({ 
						
				body	: ctrl.body,
				fname	: ctrl.fname,
				lname	: ctrl.lname,
				email	: ctrl.email
			
			}).then(function(response){ 
				
				var data = response.data; 
				
			
					
				if(data.success === true){ 
					toasty.success({title: 'Message Sent', msg: "Thanks. We have recieved you message, we will see what we can do to help as soon as possible.", sticky:true});
					
					$location.path('/');
					
				}else{ 
					
					toasty.error({title: "Message failed to send", msg: data.error});
						
				}
				
			})

			
		}
		
	}
	
}]); 
angular.module('activitiesCtrl', [])


.controller('activitiesController',  ['Activity', function(Activity){ 
	
	var ctrl = this;
	ctrl.list = [];
	ctrl.pageTitle = "Activities";
	ctrl.type = "activities";
	
	Activity.all()
	.then(function(response){ 
		
		ctrl.list = response.data.data;
		console.log(ctrl.list);
		
	});	

	
}]); 
angular.module('categoriesCtrl', [])


.controller('categoriesController',  ['Category', function(Category){ 
	
	var ctrl = this;
	ctrl.pageTitle = "Categories";
	ctrl.type = "categories"
	
	Category.all()
	.then(function(response){ 
		
		ctrl.list = response.data.data;
		
	});	

	


	
}]);
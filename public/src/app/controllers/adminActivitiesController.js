angular.module('adminActivitiesCtrl', [])


.controller('adminActivitiesController',  ['Activity', 'Modal', '$window', 'Image', function(Activity, Modal, $window, Image){ 
	
	var ctrl = this;
	ctrl.title = "Activities";
	ctrl.titleSingular = "Activity";
	ctrl.editing = false;
	ctrl.editType = "Create";
	ctrl.currentImage = undefined;
	ctrl.kw = {};
	
	Activity.all()
	.then(function(response){ 
		
		ctrl.sections = response.data.data;
	});	
	
	
	ctrl.genslug = function(){ 
					
		ctrl.kw.slug = ctrl.kw.title.toLowerCase().replace(/ /g,'-').replace(/[^\w-]+/g,'');
		
	}
	
	ctrl.setEditing = function(editType){ 
		
	
		ctrl.editing = true; 
		ctrl.editType = editType;
		ctrl.pullDown();
		
	}
	
	ctrl.cancelEditing = function(){ 
		
		ctrl.editing = false;
		
	}
	
	ctrl.submitKeyword = function(){ 
		
		Activity.create(ctrl.kw).then(function(response){ 
			
			
			
			if(response.data.success == true){ 
				
				ctrl.sections.push(response.data.data);
				ctrl.kw = {}; 
				ctrl.editing = false;
				
			}

			
		})
		
	}
	
	
	ctrl.deleteKeyword = function(id){ 
		
		if(confirm('Deleting this Activity can not be undone! All articles with this activity will be set to "General"\r \r' + 'Are you sure you wish to continue?')){
			
			Activity.delete(id).then(function(response){ 
			
				if(response.data.success == true){ 
				
					for(var i = 0; i < ctrl.sections.length; i++){ 
						
						if(ctrl.sections[i].id == id){ 
							
							ctrl.sections.splice(i, 1);
							break;
							
						}
						
					}
				}	
				
			});
			
		}
	}
		

	
	
	ctrl.imageModal = function(model, requiredCrop){ 
		
		
		Modal.showModal({	
			templateUrl	: "views/partials/imageModal.html",
			controller	: "imageController",
			controllerAs: "image",
			inputs 		: { requiredCrop : requiredCrop }
    	})
    	.then(function(modal) {
			modal.close.then(function(result) {
				
				if(result){
					ctrl.kw[model] = result.id;
				
					
					Image.getCrop(result.id)
					.then(function(response){ 
				
						ctrl.currentImage = response.data.data.filename;
						console.log(ctrl.currentImage);
						
					});
				
				}
			});
    	});
	}
	
	ctrl.pullDown = function(){ 
		
			
	}

	
}]);
angular.module('adminCategoriesCtrl', [])


.controller('adminCategoriesController',  ['Category', 'Modal', '$window', 'Image', 'Bucket', function(Category, Modal, $window, Image, Bucket){ 
	
	var ctrl = this;
	ctrl.title = "Categories";
	ctrl.titleSingular = "Category";
	ctrl.editing = false;
	ctrl.editType = "Create";
	ctrl.currentImage = undefined;
	ctrl.kw = {};
	ctrl.bucket = Bucket.get();
	
	Category.all()
	.then(function(response){ 
		
		ctrl.sections = response.data.data;
		console.log(ctrl.sections);
		
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
		
		Category.create(ctrl.kw).then(function(response){ 
			
			if(response.data.success == true){ 
				
				ctrl.sections.push(response.data.data);
				ctrl.kw = {}; 
				ctrl.editing = false;
				
			}
		});
		
	}
	
	
	ctrl.deleteKeyword = function(id){ 
		
		if(confirm('Deleting this Category can not be undone! All articles with this category will be set to "General"\r \r' + 'Are you sure you wish to continue?')){
			
			Category.delete(id).then(function(response){ 
				
				console.log(response);
			
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
			inputs 		: { requiredCrop : requiredCrop}
					
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
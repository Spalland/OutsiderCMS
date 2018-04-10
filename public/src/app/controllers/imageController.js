angular.module('imageCtrl', [])

.controller('imageController', ['Image', 'close', '$scope', 'requiredCrop', 'Bucket','toasty', function(Image, close, $scope, requiredCrop, Bucket, toasty){ 
	
	var ctrl = this; 
	
	ctrl.mess = "Image Select";
	ctrl.error = [];
	ctrl.data = {};
	ctrl.data.files = [];
	ctrl.data.images = [];
	ctrl.activeImage = undefined;
	ctrl.cropToolsEnabled = false; 
	ctrl.cropAspectRatio = requiredCrop === "wide" ? 9/16 : 1;
	ctrl.offsetX;
	ctrl.offsetY;
	ctrl.cropWidth;
	ctrl.cropHeight; 
	ctrl.modeMessage = "Select an article cover image";
	ctrl.currentPage = "page-id-1"
	ctrl.cropSuccess = false;
	ctrl.croppedImage = {};
	ctrl.bucket = Bucket.get();
	
	
	ctrl.setPage = function(page){ 
		
		
		ctrl.currentPage = "page-id-" + page;
		
	}
	
	
	
	
	// Init function by getting user images
	
	ctrl.fetchImages = function(){ 
		Image.all()
		.then(function(response){
			
			ctrl.data.images = response.data.data;
			
		});
	
	}
	
	// Read crop return vals from directive then send to server for crop
	
	ctrl.saveCrop = function(purpose){ 
		
		var data = {};
		 
		data.image = ctrl.activeImage;
		data.cropOffsetX = ctrl.offsetX;
		data.cropOffsetY = ctrl.offsetY;
		data.cropWidth = ctrl.cropWidth;
		data.cropHeight = ctrl.cropHeight;
		data.purpose = purpose || "poster";
		
						
		Image.crop(data)
		.then(function(response){ 
			
			ctrl.cropSuccess = true;
			ctrl.croppedImage = response.data.data;
		});
	
			
		

		
	}
	
	
	
	// Handles singular selection of images in image list

	ctrl.select = function(i){ 
		
		var images = ctrl.data.images;
		
		index = images.indexOf(i);
	
		
		ctrl.activeImage = images[index];
		ctrl.activeImage.index = index;
		ctrl.activeImageUrl = 'https://s3-eu-west-1.amazonaws.com/' + ctrl.bucket + '/medium/' + images[index].filename;
		
		// If already selected deselect
			
		if(!images[index].selected){
			
			for(var i = 0; i < images.length; i++){ 
				
				images[i].selected = false;
				
			}
			
			images[index].selected = true;
			ctrl.cropToolsEnabled = false;
			
		// Else select
			
		}else{ 
			
			ctrl.activeImage = undefined;
			images[index].selected = false;
			ctrl.cropToolsEnabled = false;
		}
			
		
	}
	
	
	// Handles the upload of image files to the server 
	
	ctrl.uploadFiles = function(files){ 
			
		while(files.length > 0){ 
			
			var currentFile =  files.shift();
			
			Image.add(currentFile)
			.then(function(response){ 
	
			
				response.data.data.selected = false;
				ctrl.data.images.unshift(response.data.data);
			});
		}
	}
	

	$scope.$watch('image.data.files', function() {
		
		ctrl.error = [];
		var file;
		var files = ctrl.data.files;
		
		for(var i = files.length -1; i >= 0; i--){ 
			
			file = files[i];

			if(file.$error == "maxSize"){

				
				toasty.error(
					{title : "Image Upload Failed", msg :'File "' + file.name + '" could not be uploaded because it is larger than ' + file.$errorParam}
				);
				
				
				files.splice(i, 1);
				
			}else if(file.$error == "pattern"){ 
				
				
				toasty.error(
					{title : "Image Upload Failed", msg :'File "' + file.name + '" could not be uploaded because it is not an image'}
				);
				
				files.splice(i, 1);
				
			}
		}

		if(files != null || files.length != 0){
			ctrl.uploadFiles(files);
		}
    });
    
	
	// Close modal on cancel
    
    ctrl.cancel = close;
    
    // Close modal on 
	
	ctrl.submit = function(){
			
		
		close(ctrl.croppedImage);	

	}
	
	
	// Execute init 
	
	ctrl.fetchImages();
	
	
	
	
}])
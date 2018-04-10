angular.module('imageCropper',[])

.directive('imgManipulator',  [function($compile){
	return {
		restrict: 'E',
	    templateUrl: 'views/partials/image-cropper.html',
		scope:{
			
			aspectRatio:'=?',
			
			// For returning offset percentages  
			offsetX:'=?',
			offsetY:'=?',
			cropWidth:'=?',
			cropHeight:'=?', 
			
			
			imgSrc:'=',
			unsavedChanges: '=?' 
		
		},
			
		transclude: false,
		controller: ['$scope', '$window', '$timeout', function($scope, $window, $timeout){
		

			
			// The crop window
			var cb = $window.document.getElementById("crop-box");
			// The original image behind
			var img = $window.document.getElementById("img-viewer-img");
			// The fade mask
			var fade = $window.document.getElementById("img-viewer-fade"); 
			
			// Crop window dimensions
			var cbHeight; 
			var cbWidth;
			var cbLeft; 
			var cbTop;
			
			
			
			// Image dimensions
			var imageWidth;
			var imageHeight;
			
			// Current offset from parent elem 
			var offset;
			
			// Crop box resize co-ords
			var initialResizeX;
			var initialResizeY;
			var currentResizeX;
			var currentResizeY;
			
			// Crop box creation co-ords
			var initialCreateX;
			var initialCreateY;
			var currentCreateX;
			var currentCreateY;
			
			// Crop box move co-ords
			var initialMoveX;
			var initialMoveY;
			var currentMoveX;
			var currentMoveY;
			
			// Mode specifiers for resize functions
			var currentResizeFunc;
			var currentMode;
			
			// Status check booleans 
			var isCreating = false; 
			var isMoving = false;
			var isResizing = false;
			
			//Global scroll for calculating offsets
			var scrollLeft = ($window.pageXOffset || $window.document.scrollLeft) - ($window.document.clientLeft || 0);
			var scrollTop = ($window.pageYOffset || $window.document.scrollTop)  - ($window.document.clientTop || 0);
			
			
			
			
//////////////////////// Resize Storyline /////////////////////////////
			
			function onResizeStart(e, mode, resizeFunction){ 
				
				
				e.preventDefault();
				e.stopPropagation();
				initialResizeX = e.pageX;
			    initialResizeY = e.pageY;

			    isResizing = true;
			    currentMode = mode;
			    currentResizingFunc = resizeFunction;
			}
		
				
			
			function onResize(e){ 

				e.preventDefault();
				e.stopPropagation();
				currentResizeX = e.pageX;
			    currentResizeY = e.pageY;
			    currentResizingFunc(initialResizeX - currentResizeX, initialResizeY - currentResizeY, currentMode);
			    initialResizeX = currentResizeX;
			    initialResizeY = currentResizeY;
				drawRectangle();
				
			}
			
			function onResizeStop(){ 
				
				isResizing = false;
				
			}
			
			
///////////////////////////// Resize actions /////////////////////////

			var horizontalScaling = function(xDelta, yDelta, mode){
				if(mode === 0){ // Left
					cbWidth += xDelta;
					cbLeft -= xDelta;
				} else { // Right
					cbWidth -= xDelta;
				}

				if(cbWidth < 0){
					cbWidth = 0;
				}


				if(cbLeft < 0){
					cbLeft = 0;
				}

				if(cbWidth + cbLeft > img.offsetWidth){
					cbWidth = img.offsetWidth - cbLeft;
				}


			    if($scope.aspectRatio){

				    if(cbWidth * $scope.aspectRatio + cbTop > img.offsetHeight){
						cbWidth = (img.offsetHeight - cbTop) / $scope.aspectRatio;
					}

			   		cbHeight = cbWidth * $scope.aspectRatio;
				}

			};
			
			var verticalScaling = function(xDelta, yDelta, mode){
				if(mode === 0){ // Top
					cbHeight += yDelta;
					cbTop -= yDelta;
				} else { // Bottom
					cbHeight -= yDelta;
				}

				if(cbHeight < 0){
					cbHeight = 0;
				}

				// Make sure the div doesn't break out of its container.
				if(cbTop < 0){
					
					cbTop = 0;
				}

				if(cbHeight + cbTop > img.offsetHeight){
					cbHeight = img.offsetHeight - cbTop;
					
				}
				
				

				// Make sure that we maintain our ratio
				if($scope.aspectRatio){
					if(cbHeight * $scope.aspectRatio + cbLeft > img.offsetWidth){
						cbHeight = (img.offsetHeight - cbLeft) / (1/$scope.aspectRatio);
					}
					
					if(cbWidth + cbLeft > img.offsetWidth){
						cbWidth = (img.offsetWidth - cbLeft);
						cbHeight = cbWidth * $scope.aspectRatio;
					
					}else{
						
						cbWidth = cbHeight * (1/$scope.aspectRatio);
						
					}

			   		
				}
			};


			// Origin starts at top-left and rotates clockwise.
			var diagonalScaling = function(xDelta, yDelta, mode){
				if(mode === 0){ // Top-left
					horizontalScaling(xDelta, yDelta, 0);
					verticalScaling(xDelta, yDelta, 0);
				} else if(mode === 1){ // Top-right
					verticalScaling(xDelta, yDelta, 0);

					if(!$scope.aspectRatio){
						horizontalScaling(xDelta, yDelta, 1);
					}
				} else if (mode === 2) { // Bottom-right
					verticalScaling(xDelta, yDelta, 1);

					if(!$scope.aspectRatio){
						horizontalScaling(xDelta, yDelta, 1);
					}
				} else if(mode === 3){ // Bottom-left
					horizontalScaling(xDelta, yDelta, 0);
				
					if(!$scope.aspectRatio){
						verticalScaling(xDelta, yDelta, 1);
					}
				}

				drawRectangle();
			};
			
//////////////////////////// Move Storyline ///////////////////////////
			
			function onMoveStart(e){ 
				e.preventDefault();
				e.stopPropagation();
				isMoving = true;
			    initialMoveX = e.pageX;
			    initialMoveY = e.pageY;
			
			}
			
			function onMove(e){
				
				currentMoveX = e.pageX;
			    currentMoveY = e.pageY;
			    
			    move(initialMoveX - currentMoveX, initialMoveY - currentMoveY);
			    
			   	initialMoveX = currentMoveX;
			    initialMoveY = currentMoveY;
			    
			    drawRectangle();
			}
			
			function onMoveStop(){ 
			
				isMoving = false;
			
			}
		
///////////////////////// Move Actions //////////////////////////
			
			var move = function(xDelta, yDelta){

				if(cbLeft - xDelta > 0 && cbLeft - xDelta + cbWidth < img.offsetWidth){
					cbLeft -= xDelta;
				} else if(cbLeft - xDelta < 0){
					cbLeft = 0;
				} else if(cbLeft - xDelta + cbWidth > img.offsetWidth){
					cbLeft = img.offsetWidth - cbWidth;
				}

				if(cbTop - yDelta > 0 && cbTop - yDelta + cbHeight < img.offsetHeight){
					cbTop -= yDelta;
				} else if(cbTop - yDelta < 0){
					cbTop = 0;
				} else if(cbTop - yDelta + cbHeight > img.offsetHeight){
					cbTop = img.offsetHeight - cbHeight;
				}
			};
			
///////////////////////// Helper Functions //////////////////////////			
					
			function resetInteractions(){
		        isMoving = false;
		        isCreating = false;				
			}
			
			
			var onMouseUpFunction = function(e){
				initialMoveX = 0;
				initialMoveY = 0; 
				e.preventDefault();
				resetInteractions();

				if(isResizing){
					onResizeStop();
				}
			};

///////////////////////// Calculation Functions //////////////////////////

			
			var calculateCurrentCreateX = function(e){
				if(scrollLeft){ 
					currentCreateX = e.pageX - offset.left - scrollLeft;
					
				}else{    
					currentCreateX = e.pageX - offset.left;
				}
			
			};

			var calculateCurrentCreateY = function(e){
				
				
				if(scrollTop){ 
					currentCreateY = e.pageY - offset.top - scrollTop;
					
				}else{    
					currentCreateY = e.pageY - offset.top;
				}

		
			};
			
			function calculateRectangleDimensions(mouseX, mouseY, oldMouseX, oldMouseY){
				var tempHolder; 
				var width;
				var height;

				if(mouseX < oldMouseX){
					tempHolder = mouseX;
					mouseX = oldMouseX;
					oldMouseX = tempHolder;
				} 

				if(mouseY < oldMouseY){
					tempHolder = mouseY;
					mouseY = oldMouseY;
					oldMouseY = tempHolder;
				} 

				width = mouseX - oldMouseX;

				// Figure out if enforcing the aspect ratio any further than we already have would
				// break the crop out of the parent div.
				if($scope.aspectRatio){
					if(width * $scope.aspectRatio + oldMouseY > img.offsetHeight){
						width = (img.offsetHeight - oldMouseY) / $scope.aspectRatio;
					}
				}

			    if($scope.aspectRatio){
			   		height = width * $scope.aspectRatio;
				} else {
					height = mouseY - oldMouseY;
				}


				oldMouseY += dragCorrectionY;
				oldMouseX += dragCorrectionX;


				if(oldMouseX + width > img.offsetWidth){
					oldMouseX = img.offsetWidth - width;
				}

				if(oldMouseY + height > img.offsetHeight){
					oldMouseY = img.offsetHeight - height;
				}

				// Prevent crop-box from leaving the boundaries of the div. Snap
				// to the closest edge if outside of element. 
				if(oldMouseX < 0){
					oldMouseX = 0;
					dragCorrectionX = 0;
				}

				if(oldMouseY < 0){
					oldMouseY = 0;
					dragCorrectionY = 0;
				}

				cbLeft = oldMouseX;
				cbTop = oldMouseY;
				cbWidth = width;
				cbHeight = height;
			}
			
			var calculateScroll = function(){
			    scrollLeft = ($window.pageXOffset || $window.document.scrollLeft) - ($window.document.clientLeft || 0);
			    scrollTop = ($window.pageYOffset || $window.document.scrollTop)  - ($window.document.clientTop || 0);
			};
			
			
			function resetRect(){ 
				
				imageWidth = img.offsetWidth;
				imageHeight = img.offsetHeight;
				
				
				cbWidth = imageWidth * 0.8; 
				
				if($scope.aspectRatio){ 
					cbHeight = cbWidth * $scope.aspectRatio;
				}else{ 
					
					cbHeight = cbWidth * 0.8;
				}
				
				cbTop = (imageHeight - cbHeight)/2;
				cbLeft = (imageWidth - cbWidth)/2;
					
				
				drawRectangle();
			}
			
///////////////////////// Bind Events //////////////////////////
				

			// Diagonal scaling handles (Clockwise from top left)
			$window.document.getElementById("handles-top-left").addEventListener("mousedown", function(e){
				onResizeStart(e, 0, diagonalScaling);
			});

			$window.document.getElementById("handles-top-right").addEventListener("mousedown", function(e){
				onResizeStart(e, 1, diagonalScaling);
			});

			$window.document.getElementById("handles-bottom-right").addEventListener("mousedown", function(e){
				onResizeStart(e, 2, diagonalScaling);
			});

			$window.document.getElementById("handles-bottom-left").addEventListener("mousedown", function(e){
				onResizeStart(e, 3, diagonalScaling);
			});



			// Horizontal Scaling handles and bounds
			$window.document.getElementById("handles-middle-left").addEventListener("mousedown", function(e){
				onResizeStart(e, 0, horizontalScaling);
			});

			$window.document.getElementById("bounds-left").addEventListener("mousedown", function(e){
				onResizeStart(e, 0, horizontalScaling);
			});

			$window.document.getElementById("handles-middle-right").addEventListener("mousedown", function(e){
				onResizeStart(e, 1, horizontalScaling);
			});

			$window.document.getElementById("bounds-right").addEventListener("mousedown", function(e){
				onResizeStart(e, 1, horizontalScaling);
			});



			// Vertical Scaling handles and bounds
			$window.document.getElementById("handles-top-center").addEventListener("mousedown", function(e){
				onResizeStart(e, 0, verticalScaling);
			});

			$window.document.getElementById("bounds-top").addEventListener("mousedown", function(e){
				onResizeStart(e, 0, verticalScaling);
			});

			$window.document.getElementById("handles-bottom-center").addEventListener("mousedown", function(e){
				onResizeStart(e, 1, verticalScaling);
			});

			$window.document.getElementById("bounds-bottom").addEventListener("mousedown", function(e){
				onResizeStart(e, 1, verticalScaling);
			});
				
				
			// Fade event handlers
			
			fade.addEventListener("mousedown", function(e){
		        e.preventDefault();
				isCreating = true;
		

			    // All coordinates are relative to the parent container
			    offset = this.getBoundingClientRect();
			    
			    if(scrollLeft){ 
					initialCreateX = e.pageX - offset.left - scrollLeft;
					
				}else{    
					initialCreateX = e.pageX - offset.left;
				}
			   
				
				if(scrollTop){ 
					initialCreateY = e.pageY - offset.top - scrollTop;
					
				}else{    
					initialCreateY = e.pageY - offset.top;
				}
	

			});

			
			fade.addEventListener("mousemove", function(e){
				if(isMoving){
					onMove(e);
				}
				if(isCreating){
				    offset = this.getBoundingClientRect();
					calculateCurrentCreateX(e);
					calculateCurrentCreateY(e);

				    dragCorrectionX = 0;
				    dragCorrectionY = 0;
				   	calculateRectangleDimensions(currentCreateX, currentCreateY, initialCreateX, initialCreateY);
				   	drawRectangle();
			   }

			   if(isResizing){
			   		onResize(e);
			   }
			});
			
			
			fade.addEventListener("mouseup", function(){
 				resetInteractions();
			});
			
			
			
			fade.addEventListener("mouseout", function(e){
				if(isCreating){
				    offset = this.getBoundingClientRect();
					calculateCurrentCreateX(e);

				    if(currentCreateX > imageWidth){
				    	currentCreateX = img.offsetWidth;
				    } else if(currentCreateX < 0){
				    	currentCreateX = 0;
				    }
					calculateCurrentCreateY(e);

				    if(currentCreateY < 0){
				    	currentCreateY = 0;
				    }


				   calculateRectangleDimensions(currentCreateX, currentCreateY, initialCreateX, initialCreateY);
				   drawRectangle();
				}
			});			
			
			
			
			
			img.onload = function(){
		

				resetRect();
				
			};
			
			
			// On window resize event			
			angular.element($window).on('resize', resetRect);
			$scope.$on("$destroy", function() {
				angular.element($window).off('resize', resetRect);
			});
			

			
			// On window scroll event			
			angular.element($window).on('scroll', calculateScroll);
			$scope.$on("$destroy", function() {
				angular.element($window).off('scroll', calculateScroll);
			});
			
			// Catch mouseup if outside of image area 
			angular.element($window).on('mouseup', onMouseUpFunction);
			$scope.$on("$destroy", function() {
				angular.element($window).off('scroll', onMouseUpFunction);
			});
			
			
			// Crop selection grid events
			
			cb.addEventListener("mousedown", function(e){
		        onMoveStart(e);
			});
			
			cb.addEventListener("mousemove", function(e){
				e.preventDefault();
				if(isCreating){
				    offset = fade.getBoundingClientRect();
					calculateCurrentCreateX(e);
					calculateCurrentCreateY(e);

				   	calculateRectangleDimensions(currentCreateX, currentCreateY, initialCreateX, initialCreateY);
				   	drawRectangle();
			  	}

				if(isMoving){
					onMove(e);
				}

				if(isResizing){
					onResize(e);
				}
			});
			
			
			cb.addEventListener("mouseup", function(e){
				initialMoveX = 0;
				initialMoveY = 0; 
				e.preventDefault();
				resetInteractions();
			});
			
/////////////////////// Watches ///////////////////////////
			
			
			
			$scope.$watch("aspectRatio", function(newValue, oldValue){
		
					horizontalScaling(0,0,0);
					drawRectangle();
			});
			
			
		
			
			
			
			
//////////////////////// Draw functions 			
			

			//Re-draws crop box rectangle
			function drawRectangle(){
				
				cb.style.backgroundPosition =  "-"+(cbLeft +1)+"px" + " -"+(cbTop +1)+"px";
				cb.style.backgroundSize = img.offsetWidth+"px";
				cb.style.backgroundRepeat = "no-repeat";
		
				// Set the top and left position of the div. 
				cb.style.left = cbLeft +"px";
				cb.style.top = cbTop +"px";
		
				// Set Div Height and Width
				cb.style.width = cbWidth  + "px";
				cb.style.height = cbHeight + "px";
				
			
				// Update scope vals
				$timeout(function(){

					$scope.offsetX = cb.offsetLeft / img.offsetWidth * 100;
					$scope.offsetY = cb.offsetTop / img.offsetHeight * 100;
					$scope.cropWidth = cb.offsetWidth / img.offsetWidth * 100;
					$scope.cropHeight = cb.offsetHeight / img.offsetHeight * 100;
					$scope.unsavedChanges = true;
				});
				
			
			}
			
			
		}]
	}
}]); 
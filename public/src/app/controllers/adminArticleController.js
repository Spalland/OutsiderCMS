angular.module('adminArticleCtrl', ['ui.tinymce'])


.controller('adminArticleController',  ['Article', 
										'Category',
										'Activity', 
										'Auth', 
										'$location', 
										'action',
										'$routeParams',
										'Modal',
										'Image',
										'$http',
										'toasty',
										'$filter',
										function(	Article, 
													Category,
													Activity, 
													Auth, 
													$location, 
													action,
													$routeParams,
													Modal,
													Image,
													$http,
													toasty,
													$filter
					
										){ 
	
	var ctrl = this;
	ctrl.error = [];
	
	ctrl.opened = false; 
	ctrl.filters = {};
	ctrl.filters.published = true;
		
	ctrl.action = action;
	ctrl.saveMessage = "Save Changes";
	ctrl.dateFormat = "dd/MM/yyyy";
	ctrl.tinymceOptions = {
		plugins: "link",
		toolbar: 'undo redo | styleselect | bold italic underline strikethrough | alignleft aligncenter alignright | link',
		content_css: "/dist/css/tinystyles.min.css",
		menubar: false
		
	};
	ctrl.userRole = Auth.getUser().role;
	
	// Slug variables
	// Boolean holds current state of reservation
	// String holds currently verified string for comparrison
	ctrl.slugIsReserved = false;
	ctrl.reservedSlug = "";
	
	
	//Datepicker Toggle
	ctrl.open = function(){ 
	
		
		if (ctrl.opened == false){ 
			
			ctrl.opened = true;
		}else{ 
			
			ctrl.opened = false;
		}
	
	}
	

	
	
	//Generate slug from title, checks for uniqueness in the database
	
	ctrl.genslug = function(callback){ 
		
		
	
		if(ctrl.slugIsReserved == true){ 
			
			return;
		}
		
		var slug = ""
		
		if(ctrl.article.slug == "" || ctrl.article.slug == undefined){ 
			
			if(ctrl.article.title == "" || ctrl.article.title == undefined){
				
				ctrl.article.title = "Untitled Draft"/*  + new Date(year, month, day) */ ;
				
				slug = Math.random().toString(36).substring(7);
				
			
			}else{ 
				
				slug = ctrl.article.title.toLowerCase().replace(/ /g,'-').replace(/[^\w-]+/g,'');
				
			}
		}else{ 
			
			slug = ctrl.article.slug.toLowerCase().replace(/ /g,'-').replace(/[^\w-]+/g,'');
			
		}
			
			
		Article.reserveSlug(slug).
		then(function(response){ 
			
			ctrl.article.slug = response.data.data;
			ctrl.reservedSlug = response.data.data;
			ctrl.slugIsReserved = true;
			
			if(callback !== undefined){ 
				
				callback();
			}
			
		});
			
		
	}
	
	ctrl.unReserve = function(){ 
		
		ctrl.slugIsReserved = false;
		
	}
	
	ctrl.stillReserved = function(){ 
		
	
		if(ctrl.article.slug == ctrl.reservedSlug){ 
			
			ctrl.slugIsReserved = true;
		
		}
		
		
	}
	
	
	ctrl.hasError = function(field){ 
		
		for(var l = 0; l < ctrl.error.length; l++){ 
			
			if(ctrl.error[l].field === field){ 
				return "validation-error";
			}
		}
		
		return "";
		
	}
	
	
	

	ctrl.canModify = function(){ 
		
		var status = ctrl.article.status;	

		if(status === "Draft"){

			return true;
			
		}else if(status === "Submitted" && (Auth.hasRole("Editor") || Auth.hasRole("Reviewer"))){ 

			return true;
		    
		}else if((status === "Approved" || status === "Published" || status || 'Rejected') && Auth.hasRole("Editor")){ 
			
			return true; 
		
		}else{ 
	
			return false;
			
		}
		
	}
	
	
	ctrl.workflowMessage = function(){ 
		
		var status = ctrl.article.status;
		
		switch(status){ 
			
			case "Draft": 
			
				return "Write something awesome then submit when you are done! Don't forget save";
				
				break;
				 
			case "Submitted":
			
				return "Your article has been submitted for approval, you will be notified when a decision has been made";
				break;
				 
			case "Approved": 
			
				return "Congratulations! Your article is waiting to be scheduled for publishing";
				break;
				
			case "Rejected":
			
				return "Unfortunately your article has been deemed unsuitable for Outsider.guide. This will be deleted automatically soon"
				break;
				 
			case "Deleted":
			
				return "Your article is in the bin....did you mean to do this? Click below to retreive it";
				break;
				
			case "Published":
				
				if(ctrl.article.publish_date){ 
					var date; 	
					console.log()
					var pd = ctrl.article.publish_date
					var t = pd.split("T");
					var d = t[0] + "T" + t[1].substring(t[1].length, -1);
					var d1 = new Date(d);
					var d2 = new Date();
						
					if (+d1 > +d2) {
					    					
					    					
						date = "Your article will be published on "  + $filter('date')(pd, "dd/MM/yy") + " @ " +  $filter('date')(pd, "hh:mm") + ". Exciting Times!";
						
					}else{
						
						date = "This article is already published and being read by the world";
					}
					
				}else{ 
					date = "Your article has been published it will appear on the site soon";
				}
					
				return date;
				break;
					
			default:
			
				return "Something wen't wrong";
				break;
			
		}
		
	}
	

	
	
	
	ctrl.setStatus = function(status){ 
	
		switch(status){ 
			
			case "Submitted":
			
				Article.update(ctrl.article.id, {status: "Submitted"})
				.then(function(response){

					var data = response.data;
					
					if(data.success === true){ 
						ctrl.article.status = data.data.status;
						toasty.success({title: 'Submit Successful', msg: "You have successfully submitted your article for approval"});
						
					}else{ 
						
						toasty.error({title: "Submit Failed", msg: data.error});
					}
					
				});
			
			break;
			
			case "Rejected": 
			
			
				Article.update(ctrl.article.id, {status: "Rejected"})
				.then(function(response){
					
					var data = response.data;
					
					if(data.success === true){ 
						ctrl.article.status = data.data.status;
						toasty.success({title: 'Reject Succesful', msg: "You have successfully rejected this article"});
					}else{ 
						toasty.error({title: "Reject Failed", msg: data.error});	
					}
					
				});
			
			
			
			break; 
			
			case "Approved": 
			
				
			
				Article.update(ctrl.article.id, {status: "Approved"})
				.then(function(response){
					
					var data = response.data;
					
					if(data.success === true){ 
						ctrl.article.status = data.data.status;
						toasty.success({title: 'Approval Succesful', msg: "You have successfully approved this article"});
					}else{ 
						toasty.error({title: "Approval Failed", msg: data.error});	
					}
				
					
				});
			
			break;
			
			
			case "Published":
			
				var publish_date;
				
				if(!ctrl.article.publish_date){ 
					
					publish_date = new Date();
					
				}else{ 
					
					publish_date = ctrl.article.publish_date
				}
				
				if(!ctrl.article.image_id){ 
					
					
					toasty.error({title: 'Main article image error', msg: "You must supply an image to publish an article"});
					break;
				}
				
				ctrl.article.status = "Published";
				ctrl.article.publisher_id = Auth.getUser().id;
				ctrl.article.publish_date = publish_date;
			
			
				Article.update(ctrl.article.id, ctrl.article)
				.then(function(response){
					
					var data = response.data;
					
					if(data.success === true){ 

						var date; 
						
						var t = data.data.publish_date.split("T");
						var d = t[0] + "T" + t[1].substring(t[1].length, -1);
						var d1 = new Date(d);
						var d2 = new Date();
						
						if (+d1 > +d2) {
						    					
						    					
							date = $filter('date')(data.data.publish_date, "dd/MM/yy") + " @ " +  $filter('date')(data.data.publish_date, "hh:mm");
							
						}else{
							
							date = "now"
						}
					
						toasty.success({title: 'Publish Succesful', msg: "You have successfully published this article it will be visible from " + date});
						ctrl.workflowMessage();
							
					}else{ 
						
						toasty.error({title: "Approval Failed", msg: data.error});
							
					}
					
				});
					
			 
				
			break;
			
			default: 
			
			break; 
			
		}	
		
	}
	
	ctrl.deleteArticle = function(id){ 
		
		Article.delete(id);
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
					ctrl.article[model] = result.id;
				
					
					Image.getCrop(result.id)
					.then(function(response){ 
						
						
						ctrl.currentImage = response.data.data.filename;
						
						
					});
				
				}
			});
    	});
	}
	
	ctrl.verifyVideo = function(){ 
		
		ctrl.error = [];
		
		
		var url = ctrl.article.video;
		//Check for full url
	
		
		if (url.match('http(s)://(www.)?youtube|youtu\.be')) {
		    if (url.match('embed')) { youtube_id = url.split(/embed\//)[1].split('"')[0]; }
		    else { youtube_id = url.split(/v\/|v=|youtu\.be\//)[1].split(/[?&]/)[0]; }
		    
		    
		    $http.get('https://www.googleapis.com/youtube/v3/videos?part=id&id=' + youtube_id  + '&key=AIzaSyAyOpvqABdaK08wf939RMHhMTBpKJSZ36s').then(function(res){ 
			    
			   if(res.data.pageInfo.totalResults == 1){ 
				   ctrl.article.video = youtube_id;
				   ctrl.inputDisabled = true;
			   }else{ 
				   
				   ctrl.error.push({field:'video', message:'Video could not be found on youtube'});
				   toasty.error({title: 'Video Selection Error', msg: 'Video could not be found on youtube'});
			   }
			   
		    });
		    
		    
		}
		
		
		else {  
			ctrl.article.video = undefined;
			ctrl.inputDisabled = false;
			ctrl.error.push({'field':'video', 'message':'Invalid link supplied, Please supply a full YouTube link'});
			toasty.error({title: 'Video Selection Error', msg: 'Invalid link supplied, Please supply a <strong>full</strong> YouTube link'});
		}
	
	
	}

	
	ctrl.clearVideo = function(){ 
		ctrl.inputDisabled = false;
		ctrl.article.video = undefined;

		
	}
	
/////////////////////////////////////////
// ------------- INIT -----------------//
/////////////////////////////////////////
	
	
	ctrl.initIndex = function(){
		
	
		
		ctrl.article = {};
	
		ctrl.article.slug = ""; 
		ctrl.initCategories();
		ctrl.initActivities();
	
		Article.all().then(function(response){ 
			
			console.log(response);
			ctrl.articles = response.data.data;
			
		});
		
	};
	
	
	ctrl.initCreate = function(){
		
		ctrl.article = {};
		ctrl.article.status = "Draft";
		ctrl.article.slug = ""; 
		
		ctrl.initCategories();
		ctrl.initActivities();
	};
	
	
	//Init for edit function
	
	ctrl.initEdit = function(){
		
		
		ctrl.article = {};

		
		ctrl.initCategories();
		ctrl.initActivities();

		var id = $routeParams.id 

		
		Article.get(id)
		.then(function(response){ 
			
			ctrl.article = response.data.data;


			var slug = ctrl.article.slug

			if(slug != null || slug != undefined || slug != ""){ 
				
				
				ctrl.slugIsReserved = true;
				
			}
			
			if(ctrl.article.video){
				
				ctrl.inputDisabled = true;
			}
			
			
			if(ctrl.article.image_id){
				Image.getCrop(ctrl.article.image_id)
				.then(function(response){ 
							
		
					ctrl.currentImage = response.data.data.filename;
				
							
				});
			}
				
		});	
		
	}
	
	ctrl.initCategories = function(){
		Category.all()
		.then(function(response){ 
			
			ctrl.categories = response.data.data;
			ctrl.article.category = ctrl.categories[0].id;
		
		});
	}
	
	ctrl.initActivities = function(){
		Activity.all()
		.then(function(response){ 
			
		
			ctrl.activities = response.data.data;
			ctrl.article.activity = ctrl.activities[0].id;
		
		});
	}
	
/////////////////////////////////////////
// ------------ SUBMIT --------------- //
/////////////////////////////////////////


	ctrl.createArticle = function(){ 
		
		Article.create(ctrl.article)
		.then(function(response){ 
			
			var data = response.data;
			
			if(data.success){ 
				
				
				toasty.success({title:"Article Saved", msg: "Your article is now saved", sticky:true});
				$location.path('/admin/articles/edit/' + data.data.id);
				
				
			}else{ 
				
				console.log(response);
				toasty.error({title: "Article Save Failed", msg: data.error });
				
			}
	
		});

		
	}
	
	
	ctrl.updateArticle = function(){ 
		
		
		Article.update(ctrl.article.id, ctrl.article)
		.then(function(response){ 
		
			var data = response.data;
			if(data.success){ 
				
				toasty.success({title:"Article Saved", msg: "Your article is now saved", sticky:true});
				ctrl.article.updatedAt = data.data.updatedAt;
				
			}else{ 
				
				
				toasty.error({title: "Article Save Failed", msg: data.error });
				
			}
			
		})
		
		
	}
	
	
	ctrl.submitArticle = function(){ 
		
		if(action == "create"){ 
			
			if(ctrl.slugIsReserved == true){
				
					
				ctrl.createArticle();
					
				
			}else{ 
				
				ctrl.genslug(ctrl.createArticle);
			
			}
				

		}else if(action == "edit"){
			
			
			if(ctrl.slugIsReserved == true){
				
					
				ctrl.updateArticle();
					
				
			}else{ 
				
				ctrl.genslug(ctrl.updateArticle);
			
			}
			
		}

		
		
	}; 	
	
	
/////////////////////////////////////////
// ------------ Filters -------------- //
/////////////////////////////////////////
	
	ctrl.hidePublished = function(story){ 
	
	
		if(ctrl.filters.published){ 
			
			return true;
			
		}else{
			
			if(story.publish_date != null){
				return false;
			}else{ 
				return true;
			}
		}
	}		
	
	ctrl.change = function(){ 
		
		
	}	
	
	
/////////////////////////////////////////
// ------------ RUN INIT ------------- //
/////////////////////////////////////////
	
	
	switch(action){ 
		
		case "index":  
		
			ctrl.initIndex();
			
		break; 
		
		case "create": 	
		
			ctrl.initCreate();
		
		break;
		
		case "edit": 
		
			ctrl.initEdit();
		
		break;
	}
				
				
				
	

	
	
}]);


angular.module('commentsDirective', [])
.directive('comments', ['Comment',function(Comment) {
  return {
    restrict: 'E',
    transclude: true,
    scope: {
	    articleId: '='
    },
    templateUrl: 'views/partials/comments.html',
    controllerAs : "c",
    controller: ['$scope' , 'Auth', 'toasty', function($scope, Auth, toasty){ 
	    
	    var ctrl = this;
	    ctrl.comment = {};
	    ctrl.comments = [];
	    ctrl.error = [];
	    ctrl.replyBoxActive = false;
	    ctrl.activeUser = Auth.isLoggedIn ? Auth.getUser() ? Auth.getUser().id : null : null;
	    ctrl.flagBoxActive = false;
		
	    if($scope.articleId !== undefined){
	    
		    Comment.getArticleComments($scope.articleId)
		    .then(function(res){ 
			    
			    console.log(res.data.data);
			    ctrl.comments = res.data.data;
	
		    });
	    
	    }
	    
	    ctrl.postComment = function(){ 
		    
		    ctrl.comment.article_id = $scope.articleId
		    ctrl.comment.depth = 0;
		    
		    Comment.create(ctrl.comment)
		    .then(function(res){ 
			   
			   console.log(res.data.data);
			   if(res.data.success){ 
					
					ctrl.comments.push(res.data.data);
					ctrl.comment = {};    
				   
			   }else{ 
				   
				   ctrl.error.push({message: "Couldn't post message"});
			   }
			    
		    });
	    }
	    
	    
	    ctrl.createReply = function(index){ 
		    
		    ctrl.closeForms();
		    
		    ctrl.comments[index].isReplying = true;
		    ctrl.replyBoxActive = true;
		    
	    }
	    
	    ctrl.createFlag = function(index){ 
		    
		    ctrl.closeForms();
		    
		    ctrl.comments[index].isFlagging = true;
		    
	    }
	    
	    ctrl.openConfirmDelete = function(index){ 
		    
		    ctrl.closeForms();
		    
		    ctrl.comments[index].isDeleting = true;
		    
	    }
	    
	    ctrl.closeForms = function(){
		    
		    for(var i = 0; i < ctrl.comments.length; i++){ 
			    
			    ctrl.comments[i].isReplying = false;
			    ctrl.comments[i].isFlagging = false;
			    ctrl.comments[i].isDeleting = false;
			    
		    }
		    
		    ctrl.replyBoxActive = false;
		    
	    }
	    
	    ctrl.postReply = function(reply_to, index){
		    
		
		    ctrl.comment.article_id = $scope.articleId;
		    ctrl.comment.reply_to = reply_to;
		    var depth = ctrl.comments[index].depth || 0; 
		    ctrl.comment.depth = depth + 1;
		    
		    
		    Comment.create(ctrl.comment)
		    .then(function(res){ 
			   


			   if(res.data.success){ 
			
					
					
					if(index === ctrl.comments.length -1){ 
							
							ctrl.comments.splice(index + 1, 0, res.data.data);
							ctrl.comment = {};
							ctrl.comments[index].isReplying = false;
							ctrl.replyBoxActive = false;
							
							
					}else{ 
					
						for(var j = index + 1; j < ctrl.comments.length; j++){ 
						
							
							
							
							
							if(ctrl.comments[j].depth <= depth){ 
								
								ctrl.comments.splice(j, 0, res.data.data);
								ctrl.comment = {};
								ctrl.comments[index].isReplying = false;
								ctrl.replyBoxActive = false;
								
								break;
							}
							
						}
					}
		
				   
			   }else{ 
				   
				   ctrl.error.push({message: "Couldn't post message"});
			   }

			    
		    });
	    }
	    
	    ctrl.flagComment = function(index){ 
		    
		    
		    var comment = ctrl.comments[index]

			var data = {
				commentData : comment,
				flagData : { 
					reason : ctrl.comment.reason
				}
			
			}
			    
	    	Comment.flag(comment.id, data).then(function(response){
		    	
		    	
		    	var data = response.data;
		    	
		    	if(data.success){
			    	
			    	toasty.success({title : "Message Flagged", msg : "We have received your request to have this comment reviewed"});
			    	 
		    		ctrl.comments[index].body = data.body;
		    		ctrl.comments[index].status = data.status;
		    		
		    	}else{ 
			    	
			    	console.log(response);
			    	toasty.error({title : "Signup failed", msg : data.error});
			    	
		    	}
		    	
		    	ctrl.closeForms();
		    	
		    	
	    	});
			
		    		    
		    
	    }
	    
	    
	    ctrl.deleteComment = function(index){ 
		    
		    var comment = ctrl.comments[index];
		    var commentId = comment.id;
		    
		    Comment.delete(commentId);
		    
		    comment.body = "This comment has been deleted";
		    comment.status = 'deleted';
		    
		    ctrl.closeForms();
		    
	    }
	    
	    
    }]
  };
}]);
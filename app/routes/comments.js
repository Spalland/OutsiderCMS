////////////////////////////////////
// ------- Require Modules ------ //
////////////////////////////////////

var express = require('express');
var router 	= express.Router(); 
var db 		= require('../models/index');
var mw 		= require('./middleware.js');
	
////////////////////////////////////
// ------- Declare Routes ------- //
////////////////////////////////////


// Fetch all Comments 

router.get('/', function(req, res){	

	db.Comment.findAll()
	
	.then(function(data){ 
		return res.json({
			success	: true,	
			data	: data
		});
		
		
	});
	
});

// Fetch a single Comment by ID

router.get('/:id', function(req, res){	
	
				
});


router.get('/article/:id', function(req, res){
	
	var articleId = req.params.id;
	
	db.sequelize.query('SELECT C.id, C.body, C.commenter_id, C."createdAt", C.status, C.depth, C.timesflagged, C.reply_to, C.status, U.first_name, U.last_name, coalesce(U.username, CAST(U.id AS VARCHAR)) AS username FROM "Comments" C LEFT JOIN "Users" U ON C.commenter_id = U.id WHERE C.article_id = \'' + articleId + '\' ORDER BY C."createdAt" DESC')
	
	.then(function(data){

		// Initialise 
		
		var comments = data[0];
		var topLevelComments = [];
		var commentsByReplyToValue = {}; 
		var commentsSorted = [];
		
		// Split 
		
		for(var i = comments.length -1; i >= 0; i--){ 
			
			
			
			if(comments[i].reply_to == null){ 
				
				topLevelComments.push(comments.splice(i,1)[0]); 
			}
			
			
		}
		
		for(var j = comments.length -1; j >= 0; j--){ 
			
			var currentReplyTo = comments[j].reply_to;
				
			
			if(commentsByReplyToValue.hasOwnProperty(currentReplyTo)){ 
				
				commentsByReplyToValue[currentReplyTo].push(comments.splice(i,1)[0]);
				
			}else{ 
				
				commentsByReplyToValue[currentReplyTo] = [];
				commentsByReplyToValue[currentReplyTo].push(comments.splice(i,1)[0]);
				
			}
			
		}
		
		
		// Sort Top Levels 
		
		sortByDateAsc(topLevelComments);
		
		
		// Sort Lower Levels
		
		
		var replyToKey, obj, prop, owns = Object.prototype.hasOwnProperty;

		for (replyToKey in commentsByReplyToValue ) {
		
		    if (owns.call(commentsByReplyToValue, replyToKey)) {
		
		        sortByDateDesc(commentsByReplyToValue[replyToKey]);
		
		    }
		
		}
		
		
		//Join together 
		
		findChildren(topLevelComments, commentsByReplyToValue, commentsSorted); 
		
		
		
		
		
		return res.json({
			success	: true,	
			data	: sensorComments(commentsSorted)
		});
		
		
	});
	
	
});




function findChildren(parents, children, list){ 
	    
	
	for(var l = 0; l < parents.length; l++ ){ 
		
		list.push(parents[l]);
	
		var replyToKey = parents[l].id;
		var obj;
		var prop;
		var owns = Object.prototype.hasOwnProperty;
		var child;

		if(replyToKey in children){
			
			child = children[replyToKey];
			
			for(var q = 0; q < child.length; q++){ 
				
				child[q].inReplyToUser = parents[l].username || parents[l].first_name;
				child[q].inReplyToId = parents[l].username || parents[l].commenter_id;
				
			}
			
			findChildren(child, children, list); 

		}
	}
	
}
	


function sortByDateAsc(array){ 
	
	array.sort(function(a, b) {
    	a = new Date(a.dateModified);
		b = new Date(b.dateModified);
		return a>b ? -1 : a<b ? 1 : 0;
	});
	
}


function sortByDateDesc(array){ 
	
	array.sort(function(a, b) {
    	a = new Date(a.dateModified);
		b = new Date(b.dateModified);
		return a<b ? -1 : a>b ? 1 : 0;
	});
	
}

function sensorComments(array){ 
	
	for(var c = 0; c < array.length; c++){ 
		
		if(array[c].status === 'deleted'){ 
			
			array[c].body = "This comment was deleted by the user";
			
		}else if(array[c].status === 'flagged'){ 
			
			array[c].body = "This comment has been flagged and is awaiting review";
			
		}
		
	}
	
	return array;
	
}





// Create a new Comment
		
router.post('/', mw.isAuthenticated('User'), mw.isVerified(),  function(req, res){

	
	db.Comment.create({ 
		commenter_id: req.user.id, 
		body 		: req.body.body, 
		article_id	: req.body.article_id,
		reply_to	: req.body.reply_to,
		depth		: req.body.depth
	}).then(function(data){
		
		
		data.dataValues.first_name = req.user.first_name;
		data.dataValues.last_name = req.user.last_name;
		data.dataValues.username = req.user.username || req.user.id;
		
		return res.json({
			success	: true,	
			data	: data
		});
		
		
	}); 
		
});
	
// Update Comment
	
router.put('/flag/:id', mw.isAuthenticated('User'), mw.isVerified(), function(req, res){ 
	
	
	var id = req.params.id;	
	var flagData = req.body.flagData;
	var commentData = req.body.commentData; 
	

	
	//Check whether comment has been flagged by the user already
	
	db.CommentFlag.count({ 
		
		where: { 
			flagger_id : req.user.id,
			comment_id : commentData.id,
			active : true
		}
	}).then(function(data){ 
		
	
		
		if(data > 0){ 
			
			return res.json({	
				success	: false,
				error	: [{message: "You have alreay flagged this comment for review"}]
			});
			
		}else{ 

			db.Comment.findOne({
				where: { 
					id : commentData.id
				}
			})
			.then(function(comment){

				
				if(comment.timesflagged < 2){
					
					
					db.CommentFlag.create({
						flagger_id : req.user.id,
						comment_id : commentData.id,
						reason : flagData.reason
						
					}).then(function(flagRecord){ 
						
						
						
						
						
						comment.increment('timesflagged')
						.then(function(commentUpdated){ 
							
							
							var sensoredComment = sensorComments([commentUpdated])[0];
							
							
							
							return res.json({ 
				
								success : true,
								data	: sensoredComment,
								message : "Comment Flagged Successfully"
				
							});
							
							
						});
						
						
						
					});
					
					

					
				}else{ 
					
					return res.json({ 
				
						success : false,
						error	: [{message: "Comment already flagged for review"}]
				
					});
						
				}
				
								
			});
			
		}
		
	});
			
});

// Delete Comment 

router.delete('/:id', function(req, res){ 
		
	var id = req.params.id;	
		
	db.Comment.findOne({
	
		where: {
			id: id 
		}
		
	})
	.then(function(comment){
		
		if(!comment){ 
			return res.json({	
				success	: false,
				error	: [{message: "Comment not found"}]
			});
		}
		
		
		comment.updateAttributes({
			
			status : "deleted"
		})
		.then(function(data){ 
		
			return res.json({ 
				
				success : true,
				data	: data,
				message : "Comment Deleted Successfully"
				
			});
			
		});
	});	
				
});



////////////////////////////////////
// -------- Export Module ------- //
////////////////////////////////////


module.exports = router;







	
	











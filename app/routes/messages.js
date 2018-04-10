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


// Fetch all Messages 

router.get('/', function(req, res){	


});

// Fetch a single Article by ID

router.get('/:id', function(req, res){	
	
				
});

// Create a new Category
		
router.post('/contact', function(req, res){
	
	var data = req.body;
	
	var header = "Name: " + data.fname + " " + data.lname + "\n" + "Email: " + data.email + "\n"; 
	
	if (data.email){ 
	
		db.User.find({ 
			where: { 
				
				email : data.email
			}
		}).then(function(user){ 

			if(user){ 
				
				senderId = user.id;
			
				db.Message.create({ 
		
			    	message_type: "contact",
					body		: header + data.body,
					sender_id	: user.id
				})
				.then(function(message){ 
					
					return res.json({
						success	: true,	
						data	: data
					});
						
				})
				.catch(db.Sequelize.ValidationError, function (err) {
			
			
			    // respond with validation errors
			    	var validationErrors = []; 
			    	
			    	for(var errorIterator = 0; errorIterator < err.errors.length; errorIterator++){ 
					  
					  validationErrors.push({field : err.errors[errorIterator].path , message : err.errors[errorIterator].message});
				  	}
				  
				  	return res.json({ 
						success	: false,
						error 	: validationErrors
				  	}); 
				})
				.catch(function (err) {
			    
			    	return res.json({
				    	success: false,
						error: [{message :err.message}]
			    	});
				});
			}
			
		});
	}else{ 
		
		db.Message.create({ 
		
	    	message_type: "contact",
			body		: header + data.body,
			sender_id	: null
			
			
		})
		.then(function(message){ 
			
			return res.json({
				success	: true,	
				data	: data
			});
				
		})
		.catch(db.Sequelize.ValidationError, function (err) {
	
	
	    // respond with validation errors
	    	var validationErrors = []; 
	    	
	    	for(var errorIterator = 0; errorIterator < err.errors.length; errorIterator++){ 
			  
			  validationErrors.push({field : err.errors[errorIterator].path , message : err.errors[errorIterator].message});
		  	}
		  
		  	return res.json({ 
				success	: false,
				error 	: validationErrors
		  	}); 
		})
		.catch(function (err) {
	    
	    	return res.json({
		    	success: false,
				error: [{message :err.message}]
	    	});
		});
}
	
			
				
});
	
// Update Article
	
router.put('/:id', function(req, res){ 
		
				
});

// Delete Article 

router.delete('/:id', mw.isAuthenticated("Editor"), function(req, res){ 
		
	
					
});




////////////////////////////////////
// -------- Export Module ------- //
////////////////////////////////////


module.exports = router;


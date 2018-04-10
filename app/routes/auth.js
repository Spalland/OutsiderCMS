////////////////////////////////////
// ------- Require Modules ------ //
////////////////////////////////////

var express = require('express');
var router 	= express.Router(); 
var jwt 	= require('jsonwebtoken');
var db 		= require('../models/index');
var env     = process.env.NODE_ENV || 'development';
var config 	= require('../../config.js')[env];


	
////////////////////////////////////
// ------- Declare Routes ------- //
////////////////////////////////////


// Post Route 
		
router.post('/',  function(req, res){
	
	db.User.findOne({
	
		where: {
			email : req.body.email.toLowerCase()
		}
		
	}).then(function(user){
		  
		if(!user){ 
			return res.json({	
				success	:false,
				error	: [{field: "email", message: "The email address supplied is not associated with an Outsider Account"}]
			});
		}
		
		if(!req.body.password){ 
			
			return res.json({	
			    success	: false,
				error	: [{field:"password", message:"Password cannot be blank"}]
			    		
			});
			
		}
		
		
	    if(user.validPassword(req.body.password)){
		    
		    // On success sign a token
		    
			var token = jwt.sign({
				
				id				: user.id,
				first_name		: user.first_name,
				last_name		: user.last_name,
				email			: user.email,
				role			: user.role,
				username		: user.username,
				email_verified	: user.email_verified,
				createdAt		: user.createdAt
				
        	}, config.secret , {
	        	
				expiresIn: "24h"
				
			});
			
			// Send response with token
			
			var userData = {first_name : user.first_name, last_name : user.last_name , username : user.username};
			 
			return res.json({
				success	: true,
				message	: 'Authentication Successful', 
				token	: token,
				data 	: userData
			});
		    
	    } else {
		
		    return res.json({	
			    success	: false,
				error	: [{field:"password", message:"Incorrect Password"}]
			    		
			});
		    
	    }
	});
	
});
	


////////////////////////////////////
// -------- Export Module ------- //
////////////////////////////////////


module.exports = router;
	
	
	

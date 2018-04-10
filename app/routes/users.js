////////////////////////////////////
// ------- Require Modules ------ //
////////////////////////////////////

var express = require('express');
var router 	= express.Router(); 
var db 		= require('../models/index');
var env 	= process.env.NODE_ENV || "development";
var config 	= require('../../config.js')[env];
var crypto 	= require('crypto');
var mail	= require('sendgrid')(config.sgKey); 
var mw 		= require('./middleware.js');
	
////////////////////////////////////
// ------- Declare Routes ------- //
////////////////////////////////////

// Routes are ordered by decending specificity

/////////////
// - Get - //
/////////////

// This route generates a random token to send and store then returns true on success

router.get('/verify', mw.isAuthenticated("User"), function(req, res){
	
	
	var id = req.user.id;
	var token = crypto.randomBytes(48).toString('hex');

	
	db.User.findOne({
	
		where: {
			id: id 
		}
		
	})
	.then(function(user){
		
		if(!user){ 
			return res.json({	
				success	:false,
				error	:[{message: "Account not found"}]
			});
		}
		
		user.updateAttributes({ 
			email_verification_token: token 
		})
		.then(function(data){ 
			
			if(data){
				
				mail.send({
					to		: data.email.toLowerCase(),
					from	: 'no-reply@outsider.guide',
					subject	: 'Please verify your email Outdsider.guide',
					html	: '<p>Click <a href="http://outsider.guide/verify/' + token + '">here</a> to verify your email</p><br><p>The Outsider Team</p>'

				}, 
				
				function(err, json) {
					if (err) { 
								
						return res.json({ 
							success	: false, 
							error	: [{message:err.message}]
						});
						
					}else{ 
					
						return res.json({
				    		success	: true,
							message	: "Verification email sent"
			    		});
					
					}
							
				});
		
			}
			
		})
		.catch(db.Sequelize.ValidationError, function (err) {


	    // respond with validation errors
	    	var validationErrors = []; 
	    	
	    	for(var errorIterator = 0; errorIterator < err.errors.length; errorIterator++){ 
			  
			  validationErrors.push({field : err.errors[errorIterator].path , message : err.errors[errorIterator].message});
		  	}
		  
		  	return res.json({ 
				success	: false,
				error	: validationErrors
		  	}); 
		})
		.catch(function (err) {
	    
	    	return res.json({
		    	success	: false,
				error	: [{message :err.message}]
	    	});
		});
	});

	
});

// Fetch a single user by ID

router.get('/:username', function(req, res){	
	
		
		db.User.findOne({
					where: { 
						username : req.params.username
					},
					attributes :['first_name', 'last_name', 'email', 'role', "email_verified"]
				})
		
		.then(function(data){ 
	

			return res.json({	
				success	: true,
				message	: "",
				data	: data
			});
			
		})
		.catch(function (err) {
	    
	    	return res.json({
		    	success	: false,
				error	: [{message :err.message}]
	    	});
	  	});	
				
});

// Fetch all users 

router.get('/', function(req, res){	
	
	
	db.User.findAll({attributes :['first_name', 'last_name', 'email', 'role', "email_verified"]})
	
	

	
	.then(function(data){ 
			
		return res.json({	
			success	: true,
			message	: "",
			data	: data
		});
	
		
	})
	.catch(function (err) {
		
    
    	return res.json({
	    	success	: false,
			error	: [{message :err.message}]
    	});
  	});
	
});

//////////////
// - Post - //
//////////////

// Add email subscriber 

router.post('/newsletter', function(req, res){ 
	
	
	var data = req.body;
	
	var token = crypto.randomBytes(48).toString('hex');
	
	console.log(req.body);
		
	db.User.create({ 
		email 					:data.email.toLowerCase(),
		role 					:['Reader'],
		email_prefs_nl			: true,
		newsletter_unsubscibe 	: token
	})
	.then(function(user){ 
		
		return res.json({	
			success	: true,
			message	: "Subscription Successful",
			data 	: {email: user.email},
		
		});	
		
	}).catch(db.Sequelize.ValidationError, function (err) {
		

    // respond with validation errors
    	var validationErrors = []; 
    	
    	for(var errorIterator = 0; errorIterator < err.errors.length; errorIterator++){ 
		  
		  validationErrors.push({field : err.errors[errorIterator].path , message : err.errors[errorIterator].message});
	  	}
	  
	  	return res.json({ 
			success	: false,
			error	: validationErrors
	  	}); 
	})
	.catch(function (err) {
    
    	return res.json({
	    	success	: false,
			error	: [{message :err.message}]
    	});
  	}); 

});


// Handle unsubscribe

router.put('/unsubscribe', function(req, res){ 
	
	var token = req.body.token;
	
	token = mw.escapeString(token);
	
	console.log('\r' + token + '\r');
		
	db.User.update({ 
	
		email_prefs_nl			: false
	}, 
	{ 
		where : { 
			newsletter_unsubscribe : token	
		}
	})
	.then(function(user){ 
		
		return res.json({	
			success	: true,
			message	: "Successfully unsubscribed",
		});	
		
	}).catch(db.Sequelize.ValidationError, function (err) {
		
		console.error("erroring");
    // respond with validation errors
    	var validationErrors = []; 
    	
    	for(var errorIterator = 0; errorIterator < err.errors.length; errorIterator++){ 
		  
		  validationErrors.push({field : err.errors[errorIterator].path , message : err.errors[errorIterator].message});
	  	}
	  
	  	return res.json({ 
			success	: false,
			error	: validationErrors
	  	}); 
	})
	.catch(function (err) {
    
    	return res.json({
	    	success	: false,
			error	: [{message :err.message}]
    	});
  	}); 

});

// Create a new User
		
router.post('/',  function(req, res){
	
	
	var data = req.body;

	// Create Email verification token
	var token = crypto.randomBytes(48).toString('hex');

	db.User.count({
		where : { 
			email : data.email.toLowerCase()
		}
	
	}).then(function(count){ 
		
		if(count === 1){ 
			
			db.User.update({	
		
				first_name				: data.first_name, 
				last_name				: data.last_name, 
				role					: ['User'], 
				password				: data.password,
				email_verification_token: token,
				username 				: data.username
				
			}, {
				where : { 
				
					email : data.email.toLowerCase()
				}
				
			}).then(function (user) {
				
				
				mail.send({
					to		: data.email.toLowerCase(),
					from	: 'no-reply@outsider.guide',
					subject	: 'Please verify your email Outdsider.guide',
					html	: '<p>Click <a href="http://outsider.guide/verify/' + token + '">here</a> to verify your email</p><br><p>The Outsider Team</p>'
				});
		
				var userData = {first_name : user.first_name, last_name : user.last_name , username : user.username};
				
				return res.json({	
					success	: true,
					message	: "Welcome to Outsider " + user.last_name,
					data : userData
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
					error	: validationErrors
			  	}); 
			})
			.catch(function (err) {
		    
		    	return res.json({
			    	success	: false,
					error	: {message :err.message}
		    	});
		  	}); 

			
		}else{ 
			
			
			db.User.create({	
		
				first_name				: data.first_name, 
				last_name				: data.last_name, 
				email					: data.email.toLowerCase(), 
				password				: data.password,
				email_verification_token: token,
				username 				: data.username
				
			})
			.then(function (user) {
				
				
				mail.send({
					to		: data.email.toLowerCase(),
					from	: 'no-reply@outsider.guide',
					subject	: 'Please verify your email Outdsider.guide',
					html	: '<p>Click <a href="http://outsider.guide/verify/' + token + '">here</a> to verify your email</p><br><p>The Outsider Team</p>'
				});
		
				var userData = {first_name : user.first_name, last_name : user.last_name , username : user.username};
				
				return res.json({	
					success	: true,
					message	: "Welcome to Outsider " + user.last_name,
					data : userData
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
					error	: validationErrors
			  	}); 
			})
			.catch(function (err) {
		    
		    	return res.json({
			    	success	: false,
					error	: [{message :err.message}]
		    	});
		  	}); 			
		}
	});
});

// Creates and stores token which is sent to user by mail for pass reset

router.post('/forgot', function(req, res){	
	
	if(req.body.email !== ''){ 
		
		db.User.findOne({
	
		where: {
			"email": req.body.email.toLowerCase()
		}
		
		// *** Add catch for "No matching email found"
		
		})
		.then(function(user){
		
			if(user){ 
			
				var token = crypto.randomBytes(48).toString('hex');
				var date  = new Date(); 
				date.setDate(date.getDate() + 1);
				
				user.updateAttributes({ 
					reset_token: token, 
					reset_token_expiry: date
				}) 
				.then(function(data){ 
					
					if(!data){ 
						return res.json({ 
							success	: false,
							error	: [{message:"There was an internal error please try again later"}]
						});
						
					}else{
						
						
						mail.send({
							to:       req.body.email.toLowerCase(),
							from:     'no-reply@outsider.guide',
							subject:  'Your Password Reset Instructions from Outdsider.guide',
							html:     '<p>Click on <a href="http://outsider.guide/reset/' + token + '">this link</a> to reset your password</p><br><p>The Outsider Team</p>'
						}, function(err, json) {
							if (err) { 
										
								return res.json({ 
									success	: false, 
									error	: [{message:err.message}]
								});
								
							}else{ 
							
								return res.json({
						    		success: true,
									message: "Winner"
					    		});
							
							}
							
						});
						
						
					}
				})
				.catch(db.Sequelize.ValidationError, function (err) {
		
					
					// respond with validation errors
			    	var validationErrors = []; 
			    	
			    	for(var errorIterator = 0; errorIterator < err.errors.length; errorIterator++){ 
					  
					  validationErrors.push({field : err.errors[errorIterator].path , message : err.errors[errorIterator].message});
				  	}
				  
				  	return res.json({ 
						success	: false,
						error	: validationErrors
				  	}); 
				})
				.catch(function (err) {
					
			    
			    	return res.json({
				    	success	: false,
						error	: [{message :err.message}]
			    	});
			  	});
				
			}else{ 
			
				return res.json({ 
					success	: false,
					error	: [{field:"email", message:"There are no accounts at Outsider associated with that address."}]
				});
			
			}			
		});
		
	}else{ 
		
		return res.json({
			success	: false, 
			error	: [{field: 'email', message :"Please enter an email address"}]
				
		});
	} 
	
	
});

// This route updates the users password if the tokens match

router.post('/reset', function(req, res){
	
	var password = req.body.password;
	var token = req.body.token;  
	
	if(password !== ''){ 
		
		db.User.findOne({
	
		where: {
			reset_token: token
		}
		
		// *** Add catch for "No matching email found"
		
		})
		.then(function(user){
			
			
			if(user){ 	
			
				var now = new Date();
				
				if (user.reset_token_expiry < now){ 
					
					return res.send({ 
						success : false,
						error	: [{message : 'Password reset token has expired, please request a new one'}]
					});
					
				}else{ 
					
					
					user.updateAttributes({ 
						password : db.User.generateHash(password),
						reset_token: null, 
						reset_token_expiry: null
					})
					.then(function(data){ 
						
						if(data){ 
							
							return res.send({ 
								success	: true, 
								message	: "Password reset successful"
								
							}); 
							
						}
						
					})
					.catch(db.Sequelize.ValidationError, function (err) {
		
				    // respond with validation errors
				    	var validationErrors = []; 
				    	
				    	for(var errorIterator = 0; errorIterator < err.errors.length; errorIterator++){ 
						  
						  validationErrors.push({field : err.errors[errorIterator].path , message : err.errors[errorIterator].message});
					  	}
					  
					  	return res.send({ 
							success	: false,
							error	: validationErrors
					  	}); 
					})
					.catch(function (err) {
	
				    	return res.send({
					    	success	: false,
							error	: [{message :err.message}]
				    	});
				  	});
					
				}
			
			}else{ 
				
				return res.send({ 
					
					success	: false, 
					error	: [{message : "Token not found, did you request another one?"}]
				});
				
			}
		});
		
	}else{ 
		
		return res.send({
			success	: false, 
			error	: [{message : "New password cannot be blank"}]
		});
		
	}
		
				
});

// Set user email verified status to true

router.post('/verify', function(req, res){
	
	var email = req.body.email.toLowerCase();
	var password = req.body.password;
	var token = req.body.token; 
	
	
	db.User.findOne({
	
		where: {
			"email": req.body.email.toLowerCase()
		}
		

		
	}).then(function(user){
		
		
		  
		if(!user){ 
			return res.json({	
				success	: false,
				error	: [{field: "email", message: "The email address supplied is not associated with an Outsider Account"}]
			});
		}
		
	    if(user.validPassword(password)){
		   
		    
		    if(user.email_verification_token === token){ 
			
			
				user.updateAttributes({ 
					email_verified : true,
					email_verification_token: null 
				})
				.then(function(data){ 
					
					if(data){ 
						
						return res.send({ 
							success	: true, 
							message	: "Verification Successful"
							
						}); 
						
					}
					
				})
				.catch(db.Sequelize.ValidationError, function (err) {
	
		
			    // respond with validation errors
			    	var validationErrors = []; 
			    	
			    	for(var errorIterator = 0; errorIterator < err.errors.length; errorIterator++){ 
					  
					  validationErrors.push({field : err.errors[errorIterator].path , message : err.errors[errorIterator].message});
				  	}
				  
				  	return res.json({ 
						success	: false,
						error	: validationErrors
				  	}); 
				})
				.catch(function (err) {
				
			    
			    	return res.json({
				    	success	: false,
						error	: [{message :err.message}]
			    	});
				});
			}else{ 
				
				return res.json({
					success	: false,
					error	: [{message : "Wrong token, did you request another one?" }]
				});
				
			}
			
	    } else {
		
		    return res.json({	
			    success	: false,
				error	: [{field:"password", message:"Incorrect Password"}]
			    		
			});
		    
	    }
	});
	
});

/////////////
// - Put - //
/////////////

// Update user credentials and set new verification token if email is changed.
	
router.put('/:id', function(req, res){ 
		
				
});

////////////////
// - Delete - //
////////////////


// Delete User Route 

router.delete('/:id', function(req, res){ 
		
				
});






////////////////////////////////////
// -------- Export Module ------- //
////////////////////////////////////


module.exports = router;


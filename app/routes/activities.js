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

/////////////
// - Get - //
/////////////


// Fetch all Activities 

router.get('/', function(req, res){	

	db.sequelize.query('SELECT A.*, I.filename , count(ar.id) articles FROM "Activities" A LEFT JOIN "Articles" AR ON AR.category_id = A.id LEFT JOIN "CroppedImages" I ON A.image_id = I.id GROUP BY A.id, I.filename ORDER BY A.title ASC')
	
	.then(function(data){ 
		return res.json({
			success	: true,	
			data	: data[0]
		});
		
		
	});
	
});


//////////////
// - Post - //
//////////////

// Create a new Activity
		
router.post('/',  function(req, res){
	
	var data = req.body;
	
	db.Activity.create({
		
		title			: data.title,
		image_id		: data.image_id,
		activity_type	: data.activity_type,
		slug			: data.slug
		
	}).then(function(data){ 
		
		
		db.CroppedImage.find({
			where: { id : data.image_id}
		}).then(function(imageData){ 
			
			
			data.dataValues.filename = imageData.filename;
			
			console.log('\n', data.dataValues, '\n');
			
			
			return res.json({
				success	: true,	
				data	: data
			});
			
		}).catch(function (err) {
    
	    	return res.json({
		    	success: false,
				error: [{message :err.message}]
	    	});
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
	    	success: false,
			error: [{message :err.message}]
    	});
	});
		
});



/////////////
// - Put - //
/////////////
	
// Update Article
	
router.put('/:id', function(req, res){ 
					
});

////////////////
// - Delete - //
////////////////

// Delete Activity 

router.delete('/:id', mw.isAuthenticated("Editor"), function(req, res){ 
		
	var id = req.params.id; 
	
	db.Article.update({activity_id : null},{
		
		where: { activity_id : id }
		
	}).then(function(data){ 
			
		console.log('\n' , "Deleting" , '\n');
		
		db.Activity.destroy({
			where : { id : id }
		}).then(function(data){ 
			
			return res.json({
				success	: true,	
				data	: data
			});
			
		}).catch(function (err) {

			return res.json({
				success: false,
				error: [{message :err.message}]
			});
		});
		
						
	}).catch(function (err) {

		return res.json({
    		success: false,
			error: [{message :err.message}]
		});
	});
		
					
});



////////////////////////////////////
// -------- Export Module ------- //
////////////////////////////////////


module.exports = router;


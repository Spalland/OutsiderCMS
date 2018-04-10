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


// Fetch all Categories 

router.get('/', function(req, res){	

	db.sequelize.query('SELECT C.*, I.filename , count(ar.id) articles FROM "Categories" C LEFT JOIN "Articles" AR ON AR.category_id = C.id LEFT JOIN "CroppedImages" I ON C.image_id = I.id GROUP BY C.id, I.filename ORDER BY C.title ASC')
	
	.then(function(data){ 
		return res.json({
			success	: true,	
			data	: data[0]
		});
	});
});

// Fetch a single Article by ID

router.get('/:id', function(req, res){	
	
				
});

// Create a new Category
		
router.post('/',  function(req, res){
	
	var data = req.body;
	
	db.Category.create({
		
		title		: data.title,
		image_id	: data.image_id,
		slug		: data.slug
		
	}).then(function(data){ 
		
		
		db.CroppedImage.find({
			where: { id : data.image_id}
		}).then(function(imageData){ 
			
			
			data.dataValues.filename = imageData.filename;
			
			
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
	
// Update Article
	
router.put('/:id', function(req, res){ 
		
				
});

// Delete Article 

router.delete('/:id', mw.isAuthenticated("Editor"), function(req, res){ 
		
	var id = req.params.id; 
	
	db.Article.update({category_id : null},{
		
		where: { category_id : id }
		
	}).then(function(data){ 
			
		
		db.Category.destroy({
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


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


// Fetch all Articles 

router.get('/activities/:activity', function(req, res){
	
	var activity = req.params.activity;
	
	var rpp = req.query.rpp;
	var offset = (req.query.page -1) * rpp;
	
	
	
	db.sequelize.query('SELECT A.title, A.body, A.slug, A.featured, A.byline, A.publish_date, A.video, AC.slug AS activity_slug, AC.title AS activity_title, C.title AS category_title, C.slug AS category_slug, I.filename FROM "Articles" A LEFT JOIN "Activities" AC ON A.activity_id = AC.id LEFT JOIN "CroppedImages" I ON A.image_id = I.id LEFT JOIN "Categories" C ON A.category_id = C.id WHERE publish_date < NOW() AND status != \'Deleted\' AND AC.slug = \'' +  activity + '\' ORDER BY publish_date DESC OFFSET ' + offset + ' LIMIT ' + rpp )
	
	
	.then(function(data){ 
		
		console.log(data);
		
		return res.json({
			success	: true,	
			data	: data[0]
		});
		
		
	});

	
});

router.get('/categories/:category', function(req, res){
	
	var category = req.params.category;
	
	var rpp = req.query.rpp;
	var offset = (req.query.page -1) * rpp;
	
	console.log(req.query);
	
	db.sequelize.query('SELECT A.title, A.body, A.featured, A.slug, A.byline, A.publish_date, A.video, AC.slug AS activity_slug, AC.title AS activity_title, C.title AS category_title, C.slug AS category_slug, I.filename FROM "Articles" A LEFT JOIN "Activities" AC ON A.activity_id = AC.id LEFT JOIN "CroppedImages" I ON A.image_id = I.id LEFT JOIN "Categories" C ON A.category_id = C.id WHERE publish_date < NOW() AND status != \'Deleted\' AND C.slug = \'' +  category + '\' ORDER BY publish_date DESC OFFSET ' + offset + ' LIMIT ' + rpp)
	
	
	.then(function(data){ 
		

		
		return res.json({
			success	: true,	
			data	: data[0]
		});
		
		
	}).catch(function (err) {
	    
    	return res.json({
				success	: false,
				error	: {message: err.message}
		});
	});
	
});


router.get('/', function(req, res){	
	
	db.Article.findAll({
		order: '"createdAt" DESC'
	})
	
	.then(function(data){ 
		
		return res.json({
			success	: true,	
			data	: data
		});
		
		
	})
	.catch(function (err) {
	    
    	return res.json({
				success	: false,
				error	: {message: err.message}
		});
	});
	
});

// Get all articles for current user

router.get('/user', mw.isAuthenticated("Writer"), function(){ 
	
	db.Article.findAll({ 
		
		where : { 
			writer_id: req.user.id
		},
		order: [['publish_date', 'DESC']]
	})
	
	.then(function(data){ 
		
		return res.json({
			success	: true,	
			data	: data
		});
		
		
	})
	.catch(function (err) {
	    
    	return res.json({
				success	: false,
				error	: {message: err.message}
		});
	});
	
});


// Get all articles for specific user


router.get('/user/:id', mw.isAuthenticated("Writer"), function(){ 
	
	db.Article.findAll({ 
		
		where : { 
			username: req.params.id
		},
		order: [['publish_date', 'DESC']]
	})
	
	.then(function(data){ 
		
		return res.json({
			success	: true,	
			data	: data
		});
		
		
	})
	.catch(function (err) {
	    
    	return res.json({
				success	: false,
				error	: {message: err.message}
		});
	});
	
});


// Get all Articles in publish date order

router.get('/latest', function(req, res){
	
	var rpp = req.query.rpp;
	var offset = (req.query.page -1) * rpp;
	
	console.log(offset);
	
	db.sequelize.query('SELECT A.title, A.body, A.slug, A.featured, A.byline, A.publish_date, A.video, AC.slug AS activity_slug, AC.title AS activity_title, C.title AS category_title, C.slug AS category_slug, I.filename, coalesce(CO.comment_count, 0) AS comment_count FROM "Articles" A LEFT JOIN "Activities" AC ON A.activity_id = AC.id LEFT JOIN "CroppedImages" I ON A.image_id = I.id LEFT JOIN "Categories" C ON A.category_id = C.id LEFT JOIN (SELECT CO.article_id, count(1) comment_count FROM "Comments" CO GROUP BY CO.article_id) AS CO ON CO.Article_id = A.id WHERE publish_date < NOW() AND status != \'Deleted\' ORDER BY publish_date DESC LIMIT ' + rpp)
	
	.then(function(data){ 

		return res.json({
			success	: true,	
			data	: data[0]
		});
		
		
	})
	.catch(function (err) {
	    
    	return res.json({
				success	: false,
				error	: {message: err.message}
		});
	});
	
});


// Check for slug uniqueness 

router.get('/reserve/:slug', function(req,res){ 
	
	var slug = req.params.slug;
	var slugCounter = 1;
	
	
	//Run async loop
	(function loop(){
		

		
		//Check database for existence of slug
		db.Article.findAndCountAll({
			
			where : { 
				slug : slug 
			}
			
		})
		.then(function(result){ 
			
			//If data is in database or in cache append the counter
			
		
			if(result.count !== 0 || mw.slugInCache(slug)){ 
				
				//Work to be done here to clean up appending
				
				if (slugCounter > 1){
					
					
					slug = slug.substr(0, (slug.length -2)) + "-" + slugCounter;
					
				}else{ 
					
					slug = slug + "-" + slugCounter;
				}
				
				
				//Increase counter
				slugCounter++;
				
				//Call loop to check updated slug
				return loop();
						
			}else{ 
				
				//change loop condition
				
				slugIsReserved = true;
				
				//If slug is unique add to the cache
				
				mw.addSlug(slug);
				
				//Return the approved slug
				
				return res.json({ 
					success : true,
					data	: slug,
					message : {message: "Slug reserved"}
				});
			
			}
				
		})
		.catch(function (err) {
    
	    	return res.json({
					success	: false,
					error	: {message: err.message}
			});
		});
			
	})();
	
});



// Fetch a single Article by Slug
router.get('/article/:slug', function(req, res){	
	
	var identifier = req.params.slug;
	
			
	db.sequelize.query('SELECT A.* , AC.title AS activity_title, AC.slug AS activity_slug, C.title AS category_title, C.slug AS category_slug, I.filename AS filename FROM "Articles" A LEFT JOIN "Activities" AC ON A.activity_id = AC.id LEFT JOIN "CroppedImages" I ON A.image_id = I.id LEFT JOIN "Categories" C ON A.category_id = C.id WHERE publish_date < NOW() AND status != \'Deleted\' AND A.slug = \'' + identifier + '\'' )

	.then(function(article){
		
		
		if(article[1].rowCount === 0){ 
			return res.json({
				falseStatus : 404,	
				success	: false,
				error	: {message: "Article not found"}
			});
		}
		
		return res.json({	
			success	 :true,
			data	: article[0][0]
		});
	})
	.catch(function (err) {
	    
    	return res.json({
	    		falseStatus : 404,
				success	: false,
				error	: {message: err.message}
		});
	});

	
	
});


// Fetch a single Article by ID
router.get('/:id', function(req, res){	
	
	
	console.log("Looking for article");
	
	var identifier = req.params.id;
	
	if (!identifier) {
		
		res.status(404).json({	
				success	: false,
				error	: {message: "Article not found"}
		});
		
	}
	
			
	db.Article.findOne({
		where :{ 
			id	: identifier		
		}
			
	})

	.then(function(article){

		if(!article){ 
			return res.status(404).json({	
				success	: false,
				error	: {message: "Article not found"}
			});
		}
		
		return res.json({	
			success	: true,
			data	: article
		});
	})
	.catch(function (err) {
	    
    	return res.json({
	    	success: false,
			error: [{message :err.message}]
    	});
	});

	
	
});


//////////////
// - Post - //
//////////////

// Create a new Article
		
router.post('/', mw.isAuthenticated("Writer"), mw.isVerified(), function(req, res){
	
	
	var data = req.body;
	
	
	
	console.log(req.body);
	
	db.Article.create({
		
		title		: data.title,
		body 		: data.body,
		category	: data.category,
		slug 		: data.slug,
		publish_date: data.publish_date,
		writer_id 	: req.user.id, 
		image_id	: data.image_id,
		activity	: data.activity,
		video		: data.video, 
		byline		: data.byline
		
	})
	.then(function(data){
		if(data){ 
			
			if(mw.slugInCache(data.slug)){
				 mw.removeSlug(data.slug);
			}
			
			return res.json({ 
				success: true,
				data: data.dataValues,
				message: "Article Created"
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
			error 	: validationErrors
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
		
	var articleId = req.params.id;
	var content = req.body;


		
	db.Article.findOne({
	
		where: {
			id: articleId 
		}
		
	})
	.then(function(article){
	
		
		if(!article){ 
			return res.json({	
				success	:false,
				error	:{message: "Article not found."}
			});
		}
		
		if(content.views === 1){ 
			
			article.increment('views')
			.then(function(data){ 
				
				return res.json({ 
					
					success :true,
					data	: data,
					message :{message: "Article Updated Successfully."}
				});
				
			});
			
		}else{ 
			
		
			article.updateAttributes(content)
			.then(function(data){ 
			
				if(mw.slugInCache(data.slug)){
					 mw.removeSlug(data.slug);
				}
			
				return res.json({ 
					
					success :true,
					data	: data,
					message :{message: "Article Updated Successfully."}
				});
				
			}).catch(function(err){ 
				return res.json({
					success	: false,
					error	: {message: err.message}
				});
			});
		}
		
	}).catch(function(err){ 
		return res.json({
			success	: false,
			error	: {message: err.message}
		});
	});	
				
});

////////////////
// - Delete - //
////////////////

// Delete Article 

router.delete('/:id', function(req, res){ 
	
	
	var id = req.params.id;	
		
	db.Article.findOne({
	
		where: {
			id: id 
		}
		
	})
	.then(function(article){
		
		if(!article){ 
			return res.json({	
				success	:false,
				error	:{message: "Article not found"}
			});
		}
		
		
		article.updateAttributes({status: "Deleted"})
		.then(function(data){ 
			
			return res.json({ 
				
				success :true,
				data	: data,
				error :{message: "Article Updated Successfully"}
			});
		})
		.catch(function (err) {
	    
	    	return res.json({
					success	: false,
					error	: {message: err.message}
			});
		});
	})
	.catch(function (err) {
	    
    	return res.json({
			success	: false,
			error	: {message: err.message}
		});
	});				
});




////////////////////////////////////
// -------- Export Module ------- //
////////////////////////////////////


module.exports = router;


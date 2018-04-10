////////////////////////////////////
// ------- Require Modules ------ //
////////////////////////////////////

var express 	= require('express');
var router 		= express.Router(); 
var db 			= require('../models/index');
var mw 			= require('./middleware.js');
var fs 			= require('fs');
var gd			= require('node-gd');
var crypto		= require('crypto');
var Q 			= require('q');
var aws 		= require('aws-sdk');
var multer 		= require('multer');
var multerS3 	= require('multer-s3');
var S3FS 		= require('s3fs');
var env 		= process.env.NODE_ENV || "development";
var config 		= require('../../config.js')[env]; 
var s3  		= new aws.S3(config.s3Opts);
var s3fs		= new S3FS(config.s3Bucket , config.s3Opts);

	
////////////////////////////////////
// ------- Declare Routes ------- //
////////////////////////////////////


// Fetch all Images 

router.get('/', mw.isAuthenticated("User"), function(req, res){	

	db.Image.findAll({
		where : { 
			uploader_id : req.user.id
		},
		order : [['createdAt', "DESC"]]
	})
	.then(function(data){ 
		
		var fixedDates = data.map(function(e){
			var date = new Date(e.createdAt);
			date.setHours(0);
			date.setMinutes(0);
			date.setSeconds(0);
			date.setMilliseconds(0);
			
			e.dataValues.createdAt = date;
			

			return e;
		});
		
		
		return res.json({
			success	: true,	
			data	: fixedDates
		});
	}).catch(function(err){ 
		
		return res.json({ 
			
			success	: false,
			error	: [{message: err.message}]
		});
	});
});

// Fetch a single Image by ID

router.get('/:id', function(req, res){	
	
	
	var id = req.params.id;
	
	db.Image.findOne({
		where :{ 
			id	: id		
		}
			
	})

	.then(function(image){

		if(!image){ 
			return res.status(404).json({	
				success	: false,
				error	: [{message: "Image not found"}]
			});
		}
		
		return res.json({	
			success	: true,
			data	: image
		});
	})
	.catch(function(err) {
	    
    	return res.json({
	    	success	: false,
			error	: [{message :err.message}]
    	});
	});
			
});


router.get('/cropped/:id', function(req, res){ 
	

	var id = req.params.id;
	
	db.CroppedImage.find({
		where :{ 
			id	: id		
		}
			
	})

	.then(function(image){

		if(!image){ 
			return res.status(404).json({	
				success	: false,
				error	: [{message: "Image not found"}]
			});
		}
		
		return res.json({	
			success	: true,
			data	: image
		});
	})
	.catch(function (err) {
	    
    	return res.json({
	    	success : false,
			error	: [{message :err.message}]
    	});
	});
	
});



	
var upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: config.s3Bucket + '/original',
    contentType: multerS3.AUTO_CONTENT_TYPE,
    metadata: function (req, file, cb) {
	 
      cb(null, {fieldName:file.fieldname});
    },
    key: function (req, file, cb) {
	    var token = crypto.randomBytes(12).toString('hex');
      cb(null, token);
    }
  })
});	

	

router.post('/add', mw.isAuthenticated("User"),  upload.array("file", 10), function(req, res){

	
	
	var filename = req.files[0].key;
	var originalFilename = req.files[0].originalname;
	var s3filePath = config.s3Bucket + '/original/' + filename;
	
	openGDfromS3(s3filePath).then(function(imageObject){ 
	
		
		var maxSizes = [
		{
			folder : 'large', 
			pixels : 1000
		},{
			folder : 'medium', 
			pixels : 500
		},{
			folder : 'small', 
			pixels : 250
		}];
	
		
		var resized = Q.all(resizeImageP(imageObject, maxSizes[0], filename), 
							resizeImageP(imageObject, maxSizes[1], filename), 
							resizeImageP(imageObject, maxSizes[2], filename));

		resized.then(function(imageDetails){
			
			
			saveImageToDb(originalFilename ,imageDetails.filename , imageDetails.aspect , req.user.id).then(function(imageData){
				
				
				return res.json({
				    success	: true,
				    data	: imageData,
					message	: "Uploaded and cropped"
			    });
				
			});
		
		})
		.catch(function(err){ 
			
			return res.json({ 
			
				success : false, 
				error : [{message: err.message}]
		
			});
		
		});
	
	
	}).catch(function(err){
		
	
		return res.json({ 
			
			success	: false, 
			error	: [{message: err.message}]
			
		});
		
	});
	
});	
	


// Update Article

router.put('/crop', mw.isAuthenticated("User"), function(req, res){
	
	
	var data = req.body;
	

	
	var filename = data.image.filename;
	var cropFilename = crypto.randomBytes(12).toString('hex');

	
	var aspectRatio;	
	var offsetX = 0; 
	var offsetY = 0;
	
	var dstWidth = 0;
	var dstHeight = 0;
	var srcWidth = 0; 
	var srcHeight = 0;
	
	var dstImg;
	
	var attributeToUpdate = "quantityLandscapeCrop";
	
	
	openGDfromS3(config.s3Bucket + '/original/' + filename)
	.then(function(fileData){ 
		
		var img = fileData.img;
		var mime = fileData.mime;
		
		if(data.purpose === "avatar"){ 
			
			attributeToUpdate = "quantitySquareCrop";
			
			dstWidth = 200;
			dstHeight = 200;
			aspectRatio = 1;
			
		}else if(data.purpose === "poster"){ 
			
			attributeToUpdate = "quantityLandscapeCrop";
			
			dstWidth = 700;
			dstHeight = 700 * (9 / 16);
			aspectRatio = 9/16; 
			
		}else{ 
			
			dstWidth = img.width / 100 * data.cropWidth;
			dstHeight = img.height/ 100 * data.cropHeight;
			
		}
		
		createTrueColorP(parseInt(dstWidth), parseInt(dstHeight))
		.then(function(dstImg){ 
			
		
			offsetX = (img.width / 100 * data.cropOffsetX);
			offsetY = img.height / 100 * data.cropOffsetY;
			cropWidth = img.width / 100 * data.cropWidth;
			cropHeight = img.height/ 100 * data.cropHeight;
			srcWidth = img.width;
			srcHeight = img.height;			
			
			img.copyResampled(dstImg, 0 , 0,  parseInt(offsetX), parseInt(offsetY), parseInt(dstWidth), parseInt(dstHeight), parseInt(cropWidth), parseInt(cropHeight)); 
			
			
			var imgB64; 
		
		
			if(mime === "image/jpeg"){ 
		
				imgB64 = dstImg.jpegPtr(2000,true);
		
			}else if(mime === "image/png"){
	
				imgB64 = dstImg.pngPtr(0,true);
	
			}
		
		
			s3fs.writeFile('/cropped/' + cropFilename, imgB64, {"ContentType": mime})
			.then(function() {
			
				
				img.destroy();
					
				db.Image.findOne({ 
					
					where: {
						id : data.image.id
					}
				})
				.then(function(image){ 
					
					var attributes = {}; 
					attributes[attributeToUpdate] = image[attributeToUpdate] + 1;
					
					image.updateAttributes(attributes)
					
					.then(function(imageToCropData){
			
						
						db.CroppedImage.create({ 
						
							filename : cropFilename,
							aspectRatio : aspectRatio,
							owner : req.user.id,
							caption : data.caption, 
							original_image_id : data.image.id	
							
						})
						.then(function(cropData){ 
							
								return res.json({ 
									success : true,
									data 	: cropData 
							});					
						});	
					});	
				});

			}).catch(function(err){ 
				
				return res.json({ 
					success : false,
					error 	: [{message:err.message}] 
				});	
				
			});
			
			
		}).catch(function(err){ 
			
			return res.json({ 
				success : false,
				error 	: [{message:err.message}]
			});		
		});
	
	});
	
});
	
router.put('/:id', function(req, res){ 
		
				
});




// Delete Article 

router.delete('/:id', function(req, res){ 
		
				
});




////////////////////////////////////
// -------- Export Module ------- //
////////////////////////////////////


module.exports = router;


////////////////////////////////////
// ------- Helper Functions ----- //
////////////////////////////////////



function openGDfromS3(filePath){ 
	
	var deferred = Q.defer(); 
	
	
	s3fs.readFile(filePath, {ResponseContentEncoding: 'String'}).then(function(data) {
	
		var img; 
		
		
		if(data.ContentType === "image/jpeg"){ 
			
			img = gd.createFromJpegPtr(data.Body);
			
		}else if(data.ContentType === "image/png"){
		
			img = gd.createFromPngPtr(data.Body);
		
		}
		
				
		deferred.resolve({
			img :img,
			mime : data.ContentType
		}); 
		
	}).catch(function(err){
		return res.json({ 
			success : false,
			error 	: [{message:err.message}] 
		});	
		
	});

	return deferred.promise; 
	
}	


function resizeImageP(imageObject, maxSize, filename){ 
	
	
	var deferred = Q.defer(); 
	var dstW	= 0;
	var dstH 	= 0;
	

	var srcW = imageObject.img.width, srcH = imageObject.img.height;
	var aspectRatio = srcW/srcH;

	//Landscape
	if(aspectRatio > 0){
		dstW = maxSize.pixels;
		dstH = dstW / aspectRatio;
	}else{ 
		dstH = maxSize.pixels;
		dstW = maxSize.pixels * aspectRatio;
	}
	
	dstH = parseInt(dstH);
	dstW = parseInt(dstW);
	
	
	createTrueColorP(dstW, dstH)
	.then(function(dstImg){ 
	
		
		var imgB64; 
		
		
		
		if(imageObject.mime === "image/jpeg"){ 
		
			imgB64 = dstImg.jpegPtr(2000,true);
		
		}else if(imageObject.mime === "image/png"){
	
			imgB64 = dstImg.pngPtr(0,true);
	
		}
		
		
		s3fs.writeFile('/' + maxSize.folder + '/' + filename, imgB64, {"ContentType": imageObject.mime}).then(function() {
			
			
			
			deferred.resolve({
				filename: filename,
				mime: imageObject.mime,
				aspect : aspectRatio
			});
				
		}, function(reason) {
			
			deferred.reject(reason);
			
		});


	})
	.catch(function(err){ 	
			
		deferred.reject(err);
	});
	
	return deferred.promise;
}



function createTrueColorP(width, height){
	
	var deferred = Q.defer();

	
	gd.createTrueColor(width, height, function(err, img){ 
				
		if(img.trueColor === 1){
			 
			deferred.resolve(img);
				
		}else{ 

			deferred.reject(err);
	
		}
	});
	
	return deferred.promise;
}




function saveImageToDb(originalFilename, newFilename, aspectRatio, owner){ 
	
	var deferred = Q.defer();
	
	db.Image.create({ 
		filename : newFilename,
		original_filename : originalFilename,
		aspectRatio : aspectRatio,
		uploader_id : owner	
	})
	.then(function(image){
		
		deferred.resolve(image);
		
	})
	.catch(function(err){ 
		
		deferred.reject(err);
		
	});
	
	return deferred.promise;

}







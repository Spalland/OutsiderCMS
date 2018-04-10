var jwt 	= require('jsonwebtoken');
var env 	= process.env.NODE_ENV || "development";
var config 	= require('../../config.js')[env];

var mw = {};

mw.isAuthenticated = function(role){ 
	
	return function(req, res, next) {
		
		// check header or url parameters or post parameters for token
		var token = req.body.token || req.query.token || req.headers['x-access-token']; // decode token
		if (token) {
			
		
	    	// verifies secret and checks exp
			jwt.verify(token, config.secret, function(err, decoded) { 
				if (err) {
					
				
					return res.status(401).send({ 
						success	: false,
						error	: [{message : 'Failed to authenticate token'}]
	        		});
	        		
				} else {
					

					if(decoded.role.indexOf(role) > -1){ 
					
						req.user = decoded;
						next();
						
					}else{ 
						
						return res.status(403).send({ 
							success	: false,
							error	: [{message: 'You do not have permission to view that resource'}]
	        			});

					} 
					
				} 
	
			});
	
		} else {
			
			// if there is no token
			// return an HTTP response of 403 (access forbidden) and an error message return res.status(403).send({
			return res.status(401).send({
				success	: false,
				error	: [{message :'No token provided'}]
			});
		}
	
	};
};

mw.isVerified = function(){
	
	return function(req, res, next) {
		
		
		if(res.user){ 
			
			if(req.user.email_verified){ 
				
				next();
			}else{ 
				
				return res.json({ 
					success	: false,
					error	: {message: 'You need to verify your email before you can do that'}
    			});
			}
			
			
			
		}else{
			
		
			var token = req.body.token || req.query.token || req.headers['x-access-token']; // decode token
			if (token) {
				
		    	// verifies secret and checks exp
				jwt.verify(token, config.secret, function(err, decoded) { 
					if (err) {
						
						return res.status(401).send({ 
							success	: false,
							error	: [{message : 'Not verified'}]
		        		});
		        		
					} else {
						
						if(decoded.email_verified){ 
						
							req.user = decoded;
							next();
							
						}else{ 
							
							return res.json({ 
								success	: false,
								error	: [{message: 'You need to verify your email before you can do that'}]
		        			});
						} 
					} 
				});
		
			} else {
				
				// if there is no token
				// return an HTTP response of 403 (access forbidden) and an error message return res.status(403).send({
				return res.status(401).send({
					success	: false,
					error	: [{message :'No token provided'}]
				});
			}

		}
		
		// check header or url parameters or post parameters for token
		
	
	};

	
	
	
	
};

mw.slugCache = [];

mw.addSlug = function(slug){ 
	
	mw.slugCache.push(slug);
};

mw.slugInCache = function(slug){ 
	
	if(mw.slugCache.indexOf(slug) > -1){
		
		return true;
		
	}else{ 
		
		return false;
		
	}
	
};

mw.removeSlug = function(slug){ 
	
	if(mw.slugInCache(slug)){ 
	
		mw.slugCache.splice(mw.slugCache.indexOf(slug), 1);
	
	}
	
	console.log(mw.slugCache);
	
};


mw.escapeString = function(string){
    if (typeof str !== 'string'){
        return str;
	}
    return str.replace(/[\0\x08\x09\x1a\n\r"'\\\%]/g, function (char) {
        switch (char) {
            case "\0":
                return "\\0";
            case "\x08":
                return "\\b";
            case "\x09":
                return "\\t";
            case "\x1a":
                return "\\z";
            case "\n":
                return "\\n";
            case "\r":
                return "\\r";
            case "\"":
            case "'":
            case "\\":
            case "%":
                return "\\"+char; // prepends a backslash to backslash, percent,
                                  // and double/single quotes
        }
    });
};



module.exports = mw;
	
	
	

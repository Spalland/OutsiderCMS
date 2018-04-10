'use strict';

	var bcrypt   = require('bcrypt-nodejs');


module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define('User', {
	  
    first_name: {
	    
	    type		: DataTypes.STRING,
	    validate: { 
		    notEmpty: { 
		      args	: true, 
		      msg	: "First name can't be blank"
	      	}
	    }
	  },
    
    last_name: {
	    
	    type		: DataTypes.STRING,

	    validate: { 
		    notEmpty: { 
		      args	: true, 
		      msg	: "Last name can't be blank"
	      }
	    }
	    
	  },
	  
    email: {
	    
		type		: DataTypes.STRING,
		allowNull	: false,
		unique		: "Users_email_key",
		validate 	: {
			isUnique: function (value, next) {
                var self = this;
                User.find({where: {email: value}})
                    .then(function (user) {
                        // reject if a different user wants to use the same email
                        if (user && self.id !== user.id) {
                            return next('Email already in use!');
                        }
                        return next();
                    })
                    .catch(function (err) {
                        return next(err);
                });
            },
        
	      
			notEmpty: { 
		    	args: true, 
				msg	: "Email can't be blank"
	    	},
			isEmail	: { 
		    	args: true, 
				msg	: "Please supply a real email address"
	      }
	    }
	  	
	  },
	  
    password: {
	    
	    type		: DataTypes.STRING,
	    validate	: {
			len		: {
			 	
				args: [8,255],
				msg	: "Password must contain at least 8 characters"
				
			},
			
			notEmpty: {
				
				args: true,
				msg	: "Password can't be blank"
				
			}   
		    
		    
	    }
	    
	  
	  },
	  
    role: {
	    
	    type		: DataTypes.ARRAY(DataTypes.STRING),
	    default		: ['User'] 
	    
	  },
	  
	reset_token: { 
		type		: DataTypes.STRING
	}, 
	
	reset_token_expiry: {
		type		: DataTypes.DATE
	}, 
	
	email_verification_token: { 
		type		: DataTypes.STRING
	}, 
	
	email_verified : { 
		
		type		:DataTypes.BOOLEAN
	},
	
	email_prefs_nl : { 
		
		type		:DataTypes.BOOLEAN
	},
	
	username : {
		type 		: DataTypes.STRING,
		validate 	: {
			isUnique: function (value, next) {
				
                var self = this;
                User.find({where: {username: value}})
                    .then(function (user) {
                        // reject if a different user wants to use the same username
                        if (user && self.username !== user.username) {
                            throw new Error('Username taken');
                        }
                        return next();
                    })
                    .catch(function (err) {
                        return next(err);
                });
            },
			
			formatedForUsername: function(value){ 
				if(/^\w+$/.test(value)){ 
					
					return; 
				}else{ 
					
					throw new Error("Username must be a combination of letters numbers underscores");
				}
				
			},
	      
			notEmpty: { 
		    	args: true, 
				msg	: "Username can't be blank"
	    	},
	    } 
	}
  
  
  },
   
  {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      },
      generateHash : function(password) {
	      	return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
	      }
      
    },
    
    instanceMethods: { 
	    validPassword : function(pword) {
	      	return bcrypt.compareSync(pword, this.password);
	    }
	    
    },
    
   
	hooks: {
	    beforeCreate: function(user, options) {
	      user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(8), null);
		},
		beforeUpdate: function(user, options) {
	      user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(8), null);
		}
 
    }
  
    
    
    
  });
  return User;
};
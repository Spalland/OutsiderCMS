'use strict';
module.exports = function(sequelize, DataTypes) {
  	var CommentFlag = sequelize.define('CommentFlag', {
	  	
    	comment_id : {
	    	type : DataTypes.UUID
		},
		
		flagger_id: {
	    	type : DataTypes.UUID
		},
	   
		reason : { 
			type : DataTypes.TEXT
		},
		
		active : { 
			type : DataTypes.BOOLEAN
		}
	   
	},
	
	{
    	classMethods: {
			associate: function(models) {
			// associations can be defined here
    		}
    	}
	});
	return CommentFlag;
};
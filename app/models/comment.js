'use strict';
module.exports = function(sequelize, DataTypes) {
  	var Comment = sequelize.define('Comment', {
	  	
    	article_id : {
	    	type : DataTypes.UUID
		},
		
		commenter_id: {
	    	type : DataTypes.UUID
	    },
	    
	    status: {
		    type : DataTypes.ENUM('live', 'deleted', 'flagged', 'approved')
		}, 
		
		reply_to:{ 
			type : DataTypes.UUID
		},
		
		body: { 
			type : DataTypes.TEXT
		},
		
		depth:{ 
			type : DataTypes.INTEGER
		},
		
		timesflagged : { 
			type : DataTypes.INTEGER
		},
		
		created_at : { 
			field: 'createdAt',
			type : DataTypes.DATE		
		}
		
  	},
  	
  	{
    	classMethods: {
			associate: function(models) {
			// associations can be defined here
    		}
    	}
	});
	return Comment;
};
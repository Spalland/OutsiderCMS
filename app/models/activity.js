'use strict';
module.exports = function(sequelize, DataTypes) {
	var Activity = sequelize.define('Activity', {
	  
	    title: {
		    type : DataTypes.STRING,
		    allowNull:false,
		    validate: { 
			    notEmpty: { 
			     	args: true, 
				 	msg	: "Title can't be blank"
		      	}
	    	}
		},
		  
	    activity_type: {
		    type : DataTypes.TEXT,
		    
		}, 
		
		image_id: {
	    	type : DataTypes.UUID
	    },
	    
	    icon: {
		    type : DataTypes.STRING
		},
		slug: {
		    type : DataTypes.STRING(50)
		}
	  
	}, 
  
	{
    	classMethods: {
			associate: function(models) {
        // associations can be defined here
      }
    }
  });
  
  
  return Activity;
};
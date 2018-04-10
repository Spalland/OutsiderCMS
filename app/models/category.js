'use strict';
module.exports = function(sequelize, DataTypes) {
  	var Category = sequelize.define('Category', {
	  	
    	title: {
	    	type : DataTypes.STRING
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
	return Category;
};
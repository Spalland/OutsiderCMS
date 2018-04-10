'use strict';
module.exports = function(sequelize, DataTypes) {
	var CroppedImage = sequelize.define('CroppedImage', {
	  
	    filename: {
		    type: DataTypes.STRING,
		    allowNull:false
		},
		  
	    aspectRatio: {
		    type: DataTypes.FLOAT
		},
	
		  
	    caption: {
		    type: DataTypes.STRING
		},
		  
	    owner: {
		    type: DataTypes.UUID,
		    allowNull:false
		},
		
		original_image_id: {
		    type: DataTypes.UUID,
		    allowNull:false
		}
		
	  
	}, 
	{
    	classMethods: {
			associate: function(models) {
				// associations can be defined here
      		}
		}
	});
  

 
	return CroppedImage;
  
  
};
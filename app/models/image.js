'use strict';
module.exports = function(sequelize, DataTypes) {
  var Image = sequelize.define('Image', {
	  
    filename: {
	    type: DataTypes.STRING,
	    allowNull:false
	  },
	  
    original_filename: {
	    type: DataTypes.STRING,
	    allowNull:false 
	  },
	  
    aspectRatio: {
	    type: DataTypes.FLOAT
	  },
	  
    title: {
	    type: DataTypes.STRING,
	    default:"Outsider Guide - Adventure Lifestyle"
	  },
	  
    caption: {
	    type: DataTypes.STRING
	  },
	  
    uploader_id: {
	    type: DataTypes.UUID,
	    allowNull:false
	},
	  
	quantityLandscapeCrop: {
		type: DataTypes.INTEGER,
		default: 0
	},
	
	quantitySquareCrop: { 
		type: DataTypes.INTEGER,
		default: 0
	}
	
	  
  }, 
  
  {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  

  
  return Image;
  
  
};
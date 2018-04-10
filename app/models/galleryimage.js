'use strict';
module.exports = function(sequelize, DataTypes) {
  var GalleryImage = sequelize.define('GalleryImage', {
    
    gallery_id: {
    	type: DataTypes.UUID,
    	allowNull:false
    },
    
    image_id: {
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
  return GalleryImage;
};
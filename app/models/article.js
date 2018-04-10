'use strict';
module.exports = function(sequelize, DataTypes) {
	var Article = sequelize.define('Article', {
	  
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
		  
	    body: {
		    type : DataTypes.TEXT,
		    
		},
		  
	    category: {
		    field: "category_id",
		    type : DataTypes.INTEGER
		},
		  
	    image_id: {
	    	type : DataTypes.UUID
	    },
	    
	    gallery_id: {
		    type : DataTypes.UUID
		},
	    
	    publish_date: { 
		    type: DataTypes.DATE
		},
		  
	    writer_id: {
		    type : DataTypes.UUID
		},
		  
	    publisher_id: {
		    type: DataTypes.UUID
		}, 
		status: { 
			type: DataTypes.ENUM('Draft', 'Submitted', 'Approved', 'Rejected', 'Published', 'Deleted')
		}, 
		slug: { 
			type: DataTypes.STRING
		}, 
		activity: { 
			field: "activity_id",
			type: DataTypes.UUID
		},
		featured: { 
			type: DataTypes.BOOLEAN
		},
		video: { 
			type: DataTypes.STRING
		}, 
		views: { 
			type: DataTypes.INTEGER
			
		},
		byline: { 
			type: DataTypes.STRING(150)
			
		},
		subscription: { 
			type: DataTypes.BOOLEAN
		}
	  
	}, 
  
	{
    	classMethods: {
			associate: function(models) {
        // associations can be defined here
      }
    }
  });
  
  
  return Article;
};
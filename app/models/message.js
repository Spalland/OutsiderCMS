'use strict';
module.exports = function(sequelize, DataTypes) {
  var Message = sequelize.define('Message', {
	  
  	read_status: { 
	  	type	: DataTypes.BOOLEAN,
	  	default	: false 
  	},
    
    message_type: { 
	    type	: DataTypes.ENUM('contact','pm','bulletin')
	    
    },
	  
    body: {
	    type: DataTypes.TEXT,
	    validate: { 
		    notEmpty: { 
		      args	: true, 
		      msg	: "Message can't be blank"
	      }
	    }
	 },
	  
    sender_id: {
	    type: DataTypes.UUID
	},
	recipient_id: {
	    type: DataTypes.UUID
	}
	  
  }, 
  
  {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  

  
  return Message;
  
  
};
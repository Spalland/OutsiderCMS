'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    
	    return queryInterface.addColumn('Users', 'reset_token_expiry', { 
		  
		type:Sequelize.DATE  
	 	});
   
  },

  down: function (queryInterface, Sequelize) {
    	return queryInterface.removeColumn('Users', 'reset_token_expiry');
  }
};

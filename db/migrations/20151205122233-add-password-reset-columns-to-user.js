'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn('Users', 'reset_token', { 
	    
	    type:Sequelize.STRING
    });
    
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn('Users', 'reset_token');
  
  }
};

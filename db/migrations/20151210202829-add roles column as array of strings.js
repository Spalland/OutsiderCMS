'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn('Users', 'role', { 
		  
		type:Sequelize.ARRAY(Sequelize.STRING),
		default: ['Users'] 
		});
  },

  down: function (queryInterface, Sequelize) {
  	return queryInterface.removeColumn('Users', 'role');
  }
};

'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn('Users', 'role');
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.addColumn('Users', 'role', { 
		  
		type:Sequelize.STRING,
		default: 'Users,' 
	 	});
  }
};

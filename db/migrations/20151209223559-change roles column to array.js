'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
     return queryInterface.changeColumn('Users', 'role', { 
		  
		type:Sequelize.STRING,
		default: 'Users,' 
	 	});
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.changeColumn('Users', 'role', { 
		  
		type:Sequelize.INTEGER,
		default:0
	 	});
  }
};

'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.changeColumn('Users', 'password', 
    {
	    allowNull: false,
	    type:Sequelize.STRING
	  });
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.changeColumn('Users', 'password', 
    {
	    allowNull: true,
	    type:Sequelize.STRING
	  });
  }
};

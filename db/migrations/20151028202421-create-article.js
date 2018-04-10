'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('Articles', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      title: {
        type: Sequelize.STRING,
        allowNull:false
      },
      body: {
        type: Sequelize.TEXT,
        allowNull:false 
      },
      category_id: {
        type: Sequelize.INTEGER,
        allowNull:false
      },
      image_id: {
        type: Sequelize.INTEGER
      },
      gallery_id: {
        type: Sequelize.INTEGER
      },
      publish_date: {
        type: Sequelize.DATE
      },
      writer_id: {
        type: Sequelize.INTEGER
      },
      publisher_id: {
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: function(queryInterface, Sequelize) {
    return queryInterface.dropTable('Articles');
  }
};
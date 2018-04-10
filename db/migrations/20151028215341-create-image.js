'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('Images', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      filename: {
        type: Sequelize.STRING,
        allowNull:false
      },
      original_filename: {
        type: Sequelize.STRING,
        allowNull:false
      },
      is_portrait: {
        type: Sequelize.BOOLEAN,
        allowNull:false
      },
      title: {
        type: Sequelize.STRING,
        default:"Untitled"
      },
      caption: {
        type: Sequelize.STRING
      },
      uploader_id: {
        type: Sequelize.INTEGER,
        allowNull:false
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
    return queryInterface.dropTable('Images');
  }
};
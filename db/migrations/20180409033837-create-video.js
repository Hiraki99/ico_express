'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Videos', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      video_title: {
        type: Sequelize.TEXT
      },
      video_description: {
        type: Sequelize.TEXT
      },
      video_link: {
        type: Sequelize.TEXT
      },
      status: {
        type: Sequelize.TEXT
      },
      createdate: {
        type: Sequelize.DATE
      },
      admin_id: {
        type: Sequelize.INTEGER
      },
      admin_name: {
        type: Sequelize.TEXT
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
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Videos');
  }
};
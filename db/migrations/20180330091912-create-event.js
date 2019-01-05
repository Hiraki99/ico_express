'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Events', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      date_start: Sequelize.DATE,
      date_end: Sequelize.DATE,
      date_create: Sequelize.DATE,
      title: Sequelize.TEXT,
      content:Sequelize.TEXT,
      description:Sequelize.TEXT,
      status:Sequelize.TEXT,
      url_image:Sequelize.TEXT,
      admin_id:Sequelize.INTEGER,
      admin_name:Sequelize.TEXT,
      amount: Sequelize.INTEGER,
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW')
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Events');
  }
};
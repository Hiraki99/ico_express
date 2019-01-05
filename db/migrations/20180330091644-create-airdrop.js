'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Airdrops', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      title: {
        type: Sequelize.TEXT
      },
      content: {
        type: Sequelize.TEXT
      },
      link: {
        type: Sequelize.TEXT
      },
      level: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      is_locked: {
        type: Sequelize.INTEGER
      },
      bonus: {
        type: Sequelize.INTEGER,
        defaultValue:0
      },
      admin_id: {
        type: Sequelize.INTEGER
      },
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
    return queryInterface.dropTable('Airdrops');
  }
};
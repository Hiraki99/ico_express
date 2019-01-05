'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Admins', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      username: {
        type: Sequelize.TEXT
      },
      password: {
        type: Sequelize.TEXT
      },
      password_contract: {
        allowNull: true,
        type: Sequelize.TEXT,
        defaultValue: null
      },
      nickname: {
        type: Sequelize.TEXT
      },
      email: {
        type: Sequelize.TEXT
      },
      type: {
        type: Sequelize.TEXT
      },
      is_locked:{
        type:Sequelize.INTEGER,
        defaultValue:1
      },
      address:{
        type:Sequelize.TEXT
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
    return queryInterface.dropTable('Admins');
  }
};
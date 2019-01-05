'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Configs', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      address_contract_unlocked: {
        type: Sequelize.TEXT
      },
      address_contract_locked: {
        type: Sequelize.TEXT
      },
      date_preico: {
        type: Sequelize.INTEGER
      },
      date_preico_end: {
        type: Sequelize.INTEGER
      },
      date_ico_1: {
        type: Sequelize.INTEGER
      },
      date_ico_2: {
        type: Sequelize.INTEGER
      },
      date_ico_3: {
        type: Sequelize.INTEGER
      },
      date_ico_end: {
        type: Sequelize.INTEGER
      },
      release_date: {
        type: Sequelize.INTEGER
      },
      time_cycle: {
        type: Sequelize.INTEGER
      },
      current_token: {
        type: Sequelize.DOUBLE
      },
      price_token_ico_lock: {
        type: Sequelize.DOUBLE
      },
      price_token_ico_unlock: {
        type: Sequelize.DOUBLE
      },
      price_token_preico_lock: {
        type: Sequelize.DOUBLE
      },
      price_token_preico_unlock: {
        type: Sequelize.DOUBLE
      },
      price_token_current: {
        type: Sequelize.DOUBLE
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
    return queryInterface.dropTable('Configs');
  }
};
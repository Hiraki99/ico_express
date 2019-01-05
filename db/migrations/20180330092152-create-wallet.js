'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Wallets', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      address: Sequelize.TEXT,
      total_unlocked_token: Sequelize.DOUBLE,
      total_locked_token: Sequelize.DOUBLE,
      total_token: Sequelize.DOUBLE,
      total_eth: Sequelize.DOUBLE,
      total_bonus_ico: Sequelize.DOUBLE,
      bonus_vip_preIco:Sequelize.DOUBLE,
      bonus_vip_ico:Sequelize.DOUBLE,
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
    return queryInterface.dropTable('Wallets');
  }
};
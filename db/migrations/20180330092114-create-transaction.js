'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Transactions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      nonce: Sequelize.INTEGER,
      time_stamp: Sequelize.INTEGER,
      hash:Sequelize.TEXT,
      from:Sequelize.TEXT,
      to:Sequelize.TEXT,
      value:Sequelize.DOUBLE,
      contractAddress:Sequelize.TEXT,
      type: Sequelize.TEXT,
      currency: Sequelize.TEXT,
      token_tranfer: Sequelize.TEXT,
      wallet_id: Sequelize.INTEGER,
      admin_id:Sequelize.INTEGER,
      status:Sequelize.TEXT,
      input:Sequelize.TEXT,
      fee: Sequelize.DOUBLE,
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
    return queryInterface.dropTable('Transactions');
  }
};
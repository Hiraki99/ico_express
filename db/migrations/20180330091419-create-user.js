'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      username: Sequelize.TEXT,
      password: Sequelize.TEXT,
      wallet_id: Sequelize.INTEGER,
      bonus_id: Sequelize.INTEGER,
      is_actived: Sequelize.INTEGER,
      is_locked:{
        type:Sequelize.INTEGER,
        defaultValue:0
      },
      kyc_id: Sequelize.INTEGER,
      enable_auth:Sequelize.INTEGER,
      email : Sequelize.TEXT,
      total_bonus_referal:{
        type:Sequelize.INTEGER,
        defaultValue:0
      },
      total_bonus_airdrop:{
        type:Sequelize.INTEGER,
        defaultValue:0
      },
      amount_member_referal:{
        type:Sequelize.INTEGER,
        defaultValue:0
      },
      referal_parent_id:{
        type:Sequelize.INTEGER,
        defaultValue:0
      },
      is_send_bonus_referal:{
        type:Sequelize.INTEGER,
        defaultValue:0
      },
      key_twoFa:Sequelize.TEXT,
      key_referal : Sequelize.TEXT,
      key_verify : Sequelize.TEXT,
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
    return queryInterface.dropTable('Users');
  }
};
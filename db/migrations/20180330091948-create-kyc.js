'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('KYCs', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: Sequelize.TEXT,
      phone: Sequelize.TEXT,
      national:Sequelize.TEXT,
      passport_number_id: Sequelize.TEXT,
      status: Sequelize.TEXT,
      createdate: Sequelize.DATE,
      type:Sequelize.INTEGER,
      url_img_back: Sequelize.TEXT,
      url_img_behind:Sequelize.TEXT,
      url_img_all:Sequelize.TEXT,
      error_verify : Sequelize.TEXT,
      admin_id: Sequelize.INTEGER,
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
    return queryInterface.dropTable('KYCs');
  }
};
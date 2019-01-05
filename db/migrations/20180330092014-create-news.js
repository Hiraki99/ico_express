'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('News', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      title: Sequelize.TEXT,
      description: Sequelize.TEXT,
      content:Sequelize.TEXT,
      url_image:Sequelize.TEXT,
      admin_id:Sequelize.INTEGER,
      createdate:Sequelize.DATE,
      category:Sequelize.TEXT,
      keyword: Sequelize.TEXT,
      meta_description: Sequelize.TEXT,
      status: Sequelize.TEXT,
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
    return queryInterface.dropTable('News');
  }
};
'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Advisors', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.TEXT
      },
      url_img: {
        type: Sequelize.TEXT
      },
      information: {
        type: Sequelize.TEXT
      },
      description: {
        type: Sequelize.TEXT
      },
      admin_id : Sequelize.INTEGER,
      admin_name: Sequelize.TEXT,
      createdate : Sequelize.DATE,
      status: Sequelize.TEXT,
      linkedin:Sequelize.TEXT,
      facebook:Sequelize.TEXT,
      twitter:Sequelize.TEXT,
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
    return queryInterface.dropTable('Advisors');
  }
};
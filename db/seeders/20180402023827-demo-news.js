'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('News', [{
      id:1,
      title: "unibot start preico",
      description: 'unibot start preico',
      content:'',
      url_image:'',
      admin_id:1,
      createdate:new Date(),
      category:'preico',
      keyword: 'preico',
      meta_description: 'Sequelize.TEXT',
      status: 'enable',
    },{
      id:2,
      title: "unibot end preico",
      description: 'unibot end preico',
      content:'',
      url_image:'',
      admin_id:1,
      createdate:new Date(),
      category:'preico',
      keyword: 'preico',
      meta_description: 'Sequelize.TEXT',
      status: 'enable',
    },{
      id:3,
      title: "unibot start ico",
      description: 'unibot start ico',
      content:'',
      url_image:'',
      admin_id:1,
      createdate:new Date(),
      category:'ico',
      keyword: 'ico',
      meta_description: 'Sequelize.TEXT',
      status: 'enable',
    }], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('News', null, {});
  }
};

'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Advisors', [{
      id:1,
      name:'Khoa Adam',
      url_img: "",
      information: "Giam doc tinh dau chau au",
      description: "Giam doc tinh dau chau au",
      admin_id : 2,
      admin_name: "thinhphoho",
      createdate : "01-10-1994",
      status: 'enable',
      linkedin: "https://dasjdasjn",
      facebook: "https://dasjdasjn",
      twitter: "https://dasjdasjn"
    }], {});
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Advisors', null, {});
  }
};

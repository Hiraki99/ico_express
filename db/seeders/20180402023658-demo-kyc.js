'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    // return queryInterface.bulkInsert('KYCs', [{
    //   id:1,
    //   name: 'Vu Xuan Huy',
    //   phone: '01658999537',
    //   national:'Viet Nam',
    //   passport_number_id: '125490994',
    //   status: 'Success',
    //   type:1,
    //   url_img_back: '',
    //   url_img_behind:'',
    //   url_img_all:'',
    //   error_verify: 'true'
    // },{
    //   id:2,
    //   name: 'Nguyen Ngoc Thinh',
    //   phone: '01658999537',
    //   national:'Viet Nam',
    //   passport_number_id: '125490994',
    //   status: 'Completed',
    //   type:2,
    //   url_img_back: '',
    //   url_img_behind:'',
    //   url_img_all:'',
    //   error_verify : ''
    // }], {});
  },

  down: (queryInterface, Sequelize) => {
    // return queryInterface.bulkDelete('KYCs', null, {});

  }
};

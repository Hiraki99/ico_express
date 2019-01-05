'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Admins', [{
      id:1,
      username: 'vxhuy',
      password: '06e8f57af12628b3a328c8cd340e6795',
      password_contract: '06e8f57af12628b3a328c8cd340e6795',
      nickname: 'huy admin',
      email: 'vxhuy17694@gmail.com',
      address: "0x46e3A2DE67Fd3E3ffEc32d6C6f56C95090435299",
      type: 'Root',
      is_locked: 0
    }], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Admins', null, {});
  }
};

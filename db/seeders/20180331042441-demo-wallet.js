'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    // return queryInterface.bulkInsert('Wallets', [{
    //   id:1,
    //   address: "0xa1af791asf1afs1faf2ga1q2801afd",
    //   total_unlocked_token: 3000000,
    //   total_locked_token: 2000000,
    //   total_token: 5000000,
    //   total_eth: 100,
    //   ico_id: 0,
    //   total_bonus_ico:1000,
    //   preico_id: 2
    // },{
    //   id:2,
    //   address: "0xa1af791asf32121a1qaffaas2801afd",
    //   total_unlocked_token: 1000000,
    //   total_locked_token: 1000000,
    //   total_token: 2000000,
    //   total_eth: 50,
    //   total_bonus_ico:10200,
    //   ico_id: 3,
    //   preico_id: 4
    // }], {});
  },

  down: (queryInterface, Sequelize) => {
    // return queryInterface.bulkDelete('Wallets', null, {});
  }
};

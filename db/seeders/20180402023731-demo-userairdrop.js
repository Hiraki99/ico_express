'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    // return queryInterface.bulkInsert('UserAirdrops', [{
    //   id:1,
    //   user_id: 1,
    //   airdrop_id: 1,
    //   value: 1,
    //   status: 'Completed'
    // },{
    //   id:2,
    //   user_id: 1,
    //   airdrop_id: 2,
    //   value: 1,
    //   status: 'Processing'
    // },{
    //   id:3,
    //   user_id: 1,
    //   airdrop_id: 3,
    //   value: 1,
    //   status: 'Completed'
    // },{
    //   id:4,
    //   user_id: 1,
    //   airdrop_id: 4,
    //   value: 1,
    //   status: 'Processing'
    // }], {});
  },

  down: (queryInterface, Sequelize) => {
    // return queryInterface.bulkDelete('UserAirdrops', null, {});
  }
};

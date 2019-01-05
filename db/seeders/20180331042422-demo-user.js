'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    // return queryInterface.bulkInsert("Users",[
    //   {
    //     id:1,
    //     username: "vxhuy",
    //     password: "06e8f57af12628b3a328c8cd340e6795",
    //     wallet_id: 1,
    //     bonus_id: 1,
    //     is_actived: 1,
    //     kyc_id: 1,
    //     is_locked:0,
    //     total_bonus_referal:1000000,
    //     total_bonus_airdrop:100,
    //     enable_auth:1,
    //     amount_member_referal:0,
    //     email : 'vxhuy@gmail.com',
    //     key_twoFa:'21323213123',
    //     key_referal : '123213123123',
    //     key_verify : 'dsdasdasd'
    //   },
    //   {
    //     id:2,
    //     username: "thinh102",
    //     password: "06e8f57af12628b3a328c8cd340e6795",
    //     wallet_id: 0,
    //     bonus_id: 2,
    //     is_actived: 1,
    //     is_locked:0,
    //     kyc_id: 2,
    //     total_bonus_airdrop:1000000,
    //     total_bonus_referal:0,
    //     amount_member_referal:0,
    //     enable_auth:1,
    //     email : 'thinhphoho01@gmail.com',
    //     key_twoFa: '12312312321',
    //     key_referal : 'cscscasczxcx',
    //     key_verify : 'dsdqetasdasd'
    //   },
    //   {
    //     id:3,
    //     username: "thinhphoho",
    //     password: "06e8f57af12628b3a328c8cd340e6795",
    //     wallet_id: 2,
    //     bonus_id: 2,
    //     is_actived: 1,
    //     amount_member_referal:0,
    //     total_bonus_airdrop:1000000,
    //     total_bonus_referal:0,
    //     is_locked:0,
    //     kyc_id: 2,
    //     enable_auth:0,
    //     email : 'thinh.bka.bn@gmail.com',
    //     key_twoFa: '12312312321',
    //     key_referal : 'cscscasczxcx',
    //     key_verify : 'dsdqetasdasd'
    //   }
    // ],{});
  },

  down: (queryInterface, Sequelize) => {
    // return queryInterface.bulkDelete('Users', null, {});
  }
};

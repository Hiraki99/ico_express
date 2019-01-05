'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    // return queryInterface.bulkInsert('Transactions', [{
    //   id:1,
    //   nonce: 2,
    //   time_stamp: 1522342810,
    //   hash:'0xf4270622283218cbeb0b28df3c91c63f2b14f9e99b1f6bc8fd897774b3813f5d',
    //   from:'0xfce2a8527953e081194c1fbac96c424bd768bc28',
    //   to:'0x29d5527caa78f1946a409fa6acaf14a0a4a0274b',
    //   value:0.12153252,
    //   contractAddress:'0x7a65f7a87d898e8988a9u998ff87aafd7',
    //   type: 1,
    //   currency:'UNI',
    //   token_tranfer: '',
    //   wallet_id: 1,
    // },{
    //   id:2,
    //   nonce: 3,
    //   time_stamp: 1523466100,
    //   hash:'0xf4270622283218cbeb0b28df3c91c63f2b14f9e99b1f6bc8fd897774b3813f5d',
    //   from:'0xfce2a8527953e081194c1fbac96c424bd768bc28',
    //   to:'0x29d5527caa78f1946a409fa6acaf14a0a4a0274b',
    //   value:0.12153252,
    //   contractAddress:'0x7a65f7a87d89ssaf988a9u998ff87add2',
    //   type: 0,
    //   currency:'UNI',
    //   token_tranfer: '',
    //   wallet_id: 1,
    // },{
    //   id:4,
    //   nonce: 5,
    //   time_stamp: 1522342811,
    //   hash:'0xf4270622283218cbeb0b28df3c91c63f2b14f9e99b1f6bc8fd897774b3813f5d',
    //   from:'0xfce2a8527953e081194c1fbac96c424bd768bc28',
    //   to:'0x29d5527caa78f1946a409fa6acaf14a0a4a0274b',
    //   value:0.12153252,
    //   contractAddress:'0x7a65f7a87d898e8988a9u998ff87aafd7',
    //   type: 1,
    //   currency:'UNI',
    //   token_tranfer: '',
    //   wallet_id: 1,
    // },{
    //   id:5,
    //   nonce: 6,
    //   time_stamp: 1644767478,
    //   hash:'0xf4270622283218cbeb0b28df3c91c63f2b14f9e99b1f6bc8fd897774b3813f5d',
    //   from:'0xfce2a8527953e081194c1fbac96c424bd768bc28',
    //   to:'0x29d5527caa78f1946a409fa6acaf14a0a4a0274b',
    //   value:0.12153252,
    //   contractAddress:'0x7a65f7a87d898e8988a9u998ff87aafd7',
    //   type: 1,
    //   currency:'UNI',
    //   token_tranfer: '',
    //   wallet_id: 1,
    // },{
    //   id:6,
    //   nonce: 7,
    //   time_stamp: 1524675900,
    //   hash:'0xf4270622283218cbeb0b28df3c91c63f2b14f9e99b1f6bc8fd897774b3813f5d',
    //   from:'0xfce2a8527953e081194c1fbac96c424bd768bc28',
    //   to:'0x29d5527caa78f1946a409fa6acaf14a0a4a0274b',
    //   value:0.12153252,
    //   contractAddress:'',
    //   type: 1,
    //   currency:'UNI',
    //   token_tranfer: '',
    //   wallet_id: 1,
    // }], {});
  },

  down: (queryInterface, Sequelize) => {
    // return queryInterface.bulkDelete('Transactions', null, {});
  }
};

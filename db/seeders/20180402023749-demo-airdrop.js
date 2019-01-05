'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Airdrops', [{
      id:1,
      title: 'Add Wallet Address',
      content: 'You must add wallet address to join in the ico',
      link: '/wallet',
      level:1,
      is_locked: 0,
      bonus: 100,
      admin_id: 1
    },
    {
      id:2,
      title: 'Completely KYC',
      content: 'You must completely KYC to buy token in the ico',
      link: '/dashboard/kyc',
      level:1,
      is_locked: 0,
      bonus: 100,
      admin_id: 1
    },
    {
      id:3,
      title: 'Referal 1 person',
      content: 'You can referal for 1 person to receive my gift (condition: that person have bought token in the preico or ico)',
      link: '/dashboard/referal',
      level:2,
      is_locked: 0,
      bonus: 50,
      admin_id: 1
    },
    {
      id:4,
      title: 'Referal 10 person',
      content: 'You can referal for 10 person to receive my gift (condition: that person have bought token in the preico or ico)',
      link: '/dashboard/referal',
      level:2,
      is_locked: 0,
      bonus: 750,
      admin_id: 1
    },{
      id:5,
      title: 'Referal 100 person',
      content: 'You can referal for 100 person to receive my gift (condition: that person have bought token in the preico or ico)',
      link: '/dashboard/referal',
      level:2,
      is_locked: 0,
      bonus: 10000,
      admin_id: 1
    },{
      id:6,
      title: 'Referal 500 person',
      content: 'You can referal for 500 person to receive my gift (condition: that person have bought token in the preico or ico)',
      link: '/dashboard/referal',
      level:2,
      is_locked: 0,
      bonus: 100000,
      admin_id: 1
    },{
      id:7,
      title: 'Referal 1000 person',
      content: 'You can referal for 1000 person to receive my gift (condition: that person have bought token in the preico or ico)',
      link: '/dashboard/referal',
      level:2,
      is_locked: 0,
      bonus: 250000,
      admin_id: 1
    },{
      id:8,
      title: 'Referal 1500 person',
      content: 'You can referal for 1500 person to receive my gift (condition: that person have bought token in the preico or ico)',
      link: '/dashboard/referal',
      level:2,
      is_locked: 0,
      bonus: 550000,
      admin_id: 1
    }], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Airdrops', null, {});
  }
};

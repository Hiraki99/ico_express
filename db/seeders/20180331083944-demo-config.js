'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Configs', [{
      id: 1,
      address_contract_unlocked: "0x32e06083f3a2ebd84480d6ad0949abb36033394c",
      address_contract_locked: "0xd180720d9c04483ba4d2e2821ec05485ccff2739",
      date_preico: 1525107600,
      date_preico_end: 1526835600, 
      date_ico_1: 1526835601, 
      date_ico_2: 1527181200, 
      date_ico_3: 1527613200, 
      date_ico_end: 1530377999,
      release_date: 1521287880,
      time_cycle: 30000,
      current_token: 1450000000,
      price_token_ico_lock: 0.00082,
      price_token_ico_unlock: 0.0009,
      price_token_preico_lock: 0.00052,
      price_token_preico_unlock: 0.00066,
      price_token_current: 1
    }], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Configs', null, {});
  }
};

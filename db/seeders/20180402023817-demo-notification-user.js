'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    // return queryInterface.bulkInsert('NotificationUsers', [{
    //   id:1,
    //   user_id: 1,
    //   notification_id: 1,
    //   is_viewed:0
    // },{
    //   id:2,
    //   user_id: 1,
    //   notification_id: 2,
    //   is_viewed:0
    // },{
    //   id:3,
    //   user_id: 1,
    //   notification_id: 3,
    //   is_viewed:1
    // },{
    //   id:4,
    //   user_id: 1,
    //   notification_id: 4,
    //   is_viewed:1
    // },{
    //   id:5,
    //   user_id: 2,
    //   notification_id: 1,
    //   is_viewed:0
    // },{
    //   id:6,
    //   user_id: 2,
    //   notification_id: 2,
    //   is_viewed:1
    // }], {});
  },

  down: (queryInterface, Sequelize) => {
    // return queryInterface.bulkDelete('NotificationUsers', null, {});
  }
};

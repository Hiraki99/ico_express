'use strict';
module.exports = (sequelize, DataTypes) => {
  var NotificationUser = sequelize.define('NotificationUser', {
    user_id: DataTypes.INTEGER,
    notification_id: DataTypes.INTEGER,
    is_viewed:DataTypes.INTEGER
  }, {});
  NotificationUser.associate = function(models) {
    // associations can be defined here
    NotificationUser.belongsTo(models.Notification,{foreignKey:'notification_id',through: {
      model: 'Notification',
      unique: false
  }, constraints: false},);
    NotificationUser.belongsTo(models.User,{foreignKey:'user_id',through: {
      model: 'User',
      unique: false
  } ,constraints: false});
  };
  return NotificationUser;
};
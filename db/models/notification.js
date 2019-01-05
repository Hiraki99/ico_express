'use strict';
module.exports = (sequelize, DataTypes) => {
  var Notification = sequelize.define('Notification', {
    title: DataTypes.TEXT,
    description: DataTypes.TEXT,
    link: DataTypes.TEXT,
    url_img: DataTypes.TEXT,
    admin_id: DataTypes.INTEGER,
    date: DataTypes.DATE
  }, {});
  Notification.associate = function(models) {
    // associations can be defined here
    Notification.hasMany(models.NotificationUser,{foreignKey:'notification_id'});
    Notification.belongsTo(models.Admin,{foreignKey:'admin_id'});
  };
  return Notification;
};
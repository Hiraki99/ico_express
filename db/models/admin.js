'use strict';

module.exports = (sequelize, DataTypes) => {
  var Admin = sequelize.define('Admin', {
    username: DataTypes.TEXT,
    password: DataTypes.TEXT,
    password_contract: DataTypes.TEXT,
    nickname: DataTypes.TEXT,
    email: DataTypes.TEXT,
    type: DataTypes.TEXT,
    is_locked: DataTypes.INTEGER,
    address: DataTypes.TEXT
  }, {});
  Admin.associate = function(models) {
    // associations can be defined here
    Admin.hasMany(models.News,{foreignKey:"admin_id"});
    Admin.hasMany(models.Event,{foreignKey:"admin_id"});
    Admin.hasMany(models.Advisor,{foreignKey:"admin_id"});
    Admin.hasMany(models.Notification,{foreignKey:"admin_id"});
    Admin.hasMany(models.Airdrop,{foreignKey:"admin_id"});
    Admin.hasMany(models.KYC,{foreignKey:"admin_id"});
    Admin.hasMany(models.Transaction,{foreignKey:"admin_id"});
  };
  return Admin;
};
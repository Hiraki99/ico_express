'use strict';
module.exports = (sequelize, DataTypes) => {
  var Wallet = sequelize.define('Wallet', {
    address: DataTypes.TEXT,
    total_unlocked_token: DataTypes.DOUBLE,
    total_locked_token: DataTypes.DOUBLE,
    total_token: DataTypes.DOUBLE,
    total_eth: DataTypes.DOUBLE,
    total_bonus_ico: DataTypes.DOUBLE,
    bonus_vip_preIco: DataTypes.DOUBLE,
    bonus_vip_ico: DataTypes.DOUBLE
  }, {});
  Wallet.associate = function (models) {
    // associations can be defined here
    Wallet.hasMany(models.Transaction, { foreignKey: 'wallet_id' });
    Wallet.hasOne(models.User, { foreignKey: 'wallet_id' });
  };
  return Wallet;
};
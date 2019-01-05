'use strict';
module.exports = (sequelize, DataTypes) => {
  var Config = sequelize.define('Config', {
    address_contract_unlocked: DataTypes.TEXT,
    address_contract_locked: DataTypes.TEXT,
    date_preico: DataTypes.INTEGER,
    date_preico_end: DataTypes.INTEGER,
    date_ico_1: DataTypes.INTEGER,
    date_ico_2: DataTypes.INTEGER,
    date_ico_3: DataTypes.INTEGER,
    date_ico_end: DataTypes.INTEGER,
    current_token: DataTypes.DOUBLE,
    release_date: DataTypes.INTEGER,
    time_cycle: DataTypes.INTEGER,
    price_token_ico_lock: DataTypes.DOUBLE,
    price_token_ico_unlock: DataTypes.DOUBLE,
    price_token_preico_lock: DataTypes.DOUBLE,
    price_token_preico_unlock: DataTypes.DOUBLE,
    price_token_current: DataTypes.DOUBLE
  }, {});
  Config.associate = function(models) {
    // associations can be defined here
  };
  return Config;
};
'use strict';
module.exports = (sequelize, DataTypes) => {
  var User = sequelize.define('User', {
    username: DataTypes.TEXT,
    password: DataTypes.TEXT,
    wallet_id: DataTypes.INTEGER,
    bonus_id: DataTypes.INTEGER,
    is_actived: DataTypes.INTEGER,
    is_locked: DataTypes.INTEGER,
    kyc_id: DataTypes.INTEGER,
    enable_auth: DataTypes.INTEGER,
    email: DataTypes.TEXT,
    total_bonus_referal: DataTypes.INTEGER,
    total_bonus_airdrop: DataTypes.INTEGER,
    amount_member_referal: DataTypes.INTEGER,
    referal_parent_id: DataTypes.INTEGER,
    is_send_bonus_referal: DataTypes.INTEGER,
    key_twoFa: DataTypes.TEXT,
    key_referal : DataTypes.TEXT,
    key_verify : DataTypes.TEXT
  }, {});
  User.associate = function(models) {
    // associations can be defined here
    User.belongsTo(models.KYC,{foreignKey:'kyc_id'});
    User.belongsTo(models.Wallet,{foreignKey:'wallet_id'});
    User.hasMany(models.NotificationUser,{foreignKey:'user_id'});
    User.hasMany(models.UserAirdrop,{foreignKey:'user_id'});
  };
  return User;
};
'use strict';
module.exports = (sequelize, DataTypes) => {
  var UserAirdrop = sequelize.define('UserAirdrop', {
    user_id: DataTypes.INTEGER,
    airdrop_id: DataTypes.INTEGER,
    value: DataTypes.INTEGER,
    status: DataTypes.TEXT
  }, {});
  UserAirdrop.associate = function(models) {
    // associations can be defined here
    UserAirdrop.belongsTo(models.Airdrop,{foreignKey:'airdrop_id',through: {
      model: 'Airdrop',
      unique: false
    }, constraints: false});
    UserAirdrop.belongsTo(models.User,{foreignKey:'user_id',through: {
      model: 'User',
      unique: false
    }, constraints: false});

  };
  return UserAirdrop;
};
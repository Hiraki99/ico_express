'use strict';
module.exports = (sequelize, DataTypes) => {
  var Airdrop = sequelize.define('Airdrop', {
    title: DataTypes.TEXT,
    content: DataTypes.TEXT,
    link: DataTypes.TEXT,
    level:DataTypes.INTEGER,
    is_locked: DataTypes.INTEGER,
    bonus: DataTypes.INTEGER,
    admin_id: DataTypes.INTEGER
  }, {});
  Airdrop.associate = function(models) {
    // associations can be defined here
    Airdrop.hasMany(models.UserAirdrop,{foreignKey:"airdrop_id"});
    Airdrop.belongsTo(models.Admin,{foreignKey:"admin_id"});
  };
  return Airdrop; 
};
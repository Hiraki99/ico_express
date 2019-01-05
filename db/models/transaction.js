'use strict';
module.exports = (sequelize, DataTypes) => {
  var Transaction = sequelize.define('Transaction', {
    nonce: DataTypes.INTEGER,
    time_stamp: DataTypes.INTEGER,
    hash:DataTypes.TEXT,
    from:DataTypes.TEXT,
    to:DataTypes.TEXT,
    value:DataTypes.DOUBLE,
    contractAddress:DataTypes.TEXT,
    status: DataTypes.TEXT,
    fee: DataTypes.DOUBLE,
    input: DataTypes.TEXT,
    type: DataTypes.TEXT,
    currency: DataTypes.TEXT,
    token_tranfer: DataTypes.TEXT,
    wallet_id: DataTypes.INTEGER,
    admin_id: DataTypes.INTEGER
  }, {});
  Transaction.associate = function(models) {
    // associations can be defined here
    Transaction.belongsTo(models.Wallet,{foreignKey:'wallet_id',through: {
      model: 'Wallet',
      unique: false
    }, constraints: false});
    Transaction.belongsTo(models.Admin,{foreignKey:'admin_id',through: {
      model: 'Admin',
      unique: false
    }, constraints: false});
  };
  return Transaction;
};
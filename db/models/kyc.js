'use strict';
module.exports = (sequelize, DataTypes) => {
  var KYC = sequelize.define('KYC', {
    name: DataTypes.TEXT,
    phone: DataTypes.TEXT,
    national:DataTypes.TEXT,
    passport_number_id: DataTypes.TEXT,
    status: DataTypes.TEXT, //0:None, 1:Processing, 2:Waiting, 3:Completed
    createdate: DataTypes.DATE,
    type:DataTypes.INTEGER,
    url_img_back: DataTypes.TEXT,
    url_img_behind:DataTypes.TEXT,
    url_img_all:DataTypes.TEXT,
    error_verify: DataTypes.TEXT,
    admin_id: DataTypes.INTEGER
  }, {});
  KYC.associate = function(models) {
    // associations can be defined here
    KYC.hasOne(models.User,{foreignKey:'kyc_id'});
    KYC.belongsTo(models.Admin,{foreignKey:'admin_id'});
  };
  return KYC;
};
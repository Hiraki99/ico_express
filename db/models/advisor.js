'use strict';
module.exports = (sequelize, DataTypes) => {
  var Advisor = sequelize.define('Advisor', {
    name       : DataTypes.TEXT,
    url_img    : DataTypes.TEXT,
    information: DataTypes.TEXT,
    description: DataTypes.TEXT,
    admin_id   : DataTypes.INTEGER,
    admin_name : DataTypes.TEXT,
    createdate : DataTypes.DATE,
    status     : DataTypes.TEXT,
    linkedin   : DataTypes.TEXT,
    facebook   : DataTypes.TEXT,
    twitter    : DataTypes.TEXT
  }, {});
  Advisor.associate = function(models) {
    // associations can be defined here
    Advisor.belongsTo(models.Admin,{foreignKey:'admin_id'});
  };
  return Advisor;
};
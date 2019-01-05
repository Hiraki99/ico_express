'use strict';
module.exports = (sequelize, DataTypes) => {
  var Event = sequelize.define('Event', {
    date_start: DataTypes.DATE,
    date_end: DataTypes.DATE,
    date_create: DataTypes.DATE,
    title: DataTypes.TEXT,
    content:DataTypes.TEXT,
    description:DataTypes.TEXT,
    status:DataTypes.TEXT,
    url_image:DataTypes.TEXT,
    admin_id:DataTypes.INTEGER,
    admin_name: DataTypes.TEXT,
    amount: DataTypes.INTEGER
  }, {});
  Event.associate = function(models) {
    // associations can be defined here
    Event.belongsTo(models.Admin,{foreignKey:"admin_id"});
  };
  return Event;
};
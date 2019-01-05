'use strict';
module.exports = (sequelize, DataTypes) => {
  var News = sequelize.define('News', {
    title: DataTypes.TEXT,
    description: DataTypes.TEXT,
    content:DataTypes.TEXT,
    url_image:DataTypes.TEXT,
    admin_id:DataTypes.INTEGER,
    createdate:DataTypes.DATE,
    category:DataTypes.TEXT,
    keyword: DataTypes.TEXT,
    meta_description: DataTypes.TEXT,
    status: DataTypes.TEXT
  }, {});
  News.associate = function(models) {
    // associations can be defined here
    News.belongsTo(models.Admin,{foreignKey:'admin_id'});
  };
  return News;
};
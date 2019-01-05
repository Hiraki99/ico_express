'use strict';
module.exports = (sequelize, DataTypes) => {
  var Video = sequelize.define('Video', {
    video_title: DataTypes.TEXT,
    video_description: DataTypes.TEXT,
    video_link: DataTypes.TEXT,
    status: DataTypes.TEXT,
    createdate: DataTypes.DATE,
    admin_id: DataTypes.INTEGER,
    admin_name: DataTypes.TEXT
  }, {});
  Video.associate = function(models) {
    // associations can be defined here
  };
  return Video;
};
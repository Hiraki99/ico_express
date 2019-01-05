'use strict'
var Promise   = require('promise');
var db        = require('../../../db/models');
var Sequelize = require('sequelize');

exports.getFullConfig = () =>{
    db.Config.findById(1).then(config => {
        return config;
    });
}
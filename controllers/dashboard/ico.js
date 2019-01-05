'use strict'
var Promise = require('promise');
var db = require('../../db/models');
var User = db.User;
var Wallet = db.Wallet;
var Config = db.Config;
var Config_SC = require('../../smart_contract/config');
exports.icopage = (req, res) => {
    var data;
    if (req.session.user_id)
        Config.findById(1).then(config => {
            data = {
                "address_contract_unlocked": Config_SC.CONTRACT_ADDRESS_UNLOCK_TOKEN,
                "address_contract_locked": Config_SC.CONTRACT_ADDRESS_LOCK_TOKEN
            }
            return res.render("dashboard/ico", { "data": data, "link": '/dashboard/ico', 'name': "Ico" });
        }).catch(err => {
            console.log(err);
            return res.redirect('/');
        });
    else return res.redirect('/');
};
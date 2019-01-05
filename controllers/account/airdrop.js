'use strict'
var Promise = require('promise');
var db = require('../../db/models');
var Sequelize = require('sequelize');
const SC = require('../utils/Status_Constant');
const Config = require('../../smart_contract/config');

exports.airdrop = (req, res) => {
    if (req.session.user_name) {
        return res.render('dashboard/account/airdrop',{"link": '/dashboard/airdrop','name': "Airdrop"});
    }else return res.redirect('/')
};

function getStatusAirdropForUser(user_id, airdrop_id) {
    return new Promise((resolve, reject) => {
        db.User.findById(user_id).then(user => {
            user.getUserAirdrops().then(list => {
                list.forEach(element => {
                    if (element.airdrop_id == airdrop_id) {
                        resolve([true, element]);
                    }
                });
                resolve([false, null]);
            }).catch(err => {
                console.log("err " + err);
                reject(err);
            });
        });
    });
}

/**
 * show list Airdrop for user
 * nếu date now <date finish => là tin mới.
 * @param {airdrop_id,sesstion.user_id,session.password} req 
 * @param {*} res 
 */
exports.getListAirdropForUser = (req, res) => {
    
    if(req.session.user_id){
        db.Airdrop.findAll().then(list => {
            var listAirdrop = new Array();
            var listPromiseStatus = new Array();
            var i = 0;
            console.log("list airdrop = "+JSON.stringify(list));
            list.forEach(airdrop => {
                if(airdrop.is_locked == 0){
                    listAirdrop[i] = {
                        id: airdrop.id,
                        title: airdrop.title,
                        content: airdrop.content,
                        bonus: airdrop.bonus,
                        status: airdrop.level == 1 ? SC.AirdropStatus.IMPORTANT : SC.AirdropStatus.WAITING,
                        link:airdrop.link
                    }
                    listPromiseStatus[i] = getStatusAirdropForUser(req.session.user_id, airdrop.id);
                    i++;
                }
            });
            Promise.all(listPromiseStatus).then(val => {
                console.log(val);
                var j = 0;
                val.forEach(element => {
                    // console.log("element[0] = "+element[0]);
                    // console.log("element[1] = "+element[1].status);
                    if (element[0]) {
                        listAirdrop[j++].status = element[1].status;
                    }
                });
                // show list airdrop
                console.log(listAirdrop);
                return res.send(JSON.stringify({listAirdrop}))
            }).catch(err => {
                console("listPromiseStatus error: " + err);
            });
        });
    }
}

exports.checkAndUpdateAirdopReferal = async (user,address) =>{
    try {
        var amount_member_referal = await Config.contract_bonus_referal.methods.amountReferal(address).call();
        if(amount_member_referal>=1500){
            await checkAndUpdateAirdrop(user,8);
        }else if(amount_member_referal>=1000){
            await checkAndUpdateAirdrop(user,7);
        }else if(amount_member_referal>=500){
            await checkAndUpdateAirdrop(user,6);
        }else if(amount_member_referal>=100){
            await checkAndUpdateAirdrop(user,5);
        }else if(amount_member_referal>=10){
            await checkAndUpdateAirdrop(user,4);
        }else if(amount_member_referal>=1){
            await checkAndUpdateAirdrop(user,3);
        }
    } catch (error) {
        console.log(error);
    }
}

async function checkAndUpdateAirdrop(user,airdrop_id){
    var userAirdrop = await db.UserAirdrop.findOne({
        where: {user_id:user.id, airdrop_id:airdrop_id}
    });
    if(userAirdrop==null){
        var airdrop = await db.Airdrop.findById(airdrop_id);
        db.UserAirdrop.create({
            user_id:user.id,
            airdrop_id:airdrop_id,
            value:airdrop.bonus,
            status: "Completed"
        }).then(userAirdrop=>{
            user.total_bonus_airdrop+=userAirdrop.value;
            user.save();
        }).catch(err=>{
            console.log("checkAndUpdateAirdrop error:"+error);
        });
    }
}





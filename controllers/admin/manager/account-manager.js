'use strict'
var Promise = require('promise');
var db = require('../../../db/models');
var Sequelize = require('sequelize');
var emailController = require('../../utils/Email');
var Admin = db.Admin;
var User = db.User;
const Op = Sequelize.Op;
var md5 = require('md5');
const Config = require('../../../smart_contract/config');
var web3 = require('web3');
const SC = require('../../utils/Status_Constant');

// create new acount manager or supporter by admin
exports.createNewAccountManager = async (req, res) => {
    if (req.session.admin_id && req.session.admin_type == SC.AdminType.ROOT) {
        db.Admin.findById(req.session.admin_id).then(admin => {
            // console.log(admin);
            if (admin == null) {
                return res.send(JSON.stringify({ "error_warning": "admin account is incorrect!" }));
            }
            if (admin.type != SC.AdminType.ROOT) {
                return res.send(JSON.stringify({ "error_warning": "admin account is incorrect!" }));
            }
            // console.log(req.body);
            var data = req.body;
            var name = data.username;
            var nickname = data.nickname;
            var type = data.type;
            var email = data.email;
            var password = data.password;
            var prikey = data.key;
            var address = data.address;

            // console.log(address);
            // var address = "0x293ef94f32AE9d4c3D3F33db0D57b4Bc8F6CAE54";
            if (!web3.utils.isAddress(address.toLowerCase())) {
                return res.send(JSON.stringify({ "error_warning": "Wallet address of supporter is null or incorrect!" }));
            }
            if (type != SC.AdminType.MANAGER && type != SC.AdminType.SUPPORTER) {
                return res.send(JSON.stringify({ "error_warning": "type is not true =>>>> Warning!!!May be sys is hacked!" }));
            }
            Admin.findOne({ where: { username: name } })
                .then(ad => {
                    if (ad != null) {
                        //show notification that admin username's is existed!
                        return res.send(JSON.stringify({ "error_warning": "username is existed!" }));
                    } else {
                        Admin.findOne({
                            where: {
                                nickname: nickname
                            }
                        }).then(adm => {
                            if (adm != null) {

                                //show notification that admin nickname's is existed!
                                return res.send(JSON.stringify({ "error_warning": "nickname is existed!" }));
                            } else {
                                Admin.create({
                                    "username": name,
                                    "nickname": nickname,
                                    "password": md5('abc123'),
                                    "email": email,
                                    "type": type,
                                    "address": address,
                                    'is_locked': 1
                                }).then(new_admin => {
                                    //send to smartcontract
                                    var privateKey = prikey;
                                    var data1;
                                    if (type == SC.AdminType.MANAGER) {
                                        data1 = Config.contract_ico.methods.addManager(address).encodeABI();
                                    } else {
                                        data1 = Config.contract_ico.methods.addSupporter(address).encodeABI();
                                    }
                                    Config.createRawTransaction(admin.address, Config.CONTRACT_ADDRESS_ICO, 0, req.body.gasPrice, 3000000, data1, Config.CHAND_ID).then(rawTransaction => {
                                        var tx = Config.signToRawTransaction(privateKey, rawTransaction);
                                        Config.sendRawTransaction(tx).once('transactionHash', async function (hash) {
                                            console.log("hash = " + hash);
                                        }).then(result => {
                                            if (result.status) {
                                                console.log(result);
                                                new_admin.is_locked = 0;
                                                new_admin.save();
                                            } else {
                                                new_admin.destroy();
                                            }
                                        }).catch(err => {
                                            new_admin.destroy();
                                            return res.send(JSON.stringify({ "error_warning": "sendRawTransaction err " + err }));
                                        });
                                        //show notification that is created!
                                        return res.send(JSON.stringify({ "success": true, "link_redirect": "/admin/list-admin" }))
                                    }).catch(err => {
                                        new_admin.destroy();
                                        console.log(err);
                                        return res.send(JSON.stringify({ "error_warning": "Create admin Fail 5" }));
                                    });
                                }).catch(err => {
                                    console.log(err);
                                    return res.send(JSON.stringify({ "error_warning": "Create admin Fail 4" }));
                                });
                            }
                        }).catch(err => {
                            console.log(err);
                            return res.send(JSON.stringify({ "error_warning": "Create admin Fail 3" }));
                        });
                    }
                }).catch(err => {
                    console.log(err);
                    return res.send(JSON.stringify({ "error_warning": "Create admin Fail 2" }));
                });
        }).catch(err => {
            console.log(err);
            return res.send(JSON.stringify({ "error_warning": "Create admin Fail 1" }));
        });
    } else return res.redirect("/");
}

//show list account
//admin_id
exports.getListAccount = async (req, res) => {
    if (req.session.admin_id) {
        if (req.session.admin_type == SC.AdminType.ROOT || req.session.admin_type == SC.AdminType.MANAGER || req.session.admin_type == SC.AdminType.SUPPORTER) {
            Promise.all([db.Admin.findAll({
                where: {
                    [Op.or]: [{ type: SC.AdminType.MANAGER }, { type: SC.AdminType.SUPPORTER }]
                },
                order: [['id', 'DESC']]
            }), db.User.findAll({ order: [['id', 'DESC']] })]).then(values => {
                // console.log(values);
                var listAccount = new Array();
                var listKycs = new Array();
                var i = 0;
                if (req.session.admin_type != SC.AdminType.SUPPORTER) {
                    if (req.session.admin_type == SC.AdminType.ROOT) {
                        values[0].forEach(manager => {
                            listAccount[i] = {
                                "username": manager.username,
                                "type": manager.type,
                                "kyc": manager.is_locked == 0 ? SC.KycStatus.OK : SC.KycStatus.PENDING,
                                "created_date": manager.createdAt,
                                "account_id": manager.id,
                                "is_locked": manager.is_locked == 0 ? "Locked" : "UnLocked"
                            }
                            i++;
                        });
                    } else {
                        values[0].forEach(manager => {
                            if ((manager.type == SC.AdminType.SUPPORTER)) {
                                listAccount[i] = {
                                    "username": manager.username,
                                    "type": SC.AdminType.SUPPORTER,
                                    "kyc": manager.is_locked == 0 ? SC.KycStatus.OK : SC.KycStatus.PENDING,
                                    "created_date": manager.createdAt,
                                    "account_id": manager.id,
                                    "is_locked": manager.is_locked == 0 ? "Locked" : "UnLocked"
                                }
                                i++;
                            }
                        });
                    }


                }
                values[1].forEach(user => {
                    listKycs.push(user.getKYC());
                });
                Promise.all(listKycs).then(kycs => {
                    console.log(JSON.stringify(kycs));
                    var j = 0;
                    kycs.forEach(element => {
                        listAccount[i] = {
                            "username": values[1][j].username,
                            "type": "Normal",
                            "kyc": element != null ? element.status : SC.KycStatus.NONE,
                            "created_date": values[1][j].createdAt,
                            "account_id": values[1][j].id,
                            "is_locked": values[1][j].is_locked == 0 ? "Locked" : "UnLocked"
                        }
                        j++;
                        i++;
                    });
                    //show list account 
                    // console.log(JSON.stringify(listAccount));
                    return res.send({ 'listAccount': listAccount, 'type': req.session.admin_type });
                }).catch(err => {
                    console.log("getListAccount 1 err: " + err);
                    return res.send(JSON.stringify({ "error": true }))
                });
            }).catch(err => {
                console.log("getListAccount err: " + err);
                return res.send(JSON.stringify({ "error": true }))
            });
        }
    } else res.redirect("/")

}


//change lock or unlocked
exports.changeStatusLockOrUnlockAccount = (req, res) => {
    console.log('changeStatusLockOrUnlockAccount');
    if (req.session.admin_id && (req.session.admin_type == SC.AdminType.ROOT || req.session.admin_type == SC.AdminType.MANAGER)) {
        var data = req.body;
        var password = data.password;

        var type = data.type;
        var account_id = data.id;
        var admin_id = req.session.admin_id;
        var admin_type = req.session.admin_type;
        Admin.findById(admin_id)
            .then(admin => {
                if (admin == null) {
                    return res.send({
                        title: "Lock/Unlock Account",
                        log: "Admin is not exist"
                    });
                }
                var data = admin.dataValues;
                if (data.password == password) {
                    if (type == "Normal") {
                        if (admin_type == SC.AdminType.ROOT || admin_type == SC.AdminType.MANAGER) {
                            //change status of user
                            User.findById(account_id).then(user => {
                                if (user == null) {
                                    return res.send({
                                        title: "Lock/Unlock Account",
                                        log: "Admin is not exist"
                                    });
                                }
                                user.is_locked == 1 ? user.is_locked = 0 : user.is_locked = 1;
                                user.save().then(() => {
                                    return res.send({
                                        title: "Lock/Unlock Account",
                                        log: "Success"
                                    });
                                }).catch(err => {
                                    return res.send({
                                        title: "Lock/Unlock Account",
                                        log: "Update lock/unlock fail"
                                    });
                                })

                            }).catch(err => {
                                console.log(err);
                                return res.send({
                                    title: "Lock/Unlock Account",
                                    log: "Dont find this account"
                                });
                            });
                        } else {
                            return res.send({
                                title: "Lock/Unlock Account",
                                log: "Permission denied"
                            });
                        }
                    } else {
                        if (admin.type == SC.AdminType.ROOT || (admin.type == SC.AdminType.MANAGER && type == SC.AdminType.SUPPORTER)) {
                            //account is admin
                            Admin.findById(account_id).then(acc => {
                                acc.is_locked == 1 ? acc.is_locked = 0 : acc.is_locked = 1;
                                var privateKey = data.key;
                                var data;
                                if (type == SC.AdminType.SUPPORTER) {
                                    acc.is_locked == 1 ? data = Config.contract_ico.methods.deleteSupporter(acc.address).encodeABI() : data = Config.contract_ico.methods.addSupporter(acc.address).encodeABI();
                                } else if (type == SC.AdminType.MANAGER) {
                                    acc.is_locked == 1 ? data = Config.contract_ico.methods.deleteManager(acc.address).encodeABI() : data = Config.contract_ico.methods.addManager(acc.address).encodeABI();
                                }
                                Config.createRawTransaction(admin.address, Config.CONTRACT_ADDRESS_ICO, 0, 10, 3000000, data, Config.CHAND_ID).then(rawTransaction => {
                                    var tx = Config.signToRawTransaction(privateKey, rawTransaction);
                                    Config.sendRawTransaction(tx).once('transactionHash', async function (hash) {
                                        console.log("hash = " + hash);
                                    }).then(async result => {
                                        console.log("result = " + JSON.stringify(result));
                                        await acc.save().then(() => {
                                            return res.send({
                                                title: "Lock/Unlock Account",
                                                log: "Success"
                                            });
                                        }).catch(err => {
                                            return res.send({
                                                title: "Lock/Unlock Account",
                                                log: err
                                            });
                                        });
                                    }).catch(err => {
                                        return res.send({
                                            title: "Lock/Unlock Account",
                                            log: err
                                        });
                                    });
                                    res.send({
                                        title: "Lock/Unlock Account",
                                        log: "Transaction is pending"
                                    });
                                }).then(err => {
                                    return res.send({
                                        title: "Lock/Unlock Account",
                                        log: err
                                    });
                                });
                            }).catch(err => {
                                return res.send({
                                    title: "Lock/Unlock Account",
                                    log: err
                                });
                            });
                        }
                    }
                } else {
                    return res.send({
                        title: "Lock/Unlock Account",
                        log: "Password invalid"
                    });
                }
            }).catch(err => {
                console.log("err1 " + err);
                return res.send({
                    title: "Lock/Unlock Account",
                    log: err
                });
            });

    } else res.redirect("/admin/signin");
}

function randomPassword() {
    var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
    var string_length = 8;
    var randomstring = '';
    for (var i = 0; i < string_length; i++) {
        var rnum = Math.floor(Math.random() * chars.length);
        randomstring += chars.substring(rnum, rnum + 1);
    }
    return randomstring;
}

//reset password for account
exports.resetPassword = (req, res) => {
    if (req.session.admin_id && (req.session.admin_type == SC.AdminType.ROOT || req.session.admin_type == SC.AdminType.MANAGER)) {
        var data = req.body;
        var password = data.password;
        var type = data.type;
        var account_id = data.id;
        var admin_id = req.session.admin_id;
        var admin_type = req.session.admin_type;
        // console.log(data);
        Admin.findById(admin_id)
            .then(admin => {
                var data = admin.dataValues;
                if (data.password == password) {
                    if (type == "Normal") {
                        if (admin_type == SC.AdminType.ROOT || admin_type == SC.AdminType.MANAGER) {

                            //change status of user
                            User.findById(account_id).then(user => {
                                var reset_password = randomPassword();
                                // console.log("resetPassword = " + reset_password);
                                //send password to email of account
                                emailController.sendemail(
                                    "support@unibotcash.com",
                                    "supporter",
                                    user.email,
                                    "Resset password",
                                    "<p> New password: " + reset_password + "</p>"
                                );

                                user.password = md5(reset_password);
                                // console.log("user = " + JSON.stringify(user));
                                user.save().then(() => {
                                    return res.send({
                                        title: "Reset password",
                                        log: "Success"
                                    });
                                }).catch(err => {
                                    console.log(err);
                                    return res.send({
                                        title: "Reset password",
                                        log: "Error: " + err
                                    });
                                });
                            }).catch(err => {
                                console.log(err);
                                return res.send({
                                    title: "Reset password",
                                    log: "Error: Not found this account!"
                                });
                            });
                        } else {
                            return res.send({
                                title: "Reset password",
                                log: "Error: Not found this account!"
                            });
                        }
                    } else {
                        if (admin.type == SC.AdminType.ROOT || (admin.type == SC.AdminType.MANAGER && type == SC.AdminType.SUPPORTER)) {
                            //account is admin

                            Admin.findById(account_id).then(adm => {
                                if (adm != null) {
                                    // console.log(randomPassword());
                                    var new_password = randomPassword();
                                    adm.password = md5(new_password);
                                    emailController.sendemail(
                                        "support@unibotcash.com",
                                        "supporter",
                                        adm.email,
                                        "Resset password",
                                        "<p> New password: " + new_password + "</p>"
                                    );
                                    adm.save().then(() => {
                                        return res.send({
                                            title: "Reset password",
                                            log: "Success"
                                        });
                                    }).catch(err => {
                                        console.log(err);
                                        return res.send({
                                            title: "Reset password",
                                            log: "Error: Not found this account!"
                                        });
                                    });
                                }
                            }).catch(err => {
                                return res.send({
                                    title: "Reset password",
                                    log: "Error: Not found this account!"
                                });
                            });
                        }
                    }
                } else {
                    return res.send({
                        title: "Reset password",
                        log: "Error: Not found this account!"
                    });
                }
            }).catch(err => {
                return res.send({
                    title: "Reset password",
                    log: "Error: Not found this account!"
                });
            });
    } else return res.redirect("/admin/signin");
}
exports.viewInfo = (req, res) => {
    if (req.session.admin_id) {
        var data = req.body;
        var type = data.type;
        var account_id = data.id;
        if (type == "Normal") {
            User.findById(account_id)
                .then(async user => {
                    try {
                        var wallet = await user.getWallet();
                        var kyc = await user.getKYC();
                        
                        if (wallet == null) {
                            var parent = await db.User.findById(user.referal_parent_id);
                            if (parent != null)
                                parent = parent.username;
                            return res.send({
                                username: user.username,
                                email: user.email,
                                address: wallet.address,
                                name: null,
                                national: null,
                                phone: null,
                                passport_number_id: null,
                                token_lock: null,
                                token_unlock: null,
                                total_token: null,
                                total_eth: null,
                                bonus_vip_preIco: null,
                                bonus_vip_ico: null,
                                total_bonus_referal: null,
                                amount_member_referal: null,
                                total_bonus_airdrop: null,
                                parent: parent
                            });
                        }
                        var config = await db.Config.findById(1);
                        var token_lock_tmp = Math.round(parseFloat(wallet.total_locked_token) * 10) / 10;
                        var token_unlock_tmp = Math.round(parseFloat(wallet.total_unlocked_token) * 10) / 10;
                        if (Date.now() / 1000 > config.release_date) {
                        token_lock_tmp -= Math.round(Math.round((Date.now() / 1000 - config.release_date) / config.time_cycle * 10 / 12) * token_lock_tmp)/10;
                            token_lock_tmp = token_lock_tmp < 0? 0: token_lock_tmp;
                            token_unlock_tmp = Math.round((wallet.total_token - token_lock_tmp) * 10) / 10;
                        }
                        if (kyc != null) {
                            var parent = await db.User.findById(user.referal_parent_id);
                            if (parent != null)
                                parent = parent.username;
                            return res.send({
                                username: user.username,
                                email: user.email,
                                address: wallet.address,
                                name: kyc.name,
                                national: kyc.national,
                                phone: kyc.phone,
                                passport_number_id: kyc.passport_number_id,
                                token_lock: token_lock_tmp,
                                token_unlock: token_unlock_tmp,
                                total_token: wallet.total_token,
                                total_eth: wallet.total_eth,
                                bonus_vip_preIco: wallet.bonus_vip_preIco,
                                bonus_vip_ico: wallet.bonus_vip_ico,
                                total_bonus_referal: user.total_bonus_referal,
                                amount_member_referal: user.amount_member_referal,
                                total_bonus_airdrop: user.total_bonus_airdrop,
                                parent: parent
                            });
                        }
                        var parent = await db.User.findById(user.referal_parent_id);
                        if (parent != null)
                            parent = parent.username;
                        return res.send({
                            username: user.username,
                            email: user.email,
                            address: wallet.address,
                            name: null,
                            national: null,
                            phone: null,
                            passport_number_id: null,
                            token_lock: token_lock_tmp,
                            token_unlock: token_unlock_tmp,
                            total_token: wallet.total_token,
                            total_eth: wallet.total_eth,
                            bonus_vip_preIco: wallet.bonus_vip_preIco,
                            bonus_vip_ico: wallet.bonus_vip_ico,
                            total_bonus_referal: user.total_bonus_referal,
                            amount_member_referal: user.amount_member_referal,
                            total_bonus_airdrop: user.total_bonus_airdrop,
                            parent: parent
                        });
                    } catch (error) {
                        console.log(error);
                        return res.send(JSON.stringify({ "error": true }));
                    }
                }).catch(err => {
                    console.log(err);
                    return res.send(JSON.stringify({ "error": true }));
                })
        } else
            Admin.findById(account_id)
                .then(admin => {
                    return res.send(admin.dataValues)
                }).catch(err => {
                    console.log(err);
                    return res.send(JSON.stringify({ "error": true }));
                })

    } else return res.redirect("/admin/signin");
}

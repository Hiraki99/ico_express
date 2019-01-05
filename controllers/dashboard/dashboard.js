'use strict';
const crypto = require('crypto');
const twoFactor = require('node-2fa');
const ReCaptra = require('../utils/Recaptra');
const twoFA = require('../utils/TwoFactorAuth');
const Promise = require('promise');
const cc = require('cryptocompare');
const db = require('../../db/models');
const User = db.User;
const PriceToken = require('./pricecrypto');
var email_util = require('../utils/Email');
var randomstring = require('randomstring');
var transactionController = require('../dashboard/transaction');
var request = require('request');
const Config = require("../../smart_contract/config");
var rp = require('request-promise')
const SC = require('../utils/Status_Constant');
const path = require('path');
const fs = require('fs');
const airdropController = require('../account/airdrop');
const verifycert = fs.readFileSync(path.join(__dirname, '../../key/mykey.pub'));
const cert = fs.readFileSync(path.join(__dirname, '../../key/mykey.pem'));
const jwt = require('jsonwebtoken');

exports.dashboard = (req, res) => {
    if (req.session.user_name) {
        User.findById(req.session.user_id).then(user => {
            if (user != null) {
                res.render('dashboard/dashboard_v2/dashboard', { "link": 'dashboard/dashboard_v2/dashboard', 'name': "Dashboard" });
            } else {
                console.log("dashboard user is not exist! " + err);
                return res.redirect("/");
            }
        }).catch(err => {
            console.log("dashboard err" + err);
            return res.redirect("/");
        })

    } else res.redirect('/');
};
exports.changePassword = (req, res) => {
    const data = req.body;
    var old_password = data.old_password;
    var new_password = data.new_password;
    var confirm_newpassword = data.confirm_newpassword;
    if (confirm_newpassword != new_password)
        return res.send(JSON.stringify({ "error": 2 }));
    console.log(req.session.user_name);
    User.findOne({ where: { 'username': req.session.user_name } })
        .then(Data => {
            var result = Data.dataValues;
            if (old_password != result.password)
                return res.send(JSON.stringify({ "error": 0 }));
            Data.update({ "password": new_password })
                .then(data => {
                    return res.send(JSON.stringify({ "success": 1 }));
                })
        })
}
exports.LogIn = (req, res) => {
    const data = req.body;
    var username = data.user_name;
    var password = data.password;
    var captra = data.recaptcha;
    var authy_code = data.authy_code;
    console.log(username);
    console.log(captra);
    ReCaptra.verifyRecaptcha(captra, function (checked) {
        if (checked) {
            console.log(checked)
            User.findOne({ where: { 'username': username } })
                .then(Data => {
                    // console.log(result);
                    var result = Data.dataValues;
                    var check_2fa = false;
                    console.log(result);
                    console.log(result.enable_auth);
                    if (result.enable_auth > 0) {
                        switch (twoFA.verifyToken_User(result.key_twoFa, authy_code)) {
                            case -2:
                                return res.send(JSON.stringify({ "error_warning": "Authy Code Error" }));
                                break;
                            case -1:
                                return res.send(JSON.stringify({ "error_warning": "Authy Code Too Late" }));
                                break;
                            case 1:
                                return res.send(JSON.stringify({ "error_warning": "Authy Code Too Early" }));
                                break;
                            case 0:
                                check_2fa = true;
                                break;
                        }
                    }
                    console.log(check_2fa)
                    if (check_2fa || result.enable_auth == 0) {
                        if (result.password.toString() == password.toString()) {
                            if (result.is_locked == 1) {
                                console.log("False");
                                return res.send(JSON.stringify({ "error_warning": "Account is Locked " }));
                            }
                            if (result.is_actived == 1) {
                                req.session.user_name = result.username;

                                req.session.user_id = result.id;

                                req.session.admin_id = null;
                                req.session.admin_name = null;

                                console.log("True")
                                return res.send(JSON.stringify({ "success": true, "link_redirect": 'dashboard' }));
                            }
                            else {
                                console.log("False");
                                return res.send(JSON.stringify({ "error_warning": "Account don't active " }));
                            }

                        } else {
                            console.log("False");
                            return res.send(JSON.stringify({ "error_warning": "Account or Password invalid" }));
                        }
                    }
                    console.log("2")

                }).catch(error => {
                    console.log(error)
                    res.send(JSON.stringify({ "error_warning": "No Exist Account" }))
                })
        } else return res.send(JSON.stringify({ "error_warning": "Captra error" }));
    });
}
exports.CheckUserName = (req, res) => {
    console.log('check username');
    var username = req.body.username;
    console.log(username);
    User.findOne({ where: { 'username': username } })
        .then(Data => {
            console.log(Data);
            if (Data == null)
                return res.send(JSON.stringify({ 'success': 1 }));
            else
                return res.send(JSON.stringify({ 'success': 0 }))

        })
        .catch(error => {
            console.log(error);
            return res.send(JSON.stringify({ 'success': 0 }))
        })
}
exports.CheckEmail = (req, res) => {
    console.log('check email');
    var email = req.body.email;
    console.log(email)
    User.findOne({ where: { 'email': email } })
        .then(Data => {
            console.log(Data);
            if (Data == null)
                return res.send(JSON.stringify({ 'success': 1 }));
            else
                return res.send(JSON.stringify({ 'success': 0 }))

        })
        .catch(error => {
            return res.send(JSON.stringify({ 'success': 0 }))
        })
}
exports.SignUp = (req, res) => {
    const data = req.body;
    var username = data.username;
    var email = data.email;
    var password = data.password;
    var captra = data.recaptcha;
    var referal = data.referal;

    ReCaptra.verifyRecaptcha(captra, function (checked) {

        if (checked) {
            var key_verify = jwt.sign({
                email: 'email'
            }, cert, { expiresIn: 3 * 60, algorithm: 'RS256' });

            var key_referal = crypto.createHash('md5').update(randomstring.generate(8) + username).digest("hex");
            User.create({
                'username': username,
                'password': password,
                'wallet_id': 0,
                'bonus_id': 0,
                'is_actived': 0,
                'kyc_id': 0,
                'enable_auth': 0,
                'email': email,
                'key_twoFa': '',
                'key_referal': key_referal,
                'key_verify': "",
                'total_bonus_referal': 0,
                'total_bonus_airdrop': 0,
                'amount_member_referal': 0,
                'is_locked': 0
            }).then(user => {
                if (!user) {
                    res.send(JSON.stringify({ "error_warning": "Register user error" }));
                } else {
                    if (referal != "" && referal != 'undefined' && referal != null) {
                        db.User.findOne({
                            where: {
                                key_referal: referal
                            }
                        }).then(parent => {
                            user.referal_parent_id = parent.id;
                            user.save();
                            var name;
                            name = "Dear " + username;
                            var link = req.protocol + '://' + req.get('host') + '/confirmaccount?email=' + email + '&token=' + key_verify;
                            var body = '<p><span style="font-size:12px; margin-bottom:40px; "><strong>' + name + '</strong>,</span></p>' + '<p><span style="font-size:12px">Welcome to the world of decentralized anonymous ai blockchain.</span></p>'
                                + '<p><span style="font-size:12px">In order to activate your account and start the next generation crypto-currency, please follow this activation link.</span></p>'
                                + '<p style="margin:20px 0px;"><span style="font-size:12px"><a href="' + link + '" style="font-family: Helvetica, Arial, sans-serif; font-size: 24px; text-decoration: none; color: rgb(255, 255, 255); padding: 12px 35px; border-radius: 4px; border: 1px solid rgb(23, 144, 218); background: rgb(0, 175, 236);" target="_blank" rel="noreferrer">Activate ›</a></p>'
                                + '<p><span style="font-size:12px">In order to access your account please go to: <a href="' + link + '">' + link + '</a> with the following below:</span></p>'
                                + '<p><span style="font-size:12px">We thank you for choosing Unibot and wish you successful at Unibot.</span></p>'
                                + '<p><span style="font-size:12px">If you have any questions or concerns, you can email us at: support@unibot.co or visit our Contact Us page.</span></p><br>'
                                + '<p><span style="font-size:12px;margin-bottom: 40px;">Regards, </span></p>'
                                + '<p><strong><span style="font-size:12px">Unibot Support Team!</span></strong></p>;'
                            email_util.sendemail("support@unibot.co", 'Unibot Support Team', email, "Congratulations! Your account has been created.", body, function (result) {

                                if (result) {
                                    console.log("send mail");
                                    res.send(JSON.stringify({ 'success': true, "key_verify": key_verify, "email": email }));
                                }
                                else {
                                    User.destroy({ where: { id: user.id } })
                                        .then(result => {
                                            return res.send(JSON.stringify({ "error_warning": "Send Mail Error. Please sign up again" }));
                                        })
                                }
                            });
                        }).catch(err => {
                            res.send(JSON.stringify({ "error_warning": "Can't find parent account" }));
                            User.destroy({ where: { id: user.id } })
                                .then(result => {
                                    return res.send(JSON.stringify({ "error_warning": "link referal of parent account is incorrect" }));
                                });
                        });
                    } else {
                        var name;
                        name = "Dear " + username;
                        var link = req.protocol + '://' + req.get('host') + '/confirmaccount?email=' + email + '&token=' + key_verify;
                        var body = '<p><span style="font-size:12px; margin-bottom:40px; "><strong>' + name + '</strong>,</span></p>' + '<p><span style="font-size:12px">Welcome to the world of decentralized anonymous ai blockchain.</span></p>'
                            + '<p><span style="font-size:12px">In order to activate your account and start the next generation crypto-currency, please follow this activation link.</span></p>'
                            + '<p style="margin:20px 0px;"><span style="font-size:12px"><a href="' + link + '" style="font-family: Helvetica, Arial, sans-serif; font-size: 24px; text-decoration: none; color: rgb(255, 255, 255); padding: 12px 35px; border-radius: 4px; border: 1px solid rgb(23, 144, 218); background: rgb(0, 175, 236);" target="_blank" rel="noreferrer">Activate ›</a></p>'
                            + '<p><span style="font-size:12px">In order to access your account please go to: <a href="' + link + '">' + link + '</a> with the following below:</span></p>'
                            + '<p><span style="font-size:12px">We thank you for choosing Unibot and wish you successful at Unibot.</span></p>'
                            + '<p><span style="font-size:12px">If you have any questions or concerns, you can email us at: support@unibot.co or visit our Contact Us page.</span></p><br>'
                            + '<p><span style="font-size:12px;margin-bottom: 40px;">Regards, </span></p>'
                            + '<p><strong><span style="font-size:12px">Aibitcash Support Team!</span></strong></p>'
                        email_util.sendemail("support@unibot.co", 'Unibot Support Team', email, "Congratulations! Your account has been created.", body, function (result) {

                            if (result) {
                                console.log("send mail");
                                res.send(JSON.stringify({ 'success': true, "key_verify": key_verify, "email": email }));
                            }
                            else {
                                User.destroy({ where: { id: user.id } })
                                    .then(result => {
                                        return res.send(JSON.stringify({ "error_warning": "Send Mail Error. Please sign up again" }));
                                    })
                            }
                        });
                    }
                }
            }).catch(error => {
                console.log(error)
                res.send(JSON.stringify({ "error_warning": "Register new user error" }));
            });

        } else return res.send(JSON.stringify({ "error_warning": "Captra error" }));
    });
}
exports.VerifyAccount = (req, res) => {

    var email = req.query.email;
    var key_verify = req.query.token;

    console.log(req.query);
    User.findOne({ where: { 'email': email } })
        .then(Data => {
            if (Data == null) return res.redirect('/?register=0&email=' + email);
            else {
                jwt.verify(key_verify, verifycert, function (err, decoded) {
                    if (err) {
                        console.log(err)
                        return res.redirect('/?register=-1&email=' + email);
                    } else {
                        // if everything is good, save to request for use in other routes
                        // console.log(permision.checkPermission(req.originalUrl, decoded.identity.role))
                        console.log(287);
                        console.log(Data);
                        Data.update({ is_actived: 1 })
                            .then(data => {
                                return res.redirect('/?register=1');
                            }).catch(error => {
                                console.log(error);
                                return res.redirect('/?register=0&email=' + email);
                            })
                    }
                });
            }

        }).catch(error => {
            console.log(error)
            return res.redirect('/?register=0&email=' + email);
        })
}
exports.resendVerify = (req, res) => {

    var email = req.body.email;
    console.log(email);
    var key_verify = jwt.sign({
        email: 'email'
    }, cert, { expiresIn: 3 * 60, algorithm: 'RS256' });

    User.findOne({ where: { 'email': email } })
        .then(Data => {
            console.log(Data.dataValues);
            var name = "Dear " + Data.dataValues.username;
            var link = req.protocol + '://' + req.get('host') + '/confirmaccount?email=' + email + '&token=' + key_verify;
            var body = '<p><span style="font-size:12px; margin-bottom:40px; "><strong>' + name + '</strong>,</span></p>' + '<p><span style="font-size:12px">Welcome to the world of decentralized anonymous ai blockchain.</span></p>'
                + '<p><span style="font-size:12px">In order to activate your account and start the next generation crypto-currency, please follow this activation link.</span></p>'
                + '<p style="margin:20px 0px;"><span style="font-size:12px"><a href="' + link + '" style="font-family: Helvetica, Arial, sans-serif; font-size: 24px; text-decoration: none; color: rgb(255, 255, 255); padding: 12px 35px; border-radius: 4px; border: 1px solid rgb(23, 144, 218); background: rgb(0, 175, 236);" target="_blank" rel="noreferrer">Activate ›</a></p>'
                + '<p><span style="font-size:12px">In order to access your account please go to: <a href="' + link + '">' + link + '</a> with the following below:</span></p>'
                + '<p><span style="font-size:12px">We thank you for choosing Unibot and wish you successful at Unibot.</span></p>'
                + '<p><span style="font-size:12px">If you have any questions or concerns, you can email us at: support@unibot.co or visit our Contact Us page.</span></p><br>'
                + '<p><span style="font-size:12px;margin-bottom: 40px;">Regards, </span></p>'
                + '<p><strong><span style="font-size:12px">Unibot Support Team!</span></strong></p>;'
            email_util.sendemail("support@unibot.co", 'Unibot Support Team', email, "Congratulations! Your account has been created.", body, function (result) {

                if (result) {
                    console.log("send mail");
                    res.send(JSON.stringify({ 'success': 1, "message": 'Re-send email success.' }));
                }
                else {
                    res.send(JSON.stringify({ 'success': 0, "message": 'Re-send email verify account error. Please resend email angain!.' }));
                }
            });
        }).catch(err => {
            console.log(err);
            res.send(JSON.stringify({ 'success': -1, "message": 'Re-send email verify account error. Please resend email angain!.' }));
        })

}
function maxBonusReferal(member) {
    var max = 0;
    if (member >= 100) {
        max = 7000000000;
    } else if (member >= 50) {
        max = 100000;
    } else if (member >= 10) {
        max = 10000;
    } else if (member >= 5) {
        max = 1500;
    } else if (member >= 1) {
        max = 500;
    }
    return max;
}


exports.getTransactionFromEtherscan = async (req, res) => {
    //usercase 2
    //get transaction
    User.findById(req.session.user_id).then(user => {
        rp("https://api.etherscan.io/api?module=account&action=tokentx&contractaddress=" + Config.CONTRACT_ADDRESS_UNIBOT + "&page=1&offset=4&sort=desc&apikey=YourApiKeyToken")
            .then(data => {
                console.log(JSON.parse(data.result));
                return res.send(data.result);
            }).catch(err => {
                console.log("getTransactionFromEtherscan err" + err);
            });
    });
}

exports.checkShowDashboard = async (req, res) => {
    if (req.session.user_id) {
        db.User.findById(req.session.user_id).then(async user => {
            if (user != null) {
                if (user.wallet_id > 0) {
                    var wallet = await user.getWallet();
                    return res.send({ wallet: true, address: wallet.address, address_contract: Config.CONTRACT_ADDRESS_UNIBOT });
                } else {
                    return res.send({ wallet: false });
                }
            } else {
                return res.send({ wallet: false });
            }
        }).catch(err => {
            console.log("checkShowWallet err = " + err);
            return res.send({ wallet: false });
        })
    } else {
        return res.send({ wallet: false });
    }
}

exports.checkShowDashboard_v2 = async (req, res) => {
    console.log("checkShowDashboard_v2");
    if (req.session.user_id) {
        db.User.findById(req.session.user_id).then(async user => {
            if (user != null) {
                if (user.wallet_id > 0) {
                    try {
                        var wallet = await user.getWallet();
                        console.log("checkShowDashboard_v2 wallet = " + JSON.stringify(wallet));
                        return res.send({ hasWallet: true, address: wallet.address, address_contract: Config.CONTRACT_ADDRESS_UNIBOT });
                    } catch (err) {
                        console.log("wallet err: " + err)
                        return res.send({ hasWallet: false });
                    }
                } else {
                    console.log("wallet null: wallet_id = " + user.wallet_id);
                    return res.send({ hasWallet: false });
                }
            } else {
                console.log('user null');
                return res.send({ hasWallet: false });
            }
        }).catch(err => {
            console.log("checkShowWallet err = " + err);
            return res.send({ hasWallet: false });
        })
    } else {
        console.log("have not user_id");
        return res.send({ hasWallet: false });
    }
}


async function updateDataWallet(wallet, balance) {
    try {
        var bonus_vip_preIco = await Config.contract_ico.methods.bonusPreIco(wallet.address).call();
        bonus_vip_preIco = Math.round(parseFloat(bonus_vip_preIco) / Math.pow(10, 18) * 10) / 10;
    } catch (err) {
        console.log("getInformationDashboard  bonus_vip_preIco null: " + err);
    }
    try {
        var bonus_vip_ico = await Config.contract_ico.methods.bonusIco(wallet.address).call();
        bonus_vip_ico = Math.round(parseFloat(bonus_vip_ico) / Math.pow(10, 18) * 10) / 10;
    } catch (err) {
        console.log("getInformationDashboard  bonus_vip_preIco null: " + err);
    }
    try {
        var total_locked_token = await Config.contract_unibot.methods.blocked_amount(wallet.address).call();
        total_locked_token = Math.round(parseFloat(total_locked_token) / Math.pow(10, 18) * 10) / 10;
    } catch (err) {
        console.log("getInformationDashboard  total_locked_token null: " + err);
    }
    try {
        var total_eth = await Config.web3.eth.getBalance(wallet.address);
        total_eth = parseFloat(total_eth);
    } catch (err) {
        console.log("getInformationDashboard  total_eth null: " + err);
    }
    try {
        //update to database
        await wallet.update({
            total_locked_token: total_locked_token,
            total_token: balance,
            total_unlocked_token: balance - total_locked_token,
            bonus_vip_ico: bonus_vip_ico,
            bonus_vip_preIco: bonus_vip_preIco,
            total_eth: total_eth
        });
        console.log("update completed! ");
        // console.log("total_token 2= "+Math.round(wallet.total_token*100)/100);
        return true;
    } catch (error) {
        console.log("update fail");
        return false;
    }
    return false;
}

//get infor dashboard version 2
exports.getInformationDashboard_v2 = async (req, res) => {
    console.log("getInformationDashboard v2");
    if (req.body.balance && req.session.user_id) {
        User.findById(req.session.user_id).then(async user => {
            if (user == null) {
                return res.send({
                    isError: true,
                    log: "account is not exist!"
                });
            }
            //check kyc 
            var isKYCed = false;
            if (user.kyc_id > 0) {
                try {
                    var kyc = await user.getKYC();
                    if (kyc.status == SC.KycStatus.SUCCESS) {
                        isKYCed = true;
                    }
                } catch (err) {
                    console.log("check kyc of user is failed");
                    isKYCed = false;
                }
            }
            //get title and bonus token
            var titleAndBonus = await getTitleAndBonusIco();
            try {
                var titleAndBonus = await getTitleAndBonusIco();
                var wallet = await user.getWallet();
                if (wallet != null) {
                    var price_token_lock = await PriceToken.getPriceToken(1);
                    var price_token_unlock = await PriceToken.getPriceToken(0);
                    if (Math.round(wallet.total_token * 10) / 10 != Math.round(req.body.balance * 10) / 10) {
                        var update = await updateDataWallet(wallet, Math.round(req.body.balance * 10) / 10);

                        if (!update) {
                            return res.send({
                                isError: true,
                                log: "update data wallet fail!"
                            });
                        }
                    }
                    try {
                        var referal = await Config.contract_bonus_referal.methods.bonusReferal(wallet.address).call();
                        referal = Math.round(parseFloat(referal) / Math.pow(10, 18) * 10) / 10;
                    } catch (error) {
                        console.log("updateUserReferal fail:" + error);
                        return res.send({
                            isError: true,
                            log: "update referal fail!"
                        });
                    }
                    try {
                        var total_eth_sold = await Config.contract_ico.methods.totalEth().call();
                        total_eth_sold = Math.round(parseFloat(total_eth_sold) / Math.pow(10, 18) * 10) / 10;
                    } catch (error) {
                        console.log("updateUserReferal fail:" + error);
                        return res.send({
                            isError: true,
                            log: "update total_eth_sold fail!"
                        });
                    }
                    try {
                        await airdropController.checkAndUpdateAirdopReferal(user, wallet.address);
                    } catch (error) {
                        console.log("checkAndUpdateAirdopReferal fail:" + error);
                        return res.send({
                            isError: true,
                            log: "update checkAndUpdateAirdopReferal fail!"
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
                    return res.send({
                        isError: false,
                        log: "",
                        address: wallet.address,
                        address_contract: Config.CONTRACT_ADDRESS_UNIBOT,
                        address_holder_eth: Config.ADDRESS_HOLDER_TOKEN,
                        price_token_lock: price_token_lock,
                        price_token_unlock: price_token_unlock,
                        token_lock: token_lock_tmp,
                        token_unlock: token_unlock_tmp,
                        total_token: wallet.total_token,
                        bonus_token: wallet.bonus_vip_preIco + wallet.bonus_vip_ico,
                        airdrop: user.total_bonus_airdrop,
                        referal: referal,
                        total_eth_sold: total_eth_sold,
                        isKYCed: isKYCed,
                        address_token_lock: Config.CONTRACT_ADDRESS_LOCK_TOKEN,
                        address_token_unlock: Config.CONTRACT_ADDRESS_UNLOCK_TOKEN,
                        bonus_lock: titleAndBonus.bonus_lock,
                        bonus_unlock: titleAndBonus.bonus_unlock,
                        title: titleAndBonus.title
                    });
                } else {
                    return res.send({
                        isError: true,
                        log: "wallet is not exist!"
                    });
                }
            } catch (error) {
                console.log("error: get wallet failed: " + error);
                return res.send({
                    isError: true,
                    log: error
                });
            }
        }).catch(err => {
            console.log(err);
            return res.send({
                isError: true,
                log: err
            });
        });
    } else {
        return res.send({
            isError: true,
            log: "request not permission!"
        });
    }
}

//get profile of user
// exports.getInformationDashboard = async (req, res) => {
//     console.log("getInformationDashboard");
//     if (req.body.balance) {
//         User.findById(req.session.user_id).then(user => {
//             if (user == null) {
//                 return res.send({ error: true });
//             }
//             if (user.wallet_id > 0) {
//                 user.getWallet().then(wallet => {
//                     // console.log("wallet = " + JSON.stringify(wallet));
//                     cc.histoMinute("ETH", 'USD', { "limit": 1 })
//                         .then(async currentcy => {
//                             var referal = {
//                                 member: user.amount_member_referal,
//                                 max: maxBonusReferal(user.amount_member_referal),
//                                 total_bonus_referal: user.total_bonus_referal
//                             }
//                             var price_token_lock = await PriceToken.getPriceToken(1);
//                             var price_token_unlock = await PriceToken.getPriceToken(0);

//                             //check to need update
//                             console.log("total_token = " + Math.round(wallet.total_token * 100) / 100);
//                             console.log("balance = " + Math.round(req.body.balance * 100) / 100);
//                             if (Math.round(wallet.total_token * 100) / 100 == Math.round(req.body.balance * 100) / 100) {
//                                 //don't need database update and get data from smartcontract
//                                 console.log("don't need database update and get data from smartcontract");
//                             } else {
//                                 //need update database and get data from smartcontract
//                                 //get data from smartcontract
//                                 console.log("need update database and get data from smartcontract");
//                                 try {
//                                     var bonus_vip_preIco = await Config.contract_ico.methods.bonusPreIco(wallet.address).call();
//                                     bonus_vip_preIco = Math.round(parseFloat(bonus_vip_preIco) / Math.pow(10, 18) * 10) / 10;
//                                 } catch (err) {
//                                     console.log("getInformationDashboard  bonus_vip_preIco null: " + err);
//                                 }
//                                 try {
//                                     var bonus_vip_ico = await Config.contract_ico.methods.bonusIco(wallet.address).call();
//                                     bonus_vip_ico = Math.round(parseFloat(bonus_vip_ico) / Math.pow(10, 18) * 10) / 10;
//                                 } catch (err) {
//                                     console.log("getInformationDashboard  bonus_vip_preIco null: " + err);
//                                 }
//                                 try {
//                                     var total_locked_token = await Config.contract_unibot.methods.blocked_amount(wallet.address).call();
//                                     total_locked_token = parseFloat(total_locked_token) / Math.pow(10, 18);
//                                 } catch (err) {
//                                     console.log("getInformationDashboard  total_locked_token null: " + err);
//                                 }
//                                 try {
//                                     var total_eth = await Config.web3.eth.getBalance(wallet.address);
//                                     total_eth = parseFloat(total_eth) / Math.pow(10, 18);
//                                 } catch (err) {
//                                     console.log("getInformationDashboard  total_eth null: " + err);
//                                 }
//                                 try {
//                                     //update to database
//                                     await wallet.update({
//                                         total_locked_token: total_locked_token,
//                                         total_token: req.body.balance,
//                                         total_unlocked_token: req.body.balance - total_locked_token,
//                                         bonus_vip_ico: bonus_vip_ico,
//                                         bonus_vip_preIco: bonus_vip_preIco,
//                                         total_eth: total_eth
//                                     });
//                                     console.log("update completed! ");
//                                     console.log("total_token 2= " + Math.round(wallet.total_token * 100) / 100);

//                                 } catch (error) {
//                                     console.log("update fail");
//                                     return res.send({ error: true });
//                                 }
//                             }
//                             console.log("total_eth = " + wallet.total_eth);
//                             var data = {
//                                 error: false,
//                                 user: {
//                                     user_id: user.id,
//                                     username: user.username,
//                                     email: user.email,
//                                     bonus_airdrop: user.total_bonus_airdrop,
//                                 },
//                                 wallet: {
//                                     address: wallet.address,
//                                     total_locked_token: wallet.total_locked_token,
//                                     total_unlocked_token: wallet.total_unlocked_token,
//                                     bonus_vip_preIco: wallet.bonus_vip_preIco,
//                                     bonus_vip_ico: wallet.bonus_vip_ico,
//                                     total_eth: wallet.total_eth
//                                 },
//                                 referal: referal,
//                                 value_eth: currentcy[0].high,
//                                 price_token_lock: price_token_lock,
//                                 price_token_unlock: price_token_unlock,
//                                 address_contract: Config.CONTRACT_ADDRESS_UNIBOT,

//                             };
//                             // console.log(JSON.stringify(data));
//                             return res.send(data);
//                         }).catch(err => {
//                             console.log("getInformationDashboard error: " + err);
//                             return res.send({ error: true });
//                         });
//                 }).catch(err => {
//                     console.log("getInformationDashboard get wallet error: " + err);
//                     return res.send({ error: true });
//                 });
//             } else {
//                 return res.send({ error: true });
//             }
//         }).catch(err => {
//             console.log("getInformationDashboard get user error: " + err);
//             return res.send({ error: true });
//         });
//     } else {
//         return res.send({ error: true });
//     }
// }

exports.timeCycleSelling = async (req, res) => {
    if (req.session.user_name) {
        User.findById(req.session.user_id).then(user => {
            return user.getWallet();
        }).then(wallet => {
            return res.send({
                "address": Config.ADDRESS_HOLDER_TOKEN,
                "address_contract": Config.CONTRACT_ADDRESS_UNIBOT
            });
        }).catch(err => {
            console.log("timeCycleSelling err: " + err);
        })
    }
}


exports.infor_account = (req, res) => {
    if (req.session.user_name) {
        var data = {};
        User.findById(req.session.user_id)
            .then(user => {
                console.log(user);
                data['user_name'] = req.session.user_name;
                Promise.all([user.getWallet(), user.getKYC()])
                    .then(info => {
                        if (info[0] != null && info[1] != null) {
                            data['kyc_status'] = info[1].status;
                            data['national'] = info[1].national;
                            data['indentification'] = info[1].passport_number_id;
                            data['name'] = info[1].name;
                            data['phone'] = info[1].phone;
                            data['avatar'] = "/uploads/" + info[1].url_img_all;
                            data['address'] = info[0].address;
                            return res.render("dashboard/infor_account", { "data": data, "link": '/dashboard/profile', 'name': "Profile" });
                        } else {
                            if (info[0] == null) {
                                data['address'] = 'None';
                            }
                            if (info[1] == null) {
                                data['kyc_status'] = "None";
                                data['national'] = "None";
                                data['indentification'] = "None";
                                data['name'] = "None";
                                data['phone'] = "None";
                                data['avatar'] = '/images/user.png';
                            }
                            return res.render("dashboard/infor_account", { "data": data, "link": '/dashboard/profile', 'name': "Profile" });
                        }
                    }).catch(err => {
                        console.log(err);
                        return res.render('dashboard/infor_account', { "data": data, "link": '/dashboard/profile', 'name': "Profile" });
                    })
            }).catch(err => {
                console.log(385);
                console.log(err);
                return res.redirect("/")
            })
    } else res.redirect("/")
};

//title dashboard
async function getTitleAndBonusIco() {
    try {
        var config = await db.Config.findById(1);
        var time_now = Date.now() / 1000;
        console.log("time now = " + time_now);
        var start_preIco_date = config.date_preico;
        var end_preIco_date = config.date_preico_end;
        var start_ico_date = config.date_ico_1;
        var end_ico_date_round1 = config.date_ico_2;
        var end_ico_date_round2 = config.date_ico_3;
        var end_ico_date_round3 = config.date_ico_end;
        if (time_now < start_preIco_date) {
            return {
                title: "TOKEN SALE IS COMMING",
                bonus_lock: 0,
                bonus_unlock: 0
            }
        } else if (time_now <= end_preIco_date) {
            return {
                title: "TOKEN SALE IS PREICO",
                bonus_lock: 0,
                bonus_unlock: 0
            }
        } else if (time_now <= end_ico_date_round1) {
            return {
                title: "TOKEN SALE IS ICO ROUND 1",
                bonus_lock: 20,
                bonus_unlock: 15
            }
        } else if (time_now <= end_ico_date_round2) {
            return {
                title: "TOKEN SALE IS ICO ROUND 2",
                bonus_lock: 15,
                bonus_unlock: 10
            }
        } else if (time_now <= end_ico_date_round3) {
            return {
                title: "TOKEN SALE IS ICO ROUND 3",
                bonus_lock: 10,
                bonus_unlock: 0
            }
        } else {
            return {
                title: "TOKEN SALE IS COMPLETED",
                bonus_lock: 0,
                bonus_unlock: 0
            }
        }
    } catch (error) {
        console.log("getPriceToken error: " + error);
    }
}



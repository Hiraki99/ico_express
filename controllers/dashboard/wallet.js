'use strict'
const UNI_CURRENCY = 'UNI';
const ETH_CURRENCY = 'ETH';
const cc = require('cryptocompare');

var Promise = require('promise');
var db = require('../../db/models');
var Sequelize = require('sequelize');
var configController = require('../admin/manager/config');
var transactionController = require('../dashboard/transaction');
var Web3 = require('web3');
var web3 = new Web3();
var SC = require('../utils/Status_Constant');
var Config = require('../../smart_contract/config');
var PriceToken = require('./pricecrypto');
exports.wallet = (req, res) => {
    console.log(req.session.user_id);
    if (req.session.user_id)
        res.render('dashboard/wallet', { "link": '/dashboard/wallet', 'name': "Wallet" });
    else res.redirect('/');
};


exports.checkShowWallet = (req, res) => {
    if (req.session.user_id) {
        db.User.findById(req.session.user_id).then(user => {
            if (user != null) {
                if (user.wallet_id > 0) {
                    return res.send({ wallet: true });
                } else {
                    return res.send({ wallet: false });
                }
            } else {
                return res.redirect("/");
            }
        }).catch(err => {
            console.log("checkShowWallet err = " + err);
        })
    } else {
        return res.redirect("/");
    }
}


//get infor wallet
//need fix paragram
// req.session.user_id
exports.postInforWallet = (req, res) => {
    if (req.session.user_id && req.body.balance) {
        db.User.findById(req.session.user_id).then(user => {
            if (user != null) {
                //get wallet
                user.getWallet().then(wallet => {
                    if (wallet == null) {
                        return res.send({ wallet: null });
                    }
                    cc.histoMinute("ETH", 'USD', { "limit": 1 })
                        .then(async data => {

                            var ac_token_lock = Config.CONTRACT_ADDRESS_LOCK_TOKEN;
                            var ac_token_unlock = Config.CONTRACT_ADDRESS_UNLOCK_TOKEN;
                            var ac_token_unibot_holder = Config.ADDRESS_HOLDER_TOKEN;
                            try {
                                var price_token_lock = await PriceToken.getPriceToken(1);
                                var price_token_unlock = await PriceToken.getPriceToken(0);
                                var config = await db.Config.findById(1);
                                if (Math.round(wallet.total_token * 10) / 10 == Math.round(req.body.balance * 10) / 10) {
                                    //don't need database update and get data from smartcontract
                                    console.log("don't need database update and get data from smartcontract");
                                } else {
                                    //need update database and get data from smartcontract
                                    //get data from smartcontract
                                    console.log("need update database and get data from smartcontract");
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
                                        total_locked_token = Math.round(parseFloat(total_locked_token) / Math.pow(10, 18)*10)/10;
                                    } catch (err) {
                                        console.log("getInformationDashboard  total_locked_token null: " + err);
                                    }
                                    try {
                                        var total_eth = await Config.web3.eth.getBalance(wallet.address);
                                        total_eth = parseFloat(total_eth);
                                    } catch (err) {
                                        console.log("getInformationDashboard  total_eth null: " + err);
                                    }
                                    //update to database
                                    await wallet.update({
                                        total_locked_token: total_locked_token,
                                        total_token: Math.round(req.body.balance*10)/10,
                                        total_unlocked_token: Math.round(req.body.balance*10)/10 - total_locked_token,
                                        bonus_vip_ico: bonus_vip_ico,
                                        bonus_vip_preIco: bonus_vip_preIco,
                                        total_eth: total_eth
                                    });
                                }
                                // console.log({ wallet: wallet, value_eth: data[0].high });
                                var token_lock_tmp = Math.round(parseFloat(wallet.total_locked_token) * 10) / 10;
                                var token_unlock_tmp = Math.round(parseFloat(wallet.total_unlocked_token) * 10) / 10;
                                if(Date.now()/1000>config.release_date){
                                    token_lock_tmp -= Math.round(Math.round((Date.now() / 1000 - config.release_date) / config.time_cycle * 10 / 12) * token_lock_tmp)/10;
                                    token_lock_tmp = token_lock_tmp < 0? 0: token_lock_tmp;
                                    token_unlock_tmp = Math.round((wallet.total_token - token_lock_tmp)*10)/10;
                                }
                                return res.send({
                                    error: false,
                                    wallet: wallet,
                                    value_eth: data[0].high,
                                    price_token_lock: price_token_lock,
                                    price_token_unlock: price_token_unlock,
                                    ac_token_lock: ac_token_lock,
                                    ac_token_unlock: ac_token_unlock,
                                    ac_token_unibot_holder:ac_token_unibot_holder,
                                    amount_token_lock: token_lock_tmp,
                                    amount_token_unlock: token_unlock_tmp,
                                    amount_eth: parseFloat(wallet.total_eth) / Math.pow(10, 18)
                                });
                            } catch (error) {
                                console.log(error);
                                return res.send({
                                    error: true
                                });
                            }

                        })
                        .catch(err => {
                            return res.send({ error: true });
                        });
                }).catch(err => {
                    return res.send({ error: true });
                });
            }

        }).catch(err => {
            return res.send({ error: true });
        });
    } else res.redirect("/");


}

//change address wallet
//maybe change address wallet 
//infor about ico_preico, transaction and bonus will not change, 
//address wallet will change
//need to delete all the event of listening for transaction
//need fix paragram
exports.changeAddressWallet = (req, res) => {
    var user_id = req.session.user_id;
    if (user_id) {
        var data = req.body;
        var new_address = data.new_address;
        var password = data.password;
        db.User.findById(user_id).then(user => {

            //update transaction, bonus, ico_preico before change address

            //maybe add condition as auth and it's time that haven't any transaction is pending
            //need check transaction pending
            if (user != null && user.wallet_id != 0 && user.password == password && isAddress(new_address.toLowerCase())
                && web3.utils.isAddress(new_address.toLowerCase())) {
                checkAddressWalletReallyAndOnly(new_address, function (result) {
                    if (result) {
                        user.getWallet().then(wallet => {

                            wallet.address = new_address;
                            wallet.save().then(() => {
                                return res.send(JSON.stringify({ "success": true }));
                            }).catch(err => {
                                console.log(88);
                                console.log(err);
                                return res.send(JSON.stringify({ "error": true }));
                            });
                        });
                    } else return res.send(JSON.stringify({ "error": true }));
                })

            } else {
                return res.send(JSON.stringify({ "error": true }));
            }

        }).catch(err => {
            console.log("changeAddressWallet user err: " + err);
            return res.send(JSON.stringify({ "error": true }));
        });
    } else res.redirect("/");
}

function checkAddressWalletReallyAndOnly(address, cb) {
    if (address != Config.ADDRESS_HOLDER_TOKEN.toLowerCase()) {
        //check wallet address is really and only in database.
        db.Wallet.findOne({ where: { "address": address } })
            .then(result => {
                if (!result)
                    cb(true);
                else cb(false);
            });
    } else {
        cb(false);
    }

}

var isAddress = function (address) {
    return /^(0x)?[0-9a-f]{40}$/.test(address);
};

//add address wallet
//need fix paragram
exports.addAddressWallet = (req, res) => {
    if (req.session.user_id) {
        var data = req.body;
        var user_id = req.session.user_id;
        var new_address = data.new_address.toLowerCase();
        // req.new_address = "0x278s9fd8as76ffa9a8sf9asf00a0a0112";
        var password = data.password;
        // console.log("asdfasfasdf");
        // console.log(data);
        console.log(new_address);
        db.User.findById(user_id).then(user => {
            //maybe add condition as auth.
            if (user != null && user.wallet_id == 0 && user.password == password && isAddress(new_address.toLowerCase())
                && web3.utils.isAddress(new_address.toLowerCase())) {
                checkAddressWalletReallyAndOnly(new_address, function (result) {
                    console.log(result);
                    if (result) {
                        db.Config.findById(1).then(config => {
                            console.log("req.new_address = " + data.new_address);
                            //create new wallet
                            db.Wallet.create({
                                address: new_address,
                                total_unlocked_token: 0,
                                total_locked_token: 0,
                                total_token: 0,
                                total_eth: 0,
                            }).then(async wallet => {
                                console.log("wallet: " + JSON.stringify(wallet));
                                //update value wallet
                                try {
                                    var balance = await Config.web3.eth.getBalance(wallet.address);
                                    var total_token = await Config.contract_unibot.methods.balanceOf(wallet.address).call();
                                    var balance_token_lock = await Config.contract_unibot.methods.blocked_amount(wallet.address).call();
                                    var _balance = web3.utils.fromWei(balance.toString(), 'ether');
                                    var _balance_token_lock = web3.utils.fromWei(balance_token_lock.toString(), 'ether');
                                    var _total_token = web3.utils.fromWei(total_token.toString(), 'ether');
                                    var _balance_token_unlock = parseFloat(_total_token) - parseFloat(_balance_token_lock);
                                    if (_balance > 0 || _balance_token_lock > 0 || _balance_token_unlock > 0) {
                                        await wallet.update({ total_eth: parseFloat(_balance), total_unlocked_token: _balance_token_unlock, total_locked_token: parseFloat(_balance_token_lock), total_token: parseFloat(_total_token) })
                                    }
                                } catch (error) {
                                    console.log("update value of wallet when add address: " + error);
                                    console.log("create wallet err: " + error);
                                    wallet.destroy();
                                    user.wallet_id = 0;
                                    user.save();
                                    return res.send(JSON.stringify({ "error": true, 'log': 'Create wallet failed' }));
                                }
                                //create new airdrop
                                if (user.wallet_id == 0) {
                                    user.wallet_id = wallet.id;
                                    db.Airdrop.findById(1).then(airdrop => {
                                        //completed airdrop 1
                                        db.UserAirdrop.create({
                                            user_id: user.id,
                                            airdrop_id: airdrop.id,
                                            value: airdrop.bonus,
                                            status: SC.AirdropStatus.COMPLETED
                                        }).then(userAirdrop => {
                                            user.total_bonus_airdrop += userAirdrop.value;
                                            user.save();
                                            console.log(JSON.stringify(user));
                                            return res.send(JSON.stringify({ "error": false, 'log': 'Add address wallet success' }));
                                        }).catch(err => {
                                            console.log("create UserAirdrop err: " + err);
                                            wallet.destroy();
                                            user.wallet_id = 0;
                                            user.save();
                                            return res.send(JSON.stringify({ "error": true, 'log': 'Create wallet failed' }));
                                        });
                                    }).catch(err => {
                                        console.log("get airdrop err: " + err);
                                        wallet.destroy();
                                        user.wallet_id = 0;
                                        user.save();
                                        return res.send(JSON.stringify({ "error": true, 'log': 'Create wallet failed' }));
                                    });
                                } else {
                                    user.wallet_id = wallet.id;
                                    user.save();
                                    return res.send(JSON.stringify({ "error": false, 'log': 'Add address wallet success' }));
                                }

                            }).catch(err => {
                                console.log("create wallet err: " + err);
                                return res.send(JSON.stringify({ "error": true, 'log': 'Create wallet failed' }));
                            });
                        });
                    } else {
                        return res.send(JSON.stringify({ "error": true, 'log': "Address is exist!" }));
                    }
                });
            } else {
                return res.send(JSON.stringify({ "error": true, 'log': 'Account or address is incorrect!' }));
            }
        });
    } else res.redirect('/');
}


//post list transaction in wallet page.
exports.postListTransaction = (req, res) => {
    var user_id = req.session.user_id;
    if (user_id) {
        db.User.findById(user_id).then(user => {
            user.getWallet().then(wallet => {
                if (wallet == null) {
                    console.log("wallet is null");
                    return res.redirect("/");
                }
                transactionController.getListTransactionsLimit(wallet, 10).then(listTrans => {
                    // show list transaction uni and eth
                    console.log("list transaction = " + JSON.stringify(listTrans));
                    return res.send({
                        listUni: listTrans,
                        wallet_address: wallet.address,
                        token_lock: Config.CONTRACT_ADDRESS_LOCK_TOKEN,
                        token_unlock: Config.CONTRACT_ADDRESS_UNLOCK_TOKEN
                    });
                }).catch(err => {
                    console.log("err: " + err);
                    return res.send(JSON.stringify({
                        'error': err
                    }))
                });
            }).catch(err => {
                console.log("err 2:" + err);
                return res.send(JSON.stringify({
                    'error': err
                }));
            });
        }).catch(err => {
            console.log("err 3:" + err);
            return res.send(JSON.stringify({
                'error': err
            }))
        });
    } else return res.send(JSON.stringify({
        'error': "user_id is null"
    }));

}

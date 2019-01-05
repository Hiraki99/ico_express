const path = require('path');
const db = require('../../../db/models');
const fs = require('fs');
const Config = require('../../../smart_contract/config');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const SC = require('../../utils/Status_Constant');
var web3 = require('web3');

exports.sendBonusReferalIco = async (req, res) => {
    if (req.session.admin_id && req.session.admin_type == SC.AdminType.ROOT) {
        var data = req.body;
        var password = data.password;
        var prikey = data.key;
        var type = data.type;
        var account_id = data.id;
        var admin_id = req.session.admin_id;
        var admin_type = req.session.admin_type;
        var config = await db.Config.findById(1);
        var max = data.max;
        console.log("Date.now()/1000 = " + Date.now() / 1000);
        //check ico is finished
        // if (config.date_ico_end < Date.now() / 1000) {
        if (true) {
            var admin = await db.Admin.findById(admin_id);
            if (admin == null) {
                return;
            }
            if (admin.type == SC.AdminType.ROOT && admin.password == password) {
                var privateKey = prikey;
                getListKyced().then(async listUserKyced => {
                    console.log(JSON.stringify(listUserKyced));
                    if (listUserKyced != null) {
                        var listAddress = new Array();
                        var listBonusReferal = new Array();
                        var tmp_length = listUserKyced.length < max ? listUserKyced.length : max;
                        for (var i = 0; i < tmp_length; i++) {
                            listAddress.push(listUserKyced[i].wallet.address);
                            listBonusReferal.push(0);
                        }
                        console.log(JSON.stringify(listAddress));
                        console.log(JSON.stringify(listBonusReferal));
                        // console.log(JSON.stringify());
                        if (listAddress.length > 0 && listBonusReferal.length == listAddress.length) {
                            var data = Config.contract_ico.methods.sendListAllBonus(listAddress, listBonusReferal).encodeABI();
                            Config.createRawTransaction(admin.address, Config.CONTRACT_ADDRESS_ICO, 0, req.body.gasPrice, 4000000, data, Config.CHAND_ID)
                                .then(result => {
                                    console.log("sendListAllBonus rawTransaction = " + JSON.stringify(result));
                                    var tx = Config.signToRawTransaction(privateKey, result);
                                    return Config.sendRawTransaction(tx)
                                        .once('transactionHash', async function (hash) {
                                            console.log("hash = " + hash);
                                            var tmp = await db.Transaction.findOne({ where: { hash: hash } });
                                            console.log(JSON.stringify(tmp));
                                            if (tmp == null) {
                                                db.Transaction.create({
                                                    hash: hash,
                                                    type: SC.TransactionType.BONUS_TOKEN,
                                                    status: SC.TransactionStatus.PENDING,
                                                    admin_id: req.session.admin_id,
                                                    input: JSON.stringify({ listAddress: listAddress, listBonusReferal: listBonusReferal }),
                                                }).then(transaction => {
                                                    res.next({
                                                        error: false,
                                                        log: "Create transaction in database is completed. Transaction is pending",
                                                        title: "Done"
                                                    })
                                                    console.log("createRawTransaction done " + JSON.stringify(transaction));
                                                }).catch(err => {
                                                    res.next({
                                                        error: true,
                                                        log: "Create transaction in database is failed",
                                                        title: "Error"
                                                    })
                                                    console.log("createRawTransaction done, but save transaction err: " + err);
                                                });
                                            } else {
                                                console.log("transaction is pending");
                                                res.next({
                                                    error: false,
                                                    log: "Transaction is pending",
                                                    title: "Done"
                                                })
                                            }
                                        }).then(async trans => {
                                            console.log("trans = " + JSON.stringify(trans));
                                            var tran = await db.Transaction.findOne({ where: { hash: trans.transactionHash } })
                                            if (tran != null) {
                                                await tran.update({
                                                    status: trans.status == true ? SC.TransactionStatus.SUCCESS : SC.TransactionStatus.FAIL,
                                                    from: trans.from,
                                                    to: trans.to,
                                                    fee: trans.gasUsed,
                                                    nonce: trans.transactionIndex
                                                }).then(() => {
                                                    console.log("createRawTransaction done 2");
                                                }).catch(err => {
                                                    console.log("createRawTransaction done 2, but save transaction err: " + err);
                                                });
                                            } else {
                                                console.log("transaction is not exist");
                                            }
                                            if (trans.status != true) {
                                                return res.send({
                                                    error: false,
                                                    log: "Transaction is failed",
                                                    title: "Failed"
                                                })
                                            }
                                            var listUpdate = new Array();
                                            for (var i = 0; i < tmp_length; i++) {
                                                listUpdate.push(listUserKyced[i].user.update({
                                                    is_send_bonus_referal: 1
                                                }));
                                            }
                                            Promise.all(listUpdate).then(() => {
                                                console.log("sendListAllBonus sendBonus completed ");
                                                return res.send({
                                                    error: false,
                                                    log: "Send bonus referal completed!",
                                                    title: "Completed"
                                                });
                                            }).catch(err => {
                                                console.log("sendListAllBonus sendBonus fail ");
                                                return res.send({
                                                    error: true,
                                                    log: JSON.stringify(err),
                                                    title: "Update Database Failed"
                                                });
                                            })

                                        })
                                }).catch(err => {
                                    console.log("sendListAllBonus err " + err);
                                    return res.send({
                                        error: true,
                                        log: "sendListAllBonus " + JSON.stringify(err),
                                        title: "Error"
                                    });
                                });
                        } else {
                            console.log("Not have Address!");
                            return res.send({
                                error: true,
                                log: "Not have Address! " + JSON.stringify(err),
                                title: "Error"
                            });
                        }
                    } else {
                        console.log("Not have bonus!");
                        return res.send({
                            error: true,
                            log: "Not have bonus! " + JSON.stringify(err),
                            title: "Error"
                        });
                    }
                }).catch(err => {
                    console.log(err);
                    return res.send({
                        error: true,
                        log: "Error: " + JSON.stringify(err),
                        title: "Error"
                    });
                });
            } else {
                console.log("Input is incorrect!");
                return res.send({
                    error: true,
                    log: "Input is incorrect! " + JSON.stringify(err),
                    title: "Error"
                });
            }
        } else {
            console.log("Can't send bonus until ico is finished!");
            return res.send({
                error: true,
                log: "Can't send bonus until ico is finished!",
                title: "Error"
            });
        }
    }
}

function getListKyced() {
    return new Promise(async (resolve, reject) => {
        //send Bonus
        var listUser = await db.User.findAll({
            where: {
                kyc_id: {
                    [Op.gt]: 0
                },
                wallet_id: {
                    [Op.gt]: 0
                }
            }
        });
        // console.log("listuser = " + JSON.stringify(listUser));
        if (listUser == null) {
            console.log("list user is null!");
            return null;
        }
        var i = 0;
        var listUserKyced = new Array();
        var list = new Array();
        await Promise.all(listUser.map(async user => {
            var wallet_ = (await user.getWallet());
            var kyc_ = (await user.getKYC());
            console.log("wallet = " + JSON.stringify(wallet_));
            console.log("kyc_ = " + JSON.stringify(kyc_));
            var obj = {
                'user': user,
                'wallet': wallet_,
                'kyc': kyc_
            };
            if (wallet_ != null && kyc_ != null
                && (kyc_.status == SC.KycStatus.COMPLETED
                    || kyc_.status == SC.KycStatus.PENDING
                    || kyc_.status == SC.KycStatus.SUCCESS) && user.is_send_bonus_referal == 0) {
                return obj;
            }
            return null;
        })).then(values => {
            values.forEach(element => {
                if (element != null) {
                    listUserKyced.push(element);
                }
            });
            resolve(listUserKyced);
        }).catch(err => {
            reject(err);
        })
    });
}


exports.send_bonus = (req, res) => {
    console.log("req.session.admin_type = " + req.session.admin_type);
    if (req.session.admin_id && req.session.admin_type == SC.AdminType.ROOT) {
        return res.render('admin/tokenmanager/bonus', { 'login': true, 'type': req.session.admin_type });
    } else return res.redirect('/');

};

exports.sendAirdrop = async (req, res) => {
    if (req.session.admin_id && req.session.admin_type == SC.AdminType.ROOT) {
        var data = req.body;
        var password = data.password;
        var prikey = data.key;
        var type = data.type;
        var account_id = data.id;
        var admin_id = req.session.admin_id;
        var admin_type = req.session.admin_type;
        var config = await db.Config.findById(1);
        var max = data.max;
        // var max =10;
        console.log("Date.now()/1000 = " + Date.now() / 1000);
        //check ico is finished
        // if (config.date_ico_end < Date.now() / 1000) {
        if (true) {
            var admin = await db.Admin.findById(admin_id);
            if (admin == null) {
                return;
            }
            if (admin.type == SC.AdminType.ROOT && admin.password == password) {
                var privateKey = prikey;
                getListKycedAirdrop().then(async listUserKyced => {
                    console.log(JSON.stringify(listUserKyced));
                    if (listUserKyced != null) {
                        var listAddress = new Array();
                        var listBonusAirdrop = new Array();
                        var tmp_length = listUserKyced.length < max ? listUserKyced.length : max;
                        for (var i = 0; i < tmp_length; i++) {
                            listAddress.push(listUserKyced[i].wallet.address);
                            listBonusAirdrop.push(listUserKyced[i].user.total_bonus_airdrop);
                        }
                        console.log(JSON.stringify(listAddress));
                        console.log(JSON.stringify(listBonusAirdrop));
                        // console.log(JSON.stringify());
                        if (listAddress.length > 0 && listBonusAirdrop.length == listAddress.length) {
                            var data = Config.contract_ico.methods.sendListBonusAirdrop(listAddress, listBonusAirdrop).encodeABI();

                            Config.createRawTransaction(admin.address, Config.CONTRACT_ADDRESS_ICO, 0, req.body.gasPrice, 4000000, data, Config.CHAND_ID)
                                .then(result => {
                                    console.log("sendAirdrop rawTransaction = " + JSON.stringify(result));
                                    var tx = Config.signToRawTransaction(privateKey, result);
                                    return Config.sendRawTransaction(tx);
                                }).once('transactionHash', async function (hash) {
                                    console.log("hash = " + hash);
                                    var tmp = await db.Transaction.findOne({ where: { hash: hash } });
                                    console.log(JSON.stringify(tmp));
                                    if (tmp == null) {
                                        db.Transaction.create({
                                            hash: hash,
                                            type: SC.TransactionType.BONUS_AIRDROP,
                                            status: SC.TransactionStatus.PENDING,
                                            admin_id: req.session.admin_id,
                                            input: JSON.stringify({ listAddress: listAddress, listBonusAirdrop: listBonusAirdrop }),
                                        }).then(transaction => {
                                            res.next({
                                                error: false,
                                                log: "Create transaction in database is completed. Transaction is pending",
                                                title: "Done"
                                            })
                                            console.log("createRawTransaction done " + JSON.stringify(transaction));
                                        }).catch(err => {
                                            res.next({
                                                error: true,
                                                log: "Create transaction in database is failed",
                                                title: "Error"
                                            })
                                            console.log("createRawTransaction done, but save transaction err: " + err);
                                        });
                                    } else {
                                        res.next({
                                            error: false,
                                            log: "Transaction is pending",
                                            title: "Done"
                                        })
                                        console.log("transaction is pending");
                                    }
                                }).then(async trans => {
                                    console.log("trans = " + JSON.stringify(trans));
                                    if (trans != null) {
                                        var tran = await db.Transaction.findOne({ where: { hash: trans.transactionHash } })
                                        await tran.update({
                                            status: trans.status == true ? SC.TransactionStatus.SUCCESS : SC.TransactionStatus.FAIL,
                                            from: trans.from,
                                            to: trans.to,
                                            fee: trans.gasUsed,
                                            nonce: trans.transactionIndex
                                        }).then(() => {
                                            console.log("createRawTransaction done 2");
                                        }).catch(err => {
                                            console.log("createRawTransaction done 2, but save transaction err: " + err);
                                        });

                                        if (trans.status != true) {
                                            return res.send({
                                                error: false,
                                                log: "Transaction is failed!",
                                                title: "Failed"
                                            });
                                        }
                                        // update data
                                        var listAirdrop = new Array();
                                        for (var j = 0; j < tmp_length; j++) {
                                            listAirdrop.push(listUserKyced[j].user.update({ total_bonus_airdrop: 0 }));
                                        }
                                        Promise.all(listAirdrop).then(listAir => {
                                            console.log("sendAirdrop Bonus success");
                                            return res.send({
                                                error: false,
                                                log: "Send bonus Airdrop is completed",
                                                title: "Completed"
                                            });
                                        }).catch(err => {
                                            console.log(err);
                                            return res.send({
                                                error: true,
                                                log: JSON.stringify(err),
                                                title: "Update Database Failed"
                                            });
                                        });
                                    }
                                }).catch(err => {
                                    console.log("sendAirdrop err " + err);
                                    return res.send({
                                        error: true,
                                        log: JSON.stringify(err),
                                        title: "Error"
                                    });
                                });
                        } else {
                            console.log("Not have Address!");
                            return res.send({
                                error: true,
                                log: "Not have Address! " + JSON.stringify(err),
                                title: "Error"
                            });
                        }
                    } else {
                        console.log("Not have bonus!");
                        return res.send({
                            error: true,
                            log: "Not have bonus! " + JSON.stringify(err),
                            title: "Error"
                        });
                    }
                }).catch(err => {
                    console.log(err);
                    return res.send({
                        error: true,
                        log: JSON.stringify(err),
                        title: "Error"
                    });
                });

            } else {
                console.log("Input is incorrect!");
                return res.send({
                    error: true,
                    log: "Input is incorrect! ",
                    title: "Error"
                });
            }
        } else {
            console.log("Can't send bonus until ico is finished!");
            return res.send({
                error: true,
                log: "Can't send bonus until ico is finished! ",
                title: "Error"
            });
        }
    }
}


async function getListKycedAirdrop() {
    return new Promise(async (resolve, reject) => {
        //send Bonus
        var listUser = await db.User.findAll({
            where: {
                kyc_id: {
                    [Op.gt]: 0
                },
                wallet_id: {
                    [Op.gt]: 0
                }
            }
        });
        console.log("listuser = " + JSON.stringify(listUser));
        if (listUser == null) {
            console.log("list user is null!");
            return null;
        }
        var i = 0;
        var listUserKyced = new Array();
        var list = new Array();
        await Promise.all(listUser.map(async user => {
            var wallet_ = (await user.getWallet());
            var kyc_ = (await user.getKYC());
            // console.log("wallet = " + JSON.stringify(wallet_));
            // console.log("kyc_ = " + JSON.stringify(kyc_));
            var obj = {
                'user': user,
                'wallet': wallet_,
                'kyc': kyc_
            };
            if (wallet_ != null && kyc_ != null
                && (kyc_.status == SC.KycStatus.COMPLETED
                    || kyc_.status == SC.KycStatus.PENDING
                    || kyc_.status == SC.KycStatus.SUCCESS)
                && user.total_bonus_airdrop > 0) {

                return obj;
            }
            return null;
        })).then(values => {
            values.forEach(element => {
                if (element != null) {
                    listUserKyced.push(element);
                }
            });
            resolve(listUserKyced);
        }).catch(err => {
            reject(err);
        })
    });
}



exports.getInforBonus = async (req, res) => {
    if (req.session.admin_id && req.session.admin_type == SC.AdminType.ROOT) {
        var totalReferal = 0;
        var totalAmountReferal = 0;
        var listTrans = new Array();
        try {
            totalReferal = await Config.contract_bonus_referal.methods.totalReferal.call();
            totalAmountReferal = await Config.contract_bonus_referal.methods.totalAmountReferal.call();
            console.log("totalReferal = " + totalReferal);
            console.log("totalAmountReferal = " + totalAmountReferal);
            listTrans = await db.Transaction.findAll({
                where: {
                    [Op.or]: [{ type: SC.TransactionType.BONUS_TOKEN }]
                },
                order: [['id', 'DESC']],
                attributes: ['id', 'fee', 'hash', 'status']
            });
        } catch (error) {
            console.log("getInforBonus error: " + error);
        }
        return res.send(JSON.stringify({ 'amount_user': totalAmountReferal, 'total_bonus_referal_ico': totalReferal, 'listTrans': listTrans }));
    }
}

exports.getInforBonusAirdrop = (req, res) => {
    if (req.session.admin_id && req.session.admin_type == SC.AdminType.ROOT) {
        var listTrans = new Array();
        getListKycedAirdrop().then(async listUserKyced => {
            console.log("listUserKyced xxx= " + JSON.stringify(listUserKyced));
            var total_bonus_airdrop = 0;
            var length = 0;
            if (listUserKyced != null) {
                listUserKyced.forEach(element => {
                    total_bonus_airdrop += element.user.total_bonus_airdrop;
                    length++;
                });
            }
            listTrans = await db.Transaction.findAll({
                where: {
                    [Op.or]: [{ type: SC.TransactionType.BONUS_AIRDROP }]
                },
                order: [['id', 'DESC']],
                attributes: ['id', 'fee', 'hash', 'status']
            });
            return res.send(JSON.stringify({ 'amount_user': length, "total_bonus_airdrop": total_bonus_airdrop, 'listTrans': listTrans }));
        }).catch(err => {
            return res.send(JSON.stringify({ 'error': err }));
        });
    }
}

exports.sendBonusAirdropForOneAccount = async (req, res) => {
    if (req.session.admin_type == SC.AdminType.ROOT) {
        if (req.body.user_id && req.body.private && req.body.password && req.body.gasPrice) {
            try {
                var admin = await db.Admin.findById(req.session.admin_id);
                var user = await db.User.findById(req.body.user_id);
                var wallet = await user.getWallet();
                if (admin == null || user == null || wallet == null) {
                    return res.send({
                        error: true,
                        log: "Input is incorrect, can\'t not found admin, user or address",
                        title: "Error"
                    });
                }
                var listAddress = [wallet.address];
                var listBonus = [user.total_bonus_airdrop];
                var data = Config.contract_ico.methods.sendListBonusAirdrop(listAddress, listBonus).encodeABI();
                Config.createRawTransaction(admin.address, Config.CONTRACT_ADDRESS_ICO, 0, req.body.gasPrice, 4000000, data, Config.CHAND_ID)
                    .then(result => {
                        console.log("sendAirdrop rawTransaction = " + JSON.stringify(result));
                        var tx = Config.signToRawTransaction(req.body.private, result);
                        return Config.sendRawTransaction(tx);
                    }).once('transactionHash', async function (hash) {
                        console.log("hash = " + hash);
                        var tmp = await db.Transaction.findOne({ where: { hash: hash } });
                        if (tmp == null) {
                            db.Transaction.create({
                                hash: hash,
                                type: SC.TransactionType.BONUS_AIRDROP,
                                status: SC.TransactionStatus.PENDING,
                                admin_id: req.session.admin_id,
                                input: JSON.stringify({ listAddress: listAddress, listBonus: listBonus }),
                            }).then(transaction => {
                                res.next({
                                    error: false,
                                    log: "Create transaction in database is completed",
                                    title: "Done"
                                });
                            }).catch(err => {
                                res.next({
                                    error: true,
                                    log: "Create transaction in database is failed",
                                    title: "Failed"
                                });
                            });
                        } else {
                            res.next({
                                error: false,
                                log: "Transaction is pending",
                                title: "Pending"
                            });
                        }
                    }).then(async trans => {
                        console.log("trans = " + JSON.stringify(trans));
                        if (trans != null) {
                            var tran = await db.Transaction.findOne({ where: { hash: trans.transactionHash } })
                            await tran.update({
                                status: trans.status == true ? SC.TransactionStatus.SUCCESS : SC.TransactionStatus.FAIL,
                                from: trans.from,
                                to: trans.to,
                                fee: trans.gasUsed,
                                nonce: trans.transactionIndex
                            }).then(() => {
                                console.log("createRawTransaction done 2");
                            }).catch(err => {
                                console.log("createRawTransaction done 2, but save transaction err: " + err);
                            });

                            if (trans.status != true) {
                                return res.send({
                                    error: false,
                                    log: "Transaction is failed",
                                    title: "Failed"
                                });
                            }
                            // update data
                            var listAirdrop = new Array();
                            for (var j = 0; j < tmp_length; j++) {
                                listAirdrop.push(listUserKyced[j].user.update({ total_bonus_airdrop: 0 }));
                            }
                            Promise.all(listAirdrop).then(listAir => {
                                console.log("sendAirdrop Bonus success");
                                return res.send({
                                    error: false,
                                    log: "Send bonus Airdrop is completed",
                                    title: "Completed"
                                });
                            }).catch(err => {
                                console.log(err);
                                return res.send({
                                    error: true,
                                    log: JSON.stringify(err),
                                    title: "Update Database Failed"
                                });
                            });
                        }
                        console.log("sendAirdrop sendBonus waitting ");
                        return res.send({ 'completed': "sendAirdrop sendBonus waitting " });
                    }).catch(err => {
                        console.log("sendAirdrop err " + err);
                        return res.send({
                            error: true,
                            log: JSON.stringify(err),
                            title: "Error"
                        });
                    });
            } catch (error) {
                return res.send({
                    error: true,
                    log: JSON.stringify(error),
                    title: "Error"
                });
            }

        } else {
            return res.send({
                error: true,
                log: "Input is incorrect",
                title: "Error"
            });
        }
    } else {
        return res.send({
            error: true,
            log: "Request is no permission",
            title: "Permission denied"
        });
    }
}

exports.sendBonusReferalForOneAccount = async (req, res) => {
    if (req.session.admin_type == SC.AdminType.ROOT) {
        if (req.body.user_id && req.body.private && req.body.password && req.body.gasPrice) {
            try {
                var admin = await db.Admin.findById(req.session.admin_id);
                var user = await db.User.findById(req.body.user_id);
                var wallet = await user.getWallet();
                if (admin == null || user == null) {
                    return res.send({
                        error: true,
                        log: "Input is incorrect, can\'t not found admin or user",
                        title: "Error"
                    });
                }
                var listAddress = [wallet.address];
                var listBonus = [0];
                var data = Config.contract_ico.methods.sendListAllBonus(listAddress, listBonus).encodeABI();
                Config.createRawTransaction(admin.address, Config.CONTRACT_ADDRESS_ICO, 0, req.body.gasPrice, 4000000, data, Config.CHAND_ID)
                    .then(result => {
                        console.log("sendListAllBonus rawTransaction = " + JSON.stringify(result));
                        var tx = Config.signToRawTransaction(privateKey, result);
                        return Config.sendRawTransaction(tx)
                            .once('transactionHash', async function (hash) {
                                console.log("hash = " + hash);
                                var tmp = await db.Transaction.findOne({ where: { hash: hash } });
                                if (tmp == null) {
                                    db.Transaction.create({
                                        hash: hash,
                                        type: SC.TransactionType.BONUS_TOKEN,
                                        status: SC.TransactionStatus.PENDING,
                                        admin_id: req.session.admin_id,
                                        input: JSON.stringify({ listAddress: listAddress, listBonus: listBonus }),
                                    }).then(transaction => {
                                        console.log("createRawTransaction done " + JSON.stringify(transaction));
                                        res.next({
                                            error: false,
                                            log: "Create transaction in database is completed",
                                            title: "Done"
                                        });
                                    }).catch(err => {
                                        console.log("createRawTransaction done, but save transaction err: " + err);
                                        res.next({
                                            error: true,
                                            log: "Create transaction in database is failed",
                                            title: "Failed"
                                        });
                                    });
                                } else {
                                    console.log("transaction is pending");
                                    res.next({
                                        error: false,
                                        log: "Transaction is failed",
                                        title: "Failed"
                                    });
                                }
                            }).then(async trans => {
                                console.log("trans = " + JSON.stringify(trans));
                                var tran = await db.Transaction.findOne({ where: { hash: trans.transactionHash } })
                                if (tran != null) {
                                    await tran.update({
                                        status: trans.status == true ? SC.TransactionStatus.SUCCESS : SC.TransactionStatus.FAIL,
                                        from: trans.from,
                                        to: trans.to,
                                        fee: trans.gasUsed,
                                        nonce: trans.transactionIndex
                                    }).then(() => {
                                        console.log("createRawTransaction done 2");
                                    }).catch(err => {
                                        console.log("createRawTransaction done 2, but save transaction err: " + err);

                                    });
                                } else {
                                    console.log("transaction is not exist");
                                }
                                if (trans.status != true) {
                                    return res.send({
                                        error: false,
                                        log: "Transaction is failed",
                                        title: "Failed"
                                    });
                                }
                                var listUpdate = new Array();
                                for (var i = 0; i < tmp_length; i++) {
                                    listUpdate.push(listUserKyced[i].user.update({
                                        is_send_bonus_referal: 1
                                    }));
                                }
                                Promise.all(listUpdate).then(() => {
                                    console.log("sendListAllBonus sendBonus completed ");
                                    return res.send({
                                        error: false,
                                        log: "Send bonus referal completed!",
                                        title: "Completed"
                                    });
                                }).catch(err => {
                                    console.log("sendListAllBonus sendBonus fail ");
                                    return res.send({
                                        error: true,
                                        log: JSON.stringify(err),
                                        title: "Update Database Failed"
                                    });
                                })
                            });
                    }).catch(err => {
                        console.log("sendListAllBonus err " + err);
                        return res.send({
                            error: true,
                            log: JSON.stringify(err),
                            title: "Error"
                        });
                    });
            } catch (error) {
                return res.send({
                    error: true,
                    log: JSON.stringify(error),
                    title: "Error"
                });
            }
        } else {
            return res.send({
                error: true,
                log: "Input is incorrect",
                title: "Error"
            });
        }
    } else {
        return res.send({
            error: true,
            log: "Request is no permission",
            title: "Permission denied"
        });
    }
}

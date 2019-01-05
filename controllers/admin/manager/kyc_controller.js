const multer = require('multer');
const path = require('path');
const db = require('../../../db/models');
const fs = require('fs');
const KYC = db.KYC;
const User = db.User;
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const Config = require('../../../smart_contract/config');
var dir = path.join(__dirname, '../../../public/uploads');
const SC = require('../../utils/Status_Constant');
exports.list_user_kyc = (req, res) => {
    var type = req.session.admin_type;
    if (req.session.admin_name) {
        return res.render('admin/kyc/list_kyc', { 'login': true, 'type': type });
    } else return res.redirect('/')
};

exports.getAllKyc = (req, res) => {
    if (req.session.admin_name) {
        KYC.findAll({ where: { status: {
            [Op.or]: [SC.KycStatus.WAITING, SC.KycStatus.PROCESSING]
        }}})
            .then(data => {
                var list = []
                for (var i = 0; i < data.length; i++) {
                    list.push(data[i].dataValues);
                }

                return res.send(list);
            }).catch(error => {
                console.log(error);
                return res.send(JSON.stringify({ "error": true }));
            });
    } else res.redirect('/');
}
exports.list_kyc_verified = (req, res) => {
    var type = req.session.admin_type;
    if (req.session.admin_name) {
        return res.render('admin/kyc/submitkyc_contract', { 'login': true, 'type': type });
    } else return res.redirect('/');
}
exports.getAllKycPeding = (req, res) => {

    if (req.session.admin_type == SC.AdminType.SUPPORTER) {
        KYC.findAll({ where: { "status": SC.KycStatus.PENDING, "admin_id": req.session.admin_id } })
            .then(data => {
                // console.log(data);
                var list = [];
                for (var i = 0; i < data.length; i++) {
                    list.push(data[i].dataValues);
                }
                return res.send({ "error": false, 'list': list });
            }).catch(error => {
                console.log(error);
                return res.send(JSON.stringify({ "error": true }));
            });
    } else if (req.session.admin_type == SC.AdminType.ROOT || req.session.admin_type == SC.AdminType.MANAGER) {
        KYC.findAll({ where: { "status": SC.KycStatus.PENDING } })
            .then(data => {
                // console.log(data);
                var list = [];
                for (var i = 0; i < data.length; i++) {
                    list.push(data[i].dataValues);
                }
                return res.send({ "error": false, 'list': list });
            }).catch(error => {
                console.log(error);
                return res.send(JSON.stringify({ "error": true }));
            });
    } else {
        res.redirect('/');
    }
}

exports.cancelKyc = async (req, res) => {
    if (req.session.admin_type == SC.AdminType.ROOT || req.session.admin_type == SC.AdminType.SUPPORTER || req.session.admin_type == SC.AdminType.MANAGER) {
        if (req.body.kyc_id) {
            var kyc = await db.KYC.findById(req.body.kyc_id);
            if (kyc != null && kyc.admin_id == req.session.admin_id && kyc.status == SC.KycStatus.PENDING) {
                await kyc.update({ status: SC.KycStatus.WAITING });
                return res.send({
                    error: false,
                    log: "Cancel KYC completed!"
                });
            } else {
                return res.send({
                    error: true,
                    log: "Cancel KYC failed!"
                });
            }
        } else {
            return res.send({
                error: true,
                log: "Input is incorrect!"
            });
        }
    } else {
        return res.send({
            error: true,
            log: "Permission denied!"
        });
    }
}

exports.cancelKycSmartContract = async (req, res) => {
    if (req.body.type == "Normal" && (req.session.admin_type == SC.AdminType.ROOT || req.session.admin_type == SC.AdminType.MANAGER)) {
        if (req.body.user_id && req.body.private) {
            try {
                var admin = await db.Admin.findById(req.session.admin_id);
                var user = await db.User.findById(req.body.user_id);
                var wallet = await user.getWallet();
                var kyc = await db.KYC.findById(user.kyc_id);
                if (kyc != null && kyc.admin_id == req.session.admin_id && kyc.status == SC.KycStatus.SUCCESS) {
                    var data = Config.contract_ico.methods.cancelKyc(wallet.address).encodeABI();
                    var privateKey = req.body.private;
                    Config.createRawTransaction(admin.address, Config.CONTRACT_ADDRESS_ICO, 0, 15, 3000000, data, Config.CHAND_ID).then(rawTransaction => {
                        var tx = Config.signToRawTransaction(privateKey, rawTransaction);
                        Config.sendRawTransaction(tx)
                            .once('transactionHash', async function (hash) {
                                res.next({
                                    error: false,
                                    title: "waiting",
                                    log: "transaction is pending" + "<\/br> txs: " + hash
                                });
                            })
                            .then(async result => {
                                console.log("result = " + JSON.stringify(result));
                                await kyc.update({ status: SC.KycStatus.WAITING });
                                return res.send({
                                    error: false,
                                    title: "Success",
                                    log: "Cancel KYC completed!"
                                });
                                // })
                                // .catch(err => {
                                //     return res.send({
                                //         error:false,
                                //         title: "Error",
                                //         log: JSON.stringify(err)
                                //     });
                            });

                    }).then(err => {
                        return res.send({
                            error: true,
                            log: "Cancel KYC failed!",
                            title: "Error"
                        });
                    });

                } else {
                    return res.send({
                        error: true,
                        log: "Cancel KYC failed!",
                        title: "Error"
                    });
                }
            } catch (error) {
                console.log("cancelKYCSmartcontract err:" + error);
                return res.send({
                    error: true,
                    log: JSON.stringify(error),
                    title: "Error"
                });
            }

        } else {
            return res.send({
                error: true,
                log: "Input is incorrect!",
                title: "Error"
            });
        }
    } else {
        return res.send({
            error: true,
            log: "Permission denied!",
            title: "Error"
        });
    }
}

exports.getListKYCTransaction = async (req, res) => {
    if (req.session.admin_type == SC.AdminType.SUPPORTER || req.session.admin_type == SC.AdminType.ROOT || req.session.admin_type == SC.AdminType.MANAGER) {
        var list;
        if (req.session.admin_type == SC.AdminType.SUPPORTER) {
            list = db.Transaction.findAll({ where: { "admin_id": req.session.admin_id, "type": SC.TransactionType.KYC }, order: [['updatedAt', 'DESC']] })
        } else {
            list = db.Transaction.findAll({ where: { "type": SC.TransactionType.KYC }, order: [['updatedAt', 'DESC']] })
        }
        list.then(data => {
            // console.log(data);
            var list = [];
            var listAdmin = new Array();
            for (var i = 0; i < data.length; i++) {
                listAdmin.push(db.Admin.findById(data[i].admin_id));
            }
            Promise.all(listAdmin).then(listadmin => {
                for (var i = 0; i < data.length; i++) {
                    list.push({
                        hash: data[i].hash,
                        fee: data[i].fee,
                        input: data[i].input,
                        status: data[i].status,
                        number: (JSON.parse(data[i].input)).listAddress.length,
                        admin_id: data[i].admin_id,
                        nickname: listadmin[i].nickname
                    });
                }
                return res.send({ "error": false, 'list': list });
            }).catch(err => {
                console.log(err);
                return res.send(JSON.stringify({ "error": true }));
            });
        }).catch(error => {
            console.log(error);
            return res.send(JSON.stringify({ "error": true }));
        });
    } else {
        res.redirect('/');
    }
}

exports.update_list_kyc_verified_2SC = async (req, res) => {
    if (req.session.admin_type == SC.AdminType.ROOT || req.session.admin_type == SC.AdminType.SUPPORTER || req.session.admin_type == SC.AdminType.MANAGER) {
        try {
            var admin = await db.Admin.findById(req.session.admin_id);
            if (admin == null) {
                return res.send(JSON.stringify({ "error": " Admin is not exist!" }));
            }
            var private_key = req.body.private;
            var listKycId = req.body.list_id;
            //find listUser -> listParent -> listWallet ->listAddress
            var listUser = new Array();
            var listParent = new Array();
            var listWallet = new Array();
            var listAddress = new Array();
            var listParentAddress = new Array();
            var listParentWallet = new Array();
            // console.log("admin = "+admin);
            // console.log("admin.username = "+admin.username);
            // console.log("listKycId = "+listKycId);
            // console.log("private_key = "+private_key);
            if (admin != null && admin.username == req.session.admin_name && listKycId != null && private_key != "") {
                listKycId.forEach(element => {
                    // console.log("listKycId element = "+element)
                    listUser.push(db.User.findOne({ where: { kyc_id: element } }));
                });
                Promise.all(listUser).then(listuser => {
                    // console.log("listuser = "+JSON.stringify(listuser));
                    listUser = new Array();
                    listUser = listuser;
                    // console.log("listUser = "+JSON.stringify(listUser));
                    listuser.forEach(element => {
                        // console.log("listuser element= "+JSON.stringify(element));
                        listWallet.push(element.getWallet());
                        listParent.push(db.User.findById(element.referal_parent_id));
                    });
                    return Promise.all(listWallet);
                }).then(listwallet => {
                    listwallet.forEach(element => {
                        listAddress.push(element.address);
                    });
                    // get list parent address
                    Promise.all(listParent).then(listparent => {
                        listparent.forEach(element => {
                            if (element != null) {
                                listParentWallet.push(element.getWallet());
                            } else {
                                listParentWallet.push(null);
                            }
                        });
                        return Promise.all(listParentWallet);
                    }).then(listparentWallet => {
                        listparentWallet.forEach(element => {
                            if (element == null) {
                                listParentAddress.push(null);
                            } else {
                                listParentAddress.push(element.address);
                            }
                        });
                        // we has listAddress, listParentAddress
                        //send confirm kyc to smartcontract
                        console.log("listAddress = " + listAddress)
                        console.log("listParentAddress = " + listParentAddress)
                        var gasPrice = req.body.gasPrice != null ? req.body.gasPrice : 10;
                        var data = Config.contract_ico.methods.confirmListKycHasParent(listAddress, listParentAddress).encodeABI();
                        Config.createRawTransaction(admin.address, Config.CONTRACT_ADDRESS_ICO, 0, gasPrice, 400000, data, Config.CHAND_ID)
                            .then(async result => {
                                console.log("confirmListKycHasParent rawTransaction");
                                var tx = Config.signToRawTransaction(private_key, result);
                                Config.sendRawTransaction(tx)
                                    .once('transactionHash', async function (hash) {
                                        console.log("hash = " + hash);
                                        var tmp = await db.Transaction.findOne({ where: { hash: hash } });
                                        console.log(JSON.stringify(tmp));
                                        if (tmp == null) {
                                            db.Transaction.create({
                                                hash: hash,
                                                type: SC.TransactionType.KYC,
                                                status: SC.TransactionStatus.PENDING,
                                                admin_id: req.session.admin_id,
                                                input: JSON.stringify({ listAddress: listAddress, listParent: listParentAddress }),
                                            }).then(transaction => {
                                                console.log("createRawTransaction done " + JSON.stringify(transaction));
                                            }).catch(err => {
                                                console.log("createRawTransaction done, but save transaction err: " + err);
                                            });
                                        } else {
                                            console.log("transaction is pending");
                                        }
                                    })
                                    .then(async trans => {
                                        console.log(trans);

                                        //create transaction
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
                                            return res.send(JSON.stringify({ "error": "transaction failed! " }));
                                        }
                                        //update kyc status
                                        var listKYC = new Array();
                                        listKycId.forEach(kyc_id => {
                                            listKYC.push(db.KYC.findById(kyc_id));
                                        });
                                        Promise.all(listKYC).then(list => {
                                            console.log("update KYC list = " + JSON.stringify(list));
                                            var listUpdate = new Array();
                                            list.forEach(element => {
                                                listUpdate.push(element.update({ status: SC.KycStatus.SUCCESS }));
                                            });
                                            Promise.all(listUpdate).then(() => {
                                                console.log("update KYC completed");
                                                return res.send(JSON.stringify({ "success": 'transaction is completed! ' }));
                                            }).catch(err => {
                                                console.log(err);
                                                return res.send(JSON.stringify({ "error": 'update list kyc failed! ' + err }));
                                            });
                                        }).catch(err => {
                                            console.log(err);
                                            return res.send(JSON.stringify({ "error": "get list kyc failed! " + err }));
                                        });
                                    }).catch(error => {
                                        console.log("sendRawTransaction error: transaction 1 failed! " + error);
                                        return res.send(JSON.stringify({ "error": " transaction 1 failed! " + error }));
                                    });

                            }).catch(err => {
                                console.log("createRawTransaction err: " + err);
                                return res.send(JSON.stringify({ "error": " transaction 2 failed!" + err }));
                            });
                    }).catch(err => {
                        console.log("createRawTransaction err: " + err);
                        return res.send(JSON.stringify({ "error": " transaction 3 failed!" + err }));
                    });
                });
            } else {
                return res.send(JSON.stringify({ "error": " Input is incorrect!" }));
            }
        } catch (error) {
            console.log(error);
            return res.send(JSON.stringify({ "error": " Admin is not exist!" }));
        }
    } else {
        return res.send(JSON.stringify({ "error": "You are not admin!" }));
    }
}

// exports.update_list_kyc_verified_2SC = async (req, res) => {
//     var type = req.session.admin_type;
//     if (req.session.admin_type == SC.AdminType.ROOT || req.session.admin_type == SC.AdminType.SUPPORTER || req.session.admin_type == SC.AdminType.MANAGER) {
//         db.Admin.findById(req.session.admin_id).then(admin => {
//             if (admin != null && admin.username == req.session.admin_name) {
//                 var data = req.body;
//                 // console.log(JSON.stringify(data));
//                 var private_key = data.private;
//                 var list_id = data.list_id;
//                 if (list_id != null) {
//                     var list_user = new Array();
//                     list_id.forEach(element => {
//                         list_user.push(db.User.findOne({ where: { kyc_id: element } }));
//                     });
//                     var listWallet = new Array();
//                     Promise.all(list_user).then(values => {
//                         console.log("values1 = " + JSON.stringify(values));

//                         if (list_user != null) {

//                             values.forEach(element => {
//                                 listWallet.push(element.getWallet());
//                             });
//                         }
//                         return Promise.all(listWallet);
//                     }).then(values2 => {
//                         listWallet = values2;
//                         console.log("values2 = " + JSON.stringify(values2));
//                         if (values2 != null) {
//                             var list_kyc_status = new Array();
//                             values2.forEach(element => {
//                                 list_kyc_status.push(Config.contract_ico.methods.kyc(element.address).call());
//                             });
//                             return Promise.all(list_kyc_status);
//                         }
//                     }).then(values3 => {
//                         console.log("values3 = " + JSON.stringify(values3));
//                         var i = 0;
//                         var listAddressKyc = new Array();
//                         var listId = new Array();
//                         values3.forEach(element => {
//                             if (!element) {
//                                 listId.push(list_id[i]);
//                                 listAddressKyc.push(listWallet[i++].address);
//                             } else {
//                                 i++;
//                             }
//                         });
//                         //send transaction kyc list address
//                         if (listAddressKyc != null) {
//                             var data = Config.contract_ico.methods.confirmListKyc(listAddressKyc).encodeABI();

//                             Config.createRawTransaction(admin.address, Config.CONTRACT_ADDRESS_ICO, 0, 20, 400000, data, Config.CHAND_ID)
//                                 .then(async result => {
//                                     console.log("confirmListKyc rawTransaction");
//                                     var tx = Config.signToRawTransaction(private_key, result);
//                                     Config.sendRawTransaction(tx)
//                                         .once('transactionHash', function (hash) {
//                                             console.log("hash = " + hash);
//                                         })
//                                         .then(trans => {
//                                             console.log(JSON.stringify(trans));
//                                             console.log(JSON.stringify("trans.status = " + trans.status));
//                                             if (trans.status) {
//                                                 console.log("step 1");
//                                                 var listKYC = new Array();
//                                                 list_id.forEach(kyc_id => {
//                                                     listKYC.push(db.KYC.findById(kyc_id));
//                                                 });
//                                                 Promise.all(listKYC).then(list => {
//                                                     console.log("update KYC list = " + JSON.stringify(list));
//                                                     var listUpdate = new Array();
//                                                     list.forEach(element => {
//                                                         listUpdate.push(element.update({ status: SC.KycStatus.SUCCESS }));
//                                                     });
//                                                     Promise.all(listUpdate).then(() => {
//                                                         console.log("update KYC completed");
//                                                         return res.render('admin/kyc/submitkyc_contract', { 'login': true, 'type': type });
//                                                     }).catch(err => {
//                                                         console.log(err);
//                                                         return res.send(JSON.stringify({ "error": err }));
//                                                     });
//                                                 }).catch(err => {
//                                                     console.log(err);
//                                                     return res.send(JSON.stringify({ "error": err }));
//                                                 });
//                                             } else {
//                                                 console.log("error, transaction failed!");
//                                                 return res.send(JSON.stringify({ "error": " transaction failed!" }));
//                                             }
//                                         }).catch(err => {
//                                             console.log("sendRawTransaction error: " + err);
//                                             return res.send(JSON.stringify({ "error": " transaction failed!" }));
//                                         });
//                                     res.send(JSON.stringify({ "waiting": " transaction is created!" }));
//                                 }).catch(err => {
//                                     console.log("createRawTransaction err: " + err);
//                                     return res.send(JSON.stringify({ "error": " transaction failed!" }));
//                                 });

//                         } else {
//                             console.log("error, all addresses are incorrect!");
//                             return res.send(JSON.stringify({ "error": " all addresses are incorrect!" }));
//                         }
//                     }).catch(error => {
//                         console.log(error);
//                         return res.send(JSON.stringify({ "error": error }));
//                     });
//                 } else {
//                     console.log("admin null or not exist");
//                     return res.send(JSON.stringify({ "error": 'admin null or not exist' }));
//                 }
//             }
//         }).catch(err => {
//             console.log(err);
//             return res.send(JSON.stringify({ "error": err }));
//         });
//     } else return res.redirect('/admin/get-list-kyc-verified');
// }
exports.getrandomKyc = (req, res) => {
    if (req.session.admin_type == SC.AdminType.ROOT || req.session.admin_type == SC.AdminType.SUPPORTER || req.session.admin_type == SC.AdminType.MANAGER) {
        KYC.findOne({ where: { "status": SC.KycStatus.WAITING } })
            .then(kyc => {
                if (kyc == null) return res.send(JSON.stringify({ "success": false }));
                else return res.send(JSON.stringify({ "success": true, "id": kyc.dataValues.id }));
            })

    } else return res.redirect('/');
}
exports.detail_user_kyc = (req, res) => {
    var type = req.session.admin_type;
    var id = req.query.id;
    console.log(id);
    if (req.session.admin_name) {
        KYC.findById(id)
            .then(kyc => {
                if (kyc != null) {
                    var result = kyc.dataValues;
                    var before_status = kyc.status == SC.KycStatus.PENDING ? 2 : 1;
                    kyc.update({ status: SC.KycStatus.PROCESSING })
                        .then(ress => {
                            return res.render('admin/kyc/detail_info_kyc', { 'data': result, 'before_status': before_status, 'login': true, 'type': type });
                        }).catch(err => {
                            console.log(err);
                            return res.render('admin/kyc/detail_info_kyc', { 'data': result, 'before_status': before_status, 'login': true, 'type': type });
                        })
                } else {
                    console.log("detail_user_kyc kyc null");
                }
            })
    } else return res.redirect('/');
}
exports.verfiy_user_kyc = (req, res) => {
    if (req.session.admin_type == SC.AdminType.ROOT || req.session.admin_type == SC.AdminType.SUPPORTER || req.session.admin_type == SC.AdminType.MANAGER) {
        var id = req.body.id;
        var verifi_name = req.body.tab0;
        var verifi_phone = req.body.tab1;
        var verifi_national = req.body.tab2;
        var verifi_identify_id = req.body.tab3;
        var verifi_identify_front = req.body.tab4;
        var verifi_identify_back = req.body.tab5;
        var verifi_all = req.body.tab6;
        var verifi_type = req.body.tab7;
        var result_verify = checkVerify(verifi_name, verifi_phone, verifi_national, verifi_identify_id, verifi_identify_front, verifi_identify_back, verifi_all, verifi_type);
        console.log(result_verify);
        KYC.findById(id).then(async data => {
            if (result_verify == 'true') {
                try {
                    await data.update({ 'status': SC.KycStatus.PENDING, 'admin_id': req.session.admin_id });
                } catch (error) {
                    console.log(error);
                    return res.redirect('/admin/list-kyc?success=false');
                }
                data.getUser().then(async user => {
                    //completed kyc airdrop
                    var checkAirdrop = await db.UserAirdrop.findOne({
                        where: {
                            user_id: user.id,
                            airdrop_id: 2
                        }
                    });
                    if (checkAirdrop == null) {
                        db.Airdrop.findById(2).then(async airdrop => {
                            await db.UserAirdrop.create({
                                user_id: user.id,
                                airdrop_id: airdrop.id,
                                value: airdrop.bonus,
                                status: SC.AirdropStatus.COMPLETED
                            });
                            return user.update({ total_bonus_airdrop: user.total_bonus_airdrop + airdrop.bonus });
                        }).catch(err => {
                            console.log("update airdrop kyc err: " + err);
                        });
                    }
                }).catch(err => {
                    console.log(err);
                    return res.redirect('/admin/list-kyc?success=false');
                })
            } else
                return data.update({ 'status': SC.KycStatus.FAIL, 'error_verify': result_verify })
        }).then(data => {
            return res.redirect('/admin/list-kyc?success=true');
        }).catch(error => {
            console.log(error)
            return res.redirect('/admin/list-kyc?success=false');
        });
    }

};
function checkVerify(name, phone, national, identify_id, front_image, back_image, all_image, type) {
    var result = '';
    if (name == 'true' &&
        phone == 'true' &&
        national == 'true' &&
        identify_id == 'true' &&
        front_image == 'true' &&
        back_image == 'true' &&
        all_image == 'true' &&
        type == 'true'
    ) return 'true';
    else {
        if (name == 'false') result += 'name,';
        if (phone == 'false') result += 'phone,';
        if (national == 'false') result += 'national,';
        if (identify_id == 'false') result += 'identify_id,';
        if (front_image == 'false') result += 'front_image,';
        if (back_image == 'false') result += 'back_image,';
        if (all_image == 'false') result += 'all_image,';
        if (type == 'false') result += 'type,';
        return result;
    }
}
exports.checkChangeStatus = (req, res) => {
    if (req.session.admin_id && req.body.id && req.body.before_status) {
        var data = req.body;
        kyc_id = data.id;

        KYC.findById(kyc_id)
            .then(kyc => {
                if (kyc.dataValues.status == SC.KycStatus.PROCESSING) {
                    var status = req.body.before_status==2?SC.KycStatus.PROCESSING:SC.KycStatus.WAITING
                    kyc.update({ status: status })
                        .then(ress => {
                            return res.send(JSON.stringify({ "success": true }));
                        }).catch(err => {
                            console.log(err);
                            return res.send(JSON.stringify({ "success": false }));
                        })
                } else return res.send(JSON.stringify({ "success": true }));
            }).catch(err => {
                console.log(err);
                return res.send(JSON.stringify({ "success": false }));
            })
    }
}

'use strict'
var Promise     = require('promise');
var db          = require('../../db/models');
var Sequelize   = require('sequelize');
const SC = require('../utils/Status_Constant');

exports.getListTransactions = (wallet)=>{
    return new Promise((resolve,reject)=>{
        var listTransaction = new Array();
        var i = 0;
        wallet.getTransactions({attributes: ['id', 'hash','token_tranfer','currency','from','to']})
        .then(listTransactions => {
            listTransactions.forEach(transaction => {
                listTransaction[i++] = {
                    id: transaction.id,
                    tx_hash: transaction.hash,
                    value:transaction.token_tranfer,
                    from:transaction.from,
                    to:transaction.to,
                    // address_contract:transaction.contractAddress,
                    currency: transaction.currency
                }
            });
            resolve(listTransaction);
        })
        .catch(err => {
            reject("err transaction2: " + err);
        });
    }); 
}
exports.getListTransactionsLimit = (wallet,_limit)=>{
    return new Promise((resolve,reject)=>{
        var listTransaction = new Array();
        var i = 0;
        wallet.getTransactions({
            limit:_limit,
            order: [['id','DESC']],
            attributes: ['id', 'value', 'hash','token_tranfer','currency','from','to',"time_stamp"]
        })
        .then(listTransactions => {
            listTransactions.forEach(transaction => {
                listTransaction[i++] = {
                    id: transaction.id,
                    tx_hash: transaction.hash,
                    value:transaction.token_tranfer,
                    value_eth: transaction.value,
                    from:transaction.from,
                    to:transaction.to,
                    time_stamp: transaction.time_stamp,
                    currency: transaction.currency
                }
            });
            resolve(listTransaction);
        })
        .catch(err => {
            reject("err transaction1: " + err);
        });
    }); 
}
exports.getAllTransactionsLimit = (limit)=>{
    return new Promise((resolve,reject)=>{
        var listTransaction = new Array();
        var i = 0;
        db.Transaction.findAll({
            limit:limit,
            order: [['id','DESC']],
            attributes: ['id', 'hash','token_tranfer','currency','from','to']
        })
        .then(listTransactions => {
            listTransactions.forEach(transaction => {
                listTransaction[i++] = {
                    id: transaction.id,
                    tx_hash: transaction.hash,
                    value: transaction.token_tranfer,
                    from: transaction.from,
                    to: transaction.to,
                    currency: transaction.currency
                }
            });
            resolve(listTransaction);
        })
        .catch(err => {
            reject("err transaction: " + err);
        });
    }); 
}




const Web3 = require('./index');
const HDWalletProvider = require("truffle-hdwallet-provider");
const BigNumber = require('bignumber.js');
const Tx = require('ethereumjs-tx');
const fs = require('fs');
const path = require('path');

// //test ropsten
// const CONTRACT_ADDRESS_UNIBOT = '0x599ec36dca199628c9fa641d759e12ebb6e66436';
// const CONTRACT_ADDRESS_ICO = '0x720d5c6f657e9ff473230370e4d2ca7123587a32';
// const CONTRACT_ADDRESS_LOCK_TOKEN = '0xfdf7db77c9b8314a990900f89d58ed01dac1d639';
// const CONTRACT_ADDRESS_UNLOCK_TOKEN = '0xf0807027e08639701ca092870959abc8a2f3fe9e';

// const PRIVATE_KEY = "901f47ab4c927ffd16938f85198387f9d9a3a3a6c2fcfa34f95f333b241749c0";
// var provider = new Web3(new Web3.providers.HttpProvider("https://ropsten.infura.io/metamask2"));

//main network test
const CONTRACT_ADDRESS_UNIBOT = '0x531de803d68f3ead1d2a035d5afd1ba8f1c1615d'.toLowerCase();
const CONTRACT_ADDRESS_ICO = '0x00AdceceAbcd512Ab96ad91be4a1Bd72322f9451'.toLowerCase();
const CONTRACT_ADDRESS_LOCK_TOKEN = '0xd180720d9c04483ba4d2e2821ec05485ccff2739'.toLowerCase();
const CONTRACT_ADDRESS_UNLOCK_TOKEN = '0x32e06083f3a2ebd84480d6ad0949abb36033394c'.toLowerCase();
const CONTRACT_ADDRESS_REFERAL = '0xa60bd68ab0ad7d2404f7a2ec171601b5b53477d9'.toLowerCase();
const ADDRESS_HOLDER_TOKEN = '0x46e3A2DE67Fd3E3ffEc32d6C6f56C95090435299'.toLowerCase();

// const PRIVATE_KEY = "901f47ab4c927ffd16938f85198387f9d9a3a3a6c2fcfa34f95f333b241749c0";

// var mnemonic = "horse deputy traffic invest imitate expect multiply debate exact frog sample net";
var provider = new Web3(new Web3.providers.HttpProvider('https://mainnet.infura.io/metamask2'));

var web3 = new Web3(provider);

const abi_unibot = fs.readFileSync(path.join(__dirname, '/abi/unibot.json'), 'utf-8');
const contract_unibot = new web3.eth.Contract(JSON.parse(abi_unibot), CONTRACT_ADDRESS_UNIBOT);

const abi_ico = fs.readFileSync(path.join(__dirname + '/abi/ico.json'), 'utf-8');
const contract_ico = new web3.eth.Contract(JSON.parse(abi_ico), CONTRACT_ADDRESS_ICO);

const abi_lock_token = fs.readFileSync(path.join(__dirname + '/abi/lock-token.json'), 'utf-8');
const contract_lock_token = new web3.eth.Contract(JSON.parse(abi_lock_token), CONTRACT_ADDRESS_LOCK_TOKEN);

const abi_unlock_token = fs.readFileSync(path.join(__dirname + '/abi/unlock-token.json'), 'utf-8');
const contract_unlock_token = new web3.eth.Contract(JSON.parse(abi_unlock_token), CONTRACT_ADDRESS_UNLOCK_TOKEN);

const abi_bonus_referal = fs.readFileSync(path.join(__dirname + '/abi/referal.json'), 'utf-8');
const contract_bonus_referal = new web3.eth.Contract(JSON.parse(abi_bonus_referal), CONTRACT_ADDRESS_REFERAL);

const accounts = web3.eth.accounts;

exports.testConfig = () => {
    contract_unibot.methods.totalSupply().call(function (err, res) {
        console.log("testConfig res = "+res);
        if (!err) {
            console.log(res);
        } else {
            console.log(err);
        }
    });
}

exports.createRawTransaction = async (from, to, value, gasPriceWei, gasLimit, data, chainId) => {
    console.log("createRawTransaction");
    // console.log("from = "+from);
    // console.log("to = "+to);
    const nonce = await web3.eth.getTransactionCount(from);
    console.log("nonce = "+JSON.stringify(nonce));
    var gasEstimate = await web3.eth.estimateGas({
        from:from,
        to:to,
        data:data
    });
    console.log("gasEstimate = "+gasEstimate);
    return {
        "nonce": "0x" + nonce.toString(16),
        "gasPrice": web3.utils.toHex(gasPriceWei*1000000000),
        "gasLimit": web3.utils.toHex(gasEstimate),
        "to": to,
        "value": web3.utils.toHex(value), //value = 0 if call abi contract
        "data": data
        // "chainId": chainId
    }    
}

exports.signToRawTransaction = (privateKey, rawTransaction) => {
    console.log("rawTransaction = "+JSON.stringify(rawTransaction));
    var privKey = new Buffer(privateKey, 'hex');
    var tx = new Tx(rawTransaction);
    tx.sign(privKey);
    return tx;
}

exports.sendRawTransaction = (tx) => {
    console.log("sendRawTransaction tx = "+JSON.stringify(tx));
    var serializedTx = tx.serialize();
    // console.log("'0x' + serializedTx.toString('hex') = "+'0x' + serializedTx.toString('hex'))
    return web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'));
}
module.exports.web3 = web3;
module.exports.contract_unibot = contract_unibot;
module.exports.contract_ico = contract_ico;
module.exports.contract_lock_token = contract_lock_token;
module.exports.contract_unlock_token = contract_unlock_token;
module.exports.contract_bonus_referal = contract_bonus_referal;
module.exports.CONTRACT_ADDRESS_UNIBOT = CONTRACT_ADDRESS_UNIBOT;
module.exports.CONTRACT_ADDRESS_ICO = CONTRACT_ADDRESS_ICO;
module.exports.CONTRACT_ADDRESS_LOCK_TOKEN = CONTRACT_ADDRESS_LOCK_TOKEN;
module.exports.CONTRACT_ADDRESS_UNLOCK_TOKEN = CONTRACT_ADDRESS_UNLOCK_TOKEN;
module.exports.CONTRACT_ADDRESS_REFERAL = CONTRACT_ADDRESS_REFERAL;
module.exports.ADDRESS_HOLDER_TOKEN = ADDRESS_HOLDER_TOKEN;
// module.exports.PRIVATE_KEY = PRIVATE_KEY;
module.exports.CHAND_ID = '0x1';

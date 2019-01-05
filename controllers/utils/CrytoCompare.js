const cc = require('cryptocompare')


exports.getPriceCrytocurrency=function getPriceCrytocurrency(symboy, callback){
    cc.histoHour(symboy, 'USD',{"limit":25})
        .then(data=> callback(data))
        .catch(console.error)
}
exports.getPriceMulti = function(list_sysmboy,callback){
    cc.priceMulti(list_sysmboy,'USD')
    .then(prices=>{
        return callback(prices);
    }).catch(err=>{
        return callback({'error': true});
    })
}
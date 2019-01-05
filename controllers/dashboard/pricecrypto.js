const crytocompare = require('../utils/CrytoCompare');
const db = require('../../db/models');
exports.getPrice = (req, res) => {
    var name_currency = req.body.name_currency;
    console.log(name_currency);
    crytocompare.getPriceCrytocurrency(name_currency,function(data){
        return res.send(JSON.stringify(data));
    })
};
exports.getPriceMulti = (req, res) => {
    var list_symbol = ['BTC','ETH','GAME','LBC','NEO','STEEM','LIT','NOTE','MINT','IOT','DASH']
    crytocompare.getPriceMulti(list_symbol,function(data){
        return res.send(JSON.stringify(data));
    })
};

//token/$
exports.getPriceToken = async (type_lock) => {
    try {
        var config = await db.Config.findById(1);
        var time_now = Date.now() / 1000;
        var start_preIco_date = config.date_preico;
        var end_preIco_date = config.date_preico_end;
        var start_ico_date = config.date_ico_1;
        var end_ico_date = config.date_ico_end;
        if(time_now < start_preIco_date){
            return 0;
        }else if(time_now <= end_preIco_date){
            return type_lock == 1? config.price_token_preico_lock: config.price_token_preico_unlock;
        }else if(time_now <= end_ico_date){
            return type_lock == 1? config.price_token_ico_lock: config.price_token_ico_unlock;
        }else{
            // price token on CoinmarketCap
            return type_lock == 1? config.price_token_ico_lock: config.price_token_ico_unlock;
        }
    } catch (error) {
        console.log("getPriceToken error: "+error);
    }

}


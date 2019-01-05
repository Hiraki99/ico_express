var CoinMarketCap = require("node-coinmarketcap");
var coinmarketcap = new CoinMarketCap();
var Promise = require("promise");

exports.getCoins = function(callback)
{
	coinmarketcap.multi(coins => {
		// console.log(coins);
  		callback(coins);
	});
}

exports.exchange_rate = function(BTC_usd, ETH_usd,AIC_usd){
	var rate_BTC = (AIC_usd / BTC_usd).toFixed(9);
	var rate_ETH = (AIC_usd / ETH_usd).toFixed(9);
	// console.log(rate_BTC);
	// console.log(rate_ETH);

	return JSON.stringify({rate_BTC: rate_BTC, rate_ETH: rate_ETH});
}
exports.get_bitcoin = function(amount,callback){
	console.log("amount = "+amount);
	coinmarketcap.get("bitcoin", coin => {
		  callback(coin.price_usd *amount); // Prints the price in USD of BTC at the moment.
	});
}

exports.get_eth = function(amount){
	return new Promise(function(resolve, reject){
		coinmarketcap.get("ethereum", coin => {
		  	resolve(coin.price_usd * amount); // Prints the price in USD of BTC at the moment.
		});
		reject("get_eth err");
	});
}
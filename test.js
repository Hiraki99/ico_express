const cc = require('cryptocompare')


cc.histoMinute('ETH', 'USD',{"limit":10})
.then(data => {
  console.log(data)
})
.catch(console.error)

const redis = require('redis');
const REDIS_PORT = process.env.REDIS_PORT;
const Client = redis.createClient(REDIS_PORT);

Client.cache_notify = function newnotify(id,title){
	try{
		if (res.cookie.user_id){
			key = res.cookie.user_id +'_'+req.path;
			console.log(key);
			Client.get(key, function (err, data) {
				if (err) next();
				console.log(data);
				if (data != null) {
					data = JSON.parse(data);
					res.render(data.path_render, data);
				} else {
					next();
				}
			});
		}else {
			next();
		}
	}catch(ex){
		console.log(ex);
		next();
	}
}

module.exports = Client;
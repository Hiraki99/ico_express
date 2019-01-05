var twoFactor = require('node-2fa');

exports.generatekey= function generatekey(name_app, username) {
	/*
	{ secret: 'XDQXYCP5AC6FA32FQXDGJSPBIDYNKK5W',
	  uri: 'otpauth://totp/My Awesome App:johndoe%3Fsecret=XDQXYCP5AC6FA32FQXDGJSPBIDYNKK5W',
	  qr: 'https://chart.googleapis.com/chart?chs=166x166&chld=L|0&cht=qr&chl=otpauth://totp/My Awesome App:johndoe%3Fsecret=XDQXYCP5AC6FA32FQXDGJSPBIDYNKK5W' 
	}
	*/
	var newSecret = twoFactor.generateSecret({name: name_app, account: username});
	return newSecret;
}


exports.verifyToken_User = function(secret,token){
	var delta = twoFactor.verifyToken(secret, token);
	// console.log(delta);
	if (delta == null) return -2;
	else return delta.delta;
}
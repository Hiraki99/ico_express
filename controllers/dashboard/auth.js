var twoFA = require('../utils/TwoFactorAuth');
const db = require('../../db/models');
const User = db.User;

exports.authy = (req, res) => {
    
    if (req.session.user_name){
    
        User.findOne({ where: {'username': req.session.user_name} })
        .then(Data => {
            var result = Data.dataValues;
            var key = req.session.user_id+ '_'+ req.path;
            var authy = twoFA.generatekey("localhost:8090",result.username);
            console.log(authy);
            return res.render('dashboard/account/authy',
                    {"enable_2FA":result.enable_auth,"qr_code": authy.qr,"authy_key": authy.secret,"link": '/account/authy','name': "Auth"});		
        });
		
    }else return res.redirect('/');
};

exports.ActiveAuth = (req,res) =>{
    var auth_key = req.body.auth_key;
    var auth_code = req.body.auth_code;
    console.log(auth_key);
    console.log(auth_code);
    switch (twoFA.verifyToken_User(auth_key,auth_code))
        {
            case -2:
                return res.send(JSON.stringify({ "error_warning": "Authy Code Error" }));
                break;
            case -1:
                return res.send(JSON.stringify({ "error_warning": "Authy Code Too Late" }));
                break;
            case 1:
                return res.send(JSON.stringify({ "error_warning": "Authy Code Too Early" }));
                break;
            case 0 :
                User.findOne({ where: {'username': req.session.user_name} })
                .then(Data=>{
                    console.log(Data);
                    Data.update({key_twoFa : auth_key, enable_auth : 1})
                })
                .then(Data =>{
                    return res.send(JSON.stringify({ "success_warning": true }))
                }).catch(error => {
                    console.log(error)
                    res.send(JSON.stringify({ "error_warning": "Save User Error" }))
                })
                break;
        }
}
exports.DisableAuth = (req,res) =>{
    User.findOne({ where: {'username': req.session.user_name} })
        .then(Data=>{
            console.log(Data);
            Data.update({enable_auth : 0})
        })
        .then(Data =>{
            return res.send(JSON.stringify({ "success_warning": true }))
        }).catch(error => {
            console.log(error)
            res.send(JSON.stringify({ "error_warning": "Save User Error" }))
        })
}
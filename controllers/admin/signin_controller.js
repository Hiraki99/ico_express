const Promise         = require('promise');
const db              = require('../../db/models');
const Sequelize       = require('sequelize');
const emailController = require('../utils/Email');
const ReCaptra  = require('../utils/Recaptra'); 
const Admin = db.Admin;

// const Config = require('../../smart_contract/config');

exports.checklogin = (req,res)=>{
    const data   = req.body;
	var username = data.user_name;
	var password = data.password;
    var captra   = data.recaptcha;
    // Config.testConfig();
    ReCaptra.verifyRecaptcha(captra,function(checked){
        if(checked){
            Admin.findOne({ where: {'username': username} })
            .then(admin=>{
                // console.log(admin);
                var result = admin.dataValues;
                if(result.password == password){
                    if(result.is_locked){
                        return res.send(JSON.stringify({'error_warning':"Account is Locked",'link_redirect':'/admin/signin'}));
                    }
                    // console.log(result.password == password)
                    req.session.user_name  =null;
                    req.session.user_id    =null;
                    req.session.admin_id   = result.id;
                    req.session.admin_name = result.username;
                    req.session.admin_type = result.type;
                    return res.send(JSON.stringify({'success':true,'link_redirect':'/admin/list-kyc'}));
                }else return res.send(JSON.stringify({ "error_warning": "Username or Password incorrect" }));
            }).catch(err=>{
                console.log(err);
                return res.send(JSON.stringify({ "error_warning": "No Exist Account" }));
            })
        }else return res.send(JSON.stringify({ "error_warning": "Captra error" }));
    });
}
exports.adminlogin = (req, res) => {
    return res.render('admin/signin');
};
exports.changePassword = (req, res) => {
    if(req.session.admin_id){
        res.render('admin/changepassword',{'login':true});
    }else res.redirect('/');
    
};
exports.updatePassword = (req, res) => {
    const data = req.body;
    var old_password = data.old_password;
    var new_password = data.new_password;
    var confirm_newpassword = data.confirm_newpassword;
    if (confirm_newpassword != new_password)
        return res.send(JSON.stringify({ "error": 2 }));
    console.log(req.session.user_name);
    Admin.findOne({ where: { 'username': req.session.admin_name } })
        .then(Data => {
            var result = Data.dataValues;
            if (old_password != result.password)
                return res.send(JSON.stringify({ "error": 0 }));
            Data.update({ "password": new_password })
                .then(data => {
                    return res.send(JSON.stringify({ "success": 1 }));
                })
        }).catch(err=>{
            return res.send(JSON.stringify({ "error": 0 }));
        })
}
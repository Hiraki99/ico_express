const multer       = require('multer');
const path         = require('path');
const upload       = multer({ dest:  '../../uploads/' });
const db           = require('../../../db/models');
const fs           = require('fs');
const Notification = db.Notification;
const Airdrop      = db.Airdrop;
const User         = db.User;
const Admin        = db.Admin;
const dir_notify   = path.join(__dirname, '../../../public/image_notify');
const redis        = require('../../utils/redis');
const email_util = require('../../utils/Email');
const Status = require('../../utils/Status_Constant');

var WebSocket = require('ws')
const io = require('socket.io-client');
const socket = io('http://localhost:8090', {
  path: '/test'
});

var fn_map_user = function get_user_name(result){
    return new Promise(function(resolve, reject){
        // console.log(result.admin_id)
        Admin.findById(result.admin_id)
        .then(user=>{
            
            result["author_name"] = user.dataValues.username
            resolve(result)
        }).catch(err=>{
            console.log(err);
            reject(err);
        });        
    })
    
}

function getallEmail(cb){
    User.findAll({
        attributes: ['email','username'],
    }).then(data=>{
        var list=[];
        
        for(var i =0;i< data.length;i++){
            list.push({
                'email':data[i].dataValues.email,
                'username': data[i].dataValues.username
            });
        }
        console.log(list);
        cb(list);
    })
}
// Notify
//get
exports.listnotify = (req, res) => {
    var type = req.session.admin_type;
    if(req.session.admin_id){
        if(type == Status.AdminType.ROOT || type == Status.AdminType.MANAGER){
            return res.render('admin/widget/listnotifi',{'login':true,"type": type});
        }else return res.redirect("/admin/list-kyc");
        
    }else res.redirect('/');
    
}
exports.newnotify = (req, res) => {
    var type = req.session.admin_type;
    if(req.session.admin_id){
        if(type == Status.AdminType.ROOT || type == Status.AdminType.MANAGER){
            return res.render('admin/widget/notify',{'data':null,'login':true,"type": type});
        }else return res.redirect("/admin/list-kyc");
        
    }else res.redirect('/');
    
}
exports.updatenotify = (req, res) => {
    var type = req.session.admin_type;
    
    if(req.session.admin_id){
        if(type == Status.AdminType.ROOT || type == Status.AdminType.MANAGER){
             var id = req.query.id;
        Notification.findById(id)
        .then(noti=>{
            var data = noti.dataValues;
            return res.render('admin/widget/notify',{'data':data,'login':true,"type": type});
        }).catch(err=>{
            return res.render('admin/widget/notify',{'data':null,'login':true,"type": type});
        })      
        }else return res.redirect("/admin/list-kyc");
       
    }else res.redirect('/');
    
}
//post
exports.getallnotify = (req, res) => {
    if(req.session.admin_id){
        Notification.findAll()
        .then(noti=>{
            var list = [];
            for(var i =0;i< noti.length;i++){
                list.push(noti[i].dataValues);
            }
            // console.log(list);
            var actions = list.map(fn_map_user);
            var data = Promise.all(actions);
            data.then(result =>{
                return res.send(result);
            }).catch(err=>{
                console.log(err);
                res.send({'error' :true});    
            });
        }).catch(err=>{
            res.send({'error' :true});
        })
    }else res.redirect('/');
}
exports.createnotify = (req, res) => {
    if(req.session.admin_id){
        var data = req.body;
        if (!fs.existsSync(dir_notify)){
            fs.mkdirSync(dir_notify);
        }
    
        var sampleFile = req.files.image_front;
        var img = '';
        if(sampleFile != undefined){
            sampleFile.mv(dir_notify+'/'+sampleFile.name, function(err) {
                if (err)
                return res.status(500).send(err);
            });
            img = sampleFile.name
        }
        
        var title        = data.notifititle;
        var content      = data.noticontent;
        var link         = data.notilink;
        console.log(data);
        console.log(req.session.admin_id)
        Notification.create({
            'title': title,
            'description': content,
            'url_img':img,
            'admin_id':req.session.admin_id,
            'date':Date.now(),
            'link':link,
            'admin_id' : req.session.admin_id
        }).then(noti=>{
            // redis.setex(noti.dataValues.id+"_title",60,noti.dataValues);
            socket.emit('newnotify',noti.dataValues);
            getallEmail(function(data){
                for(var i=0;i<data.length;i++){
                    var name = "Dear " + data[i].username;
                    var link = req.protocol + '://' + req.get('host') + '/news?id=' + noti.dataValues.id;
                    var body = '<p><span style="font-size:12px; margin-bottom:40px; "><strong>' + name + '</strong>,</span></p>' + '<p><span style="font-size:12px">New notification to me.</span></p>'
                        + '<p><span style="font-size:12px">'+noti.dataValues.title+'.</span></p>'
                        + '<p><span style="font-size:12px">'+noti.dataValues.description+'.</span></p>'
            
                        
                        + '<p><span style="font-size:12px;margin-bottom: 40px;">Regards, </span></p>'
                        + '<p><strong><span style="font-size:12px">Unibot Support Team!</span></strong></p>;'
                        email_util.sendemail("support@unibot.co", 'Unibot Support Team', data[i].email, "Warning! New notification from Unibot.", body, function (result) {
                            console.log(result);
                            console.log('send success');
                            if (!result) {
                                email_util.sendemail("support@unibot.co", 'Unibot Support Team',  data[i].email, "Warning! New notification from Unibot.", body);
                            }
            
                        });
                                
                }
            })
            return res.redirect('/admin/notify?success=true');
        }).catch(err => {
            console.log(err);
           
            return res.redirect('/admin/notify?success=false');
        });
    }else res.redirect('/');
    
}
exports.saveupdatenotify = (req, res) => {
    if(req.session.admin_id){
        var data = req.body;
        if (!fs.existsSync(dir_notify)){
            fs.mkdirSync(dir_notify);
        }
        var sampleFile = req.files.image_front;
        var img = '';
        if(sampleFile != undefined){
            sampleFile.mv(dir_notify+'/'+sampleFile.name, function(err) {
                if (err)
                return res.status(500).send(err);
            });
            img = sampleFile.name
        }
        var title        = data.notifititle;
        var content      = data.noticontent;
        var link         = data.notilink;
        var noti_id      = data.notifyid;
        var data_update = {
            'title': title,
            'description': content,
            'admin_id':req.session.admin_id,
            'date':Date.now(),
            'link':link,
            'admin_id': req.session.admin_id
        };
        if(img) data_update['url_img'] = img;
        Notification.findById(noti_id)
        .then(noti=>{
            noti.update(data_update)
            .then(noti=>{
                return res.redirect('/admin/notify?success=true');
            }).catch(err=>{
                console.log(err);
                return res.redirect('/admin/notify?success=false');
            })
        }).catch(err=>{
            console.log(err);
            return res.redirect('/admin/notify?success=false');
        });

    }else res.redirect('/');
    
}
exports.deletenotify = (req, res) => {
    if(req.session.admin_id){
        var id = req.body.id;
        Notification.destroy({where: { 'id': id } })
        .then(result =>{
            res.send(JSON.stringify({"success":true}))
        }).catch(err=>{
            res.send(JSON.stringify({"error":true}))
        })
    }else res.redirect('/');
    
}
// Airdrop
//get
exports.listairdrop = (req, res) => {
    var type = req.session.admin_type;
    if(req.session.admin_id){
        if(type == Status.AdminType.ROOT){
            return res.render('admin/widget/listairdrop',{'login':true,"type": type});
        }else return res.redirect("/admin/list-kyc");
        
    }else res.redirect('/');
    
}
exports.newairdrop = (req, res) => {
    var type = req.session.admin_type;
    if(req.session.admin_id){
        if(type == Status.AdminType.ROOT){
            return res.render('admin/widget/airdrop',{'data':null,'login':true,"type": type});
        }else return res.redirect("/admin/list-kyc");
        
    }else res.redirect('/');
    
}
exports.updateairdrop = (req, res) => {
    var type = req.session.admin_type;
    if(req.session.admin_id){
        if(type == Status.AdminType.ROOT){
            var id = req.query.id;
            Airdrop.findById(id)
            .then(airdrop=>{
                var data = airdrop.dataValues;
                return res.render('admin/widget/airdrop',{'data':data,'login':true,"type": type});
            }).catch(err=>{
                return res.render('admin/widget/airdrop',{'data':null,'login':true,"type": type});
            })
        }else return res.redirect("/admin/list-kyc");
        
        
    }else res.redirect('/');
    
}
//post
exports.getallairdrop = (req, res) => {
    if(req.session.admin_id){
        Airdrop.findAll()
        .then(airdrop=>{
            var list = [];
            for(var i =0;i< airdrop.length;i++){
                list.push(airdrop[i].dataValues);
            }
            var actions = list.map(fn_map_user);
            var data = Promise.all(actions);
            data.then(result =>{
                return res.send(result);
            }).catch(err=>{
                console.log(err);
                res.send({'error' :true});    
            });
        }).catch(err=>{
            res.send({'error' :true});
        })

    }else res.redirect('/');
    
}
exports.createairdrop = (req, res) => {
    if(req.session.admin_id){
        var data = req.body;
        
        var title        = data.titledrop;
        var content      = data.content;
        var level        = data.process_status;
        var bonus        = data.bonus;
        var link = data.link;
        console.log(content)
        console.log(data);
        Airdrop.create({
            'title': title,
            'content': content,
            'level':parseInt(level),
            'admin_id':req.session.admin_id,
            'link': link,
            'is_locked' : 1,
            'bonus':bonus
        }).then(result=>{
            // console.log(result);
            return res.redirect('/admin/airdrop?success=true');
        }).catch(err => {
            console.log(err);
            return res.redirect('/admin/airdrop?success=false');
        });
    }else res.redirect('/');
    
}
exports.saveupdateairdrop = (req, res) => {
    if(req.session.admin_id){
        var data = req.body;

        var title        = data.title;
        var content      = data.content;
        var level        = data.process_status;
        var bonus        = data.bonus;
        var is_locked    = data.status_locked;
        var airdropid    = data.airdropid;
        var link = data.link;
        var data_update = 
            {
                'title': title,
                'content': content,
                'level':parseInt(level),
                'admin_id':parseInt(req.session.admin_id),
                'is_locked' : parseInt(is_locked),
                'bonus':bonus,
                'link': link
            };
        Airdrop.findById(airdropid)
        .then(airdrop=>{
            airdrop.update(data_update)
            .then(airdrop=>{
                // console.log(airdrop);
                return res.redirect('/admin/airdrop?success=true');
            }).catch(err=>{
                console.log(err);
                return res.redirect('/admin/airdrop?success=false');
            })
        }).catch(err=>{
            console.log(err);
            return res.redirect('/admin/airdrop?success=false');
        });
    }else res.redirect('/');
}
exports.deleteairdrop = (req, res) => {
    console.log(JSON.stringify(req.body));
    if(req.session.admin_id){
        db.Admin.findById(req.session.admin_id).then(admin=>{
            if(admin.password == req.body.password){
                var id = req.body.id;
                if(id>6){
                    Airdrop.findById(id).then(airdrop=>{
                        if(airdrop.is_locked == 1){
                            return Airdrop.destroy({where: { 'id': id } });
                        }else{
                            return res.send(JSON.stringify({"error":true,"noti":"Not permission delete the airdrop is unlocked"}));
                        }
                    }).then(result =>{
                        return res.send(JSON.stringify({"success":true}));
                    }).catch(err=>{
                        return res.send(JSON.stringify({"error":true}));
                    });
                }else{
                    return res.send(JSON.stringify({"error":true,"noti":"Not permission delete this airdrop"}));
                }
            }
        }).catch(err=>{
            return res.send(JSON.stringify({"error":true,"noti":"admin is not exist"}));
        });
    }else return sres.redirect('/');
}

/**
 * change status airdrop
 * session.admin_id, airdrop_id,is_locked,sesstion.password;  
 */
exports.changeStatusAirdrop = (req, res) => {
    req.session.password = "toilahuy";
    req.is_locked = 1;
    db.Admin.findById(req.session.admin_id).then(admin => {
        if ((admin.type == SC.AdminType.ROOT || admin.type == SC.AdminType.MANAGER) && admin.password == req.session.password) {
            db.Airdrop.findById(req.airdrop_id).then(airdrop => {
                airdrop.is_locked = req.is_locked;
                airdrop.save().then(err => {
                    console.log("change status completed!");
                });
            });
        }
    });
}

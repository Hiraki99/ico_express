'use strict'
var Promise     = require('promise');
var db          = require('../../db/models');
var Sequelize   = require('sequelize');
var Notifi_User = db.NotificationUser;

function checkViewedNotification(noti_id, listNotiUser) {
    var result= false;
    listNotiUser.forEach(element => {
        if(noti_id == element.notification_id)
           
            result = true;

    });
    if(result == true)
        return 1;
    else return 0;
}

/**
 * show list notification for user
 * nếu user chưa có liên kết đến notification => chưa đoc tin (đổi màu)
 * nếu date now <date finish => là tin mới.
 * @param {notification_id,admin_id,session.password} req 
 * @param {*} res 
 */
exports.getListNotificationForUser = (req,res) =>{

    if(req.session.user_id){
        db.Notification.findAll({order: [['updatedAt','DESC']]}).then(list => {
            db.User.findById(req.session.user_id).then(user => {
                user.getNotificationUsers().then(listNotiUser =>{
                    var listNoti = new Array();
                    var i = 0;
                    list.forEach(noti => {
                        
                        listNoti[i] = {
                            id :noti.id,
                            title :noti.title,
                            description : noti.description,
                            link : noti.link,
                            url_img : noti.url_img,
                            author : noti.admin_id,
                            date_finished : noti.date,
                            isViewed : checkViewedNotification(noti.id,listNotiUser)
                        }
                        i++;
                    });
                    //update author;
                    var listPromise = new Array(Promise);
                    var x = 0;
                    listNoti.forEach(element => {
                        listPromise[x++] = db.Admin.findById(element.author);
                    });
                    Promise.all(listPromise).then(values => {
                        
                        var j = 0;
                        listNoti.forEach(element => {
                            element.author = values[j].nickname;
                            j++;
                        });
                        listNoti.sort(function(obj1, obj2) {
                            // Ascending: first age less than the previous
                            return obj1.isViewed - obj2.isViewed;
                        });
                        //show list notification
                        return res.send(listNoti);
                    });
                });
            }).catch(err=>{
                console.log(err);
                return res.send(JSON.stringify({}));
            });
        });
    }else res.redirect("/");
}

exports.updateNewNotify =(req,res)=>{
    var user_id = req.session.user_id;
    if(user_id){
        var list_notifi = req.body.list_notifi;
        db.User.findById(user_id)
        .then(user=>{
            user.getNotificationUsers().then(listNotiUser=>{
                var insert_data=[];
                for(var i=0;i< list_notifi.length;i++){
                    console.log(list_notifi[0]);
                    if(checkViewedNotification(parseInt(list_notifi[i]),listNotiUser)==0){

                        var data = {
                            "user_id": user_id,
                            "notification_id" : parseInt(list_notifi[i]),
                            "is_viewed" : 1
                        }
                        insert_data.push(data);
                    }
                }
                if(insert_data.length ==0){
                    console.log(JSON.stringify({status: 0}));
                    return res.send(JSON.stringify({status: 0}));
                }else{
                    Notifi_User.bulkCreate(insert_data)
                    .then(function(){
                        Notifi_User.findAll().then(function(Notifi_User) {
                            return res.send(JSON.stringify({status: 1}))
                        })   
                    }).catch(err=>{
                        console.log(err);
                        return res.send(JSON.stringify({status: 0}))
                    })
                }

                
            });
        }).catch(err=>{
            console.log(err);
            return res.send(JSON.stringify({status: 0}))
        })
        
    }else return res.redirect('/');
}

const db = require('../db/models');
const User = db.User;
const News = db.News;
const Video = db.Video;
const Config_Ico = db.Config;
const Event = db.Event;
const Advisor = db.Advisor

const Status = require('./utils/Status_Constant');
const SC = require('./utils/Status_Constant');
const Config = require('../smart_contract/config');
exports.index = (req, res) => {
    var data;
    if (req.session.user_id) data = { 'user_name': req.session.user_name };
    req.protocol + '://' + req.get('host');
    console.log(req.protocol + '://' + req.get('host'));
    res.render('landing/landing', data);
};
exports.dashboard = (req, res) => {
    if (req.session.user_name) {
        User.findById(req.session.user_id).then(user=>{
            if(user!=null){
                res.render('dashboard/dashboard_v2/dashboard', { "link": 'dashboard/dashboard_v2/dashboard', 'name': "Dashboard" });
            }else{
                console.log("dashboard user is not exist! " +err);
                return res.redirect("/");
            }
        }).catch(err=>{
            console.log("dashboard err" +err);
            return res.redirect("/");
        });
    } else return res.redirect("/");

};

exports.signup = (req, res) => {
    res.render('dashboard/signup');
};
exports.profile = (req, res) => {
    res.render('dashboard/profile');
};
exports.changePassword = (req, res) => {
    if (req.session.user_name) {
        res.render('dashboard/account/changepassword', { "link": '/account/changepassword', 'name': "Change Password" });
    } else res.redirect('/');

};
exports.getvideos = (req, res) => {
    var list = [];
    Video.findAll({ order: [['updatedAt', 'DESC']] })
        .then(video => {

            for (var i = 0; i < data.length; i++) {
                list.push(data[i].dataValues.video_link);
            }
            return res.send(link);
        }).catch(err => {
            console.log(err);
            return res.send(link);
        })
}
exports.topnews = (req, res) => {
    var list = []
    News.findAll({ where: { 'status': 'enable' }, limit: 3 })
        .then(data => {


            for (var i = 0; i < data.length; i++) {
                list.push(data[i].dataValues);
            }

            return res.send(list);
        }).catch(err => {
            return res.send(list);
        })
}
exports.contentNews = (req, res) => {
    News.findById(req.body.id)
        .then(news => {
            data = news.dataValues;
            User.findById(data.admin_id)
                .then(user => {
                    data["creator"] = user.dataValues.username;
                    console.log(data)
                    return res.send(data);
                }).catch(err => {
                    return res.redirect('/');
                })
        }).catch(err => {
            return res.redirect('/');
        })
}
exports.news = (req, res) => {
    var data = {};
    console.log(req.session.user_name);
    if (req.session.user_name)
        data = { 'user_name': req.session.user_name };
    data.news = null;
    res.render('landing/news', data);
}
exports.allnews_page = (req, res) => {
    var data = {};
    News.findAndCountAll({
        where: { "status": "enable" }
    }).then(all => {
        console.log(all.count);
        data['all_page'] = all.count;
        if (req.session.user_name)
            data = { 'user_name': req.session.user_name };
        res.render('landing/allnews', { data: data });
    })
}
exports.news_pagination = (req, res) => {
    var data = req.body;
    var limit = parseInt(data.limit);
    var page = parseInt(data.page);
    var list = [];
    var offset = limit * (page - 1);
    News.findAll({
        where: { "status": "enable" },
        limit: limit,
        offset: offset,
    }).then(news => {
        console.log(news);
        for (var i = 0; i < news.length; i++) {
            list.push(news[i].dataValues);
        }
        return res.send(list);
    }).catch(err => {
        return res.send(list);
    })
}
exports.get_all_news = (req, res) => {
    var list = []
    News.findAll({ where: { 'status': 'enable' } })
        .then(data => {
            for (var i = 0; i < data.length; i++) {
                list.push(data[i].dataValues);
            }
            return res.send(list);
        }).catch(err => {
            return res.send(list);
        })
}
exports.onenews = (req, res) => {
    var data = {};
    console.log(req.session.user_name);

    var id = req.params.id;
    News.findById(id)
        .then(news => {
            var data = news.dataValues;
            if (req.session.user_name)
                data['user_name'] = req.session.user_name;
            res.render('landing/news', data);
        }).catch(err => {
            res.redirect('/');
        })

}
exports.list_user_kyc = (req, res) => {
    var type = req.session.admin_type;
    if (req.session.admin_id) {
        return res.render('admin/kyc/list_kyc', { 'login': true, 'type': type });
    } else return res.redirect('/');

};
// exports.detail_user_kyc = (req, res) => {
//     res.render('DashBoard/KYC/Detail_Info_Kyc');
// };



exports.notify = (req, res) => {
    if (req.session.user_name) {
        res.render('dashboard/account/notify', { "link": '/dashboard/notify', 'name': "Notification" });
    } else res.redirect('/')
};
exports.list_account = (req, res) => {
    if (req.session.admin_id) {
        var type = req.session.admin_type;
        if (type == Status.AdminType.ROOT || type == Status.AdminType.MANAGER)
            return res.render('admin/accountmanage/listaccount', { "login": true, 'type': type });
        else res.redirect("/admin/list-kyc");
    } else return res.redirect("/admin/siginin");

};
exports.create_account_admin = (req, res) => {
    var type = req.session.admin_type;
    if (req.session.admin_id) {
        var type = req.session.admin_type;
        if (type == Status.AdminType.ROOT || type == Status.AdminType.MANAGER)
            return res.render('admin/accountmanage/new_account_admin', { "login": true, 'type': type });
        else res.redirect("/admin/list-kyc");
    } else return res.redirect("/admin/signin");

};
exports.referal = (req, res) => {
    if (req.session.user_name) {
        User.findOne({ where: { 'username': req.session.user_name } })
            .then(async user => {
                try {
                    // var referal = await Config.contract_bonus_referal.methods.bonusReferal(address).call();
                    // referal = Math.round(parseFloat(referal)/Math.pow(10,18)*10)/10;
                    var wallet = await user.getWallet();
                    var amount_member = await Config.contract_bonus_referal.methods.amountReferal(wallet.address).call();
                    amount_member = parseInt(amount_member);
                } catch (error) {
                    console.log("updateUserReferal fail:" +error);
                    res.redirect('/');
                }
                //check KYC to get link
                if (user != null && user.kyc_id > 0) {
                    user.getKYC().then(kyc => {
                        console.log(JSON.parse(kyc))
                        if (kyc != null && (kyc.status == SC.KycStatus.SUCCESS || kyc.status == SC.KycStatus.COMPLETED || kyc.status == SC.KycStatus.PENDING)){
                            var fullUrl = req.protocol + '://' + req.get('host') + "?register=2&referal=" + user.dataValues.key_referal;
                            res.render('dashboard/referal', { 'referal': fullUrl, "link": '/dashboard/referal', 'name': "Referal",'isKYCed':true, 'amount_member':amount_member});
                        }else{
                            res.render('dashboard/referal', { 'referal': "You need KYC to get link referal", "link": '/dashboard/referal', 'name': "Referal",'isKYCed':false,'amount_member':amount_member });
                        }
                    }).catch(err=>{
                        res.render('dashboard/referal', { 'referal': "You need KYC to get link referal", "link": '/dashboard/referal', 'name': "Referal",'isKYCed':false,'amount_member':amount_member });
                    });
                }else{
                    res.render('dashboard/referal', { 'referal': "You need KYC to get link referal", "link": '/dashboard/referal', 'name': "Referal",'isKYCed':false,'amount_member':amount_member });
                }
            }).catch(err => {
                res.redirect('/');
            });
    } else res.redirect('/');
};
exports.statistic = (req, res) => {
    res.render('dashboard/statistic');
};
exports.getCurrentPriceCoin = (req, res) => {
    if (req.session.user_id) {

    } else return res.redirect("/")
}
exports.getTokenSale = (req,res) =>{
    Promise.all([Config_Ico.findById(1), Event.findAll({limit:1,where:{"status" : 'enable'},order: [ [ 'createdAt', 'DESC' ] ]})])
    .then(data=>{
        console.log(data[0].dataValues)
        
        console.log(data[1][0].dataValues)
       
        var data_return = {
            "status": 1,
            "start_date": data[1][0].dataValues.date_start,
            "end_date": data[1][0].dataValues.date_end,
            "rate_unlock": (1 / data[0].dataValues.price_token_ico_unlock).toFixed(2),
            "rate_lock": (1 / data[0].dataValues.price_token_ico_unlock).toFixed(2)
        }
        console.log(data_return)
        return res.send(data_return);
    }).catch(err=>{
        console.log(err)
        return res.send({"status": 0});
    })
}
exports.getAlladvisor =(req,res)=>
{
    
    Advisor.findAll().
    then(advisor=>{

        var list = [];
        for(var i =0;i< advisor.length;i++){
            list.push(advisor[i].dataValues);
        }
        return res.send({"status": 1, "list": list });

    }).catch(err=>{
        console.log(err);
        return res.send({"status": 0});
    });
    
}

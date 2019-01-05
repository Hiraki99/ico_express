const multer     = require('multer');
const path       = require('path');
const db         = require('../../../db/models');
const fs         = require('fs');
const News       = db.News;
const User       = db.User;
const Admin      = db.Admin;
const Advisor    = db.Advisor;
const Video      = db.Video;
const Events     = db.Event;
const dir        = path.join(__dirname, '../../../public/image_news')
const dir_advisor= path.join(__dirname, '../../../public/image_advisor')
const Status = require('../../utils/Status_Constant');
var fn_map_user = function get_user_name(result)
{
    return new Promise(function(resolve, reject){
        console.log(result.admin_id);
        Admin.findById(result.admin_id)
        .then(admin=>{
            
            result["author_name"] = admin.dataValues.username
            resolve(result)
        }).catch(err=>{
            console.log(err);
            reject(err);
        });        
    })
    
}

exports.list_article = (req, res) => 
{
    var type = req.session.admin_type;
    if(req.session.admin_name){
        if(type == Status.AdminType.ROOT || type == Status.AdminType.MANAGER)
            return res.render('admin/cms/article',{'login':true, "type": type});
        else res.redirect("/admin/list-kyc");
        
    }else res.redirect('/')
    
};

exports.getAll_article = (req, res) => 
{
    if(req.session.admin_name){
        News.findAll().
        then(news=>{

            var list = [];
            for(var i =0;i< news.length;i++){
                list.push(news[i].dataValues);
            }
            

            var actions = list.map(fn_map_user);
            var data = Promise.all(actions);
            data.then(result =>{
                
                return res.send(result);
            });

        }).catch(err=>{
            console.log(err);
            return res.send(JSON.stringify({"error":true}));
        });
    }else res.redirect('/')
    
};

exports.new_article = (req, res) => 
{
    var type = req.session.admin_type;
    if(req.session.admin_name){
        if(type == Status.AdminType.ROOT || type == Status.AdminType.MANAGER){
            News.aggregate('category', 'DISTINCT', { plain: false })
            .then(category=>{
                console.log(category);
                return res.render('admin/cms/newarticle',{"data":null,'login':true,'category': category,"type": type});
            })
        }else res.redirect("/admin/list-kyc");
        
        
    }else res.redirect('/');
};
exports.modify_article = (req, res) => 
{
    var type = req.session.admin_type;
    if(req.session.admin_name){
        if(type == Status.AdminType.ROOT || type == Status.AdminType.MANAGER)
        {
            var id = req.query.id;
            console.log(id);
            News.findById(id)
            .then(news=>{
                News.aggregate('category', 'DISTINCT', { plain: false })
                .then(category=>{
                    console.log(category);
                    return res.render('admin/cms/newarticle',{"data":news.dataValues,'login':true,'category': category,"type": type});
                })
                // return res.render('admin/cms/newarticle',{"data":news.dataValues,'login':true,"type": type}); 
            }).catch(error =>{
                return res.render('admin/cms/newarticle',{"data":null,'login':true,"type": type}); 
            })
        }else res.redirect("/admin/list-kyc");

    }else res.redirect('/');
};

exports.createNews = (req,res) =>
{
    var data = req.body;
    if (!req.files)
        return res.status(400).send('No files were uploaded.');
    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir);
    }
    var sampleFile = req.files.image_front;
    console.log(req.files)
    var img = '';
    if(sampleFile != undefined){
        sampleFile.mv(dir+'/'+sampleFile.name, function(err) {
            if (err)
            return res.status(500).send(err);
        });
        front_img = sampleFile.name
    }
    
    var article_title = data.article_title;
    var short_description = data.short_description;
    var content_news = data.content_news;
    var meta_description = data.meta_description;
    var meta_keyword = data.meta_keyword;
    var category     = data.val_category

    News.create({
        'title': article_title,
        'description': short_description,
        'content':content_news,
        'url_image':img,
        'admin_id':req.session.admin_id,
        'createdate':Date.now(),
        'category':category,
        'keyword': meta_keyword,
        'meta_description':meta_description,
        'status': 'enable'
    }).then(news=>{
        return res.redirect('/admin/news?success=true');
    }).catch(err => {
        return res.redirect('/admin/news?success=false');
    })
}
exports.modify_news =(req,res)=>
{
    var data = req.body;
    if (!req.files)
        return res.status(400).send('No files were uploaded.');
    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir);
    }
    var url_image='';
    var sampleFile = req.files.image_front;
    console.log(data);
    if(sampleFile != undefined){
        url_image = req.files.image_front.name;
    
        sampleFile.mv(dir+'/'+sampleFile.name, function(err) {
            if (err)
                return res.status(500).send(err);
        });
    }
        
    var article_title = data.article_title;
    var short_description = data.short_description;
    var content_news = data.content_news;
    var meta_description = data.meta_description;
    var meta_keyword = data.meta_keyword;

    var val_status =data.val_status;
    var id = req.body.id_news;
    var category = data.category;

    var updateData ;
    if (url_image =='')
        updateData= {
            title: article_title,
            description: short_description,
            content:content_news,
            // 'url_image':url_image,
            admin_id:req.session.admin_id,
            createdate:Date.now(),
            category:category,
            keyword: meta_keyword,
            meta_description:meta_description,
            status: val_status
        }
    else updateData= {
        title: article_title,
        description: short_description,
        content:content_news,
        url_image:url_image,
        admin_id:req.session.admin_id,
        createdate:Date.now(),
        category:category,
        keyword: meta_keyword,
        meta_description:meta_description,
        status: val_status
    }
    console.log(updateData);
    News.findById(id)
    .then(news=>{
        news.update(updateData);
    }).then(data=>{
        console.log('after update');
        return res.redirect('/admin/news?success=true');
    }).catch(error=>{
        console.log(error);
        return res.redirect('/admin/news?success=false');
    })
}
exports.delete_news =(req,res)=>{
    if(req.session.admin_name){
        var id_news = req.body.id;
        News.destroy({where: { 'id': id_news } })
        .then(result =>{
            res.send(JSON.stringify({"success":true}))
        }).catch(err=>{
            res.send(JSON.stringify({"error":true}))
        })
    }else res.redirect('/');
}
// ADvisor
//get
exports.list_advisor = (req, res) => 
{
    var type = req.session.admin_type;
    if(req.session.admin_name){
        if(type == Status.AdminType.ROOT || type == Status.AdminType.MANAGER)
            return res.render('admin/cms/advisor',{'login':true,"type": type});
        else res.redirect("/admin/list-kyc");
        
    }else res.redirect('/');
};
exports.modifyadvisor =(req,res)=>
{
    var type = req.session.admin_type;
    if(req.session.admin_name){
        if(type == Status.AdminType.ROOT || type == Status.AdminType.MANAGER)
            {
                var id = req.query.id;
                console.log(id);
                Advisor.findById(id)
                .then(advisor=>{
                    console.log(advisor);
                    return res.render('admin/cms/newadvisor',{"data":advisor.dataValues,'login':true,"type": type}); 
                }).catch(error =>{
                    return res.render('admin/cms/newadvisor',{"data":null,'login':true,"type": type}); 
                })
            }
        else res.redirect("/admin/list-kyc");
        
    }else res.redirect('/');
}
exports.addnewadvisor=(req,res)=>
{
    var type = req.session.admin_type;
    if(req.session.admin_name){
        if(type == Status.AdminType.ROOT || type == Status.AdminType.MANAGER)
            return res.render('admin/cms/newadvisor',{"data":null,'login':true,"type": type});
        else return res.redirect("/admin/list-kyc");
    }else return res.redirect('/admin/siginin');
}

//post
exports.createAdvisor =(req,res) =>
{
    var data = req.body;
    if (!req.files)
        return res.status(400).send('No files were uploaded.');
    if (!fs.existsSync(dir_advisor)){
        fs.mkdirSync(dir_advisor);
    }
    var sampleFile = req.files.image_front;
    console.log(req.files)
    var img = '';
    if(sampleFile != undefined){
        sampleFile.mv(dir_advisor+'/'+sampleFile.name, function(err) {
            if (err)
            return res.status(500).send(err);
        });
        img = sampleFile.name
    }
    
    var advisorname = data.advisorname;
    var detailadvisor = data.detailadvisor;
    var linkedin = data.linkedin;
    var facebook =  data.facebook;
    var twitter  = data.twitter;
    Advisor.create({
        'name': advisorname,
        'url_img': img,
        'description':'',
        'information':detailadvisor,
        'admin_id':req.session.admin_id,
        'createdate':Date.now(),
        'admin_name':req.session.admin_name,
        'status': 'enable',
        "linkedin": linkedin,
        "facebook": facebook,
        "twitter" : twitter
    }).then(advisor=>{
        return res.redirect('/admin/advisor?success=true');
    }).catch(err => {
        console.log(err);
        return res.redirect('/admin/advisor?success=false');
    });
}
exports.updateadvisor =(req,res)=>
{
    var data = req.body;
    console.log(data);
    if (!req.files)
        return res.status(400).send('No files were uploaded.');
    if (!fs.existsSync(dir_advisor)){
        fs.mkdirSync(dir_advisor);
    }
    var sampleFile = req.files.image_front;
    console.log(req.files)
    var img = '';
    if(sampleFile != undefined){
        sampleFile.mv(dir_advisor+'/'+sampleFile.name, function(err) {
            if (err)
            return res.status(500).send(err);
        });
        img = sampleFile.name
    }
    
    
    var advisorname = data.advisorname;
    var detailadvisor = data.detailadvisor;
    var linkedin = data.linkedin;
    var status = data.val_status;
    var id = data.id_advisor;
    var facebook =  data.facebook;
    var twitter  = data.twitter;

    var data_update = {
        'name': advisorname,
        'description':'',
        'information':detailadvisor,
        'admin_id':req.session.admin_id,
        'admin_name':req.session.admin_name,
        'status': status,
        "linkedin": linkedin,
        "facebook": facebook,
        "twitter" : twitter
    };
    if (img)
        data_update['url_img'] = img;
    console.log(id);
    Advisor.findById(id)
    .then(advisor=>{
        advisor.update(data_update).then(advisor=>{
            return res.redirect('/admin/advisor?success=true');
        }).catch(err => {
            console.log(err);
            return res.redirect('/admin/advisor?success=false');
        });
    }).catch(err=>{
        console.log(err);
        return res.redirect('/admin/advisor?success=false');
    })
    
}
exports.getaddadvisor =(req,res)=>
{
    if(req.session.admin_name){
        Advisor.findAll().
        then(advisor=>{

            var list = [];
            for(var i =0;i< advisor.length;i++){
                list.push(advisor[i].dataValues);
            }
            return res.send(list);

        }).catch(err=>{
            console.log(err);
            return res.send(JSON.stringify({"error":true}));
        });
    }else res.redirect('/')
}
exports.deleteadvisor =(req,res)=>
{
    if(req.session.admin_name){
        var id_news = req.body.id;
        Advisor.destroy({where: { 'id': id_news } })
        .then(result =>{
            res.send(JSON.stringify({"success":true}))
        }).catch(err=>{
            res.send(JSON.stringify({"error":true}))
        })
    }else res.redirect('/');
}
// Event
//get
exports.manageEvent =(req,res)=>{
    var type = req.session.admin_type;
    if(req.session.admin_name){
        if(type == Status.AdminType.ROOT || type == Status.AdminType.MANAGER){
            return res.render('admin/cms/event',{'login':true,"type": type});
        }else return res.redirect("/admin/list-kyc");
        
    }else res.redirect('/');
}
exports.newEvent=(req,res)=>{
    var type = req.session.admin_type;
    if(req.session.admin_name){
        if(type == Status.AdminType.ROOT || type == Status.AdminType.MANAGER){
            return res.render('admin/cms/newevent',{"data":null,'login':true,"type": type});
        }else return res.redirect("/admin/list-kyc");
        
    }else res.redirect('/');
}
exports.updateEvent=(req,res)=>
{
    var type = req.session.admin_type;
    if(req.session.admin_name){
        if(type == Status.AdminType.ROOT || type == Status.AdminType.MANAGER){
            var id = req.query.id;
            console.log(id);

            Events.findById(id)
            .then(events=>{
                console.log(events);
                return res.render('admin/cms/newevent',{"data":video.dataValues,'login':true,"type": type}); 
            }).catch(error =>{
                return res.render('admin/cms/newevent',{"data":null,'login':true,"type": type}); 
            })
        }else return res.redirect("/admin/list-kyc");
        
    }else res.redirect('/');
}
//post
exports.createEvent =(req,res)=>{
    if(req.session.admin_name){
        var data = req.body;
        console.log(data);
        Events.create({
            'date_start': data.eventstart,
            'date_end': data.eventend,
            'date_create': Date.now(),
            'title': data.eventname,
            'content':'',
            'description':data.eventdescription,
            'status':'enable',
            'url_image':'',
            'admin_id':req.session.admin_id,
            'admin_name': req.session.admin_name,
            'amount': data.amount
        }).then(events=>{
            return res.redirect('/admin/event?success=true');
        }).catch(err => {
            console.log(err);
            return res.redirect('/admin/event?success=false');
        });
    }else res.redirect('/');
}
exports.modify_event =(req,res)=>{
    if(req.session.admin_name){
        var data = req.body;

        updateData={
            'date_start': data.eventstart,
            'date_end': data.eventend,
            'date_create': Date.now(),
            'title': data.eventname,
            'description':data.eventdescription,
            'status':data.val_status,
            'amount': data.amount
        }
        Video.findById(data.eventid)
        .then(video=>{
            video.update(updateData);
        }).then(data=>{
            console.log('after update');
            return res.redirect('/admin/video?success=true');
        }).catch(error=>{
            console.log(error);
            return res.redirect('/admin/video?success=false');
        })
    }else res.redirect('/');
}
exports.delete_event =(req,res)=>{
    if(req.session.admin_name){
        var id_event = req.body.id;
        Events.destroy({where: { 'id': id_event } })
        .then(result =>{
            res.send(JSON.stringify({"success":true}))
        }).catch(err=>{
            res.send(JSON.stringify({"error":true}))
        })
    }else res.redirect('/');
}
exports.getall_event =(req,res)=>{

    if(req.session.admin_name){
        Events.findAll().
        then(events=>{

            var list = [];
            for(var i =0;i< events.length;i++){
                list.push(events[i].dataValues);
            }
            
            return res.send(list);

        }).catch(err=>{
            console.log(err);
            return res.send(JSON.stringify({"error":true}));
        });
    }else res.redirect('/');

}
// Video
// get
exports.managevideo =(req,res)=>{
    var type = req.session.admin_type;
    if(req.session.admin_name){
        if(type == Status.AdminType.ROOT || type == Status.AdminType.MANAGER){
            return res.render('admin/cms/video',{'login':true,"type": type});
        }else return res.redirect("/admin/list-kyc");
        
    }else res.redirect('/');
    
}
exports.newvideo =(req,res)=>{
    var type = req.session.admin_type;
    if(req.session.admin_name){
        if(type == Status.AdminType.ROOT || type == Status.AdminType.MANAGER){
            return res.render('admin/cms/newvideo',{"data":null,'login':true,"type": type});
        }else return res.redirect("/admin/list-kyc");
        
    }else res.redirect('/');
}
exports.update_vieo=(req,res)=>{
    var type = req.session.admin_type;
    if(req.session.admin_name){
        if(type == Status.AdminType.ROOT || type == Status.AdminType.MANAGER){
            var id = req.query.id;
            console.log(id);
            Video.findById(id)
            .then(video=>{
                console.log(video);
                return res.render('admin/cms/newvideo',{"data":video.dataValues,'login':true,"type": type}); 
            }).catch(error =>{
                return res.render('admin/cms/newvideo',{"data":null,'login':true,"type": type}); 
            })
        }else return res.redirect("/admin/list-kyc");
        

    }else res.redirect('/');
}
//post

exports.createVideo =(req,res)=>{
    if(req.session.admin_name){
        var data = req.body;

        Video.create({
            'video_title': data.videotitle,
            'video_description': data.videodescription,
            'video_link': data.videolink,
            'status': 'enable',
            'admin_id': req.session.admin_id,
            'admin_name': req.session.admin_name,
            'createdate':Date.now()
        }).then(video=>{
            return res.redirect('/admin/video?success=true');
        }).catch(err => {
            console.log(err);
            return res.redirect('/admin/video?success=false');
        });
    }else res.redirect('/');
}
exports.updatevideo =(req,res)=>{
    if(req.session.admin_name){
        var data= req.body;
        var id = data.videoid;
        updateData={
            'video_title': data.videotitle,
            'video_description': data.videodescription,
            'video_link': data.videolink,
            'status':data.val_status
        }
        Video.findById(id)
        .then(video=>{
            video.update(updateData);
        }).then(data=>{
            console.log('after update');
            return res.redirect('/admin/video?success=true');
        }).catch(error=>{
            console.log(error);
            return res.redirect('/admin/video?success=false');
        })
    }else res.redirect('/');
}

exports.deletevideo=(req,res)=>{
    if(req.session.admin_name){
        var id_video = req.body.id;
        Video.destroy({where: { 'id': id_video } })
        .then(result =>{
            res.send(JSON.stringify({"success":true}))
        }).catch(err=>{
            res.send(JSON.stringify({"error":true}))
        })
    }else res.redirect('/');
}
exports.getallvideo =(req,res)=>{
    if(req.session.admin_name){
        Video.findAll().
        then(video=>{

            var list = [];
            for(var i =0;i< video.length;i++){
                list.push(video[i].dataValues);
            }
            
            return res.send(list);

        }).catch(err=>{
            console.log(err);
            return res.send(JSON.stringify({"error":true}));
        });
    }else res.redirect('/')
}
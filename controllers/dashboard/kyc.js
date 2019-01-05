const multer = require('multer');
const path = require('path');
const upload = multer({ dest: '../../uploads/' });
const db = require('../../db/models');
const fs = require('fs');
const KYC = db.KYC;
const User = db.User;

const twoFactor = require('node-2fa');
const twoFA = require('../utils/TwoFactorAuth');

function getTypeKyc(str) {
    if (str == 'identify_cart') return 1;
    if (str == 'passport') return 2;
    else return 3;
}

exports.uploadkyc = (req, res) => {
    var user_id = req.session.user_id;
    var user_name = req.session.user_name;
    var data = req.body;
    var authy_code = data.val_auth;
    var dir = path.join(__dirname, '../../public/uploads')
    if (user_id) {
        dir = dir + '/' + user_name;

        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }

        var sampleFile = req.files.image_front;
        var front_img = '';
        var behind_img = '';
        var selfie_img = '';

        if (sampleFile != undefined) {
            sampleFile.mv(dir + '/' + sampleFile.name, function (err) {
                if (err)
                    return res.status(500).send(err);
            });
            front_img = user_name + "/" + sampleFile.name;
        }


        var image_back = req.files.image_back;
        if (image_back != undefined) {
            behind_img = user_name + "/" + image_back.name;
            image_back.mv(dir + '/' + image_back.name, function (err) {
                if (err)
                    return res.status(500).send(err);
            });
        }


        var image_selfie = req.files.image_selfie;
        if (image_back != undefined) {
            selfie_img = user_name + "/" + image_selfie.name;

            image_selfie.mv(dir + '/' + image_selfie.name, function (err) {
                if (err)
                    return res.status(500).send(err);
            });

        }


        KYC.create({
            'name': data.val_firstname + ' ' + data.val_lastname,
            'phone': data.val_phoneus,
            'national': data.val_nationality,
            'passport_number_id': data.val_identification_id,
            'status': 'Waiting',
            'createdate': Date.now(),
            'url_img_back': front_img,
            'url_img_behind': behind_img,
            'url_img_all': selfie_img,
            'type': getTypeKyc(data.val_identification_type),
            'error_verify': ''
        }).then(kyc => {
            User.findOne({ where: { 'username': user_name } }).
                then(user => {
                    user.update({ 'kyc_id': kyc.id })
                }).then(user => {
                    return res.redirect('/dashboard/kyc?success=true');
                }).catch(err => {
                    console.log(err)
                    return res.redirect('/dashboard/kyc?success=false');
                })

        }).catch(err => {
            console.log(err);
            return res.redirect('/dashboard/kyc?success=false');
        })

    } else res.redirect("/");

}
exports.updatekyc = (req, res) => {
    console.log(req.session.user_name)
    var data = req.body;
    // if (!req.files)
    //     return res.status(400).send('No files were uploaded.');
    var dir = path.join(__dirname, '../../public/uploads')
    dir = dir + '/' + req.session.user_name;
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }

    var sampleFile = req.files.image_front;
    var front_img = '';
    var behind_img = '';
    var selfie_img = '';
    if (sampleFile != undefined) {
        sampleFile.mv(dir + '/' + sampleFile.name, function (err) {
            if (err)
                return res.status(500).send(err);
        });
        front_img = req.session.user_name + "/" + sampleFile.name
    }

    var image_back = req.files.image_back;
    if (image_back != undefined) {
        behind_img = req.session.user_name + "/" + image_back.name;
        image_back.mv(dir + '/' + image_back.name, function (err) {
            if (err)
                return res.status(500).send(err);
        });
    }


    var image_selfie = req.files.image_selfie;
    if (image_back != undefined) {
        selfie_img = req.session.user_name + "/" + image_selfie.name;

        image_selfie.mv(dir + '/' + image_selfie.name, function (err) {
            if (err)
                return res.status(500).send(err);
        });

    }

    var dataUpdate = {
        'name': data.val_firstname + ' ' + data.val_lastname,
        'phone': data.val_phoneus,
        'national': data.val_nationality,
        'passport_number_id': data.val_identification_id,
        'status': 'Waiting',
        'createdate': Date.now(),
        'type': getTypeKyc(data.val_identification_type),
        'error_verify': ''
    }
    console.log(data);
    if (front_img)
        dataUpdate['url_img_back'] = front_img;
    if (behind_img)
        dataUpdate['url_img_behind'] = behind_img;
    if (selfie_img)
        dataUpdate['url_img_all'] = selfie_img;
    KYC.findById(req.body.kyc_id)
        .then(kyc => {
            kyc.update(dataUpdate).then(kyc => {
                User.findOne({ where: { 'username': req.session.user_name } }).
                    then(user => {
                        user.update({ 'kyc_id': kyc.id })
                    }).then(user => {
                        return res.redirect('/dashboard/kyc?success=true');
                    }).catch(err => {
                        console.log(err)
                        return res.redirect('/dashboard/kyc?success=false');
                    })
            }).catch(err => {
                console.log(err);
                return res.redirect('/dashboard/kyc?success=false');
            })
        })


}
exports.kyc = (req, res) => {
    if (req.session.user_name) {
        User.findOne({ where: { 'username': req.session.user_name } })
            .then(user => {
                var warning = {};
                if (user.dataValues.wallet_id == 0) {
                    warning['wallet'] = true;
                }
                
                KYC.findById(user.dataValues.kyc_id)
                    .then(kyc => {

                        if (kyc) {
                            var result = kyc.dataValues;
                            result['error'] = {};
                            if (result.error_verify) {
                                var array_error = result.error_verify.split(",");

                                for (var i = 0; i < array_error.length; i++) {
                                    result['error'][array_error[i]] = array_error[i];
                                }
                            }
                            result['username'] = req.session.user_name;
                            console.log(result);
                            return res.render('dashboard/account/kyc', { 'data': result, 'warning': warning,"link": '/dashboard/kyc','name': "Kyc" });
                        } else return res.render('dashboard/account/kyc', { 'data': null, 'warning': warning,"link": '/dashboard/kyc','name': "Kyc" });
                    })

            }).catch(error => {
                console.log(error);
                return res.redirect('/');
            })

    } else return res.redirect('/');

};

exports.getAllKyc = (req, res) => {

    if (req.session.user_name) {
        KYC.findAll({ where: { status: 'waiting' } })
            .then(data => {
                console.log(data);

                var list = []
                for (var i = 0; i < data.length; i++) {
                    list.push(data[i].dataValues);
                }

                return res.send(list);
            }).catch(error => {
                console.log(error);
                return res.send(JSON.stringify({ "error": true }));
            });
        //     })
    } else res.redirect('/');

}
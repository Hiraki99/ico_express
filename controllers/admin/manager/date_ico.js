const db = require('../../../db/models');
const Status = require('../../utils/Status_Constant');
const SC = require('../../utils/Status_Constant');
const Config = require('../../../smart_contract/config');


exports.set_date_ico = (req, res) => {
    var type = req.session.admin_type;
    if (req.session.admin_id) {
        return res.render('admin/tokenmanager/dateico', { 'login': true, 'type': type });
    } else return res.redirect('/');
};

exports.changeDateIco = async (req, res) => {
    if (req.session.admin_type && req.body.preico_start_date && req.body.preico_end_date && req.body.ico_start_date && req.body.ico_end_round1 && req.body.ico_end_round2 && req.body.ico_end_round3 && req.body.password && req.body.private) {
        var admin = await db.Admin.findById(req.session.admin_id);
        if (admin != null) {
            if (admin.password == req.body.password) {
                var data = Config.contract_ico.methods.setDateIco(req.body.preico_start_date, req.body.preico_end_date, req.body.ico_start_date, req.body.ico_end_round1, req.body.ico_end_round2, req.body.ico_end_round3).encodeABI();
                var privateKey = req.body.private;
                console.log(req.body);
                // Config.createRawTransaction(admin.address, Config.CONTRACT_ADDRESS_ICO, 0, 15, 3000000, data, Config.CHAND_ID).then(rawTransaction => {
                //     var tx = Config.signToRawTransaction(privateKey, rawTransaction);
                //     Config.sendRawTransaction(tx)
                //         .once('transactionHash', async function (hash) {
                //             res.next({
                //                 error: false,
                //                 title: "waiting",
                //                 log: "transaction is pending" + "<\/br> txs: " + hash
                //             });
                //         })
                //         .then(async result => {
                //             console.log(result);
                //             return res.send({
                //                 error: false,
                //                 title: "Completed",
                //                 log: "transaction is success"
                //             });
                //         });
                // }).catch(err=>{
                //     return res.send({
                //         error: true,
                //         title: "Failed",
                //         log: "transaction is failed. err: "+err
                //     });
                // });

            }else{
                return res.send({
                    error: true,
                    title: "Failed",
                    log: "password is incorrect!"
                });
            }
        }else{
            return res.send({
                error: true,
                title: "Failed",
                log: "admin is not exist!"
            });
        }
    }else{
        return res.send({
            error: true,
            title: "Failed",
            log: "Input is incorrect!"
        });
    }
    var type = req.session.admin_type;
    if (req.session.admin_id) {
        console.log(req.body);
    } else return res.redirect('/');
}
exports.setReleaseDate = (req, res) => {

}
exports.changeReleaseDate = (req, res) => {

}
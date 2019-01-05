const express = require('express'), router = express.Router();
const multer = require('multer');
const path = require('path');
const upload = multer({ dest:  '../../uploads/' });
var fileupload = require("express-fileupload");

var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();
const homeController           = require('../controllers/home');
// const kyc_controller           = require('../controllers/KYC/kyc_controller');
const PriceCrypto              = require('../controllers/DashBoard/PriceCrypto');
const dashboardController      = require('../controllers/dashboard/dashboard');
const authController           = require('../controllers/DashBoard/Auth');
const kycController            = require('../controllers/KYC/kyc_controller');
const cmsController            = require('../controllers/CMS/cms_controller');

//lading pages
router.get('/',                     homeController.index);
router.get('/news',                 homeController.news);
router.post('/getContentNews',      homeController.contentNews);
// Sign In , Sign Up
router.post('/loginSubmitAjax',     dashboardController.LogIn);
router.post('/SignUpAjax',          dashboardController.SignUp);
router.post('/check_username',      dashboardController.CheckUserName);
router.post('/check_password',      dashboardController.CheckEmail);
router.get('/confirmaccount',       dashboardController.VerifyAccount);

// dashboard
router.get('/dashboard',            homeController.dashboard);
router.get('/dashboard/airdrop',    homeController.airdrop);
router.get('/dashboard/notify',     homeController.notify);
router.get('/dashboard/kyc',        kycController.kyc);
router.get('/dashboard/wallet',     homeController.wallet);
router.get('/dashboard/referal',    homeController.referal);
router.get('/dashboard/profile',    homeController.infor_account);

router.post('/dashboard/getprice',  PriceCrypto.getPrice);
// Account
router.get('/account/changePassword',  homeController.changePassword);
router.get('/account/authy',           authController.authy);
router.get('/account/profile',         homeController.profile);

router.post('/account/changePassword', dashboardController.changePassword);
router.post('/account/enable2FA',      authController.ActiveAuth);
router.post('/account/disable2FA',     authController.DisableAuth);
router.post("/account/uploadkyc",      kycController.uploadkyc)
router.post("/account/updatekyc",      kycController.updatekyc)

//cms
    //kyc
router.get('/admin/list-kyc',          homeController.list_user_kyc);
router.get('/admin/detailkyc',         kycController.detail_user_kyc);
router.get('/admin/list-admin',        homeController.list_account);
router.get('/admin/new-account-admin', homeController.create_account_admin);

router.post('/admin/listkyc',          kycController.getAllKyc);
router.post('/admin/verfiykyc',        kycController.verfiy_user_kyc);

    // news
router.get('/admin/news',            cmsController.list_article);
router.get('/admin/create-news',     cmsController.new_article);
router.get('/admin/modify-news',     cmsController.modify_article);

router.post('/admin/addnews',        cmsController.createNews);
router.post('/admin/changenews',     cmsController.modify_news);
router.post('/admin/deletenews',     cmsController.delete_news);
router.post('/admin/getallnews',     cmsController.getAll_article);

    // advisor
router.get('/admin/advisor',         cmsController.list_advisor);
router.get('/admin/newadvisor',      cmsController.addnewadvisor);
router.get('/admin/updateadvisor',   cmsController.modifyadvisor);

router.post('/admin/getalladvisor',  cmsController.getaddadvisor);
router.post('/admin/addnewadvisor',  cmsController.createAdvisor);
router.post('/admin/modifyadvisor',  cmsController.updateadvisor);
router.post('/admin/deleteadvisor',  cmsController.deleteadvisor);
    // Event
router.get('/admin/event',           cmsController.managEvent);
router.get('/admin/newevent',        cmsController.newEvent);
router.get('/admin/updateevent',     cmsController.updateEvent);

router.post('/admin/addevent',       cmsController.createEvent);
router.post('/admin/modifyevent',    cmsController.modify_event);
router.post('/admin/deleteevent',    cmsController.delete_event);
router.post('/admin/getallevent',    cmsController.getall_event);
    // Video
router.get('/admin/video',           cmsController.managevideo);
router.get('/admin/newvideo',        cmsController.newvideo);
router.get('/admin/updatevideo',     cmsController.update_vieo);

router.post('/admin/addvideo',       cmsController.createVideo);
router.post('/admin/modifyvideo',    cmsController.updatevideo);
router.post('/admin/deletevideo',    cmsController.deletevideo);
router.post('/admin/getallvideo',    cmsController.getallvideo);
// bonus0
router.get('/admin/bonus',           homeController.send_bonus);
router.get('/admin/date-ico',        homeController.set_date_ico);

router.post('/dashboard',dashboardController.getInformationDashboard);

//wallet
router.get('/wallet', homeController.wallet);
router.post('/dashboard/wallet',walletController.postInforWallet);
router.post('/dashboard/wallet-add-address',walletController.addAddressWallet);
router.post('/dashboard/wallet-change-address',walletController.changeAddressWallet);
router.post('/dashboard/wallet-list-transaction',walletController.postListTransaction);

module.exports = router;
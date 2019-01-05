const express = require('express'), router = express.Router();

const multer                   = require('multer');
const path                     = require('path');
const upload                   = multer({ dest:  '../../uploads/' });
var fileupload                 = require("express-fileupload");
var multipart                  = require('connect-multiparty');
var multipartMiddleware        = multipart();
// controller

const homeController           = require('../controllers/home');
const pricecrypto              = require('../controllers/dashboard/pricecrypto');
const dashboardController      = require('../controllers/dashboard/dashboard');
const authController           = require('../controllers/dashboard/auth');
const kycController            = require('../controllers/dashboard/kyc');
const icoController            = require('../controllers/dashboard/ico');
const walletController         = require('../controllers/dashboard/wallet');
const notifiController         = require('../controllers/account/notification');
const airdropController = require('../controllers/account/airdrop');

//lading pages
router.get('/',                                  homeController.index);
router.get('/news',                              homeController.news);
router.get('/allnews',                           homeController.allnews_page);

router.post('/news-pagging',                     homeController.news_pagination);
router.post('/get-all-news',                     homeController.get_all_news);
router.post('/top-news',                         homeController.topnews);
router.post('/getContentNews',                   homeController.contentNews);
router.post('/get-videos',                       homeController.getvideos);
// Sign In , Sign Up
router.post('/loginSubmitAjax',                  dashboardController.LogIn);
router.post('/SignUpAjax',                       dashboardController.SignUp);
router.post('/check_username',                   dashboardController.CheckUserName);
router.post('/check_email',                      dashboardController.CheckEmail);
router.get('/confirmaccount',                    dashboardController.VerifyAccount);
router.post('/re_confirmaccount',                dashboardController.resendVerify);
router.post('/token-sale',                       homeController.getTokenSale);
router.post('/list-advisor',                     homeController.getAlladvisor);

// dashboard
//get
// router.get('/dashboard',                         homeController.dashboard);
router.get('/dashboard/notify',                  homeController.notify);
router.get('/dashboard/kyc',                     kycController.kyc);
router.get('/dashboard/wallet',                  walletController.wallet);
router.get('/dashboard/referal',                 homeController.referal);
router.get('/dashboard/profile',                 dashboardController.infor_account);
router.get('/dashboard/ico',                     icoController.icopage);
router.get('/dashboard' , dashboardController.dashboard);
//post
router.post('/dashboard/dashboard-check',dashboardController.checkShowDashboard);
router.post('/dashboard_v2/dashboard-check',dashboardController.checkShowDashboard_v2);
router.post('/dashboard/getTransaction', dashboardController.getTransactionFromEtherscan);
router.post('/dashboard/getprice',               pricecrypto.getPrice);
router.post('/dashboard/getpriceMulti',          pricecrypto.getPriceMulti);
// router.post('/dashboard',                        dashboardController.getInformationDashboard);
router.post('/dashboard',                        dashboardController.getInformationDashboard_v2);
router.post('/dashboard/dashboard-selling', dashboardController.timeCycleSelling);
    // Account
router.get('/account/changePassword',            homeController.changePassword);
router.get('/account/authy',                     authController.authy);
router.get('/account/profile',                   homeController.profile);

router.post('/account/changePassword',           dashboardController.changePassword);
router.post('/account/enable2FA',                authController.ActiveAuth);
router.post('/account/disable2FA',               authController.DisableAuth);
router.post("/account/uploadkyc",                kycController.uploadkyc)
router.post("/account/updatekyc",                kycController.updatekyc)


// wallet
router.get('/wallet',                            walletController.wallet);
router.post('/dashboard/wallet-check', walletController.checkShowWallet);
router.post('/dashboard/wallet',                 walletController.postInforWallet);
router.post('/dashboard/wallet-add-address',     walletController.addAddressWallet);
router.post('/dashboard/wallet-change-address',  walletController.changeAddressWallet);
router.post('/dashboard/wallet-list-transaction',walletController.postListTransaction);

// notify
router.post('/dashboard/list-notify',            notifiController.getListNotificationForUser);
router.post('/dashboard/update-NewNotify',       notifiController.updateNewNotify);
//airdrop
router.get('/dashboard/airdrop',                 airdropController.airdrop);
router.post('/dashboard/airdrop',airdropController.getListAirdropForUser);

module.exports = router;
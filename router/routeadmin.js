const express                    = require('express'),router= express.Router();
const homeController             = require('../controllers/home');
const kycController              = require('../controllers/admin/manager/kyc_controller');
const accountmanager_contronller = require('../controllers/admin/manager/account-manager');
const cmsController              = require('../controllers/admin/cms/cms_controller');
const widget_controller          = require('../controllers/admin/cms/widget-controller');
const signin_controller          = require('../controllers/admin/signin_controller');
const bonusController = require('../controllers/admin/manager/bonus');
const airdropController = require('../controllers/account/airdrop');
const dateicoController = require('../controllers/admin/manager/date_ico');

//login
//get
router.get('/admin/signin',            signin_controller.adminlogin);
//post
router.post('/admin/loginAdmin',       signin_controller.checklogin)

router.get('/admin/changepassword',    signin_controller.changePassword);
router.post('/admin/changepassword',   signin_controller.updatePassword);

//admin
router.get('/admin/list-admin',        homeController.list_account);
router.get('/admin/new-account-admin', homeController.create_account_admin);

router.post('/admin/allaccount',       accountmanager_contronller.getListAccount);
router.post('/admin/create-account',   accountmanager_contronller.createNewAccountManager);
router.post('/admin/resetpassword',    accountmanager_contronller.resetPassword);
router.post('/admin/lockaccount'  ,    accountmanager_contronller.changeStatusLockOrUnlockAccount);
router.post('/admin/view-info-account',accountmanager_contronller.viewInfo);

//cms

//kyc
router.get('/admin/list-kyc',           kycController.list_user_kyc);
router.get('/admin/detailkyc',          kycController.detail_user_kyc);
router.get('/admin/list-kyc-verified',  kycController.list_kyc_verified);
router.get('/admin/get-list-kyc-trans', kycController.getListKYCTransaction);

router.post('/admin/listkyc',                    kycController.getAllKyc);
router.post('/admin/verfiykyc',                  kycController.verfiy_user_kyc);
router.post('/admin/get-random',                 kycController.getrandomKyc);
router.post('/admin/get-list-kyc-verified',      kycController.getAllKycPeding);
router.post('/admin/cancel-request-kyc', kycController.cancelKyc);
router.post('/admin/update-list-kyc-verified',   kycController.update_list_kyc_verified_2SC);
router.post('/admin/cancel-kyc',kycController.cancelKycSmartContract);
    // news
router.get('/admin/news',              cmsController.list_article);
router.get('/admin/create-news',       cmsController.new_article);
router.get('/admin/modify-news',       cmsController.modify_article);

router.post('/admin/addnews',          cmsController.createNews);
router.post('/admin/changenews',       cmsController.modify_news);
router.post('/admin/deletenews',       cmsController.delete_news);
router.post('/admin/getallnews',       cmsController.getAll_article);

    // advisor
router.get('/admin/advisor',           cmsController.list_advisor);
router.get('/admin/newadvisor',        cmsController.addnewadvisor);
router.get('/admin/updateadvisor',     cmsController.modifyadvisor);

router.post('/admin/getalladvisor',    cmsController.getaddadvisor);
router.post('/admin/addnewadvisor',    cmsController.createAdvisor);
router.post('/admin/modifyadvisor',    cmsController.updateadvisor);
router.post('/admin/deleteadvisor',    cmsController.deleteadvisor);
    // Event
router.get('/admin/event',             cmsController.manageEvent);
router.get('/admin/newevent',          cmsController.newEvent);
router.get('/admin/updateevent',       cmsController.updateEvent);

router.post('/admin/addevent',         cmsController.createEvent);
router.post('/admin/modifyevent',      cmsController.modify_event);
router.post('/admin/deleteevent',      cmsController.delete_event);
router.post('/admin/getallevent',      cmsController.getall_event);
    // Video
router.get('/admin/video',             cmsController.managevideo);
router.get('/admin/newvideo',          cmsController.newvideo);
router.get('/admin/updatevideo',       cmsController.update_vieo);

router.post('/admin/addvideo',         cmsController.createVideo);
router.post('/admin/modifyvideo',      cmsController.updatevideo);
router.post('/admin/deletevideo',      cmsController.deletevideo);
router.post('/admin/getallvideo',      cmsController.getallvideo);
//date ico
router.get('/admin/date-ico',          dateicoController.set_date_ico);
router.post('/admin/change-date-time-ico', dateicoController.changeDateIco);
router.get('/admin/release-date', dateicoController.setReleaseDate);
router.post('/admin/change-release-date', dateicoController.changeReleaseDate);
//widget

// notify
//get
router.get('/admin/notify'       ,     widget_controller.listnotify);
router.get('/admin/newnotify'    ,     widget_controller.newnotify);
router.get('/admin/updatenotify' ,     widget_controller.updatenotify);
// post
router.post('/admin/allnotify'   ,     widget_controller.getallnotify);
router.post('/admin/saveupdatenotify', widget_controller.saveupdatenotify);
router.post('/admin/createnotify',     widget_controller.createnotify);
router.post('/admin/deletenotify',     widget_controller.deletenotify);
//airdrop
//get
router.get('/admin/airdrop'      ,     widget_controller.listairdrop);
router.get('/admin/newairdrop'   ,     widget_controller.newairdrop);
router.get('/admin/modifyairdrop',     widget_controller.updateairdrop);
//post
router.post('/admin/allairdrop'   ,    widget_controller.getallairdrop);
router.post('/admin/saveupdateairdrop',widget_controller.saveupdateairdrop);
router.post('/admin/createairdrop',    widget_controller.createairdrop);
router.post('/admin/deleteairdrop',    widget_controller.deleteairdrop);
router.post('/admin/send-airdrop',bonusController.sendAirdrop);
router.post('/admin/send-airdrop-one-user',bonusController.sendBonusAirdropForOneAccount);


router.get('/admin/bonus',                   bonusController.send_bonus);
router.post('/admin/bonus-ico',              bonusController.getInforBonus);
router.post('/admin/bonus-airdrop',          bonusController.getInforBonusAirdrop);
router.post('/admin/send-bonus',             bonusController.sendBonusReferalIco);
router.post('/admin/send-bonus-one-user', bonusController.sendBonusReferalForOneAccount);
router.post('/admin/checkstatuschangekyc',   kycController.checkChangeStatus);

module.exports = router;
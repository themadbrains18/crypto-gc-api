"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = __importDefault(require("../middlewares/authController"));
const users_controller_1 = __importDefault(require("../controllers/users.controller"));
const main_controller_1 = __importDefault(require("../controllers/main.controller"));
const validators_1 = __importDefault(require("../validators"));
const roles_1 = __importDefault(require("../middlewares/_helper/roles"));
const profile_controller_1 = __importDefault(require("../controllers/profile.controller"));
const user_notification_controller_1 = __importDefault(require("../controllers/user_notification.controller"));
class usersRoutes extends main_controller_1.default {
    router = (0, express_1.Router)();
    constructor() {
        super();
        this.init();
    }
    init() {
        let users = new users_controller_1.default();
        let middleware = new authController_1.default();
        let profile = new profile_controller_1.default();
        let notification = new user_notification_controller_1.default();
        this.router.post("/register", users.register);
        this.router.post("/login", users.login);
        this.router.post('/', middleware.auth, users.checkUser);
        this.router.post('/exist', users.userExist);
        this.router.put('/update', middleware.auth, users.updateUser);
        this.router.post('/googleAuth', middleware.auth, users.verifyGoogleAuth);
        this.router.post('/userinfo', middleware.auth, middleware.permit(roles_1.default.admin, roles_1.default.user), users.userAuthenticate);
        this.router.put('/password', middleware.auth, users.updatePassword);
        this.router.put('/forget', users.updatePassword);
        this.router.put('/trading-password', middleware.auth, users.tradingPassword);
        this.router.post('/confirPassword', users.confirmPassword);
        this.router.post('/confirmFunCode', users.confirmFuncode);
        this.router.put('/fundcode', super.Validator(validators_1.default.settingSchema.updatefundcode), middleware.auth, users.updateFundcode);
        this.router.get('/address/:id/:type', users.depositAddress);
        this.router.delete('/authdelete/:id', middleware.auth, users.authRemove);
        this.router.get('/jwt', middleware.auth, users.checkUser);
        //=======================================================//
        // Profile routes create/update and get info
        //=======================================================//
        this.router.post('/profile/create', middleware.auth, super.Validator(validators_1.default.profileSchema.create), profile.create);
        this.router.get('/profile', middleware.auth, profile.getProfile);
        this.router.get('/activity', middleware.auth, profile.getActivity);
        // this.router.post('/profile/dp', service.upload.upload("dp", ["jpg", "png", "jpeg"], 5, [
        //     {
        //         name: "image",
        //         maxCount: 1,
        //     },
        // ]), middleware.auth, profile.savedp);
        // this.router.post('/user/profile/dp', middleware.auth, profile.savedpImage);
        //=======================================================//
        // user account manually scanner // admin can access this routes
        //=======================================================//
        // this.router.get('/scan/:address/:chainid',middleware.auth,middleware.permit(roles.admin,roles.superadmin),users.userAccountScanner); // user address scanner if previous transaction is on hold
        this.router.get('/scan/:address/:chainid/:userid', users.userAccountScanner); // user address scanner if previous transaction is on hold 
        // ====================================================//
        // Admin user routes//
        // ====================================================//
        // this.router.get('/admin/userList',middleware.auth,middleware.permit(roles.admin,roles.superadmin),users.usersList)
        this.router.get('/admin/userList', users.usersList);
        this.router.get('/admin/userListByLimit/:offset/:limit', middleware.auth, users.usersListByLimit);
        this.router.get('/admin/activityList', middleware.auth, users.activityList);
        this.router.get('/admin/activityList/:offset/:limit', middleware.auth, users.activityListByLimit);
        this.router.get('/admin/activityListById/:userid/:offset/:limit', middleware.auth, users.activityListByIdLimit);
        this.router.put('/admin/user', middleware.auth, users.userUpdate);
        this.router.put('/admin/add-pin', users.userPinUpdate);
        this.router.get('/admin/profit', users.getAdminProfit);
        this.router.get('/detial/:id', users.userInformationByUserId);
        this.router.delete('/clearactivity/:userid', users.clearActivity);
        this.router.get('/admin/userCount', middleware.auth, users.getUserDataAsCounts);
        // ====================================================//
        // Notification Route//
        // ====================================================//
        this.router.get('/notification/:id', middleware.auth, notification.getNotification);
        this.router.put('/notification/update', middleware.auth, notification.updateNotification);
    }
}
exports.default = new usersRoutes().router;

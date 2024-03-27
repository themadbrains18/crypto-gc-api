import { Application, Request, Response, Router } from "express";
import authController from "../middlewares/authController";
import userController from "../controllers/users.controller";
import BaseController from "../controllers/main.controller";
import validators from "../validators";
import roles from "../middlewares/_helper/roles";
import profileController from "../controllers/profile.controller";
import service from "../services/service";
import userNotificationController from "../controllers/user_notification.controller";



class usersRoutes extends BaseController {
    router = Router();

    constructor() {
        super();
        this.init();
    }

    init() {

        let users = new userController();
        let middleware = new authController();
        let profile = new profileController();
        let notification = new userNotificationController();

        this.router.post("/register", users.register);
        this.router.post("/login", users.login);
        this.router.post('/', middleware.auth, users.checkUser);
        this.router.post('/exist', users.userExist);
        this.router.put('/update', middleware.auth, users.updateUser);
        this.router.put('/whitelist', middleware.auth, users.updateWhiteList);
        this.router.post('/googleAuth', middleware.auth, users.verifyGoogleAuth);
        this.router.post('/userinfo', middleware.auth, middleware.permit(roles.admin, roles.user), users.userAuthenticate);
        this.router.put('/password', middleware.auth, users.updatePassword);
        this.router.put('/forget', users.updatePassword);
        this.router.put('/trading-password', middleware.auth, users.tradingPassword);
        this.router.put('/anti-phishing', middleware.auth, users.antiPhishingCode);
        this.router.post('/confirPassword', users.confirmPassword);
        this.router.post('/confirmFunCode', users.confirmFuncode);
        this.router.put('/fundcode', super.Validator(validators.settingSchema.updatefundcode), middleware.auth, users.updateFundcode);
        this.router.get('/address/:id/:type', users.depositAddress);
        this.router.delete('/authdelete/:id', middleware.auth, users.authRemove);
        this.router.get('/jwt', middleware.auth, users.checkUser);
        this.router.post('/confirm/otp', middleware.auth, users.confirmUserOtp);
        this.router.post('/send/otp', middleware.auth, users.sendOtp);

        //=======================================================//
        // Profile routes create/update and get info
        //=======================================================//

        this.router.post('/profile/create', middleware.auth, super.Validator(validators.profileSchema.create), profile.create);
        this.router.get('/profile', middleware.auth, profile.getProfile);
        this.router.get('/activity', middleware.auth, profile.getActivity);
        // this.router.post('/profile/dp', service.upload.upload("dp", ["jpg", "png", "jpeg"], 5, [
        //     {
        //         name: "image",
        //         maxCount: 1,
        //     },
        // ]), middleware.auth, profile.savedp);
        this.router.post('/profile/dp', middleware.auth, profile.savedp);
        //=======================================================//
        // user account manually scanner // admin can access this routes
        //=======================================================//

        // this.router.get('/scan/:address/:chainid',middleware.auth,middleware.permit(roles.admin,roles.superadmin),users.userAccountScanner); // user address scanner if previous transaction is on hold
        this.router.get('/scan/:address/:chainid/:userid', users.userAccountScanner); // user address scanner if previous transaction is on hold 

        // ====================================================//
        // Admin user routes//
        // ====================================================//

        // this.router.get('/admin/userList',middleware.auth,middleware.permit(roles.admin,roles.superadmin),users.usersList)
        this.router.get('/admin/userList', users.usersList)
        this.router.get('/admin/userListByLimit/:offset/:limit', middleware.auth, users.usersListByLimit)
        this.router.get('/admin/activityList', middleware.auth, users.activityList)
        this.router.get('/admin/activityList/:offset/:limit', middleware.auth, users.activityListByLimit)
        this.router.get('/admin/activityListById/:userid/:offset/:limit', middleware.auth, users.activityListByIdLimit)
        this.router.put('/admin/user', middleware.auth, users.userUpdate)
        this.router.put('/admin/add-pin', users.userPinUpdate)
        this.router.get('/admin/profit', users.getAdminProfit)
        this.router.get('/detial/:id', users.userInformationByUserId)
        this.router.delete('/clearactivity/:userid', users.clearActivity)
        this.router.get('/admin/userCount', middleware.auth, users.getUserDataAsCounts)

        // ====================================================//
        // Notification Route//
        // ====================================================//

        this.router.get('/notification/:id', middleware.auth, notification.getNotification);
        this.router.put('/notification/update', middleware.auth, notification.updateNotification);

    }
}

export default new usersRoutes().router;
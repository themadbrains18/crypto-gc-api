import { Application, Request, Response, Router } from "express";
import authController from "../middlewares/authController";
import userController from "../controllers/users.controller";
import BaseController from "../controllers/main.controller";
import validators from "../validators";
import roles from "../middlewares/_helper/roles";
import profileController from "../controllers/profile.controller";
import service from "../services/service";
import userNotificationController from "../controllers/user_notification.controller";

/**
 * Routes related to user management, profile management, and notifications.
 * Includes authentication, user registration, account updates, and admin functionalities.
 */
class usersRoutes extends BaseController {
    router = Router();

    /**
     * Initializes the user routes, setting up all endpoints.
     */
    constructor() {
        super();
        this.init();
    }

    /**
     * Defines routes for user management, profile, and admin tasks.
     * Includes routes for registration, login, password management, profile creation, etc.
     */
    init() {

        let users = new userController();
        let middleware = new authController();
        let profile = new profileController();
        let notification = new userNotificationController();

        // ================================================== //
        // User Authentication & Account Routes
        // ================================================== //

        /**
         * Register a new user.
         */
        this.router.post("/register", users.register);

        /**
         * Login a user.
         */
        this.router.post("/login", users.login);

        /**
         * Check if user exists.
         */
        this.router.post('/', middleware.auth, users.checkUser);

        /**
         * Check if user exists based on provided data.
         */
        this.router.post('/exist', users.userExist);

        /**
         * Update user details.
         */
        this.router.put('/update', middleware.auth, users.updateUser);

        /**
         * Update user's whitelist status.
         */
        this.router.put('/whitelist', middleware.auth, users.updateWhiteList);

        /**
         * Verify Google 2FA authentication.
         */
        this.router.post('/googleAuth', middleware.auth, users.verifyGoogleAuth);

        /**
         * Authenticate the user and verify roles (admin or user).
         */
        this.router.post('/userinfo', middleware.auth, middleware.permit(roles.admin, roles.user), users.userAuthenticate);

        /**
         * Update user password.
         */
        this.router.put('/password', middleware.auth, users.updatePassword);

        /**
         * Forgot password functionality.
         */
        this.router.put('/forget', users.updatePassword);

        /**
         * Update trading password.
         */
        this.router.put('/trading-password', middleware.auth, users.tradingPassword);

        /**
         * Update anti-phishing code.
         */
        this.router.put('/anti-phishing', middleware.auth, users.antiPhishingCode);

        /**
         * Confirm password change.
         */
        this.router.post('/confirPassword', users.confirmPassword);

        /**
         * Confirm functional code.
         */
        this.router.post('/confirmFunCode', users.confirmFuncode);

        /**
         * Update user fund code.
         */
        this.router.put('/fundcode', super.Validator(validators.settingSchema.updatefundcode), middleware.auth, users.updateFundcode);

        /**
         * Get user's deposit address.
         */
        this.router.get('/address/:id/:type', users.depositAddress);

        /**
         * Remove user authentication method.
         */
        this.router.delete('/authdelete/:id', middleware.auth, users.authRemove);

        /**
         * Check user JWT status.
         */
        this.router.get('/jwt', middleware.auth, users.checkUser);

        /**
         * Confirm user OTP for authentication.
         */
        this.router.post('/confirm/otp', middleware.auth, users.confirmUserOtp);

        /**
         * Send OTP to user.
         */
        this.router.post('/send/otp', middleware.auth, users.sendOtp);

        // ================================================== //
        // Profile Routes: Create/Update & Get Profile Info
        // ================================================== //

        /**
         * Create a new user profile.
         */
        this.router.post('/profile/create', middleware.auth, super.Validator(validators.profileSchema.create), profile.create);

        /**
         * Get user profile details.
         */
        this.router.get('/profile', middleware.auth, profile.getProfile);

        /**
         * Get user activity with pagination.
         */
        this.router.get('/activity/:offset/:limit', middleware.auth, profile.getActivity);

        /**
         * Save profile display picture.
         */
        this.router.post('/profile/dp', middleware.auth, profile.savedp);


        // ================================================== //
        // User Account Scanner (Admin-Only)
        // ================================================== //

        //=======================================================//
        // user account manually scanner // admin can access this routes
        //=======================================================//
        
        // this.router.get('/scan/:address/:chainid',middleware.auth,middleware.permit(roles.admin,roles.superadmin),users.userAccountScanner); // user address scanner if previous transaction is on hold
        /**
         * Scan user account based on address and chain ID.
         */
        this.router.get('/scan/:address/:chainid/:userid', users.userAccountScanner);

        // ================================================== //
        // Admin User Routes
        // ================================================== //

        /**
         * Get list of all users (admin-only).
         */
        this.router.get('/admin/userList', users.usersList);

        /**
         * Get user list with pagination (admin-only).
         */
        this.router.get('/admin/userListByLimit/:offset/:limit', middleware.auth, users.usersListByLimit);

        /**
         * Get list of user activities.
         */
        this.router.get('/admin/activityList', middleware.auth, users.activityList);

        /**
         * Get paginated list of user activities.
         */
        this.router.get('/admin/activityList/:offset/:limit', middleware.auth, users.activityListByLimit);

        /**
         * Get paginated list of user activities filtered by user ID.
         */
        this.router.get('/admin/activityListById/:userid/:offset/:limit', middleware.auth, users.activityListByIdLimit);

        /**
         * Update user details from admin panel.
         */
        this.router.put('/admin/user', middleware.auth, users.userUpdate);

        /**
         * Update user pin code (admin-only).
         */
        this.router.put('/admin/add-pin', users.userPinUpdate);

        /**
         * Get admin user profit data.
         */
        this.router.get('/admin/profit', users.getAdminProfit);

        /**
         * Get detailed user information by user ID.
         */
        this.router.get('/detial/:id', users.userInformationByUserId);

        /**
         * Clear user activity history (admin-only).
         */
        this.router.delete('/clearactivity/:userid', users.clearActivity);

        /**
         * Get user data count (admin-only).
         */
        this.router.get('/admin/userCount', middleware.auth, users.getUserDataAsCounts);

        // ================================================== //
        // User Notification Routes
        // ================================================== //

        /**
         * Get notifications for a specific user.
         */
        this.router.get('/notification/:id', middleware.auth, notification.getNotification);

        /**
         * Update user notification settings.
         */
        this.router.put('/notification/update', middleware.auth, notification.updateNotification);

    }
}

export default new usersRoutes().router;

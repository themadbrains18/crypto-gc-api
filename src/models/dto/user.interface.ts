/**
 * Data Transfer Object (DTO) for registering a new user.
 * 
 * This interface defines the structure for user registration, including fields such as 
 * the user's username, password, contact details, and referral information.
 * 
 * @interface registerUser
 * 
 * @property {string} username - The username chosen by the user for registration.
 * @property {string} password - The password chosen by the user.
 * @property {string} [number] - The optional phone number of the user.
 * @property {string} [email] - The optional email address of the user.
 * @property {true} confirmPassword - A flag to confirm that the password has been correctly entered.
 * @property {string} termAndCondition - The user's acceptance of the terms and conditions during registration.
 * @property {string} id - The unique identifier for the user.
 * @property {string} refeer_code - The referral code provided by the user or associated with the user.
 * @property {string} own_code - The unique code generated for the user, possibly used for tracking or identification.
 * @property {string} [secret] - An optional secret used for additional security or verification.
 */
export interface registerUser {
  username: string;
  password: string;
  number?: string;
  email?: string;
  confirmPassword: true;
  termAndCondition: string;
  id: string;
  refeer_code: string;
  own_code: string;
  secret?: string;
}
/**
 * Data Transfer Object (DTO) for user login.
 * 
 * This interface defines the structure for logging in a user, either by OTP or credentials 
 * such as email, phone number, and password.
 * 
 * @interface loginUser
 * 
 * @property {string | number} [otp] - The one-time password (OTP) sent for login verification (optional).
 * @property {string | number} [email] - The optional email address of the user for login.
 * @property {string | number} [number] - The optional phone number of the user for login.
 * @property {string | number} password - The password used to authenticate the user during login.
 */
export interface loginUser {
  otp?: string | number;
  email?: string;
  number?: string | number;
  password: string | number;
}

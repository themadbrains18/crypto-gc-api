/**
 * Data Transfer Object (DTO) for OTP (One Time Password) verification schema.
 * 
 * This interface defines the structure for storing OTP data used for user verification.
 * It contains information about the user's username, OTP token, and the OTP itself.
 * 
 * @interface otpSchema
 * 
 * @property {number | string} username - The username of the user requesting or validating the OTP. 
 *    It can be a number (e.g., user ID) or a string (e.g., email or phone number).
 * @property {string} token - The token generated for the OTP request. 
 *    This token is used to uniquely identify the OTP session.
 * @property {string | number} otp - The OTP (One-Time Password) value sent to the user for verification. 
 *    It can be either a string or a number.
 */
export interface otpSchema {
    username: number | string;
    token: string;
    otp: string | number;
}

/**
 * Data Transfer Object (DTO) for matching OTP data with stored data.
 * 
 * This interface is used to verify the user's OTP by matching it with the stored data.
 * It contains the username (or user identifier) and the OTP entered by the user.
 * 
 * @interface matchWithData
 * 
 * @property {number | string} username - The username or user identifier for the user verifying the OTP.
 *    It can be a number (e.g., user ID) or a string (e.g., email or phone number).
 * @property {string | number} otp - The OTP value entered by the user during verification. 
 *    It can be a string or a number.
 */
export interface matchWithData {
    username: number | string;
    otp: string | number;
}

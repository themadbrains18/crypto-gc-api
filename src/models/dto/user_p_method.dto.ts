/**
 * Data Transfer Object (DTO) for representing a user's payment method.
 * 
 * This interface defines the structure for a user's payment method, including details about 
 * the payment method, its status, and additional security information like OTP.
 * 
 * @interface userPaymentMethodDto
 * 
 * @property {string} [user_id] - The unique identifier of the user associated with the payment method.
 * @property {string} [pmid] - The unique identifier of the payment method.
 * @property {string} [status] - The status of the payment method (e.g., 'active', 'inactive').
 * @property {string} [pm_name] - The name of the payment method (e.g., 'PayPal', 'Bank Transfer').
 * @property {object} [pmObject] - Additional details or configuration related to the payment method.
 * @property {string} [otp] - The one-time password (OTP) for verification of the payment method.
 */
export default interface userPaymentMethodDto {
    user_id?: string;
    pmid?: string;
    status?: string;
    pm_name?: string;
    pmObject?: object;
    otp?: string;
}

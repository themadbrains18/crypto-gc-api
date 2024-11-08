/**
 * Data Transfer Object (DTO) for payment method information.
 * 
 * This interface defines the structure for storing payment method details, including
 * the payment method name, icon, region, status, and additional fields.
 * 
 * @interface paymentMethodDto
 * 
 * @property {string} [id] - An optional unique identifier for the payment method.
 * @property {string} [payment_method] - The name of the payment method (e.g., "PayPal", "Credit Card").
 * @property {string} [icon] - An optional URL or identifier for the payment method's icon.
 * @property {string} [region] - The region or country where the payment method is available (optional).
 * @property {boolean} [status] - The status indicating whether the payment method is active or inactive.
 * @property {object} [fields] - An optional object that can contain additional fields specific to the payment method.
 */
export default interface paymentMethodDto {
    id?: string;
    payment_method?: string;
    icon?: string;
    region?: string;
    status?: boolean;
    fields?: object;
}

/**
 * Data Transfer Object (DTO) for site maintenance information.
 * 
 * This interface defines the structure for maintaining the status of a website during scheduled maintenance,
 * including a title, a message, and the status of the site (whether it is down or not).
 * 
 * @interface siteMaintenanceDto
 * 
 * @property {string} [id] - The optional unique identifier for the site maintenance record.
 * @property {string} [title] - The optional title of the maintenance notice or message.
 * @property {string} [message] - The optional message providing more details about the maintenance.
 * @property {boolean} [down_status] - The optional flag indicating if the site is down (true) or up (false).
 */
export default interface siteMaintenanceDto {
    id?: string;
    title?: string;
    message?: string;
    down_status?: boolean;
}

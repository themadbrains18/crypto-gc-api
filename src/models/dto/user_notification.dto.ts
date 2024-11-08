/**
 * Data Transfer Object (DTO) for representing a user's notification.
 * 
 * This interface defines the structure for a notification sent to a user, including details about 
 * the notification's type, its status, and the message content.
 * 
 * @interface userNotificationDto
 * 
 * @property {string} user_id - The unique identifier of the user receiving the notification.
 * @property {string} type - The type of notification (e.g., 'info', 'alert', 'warning').
 * @property {boolean} status - The status of the notification, indicating whether it has been read or not.
 * @property {object} message - The message content of the notification. It can contain various fields such as text, metadata, etc.
 */
export interface userNotificationDto {
    user_id: string;
    type: string;
    status: boolean;
    message: object;
}

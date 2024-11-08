/**
 * Data Transfer Object (DTO) for user profile information.
 * 
 * This interface defines the structure for storing and transferring user profile details,
 * including personal information, display name, and profile image.
 * 
 * @interface profileDto
 * 
 * @property {string} [id] - The optional unique identifier for the profile.
 * @property {string} user_id - The unique identifier for the user associated with the profile.
 * @property {string} fName - The user's first name.
 * @property {string} lName - The user's last name.
 * @property {string} dName - The user's display name (e.g., nickname or alias).
 * @property {string} uName - The user's username used for login or identification.
 * @property {string} [image] - The optional URL or path to the user's profile image.
 */
export default interface profileDto {
    id?: string;
    user_id: string;
    fName: string;
    lName: string;
    dName: string;
    uName: string;
    image?: string;
  }
  
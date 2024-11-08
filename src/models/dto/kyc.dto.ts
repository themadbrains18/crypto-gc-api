/**
 * Data Transfer Object (DTO) for representing a user's Know Your Customer (KYC) information.
 * 
 * This interface defines the structure of a user's KYC details, including personal information, 
 * document details, and verification status.
 * 
 * @interface kycDto
 * 
 * @property {string} [id] - The unique identifier for the KYC record.
 * @property {string} userid - The unique identifier for the user who is submitting the KYC information.
 * @property {string} country - The country of the user.
 * @property {string} fname - The first name of the user.
 * @property {string} doctype - The type of document used for KYC (e.g., passport, ID card).
 * @property {string} docnumber - The document number (e.g., passport number, ID card number).
 * @property {string} idfront - The front image of the identification document.
 * @property {string} idback - The back image of the identification document (if applicable).
 * @property {string} statement - A statement or utility bill image proving the user's address.
 * @property {boolean} [isVerified] - The verification status of the KYC submission (optional).
 * @property {boolean} [isReject] - The rejection status of the KYC submission (optional).
 * @property {string} [destinationPath] - The destination path where the KYC documents are stored (optional).
 * @property {Date} dob - The date of birth of the user.
 */
export default interface kycDto {
  id?: string;
  userid: string;
  country: string;
  fname: string;
  doctype: string;
  docnumber: string;
  idfront: string;
  idback: string;
  statement: string;
  isVerified?: boolean;
  isReject?: boolean;
  destinationPath?: string;
  dob: Date;
}

/**
 * Data Transfer Object (DTO) for the user's watchlist.
 * 
 * This interface defines the structure for storing a user's watchlist, including 
 * the user's ID, the token they are watching, and the unique identifier for the watchlist entry.
 * 
 * @interface watchlistDto
 * 
 * @property {string} id - The unique identifier for the watchlist entry.
 * @property {string} user_id - The unique identifier of the user who owns the watchlist.
 * @property {string} token_id - The unique identifier of the token being watched.
 */
export default interface watchlistDto {
    id: string;
    user_id: string;
    token_id: string;
}

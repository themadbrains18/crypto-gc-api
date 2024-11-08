import profitLossDto from "../models/dto/profitloss.dto";
import profitLossDal from "../models/dal/profitLoss.dal";
import { profitLossOuput } from "../models/model/takeprofit_stoploss.model";

class profitLossServices {

  /**
     * Creates a new profit/loss position entry.
     * 
     * This method creates a new profit/loss position by taking the provided `profitLossDto` payload, 
     * which contains the details of the position (e.g., entry price, stop loss, take profit), 
     * and saves it to the database using the `profitLossDal` model.
     * 
     * @param {profitLossDto} payload - The data required to create a profit/loss position.
     * @returns {Promise<profitLossOuput>} The created profit/loss position details.
     */
    async create(payload: profitLossDto): Promise<profitLossOuput> {
        return await profitLossDal.createProfitLossPosition(payload)
    }

    /**
     * Retrieves all profit/loss positions for a specific user.
     * 
     * This method retrieves all the profit/loss positions for a user identified by their `used_id`.
     * It queries the `profitLossDal` model to fetch the positions and returns them as an array of 
     * `profitLossOuput` objects.
     * 
     * @param {string} used_id - The ID of the user whose profit/loss positions are being fetched.
     * @returns {Promise<profitLossOuput>} The list of all profit/loss positions for the user.
     */
    async all(used_id : string) : Promise<profitLossOuput>{
        return await profitLossDal.all(used_id);
    }

        /**
     * Closes a specific profit/loss position for a user.
     * 
     * This method closes a specific position by updating its status in the database, marking it 
     * as closed. It requires both the `position_id` (the identifier of the position) and the 
     * `used_id` (the ID of the user associated with the position). It uses the `profitLossDal` 
     * model to perform the action.
     * 
     * @param {string} position_id - The ID of the profit/loss position to be closed.
     * @param {string} used_id - The ID of the user who owns the position.
     * @returns {Promise<profitLossOuput>} The updated profit/loss position details after closure.
     */
    async close(position_id : string, used_id : string) : Promise<profitLossOuput>{
        return await profitLossDal.close(position_id, used_id);
    }

}

export default profitLossServices;


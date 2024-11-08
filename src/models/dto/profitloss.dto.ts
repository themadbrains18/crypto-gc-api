/**
 * Data Transfer Object (DTO) for profit and loss information of a trade position.
 * 
 * This interface defines the structure for tracking profit and loss values associated with a trade contract.
 * It includes information about the position, trigger profit/loss thresholds, and the actual profit/loss values.
 * 
 * @interface profitLossDto
 * 
 * @property {string} [id] - The optional unique identifier for the profit and loss record.
 * @property {string} [contract] - The optional contract associated with the position for tracking profits and losses.
 * @property {string} [position_id] - The optional unique identifier for the trade position.
 * @property {string} [user_id] - The optional unique identifier for the user associated with the position.
 * @property {string} [qty] - The optional quantity of the asset involved in the position.
 * @property {number} [trigger_profit] - The optional threshold (in terms of value) at which profit is triggered.
 * @property {number} [trigger_loss] - The optional threshold (in terms of value) at which loss is triggered.
 * @property {number} [profit_value] - The optional value representing the actual profit of the position.
 * @property {number} [loss_value] - The optional value representing the actual loss of the position.
 * @property {string} [trade_type] - The optional type of trade (e.g., spot, future) associated with the position.
 */
export default interface profitLossDto {
    id?: string;
    contract?: string;
    position_id?: string;
    user_id?: string;
    qty?: string;
    trigger_profit?: number;
    trigger_loss?: number;
    profit_value?: number;
    loss_value?: number;
    trade_type?: string;
  }
  
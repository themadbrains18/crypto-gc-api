import Joi from "joi";

/**
 * Validation schemas for network-related operations.
 * @typedef {Object} networkSchema
 */
const networkSchema = {

  /**
   * Schema for creating a new network.
   * @property {string} symbol - Required. The symbol representing the network (e.g., 'ETH', 'SOL').
   * @property {string} fullname - Required. The full name of the network (e.g., 'Ethereum', 'Solana').
   * @property {string} network - Required. The type of network, either 'mainnet' or 'testnet'.
   * @property {string} user_id - Required. The unique identifier of the user creating the network.
   * @property {number} [chainId] - Optional. The chain ID of the network, must be a positive number less than 1000.
   * @property {string} walletSupport - Required. The supported wallet types (e.g., 'sol', 'tron', 'eth').
   * @property {string} BlockExplorerURL - Required. The URL of the block explorer for the network.
   * @property {string} rpcUrl - Required. The RPC URL for the network.
   */
  create: Joi.object().keys({
    symbol: Joi.string().uppercase().min(3).max(10).required(),
    fullname: Joi.string().uppercase().min(3).max(70).required(),
    network: Joi.string().valid('mainnet', 'testnet').required(),
    user_id: Joi.string().required(),
    chainId: Joi.number().positive().greater(0).less(1000).optional(),
    walletSupport: Joi.string().valid('sol', 'tron', 'eth').required(),
    BlockExplorerURL: Joi.string().uri().required(),
    rpcUrl: Joi.string().uri().required(),
  }),

  /**
   * Schema for listing blog posts related to the network.
   * @property {number} page - Required. The page number for pagination.
   * @property {number} pageSize - Required. The number of items per page.
   */
  blogLIST: {
    page: Joi.number().required(),
    pageSize: Joi.number().required(),
  },
};

export default networkSchema;

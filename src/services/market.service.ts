import { assetModel, globalTokensModel, tokensModel } from "../models";
import marketDal from "../models/dal/market.dal";
import assetsDto from "../models/dto/assets.dto";
import { marketDto } from "../models/dto/market.dto";
import marketOrderHistoryModel, { marketOrderHistoryInput } from "../models/model/marketOrderHistory.model";
import marketOrderModel, { marketOrderOuput } from "../models/model/marketorder.model";
import { assetsAccountType, assetsWalletType, marektTypeEnum, marketCancel, marketOrderEnum, marketPartialExecution, tokenTypeEnum } from "../utils/interface";
import { preciseSubtraction, truncateNumber } from "../utils/utility";
import service from "./service";

interface buyerExecution {
    buyerObj: any;
    sellerObj: any;
    paid_usdt: number;
    remainingAssets: number;
    paid_to_admin: number;
    sellerFees: number;
    buyerFees: number
}

export const scientificToDecimal = (value: number): string => {
    return value.toFixed(10).replace(/\.?0+$/, ""); // Convert to decimal format, trimming unnecessary zeros
};

class marketService {

    /**
    * Creates a new market order.
    * 
    * This method creates a market order using the provided payload. The payload contains information
    * necessary to place an order in the market.
    * 
    * @param {marketDto} payload - The data transfer object that holds the market order details.
    * @returns {Promise<marketOrderOuput>} A promise that resolves to the created market order output.
    * @throws {Error} Throws an error if the creation fails.
    */
    async create(payload: marketDto): Promise<marketOrderOuput | any> {
        return await marketDal.create(payload);
    }

    /**
    * Retrieves a list of market orders by user ID.
    * 
    * This method fetches all market orders related to a specific user. The orders will include details
    * based on the user ID provided.
    * 
    * @param {string} userid - The ID of the user whose market orders are to be fetched.
    * @returns {Promise<marketOrderOuput>} A promise that resolves to a list of market orders for the user.
    * @throws {Error} Throws an error if fetching the orders fails.
    */
    async getList(userid: string): Promise<marketOrderOuput | any> {
        return await marketDal.getOrderList(userid);
    }


    /**
     * Retrieves a list of market orders for a specific user with pagination and filtering.
     * 
     * This method retrieves a limited number of market orders for a user, with pagination support. 
     * It also allows filtering by currency and date.
     * 
     * @param {string} userid - The ID of the user whose market orders are to be fetched.
     * @param {string} offset - The offset to start fetching the orders.
     * @param {string} limit - The number of orders to fetch.
     * @param {string} currency - The currency to filter orders by.
     * @param {string} date - The date filter for the orders.
     * @returns {Promise<marketOrderOuput>} A promise that resolves to the list of market orders with pagination.
     * @throws {Error} Throws an error if fetching the orders fails.
     */
    async getListByLimit(userid: string, offset: string, limit: string, currency: string, date: string): Promise<marketOrderOuput | any> {
        return await marketDal.getOrderListByLimit(userid, offset, limit, currency, date);
    }
    /**
     * Retrieves a list of all market orders.
     * 
     * This method fetches all the market orders in the system without any filters or pagination.
     * 
     * @returns {Promise<marketOrderOuput>} A promise that resolves to the list of all market orders.
     * @throws {Error} Throws an error if fetching the orders fails.
     */
    async getAllMarketOrder(): Promise<marketOrderOuput | any> {
        return await marketDal.getMarketOrderList();
    }
    /**
     * Retrieves a list of all market orders with pagination.
     * 
     * This method fetches a limited number of market orders with pagination support.
     * 
     * @param {string} offset - The offset to start fetching the orders.
     * @param {string} limit - The number of orders to fetch.
     * @returns {Promise<marketOrderOuput>} A promise that resolves to the list of market orders with pagination.
     * @throws {Error} Throws an error if fetching the orders fails.
     */
    async getAllMarketOrderByLimit(offset: string, limit: string): Promise<marketOrderOuput | any> {
        return await marketDal.getMarketOrderListByLimit(offset, limit);
    }

    /**
    * Retrieves a market order by its unique ID.
    * 
    * This method fetches a specific market order from the database based on the provided `order_id`.
    * 
    * @param {string} order_id - The unique identifier for the market order.
    * @returns {Promise<marketOrderOuput>} A promise that resolves to the market order found.
    * @throws {Error} Throws an error if the order retrieval fails.
    */
    async getMarketOrderById(order_id: string): Promise<marketOrderOuput | any> {
        try {
            let order = await marketOrderModel.findOne({ where: { id: order_id }, raw: true });

            return order;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    /**
    * Cancels a market order.
    * 
    * This method triggers the cancellation of a market order, typically by calling the market DAL's cancel method.
    * 
    * @param {marketCancel} payload - The data needed to cancel the order, including the order details.
    * @returns {Promise<marketOrderOuput>} A promise that resolves to the result of the cancellation operation.
    * @throws {Error} Throws an error if the cancellation fails.
    */
    async cancelOrder(payload: marketCancel): Promise<marketOrderOuput | any> {
        return await marketDal.cancelOrder(payload);
    }

    /**
     * Retrieves a list of market orders filtered by token ID.
     * 
     * This method fetches market orders for a given token ID.
     * 
     * @param {string} token_id - The unique identifier for the token whose market orders are to be fetched.
     * @returns {Promise<marketOrderOuput>} A promise that resolves to the list of market orders for the given token ID.
     * @throws {Error} Throws an error if the orders retrieval fails.
     */
    async getListByTokenId(token_id: string): Promise<marketOrderOuput | any> {
        return await marketDal.getOrderListByTokenId(token_id);
    }

    /**
     * Retrieves market orders by token ID and user ID.
     * 
     * This method fetches market orders that belong to a specific user for a given token.
     * 
     * @param {string} token_id - The unique identifier for the token.
     * @param {string} user_id - The ID of the user whose market orders are to be fetched.
     * @returns {Promise<marketOrderModel>} A promise that resolves to the list of market orders for the user and token.
     * @throws {Error} Throws an error if fetching the orders fails.
     */
    async getOrderListByTokenIdUserId(token_id: string, user_id: string): Promise<marketOrderModel | any> {
        return marketDal.getOrderListByTokenIdUserId(token_id, user_id);
    }

    /**
     * Retrieves the order history for a specific token ID and user ID.
     * 
     * This method fetches the order history of a user for a specific token.
     * 
     * @param {string} token_id - The unique identifier for the token.
     * @param {string} user_id - The ID of the user whose order history is to be fetched.
     * @returns {Promise<marketOrderModel>} A promise that resolves to the order history for the user and token.
     * @throws {Error} Throws an error if fetching the order history fails.
     */
    async getOrderHistoryByTokenIdUserId(token_id: string, user_id: string): Promise<marketOrderModel | any> {
        return marketDal.getOrderHistoryByTokenIdUserId(token_id, user_id);
    }
    /**
     * Retrieves the global price for a token symbol.
     * 
     * This method fetches the price of a specific cryptocurrency symbol (like Bitcoin or Ethereum) in USDT
     * from the CryptoCompare API.
     * 
     * @param {string} symbol - The symbol of the cryptocurrency (e.g., "BTC", "ETH").
     * @returns {Promise<any>} A promise that resolves to the price object fetched from CryptoCompare.
     * @throws {Error} Throws an error if the API request fails.
     */
    async getGlobalTokenPrice(symbol: string): Promise<any> {
        try {
            let priceObj = await fetch('https://min-api.cryptocompare.com/data/pricemultifull?fsyms=' + symbol + '&tsyms=USDT&api_key=' + process.env.MIN_API_KEY).then(response =>
                response.json()
            ).then(result => { return result; })
                .catch(console.error);
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    /**
    * Executes a partial market order (e.g., partial buy/sell).
    * 
    * This method processes a partial order for a market transaction (e.g., a partial buy or sell),
    * utilizing the socket connection for real-time buy/sell actions.
    * 
    * @param {marketPartialExecution} payload - The details of the partial order to be executed.
    * @returns {Promise<any>} A promise that resolves to the result of the partial order execution.
    * @throws {Error} Throws an error if the partial order fails.
    */
    async marketPartialOrder(payload: marketPartialExecution): Promise<any> {
        return await marketDal.socketMarketBuySell(payload);
    }

    /**
     * Executes buy or sell orders on a limit-based market.
     * 
     * This function checks the order type in the provided `payload` and processes
     * either the buyer or seller side of the transaction. It calls the respective
     * buyer or seller execution function (`buyerCode` or `sellerCode`).
     * 
     * @param {marketPartialExecution} payload - The order details, including the 
     *        order type, user ID, and token information.
     * @returns {Promise<any>} Resolves when the order execution process is completed.
     * @throws {Error} If an error occurs during the order execution process.
     */
    async buySellOnLimit(payload: marketPartialExecution): Promise<any> {
        try {
            if (payload.order_type === marketOrderEnum.buy) {
                await this.buyerCode(payload);
            }
            if (payload.order_type === marketOrderEnum.sell) {
                await this.sellerCode(payload);
            }
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    /**
     * Handles the execution of a buy order in a limit-based market.
     * 
     * This function finds the matching sell orders for a given buy order. It processes
     * partial order execution and updates the order statuses accordingly. The function
     * also handles the calculation of fees, transaction history, and admin profits.
     * 
     * @param {marketPartialExecution} payload - The order details for the buy side.
     * @returns {Promise<any>} Resolves when the buy-side execution is complete.
     * @throws {Error} If no matching sell orders are found or an error occurs.
     */
    async buyerCode(payload: marketPartialExecution): Promise<any> {
        try {
            let previous_seller: any = [];
            let buyBids = await marketOrderModel.findAll({ where: { status: false, isCanceled: false, user_id: payload?.user_id, token_id: payload?.token_id, order_type: marketOrderEnum.buy, market_type: marektTypeEnum.limit, queue: false }, order: [['createdAt', "DESC"]] });
            // if buyer not exist than return
            if (buyBids == null || buyBids.length == 0) {
                throw new Error('No any buyer bids found');
            }
            let sellBids = await marketOrderModel.findAll({ where: { status: false, isCanceled: false, token_id: payload?.token_id, order_type: marketOrderEnum.sell, market_type: marektTypeEnum.limit, queue: false }, order: [['createdAt', "DESC"]] })
            // if seller not exist than return
            if (sellBids == null || sellBids.length == 0) {
                throw new Error('No any seller bids found');
            }
            //=====================================================//
            //=================Partial execution===================//
            //=====================================================//
            for await (const buyer of buyBids) {
                let buyerObj = buyer?.dataValues;
                // find previous ids if seller already sell assets
                if (previous_seller.length > 0) {
                    sellBids = sellBids.filter((item) => {
                        if (!previous_seller.includes(item?.dataValues?.id))
                            return item;
                    })
                }
                let remainingAssets = buyerObj.token_amount;
                let paid_usdt = 0;
                let is_fee_remove = false;
                for await (const seller of sellBids) {
                    // seller add in queue
                    let sellerObj = seller?.dataValues;
                    previous_seller.push(sellerObj.id);
                    if (buyerObj.token_id === sellerObj.token_id && buyerObj?.limit_usdt >= sellerObj.limit_usdt) {
                        // Both seller and buyer qty bid same 
                        if (sellerObj.token_amount === remainingAssets) {
                            await marketOrderModel.update({ queue: true }, { where: { id: buyerObj.id } });
                            await marketOrderModel.update({ queue: true }, { where: { id: sellerObj.id } });
                            paid_usdt = truncateNumber((sellerObj.limit_usdt * sellerObj.token_amount), 8);
                            let paid_to_admin = truncateNumber(((buyerObj.limit_usdt * sellerObj.token_amount) - paid_usdt), 8);
                            if (paid_to_admin > 0) {
                                //======================================================
                                //=============Create admin profit======================
                                //======================================================
                                await marketDal.createAdminProfit(buyerObj, paid_usdt, paid_to_admin, sellerObj.user_id, 0, 'USDT', 'Spot Trading');
                            }
                            //======================================================
                            //=============Buyer and seller asset execution=========
                            //======================================================
                            // console.log('========Seller qty bid same as buyer qty bid===============');
                            // console.log(preciseSubtraction(sellerObj.token_amount, remainingAssets), "=======remainingAssets buyer 1=======", remainingAssets, sellerObj.token_amount);
                            let buyerFees: any = remainingAssets * 0.001;
                            buyerFees = scientificToDecimal(Number(truncateNumber(buyerFees.toFixed(12), 8)));
                            let sellerFees: any = (sellerObj.token_amount * sellerObj.limit_usdt * 0.001);
                            sellerFees = scientificToDecimal(Number(truncateNumber(sellerFees.toFixed(12), 8)));
                            // console.log(buyerFees, '========buyerFees=======', sellerFees, '===========sellerFees===========');

                            await this.processBuyerExecution({ buyerObj, sellerObj, paid_usdt, sellerFees, buyerFees, remainingAssets, paid_to_admin });
                            //======================================================
                            //=============Create buyer market order history========
                            //======================================================
                            await marketDal.createMarketOrderHistory(buyerObj, sellerObj.token_amount, paid_usdt, buyerFees);
                            //======================================================
                            //=============Create seller market order history=======
                            //======================================================
                            await marketDal.createMarketOrderHistory(sellerObj, sellerObj.token_amount, paid_usdt, sellerFees);
                            break;
                        }

                        // Seller qty bid more than buyer qty bid
                        else if (sellerObj.token_amount > remainingAssets) {
                            await marketOrderModel.update({ queue: true }, { where: { id: buyerObj.id } });
                            await marketOrderModel.update({ queue: true }, { where: { id: sellerObj.id } });
                            paid_usdt = truncateNumber((sellerObj.limit_usdt * remainingAssets), 8);
                            let paid_to_admin = truncateNumber(((buyerObj.limit_usdt * remainingAssets) - paid_usdt), 8);
                            if (paid_to_admin > 0) {
                                //======================================================
                                //=============Create admin profit======================
                                //======================================================
                                await marketDal.createAdminProfit(buyerObj, paid_usdt, paid_to_admin, sellerObj.user_id, 0, 'USDT', 'Spot Trading');
                            }
                            //======================================================
                            //=============Buyer and seller asset execution=========
                            //======================================================
                            // console.log('========Seller qty bid more than buyer qty bid===============');
                            // console.log(preciseSubtraction(sellerObj.token_amount, remainingAssets), "=======remainingAssets buyer 2=======", remainingAssets, sellerObj.token_amount);
                            let buyerFees: any = remainingAssets * 0.001;
                            buyerFees = scientificToDecimal(Number(truncateNumber(buyerFees.toFixed(12), 8)));
                            let sellerFees: any = ((remainingAssets) * sellerObj.limit_usdt * 0.001);
                            sellerFees = scientificToDecimal(Number(truncateNumber(sellerFees.toFixed(12), 8)));
                            // console.log(buyerFees, '========buyerFees=======', sellerFees, '===========sellerFees===========');

                            await this.processBuyerExecution({ buyerObj, sellerObj, paid_usdt, sellerFees, buyerFees, remainingAssets, paid_to_admin });
                            //======================================================
                            //=============Create buyer market order history========
                            //======================================================
                            await marketDal.createMarketOrderHistory(buyerObj, remainingAssets, paid_usdt, buyerFees);
                            //======================================================
                            //=============Create seller market order history=======
                            //======================================================
                            await marketDal.createMarketOrderHistory(sellerObj, remainingAssets, paid_usdt, sellerFees);
                            break;
                        }

                        // Seller qty bid less than buyer qty bid
                        if (remainingAssets > sellerObj.token_amount) {
                            await marketOrderModel.update({ queue: true }, { where: { id: buyerObj.id } });
                            await marketOrderModel.update({ queue: true }, { where: { id: sellerObj.id } });
                            paid_usdt = truncateNumber(sellerObj.limit_usdt * sellerObj.token_amount, 8);
                            let paid_to_admin = truncateNumber(((buyerObj.limit_usdt * sellerObj.token_amount) - paid_usdt), 8);
                            if (paid_to_admin > 0) {
                                //======================================================
                                //=============Create admin profit======================
                                //======================================================
                                await marketDal.createAdminProfit(buyerObj, paid_usdt, paid_to_admin, sellerObj.user_id, 0, 'USDT', 'Spot Trading');
                            }
                            //======================================================
                            //=============Buyer and seller asset execution=========
                            //======================================================
                            // console.log('========Seller qty bid less than buyer qty bid===============');
                            // console.log(preciseSubtraction(remainingAssets, sellerObj.token_amount), "=======remainingAssets buyer 3=======", remainingAssets, sellerObj.token_amount);
                            let buyerFees: any = sellerObj.token_amount * 0.001;
                            buyerFees = scientificToDecimal(Number(truncateNumber(buyerFees.toFixed(12), 8)));
                            let sellerFees: any = (sellerObj.token_amount * sellerObj.limit_usdt * 0.001);
                            sellerFees = scientificToDecimal(Number(truncateNumber(sellerFees.toFixed(12), 8)));
                            // console.log(buyerFees, '========buyerFees=======', sellerFees, '===========sellerFees===========');
                            await this.processBuyerExecution({ buyerObj, sellerObj, paid_usdt, sellerFees, buyerFees, remainingAssets, paid_to_admin });
                            remainingAssets = preciseSubtraction(remainingAssets, sellerObj.token_amount);// Number((remainingAssets - sellerObj.token_amount).toPrecision(1));
                            //======================================================
                            //=============Create buyer market order history========
                            //======================================================
                            await marketDal.createMarketOrderHistory(buyerObj, sellerObj.token_amount, paid_usdt, buyerFees);
                            //======================================================
                            //=============Create seller market order history=======
                            //======================================================
                            await marketDal.createMarketOrderHistory(sellerObj, sellerObj.token_amount, paid_usdt, sellerFees);
                        }
                    }
                }
            }

        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    /**
     * Processes the execution of the buy and sell transactions, updating the buyer and seller's asset balances.
     * 
     * This function checks the status of both the buyer's and seller's market orders, updates their respective balances,
     * performs fee deductions, and creates necessary admin profits. It also handles scenarios where the buyer or seller
     * does not have sufficient funds or assets and creates new asset records accordingly.
     * 
     * @param {buyerExecution} options - The details of the buyer and seller, including their order information,
     *        token amounts, and fees.
     * @param {object} options.buyerObj - The buyer's order details.
     * @param {object} options.sellerObj - The seller's order details.
     * @param {number} options.remainingAssets - The remaining assets the buyer wants to purchase.
     * @param {number} options.paid_usdt - The amount of USDT paid to the seller.
     * @param {number} options.sellerFees - The fee deducted from the seller's balance.
     * @param {number} options.buyerFees - The fee deducted from the buyer's balance.
     * @param {function} service.assets.getUserAssetByTokenIdandWallet - Function to get user's asset data by token.
     * @returns {Promise<void>} Resolves once the transaction is processed and the orders are updated.
     * @throws {Error} If any error occurs during the transaction processing.
     */
    async processBuyerExecution(options: buyerExecution) {
        try {
            let sellerusdtmarket = await this.getMarketOrderById(options.sellerObj.id);
            if (sellerusdtmarket.status === false || sellerusdtmarket.status === 0) {
                let tokensData = await tokensModel.findOne({ where: { symbol: 'USDT' }, raw: true });
                let token: any = tokensData;
                if (token === null) {
                    tokensData = await globalTokensModel.findOne({ where: { symbol: 'USDT' }, raw: true });
                    token = tokensData;
                }
                let asset = await service.assets.getUserAssetByTokenIdandWallet({ user_id: options.sellerObj.user_id, token_id: token?.id });
                if (asset) {
                    let updatedBal: any = truncateNumber(Number(parseFloat(asset.balance) + options.paid_usdt), 8);
                    // =========================================================//
                    // ================Fee Deduction from seller=================//
                    // =========================================================//
                    // updatedBal = truncateNumber(Number(updatedBal - options?.sellerFees), 8);
                    updatedBal = preciseSubtraction(updatedBal, options?.sellerFees, 10);
                    await marketDal.createAdminProfit(options?.buyerObj, 0, 0, options?.sellerObj.user_id, options?.sellerFees, 'USDT', 'Spot Trading');
                    await assetModel.update({ balance: updatedBal }, { where: { id: asset.id } });
                }
                else {
                    // =========================================================//
                    // ================Fee Deduction from seller=================//
                    // =========================================================//
                    options.paid_usdt = truncateNumber(Number(options.paid_usdt - options?.sellerFees), 8);
                    await marketDal.createAdminProfit(options?.buyerObj, 0, 0, options?.sellerObj.user_id, options?.sellerFees, 'USDT', 'Spot Trading');
                    let assets: assetsDto = {
                        walletTtype: assetsWalletType.main_wallet,
                        balance: options.paid_usdt,
                        account_type: assetsAccountType.main_account,
                        token_id: token?.id,
                        user_id: options.sellerObj.user_id
                    };
                    await assetModel.create(assets);
                }
            }
            // console.log('=============seller=====================');

            let buyerusdtmarket = await this.getMarketOrderById(options.buyerObj.id);
            let token: any = await tokensModel.findOne({ where: { id: options?.buyerObj?.token_id }, raw: true });
            if (token === null) {
                token = await globalTokensModel.findOne({ where: { id: options?.buyerObj?.token_id }, raw: true });
            }
            if (buyerusdtmarket?.status === false || buyerusdtmarket?.status === 0) {
                let buyerasset = await service.assets.getUserAssetByTokenIdandWallet({ user_id: options.buyerObj.user_id, token_id: options.buyerObj.token_id });
                if (buyerasset) {
                    let updatedBal: any = truncateNumber(Number(parseFloat(buyerasset.balance) + options.remainingAssets), 8);
                    let realAmount = options.remainingAssets;
                    if (options.remainingAssets > options.sellerObj.token_amount) {
                        updatedBal = parseFloat(buyerasset.balance) + parseFloat(options.sellerObj.token_amount);
                        realAmount = parseFloat(options.sellerObj.token_amount);
                    }
                    // =========================================================//
                    // ================Fee Deduction from buyer=================//
                    // =========================================================//
                    // updatedBal = truncateNumber(Number(updatedBal - options?.buyerFees), 8);
                    updatedBal = preciseSubtraction(updatedBal, options?.buyerFees, 10);
                    await marketDal.createAdminProfit(options?.buyerObj, 0, 0, options?.sellerObj.user_id, options?.buyerFees, token?.symbol, 'Spot Trading');
                    await assetModel.update({ balance: updatedBal }, { where: { id: buyerasset.id } });
                }
                else {
                    let realAmount: any = options.remainingAssets;
                    if (options.remainingAssets > parseFloat(options.sellerObj.token_amount)) {
                        realAmount = parseFloat(options.sellerObj.token_amount);
                    }
                    realAmount = truncateNumber(Number(realAmount - options?.buyerFees), 8);
                    await marketDal.createAdminProfit(options?.buyerObj, 0, 0, options?.sellerObj.user_id, options?.buyerFees, token?.symbol, 'Spot Trading');
                    let assets: assetsDto = {
                        walletTtype: assetsWalletType.main_wallet,
                        balance: realAmount,
                        account_type: assetsAccountType.main_account,
                        token_id: options.buyerObj.token_id,
                        user_id: options.buyerObj.user_id
                    };
                    await assetModel.create(assets);
                }
            }
            //======================================================
            //============= update market order status =============
            //======================================================
            await this.updateBuyerOrderStatus(options);
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    /**
     * Updates the buyer and seller market order statuses after the transaction has been processed.
     * 
     * This function checks the remaining assets and updates the status of the buyer and seller orders.
     * It ensures that the transaction is completed by either fully or partially matching the buy and sell
     * orders, and updates the order statuses accordingly.
     * 
     * @param {buyerExecution} options - The details of the buyer and seller, including the remaining assets and
     *        their order information.
     * @param {object} options.buyerObj - The buyer's order details.
     * @param {object} options.sellerObj - The seller's order details.
     * @param {number} options.remainingAssets - The remaining assets the buyer is trying to purchase.
     * @param {number} options.paid_usdt - The amount of USDT paid to the seller.
     * @param {function} preciseSubtraction - Function to perform accurate subtraction for balance calculations.
     * @returns {Promise<void>} Resolves once the market orders are updated.
     * @throws {Error} If an error occurs during order status update.
     */
    async updateBuyerOrderStatus(options: buyerExecution) {
        try {
            let sellerOrder = await this.getMarketOrderById(options.sellerObj.id);
            let buyerOrder = await this.getMarketOrderById(options.buyerObj.id);
            if (options.remainingAssets === parseFloat(options.sellerObj.token_amount)) {
                if (sellerOrder) {
                    await marketOrderModel.update({ status: true }, { where: { id: sellerOrder.id } });
                }
                if (buyerOrder) {
                    await marketOrderModel.update({ status: true }, { where: { id: buyerOrder.id } });
                }
            }
            else if (options.remainingAssets > parseFloat(options.sellerObj.token_amount)) {
                if (buyerOrder) {
                    const buyer_amount = preciseSubtraction(options.remainingAssets, parseFloat(options.sellerObj.token_amount)); //Number((options.remainingAssets - parseFloat(options.sellerObj.token_amount)).toPrecision(1));
                    await marketOrderModel.update({
                        volume_usdt: preciseSubtraction(buyerOrder.volume_usdt, (options.paid_usdt + options.paid_to_admin)), //Number((parseFloat(buyerOrder.volume_usdt) - (options.paid_usdt + options.paid_to_admin)).toPrecision(1)),
                        token_amount: buyer_amount, queue: false
                    }, { where: { id: buyerOrder.id } });
                }
                if (sellerOrder) {
                    await marketOrderModel.update({ status: true }, { where: { id: sellerOrder.id } });
                }
            }
            else if (options.sellerObj.token_amount > options.remainingAssets) {
                if (sellerOrder) {
                    let sellerStatus = false;
                    let remainingAmount = preciseSubtraction(sellerOrder.token_amount, options.remainingAssets); //Number(sellerOrder.token_amount - options.remainingAssets);
                    let volume_usdt = preciseSubtraction(sellerOrder.volume_usdt, options.paid_usdt); //Number((parseFloat(sellerOrder.volume_usdt) - options.paid_usdt).toPrecision(1));
                    if (remainingAmount === 0 || remainingAmount < 0 || volume_usdt < 0) {
                        sellerStatus = true;
                        remainingAmount = 0;
                        volume_usdt = 0;
                    }
                    await marketOrderModel.update({
                        status: sellerStatus, token_amount: remainingAmount,
                        volume_usdt: volume_usdt, queue: false
                    }, { where: { id: sellerOrder.id } });
                }
                if (buyerOrder) {
                    await marketOrderModel.update({ status: true }, { where: { id: buyerOrder.id } });
                }
            }

        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    /**
     * Handles the execution of a seller's market order by matching them with available buyers.
     * Processes matching orders, updates market order status, and manages the exchange of assets.
     *
     * @param {marketPartialExecution} payload - The details of the seller's market order.
     * @returns {Promise<any>} - A promise that resolves when the seller's market order is processed successfully.
     * @throws {Error} - Throws an error if no matching buyer or seller orders are found.
     */
    async sellerCode(payload: marketPartialExecution): Promise<any> {
        try {
            let previous_buyer: any = [];
            // if buyer not exist than return
            let buyBids = await marketOrderModel.findAll({ where: { status: false, isCanceled: false, token_id: payload?.token_id, order_type: marketOrderEnum.buy, market_type: marektTypeEnum.limit, queue: false }, order: [['createdAt', "DESC"]] })
            if (buyBids == null || buyBids.length == 0) {
                throw new Error('No any buyer bids found');
            }
            // if seller not exist than return
            let sellBids = await marketOrderModel.findAll({ where: { status: false, isCanceled: false, user_id: payload?.user_id, token_id: payload?.token_id, order_type: marketOrderEnum.sell, market_type: marektTypeEnum.limit, queue: false }, order: [['createdAt', "DESC"]] })
            if (sellBids == null || sellBids.length == 0) {
                throw new Error('No any seller bids found');
            }
            for await (const seller of sellBids) {
                let sellerObj = seller?.dataValues;
                if (previous_buyer.length > 0) {
                    buyBids = buyBids.filter((item) => {
                        if (!previous_buyer.includes(item?.dataValues.id))
                            return item;
                    })
                }
                let remainingAssets = sellerObj.token_amount;
                let paid_usdt = 0;
                for await (const buyer of buyBids) {
                    let buyerObj = buyer?.dataValues;
                    previous_buyer.push(buyerObj.id);
                    if (buyerObj.token_id === sellerObj.token_id && (buyerObj.limit_usdt >= sellerObj.limit_usdt)) {
                        if (buyerObj.token_amount === remainingAssets) {
                            await marketOrderModel.update({ queue: true }, { where: { id: sellerObj.id } })
                            await marketOrderModel.update({ queue: true }, { where: { id: buyerObj.id } })
                            paid_usdt = truncateNumber((sellerObj.limit_usdt * remainingAssets), 8);
                            let paid_to_admin = truncateNumber(((buyerObj.limit_usdt * remainingAssets) - paid_usdt), 8);
                            if (paid_to_admin > 0) {
                                //======================================================
                                //=============Create admin profit======================
                                //======================================================
                                await marketDal.createAdminProfit(buyerObj, paid_usdt, paid_to_admin, sellerObj.user_id, 0, 'USDT', 'Spot Trading');
                            }
                            //======================================================
                            //=============Buyer and seller asset execution=========
                            //======================================================
                            // console.log('========Seller qty bid same as buyer qty bid===============');
                            // console.log(preciseSubtraction(buyerObj.token_amount, remainingAssets), "=======remainingAssets buyer 1=======", `${remainingAssets}  seller amount`, `${buyerObj.token_amount} buyer amount`);
                            let buyerFees: any = buyerObj.token_amount * 0.001;
                            buyerFees = scientificToDecimal(Number(truncateNumber(buyerFees.toFixed(12), 8)));
                            let sellerFees: any = (remainingAssets * sellerObj.limit_usdt * 0.001);
                            sellerFees = scientificToDecimal(Number(truncateNumber(sellerFees.toFixed(12), 8)));
                            // console.log(buyerFees, '========buyerFees=======', sellerFees, '===========sellerFees===========');
                            await this.processSellerExecution({ buyerObj, sellerObj, paid_usdt, sellerFees, buyerFees, remainingAssets, paid_to_admin });
                            //======================================================
                            //=============Create buyer market order history========
                            //======================================================
                            await marketDal.createMarketOrderHistory(buyerObj, buyerObj.token_amount, paid_usdt, buyerFees);
                            //======================================================
                            //=============Create seller market order history=======
                            //======================================================
                            await marketDal.createMarketOrderHistory(sellerObj, remainingAssets, paid_usdt, sellerFees);
                            break;
                        }
                        else if (buyerObj.token_amount > remainingAssets) {
                            await marketOrderModel.update({ queue: true }, { where: { id: sellerObj.id } })
                            await marketOrderModel.update({ queue: true }, { where: { id: buyerObj.id } })
                            paid_usdt = truncateNumber((sellerObj.limit_usdt * remainingAssets), 8);
                            let paid_to_admin = truncateNumber(((buyerObj.limit_usdt * remainingAssets) - paid_usdt), 8);
                            if (paid_to_admin > 0) {
                                //======================================================
                                //=============Create admin profit======================
                                //======================================================
                                await marketDal.createAdminProfit(buyerObj, paid_usdt, paid_to_admin, sellerObj.user_id, 0, 'USDT', 'Spot Trading');
                            }
                            //======================================================
                            //=============Buyer and seller asset execution=========
                            //======================================================
                            // console.log('========Buyer qty bid more than Seller qty bid===============');
                            // console.log(preciseSubtraction(buyerObj.token_amount, remainingAssets), "=======remainingAssets buyer 2=======", `${remainingAssets} seller amount`, `${buyerObj.token_amount} buyer amount`);
                            let buyerFees: any = remainingAssets * 0.001;
                            buyerFees = scientificToDecimal(Number(truncateNumber(buyerFees.toFixed(12), 8)));
                            let sellerFees: any = ((remainingAssets) * sellerObj.limit_usdt * 0.001);
                            sellerFees = scientificToDecimal(Number(truncateNumber(sellerFees.toFixed(12), 8)));
                            // console.log(buyerFees, '========buyerFees=======', sellerFees, '===========sellerFees===========');
                            await this.processSellerExecution({ buyerObj, sellerObj, paid_usdt, sellerFees, buyerFees, remainingAssets, paid_to_admin });
                            //======================================================
                            //=============Create buyer market order history========
                            //======================================================
                            await marketDal.createMarketOrderHistory(buyerObj, remainingAssets, paid_usdt, buyerFees);
                            //=====================================================
                            //=============Create seller market order history=======
                            //======================================================
                            await marketDal.createMarketOrderHistory(sellerObj, remainingAssets, paid_usdt, sellerFees);
                            break;
                        }
                        if (remainingAssets > buyerObj.token_amount) {
                            await marketOrderModel.update({ queue: true }, { where: { id: sellerObj.id } })
                            await marketOrderModel.update({ queue: true }, { where: { id: buyerObj.id } })
                            paid_usdt = Number(truncateNumber((sellerObj.limit_usdt * buyerObj.token_amount), 8));
                            let paid_to_admin = truncateNumber(((buyerObj.limit_usdt * buyerObj.token_amount) - paid_usdt), 8);
                            if (paid_to_admin > 0) {
                                //======================================================
                                //=============Create admin profit======================
                                //======================================================
                                await marketDal.createAdminProfit(buyerObj, paid_usdt, paid_to_admin, sellerObj.user_id, 0, 'USDT', 'Spot Trading');
                            }
                            //======================================================
                            //=============Buyer and seller asset execution=========
                            //======================================================
                            // console.log('========Buyer qty bid less than Seller qty bid===============');
                            // console.log(preciseSubtraction(remainingAssets, buyerObj.token_amount), "=======remainingAssets buyer 3=======", `${remainingAssets} seller amount`, `${buyerObj.token_amount} buyer amount`);
                            let buyerFees: any = buyerObj.token_amount * 0.001;
                            buyerFees = scientificToDecimal(Number(truncateNumber(buyerFees.toFixed(12), 8)));
                            let sellerFees: any = (buyerObj.token_amount * sellerObj.limit_usdt * 0.001);
                            sellerFees = scientificToDecimal(Number(truncateNumber(sellerFees.toFixed(12), 8)));
                            // console.log(buyerFees, '========buyerFees=======', sellerFees, '===========sellerFees===========');
                            await this.processSellerExecution({ buyerObj, sellerObj, paid_usdt, sellerFees, buyerFees, remainingAssets, paid_to_admin });
                            remainingAssets = preciseSubtraction(remainingAssets, buyerObj.token_amount);
                            //======================================================
                            //=============Create buyer market order history========
                            //======================================================
                            await marketDal.createMarketOrderHistory(buyerObj, buyerObj.token_amount, paid_usdt, buyerFees);
                            //======================================================
                            //=============Create seller market order history=======
                            //======================================================
                            await marketDal.createMarketOrderHistory(sellerObj, buyerObj.token_amount, paid_usdt, sellerFees);
                        }
                    }
                }
            }

        } catch (error: any) {
            throw new Error(error.message);
        }
    }
    /**
     * Processes the execution of a seller's order, including asset transfers and fee deductions.
     *
     * @param {buyerExecution} options - Contains information about both buyer and seller objects, payment amounts, and fees.
     * @returns {Promise<void>} - A promise that resolves once the execution process is complete.
     */

    async processSellerExecution(options: buyerExecution) {
        try {
            //'================Seller====================')
            let sellerusdtmarket = await this.getMarketOrderById(options.sellerObj.id);
            if (sellerusdtmarket.status === false || sellerusdtmarket.status === 0) {
                let tokensData = await tokensModel.findOne({ where: { symbol: 'USDT' }, raw: true });
                let token: any = tokensData;
                if (token === null) {
                    tokensData = await globalTokensModel.findOne({ where: { symbol: 'USDT' }, raw: true });
                    token = tokensData;
                }
                let asset = await service.assets.getUserAssetByTokenIdandWallet({ user_id: options.sellerObj.user_id, token_id: token?.id });
                if (asset) {
                    let updatedBal: any = truncateNumber(Number(parseFloat(asset.balance) + options.paid_usdt), 8);
                    // =========================================================//
                    // ================Fee Deduction from seller=================//
                    // =========================================================//
                    // updatedBal = truncateNumber(Number(updatedBal - options?.sellerFees), 8);
                    updatedBal = preciseSubtraction(updatedBal, options?.sellerFees, 10);
                    await marketDal.createAdminProfit(options?.buyerObj, 0, 0, options?.sellerObj.user_id, options?.sellerFees, 'USDT', 'Spot Trading');
                    await assetModel.update({ balance: updatedBal }, { where: { id: asset.id } })
                }
                else {
                    // =========================================================//
                    // ================Fee Deduction from seller=================//
                    // =========================================================//
                    options.paid_usdt = truncateNumber(Number(options.paid_usdt - options?.sellerFees), 8);
                    await marketDal.createAdminProfit(options?.buyerObj, 0, 0, options?.sellerObj.user_id, options?.sellerFees, 'USDT', 'Spot Trading');
                    let assets: assetsDto = {
                        walletTtype: assetsWalletType.main_wallet,
                        balance: options.paid_usdt,
                        account_type: assetsAccountType.main_account,
                        token_id: token?.id,
                        user_id: options.sellerObj.user_id
                    };
                    await assetModel.create(assets);
                }
            }

            //'================Buyer====================')
            let buyerusdtmarket = await this.getMarketOrderById(options.buyerObj.id);
            let token: any = await tokensModel.findOne({ where: { id: options?.buyerObj?.token_id }, raw: true });
            if (token === null) {
                token = await globalTokensModel.findOne({ where: { id: options?.buyerObj?.token_id }, raw: true });
            }
            if (buyerusdtmarket?.status === false || buyerusdtmarket?.status === 0) {
                let asset = await service.assets.getUserAssetByTokenIdandWallet({ user_id: options.buyerObj.user_id, token_id: options.buyerObj.token_id });
                if (asset) {
                    console.log(parseFloat(asset.balance), '=======Buyer current usdt bal');
                    let updatedBal = truncateNumber(Number(parseFloat(asset.balance) + options.buyerObj.token_amount), 8);
                    let realAmount = parseFloat(options.buyerObj.token_amount);
                    if (options.buyerObj.token_amount > options.remainingAssets) {
                        updatedBal = truncateNumber(Number(parseFloat(asset.balance) + options.remainingAssets), 8);
                        realAmount = options.remainingAssets;
                    }
                    // =========================================================//
                    // ================Fee Deduction from Buyer=================//
                    // =========================================================//
                    // updatedBal = truncateNumber(Number(updatedBal - options?.buyerFees), 8);
                    updatedBal = preciseSubtraction(updatedBal, options?.buyerFees, 10);
                    // ============Here fee add to admin wallet==================//
                    await marketDal.createAdminProfit(options?.buyerObj, 0, 0, options?.sellerObj.user_id, options?.buyerFees, token?.symbol, 'Spot Trading');
                    await assetModel.update({ balance: updatedBal }, { where: { id: asset.id } })
                }
                else {
                    let realAmount: any = parseFloat(options.buyerObj.token_amount);
                    if (options.buyerObj.token_amount > options.remainingAssets) {
                        realAmount = options.remainingAssets;
                    }
                    // =========================================================//
                    // ================Fee Deduction from Buyer=================//
                    // =========================================================//
                    realAmount = truncateNumber(Number(realAmount - options?.buyerFees), 8);

                    await marketDal.createAdminProfit(options?.buyerObj, 0, 0, options?.sellerObj.user_id, options?.buyerFees, token?.symbol, 'Spot Trading');
                    let assets: assetsDto = {
                        walletTtype: assetsWalletType.main_wallet,
                        balance: realAmount,
                        account_type: assetsAccountType.main_account,
                        token_id: options.buyerObj.token_id,
                        user_id: options.buyerObj.user_id
                    };
                    await assetModel.create(assets);
                }
            }
            //======================================================
            //============= update market order status =============
            //======================================================
            await this.updateSellerOrderStatus(options);
        } catch (error: any) {
            throw new Error(error.message)
        }
    }

    /**
     * Updates the status of the seller and buyer orders based on the remaining assets after the transaction.
     * The status is updated as `true` when the order is completed, or adjusted if the remaining amount changes.
     *
     * @param {buyerExecution} options - Contains the details about the buyer and seller orders, and the remaining assets.
     * @returns {Promise<void>} - A promise that resolves once the order status has been updated successfully.
     * @throws {Error} - Throws an error if the status update fails.
     */
    async updateSellerOrderStatus(options: buyerExecution) {
        try {
            // console.log('========here 5');
            let sellerOrder = await this.getMarketOrderById(options.sellerObj.id);
            let buyerOrder = await this.getMarketOrderById(options.buyerObj.id);
            if (options.remainingAssets === options.buyerObj.token_amount) {
                if (sellerOrder) {
                    await marketOrderModel.update({ status: true }, { where: { id: sellerOrder.id } })
                }
                if (buyerOrder) {
                    await marketOrderModel.update({ status: true }, { where: { id: buyerOrder.id } })
                }
            }
            else if (parseFloat(options.buyerObj.token_amount) > options.remainingAssets) {
                let buyerStatus = false;
                let remainingAmount = preciseSubtraction(parseFloat(buyerOrder.token_amount), options.remainingAssets); // Number(truncateNumber((parseFloat(buyerOrder.token_amount) - options.remainingAssets), 8).toPrecision(1));
                let volume_usdt = preciseSubtraction(parseFloat(buyerOrder.volume_usdt), (options.paid_usdt + options.paid_to_admin)); //Number(truncateNumber((parseFloat(buyerOrder.volume_usdt) - (options.paid_usdt + options.paid_to_admin)), 8).toPrecision(1));

                if (remainingAmount === 0) {
                    buyerStatus = true;
                }
                if (buyerOrder) {
                    await marketOrderModel.update({
                        status: buyerStatus,
                        volume_usdt: preciseSubtraction(parseFloat(buyerOrder.volume_usdt), (options.paid_usdt + options.paid_to_admin)), // Number(truncateNumber((parseFloat(buyerOrder.volume_usdt) - (options.paid_usdt + options.paid_to_admin)), 8).toPrecision(1)),
                        token_amount: preciseSubtraction(parseFloat(options.buyerObj.token_amount), options.remainingAssets), queue: false //Number(truncateNumber((parseFloat(options.buyerObj.token_amount) - options.remainingAssets), 8).toPrecision(1)), queue: false
                    }, { where: { id: buyerOrder.id } })
                }
                if (sellerOrder) {
                    await marketOrderModel.update({ status: true }, { where: { id: sellerOrder.id } })
                }
            }
            else if (options.remainingAssets > parseFloat(options.buyerObj.token_amount)) {
                console.log(options.remainingAssets, "remaining assetes in seller");
                console.log(options.buyerObj.token_amount, "token amount in seller");

                if (sellerOrder) {
                    await marketOrderModel.update({
                        token_amount: preciseSubtraction(options.remainingAssets, parseFloat(options.buyerObj.token_amount)),// Number(truncateNumber((options.remainingAssets - parseFloat(options.buyerObj.token_amount)), 8).toPrecision(1)),
                        volume_usdt: preciseSubtraction(parseFloat(sellerOrder.volume_usdt), options.paid_usdt), queue: false // Number(truncateNumber((parseFloat(sellerOrder.volume_usdt) - options.paid_usdt), 8).toPrecision(1)), queue: false
                    }, { where: { id: sellerOrder.id } })
                }
                if (buyerOrder) {
                    await marketOrderModel.update({ status: true }, { where: { id: buyerOrder.id } })
                }
            }
        } catch (error: any) {
            throw new Error(error.message);
        }
    }


    //=====================================================
    //=============Market based order execution============
    //=====================================================

    /**
     * Executes the buy or sell order on the market based on the order type.
     * Calls the appropriate function for the buyer or seller depending on the order type.
     *
     * @param {marketPartialExecution} payload - Contains the details of the market order to execute.
     * @returns {Promise<void>} - A promise that resolves when the market order execution is complete.
     * @throws {Error} - Throws an error if the market order execution fails.
     */
    async buySellOnMarket(payload: marketPartialExecution): Promise<any> {
        try {
            if (payload.order_type === marketOrderEnum.buy) {
                await this.marketBuyerCode(payload);
            }
            if (payload.order_type === marketOrderEnum.sell) {
                await this.marketSellerCode(payload);
            }
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    /**
     * Executes the buyer's side of the market order, matching buy bids with available sell orders.
     * Handles partial executions and updates the buyer and seller market orders accordingly.
     * 
     * @param {marketPartialExecution} payload - Contains details of the market order being processed, such as user ID, token ID, etc.
     * @returns {Promise<void>} - A promise that resolves once the buyer's order execution is completed.
     * @throws {Error} - Throws an error if no buyer or seller bids are found, or if any execution step fails.
     */
    async marketBuyerCode(payload: marketPartialExecution): Promise<any> {
        try {
            let previous_seller: any = [];
            let tokenFetch = await tokensModel.findOne({ where: { id: payload.token_id }, raw: true });
            if (!tokenFetch) {
                tokenFetch = await globalTokensModel.findOne({ where: { id: payload.token_id }, raw: true });
            }
            let buyBids = await marketOrderModel.findAll({ where: { status: false, isCanceled: false, user_id: payload?.user_id, token_id: payload?.token_id, order_type: marketOrderEnum.buy, market_type: marektTypeEnum.market, queue: false }, raw: true, order: [['id', "DESC"]] });
            // if buyer not exist than return
            if (buyBids == null || buyBids.length == 0) {
                throw new Error('No any buyer bids found');
            }
            let sellBids = await marketOrderModel.findAll({ where: { status: false, isCanceled: false, token_id: payload?.token_id, order_type: marketOrderEnum.sell, market_type: marektTypeEnum.market, queue: false }, raw: true, order: [['id', "DESC"]] })
            // if seller not exist than return
            if (sellBids == null || sellBids.length == 0) {
                throw new Error('No any seller bids found');
            }
            //=====================================================//
            //=================Partial execution===================//
            //=====================================================//
            for await (const buyer of buyBids) {
                let buyerObj = buyer;
                // find previous ids if seller already sell assets
                if (previous_seller.length > 0) {
                    sellBids = sellBids.filter((item) => {
                        if (!previous_seller.includes(item?.id))
                            return item;
                    })
                }
                let remainingAssets = buyerObj.token_amount;
                let paid_usdt = 0;
                for await (const seller of sellBids) {
                    // seller add in queue
                    let sellerObj = seller;
                    previous_seller.push(sellerObj.id);
                    if (tokenFetch !== undefined && tokenFetch?.price !== undefined) {
                        if (buyerObj.token_id === sellerObj.token_id && sellerObj.limit_usdt <= tokenFetch.price) {

                            if (sellerObj.token_amount === remainingAssets) {
                                await marketOrderModel.update({ queue: true }, { where: { id: buyerObj.id } });
                                await marketOrderModel.update({ queue: true }, { where: { id: sellerObj.id } });
                                paid_usdt = sellerObj.limit_usdt * sellerObj.token_amount;
                                let paid_to_admin = (buyerObj.limit_usdt * sellerObj.token_amount) - paid_usdt;
                                if (paid_to_admin > 0) {
                                    //======================================================
                                    //=============Create admin profit======================
                                    //======================================================
                                    await marketDal.createAdminProfit(buyerObj, paid_usdt, paid_to_admin, sellerObj.user_id, 0, 'USDT', 'Spot Trading');
                                }
                                //======================================================
                                //=============Buyer and seller asset execution=========
                                //======================================================
                                // console.log('========Seller qty bid same as buyer qty bid===============');
                                // console.log(preciseSubtraction(sellerObj.token_amount, remainingAssets), "=======remainingAssets buyer 1=======", remainingAssets, sellerObj.token_amount);
                                let buyerFees: any = remainingAssets * 0.001;
                                buyerFees = scientificToDecimal(Number(truncateNumber(buyerFees.toFixed(12), 8)));
                                let sellerFees: any = (sellerObj.token_amount * sellerObj.limit_usdt * 0.001);
                                sellerFees = scientificToDecimal(Number(truncateNumber(sellerFees.toFixed(12), 8)));
                                // console.log(buyerFees, '========buyerFees=======', sellerFees, '===========sellerFees===========');
                                await this.processBuyerExecution({ buyerObj, sellerObj, paid_usdt, sellerFees, buyerFees, remainingAssets, paid_to_admin });
                                //======================================================
                                //=============Create buyer market order history========
                                //======================================================
                                await marketDal.createMarketOrderHistory(buyerObj, sellerObj.token_amount, paid_usdt, buyerFees);
                                //======================================================
                                //=============Create seller market order history=======
                                //======================================================
                                await marketDal.createMarketOrderHistory(sellerObj, sellerObj.token_amount, paid_usdt, sellerFees);
                                break;
                            }
                            else if (sellerObj.token_amount > remainingAssets) {
                                await marketOrderModel.update({ queue: true }, { where: { id: buyerObj.id } });
                                await marketOrderModel.update({ queue: true }, { where: { id: sellerObj.id } });
                                paid_usdt = sellerObj.limit_usdt * remainingAssets;
                                let paid_to_admin = (buyerObj.limit_usdt * remainingAssets) - paid_usdt;
                                if (paid_to_admin > 0) {
                                    //======================================================
                                    //=============Create admin profit======================
                                    //======================================================
                                    await marketDal.createAdminProfit(buyerObj, paid_usdt, paid_to_admin, sellerObj.user_id, 0, 'USDT', 'Spot Trading');
                                }
                                //======================================================
                                //=============Buyer and seller asset execution=========
                                //======================================================
                                // console.log('========Seller qty bid more than buyer qty bid===============');
                                // console.log(preciseSubtraction(sellerObj.token_amount, remainingAssets), "=======remainingAssets buyer 2=======", remainingAssets, sellerObj.token_amount);
                                let buyerFees: any = remainingAssets * 0.001;
                                buyerFees = scientificToDecimal(Number(truncateNumber(buyerFees.toFixed(12), 8)));
                                let sellerFees: any = ((remainingAssets) * sellerObj.limit_usdt * 0.001);
                                sellerFees = scientificToDecimal(Number(truncateNumber(sellerFees.toFixed(12), 8)));
                                // console.log(buyerFees, '========buyerFees=======', sellerFees, '===========sellerFees===========');
                                await this.processBuyerExecution({ buyerObj, sellerObj, paid_usdt, sellerFees, buyerFees, remainingAssets, paid_to_admin });
                                //======================================================
                                //=============Create buyer market order history========
                                //======================================================
                                await marketDal.createMarketOrderHistory(buyerObj, remainingAssets, paid_usdt, buyerFees);
                                //======================================================
                                //=============Create seller market order history=======
                                //======================================================
                                await marketDal.createMarketOrderHistory(sellerObj, remainingAssets, paid_usdt, sellerFees);
                                break;
                            }

                            if (remainingAssets > sellerObj.token_amount) {
                                await marketOrderModel.update({ queue: true }, { where: { id: buyerObj.id } });
                                await marketOrderModel.update({ queue: true }, { where: { id: sellerObj.id } });
                                paid_usdt = sellerObj.limit_usdt * sellerObj.token_amount;
                                let paid_to_admin = (buyerObj.limit_usdt * sellerObj.token_amount) - paid_usdt;
                                if (paid_to_admin > 0) {
                                    //======================================================
                                    //=============Create admin profit======================
                                    //======================================================
                                    await marketDal.createAdminProfit(buyerObj, paid_usdt, paid_to_admin, sellerObj.user_id, 0, 'USDT', 'Spot Trading');
                                }
                                //======================================================
                                //=============Buyer and seller asset execution=========
                                //======================================================
                                // console.log('========Seller qty bid less than buyer qty bid===============');
                                // console.log(preciseSubtraction(remainingAssets, sellerObj.token_amount), "=======remainingAssets buyer 3=======", remainingAssets, sellerObj.token_amount);
                                let buyerFees: any = sellerObj.token_amount * 0.001;
                                buyerFees = scientificToDecimal(Number(truncateNumber(buyerFees.toFixed(12), 8)));
                                let sellerFees: any = (sellerObj.token_amount * sellerObj.limit_usdt * 0.001);
                                sellerFees = scientificToDecimal(Number(truncateNumber(sellerFees.toFixed(12), 8)));
                                // console.log(buyerFees, '========buyerFees=======', sellerFees, '===========sellerFees===========');
                                await this.processBuyerExecution({ buyerObj, sellerObj, paid_usdt, sellerFees, buyerFees, remainingAssets, paid_to_admin });
                                remainingAssets = preciseSubtraction(remainingAssets, sellerObj.token_amount);

                                //======================================================
                                //=============Create buyer market order history========
                                //======================================================
                                await marketDal.createMarketOrderHistory(buyerObj, sellerObj.token_amount, paid_usdt, buyerFees);
                                //======================================================
                                //=============Create seller market order history=======
                                //======================================================
                                await marketDal.createMarketOrderHistory(sellerObj, sellerObj.token_amount, paid_usdt, sellerFees);
                            }
                        }
                    }

                }
            }

        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    /**
     * Executes market transactions by matching buy and sell bids for a specific token.
     * 
     * This function processes the orders by matching sellers' tokens with buyers' bids
     * based on their amounts and limits. It handles various cases such as when the buyer's
     * bid is equal to, greater than, or less than the seller's available tokens.
     * 
     * @param {marketPartialExecution} payload - The execution payload containing details of the transaction.
     * @returns {Promise<any>} - A promise that resolves to any result from the transaction execution.
     * @throws {Error} - Throws an error if no buyer bids or seller bids are found, or if the token is not found.
     */
    async marketSellerCode(payload: marketPartialExecution): Promise<any> {
        try {
            let previous_buyer: any = [];
            let tokenFetch = await tokensModel.findOne({ where: { id: payload.token_id }, raw: true });
            if (!tokenFetch) {
                tokenFetch = await globalTokensModel.findOne({ where: { id: payload.token_id }, raw: true });
            }
            // if buyer not exist than return
            let buyBids = await marketOrderModel.findAll({ where: { status: false, isCanceled: false, token_id: payload?.token_id, order_type: marketOrderEnum.buy, market_type: marektTypeEnum.market, queue: false }, raw: true, order: [['id', "DESC"]] })
            if (buyBids == null || buyBids.length == 0) {
                throw new Error('No any buyer bids found');
            }
            // if seller not exist than return
            let sellBids = await marketOrderModel.findAll({ where: { status: false, isCanceled: false, user_id: payload?.user_id, token_id: payload?.token_id, order_type: marketOrderEnum.sell, market_type: marektTypeEnum.market, queue: false }, raw: true, order: [['id', "DESC"]] })
            if (sellBids == null || sellBids.length == 0) {
                throw new Error('No any seller bids found');
            }
            for await (const seller of sellBids) {
                let sellerObj = seller;
                if (previous_buyer.length > 0) {
                    buyBids = buyBids.filter((item) => {
                        if (!previous_buyer.includes(item?.id))
                            return item;
                    })
                }
                let remainingAssets = sellerObj.token_amount;
                let paid_usdt = 0;
                for await (const buyer of buyBids) {
                    let buyerObj = buyer;
                    previous_buyer.push(buyerObj.id);
                    if (tokenFetch && tokenFetch.price !== undefined) {
                        if (buyerObj.token_id === sellerObj.token_id && buyerObj.limit_usdt >= tokenFetch.price) {
                            if (buyerObj.token_amount === remainingAssets) {
                                await marketOrderModel.update({ queue: true }, { where: { id: sellerObj.id } })
                                await marketOrderModel.update({ queue: true }, { where: { id: buyerObj.id } })
                                paid_usdt = sellerObj.limit_usdt * remainingAssets;
                                let paid_to_admin = (buyerObj.limit_usdt * remainingAssets) - paid_usdt;
                                if (paid_to_admin > 0) {
                                    //======================================================
                                    //=============Create admin profit======================
                                    //======================================================
                                    await marketDal.createAdminProfit(buyerObj, paid_usdt, paid_to_admin, sellerObj.user_id, 0, 'USDT', 'Spot Trading');
                                }
                                //=====================================================
                                //=============Buyer and seller asset execution=========
                                //======================================================
                                // console.log('========Seller qty bid same as buyer qty bid===============');
                                // console.log(preciseSubtraction(buyerObj.token_amount, remainingAssets), "=======remainingAssets buyer 1=======", `${remainingAssets}  seller amount`, `${buyerObj.token_amount} buyer amount`);
                                let buyerFees: any = buyerObj.token_amount * 0.001;
                                buyerFees = scientificToDecimal(Number(truncateNumber(buyerFees.toFixed(12), 8)));
                                let sellerFees: any = (remainingAssets * sellerObj.limit_usdt * 0.001);
                                sellerFees = scientificToDecimal(Number(truncateNumber(sellerFees.toFixed(12), 8)));
                                // console.log(buyerFees, '========buyerFees=======', sellerFees, '===========sellerFees===========');
                                await this.processSellerExecution({ buyerObj, sellerObj, paid_usdt, sellerFees, buyerFees, remainingAssets, paid_to_admin });
                                //======================================================
                                //=============Create buyer market order history========
                                //======================================================
                                await marketDal.createMarketOrderHistory(buyerObj, buyerObj.token_amount, paid_usdt, buyerFees);
                                //======================================================
                                //=============Create seller market order history=======
                                //======================================================
                                await marketDal.createMarketOrderHistory(sellerObj, remainingAssets, paid_usdt, sellerFees);
                                break;
                            }
                            else if (buyerObj.token_amount > remainingAssets) {
                                await marketOrderModel.update({ queue: true }, { where: { id: sellerObj.id } })
                                await marketOrderModel.update({ queue: true }, { where: { id: buyerObj.id } })
                                paid_usdt = sellerObj.limit_usdt * remainingAssets;
                                let paid_to_admin = (buyerObj.limit_usdt * remainingAssets) - paid_usdt;
                                if (paid_to_admin > 0) {
                                    //======================================================
                                    //=============Create admin profit======================
                                    //======================================================
                                    await marketDal.createAdminProfit(buyerObj, paid_usdt, paid_to_admin, sellerObj.user_id, 0, 'USDT', 'Spot Trading');
                                }
                                //======================================================
                                //=============Buyer and seller asset execution=========
                                //======================================================
                                // console.log('========Buyer qty bid more than Seller qty bid===============');
                                // console.log(preciseSubtraction(buyerObj.token_amount, remainingAssets), "=======remainingAssets buyer 2=======", `${remainingAssets} seller amount`, `${sellerObj.token_amount} buyer amount`);
                                let buyerFees: any = remainingAssets * 0.001;
                                buyerFees = scientificToDecimal(Number(truncateNumber(buyerFees.toFixed(12), 8)));
                                let sellerFees: any = ((remainingAssets) * sellerObj.limit_usdt * 0.001);
                                sellerFees = scientificToDecimal(Number(truncateNumber(sellerFees.toFixed(12), 8)));
                                // console.log(buyerFees, '========buyerFees=======', sellerFees, '===========sellerFees===========');
                                await this.processSellerExecution({ buyerObj, sellerObj, paid_usdt, sellerFees, buyerFees, remainingAssets, paid_to_admin });
                                //======================================================
                                //=============Create buyer market order history========
                                //======================================================
                                await marketDal.createMarketOrderHistory(buyerObj, remainingAssets, paid_usdt, buyerFees);
                                //======================================================
                                //=============Create seller market order history=======
                                //======================================================
                                await marketDal.createMarketOrderHistory(sellerObj, remainingAssets, paid_usdt, sellerFees);
                                break;
                            }
                            if (remainingAssets > buyerObj.token_amount) {
                                await marketOrderModel.update({ queue: true }, { where: { id: sellerObj.id } })
                                await marketOrderModel.update({ queue: true }, { where: { id: buyerObj.id } })
                                paid_usdt = sellerObj.limit_usdt * buyerObj.token_amount;
                                let paid_to_admin = (buyerObj.limit_usdt * buyerObj.token_amount) - paid_usdt;
                                if (paid_to_admin > 0) {
                                    //======================================================
                                    //=============Create admin profit======================
                                    //======================================================
                                    await marketDal.createAdminProfit(buyerObj, paid_usdt, paid_to_admin, sellerObj.user_id, 0, 'USDT', 'Spot Trading');
                                }
                                //======================================================
                                //=============Buyer and seller asset execution=========
                                //======================================================
                                // console.log('========Buyer qty bid less than Seller qty bid===============');
                                // console.log(preciseSubtraction(remainingAssets, buyerObj.token_amount), "=======remainingAssets buyer 3=======", `${remainingAssets} seller amount`, `${buyerObj.token_amount} buyer amount`);
                                let buyerFees: any = buyerObj.token_amount * 0.001;
                                buyerFees = scientificToDecimal(Number(truncateNumber(buyerFees.toFixed(12), 8)));
                                let sellerFees: any = (buyerObj.token_amount * sellerObj.limit_usdt * 0.001);
                                sellerFees = scientificToDecimal(Number(truncateNumber(sellerFees.toFixed(12), 8)));
                                // console.log(buyerFees, '========buyerFees=======', sellerFees, '===========sellerFees===========');
                                await this.processSellerExecution({ buyerObj, sellerObj, paid_usdt, sellerFees, buyerFees, remainingAssets, paid_to_admin });
                                remainingAssets = preciseSubtraction(remainingAssets, buyerObj.token_amount);
                                //======================================================
                                //=============Create buyer market order history========
                                //======================================================
                                await marketDal.createMarketOrderHistory(buyerObj, buyerObj.token_amount, paid_usdt, buyerFees);
                                //======================================================
                                //=============Create seller market order history=======
                                //======================================================
                                await marketDal.createMarketOrderHistory(sellerObj, buyerObj.token_amount, paid_usdt, sellerFees);
                            }
                        }
                    }

                }
            }

        } catch (error: any) {
            throw new Error(error.message);
        }
    }

}

export default marketService;
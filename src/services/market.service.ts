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

    async create(payload: marketDto): Promise<marketOrderOuput | any> {
        return await marketDal.create(payload);
    }

    async getList(userid: string): Promise<marketOrderOuput | any> {
        return await marketDal.getOrderList(userid);
    }

    async getListByLimit(userid: string, offset: string, limit: string, currency: string, date: string): Promise<marketOrderOuput | any> {
        return await marketDal.getOrderListByLimit(userid, offset, limit, currency, date);
    }

    async getAllMarketOrder(): Promise<marketOrderOuput | any> {
        return await marketDal.getMarketOrderList();
    }

    async getAllMarketOrderByLimit(offset: string, limit: string): Promise<marketOrderOuput | any> {
        return await marketDal.getMarketOrderListByLimit(offset, limit);
    }

    async getMarketOrderById(order_id: string): Promise<marketOrderOuput | any> {
        try {
            let order = await marketOrderModel.findOne({ where: { id: order_id }, raw: true });

            return order;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    async cancelOrder(payload: marketCancel): Promise<marketOrderOuput | any> {
        return await marketDal.cancelOrder(payload);
    }

    async getListByTokenId(token_id: string): Promise<marketOrderOuput | any> {
        return await marketDal.getOrderListByTokenId(token_id);
    }

    async getOrderListByTokenIdUserId(token_id: string, user_id: string): Promise<marketOrderModel | any> {
        return marketDal.getOrderListByTokenIdUserId(token_id, user_id);
    }

    async getOrderHistoryByTokenIdUserId(token_id: string, user_id: string): Promise<marketOrderModel | any> {
        return marketDal.getOrderHistoryByTokenIdUserId(token_id, user_id);
    }

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

    // partial order code
    async marketPartialOrder(payload: marketPartialExecution): Promise<any> {
        return await marketDal.socketMarketBuySell(payload);
    }

    //====================================================
    //=============Limit based order execution============
    //====================================================
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
                            await marketDal.createMarketOrderHistory(buyerObj, remainingAssets, paid_usdt,buyerFees);
                            //======================================================
                            //=============Create seller market order history=======
                            //======================================================
                            await marketDal.createMarketOrderHistory(sellerObj, remainingAssets, paid_usdt,sellerFees);
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
                            await marketDal.createMarketOrderHistory(buyerObj, sellerObj.token_amount, paid_usdt,buyerFees);
                            //======================================================
                            //=============Create seller market order history=======
                            //======================================================
                            await marketDal.createMarketOrderHistory(sellerObj, sellerObj.token_amount, paid_usdt,sellerFees);
                        }
                    }
                }
            }

        } catch (error: any) {
            throw new Error(error.message);
        }
    }

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
                    updatedBal = preciseSubtraction(updatedBal , options?.sellerFees, 10);
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
                    updatedBal = preciseSubtraction(updatedBal , options?.buyerFees, 10);
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
                            await marketDal.createMarketOrderHistory(buyerObj, buyerObj.token_amount, paid_usdt,buyerFees);
                            //======================================================
                            //=============Create seller market order history=======
                            //======================================================
                            await marketDal.createMarketOrderHistory(sellerObj, remainingAssets, paid_usdt,sellerFees);
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
                            await marketDal.createMarketOrderHistory(buyerObj, remainingAssets, paid_usdt,buyerFees);
                            //=====================================================
                            //=============Create seller market order history=======
                            //======================================================
                            await marketDal.createMarketOrderHistory(sellerObj, remainingAssets, paid_usdt,sellerFees);
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
                            await marketDal.createMarketOrderHistory(buyerObj, buyerObj.token_amount, paid_usdt,buyerFees);
                            //======================================================
                            //=============Create seller market order history=======
                            //======================================================
                            await marketDal.createMarketOrderHistory(sellerObj, buyerObj.token_amount, paid_usdt,sellerFees);
                        }
                    }
                }
            }

        } catch (error: any) {
            throw new Error(error.message);
        }
    }

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
                    updatedBal = preciseSubtraction(updatedBal , options?.sellerFees, 10);
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
                    // console.log(parseFloat(asset.balance), '=======Buyer current usdt bal');
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
                    updatedBal = preciseSubtraction(updatedBal , options?.buyerFees, 10);
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
                // console.log(options.remainingAssets, "remaining assetes in seller");
                // console.log(options.buyerObj.token_amount, "token amount in seller");

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
                                await marketDal.createMarketOrderHistory(buyerObj, sellerObj.token_amount, paid_usdt,buyerFees);
                                //======================================================
                                //=============Create seller market order history=======
                                //======================================================
                                await marketDal.createMarketOrderHistory(sellerObj, sellerObj.token_amount, paid_usdt,sellerFees);
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
                                await marketDal.createMarketOrderHistory(buyerObj, remainingAssets, paid_usdt,buyerFees);
                                //======================================================
                                //=============Create seller market order history=======
                                //======================================================
                                await marketDal.createMarketOrderHistory(sellerObj, remainingAssets, paid_usdt,sellerFees);
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
                                await marketDal.createMarketOrderHistory(buyerObj, sellerObj.token_amount, paid_usdt,buyerFees);
                                //======================================================
                                //=============Create seller market order history=======
                                //======================================================
                                await marketDal.createMarketOrderHistory(sellerObj, sellerObj.token_amount, paid_usdt,sellerFees);
                            }
                        }
                    }

                }
            }

        } catch (error: any) {
            throw new Error(error.message);
        }
    }

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
                                await marketDal.createMarketOrderHistory(buyerObj, buyerObj.token_amount, paid_usdt,buyerFees);
                                //======================================================
                                //=============Create seller market order history=======
                                //======================================================
                                await marketDal.createMarketOrderHistory(sellerObj, remainingAssets, paid_usdt,sellerFees);
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
                                await marketDal.createMarketOrderHistory(buyerObj, remainingAssets, paid_usdt,buyerFees);
                                //======================================================
                                //=============Create seller market order history=======
                                //======================================================
                                await marketDal.createMarketOrderHistory(sellerObj, remainingAssets, paid_usdt,sellerFees);
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
                                await marketDal.createMarketOrderHistory(buyerObj, buyerObj.token_amount, paid_usdt,buyerFees);
                                //======================================================
                                //=============Create seller market order history=======
                                //======================================================
                                await marketDal.createMarketOrderHistory(sellerObj, buyerObj.token_amount, paid_usdt,sellerFees);
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
import { assetModel, globalTokensModel, tokensModel } from "../models";
import marketDal from "../models/dal/market.dal";
import assetsDto from "../models/dto/assets.dto";
import { marketDto } from "../models/dto/market.dto";
import marketOrderHistoryModel, { marketOrderHistoryInput } from "../models/model/marketOrderHistory.model";
import marketOrderModel, { marketOrderOuput } from "../models/model/marketorder.model";
import { assetsAccountType, assetsWalletType, marektTypeEnum, marketCancel, marketOrderEnum, marketPartialExecution, tokenTypeEnum } from "../utils/interface";
import { truncateNumber } from "../utils/utility";
import service from "./service";

interface buyerExecution {
    buyerObj: any;
    sellerObj: any;
    paid_usdt: number;
    remainingAssets: number;
    paid_to_admin: number;
}

class marketService {

    async create(payload: marketDto): Promise<marketOrderOuput | any> {
        return await marketDal.create(payload);
    }

    async getList(userid: string): Promise<marketOrderOuput | any> {
        return await marketDal.getOrderList(userid);
    }

    async getListByLimit(userid: string, offset: string, limit: string): Promise<marketOrderOuput | any> {
        return await marketDal.getOrderListByLimit(userid, offset, limit);
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

            let buyBids = await marketOrderModel.findAll({ where: { status: false, isCanceled: false, user_id: payload?.user_id, token_id: payload?.token_id, order_type: marketOrderEnum.buy, market_type: marektTypeEnum.limit, queue: false }, order: [['id', "DESC"]] });

            console.log('---------on limit buy order create find buyer code---------------');

            // if buyer not exist than return
            if (buyBids == null || buyBids.length == 0) {
                throw new Error('No any buyer bids found');
            }

            let sellBids = await marketOrderModel.findAll({ where: { status: false, isCanceled: false, token_id: payload?.token_id, order_type: marketOrderEnum.sell, market_type: marektTypeEnum.limit, queue: false }, order: [['id', "DESC"]] })

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
                            await this.processBuyerExecution({ buyerObj, sellerObj, paid_usdt, remainingAssets, paid_to_admin });

                            //======================================================
                            //=============Create buyer market order history========
                            //======================================================
                            await marketDal.createMarketOrderHistory(buyerObj, sellerObj.token_amount, paid_usdt);

                            //======================================================
                            //=============Create seller market order history=======
                            //======================================================
                            await marketDal.createMarketOrderHistory(sellerObj, sellerObj.token_amount, paid_usdt);
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
                            await this.processBuyerExecution({ buyerObj, sellerObj, paid_usdt, remainingAssets, paid_to_admin });

                            //======================================================
                            //=============Create buyer market order history========
                            //======================================================
                            await marketDal.createMarketOrderHistory(buyerObj, remainingAssets, paid_usdt);

                            //======================================================
                            //=============Create seller market order history=======
                            //======================================================
                            await marketDal.createMarketOrderHistory(sellerObj, remainingAssets, paid_usdt);
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
                            await this.processBuyerExecution({ buyerObj, sellerObj, paid_usdt, remainingAssets, paid_to_admin });
                            remainingAssets = remainingAssets - sellerObj.token_amount;

                            //======================================================
                            //=============Create buyer market order history========
                            //======================================================
                            await marketDal.createMarketOrderHistory(buyerObj, sellerObj.token_amount, paid_usdt);

                            //======================================================
                            //=============Create seller market order history=======
                            //======================================================
                            await marketDal.createMarketOrderHistory(sellerObj, sellerObj.token_amount, paid_usdt);
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
            console.log('here code for buyer');

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
                    console.log(parseFloat(asset.balance),'========previous balance', options.paid_usdt,'========added value');
                    
                    let updatedBal: any = truncateNumber(parseFloat(asset.balance) + options.paid_usdt, 8);
                    console.log(updatedBal, 'seller assets updated Bal 1');

                    // =========================================================//
                    // ================Fee Deduction from seller=================//
                    // =========================================================//
                    let deductFee = truncateNumber(options.remainingAssets * options.sellerObj?.limit_usdt * 0.00075, 8);
                    console.log(deductFee, '===============seller 1 fee');

                    updatedBal = truncateNumber(updatedBal - deductFee, 8);
                    console.log(updatedBal, 'seller assets updated Bal 1');

                    // ============Here fee add to admin wallet==================//
                    await marketDal.createAdminProfit(options?.buyerObj, 0, 0, options?.sellerObj.user_id, deductFee, 'USDT', 'Spot Trading');
                    await assetModel.update({ balance: updatedBal }, { where: { id: asset.id } });
                }
                else {
                    // =========================================================//
                    // ================Fee Deduction from seller=================//
                    // =========================================================//
                    let deductFee = truncateNumber(options.remainingAssets * options.sellerObj?.limit_usdt * 0.00075, 8);
                    options.paid_usdt = truncateNumber(options.paid_usdt - deductFee, 8);
                    console.log(deductFee, '===============seller 1 fee no assets');
                    // ============Here fee add to admin wallet==================//
                    await marketDal.createAdminProfit(options?.buyerObj, 0, 0, options?.sellerObj.user_id, deductFee, 'USDT', 'Spot Trading');

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
            console.log('=============seller=====================');
            

            let buyerusdtmarket = await this.getMarketOrderById(options.buyerObj.id);

            let token: any = await tokensModel.findOne({ where: { id: options?.buyerObj?.token_id }, raw: true });
            if (token === null) {
                token = await globalTokensModel.findOne({ where: { id: options?.buyerObj?.token_id }, raw: true });
            }
            if (buyerusdtmarket?.status === false || buyerusdtmarket?.status === 0) {
                let buyerasset = await service.assets.getUserAssetByTokenIdandWallet({ user_id: options.buyerObj.user_id, token_id: options.buyerObj.token_id });

                if (buyerasset) {
                    console.log(parseFloat(buyerasset.balance),'========buyer previous balance', options.remainingAssets,'========added value');
                    let updatedBal: any = truncateNumber(parseFloat(buyerasset.balance) + options.remainingAssets, 8);
                    console.log(updatedBal, 'buyer assets updated Bal 1');

                    let realAmount = options.remainingAssets;
                    if (options.remainingAssets > options.sellerObj.token_amount) {
                        updatedBal = parseFloat(buyerasset.balance) + parseFloat(options.sellerObj.token_amount);
                        realAmount = parseFloat(options.sellerObj.token_amount);
                    }
                    // =========================================================//
                    // ================Fee Deduction from buyer=================//
                    // =========================================================//

                    let deductFee = truncateNumber(options.remainingAssets * 0.00075, 8);
                    console.log(deductFee, '===============buyer fee 1');

                    updatedBal = truncateNumber(updatedBal - deductFee, 8);
                    console.log(updatedBal, 'buyer assets updated Bal 1');

                    // ============Here fee add to admin wallet==================//
                    await marketDal.createAdminProfit(options?.buyerObj, 0, 0, options?.sellerObj.user_id, deductFee, token?.symbol, 'Spot Trading');
                    await assetModel.update({ balance: updatedBal }, { where: { id: buyerasset.id } });
                }
                else {
                    let realAmount: any = options.remainingAssets;
                    if (options.remainingAssets > parseFloat(options.sellerObj.token_amount)) {
                        realAmount = parseFloat(options.sellerObj.token_amount);
                    }
                    // =========================================================//
                    // ================Fee Deduction from buyer=================//
                    // =========================================================//
                    let deductFee = truncateNumber(options.remainingAssets * 0.00075, 8);
                    realAmount = truncateNumber(realAmount - deductFee, 8);

                    // ============Here fee add to admin wallet==================//
                    await marketDal.createAdminProfit(options?.buyerObj, 0, 0, options?.sellerObj.user_id, deductFee, token?.symbol, 'Spot Trading');

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
            console.log('================Buyer==================');
            
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
            console.log('========here 5');
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
                    await marketOrderModel.update({
                        volume_usdt: parseFloat(buyerOrder.volume_usdt) - (options.paid_usdt + options.paid_to_admin),
                        token_amount: (options.remainingAssets - parseFloat(options.sellerObj.token_amount)), queue: false
                    }, { where: { id: buyerOrder.id } });
                }
                if (sellerOrder) {
                    await marketOrderModel.update({ status: true }, { where: { id: sellerOrder.id } });
                }
            }
            else if (options.sellerObj.token_amount > options.remainingAssets) {
                if (sellerOrder) {
                    let sellerStatus = false;
                    let remainingAmount = parseFloat(sellerOrder.token_amount) - options.remainingAssets;
                    let volume_usdt = truncateNumber(parseFloat(sellerOrder.volume_usdt) - options.paid_usdt, 8);

                    console.log(remainingAmount, '-----------remainingAmount');
                    console.log(volume_usdt, '-------------------volume_usdt');

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
            console.log('========here 2');
            let previous_buyer: any = [];
            // if buyer not exist than return
            let buyBids = await marketOrderModel.findAll({ where: { status: false, isCanceled: false, token_id: payload?.token_id, order_type: marketOrderEnum.buy, market_type: marektTypeEnum.limit, queue: false }, order: [['id', "DESC"]] })

            console.log('---------on limit sell order create find buyer---------------');


            if (buyBids == null || buyBids.length == 0) {
                throw new Error('No any buyer bids found');
            }

            // if seller not exist than return
            let sellBids = await marketOrderModel.findAll({ where: { status: false, isCanceled: false, user_id: payload?.user_id, token_id: payload?.token_id, order_type: marketOrderEnum.sell, market_type: marektTypeEnum.limit, queue: false }, order: [['id', "DESC"]] })

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
                // let counter = 0;
                let paid_usdt = 0;

                for await (const buyer of buyBids) {
                    let buyerObj = buyer?.dataValues;
                    previous_buyer.push(buyerObj.id);

                    if (buyerObj.token_id === sellerObj.token_id && (buyerObj.limit_usdt >= sellerObj.limit_usdt)) {
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

                            //======================================================
                            //=============Buyer and seller asset execution=========
                            //======================================================
                            await this.processSellerExecution({ buyerObj, sellerObj, paid_usdt, remainingAssets, paid_to_admin });

                            //======================================================
                            //=============Create buyer market order history========
                            //======================================================
                            await marketDal.createMarketOrderHistory(buyerObj, buyerObj.token_amount, paid_usdt);

                            //======================================================
                            //=============Create seller market order history=======
                            //======================================================
                            await marketDal.createMarketOrderHistory(sellerObj, remainingAssets, paid_usdt);
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
                            await this.processSellerExecution({ buyerObj, sellerObj, paid_usdt, remainingAssets, paid_to_admin });

                            //======================================================
                            //=============Create buyer market order history========
                            //======================================================
                            await marketDal.createMarketOrderHistory(buyerObj, remainingAssets, paid_usdt);

                            //======================================================
                            //=============Create seller market order history=======
                            //======================================================
                            await marketDal.createMarketOrderHistory(sellerObj, remainingAssets, paid_usdt);
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
                            await this.processSellerExecution({ buyerObj, sellerObj, paid_usdt, remainingAssets, paid_to_admin });
                            remainingAssets = remainingAssets - buyerObj.token_amount;

                            //======================================================
                            //=============Create buyer market order history========
                            //======================================================
                            await marketDal.createMarketOrderHistory(buyerObj, buyerObj.token_amount, paid_usdt);

                            //======================================================
                            //=============Create seller market order history=======
                            //======================================================
                            await marketDal.createMarketOrderHistory(sellerObj, buyerObj.token_amount, paid_usdt);
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
            console.log('here code for seller');
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
                    console.log(parseFloat(asset.balance),'========previous balance', options.paid_usdt,'========added value');
                    let updatedBal: any = truncateNumber(parseFloat(asset.balance) + options.paid_usdt, 8);
                    console.log(updatedBal, 'seller assets updated Bal 2');
                    // =========================================================//
                    // ================Fee Deduction from seller=================//
                    // =========================================================//
                    let deductFee = truncateNumber(options.remainingAssets * options.sellerObj?.limit_usdt * 0.00075, 8);
                    console.log(deductFee, '===============seller fee 2');

                    updatedBal = truncateNumber(updatedBal - deductFee, 8);
                    console.log(updatedBal, 'seller assets updated Bal 2');

                    // ============Here fee add to admin wallet==================//
                    await marketDal.createAdminProfit(options?.buyerObj, 0, 0, options?.sellerObj.user_id, deductFee, 'USDT', 'Spot Trading');
                    await assetModel.update({ balance: updatedBal }, { where: { id: asset.id } })
                }
                else {
                    // =========================================================//
                    // ================Fee Deduction from seller=================//
                    // =========================================================//
                    let deductFee = truncateNumber(options.remainingAssets * options.sellerObj?.limit_usdt * 0.00075, 8);
                    options.paid_usdt = truncateNumber(options.paid_usdt - deductFee, 8);
                    // ============Here fee add to admin wallet==================//
                    await marketDal.createAdminProfit(options?.buyerObj, 0, 0, options?.sellerObj.user_id, deductFee, 'USDT', 'Spot Trading');

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

            console.log('================seller====================');
            

            let buyerusdtmarket = await this.getMarketOrderById(options.buyerObj.id);
            let token: any = await tokensModel.findOne({ where: { id: options?.buyerObj?.token_id }, raw: true });
            if (token === null) {
                token = await globalTokensModel.findOne({ where: { id: options?.buyerObj?.token_id }, raw: true });
            }
            if (buyerusdtmarket?.status === false || buyerusdtmarket?.status === 0) {
                let asset = await service.assets.getUserAssetByTokenIdandWallet({ user_id: options.buyerObj.user_id, token_id: options.buyerObj.token_id });
                if (asset) {
                    console.log(parseFloat(asset.balance),'========buyer previous balance', options.buyerObj.token_amount,'========added value');
                    let updatedBal = truncateNumber(parseFloat(asset.balance) + options.buyerObj.token_amount, 8);
                    console.log(updatedBal, 'buyer assets updated Bal 2');

                    let realAmount = parseFloat(options.buyerObj.token_amount);

                    if (options.buyerObj.token_amount > options.remainingAssets) {
                        updatedBal = truncateNumber(parseFloat(asset.balance) + options.remainingAssets,8);
                        realAmount = options.remainingAssets;
                    }

                    // =========================================================//
                    // ================Fee Deduction from Buyer=================//
                    // =========================================================//
                    let deductFee = truncateNumber(options.remainingAssets * 0.00075, 8);
                    console.log(deductFee, '===============buyer 2 fee');

                    updatedBal = truncateNumber(updatedBal - deductFee, 8);
                    console.log(updatedBal, 'buyer assets updated Bal 2');

                    // ============Here fee add to admin wallet==================//
                    await marketDal.createAdminProfit(options?.buyerObj, 0, 0, options?.sellerObj.user_id, deductFee, token?.symbol, 'Spot Trading');
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
                    let deductFee = truncateNumber(options.remainingAssets * 0.00075, 8);
                    console.log(deductFee, '===============buyer 2 fee no assets');

                    realAmount = truncateNumber(realAmount - deductFee, 8);
                    console.log(realAmount, 'buyer 2 real Amount');

                    // ============Here fee add to admin wallet==================//
                    await marketDal.createAdminProfit(options?.buyerObj, 0, 0, options?.sellerObj.user_id, deductFee, token?.symbol, 'Spot Trading');
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

            console.log('===============buyer=======================');
            

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
            console.log('========here 5');
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
                let remainingAmount = parseFloat(buyerOrder.token_amount) - options.remainingAssets;
                let volume_usdt = parseFloat(buyerOrder.volume_usdt) - (options.paid_usdt + options.paid_to_admin);

                console.log(remainingAmount, '-----------remainingAmount');
                console.log(volume_usdt, '-------------------volume_usdt');

                if (remainingAmount === 0) {
                    buyerStatus = true;
                }
                if (buyerOrder) {
                    await marketOrderModel.update({
                        status: buyerStatus,
                        volume_usdt: parseFloat(buyerOrder.volume_usdt) - (options.paid_usdt + options.paid_to_admin),
                        token_amount: (parseFloat(options.buyerObj.token_amount) - options.remainingAssets), queue: false
                    }, { where: { id: buyerOrder.id } })
                }
                if (sellerOrder) {
                    await marketOrderModel.update({ status: true }, { where: { id: sellerOrder.id } })
                }
            }
            else if (options.remainingAssets > parseFloat(options.buyerObj.token_amount)) {
                if (sellerOrder) {
                    await marketOrderModel.update({
                        token_amount: options.remainingAssets - parseFloat(options.buyerObj.token_amount),
                        volume_usdt: parseFloat(sellerOrder.volume_usdt) - options.paid_usdt, queue: false
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

            // console.log(tokenFetch, '================token Fetch');

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
                                await this.processBuyerExecution({ buyerObj, sellerObj, paid_usdt, remainingAssets, paid_to_admin });

                                //======================================================
                                //=============Create buyer market order history========
                                //======================================================
                                await marketDal.createMarketOrderHistory(buyerObj, sellerObj.token_amount, paid_usdt);

                                //======================================================
                                //=============Create seller market order history=======
                                //======================================================
                                await marketDal.createMarketOrderHistory(sellerObj, sellerObj.token_amount, paid_usdt);
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
                                await this.processBuyerExecution({ buyerObj, sellerObj, paid_usdt, remainingAssets, paid_to_admin });

                                //======================================================
                                //=============Create buyer market order history========
                                //======================================================
                                await marketDal.createMarketOrderHistory(buyerObj, remainingAssets, paid_usdt);

                                //======================================================
                                //=============Create seller market order history=======
                                //======================================================
                                await marketDal.createMarketOrderHistory(sellerObj, remainingAssets, paid_usdt);
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
                                await this.processBuyerExecution({ buyerObj, sellerObj, paid_usdt, remainingAssets, paid_to_admin });
                                remainingAssets = remainingAssets - sellerObj.token_amount;

                                //======================================================
                                //=============Create buyer market order history========
                                //======================================================
                                await marketDal.createMarketOrderHistory(buyerObj, sellerObj.token_amount, paid_usdt);

                                //======================================================
                                //=============Create seller market order history=======
                                //======================================================
                                await marketDal.createMarketOrderHistory(sellerObj, sellerObj.token_amount, paid_usdt);
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
            console.log('========here 2');
            let previous_buyer: any = [];

            let tokenFetch = await tokensModel.findOne({ where: { id: payload.token_id }, raw: true });
            if (!tokenFetch) {
                tokenFetch = await globalTokensModel.findOne({ where: { id: payload.token_id }, raw: true });
            }

            // if buyer not exist than return
            let buyBids = await marketOrderModel.findAll({ where: { status: false, isCanceled: false, token_id: payload?.token_id, order_type: marketOrderEnum.buy, market_type: marektTypeEnum.market, queue: false }, raw: true, order: [['id', "DESC"]] })
            console.log(buyBids, '---------on market sell order create find buyer---------------');
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
                // let counter = 0;
                let paid_usdt = 0;

                for await (const buyer of buyBids) {
                    let buyerObj = buyer;
                    previous_buyer.push(buyerObj.id);

                    if (tokenFetch && tokenFetch.price !== undefined) {
                        if (buyerObj.token_id === sellerObj.token_id && buyerObj.limit_usdt >= tokenFetch.price) {

                            console.log('============process execute seller==========');

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

                                //======================================================
                                //=============Buyer and seller asset execution=========
                                //======================================================
                                await this.processSellerExecution({ buyerObj, sellerObj, paid_usdt, remainingAssets, paid_to_admin });

                                //======================================================
                                //=============Create buyer market order history========
                                //======================================================
                                await marketDal.createMarketOrderHistory(buyerObj, buyerObj.token_amount, paid_usdt);

                                //======================================================
                                //=============Create seller market order history=======
                                //======================================================
                                await marketDal.createMarketOrderHistory(sellerObj, remainingAssets, paid_usdt);
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
                                await this.processSellerExecution({ buyerObj, sellerObj, paid_usdt, remainingAssets, paid_to_admin });

                                //======================================================
                                //=============Create buyer market order history========
                                //======================================================
                                await marketDal.createMarketOrderHistory(buyerObj, remainingAssets, paid_usdt);

                                //======================================================
                                //=============Create seller market order history=======
                                //======================================================
                                await marketDal.createMarketOrderHistory(sellerObj, remainingAssets, paid_usdt);
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
                                await this.processSellerExecution({ buyerObj, sellerObj, paid_usdt, remainingAssets, paid_to_admin });
                                remainingAssets = remainingAssets - buyerObj.token_amount;

                                //======================================================
                                //=============Create buyer market order history========
                                //======================================================
                                await marketDal.createMarketOrderHistory(buyerObj, buyerObj.token_amount, paid_usdt);

                                //======================================================
                                //=============Create seller market order history=======
                                //======================================================
                                await marketDal.createMarketOrderHistory(sellerObj, buyerObj.token_amount, paid_usdt);
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
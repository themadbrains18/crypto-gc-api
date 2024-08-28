import { assetModel, globalTokensModel, tokensModel } from "../models";
import marketDal from "../models/dal/market.dal";
import assetsDto from "../models/dto/assets.dto";
import marketOrderModel, { marketOrderOuput } from "../models/model/marketorder.model";
import { assetsAccountType, assetsWalletType, marektTypeEnum, marketOrderEnum } from "../utils/interface";
import { preciseAddition, preciseSubtraction, truncateNumber } from "../utils/utility";
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

const scientificToDecimal = (value: number): string => {
    return value.toFixed(10).replace(/\.?0+$/, ""); // Convert to decimal format, trimming unnecessary zeros
};

class cronMarketOrderService {

    /**
     * Get Market order by orderid
     * @param order_id 
     * @returns 
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
     * market order execution with cron and using batch
     * @param batchSize 
     */
    async processOrdersInBatches(batchSize: number) {
        let offset = 0;
        let hasMoreOrders = true;

        while (hasMoreOrders) {
            const orders = await marketOrderModel.findAll({
                where: { status: false, isCanceled: false },
                limit: batchSize,
                offset: offset,
                raw: true,
                order: [['createdAt', "DESC"]]
            });

            if (orders.length === 0) {
                hasMoreOrders = false;
                break;
            }

            await this.processOrders(orders);
            // Increase the offset to fetch the next batch
            offset += batchSize;
        }
    }

    async processOrders(orders: any[]) {
        for await (const order of orders) {
            if (order.market_type === marektTypeEnum.market) {
                await this.marketBuyerCode(order);
            } else if (order.market_type === marektTypeEnum.limit) {
                await this.buyerCode(order);
            }
        }
    }

    async buyerCode(order: any): Promise<any> {
        try {
            let previous_seller: any = [];
            let buyBids = await marketOrderModel.findAll({ where: { status: false, isCanceled: false, token_id: order?.token_id, order_type: marketOrderEnum.buy, market_type: marektTypeEnum.limit, queue: false }, raw: true, order: [['createdAt', "DESC"]] });
            // if buyer not exist than return
            if (buyBids == null || buyBids.length == 0) {
                // console.log('No any buyer bids found limit case');
                return
                throw new Error('No any buyer bids found');
            }
            let sellBids = await marketOrderModel.findAll({ where: { status: false, isCanceled: false, token_id: order?.token_id, order_type: marketOrderEnum.sell, market_type: marektTypeEnum.limit, queue: false }, raw: true, order: [['createdAt', "DESC"]] })
            // if seller not exist than return
            if (sellBids == null || sellBids.length == 0) {
                // console.log('No any seller bids found limit case');
                return
                throw new Error('No any seller bids found');
            }

            // return
            //=====================================================//
            //=================Partial execution===================//
            //=====================================================//
            for await (const buyer of buyBids) {
                let isMatchFound = false; // Flag to detect if any seller matches
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
                let is_fee_remove = false;

                for await (const seller of sellBids) {
                    // seller add in queue
                    let sellerObj = seller;
                    previous_seller.push(sellerObj.id);

                    if (buyerObj.token_id === sellerObj.token_id && buyerObj?.limit_usdt >= sellerObj.limit_usdt) {
                        isMatchFound = true;
                        // Both seller and buyer qty bid same 
                        if (sellerObj.token_amount === remainingAssets) {
                            console.log('===========execution 1');
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
                            buyerFees = scientificToDecimal(Number(truncateNumber(buyerFees.toFixed(12), 10)));
                            let sellerFees: any = (sellerObj.token_amount * sellerObj.limit_usdt * 0.001);
                            sellerFees = scientificToDecimal(Number(truncateNumber(sellerFees.toFixed(12), 10)));
                            console.log(buyerFees, '========buyerFees=======', sellerFees, '===========sellerFees===========');

                            await this.processBuyerExecution({ buyerObj, sellerObj, paid_usdt, sellerFees, buyerFees, remainingAssets, paid_to_admin });
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

                        // Seller qty bid more than buyer qty bid
                        else if (sellerObj.token_amount > remainingAssets) {
                            console.log('===========execution 2');
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
                            buyerFees = scientificToDecimal(Number(truncateNumber(buyerFees.toFixed(12), 10)));
                            let sellerFees: any = ((remainingAssets) * sellerObj.limit_usdt * 0.001);
                            sellerFees = scientificToDecimal(Number(truncateNumber(sellerFees.toFixed(12), 10)));
                            console.log(buyerFees, '========buyerFees=======', sellerFees, '===========sellerFees===========');

                            await this.processBuyerExecution({ buyerObj, sellerObj, paid_usdt, sellerFees, buyerFees, remainingAssets, paid_to_admin });
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

                        // Seller qty bid less than buyer qty bid
                        if (remainingAssets > sellerObj.token_amount) {
                            console.log('===========execution 3');
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
                            buyerFees = scientificToDecimal(Number(truncateNumber(buyerFees.toFixed(12), 10)));
                            let sellerFees: any = (sellerObj.token_amount * sellerObj.limit_usdt * 0.001);
                            sellerFees = scientificToDecimal(Number(truncateNumber(sellerFees.toFixed(12), 10)));
                            console.log(buyerFees, '========buyerFees=======', sellerFees, '===========sellerFees===========');
                            await this.processBuyerExecution({ buyerObj, sellerObj, paid_usdt, sellerFees, buyerFees, remainingAssets, paid_to_admin });
                            remainingAssets = preciseSubtraction(remainingAssets, sellerObj.token_amount);// Number((remainingAssets - sellerObj.token_amount).toPrecision(1));
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
                    console.log('========here not match any condition');
                    
                }

                // If no match was found for the current buyer, continue to the next buyer
                if (!isMatchFound) {
                    // previous_seller = [];
                    continue;
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
                    let updatedBal2: any = truncateNumber(Number(parseFloat(asset.balance) + options.paid_usdt), 10);
                    console.log(updatedBal2, '================updatedBal2 seller');
                    let updatedBal: any = preciseAddition(parseFloat(asset.balance), options.paid_usdt, 10);
                    console.log(updatedBal, '=========updatedBal seller');

                    // =========================================================//
                    // ================Fee Deduction from seller=================//
                    // =========================================================//
                    let final_updatedBal = truncateNumber(Number(updatedBal - options?.sellerFees), 10);
                    console.log(final_updatedBal, '===============final_updatedBal seller============');

                    updatedBal = preciseSubtraction(updatedBal, options?.sellerFees, 10)
                    console.log(updatedBal, '=========final updatedBal seller');

                    await marketDal.createAdminProfit(options?.buyerObj, 0, 0, options?.sellerObj.user_id, options?.sellerFees, 'USDT', 'Spot Trading');
                    await assetModel.update({ balance: updatedBal }, { where: { id: asset.id } });
                }
                else {
                    // =========================================================//
                    // ================Fee Deduction from seller=================//
                    // =========================================================//
                    // options.paid_usdt = truncateNumber(Number(options.paid_usdt - options?.sellerFees), 8);
                    options.paid_usdt = preciseSubtraction(options.paid_usdt, options?.sellerFees, 10)
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
                    // let updatedBal: any = truncateNumber(Number(parseFloat(buyerasset.balance) + options.remainingAssets), 8);
                    let updatedBal: any = preciseAddition(parseFloat(buyerasset.balance), options.remainingAssets, 10);
                    let realAmount = options.remainingAssets;
                    if (options.remainingAssets > options.sellerObj.token_amount) {
                        // updatedBal = parseFloat(buyerasset.balance) + parseFloat(options.sellerObj.token_amount);
                        updatedBal = preciseAddition(parseFloat(buyerasset.balance), parseFloat(options.sellerObj.token_amount), 10);
                        realAmount = parseFloat(options.sellerObj.token_amount);
                    }
                    // =========================================================//
                    // ================Fee Deduction from buyer=================//
                    // =========================================================//
                    let final_updatedBal = truncateNumber(Number(updatedBal - options?.buyerFees), 8);
                    console.log(final_updatedBal, '===============final_updatedBal buyer============');
                    updatedBal = preciseSubtraction(updatedBal, options?.buyerFees, 10)
                    console.log(updatedBal, '=========final updatedBal buyer');
                    await marketDal.createAdminProfit(options?.buyerObj, 0, 0, options?.sellerObj.user_id, options?.buyerFees, token?.symbol, 'Spot Trading');
                    await assetModel.update({ balance: updatedBal }, { where: { id: buyerasset.id } });
                }
                else {
                    let realAmount: any = options.remainingAssets;
                    if (options.remainingAssets > parseFloat(options.sellerObj.token_amount)) {
                        realAmount = parseFloat(options.sellerObj.token_amount);
                    }
                    // realAmount = truncateNumber(Number(realAmount - options?.buyerFees), 8);
                    realAmount = preciseSubtraction(realAmount, options?.buyerFees, 10);
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

    async marketBuyerCode(order: any): Promise<any> {
        try {

            // console.log('========i ma herer ');

            let previous_seller: any = [];
            let buyBids = await marketOrderModel.findAll({ where: { status: false, isCanceled: false, token_id: order?.token_id, order_type: marketOrderEnum.buy, market_type: marektTypeEnum.market, queue: false }, raw: true, order: [['id', "DESC"]] });
            // if buyer not exist than return
            if (buyBids == null || buyBids.length == 0) {
                // console.log('No any buyer bids found market case');
                return
                throw new Error('No any buyer bids found');
            }
            let sellBids = await marketOrderModel.findAll({ where: { status: false, isCanceled: false, token_id: order?.token_id, order_type: marketOrderEnum.sell, market_type: marektTypeEnum.market, queue: false }, raw: true, order: [['id', "DESC"]] })
            // if seller not exist than return
            if (sellBids == null || sellBids.length == 0) {
                // console.log('No any seller bids found market case');
                return
                throw new Error('No any seller bids found');
            }

            //=====================================================//
            //=================Partial execution===================//
            //=====================================================//
            for await (const buyer of buyBids) {
                let isMatchFound = false; // Flag to detect if any seller matches
                let buyerObj = buyer;
                let tokenFetch = await tokensModel.findOne({ where: { id: buyerObj.token_id }, raw: true });
                if (!tokenFetch) {
                    tokenFetch = await globalTokensModel.findOne({ where: { id: buyerObj.token_id }, raw: true });
                }
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
                    if (tokenFetch !== null && tokenFetch !== undefined && tokenFetch?.price !== undefined) {
                        if (buyerObj.token_id === sellerObj.token_id && sellerObj.limit_usdt <= tokenFetch.price) {
                            isMatchFound = true;
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
                                buyerFees = scientificToDecimal(Number(truncateNumber(buyerFees.toFixed(12), 10)));
                                let sellerFees: any = (sellerObj.token_amount * sellerObj.limit_usdt * 0.001);
                                sellerFees = scientificToDecimal(Number(truncateNumber(sellerFees.toFixed(12), 10)));
                                console.log(buyerFees, '========buyerFees=======', sellerFees, '===========sellerFees===========');
                                await this.processBuyerExecution({ buyerObj, sellerObj, paid_usdt, sellerFees, buyerFees, remainingAssets, paid_to_admin });
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
                                // console.log('========Seller qty bid more than buyer qty bid===============');
                                // console.log(preciseSubtraction(sellerObj.token_amount, remainingAssets), "=======remainingAssets buyer 2=======", remainingAssets, sellerObj.token_amount);
                                let buyerFees: any = remainingAssets * 0.001;
                                buyerFees = scientificToDecimal(Number(truncateNumber(buyerFees.toFixed(12), 10)));
                                let sellerFees: any = ((remainingAssets) * sellerObj.limit_usdt * 0.001);
                                sellerFees = scientificToDecimal(Number(truncateNumber(sellerFees.toFixed(12), 10)));
                                console.log(buyerFees, '========buyerFees=======', sellerFees, '===========sellerFees===========');
                                await this.processBuyerExecution({ buyerObj, sellerObj, paid_usdt, sellerFees, buyerFees, remainingAssets, paid_to_admin });
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
                                // console.log('========buyer qty bid more than seller qty bid===============');
                                // console.log(preciseSubtraction(remainingAssets, sellerObj.token_amount), "=======remainingAssets buyer 3=======", remainingAssets, sellerObj.token_amount);
                                let buyerFees: any = sellerObj.token_amount * 0.001;
                                buyerFees = scientificToDecimal(Number(truncateNumber(buyerFees.toFixed(12), 10)));
                                let sellerFees: any = (sellerObj.token_amount * sellerObj.limit_usdt * 0.001);
                                sellerFees = scientificToDecimal(Number(truncateNumber(sellerFees.toFixed(12), 10)));
                                console.log(buyerFees, '========buyerFees=======', sellerFees, '===========sellerFees===========');
                                await this.processBuyerExecution({ buyerObj, sellerObj, paid_usdt, sellerFees, buyerFees, remainingAssets, paid_to_admin });
                                remainingAssets = preciseSubtraction(remainingAssets, sellerObj.token_amount);

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
                        console.log('========here not match any condition');
                    }

                }

                // If no match was found for the current buyer, continue to the next buyer
                if (!isMatchFound) {
                    // previous_seller = [];
                    // console.log('No matching sellers found for this buyer, moving to the next buyer');
                    continue;
                }
            }

        } catch (error: any) {
            throw new Error(error.message);
        }
    }

}

export default cronMarketOrderService;
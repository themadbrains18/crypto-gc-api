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

function trimUnnecessaryDigits(value: number): string {
    return value.toFixed(10).replace(/(\.\d*?[1-9])0+$|\.0+$/, '$1');
}

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
        let hasMoreOrders = true;
        while (hasMoreOrders) {
            const orders = await marketOrderModel.findAll({
                where: { status: false, isCanceled: false, queue: false, order_type: 'buy' },
                raw: true,
                order: [['createdAt', "DESC"]]
            });
            await this.processOrders(orders);
        }
    }

    async processOrders(orders: any[]) {
        let count = 0;
        const processedOrders = new Set(); // Use a Set to track processed user_ids
        for await (const order of orders) {
            count++;
            const key = `${order.id}-${order.user_id}-${order.market_type}-${order.order_type}`;
            if (!processedOrders.has(key)) {
                processedOrders.add(key);
                if (order.market_type === marektTypeEnum.market && order?.order_type === marketOrderEnum.buy) {
                    await this.marketBuyerCode(order);
                } else if (order.market_type === marektTypeEnum.limit && order?.order_type === marketOrderEnum.buy) {
                    await this.buyerCode(order);
                }
            }
        }
    }

    async buyerCode(order: any): Promise<any> {
        try {
            let previous_seller: any = [];
            console.log();

            let buyBids = await marketOrderModel.findAll({ where: { status: false, isCanceled: false, user_id: order?.user_id, token_id: order?.token_id, order_type: marketOrderEnum.buy, market_type: marektTypeEnum.limit, queue: false }, raw: true, order: [['createdAt', "DESC"]] });
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
                    if (buyerObj.token_id === sellerObj.token_id && buyerObj?.limit_usdt >= sellerObj.limit_usdt) {
                        previous_seller.push(sellerObj.id);
                        isMatchFound = true;
                        // Both seller and buyer qty bid same 
                        if (sellerObj.token_amount === remainingAssets) {
                            console.log('===========execution 1');
                            await marketOrderModel.update({ queue: true }, { where: { id: buyerObj.id } });
                            await marketOrderModel.update({ queue: true }, { where: { id: sellerObj.id } });
                            paid_usdt = truncateNumber((sellerObj.limit_usdt * sellerObj.token_amount), 10);
                            let ttl = truncateNumber((buyerObj.limit_usdt * sellerObj.token_amount), 10);
                            let paid_to_admin = preciseSubtraction(ttl, paid_usdt, 10);
                            // let paid_to_admin = truncateNumber(((buyerObj.limit_usdt * sellerObj.token_amount) - paid_usdt), 8);
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
                            // console.log(preciseSubtraction(sellerObj.token_amount, remainingAssets,10), "=======remainingAssets buyer 1=======", remainingAssets, sellerObj.token_amount);
                            let buyerFees: any = remainingAssets * 0.001;
                            buyerFees = scientificToDecimal(Number(truncateNumber(buyerFees.toFixed(12), 10)));
                            let sellerFees: any = (sellerObj.token_amount * sellerObj.limit_usdt * 0.001);
                            sellerFees = scientificToDecimal(Number(truncateNumber(sellerFees.toFixed(12), 10)));
                            // console.log(buyerFees, '========buyerFees=======', sellerFees, '===========sellerFees===========',buyerObj.user_id);

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
                            console.log('===========execution 2');
                            await marketOrderModel.update({ queue: true }, { where: { id: buyerObj.id } });
                            await marketOrderModel.update({ queue: true }, { where: { id: sellerObj.id } });
                            paid_usdt = truncateNumber((sellerObj.limit_usdt * remainingAssets), 10);
                            let ttl = truncateNumber((buyerObj.limit_usdt * remainingAssets), 10);
                            let paid_to_admin = preciseSubtraction(ttl, paid_usdt, 10);
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
                            // console.log(preciseSubtraction(sellerObj.token_amount, remainingAssets,10), "=======remainingAssets buyer 2=======", remainingAssets, sellerObj.token_amount);
                            let buyerFees: any = remainingAssets * 0.001;
                            buyerFees = scientificToDecimal(Number(truncateNumber(buyerFees.toFixed(12), 10)));
                            let sellerFees: any = ((remainingAssets) * sellerObj.limit_usdt * 0.001);
                            sellerFees = scientificToDecimal(Number(truncateNumber(sellerFees.toFixed(12), 10)));
                            // console.log(buyerFees, '========buyerFees=======', sellerFees, '===========sellerFees===========',buyerObj.user_id);

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
                            console.log('===========execution 3');
                            await marketOrderModel.update({ queue: true }, { where: { id: buyerObj.id } });
                            await marketOrderModel.update({ queue: true }, { where: { id: sellerObj.id } });
                            paid_usdt = truncateNumber(sellerObj.limit_usdt * sellerObj.token_amount, 10);
                            let ttl = truncateNumber((buyerObj.limit_usdt * sellerObj.token_amount), 10);
                            let paid_to_admin = preciseSubtraction(ttl, paid_usdt, 10);
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
                            // console.log(preciseSubtraction(remainingAssets, sellerObj.token_amount,10), "=======remainingAssets buyer 3=======", remainingAssets, sellerObj.token_amount);
                            let buyerFees: any = sellerObj.token_amount * 0.001;
                            buyerFees = scientificToDecimal(Number(truncateNumber(buyerFees.toFixed(12), 10)));
                            let sellerFees: any = (sellerObj.token_amount * sellerObj.limit_usdt * 0.001);
                            sellerFees = scientificToDecimal(Number(truncateNumber(sellerFees.toFixed(12), 10)));
                            // console.log(buyerFees, '========buyerFees=======', sellerFees, '===========sellerFees===========',buyerObj.user_id);
                            await this.processBuyerExecution({ buyerObj, sellerObj, paid_usdt, sellerFees, buyerFees, remainingAssets, paid_to_admin });
                            remainingAssets = preciseSubtraction(remainingAssets, sellerObj.token_amount, 10);// Number((remainingAssets - sellerObj.token_amount).toPrecision(1));
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

                // If no match was found for the current buyer, continue to the next buyer
                // if (!isMatchFound) {
                //     console.log('==========i ma herer');

                //     // previous_seller = [];
                //     continue;
                // }
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
                    let updatedBal: any = scientificToDecimal(preciseAddition(parseFloat(asset.balance), options.paid_usdt, 10));
                    // =========================================================//
                    // ================Fee Deduction from seller=================//
                    // =========================================================//
                    updatedBal = scientificToDecimal(truncateNumber(Number(preciseSubtraction(updatedBal, options?.sellerFees, 10).toFixed(12)), 10));
                    await marketDal.createAdminProfit(options?.buyerObj, 0, 0, options?.sellerObj.user_id, options?.sellerFees, 'USDT', 'Spot Trading');
                    await assetModel.update({ balance: updatedBal }, { where: { id: asset.id } });
                }
                else {
                    // =========================================================//
                    // ================Fee Deduction from seller=================//
                    // =========================================================//
                    // options.paid_usdt = truncateNumber(Number(options.paid_usdt - options?.sellerFees), 8);
                    options.paid_usdt = Number(scientificToDecimal(truncateNumber(Number(preciseSubtraction(options.paid_usdt, options?.sellerFees, 10).toFixed(12)), 10)));
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
                    let updatedBal: any = scientificToDecimal(preciseAddition(parseFloat(buyerasset.balance), options.remainingAssets, 10));
                    let realAmount = options.remainingAssets;
                    if (options.remainingAssets > options.sellerObj.token_amount) {
                        updatedBal = scientificToDecimal(preciseAddition(parseFloat(buyerasset.balance), parseFloat(options.sellerObj.token_amount), 10));
                        realAmount = parseFloat(options.sellerObj.token_amount);
                    }
                    // =========================================================//
                    // ================Fee Deduction from buyer=================//
                    // =========================================================//
                    updatedBal = scientificToDecimal(truncateNumber(Number(preciseSubtraction(updatedBal, options?.buyerFees, 10).toFixed(12)), 10));
                    await marketDal.createAdminProfit(options?.buyerObj, 0, 0, options?.sellerObj.user_id, options?.buyerFees, token?.symbol, 'Spot Trading');
                    await assetModel.update({ balance: updatedBal }, { where: { id: buyerasset.id } });
                }
                else {
                    let realAmount: any = options.remainingAssets;
                    if (options.remainingAssets > parseFloat(options.sellerObj.token_amount)) {
                        realAmount = parseFloat(options.sellerObj.token_amount);
                    }
                    realAmount = scientificToDecimal(truncateNumber(Number(preciseSubtraction(realAmount, options?.buyerFees, 10).toFixed(12)), 10));
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
                    let token_amount = preciseSubtraction(options.remainingAssets, parseFloat(options.sellerObj.token_amount), 10); //Number((options.remainingAssets - parseFloat(options.sellerObj.token_amount)).toPrecision(1));
                    token_amount = Number(scientificToDecimal(Number(truncateNumber(Number(token_amount.toFixed(12)), 10))));

                    let volume_usdt = preciseSubtraction(buyerOrder.volume_usdt, Number(options.paid_usdt + options.paid_to_admin), 10);
                    volume_usdt = Number(scientificToDecimal(Number(truncateNumber(Number(volume_usdt.toFixed(12)), 10))));

                    await marketOrderModel.update({
                        volume_usdt: volume_usdt,
                        token_amount: token_amount,
                        queue: false
                    }, { where: { id: buyerOrder.id }});
                }
                if (sellerOrder) {
                    await marketOrderModel.update({ status: true }, { where: { id: sellerOrder.id } });
                }
            }
            else if (options.sellerObj.token_amount > options.remainingAssets) {
                if (sellerOrder) {
                    let sellerStatus = false;

                    let token_amount = preciseSubtraction(sellerOrder.token_amount, options.remainingAssets, 10); //Number(sellerOrder.token_amount - options.remainingAssets);
                    let volume_usdt = preciseSubtraction(sellerOrder.volume_usdt, options.paid_usdt, 10); //Number((parseFloat(sellerOrder.volume_usdt) - options.paid_usdt).toPrecision(1));

                    if (token_amount === 0 || token_amount < 0 || volume_usdt < 0) {
                        sellerStatus = true;
                        token_amount = 0;
                        volume_usdt = 0;
                    }

                    token_amount = Number(scientificToDecimal(Number(truncateNumber(Number(token_amount.toFixed(12)), 10))));
                    volume_usdt = Number(scientificToDecimal(Number(truncateNumber(Number(volume_usdt.toFixed(12)), 10))));

                    await marketOrderModel.update({
                        status: sellerStatus,
                        token_amount: token_amount,
                        volume_usdt: volume_usdt,
                        queue: false
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
            let previous_seller: any = [];
            let buyBids = await marketOrderModel.findAll({ where: { status: false, isCanceled: false, user_id: order?.user_id, token_id: order?.token_id, order_type: marketOrderEnum.buy, market_type: marektTypeEnum.market, queue: false }, raw: true, order: [['id', "DESC"]] });
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
                    if (tokenFetch !== null && tokenFetch !== undefined && tokenFetch?.price !== undefined) {
                        if (buyerObj.token_id === sellerObj.token_id && sellerObj.limit_usdt <= tokenFetch.price) {
                            isMatchFound = true;
                            previous_seller.push(sellerObj.id);
                            if (sellerObj.token_amount === remainingAssets) {
                                await marketOrderModel.update({ queue: true }, { where: { id: buyerObj.id } });
                                await marketOrderModel.update({ queue: true }, { where: { id: sellerObj.id } });
                                paid_usdt = truncateNumber(sellerObj.limit_usdt * sellerObj.token_amount, 10);

                                let ttl = truncateNumber((buyerObj.limit_usdt * sellerObj.token_amount), 10);
                                let paid_to_admin = preciseSubtraction(ttl, paid_usdt, 10);
                                // let paid_to_admin = (buyerObj.limit_usdt * sellerObj.token_amount) - paid_usdt;
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
                                paid_usdt = truncateNumber(sellerObj.limit_usdt * remainingAssets, 10);
                                let ttl = truncateNumber((buyerObj.limit_usdt * remainingAssets), 10);
                                let paid_to_admin = preciseSubtraction(ttl, paid_usdt, 10);
                                // let paid_to_admin = (buyerObj.limit_usdt * remainingAssets) - paid_usdt;
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
                                paid_usdt = truncateNumber(sellerObj.limit_usdt * sellerObj.token_amount, 10);
                                let ttl = truncateNumber((buyerObj.limit_usdt * sellerObj.token_amount), 10);
                                let paid_to_admin = preciseSubtraction(ttl, paid_usdt, 10);
                                // let paid_to_admin = (buyerObj.limit_usdt * sellerObj.token_amount) - paid_usdt;
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
                                // console.log(buyerFees, '========buyerFees=======', sellerFees, '===========sellerFees===========');
                                await this.processBuyerExecution({ buyerObj, sellerObj, paid_usdt, sellerFees, buyerFees, remainingAssets, paid_to_admin });
                                remainingAssets = preciseSubtraction(remainingAssets, sellerObj.token_amount, 10);

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
                        // console.log('========here not match any condition');
                    }

                }

                // // If no match was found for the current buyer, continue to the next buyer
                // if (!isMatchFound) {
                //     // previous_seller = [];
                //     // console.log('No matching sellers found for this buyer, moving to the next buyer');
                //     // continue;
                // }
            }

        } catch (error: any) {
            throw new Error(error.message);
        }
    }

}

export default cronMarketOrderService;
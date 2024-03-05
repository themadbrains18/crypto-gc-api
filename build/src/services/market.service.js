"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("../models");
const market_dal_1 = __importDefault(require("../models/dal/market.dal"));
const marketorder_model_1 = __importDefault(require("../models/model/marketorder.model"));
const interface_1 = require("../utils/interface");
const service_1 = __importDefault(require("./service"));
class marketService {
    async create(payload) {
        return await market_dal_1.default.create(payload);
    }
    async getList(userid) {
        return await market_dal_1.default.getOrderList(userid);
    }
    async getListByLimit(userid, offset, limit) {
        return await market_dal_1.default.getOrderListByLimit(userid, offset, limit);
    }
    async getAllMarketOrder() {
        return await market_dal_1.default.getMarketOrderList();
    }
    async getAllMarketOrderByLimit(offset, limit) {
        return await market_dal_1.default.getMarketOrderListByLimit(offset, limit);
    }
    async getMarketOrderById(order_id) {
        try {
            let order = await marketorder_model_1.default.findOne({ where: { id: order_id }, raw: true });
            return order;
        }
        catch (error) {
            throw new Error(error.message);
        }
    }
    async cancelOrder(payload) {
        return await market_dal_1.default.cancelOrder(payload);
    }
    async getListByTokenId(token_id) {
        return await market_dal_1.default.getOrderListByTokenId(token_id);
    }
    async getOrderListByTokenIdUserId(token_id, user_id) {
        return market_dal_1.default.getOrderListByTokenIdUserId(token_id, user_id);
    }
    async getOrderHistoryByTokenIdUserId(token_id, user_id) {
        return market_dal_1.default.getOrderHistoryByTokenIdUserId(token_id, user_id);
    }
    async getGlobalTokenPrice(symbol) {
        try {
            let priceObj = await fetch('https://min-api.cryptocompare.com/data/pricemultifull?fsyms=' + symbol + '&tsyms=USDT&api_key=' + process.env.MIN_API_KEY).then(response => response.json()).then(result => { return result; })
                .catch(console.error);
        }
        catch (error) {
            throw new Error(error.message);
        }
    }
    // partial order code
    async marketPartialOrder(payload) {
        return await market_dal_1.default.socketMarketBuySell(payload);
    }
    //====================================================
    //=============Limit based order execution============
    //====================================================
    async buySellOnLimit(payload) {
        try {
            if (payload.order_type === interface_1.marketOrderEnum.buy) {
                await this.buyerCode(payload);
            }
            if (payload.order_type === interface_1.marketOrderEnum.sell) {
                await this.sellerCode(payload);
            }
        }
        catch (error) {
            throw new Error(error.message);
        }
    }
    async buyerCode(payload) {
        try {
            let previous_seller = [];
            let buyBids = await marketorder_model_1.default.findAll({ where: { status: false, isCanceled: false, user_id: payload?.user_id, token_id: payload?.token_id, order_type: interface_1.marketOrderEnum.buy, market_type: interface_1.marektTypeEnum.limit, queue: false }, order: [['id', "DESC"]] });
            // if buyer not exist than return
            if (buyBids == null || buyBids.length == 0) {
                throw new Error('No any buyer bids found');
            }
            let sellBids = await marketorder_model_1.default.findAll({ where: { status: false, isCanceled: false, token_id: payload?.token_id, order_type: interface_1.marketOrderEnum.sell, market_type: interface_1.marektTypeEnum.limit, queue: false }, order: [['id', "DESC"]] });
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
                    });
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
                            await marketorder_model_1.default.update({ queue: true }, { where: { id: buyerObj.id } });
                            await marketorder_model_1.default.update({ queue: true }, { where: { id: sellerObj.id } });
                            paid_usdt = sellerObj.limit_usdt * sellerObj.token_amount;
                            let paid_to_admin = (buyerObj.limit_usdt * sellerObj.token_amount) - paid_usdt;
                            if (paid_to_admin > 0) {
                                //======================================================
                                //=============Create admin profit======================
                                //======================================================
                                await market_dal_1.default.createAdminProfit(buyerObj, paid_usdt, paid_to_admin, sellerObj.user_id, 0, 'USDT', 'Spot Trading');
                            }
                            //======================================================
                            //=============Buyer and seller asset execution=========
                            //======================================================
                            await this.processBuyerExecution({ buyerObj, sellerObj, paid_usdt, remainingAssets, paid_to_admin });
                            //======================================================
                            //=============Create buyer market order history========
                            //======================================================
                            await market_dal_1.default.createMarketOrderHistory(buyerObj, sellerObj.token_amount, paid_usdt);
                            //======================================================
                            //=============Create seller market order history=======
                            //======================================================
                            await market_dal_1.default.createMarketOrderHistory(sellerObj, sellerObj.token_amount, paid_usdt);
                            break;
                        }
                        else if (sellerObj.token_amount > remainingAssets) {
                            await marketorder_model_1.default.update({ queue: true }, { where: { id: buyerObj.id } });
                            await marketorder_model_1.default.update({ queue: true }, { where: { id: sellerObj.id } });
                            paid_usdt = sellerObj.limit_usdt * remainingAssets;
                            let paid_to_admin = (buyerObj.limit_usdt * remainingAssets) - paid_usdt;
                            if (paid_to_admin > 0) {
                                //======================================================
                                //=============Create admin profit======================
                                //======================================================
                                await market_dal_1.default.createAdminProfit(buyerObj, paid_usdt, paid_to_admin, sellerObj.user_id, 0, 'USDT', 'Spot Trading');
                            }
                            //======================================================
                            //=============Buyer and seller asset execution=========
                            //======================================================
                            await this.processBuyerExecution({ buyerObj, sellerObj, paid_usdt, remainingAssets, paid_to_admin });
                            //======================================================
                            //=============Create buyer market order history========
                            //======================================================
                            await market_dal_1.default.createMarketOrderHistory(buyerObj, remainingAssets, paid_usdt);
                            //======================================================
                            //=============Create seller market order history=======
                            //======================================================
                            await market_dal_1.default.createMarketOrderHistory(sellerObj, remainingAssets, paid_usdt);
                            break;
                        }
                        if (remainingAssets > sellerObj.token_amount) {
                            await marketorder_model_1.default.update({ queue: true }, { where: { id: buyerObj.id } });
                            await marketorder_model_1.default.update({ queue: true }, { where: { id: sellerObj.id } });
                            paid_usdt = sellerObj.limit_usdt * sellerObj.token_amount;
                            let paid_to_admin = (buyerObj.limit_usdt * sellerObj.token_amount) - paid_usdt;
                            if (paid_to_admin > 0) {
                                //======================================================
                                //=============Create admin profit======================
                                //======================================================
                                await market_dal_1.default.createAdminProfit(buyerObj, paid_usdt, paid_to_admin, sellerObj.user_id, 0, 'USDT', 'Spot Trading');
                            }
                            //======================================================
                            //=============Buyer and seller asset execution=========
                            //======================================================
                            await this.processBuyerExecution({ buyerObj, sellerObj, paid_usdt, remainingAssets, paid_to_admin });
                            remainingAssets = remainingAssets - sellerObj.token_amount;
                            //======================================================
                            //=============Create buyer market order history========
                            //======================================================
                            await market_dal_1.default.createMarketOrderHistory(buyerObj, sellerObj.token_amount, paid_usdt);
                            //======================================================
                            //=============Create seller market order history=======
                            //======================================================
                            await market_dal_1.default.createMarketOrderHistory(sellerObj, sellerObj.token_amount, paid_usdt);
                        }
                    }
                }
            }
        }
        catch (error) {
            throw new Error(error.message);
        }
    }
    async processBuyerExecution(options) {
        try {
            console.log('here code for buyer');
            let sellerusdtmarket = await this.getMarketOrderById(options.sellerObj.id);
            if (sellerusdtmarket.status === false || sellerusdtmarket.status === 0) {
                let tokensData = await models_1.tokensModel.findOne({ where: { symbol: 'USDT' }, raw: true });
                let token = tokensData;
                if (token === null) {
                    tokensData = await models_1.globalTokensModel.findOne({ where: { symbol: 'USDT' }, raw: true });
                    token = tokensData;
                }
                let asset = await service_1.default.assets.getUserAssetByTokenIdandWallet({ user_id: options.sellerObj.user_id, token_id: token?.id });
                if (asset) {
                    let updatedBal = parseFloat(asset.balance) + options.paid_usdt;
                    // =========================================================//
                    // ================Fee Deduction from seller=================//
                    // =========================================================//
                    let deductFee = options.remainingAssets * options.sellerObj?.limit_usdt * 0.00075;
                    updatedBal = updatedBal - deductFee;
                    console.log(deductFee, '===============seller 1 processBuyerExecution');
                    // ============Here fee add to admin wallet==================//
                    await market_dal_1.default.createAdminProfit(options?.buyerObj, 0, 0, options?.sellerObj.user_id, deductFee, 'USDT', 'Spot Trading');
                    console.log('seller assets updated Bal', updatedBal);
                    await models_1.assetModel.update({ balance: updatedBal }, { where: { id: asset.id } });
                }
                else {
                    // =========================================================//
                    // ================Fee Deduction from seller=================//
                    // =========================================================//
                    let deductFee = options.remainingAssets * options.sellerObj?.limit_usdt * 0.00075;
                    options.paid_usdt = options.paid_usdt - deductFee;
                    console.log(deductFee, '===============seller 2 processBuyerExecution');
                    // ============Here fee add to admin wallet==================//
                    await market_dal_1.default.createAdminProfit(options?.buyerObj, 0, 0, options?.sellerObj.user_id, deductFee, 'USDT', 'Spot Trading');
                    let assets = {
                        walletTtype: interface_1.assetsWalletType.main_wallet,
                        balance: options.paid_usdt,
                        account_type: interface_1.assetsAccountType.main_account,
                        token_id: token?.id,
                        user_id: options.sellerObj.user_id
                    };
                    await models_1.assetModel.create(assets);
                }
            }
            let buyerusdtmarket = await this.getMarketOrderById(options.buyerObj.id);
            let token = await models_1.tokensModel.findOne({ where: { id: options?.buyerObj?.token_id }, raw: true });
            if (token === null) {
                token = await models_1.globalTokensModel.findOne({ where: { id: options?.buyerObj?.token_id }, raw: true });
            }
            if (buyerusdtmarket?.status === false || buyerusdtmarket?.status === 0) {
                let buyerasset = await service_1.default.assets.getUserAssetByTokenIdandWallet({ user_id: options.buyerObj.user_id, token_id: options.buyerObj.token_id });
                if (buyerasset) {
                    let updatedBal = parseFloat(buyerasset.balance) + options.remainingAssets;
                    let realAmount = options.remainingAssets;
                    if (options.remainingAssets > options.sellerObj.token_amount) {
                        updatedBal = parseFloat(buyerasset.balance) + parseFloat(options.sellerObj.token_amount);
                        realAmount = parseFloat(options.sellerObj.token_amount);
                    }
                    // =========================================================//
                    // ================Fee Deduction from buyer=================//
                    // =========================================================//
                    let deductFee = options.remainingAssets * 0.00075;
                    updatedBal = updatedBal - deductFee;
                    console.log(deductFee, '===============buyer 1');
                    // ============Here fee add to admin wallet==================//
                    await market_dal_1.default.createAdminProfit(options?.buyerObj, 0, 0, options?.sellerObj.user_id, deductFee, token?.symbol, 'Spot Trading');
                    console.log('buyer assets updated Bal', updatedBal);
                    await models_1.assetModel.update({ balance: updatedBal }, { where: { id: buyerasset.id } });
                }
                else {
                    let realAmount = options.remainingAssets;
                    if (options.remainingAssets > parseFloat(options.sellerObj.token_amount)) {
                        realAmount = parseFloat(options.sellerObj.token_amount);
                    }
                    // =========================================================//
                    // ================Fee Deduction from buyer=================//
                    // =========================================================//
                    let deductFee = options.remainingAssets * 0.00075;
                    realAmount = realAmount - deductFee;
                    console.log(deductFee, '===============buyer 2');
                    // ============Here fee add to admin wallet==================//
                    await market_dal_1.default.createAdminProfit(options?.buyerObj, 0, 0, options?.sellerObj.user_id, deductFee, token?.symbol, 'Spot Trading');
                    let assets = {
                        walletTtype: interface_1.assetsWalletType.main_wallet,
                        balance: realAmount,
                        account_type: interface_1.assetsAccountType.main_account,
                        token_id: options.buyerObj.token_id,
                        user_id: options.buyerObj.user_id
                    };
                    await models_1.assetModel.create(assets);
                }
            }
            //======================================================
            //============= update market order status =============
            //======================================================
            await this.updateBuyerOrderStatus(options);
        }
        catch (error) {
            throw new Error(error.message);
        }
    }
    async updateBuyerOrderStatus(options) {
        try {
            console.log('========here 5');
            let sellerOrder = await this.getMarketOrderById(options.sellerObj.id);
            let buyerOrder = await this.getMarketOrderById(options.buyerObj.id);
            if (options.remainingAssets === parseFloat(options.sellerObj.token_amount)) {
                if (sellerOrder) {
                    await marketorder_model_1.default.update({ status: true }, { where: { id: sellerOrder.id } });
                }
                if (buyerOrder) {
                    await marketorder_model_1.default.update({ status: true }, { where: { id: buyerOrder.id } });
                }
            }
            else if (options.remainingAssets > parseFloat(options.sellerObj.token_amount)) {
                if (buyerOrder) {
                    await marketorder_model_1.default.update({
                        volume_usdt: parseFloat(buyerOrder.volume_usdt) - (options.paid_usdt + options.paid_to_admin),
                        token_amount: (options.remainingAssets - parseFloat(options.sellerObj.token_amount)), queue: false
                    }, { where: { id: buyerOrder.id } });
                }
                if (sellerOrder) {
                    await marketorder_model_1.default.update({ status: true }, { where: { id: sellerOrder.id } });
                }
            }
            else if (options.sellerObj.token_amount > options.remainingAssets) {
                if (sellerOrder) {
                    let sellerStatus = false;
                    let remainingAmount = parseFloat(sellerOrder.token_amount) - options.remainingAssets;
                    let volume_usdt = parseFloat(sellerOrder.volume_usdt) - options.paid_usdt;
                    console.log(remainingAmount, '-----------remainingAmount');
                    console.log(volume_usdt, '-------------------volume_usdt');
                    if (remainingAmount === 0 || remainingAmount < 0 || volume_usdt < 0) {
                        sellerStatus = true;
                        remainingAmount = 0;
                        volume_usdt = 0;
                    }
                    await marketorder_model_1.default.update({
                        status: sellerStatus, token_amount: remainingAmount,
                        volume_usdt: volume_usdt, queue: false
                    }, { where: { id: sellerOrder.id } });
                }
                if (buyerOrder) {
                    await marketorder_model_1.default.update({ status: true }, { where: { id: buyerOrder.id } });
                }
            }
        }
        catch (error) {
            throw new Error(error.message);
        }
    }
    async sellerCode(payload) {
        try {
            console.log('========here 2');
            let previous_buyer = [];
            // if buyer not exist than return
            let buyBids = await marketorder_model_1.default.findAll({ where: { status: false, isCanceled: false, token_id: payload?.token_id, order_type: interface_1.marketOrderEnum.buy, market_type: interface_1.marektTypeEnum.limit, queue: false }, order: [['id', "DESC"]] });
            if (buyBids == null || buyBids.length == 0) {
                throw new Error('No any buyer bids found');
            }
            // if seller not exist than return
            let sellBids = await marketorder_model_1.default.findAll({ where: { status: false, isCanceled: false, user_id: payload?.user_id, token_id: payload?.token_id, order_type: interface_1.marketOrderEnum.sell, market_type: interface_1.marektTypeEnum.limit, queue: false }, order: [['id', "DESC"]] });
            if (sellBids == null || sellBids.length == 0) {
                throw new Error('No any seller bids found');
            }
            for await (const seller of sellBids) {
                let sellerObj = seller?.dataValues;
                if (previous_buyer.length > 0) {
                    buyBids = buyBids.filter((item) => {
                        if (!previous_buyer.includes(item?.dataValues.id))
                            return item;
                    });
                }
                let remainingAssets = sellerObj.token_amount;
                // let counter = 0;
                let paid_usdt = 0;
                for await (const buyer of buyBids) {
                    let buyerObj = buyer?.dataValues;
                    previous_buyer.push(buyerObj.id);
                    if (buyerObj.token_id === sellerObj.token_id && (buyerObj.limit_usdt >= sellerObj.limit_usdt)) {
                        if (buyerObj.token_amount === remainingAssets) {
                            await marketorder_model_1.default.update({ queue: true }, { where: { id: sellerObj.id } });
                            await marketorder_model_1.default.update({ queue: true }, { where: { id: buyerObj.id } });
                            paid_usdt = sellerObj.limit_usdt * remainingAssets;
                            let paid_to_admin = (buyerObj.limit_usdt * remainingAssets) - paid_usdt;
                            if (paid_to_admin > 0) {
                                //======================================================
                                //=============Create admin profit======================
                                //======================================================
                                await market_dal_1.default.createAdminProfit(buyerObj, paid_usdt, paid_to_admin, sellerObj.user_id, 0, 'USDT', 'Spot Trading');
                            }
                            //======================================================
                            //=============Buyer and seller asset execution=========
                            //======================================================
                            await this.processSellerExecution({ buyerObj, sellerObj, paid_usdt, remainingAssets, paid_to_admin });
                            //======================================================
                            //=============Create buyer market order history========
                            //======================================================
                            await market_dal_1.default.createMarketOrderHistory(buyerObj, buyerObj.token_amount, paid_usdt);
                            //======================================================
                            //=============Create seller market order history=======
                            //======================================================
                            await market_dal_1.default.createMarketOrderHistory(sellerObj, remainingAssets, paid_usdt);
                            break;
                        }
                        else if (buyerObj.token_amount > remainingAssets) {
                            await marketorder_model_1.default.update({ queue: true }, { where: { id: sellerObj.id } });
                            await marketorder_model_1.default.update({ queue: true }, { where: { id: buyerObj.id } });
                            paid_usdt = sellerObj.limit_usdt * remainingAssets;
                            let paid_to_admin = (buyerObj.limit_usdt * remainingAssets) - paid_usdt;
                            if (paid_to_admin > 0) {
                                //======================================================
                                //=============Create admin profit======================
                                //======================================================
                                await market_dal_1.default.createAdminProfit(buyerObj, paid_usdt, paid_to_admin, sellerObj.user_id, 0, 'USDT', 'Spot Trading');
                            }
                            //======================================================
                            //=============Buyer and seller asset execution=========
                            //======================================================
                            await this.processSellerExecution({ buyerObj, sellerObj, paid_usdt, remainingAssets, paid_to_admin });
                            //======================================================
                            //=============Create buyer market order history========
                            //======================================================
                            await market_dal_1.default.createMarketOrderHistory(buyerObj, remainingAssets, paid_usdt);
                            //======================================================
                            //=============Create seller market order history=======
                            //======================================================
                            await market_dal_1.default.createMarketOrderHistory(sellerObj, remainingAssets, paid_usdt);
                            break;
                        }
                        if (remainingAssets > buyerObj.token_amount) {
                            await marketorder_model_1.default.update({ queue: true }, { where: { id: sellerObj.id } });
                            await marketorder_model_1.default.update({ queue: true }, { where: { id: buyerObj.id } });
                            paid_usdt = sellerObj.limit_usdt * buyerObj.token_amount;
                            let paid_to_admin = (buyerObj.limit_usdt * buyerObj.token_amount) - paid_usdt;
                            if (paid_to_admin > 0) {
                                //======================================================
                                //=============Create admin profit======================
                                //======================================================
                                await market_dal_1.default.createAdminProfit(buyerObj, paid_usdt, paid_to_admin, sellerObj.user_id, 0, 'USDT', 'Spot Trading');
                            }
                            //======================================================
                            //=============Buyer and seller asset execution=========
                            //======================================================
                            await this.processSellerExecution({ buyerObj, sellerObj, paid_usdt, remainingAssets, paid_to_admin });
                            remainingAssets = remainingAssets - buyerObj.token_amount;
                            //======================================================
                            //=============Create buyer market order history========
                            //======================================================
                            await market_dal_1.default.createMarketOrderHistory(buyerObj, buyerObj.token_amount, paid_usdt);
                            //======================================================
                            //=============Create seller market order history=======
                            //======================================================
                            await market_dal_1.default.createMarketOrderHistory(sellerObj, buyerObj.token_amount, paid_usdt);
                        }
                    }
                }
            }
        }
        catch (error) {
            throw new Error(error.message);
        }
    }
    async processSellerExecution(options) {
        try {
            console.log('here code for seller');
            let sellerusdtmarket = await this.getMarketOrderById(options.sellerObj.id);
            if (sellerusdtmarket.status === false || sellerusdtmarket.status === 0) {
                let tokensData = await models_1.tokensModel.findOne({ where: { symbol: 'USDT' }, raw: true });
                let token = tokensData;
                if (token === null) {
                    tokensData = await models_1.globalTokensModel.findOne({ where: { symbol: 'USDT' }, raw: true });
                    token = tokensData;
                }
                let asset = await service_1.default.assets.getUserAssetByTokenIdandWallet({ user_id: options.sellerObj.user_id, token_id: token?.id });
                if (asset) {
                    let updatedBal = parseFloat(asset.balance) + options.paid_usdt;
                    // =========================================================//
                    // ================Fee Deduction from seller=================//
                    // =========================================================//
                    let deductFee = options.remainingAssets * options.sellerObj?.limit_usdt * 0.00075;
                    updatedBal = updatedBal - deductFee;
                    console.log(deductFee, '===============seller 1');
                    // ============Here fee add to admin wallet==================//
                    await market_dal_1.default.createAdminProfit(options?.buyerObj, 0, 0, options?.sellerObj.user_id, deductFee, 'USDT', 'Spot Trading');
                    console.log('seller assets updated Bal', updatedBal);
                    await models_1.assetModel.update({ balance: updatedBal }, { where: { id: asset.id } });
                }
                else {
                    // =========================================================//
                    // ================Fee Deduction from seller=================//
                    // =========================================================//
                    let deductFee = options.remainingAssets * options.sellerObj?.limit_usdt * 0.00075;
                    options.paid_usdt = options.paid_usdt - deductFee;
                    console.log(deductFee, '===============seller 2');
                    // ============Here fee add to admin wallet==================//
                    await market_dal_1.default.createAdminProfit(options?.buyerObj, 0, 0, options?.sellerObj.user_id, deductFee, 'USDT', 'Spot Trading');
                    let assets = {
                        walletTtype: interface_1.assetsWalletType.main_wallet,
                        balance: options.paid_usdt,
                        account_type: interface_1.assetsAccountType.main_account,
                        token_id: token?.id,
                        user_id: options.sellerObj.user_id
                    };
                    await models_1.assetModel.create(assets);
                }
            }
            let buyerusdtmarket = await this.getMarketOrderById(options.buyerObj.id);
            let token = await models_1.tokensModel.findOne({ where: { id: options?.buyerObj?.token_id }, raw: true });
            if (token === null) {
                token = await models_1.globalTokensModel.findOne({ where: { id: options?.buyerObj?.token_id }, raw: true });
            }
            if (buyerusdtmarket?.status === false || buyerusdtmarket?.status === 0) {
                let asset = await service_1.default.assets.getUserAssetByTokenIdandWallet({ user_id: options.buyerObj.user_id, token_id: options.buyerObj.token_id });
                if (asset) {
                    let updatedBal = parseFloat(asset.balance) + options.buyerObj.token_amount;
                    let realAmount = parseFloat(options.buyerObj.token_amount);
                    if (options.buyerObj.token_amount > options.remainingAssets) {
                        updatedBal = parseFloat(asset.balance) + options.remainingAssets;
                        realAmount = options.remainingAssets;
                    }
                    // =========================================================//
                    // ================Fee Deduction from Buyer=================//
                    // =========================================================//
                    let deductFee = options.remainingAssets * 0.00075;
                    updatedBal = updatedBal - deductFee;
                    console.log(deductFee, '===============buyer 1 processSellerExecution');
                    // ============Here fee add to admin wallet==================//
                    await market_dal_1.default.createAdminProfit(options?.buyerObj, 0, 0, options?.sellerObj.user_id, deductFee, token?.symbol, 'Spot Trading');
                    console.log('buyer assets updated Bal', updatedBal);
                    await models_1.assetModel.update({ balance: updatedBal }, { where: { id: asset.id } });
                }
                else {
                    let realAmount = parseFloat(options.buyerObj.token_amount);
                    if (options.buyerObj.token_amount > options.remainingAssets) {
                        realAmount = options.remainingAssets;
                    }
                    // =========================================================//
                    // ================Fee Deduction from Buyer=================//
                    // =========================================================//
                    let deductFee = options.remainingAssets * 0.00075;
                    realAmount = realAmount - deductFee;
                    console.log(deductFee, '===============buyer 2 processSellerExecution');
                    // ============Here fee add to admin wallet==================//
                    await market_dal_1.default.createAdminProfit(options?.buyerObj, 0, 0, options?.sellerObj.user_id, deductFee, token?.symbol, 'Spot Trading');
                    let assets = {
                        walletTtype: interface_1.assetsWalletType.main_wallet,
                        balance: realAmount,
                        account_type: interface_1.assetsAccountType.main_account,
                        token_id: options.buyerObj.token_id,
                        user_id: options.buyerObj.user_id
                    };
                    await models_1.assetModel.create(assets);
                }
            }
            //======================================================
            //============= update market order status =============
            //======================================================
            await this.updateSellerOrderStatus(options);
        }
        catch (error) {
            throw new Error(error.message);
        }
    }
    async updateSellerOrderStatus(options) {
        try {
            console.log('========here 5');
            let sellerOrder = await this.getMarketOrderById(options.sellerObj.id);
            let buyerOrder = await this.getMarketOrderById(options.buyerObj.id);
            if (options.remainingAssets === options.buyerObj.token_amount) {
                if (sellerOrder) {
                    await marketorder_model_1.default.update({ status: true }, { where: { id: sellerOrder.id } });
                }
                if (buyerOrder) {
                    await marketorder_model_1.default.update({ status: true }, { where: { id: buyerOrder.id } });
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
                    await marketorder_model_1.default.update({
                        status: buyerStatus,
                        volume_usdt: parseFloat(buyerOrder.volume_usdt) - (options.paid_usdt + options.paid_to_admin),
                        token_amount: (parseFloat(options.buyerObj.token_amount) - options.remainingAssets), queue: false
                    }, { where: { id: buyerOrder.id } });
                }
                if (sellerOrder) {
                    await marketorder_model_1.default.update({ status: true }, { where: { id: sellerOrder.id } });
                }
            }
            else if (options.remainingAssets > parseFloat(options.buyerObj.token_amount)) {
                if (sellerOrder) {
                    await marketorder_model_1.default.update({
                        token_amount: options.remainingAssets - parseFloat(options.buyerObj.token_amount),
                        volume_usdt: parseFloat(sellerOrder.volume_usdt) - options.paid_usdt, queue: false
                    }, { where: { id: sellerOrder.id } });
                }
                if (buyerOrder) {
                    await marketorder_model_1.default.update({ status: true }, { where: { id: buyerOrder.id } });
                }
            }
        }
        catch (error) {
            throw new Error(error.message);
        }
    }
    //=====================================================
    //=============Market based order execution============
    //=====================================================
    async buySellOnMarket(payload) {
        try {
            if (payload.order_type === interface_1.marketOrderEnum.buy) {
                await this.marketBuyerCode(payload);
            }
            if (payload.order_type === interface_1.marketOrderEnum.sell) {
                await this.marketSellerCode(payload);
            }
        }
        catch (error) {
            throw new Error(error.message);
        }
    }
    async marketBuyerCode(payload) {
        try {
            let previous_seller = [];
            let tokenFetch = await models_1.tokensModel.findOne({ where: { id: payload.token_id }, raw: true });
            if (!tokenFetch) {
                tokenFetch = await models_1.globalTokensModel.findOne({ where: { id: payload.token_id }, raw: true });
            }
            // console.log(tokenFetch, '================token Fetch');
            let buyBids = await marketorder_model_1.default.findAll({ where: { status: false, isCanceled: false, user_id: payload?.user_id, token_id: payload?.token_id, order_type: interface_1.marketOrderEnum.buy, market_type: interface_1.marektTypeEnum.market, queue: false }, raw: true, order: [['id', "DESC"]] });
            // if buyer not exist than return
            if (buyBids == null || buyBids.length == 0) {
                throw new Error('No any buyer bids found');
            }
            let sellBids = await marketorder_model_1.default.findAll({ where: { status: false, isCanceled: false, token_id: payload?.token_id, order_type: interface_1.marketOrderEnum.sell, market_type: interface_1.marektTypeEnum.market, queue: false }, raw: true, order: [['id', "DESC"]] });
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
                    });
                }
                let remainingAssets = buyerObj.token_amount;
                let paid_usdt = 0;
                for await (const seller of sellBids) {
                    // seller add in queue
                    let sellerObj = seller;
                    previous_seller.push(sellerObj.id);
                    if (tokenFetch !== undefined && tokenFetch?.price !== undefined) {
                        if (buyerObj.token_id === sellerObj.token_id && sellerObj.limit_usdt <= tokenFetch.price) {
                            console.log('============process execute buyer==========');
                            if (sellerObj.token_amount === remainingAssets) {
                                await marketorder_model_1.default.update({ queue: true }, { where: { id: buyerObj.id } });
                                await marketorder_model_1.default.update({ queue: true }, { where: { id: sellerObj.id } });
                                paid_usdt = sellerObj.limit_usdt * sellerObj.token_amount;
                                let paid_to_admin = (buyerObj.limit_usdt * sellerObj.token_amount) - paid_usdt;
                                if (paid_to_admin > 0) {
                                    //======================================================
                                    //=============Create admin profit======================
                                    //======================================================
                                    await market_dal_1.default.createAdminProfit(buyerObj, paid_usdt, paid_to_admin, sellerObj.user_id, 0, 'USDT', 'Spot Trading');
                                }
                                //======================================================
                                //=============Buyer and seller asset execution=========
                                //======================================================
                                await this.processBuyerExecution({ buyerObj, sellerObj, paid_usdt, remainingAssets, paid_to_admin });
                                //======================================================
                                //=============Create buyer market order history========
                                //======================================================
                                await market_dal_1.default.createMarketOrderHistory(buyerObj, sellerObj.token_amount, paid_usdt);
                                //======================================================
                                //=============Create seller market order history=======
                                //======================================================
                                await market_dal_1.default.createMarketOrderHistory(sellerObj, sellerObj.token_amount, paid_usdt);
                                break;
                            }
                            else if (sellerObj.token_amount > remainingAssets) {
                                await marketorder_model_1.default.update({ queue: true }, { where: { id: buyerObj.id } });
                                await marketorder_model_1.default.update({ queue: true }, { where: { id: sellerObj.id } });
                                paid_usdt = sellerObj.limit_usdt * remainingAssets;
                                let paid_to_admin = (buyerObj.limit_usdt * remainingAssets) - paid_usdt;
                                if (paid_to_admin > 0) {
                                    //======================================================
                                    //=============Create admin profit======================
                                    //======================================================
                                    await market_dal_1.default.createAdminProfit(buyerObj, paid_usdt, paid_to_admin, sellerObj.user_id, 0, 'USDT', 'Spot Trading');
                                }
                                //======================================================
                                //=============Buyer and seller asset execution=========
                                //======================================================
                                await this.processBuyerExecution({ buyerObj, sellerObj, paid_usdt, remainingAssets, paid_to_admin });
                                //======================================================
                                //=============Create buyer market order history========
                                //======================================================
                                await market_dal_1.default.createMarketOrderHistory(buyerObj, remainingAssets, paid_usdt);
                                //======================================================
                                //=============Create seller market order history=======
                                //======================================================
                                await market_dal_1.default.createMarketOrderHistory(sellerObj, remainingAssets, paid_usdt);
                                break;
                            }
                            if (remainingAssets > sellerObj.token_amount) {
                                await marketorder_model_1.default.update({ queue: true }, { where: { id: buyerObj.id } });
                                await marketorder_model_1.default.update({ queue: true }, { where: { id: sellerObj.id } });
                                paid_usdt = sellerObj.limit_usdt * sellerObj.token_amount;
                                let paid_to_admin = (buyerObj.limit_usdt * sellerObj.token_amount) - paid_usdt;
                                if (paid_to_admin > 0) {
                                    //======================================================
                                    //=============Create admin profit======================
                                    //======================================================
                                    await market_dal_1.default.createAdminProfit(buyerObj, paid_usdt, paid_to_admin, sellerObj.user_id, 0, 'USDT', 'Spot Trading');
                                }
                                //======================================================
                                //=============Buyer and seller asset execution=========
                                //======================================================
                                await this.processBuyerExecution({ buyerObj, sellerObj, paid_usdt, remainingAssets, paid_to_admin });
                                remainingAssets = remainingAssets - sellerObj.token_amount;
                                //======================================================
                                //=============Create buyer market order history========
                                //======================================================
                                await market_dal_1.default.createMarketOrderHistory(buyerObj, sellerObj.token_amount, paid_usdt);
                                //======================================================
                                //=============Create seller market order history=======
                                //======================================================
                                await market_dal_1.default.createMarketOrderHistory(sellerObj, sellerObj.token_amount, paid_usdt);
                            }
                        }
                    }
                }
            }
        }
        catch (error) {
            throw new Error(error.message);
        }
    }
    async marketSellerCode(payload) {
        try {
            console.log('========here 2');
            let previous_buyer = [];
            let tokenFetch = await models_1.tokensModel.findOne({ where: { id: payload.token_id }, raw: true });
            if (!tokenFetch) {
                tokenFetch = await models_1.globalTokensModel.findOne({ where: { id: payload.token_id }, raw: true });
            }
            // if buyer not exist than return
            let buyBids = await marketorder_model_1.default.findAll({ where: { status: false, isCanceled: false, token_id: payload?.token_id, order_type: interface_1.marketOrderEnum.buy, market_type: interface_1.marektTypeEnum.market, queue: false }, raw: true, order: [['id', "DESC"]] });
            if (buyBids == null || buyBids.length == 0) {
                throw new Error('No any buyer bids found');
            }
            // if seller not exist than return
            let sellBids = await marketorder_model_1.default.findAll({ where: { status: false, isCanceled: false, user_id: payload?.user_id, token_id: payload?.token_id, order_type: interface_1.marketOrderEnum.sell, market_type: interface_1.marektTypeEnum.market, queue: false }, raw: true, order: [['id', "DESC"]] });
            if (sellBids == null || sellBids.length == 0) {
                throw new Error('No any seller bids found');
            }
            for await (const seller of sellBids) {
                let sellerObj = seller;
                if (previous_buyer.length > 0) {
                    buyBids = buyBids.filter((item) => {
                        if (!previous_buyer.includes(item?.id))
                            return item;
                    });
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
                                await marketorder_model_1.default.update({ queue: true }, { where: { id: sellerObj.id } });
                                await marketorder_model_1.default.update({ queue: true }, { where: { id: buyerObj.id } });
                                paid_usdt = sellerObj.limit_usdt * remainingAssets;
                                let paid_to_admin = (buyerObj.limit_usdt * remainingAssets) - paid_usdt;
                                if (paid_to_admin > 0) {
                                    //======================================================
                                    //=============Create admin profit======================
                                    //======================================================
                                    await market_dal_1.default.createAdminProfit(buyerObj, paid_usdt, paid_to_admin, sellerObj.user_id, 0, 'USDT', 'Spot Trading');
                                }
                                //======================================================
                                //=============Buyer and seller asset execution=========
                                //======================================================
                                await this.processSellerExecution({ buyerObj, sellerObj, paid_usdt, remainingAssets, paid_to_admin });
                                //======================================================
                                //=============Create buyer market order history========
                                //======================================================
                                await market_dal_1.default.createMarketOrderHistory(buyerObj, buyerObj.token_amount, paid_usdt);
                                //======================================================
                                //=============Create seller market order history=======
                                //======================================================
                                await market_dal_1.default.createMarketOrderHistory(sellerObj, remainingAssets, paid_usdt);
                                break;
                            }
                            else if (buyerObj.token_amount > remainingAssets) {
                                await marketorder_model_1.default.update({ queue: true }, { where: { id: sellerObj.id } });
                                await marketorder_model_1.default.update({ queue: true }, { where: { id: buyerObj.id } });
                                paid_usdt = sellerObj.limit_usdt * remainingAssets;
                                let paid_to_admin = (buyerObj.limit_usdt * remainingAssets) - paid_usdt;
                                if (paid_to_admin > 0) {
                                    //======================================================
                                    //=============Create admin profit======================
                                    //======================================================
                                    await market_dal_1.default.createAdminProfit(buyerObj, paid_usdt, paid_to_admin, sellerObj.user_id, 0, 'USDT', 'Spot Trading');
                                }
                                //======================================================
                                //=============Buyer and seller asset execution=========
                                //======================================================
                                await this.processSellerExecution({ buyerObj, sellerObj, paid_usdt, remainingAssets, paid_to_admin });
                                //======================================================
                                //=============Create buyer market order history========
                                //======================================================
                                await market_dal_1.default.createMarketOrderHistory(buyerObj, remainingAssets, paid_usdt);
                                //======================================================
                                //=============Create seller market order history=======
                                //======================================================
                                await market_dal_1.default.createMarketOrderHistory(sellerObj, remainingAssets, paid_usdt);
                                break;
                            }
                            if (remainingAssets > buyerObj.token_amount) {
                                await marketorder_model_1.default.update({ queue: true }, { where: { id: sellerObj.id } });
                                await marketorder_model_1.default.update({ queue: true }, { where: { id: buyerObj.id } });
                                paid_usdt = sellerObj.limit_usdt * buyerObj.token_amount;
                                let paid_to_admin = (buyerObj.limit_usdt * buyerObj.token_amount) - paid_usdt;
                                if (paid_to_admin > 0) {
                                    //======================================================
                                    //=============Create admin profit======================
                                    //======================================================
                                    await market_dal_1.default.createAdminProfit(buyerObj, paid_usdt, paid_to_admin, sellerObj.user_id, 0, 'USDT', 'Spot Trading');
                                }
                                //======================================================
                                //=============Buyer and seller asset execution=========
                                //======================================================
                                await this.processSellerExecution({ buyerObj, sellerObj, paid_usdt, remainingAssets, paid_to_admin });
                                remainingAssets = remainingAssets - buyerObj.token_amount;
                                //======================================================
                                //=============Create buyer market order history========
                                //======================================================
                                await market_dal_1.default.createMarketOrderHistory(buyerObj, buyerObj.token_amount, paid_usdt);
                                //======================================================
                                //=============Create seller market order history=======
                                //======================================================
                                await market_dal_1.default.createMarketOrderHistory(sellerObj, buyerObj.token_amount, paid_usdt);
                            }
                        }
                    }
                }
            }
        }
        catch (error) {
            throw new Error(error.message);
        }
    }
}
exports.default = marketService;

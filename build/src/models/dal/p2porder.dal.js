"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const service_1 = __importDefault(require("../../services/service"));
const order_model_1 = __importDefault(require("../model/order.model"));
const post_model_1 = __importDefault(require("../model/post.model"));
const users_dal_1 = __importDefault(require("./users.dal"));
const interface_1 = require("../../utils/interface");
class p2pOrderDal {
    /**
     * Create P2P order by seller
     * @param payload
     * @returns
     */
    async create(payload) {
        try {
            let userService = new users_dal_1.default();
            let buyerUser = await userService.checkUserByPk(payload.buy_user_id);
            if (buyerUser === null) {
                throw new Error("Buyer user not exist.Please verify your account.");
            }
            let cancelOrder = await service_1.default.p2p.checkCancelOrderCurrentDay(payload.buy_user_id);
            if (cancelOrder.length >= 3) {
                throw new Error("You exceed your order limit today. Please try after 24 hours");
            }
            let post = await service_1.default.ads.getPostByid(payload.post_id);
            if (payload.spend_amount < post.min_limit || payload.spend_amount > post.max_limit) {
                throw new Error(`Please enter amount greater than ${post.min_limit} and less than ${post.max_limit}`);
            }
            if (post.quantity < payload.quantity) {
                throw new Error(`Please add quantity less or equal to ${post.quantity}`);
            }
            let reserveOrders = await service_1.default.p2p.checkReserveOrderByPost(payload.post_id);
            if (reserveOrders.length > 0) {
                if ((post.quantity - reserveOrders[0]?.dataValues?.total) < payload?.quantity) {
                    throw new Error(`Whoops! Partial order is reserved by another user. You can only order ${post.quantity - reserveOrders[0]?.dataValues?.total}. `);
                }
            }
            var remainingqty = (1 / post.price) * post.min_limit;
            let ordercreate = await order_model_1.default.create(payload);
            if (ordercreate) {
                if ((post.quantity - (reserveOrders[0]?.dataValues?.total + payload.quantity)) < remainingqty) {
                    await post_model_1.default?.update({ status: false }, { where: { id: payload.post_id } });
                }
                return ordercreate?.dataValues;
            }
        }
        catch (error) {
            throw new Error(error.message);
        }
    }
    /**
     * Cancel order by user with order id
     * @param payload
     * @returns
     */
    async cancelOrder(payload) {
        try {
            let userLayout = new users_dal_1.default();
            let buyerUser = await userLayout.checkUserByPk(payload.user_id);
            if (buyerUser === null) {
                throw new Error("Buyer user not exist.Please verify your account.");
            }
            let order = await service_1.default.p2p.getOrderByid(payload?.order_id);
            if (order) {
                let updateOrder = await order_model_1.default.update({ status: 'isCanceled' }, { where: { id: payload.order_id } });
                let postUpdate = await post_model_1.default.update({ status: true }, { where: { id: order?.post_id } });
                if (postUpdate) {
                    return order;
                }
            }
            else {
                throw new Error('Order not found!!.');
            }
        }
        catch (error) {
            throw new Error(error.message);
        }
    }
    /**
     * Update order status to isCompleted when user paid payment
     * @param payload
     * @returns
     */
    async updateOrder(payload) {
        try {
            let order = await service_1.default.p2p.getOrderByid(payload.order_id);
            if (order) {
                if (order.status === 'isCanceled') {
                    throw new Error(`This order is canceled. Please try to create new order and pay payment.`);
                }
                if (order.status === 'isCompleted') {
                    throw new Error(`You aleady paid payment for this order.`);
                }
                await order_model_1.default.update({ status: 'isCompleted' }, { where: { id: payload.order_id } });
                let updatedOrder = await service_1.default.p2p.getOrderByid(payload.order_id);
                return updatedOrder;
            }
            else {
                throw new Error('Order not found!!.');
            }
        }
        catch (error) {
            throw new Error(error.message);
        }
    }
    async orderReleased(payload) {
        try {
            let userService = new users_dal_1.default();
            let sellerUser = await userService.checkUserByPk(payload.user_id);
            if (sellerUser === null) {
                throw new Error("Seller user not exist.Please verify your account.");
            }
            let pass = service_1.default.bcypt.MDB_compareHash(`${payload.fundcode}`, sellerUser.tradingPassword);
            if (pass === false) {
                throw new Error("Funding code not match.");
            }
            let order = await service_1.default.p2p.getOrderByid(payload.order_id);
            if (order) {
                if (order.status === 'isReleased') {
                    throw new Error(`Please don't try again you already released assets to buyer.`);
                }
                let post = await service_1.default.ads.getPostByid(order.post_id);
                let released = await order_model_1.default.update({ status: 'isReleased' }, { where: { id: payload.order_id, sell_user_id: payload.user_id } });
                if (released) {
                    let postUpdate = post_model_1.default.update({ quantity: post.quantity - order.quantity }, { where: { id: order.post_id, user_id: order.sell_user_id } });
                    let obj = {
                        user_id: order.buy_user_id,
                        walletTtype: interface_1.assetsWalletType.main_wallet,
                        token_id: order.token_id,
                        account_type: interface_1.assetsAccountType.main_account,
                        balance: order.receive_amount
                    };
                    let assets = await service_1.default.assets.create(obj);
                    order.status = 'isReleased';
                    return order;
                }
            }
            else {
                throw new Error('Order not found!!.');
            }
        }
        catch (error) {
            throw new Error(error.message);
        }
    }
}
exports.default = new p2pOrderDal();

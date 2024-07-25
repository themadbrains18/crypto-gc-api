import { Transaction, where } from "sequelize";
import service from "../../services/service";
import adsPostDto from "../dto/adspost.dto";
import P2POrderDto from "../dto/p2porder.dto";
import orderModel, { orderOuput } from "../model/order.model";
import postModel, { postOuput } from "../model/post.model";
import userDal from "./users.dal";
import assetsDto from "../dto/assets.dto";
import { assetsAccountType, assetsWalletType } from "../../utils/interface";
import { truncateNumber } from "../../utils/utility";
import sequelize from "..";

export const truncateToSixDecimals = (num: number): number => {
    const numStr = num.toFixed(10); // Convert number to string with sufficient precision
    const decimalIndex = numStr.indexOf('.');
    if (decimalIndex === -1) return num; // No decimal point found, return the number as is
    return Number(numStr.substring(0, decimalIndex + 7)); // Truncate to 6 decimal places
};
class p2pOrderDal {
    /**
     * Create P2P order by seller
     * @param payload 
     * @returns 
     */
    async create(payload: P2POrderDto): Promise<orderOuput | any> {

        const t = await sequelize.transaction();
        try {
            const userService = new userDal();
            const buyerUser = await userService.checkUserByPk(payload.buy_user_id, t);
            if (buyerUser === null) {
                throw new Error("Buyer user not exist. Please verify your account.");
            }

            const cancelOrder: any[] = await service.p2p.checkCancelOrderCurrentDay(payload.buy_user_id, t);
            if (cancelOrder.length >= 3) {
                throw new Error("You exceed your order limit today. Please try after 24 hours");
            }

            let post = await postModel.findOne({
                where: { id: payload.post_id },
                transaction: t,// Lock the row for update
                lock: t.LOCK.UPDATE,
                raw: true
            });

            console.log(post,'==================post');
            
            // await service.ads.getPostByid(payload.post_id, t);
            if ((post && payload.spend_amount < post.min_limit) || (post && payload.spend_amount > post.max_limit)) {
                throw new Error(`Please enter amount greater than ${post.min_limit} and less than ${post.max_limit}`);
            }

            if (post && post.quantity < payload.quantity) {
                throw new Error(`Please add quantity less or equal to ${post.quantity}`);
            }

            const reserveOrders = await service.p2p.checkReserveOrderByPost(payload.post_id, t);

            console.log(reserveOrders,'===============reserve Orders');
            

            const reservedQuantity = reserveOrders[0]?.dataValues?.total || 0;
            const availableQuantity = post ? truncateToSixDecimals(post.quantity - reservedQuantity) : 0;

            console.log(availableQuantity,'=================available Quantity');

            if (reserveOrders.length > 0) {
                if (availableQuantity <= 0) {
                    throw new Error(`Whoops! Order not available.`);
                }
                if (availableQuantity < payload.quantity) {
                    throw new Error(`Whoops! Partial order is reserved by another user. You can only order ${availableQuantity}.`);
                }
            }

            const remainingQty = post ? truncateToSixDecimals((1 / post.price) * post.min_limit) : 0;

            console.log(remainingQty,'=================remaining Qty');
            
            return null

            // const ordercreate = await orderModel.create(payload, { transaction: t });
            // if (ordercreate && post) {

            //     const newAvailableQuantity = truncateToSixDecimals(
            //         truncateToSixDecimals(Number(post.quantity)) - (reservedQuantity + truncateToSixDecimals(Number(payload.quantity)))
            //     );
            //     if (newAvailableQuantity < remainingQty) {
            //         await postModel.update({ status: false }, { where: { id: payload.post_id }, transaction: t });
            //     }

            // }
            // console.log("here");

            // await t.commit();
            // return ordercreate?.dataValues;
        } catch (err) {

            console.log("here i am error catch");
            console.error('Transaction error:', err);
            await t.rollback();
            throw err;
        }
    }

    /**
     * Cancel order by user with order id
     * @param payload 
     * @returns 
     */
    async cancelOrder(payload: any): Promise<orderOuput | any> {
        try {

            // console.log('=========order cancel 3', payload);
            let userLayout = new userDal();
            let buyerUser = await userLayout.checkUserByPk(payload.user_id);
            if (buyerUser === null) {
                throw new Error("Buyer user not exist.Please verify your account.");
            }

            let order = await service.p2p.getOrderByid(payload?.order_id, payload.user_id);

            if (order && (order.status === "isProcess" || payload?.cancelType === 'mannual')) {
                // console.log("hi===");
                let updateOrder = await orderModel.update({ status: 'isCanceled' }, { where: { id: payload.order_id } });
                let postUpdate = await postModel.update({ status: true }, { where: { id: order?.post_id } });
                if (postUpdate) {
                    return order;
                }
            }
            else {
                throw new Error('Order not found!!.')
            }

        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    /**
     * Update order status to isCompleted when user paid payment
     * @param payload 
     * @returns 
     */
    async updateOrder(payload: any): Promise<orderOuput | any> {
        try {
            let order = await service.p2p.getOrderByid(payload.order_id, payload.user_id);
            if (order) {
                if (order.status === 'isCanceled') {
                    throw new Error(`This order is canceled. Please try to create new order and pay payment.`)
                }
                if (order.status === 'isCompleted') {
                    throw new Error(`You aleady paid payment for this order.`);
                }
                await orderModel.update({ status: 'isCompleted' }, { where: { id: payload.order_id } });
                let updatedOrder = await service.p2p.getOrderByid(payload.order_id, payload.user_id);
                return updatedOrder;
            }
            else {
                throw new Error('Order not found!!.')
            }
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    async orderReleased(payload: any): Promise<orderOuput | any> {
        try {

            // console.log(payload, "==payload");

            let userService = new userDal();
            let sellerUser = await userService.checkUserByPk(payload.user_id);
            if (sellerUser === null) {
                throw new Error("Seller user not exist.Please verify your account.");
            }

            let pass = service.bcypt.MDB_compareHash(
                `${payload.fundcode}`,
                sellerUser.tradingPassword
            );

            if (pass === false) {
                throw new Error("Funding code not match.");
            }

            let order = await service.p2p.getOrderByid(payload.order_id, payload.user_id);
            if (order) {
                if (order.status === 'isReleased') {
                    throw new Error(`Please don't try again you already released assets to buyer.`);
                }
                let post = await service.ads.getPostByid(order.post_id);
                let released = await orderModel.update({ status: 'isReleased' }, { where: { id: payload.order_id, sell_user_id: payload.user_id } });
                if (released) {

                    let postUpdate = postModel.update({ quantity: truncateToSixDecimals(Number(post.quantity)) - truncateToSixDecimals(Number(order.quantity)) }, { where: { id: order.post_id, user_id: order.sell_user_id } });

                    let obj: assetsDto = {
                        user_id: order.buy_user_id,
                        walletTtype: assetsWalletType.main_wallet,
                        token_id: order.token_id,
                        account_type: assetsAccountType.main_account,
                        balance: order.receive_amount
                    }
                    let assets = await service.assets.create(obj);

                    order.status = 'isReleased';

                    return order;
                }
            }
            else {
                throw new Error('Order not found!!.')
            }
        } catch (error: any) {
            throw new Error(error.message);
        }
    }
}

export default new p2pOrderDal();
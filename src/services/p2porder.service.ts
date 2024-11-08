import { Op, Transaction } from "sequelize";
import p2porderDal from "../models/dal/p2porder.dal";
import P2POrderDto from "../models/dto/p2porder.dto";
import orderModel, { orderOuput } from "../models/model/order.model";
import sequelize, { kycModel, paymentMethodModel, postModel, tokensModel, userModel, userPmethodModel } from "../models";
import profileModel from "../models/model/profile.model";

class p2pOrderService {

    /**
     * Creates a new P2P order.
     * 
     * This method is responsible for creating a new order in the P2P platform. It accepts the order details via the 
     * `payload` (of type `P2POrderDto`) and passes it to the `p2porderDal.create` method to store the order data in the database.
     * 
     * @param {P2POrderDto} payload - The details of the order to be created.
     * @returns {Promise<orderOuput | any>} The created order details or an error if the creation fails.
     */
    async createOrder(payload: P2POrderDto): Promise<orderOuput | any> {
        return await p2porderDal.create(payload);
    }

    /**
    * Cancels a P2P order.
    * 
    * This method allows a user to cancel an existing order. It takes the `payload` containing the order details (such as
    * the order ID) and calls the `p2porderDal.cancelOrder` method to update the order status to "canceled" in the database.
    * 
    * @param {any} payload - The details of the order to be canceled.
    * @returns {Promise<orderOuput | any>} The updated order details after cancellation, or an error if cancellation fails.
    */
    async cancelOrder(payload: any): Promise<orderOuput | any> {
        // console.log('=========order cancel 2');
        return await p2porderDal.cancelOrder(payload);
    }

    /**
     * Updates an existing P2P order.
     * 
     * This method updates the details of an existing order, such as price, quantity, or other order parameters. It takes 
     * the updated details in the `payload` and passes them to the `p2porderDal.updateOrder` method to save the changes in the database.
     * 
     * @param {any} payload - The updated order details.
     * @returns {Promise<orderOuput | any>} The updated order details, or an error if the update fails.
     */
    async updateOrder(payload: any): Promise<orderOuput | any> {
        return await p2porderDal.updateOrder(payload);
    }

    /**
    * Releases a P2P order.
    * 
    * This method marks a P2P order as "released", meaning that the order is complete and the funds are now available
    * to the user. It accepts the `payload` with necessary details and calls `p2porderDal.orderReleased` to update the
    * order status in the database.
    * 
    * @param {any} payload - The details of the order to be released.
    * @returns {Promise<orderOuput | any>} The updated order details, or an error if the release process fails.
    */
    async orderReleased(payload: any): Promise<orderOuput | any> {
        return await p2porderDal.orderReleased(payload);
    }

    /**
       * Checks whether the user has canceled an order on the current day.
       * 
       * This method checks the number of orders a user has canceled on the same day. It queries the `orderModel` to check 
       * if the user has any orders with a "canceled" status that were created today. The method returns all such orders.
       * 
       * @param {string} user_id - The ID of the user whose orders are being checked.
       * @param {Transaction} [t] - An optional Sequelize transaction object.
       * @returns {Promise<orderOuput | any>} A list of canceled orders for the user on the current day.
       */

    async checkCancelOrderCurrentDay(user_id: string, t?: Transaction): Promise<orderOuput | any> {

        const START = new Date();
        START.setHours(0, 0, 0, 0);
        const NOW = new Date();
        let orders = await orderModel.findAll({
            where: {
                buy_user_id: user_id, status: "isCanceled", createdAt: {
                    [Op.between]: [START.toISOString(), NOW.toISOString()]
                }
            }, transaction: t
        });
        return orders;
    }

    /**
  * Checks the reserve order for a user on the same post.
  * 
  * This method checks the total quantity of orders (with status "isProcess" or "isCompleted") for a specific post.
  * It aggregates the order quantity by the post ID.
  * 
  * @param {string} post_id - The ID of the post to check the reserve orders for.
  * @param {Transaction} [t] - An optional Sequelize transaction object for transaction consistency.
  * @returns {Promise<orderOuput | any>} The total quantity of orders for the specified post, or an error message if the query fails.
  */
    async checkReserveOrderByPost(post_id: string, t?: Transaction): Promise<orderOuput | any> {
        let order = await orderModel.findAll(
            {
                attributes: ['post_id', [
                    sequelize.fn('sum', sequelize.col('quantity')), 'total']
                ],
                group: ['post_id'],
                where: {
                    post_id: post_id,
                    [Op.or]: [
                        { status: 'isProcess' },
                        { status: 'isCompleted' }
                    ]
                }, transaction: t
            });
        return order;
    }

    /**
  * Retrieves the order details by order ID.
  * 
  * This method fetches a specific order based on the provided order ID (`payload`). It also checks if the given `userid`
  * matches either the buyer's or the seller's user ID, and includes associated models like `postModel`, `userModel`, `kycModel`, and `profileModel`.
  * 
  * @param {string} payload - The ID of the order to retrieve.
  * @param {string} userid - The user ID of the requester, which will be checked against the order's buyer and seller.
  * @returns {Promise<orderOuput | any>} The order details if found, or an error message if not.
  */
    async getOrderByid(payload: string, userid: string): Promise<orderOuput | any> {
        try {
            let order = await orderModel.findOne({
                where: {
                    id: payload,
                    ...(userid && {
                        [Op.or]: [
                            { buy_user_id: userid },
                            { sell_user_id: userid }
                        ]
                    })
                },
                include: [
                    {
                        model: postModel,
                        attributes: {
                            exclude: [
                                "user_id", "token_id", "price", "quantity", "min_limit", "max_limit", "checked", "status", "createdAt", "updatedAt", "deletedAt"
                            ]
                        },
                        paranoid: false,
                        include: [
                            {
                                model: userModel,
                                attributes: {
                                    exclude: [
                                        "otpToken", "dial_code", "password", "TwoFA", "kycstatus", "tradingPassword", "statusType", "registerType", "role", "secret", "own_code", "refeer_code", "antiphishing", "UID", "cronStatus", "createdAt", "updatedAt", "deletedAt"
                                    ]
                                },
                                include: [
                                    {
                                        model: kycModel,
                                        attributes: {
                                            exclude: [
                                                "id", "user_id", "doctype", "docnumber", "dob", "idfront", "idback", "statement", "isVerified", "isReject", "destinationPath", "createdAt", "updatedAt", "deletedAt"
                                            ]
                                        }
                                    },
                                    {
                                        model: profileModel
                                    },
                                    {
                                        model: userPmethodModel,
                                        include: [
                                            {
                                                model: paymentMethodModel,
                                                attributes: {
                                                    exclude: ["createdAt", "updatedAt", "deletedAt"]
                                                },
                                            }
                                        ], paranoid: false,
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        model: userModel,
                        attributes: {
                            exclude: [
                                "otpToken", "dial_code", "password", "TwoFA", "kycstatus", "tradingPassword", "statusType", "registerType", "role", "secret", "own_code", "refeer_code", "antiphishing", "UID", "cronStatus", "createdAt", "updatedAt", "deletedAt"
                            ]
                        },
                        include: [
                            {
                                model: kycModel,
                                attributes: {
                                    exclude: [
                                        "id", "user_id", "doctype", "docnumber", "dob", "idfront", "idback", "statement", "isVerified", "isReject", "destinationPath", "createdAt", "updatedAt", "deletedAt"
                                    ]
                                }
                            },
                            {
                                model: profileModel
                            },
                        ]
                    }
                ]
            });
            return order?.dataValues;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    /**
  * Retrieves a list of orders for a specific user.
  * 
  * This method retrieves a list of orders associated with the user based on the provided `userid`. It will return orders
  * where the user is either the buyer or the seller. The list includes associated models like `postModel`, `userModel`, and `kycModel`.
  * The orders are ordered by their creation date in descending order.
  * 
  * @param {string} userid - The user ID whose orders are to be retrieved.
  * @returns {Promise<orderOuput | any>} A list of orders for the specified user or an error message.
  */
    async getOrderList(userid: string): Promise<orderOuput | any> {
        try {
            if (userid === "") {
                throw new Error('Please provide userid.')
            }
            return await orderModel.findAll({
                where: {
                    [Op.or]: [
                        { buy_user_id: userid },
                        { sell_user_id: userid }
                    ]
                },
                include: [
                    {
                        model: postModel,
                        attributes: {
                            exclude: [
                                "user_id", "token_id", "price", "quantity", "min_limit", "max_limit", "checked", "status", "createdAt", "updatedAt", "deletedAt"
                            ]
                        },
                        include: [
                            {
                                model: userModel,
                                attributes: {
                                    exclude: [
                                        "otpToken", "dial_code", "password", "TwoFA", "kycstatus", "tradingPassword", "statusType", "registerType", "role", "secret", "own_code", "refeer_code", "antiphishing", "UID", "cronStatus", "createdAt", "updatedAt", "deletedAt"
                                    ]
                                },
                                include: [
                                    {
                                        model: kycModel,
                                        attributes: {
                                            exclude: [
                                                "id", "user_id", "doctype", "docnumber", "dob", "idfront", "idback", "statement", "isVerified", "isReject", "destinationPath", "createdAt", "updatedAt", "deletedAt"
                                            ]
                                        }
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        model: userModel,
                        attributes: {
                            exclude: [
                                "otpToken", "dial_code", "password", "TwoFA", "kycstatus", "tradingPassword", "statusType", "registerType", "role", "secret", "own_code", "refeer_code", "antiphishing", "UID", "cronStatus", "createdAt", "updatedAt", "deletedAt"
                            ]
                        },
                        include: [
                            {
                                model: kycModel,
                                attributes: {
                                    exclude: [
                                        "id", "user_id", "doctype", "docnumber", "dob", "idfront", "idback", "statement", "isVerified", "isReject", "destinationPath", "createdAt", "updatedAt", "deletedAt"
                                    ]
                                }
                            }
                        ]
                    }
                ],
                order: [["createdAt", "desc"]]
            });
        } catch (error: any) {
            throw new Error(error.message);
        }

    }
    /**
    * Retrieves a limited list of orders for a user, with pagination.
    * 
    * This method allows fetching a paginated list of orders for a user. It takes the `userid`, `offset`, and `limit` as parameters,
    * and returns a subset of orders based on the specified pagination parameters. It also includes the associated `tokensModel` for each order.
    * 
    * @param {string} userid - The user ID whose orders are to be retrieved.
    * @param {string} offset - The offset to paginate the results.
    * @param {string} limit - The limit to paginate the results.
    * @returns {Promise<orderOuput | any>} A paginated list of orders for the specified user or an error message.
    */
    async getOrderListByLimit(userid: string, offset: string, limit: string): Promise<orderOuput | any> {
        try {

            let limits = parseInt(limit)
            let offsets = parseInt(offset)

            if (userid === "") {
                throw new Error('Please provide userid.')
            }
            return await orderModel.findAll({
                where: {
                    [Op.or]: [
                        { buy_user_id: userid },
                        { sell_user_id: userid }
                    ]
                },
                include: {
                    model: tokensModel
                },
                limit: limits,
                offset: offsets

            });
        } catch (error: any) {
            throw new Error(error.message);
        }

    }

    /**
 * Retrieves a paginated list of orders for a user filtered by status, currency, and date.
 * 
 * This method fetches orders for a given user (`userid`) and filters them by `status`, `currency`, and `date`. The results are
 * paginated based on the provided `offset` and `limit` parameters. It also includes the associated `tokensModel` for each order.
 * 
 * @param {string} userid - The user ID whose orders are to be retrieved.
 * @param {string} status - The status of the order(s) to filter by (e.g., "isReleased", "isCompleted", or "all").
 * @param {string} offset - The offset for pagination (the starting index of records to retrieve).
 * @param {string} limit - The limit for pagination (the number of records to retrieve).
 * @param {string} currency - The currency to filter the orders by (e.g., token ID).
 * @param {string} date - The date to filter the orders by (e.g., the starting date to retrieve orders).
 * @returns {Promise<orderOuput | any>} A paginated list of orders based on the applied filters, along with the total number of records.
 */
    async getOrderListByStatusByLimit(userid: string, status: string, offset: string, limit: string, currency: string, date: string): Promise<orderOuput | any> {
        try {

            // console.log("========date",date);

            let limits = parseInt(limit)
            let offsets = parseInt(offset)

            if (userid === "") {
                throw new Error('Please provide userid.')
            }
            let whereClause: any = {
                [Op.or]: [
                    { buy_user_id: userid },
                    { sell_user_id: userid }
                ]
            };

            if (status === "isReleased") {
                whereClause.status = { [Op.or]: ['isReleased', 'isCompleted'] };
            } else if (status !== "all") {
                whereClause.status = status;
            }

            if (currency && currency !== 'all') {
                whereClause.token_id = currency;
            }
            if (date && date !== "all") {
                whereClause.createdAt = {
                    [Op.gte]: new Date(date as string) // Filter posts from the given date
                };
            }

            // Query to fetch paginated data
            let data = await orderModel.findAll({
                where: {
                    ...whereClause,

                },
                include: {
                    model: tokensModel
                }, order: [['createdAt', 'DESC']] // Order by createdAt descending

            });

            // Query to fetch total count
            // Get total length of filtered records

            const totalLength = data.length;

            // Paginate the filtered records
            const paginatedData = data.slice(offsets, offsets + limits);

            return { data: paginatedData, total: totalLength };

        } catch (error: any) {
            console.log("eror", error.message);

            throw new Error(error.message);
        }

    }

    /**
 * Retrieves all orders without filtering.
 * 
 * This method fetches all orders from the database, including the associated `tokensModel` for each order.
 * 
 * @returns {Promise<orderOuput | any>} A list of all orders.
 */
    async getAllOrderList(): Promise<orderOuput | any> {
        try {

            return await orderModel.findAll
                ({
                    include: {
                        model: tokensModel
                    }
                });
        } catch (error: any) {
            throw new Error(error.message);
        }

    }

    /**
 * Retrieves a paginated list of all orders.
 * 
 * This method fetches all orders from the database with pagination support. The results are limited by the provided `offset`
 * and `limit` parameters, and includes the associated `tokensModel` for each order.
 * 
 * @param {string} offset - The offset for pagination (the starting index of records to retrieve).
 * @param {string} limit - The limit for pagination (the number of records to retrieve).
 * @returns {Promise<orderOuput | any>} A paginated list of all orders.
 */
    async getAllOrderListByLimit(offset: string, limit: string): Promise<orderOuput | any> {
        try {

            let offsets = parseInt(offset);
            let limits = parseInt(limit)

            return await orderModel.findAll
                ({
                    include: {
                        model: tokensModel
                    },
                    limit: limits,
                    offset: offsets

                });
        } catch (error: any) {
            throw new Error(error.message);
        }

    }
}

export default p2pOrderService;
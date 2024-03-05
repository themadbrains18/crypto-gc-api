"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("../models");
class userWalletServices {
    async all(user_id, network) {
        let wallet = await models_1.walletsModel.findOne({
            where: { user_id },
            attributes: {
                exclude: ['id', 'user_id', 'deletedAt', 'createdAt', 'updatedAt']
            },
            raw: true
        });
        let data = wallet?.wallets[network];
        delete data['privateKey'];
        delete data['publicKey'];
        if (data.address.hex !== undefined) {
            if ('hex' in data.address) {
                data.address = data?.address?.base58;
            }
        }
        return data;
    }
    async allWallets(network) {
        try {
            let wallet = await models_1.walletsModel.findAll({
                attributes: {
                    exclude: ['id', 'deletedAt', 'createdAt', 'updatedAt'],
                    include: ['user_id']
                },
                raw: true
            });
            let addresses = [];
            for (let address of wallet) {
                let data = address?.wallets[network];
                delete address?.wallets[network]['privateKey'];
                address.wallets[network]['address'] = (address?.wallets[network]['address']).toLowerCase();
                address.wallets[network]['user_id'] = address.user_id;
                addresses.push(data);
            }
            return addresses;
        }
        catch (error) {
            return [];
        }
    }
}
exports.default = userWalletServices;

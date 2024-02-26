import { walletsModel } from "../models";

interface walletScannerShape  {
    address : String,
    user_id : String
}

class userWalletServices {

    async all(user_id:string, network:string): Promise<any> {

        let wallet:any = await walletsModel.findOne({
            where:{user_id},
            attributes: {
                exclude: ['id', 'user_id', 'deletedAt','createdAt', 'updatedAt']
            },
            raw:true
        });

        let data:any = wallet?.wallets[network];
        delete data['privateKey'];
        delete data['publicKey'];
        if(data.address.hex !== undefined){
            if('hex' in data.address){
                data.address =  data?.address?.base58
            }
        }
        return data;
    }


    
    
    async allWallets(network:string): Promise<walletScannerShape[]> {
        try {
            let wallet:any = await walletsModel.findAll({
                attributes: {
                    exclude: ['id', 'deletedAt','createdAt', 'updatedAt'],
                    include : ['user_id']
                },
                raw:true
            });

            let addresses = []
            for(let address of wallet){
                let data:any = address?.wallets[network];
                delete address?.wallets[network]['privateKey']
                address.wallets[network]['address'] = (address?.wallets[network]['address']).toLowerCase()
                address.wallets[network]['user_id'] = address.user_id
                addresses.push(data)
            }
            return addresses;
        } catch (error) {
            return []
        }
   
    }
    

 

}

export default userWalletServices
import { walletsModel } from "../models";

interface walletScannerShape  {
    address : String,
    user_id : String
}

class userWalletServices {

    /**
     * Retrieves a specific user's wallet data for a given network.
     * 
     * This method fetches the wallet information for a user based on their `user_id`
     * and the specified network. It excludes sensitive data like private and public keys.
     * If the network's wallet address is in hexadecimal format, it converts it to base58.
     * 
     * @param user_id - The unique identifier of the user.
     * @param network - The network for which to retrieve the wallet (e.g., Ethereum, Bitcoin).
     * @returns The wallet data for the specified network, excluding private and public keys.
     */
    async all(user_id:string, network:string): Promise<any> {

        try {
            
            // Fetch the user's wallet data from the database
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

            // Check if the address is in hexadecimal format and convert to base58
            if(data.address.hex !== undefined){
                if('hex' in data.address){
                    data.address =  data?.address?.base58
                }
            }
            return data;
        } catch (error) {
            console.log(error,"error in user wallet service");
            
        }
    }


      /**
     * Retrieves wallet data for all users for a given network.
     * 
     * This method fetches wallet data for all users in the system. It processes
     * the wallets to remove sensitive keys, and ensures that the wallet address
     * is always returned in lowercase format.
     * 
     * @param network - The network for which to retrieve the wallets (e.g., Ethereum, Bitcoin).
     * @returns A list of wallet addresses with user IDs for the specified network.
     */
    
    async allWallets(network:string): Promise<walletScannerShape[]> {
        try {
             // Fetch all user wallet data from the database
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

             // Return the list of wallet addresses
            return addresses;
        } catch (error) {
            return []
        }
   
    }
    

 

}

export default userWalletServices
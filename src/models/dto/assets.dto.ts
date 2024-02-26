
export interface walletTowalletTransfer {
    walletTtype : string;
    balance : number;
    account_type : string;
    token_id : string;
}

export default interface assetsDto extends walletTowalletTransfer{
    user_id?: string;
}



// { walletTtype: '', balance: 0, account_type: '', token_id: '' };
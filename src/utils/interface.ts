export enum Direction {
  Pending = "Pending",
  Approved = "Approved",
  All = "All",
  Rejected = "Rejected",
  Blank = "{type}",
}

export enum assetsAccountType {
  main_account = "Main Account",
  funding_account = "Funding Account",
  trading_account = "Trading Account",
}

export enum assetsWalletType {
  main_wallet = "main_wallet",
  funding_wallet = "funding_wallet",
  trading_wallet = "trading_wallet",
}

export enum stakingTimeFormat {
  Minutes = "Minutes",
  Days = "Days",
  Months = "Months",
  Years = "Years",
}

export interface updatepassword {
  user_id?: string;
  old_password: string;
  new_password: string;
}

export interface updateFundcode {
  user_id?: string;
  old_password?: string;
  new_password?: string;
}
export interface googleAuth {
  user_id?: string;
  token?: string;
  password?: string;
  secret?: string;
  TwoFA?:boolean;
  otp?:string;
}

export enum marketOrderEnum {
  buy = "buy",
  sell = "sell",
}

export enum tokenTypeEnum {
  global = "global",
  mannual = "mannual",
}

export enum marektTypeEnum {
  market = "market",
  limit = "limit",
}

export interface marketCancel {
  user_id: string;
  order_id: string;
}

export interface marketPartialExecution {
  token_id: string;
  order_type: string;
  user_id: string;
}

export interface userAssetData {
  user_id: string;
  token_id: string;
}

export interface checkUser {
  username: string;
  password: string;
  confirmPassword: string;
}

export interface updateUserStatus {
  id?: string;
  statusType?: boolean;
}
export interface updateUserPin {
  id?: string;
  pin_code?: string;
}

export interface updateTokenStatus {
  id?: string;
  status?: boolean;
}

export interface updateTokenStakeStatus {
  id?: string;
  status?: boolean;
}
export interface updatePairStatus {
  id?: string;
  status?: boolean;
}

export interface updateTokenNetwork {
  id?: string;
  networks: [
    {
      id: string;
      fee: number;
      decimal: number;
      contract: string;
    }
  ];
}

export interface updateSiteDownStatus {
  id?: string;
  down_status?: boolean;
}

export interface updateFuturePairStatus {
  id?: string;
  status?: boolean;
}


export interface updateReferProgramStatus {
  id?: string;
  status?: boolean;
}
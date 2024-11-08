// Enum to represent different operation statuses
export enum Direction {
  Pending = "Pending",    // Operation is pending
  Approved = "Approved",  // Operation is approved
  All = "All",            // All operations, regardless of their individual status
  Rejected = "Rejected",  // Operation has been rejected
  Blank = "{type}",       // Placeholder for custom type (to be replaced dynamically)
}

// Enum for the different types of asset accounts
export enum assetsAccountType {
  main_account = "Main Account",      // Main account type
  funding_account = "Future Account", // Account used for future trading
  trading_account = "Trading Account",// Account for actual trading
}

// Enum for the different types of asset wallets
export enum assetsWalletType {
  main_wallet = "main_wallet",       // Main wallet type
  funding_wallet = "future_wallet",  // Wallet for future assets
  trading_wallet = "trading_wallet", // Wallet for trading assets
}

// Enum for various staking time formats
export enum stakingTimeFormat {
  Minutes = "Minutes", // Staking duration in minutes
  Days = "Days",       // Staking duration in days
  Months = "Months",   // Staking duration in months
  Years = "Years",     // Staking duration in years
}

// Interface for updating a user's password
export interface updatepassword {
  user_id?: string;       // Optional: User ID
  old_password: string;   // Old password
  new_password: string;   // New password
}

// Interface for verifying anti-phishing codes
export interface antiPhishingCode {
  user_id?: string;      // Optional: User ID
  antiphishing: string;  // Anti-phishing code to verify
  otp?: string;          // Optional: One-Time Password for additional verification
}

// Interface for updating fund code
export interface updateFundcode {
  user_id?: string;      // Optional: User ID
  old_password?: string; // Optional: Old password
  new_password?: string; // Optional: New password
}

// Interface for updating a user's whitelist status
export interface updateWhiteList {
  user_id?: string;    // Optional: User ID
  whitelist?: boolean; // Whitelist status (true/false)
}

// Interface for Google authentication settings
export interface googleAuth {
  user_id?: string;    // Optional: User ID
  token?: string;      // Optional: Google Auth token
  password?: string;   // Optional: User's password for Google Auth
  secret?: string;     // Optional: Google Auth secret key
  TwoFA?: boolean;     // Optional: Enable/disable two-factor authentication
  otp?: string;        // Optional: One-Time Password for verification
}

// Enum to represent market order types (Buy or Sell)
export enum marketOrderEnum {
  buy = "buy",   // Buy order type
  sell = "sell", // Sell order type
}

// Enum for token types (Global or Manual)
export enum tokenTypeEnum {
  global = "global",  // Global token type
  mannual = "mannual",// Manual token type (likely for user-defined tokens)
}

// Enum to represent market types (Market or Limit)
export enum marektTypeEnum {
  market = "market", // Market order type
  limit = "limit",   // Limit order type
}

// Interface for canceling a market order
export interface marketCancel {
  user_id: string;  // User ID requesting the cancellation
  order_id: string; // Order ID to be canceled
}

// Interface for partial execution of a market order
export interface marketPartialExecution {
  token_id: string;   // Token ID involved in the transaction
  order_type: string; // Type of order (buy/sell)
  user_id: string;    // User ID of the person executing the order
  market_type: string;// Type of market (limit/market)
}

// Interface for user asset data, specifying the user's token holdings
export interface userAssetData {
  user_id: string;  // User ID
  token_id: string; // Token ID
}

// Interface for checking user credentials (for login or registration)
export interface checkUser {
  username: string;        // Username
  password: string;        // Password
  confirmPassword: string; // Confirmed password (typically used during registration)
}

// Interface for updating the status of a user
export interface updateUserStatus {
  id?: string;           // Optional: User ID
  statusType?: boolean;  // Optional: User status (active/inactive)
}

// Interface for updating the user's pin code
export interface updateUserPin {
  id?: string;        // Optional: User ID
  pin_code?: string;  // Optional: New pin code for the user
}

// Interface for updating the status of a token
export interface updateTokenStatus {
  id?: string;    // Optional: Token ID
  status?: boolean; // Optional: Token status (active/inactive)
}

// Interface for updating the staking status of a token
export interface updateTokenStakeStatus {
  id?: string;    // Optional: Token ID
  status?: boolean; // Optional: Staking status (active/inactive)
}

// Interface for updating the status of a trading pair
export interface updatePairStatus {
  id?: string;    // Optional: Pair ID
  status?: boolean; // Optional: Pair status (active/inactive)
}

// Interface for updating token network configurations
export interface updateTokenNetwork {
  id?: string;  // Optional: Token ID
  networks: [    // Network configurations for the token
    {
      id: string;     // Network ID
      fee: number;    // Network fee
      decimal: number;// Network decimal precision
      contract: string;// Contract address for the token on the network
    }
  ];
}

// Interface for updating the site down status
export interface updateSiteDownStatus {
  id?: string;      // Optional: Site ID
  down_status?: boolean; // Optional: Site down status (true/false)
}

// Interface for updating the status of future trading pairs
export interface updateFuturePairStatus {
  id?: string;    // Optional: Pair ID
  status?: boolean; // Optional: Future pair status (active/inactive)
}

// Interface for updating the status of the referral program
export interface updateReferProgramStatus {
  id?: string;    // Optional: Program ID
  status?: boolean; // Optional: Program status (enabled/disabled)
}

import BaseController from "../controllers/main.controller";
import dcrypt from "../controllers/watchlist.controller";
import { Web3 } from "web3";
import AbiItem from "web3-utils";

import { isAddress } from "web3-validator";
import { networkInput } from "../models/model/network.model";
import service from "../services/service";
import { AdminPayFeesModel, depositModel, walletsModel } from "../models";

const bep20 = [
  { inputs: [], stateMutability: "nonpayable", type: "constructor" },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Approval",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "Paused",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "from", type: "address" },
      { indexed: true, internalType: "address", name: "to", type: "address" },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Transfer",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "Unpaused",
    type: "event",
  },
  {
    inputs: [
      { internalType: "address", name: "owner", type: "address" },
      { internalType: "address", name: "spender", type: "address" },
    ],
    name: "allowance",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "spender", type: "address" },
      { internalType: "uint256", name: "amount", type: "uint256" },
    ],
    name: "approve",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "account", type: "address" }],
    name: "balanceOf",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "amount", type: "uint256" }],
    name: "burn",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "account", type: "address" },
      { internalType: "uint256", name: "amount", type: "uint256" },
    ],
    name: "burnFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "decimals",
    outputs: [{ internalType: "uint8", name: "", type: "uint8" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "spender", type: "address" },
      { internalType: "uint256", name: "subtractedValue", type: "uint256" },
    ],
    name: "decreaseAllowance",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "spender", type: "address" },
      { internalType: "uint256", name: "addedValue", type: "uint256" },
    ],
    name: "increaseAllowance",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "to", type: "address" },
      { internalType: "uint256", name: "amount", type: "uint256" },
    ],
    name: "mint",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "name",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "pause",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "paused",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "symbol",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalSupply",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "to", type: "address" },
      { internalType: "uint256", name: "amount", type: "uint256" },
    ],
    name: "transfer",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "from", type: "address" },
      { internalType: "address", name: "to", type: "address" },
      { internalType: "uint256", name: "amount", type: "uint256" },
    ],
    name: "transferFrom",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "newOwner", type: "address" }],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "unpause",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

// nonce - String: (optional) The nonce to use when signing this transaction. Default will use web3.eth.getTransactionCount().
// chainId - String: (optional) The chain id to use when signing this transaction. Default will use web3.eth.net.getId().
// to - String: (optional) The recevier of the transaction, can be empty when deploying a contract.
// data - String: (optional) The call data of the transaction, can be empty for simple value transfers.
// value - String: (optional) The value of the transaction in wei.
// gasPrice - String: (optional) The gas price set by this transaction, if empty, it will use web3.eth.getGasPrice()
// gas - String: The gas provided by the transaction.
// chain - String: (optional) Defaults to mainnet.
// hardfork - String: (optional) Defaults to petersburg.
// common - Object: (optional) The common object
// customChain - Object: The custom chain properties
// name - string: (optional) The name of the chain
// networkId - number: Network ID of the custom chain
// chainId - number: Chain ID of the custom chain
// baseChain - string: (optional) mainnet, goerli, kovan, rinkeby, or ropsten
// hardfork - string: (optional) chainstart, homestead, dao, tangerineWhistle, spuriousDragon, byzantium, constantinople, petersburg, or istanbul
// privateKey - String: The private key to sign with.
// callback - Function: (optional) Optional callback, returns an error object as first parameter and the result as second.

interface rawTx {
  // signTransaction
  nonce?: number | string; // optional
  chainId?: number | string; // optional
  to?: string; // optional
  from?: string;
  data?: string; // optional
  value?: string | number; // The value of the transaction in wei.

  gasPrice?: string; // optional
  gasLimit?: string;
  common: {
    customChain: {
      name: string;
      chainId: number;
      networkId: number;
    };
  };
  gas?: string; // required The gas provided by the transaction.
}

class ethereum extends BaseController {
  rpcurl: string;
  chainID: number;
  networkName: string;
  netWorkId: number;
  web3;
  minPrice: number;

  constructor(
    rpcurl: string,
    chainID: number,
    networkName: string,
    netWorkId: number
  ) {
    super();
    this.rpcurl = rpcurl;
    this.chainID = chainID;
    this.networkName = networkName;
    this.netWorkId = netWorkId;

    this.web3 = new Web3(new Web3.providers.HttpProvider(this.rpcurl));
      this.minPrice = 0.0012;
    // this.web3 = new Web3(this.rpcurl);
  }

  isValidAddress(address: string): boolean {
    return isAddress(address);
  }

  unit(balnce: any, number: number): string {
    if (number == 0) balnce = this.web3.utils.fromWei(balnce, "noether");
    else if (number == 1) balnce = this.web3.utils.fromWei(balnce, "wei");
    else if (number == 3) balnce = this.web3.utils.fromWei(balnce, "kwei");
    else if (number == 6) balnce = this.web3.utils.fromWei(balnce, "mwei");
    else if (number == 9) balnce = this.web3.utils.fromWei(balnce, "gwei");
    else if (number == 12) balnce = this.web3.utils.fromWei(balnce, "micro");
    else if (number == 15) balnce = this.web3.utils.fromWei(balnce, "milli");
    else if (number == 18) balnce = this.web3.utils.fromWei(balnce, "ether");
    else if (number == 21) balnce = this.web3.utils.fromWei(balnce, "grand");
    else if (number == 24) balnce = this.web3.utils.fromWei(balnce, "mether");
    else if (number == 27) balnce = this.web3.utils.fromWei(balnce, "gether");
    else if (number == 30) balnce = this.web3.utils.fromWei(balnce, "tether");
    return balnce;
  }

  /**
   *
   * @param adrress wallet balnce return bigint or number
   * @returns
   */

  async mainBalance(adrress: string, deciaml: number = 18): Promise<number> {
    let balance = await this.web3.eth.getBalance(adrress);
    let blnc = this.unit(balance, deciaml);
    return +blnc; // + symbol convert to number
  }

  /**
   *
   */

  async signTransaction(rawTx: rawTx, privateKey: string): Promise<any> {
    return await this.web3.eth.accounts
      .signTransaction(rawTx, privateKey)
      .then((tx) => tx)
      .catch(async (error: any) => {
        console.log(error.message);
        console.log(
          error.message.includes("gasLimit is too low"),
          " ================"
        );
        if (error.message.includes("gasLimit is too low")) {
          let str = error.message;
          let findgasEstimate = str.replaceAll(".", "").split(" ").slice(-1);
          console.log(findgasEstimate[0], "==============");
          rawTx.gasLimit = this.web3.utils.toHex(findgasEstimate[0]);
          return await this.signTransaction(rawTx, privateKey);
        }
      });
  }

  /**
   *
   * @param rawTx transaction send & sing
   * @param privateKey
   * @returns
   */
  async sendSignedTransaction(rawTx: rawTx, privateKey: string): Promise<any> {
    try {
      let sign = await this.signTransaction(rawTx, privateKey);
      if (!sign.rawTransaction) {
        throw new Error(`Signing transaction failed, reason unknown.`);
      }

      return await new Promise<string>((resolve, reject) => {
        this.web3.eth
          .sendSignedTransaction(sign.rawTransaction as string)
          .on("confirmation", (hash: any) => {
            return resolve(hash);
          })
          .on("error", (err: any) => {
            return reject(err);
          })
          .catch((err: any) => {
            return reject(err);
          });
      });
    } catch (error: any) {
      console.log(error, '---------error 3');
      throw new Error(error.message);
    }
  }

  /**
   * get gas estimate fee
   * @param to
   * @param from
   * @param data
   * @returns
   */

  async gasAmount(to: string, from: string, data?: string): Promise<number> {
    let source;
    let limit = 1.6;
    if (data) {
      // this code will create a cost estimate for token transactions
      source = { from: from, to: to, data: data };
      limit = 2.5;
    } else {
      // normal transaction like (BNB/ETH/MATIC)
      source = { from: from, to: to };
    }
    var gasAmount = Number(await this.web3.eth.estimateGas(source));
    console.log("i am here", gasAmount, limit);

    gasAmount = gasAmount * limit;
    console.log("i am here", gasAmount, limit);

    return Math.round(gasAmount);
  }

  /**
   *
   * @param address check is nonce latest then proceed otherwise
   * @returns
   */
  async getNonce(address: string): Promise<number | boolean> {
    let old = await this.web3.eth.getTransactionCount(address, "pending");
    let newOne = await this.web3.eth.getTransactionCount(address, "latest");
    if (old == newOne) {
      // console.log("nonce resolved.....", newOne);
      return Number(newOne);
    }
    // console.log("nonce not resolved.....", Number(newOne));
    return this.getNonce(address);
  }

  /**
   * base transaction BNB/ETH/Matic
   * @param to
   * @param from
   * @param amount
   * @param privateKey
   * @returns
   */

  async normalTransaction(
    to: string,
    amount: number,
    privateKey: string,
    decimal: number = 18
  ) {
    try {
      /**
       * Is valid address
       */
      if (privateKey === "") {
        let walletKey: any = process?.env?.MASTER_PKEY_BEP20;
        let masterWalletKey = await service.watchlist.decrypt(walletKey);
        privateKey = masterWalletKey;
      }
      const senderAccount =
        this.web3.eth.accounts.privateKeyToAccount(privateKey);

      if (!this.isValidAddress(to) && !this.isValidAddress(senderAccount.address)) {
        throw new Error(
          "Address is not vaild when trying made normal transaction."
        );
      }

      let nonce = await this.getNonce(senderAccount.address);
      let gasLimit = await this.gasAmount(to, senderAccount.address);
      let gasPrice = await this.web3.eth.getGasPrice();
      let paidAmount;
      if (decimal == 18) {
        paidAmount = this.web3.utils.toWei(amount.toString(), "ether");
      }

      if (paidAmount == undefined) return;

      let data: rawTx = {
        nonce: this.web3.utils.toHex(nonce),
        to: to,
        gasLimit: this.web3.utils.toHex(gasLimit),
        gasPrice: this.web3.utils.toHex(gasPrice),
        value: paidAmount,
        chainId: this.chainID,
        data: "0x0",
        common: {
          customChain: {
            chainId: this.chainID,
            name: this.networkName,
            networkId: this.netWorkId,
          },
        },
      };

      return await this.sendSignedTransaction(data, privateKey);
    } catch (error: any) {
      return error.message;
    }
  }

  /**
   * smart contract based payment
   * @param contract
   * @param to
   * @param privateKey
   * @param Amount
   */

  async tokenTransaction(
    contractAddress: string,
    to: string,
    privateKey: string,
    Amount: number
  ) {
    try {
      /**
       * Is valid address
       */
      if (!this.isValidAddress(to) && !this.isValidAddress(contractAddress)) {
        throw new Error(
          "(From & To & Contract) is not vaild when trying made normal transaction."
        );
        return;
      }

      if (privateKey === "") {
        let walletKey: any = process?.env?.MASTER_PKEY_BEP20;
        let masterWalletKey = await service.watchlist.decrypt(walletKey);
        privateKey = masterWalletKey;
      }

      // const contract = new Contract(bep20, contractAddress, this.web3);
      // Set the sender's account using the private key
      const senderAccount =
        this.web3.eth.accounts.privateKeyToAccount(privateKey);
      this.web3.eth.accounts.wallet.add(senderAccount);

      const contract = new this.web3.eth.Contract(bep20, contractAddress);

      const deciaml = Number(await contract.methods.decimals().call());
      console.log(deciaml, " === deciaml");
      // ---------- Comment by surinder kumar(11-Jan-2024)
      // var contractName = await contract.methods.name().call();
      // console.log(contractName, " === contractName");

      const symbol = await contract.methods.symbol().call();
      console.log(symbol, " === symbol");

      const balance = Number(
        await contract.methods.balanceOf(senderAccount.address).call()
      );

      console.log(balance / 10 ** 18, " === balance");

      // check nagtive value
      if (Amount < 0) {
        throw new Error(`Nagtive value is not allowed.`);
        return;
      }

      // check account balance is zero
      if (balance == 0) {
        throw new Error(`Sorry your account balance in zero.`);
        return;
      }

      let paidAmount = this.web3.utils.toWei(Amount.toString(), "ether");

      console.log(paidAmount, "  === paidAmount");

      let dataVal = contract.methods.transfer(to, paidAmount).encodeABI();

      console.log(dataVal, " ==== dataVal");

      let nonce = await this.getNonce(senderAccount.address);
      let gasLimit = await this.gasAmount(to, senderAccount.address, dataVal);
      console.log(gasLimit, " = = = = = = = gasLimit");

      let gasPrice = Number(await this.web3.eth.getGasPrice());
      console.log(gasPrice, " = = = = = = = gasPrice");

      var block = await this.web3.eth.getBlock("latest");
      console.log(block.gasLimit, " = = = = = = = gasPrice");

      let Estimate = await contract.methods
        .transfer(to, paidAmount.toString())
        .estimateGas({ from: senderAccount.address });

      console.log(Estimate, " = = = = = = = Estimate");

      console.log();
      let data = {
        from: senderAccount.address,
        nonce: Number(nonce),
        to: contractAddress,
        gas: Number(gasLimit).toString(),
        gasPrice: gasPrice.toString(),
        chainId: this.chainID,
        data: dataVal,
        common: {
          customChain: {
            chainId: this.chainID,
            name: this.networkName,
            networkId: this.netWorkId,
          },
        },
      };

      let result = await this.sendSignedTransaction(data, privateKey);
      return result;
    } catch (error: any) {
      return error.message;
    }
  }

  /**
   *
   * @returns
   */
  async createAccount(): Promise<any> {
    try {
      return await this.web3.eth.accounts.create();
    } catch (error: any) {
      return error.message;
    }
  }


  async tokenTransferToAdmin(payload: any): Promise<any> {

    console.log('----------totken transfer to admin');

    let networkTrnx;
    if (payload.network !== undefined && payload.tx_hash !== undefined && payload.tx_hash !== null && payload.tx_hash !== "") {

      let contractAddress = payload?.contract;

      let userWallet: any = await walletsModel.findOne({ where: { user_id: payload?.user_id }, raw: true });

      let p_key = userWallet?.wallets?.eth?.privateKey;
      let amount = payload?.amount;

      let US_balance: any = Number(await this.web3.eth.getBalance(payload?.address));
      US_balance = US_balance / 10 ** 18;

      US_balance = US_balance.toString().match(/^-?\d+(?:\.\d{0,4})?/)[0];

      console.log(US_balance, '=======US balance');


      if (US_balance < this.minPrice) {

        console.log("user balance is to low")
        let feeRealsed: any = await depositModel.findOne({ where: { id: payload?.id }, raw: true });
        let sendGasAmount = this.minPrice - US_balance; // 0.0008

        if (feeRealsed.gasFee === false || feeRealsed.gasFee === 0) { // fee already released
          await depositModel.update({ gasFee: true }, { where: { id: payload?.id } })
          console.log("sending gas fee....", sendGasAmount.toFixed(4))
          await this.sendBNBgasFee(payload?.id, payload?.address, sendGasAmount.toFixed(4), payload?.network, payload)
        }
        return false
      }

      let wallet: any = process?.env?.MASTER_WALLET_BEP20;
      let masterWallet = await service.watchlist.decrypt(wallet);

      if (contractAddress !== "" && contractAddress !== undefined) {
        // -------------------------------------------------
        // Token based transaction
        // -------------------------------------------------

        networkTrnx = await this.tokenTransaction(contractAddress, masterWallet, p_key, amount);
      }
      else {
        // -------------------------------------------------
        // Normal contract based transaction
        // -------------------------------------------------
        networkTrnx = await this.normalTransaction(masterWallet, amount, p_key, 18);
      }

      if (networkTrnx) {
        // update deposit table transfer hash after assets send to admin wallet
        await depositModel.update({ transferHash: networkTrnx?.receipt?.transactionHash, cronStatus: true }, { where: { id: payload?.id } });
      }
      else {
        throw new Error(networkTrnx);
      }

    }

    return networkTrnx;
  }

  sendBNBgasFee = async (postID: string, address: string, amount: string, networkId: string, payload: any) => {
    try {
      console.log('----------BNB transfer to user');
      let wallet: any = process?.env?.MASTER_WALLET_BEP20;
      let masterWallet = await service.watchlist.decrypt(wallet);

      var gasAmount: any = await this.web3.eth.estimateGas({
        from: masterWallet,
        to: address,
        // data: dataVal
      })

      gasAmount = Number(gasAmount) * 1.4
      gasAmount = this.round(gasAmount, 4)

      let pendingNonce = await this.web3.eth.getTransactionCount(masterWallet, 'pending');
      let latestNonce = await this.web3.eth.getTransactionCount(masterWallet, 'latest');

      let nonce
      if (pendingNonce == latestNonce) {
        nonce = latestNonce
      } else {
        console.log("bnb gas fee transfer to customer resolved.....")
        return
      }

      let network: networkInput = await service.network.networkById(networkId);

      let gasLimit = await this.gasAmount(address, masterWallet);

      // var block = await this.web3.eth.getBlock('latest')

      // var gasLimit = block.gasLimit

      console.log('gasLimit  ', gasLimit)

      var gasPrice = await this.web3.eth.getGasPrice();
      console.log('gasPrice', gasPrice)

      let sendFees = Number(amount);
      console.log(sendFees, '==========send Fees');

      amount = this.web3.utils.toWei(amount.toString(), 'ether')

      if (network && network.rpcUrl !== undefined && network.chainId !== undefined && network.fullname !== undefined) {

        let data: rawTx = {
          nonce: this.web3.utils.toHex(Number(nonce)),
          to: address,
          gasLimit: this.web3.utils.toHex(gasLimit),
          gasPrice: this.web3.utils.toHex(gasPrice),
          value: amount,
          chainId: network?.chainId,
          data: "0x0",
          // gas: "31000",
          common: {
            customChain: {
              chainId: network?.chainId,
              name: network?.fullname,
              networkId: network?.chainId,
            },
          },
        };

        let walletKey: any = process?.env?.MASTER_PKEY_BEP20;
        let masterWalletKey = await service.watchlist.decrypt(walletKey);

        const signedTx = await this.signTransaction(
          data,
          masterWalletKey,
        )

        if (!signedTx.rawTransaction) {
          await depositModel.update({ gasFee: false }, { where: { id: postID } })
          throw new Error(`Signing transaction failed, reason unknown.`);
        }

        let trxData = await new Promise<string>((resolve, reject) => {
          this.web3.eth
            .sendSignedTransaction(signedTx.rawTransaction as string)
            .on("confirmation", async (hash: any) => {
              return resolve(hash);
            })
            .on("error", (err: any) => {
              return reject(err);
            })
            .catch((err: any) => {
              console.log('----here error 2', err.message);
              return reject(err);
            });
        });

        if (trxData) {
          let receipt: any = {
            blockHash: trxData,
          }

          console.log(
            { success: 1, status: 'success', receipt: receipt },
            ' BINANCE The hash of your transaction is: ',
            trxData,
          )

          // ----------update deposit table fees field 
          await depositModel.update({ gasFee: false }, { where: { id: postID } });

          // ----------save record in admin pay fees table
          await AdminPayFeesModel.create({ deposit_id: postID, trx_hash: receipt?.blockHash?.receipt?.transactionHash, user_address: address, fees: sendFees });

          // ------After fees add than assets transfer to admin
          await this.tokenTransferToAdmin(payload);

          return { success: 1, status: 'success', receipt: receipt }
        } else {

          await depositModel.update({ gasFee: false, cronStatus: false }, { where: { id: postID } })

          console.log(
            '❗Something went wrong while submitting your transaction:'
          )

          return { success: 0, status: 'fail' }
        }
      }

    } catch (error) {
      await depositModel.update({ gasFee: false, cronStatus: false }, { where: { id: postID } })
    }

  }

  round = (number: any, decimalPlaces: any) => {
    const factorOfTen = Math.pow(10, decimalPlaces)
    return Math.round(number * factorOfTen) / factorOfTen
  }

}

export default ethereum;

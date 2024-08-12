const TronWeb = require("tronweb");

const tronAbi = [
  {
    constant: true,
    inputs: [],
    name: "name",
    outputs: [
      {
        name: "",
        type: "string",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "symbol",
    outputs: [
      {
        name: "",
        type: "string",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "decimals",
    outputs: [
      {
        name: "",
        type: "uint8",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [
      {
        name: "_owner",
        type: "address",
      },
    ],
    name: "balanceOf",
    outputs: [
      {
        name: "balance",
        type: "uint256",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        name: "_to",
        type: "address",
      },
      {
        name: "_value",
        type: "uint256",
      },
    ],
    name: "transfer",
    outputs: [
      {
        name: "",
        type: "bool",
      },
    ],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [
      {
        name: "_owner",
        type: "address",
      },
      {
        name: "_spender",
        type: "address",
      },
    ],
    name: "allowance",
    outputs: [
      {
        name: "remaining",
        type: "uint256",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        name: "_spender",
        type: "address",
      },
      {
        name: "_value",
        type: "uint256",
      },
    ],
    name: "approve",
    outputs: [
      {
        name: "",
        type: "bool",
      },
    ],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        name: "_from",
        type: "address",
      },
      {
        name: "_to",
        type: "address",
      },
      {
        name: "_value",
        type: "uint256",
      },
    ],
    name: "transferFrom",
    outputs: [
      {
        name: "",
        type: "bool",
      },
    ],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        name: "_newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        name: "_initialSupply",
        type: "uint256",
      },
      {
        name: "_name",
        type: "string",
      },
      {
        name: "_symbol",
        type: "string",
      },
      {
        name: "_decimals",
        type: "uint8",
      },
    ],
    payable: false,
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: "_from",
        type: "address",
      },
      {
        indexed: true,
        name: "_to",
        type: "address",
      },
      {
        indexed: false,
        name: "_value",
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
        indexed: true,
        name: "_owner",
        type: "address",
      },
      {
        indexed: true,
        name: "_spender",
        type: "address",
      },
      {
        indexed: false,
        name: "_value",
        type: "uint256",
      },
    ],
    name: "Approval",
    type: "event",
  },
];

const tronWeb = new TronWeb({
  fullHost: "https://api.trongrid.io", // Example provider URL
});

class tronBlockChain {
  rpcURL: string;
  privateKey: string;
  tronWeb: any;

  constructor(rpcURL: string = "https://api.trongrid.io", privateKey: string) {
    this.rpcURL = rpcURL;
    this.privateKey = privateKey;
    this.tronWeb = new TronWeb({
      fullHost: this.rpcURL, // Example provider URL
      privateKey: privateKey,
    });
  }

  /**
   *
   * @param fromAddress
   * @param toAddress
   * @param amountTRX
   * @param privateKey
   * @returns
   */

  async sendTRX(
    fromAddress: string,
    toAddress: string,
    amountTRX: number,
    privateKey: string
  ): Promise<any> {
    // Convert TRX to SUN
    const amountInSUN = amountTRX * 1000000;

    try {
      // console.log(fromAddress);

      const balanceInSUN = await this.tronWeb.trx.getBalance(fromAddress);
      // console.log(balanceInSUN);
      const balanceInTRX = balanceInSUN / 1000000;

      // console.log(balanceInTRX, " == balanceInTRX == ", amountInSUN, " == ");

      if (amountTRX > balanceInTRX) {
        throw new Error("Your balance is insufficient.");
      }

      const transaction = await this.tronWeb.transactionBuilder.sendTrx(
        toAddress,
        amountInSUN
        //   tronWeb.defaultAddress.base58
      );

      const signedTransaction = await this.tronWeb.trx.sign(transaction);
      const transactionResponse = await this.tronWeb.trx.sendRawTransaction(
        signedTransaction
      );

      if (transactionResponse.hasOwnProperty("code")) {
        throw new Error(transactionResponse?.code);
      } else {
        // console.log(transactionResponse);
        return transactionResponse;
      }
    } catch (error: any) {
      return error.message;
    }
  }

  /**
   *
   * @param contract
   * @param from
   * @param to
   * @param privatekey
   * @param amount
   */

  async tokenTransaction(
    contract: string,
    from: string,
    to: string,
    privatekey: string,
    amount: number
  ): Promise<any> {
    try {
      if (amount < 0) {
        throw new Error("Negtive value are not allowed here");
      }
      // Contract instance
      const contractObj = this.tronWeb.contract(tronAbi, contract);

      const balanceInSUN = await contractObj.methods.balanceOf(from).call();
      const decimals = await contractObj.methods.decimals().call();
      const balanceInTokens = balanceInSUN / 10 ** decimals;

      // Sender's address
      const senderAddress = from; //"sender_address";

      // Receiver's address
      const receiverAddress = to; //"receiver_address";

      // Amount of tokens to transfer

      const amountInSUN = amount * 10 ** decimals;

      if (amount > balanceInTokens) {
        throw new Error("Your balance is insufficient.");
      }

      const transferFunction = contractObj.methods.transfer(
        receiverAddress,
        amountInSUN
      );

      const options = {
        feeLimit: 100000000, // Adjust the fee limit as needed
        callValue: 0, // No value to send
        from: senderAddress,
        shouldPollResponse: true,
      };


      const tx = await this.tronWeb.transactionBuilder.triggerSmartContract(
        contract,
        "transfer(address,uint256)",
        options,
        [
          { type: "address", value: receiverAddress },
          { type: "uint256", value: amountInSUN },
        ]
      );
      // console.log("Signed Transaction:", tx.transaction);

      const signedTx = await this.tronWeb.trx.sign(tx.transaction);
      // console.log("Signed Transaction:", signedTx);

      const broadcastTx = await this.tronWeb.trx.sendRawTransaction(signedTx);
      // console.log("Signed Transaction:", broadcastTx);

      return broadcastTx;
    } catch (error: any) {
      return error.message;
    }
  }

  // Create a new account
  async createNewAccount() : Promise<any> {
    try {
      return await this.tronWeb.createAccount();
    } catch (error : any) {
        return error.message
      console.error("Error creating new account:", error);
    }
  }

}
export default tronBlockChain;

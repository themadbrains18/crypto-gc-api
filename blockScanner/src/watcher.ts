import Web3, { DataFormat, WebSocketProvider } from "web3";
// const validateTransaction = require('./validate')
import validateTransaction from "./validate";
import confirmEtherTransaction from "./confirm";
import { registeredSubscriptions } from "web3/lib/commonjs/eth.exports";

import service from "../../src/services/service";

import cron from "node-cron";
import {
  walletsModel,
  Op,
  Database,
  depositModel,
  assetModel,
  networkModel,
} from "../../src/models";
import { depositInput, depositOuput } from "../models/model/deposit.model";

interface upsertAsserts {
  user_id: string;
  walletTtype: string;
  token_id: string;
}



class MonitorEth {
  private web3;
  private lastSyncedBlock: any;

  constructor(nativeSymbol: string, rpcUrl: string, walletSupport: string) {
    // this.web3 = new Web3(rpcUrl);
    this.lastSyncedBlock = null;
    this.web3 = new Web3(rpcUrl);
  }

  async initializeLastSyncedBlock() {
    try {

      const getQuery="SELECT blockNumber FROM block_records WHERE chainId=?"

      // const sql ="UPDATE block_records SET blockNumber=? WHERE chainId=? ";
      let getBlock : any = await service.jsonFileReadWrite.EXget(getQuery,['97'])
      if (getBlock == undefined || getBlock === ""){
          // const sql ="UPDATE block_records SET blockNumber=? WHERE chainId=? ";
          // let updateBlock = await service.jsonFileReadWrite.EXget(getQuery,['97'])
          let sql ="INSERT INTO block_records (blockNumber, chainId) VALUES (?,?)";
          this.lastSyncedBlock = Number(await this.getLastBlockNumber());
          let getBlock = await service.jsonFileReadWrite.EXquery(sql,[this.lastSyncedBlock,'97'])

      }else{
        this.lastSyncedBlock = getBlock?.blockNumber
      }

    } catch (error) {
      this.initializeLastSyncedBlock();
    }
  }

  async getBlock(blockNumber: number) {
    return this.web3.eth.getBlock(blockNumber, true);
  }

  async getLastBlockNumber() {
    try {
      return this.web3.eth.getBlockNumber();
    } catch (error) {
      console.log("something wrong....");
    }
  }

  async searchTransaction() {
    try {
      let lastBlock: BigInt | number | undefined = await this.getLastBlockNumber();
      lastBlock = Number(lastBlock);
      if(this.lastSyncedBlock === null || this.lastSyncedBlock === 1) return;
      console.log(this.lastSyncedBlock, " ==== lastSyncedBlock");
      console.log(`Searching blocks: ${this.lastSyncedBlock + 1} - ${lastBlock}`);

     let rc : any= await  service.jsonFileReadWrite.EXall(`SELECT * FROM address_records WHERE walletType='eth'`)
      for (let blockNumber = this.lastSyncedBlock + 1;
        blockNumber < lastBlock+1;
        blockNumber++) {
          console.log(blockNumber,'inside ------------------------')
          let tos = rc[0]?.records ? JSON.parse(rc[0]?.records) : {}
        this.getBlockInfo(lastBlock,tos)
      }
      this.lastSyncedBlock = lastBlock;
      console.log(`Finished searching blocks: ${this.lastSyncedBlock + 1} - ${lastBlock}`);
    } catch (error) {
      console.log(error, " ------------------ i am in ---------------");
      this.searchTransaction()
    }
  }

  async getBlockInfo(blockNum: number, to :any) {
    
    try {
      const block = await this.getBlock(blockNum); // 34878923
      if (!block?.transactions) {
        return;
      }
      let tx: any;
      for (tx of block.transactions) {
        if (!tx?.to) {
          continue;
        }
  
        if (to.address.includes(tx.to.toLowerCase())) {
          console.log(
            "===========================native transaction================================="
          );
          this.enternalTransaction(tx);
        }
        if (to.contarct.includes(tx.to.toLowerCase())) {
          console.log(
            "============================contract================================"
          );
          this.extranalTransaction(tx?.hash);
        }
      }
      const sql ="UPDATE block_records SET blockNumber=? WHERE chainId=? ";
      await service.jsonFileReadWrite.EXquery(sql,[blockNum,'97'])
    } catch (error) {
      this.getBlockInfo(blockNum,to);
    }
  }
  /**
   * Internal transaction means native transaction Binance network on bnb is native
   * @param hash
   */

  enternalTransaction = async (data: any) => {
    try {
      let receipt: any = await this.web3.eth.getTransactionReceipt(data?.hash);

      let findwallet = Database.where(
        Database.col("wallets"), // Just 'name' also works if no joins
        Op.like,
        `%${this.web3.utils.toChecksumAddress(data?.to)}%`
      );
      let getNetworkId = "";
      let getUseridByWallet = await walletsModel.findOne({
        where: findwallet,
        attributes: {
          exclude: ["id", "deletedAt", "wallets", "createdAt", "updatedAt"],
        },
        raw: true,
      });
      if (getUseridByWallet?.user_id === undefined) return;
      let depositData: depositInput = {
        address: data?.to,
        coinName: "BNB",
        network: getNetworkId,
        amount: (Number(data?.value) / 10 ** 18).toString(),
        successful: `${Number(receipt?.status)}`,
        user_id: getUseridByWallet?.user_id,
        cronStatus: false,
        transferHash: "",
        tx_hash: receipt?.transactionHash,
        gasFee: "",
        queue: false,
        ignore: false,
        blockHeight: `${Number(receipt?.blockNumber)}`,
        contract: "",
      };

      this.upsert(depositData, receipt?.transactionHash);
    } catch (error) {
      this.enternalTransaction(data)
    }
  };

  // async  updateOrCreate (condition : object, newItem : object) {
  //     // First try to find the record
  //   const foundItem = await depositModel.findOne({where:condition});
  //   if (!foundItem) {
  //         // Item not found, create a new one
  //         const item = await depositModel.create(newItem)
  //         return  {item, created: true};
  //     }
  //     // Found an item, update it
  //     const item = await depositModel.update(newItem, {where});
  //     return {item, created: false};
  // }

  paddedToChecksumAddress(address: string) {
    if (address.slice(0, 2) === "0x") address = address.slice(2);
    while (address.slice(0, 2) === "00") address = address.slice(2);
    return this.web3.utils.toChecksumAddress("0x" + address);
  }

  /**
   * extranal transaction means contarct or nft based transaction
   * @param hash
   */

  extranalTransaction = async (hash: string) => {
    if (!this.web3) return;
    try {
      let receipt: any = await this.web3.eth.getTransactionReceipt(hash);
      let contractAddress = this.web3.utils.toChecksumAddress(receipt?.to);

      // ==============================Get token details================================ //
      let tokenDetails = await service.token.getSingleToken(contractAddress);
      if (tokenDetails === null) return;
      // ==============================Get decimal================================ //
      let decimals = 0;
      let getNetworkId = "";
      if (tokenDetails?.networks?.length > 0) {
        for (let decimal of tokenDetails?.networks) {
          if (decimal?.contract == contractAddress) {
            decimals = +decimal?.decimal;
            getNetworkId = decimal?.id;
          }
        }
      }

      // ========================== convert amount in number ==================================== //

      let amount: BigInt | number = Number(
        this.web3.utils.hexToNumber(receipt?.logs[0]?.data)
      );
      // console.log(amount / 10 ** decimals)
      // console.log(receipt.logs[0].topics)

      let walletAddress = this.paddedToChecksumAddress(
        receipt.logs[0].topics[2]
      );

      let findwallet = Database.where(
        Database.col("wallets"), // Just 'name' also works if no joins
        Op.like,
        `%${walletAddress}%`
      );

      let getUseridByWallet = await walletsModel.findOne({
        where: findwallet,
        attributes: {
          exclude: ["id", "deletedAt", "wallets", "createdAt", "updatedAt"],
        },
        raw: true,
      });

      if (getUseridByWallet?.user_id === undefined) return;

      let depositData: depositInput = {
        address: walletAddress,
        coinName: tokenDetails?.fullName,
        network: getNetworkId,
        amount: (amount / 10 ** decimals).toString(),
        successful: `${Number(receipt?.status)}`,
        user_id: getUseridByWallet?.user_id,
        cronStatus: false,
        transferHash: "",
        tx_hash: receipt?.transactionHash,
        gasFee: "",
        queue: false,
        ignore: false,
        blockHeight: `${Number(receipt?.blockNumber)}`,
        contract: contractAddress,
      };

      this.upsert(depositData, receipt?.transactionHash);

      // console.log(receipt?.to,tokenDetails, this.web3.utils.toChecksumAddress(receipt?.to))
      // console.log(this.web3.utils.hexToNumber(receipt.logs[0].data))
    } catch (error) {
      this.extranalTransaction(hash)
    }
  };

  upsert(values: depositInput, hash: string) {
    depositModel
      .findOne({ where: { tx_hash: hash } })
      .then(async function (obj) {
        // update
        if (obj) return false;
        // insert
        return depositModel.create(values);
      });
  }

  upsertAssets(values: depositInput, data: upsertAsserts) {
    assetModel
      .findOne({
        where: {
          user_id: data?.user_id,
          walletTtype: "main_wallet",
          token_id: data?.token_id,
        },
      })
      .then(async function (obj) {
        // update
        if (obj) {
          let amount =
            values?.amount === undefined
              ? obj.balance
              : obj.balance + +values?.amount;
          obj.update({ balance: amount });
          return false;
        }
        // insert
        return assetModel.create(values);
      });
  }
}

// mainCron();
export async function mainCron() {

  let activeNetworks = await networkModel.findAll({
    where: { status: true },
    raw: true,
  });

  // service.jsonFileReadWrite.writeOnly("eth");

  cron.schedule("*/3 * * * * *", async () => {
    console.log("Cron started.");

    let nativeSymbol = "BNB";
    let rpcUrl = "https://data-seed-prebsc-1-s1.binance.org:8545/";
    let walletSupport = "eth";

    let eths: any = service.jsonFileReadWrite.readonly("eth"); // wallets address list
    let monitor = new MonitorEth(nativeSymbol, rpcUrl, walletSupport);
    monitor.initializeLastSyncedBlock();
    await monitor.searchTransaction();
    
    console.log("Cron finished.");
  });

  // const monitor = new MonitorEth(
  //   "wss://bsc.getblock.io/e0f52825-53a6-48ab-a20e-f35712d4e03f/testnet/"
  // );
  // await monitor.initializeLastSyncedBlock();
  // console.log("Looking for transactions...");

  // // service.jsonFileReadWrite.writeOnly('eth')

  return { status: "working" };
}

const TOKEN_ABI = [
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
        name: "success",
        type: "bool",
      },
    ],
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "totalSupply",
    outputs: [
      {
        name: "",
        type: "uint256",
      },
    ],
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
        name: "success",
        type: "bool",
      },
    ],
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
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "version",
    outputs: [
      {
        name: "",
        type: "string",
      },
    ],
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
        name: "success",
        type: "bool",
      },
    ],
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
      {
        name: "_extraData",
        type: "bytes",
      },
    ],
    name: "approveAndCall",
    outputs: [
      {
        name: "success",
        type: "bool",
      },
    ],
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
    type: "function",
  },
  {
    constant: false,
    type: "fallback",
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
] as const; // assert { type: "json" };
// Load Contract

const renderJson = (object: any) => {
  return JSON.stringify(object, (key, value) => {
    switch (typeof value) {
      case "bigint":
        return {
          // warpper
          $T$: "bigint", // type   // maybe it is good to use some more complicated name instead of $T$
          $V$: value.toString(), // value  // maybe it is good to use some more complicated name instead of $V$
        };
      // Put more cases here ...
      default:
        return value;
    }
  });
};

const confirm = async (web3: any, hash: any) => {
  console.log(await Promise.all([confirm2(web3, hash)]));
};

const confirm2 = (web3: any, hash: string) => {
  return new Promise((resolve, reject) => {
    const trx = web3.eth.getTransactionReceipt(hash);
    resolve(trx);
  });
};

export async function watchEtherTransfers(wss: any) {
  const ganacheUrl =
    process.env.INFURA_WS_URL ||
    "wss://bsc.getblock.io/e0f52825-53a6-48ab-a20e-f35712d4e03f/testnet/";

  let options: any = {
    timeout: 10000, // ms

    clientConfig: {
      keepalive: true,
      keepaliveInterval: 20000, // ms
    },

    reconnect: {
      auto: true,
      delay: 10000, // ms
      maxAttempts: 5,
      onTimeout: false,
    },
  };

  const wsProvider = new Web3.providers.WebsocketProvider(ganacheUrl, options);

  wsProvider.on("connect", function () {
    connect();
    console.log("! provider connected", new Date()); // <- fires after successful connection
  });

  wsProvider.on("error", (err: any) => {
    console.log("~ on-error:", err); // <- never fires
  });

  wsProvider.on("end", (err: any) => {
    console.log("~ on-end:", err); // <- never fires
  });

  wsProvider.on("close", (event: any) => {
    console.log("~ on-close:", event); // <- never fires
  });

  var web3;

  async function connect(): Promise<any> {
    try {
      return;

      console.log(
        "Does the provider support subscriptions?:",
        wsProvider.supportsSubscriptions()
      );
      const web3 = new Web3(wsProvider);

      // Get transaction details

      let ethWallet = await service.userWalletServices.allWallets("eth");

      let clS = await web3.eth.clearSubscriptions();

      // Subscribe to new block headers
      const subscription = await web3.eth.subscribe("logs", {
        fromBlock: "latest",
        // address:[
        //   '0x343ACe9B4882d1C45d84Bd948A6f0E5ba0e47Eb4',
        //   '0xeb4AE1a3D387f637d09f5732D47D793A65fed4f0',
        //   '0x81d2dA90cfb1131Bd4c0cbbe651D6A28E4FC8811'
        // ],
        topics: [
          // '0x93a090ecc682c002995fad3c85b30c5651d7fd29b0be5da9d784a3302aedc055',
          // '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef' // smart contract
        ],
      });

      subscription.on("data", async (blockhead) => {
        // console.log('New block header: ', blockhead);

        if (!ethWallet || !ethWallet[0]) {
          return;
        }

        for (let addrs of ethWallet) {
          let account = [
            "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
            `${web3.utils.padLeft("0x", 24)}${addrs.address.split("0x")[1]}`,
          ];
          let number: number[] = [];
          blockhead?.topics?.find((item, index) => {
            if (account.includes(item)) number.push(index);
          });
          if (number.length > 0 && account.length === number.length) {
            const sum: number = number.reduce(
              (partialSum, a) => partialSum + a,
              0
            );
            console.log(sum);

            if (+sum === 2) {
              // recive
              //  confirm(web3, blockhead?.transactionHash);
              console.log("recivied");
            }
          }
        }

        // You do not need the next line if you like to keep notified for every new block
        // await subscription.unsubscribe();
        console.log("Unsubscribed from new block headers.");
      });
      subscription.on("error", (error) =>
        console.log("Error when subscribing to New block header: ", error)
      );
    } catch (error) {
      console.error(error);
    }
  }
}

// Connect to Ethereum Network and start listening events

export async function allSubscription(): Promise<any> {
  try {
    console.log(" = = = = = = = = subs");

    const ganacheUrl =
      process.env.INFURA_WS_URL ||
      "wss://bsc.getblock.io/e0f52825-53a6-48ab-a20e-f35712d4e03f/testnet/";
    const wsProvider = new Web3.providers.WebsocketProvider(ganacheUrl);
    const web3 = new Web3(wsProvider);
    let subs = await web3.eth.subscribe("logs");
    console.log(subs, " = = = = = = = = subs");
    return subs;
  } catch (error: any) {
    new Error(error.message);
  }
}

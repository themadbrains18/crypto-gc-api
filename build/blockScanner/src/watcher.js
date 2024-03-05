"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.allSubscription = exports.watchEtherTransfers = exports.mainCron = void 0;
const web3_1 = __importDefault(require("web3"));
const service_1 = __importDefault(require("../../src/services/service"));
const node_cron_1 = __importDefault(require("node-cron"));
const models_1 = require("../../src/models");
class MonitorEth {
    web3;
    lastSyncedBlock;
    constructor(nativeSymbol, rpcUrl, walletSupport) {
        // this.web3 = new Web3(rpcUrl);
        this.lastSyncedBlock = null;
        this.web3 = new web3_1.default(rpcUrl);
    }
    async initializeLastSyncedBlock() {
        try {
            const getQuery = "SELECT blockNumber FROM block_records WHERE chainId=?";
            // const sql ="UPDATE block_records SET blockNumber=? WHERE chainId=? ";
            let getBlock = await service_1.default.jsonFileReadWrite.EXget(getQuery, ['97']);
            if (getBlock == undefined || getBlock === "") {
                // const sql ="UPDATE block_records SET blockNumber=? WHERE chainId=? ";
                // let updateBlock = await service.jsonFileReadWrite.EXget(getQuery,['97'])
                let sql = "INSERT INTO block_records (blockNumber, chainId) VALUES (?,?)";
                this.lastSyncedBlock = Number(await this.getLastBlockNumber());
                let getBlock = await service_1.default.jsonFileReadWrite.EXquery(sql, [this.lastSyncedBlock, '97']);
            }
            else {
                this.lastSyncedBlock = getBlock?.blockNumber;
            }
        }
        catch (error) {
            this.initializeLastSyncedBlock();
        }
    }
    async getBlock(blockNumber) {
        return this.web3.eth.getBlock(blockNumber, true);
    }
    async getLastBlockNumber() {
        try {
            return this.web3.eth.getBlockNumber();
        }
        catch (error) {
            console.log("something wrong....");
        }
    }
    async searchTransaction() {
        try {
            let lastBlock = await this.getLastBlockNumber();
            lastBlock = Number(lastBlock);
            if (this.lastSyncedBlock === null || this.lastSyncedBlock === 1)
                return;
            console.log(this.lastSyncedBlock, " ==== lastSyncedBlock");
            console.log(`Searching blocks: ${this.lastSyncedBlock + 1} - ${lastBlock}`);
            let rc = await service_1.default.jsonFileReadWrite.EXall(`SELECT * FROM address_records WHERE walletType='eth'`);
            for (let blockNumber = this.lastSyncedBlock + 1; blockNumber < lastBlock + 1; blockNumber++) {
                console.log(blockNumber, 'inside ------------------------');
                let tos = rc[0]?.records ? JSON.parse(rc[0]?.records) : {};
                this.getBlockInfo(lastBlock, tos);
            }
            this.lastSyncedBlock = lastBlock;
            console.log(`Finished searching blocks: ${this.lastSyncedBlock + 1} - ${lastBlock}`);
        }
        catch (error) {
            console.log(error, " ------------------ i am in ---------------");
            this.searchTransaction();
        }
    }
    async getBlockInfo(blockNum, to) {
        try {
            const block = await this.getBlock(blockNum); // 34878923
            if (!block?.transactions) {
                return;
            }
            let tx;
            for (tx of block.transactions) {
                if (!tx?.to) {
                    continue;
                }
                if (to.address.includes(tx.to.toLowerCase())) {
                    console.log("===========================native transaction=================================");
                    this.enternalTransaction(tx);
                }
                if (to.contarct.includes(tx.to.toLowerCase())) {
                    console.log("============================contract================================");
                    this.extranalTransaction(tx?.hash);
                }
            }
            const sql = "UPDATE block_records SET blockNumber=? WHERE chainId=? ";
            await service_1.default.jsonFileReadWrite.EXquery(sql, [blockNum, '97']);
        }
        catch (error) {
            this.getBlockInfo(blockNum, to);
        }
    }
    /**
     * Internal transaction means native transaction Binance network on bnb is native
     * @param hash
     */
    enternalTransaction = async (data) => {
        try {
            let receipt = await this.web3.eth.getTransactionReceipt(data?.hash);
            let findwallet = models_1.Database.where(models_1.Database.col("wallets"), // Just 'name' also works if no joins
            models_1.Op.like, `%${this.web3.utils.toChecksumAddress(data?.to)}%`);
            let getNetworkId = "";
            let getUseridByWallet = await models_1.walletsModel.findOne({
                where: findwallet,
                attributes: {
                    exclude: ["id", "deletedAt", "wallets", "createdAt", "updatedAt"],
                },
                raw: true,
            });
            if (getUseridByWallet?.user_id === undefined)
                return;
            let depositData = {
                address: data?.to,
                coinName: "BNB",
                network: getNetworkId,
                amount: (Number(data?.value) / 10 ** 18).toString(),
                successful: `${Number(receipt?.status)}`,
                user_id: getUseridByWallet?.user_id,
                cronStatus: false,
                transferHash: "",
                tx_hash: receipt?.transactionHash,
                gasFee: false,
                queue: false,
                ignore: false,
                blockHeight: `${Number(receipt?.blockNumber)}`,
                contract: "",
            };
            this.upsert(depositData, receipt?.transactionHash);
        }
        catch (error) {
            this.enternalTransaction(data);
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
    paddedToChecksumAddress(address) {
        if (address.slice(0, 2) === "0x")
            address = address.slice(2);
        while (address.slice(0, 2) === "00")
            address = address.slice(2);
        return this.web3.utils.toChecksumAddress("0x" + address);
    }
    /**
     * extranal transaction means contarct or nft based transaction
     * @param hash
     */
    extranalTransaction = async (hash) => {
        if (!this.web3)
            return;
        try {
            let receipt = await this.web3.eth.getTransactionReceipt(hash);
            let contractAddress = this.web3.utils.toChecksumAddress(receipt?.to);
            // ==============================Get token details================================ //
            let tokenDetails = await service_1.default.token.getSingleToken(contractAddress);
            if (tokenDetails === null)
                return;
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
            let amount = Number(this.web3.utils.hexToNumber(receipt?.logs[0]?.data));
            // console.log(amount / 10 ** decimals)
            // console.log(receipt.logs[0].topics)
            let walletAddress = this.paddedToChecksumAddress(receipt.logs[0].topics[2]);
            let findwallet = models_1.Database.where(models_1.Database.col("wallets"), // Just 'name' also works if no joins
            models_1.Op.like, `%${walletAddress}%`);
            let getUseridByWallet = await models_1.walletsModel.findOne({
                where: findwallet,
                attributes: {
                    exclude: ["id", "deletedAt", "wallets", "createdAt", "updatedAt"],
                },
                raw: true,
            });
            if (getUseridByWallet?.user_id === undefined)
                return;
            let depositData = {
                address: walletAddress,
                coinName: tokenDetails?.fullName,
                network: getNetworkId,
                amount: (amount / 10 ** decimals).toString(),
                successful: `${Number(receipt?.status)}`,
                user_id: getUseridByWallet?.user_id,
                cronStatus: false,
                transferHash: "",
                tx_hash: receipt?.transactionHash,
                gasFee: false,
                queue: false,
                ignore: false,
                blockHeight: `${Number(receipt?.blockNumber)}`,
                contract: contractAddress,
            };
            this.upsert(depositData, receipt?.transactionHash);
            // console.log(receipt?.to,tokenDetails, this.web3.utils.toChecksumAddress(receipt?.to))
            // console.log(this.web3.utils.hexToNumber(receipt.logs[0].data))
        }
        catch (error) {
            this.extranalTransaction(hash);
        }
    };
    upsert(values, hash) {
        models_1.depositModel
            .findOne({ where: { tx_hash: hash } })
            .then(async function (obj) {
            // update
            if (obj)
                return false;
            // insert
            return models_1.depositModel.create(values);
        });
    }
    upsertAssets(values, data) {
        models_1.assetModel
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
                let amount = values?.amount === undefined
                    ? obj.balance
                    : obj.balance + +values?.amount;
                obj.update({ balance: amount });
                return false;
            }
            // insert
            return models_1.assetModel.create(values);
        });
    }
}
// mainCron();
async function mainCron() {
    let activeNetworks = await models_1.networkModel.findAll({
        where: { status: true },
        raw: true,
    });
    // service.jsonFileReadWrite.writeOnly("eth");
    node_cron_1.default.schedule("*/3 * * * * *", async () => {
        console.log("Cron started.");
        let nativeSymbol = "BNB";
        let rpcUrl = "https://data-seed-prebsc-1-s1.binance.org:8545/";
        let walletSupport = "eth";
        let eths = service_1.default.jsonFileReadWrite.readonly("eth"); // wallets address list
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
exports.mainCron = mainCron;
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
]; // assert { type: "json" };
// Load Contract
const renderJson = (object) => {
    return JSON.stringify(object, (key, value) => {
        switch (typeof value) {
            case "bigint":
                return {
                    // warpper
                    $T$: "bigint",
                    $V$: value.toString(), // value  // maybe it is good to use some more complicated name instead of $V$
                };
            // Put more cases here ...
            default:
                return value;
        }
    });
};
const confirm = async (web3, hash) => {
    console.log(await Promise.all([confirm2(web3, hash)]));
};
const confirm2 = (web3, hash) => {
    return new Promise((resolve, reject) => {
        const trx = web3.eth.getTransactionReceipt(hash);
        resolve(trx);
    });
};
async function watchEtherTransfers(wss) {
    const ganacheUrl = process.env.INFURA_WS_URL ||
        "wss://bsc.getblock.io/e0f52825-53a6-48ab-a20e-f35712d4e03f/testnet/";
    let options = {
        timeout: 10000,
        clientConfig: {
            keepalive: true,
            keepaliveInterval: 20000, // ms
        },
        reconnect: {
            auto: true,
            delay: 10000,
            maxAttempts: 5,
            onTimeout: false,
        },
    };
    const wsProvider = new web3_1.default.providers.WebsocketProvider(ganacheUrl, options);
    wsProvider.on("connect", function () {
        connect();
        console.log("! provider connected", new Date()); // <- fires after successful connection
    });
    wsProvider.on("error", (err) => {
        console.log("~ on-error:", err); // <- never fires
    });
    wsProvider.on("end", (err) => {
        console.log("~ on-end:", err); // <- never fires
    });
    wsProvider.on("close", (event) => {
        console.log("~ on-close:", event); // <- never fires
    });
    var web3;
    async function connect() {
        try {
            return;
            console.log("Does the provider support subscriptions?:", wsProvider.supportsSubscriptions());
            const web3 = new web3_1.default(wsProvider);
            // Get transaction details
            let ethWallet = await service_1.default.userWalletServices.allWallets("eth");
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
                    let number = [];
                    blockhead?.topics?.find((item, index) => {
                        if (account.includes(item))
                            number.push(index);
                    });
                    if (number.length > 0 && account.length === number.length) {
                        const sum = number.reduce((partialSum, a) => partialSum + a, 0);
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
            subscription.on("error", (error) => console.log("Error when subscribing to New block header: ", error));
        }
        catch (error) {
            console.error(error);
        }
    }
}
exports.watchEtherTransfers = watchEtherTransfers;
// Connect to Ethereum Network and start listening events
async function allSubscription() {
    try {
        console.log(" = = = = = = = = subs");
        const ganacheUrl = process.env.INFURA_WS_URL ||
            "wss://bsc.getblock.io/e0f52825-53a6-48ab-a20e-f35712d4e03f/testnet/";
        const wsProvider = new web3_1.default.providers.WebsocketProvider(ganacheUrl);
        const web3 = new web3_1.default(wsProvider);
        let subs = await web3.eth.subscribe("logs");
        console.log(subs, " = = = = = = = = subs");
        return subs;
    }
    catch (error) {
        new Error(error.message);
    }
}
exports.allSubscription = allSubscription;

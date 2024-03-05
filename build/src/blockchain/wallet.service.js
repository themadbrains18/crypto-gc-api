"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const web3_1 = __importDefault(require("web3"));
// create tronweb client
const TronWeb = require("tronweb");
const web3_js_1 = require("@solana/web3.js");
const wallets_model_1 = __importDefault(require("../models/model/wallets.model"));
class walletService {
    keys = "99475d86076ad2c62fbb5d4c2e70b280dda69ae528e3cc0d363b2a40499e8988";
    wallets = {};
    constructor() { }
    async eth() {
        var web3 = new web3_1.default("https://bsc-dataseed.binance.org"); // your geth
        var account = web3.eth.accounts.create();
        this.wallets.eth = account;
    }
    async sol() {
        const connection = new web3_js_1.Connection((0, web3_js_1.clusterApiUrl)("mainnet-beta"), "confirmed");
        let keypair = web3_js_1.Keypair.generate();
        let publicKey = keypair.publicKey;
        let secretKey = Uint8Array.from(keypair.secretKey);
        let wallet = publicKey + "EXCHNAGE" + secretKey;
        wallet = wallet.split("EXCHNAGE");
        let walletAddress = { "address": wallet[0], "privateKey": wallet[1] };
        this.wallets.sol = walletAddress;
    }
    async tron() {
        const HttpProvider = TronWeb.providers.HttpProvider;
        const fullNode = new HttpProvider("https://api.trongrid.io");
        const solidityNode = new HttpProvider("https://api.trongrid.io");
        const eventServer = new HttpProvider("https://api.trongrid.io");
        const tronWeb = new TronWeb(fullNode, solidityNode, eventServer, this.keys);
        const wallet = await tronWeb.createAccount();
        this.wallets.tron = wallet;
    }
    async allWallets(user_id) {
        try {
            await this.sol();
            await this.eth();
            await this.tron();
            await wallets_model_1.default.create({
                user_id: user_id,
                wallets: this.wallets,
            });
            return this.wallets;
        }
        catch (error) {
            throw new Error(error.message);
        }
    }
}
exports.default = walletService;

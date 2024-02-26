import Web3 from "web3";
// create tronweb client
const TronWeb = require("tronweb");
import CryptoJS from "crypto-js";
import { Connection, clusterApiUrl, Keypair } from "@solana/web3.js";
import walletsModel from "../models/model/wallets.model";

type wallet = {
  eth?: object;
  sol?: object;
  tron?: object;
};

class walletService {
  private keys =
    "99475d86076ad2c62fbb5d4c2e70b280dda69ae528e3cc0d363b2a40499e8988";

  private wallets: wallet = {};

  constructor() {}

  async eth() {
    var web3 = new Web3("https://bsc-dataseed.binance.org"); // your geth
    var account = web3.eth.accounts.create();
    this.wallets.eth = account;
  }

  async sol(): Promise<void> {
    const connection = new Connection(
      clusterApiUrl("mainnet-beta"),
      "confirmed"
    );
    let keypair = Keypair.generate();
    let publicKey = keypair.publicKey;
    let secretKey = Uint8Array.from(keypair.secretKey);
    let wallet: any = publicKey + "EXCHNAGE" + secretKey;
    wallet = wallet.split("EXCHNAGE");
    let walletAddress = {"address" : wallet[0], "privateKey":wallet[1]}
    this.wallets.sol = walletAddress;
  }

  async tron(): Promise<void> {
    const HttpProvider = TronWeb.providers.HttpProvider;
    const fullNode = new HttpProvider("https://api.trongrid.io");
    const solidityNode = new HttpProvider("https://api.trongrid.io");
    const eventServer = new HttpProvider("https://api.trongrid.io");
    const tronWeb = new TronWeb(fullNode, solidityNode, eventServer, this.keys);

    const wallet = await tronWeb.createAccount();
    this.wallets.tron = wallet;
  }

  async allWallets(user_id : string) {
    try {
        await this.sol();
        await this.eth();
        await this.tron();
        await walletsModel.create({
            user_id : user_id,
            wallets : this.wallets,
        })
       return this.wallets;
    } catch (error : any) {
        throw new Error(error.message)
    }
   
  }
}

export default walletService;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const assets_routes_1 = __importDefault(require("./assets.routes"));
const chat_routes_1 = __importDefault(require("./chat.routes"));
const deposit_routes_1 = __importDefault(require("./deposit.routes"));
const kyc_routes_1 = __importDefault(require("./kyc.routes"));
const marketorder_routes_1 = __importDefault(require("./marketorder.routes"));
const network_routes_1 = __importDefault(require("./network.routes"));
const post_routes_1 = __importDefault(require("./post.routes"));
const token_routes_1 = __importDefault(require("./token.routes"));
const users_routes_1 = __importDefault(require("./users.routes"));
const withdraw_routes_1 = __importDefault(require("./withdraw.routes"));
const otp_routes_1 = __importDefault(require("./otp.routes"));
const staking_routes_1 = __importDefault(require("./staking.routes"));
const order_routes_1 = __importDefault(require("./order.routes"));
const wallet_routes_1 = __importDefault(require("./wallet.routes"));
const refer_routes_1 = __importDefault(require("./refer.routes"));
const convert_routes_1 = __importDefault(require("./convert.routes"));
const not_found_middleware_1 = require("../middlewares/not-found.middleware");
const paymentmethod_routes_1 = __importDefault(require("./paymentmethod.routes"));
const tradepair_routes_1 = __importDefault(require("./tradepair.routes"));
const site_routes_1 = __importDefault(require("./site.routes"));
const futuretrade_routes_1 = __importDefault(require("./futuretrade.routes"));
const futurePosition_routes_1 = __importDefault(require("./futurePosition.routes"));
const futureOpenOrder_routes_1 = __importDefault(require("./futureOpenOrder.routes"));
const watchlist_routes_1 = __importDefault(require("./watchlist.routes"));
let apiBase = process.env.API_BASE;
class routes {
    constructor(app) {
        this.init(app);
    }
    init(app) {
        // field validation
        // static file white path
        app.use(`${apiBase}/`, express_1.default.static(process.cwd() + "/public"));
        // base url 
        // app.use(`${apiBase}/`, (req,res)=>{
        //   res.status(200).send("Hello World API is running..")
        // })
        app.use(`${apiBase}/user`, users_routes_1.default);
        app.use(`${apiBase}/assets`, assets_routes_1.default);
        app.use(`${apiBase}/chat`, chat_routes_1.default);
        app.use(`${apiBase}/deposit`, deposit_routes_1.default);
        app.use(`${apiBase}/kyc`, kyc_routes_1.default);
        app.use(`${apiBase}/market`, marketorder_routes_1.default);
        app.use(`${apiBase}/network`, network_routes_1.default);
        app.use(`${apiBase}/post`, post_routes_1.default);
        app.use(`${apiBase}/token`, token_routes_1.default);
        app.use(`${apiBase}/withdraw`, withdraw_routes_1.default);
        app.use(`${apiBase}/otp`, otp_routes_1.default);
        app.use(`${apiBase}/staking`, staking_routes_1.default);
        app.use(`${apiBase}/payment`, paymentmethod_routes_1.default);
        app.use(`${apiBase}/p2p`, order_routes_1.default);
        app.use(`${apiBase}/wallet`, wallet_routes_1.default);
        app.use(`${apiBase}/refer`, refer_routes_1.default);
        app.use(`${apiBase}/convert`, convert_routes_1.default);
        app.use(`${apiBase}/pair`, tradepair_routes_1.default);
        app.use(`${apiBase}/site`, site_routes_1.default);
        app.use(`${apiBase}/future`, futuretrade_routes_1.default);
        app.use(`${apiBase}/position`, futurePosition_routes_1.default);
        app.use(`${apiBase}/futureorder`, futureOpenOrder_routes_1.default);
        app.use(`${apiBase}/watchlist`, watchlist_routes_1.default);
        // app.use(`${apiBase}/blockchain`,new authController().auth, async (req: Request, res: Response) => {
        //   let rpc = "https://bsc.getblock.io/1e015893-a3b0-443f-849d-b4e240f0800f/testnet/";
        //   let chindId = 97;
        //   let contract = "0xeb4AE1a3D387f637d09f5732D47D793A65fed4f0";
        //   let wallet = "0x78554E7Ac22A6968316Cb74843B921f0367c6D6E";
        //   // let chain = new ethereum(rpc, chindId, "BNB Smart Chain Testnet",chindId);
        //   // let balance = await chain.mainBalance(wallet);
        //   // let from = "0x78554E7Ac22A6968316Cb74843B921f0367c6D6E";
        //   // let to = "0xa491dA4207AAb7400Ae8eBCCF4982A20aaF856D0";
        //   // let privateKey = "0x495299db63a352864225f3236b0d675c1ed89766b031940f0936c8dbd7c6e45c";
        //   // let trns = await chain.tokenTransaction(contract,to,from,privateKey,1)
        //   // let url = "https://api.testnet.solana.com";
        //   // let solana = new solanaBlockchain(url, "confirmed","devnet");
        //   // const DESTINATION_WALLET = '2tWC4JAdL4AxEFJySziYJfsAnW2MHKRo98vbAPiRDSk8'; 
        //   // const MINT_ADDRESS = 'E7x8RPSmWVrY4opCL376f7pAkU76cWwpVGnhYxA1E5T5'; //You must change this value!
        //   // const TRANSFER_AMOUNT = 1;
        //     // let trns = await solana.sendTransaction(
        //     //   "AFJpFguQ3VwVP3z3kZ1Z2CZLn4vVUVw2UgC1uJGMTvT1",
        //     //   [103,40,42,100,50,142,28,115,219,227,25,211,172,141,219,153,91,226,230,73,9,200,0,157,115,73,192,104,175,78,124,219,67,42,183,14,88,56,102,38,146,11,254,215,29,16,58,196,181,109,207,77,239,208,172,100,141,174,104,152,228,12,125,12],
        //     //   0.1
        //     // );
        //     // let trns = await solana.createAccount()
        //     // let trns = await solana.sendTokens(1,DESTINATION_WALLET,MINT_ADDRESS,[
        //     //   226, 163, 122, 165, 107, 233, 40, 81, 19, 108, 42, 15, 111, 35, 78,
        //     //   119, 83, 252, 145, 84, 227, 172, 42, 238, 250, 12, 151, 218, 178,
        //     //   201, 209, 84, 137, 99, 116, 242, 77, 55, 209, 144, 28, 199, 20, 176,
        //     //   235, 54, 75, 212, 235, 132, 24, 116, 97, 222, 148, 61, 20, 246, 241,
        //     //   66, 193, 132, 190, 72,
        //     // ])
        //     // console.log(trns)
        //     try {
        //       // let blockScanner1 = new blockScanner(rpc,chindId,"BNB Smart Chain Testnet",chindId)
        //       // let trns = await blockScanner1.getPastLogs('0xa491dA4207AAb7400Ae8eBCCF4982A20aaF856D0')
        //       let cova = new covalenthq() 
        //       let trns = await cova.scanner('0x78554E7Ac22A6968316Cb74843B921f0367c6D6E',97,'')
        //       res.status(200).send(trns);
        //     } catch (error) {
        //       res.status(500).send(error);
        //     }
        // });
        // app.use(async (err: Error, req: Request, res: Response, next: NextFunction) => {
        //   if (!cerrorHandler.isTrustedError(err)) {
        //     next(err);
        //   }
        //   await cerrorHandler.handleError(err);
        // });
        // error exceptions
        // app.use(errorHandler); 
        app.use(not_found_middleware_1.notFoundHandler);
    }
}
exports.default = routes;

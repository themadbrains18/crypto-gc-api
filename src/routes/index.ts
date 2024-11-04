import  express, { Application, Request, Response, NextFunction } from "express";
import assetsRoutes from "./assets.routes";
import chatRoutes from "./chat.routes";
import depositRoutes from "./deposit.routes";
import kycRoutes from "./kyc.routes";
import marketorderRoutes from "./marketorder.routes";
import networkRoutes from "./network.routes";
import postRoutes from "./post.routes";
import tokenRoutes from "./token.routes";
import usersRoutes from "./users.routes";
import withdrawRoutes from "./withdraw.routes";
import otpRoutes from "./otp.routes";
import stakingRoutes from "./staking.routes";
import orderRoutes from "./order.routes";
import walletRoutes from "./wallet.routes";
import referRoutes from "./refer.routes";
import convertRoutes from "./convert.routes";

import { notFoundHandler } from "../middlewares/not-found.middleware";

import paymentmethodRoutes from "./paymentmethod.routes";
import authController from "../middlewares/authController";
// import { cerrorHandler } from "../exceptions/errorHandler";
import covalenthq from "../blockchain/scaner/covalenthq";
import tradepairRoutes from "./tradepair.routes";
import siteMaintenanceRoutes from './site.routes';
import futureTradePairRoutes from './futuretrade.routes';
import futurePositionRoutes from "./futurePosition.routes";
import futureOpenOrderRoutes from "./futureOpenOrder.routes";
import watchlistRoutes from "./watchlist.routes";
import pusher from "../utils/pusher";
import addressRoutes from "./address.routes";
import profitlossRoutes from "./profitloss.routes";


let apiBase = process.env.API_BASE;

class routes {
  constructor(app: Application) {
    this.init(app);
  }

  init(app: Application) {
    // field validation

    // static file white path
    app.use(`${apiBase}/`, express.static(process.cwd() + "/public"));

    // base url 
    // app.use(`${apiBase}/`, (req,res)=>{
    //   res.status(200).send("Hello World API is running..")
   //  })

    app.use(`${apiBase}/user`, usersRoutes);
    app.use(`${apiBase}/assets`, assetsRoutes);
    app.use(`${apiBase}/chat`, chatRoutes);
    app.use(`${apiBase}/deposit`, depositRoutes);
    app.use(`${apiBase}/kyc`, kycRoutes);
    app.use(`${apiBase}/market`, marketorderRoutes);
    app.use(`${apiBase}/network`, networkRoutes);
    app.use(`${apiBase}/post`, postRoutes);
    app.use(`${apiBase}/token`, tokenRoutes);
    app.use(`${apiBase}/withdraw`, withdrawRoutes);
    app.use(`${apiBase}/otp`, otpRoutes);

    app.use(`${apiBase}/staking`, stakingRoutes);
    app.use(`${apiBase}/payment`, paymentmethodRoutes);
    app.use(`${apiBase}/p2p`, orderRoutes);
    app.use(`${apiBase}/wallet`,walletRoutes);
    app.use(`${apiBase}/refer`,referRoutes);
    app.use(`${apiBase}/convert`, convertRoutes);
    app.use(`${apiBase}/pair`, tradepairRoutes);
    app.use(`${apiBase}/site`, siteMaintenanceRoutes);
    app.use(`${apiBase}/future`, futureTradePairRoutes);
    app.use(`${apiBase}/position`, futurePositionRoutes);
    app.use(`${apiBase}/futureorder`,futureOpenOrderRoutes);
    app.use(`${apiBase}/watchlist`,watchlistRoutes);
    app.use(`${apiBase}/address`,addressRoutes);
    app.use(`${apiBase}/profitloss`,profitlossRoutes);

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
    app.use(notFoundHandler);
  }
}

export default routes;

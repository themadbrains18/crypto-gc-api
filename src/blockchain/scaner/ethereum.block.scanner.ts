import { connect } from "http2";
import { Web3, Transaction } from "web3";

const EthDater = require('ethereum-block-by-date');


class blockScanner {
  rpcurl: string;
  chainID: number;
  networkName: string;
  netWorkId: number;

  web3;
  dater;
  firstBlockNumber = 1909000;

  constructor(
    rpcurl: string,
    chainID: number,
    networkName: string,
    netWorkId: number
  ) {
    this.rpcurl = rpcurl;
    this.chainID = chainID;
    this.networkName = networkName;
    this.netWorkId = netWorkId;

    this.web3 = new Web3(new Web3.providers.HttpProvider(this.rpcurl));
    // this.web3 = new Web3(this.rpcurl);
    this.dater = new EthDater(
        this.web3 // Web3 object, required.
    );
  }

  /**
   *
   * @param address
   */

  getPastLogs = async (address: string): Promise<void> => {
    let obj = this;
    // Getting block by date:
    let block = await this.dater.getEvery(
        'days', // Period, required. Valid value: years, quarters, months, weeks, days, hours, minutes
        '2023-07-20T13:20:40Z', // Date, required. Any valid moment.js value: string, milliseconds, Date() object, moment() object.
        '2023-09-20T13:20:40Z', // Date, required. Any valid moment.js value: string, milliseconds, Date() object, moment() object.
        1,
        true, // Block after, optional. Search for the nearest block before or after the given date. By default true.
        false // Refresh boundaries, optional. Recheck the latest block before request. By default false.
    );

    console.log(block)

    try {
      var latestBlock = await this.web3.eth.getBlockNumber();
      console.log("latestBlock: " + latestBlock);
      return
      for (var i = 32359364; i < latestBlock; i++) {
        var Block = await this.web3.eth.getBlock(i);
        console.log("blocknumuer: " + i);
        if (Block?.transactions != null && Block != null) {
          Block?.transactions.forEach(async function (e) {
            console.log(e);

            // var Tdata = obj.web3.toAscii(getT.input);
        
            var getT: any = await obj.web3.eth.getTransaction(e.toString());

            if (getT.to == address) {
              console.log("find");
            }
            //console.log(getT.to);
          });
        }
      }
    } catch (error: any) {
      console.log(error.message);
    }
  };
}

export default blockScanner;

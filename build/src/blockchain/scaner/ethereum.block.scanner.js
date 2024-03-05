"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const web3_1 = require("web3");
const EthDater = require('ethereum-block-by-date');
class blockScanner {
    rpcurl;
    chainID;
    networkName;
    netWorkId;
    web3;
    dater;
    firstBlockNumber = 1909000;
    constructor(rpcurl, chainID, networkName, netWorkId) {
        this.rpcurl = rpcurl;
        this.chainID = chainID;
        this.networkName = networkName;
        this.netWorkId = netWorkId;
        this.web3 = new web3_1.Web3(new web3_1.Web3.providers.HttpProvider(this.rpcurl));
        // this.web3 = new Web3(this.rpcurl);
        this.dater = new EthDater(this.web3 // Web3 object, required.
        );
    }
    /**
     *
     * @param address
     */
    getPastLogs = async (address) => {
        let obj = this;
        // Getting block by date:
        let block = await this.dater.getEvery('days', // Period, required. Valid value: years, quarters, months, weeks, days, hours, minutes
        '2023-07-20T13:20:40Z', // Date, required. Any valid moment.js value: string, milliseconds, Date() object, moment() object.
        '2023-09-20T13:20:40Z', // Date, required. Any valid moment.js value: string, milliseconds, Date() object, moment() object.
        1, true, // Block after, optional. Search for the nearest block before or after the given date. By default true.
        false // Refresh boundaries, optional. Recheck the latest block before request. By default false.
        );
        console.log(block);
        try {
            var latestBlock = await this.web3.eth.getBlockNumber();
            console.log("latestBlock: " + latestBlock);
            return;
            for (var i = 32359364; i < latestBlock; i++) {
                var Block = await this.web3.eth.getBlock(i);
                console.log("blocknumuer: " + i);
                if (Block?.transactions != null && Block != null) {
                    Block?.transactions.forEach(async function (e) {
                        console.log(e);
                        // var Tdata = obj.web3.toAscii(getT.input);
                        var getT = await obj.web3.eth.getTransaction(e.toString());
                        if (getT.to == address) {
                            console.log("find");
                        }
                        //console.log(getT.to);
                    });
                }
            }
        }
        catch (error) {
            console.log(error.message);
        }
    };
}
exports.default = blockScanner;

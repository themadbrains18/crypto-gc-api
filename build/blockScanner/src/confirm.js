"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const web3_1 = __importDefault(require("web3"));
async function getConfirmations(txHash) {
    try {
        // Instantiate web3 with HttpProvider
        const web3 = new web3_1.default(process.env.INFURA_URL);
        // Get transaction details
        const trx = await web3.eth.getTransaction(txHash);
        // Get current block number
        const currentBlock = await web3.eth.getBlockNumber();
        // When transaction is unconfirmed, its block number is null.
        // In this case we return 0 as number of confirmations
        return trx.blockNumber === null ? 0 : Number(currentBlock) - Number(trx.blockNumber);
    }
    catch (error) {
        console.log(error);
        return 0;
    }
}
function confirmEtherTransaction(txHash, confirmations = 10) {
    setTimeout(async () => {
        // Get current number of confirmations and compare it with sought-for value
        const trxConfirmations = await getConfirmations(txHash);
        console.log('Transaction with hash ' + txHash + ' has ' + trxConfirmations + ' confirmation(s)');
        if (trxConfirmations >= confirmations) {
            // Handle confirmation event according to your business logic
            console.log('Transaction with hash ' + txHash + ' has been successfully confirmed');
            return;
        }
        // Recursive call
        return confirmEtherTransaction(txHash, confirmations);
    }, 30 * 1000);
}
exports.default = confirmEtherTransaction;

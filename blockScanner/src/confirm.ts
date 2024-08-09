import Web3 from "web3"

async function getConfirmations(txHash : string) : Promise<number> {
  try {
    // Instantiate web3 with HttpProvider
    const web3 = new Web3(process.env.INFURA_URL)

    // Get transaction details
    const trx = await web3.eth.getTransaction(txHash)

    // Get current block number
    const currentBlock = await web3.eth.getBlockNumber()

    // When transaction is unconfirmed, its block number is null.
    // In this case we return 0 as number of confirmations
    return trx.blockNumber === null ? 0 : Number(currentBlock) - Number(trx.blockNumber)
  }
  catch (error) {
    console.log(error)
    return 0;
  }
}

function confirmEtherTransaction(txHash : string, confirmations = 10) : void {
  setTimeout(async () => {
    // Get current number of confirmations and compare it with sought-for value
    const trxConfirmations : number | undefined  = await getConfirmations(txHash)
    // console.log('Transaction with hash ' + txHash + ' has ' + trxConfirmations + ' confirmation(s)')

    if (trxConfirmations >= confirmations) {
      // Handle confirmation event according to your business logic

      // console.log('Transaction with hash ' + txHash + ' has been successfully confirmed')

      return
    }
    // Recursive call
    return confirmEtherTransaction(txHash, confirmations)
  }, 30 * 1000)
}

export default confirmEtherTransaction
import {
  getOrCreateAssociatedTokenAccount,
  createTransferInstruction,
} from "@solana/spl-token";
const web3 = require("@solana/web3.js");
import {
  Connection,
  Keypair,
  ParsedAccountData,
  PublicKey,
  sendAndConfirmTransaction,
  Transaction,
} from "@solana/web3.js";
import { getAccount } from "@solana/spl-token";

interface parameters {
  url: string;
  status: string;
}

type Commitment =
  | "processed"
  | "confirmed"
  | "finalized"
  | "recent"
  | "single"
  | "singleGossip"
  | "root"
  | "max";

type Env = "testnet" | "devnet" | "main";

class solanaBlockchain implements parameters {
  public url: string;
  public status: Commitment = "confirmed";

  private connection: any;
  private web3: any;

  constructor(url: string, status: Commitment, network: Env = "testnet") {
    this.url = url;
    this.status = status;
    this.connection = new web3.Connection(
      web3.clusterApiUrl(network),
      this.status
    );
  }

  /**
   * finalized return then successfully
   * @param tx
   * @returns
   */
  getConfirmation = async (tx: string): Promise<any> => {
    try {
      const result = await this.connection.getSignatureStatus(tx, {
        searchTransactionHistory: true,
      });

      if (result.value == null) {
        throw new Error("Signature not exist ");
      }
      return result.value?.confirmationStatus;
    } catch (error: any) {
      return error;
    }
  };

  /**
   *
   * @param to
   * @param privateKey
   * @param Amount
   * @returns
   */
  async sendTransaction(to: string, privateKey: any[], Amount: number) {
    try {
      // Replace with your wallet private key and sender public key
      const senderPublicKey: any[] = privateKey;

      const from = web3.Keypair.fromSecretKey(new Uint8Array(privateKey));
      const balance =
        (await this.connection.getBalance(from.publicKey)) /
        web3.LAMPORTS_PER_SOL;

      if (Amount > balance) {
        throw new Error("Wallet fund is not sufficient make a transaction.");
      }
      const senderPrivateKey = from.secretKey;

      // Destination address (where you're sending SOL)
      const toPublicKey = new web3.PublicKey(to);

      const accountInfo = await this.connection.getAccountInfo(toPublicKey);
      if (accountInfo === null) {
        throw new Error("The address does not exist on the Solana blockchain.");
      }

      // Get the sender's account to fetch its current state
      const senderAccount = await this.connection.getAccountInfo(
        from.publicKey
      );

      // Construct and sign the transaction
      const transaction = new web3.Transaction().add(
        web3.SystemProgram.transfer({
          fromPubkey: from.publicKey,
          toPubkey: to,
          lamports: web3.LAMPORTS_PER_SOL * Amount,
        })
      );
      // Sign the transaction

      // Sign transaction, broadcast, and confirm
      const signature = await web3.sendAndConfirmTransaction(
        this.connection,
        transaction,
        [from]
      );
      // console.log(`SIGNATURE--${signature}`);
      return `SIGNATURE--${signature}`;
    } catch (error: any) {
      return error.message;
    }
  }

  /**
   * createAccount
   * @returns
   */
  async createAccount() {
    try {
      // Generate a random address to send to
      let keypair = web3.Keypair.generate();
      let publicKey = keypair.publicKey;
      let secretKey = Uint8Array.from(keypair.secretKey);
      let wallet: any = publicKey + "EXCHNAGE" + secretKey;
      wallet = wallet.split("EXCHNAGE");
      return {
        publicKey: wallet[0],
        secretKey: wallet[1],
      };
    } catch (error: any) {
      return error.message;
    }
  }

  /**
   * getNumberDecimals
   * @param mintAddress
   * @returns
   */
  async getNumberDecimals(mintAddress: string): Promise<number> {
    let info: any = await this.connection.getParsedAccountInfo(
      new web3.PublicKey(mintAddress)
    );
    let result = (info.value?.data as ParsedAccountData).parsed.info
      .decimals as number;
    return result;
  }

  /**
   * sendTokens token project
   * @param TRANSFER_AMOUNT
   * @param MINT_ADDRESS
   * @param DESTINATION_WALLET
   * @param privateKey
   */
  async sendTokens(
    TRANSFER_AMOUNT: number,
    MINT_ADDRESS: string,
    DESTINATION_WALLET: string,
    privateKey: any[]
  ): Promise<any> {
    try {
      const FROM_KEYPAIR = web3.Keypair.fromSecretKey(
        new Uint8Array(privateKey)
      );

      // console.log(
      //   `Sending ${TRANSFER_AMOUNT} ${MINT_ADDRESS} from ${FROM_KEYPAIR.publicKey.toString()} to ${DESTINATION_WALLET}.`
      // );
      //Step 1
      // console.log(`1 - Getting Source Token Account`);
      let sourceAccount = await getOrCreateAssociatedTokenAccount(
        this.connection,
        FROM_KEYPAIR,
        new web3.PublicKey(MINT_ADDRESS),
        FROM_KEYPAIR.publicKey
      );
      // console.log(`1 - Getting Source Token Account`, sourceAccount);

      // console.log(`    Source Account: ${sourceAccount.address.toString()}`);

      //Step 2
      // console.log(`2 - Getting Destination Token Account`);
      let destinationAccount = await getOrCreateAssociatedTokenAccount(
        this.connection,
        FROM_KEYPAIR,
        new web3.PublicKey(MINT_ADDRESS),
        new web3.PublicKey(DESTINATION_WALLET)
      );
      // console.log(
      //   `    Destination Account: ${destinationAccount.address.toString()}`
      // );

      //Step 3
      // console.log(`3 - Fetching Number of Decimals for Mint: ${MINT_ADDRESS}`);
      const numberDecimals = await this.getNumberDecimals(MINT_ADDRESS);

      // console.log(`    Number of Decimals: ${numberDecimals}`);
      const tokenAccount1Pubkey = new PublicKey(
        "37sAdhEFiYxKnQAm7CPd5GLK1ZxWovqn3p87kKjfD44c"
      );
      let tokenAccountBalance = await this.connection.getTokenAccountBalance(
        tokenAccount1Pubkey
      );

      // console.log(
      //   `decimals: ${tokenAccountBalance.value.decimals}, amount: ${tokenAccountBalance.value.amount}`
      // );

      //Step 4
      // console.log(`4 - Creating and Sending Transaction`);
      const tx = new Transaction();
      tx.add(
        createTransferInstruction(
          sourceAccount.address,
          destinationAccount.address,
          FROM_KEYPAIR.publicKey,
          TRANSFER_AMOUNT * Math.pow(10, numberDecimals)
        )
      );

      const latestBlockHash = await this.connection.getLatestBlockhash(
        "confirmed"
      );
      tx.recentBlockhash = await latestBlockHash.blockhash;
      const signature = await web3.sendAndConfirmTransaction(
        this.connection,
        tx,
        [FROM_KEYPAIR]
      );
      // console.log(
      //   "\x1b[32m", //Green Text
      //   `   Transaction Success!🎉`,
      //   `\n    https://explorer.solana.com/tx/${signature}?cluster=devnet`
      // );
      return signature;
      // sendTokens();
    } catch (error: any) {
      return error;
    }
  }
}

export default solanaBlockchain;

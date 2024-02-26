import {
  assetModel,
  globalTokensModel,
  networkModel,
  tokensModel,
  userModel,
  walletsModel,
} from "../../models";
import depositModel, { depositInput } from "../../models/model/deposit.model";
import { networkInput } from "../../models/model/network.model";
import service from "../../services/service";
import { isJson } from "../../utils/utility";
import ethereum from "../ethereum.blockchain";

export default class covalenthq {
  private baseUrl = "https://api.covalenthq.com/v1/";
  private apiKey = "cqt_rQW38VqbxKPxmYTPGFV4PQRBMDGP";

  private properData: depositInput = {};
  master_wallet: string;

  constructor() {
    this.master_wallet = ""
  }

  /**
   *
   * @param address
   * @param chainId
   * @returns
   */
  async scanner(
    address: string,
    chainId: number,
    userid: string
  ): Promise<any | null> {
    let obj = this;

    try {

      let response = await fetch(
        this.baseUrl +
        chainId +
        "/address/" +
        address +
        "/transactions_v2/?quote-currency=USD&format=JSON&block-signed-at-asc=false&no-logs=false&key=" +
        this.apiKey
      );
      let result = await response.text();

      if (result) {
        //========================================================//
        // if api fail the return output
        //========================================================//
        if (!isJson(result)) return;

        if (
          JSON.parse(result).hasOwnProperty("error_message") &&
          JSON.parse(result).error_message
        )
          throw new Error(JSON.parse(result).error_message);

        //========================================================//
        // if data exit then convert into array
        //========================================================//

        let data = JSON.parse(result)?.data?.items;

        if (data !== null && data.length > 0) {
          if (data === undefined) return;

          //========================================================//
          // Add new code(24-04-2023) incoming filter transaction
          //========================================================//
          let previousHashs: string[] = [];
          let exstingHash = (await obj.getExistingHash()).map((item) =>
            previousHashs.push(item?.tx_hash?.toLowerCase())
          );

          let getNetworkId = await this.getNetworkID(chainId);

          let tokens = await tokensModel.findAll({ raw: true });
          let globalTokens = await globalTokensModel.findAll({
            raw: true,
            order: [["rank", "ASC"]],
          });

          let allTokens = tokens.concat(globalTokens);

          for await (let transactionDetails of data) {

            if (
              previousHashs.includes(transactionDetails?.tx_hash?.toLowerCase())
            )
              continue;

            let dataLn = transactionDetails?.log_events || [];
            if (dataLn?.length > 0) {
              console.log('--------here token based');
              await obj.tokenBased(
                transactionDetails,
                address,
                previousHashs,
                getNetworkId,
                userid,
                allTokens
              );
            } else {
              console.log('--------here main transaction');
              await obj.mainTransaction(
                transactionDetails,
                address,
                previousHashs,
                getNetworkId,
                userid,
                allTokens
              );
            }
          }
          return {
            message: "user records successfully scanned.",
          };
        }
      }
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  /**
   *
   * @param data
   */

  //============================================================//
  // token based transaction
  //============================================================//
  async tokenBased(
    data: any,
    address: string,
    existinghash: any[],
    getNetworkId: string,
    userid: string,
    allTokens: any
  ) {
    try {

      if (!data.successful) return; // check transaction status

      let contractList = [
        // "0x81d2da90cfb1131bd4c0cbbe651d6a28e4fc8811",
        // "0x343ACe9B4882d1C45d84Bd948A6f0E5ba0e47Eb4",
        // "0xeb4ae1a3d387f637d09f5732d47d793a65fed4f0",
        // "0x55d398326f99059ff775485246999027b3197955",

        "0x337610d27c682e347c9cd60bd4b3b107c9d34ddd", //USDT
        "0xec5dcb5dbf4b114c9d0f65bccab49ec54f6a0867", //DAI
        "0x6ce8da28e2f864420840cf74474eff5fd80e65b8", //BTCB
        "0xed24fc36d5ee211ea25a80239fb8c4cfd80f12ee", //BUSD
        "0xa83575490d7df4e2f47b7d38ef351a2722ca45b9", //XRP
        "0xd66c6b4f0be8ce5b39d52e0fd1344c389929b378", //ETH
        "0x349866fb05844ce2de34ba8d87a159923a963cf1", //BNBT
        "0x64544969ed7ebf5f083679233325356ebe738930"  //USDC
      ];
      let tokenData = data?.log_events?.filter((i: any) => {
        if (i?.decoded !== null) {
          let params = i?.decoded?.params?.filter((element: any) => {
            return element?.value?.toLowerCase() === address?.toLowerCase();
          });
          if (params.length > 0) {
            return i;
          }
        }
      });

      if (tokenData.length > 0) {

        // remove transaction that send from customer to admin
        if (address.toLowerCase() == data?.from_address.toLowerCase()) {
          console.log('----here transaction from user to admin');
          return;
        }

        console.log(address.toLowerCase() === (tokenData[0]?.decoded?.params[1]?.value).toLowerCase(), '------matched user-----');

        console.log(tokenData[0]?.decoded?.params[1]?.value, '========trx user address');

        let tokenDeposit = allTokens.filter((elem: any) => {
          return elem.symbol === tokenData[0]?.sender_contract_ticker_symbol
        });

        let depositAmount = tokenData[0]?.decoded?.params[2]?.value / 10 ** tokenData[0]?.sender_contract_decimals;
        console.log(depositAmount, '-----------Deposit Amount');

        if (depositAmount < tokenDeposit[0].minimum_deposit) {
          console.log('deposit amount less than minimum amount');
          return;
        }

        if (
          address.toLowerCase() ===
          (tokenData[0]?.decoded?.params[1]?.value).toLowerCase() &&
          contractList.includes(tokenData[0]?.sender_address.toLowerCase())
        ) {

          //============================================================//
          // Create Deposit record data
          //============================================================//
          this.properData = {
            address: address.toLowerCase(),
            coinName: `${tokenData[0]?.sender_name}/${tokenData[0]?.sender_contract_ticker_symbol}/${tokenData[0]?.sender_contract_decimals}`,
            network: getNetworkId,
            amount: (
              tokenData[0]?.decoded?.params[2]?.value /
              10 ** tokenData[0]?.sender_contract_decimals
            ).toString(),
            successful: data.successful,
            user_id: userid,
            cronStatus: false,
            transferHash: "",
            tx_hash: data.tx_hash,
            gasFee: false,
            queue: false,
            ignore: false,
            blockHeight: tokenData[0]?.block_height,
            contract: tokenData[0]?.sender_address,
          };

          //============================================================//
          // Add record to deposit table
          //============================================================//
          await depositModel
            .create(this.properData)
            .then(async (res: any) => {

              let tokenid = tokenDeposit[0]?.id;

              // allTokens.filter((elem: any) => {
              //   if (
              //     elem.symbol === tokenData[0]?.sender_contract_ticker_symbol
              //   ) {
              //     tokenid = elem.id;
              //   }
              // });

              //============================================================//
              // Add record to user assets table
              //============================================================//
              let exist = await assetModel.findOne({
                where: { user_id: userid, token_id: tokenid }, raw: true
              });

              if (exist !== null) {
                let obj = {
                  user_id: userid,
                  account_type: "Main Account",
                  walletTtype: "main_wallet",
                  token_id: tokenid,
                  balance: parseFloat(res?.dataValues?.amount) + exist?.balance,
                };
                await assetModel.update(obj, { where: { id: exist?.id } });
              } else {
                let obj = {
                  user_id: userid,
                  account_type: "Main Account",
                  walletTtype: "main_wallet",
                  token_id: tokenid,
                  balance: parseFloat(res?.dataValues?.amount),
                };

                await assetModel.create(obj);
              }

              //============================================================//
              // User assets send to admin user
              //============================================================//
              let network: networkInput = await service.network.networkById(getNetworkId);
              if (network && network.rpcUrl !== undefined && network.chainId !== undefined && network.fullname !== undefined) {
                let cova = new ethereum(network.rpcUrl, network.chainId, network.fullname, network.chainId);
                await cova.tokenTransferToAdmin(res?.dataValues);
              }
            })
            .catch((err) => {
              throw new Error(err.message);
            });
        }
      }
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  /**
   *
   * @param data
   */
  //============================================================//
  //  main chain transaction
  //============================================================//
  async mainTransaction(
    data: any,
    address: string,
    existinghash: any[],
    getNetworkId: string,
    userid: string,
    allTokens: any
  ) {
    if (!data.successful) return; // check transaction status

    //============================================================//
    // Exclude record of BNB fees add by admin
    //============================================================//
    let wallet: any = process?.env?.MASTER_WALLET_BEP20;
    let masterWallet = await service.watchlist.decrypt(wallet);
    if (data?.from_address?.toLowerCase() === masterWallet.toLowerCase()) {
      return;
    }

    if (data?.to_address?.toLowerCase() === address.toLowerCase()) {
      let amount = data.value / 10 ** data?.gas_metadata?.contract_decimals;

      let tokenDeposit = allTokens.filter((elem: any) => {
        return elem.symbol === data?.gas_metadata?.contract_ticker_symbol
      });

      if (amount < tokenDeposit[0].minimum_deposit) {
        console.log('deposit amount less than minimum amount');
        return;
      }
      //============================================================//
      // Create Deposit record data
      //============================================================//
      this.properData = {
        address: address.toLowerCase(),
        coinName: `${data?.gas_metadata?.contract_name}/${data?.gas_metadata?.contract_ticker_symbol}/${data?.gas_metadata?.contract_decimals}`,
        network: getNetworkId,
        amount: (
          data?.value /
          10 ** data?.gas_metadata?.contract_decimals
        ).toString(),
        successful: data.successful,
        user_id: userid,
        cronStatus: false,
        transferHash: "",
        tx_hash: data.tx_hash,
        gasFee: false,
        queue: false,
        ignore: false,
        blockHeight: data?.block_height,
        contract: "",
      };

      //============================================================//
      // Add record to deposit table
      //============================================================//
      await depositModel
        .create(this.properData)
        .then(async (res: any) => {
          let tokenid = tokenDeposit[0]?.id;

          // allTokens.filter((elem: any) => {
          //   if (
          //     elem.symbol === data?.gas_metadata?.contract_ticker_symbol
          //   ) {
          //     tokenid = elem.id;
          //   }
          // });

          //============================================================//
          // update user assets table
          //============================================================//
          let exist = await assetModel.findOne({
            where: { user_id: userid, token_id: tokenid }, raw: true
          });

          if (exist !== null) {
            let obj = {
              user_id: userid,
              account_type: "Main Account",
              walletTtype: "main_wallet",
              token_id: tokenid,
              balance: parseFloat(res?.dataValues?.amount) + exist?.balance,
            };
            await assetModel.update(obj, { where: { id: exist.id } });
          } else {
            let obj = {
              user_id: userid,
              account_type: "Main Account",
              walletTtype: "main_wallet",
              token_id: tokenid,
              balance: parseFloat(res?.dataValues?.amount),
            };

            await assetModel.create(obj);
          }
        })
        .catch((err) => {
          throw new Error(err.message);
        });
    }
  }

  /**
   *
   * @returns
   */
  async getExistingHash(): Promise<any[]> {
    let hash = depositModel.findAll({
      attributes: {
        exclude: [
          "createdAt",
          "updatedAt",
          "id",
          "address",
          "coinName",
          "network",
          "amount",
          "blockHeight",
          "successful",
          "user_id",
          "cronStatus",
          "transferHash",
          "contract",
          "gasFee",
          "queue",
          "ignore",
          "deletedAt",
        ],
      },
      raw: true,
    });
    return hash;
  }

  async getNetworkID(chindId: number): Promise<string> {
    try {
      let netmo = await networkModel.findOne({
        where: {
          chainId: chindId,
        },
        raw: true,
      });
      if (netmo) return netmo?.id;
      else throw new Error("chain id does't exist..");
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

}

import { readFileSync, writeFileSync, readFile, writeFile } from "fs";
import { walletsModel, networkModel, tokensModel, globalTokensModel, Database } from "../models";
import { Op } from "sequelize";
import sqlite3, { Database as ssdB } from "sqlite3";
let databasePath = process.cwd() + "/blockScanner/src/mcu.sqlite";


interface simple {
  address: string
}

interface addressWithuser extends simple {
  userId: number;
}

/**
 * Class to interact with SQLite database.
 * Handles database connection, table creation, and query execution.
 */
class sqliteDatabase {
  private db: ssdB;

  constructor() {
    let dd = this.dbConn();
    this.db = dd;
  }
  /**
      * Establishes a connection to the SQLite database.
      * Creates the database if it does not exist.
      *
      * @returns {ssdB} - SQLite database instance
      */
  dbConn() {
    return new sqlite3.Database(
      databasePath,
      sqlite3.OPEN_READWRITE,
      (err: any) => {
        if (err && err.code == "SQLITE_CANTOPEN") {
          this.createDatabase();
          return;
        } else if (err) {
          console.log("Getting error " + err);
          process.exit(1);
        }
      }
    );
  }

  /**
   * Creates a new SQLite database if it does not exist.
   */
  createDatabase() {
    var newdb = new sqlite3.Database(databasePath, (err) => {
      if (err) {
        console.log("Getting error " + err);
        process.exit(1);
      }
      this.createTables(newdb);
    });
  }
  /**
   * Creates the required tables in the SQLite database.
   *
   * @param newdb - SQLite database instance
   */
  createTables(newdb: ssdB) {
    newdb.exec(`
            
          CREATE TABLE IF NOT EXISTS block_records (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              blockNumber INTEGER,
              chainId INTEGER);
  
          CREATE TABLE IF NOT EXISTS address_records (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              records JSON NOT NULL,
              walletType TEXT NOT NULL,
              type TEXT,
              name TEXT)
              `);
  }

  runQueries(db: ssdB) { }

  /**
   * 
   * @param sql 
   * @param params 
   * @returns 
   *const 
  sql ="INSERT INTO users (name, email) VALUES (?,?)"; // for insert
  const sql ="DELETE FROM users WHERE id=?"; // for deletion
  const getQuery="SELECT * FROM users WHERE id=?"
  const sql ="UPDATE users SET name=?,email=? WHERE id=? ";
  */


  /**
   * Executes SQL queries that do not return any results (e.g., INSERT, DELETE, UPDATE).
   *
   * @param {string} sql - SQL query string
   * @param {any[]} params - Parameters for the SQL query
   * @returns {Promise<any>} - Promise that resolves when query is executed
   */
  EXquery(sql: string, params: any[]) {
    return new Promise((resolve, reject) => {
      this.db.run(sql, params, (err: any, result: any) => {
        if (err) {
          reject(err);
        }
        resolve(result);
      });
    });
  }

  /**
* Executes SQL SELECT queries that return a single result.
*
* @param {string} sql - SQL query string
* @param {any[]} params - Parameters for the SQL query
* @returns {Promise<any>} - Promise that resolves with the result row
*/
  EXget(sql: string, params: any[]) {
    return new Promise((resolve, reject) => {
      this.db.get(sql, params, (err: any, row: any) => {
        if (err) {
          reject(err);
        }
        resolve(row);
      });
    });
  }


  /**
   * Executes SQL SELECT queries that return multiple results.
   *
   * @param {string} sql - SQL query string
   * @returns {Promise<any>} - Promise that resolves with all result rows
   */
  EXall(sql: string) {
    return new Promise((resolve, reject) => {
      this.db.all(sql, (err: any, row: any) => {
        if (err) {
          reject(err);
        }
        resolve(row);
      });
    });
  }


}


/**
 * Class that handles reading and writing JSON data for blockchain addresses.
 * Extends the sqliteDatabase class to use SQLite database functionality.
 */
export default class jsonFileReadWrite extends sqliteDatabase {
  private basePath = process.cwd()

  private files: any = {
    eth: this.basePath + '/blockScanner/src/json_files/eth_adrs_contarct_adrs.txt',
    eth_users: this.basePath + '/blockScanner/src/json_files/eth_user_adrs.txt',
    // ether address
    tron: this.basePath + '/blockScanner/src/json_files/tron_adrs_contarct_adrs.txt',
    tron_users: this.basePath + '/blockScanner/src/json_files/tron_user_adrs.txt',
    // sol adderss
    sol: this.basePath + '/blockScanner/src/json_files/sol_adrs_contarct_adrs.txt',
    sol_users: this.basePath + '/blockScanner/src/json_files/sol_user_adrs.txt',
  }

  /**
   * Writes the wallet address data to the database for the specified type.
   * If no addresses are found, it inserts the data into the database.
   *
   * @param {string} type - The type of the wallet (e.g., 'eth', 'tron', 'sol')
   * @returns {Promise<void>} - Resolves when the operation is complete
   */
  async writeOnly(type: string): Promise<void> {
    try {
      let networks = await networkModel.findAll({
        where: { walletSupport: (type.slice(-4) == 'tron') ? 'tron' : type.slice(-3) },
        attributes: {
          exclude: ['symbol', 'fullname', 'network', 'user_id', 'walletSupport', 'chainId', 'BlockExplorerURL', 'rpcUrl', 'status', 'createdAt', 'updatedAt', 'deletedAt']
        },
        raw: true
      })

      let data = await this.getWalletAddress(type, networks)

      let allAddress: any | unknown = await super.EXall(`SELECT * FROM address_records WHERE walletType='eth'`)

      if (allAddress.length === 0) {
        let paramsList: any = [JSON.stringify(data), 'eth', 'all', 'eth']
        let sql = "INSERT INTO address_records (records, walletType,type,name) VALUES (?,?,?,?)"; // for insert

        await super.EXquery(sql, paramsList)
      }


      // id INTEGER PRIMARY KEY AUTOINCREMENT,
      //   records TEXT NOT NULL,
      //   walletType TEXT NOT NULL,
      //   type TEXT,
      //   name TEXT)
      return
      // let path : string = this.files[type];




      // // writeFile(path, JSON.stringify(data),  function(err) {
      // //     if (err) {
      // //         return console.error(err);
      // //     }
      // //     console.log("File created!");
      // // });

      // writeFileSync(path, JSON.stringify(data), {
      //     flag: 'w',
      //  });

    } catch (error) {
      console.log('error' + error)
    }
  }

  /**
      * Collects wallet and contract addresses for a given blockchain type (e.g., eth, tron, sol).
      * 
      * @param {string} type - The blockchain type (eth, tron, sol, etc.).
      * @param {object[]} data - List of user wallet data.
      * @param {object[]} networks - List of networks to filter the contract addresses.
      * 
      * @returns {Promise<object>} - Returns an object containing both wallet addresses and contract addresses.
      */
  simpleAdrs = async (type: string, data: object[], networks: object[]) => {

    // ================================================================= //
    // collection contact address
    // ================================================================= //
    let condition = [];
    let item: any
    for (item of networks) {
      condition.push(Database.where(
        Database.col('networks'), // Just 'name' also works if no joins
        Op.like,
        `%${item.id}%`
      ))
    }

    interface newObj {
      address?: object[],
      contarct?: object[],
    }
    let Obj: newObj = {}
    let adrses = [];
    let contract = [];

    let adrs: any

    // collect contract address 
    let tokens = await tokensModel.findAll({ where: { [Op.or]: condition }, raw: true })

    if (tokens.length > 0) {
      let tokns: any
      for (tokns of tokens) {

        if (tokns?.networks === '' || (tokns?.networks).length === 0) return

        for (let toknsNet of tokns?.networks) {
          const found = networks.find((item: any) => item.id == toknsNet.id);
          if (found) {
            contract.push((toknsNet.contract).toLowerCase());
          }
        }

      }
    }

    // ================================================================= //
    // collection contact address  // end
    // ================================================================= //


    // ================================================================= //
    // collect user wallet address
    // ================================================================= //
    if (data.length > 0) {
      for (adrs of data) {
        adrses.push((adrs.wallets[type]?.address).toLowerCase())
      }
    }
    // ================================================================= //
    // collect user wallet address
    // ================================================================= //

    Obj.address = adrses
    Obj.contarct = contract

    return Obj;
  }

  /**
* Maps user data to include wallet addresses and their respective user IDs.
* 
* @param {string} type - The blockchain type (eth, tron, sol, etc.).
* @param {object[]} data - List of user wallet data.
* 
* @returns {object[]} - Returns an array of objects with user ID and address.
*/
  userIdWithAddress = (type: string, data: object[]) => {
    let adrses = [];
    let adrs: any
    for (adrs of data) {
      let newObj: any;
      newObj.address = adrs?.wallets[type]?.address
      newObj.user_id = adrs?.user_id
      adrses.push(newObj)
    }
    return adrses;
  }
  /**
   * Retrieves wallet addresses based on the blockchain type.
   * 
   * @param {string} type - The blockchain type (eth, tron, sol, etc.).
   * @param {object[]} networks - List of networks to filter the contract addresses.
   * 
   * @returns {Promise<any>} - Returns wallet and contract addresses for the given blockchain type.
   */
  getWalletAddress = async (type: string, networks: object[]): Promise<any> => {
    try {

      let data;
      let adderss;

      if (type === 'eth') {
        data = await walletsModel.findAll({ attributes: { exclude: ['id', 'user_id', 'createdAt', 'updatedAt', 'deletedAt'] }, raw: true })
        return this.simpleAdrs(type, data, networks)
      } else if (type === 'eth_users') {
        data = await walletsModel.findAll({ attributes: { exclude: ['id', 'createdAt', 'updatedAt', 'deletedAt'] }, raw: true })
        return this.userIdWithAddress(type, data)
      } else if (type === 'tron') {
        data = await walletsModel.findAll({ attributes: { exclude: ['id', 'user_id', 'createdAt', 'updatedAt', 'deletedAt'] }, raw: true })
        return this.simpleAdrs(type, data, networks)
      } else if (type === 'tron_users') {
        data = await walletsModel.findAll({ attributes: { exclude: ['id', 'user_id', 'createdAt', 'updatedAt', 'deletedAt'] }, raw: true })
        return this.userIdWithAddress(type, data)
      } else if (type === 'sol') {
        data = await walletsModel.findAll({ attributes: { exclude: ['id', 'user_id', 'createdAt', 'updatedAt', 'deletedAt'] }, raw: true })
        return this.simpleAdrs(type, data, networks)
      } else if (type === 'sol_users') {
        data = await walletsModel.findAll({ attributes: { exclude: ['id', 'user_id', 'createdAt', 'updatedAt', 'deletedAt'] }, raw: true })
        return this.userIdWithAddress(type, data)
      }

    } catch (error) {

    }
  }

  /**
   * Reads a JSON file containing blockchain address data.
   * 
   * @param {string} type - The blockchain type (eth, tron, sol, etc.).
   * 
   * @returns {any} - Returns the data from the file as a parsed JSON object.
   */
  readonly(type: string) {
    let path: string = this.files[type];
    let data = readFileSync(path, 'utf-8')
    data = JSON.parse(data)
    return data
  }


}


import { readFileSync, writeFileSync, readFile, writeFile } from "fs";
import { walletsModel, networkModel, tokensModel,globalTokensModel, Database } from "../models";
import { Op } from "sequelize";
import sqlite3, {  Database as ssdB } from "sqlite3";
let databasePath = process.cwd() + "/blockScanner/src/mcu.sqlite";


interface simple {
    address : string
}

interface addressWithuser extends simple {
    userId: number;
}

class sqliteDatabase {
    private db: ssdB;
  
    constructor() {
      let dd = this.dbConn();
      this.db = dd;
    }
    /**
     *
     * @returns
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
     *
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
     *
     * @param newdb
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
  
    runQueries(db: ssdB) {}
  
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
       * 
       * @param sql 
       * @param params 
       * @returns 
       const getQuery="SELECT * FROM users WHERE id=?"
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
      * 
      * @param sql 
      * @param params 
      * @returns 
      const getQuery="SELECT * FROM users WHERE id=?"
      */
    EXall(sql: string) {
      return new Promise((resolve, reject) => {
        this.db.all(sql,(err: any, row: any) => {
          if (err) {
            reject(err);
          }
          resolve(row);
        });
      });
    }
  
  
}

  

export default class jsonFileReadWrite extends sqliteDatabase {
    private basePath = process.cwd()

    private files : any = {
        eth : this.basePath+'/blockScanner/src/json_files/eth_adrs_contarct_adrs.txt',
        eth_users : this.basePath+'/blockScanner/src/json_files/eth_user_adrs.txt',
        // ether address
        tron : this.basePath+'/blockScanner/src/json_files/tron_adrs_contarct_adrs.txt',
        tron_users : this.basePath+'/blockScanner/src/json_files/tron_user_adrs.txt',
        // sol adderss
        sol : this.basePath+'/blockScanner/src/json_files/sol_adrs_contarct_adrs.txt',
        sol_users : this.basePath+'/blockScanner/src/json_files/sol_user_adrs.txt',
    }

    /**
     * 
     * @param type 
     * @returns 
     */

    async writeOnly (type : string) : Promise<void> {
        try {
            let networks = await networkModel.findAll({
                where : {walletSupport : (type.slice(-4) == 'tron') ? 'tron' :  type.slice(-3)  },
                attributes : {
                    exclude : ['symbol','fullname','network','user_id','walletSupport','chainId','BlockExplorerURL','rpcUrl','status','createdAt','updatedAt','deletedAt']
                },
                raw :true}) 
    
            let data  = await this.getWalletAddress(type,networks)

            let allAddress : any | unknown = await  super.EXall(`SELECT * FROM address_records WHERE walletType='eth'`)

            if(allAddress.length === 0){
                 let paramsList : any = [JSON.stringify(data),'eth','all','eth']
                 let sql ="INSERT INTO address_records (records, walletType,type,name) VALUES (?,?,?,?)"; // for insert

                await super.EXquery(sql,paramsList)
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
             console.log('error'+error)
        }
    }
    
    /**
     * 
     * @param type 
     * @param data 
     * @returns 
     */

    simpleAdrs = async (type : string, data : object[], networks: object[])  => {

        // ================================================================= //
            // collection contact address
        // ================================================================= //
        let condition = [];
        let item : any
        for (item of networks){
            condition.push(Database.where(
                Database.col('networks'), // Just 'name' also works if no joins
                Op.like,
                `%${item.id}%`
              ))
        }

        interface newObj  {
            address? : object[],
            contarct? : object[],
        }
        let Obj : newObj  = {}
        let adrses = [];
        let contract = [];

        let adrs : any

        // collect contract address 
        let tokens = await tokensModel.findAll({where : {[Op.or] : condition} ,raw:true})
        
        if(tokens.length > 0){
            let tokns : any
            for(tokns of tokens){

                if(tokns?.networks === '' || (tokns?.networks).length === 0) return

                for(let toknsNet of tokns?.networks){
                    const found = networks.find((item : any) => item.id == toknsNet.id);
                    if(found){
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
        if(data.length > 0) {
            for(adrs of data){
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

    userIdWithAddress =  (type : string , data : object[]) => {
        let adrses = [];
        let adrs : any
        for(adrs of data){
            let newObj : any ;
            newObj.address = adrs?.wallets[type]?.address
            newObj.user_id = adrs?.user_id
            adrses.push(newObj)
        }
        return adrses; 
    }

    /**
     * 
     * @param type 
     */

    getWalletAddress = async (type : string, networks : object[]) : Promise<any> => {
        try {
           
            let data;
            let adderss; 

            if(type === 'eth'){
                data = await walletsModel.findAll({attributes: { exclude : ['id','user_id','createdAt','updatedAt','deletedAt']},raw : true})
                return this.simpleAdrs(type, data, networks)
            }else if(type === 'eth_users'){
                data = await walletsModel.findAll({attributes: { exclude : ['id','createdAt','updatedAt','deletedAt']},raw : true})
                return this.userIdWithAddress(type, data)
            }else if(type === 'tron'){
                data = await walletsModel.findAll({attributes: { exclude : ['id','user_id','createdAt','updatedAt','deletedAt']},raw : true})
                return this.simpleAdrs(type, data, networks)
            }else if(type === 'tron_users'){
                data = await walletsModel.findAll({attributes: { exclude : ['id','user_id','createdAt','updatedAt','deletedAt']},raw : true})
                return this.userIdWithAddress(type, data)
            }else if(type === 'sol'){
                data = await walletsModel.findAll({attributes: { exclude : ['id','user_id','createdAt','updatedAt','deletedAt']},raw : true})
                return this.simpleAdrs(type, data, networks)
            }else if(type === 'sol_users'){
                data = await walletsModel.findAll({attributes: { exclude : ['id','user_id','createdAt','updatedAt','deletedAt']},raw : true})
                return this.userIdWithAddress(type, data)
            }

        } catch (error) {
            
        }
    }

    /**
     * 
     * @param type 
     * @returns 
     */

    readonly(type : string){
            let path : string = this.files[type];
            let data =  readFileSync(path,'utf-8')
            data = JSON.parse(data)
            return data
    }  


}


import dotenv from "dotenv";
dotenv.config();
import http from 'http'
import process from 'process'
import { parse } from 'url';
import helmet from 'helmet'
import cors from 'cors'

// import bodyParser from 'body-parser';
import express, { Response, Request } from "express";
import { Application } from "express";
import WebSocket,  { WebSocketServer, EventEmitter } from "ws";
import { mainCron, watchEtherTransfers } from "./src/watcher";
import { networkModel } from "../src/models";
import service from "../src/services/service";

let myEvents = new EventEmitter();

mainCron()


// let myEvent = new EventEmitter()

// myEvent.on('testing',)
const app: Application = express();
const port: number = 8000;

app.use(helmet());
app.use(cors({
  origin: '*'
}));

// { clientTracking: false, noServer: true }
// Create a basic HTTP server using Express
const server = http.createServer(app);



const wss = new WebSocketServer({server});

const isJson = (json : any) => {
  try {
    JSON.parse(json)
    return true;
  } catch (error) {
    return false;
  }
}


const getBlocksFormDataBase = async (chainid : number)  => {
  try {
    const getQuery="SELECT blockNumber,chainId FROM block_records WHERE chainId=?"
    const params = [chainid]
    let data = await service.jsonFileReadWrite.EXget(getQuery,params);
    return data;
  } catch (error) {
    return []
  }
}


const  transaction_receipt_by_chain =  async (chainId:number)=>{
  try {
    const getQuery="SELECT transactionReceipt FROM transaction_receipt WHERE chainId="+chainId
    let data : any = await service.jsonFileReadWrite.EXall(getQuery);
    let array : any[] = []
    if(Object.keys(data).length > 0) {
      for(let d of data){
       array.push(JSON.parse(d?.transactionReceipt))
      }
    }
    return array;
  } catch (error) {
    return []
  }
}

// ;(async()=>{
//   console.log(await transaction_receipt_by_chain(97))
// })().catch(error=>console.error)

function toObject(json : object) {
  return JSON.parse(JSON.stringify(json, (key, value) =>
      typeof value === 'bigint'
          ? value.toString()
          : value // return everything else unchanged
  ));
}


export const transaction_receipt = async (chainId  : number, newData? : any) =>{
  try {
    const getQuery="SELECT transactionReceipt,chainId FROM transaction_receipt WHERE chainId=?"
    let data : any = await service.jsonFileReadWrite.EXget(getQuery,[chainId]);

    if(!newData){
      return data
    } 
    newData = toObject(newData)
    let sql ="INSERT INTO transaction_receipt (transactionReceipt, chainId) VALUES (?,?)"; // for insert
    await service.jsonFileReadWrite.EXquery(sql,[JSON.stringify(newData),chainId]);

    return data;
  } catch (error) {
    console.log(error)
    return []
  }
}

wss.on('connection',async function connection(ws) {



  ws.on('message', async  (message : any)=> {

    if(!isJson(message)){
      ws.send('Opps! data in appropriate data format. Please provide on json format.');
      return;
    }
  

    try {

      let  {type, chainid} = JSON.parse(message);
      if (type === 'subscribe') {
        let data : {block? : [], data? : any  } = {}
        let resData : any = await getBlocksFormDataBase(chainid)
        data.block = resData?.blockNumber
        data.data = await transaction_receipt_by_chain(chainid)
        let body = JSON.stringify(data);
        ws.send(body)
      }
      
    } catch (error : any) {
      console.log(error)
       ws.send('Opps! data in appropriate data format. Please provide on json format.',error);
    }

  });




   // Handle the closing of a client's connection
   ws.on('close', () => {
    console.log('Client disconnected');
  });

});


;(async()=>{
  // await watchEtherTransfers(wss);
})().catch(error=>console.error)

// var httpServer = http.createServer(app);


// start cron 
myEvents.on("startCron",()=>{
  console.log('working')
  mainCron()
})


app.use('/v-1/active/:id', async (req : Request, res : Response)=>{
  try {
    let id = req.params.id
    let data = await networkModel.findOne({where : {id:id}}).then(obj=>{
        if(obj){
          obj?.update({status : true})
        }
      })
  
  myEvents.emit("startCron")
  res.status(200).send({message : "active all"})
    
 

  } catch (error) {
    res.status(500).send(error)
  }
})


// worldometers api with html example?




app.use('/',(req: Request, res :Response)=>{
  res.status(200).send('working..')
})





server
  .listen(port, "localhost", function () {
    console.info(`Server running on : http://localhost:${port}`);
  })
  .on("error", (err: any) => {
    if (err.code === "EADDRINUSE") {
      console.log("server startup error: address already in use");
    } else {
      console.log(err);
    }
  });
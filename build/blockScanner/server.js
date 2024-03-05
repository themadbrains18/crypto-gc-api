"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.transaction_receipt = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const http_1 = __importDefault(require("http"));
const helmet_1 = __importDefault(require("helmet"));
const cors_1 = __importDefault(require("cors"));
// import bodyParser from 'body-parser';
const express_1 = __importDefault(require("express"));
const ws_1 = require("ws");
const watcher_1 = require("./src/watcher");
const models_1 = require("../src/models");
const service_1 = __importDefault(require("../src/services/service"));
let myEvents = new ws_1.EventEmitter();
(0, watcher_1.mainCron)();
// let myEvent = new EventEmitter()
// myEvent.on('testing',)
const app = (0, express_1.default)();
const port = 8000;
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({
    origin: '*'
}));
// { clientTracking: false, noServer: true }
// Create a basic HTTP server using Express
const server = http_1.default.createServer(app);
const wss = new ws_1.WebSocketServer({ server });
const isJson = (json) => {
    try {
        JSON.parse(json);
        return true;
    }
    catch (error) {
        return false;
    }
};
const getBlocksFormDataBase = async (chainid) => {
    try {
        const getQuery = "SELECT blockNumber,chainId FROM block_records WHERE chainId=?";
        const params = [chainid];
        let data = await service_1.default.jsonFileReadWrite.EXget(getQuery, params);
        return data;
    }
    catch (error) {
        return [];
    }
};
const transaction_receipt_by_chain = async (chainId) => {
    try {
        const getQuery = "SELECT transactionReceipt FROM transaction_receipt WHERE chainId=" + chainId;
        let data = await service_1.default.jsonFileReadWrite.EXall(getQuery);
        let array = [];
        if (Object.keys(data).length > 0) {
            for (let d of data) {
                array.push(JSON.parse(d?.transactionReceipt));
            }
        }
        return array;
    }
    catch (error) {
        return [];
    }
};
// ;(async()=>{
//   console.log(await transaction_receipt_by_chain(97))
// })().catch(error=>console.error)
function toObject(json) {
    return JSON.parse(JSON.stringify(json, (key, value) => typeof value === 'bigint'
        ? value.toString()
        : value // return everything else unchanged
    ));
}
const transaction_receipt = async (chainId, newData) => {
    try {
        const getQuery = "SELECT transactionReceipt,chainId FROM transaction_receipt WHERE chainId=?";
        let data = await service_1.default.jsonFileReadWrite.EXget(getQuery, [chainId]);
        if (!newData) {
            return data;
        }
        newData = toObject(newData);
        let sql = "INSERT INTO transaction_receipt (transactionReceipt, chainId) VALUES (?,?)"; // for insert
        await service_1.default.jsonFileReadWrite.EXquery(sql, [JSON.stringify(newData), chainId]);
        return data;
    }
    catch (error) {
        console.log(error);
        return [];
    }
};
exports.transaction_receipt = transaction_receipt;
wss.on('connection', async function connection(ws) {
    ws.on('message', async (message) => {
        if (!isJson(message)) {
            ws.send('Opps! data in appropriate data format. Please provide on json format.');
            return;
        }
        try {
            let { type, chainid } = JSON.parse(message);
            if (type === 'subscribe') {
                let data = {};
                let resData = await getBlocksFormDataBase(chainid);
                data.block = resData?.blockNumber;
                data.data = await transaction_receipt_by_chain(chainid);
                let body = JSON.stringify(data);
                ws.send(body);
            }
        }
        catch (error) {
            console.log(error);
            ws.send('Opps! data in appropriate data format. Please provide on json format.', error);
        }
    });
    // Handle the closing of a client's connection
    ws.on('close', () => {
        console.log('Client disconnected');
    });
});
;
(async () => {
    // await watchEtherTransfers(wss);
})().catch(error => console.error);
// var httpServer = http.createServer(app);
// start cron 
myEvents.on("startCron", () => {
    console.log('working');
    (0, watcher_1.mainCron)();
});
app.use('/v-1/active/:id', async (req, res) => {
    try {
        let id = req.params.id;
        let data = await models_1.networkModel.findOne({ where: { id: id } }).then(obj => {
            if (obj) {
                obj?.update({ status: true });
            }
        });
        myEvents.emit("startCron");
        res.status(200).send({ message: "active all" });
    }
    catch (error) {
        res.status(500).send(error);
    }
});
// worldometers api with html example?
app.use('/', (req, res) => {
    res.status(200).send('working..');
});
server
    .listen(port, "localhost", function () {
    console.info(`Server running on : http://localhost:${port}`);
})
    .on("error", (err) => {
    if (err.code === "EADDRINUSE") {
        console.log("server startup error: address already in use");
    }
    else {
        console.log(err);
    }
});

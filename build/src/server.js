"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const http_1 = __importDefault(require("http"));
const process_1 = __importDefault(require("process"));
const ws_1 = require("ws");
const express_1 = __importDefault(require("express"));
const app_1 = __importDefault(require("./app"));
const node_cron_1 = __importDefault(require("node-cron"));
const service_1 = __importDefault(require("./services/service"));
const errorHandler_1 = require("./exceptions/errorHandler");
const order_controller_1 = __importDefault(require("./controllers/order.controller"));
const post_controller_1 = __importDefault(require("./controllers/post.controller"));
const user_notification_controller_1 = __importDefault(require("./controllers/user_notification.controller"));
const chat_controller_1 = __importDefault(require("./controllers/chat.controller"));
const profile_controller_1 = __importDefault(require("./controllers/profile.controller"));
const pusher_1 = __importDefault(require("./utils/pusher"));
const app = (0, express_1.default)();
const server = new app_1.default(app);
const port = process_1.default.env.PORT ? parseInt(process_1.default.env.PORT, 10) : 8080;
let order = new order_controller_1.default();
let post = new post_controller_1.default();
let notify = new user_notification_controller_1.default();
let chat = new chat_controller_1.default();
let profile = new profile_controller_1.default();
// const pusher = new Pusher({
//   appId: "1764567",
//   key: "b275b2f9e51725c09934",
//   secret: "623efdee5de58f6287ef",
//   cluster: "ap2",
//   useTLS: true
// });
app.get('/hello', (req, res) => {
    res.set('Content-Type', 'text/html');
    res.status(200).send("<h1>Hello GFG Learner!</h1>");
});
const wss = new ws_1.WebSocketServer({ port: 3001 });
wss.on('connection', (ws) => {
    // console.log('New client connected');
    ws.on('message', async (message) => {
        // console.log(`Received message: ${message}`);
        let body = JSON.parse(message);
        if (body?.ws_type === 'order') {
            order.socketOrder(wss, ws, body);
        }
        if (body?.ws_type === 'buy') {
            wss.clients.forEach(function e(client) {
                client.send(JSON.stringify({ status: 200, message: 'order created', type: 'buy' }));
            });
        }
        if (body?.ws_type === 'position') {
            wss.clients.forEach(function e(client) {
                client.send(JSON.stringify({ status: 200, message: 'position created', type: 'position' }));
            });
        }
        if (body.ws_type === 'post') {
            await post.socketPostAds(wss, ws);
        }
        if (body.ws_type === 'user_withdraw') {
            await service_1.default.withdrawServices.releaseWithdrawAssets(body.data);
            await notify.saveUserNotification(wss, ws, body);
        }
        if (body?.ws_type === 'chat') {
            chat.socketChat(wss, ws, body);
        }
        if (body?.ws_type === 'profile') {
            let profileData = await service_1.default.profile.getProfile(body.user_id);
            wss.clients.forEach(function e(client) {
                client.send(JSON.stringify({ status: 200, data: profileData, type: 'profile' }));
            });
        }
        if (body?.ws_type === 'market') {
            wss.clients.forEach(function e(client) {
                client.send(JSON.stringify({ status: 200, data: [], type: 'market' }));
            });
        }
    });
    ws.on('close', () => {
        console.log('Client disconnected');
    });
});
app.set("socket", wss);
// var channel = pusher.get(req:);
node_cron_1.default.schedule("*/10 * * * * *", async () => {
    const date = new Date();
    await service_1.default.token.updateGlobalTokenPrice();
    pusher_1.default.trigger("crypto-channel", "price", {
        message: "hello world"
    });
});
// cron.schedule("*/30 * * * * *", async () => {
//   await service.scan.scanUserDeposits();
// })
var httpServer = http_1.default.createServer(app);
httpServer
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
process_1.default.on("unhandledRejection", (reason, promise) => {
    throw reason;
});
process_1.default.on("uncaughtException", (error) => {
    errorHandler_1.cerrorHandler.handleError(error);
    if (!errorHandler_1.cerrorHandler.isTrustedError(error)) {
        process_1.default.exit(1);
    }
});
module.exports = app;

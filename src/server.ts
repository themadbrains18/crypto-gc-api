import dotenv from "dotenv";
dotenv.config();
import http from 'http'
import process from 'process'
import WebSocket, { WebSocketServer } from 'ws';

import express from "express";
import { Application } from "express";
import Server from "./app";
import cron from "node-cron";
import service from "./services/service";
import { cerrorHandler } from "./exceptions/errorHandler";
import orderController from './controllers/order.controller';
import postController from "./controllers/post.controller";
import userNotificationController from "./controllers/user_notification.controller";
import chatController from "./controllers/chat.controller";
import profileController from "./controllers/profile.controller";

import pusher from "./utils/pusher";

const app: Application = express();

const server: Server = new Server(app);

const port: number = process.env.PORT ? parseInt(process.env.PORT, 10) : 8080;
let order = new orderController();
let post = new postController();
let notify = new userNotificationController();
let chat = new chatController();
let profile = new profileController();

// const pusher = new Pusher({
//   appId: "1764567",
//   key: "b275b2f9e51725c09934",
//   secret: "623efdee5de58f6287ef",
//   cluster: "ap2",
//   useTLS: true
// });

app.get('/',(req,res)=>{
  res.status(200).send("API is running..")
})


const wss = new WebSocketServer({ port: 3001 });

wss.on('connection', (ws: WebSocket) => {
  // console.log('New client connected');

  ws.on('message', async (message: any) => {

    // console.log(`Received message: ${message}`);

    let body = JSON.parse(message);

    if (body?.ws_type === 'order') {
      order.socketOrder(wss, ws, body);
    }

    if (body?.ws_type === 'buy') {
      wss.clients.forEach(function e(client) {
        client.send(JSON.stringify({ status: 200, message: 'order created', type: 'buy' }));
      })
    }

    if (body?.ws_type === 'position') {
      wss.clients.forEach(function e(client) {
        client.send(JSON.stringify({ status: 200, message: 'position created', type: 'position' }));
      })
    }

    if (body.ws_type === 'post') {
      await post.socketPostAds(wss, ws);
    }

    if (body.ws_type === 'user_withdraw') {

      await service.withdrawServices.releaseWithdrawAssets(body.data);

      await notify.saveUserNotification(wss, ws, body);
    }

if (body?.ws_type === 'chat') {
  chat.socketChat(wss, ws, body);
}

    if (body?.ws_type === 'profile') {
      let profileData = await service.profile.getProfile(body.user_id);

      wss.clients.forEach(function e(client) {
        client.send(JSON.stringify({ status: 200, data: profileData, type: 'profile' }));
      })
    }

    if (body?.ws_type === 'market') {
      wss.clients.forEach(function e(client) {
        client.send(JSON.stringify({ status: 200, data: [], type: 'market' }));
      })
    }

  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

app.set("socket", wss);

// var channel = pusher.get(req:);

cron.schedule("*/10 * * * * *", async () => {
  const date = new Date();
  await service.token.updateGlobalTokenPrice();
  pusher.trigger("crypto-channel", "price", {
    message: "hello world"
  });
});

// cron.schedule("*/30 * * * * *", async () => {
//   await service.scan.scanUserDeposits();
// })

var httpServer = http.createServer(app);

httpServer
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

process.on("unhandledRejection", (reason: Error, promise: Promise<any>) => {
  throw reason;
});

process.on("uncaughtException", (error: Error) => {
  cerrorHandler.handleError(error);
  if (!cerrorHandler.isTrustedError(error)) {
    process.exit(1);
  }
});

module.exports = app;
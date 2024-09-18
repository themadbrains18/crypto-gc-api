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
import sequelize from "./models";
import userServices from "./services/user.service";

const app: Application = express();

const server: Server = new Server(app);

const port: number = process.env.PORT ? parseInt(process.env.PORT, 10) : 8080;
let order = new orderController();
let post = new postController();
let notify = new userNotificationController();
let chat = new chatController();
let profile = new profileController();

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
        client.send(JSON.stringify({ status: 200, message: 'order created', data: body, type: 'buy' }));
      })
    }

    if (body?.ws_type === 'position') {
      wss.clients.forEach(function e(client) {
        client.send(JSON.stringify({ status: 200, message: 'position created', type: 'position' }));
      })
    }

    if (body.ws_type === 'post') {
      const userId = body.userId
      const limit = body.limit;
      const offset = body.offset;
      const currency = "all";
      const pmMethod = "all"
      await post.socketPostAds(wss, ws, userId, limit, offset, currency, pmMethod);
    }

    if (body.ws_type === 'user_withdraw') {
      await service.withdrawServices.releaseWithdrawAssets(body.data);
      await notify.saveUserNotification(wss, ws, body);
    }

    if (body?.ws_type === 'chat') {
      chat.socketChat(wss, ws, body);
    }

    if (body?.ws_type === 'user_notify') {
      await notify.saveUserNotification(wss, ws, body);
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

    if (body?.ws_type === 'convert') {
      wss.clients.forEach(function e(client) {
        client.send(JSON.stringify({ status: 200, data: [], type: 'convert' }));
      })
    }
    if (body?.ws_type === 'transfer') {
      wss.clients.forEach(function e(client) {
        client.send(JSON.stringify({ status: 200, data: [], type: 'transfer' }));
      })
    }

  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

app.set("socket", wss);

/**
 * Cron to update market token price
 */
cron.schedule("*/10 * * * * *", async () => {
  const date = new Date();
  await service.token.updateGlobalTokenPrice();
  wss.clients.forEach(function e(client) {
    client.send(JSON.stringify({ status: 200, type: 'price' }));
  });
});


/**
 * Cron for market order spot trading 
 */
let isCronRunning = false;
// cron.schedule('*/2 * * * *', async () => {  // Cron job runs every 5 seconds
//   if (isCronRunning) {
//     console.log("Previous cron job is still running. Skipping this execution.");
//     return;
//   }
//   isCronRunning = true;
//   try {
//     console.log('=======here crom ===========');

//     const batchSize = 100;  // Define your batch size here
//     await service.cronMarket.processOrdersInBatches(batchSize);
//     isCronRunning=false   
//   } catch (error) {
//     console.error("Error in cron job:", error);
//   }
//   finally {
//     isCronRunning = false;
//   }
// });



var httpServer = http.createServer(app);

httpServer
  .listen(port, "localhost", function () {
    console.info(`Server running on : http://localhost:${port}`);
  }).on("error", (err: any) => {
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
cron.schedule('0 */5 * * *', async () => {
  try {
    console.log('Running the kill-excess-connections task...');
    await service.user.killExcessConnection()
    console.log('Task executed successfully');
  } catch (error) {
    console.error('Error executing the task:', error);
  }
});

module.exports = app;
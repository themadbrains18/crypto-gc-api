"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pusher_1 = __importDefault(require("pusher"));
const pusher = new pusher_1.default({
    appId: "1764567",
    key: "b275b2f9e51725c09934",
    secret: "623efdee5de58f6287ef",
    cluster: "ap2",
    useTLS: true
});
exports.default = pusher;

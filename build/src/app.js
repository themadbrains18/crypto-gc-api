"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importStar(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const routes_1 = __importDefault(require("./routes"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const helmet_1 = __importDefault(require("helmet"));
const cors_1 = __importDefault(require("cors"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_json_1 = __importDefault(require("../src/swagger/swagger.json"));
const express_useragent_1 = __importDefault(require("express-useragent"));
const request_ip_1 = __importDefault(require("request-ip"));
// hello
class Server {
    constructor(app) {
        this.middlewares(app);
        new routes_1.default(app);
    }
    middlewares(app) {
        // create a write stream (in append mode)
        var accessLogStream = fs_1.default.createWriteStream(path_1.default.join(__dirname, "access.log"), { flags: "a" });
        /**
         *  App Configuration
         */
        app.use((0, helmet_1.default)());
        app.use((0, cors_1.default)({
            origin: '*'
        }));
        app.use((0, morgan_1.default)("combined", {
            stream: accessLogStream,
            skip: function (req, res) {
                return res.statusCode > 400;
            },
        }));
        app.use((0, express_1.urlencoded)({ extended: true }));
        app.use((0, express_1.json)());
        app.use(express_1.default.urlencoded({ extended: true }));
        app.use(express_useragent_1.default.express());
        app.use(request_ip_1.default.mw());
        // app.use("/", express.static(process.cwd(), 'public');
        // app.use('/', express.static(path.join(process.cwd(), './public')))
        var options = {
            customCss: ".swagger-ui .topbar { display: none }",
        };
        app.use("/api-docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_json_1.default, options));
    }
}
exports.default = Server;

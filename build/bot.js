"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.client = void 0;
const Client_1 = __importDefault(require("./Client"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.client = new Client_1.default(process.env.DISCORD_TOKEN, process.env.MONGO_URI);
exports.client.init();

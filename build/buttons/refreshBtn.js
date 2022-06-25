"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.execute = exports.data = void 0;
const discord_js_1 = require("discord.js");
const sendCaptcha_1 = require("../utills/sendCaptcha");
const refreshConfig = {
    timeout: false,
};
const refreshBtn = new discord_js_1.MessageButton()
    .setCustomId('refreshBtn')
    .setLabel('Обновить')
    .setStyle('SECONDARY');
exports.data = new discord_js_1.MessageActionRow()
    .addComponents(refreshBtn);
const execute = (interaction) => __awaiter(void 0, void 0, void 0, function* () {
    if (refreshConfig.timeout) {
        return yield interaction.reply("Подождите 5 минут");
    }
    else {
        refreshConfig.timeout = true;
        setTimeout(() => {
            refreshConfig.timeout = false;
        }, 300000);
        return yield (0, sendCaptcha_1.sendCaptcha)(interaction.user);
    }
});
exports.execute = execute;
exports.default = {
    data: refreshBtn,
    execute: exports.execute
};

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getErrEmbed = void 0;
const discord_js_1 = require("discord.js");
const getErrEmbed = (message) => {
    const errorEmbed = new discord_js_1.MessageEmbed();
    errorEmbed.setTitle("Ошибка")
        .setDescription(message);
    return errorEmbed;
};
exports.getErrEmbed = getErrEmbed;

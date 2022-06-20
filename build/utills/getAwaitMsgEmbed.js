"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAwaitMsgEmbed = void 0;
const discord_js_1 = require("discord.js");
const getAwaitMsgEmbed = (message) => {
    const awaitMsgEmbed = new discord_js_1.MessageEmbed();
    awaitMsgEmbed.setTitle("Настройки личной комнаты")
        .setDescription(`Чтобы ${message} введите его ниже`)
        .setFooter({ text: "У вас есть 15 секунд, затем данное сообщение автоматически удалится" });
    return awaitMsgEmbed;
};
exports.getAwaitMsgEmbed = getAwaitMsgEmbed;

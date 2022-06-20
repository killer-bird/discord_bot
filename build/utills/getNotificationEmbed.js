"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNotificationEmbed = void 0;
const discord_js_1 = require("discord.js");
const getNotificationEmbed = (notification) => {
    const notificationEmbed = new discord_js_1.MessageEmbed();
    notificationEmbed.setTitle("Уведомление")
        .setDescription(notification);
    return notificationEmbed;
};
exports.getNotificationEmbed = getNotificationEmbed;

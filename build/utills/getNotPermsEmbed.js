"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNotPermsEmbed = void 0;
const discord_js_1 = require("discord.js");
const getNotPermsEmbed = () => {
    const notPermsEmbed = new discord_js_1.MessageEmbed();
    notPermsEmbed.setTitle("Не хватает полномочий")
        .setDescription("");
};
exports.getNotPermsEmbed = getNotPermsEmbed;

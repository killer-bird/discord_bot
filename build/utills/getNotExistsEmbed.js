"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNotExistEmbed = void 0;
const discord_js_1 = require("discord.js");
const getNotExistEmbed = (user) => {
    const notExistEmbed = new discord_js_1.MessageEmbed();
    notExistEmbed.setTitle("Ошибка")
        .setDescription(`
    Введен неккоректный пользователь: ${user} 
    Если это не бот, обратитесь за помощью к администрации.
    `);
    return notExistEmbed;
};
exports.getNotExistEmbed = getNotExistEmbed;

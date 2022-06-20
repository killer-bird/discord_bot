"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNotHaveTimeEmbed = void 0;
const discord_js_1 = require("discord.js");
const getNotHaveTimeEmbed = () => {
    const notHaveTimeEmbed = new discord_js_1.MessageEmbed();
    notHaveTimeEmbed.setTitle("Не хватило времени")
        .setDescription("Вы не успели дать ответ в указанное время. Попробуйте еще раз");
    return notHaveTimeEmbed;
};
exports.getNotHaveTimeEmbed = getNotHaveTimeEmbed;

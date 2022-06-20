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
exports.execute = exports.data = exports.limitBtn = void 0;
const discord_js_1 = require("discord.js");
const RoomModel_1 = require("../database/models/RoomModel");
const getAwaitMsgEmbed_1 = require("../utills/getAwaitMsgEmbed");
const getNotHaveTimeEmbed_1 = require("../utills/getNotHaveTimeEmbed");
const config_1 = require("../config");
const setLimit = (room, limit) => __awaiter(void 0, void 0, void 0, function* () {
    if (limit === 0) {
        yield room.edit({ userLimit: undefined });
        yield RoomModel_1.Room.updateOne({ id: room.id }, { limit: undefined });
        return;
    }
    yield room.edit({ userLimit: limit });
    yield RoomModel_1.Room.updateOne({ id: room.id }, { limit });
});
exports.limitBtn = new discord_js_1.MessageButton()
    .setCustomId('limitBtn')
    .setEmoji('988485874985619507')
    .setStyle('SECONDARY');
exports.data = new discord_js_1.MessageActionRow()
    .addComponents(exports.limitBtn);
const execute = (interaction) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    const member = interaction.member;
    const room = yield RoomModel_1.Room.findOne({ id: member.voice.channelId });
    if ((room === null || room === void 0 ? void 0 : room.owner) === interaction.user.id) {
        yield interaction.reply({ embeds: [(0, getAwaitMsgEmbed_1.getAwaitMsgEmbed)("установить лимит пользователей для комнаты (если вы хотите сделать комнату безлимитной то введите **0**)")] });
        const awaitMsgTimeout = setTimeout(() => __awaiter(void 0, void 0, void 0, function* () {
            yield interaction.editReply({ embeds: [(0, getNotHaveTimeEmbed_1.getNotHaveTimeEmbed)()] });
            setTimeout(() => __awaiter(void 0, void 0, void 0, function* () {
                yield interaction.deleteReply();
            }), 3000);
        }), 15000);
        const filter = (m) => {
            console.log(m.content, 15215152125);
            return true;
        };
        try {
            const response = yield ((_a = interaction.channel) === null || _a === void 0 ? void 0 : _a.awaitMessages({ filter, max: 1, time: 15000 }));
            if (response) {
                if (!!Number((_b = response.first()) === null || _b === void 0 ? void 0 : _b.content)) {
                    yield setLimit(config_1.privateRoomConfig.voiceChannel, Number((_c = response.first()) === null || _c === void 0 ? void 0 : _c.content));
                    clearTimeout(awaitMsgTimeout);
                    yield interaction.deleteReply();
                }
            }
        }
        catch (error) {
            console.log(error);
            return;
        }
    }
    else {
        console.log("НЕТ ВЛАСТИ В ЭТОЙ КОМНАТЕ");
    }
});
exports.execute = execute;

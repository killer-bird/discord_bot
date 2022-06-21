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
exports.execute = exports.renameBtn = void 0;
const discord_js_1 = require("discord.js");
const RoomModel_1 = require("../database/models/RoomModel");
const getAwaitMsgEmbed_1 = require("../utills/getAwaitMsgEmbed");
const checkPerms_1 = require("../utills/checkPerms");
const getErrEmbed_1 = require("../utills/getErrEmbed");
const setName = (room, name) => __awaiter(void 0, void 0, void 0, function* () {
    yield room.edit({ name: name });
    yield RoomModel_1.Room.updateOne({ id: room.id }, { name: name });
});
exports.renameBtn = new discord_js_1.MessageButton()
    .setCustomId('renameBtn')
    .setEmoji('988485876805931049')
    .setStyle('SECONDARY');
const execute = (interaction) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    const member = interaction.member;
    const room = yield RoomModel_1.Room.findOne({ id: member.voice.channelId });
    if ((0, checkPerms_1.checkAdmPerms)(interaction.user, room) || (0, checkPerms_1.checkModPerms)(interaction.user, room)) {
        yield interaction.reply({ embeds: [(0, getAwaitMsgEmbed_1.getAwaitMsgEmbed)("установить новое название для комнаты (Введите 0, для того чтобы вернуть название по умолчанию)")] });
        const awaitMsgTimeout = setTimeout(() => __awaiter(void 0, void 0, void 0, function* () {
            yield interaction.editReply({ embeds: [(0, getErrEmbed_1.getErrEmbed)("Вы не успели дать ответ в указанное время. Попробуйте еще раз")] });
            setTimeout(() => __awaiter(void 0, void 0, void 0, function* () {
                yield interaction.deleteReply();
            }), 3000);
        }), 15000);
        try {
            const response = yield ((_a = interaction.channel) === null || _a === void 0 ? void 0 : _a.awaitMessages({ filter: () => true, max: 1, time: 15000 }));
            if (response) {
                if (((_b = response.first()) === null || _b === void 0 ? void 0 : _b.content) === '0') {
                    yield setName(member.voice.channel, member.user.username);
                    clearTimeout(awaitMsgTimeout);
                    yield interaction.deleteReply();
                    return;
                }
                yield setName(member.voice.channel, (_c = response.first()) === null || _c === void 0 ? void 0 : _c.content);
                clearTimeout(awaitMsgTimeout);
                yield interaction.deleteReply();
            }
        }
        catch (error) {
            console.log(error);
            yield interaction.reply({ embeds: [(0, getErrEmbed_1.getErrEmbed)("Произошла ошибка. Попробуйте еще раз")] });
            setTimeout(() => __awaiter(void 0, void 0, void 0, function* () {
                yield interaction.deleteReply();
            }), 5000);
            return;
        }
    }
    else {
        yield interaction.reply({ embeds: [(0, getErrEmbed_1.getErrEmbed)("В этой комнате у вас нет таких полномочий")] });
        setTimeout(() => __awaiter(void 0, void 0, void 0, function* () {
            yield interaction.deleteReply();
        }), 5000);
    }
});
exports.execute = execute;

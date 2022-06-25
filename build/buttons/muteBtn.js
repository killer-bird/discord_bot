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
exports.execute = exports.muteBtn = void 0;
const discord_js_1 = require("discord.js");
const checkPerms_1 = require("../utills/checkPerms");
const getErrEmbed_1 = require("../utills/getErrEmbed");
const RoomModel_1 = require("../database/models/RoomModel");
const getAwaitMsgEmbed_1 = require("../utills/getAwaitMsgEmbed");
const getNotPermsErr_1 = require("../utills/getNotPermsErr");
const muteUser = (room, target) => __awaiter(void 0, void 0, void 0, function* () {
    const afk = yield target.guild.channels.fetch(process.env.AFK);
    if (room.members.has(target.user.id)) {
        yield target.voice.setChannel(afk);
        yield room.permissionOverwrites.create(target.user, { "SPEAK": false });
        yield target.voice.setChannel(room);
        return;
    }
    yield room.permissionOverwrites.create(target.user, { "SPEAK": false });
    yield RoomModel_1.Room.updateOne({ id: room.id }, { $push: { mutes: target.user.id } });
});
exports.muteBtn = new discord_js_1.MessageButton()
    .setCustomId('muteBtn')
    .setEmoji('988485884116615279')
    .setStyle('SECONDARY');
const execute = (interaction) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const member = interaction.member;
    const room = yield RoomModel_1.Room.findOne({ id: member.voice.channelId });
    if ((0, checkPerms_1.checkAdmPerms)(interaction.user, room) || (0, checkPerms_1.checkModPerms)(interaction.user, room)) {
        yield interaction.reply({ embeds: [(0, getAwaitMsgEmbed_1.getAwaitMsgEmbed)("Укажите пользователя, которого необходимо выкинуть из комнаты")] });
        const awaitMsgTimeout = setTimeout(() => __awaiter(void 0, void 0, void 0, function* () {
            yield interaction.editReply({ embeds: [(0, getErrEmbed_1.getErrEmbed)("Вы не успели дать ответ в указанное время. Попробуйте еще раз")] });
            setTimeout(() => __awaiter(void 0, void 0, void 0, function* () {
                yield interaction.deleteReply();
            }), 3000);
        }), 15000);
        const filter = (m) => {
            if (m.mentions.users.first()) {
                return true;
            }
            return false;
        };
        try {
            const response = yield ((_a = interaction.channel) === null || _a === void 0 ? void 0 : _a.awaitMessages({ filter: filter, max: 1, time: 15000 }));
            if (response) {
                const members = (_b = response.first()) === null || _b === void 0 ? void 0 : _b.mentions.members;
                const target = members.first();
                if ((0, checkPerms_1.checkAdmPerms)(target.user, room) || !(0, checkPerms_1.checkAdmPerms)(interaction.user, room) && (0, checkPerms_1.checkModPerms)(target.user, room)) {
                    yield (0, getNotPermsErr_1.getNotPermsErr)(interaction);
                    return;
                }
                yield muteUser(member.voice.channel, target);
                clearTimeout(awaitMsgTimeout);
                yield interaction.deleteReply();
            }
        }
        catch (error) {
            console.log(error);
            yield interaction.editReply({ embeds: [(0, getErrEmbed_1.getErrEmbed)("Произошла ошибка. Попробуйте еще раз")] });
            setTimeout(() => __awaiter(void 0, void 0, void 0, function* () {
                yield interaction.deleteReply();
            }), 5000);
            return;
        }
    }
    else {
        yield (0, getNotPermsErr_1.getNotPermsErr)(interaction);
    }
});
exports.execute = execute;
exports.default = {
    data: exports.muteBtn,
    execute: exports.execute
};

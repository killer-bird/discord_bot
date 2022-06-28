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
exports.execute = exports.banBtn = void 0;
const discord_js_1 = require("discord.js");
const checkPerms_1 = require("../privateRooms/checkPerms");
const embeds_1 = require("../embeds");
const RoomModel_1 = require("../database/models/RoomModel");
const embeds_2 = require("../embeds");
const getNotPermsErr_1 = require("../privateRooms/getNotPermsErr");
const config_1 = require("../privateRooms/config");
const banUser = (channel, target) => __awaiter(void 0, void 0, void 0, function* () {
    const afk = yield target.guild.channels.fetch(process.env.AFK);
    yield channel.permissionOverwrites.create(target.user, { 'CONNECT': false });
    yield RoomModel_1.Room.updateOne({ id: channel.id }, { $push: { bans: target.user.id } });
    if (channel.members.has(target.user.id)) {
        yield target.voice.setChannel(afk);
    }
});
exports.banBtn = new discord_js_1.MessageButton()
    .setCustomId('banBtn')
    .setEmoji('988485878743711774')
    .setStyle('SECONDARY');
const execute = (interaction) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const member = interaction.member;
    const room = yield RoomModel_1.Room.findOne({ id: member.voice.channelId });
    if (config_1.config[member.voice.channelId]) {
        yield interaction.reply({ embeds: [(0, embeds_1.getErrEmbed)("Закончите предыдущее действие")] });
        setTimeout(() => __awaiter(void 0, void 0, void 0, function* () {
            yield interaction.deleteReply();
        }), 3000);
        return;
    }
    if ((0, checkPerms_1.checkAdmPerms)(interaction.user, room) || (0, checkPerms_1.checkModPerms)(interaction.user, room)) {
        config_1.config[member.voice.channelId] = true;
        yield interaction.reply({ embeds: [(0, embeds_2.getAwaitMsgEmbed)("забанить пользователя в комнате линканите его ниже")] });
        try {
            const filter = (m) => {
                if (m.mentions.users.first()) {
                    return true;
                }
                return false;
            };
            const response = yield ((_a = interaction.channel) === null || _a === void 0 ? void 0 : _a.awaitMessages({ filter: filter, max: 1, time: 15000 }));
            if (response === null || response === void 0 ? void 0 : response.size) {
                const members = (_b = response.first()) === null || _b === void 0 ? void 0 : _b.mentions.members;
                const target = members.first();
                if ((0, checkPerms_1.checkAdmPerms)(target.user, room) || !(0, checkPerms_1.checkAdmPerms)(interaction.user, room) && (0, checkPerms_1.checkModPerms)(target.user, room)) {
                    config_1.config[member.voice.channelId] = false;
                    yield (0, getNotPermsErr_1.getNotPermsErr)(interaction);
                    return;
                }
                yield banUser(member.voice.channel, target);
                config_1.config[member.voice.channelId] = false;
                yield interaction.editReply({ embeds: [(0, embeds_1.getNotifyEmbed)(`Пользователь ${target} забанен. Он не больше не сможет зайти в вашу комнату`)] });
                setTimeout(() => __awaiter(void 0, void 0, void 0, function* () {
                    yield interaction.deleteReply();
                }), 3000);
            }
            else {
                yield interaction.editReply({ embeds: [(0, embeds_1.getErrEmbed)("Вы не успели дать ответ в указанное время. Попробуйте еще раз")] });
                setTimeout(() => __awaiter(void 0, void 0, void 0, function* () {
                    yield interaction.deleteReply();
                }), 3000);
                config_1.config[member.voice.channelId] = false;
            }
        }
        catch (error) {
            yield (0, getNotPermsErr_1.getNotPermsErr)(interaction);
            config_1.config[member.voice.channelId] = false;
            return;
        }
    }
    else {
        yield (0, getNotPermsErr_1.getNotPermsErr)(interaction);
        config_1.config[member.voice.channelId] = false;
    }
});
exports.execute = execute;
exports.default = {
    data: exports.banBtn,
    execute: exports.execute
};

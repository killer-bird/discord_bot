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
exports.execute = exports.lockBtn = void 0;
const discord_js_1 = require("discord.js");
const RoomModel_1 = require("../database/models/RoomModel");
const checkPerms_1 = require("../privateRooms/checkPerms");
const embeds_1 = require("../embeds");
const utills_1 = require("../utills");
exports.lockBtn = new discord_js_1.MessageButton()
    .setCustomId("lockBtn")
    .setEmoji('988485871248494662')
    .setStyle("SECONDARY");
const execute = (interaction) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const member = interaction.member;
    const room = yield RoomModel_1.Room.findOne({ id: interaction.channelId });
    if ((0, checkPerms_1.checkAdmPerms)(interaction.user, room) || (0, checkPerms_1.checkModPerms)(interaction.user, room)) {
        (_a = member.voice.channel) === null || _a === void 0 ? void 0 : _a.permissionOverwrites.create(member.voice.channel.guild.roles.everyone, { "CONNECT": false });
        (_b = member.voice.channel) === null || _b === void 0 ? void 0 : _b.permissionOverwrites.create(member.user, { "CONNECT": true });
        yield interaction.reply({ embeds: [(0, embeds_1.getNotifyEmbed)("Вы закрыли комнату. Никто не сможет к вам зайти")] });
        yield (0, utills_1.memberSendToAudit)(member, `закрыл`, interaction.channelId);
        setTimeout(() => __awaiter(void 0, void 0, void 0, function* () {
            yield interaction.deleteReply();
        }), 5000);
    }
    else {
        yield interaction.reply({ embeds: [(0, embeds_1.getErrEmbed)("В этой комнате у вас не полномочий")] });
        setTimeout(() => __awaiter(void 0, void 0, void 0, function* () {
            yield interaction.deleteReply();
        }), 5000);
    }
});
exports.execute = execute;
exports.default = {
    data: exports.lockBtn,
    execute: exports.execute
};

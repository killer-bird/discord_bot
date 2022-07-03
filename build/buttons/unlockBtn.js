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
exports.execute = exports.unlockBtn = void 0;
const discord_js_1 = require("discord.js");
const RoomModel_1 = require("../database/models/RoomModel");
const checkPerms_1 = require("../privateRooms/checkPerms");
const privateRooms_1 = require("../privateRooms/");
const utills_1 = require("../utills");
const embeds_1 = require("../embeds");
exports.unlockBtn = new discord_js_1.MessageButton()
    .setCustomId("unlockBtn")
    .setEmoji('988485873270128643')
    .setStyle("SECONDARY");
const execute = (interaction) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const member = interaction.member;
    const room = yield RoomModel_1.Room.findOne({ id: interaction.channelId });
    if ((0, checkPerms_1.checkAdmPerms)(interaction.user, room) || (0, checkPerms_1.checkModPerms)(interaction.user, room)) {
        (_a = member.voice.channel) === null || _a === void 0 ? void 0 : _a.permissionOverwrites.create(member.voice.channel.guild.roles.everyone, { "CONNECT": true });
        yield interaction.reply({ embeds: [(0, embeds_1.getNotifyEmbed)("Комната открыта. Теперь любой может к вам зайти")] });
        yield (0, utills_1.memberSendToAudit)(member, `открыл комнату`, interaction.channelId);
        setTimeout(() => __awaiter(void 0, void 0, void 0, function* () {
            yield interaction.deleteReply();
        }), 5000);
    }
    else {
        yield (0, privateRooms_1.getNotPermsErr)(interaction);
    }
});
exports.execute = execute;
exports.default = {
    data: exports.unlockBtn,
    execute: exports.execute
};

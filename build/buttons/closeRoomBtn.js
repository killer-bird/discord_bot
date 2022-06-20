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
exports.lockBtn = new discord_js_1.MessageButton()
    .setCustomId("closeRoomBtn")
    .setLabel(":lock:")
    .setStyle("SECONDARY");
const execute = (interaction) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const member = interaction.member;
    const room = yield RoomModel_1.Room.findOne({ id: member.voice.channelId });
    if ((room === null || room === void 0 ? void 0 : room.owner) === interaction.user.id) {
        (_a = member.voice.channel) === null || _a === void 0 ? void 0 : _a.permissionOverwrites((_b = interaction.guild) === null || _b === void 0 ? void 0 : _b.roles.everyone, {
            'CONNECT': false
        });
    }
});
exports.execute = execute;

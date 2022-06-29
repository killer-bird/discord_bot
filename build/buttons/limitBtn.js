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
const embeds_1 = require("../embeds");
const checkPerms_1 = require("../privateRooms/checkPerms");
const limitModal_1 = require("../modals/limitModal");
const setLimit = (room, limit) => __awaiter(void 0, void 0, void 0, function* () {
    if (limit === 0) {
        yield room.edit({ userLimit: 0 });
        return;
    }
    yield room.edit({ userLimit: limit });
});
exports.limitBtn = new discord_js_1.MessageButton()
    .setCustomId('limitBtn')
    .setEmoji('988485874985619507')
    .setStyle('SECONDARY');
exports.data = new discord_js_1.MessageActionRow()
    .addComponents(exports.limitBtn);
const execute = (interaction) => __awaiter(void 0, void 0, void 0, function* () {
    const member = interaction.member;
    const room = yield RoomModel_1.Room.findOne({ id: interaction.channelId });
    if ((0, checkPerms_1.checkAdmPerms)(interaction.user, room) || (0, checkPerms_1.checkModPerms)(interaction.user, room)) {
        interaction.showModal(limitModal_1.limitModal);
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
    data: exports.limitBtn,
    execute: exports.execute
};

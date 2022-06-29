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
const checkPerms_1 = require("../privateRooms/checkPerms");
const embeds_1 = require("../embeds");
const setName = (room, name) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(name);
    yield room.edit({ name: name });
    yield RoomModel_1.Room.updateOne({ id: room.id }, { name: name });
});
exports.renameBtn = new discord_js_1.MessageButton()
    .setCustomId('renameBtn')
    .setEmoji('988485876805931049')
    .setStyle('SECONDARY');
const execute = (interaction) => __awaiter(void 0, void 0, void 0, function* () {
    const member = interaction.member;
    const room = yield RoomModel_1.Room.findOne({ id: interaction.channelId });
    if ((0, checkPerms_1.checkAdmPerms)(interaction.user, room) || (0, checkPerms_1.checkModPerms)(interaction.user, room)) {
        const renameModal = new discord_js_1.Modal()
            .setCustomId('renameBtn')
            .setTitle('Переименовать комнату');
        const inputName = new discord_js_1.TextInputComponent()
            .setCustomId('renameBtnInput')
            .setLabel('Введите новое название для комнаты')
            .setStyle('SHORT');
        const row = new discord_js_1.MessageActionRow({
            components: [inputName]
        });
        renameModal.addComponents(row);
        interaction.showModal(renameModal);
    }
    else {
        yield interaction.reply({ embeds: [(0, embeds_1.getErrEmbed)("В этой комнате у вас нет таких полномочий")] });
        setTimeout(() => __awaiter(void 0, void 0, void 0, function* () {
            yield interaction.deleteReply();
        }), 5000);
    }
});
exports.execute = execute;
exports.default = {
    data: exports.renameBtn,
    execute: exports.execute
};

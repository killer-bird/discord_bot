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
const privateRooms_1 = require("../privateRooms");
const RoomModel_1 = require("../database/models/RoomModel");
const embeds_1 = require("../embeds");
exports.muteBtn = new discord_js_1.MessageButton()
    .setCustomId('muteBtn')
    .setEmoji('988485884116615279')
    .setStyle('SECONDARY');
const execute = (interaction) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const member = interaction.member;
    const room = yield RoomModel_1.Room.findOne({ id: member.voice.channelId });
    if (privateRooms_1.config[member.voice.channelId]) {
        yield interaction.reply({ embeds: [(0, embeds_1.getErrEmbed)("Закончите предыдущее действие")] });
        setTimeout(() => __awaiter(void 0, void 0, void 0, function* () {
            yield interaction.deleteReply();
        }), 3000);
        return;
    }
    if ((0, privateRooms_1.checkAdmPerms)(interaction.user, room) || (0, privateRooms_1.checkModPerms)(interaction.user, room)) {
        privateRooms_1.config[member.voice.channelId] = true;
        yield interaction.reply({ embeds: [(0, embeds_1.getAwaitMsgEmbed)("Укажите пользователя, которому необходимо выключить микрофон")] });
        const filter = (m) => {
            if (m.mentions.users.first()) {
                return true;
            }
            return false;
        };
        try {
            const response = yield ((_a = interaction.channel) === null || _a === void 0 ? void 0 : _a.awaitMessages({ filter: filter, max: 1, time: 15000 }));
            if (response === null || response === void 0 ? void 0 : response.size) {
                const members = (_b = response.first()) === null || _b === void 0 ? void 0 : _b.mentions.members;
                const target = members.first();
                if ((0, privateRooms_1.checkAdmPerms)(target.user, room) || !(0, privateRooms_1.checkAdmPerms)(interaction.user, room) && (0, privateRooms_1.checkModPerms)(target.user, room)) {
                    yield (0, privateRooms_1.getNotPermsErr)(interaction);
                    return;
                }
                yield (0, privateRooms_1.muteUser)(member.voice.channel, target);
                yield interaction.editReply({ embeds: [(0, embeds_1.getNotifyEmbed)(`Пользователь ${target} замьючен. Он не больше не сможет разговаривать в вашей комнате`)] });
                setTimeout(() => __awaiter(void 0, void 0, void 0, function* () {
                    yield interaction.deleteReply();
                }), 3000);
                privateRooms_1.config[member.voice.channelId] = false;
            }
            else {
                yield interaction.editReply({ embeds: [(0, embeds_1.getErrEmbed)("Вы не успели дать ответ в указанное время. Попробуйте еще раз")] });
                setTimeout(() => __awaiter(void 0, void 0, void 0, function* () {
                    yield interaction.deleteReply();
                }), 3000);
                privateRooms_1.config[member.voice.channelId] = false;
            }
        }
        catch (error) {
            yield interaction.editReply({ embeds: [(0, embeds_1.getErrEmbed)("Произошла ошибка. Попробуйте еще раз")] });
            setTimeout(() => __awaiter(void 0, void 0, void 0, function* () {
                yield interaction.deleteReply();
            }), 5000);
            privateRooms_1.config[member.voice.channelId] = false;
            return;
        }
    }
    else {
        yield (0, privateRooms_1.getNotPermsErr)(interaction);
    }
});
exports.execute = execute;
exports.default = {
    data: exports.muteBtn,
    execute: exports.execute
};

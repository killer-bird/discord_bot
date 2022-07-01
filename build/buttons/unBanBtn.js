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
exports.execute = exports.unbanBtn = void 0;
const discord_js_1 = require("discord.js");
const privateRooms_1 = require("../privateRooms");
const embeds_1 = require("../embeds");
const RoomModel_1 = require("../database/models/RoomModel");
exports.unbanBtn = new discord_js_1.MessageButton()
    .setCustomId("unbanBtn")
    .setEmoji('988485880337551401')
    .setStyle('SECONDARY');
const execute = (interaction) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const member = interaction.member;
    if (privateRooms_1.config[interaction.channelId]) {
        yield interaction.reply({ embeds: [(0, embeds_1.getErrEmbed)("Закончите предыдущее действие")] });
        setTimeout(() => __awaiter(void 0, void 0, void 0, function* () {
            yield interaction.deleteReply();
        }), 3000);
        return;
    }
    const room = yield RoomModel_1.Room.findOne({ id: interaction.channelId });
    if ((0, privateRooms_1.checkAdmPerms)(interaction.user, room) || (0, privateRooms_1.checkModPerms)(interaction.user, room)) {
        privateRooms_1.config[interaction.channelId] = true;
        yield interaction.reply({ embeds: [(0, embeds_1.getAwaitMsgEmbed)("разбанить пользователя в комнате линканите его ниже")] });
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
                if ((0, privateRooms_1.checkAdmPerms)(target.user, room) || !(0, privateRooms_1.checkAdmPerms)(interaction.user, room) && (0, privateRooms_1.checkModPerms)(target.user, room)) {
                    yield (0, privateRooms_1.getNotPermsErr)(interaction);
                    return;
                }
                yield (0, privateRooms_1.unBanUser)(interaction.channel, target);
                yield interaction.editReply({ embeds: [(0, embeds_1.getNotifyEmbed)(`Пользователь ${target} получил доступ в комнату. Теперь он сможет зайти в вашу комнату`)] });
                privateRooms_1.config[interaction.channelId] = false;
                setTimeout(() => __awaiter(void 0, void 0, void 0, function* () {
                    var _c;
                    try {
                        yield interaction.deleteReply();
                        yield ((_c = response.first()) === null || _c === void 0 ? void 0 : _c.delete());
                    }
                    catch (error) {
                        return;
                    }
                }), 5000);
            }
            else {
                privateRooms_1.config[interaction.channelId] = false;
                yield interaction.editReply({ embeds: [(0, embeds_1.getErrEmbed)("Вы не успели дать ответ в указанное время. Попробуйте еще раз")] });
                setTimeout(() => __awaiter(void 0, void 0, void 0, function* () {
                    yield interaction.deleteReply();
                }), 3000);
            }
        }
        catch (error) {
            privateRooms_1.config[interaction.channelId] = false;
            yield (0, privateRooms_1.getNotPermsErr)(interaction);
            return;
        }
    }
    else {
        yield (0, privateRooms_1.getNotPermsErr)(interaction);
    }
});
exports.execute = execute;
exports.default = {
    data: exports.unbanBtn,
    execute: exports.execute
};

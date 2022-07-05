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
const utills_1 = require("../utills");
exports.muteBtn = new discord_js_1.MessageButton()
    .setCustomId('muteBtn')
    .setEmoji('988485884116615279')
    .setStyle('SECONDARY');
const execute = (interaction) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const member = interaction.member;
    const room = yield RoomModel_1.Room.findOne({ id: interaction.channelId });
    if (privateRooms_1.config[interaction.channelId].btnDelay) {
        yield interaction.reply({ embeds: [(0, embeds_1.getErrEmbed)("Закончите предыдущее действие")] });
        setTimeout(() => __awaiter(void 0, void 0, void 0, function* () {
            yield interaction.deleteReply();
        }), 3000);
        return;
    }
    if ((0, privateRooms_1.checkAdmPerms)(interaction.user, room) || (0, privateRooms_1.checkModPerms)(interaction.user, room)) {
        privateRooms_1.config[interaction.channelId].btnDelay = true;
        yield interaction.reply({ embeds: [(0, embeds_1.getAwaitMsgEmbed)("Укажите пользователя, которому необходимо выключить микрофон")] });
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
                yield (0, privateRooms_1.muteUser)(interaction.channel, target);
                yield interaction.editReply({ embeds: [(0, embeds_1.getNotifyEmbed)(`Пользователь ${target} получил мут. Он не больше не сможет разговаривать в вашей комнате`)] });
                privateRooms_1.config[interaction.channelId].btnDelay = false;
                yield (0, utills_1.memberSendToAudit)(member, `замутил ${target}`, interaction.channelId);
                setTimeout(() => __awaiter(void 0, void 0, void 0, function* () {
                    var _c;
                    try {
                        yield interaction.deleteReply();
                        yield ((_c = response.first()) === null || _c === void 0 ? void 0 : _c.delete());
                    }
                    catch (error) {
                        return;
                    }
                }), 3000);
            }
            else {
                yield interaction.editReply({ embeds: [(0, embeds_1.getErrEmbed)("Вы не успели дать ответ в указанное время. Попробуйте еще раз")] });
                privateRooms_1.config[interaction.channelId].btnDelay = false;
                setTimeout(() => __awaiter(void 0, void 0, void 0, function* () {
                    yield interaction.deleteReply();
                }), 3000);
            }
        }
        catch (error) {
            yield interaction.editReply({ embeds: [(0, embeds_1.getErrEmbed)("Произошла ошибка. Попробуйте еще раз")] });
            setTimeout(() => __awaiter(void 0, void 0, void 0, function* () {
                yield interaction.deleteReply();
            }), 5000);
            privateRooms_1.config[interaction.channelId].btnDelay = false;
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

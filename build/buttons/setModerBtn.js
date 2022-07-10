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
exports.execute = exports.setModerBtn = void 0;
const discord_js_1 = require("discord.js");
const RoomModel_1 = require("../database/models/RoomModel");
const embeds_1 = require("../embeds");
const checkPerms_1 = require("../privateRooms/checkPerms");
const embeds_2 = require("../embeds");
const getNotPermsErr_1 = require("../privateRooms/getNotPermsErr");
const utills_1 = require("../utills");
const setModer = (room, target) => __awaiter(void 0, void 0, void 0, function* () {
    yield RoomModel_1.Room.updateOne({ id: room.id }, { $push: { moderators: target.user.id } });
});
exports.setModerBtn = new discord_js_1.MessageButton()
    .setCustomId('setModerBtn')
    .setEmoji('988485887165878283')
    .setStyle('SECONDARY');
const execute = (interaction) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const member = interaction.member;
    const room = yield RoomModel_1.Room.findOne({ id: interaction.channelId });
    // if(config[interaction.channelId as string].btnDelay) {
    //     await interaction.reply({embeds: [getErrEmbed("Закончите предыдущее действие")]})
    //     setTimeout( async () => {
    //         await interaction.deleteReply()
    //     }, 3000);
    //     return
    // }
    if ((0, checkPerms_1.checkAdmPerms)(interaction.user, room)) {
        // config[interaction.channelId as string].btnDelay = true
        yield interaction.reply({ embeds: [(0, embeds_2.getAwaitMsgEmbed)("назначить пользователя модератором в комнате линканите его ниже")] });
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
            if ((0, checkPerms_1.checkModPerms)(target.user, room)) {
                yield interaction.editReply({ embeds: [(0, embeds_1.getErrEmbed)(`Пользователь ${target} уже модератор!`)] });
                setTimeout(() => __awaiter(void 0, void 0, void 0, function* () {
                    yield interaction.deleteReply();
                    // config[interaction.channelId as string].btnDelay = false
                }), 3000);
                return;
            }
            yield setModer(interaction.channel, target);
            yield interaction.editReply({ embeds: [(0, embeds_1.getNotifyEmbed)(`Вы назначили ${target} модератором комнаты.`)] });
            // config[interaction.channelId as string].btnDelay = false
            yield (0, utills_1.memberSendToAudit)(member, `сделал модером ${target}`, interaction.channelId);
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
            setTimeout(() => __awaiter(void 0, void 0, void 0, function* () {
                yield interaction.deleteReply();
                // config[interaction.channelId as string].btnDelay = false
            }), 3000);
            // config[interaction.channelId as string].btnDelay = false
        }
    }
    else {
        yield (0, getNotPermsErr_1.getNotPermsErr)(interaction);
        // config[member.voice.channelId as string].btnDelay = false
    }
});
exports.execute = execute;
exports.default = {
    data: exports.setModerBtn,
    execute: exports.execute
};

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
exports.execute = exports.kickBtn = void 0;
const discord_js_1 = require("discord.js");
const RoomModel_1 = require("../database/models/RoomModel");
const embeds_1 = require("../embeds");
const checkPerms_1 = require("../privateRooms/checkPerms");
const embeds_2 = require("../embeds");
const getNotPermsErr_1 = require("../privateRooms/getNotPermsErr");
const privateRoom_utills_1 = require("../privateRooms/privateRoom.utills");
const utills_1 = require("../utills");
exports.kickBtn = new discord_js_1.MessageButton()
    .setCustomId('kickBtn')
    .setEmoji('988485882216607786')
    .setStyle('SECONDARY');
const execute = (interaction) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const member = interaction.member;
    const voice = member.voice.channel;
    const room = yield RoomModel_1.Room.findOne({ id: interaction.channelId });
    // if(config[interaction.channelId as string].btnDelay) {
    //     await interaction.reply({embeds: [getErrEmbed("Закончите предыдущее действие")]})
    //     setTimeout( async () => {
    //         await interaction.deleteReply()
    //     }, 3000);
    //     return
    // }
    if ((0, checkPerms_1.checkAdmPerms)(interaction.user, room) || (0, checkPerms_1.checkModPerms)(interaction.user, room)) {
        yield interaction.reply({ embeds: [(0, embeds_1.getAwaitMsgEmbed)("Укажите пользователя, которого необходимо замутить")] });
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
                if ((0, checkPerms_1.checkAdmPerms)(target.user, room) || !(0, checkPerms_1.checkAdmPerms)(interaction.user, room) && (0, checkPerms_1.checkModPerms)(target.user, room)) {
                    yield (0, getNotPermsErr_1.getNotPermsErr)(interaction);
                    return;
                }
                if (voice.members.find((member) => member.id === target.id)) {
                    yield (0, privateRoom_utills_1.kickUser)(target);
                    yield interaction.editReply({ embeds: [(0, embeds_2.getNotifyEmbed)(`Вы кикнули ${target} из комнаты`)] });
                    yield (0, utills_1.memberSendToAudit)(member, `выгнал ${target}`, interaction.channelId);
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
                    yield interaction.editReply({ embeds: [(0, embeds_2.getErrEmbed)(`Сейчас ${target} не находится в комнате!`)] });
                    setTimeout(() => __awaiter(void 0, void 0, void 0, function* () {
                        yield interaction.deleteReply();
                    }), 3000);
                }
            }
            else {
                yield interaction.editReply({ embeds: [(0, embeds_2.getErrEmbed)("Вы не успели дать ответ в указанное время. Попробуйте еще раз")] });
                setTimeout(() => __awaiter(void 0, void 0, void 0, function* () {
                    yield interaction.deleteReply();
                }), 3000);
            }
        }
        catch (error) {
            console.log(error);
            yield interaction.editReply({ embeds: [(0, embeds_2.getErrEmbed)("Произошла ошибка. Попробуйте еще раз")] });
            setTimeout(() => __awaiter(void 0, void 0, void 0, function* () {
                yield interaction.deleteReply();
            }), 5000);
            return;
        }
    }
    else {
        yield (0, getNotPermsErr_1.getNotPermsErr)(interaction);
    }
});
exports.execute = execute;
exports.default = {
    data: exports.kickBtn,
    execute: exports.execute
};

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
exports.execute = exports.banBtn = void 0;
const discord_js_1 = require("discord.js");
const RoomModel_1 = require("../database/models/RoomModel");
const getAwaitMsgEmbed_1 = require("../utills/getAwaitMsgEmbed");
const getNotHaveTimeEmbed_1 = require("../utills/getNotHaveTimeEmbed");
const getBanEmbed = (user) => {
    const banEmbed = new discord_js_1.MessageEmbed();
    banEmbed.setTitle("Пользователь забанен")
        .setDescription(`Пользователь ${user} забанен. Он не больше не сможет зайти в вашу комнату`);
    return banEmbed;
};
const banUser = (channel, user) => __awaiter(void 0, void 0, void 0, function* () {
    yield channel.permissionOverwrites.create(user, { 'CONNECT': false });
});
exports.banBtn = new discord_js_1.MessageButton()
    .setCustomId('banBtn')
    .setEmoji('988485878743711774')
    .setStyle('SECONDARY');
const execute = (interaction) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    const member = interaction.member;
    const room = yield RoomModel_1.Room.findOne({ id: member.voice.channelId });
    if ((room === null || room === void 0 ? void 0 : room.owner) === interaction.user.id) {
        yield interaction.reply({ embeds: [(0, getAwaitMsgEmbed_1.getAwaitMsgEmbed)("забанить пользователя в комнате линканите его ниже")] });
        const awaitMsgTimeout = setTimeout(() => __awaiter(void 0, void 0, void 0, function* () {
            yield interaction.editReply({ embeds: [(0, getNotHaveTimeEmbed_1.getNotHaveTimeEmbed)()] });
            setTimeout(() => __awaiter(void 0, void 0, void 0, function* () {
                yield interaction.deleteReply();
            }), 3000);
        }), 15000);
        try {
            const response = yield ((_a = interaction.channel) === null || _a === void 0 ? void 0 : _a.awaitMessages({ filter: () => true, max: 1, time: 15000 }));
            if (response) {
                yield banUser(member.voice.channel, (_b = response.first()) === null || _b === void 0 ? void 0 : _b.mentions.users.first());
                yield interaction.editReply({ embeds: [getBanEmbed((_c = response.first()) === null || _c === void 0 ? void 0 : _c.mentions.users.first())] });
                clearTimeout(awaitMsgTimeout);
                setTimeout(() => __awaiter(void 0, void 0, void 0, function* () {
                    yield interaction.deleteReply();
                }), 5000);
            }
        }
        catch (error) {
            console.log(error);
            return;
        }
    }
});
exports.execute = execute;

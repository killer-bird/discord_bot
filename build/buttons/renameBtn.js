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
const checkPerms_1 = require("../utills/checkPerms");
const getErrEmbed_1 = require("../utills/getErrEmbed");
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
    const room = yield RoomModel_1.Room.findOne({ id: member.voice.channelId });
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
        // const renameModal = getModal({
        //     id: 'renameBtn',
        //     title: 'Переименовать комнату',
        //     inputId: 'renameBtnInput',
        //     label: 'Введите новое имя, чтобы сбросить введите 0',
        //     placeholder: member.voice.channel?.name    
        // })
        // showModal(renameModal, {
        //     interaction, client
        // })
        // await interaction.reply({embeds:[getAwaitMsgEmbed("установить новое название для комнаты (Введите 0, для того чтобы вернуть название по умолчанию)")]})       
        // const awaitMsgTimeout = setTimeout(async() => {
        //     await interaction.editReply({embeds:[getErrEmbed("Вы не успели дать ответ в указанное время. Попробуйте еще раз")]})
        //     try {
        //         setTimeout(async() => {
        //             await interaction.deleteReply() 
        //         }, 3000);
        //     } catch (error) {
        //         console.log(error)
        //         return
        //     }
        // }, 15000);
        // try {
        //     const filter = (m: Message) => {
        //         console.log(m.author.id, member.user.id, m.author.id === member.user.id)
        //         return m.author.id === member.user.id
        //     }
        //     const response = await interaction.channel?.awaitMessages({filter, max: 1, time: 15000})
        //     if (response) {
        //         if( response.first()?.content === '0' ) {
        //             await setName(member.voice.channel as VoiceChannel, member.user.username as RoomName )
        //             clearTimeout(awaitMsgTimeout)
        //             await interaction.deleteReply()
        //             return
        //         }
        //         await setName(member.voice.channel as VoiceChannel, response.first()?.content as RoomName )
        //         clearTimeout(awaitMsgTimeout)
        //         await interaction.deleteReply()
        //     }
        // } catch (error) {
        //     console.log(error)
        //     await interaction.reply({embeds: [getErrEmbed("Произошла ошибка. Попробуйте еще раз")]})
        //     setTimeout( async () => {
        //         await interaction.deleteReply()
        //     }, 5000);
        //     return
        // }
    }
    else {
        yield interaction.reply({ embeds: [(0, getErrEmbed_1.getErrEmbed)("В этой комнате у вас нет таких полномочий")] });
        setTimeout(() => __awaiter(void 0, void 0, void 0, function* () {
            yield interaction.deleteReply();
        }), 5000);
    }
});
exports.execute = execute;

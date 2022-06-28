import {MessageButton, 
        Modal, 
        ButtonInteraction, 
        GuildMember, 
        VoiceChannel, 
        TextInputComponent,
        MessageActionRow
        } from "discord.js"
import { Room } from "../database/models/RoomModel"
import { IRoom, IButton } from "../interfaces/"
import { RoomName } from "../types/RoomName"
import { checkAdmPerms, checkModPerms } from "../privateRooms/checkPerms"
import { getErrEmbed } from "../embeds"


const setName = async (room: VoiceChannel, name: RoomName) :Promise<void> => {
    console.log(name)
    await room.edit({name: name})
    await Room.updateOne({id: room.id}, {name: name})
}

export const renameBtn = new MessageButton()
    .setCustomId('renameBtn')
    .setEmoji('988485876805931049')
    .setStyle('SECONDARY')


export const execute = async (interaction: ButtonInteraction): Promise<void> => {   
    const member = interaction.member as GuildMember
    const room = await Room.findOne({id: member.voice.channelId}) as IRoom
    
    if( checkAdmPerms(interaction.user, room) || checkModPerms(interaction.user, room) ) {
        const renameModal = new Modal()
        .setCustomId('renameBtn')
        .setTitle('Переименовать комнату')
        const inputName = new TextInputComponent() 
        .setCustomId('renameBtnInput')
        .setLabel('Введите новое название для комнаты')
        .setStyle('SHORT')
        const row = new MessageActionRow({
            components: [inputName]
        })
        renameModal.addComponents(row)
        interaction.showModal(renameModal)
        
        
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
    } else {
        await interaction.reply({embeds: [getErrEmbed("В этой комнате у вас нет таких полномочий")]})
        setTimeout( async () => {
            await interaction.deleteReply()
        }, 5000);
    }
}


export default {
    data: renameBtn,
    execute
} as IButton
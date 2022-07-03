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
    const room = await Room.findOne({id: interaction.channelId}) as IRoom
    
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
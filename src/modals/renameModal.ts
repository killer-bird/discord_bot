import { Modal, TextInputComponent, ModalSubmitInteraction, GuildMember, MessageActionRow, VoiceChannel } from "discord.js"
import { Room } from "../database/models/RoomModel"
import { IModal } from "../interfaces"
import { RoomName } from "../types/RoomName"
import { getNotifyEmbed } from "../embeds"

const setName = async (room: VoiceChannel, name: RoomName) :Promise<void> => {
    await room.edit({name: name})
}

export const renameModal = new Modal()
    .setCustomId('renameBtn')
    .setTitle('Переименовать комнату')
    const inputName = new TextInputComponent() 
    .setCustomId('renameBtnInput')
    .setLabel('Введите новое название для комнаты, для сброса названия введите **0**')
    .setStyle('SHORT')
    const row = new MessageActionRow({
        components: [inputName]
    })
    renameModal.addComponents(row)



export const execute = async (interaction:ModalSubmitInteraction) => {
    const member = interaction.member as GuildMember
    const room = interaction.channel as VoiceChannel
    const oldName = room.name as RoomName 
    let name = interaction.fields.getTextInputValue('renameBtnInput')
    
    if( name === '0') {
        name = member.user.username 
    }
    await setName(member.voice.channel as VoiceChannel, name as RoomName)
    await interaction.reply({embeds: [getNotifyEmbed(`Вы сменили название комнаты с ${oldName} на ${name}`)]})
    setTimeout(async() => {
        await interaction.deleteReply()
    }, 3000);
}


export default {
    data: renameModal,
    execute
} as IModal
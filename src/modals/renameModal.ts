import { Modal, TextInputComponent, GuildMember, MessageActionRow, VoiceChannel } from "discord.js"
import { Room } from "../database/models/RoomModel"
import { IRoom } from "../interfaces/IRoom"
import { RoomName } from "../types/RoomName"


const setName = async (room: VoiceChannel, name: RoomName) :Promise<void> => {
    console.log(name)
    await room.edit({name: name})
    await Room.updateOne({id: room.id}, {name: name})
}

export const renameModal = new Modal()
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


export const execute = async (interaction:any,) => {
    const { customId } = interaction
    const member = interaction.member as GuildMember
    const room = await Room.findOne({id: member.voice.channelId}) as IRoom 
    const value = interaction.fields.getTextInputValue(customId + 'Input')
    if( value === '0') {
        return await setName(member.voice.channel as VoiceChannel, member.user.username as RoomName)     
    }
    await setName(member.voice.channel as VoiceChannel, value as RoomName)
}
 
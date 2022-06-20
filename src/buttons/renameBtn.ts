import { MessageButton, MessageActionRow, CommandInteraction, GuildMember, VoiceChannel, Message } from "discord.js"
import { Room } from "../database/models/RoomModel"
import { IRoom } from "../interfaces/IRoom"
import { RoomName } from "../types/RoomName"
import { getAwaitMsgEmbed } from "../utills/getAwaitMsgEmbed"
import { getNotHaveTimeEmbed } from "../utills/getNotHaveTimeEmbed"
import { privateRoomConfig } from "../config"
import { userResponseHandler } from "../utills/interactionUserResponseHandler"

const setName = async (room: VoiceChannel, name: RoomName) :Promise<void> => {
    await room.edit({name: name})
    await Room.updateOne({id: room.id}, {name: name})
}

export const renameBtn = new MessageButton()
    .setCustomId('renameBtn')
    .setEmoji('988485876805931049')
    .setStyle('SECONDARY')


export const execute = async (interaction: CommandInteraction): Promise<void> => {   
    const member = interaction.member as GuildMember
    const room = await Room.findOne({id: member.voice.channelId}) as IRoom
    
    if( room?.owner === interaction.user.id ) {

        await interaction.reply({embeds:[getAwaitMsgEmbed("установить новое название для комнаты")]})
        
        const awaitMsgTimeout = setTimeout(async() => {
            await interaction.editReply({embeds:[getNotHaveTimeEmbed()]})
            setTimeout(async() => {
                await interaction.deleteReply() 
            }, 3000);
        }, 15000);
        

        try {
            const response = await interaction.channel?.awaitMessages({filter: () => true, max: 1, time: 15000})
            if (response) {
                await setName(privateRoomConfig.voiceChannel as VoiceChannel, response.first()?.content as RoomName )
                clearTimeout(awaitMsgTimeout)
                await interaction.deleteReply()
            }
        } catch (error) {
            console.log(error)
            return
        }
    } else {
        console.log("НЕТ ВЛАСТИ В ЭТОЙ КОМНАТЕ")
    }
}
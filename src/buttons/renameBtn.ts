import { MessageButton, MessageActionRow, CommandInteraction, GuildMember, VoiceChannel, Message } from "discord.js"
import { Room } from "../database/models/RoomModel"
import { IRoom } from "../interfaces/IRoom"
import { RoomName } from "../types/RoomName"
import { getAwaitMsgEmbed } from "../utills/getAwaitMsgEmbed"
import { checkAdmPerms, checkModPerms } from "../utills/checkPerms"
import { getErrEmbed } from "../utills/getErrEmbed"



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

    if( checkAdmPerms(interaction.user, room) || checkModPerms(interaction.user, room) ) {

        await interaction.reply({embeds:[getAwaitMsgEmbed("установить новое название для комнаты (Введите 0, для того чтобы вернуть название по умолчанию)")]})
        
        const awaitMsgTimeout = setTimeout(async() => {
            await interaction.editReply({embeds:[getErrEmbed("Вы не успели дать ответ в указанное время. Попробуйте еще раз")]})
            setTimeout(async() => {
                await interaction.deleteReply() 
            }, 3000);
        }, 15000);
        

        try {
            const response = await interaction.channel?.awaitMessages({filter: () => true, max: 1, time: 15000})
            if (response) {
                if( response.first()?.content === '0' ) {
                    await setName(member.voice.channel as VoiceChannel, member.user.username as RoomName )
                    clearTimeout(awaitMsgTimeout)
                    await interaction.deleteReply()
                    return
                }
                await setName(member.voice.channel as VoiceChannel, response.first()?.content as RoomName )
                clearTimeout(awaitMsgTimeout)
                await interaction.deleteReply()
            }
        } catch (error) {
            console.log(error)
            await interaction.reply({embeds: [getErrEmbed("Произошла ошибка. Попробуйте еще раз")]})
            setTimeout( async () => {
                await interaction.deleteReply()
            }, 5000);
            return
        }
    } else {
        await interaction.reply({embeds: [getErrEmbed("В этой комнате у вас нет таких полномочий")]})
        setTimeout( async () => {
            await interaction.deleteReply()
        }, 5000);
    }
}
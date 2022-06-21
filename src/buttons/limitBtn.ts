import { MessageButton, MessageActionRow, CommandInteraction, GuildMember, VoiceChannel, Message } from "discord.js"
import { Room } from "../database/models/RoomModel"
import { IRoom } from "../interfaces/IRoom"
import { UserLimit } from "../types/UserLimit"
import { getAwaitMsgEmbed } from "../utills/getAwaitMsgEmbed"
import { getNotHaveTimeEmbed } from "../utills/getNotHaveTimeEmbed"
import { getErrEmbed } from "../utills/getErrEmbed"
import { checkAdmPerms, checkModPerms } from "../utills/checkPerms"



const setLimit = async (room : VoiceChannel, limit: UserLimit) => {
    console.log(limit)
    if(limit === 0) {
        await room.edit({userLimit: 0})
        await Room.updateOne({id: room.id}, {limit: undefined})
        return
    }
    await room.edit({userLimit: limit})
    await Room.updateOne({id: room.id}, {limit})
}


export const limitBtn = new MessageButton()
    .setCustomId('limitBtn')
    .setEmoji('988485874985619507')
    .setStyle('SECONDARY')


export const data = new MessageActionRow()
    .addComponents(limitBtn)


export const execute = async (interaction: CommandInteraction) => {
    const member = interaction.member as GuildMember
    const room = await Room.findOne({id: member.voice.channelId}) as IRoom
    if( checkAdmPerms(interaction.user, room) || checkModPerms(interaction.user, room) ) {
        await interaction.reply({embeds:[getAwaitMsgEmbed("установить лимит пользователей для комнаты (если вы хотите сделать комнату безлимитной то введите **0**)")]})
        const awaitMsgTimeout = setTimeout(async() => {
            await interaction.editReply({embeds:[getNotHaveTimeEmbed()]})
            setTimeout(async() => {
                await interaction.deleteReply() 
            }, 3000);
        }, 15000);
        
        const filter = (m : Message) => {
            return true;
        }
        try {
            const response = await interaction.channel?.awaitMessages({filter, max: 1, time: 15000})
            if (response) {
                if(!isNaN(Number(response.first()?.content))) {
                    console.log(response.first()?.content)
                    await setLimit(member.voice.channel as VoiceChannel, Number(response.first()?.content) as UserLimit )
                    clearTimeout(awaitMsgTimeout)
                    await interaction.deleteReply()
                    return
                }  
                await interaction.reply({embeds: [getErrEmbed("Введите корректный лимит")]})
                setTimeout( async () => {
                    await interaction.deleteReply()
                }, 5000);
                
            } 
        } catch (error) {
            await interaction.reply({embeds: [getErrEmbed("Произошла ошибка. Попробуйте еще раз")]})
            setTimeout( async () => {
                await interaction.deleteReply()
            }, 5000);
            return
            
        }
    } else {
        await interaction.reply({embeds: [getErrEmbed("В этой комнате у вас не полномочий")]})
        setTimeout( async () => {
            await interaction.deleteReply()
        }, 5000);
    }
}
import { MessageButton, 
    ButtonInteraction, 
    GuildMember, VoiceChannel, User, Message, Collection, Snowflake } from "discord.js"
import { Room } from "../database/models/RoomModel"
import { IRoom, IButton } from "../interfaces"
import { getAwaitMsgEmbed } from "../embeds"
import { checkAdmPerms, checkModPerms } from "../privateRooms/checkPerms"
import { getErrEmbed, getNotifyEmbed } from "../embeds"
import { getNotPermsErr } from "../privateRooms/getNotPermsErr"
import { config } from "../privateRooms/config"
import { kickUser } from "../privateRooms/privateRoom.utills"
import { memberSendToAudit } from "../utills"

export const kickBtn = new MessageButton()
    .setCustomId('kickBtn')
    .setEmoji('988485882216607786')
    .setStyle('SECONDARY')



export const execute = async (interaction: ButtonInteraction) => {
    const member = interaction.member as GuildMember
    const voice = member.voice.channel as VoiceChannel
    const room = await Room.findOne({id: interaction.channelId}) as IRoom
    
    if(config[member.voice.channelId as string]) {
        await interaction.reply({embeds: [getErrEmbed("Закончите предыдущее действие")]})
        setTimeout( async () => {
            await interaction.deleteReply()
        }, 3000);
        return
    }

    if( checkAdmPerms(interaction.user, room) || checkModPerms(interaction.user, room) ) {
        config[member.voice.channelId as string] = true
        await interaction.reply({embeds:[getAwaitMsgEmbed("Укажите пользователя, которого необходимо замутить")]})      
        
        const filter = (m: Message) => {
            if(m.mentions.users.first()) {
                return true
            }
            return false
        } 

        try {
            const response = await interaction.channel?.awaitMessages({filter: filter, max: 1, time: 15000})
            if (response?.size) {
                const members = response.first()?.mentions.members as Collection<Snowflake, GuildMember>
                const target = members.first() as GuildMember
                if( checkAdmPerms(target.user, room) || !checkAdmPerms(interaction.user, room) && checkModPerms(target.user, room) ) {
                    await getNotPermsErr(interaction)
                    return
                }
                if( voice.members.find((member: GuildMember) => member.id === target.id)){
                    await kickUser(target)
                    await interaction.editReply({embeds:[getNotifyEmbed(`Вы кикнули ${target} из комнаты`)]})
                    config[member.voice.channelId as string] = false
                    await memberSendToAudit(member, `выгнал ${target}`, interaction.channelId)
                    setTimeout(async() => {
                        try {
                            await interaction.deleteReply()
                            await response.first()?.delete()
                        } catch (error) {
                            return
                        }               
                    }, 3000);
                }else {
                    config[member.voice.channelId as string] = false
                    await interaction.editReply({embeds:[getErrEmbed(`Сейчас ${target} не находится в комнате!`)]})
                    setTimeout(async() => {
                        await interaction.deleteReply()                  
                    }, 3000);
                }
                
            }else {
                config[member.voice.channelId as string] = false
                await interaction.editReply({embeds:[getErrEmbed("Вы не успели дать ответ в указанное время. Попробуйте еще раз")]})
                setTimeout(async() => {
                    await interaction.deleteReply() 
                }, 3000);
            }
        } catch (error) {
            config[member.voice.channelId as string] = false
            console.log(error)
            await interaction.editReply({embeds: [getErrEmbed("Произошла ошибка. Попробуйте еще раз")]})
            setTimeout( async () => {
                await interaction.deleteReply()
            }, 5000);
            return
        }
    }else {
        await getNotPermsErr(interaction)
    }
}


export default {
    data: kickBtn,
    execute
} as IButton
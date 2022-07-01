import { MessageButton, ButtonInteraction, GuildMember, VoiceChannel, Message, Collection, Snowflake } from "discord.js"
import { checkAdmPerms, checkModPerms, muteUser, config, getNotPermsErr } from "../privateRooms"
import { Room } from "../database/models/RoomModel"
import { IRoom, IButton } from "../interfaces"
import { getAwaitMsgEmbed, getErrEmbed, getNotifyEmbed } from "../embeds"





export const muteBtn = new MessageButton()
    .setCustomId('muteBtn')
    .setEmoji('988485884116615279')
    .setStyle('SECONDARY')


export const execute = async (interaction: ButtonInteraction) => {

    const member = interaction.member as GuildMember
    const room = await Room.findOne({id: interaction.channelId}) as IRoom

    if(config[interaction.channelId as string]) {
        await interaction.reply({embeds: [getErrEmbed("Закончите предыдущее действие")]})
        setTimeout( async () => {
            await interaction.deleteReply()
        }, 3000);
        return
    }

    if( checkAdmPerms(interaction.user, room) || checkModPerms(interaction.user, room) ) {
        
        config[interaction.channelId as string] = true

        await interaction.reply({embeds:[getAwaitMsgEmbed("Укажите пользователя, которому необходимо выключить микрофон")]})       
    

        try {
            const filter = (m: Message) => {
                if(m.mentions.users.first()) {
                    return true
                }
                return false
            } 

            const response = await interaction.channel?.awaitMessages({filter: filter, max: 1, time: 15000})
            
            if (response?.size) {
                const members = response.first()?.mentions.members as Collection<Snowflake, GuildMember>
                const target = members.first() as GuildMember
                
                if( checkAdmPerms(target.user, room) || !checkAdmPerms(interaction.user, room) && checkModPerms(target.user, room) ) {
                    await getNotPermsErr(interaction)
                    return
                }
                await muteUser(interaction.channel as VoiceChannel, target)
                await interaction.editReply({embeds: [getNotifyEmbed(`Пользователь ${target} получил мут. Он не больше не сможет разговаривать в вашей комнате`)]})           
                config[interaction.channelId as string] = false
                
                setTimeout(async() => {
                    try {
                        await interaction.deleteReply()
                        await response.first()?.delete()
                    } catch (error) {
                        return
                    }
                }, 3000);
                
            } else {
                await interaction.editReply({embeds:[getErrEmbed("Вы не успели дать ответ в указанное время. Попробуйте еще раз")]})
                config[interaction.channelId as string] = false
                setTimeout(async() => {
                    await interaction.deleteReply() 
                }, 3000);
            }
        } catch (error) {
            await interaction.editReply({embeds: [getErrEmbed("Произошла ошибка. Попробуйте еще раз")]})
            setTimeout( async () => {
                await interaction.deleteReply()
            }, 5000);
            config[interaction.channelId as string] = false
            return
        }
    }else {
        await getNotPermsErr(interaction)
    }
}

export default {
    data: muteBtn,
    execute
} as IButton
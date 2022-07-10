import { MessageButton, ButtonInteraction, GuildMember, VoiceChannel, Message, Collection, Snowflake } from "discord.js"
import { checkAdmPerms, checkModPerms, config, getNotPermsErr, unMuteUser } from "../privateRooms/"
import { getErrEmbed, getNotifyEmbed } from "../embeds"
import { Room } from "../database/models/RoomModel"
import { IRoom } from "../interfaces"
import { getAwaitMsgEmbed } from "../embeds"
import { memberSendToAudit } from "../utills"




export const unmuteBtn = new MessageButton()
    .setCustomId('unmuteBtn')
    .setEmoji('988485885647523840')
    .setStyle('SECONDARY')



export const execute = async ( interaction: ButtonInteraction) => {
    const member = interaction.member as GuildMember
    const room = await Room.findOne({id: interaction.channelId}) as IRoom

    // if(config[interaction.channelId as string].btnDelay) {
    //     await interaction.reply({embeds: [getErrEmbed("Закончите предыдущее действие")]})
    //     setTimeout( async () => {
    //         await interaction.deleteReply()
    //     }, 3000);
    //     return
    // }


    if( checkAdmPerms(interaction.user, room) || checkModPerms(interaction.user, room) ) {
        
        // config[interaction.channelId as string].btnDelay = true
        await interaction.reply({embeds:[getAwaitMsgEmbed("размьютить пользователя, ")]})
        
        
        const filter =  (m: Message) => {
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
                await unMuteUser(interaction.channel as VoiceChannel, target)
                interaction.editReply({embeds: [getNotifyEmbed(`Вы размутили ${target}.Теперь он снова сможет говорить в вашей комнате`)]})
                // config[interaction.channelId as string].btnDelay = false
                await memberSendToAudit(member, `размутил ${target}`, interaction.channelId)
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
                // config[interaction.channelId as string].btnDelay = false
                setTimeout(async() => {
                    await interaction.deleteReply() 
                }, 3000);
            }
        } catch (error) {
            console.log(error)
            await interaction.editReply({embeds: [getErrEmbed("Произошла ошибка. Попробуйте еще раз")]})
            // config[interaction.channelId as string].btnDelay = false
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
    data: unmuteBtn,
    execute
}
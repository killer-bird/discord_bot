import { MessageButton, 
    ButtonInteraction, 
    GuildMember, 
    VoiceChannel, 
    Message, Collection, Snowflake } from "discord.js"
import { checkAdmPerms, checkModPerms, unBanUser, getNotPermsErr, config } from "../privateRooms"
import { getErrEmbed, getAwaitMsgEmbed, getNotifyEmbed } from "../embeds"
import { Room } from "../database/models/RoomModel"
import { IRoom, IButton } from "../interfaces"
import { memberSendToAudit } from "../utills"


export const unbanBtn = new MessageButton()
    .setCustomId("unbanBtn")
    .setEmoji('988485880337551401')
    .setStyle('SECONDARY')



export const execute = async (interaction: ButtonInteraction): Promise<void> => {
    
    const member = interaction.member as GuildMember
    // if(config[interaction.channelId as string].btnDelay) {
    //     await interaction.reply({embeds: [getErrEmbed("Закончите предыдущее действие")]})
    //     setTimeout( async () => {
    //         await interaction.deleteReply()
    //     }, 3000);
    //     return
    // }


    const room = await Room.findOne({id: interaction.channelId}) as IRoom
    
    if( checkAdmPerms(interaction.user, room) || checkModPerms(interaction.user, room) ) {
        // config[interaction.channelId as string].btnDelay = true
        await interaction.reply({embeds:[getAwaitMsgEmbed("разбанить пользователя в комнате линканите его ниже")]})
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
                await unBanUser(interaction.channel as VoiceChannel, target)
                await interaction.editReply({embeds: [getNotifyEmbed(`Пользователь ${target} получил доступ в комнату. Теперь он сможет зайти в вашу комнату`)]})
                // config[interaction.channelId as string].btnDelay = false
                await memberSendToAudit(member, `разбанил ${target}`, interaction.channelId)
                setTimeout(async () => {
                    try {
                        await interaction.deleteReply()
                        await response.first()?.delete()
                    } catch (error) {
                        return
                    }
                }, 5000);
            } else {
                // config[interaction.channelId as string].btnDelay = false
                await interaction.editReply({embeds:[getErrEmbed("Вы не успели дать ответ в указанное время. Попробуйте еще раз")]})
                setTimeout(async() => {
                    await interaction.deleteReply() 
                }, 3000);
            }
        } catch (error) {
            // config[interaction.channelId as string].btnDelay = false
            await getNotPermsErr(interaction)
            return
        }
        
    } else {
        await getNotPermsErr(interaction)
    }
}

export default {
    data: unbanBtn,
    execute
} as IButton
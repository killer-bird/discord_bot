import {MessageButton, 
        ButtonInteraction, 
        GuildMember, 
        Message, 
        User, 
        MessageEmbed,
        VoiceChannel,
        Snowflake, 
        Collection } from "discord.js"
import { Room } from "../database/models/RoomModel"
import { IRoom, IButton } from "../interfaces"
import { getAwaitMsgEmbed } from "../embeds"
import { checkAdmPerms, checkModPerms } from "../privateRooms/checkPerms"
import { getNotPermsErr } from "../privateRooms/getNotPermsErr"
import { getErrEmbed, getNotifyEmbed } from "../embeds"
import { config } from "../privateRooms/config"
import { memberSendToAudit } from "../utills"

const deleteModer = async (room: VoiceChannel, target: GuildMember) => {
    try {
        await Room.updateOne({id: room.id}, {$pull: {moderators: target.user.id}})
    } catch (error) {
        console.log(error)
        return
    } 
}


export const deleteModerBtn = new MessageButton()
    .setCustomId('deleteModerBtn')
    .setEmoji('988485889539862598')
    .setStyle('SECONDARY')


export const execute = async (interaction: ButtonInteraction): Promise<void>=> {
    const member = interaction.member as GuildMember
    const room = await Room.findOne({id: interaction.channelId}) as IRoom

    // if(config[interaction.channelId as string].btnDelay) {
    //     await interaction.reply({embeds: [getErrEmbed("Закончите предыдущее действие")]})
    //     setTimeout( async () => {
    //         await interaction.deleteReply()
    //     }, 3000);
    //     return
    // }

    if(checkAdmPerms(interaction.user, room)){
        // config[interaction.channelId as string].btnDelay = true
        await interaction.reply({embeds:[getAwaitMsgEmbed("уволить модератора комнаты укажите его ниже")]})
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
                
                if( !checkModPerms(target.user, room) ) {
                    // config[interaction.channelId as string].btnDelay = false
                    await  interaction.editReply({embeds: [getErrEmbed(`${target} не является модератором!`)]})
                    setTimeout( async () => {
                        await interaction.deleteReply()
                    }, 3000);
                    return
                }
                await deleteModer(interaction.channel as VoiceChannel, target)
                await interaction.editReply({embeds: [getNotifyEmbed(`Пользователь ${target} уволен. Он не больше не сможет модерировать вашу комнату`)]})           
                // config[interaction.channelId as string].btnDelay = false
                await memberSendToAudit(member, `снял с модерки ${target}`, interaction.channelId)
                setTimeout(async() => {
                    try {
                        await interaction.deleteReply()
                        await response.first()?.delete()
                    } catch (error) {
                        return
                    }
                }, 3000);
            } else {
                // config[interaction.channelId as string].btnDelay = false
                await interaction.editReply({embeds:[getErrEmbed("Вы не успели дать ответ в указанное время. Попробуйте еще раз")]})
                setTimeout(async() => {
                    await interaction.deleteReply() 
                }, 3000);
            }

        } catch (error) {
            // config[interaction.channelId as string].btnDelay = false
            await interaction.editReply({embeds:[getErrEmbed("Произошла ошибка. Попробуйте еще раз.")]})
            setTimeout( async () => {
                await interaction.deleteReply()
            }, 3000);
            return
        }

    }else {
        await getNotPermsErr(interaction)
    }


}

export default {
    data: deleteModerBtn,
    execute
} as IButton

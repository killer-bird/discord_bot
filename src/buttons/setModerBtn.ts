import {MessageButton, 
        ButtonInteraction, 
        GuildMember, 
        VoiceChannel, 
        User,
        Message,
        Collection,
        Snowflake,
        MessageEmbed } from "discord.js"
import { Room } from "../database/models/RoomModel"
import { IRoom, IButton } from "../interfaces"
import { getErrEmbed, getNotifyEmbed } from "../embeds"
import { checkAdmPerms, checkModPerms } from "../privateRooms/checkPerms"
import { getAwaitMsgEmbed } from "../embeds"
import { config } from "../privateRooms/config"
import { getNotPermsErr } from "../privateRooms/getNotPermsErr"


const setModer = async (room: VoiceChannel, target: GuildMember) :Promise<void> => {
    await Room.updateOne({id: room.id}, {$push: {moderators: target.user.id}})   
}

export const setModerBtn = new MessageButton()
    .setCustomId('setModerBtn')
    .setEmoji('988485887165878283')
    .setStyle('SECONDARY')



export const execute = async ( interaction: ButtonInteraction) => {
    const member = interaction.member as GuildMember
    const room = await Room.findOne({id: interaction.channelId}) as IRoom
    
    if(config[interaction.channelId as string]) {
        await interaction.reply({embeds: [getErrEmbed("Закончите предыдущее действие")]})
        setTimeout( async () => {
            await interaction.deleteReply()
        }, 3000);
        return
    }
    if( checkAdmPerms(interaction.user, room)){
        config[interaction.channelId as string] = true
        await interaction.reply({embeds:[getAwaitMsgEmbed("назначить пользователя модератором в комнате линканите его ниже")]})
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
            if(checkModPerms(target.user, room)) {
                await interaction.editReply({embeds: [getErrEmbed(`Пользователь ${target} уже модератор!`)]})           
                setTimeout(async() => {
                    await interaction.deleteReply()
                    config[interaction.channelId as string] = false
                }, 3000);
                return
            }
            
            await setModer(interaction.channel as VoiceChannel, target)
            await interaction.editReply({embeds: [getNotifyEmbed(`Вы назначили ${target} модератором комнаты.`)]})           
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
            setTimeout(async() => {
                await interaction.deleteReply() 
                config[interaction.channelId as string] = false
            }, 3000);
            config[interaction.channelId as string] = false
        }

    } else {
        await getNotPermsErr(interaction)
        config[member.voice.channelId as string] = false
    }

}


export default {
    data: setModerBtn,
    execute
} as IButton
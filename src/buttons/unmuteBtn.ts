import { MessageButton, ButtonInteraction, GuildMember, VoiceChannel, Message, Collection, Snowflake } from "discord.js"
import { checkAdmPerms, checkModPerms } from "../privateRooms/checkPerms"
import { getErrEmbed, getNotifyEmbed } from "../embeds"
import { Room } from "../database/models/RoomModel"
import { IRoom, IButton } from "../interfaces"
import { getAwaitMsgEmbed } from "../embeds"
import { getNotPermsErr } from "../privateRooms/getNotPermsErr"
import { config } from "../privateRooms/config"



const unMuteUser = async (room: VoiceChannel, target: GuildMember) :Promise<void> => {
    const afk = await target.guild.channels.fetch(process.env.AFK as string)
    const roomModel = Room.findOne({id: room.id})
    if (room.members.has(target.user.id)) {
        await target.voice.setChannel(afk as VoiceChannel)
        await room.permissionOverwrites.create(target.user, {"SPEAK": true})
        await target.voice.setChannel(room)
        await Room.updateOne({id: room.id}, {$pull: {mutes: target.user.id}})
        return  
    } 
    await room.permissionOverwrites.create(target.user, {"SPEAK": true}) 
    await Room.updateOne({id: room.id}, {$pull: {mutes: target.user.id}})
    
}

export const unmuteBtn = new MessageButton()
    .setCustomId('unmuteBtn')
    .setEmoji('988485885647523840')
    .setStyle('SECONDARY')



export const execute = async ( interaction: ButtonInteraction) => {
    const member = interaction.member as GuildMember
    const room = await Room.findOne({id: member.voice.channelId}) as IRoom

    if(config[member.voice.channelId as string]) {
        await interaction.reply({embeds: [getErrEmbed("Закончите предыдущее действие")]})
        setTimeout( async () => {
            await interaction.deleteReply()
        }, 3000);
        return
    }


    if( checkAdmPerms(interaction.user, room) || checkModPerms(interaction.user, room) ) {
        
        config[member.voice.channelId as string] = true
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
                await unMuteUser(member.voice.channel as VoiceChannel, target)
                interaction.editReply({embeds: [getNotifyEmbed(`Вы размьютили ${target}.Теперь он снова сможет говорить в вашей комнате`)]})
                setTimeout(async() => {
                    await interaction.deleteReply()
                    await response.first()?.delete()
                    config[member.voice.channelId as string] = false
                }, 3000); 
            } else {
                await interaction.editReply({embeds:[getErrEmbed("Вы не успели дать ответ в указанное время. Попробуйте еще раз")]})
                setTimeout(async() => {
                    await interaction.deleteReply() 
                    config[member.voice.channelId as string] = false
                }, 3000);
            }
        } catch (error) {
            console.log(error)
            await interaction.editReply({embeds: [getErrEmbed("Произошла ошибка. Попробуйте еще раз")]})
            setTimeout( async () => {
                await interaction.deleteReply()
                config[member.voice.channelId as string] = false
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